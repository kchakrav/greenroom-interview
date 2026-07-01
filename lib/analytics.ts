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

export interface AnalyticsSnapshot {
  users: UserRecord[];
  recentLogins: LoginEvent[];
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  kvConfigured: boolean;
  kvError?: string;
}

const USER_KEY = (id: string) => `aii:user:${id}`;
const ALL_USERS_KEY = "aii:all-users";
const RECENT_LOGINS_KEY = "aii:recent-logins";
const MAX_RECENT = 100;

function firstEnv(...names: string[]) {
  return names.map((name) => process.env[name]).find(Boolean);
}

function kvConfig(mode: "read" | "write"): { url?: string; token?: string } {
  const url =
    firstEnv("KV_REST_API_URL", "db_KV_REST_API_URL", "UPSTASH_REDIS_REST_URL", "db_UPSTASH_REDIS_REST_URL");
  const writeToken =
    firstEnv("KV_REST_API_TOKEN", "db_KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN", "db_UPSTASH_REDIS_REST_TOKEN");
  const readToken =
    firstEnv(
      "KV_REST_API_READ_ONLY_TOKEN",
      "db_KV_REST_API_READ_ONLY_TOKEN",
      "UPSTASH_REDIS_REST_READ_ONLY_TOKEN",
      "db_UPSTASH_REDIS_REST_READ_ONLY_TOKEN"
    );
  return { url, token: mode === "write" ? writeToken : writeToken || readToken };
}

async function getKV(mode: "read" | "write") {
  const config = kvConfig(mode);
  if (!config.url || !config.token) return null;

  const { createClient } = await import("@vercel/kv");
  return createClient({ url: config.url, token: config.token });
}

export async function recordLogin(user: { id: string; name?: string | null; email?: string | null; image?: string | null }): Promise<void> {
  try {
    const kv = await getKV("write");
    if (!kv) return;
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

export async function getAnalytics(): Promise<AnalyticsSnapshot> {
  const kv = await getKV("read");
  if (!kv) {
    return { users: [], recentLogins: [], totalUsers: 0, activeToday: 0, activeThisWeek: 0, kvConfigured: false };
  }
  try {
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

    return { users, recentLogins, totalUsers: users.length, activeToday, activeThisWeek, kvConfigured: true };
  } catch {
    return { users: [], recentLogins: [], totalUsers: 0, activeToday: 0, activeThisWeek: 0, kvConfigured: true, kvError: "Unable to read analytics from KV." };
  }
}
