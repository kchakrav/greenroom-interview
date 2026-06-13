# PRD — AIInterview: A World-Class AI Interview Platform

**Status:** Draft v1.0 · **Date:** 2026-06-13 · **Owner:** chkchkr@gmail.com
**Grounded in:** `docs/RESEARCH.md` (deep-research synthesis, 25 adversarially-verified claims) and `docs/DESIGN_SYSTEM.md`.

---

## 0. TL;DR

AIInterview is a **dual-persona, multimodal AI interview platform**. Candidates use it to **practice and get mentored**; employers use it to **screen candidates at scale** — on the same engine. The AI conducts adaptive, conversational interviews over **voice, video, text, and live coding**, configured by **discipline × role × seniority × interviewer tone**, and grounded in the **science of structured interviewing** (BARS rubrics, past-behavior questioning). The product is **compliance-first** (NYC LL144, EEOC, EU AI Act, GDPR, ADA) and wrapped in a **fully immersive dark/glassmorphism UI**.

**North-star metric:** *Interviews completed that produce an actionable, rubric-scored outcome* (candidate improvement report OR employer scorecard).

---

## 1. Problem & Opportunity

### 1.1 Problems
- **Candidates** lack realistic, affordable, on-demand practice with high-quality feedback. Human mock interviews are scarce, expensive, and inconsistent. Generic prep doesn't adapt to role/level.
- **Employers** spend enormous recruiter time on early-stage screens that are inconsistent, unstructured, biased, and hard to scale. Unstructured interviews are demonstrably less valid and more biased than structured ones.
- **The market is fragmented:** candidate-prep tools (interviewing.io, Yoodli, Final Round AI, HackerRank mocks, Pramp) and employer screeners (Apriora/Alex, HeyMilo, Ribbon, HireVue) are separate products. No one credibly unifies "practice" and "real screening" on one engine — yet they share 80% of the underlying capability.

### 1.2 Opportunity
A single platform where the **same adaptive interview engine** powers practice and hiring creates a flywheel: candidates who practice become a warm, pre-assessed talent pool; employers who screen generate realistic question banks and rubric calibration data. Differentiation comes from **scientific rigor + immersive experience + compliance + a true two-sided engine**.

### 1.3 Non-goals (v1)
- Full ATS replacement (we integrate, not replace).
- Candidate-side "stealth copilot" cheating assistance (Final Round AI style) — explicitly **out of scope** and, in fact, something our employer mode must *detect*.
- Background checks, payroll, offer management.

---

## 2. Users & Personas

| Persona | Mode | Core JTBD |
|---|---|---|
| **Maya — Job Seeker (IC)** | Prep | "When I have an interview next week, I want realistic role-specific practice with honest feedback, so I can fix my weak spots and walk in confident." |
| **David — Leadership Candidate (Director/VP)** | Prep | "I want to rehearse executive behavioral & strategy questions and get calibrated feedback at my level." |
| **Priya — Recruiter / Talent Partner** | Screen | "I want to screen 200 applicants consistently and fairly without burning my week, and get comparable, defensible scorecards." |
| **Sam — Hiring Manager** | Screen | "I want a structured signal on role-specific competencies before I spend my time, with evidence I can trust." |
| **Lena — Talent Ops / Compliance** | Admin | "I need bias audits, consent records, data-retention controls, and audit logs to stay compliant (LL144 / EU AI Act)." |
| **Coach/Mentor (AI + optional human)** | Prep | "Turn interview performance into a personalized improvement plan and track progress over attempts." |

---

## 3. Product Pillars

1. **One adaptive engine, two modes** — Practice (mentoring, transparent, low-stakes) and Screen (standardized, scored, compliant).
2. **Configurable by discipline × role × seniority × tone** — interviews feel right for the job and level.
3. **Multimodal** — voice, video, text, live coding/system design, in one session.
4. **Scientifically grounded** — structured interviews, BARS rubrics, past-behavior questions, calibration.
5. **Immersive & humane UX** — calm-confidence dark/glass UI, reactive AI presence, cinematic feedback.
6. **Compliance & fairness by design** — consent, bias auditing, transparency, accessibility, data control.

---

## 4. Configuration Model (the "Set the Stage" system)

The interview is parameterized by a `StageConfig`:

```
StageConfig {
  mode:        "practice" | "screen"
  discipline:  Engineering | ProductManagement | Data/ML | Design | Sales | Marketing | Operations | ...
  role:        e.g. "Software Engineer", "Product Manager", "Engineering Manager"
  seniority:   IC1..IC6 | Manager | SeniorManager | Director | Senior Director | VP | C-level
  focusAreas:  [behavioral, systemDesign, coding, productSense, analytics, leadership, stakeholder, ...]
  tone:        Warm | Neutral | Executive | HighPressure   // see §7
  modality:    [voice, video, text, coding]
  duration:    15 | 30 | 45 | 60 min
  language:    en | es | ... (multilingual)
  jobContext?: { jobDescription, company, resume }  // optional grounding
  proctoring?: { idVerify, tabFocus, copilotDetection }  // screen mode
}
```

### 4.1 Discipline → Role → Seniority taxonomy (v1 seed)
- **Engineering:** SWE (IC1–IC6 / Junior→Staff→Principal), Engineering Manager, Senior EM, Director of Engineering, VP Eng. Focus: coding, system design, behavioral, technical depth, leadership (mgmt+).
- **Product Management:** APM, PM, Senior PM, Group PM, Director of PM, VP Product, CPO. Focus: product sense, execution, analytics/metrics, strategy, stakeholder/leadership.
- **Data/ML:** Data Analyst, Data Scientist, ML Engineer, Senior/Staff, Manager, Director. Focus: SQL/coding, ML system design, stats, case/business.
- **Design:** Product Designer, Senior, Staff, Design Manager, Director. Focus: portfolio/critique, design exercise, behavioral, leadership.
- **Sales:** SDR, AE, Senior AE, Sales Manager, Director, VP Sales. Focus: discovery role-play, objection handling, pipeline strategy, leadership.
- **Marketing / Ops / others:** extensible templates.

Each (discipline, role, seniority) maps to a **competency set** with leveled expectations (IC vs manager vs director vs VP shifts weight from execution → people/strategy). Built on the I/O-psych construct taxonomy (Huffcutt 2001): applied social skills (communication, leadership, negotiation, teamwork), mental capability, job knowledge, organizational fit.

---

## 5. The Interview Engine (core)

### 5.1 Question generation
- Adaptive, role/level-aware question generation via Claude, seeded from a **curated rubric/competency template** per `StageConfig` (not free-form).
- **Past-behavior questions prioritized** ("Tell me about a time you…") over situational, per meta-analytic validity (.56 vs .45).
- Optional grounding on job description + résumé for relevance.
- Difficulty laddering by seniority; coding/system-design problem bank for technical rounds.

### 5.2 Conversation & adaptivity
- Real-time **adaptive follow-ups** that probe depth ("what tradeoffs did you weigh?", "what was *your* specific contribution?").
- **Turn-taking & barge-in** handling for voice; graceful handling of pauses/thinking time (a documented failure mode of current screeners we must beat).
- **Thinking-time affordance** instead of penalizing silence.
- Multilingual support.

### 5.3 Scoring & rubric (BARS-based)
- Each competency scored on a **5-point behaviorally-anchored scale**, every point anchored (more bias-resistant than endpoint-only).
- Evidence-linked: each score cites transcript moments.
- Aggregate → overall + per-competency, leveled against seniority expectations.
- **Calibration:** consistent rubric across candidates (the core fairness/validity mechanism). Optional human-in-the-loop override in screen mode.
- **Delivery analytics** (prep mode): pace, filler words, structure (STAR), clarity, confidence — modeled on Yoodli-style reports.

### 5.4 Modes differ in surfacing
- **Practice:** transparent, real-time gentle cues allowed, full feedback + coaching, improvement plan, multi-attempt tracking.
- **Screen:** standardized, no candidate-facing hints, scorecard to employer, proctoring + copilot-detection signals, consent + compliance logging.

---

## 6. Feature Catalog (exhaustive)

### 6.1 Candidate / Prep & Mentoring
- On-demand AI mock interviews across all disciplines/levels/formats (behavioral, coding, system design, product sense, case, role-play).
- Adaptive follow-ups; realistic interviewer personas/tones.
- **Post-interview feedback report:** strengths, gaps, per-competency BARS scores with transcript evidence, delivery analytics (pace/filler/structure).
- **Cinematic feedback replay:** scrubbable timeline (video+transcript), inline coaching annotations, skill radar.
- **Personalized improvement plan:** targeted drills, recommended next interviews, resources.
- **Progress tracking:** compare attempts over time; trend lines per competency.
- **Mentoring loop:** AI coach Q&A about feedback; optional human-mentor marketplace (future).
- Resume/JD-tailored practice; company-style modes (e.g., FAANG-style).
- Question bank & "drill mode" for single-competency reps.
- Anonymity option (de-biasing, per interviewing.io model); performance-gated opportunities (future).

### 6.2 Employer / Screening
- Create interview templates per role/level; reusable rubrics.
- Invite candidates (link/email); async or live AI screen.
- **Structured scorecards** delivered to hiring team; side-by-side candidate comparison.
- Calibration & consistency controls; configurable competency weights.
- Proctoring options: ID verification, tab-focus monitoring, **AI-copilot/assistance detection**, environment checks.
- Collaboration: notes, ratings, shareable evidence clips.
- Pipeline/analytics dashboard: funnel, pass rates, time-to-screen, score distributions, adverse-impact monitoring.
- Bias audit exports (LL144), consent & data-retention controls, audit logs.

### 6.3 Cross-cutting / Platform
- Multimodal session (voice/video/text/coding) with seamless mode switches.
- Tone/persona configuration (§7).
- Coding stage (Monaco) + system-design whiteboard.
- Accounts, roles & permissions (candidate, recruiter, hiring manager, admin), SSO.
- Integrations: ATS (Greenhouse, Lever, Workday, Ashby), calendaring, webhooks (post-v1).
- Notifications, scheduling, reminders.
- Admin: org settings, billing, usage, audit & compliance center.

---

## 7. Interviewer Tone / Persona System

Tone reshapes **conversation style + voice + visual mood** from one source of truth:

| Tone | Style | When to use |
|---|---|---|
| **Warm / Supportive** | Encouraging, patient, affirming | Nervous candidates, early prep, junior levels |
| **Neutral / Professional** | Balanced, clear, fair | Default, most screens |
| **Executive / Crisp** | Concise, direct, time-aware, strategic | Director/VP, exec presence practice |
| **High-Pressure / Stress** | Probing, rapid follow-ups, challenges | Stress-test prep, high-bar roles |

Implementation: tone → (system-prompt persona + TTS voice/prosody + UI theme + motion config). See `DESIGN_SYSTEM.md §6`.

---

## 8. Immersive UX

Full spec in `docs/DESIGN_SYSTEM.md`. Highlights: the **Interview Room** (reactive avatar orb, live captions, signal HUD, focus mode), **"Set the Stage" onboarding**, **tone-aware theming**, **coding mode**, and **cinematic feedback replay**. Aesthetic: modern dark + glassmorphism + glow; WCAG 2.2 AA; reduced-motion; full keyboard nav.

---

## 9. Compliance, Fairness & Trust (first-class)

- **NYC Local Law 144:** support external bias audits; bias-audit data exports; candidate notice. (Audit obligation is on the employer; we provide tooling + records. HireVue/DCI precedent.)
- **EEOC / adverse impact:** monitor group score differences; structured rubric to minimize adverse impact (high-structure interviews show smaller group differences).
- **EU AI Act:** hiring is **high-risk** → risk management, transparency, human oversight, logging, documentation.
- **GDPR / data protection:** consent, purpose limitation, data-retention controls, deletion, export.
- **ADA / accessibility:** captions, keyboard, screen-reader support, accommodations (extra time), reduced-motion; learn from the HireVue ADA discrimination case.
- **Transparency:** candidates told it's AI, what's measured, and how data is used; human-review path.
- **No protected-attribute inference;** no facial-expression "personality" scoring (controversial/legally risky). Score competencies and content, not demographics.
- **Audit logs** for every scored decision; evidence-linked scores for defensibility.

> Caveat from research: vendor accuracy/fairness claims are largely unvalidated; real screeners have shown bias (name effects) and mishandled pauses. Our design explicitly mitigates these.

---

## 10. Technical Architecture (build target)

```
Next.js (App Router, TS)  ── immersive UI (Tailwind + Framer Motion + Radix + Monaco)
   │  client: Web Audio (orb/waveform), Web Speech API (STT/TTS, v1), MediaRecorder (video)
   ▼
API routes (server)
   ├─ /api/interview/start      → builds StageConfig, opening question
   ├─ /api/interview/turn       → streams AI follow-up (Claude), adaptive
   ├─ /api/interview/score      → BARS rubric scoring (Claude, structured output)
   ├─ /api/interview/feedback   → mentoring report + improvement plan
   └─ /api/coding/run           → execute candidate code against tests
   ▼
Interview Engine (lib)  ── persona/tone prompts, competency templates, rubric logic
   ▼
Claude API (claude-sonnet-4-6 default; claude-opus-4-8 for scoring) — structured tool outputs
   ▼
Persistence: SQLite + Prisma (sessions, transcripts, scores, reports, attempts)
```

- **Voice:** v1 uses browser Web Speech API (zero external keys). Upgrade path: Hume EVI / Deepgram (STT) + ElevenLabs (TTS) for low-latency, prosody-aware, barge-in-capable realtime — the documented quality bar.
- **Secrets:** `ANTHROPIC_API_KEY` from `.env.local`. No keys committed.
- **Streaming:** token streaming for captions & low perceived latency.

---

## 11. Success Metrics

- **North star:** completed interviews producing an actionable outcome.
- Candidate: practice completion rate, score improvement across attempts, D7/D30 retention, NPS, "felt realistic" rating.
- Employer: interviews/recruiter/week, time-to-screen ↓, scorecard adoption, candidate completion rate, candidate-experience score, adverse-impact ratio within thresholds.
- Quality: rubric inter-rater reliability (AI vs human calibration), follow-up relevance, hallucination rate.

---

## 12. Roadmap

- **v0 (this build / hackathon):** Real working app — onboarding (discipline/role/seniority/tone), immersive Interview Room with voice (browser) + text, coding mode, Claude-driven adaptive interview, BARS scoring, feedback/mentoring report, local persistence. Single-player practice mode primary; employer scorecard view stub.
- **v1:** Employer mode (templates, invites, scorecards, comparison), accounts/roles, video, multi-attempt tracking, premium realtime voice.
- **v2:** ATS integrations, SSO, bias-audit center, analytics dashboards, multilingual, human-mentor marketplace, proctoring/copilot detection.
- **v3:** Talent-pool flywheel, performance-gated opportunities, enterprise admin, EU AI Act conformity tooling.

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI bias / adverse impact | Structured BARS rubric, no demographic inference, adverse-impact monitoring, external audit support |
| Legal (LL144, EU AI Act, ADA) | Compliance-first design, consent, transparency, human oversight, accessibility |
| Hallucinated/unfair scoring | Evidence-linked scores, calibration, human override in screen mode, conservative prompting |
| Voice latency / pause mishandling | Streaming, thinking-time affordance, upgrade to realtime voice stack |
| Candidate cheating (copilots) | Screen-mode proctoring + assistance detection; design questions resistant to canned answers |
| Scope creep | Phased roadmap; v0 proves the core loop end-to-end |

---

## 14. Open Questions (from research gaps)
- Concrete pricing/packaging (per-interview vs per-seat vs enterprise) — needs dedicated analysis.
- Exact anti-copilot detection techniques — research gap; design conservatively.
- Depth of ATS integration partners for v2.

---

*Appendix: full cited research lives in `docs/RESEARCH.md`. Design system in `docs/DESIGN_SYSTEM.md`.*
