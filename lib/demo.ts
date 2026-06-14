// Demo / prototype mode: realistic scripted interview + scoring when no
// ANTHROPIC_API_KEY is set. Lets the whole flow be exercised end-to-end with
// zero keys. Once a key is present, the routes use the real Claude engine.

import type { ChatTurn, ScoreReport, StageConfig } from "./types";
import { competenciesFor, lookup } from "./taxonomy";

export function demoMode(): boolean {
  return !process.env.ANTHROPIC_API_KEY;
}

const TONE_OPENER: Record<StageConfig["tone"], string> = {
  warm: "Welcome — really glad you're here, and there's no pressure at all.",
  neutral: "Thanks for joining.",
  executive: "Thanks for making the time — let's be efficient.",
  "high-pressure": "Let's get right into it.",
};

// Role-aware question banks (behavioral + role-specific). Past-behavior framed.
function questionBank(config: StageConfig): string[] {
  const { discipline, role } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const isLeader = ["manager", "director", "vp", "staff"].includes(config.seniorityId);
  const common = [
    "Tell me about a time you faced a hard tradeoff with limited information. Walk me through what you actually did.",
    "Describe a project you're proud of — what was your specific contribution, and how did you measure impact?",
  ];
  const byDiscipline: Record<string, string[]> = {
    engineering: [
      "Walk me through the most complex system you've designed or significantly changed. What were the key tradeoffs?",
      "Tell me about a production incident you were involved in. What did you do, and what changed afterward?",
      "Describe a time you disagreed with a technical decision. How did you handle it?",
    ],
    product: [
      "Tell me about a product decision you made that the data later proved right — or wrong. How did you decide?",
      "Walk me through how you prioritized a roadmap when stakeholders disagreed.",
      "Describe a feature you killed or de-scoped. What signal drove that, and how did you communicate it?",
    ],
    data: [
      "Walk me through an analysis where your finding changed a real decision. How did you ensure it was rigorous?",
      "Tell me about a time your model or metric was misleading. How did you catch it?",
      "Describe how you've explained a complex statistical result to a non-technical audience.",
    ],
    design: [
      "Walk me through a design where you changed direction based on user research. What did you learn?",
      "Tell me about a time you had to defend a design decision to stakeholders.",
      "Describe how you balanced craft against shipping speed on a real project.",
    ],
    sales: [
      "Walk me through a deal you almost lost and turned around. What specifically did you do?",
      "Tell me about a time you handled a tough objection. What was your approach?",
      "Describe how you built and managed your pipeline in a quarter you exceeded quota.",
    ],
    marketing: [
      "Walk me through a campaign you ran end to end. How did you set the goal and measure it?",
      "Tell me about a time your positioning or messaging changed based on data or customer feedback.",
      "Describe a channel or experiment that underperformed. How did you diagnose and respond?",
    ],
    operations: [
      "Walk me through a messy, cross-functional problem you untangled. What did you actually do?",
      "Tell me about a process you designed or fixed. How did you measure that it worked?",
      "Describe a time you had to drive a decision without authority over the people involved.",
    ],
  };
  const leader = [
    "Tell me about a time you grew a struggling team member. What did you do week to week?",
    "Describe a strategic bet you made for your org. How did you build alignment and measure it?",
  ];
  const coding = [
    "Let's do a coding problem. In your editor, write a function that takes an array of integers and returns the two numbers that add up to a given target (return their indices). Explain your approach and the time complexity as you go.",
    "Now write a function that reverses the words in a sentence in place. Walk me through your edge cases.",
  ];
  const base = byDiscipline[discipline.id] ?? byDiscipline.engineering;
  const set = config.modalities.includes("coding")
    ? [coding[0], ...base.slice(0, 2), coding[1], ...common.slice(0, 1)]
    : [...base, ...common, ...(isLeader ? leader : [])];
  return set.slice(0, 5);
}

export function demoOpening(config: StageConfig): string {
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const q = questionBank(config)[0];
  return `${TONE_OPENER[config.tone]} I'll be your interviewer today for the ${seniority.label} ${role.label} role. I'll ask a few questions about your real experience and follow up as we go — take your time. Let's start: ${q}`;
}

// Returns the next interviewer line. Ends after the question bank is exhausted.
export function demoFollowUp(config: StageConfig, transcript: ChatTurn[]): { text: string; ended: boolean } {
  const bank = questionBank(config);
  const interviewerTurns = transcript.filter((t) => t.role === "interviewer").length; // opening counted
  const lastCandidate = [...transcript].reverse().find((t) => t.role === "candidate")?.text ?? "";
  const probes = [
    "Got it — what tradeoffs did you weigh there, specifically?",
    "Thanks. And what was *your* individual contribution versus the team's?",
    "Interesting — if you did it again, what would you change?",
    "Can you quantify the impact at all?",
  ];
  // Alternate: roughly every other turn, probe deeper before moving on.
  const idx = interviewerTurns; // 1-based next question index
  const shouldProbe = lastCandidate.length < 240 && idx < bank.length;
  if (idx >= bank.length) {
    return {
      text: "That's everything I wanted to cover. Thanks for walking me through those examples in detail — you'll get your structured feedback in just a moment. [[END]]",
      ended: true,
    };
  }
  if (shouldProbe) {
    return { text: probes[idx % probes.length] + " Then I'd love to hear: " + bank[idx], ended: false };
  }
  return { text: "Thanks, that's helpful. " + bank[idx], ended: false };
}

const FILLERS = ["um", "uh", "like", "you know", "kind of", "sort of", "basically", "literally"];

// Coaching help shown under a question in practice mode (demo version).
export function demoHint(config: StageConfig, question: string): string {
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const comps = competenciesFor(config.disciplineId, config.roleId, config.seniorityId).slice(0, 3).join(", ");
  const isLeader = ["manager", "director", "vp", "staff"].includes(config.seniorityId);
  return [
    `Structure with STAR — Situation, Task, Action, Result. Lead with one sentence of context, then spend most of your time on what YOU did and the measurable result.`,
    `What they're assessing here: ${comps}.`,
    isLeader
      ? `At the ${seniority.label} level, emphasize judgment, the people/strategy angle, and how you created leverage beyond your own work.`
      : `At the ${seniority.label} level, show concrete ownership and depth — the specific decisions and tradeoffs you made.`,
    `Pointers: name the tradeoffs you weighed · quantify the impact (%, $, time) · close with what you'd do differently.`,
  ].join("\n");
}

// A structural outline of how a strong answer would be built (not a script).
export function demoOutline(config: StageConfig, question: string): string {
  const { role } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  return [
    `A strong ${role.label} answer to this usually follows:`,
    `1. Situation — one or two sentences of context (what, when, your role).`,
    `2. Task — the specific problem or goal you owned.`,
    `3. Action — the 2-3 key things YOU did, and the tradeoffs you weighed (this is most of the answer).`,
    `4. Result — the measurable outcome (numbers), plus what you learned or would change.`,
    `Tip: keep it ~90 seconds; depth on Action and a concrete Result is what separates strong answers.`,
  ].join("\n");
}

export function demoScore(config: StageConfig, transcript: ChatTurn[]): ScoreReport {
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const comps = competenciesFor(config.disciplineId, config.roleId, config.seniorityId);
  const answers = transcript.filter((t) => t.role === "candidate");
  const allText = answers.map((a) => a.text).join(" ");
  const words = allText.trim() ? allText.trim().split(/\s+/).length : 0;
  const avgWords = answers.length ? Math.round(words / answers.length) : 0;

  // Engagement → base score (more substantive answers score higher), capped sanely.
  const engagement = Math.min(5, Math.max(2, Math.round(2 + avgWords / 45)));
  const fillerCount = FILLERS.reduce(
    (n, f) => n + (allText.toLowerCase().match(new RegExp(`\\b${f}\\b`, "g"))?.length ?? 0),
    0
  );

  const competencies = comps.map((c, i) => {
    const score = Math.min(5, Math.max(1, engagement + ((i % 3) - 1))); // gentle spread
    const snippet = (answers[i % Math.max(1, answers.length)]?.text ?? "").slice(0, 120);
    return {
      competency: c,
      score,
      anchor:
        score >= 4
          ? `Above bar for ${seniority.label}: clear, structured, evidence-backed answers.`
          : score === 3
          ? `At bar for ${seniority.label}: solid reasoning, room to go deeper on specifics.`
          : `Below bar: answers were brief or lacked concrete detail.`,
      evidence: snippet ? `e.g. "${snippet}${snippet.length >= 120 ? "…" : ""}"` : "Limited material to assess in this session.",
      strengths: score >= 3 ? "Communicated clearly and used concrete examples." : "Engaged with the questions.",
      improvement:
        score >= 4
          ? "Push for even sharper quantification of impact."
          : "Use the STAR structure and quantify outcomes (numbers, %, timeframes).",
    };
  });
  const overall = Number((competencies.reduce((s, c) => s + c.score, 0) / competencies.length).toFixed(1));

  return {
    overall,
    recommendation:
      overall >= 4 ? "Strong — likely above the bar for this level." : overall >= 3 ? "Promising — solid with clear areas to sharpen." : "Developing — focus on the improvement plan below.",
    summary: `Demo report for a ${seniority.label} ${role.label} interview. You gave ${answers.length} response(s) (~${avgWords} words each). Scores below are illustrative — add your ANTHROPIC_API_KEY for a real, evidence-grounded BARS assessment from Claude.`,
    competencies,
    delivery: {
      pace: 120 + Math.min(40, avgWords),
      fillerWords: fillerCount,
      fillerExamples: FILLERS.filter((f) => allText.toLowerCase().includes(f)).slice(0, 4),
      structure: Math.min(5, engagement),
      clarity: Math.min(5, engagement),
      confidence: Math.min(5, Math.max(2, engagement - (fillerCount > 6 ? 1 : 0))),
      notes:
        fillerCount > 6
          ? "Watch filler words — they crept in. Pausing briefly beats filling the silence."
          : "Good control of pace and filler words.",
    },
    improvementPlan: [
      { area: "Structure with STAR", why: "Anchored, well-structured answers score higher and are easier to follow.", drills: ["Re-tell one story in strict Situation→Task→Action→Result form", "Cut preamble; lead with the situation in one sentence"] },
      { area: "Quantify impact", why: "Concrete numbers separate strong answers from vague ones.", drills: ["For each story, add one metric (%, $, time saved)", "Practice a 90-second answer that ends on measurable impact"] },
      { area: `Go deeper on ${role.label} specifics`, why: "Role-level depth is what interviewers probe for at your seniority.", drills: ["Prepare two stories that show tradeoff reasoning", "Anticipate the 'what would you change?' follow-up"] },
    ],
    fairnessNote:
      "Demo mode: scores are illustrative heuristics based on response length and filler words — not a real assessment. No protected attributes are used. Add an ANTHROPIC_API_KEY to get genuine, transcript-evidenced BARS scoring from Claude.",
  };
}
