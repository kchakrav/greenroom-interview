// Core domain types for the AIInterview platform.

export type Mode = "practice" | "screen";
export type Tone = "warm" | "neutral" | "executive" | "high-pressure";
export type Modality = "voice" | "video" | "text" | "coding";

export interface StageConfig {
  mode: Mode; // always "practice" — learning product (kept for compatibility)
  disciplineId: string;
  roleId: string;
  seniorityId: string;
  focusAreas: string[];
  tone: Tone;
  modalities: Modality[];
  durationMin: number;
  language: string;
  drill?: { competency: string; questionCount?: number }; // focused single-competency drill
  pathStep?: { pathId: string; stepIndex: number }; // launched from a learning path
  jobContext?: { jobDescription?: string; company?: string; resume?: string };
}

// One completed attempt, summarized for the progress dashboard & path tracking.
export interface AttemptSummary {
  id: string;
  at: number;
  disciplineId: string;
  roleId: string;
  roleLabel: string;
  seniorityId: string;
  overall: number;
  competencies: { competency: string; score: number }[];
  drill?: string; // competency name if this was a drill
  pathId?: string;
}

export interface ChatTurn {
  role: "interviewer" | "candidate";
  text: string;
  ts: number;
}

// One competency scored on a 5-point behaviorally-anchored scale (BARS).
export interface CompetencyScore {
  competency: string;
  score: number; // 1..5
  anchor: string; // behavioral description of the level reached
  evidence: string; // transcript moment(s) supporting the score
  strengths: string;
  improvement: string;
}

export interface DeliveryAnalytics {
  pace: number; // words/min (candidate)
  fillerWords: number;
  fillerExamples: string[];
  structure: number; // 1..5 (STAR adherence)
  clarity: number; // 1..5
  confidence: number; // 1..5
  notes: string;
}

export interface ScoreReport {
  overall: number; // 1..5
  recommendation: string; // hire signal / readiness
  summary: string;
  competencies: CompetencyScore[];
  delivery?: DeliveryAnalytics;
  improvementPlan: { area: string; why: string; drills: string[] }[];
  fairnessNote: string; // transparency: what was and wasn't assessed
}

export interface InterviewSession {
  id: string;
  config: StageConfig;
  transcript: ChatTurn[];
  createdAt: number;
  completedAt?: number;
  report?: ScoreReport;
}
