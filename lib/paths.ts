// Guided learning paths — a curriculum of steps (concept quizzes + drills +
// full interviews) the learner progresses through. Steps map to existing modes.
import type { StageConfig } from "./types";

export type StepKind = "quiz" | "drill" | "interview";

export interface PathStep {
  kind: StepKind;
  label: string;
  // partial config applied when launching this step
  apply: Partial<StageConfig> & { quizTopic?: string };
}

export interface LearningPath {
  id: string;
  title: string;
  blurb: string;
  disciplineId: string;
  steps: PathStep[];
}

export const PATHS: LearningPath[] = [
  {
    id: "pm-behavioral",
    title: "Crack the PM behavioral loop",
    blurb: "From core PM concepts to a full behavioral interview, step by step.",
    disciplineId: "product",
    steps: [
      { kind: "quiz", label: "Concepts: product fundamentals", apply: { disciplineId: "product", roleId: "pm", quizTopic: "Product Sense" } },
      { kind: "drill", label: "Drill: Execution", apply: { disciplineId: "product", roleId: "pm", seniorityId: "senior", drill: { competency: "Execution" } } },
      { kind: "drill", label: "Drill: Stakeholder Influence", apply: { disciplineId: "product", roleId: "pm", seniorityId: "senior", drill: { competency: "Stakeholder Influence" } } },
      { kind: "interview", label: "Full behavioral interview", apply: { disciplineId: "product", roleId: "pm", seniorityId: "senior", modalities: ["voice", "text"], durationMin: 30 } },
    ],
  },
  {
    id: "swe-senior",
    title: "Senior SWE: coding → system design → behavioral",
    blurb: "A complete loop for a senior software engineer.",
    disciplineId: "engineering",
    steps: [
      { kind: "quiz", label: "Concepts: data structures & complexity", apply: { disciplineId: "engineering", roleId: "swe", quizTopic: "Technical Depth" } },
      { kind: "interview", label: "Coding round", apply: { disciplineId: "engineering", roleId: "swe", seniorityId: "senior", modalities: ["coding", "text"], durationMin: 30 } },
      { kind: "quiz", label: "Concepts: system design basics", apply: { disciplineId: "engineering", roleId: "swe", quizTopic: "System Design" } },
      { kind: "interview", label: "Behavioral round", apply: { disciplineId: "engineering", roleId: "swe", seniorityId: "senior", modalities: ["voice", "text"], durationMin: 30 } },
    ],
  },
  {
    id: "eng-leadership",
    title: "Engineering leadership (Manager → Director)",
    blurb: "People leadership, org design, and strategy for eng leaders.",
    disciplineId: "engineering",
    steps: [
      { kind: "quiz", label: "Concepts: management fundamentals", apply: { disciplineId: "engineering", roleId: "em", quizTopic: "People Leadership" } },
      { kind: "drill", label: "Drill: People Leadership", apply: { disciplineId: "engineering", roleId: "em", seniorityId: "manager", drill: { competency: "People Leadership" } } },
      { kind: "drill", label: "Drill: Strategic Thinking", apply: { disciplineId: "engineering", roleId: "em", seniorityId: "director", drill: { competency: "Strategic Thinking" } } },
      { kind: "interview", label: "Director-level interview", apply: { disciplineId: "engineering", roleId: "em", seniorityId: "director", modalities: ["voice", "text"], durationMin: 45 } },
    ],
  },
  {
    id: "ds-foundations",
    title: "Data Scientist foundations",
    blurb: "Stats and experimentation concepts, then a case interview.",
    disciplineId: "data",
    steps: [
      { kind: "quiz", label: "Concepts: statistics & experiments", apply: { disciplineId: "data", roleId: "ds", quizTopic: "Analytical Rigor" } },
      { kind: "drill", label: "Drill: Experiment Design", apply: { disciplineId: "data", roleId: "ds", seniorityId: "senior", drill: { competency: "Experiment Design" } } },
      { kind: "interview", label: "Full DS interview", apply: { disciplineId: "data", roleId: "ds", seniorityId: "senior", modalities: ["voice", "text"], durationMin: 30 } },
    ],
  },
];

export function pathById(id: string) {
  return PATHS.find((p) => p.id === id);
}
