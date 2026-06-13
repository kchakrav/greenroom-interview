# AIInterview

A world-class, dual-persona **AI interview platform** — practice & get mentored, or run real AI screens — across **voice, video, text, and coding**, configured by **discipline × role × seniority × interviewer tone**, with **BARS-based scoring**, **cinematic mentoring feedback**, and a fully immersive dark/glass UI.

Built with Next.js + TypeScript + Tailwind + Framer Motion, powered by the **Claude API** (`claude-opus-4-8`).

> Product docs live in [`docs/`](docs/): **PRD.md**, **DESIGN_SYSTEM.md**, **RESEARCH.md** (cited competitive/scientific research).

## Quick start

```bash
# 1. Install deps
npm install

# 2. Add your Anthropic API key
cp .env.local.example .env.local
#   then edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...
#   (get a key at https://console.anthropic.com/settings/keys)

# 3. Run
npm run dev
# open http://localhost:3000
```

**Voice** uses your browser's built-in speech (Web Speech API) — works best in Chrome/Edge, no extra keys. Text mode works everywhere. If you don't add an API key, the app loads but interviews will return an error prompting you to set the key.

## How it works

- **`/`** — "Set the Stage": pick mode, discipline, role, seniority, focus areas, interviewer tone (which retints the whole UI), modalities, and duration.
- **`/interview`** — the immersive Interview Room: a reactive AI avatar, live captions, and a real adaptive conversation. The interviewer (Claude) asks one question at a time, prioritizes past-behavior questions, and probes with follow-ups.
- **`/feedback/[id]`** — cinematic report: overall + per-competency BARS scores with transcript evidence, delivery analytics, a personalized improvement plan, an animated skill radar, and a fairness/transparency note. Completing interviews earns XP, levels, and streaks.

## Architecture

```
app/                    immersive UI (onboarding · interview room · feedback)
  api/interview/start   builds StageConfig → opening question (Claude)
  api/interview/turn    streams the adaptive interviewer reply (Claude, SSE-style)
  api/interview/score   BARS rubric scoring via structured output (Claude)
  api/session/[id]      fetch a stored session + report
lib/
  engine.ts             Claude client, tone personas, structured-interview prompts, scoring schema
  taxonomy.ts           discipline/role/seniority + leveled competency sets
  store.ts              JSON-file session persistence (swap for SQLite/Prisma in prod)
  useSpeech.ts          Web Speech API STT/TTS hook
  useStage.ts           StageConfig state (Zustand)
components/             AvatarOrb, SkillRadar, gamification
```

## Deploy to Vercel

The app is **stateless** (server holds no session state — the browser keeps the transcript and stores completed reports in `localStorage`), so it deploys to Vercel with no database.

```bash
npm i -g vercel        # one-time
vercel login           # authenticate (opens browser)
vercel                 # preview deploy
vercel --prod          # production deploy
```

Or connect the Git repo at https://vercel.com/new (Next.js is auto-detected — no config needed).

**To enable the real Claude engine in production**, add an env var in the Vercel dashboard (Project → Settings → Environment Variables):

- `ANTHROPIC_API_KEY = sk-ant-...`  (and optionally `AIINTERVIEW_MODEL`)

Without it, the deployed site runs in the same fully-working **prototype mode** as local.

## Notes

- Model is configurable via `AIINTERVIEW_MODEL` (defaults to `claude-opus-4-8`; scoring uses adaptive thinking + structured output).
- Sessions/reports live in the browser (`localStorage`) — no server persistence, which is what makes it serverless-friendly. A production build would add accounts + a database (see `docs/PRD.md` §10).
- Compliance-first by design: no protected-attribute inference, evidence-linked scores, transparency note (see `docs/PRD.md` §9).
