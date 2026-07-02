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

export type FavoriteKind = "question" | "concept" | "reference";

export interface FavoriteSnapshot {
  title?: string;
  detail?: string;
  disciplineId?: string;
  topic?: string;
  source?: string;
  url?: string;
}

export interface FavoriteRecord {
  userId: string;
  kind: FavoriteKind;
  questionId: string;
  createdAt: number;
  note?: string;
  snapshot?: FavoriteSnapshot;
}

export interface FavoriteAggregate {
  kind: FavoriteKind;
  questionId: string;
  count: number;
  snapshot?: FavoriteSnapshot;
  userIds?: string[];
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
const USER_FAVORITES_KEY = (userId: string) => `aii:favorites:${userId}`;
const FAVORITE_RECORD_KEY = (userId: string, favoriteId: string) => `aii:favorite:${userId}:${favoriteId}`;
const FAVORITE_COUNTS_KEY = "aii:favorite-counts";
const FAVORITE_META_KEY = "aii:favorite-meta";
const FAVORITE_USERS_KEY = (favoriteId: string) => `aii:favorite-users:${favoriteId}`;
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

const favoriteId = (kind: FavoriteKind, questionId: string) => `${kind}:${questionId}`;

function parseFavoriteId(id: string): { kind: FavoriteKind; questionId: string } | null {
  const [kind, ...rest] = id.split(":");
  const questionId = rest.join(":");
  if ((kind !== "question" && kind !== "concept" && kind !== "reference") || !questionId) return null;
  return { kind, questionId };
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

export async function listFavorites(userId: string): Promise<{ favorites: FavoriteRecord[]; kvConfigured: boolean; error?: string }> {
  const kv = await getKV("read");
  if (!kv) return { favorites: [], kvConfigured: false };
  try {
    const ids = await kv.smembers<string[]>(USER_FAVORITES_KEY(userId));
    if (ids.length === 0) return { favorites: [], kvConfigured: true };
    const records = await Promise.all(ids.map((id) => kv.get<FavoriteRecord>(FAVORITE_RECORD_KEY(userId, id))));
    return {
      favorites: records.filter((record): record is FavoriteRecord => Boolean(record)).sort((a, b) => b.createdAt - a.createdAt),
      kvConfigured: true,
    };
  } catch {
    return { favorites: [], kvConfigured: true, error: "Unable to read favorites from storage." };
  }
}

export async function addFavorite(userId: string, input: { kind: FavoriteKind; questionId: string; note?: string; snapshot?: FavoriteSnapshot }): Promise<{ favorite?: FavoriteRecord; kvConfigured: boolean; error?: string }> {
  const kv = await getKV("write");
  if (!kv) return { kvConfigured: false };
  try {
    const id = favoriteId(input.kind, input.questionId);
    const record: FavoriteRecord = { userId, kind: input.kind, questionId: input.questionId, note: input.note, snapshot: input.snapshot, createdAt: Date.now() };
    const wasAdded = await kv.sadd(USER_FAVORITES_KEY(userId), id);
    await kv.sadd(FAVORITE_USERS_KEY(id), userId);
    await kv.set(FAVORITE_RECORD_KEY(userId, id), record);
    if (input.snapshot) await kv.hset(FAVORITE_META_KEY, { [id]: JSON.stringify(input.snapshot) });
    if (wasAdded) {
      await kv.hincrby(FAVORITE_COUNTS_KEY, id, 1);
    }
    return { favorite: record, kvConfigured: true };
  } catch {
    return { kvConfigured: true, error: "Unable to save favorite." };
  }
}

export async function removeFavorite(userId: string, input: { kind: FavoriteKind; questionId: string }): Promise<{ removed: boolean; kvConfigured: boolean; error?: string }> {
  const kv = await getKV("write");
  if (!kv) return { removed: false, kvConfigured: false };
  try {
    const id = favoriteId(input.kind, input.questionId);
    const removed = await kv.srem(USER_FAVORITES_KEY(userId), id);
    await kv.srem(FAVORITE_USERS_KEY(id), userId);
    await kv.del(FAVORITE_RECORD_KEY(userId, id));
    if (removed) {
      const next = await kv.hincrby(FAVORITE_COUNTS_KEY, id, -1);
      if (next <= 0) {
        await kv.hdel(FAVORITE_COUNTS_KEY, id);
        await kv.hdel(FAVORITE_META_KEY, id);
      }
    }
    return { removed: Boolean(removed), kvConfigured: true };
  } catch {
    return { removed: false, kvConfigured: true, error: "Unable to remove favorite." };
  }
}

export async function getFavoriteAggregates(): Promise<{ favorites: FavoriteAggregate[]; kvConfigured: boolean; error?: string }> {
  const kv = await getKV("read");
  if (!kv) return { favorites: [], kvConfigured: false };
  try {
    const raw = await kv.hgetall<Record<string, number | string>>(FAVORITE_COUNTS_KEY);
    const rawMeta = await kv.hgetall<Record<string, string | FavoriteSnapshot>>(FAVORITE_META_KEY);
    const favorites: FavoriteAggregate[] = [];
    for (const [id, count] of Object.entries(raw ?? {})) {
      const parsed = parseFavoriteId(id);
      const numericCount = Number(count) || 0;
      if (!parsed || numericCount <= 0) continue;
      const meta = rawMeta?.[id];
      let snapshot: FavoriteSnapshot | undefined;
      try {
        snapshot = typeof meta === "string" ? JSON.parse(meta) as FavoriteSnapshot : meta;
      } catch {
        snapshot = undefined;
      }
      favorites.push({ ...parsed, count: numericCount, snapshot });
    }
    favorites.sort((a, b) => b.count - a.count);
    const withUsers = await Promise.all(favorites.map(async (favorite) => ({
      ...favorite,
      userIds: await kv.smembers<string[]>(FAVORITE_USERS_KEY(favoriteId(favorite.kind, favorite.questionId))),
    })));
    return { favorites: withUsers, kvConfigured: true };
  } catch {
    return { favorites: [], kvConfigured: true, error: "Unable to read favorite aggregates from storage." };
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
