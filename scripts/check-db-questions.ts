import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

async function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const raw = await readFile(resolve(".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((entry) => entry.trim().startsWith("DATABASE_URL="));
  if (!line) throw new Error("DATABASE_URL is not set.");
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const pool = new pg.Pool({
    connectionString: await loadDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });
  try {
    const result = await pool.query<{ kind: string; count: number }>(
      "select kind, count(*)::int as count from question_items group by kind order by kind"
    );
    console.log(JSON.stringify(result.rows));
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
