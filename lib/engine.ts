import Anthropic from "@anthropic-ai/sdk";
import type { ChatTurn, ScoreReport, StageConfig } from "./types";
import { competenciesFor, lookup } from "./taxonomy";

// Default to Anthropic's most capable model; swap via env if desired.
export const MODEL = process.env.AIINTERVIEW_MODEL || "claude-opus-4-8";

let _client: Anthropic | null = null;
export function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (!_client) _client = new Anthropic();
  return _client;
}

const TONE_PERSONA: Record<StageConfig["tone"], string> = {
  warm: "Warm, encouraging and patient. Affirm effort, put the candidate at ease, and gently guide them when they stall.",
  neutral: "Balanced, clear and professional. Fair and steady; neither cold nor effusive.",
  executive: "Crisp and time-aware, like a senior executive. Concise questions, expect concise structured answers, keep momentum.",
  "high-pressure": "Probing and challenging. Push on assumptions, ask rapid follow-ups, and stress-test reasoning — but never demean.",
};

// System prompt for the live AI interviewer. Encodes the science: structured
// interview, past-behavior questioning, one question at a time, adaptive probes.
export function interviewerSystemPrompt(config: StageConfig): string {
  const { discipline, role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const comps = competenciesFor(config.disciplineId, config.roleId, config.seniorityId);
  const focus = config.focusAreas.length ? config.focusAreas.join(", ") : role.focusAreas.join(", ");
  const ctx = config.jobContext?.jobDescription
    ? `\n\nJob context to ground questions on:\n${config.jobContext.jobDescription.slice(0, 1500)}`
    : "";

  return `You are an expert interviewer conducting a ${config.mode === "practice" ? "realistic practice" : "real screening"} interview for a ${seniority.label} ${role.label} role in ${discipline.label}.

PERSONA / TONE: ${TONE_PERSONA[config.tone]}

LEVEL EXPECTATIONS (${seniority.label}): ${seniority.expectation}

FOCUS AREAS for this interview: ${focus}.
COMPETENCIES you are evaluating: ${comps.join(", ")}.

HOW TO RUN A RIGOROUS STRUCTURED INTERVIEW:
- Ask ONE question at a time. Keep your turns short and conversational — this is spoken aloud.
- Prefer PAST-BEHAVIOR questions ("Tell me about a time you…", "Walk me through what YOU did…") over hypotheticals — they are more predictive.
- Ask adaptive follow-ups that probe depth: tradeoffs considered, the candidate's specific contribution, what they'd do differently, quantified impact.
- Calibrate difficulty to the ${seniority.label} level. ${["manager","director","vp"].includes(config.seniorityId) ? "Emphasize people leadership, strategy, and stakeholder influence." : "Balance hands-on depth with communication."}
- Allow thinking time; do not penalize brief pauses. Never feed the candidate the answer${config.mode === "screen" ? " or give hints — this is a real screen." : "."}
- Cover the focus areas across the conversation; move on once you have enough signal on a competency.
- ${config.mode === "practice" ? "This is practice: be encouraging and keep them moving." : "This is a real screen: stay neutral and standardized."}

OUTPUT RULES:
- Respond ONLY as the interviewer's spoken words. No stage directions, no markdown, no lists, no scores.
- When you have gathered enough signal across the focus areas (or time is short), give a brief closing line and end with the token [[END]] on its own.${ctx}`;
}

// Build the Anthropic message history from the transcript.
export function toMessages(transcript: ChatTurn[]): Anthropic.MessageParam[] {
  return transcript.map((t) => ({
    role: t.role === "interviewer" ? "assistant" : "user",
    content: t.text,
  }));
}

// JSON schema for BARS-based structured scoring (PRD §5.3).
export function scoreSchema(competencies: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      overall: { type: "number" },
      recommendation: { type: "string" },
      summary: { type: "string" },
      competencies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            competency: { type: "string", enum: competencies },
            score: { type: "integer", enum: [1, 2, 3, 4, 5] },
            anchor: { type: "string" },
            evidence: { type: "string" },
            strengths: { type: "string" },
            improvement: { type: "string" },
          },
          required: ["competency", "score", "anchor", "evidence", "strengths", "improvement"],
        },
      },
      delivery: {
        type: "object",
        additionalProperties: false,
        properties: {
          pace: { type: "number" },
          fillerWords: { type: "integer" },
          fillerExamples: { type: "array", items: { type: "string" } },
          structure: { type: "integer", enum: [1, 2, 3, 4, 5] },
          clarity: { type: "integer", enum: [1, 2, 3, 4, 5] },
          confidence: { type: "integer", enum: [1, 2, 3, 4, 5] },
          notes: { type: "string" },
        },
        required: ["pace", "fillerWords", "fillerExamples", "structure", "clarity", "confidence", "notes"],
      },
      improvementPlan: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            area: { type: "string" },
            why: { type: "string" },
            drills: { type: "array", items: { type: "string" } },
          },
          required: ["area", "why", "drills"],
        },
      },
      fairnessNote: { type: "string" },
    },
    required: ["overall", "recommendation", "summary", "competencies", "improvementPlan", "fairnessNote"],
  } as const;
}

// Practice-mode coaching help for a specific question. Short, non-streaming.
export async function coachingHint(config: StageConfig, question: string): Promise<string> {
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 600,
    system: `You are an interview coach. The candidate is practicing for a ${seniority.label} ${role.label} role. Given the interviewer's question, give brief, skimmable guidance on HOW to approach the answer — never a full sample answer. Cover: the structure to use (e.g. STAR), what the interviewer is really assessing, and 2-3 concrete pointers (tradeoffs to name, what to quantify, common pitfalls). 4-6 short lines, no preamble.`,
    messages: [{ role: "user", content: `Interviewer's question:\n"${question}"` }],
  });
  return msg.content
    .filter((b) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();
}

// Structural outline of a strong answer (not a verbatim script).
export async function modelOutline(config: StageConfig, question: string): Promise<string> {
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const msg = await client().messages.create({
    model: MODEL,
    max_tokens: 700,
    system: `You are an interview coach for a ${seniority.label} ${role.label} candidate. Given the interviewer's question, outline HOW a strong answer is STRUCTURED — a skeleton with 3-5 numbered beats and what each should contain. Do NOT write a full sample answer or invent specifics; keep it a reusable template. End with one short tip. No preamble.`,
    messages: [{ role: "user", content: `Interviewer's question:\n"${question}"` }],
  });
  return msg.content
    .filter((b) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();
}

export async function scoreInterview(config: StageConfig, transcript: ChatTurn[]): Promise<ScoreReport> {
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const comps = competenciesFor(config.disciplineId, config.roleId, config.seniorityId);
  const convo = transcript
    .map((t) => `${t.role === "interviewer" ? "INTERVIEWER" : "CANDIDATE"}: ${t.text}`)
    .join("\n");

  const system = `You are a calibrated, fair interview assessor trained in structured-interview science (behaviorally anchored rating scales).

Score the candidate for a ${seniority.label} ${role.label} role against EACH competency on a 5-point behaviorally-anchored scale:
1 = well below bar · 2 = below bar · 3 = at bar for level · 4 = above bar · 5 = exceptional.
For each competency, set "anchor" to a behavioral description of the level you observed, and "evidence" must quote or paraphrase specific transcript moments.

Calibrate to the ${seniority.label} expectation: ${seniority.expectation}

FAIRNESS RULES (mandatory):
- Score only demonstrated competencies and content. NEVER infer or use age, gender, race, accent, name, or any protected attribute.
- Be evidence-based and consistent. If signal is missing for a competency, score conservatively and say so in "evidence".
- In "delivery", estimate spoken-delivery signals (pace, filler words, structure/STAR, clarity, confidence) from the candidate's turns only.
- In "fairnessNote", state plainly what was and was not assessed and any limitations.

Provide an honest overall (average-ish of competencies, rounded to one decimal), a readiness "recommendation", a "summary", and a concrete "improvementPlan".`;

  // `thinking: adaptive` and `output_config` are newer than the installed SDK's
  // typings but are accepted by the API — pass via an `any`-typed body.
  const params: any = {
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: { format: { type: "json_schema", schema: scoreSchema(comps) } },
    system,
    messages: [
      {
        role: "user",
        content: `Competencies to score (use these exact names): ${comps.join(", ")}\n\nINTERVIEW TRANSCRIPT:\n${convo}`,
      },
    ],
  };
  const msg: any = await client().messages.create(params);

  const text = msg.content.find((b: any) => b.type === "text");
  if (!text) throw new Error("No score returned");
  return JSON.parse(text.text) as ScoreReport;
}
