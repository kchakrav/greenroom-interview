# Optional Database-Backed Questions

The app defaults to the static TypeScript question banks. No database is required unless you explicitly enable it.

## Off by default

Leave these unset or false:

```env
ENABLE_DATABASE_QUESTIONS=false
DATABASE_URL=
```

In this mode, question reads continue to use `lib/questionBank.ts` and `lib/quiz.ts`.

## Enable Postgres mode

1. Create a Postgres database with Neon, Supabase, Vercel Postgres, or another provider.
2. Set:

```env
ENABLE_DATABASE_QUESTIONS=true
DATABASE_URL=postgres://...
```

3. Apply the schema:

```bash
npm run db:schema
```

4. Sign in as Admin and call:

```bash
POST /api/admin/questions/seed
```

That imports the current static interview questions and concept MCQs into `question_items`.

## Fallback Behavior

If database mode is enabled but a query fails, the app falls back to static banks by default.

Set this only if you want database failures to fail hard:

```env
REQUIRE_DATABASE_QUESTIONS=true
```

## Runtime API

`GET /api/questions` supports:

- `kind=question|concept`
- `q`
- `disciplineId`
- `level`
- `competency`
- `type`
- `topic`
- `source`
- `page`
- `pageSize`

The response includes `source: "database" | "static"` and `databaseFallback` when DB mode was enabled but static fallback was used.
