# AIInterview — Immersive UI/UX Design System

> Aesthetic direction: **Modern dark + glassmorphism + glow** (Linear × Arc × Hume).
> Principle: *calm confidence* — premium, AI-native, low-anxiety. Motion is purposeful, never decorative noise.
> Status: living document. Drafted in parallel with research/PRD; "cool feature" patterns will be appended once research lands.

---

## 1. Design Principles

1. **Calm under pressure.** Interviews are stressful. The UI lowers cognitive load: one focal point at a time, generous negative space, no jarring color, no surprise modals mid-interview.
2. **The AI feels present, not robotic.** A living, breathing avatar/orb that reacts to voice in real time creates presence. Latency is hidden behind motion.
3. **Signal, not surveillance.** Live metrics (pace, fillers, sentiment) inform the candidate gently — coaching cues, never a panic-inducing scoreboard during a real interview.
4. **Tone-aware everything.** The interviewer persona (warm / neutral / executive / high-pressure) shifts visuals, motion, color temperature, and copy — the whole room matches the conversation.
5. **Immersive but escapable.** Full-bleed focus mode, but the candidate always has obvious controls (pause, captions, exit, accessibility).
6. **Accessible by default.** WCAG 2.2 AA, full keyboard nav, live captions always available, `prefers-reduced-motion` honored, screen-reader landmarks. Immersion never costs accessibility.

---

## 2. Design Tokens

### 2.1 Color — base (dark canvas)

| Token | Hex | Use |
|---|---|---|
| `--bg-base` | `#07090F` | App background (near-black, slight blue) |
| `--bg-elevated` | `#0D1018` | Cards behind glass |
| `--surface-glass` | `rgba(255,255,255,0.04)` | Glass panel fill |
| `--surface-glass-strong` | `rgba(255,255,255,0.08)` | Active/elevated glass |
| `--border-glass` | `rgba(255,255,255,0.10)` | 1px hairline on glass |
| `--text-primary` | `#F4F6FB` | Primary text |
| `--text-secondary` | `#A6AFC2` | Secondary text |
| `--text-muted` | `#5C6479` | Captions, hints |

### 2.2 Color — accent / glow (per tone, see §6)

| Token | Default (Neutral) | Use |
|---|---|---|
| `--accent` | `#6E8BFF` (electric indigo) | Primary actions, focus ring |
| `--accent-2` | `#9B6BFF` (violet) | Gradient pair |
| `--glow` | `0 0 40px rgba(110,139,255,0.45)` | Avatar/orb halo, active states |
| `--success` | `#3FE0A5` | Positive signal |
| `--warn` | `#FFC56E` | Caution (pace, fillers) |
| `--danger` | `#FF6E8B` | Hard errors only (never used to scare candidate mid-interview) |

### 2.3 Typography

- **Display / UI:** `Inter` (or `Geist`) — variable, `-0.02em` tracking on headings.
- **Mono (coding mode, code, timers):** `JetBrains Mono` / `Geist Mono`.
- Scale (rem): `12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56`. Line-height 1.5 body, 1.15 display.

### 2.4 Space, radius, blur, motion

- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Radius:** `sm 8`, `md 14`, `lg 20`, `xl 28`, `pill 999`.
- **Glass blur:** `backdrop-filter: blur(20px) saturate(140%)`.
- **Elevation:** layered soft shadows + inner top highlight (`inset 0 1px 0 rgba(255,255,255,0.08)`) for the "lit glass edge."
- **Motion:** durations `120 / 200 / 320 / 600ms`; easing `cubic-bezier(0.22, 1, 0.36, 1)` (gentle overshoot). Springs for avatar/orb only.

---

## 3. Core Component Inventory

| Component | Notes |
|---|---|
| `GlassPanel` | Base frosted surface; variants: flat, elevated, interactive. |
| `AvatarOrb` | Reactive AI presence (see §4). Audio-amplitude-driven. |
| `VoiceWaveform` | Real-time mic visualization; doubles as "AI is speaking" indicator. |
| `LiveCaptions` | Streaming transcript, speaker-colored, auto-scroll, pinnable. |
| `SignalHUD` | Pace / filler / sentiment / confidence meters (candidate prep mode). |
| `ToneSelector` | Persona picker with live preview of voice + visual mood. |
| `StageSetup` | Onboarding: discipline × role × seniority × tone (see §5). |
| `InterviewRoom` | The immersive stage (see §4). |
| `CodeStage` | Monaco split-pane + test runner, glass-framed (see §7). |
| `FeedbackReplay` | Cinematic post-interview review (see §8). |
| `SkillRadar` | Animated competency radar/spider chart. |
| `Timeline` | Scrubbable transcript+video timeline with annotation markers. |
| `ControlDock` | Floating bottom dock: mic, cam, captions, pause, end, settings. |
| `ConsentSheet` | Recording/AI-use consent + compliance disclosures (see PRD compliance). |

---

## 4. The Interview Room (signature screen)

Full-bleed, dark, single focal point. Layout (desktop):

```
┌───────────────────────────────────────────────────────────┐
│  ●●● tone: Executive        00:14 / 30:00        [captions] │  ← slim glass top bar
│                                                             │
│                     ╭───────────────╮                       │
│                     │   AVATAR ORB  │   ← reactive, glowing │
│                     ╰───────────────╯                       │
│                "Walk me through a time you…"   ← current Q   │
│                                                             │
│   ┌── live captions (streaming) ──────────────────────┐     │
│   │ AI: …tell me about the tradeoffs you considered.  │     │
│   └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌ self-view ┐                         ┌ Signal HUD ┐       │  (HUD only in prep mode)
│  │  (candidate│                         │ pace ▁▃▅   │       │
│  │   camera)  │                         │ fillers 2  │       │
│  └────────────┘                         └────────────┘       │
│                                                             │
│        ◉ mic   ◉ cam   ⊞ captions   ❚❚ pause   ⏹ end        │  ← floating ControlDock
└───────────────────────────────────────────────────────────┘
```

Behavior:
- **Avatar orb** sits center-stage; when the AI speaks it pulses/blooms with the glow color; when listening it settles into a slow breathing idle and a thin ring tracks the candidate's voice amplitude.
- **Captions** stream token-by-token; candidate utterances appear in a second color. Always toggleable; on by default for accessibility.
- **Self-view** is a small rounded glass tile (PiP), draggable; can be hidden.
- **Signal HUD** appears **only in candidate prep/mentoring mode** — hidden in real employer screening to avoid biasing/distracting the candidate (configurable by employer).
- **Thinking time:** a subtle "take your time" cue + soft ring instead of dead-air anxiety.
- **Focus mode:** chrome fades after 3s of inactivity; returns on pointer/key.

Mobile: avatar top third, captions middle, dock bottom; self-view collapses to a pill.

---

## 5. Onboarding — "Set the Stage" (immersive, not a form)

A guided, full-screen, step-by-step flow with motion between steps and a live preview building up:

1. **Mode** — *Practice & get mentored* vs *Take a real interview* (if invited by employer, this is pre-set).
2. **Discipline** — Engineering, Product Management, Data/ML, Design, Sales, Marketing, Ops… (large glass tiles with icons; hover = subtle tilt + glow).
3. **Role & Seniority** — dependent picker: e.g. Engineering → IC2/SWE → Senior → Staff → EM → Senior EM → Director → VP. PM → APM → PM → Senior PM → GPM → Director → VP/CPO.
4. **Focus areas** — sub-competencies for that role (system design, behavioral, leadership, stakeholder mgmt, coding…).
5. **Interviewer tone** — `ToneSelector` with **live audio + visual preview** (see §6).
6. **Logistics** — duration, language, device check (mic/cam test with live meters), accessibility prefs.
7. **Consent** — recording/AI disclosure, data retention, compliance notices.

Each step writes into a `StageConfig` object that parameterizes the interview engine.

---

## 6. Tone-Aware Theming (the "cool" differentiator)

The interviewer **tone/persona** retints the entire room — color temperature, motion energy, orb behavior, and copy voice:

| Tone | Accent / glow | Motion | Orb behavior | Copy voice |
|---|---|---|---|---|
| **Warm / Supportive** | Amber→rose `#FFB46E`/`#FF6E9C` | Soft, slow | Gentle bloom, rounded | Encouraging, "Great — tell me more." |
| **Neutral / Professional** | Indigo→violet `#6E8BFF`/`#9B6BFF` | Measured | Steady pulse | Balanced, clear |
| **Executive / Crisp** | Steel→cyan `#7FA8FF`/`#5FE0E0` | Tight, minimal | Sharp, contained | Concise, direct, time-aware |
| **High-Pressure / Stress** | Ember `#FF8A5F`/`#FF5F6E` | Faster, tighter | Quicker pulse, less idle | Probing, rapid follow-ups |

Implemented as a **theme layer**: tone → CSS variable set + Framer Motion config + TTS voice + system-prompt persona. One source of truth so visuals, motion, voice, and conversation never desync.

---

## 7. Coding / Technical Mode

When a technical round triggers, the room splits without losing immersion:
- Left: persistent (smaller) avatar orb + captions rail.
- Right: **Monaco editor** in a glass frame — multi-language, custom dark theme matching tokens, line glow on active line.
- Below editor: **test runner** (run against visible + hidden tests), stdout console, complexity hints.
- AI can highlight lines it's referring to; collaborative cursor for the AI's "pointing."
- Whiteboard/diagram tab for system-design rounds (excalidraw-style, dark).

---

## 8. Feedback & Mentoring Replay (cinematic post-interview)

The payoff screen — turns a recording into a coaching session:
- **Hero score card** — overall + per-competency, animated count-up, `SkillRadar` building in.
- **Scrubbable Timeline** — video + transcript synced; markers for strong moments (green), missed opportunities (amber), filler clusters, long pauses.
- **Inline coaching annotations** — AI notes anchored to moments: "Strong STAR structure here," "Consider quantifying impact."
- **Skill-gap → plan** — radar gaps convert into a **personalized improvement roadmap** (drills, recommended practice interviews, resources).
- **Compare runs** — overlay progress across attempts over time (the mentoring loop).
- **Export/share** — PDF report; employer view shows rubric-aligned, bias-audited scorecard (no protected-attribute inference).

---

## 9. Accessibility & Performance Guardrails

- `prefers-reduced-motion`: orb → simple opacity pulse; transitions → instant; no parallax.
- All meters/visuals have text equivalents + ARIA live regions for captions.
- Keyboard: full control of dock, captions, timeline scrubbing; visible focus ring (`--accent`, 2px, offset).
- Contrast: text ≥ 4.5:1 on glass (we darken glass behind text where needed).
- Performance budget: orb/waveform on GPU (transform/opacity only), 60fps; captions virtualized; lazy-load Monaco only in coding mode.

---

## 10. Suggested Stack (for the prototype, Task #4)

- **Next.js (App Router) + TypeScript**, **Tailwind CSS**, **Framer Motion** (motion), **Radix UI** (a11y primitives).
- **Monaco** for coding mode; **Web Audio API / `AnalyserNode`** for waveform + orb amplitude.
- Avatar orb: CSS/Canvas/WebGL (shader) — start with layered CSS+Canvas, upgrade to WebGL if time allows.
- State: lightweight (Zustand) for `StageConfig` + interview session.
- Mockable interview engine interface so the UI works with canned data now and a real voice/LLM backend later.

---

## 11. Gamification & Progress (delight layer)

Inspired by `product-council.amarnathv.com` (a gamified PM-learning platform), the candidate/mentoring experience carries a light progression layer that makes practice habit-forming:

- **XP & levels** — completing a scored interview awards XP (scaled by overall score); XP rolls into levels with a progress bar in the header.
- **Streaks** — consecutive-day practice builds a 🔥 streak (the daily-challenge hook).
- **Skill progression** — best score per competency is tracked over time, so the radar "fills in" across attempts (the "capture/collect" mechanic, reframed as mastering competencies).
- **Daily drill** (roadmap) — a single-competency rep surfaced on the home screen, à la the reference's daily challenge.
- **Knowledge-check** (roadmap) — a post-interview recall/quiz on the feedback, mirroring the reference's "Knowledge Battle".

Implemented in `components/gamify.ts` (localStorage-backed `Progress`: xp/level/streak/attempts/bestByCompetency), surfaced in the onboarding header and the feedback hero. Keep it **secondary to the interview** — motivation, never distraction; hidden in employer screen mode.

> Built: onboarding, Interview Room, feedback replay, and the Claude-powered engine are implemented and the app builds + boots. Live end-to-end run requires an `ANTHROPIC_API_KEY`.
