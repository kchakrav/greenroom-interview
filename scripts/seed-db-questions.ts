import { seedQuestionStore } from "../lib/questionStore";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

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

async function main() {
  await loadEnvLocal();
  process.env.ENABLE_DATABASE_QUESTIONS = process.env.ENABLE_DATABASE_QUESTIONS || "true";
  process.env.DATABASE_SSL_DISABLED = process.env.DATABASE_SSL_DISABLED || "false";

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed questions.");
  }

  const result = await seedQuestionStore();
  if (!result.databaseEnabled) throw new Error("Database question mode is not enabled.");
  console.log(`Seeded ${result.inserted} question/concept rows.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
