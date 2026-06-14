# GreenRoom — Hackathon Demo Script

> A ~4-minute live demo. **Prototype mode needs no API key**, so the demo can't fail on a network/key issue — that's your safety net. Practice the click-path twice before going on stage.

---

## 0. Before you present (setup, 2 min)
- Have it running: `npm run dev` (local) **or** the Vercel URL open in a tab.
- Use **Chrome or Edge** (for voice). Allow mic when asked.
- Pre-pick a scenario you'll demo (suggested below) but DON'T start the interview yet — start it live.
- Have a second tab on the **feedback page from a prior run** as a backup, so you can jump straight to results if you run low on time.
- Zoom the browser to ~110% so the room reads from the back.

---

## 1. The hook (15 sec)
> "Interview prep today is broken: mock interviews are expensive, inconsistent, and generic. And on the hiring side, early screens eat recruiter time and are full of bias. **GreenRoom is one AI interviewer that does both** — it coaches candidates *and* runs real, structured screens — across voice, video, text, and coding."

*(Name nod: a "green room" is where you compose yourself right before going on stage.)*

---

## 2. Set the Stage (40 sec) — show configurability
Land on the home screen. Talk while you click:
> "Every interview is configured along four axes: **discipline × role × seniority × tone**."

- Click through **Engineering → Product → Data → Design → Sales → Marketing → Operations** (≈40 roles, IC through VP).
- Pick **Product Management → Product Manager → Senior**.
- Click a **tone** — pick **Executive** and point out: *"Watch the whole UI re-tint — tone changes the interviewer's voice, the visuals, and the conversation style. Same engine, totally different feel."*
- Note the **Practice vs Real screen** toggle: *"Same engine, two modes."*
- Click **Enter the Interview Room**.

---

## 3. The Ready Room (15 sec) — the friendly, immersive touch
> "Interviews are stressful, so we don't drop you cold. A warm 'green room' — a breathing beat, a mic check, and what to expect. Calm confidence by design."

Click **"I'm ready — let's begin."**

---

## 4. The Interview Room (75 sec) — the centerpiece
> "This is the immersive interview room — a reactive AI presence, live captions, dark glassmorphism."

- The AI asks the first question (point at the **reactive orb** pulsing as it 'speaks').
- **Answer one question** — speak it (mic) OR type. Mention: *"Voice transcribes into the box so you can review before sending — and the interviewer voice is independent: it can ask out loud or in text."*
- After you answer, point at the **green encouragement nudge** that pops up: *"Warm, instant coaching between answers — practice mode is a mentor, not a judge."*
- Click **"Stuck? Get a hint"** → then **"See a model outline."** *"On-demand coaching: how to approach the question, and the skeleton of a strong answer — structure, not a script. Disabled in real-screen mode so it can't be used to cheat."*
- Wave at **Redo · Skip · Pause**: *"Low-pressure controls — redo an answer, skip, or pause with a calming overlay."*
- Note the **adaptive follow-ups**: *"It probes — 'what tradeoffs did you weigh?', 'what was YOUR contribution?' — past-behavior questioning, which is the most predictive."*
- Answer one or two more quickly, then hit **End & get feedback**.

---

## 5. The Feedback / Mentoring report (45 sec) — the payoff
> "The moment it ends, you get a structured, evidence-based report."

- **Overall score** + animated **skill radar** across competencies.
- Scroll to **per-competency BARS scores** — *"Each on a behaviorally-anchored 5-point scale, with the exact transcript moment used as evidence. This is the gold-standard structured-interview science, not vibes."*
- **Delivery analytics** — pace, filler words, structure, clarity, confidence.
- **Personalized improvement plan** — *"Targeted drills, so you actually get better next time."*
- **Fairness note** — *"Compliance-first: no protected-attribute inference, evidence-linked scores — built for NYC Local Law 144 and the EU AI Act."*
- Point at the **XP / level / streak** — *"And it's gamified to make practice a habit."*

---

## 6. The close (20 sec)
> "GreenRoom unifies a fragmented market — candidate prep tools *and* employer screeners — on one adaptive engine, grounded in real I/O-psychology, wrapped in an experience that's actually calming to use. It's a real, deployed, full-stack app: Next.js, powered by Claude, scored with behaviorally-anchored rubrics. **One green room — for everyone walking into an interview.**"

---

## 30-second elevator version (if you only get one breath)
> "GreenRoom is an AI interviewer that does double duty: it coaches candidates with mock interviews, real-time hints, and a scored mentoring report — and it runs real, structured, bias-aware screens for employers. Pick your discipline, role, seniority, and interviewer tone; have a real adaptive conversation by voice or text; and get a behaviorally-anchored scorecard with a personalized improvement plan. One engine, two sides of the interview, grounded in actual interview science."

---

## Likely judge questions — quick answers
- **"Is this real or canned?"** → "Fully real and deployed. It runs on Claude via the Anthropic API; what you saw is *prototype mode*, which we built so the demo never fails on a key/network hiccup — flip in an API key and it's the live model, zero code change."
- **"How is scoring not just an LLM guessing?"** → "We use behaviorally-anchored rating scales (BARS) and past-behavior questions — the most valid, least-biased structured-interview methods in I/O psychology (12 meta-analyses). Scores are evidence-linked to transcript moments."
- **"What about bias / compliance?"** → "Compliance-first: no protected-attribute inference, no facial-personality scoring, evidence-based rubrics, a transparency note on every report. Designed against NYC LL144, EEOC, EU AI Act, GDPR, ADA."
- **"How do you prevent cheating in real screens?"** → "Coaching/hints are disabled in screen mode; roadmap adds proctoring + AI-assistance detection."
- **"What's the moat?"** → "The two-sided engine creates a flywheel — candidates who practice become a pre-assessed talent pool; employer screens generate calibration data. Plus rigor + experience as differentiators."
- **"Tech stack?"** → "Next.js + TypeScript + Tailwind + Framer Motion; Claude (claude-opus-4-8) for adaptive questioning and structured-output BARS scoring; browser Web Speech for voice; stateless + serverless, deployed on Vercel."

---

## If something breaks on stage
- Voice not working? Just **type** — same flow, no apology needed.
- Internet flaky? **Prototype mode runs entirely without external calls** — the demo continues.
- Running out of time? Jump to your **backup feedback tab** and narrate section 5.
