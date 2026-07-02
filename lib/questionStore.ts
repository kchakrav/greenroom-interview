import { QUESTION_BANK, queryBank, bankFacets, type BankFilter, type BankQuestion } from "@/lib/questionBank";
import { queryMCQ, mcqFacets, type MCQ, type MCQFilter } from "@/lib/quiz";

export type QuestionStoreKind = "question" | "concept";

export interface QuestionStoreFilters {
  kind: QuestionStoreKind;
  q?: string;
  disciplineId?: string;
  level?: string;
  competency?: string;
  type?: string;
  topic?: string;
  source?: string;
  page?: number;
  pageSize?: number;
}

export interface QuestionStoreResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  source: "database" | "static";
  databaseEnabled: boolean;
  databaseFallback?: string;
}

type DbQuestionRow = {
  id: string;
  kind: QuestionStoreKind;
  discipline_id: string;
  topic: string;
  levels: string[] | null;
  question_type: string | null;
  difficulty: number | null;
  source: string;
  prompt: string;
  guidance: string;
  options: string[] | null;
  correct_index: number | null;
};

type GlobalWithQuestionPool = typeof globalThis & {
  __aiInterviewQuestionPool?: import("pg").Pool;
};

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

export function databaseQuestionsEnabled() {
  return TRUE_VALUES.has((process.env.ENABLE_DATABASE_QUESTIONS ?? "").toLowerCase()) && Boolean(process.env.DATABASE_URL);
}

function shouldRequireDatabase() {
  return TRUE_VALUES.has((process.env.REQUIRE_DATABASE_QUESTIONS ?? "").toLowerCase());
}

async function getPool() {
  if (!databaseQuestionsEnabled()) return null;
  const globalPool = globalThis as GlobalWithQuestionPool;
  if (!globalPool.__aiInterviewQuestionPool) {
    const { Pool } = await import("pg");
    globalPool.__aiInterviewQuestionPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL_DISABLED === "true" ? false : { rejectUnauthorized: false },
      max: 3,
    });
  }
  return globalPool.__aiInterviewQuestionPool;
}

function pageParams(page?: number, pageSize?: number) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(200, Math.max(1, Number(pageSize) || 25));
  return { page: safePage, pageSize: safePageSize, offset: (safePage - 1) * safePageSize };
}

export async function queryQuestionStore(filters: QuestionStoreFilters): Promise<QuestionStoreResult<BankQuestion | MCQ>> {
  const { page, pageSize, offset } = pageParams(filters.page, filters.pageSize);
  if (databaseQuestionsEnabled()) {
    try {
      const db = await queryDatabase(filters, page, pageSize, offset);
      return db;
    } catch (error: any) {
      if (shouldRequireDatabase()) throw error;
      const fallback = queryStatic(filters, page, pageSize);
      return { ...fallback, databaseEnabled: true, databaseFallback: error?.message ?? "Database query failed." };
    }
  }
  return queryStatic(filters, page, pageSize);
}

export async function seedQuestionStore() {
  const pool = await getPool();
  if (!pool) return { inserted: 0, updated: 0, databaseEnabled: false };

  const items = [
    ...QUESTION_BANK.map((q) => ({
      id: q.id,
      kind: "question" as const,
      disciplineId: q.disciplineId,
      topic: q.competency,
      levels: q.levels,
      questionType: q.type,
      difficulty: q.difficulty,
      source: q.source,
      prompt: q.prompt,
      guidance: q.guidance,
      options: null as string[] | null,
      correctIndex: null as number | null,
    })),
    ...queryMCQ().map((m) => ({
      id: m.id,
      kind: "concept" as const,
      disciplineId: m.disciplineId,
      topic: m.topic,
      levels: null as string[] | null,
      questionType: "mcq",
      difficulty: null as number | null,
      source: m.source,
      prompt: m.question,
      guidance: m.explanation,
      options: m.options,
      correctIndex: m.correctIndex,
    })),
  ];

  let insertedOrUpdated = 0;
  const client = await pool.connect();
  try {
    await client.query("begin");
    const batchSize = 100;
    for (let start = 0; start < items.length; start += batchSize) {
      const batch = items.slice(start, start + batchSize);
      const values: any[] = [];
      const tuples = batch.map((item, idx) => {
        const base = idx * 12;
        values.push(
          item.id,
          item.kind,
          item.disciplineId,
          item.topic,
          JSON.stringify(item.levels),
          item.questionType,
          item.difficulty,
          item.source,
          item.prompt,
          item.guidance,
          JSON.stringify(item.options),
          item.correctIndex
        );
        return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5}::jsonb,$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10},$${base + 11}::jsonb,$${base + 12},now())`;
      }).join(",");

      await client.query(
        `insert into question_items
          (id, kind, discipline_id, topic, levels, question_type, difficulty, source, prompt, guidance, options, correct_index, updated_at)
         values ${tuples}
         on conflict (kind, id) do update set
          discipline_id = excluded.discipline_id,
          topic = excluded.topic,
          levels = excluded.levels,
          question_type = excluded.question_type,
          difficulty = excluded.difficulty,
          source = excluded.source,
          prompt = excluded.prompt,
          guidance = excluded.guidance,
          options = excluded.options,
          correct_index = excluded.correct_index,
          updated_at = now()`,
        values
      );
      insertedOrUpdated += batch.length;
    }
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
  return { inserted: insertedOrUpdated, updated: insertedOrUpdated, databaseEnabled: true };
}

async function queryDatabase(filters: QuestionStoreFilters, page: number, pageSize: number, offset: number): Promise<QuestionStoreResult<BankQuestion | MCQ>> {
  const pool = await getPool();
  if (!pool) throw new Error("Database questions are not configured.");

  const values: any[] = [filters.kind];
  const where = ["kind = $1", "status = 'active'"];
  const add = (clause: string, value: any) => {
    values.push(value);
    where.push(clause.replace("?", `$${values.length}`));
  };

  if (filters.disciplineId && filters.disciplineId !== "all") add("discipline_id = ?", filters.disciplineId);
  if (filters.source && filters.source !== "all") add("source = ?", filters.source);
  if (filters.kind === "question") {
    if (filters.competency && filters.competency !== "all") add("topic = ?", filters.competency);
    if (filters.type && filters.type !== "all") add("question_type = ?", filters.type);
    if (filters.level && filters.level !== "all") add("levels ? ?", filters.level);
  } else if (filters.topic && filters.topic !== "all") {
    add("topic = ?", filters.topic);
  }
  if (filters.q?.trim()) {
    add("(prompt ilike ? or guidance ilike ? or topic ilike ? or source ilike ?)", `%${filters.q.trim()}%`);
    const last = values.length;
    values.push(values[last - 1], values[last - 1], values[last - 1]);
    where[where.length - 1] = `(prompt ilike $${last} or guidance ilike $${last + 1} or topic ilike $${last + 2} or source ilike $${last + 3})`;
  }

  const whereSql = where.join(" and ");
  const totalResult = await pool.query<{ count: string }>(`select count(*)::text as count from question_items where ${whereSql}`, values);
  const rowsResult = await pool.query<DbQuestionRow>(
    `select id, kind, discipline_id, topic, levels, question_type, difficulty, source, prompt, guidance, options, correct_index
     from question_items
     where ${whereSql}
     order by topic asc, id asc
     limit $${values.length + 1} offset $${values.length + 2}`,
    [...values, pageSize, offset]
  );

  return {
    items: rowsResult.rows.map(rowToQuestion),
    total: Number(totalResult.rows[0]?.count ?? 0),
    page,
    pageSize,
    source: "database",
    databaseEnabled: true,
  };
}

function rowToQuestion(row: DbQuestionRow): BankQuestion | MCQ {
  if (row.kind === "question") {
    return {
      id: row.id,
      disciplineId: row.discipline_id,
      competency: row.topic,
      levels: row.levels ?? [],
      type: (row.question_type ?? "behavioral") as BankQuestion["type"],
      prompt: row.prompt,
      guidance: row.guidance,
      source: row.source,
      difficulty: (row.difficulty ?? 3) as BankQuestion["difficulty"],
    };
  }
  return {
    id: row.id,
    disciplineId: row.discipline_id,
    topic: row.topic,
    question: row.prompt,
    options: row.options ?? [],
    correctIndex: row.correct_index ?? 0,
    explanation: row.guidance,
    source: row.source,
  };
}

function queryStatic(filters: QuestionStoreFilters, page: number, pageSize: number): QuestionStoreResult<BankQuestion | MCQ> {
  const items = filters.kind === "question"
    ? queryBank({
      q: filters.q,
      disciplineId: filters.disciplineId,
      level: filters.level,
      competency: filters.competency,
      type: filters.type as BankFilter["type"],
      source: filters.source,
    })
    : queryMCQ({
      q: filters.q,
      disciplineId: filters.disciplineId,
      topic: filters.topic,
      source: filters.source,
    } as MCQFilter);
  const { offset } = pageParams(page, pageSize);
  return {
    items: items.slice(offset, offset + pageSize),
    total: items.length,
    page,
    pageSize,
    source: "static",
    databaseEnabled: databaseQuestionsEnabled(),
  };
}

export function staticQuestionFacets(kind: QuestionStoreKind) {
  return kind === "question" ? bankFacets() : mcqFacets();
}
