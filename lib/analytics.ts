// Server-side analytics using Vercel KV (Redis).
// Falls back gracefully when KV env vars are not configured (local dev without KV).

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  image?: string;
  firstLoginAt: number;
  lastLoginAt: number;
  loginCount: number;
}

export interface LoginEvent {
  userId: string;
  name: string;
  email: string;
  at: number;
}

const USER_KEY = (id: string) => `aii:user:${id}`;
const ALL_USERS_KEY = "aii:all-users";
const RECENT_LOGINS_KEY = "aii:recent-logins";
const MAX_RECENT = 100;

function hasKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKV() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function recordLogin(user: { id: string; name?: string | null; email?: string | null; image?: string | null }): Promise<void> {
  if (!hasKV()) return;
  try {
    const kv = await getKV();
    const now = Date.now();
    const existing = await kv.get<UserRecord>(USER_KEY(user.id));
    const record: UserRecord = {
      id: user.id,
      name: user.name ?? "Unknown",
      email: user.email ?? "",
      image: user.image ?? undefined,
      firstLoginAt: existing?.firstLoginAt ?? now,
      lastLoginAt: now,
      loginCount: (existing?.loginCount ?? 0) + 1,
    };
    await kv.set(USER_KEY(user.id), record);
    await kv.sadd(ALL_USERS_KEY, user.id);

    const event: LoginEvent = { userId: user.id, name: record.name, email: record.email, at: now };
    await kv.lpush(RECENT_LOGINS_KEY, JSON.stringify(event));
    await kv.ltrim(RECENT_LOGINS_KEY, 0, MAX_RECENT - 1);
  } catch {
    // KV errors must never break the auth flow
  }
}

export async function getAnalytics(): Promise<{
  users: UserRecord[];
  recentLogins: LoginEvent[];
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
}> {
  if (!hasKV()) {
    return { users: [], recentLogins: [], totalUsers: 0, activeToday: 0, activeThisWeek: 0 };
  }
  try {
    const kv = await getKV();
    const userIds = await kv.smembers<string[]>(ALL_USERS_KEY);
    const users: UserRecord[] = [];
    if (userIds.length > 0) {
      const records = await Promise.all(userIds.map((id) => kv.get<UserRecord>(USER_KEY(id))));
      for (const r of records) if (r) users.push(r);
    }
    users.sort((a, b) => b.lastLoginAt - a.lastLoginAt);

    const rawLogins = await kv.lrange<string>(RECENT_LOGINS_KEY, 0, MAX_RECENT - 1);
    const recentLogins: LoginEvent[] = rawLogins.map((r) => (typeof r === "string" ? JSON.parse(r) : r));

    const now = Date.now();
    const DAY = 86_400_000;
    const WEEK = 7 * DAY;
    const activeToday = users.filter((u) => now - u.lastLoginAt < DAY).length;
    const activeThisWeek = users.filter((u) => now - u.lastLoginAt < WEEK).length;

    return { users, recentLogins, totalUsers: users.length, activeToday, activeThisWeek };
  } catch {
    return { users: [], recentLogins: [], totalUsers: 0, activeToday: 0, activeThisWeek: 0 };
  }
}
