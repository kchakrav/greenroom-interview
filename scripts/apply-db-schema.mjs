import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

const { Pool } = pg;

async function loadEnvLocal() {
  try {
    const raw = await readFile(resolve(".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local is optional for CI where env vars are injected.
  }
}

await loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required to apply db/schema.sql");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL_DISABLED === "true" ? false : { rejectUnauthorized: false },
});

try {
  const sql = await readFile(resolve("db/schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Applied db/schema.sql");
} finally {
  await pool.end();
}
