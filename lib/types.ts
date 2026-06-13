// Core domain types for the AIInterview platform.

export type Mode = "practice" | "screen";
export type Tone = "warm" | "neutral" | "executive" | "high-pressure";
export type Modality = "voice" | "video" | "text" | "coding";

export interface StageConfig {
  mode: Mode;
  disciplineId: string;
  roleId: string;
  seniorityId: string;
  focusAreas: string[];
  tone: Tone;
  modalities: Modality[];
  durationMin: number;
  language: string;
  jobContext?: { jobDescription?: string; company?: string; resume?: string };
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
