// Discipline × Role × Seniority taxonomy + leveled competency sets.
// Grounded in the I/O-psych construct taxonomy (Huffcutt 2001) and PRD §4.

import type { Tone } from "./types";

export interface Discipline {
  id: string;
  label: string;
  icon: string; // lucide icon name
  roles: Role[];
}
export interface Role {
  id: string;
  label: string;
  focusAreas: string[]; // candidate-selectable sub-competencies
}
export interface Seniority {
  id: string;
  label: string;
  // weight shift: how much execution vs leadership/strategy matters at this level
  expectation: string;
}

export const SENIORITIES: Seniority[] = [
  { id: "junior", label: "Junior / IC1–2", expectation: "Strong fundamentals, guided execution, learning velocity." },
  { id: "mid", label: "Mid / IC3", expectation: "Independent execution, sound judgment on scoped problems." },
  { id: "senior", label: "Senior / IC4", expectation: "Ambiguity handling, technical leadership, cross-team influence." },
  { id: "staff", label: "Staff / Principal", expectation: "Org-level impact, strategy, multiplier effect on others." },
  { id: "manager", label: "Manager", expectation: "People leadership, delivery through a team, coaching." },
  { id: "senior-manager", label: "Senior Manager", expectation: "Leading managers or a large team; cross-team delivery and planning." },
  { id: "director", label: "Director", expectation: "Multi-team strategy, org design, executive communication." },
  { id: "senior-director", label: "Senior Director", expectation: "Multi-org leadership, long-range strategy, exec stakeholder management, P&L influence." },
  { id: "vp", label: "VP / Exec", expectation: "Function-wide vision, business outcomes, board-level narrative." },
];

export const DISCIPLINES: Discipline[] = [
  {
    id: "engineering",
    label: "Engineering",
    icon: "Code2",
    roles: [
      { id: "swe", label: "Software Engineer", focusAreas: ["Coding", "System Design", "Behavioral", "Technical Depth"] },
      { id: "frontend", label: "Frontend Engineer", focusAreas: ["Coding (JS/UI)", "Frontend System Design", "Performance & Craft", "Behavioral"] },
      { id: "backend", label: "Backend Engineer", focusAreas: ["Coding", "API & System Design", "Databases", "Behavioral"] },
      { id: "fullstack", label: "Full-Stack Engineer", focusAreas: ["Coding", "System Design", "Product Thinking", "Behavioral"] },
      { id: "mobile", label: "Mobile Engineer", focusAreas: ["Coding", "Mobile Architecture", "Performance", "Behavioral"] },
      { id: "devops", label: "DevOps / SRE", focusAreas: ["Systems & Reliability", "Incident Response", "Scripting / IaC", "Behavioral"] },
      { id: "security", label: "Security Engineer", focusAreas: ["Threat Modeling", "Secure Coding", "Incident Response", "Behavioral"] },
      { id: "ml", label: "ML Engineer", focusAreas: ["Coding", "ML System Design", "Stats", "Behavioral"] },
      { id: "dataeng", label: "Data Engineer", focusAreas: ["SQL / Coding", "Pipeline Design", "Data Modeling", "Behavioral"] },
      { id: "em", label: "Engineering Manager", focusAreas: ["People Leadership", "Delivery", "System Design", "Behavioral"] },
    ],
  },
  {
    id: "system-design",
    label: "System Design",
    icon: "Network",
    roles: [
      { id: "backend-sd", label: "Backend Engineer", focusAreas: ["Scalability & Capacity", "API Design", "Data Modeling & Storage", "Reliability & Observability"] },
      { id: "fullstack-sd", label: "Full-Stack Engineer", focusAreas: ["Frontend / Mobile System Design", "Realtime Collaboration", "API Design", "Caching & Performance"] },
      { id: "staff-sd", label: "Staff / Principal Engineer", focusAreas: ["Distributed Systems Strategy", "Reliability & Observability", "Security & Abuse Prevention", "Tradeoff Communication"] },
      { id: "em-sd", label: "Engineering Manager", focusAreas: ["Architecture Review", "Execution & Migration Planning", "Incident Response", "Cross-team Alignment"] },
      { id: "ai-systems", label: "ML / AI Systems Engineer", focusAreas: ["ML / AI System Design", "Vector Search & Retrieval", "Model Serving & Inference", "MLOps & Evaluation"] },
    ],
  },
  {
    id: "product",
    label: "Product Management",
    icon: "Compass",
    roles: [
      { id: "pm", label: "Product Manager", focusAreas: ["Product Sense", "Operational Metrics", "Execution & Prioritization", "Pricing & Packaging", "Leadership & Stakeholder Influence"] },
      { id: "tpm", label: "Technical PM", focusAreas: ["Technical Product Thinking", "Developer Products", "System / API Thinking", "Execution & Prioritization"] },
      { id: "growthpm", label: "Growth PM", focusAreas: ["Growth & Experimentation", "Operational Metrics", "Pricing & Packaging", "Product Sense"] },
      { id: "platformpm", label: "Platform PM", focusAreas: ["Platform Thinking", "Developer Products", "System / API Thinking", "Ecosystem Strategy"] },
      { id: "aipm", label: "AI / ML PM", focusAreas: ["AI Product Sense", "AI Evaluation & Metrics", "Model Cost & Latency Tradeoffs", "Responsible AI & Safety"] },
      { id: "gpm", label: "Group PM / Lead", focusAreas: ["Product Strategy", "Go-to-Market", "Enterprise AI Adoption", "Leadership & Stakeholder Influence"] },
    ],
  },
  {
    id: "data",
    label: "Data / ML",
    icon: "BarChart3",
    roles: [
      { id: "da", label: "Data Analyst", focusAreas: ["SQL", "Metrics", "Storytelling", "Behavioral"] },
      { id: "ds", label: "Data Scientist", focusAreas: ["SQL / Coding", "Statistics", "Case / Business", "Behavioral"] },
      { id: "analytics", label: "Analytics Engineer", focusAreas: ["SQL / Modeling", "Pipelines", "Metrics", "Behavioral"] },
      { id: "dsml", label: "ML Engineer (Data)", focusAreas: ["Coding", "ML System Design", "Stats", "Behavioral"] },
      { id: "research", label: "Research Scientist", focusAreas: ["Research Depth", "ML Theory", "Experiment Design", "Behavioral"] },
    ],
  },
  {
    id: "aiml",
    label: "AI / Machine Learning",
    icon: "BrainCircuit",
    roles: [
      { id: "aipm", label: "AI Product Manager", focusAreas: ["AI Product Sense", "AI Evaluation & Metrics", "AI UX", "Responsible AI & Safety"] },
      { id: "aieng", label: "AI Engineer", focusAreas: ["LLM Fundamentals", "RAG & Retrieval", "Agents & Tool Use", "MLOps & Observability"] },
      { id: "mleng", label: "Machine Learning Engineer", focusAreas: ["ML Concepts", "System Design", "MLOps & Observability", "Data & Labeling"] },
      { id: "genai", label: "Generative AI Engineer", focusAreas: ["Prompting & Context Engineering", "AI Evaluation & Metrics", "AI Security", "AI FinOps"] },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: "PenTool",
    roles: [
      { id: "pd", label: "Product Designer", focusAreas: ["Portfolio / Critique", "Design Exercise", "Craft", "Behavioral"] },
      { id: "ux", label: "UX Designer", focusAreas: ["Interaction Design", "Portfolio", "Design Exercise", "Behavioral"] },
      { id: "uxr", label: "UX Researcher", focusAreas: ["Research Methods", "Synthesis", "Storytelling", "Behavioral"] },
      { id: "visual", label: "Visual / Brand Designer", focusAreas: ["Visual Craft", "Portfolio", "Design Systems", "Behavioral"] },
      { id: "dm", label: "Design Manager", focusAreas: ["People Leadership", "Critique", "Craft", "Behavioral"] },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: "TrendingUp",
    roles: [
      { id: "sdr", label: "SDR / BDR", focusAreas: ["Prospecting", "Cold Outreach Role-play", "Resilience", "Behavioral"] },
      { id: "ae", label: "Account Executive", focusAreas: ["Discovery Role-play", "Objection Handling", "Pipeline Strategy", "Behavioral"] },
      { id: "se", label: "Solutions Engineer", focusAreas: ["Technical Discovery", "Demo", "Objection Handling", "Behavioral"] },
      { id: "csm", label: "Customer Success Manager", focusAreas: ["Relationship Mgmt", "Renewal / Expansion", "Objection Handling", "Behavioral"] },
      { id: "sm", label: "Sales Manager", focusAreas: ["People Leadership", "Pipeline Strategy", "Coaching", "Behavioral"] },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "Megaphone",
    roles: [
      { id: "pmm", label: "Product Marketing Manager", focusAreas: ["Positioning / Messaging", "GTM Strategy", "Analytics", "Behavioral"] },
      { id: "growthmktg", label: "Growth Marketer", focusAreas: ["Experimentation", "Channels & Analytics", "Creative", "Behavioral"] },
      { id: "content", label: "Content Marketer", focusAreas: ["Content Strategy", "Writing", "SEO", "Behavioral"] },
      { id: "brand", label: "Brand Marketer", focusAreas: ["Brand Strategy", "Creative", "Storytelling", "Behavioral"] },
      { id: "mm", label: "Marketing Manager", focusAreas: ["People Leadership", "Strategy", "Analytics", "Behavioral"] },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: "Workflow",
    roles: [
      { id: "bizops", label: "Business Operations", focusAreas: ["Analytical Problem Solving", "Process Design", "Stakeholder Mgmt", "Behavioral"] },
      { id: "pgm", label: "Program / Project Manager", focusAreas: ["Execution", "Cross-functional Coordination", "Risk Mgmt", "Behavioral"] },
      { id: "cos", label: "Chief of Staff", focusAreas: ["Strategy", "Execution", "Communication", "Leadership"] },
      { id: "opsmgr", label: "Operations Manager", focusAreas: ["People Leadership", "Process", "Analytics", "Behavioral"] },
    ],
  },
  {
    id: "qa",
    label: "Quality Assurance",
    icon: "ShieldCheck",
    roles: [
      { id: "qae", label: "QA Engineer", focusAreas: ["Test Planning", "Manual Testing", "Bug Mgmt", "Behavioral"] },
      { id: "sdet", label: "SDET / Automation Engineer", focusAreas: ["Test Automation", "Coding", "CI/CD Integration", "Behavioral"] },
      { id: "performance", label: "Performance / Load Test Engineer", focusAreas: ["Performance Testing", "Tools & Scripting", "Analysis", "Behavioral"] },
      { id: "qalead", label: "QA Lead / Manager", focusAreas: ["People Leadership", "Quality Strategy", "Process Design", "Behavioral"] },
    ],
  },
];

// Leveled competency set for a (discipline, role, seniority). Used to seed
// question generation and the BARS rubric so scoring is consistent.
export const LEADER_LEVELS = ["staff", "manager", "senior-manager", "director", "senior-director", "vp"];

export function competenciesFor(disciplineId: string, roleId: string, seniorityId: string): string[] {
  const isLeader = LEADER_LEVELS.includes(seniorityId);
  const base: Record<string, string[]> = {
    engineering: ["Problem Solving", "Technical Depth", "Code/Design Quality", "Communication", "Collaboration"],
    "system-design": ["Scalability & Capacity", "Data Modeling & Storage", "Reliability & Observability", "API Design", "Tradeoff Communication"],
    product: ["Product Sense", "Analytical Thinking", "Execution", "Strategic Thinking", "Stakeholder Influence"],
    data: ["Analytical Rigor", "Technical Skill", "Business Insight", "Communication", "Experiment Design"],
    aiml: ["AI Product Sense", "LLM Fundamentals", "RAG & Agents", "AI Evaluation", "Responsible AI"],
    design: ["Design Craft", "User Empathy", "Critique & Iteration", "Communication", "Collaboration"],
    sales: ["Discovery", "Objection Handling", "Business Acumen", "Communication", "Resilience"],
    marketing: ["Marketing Strategy", "Analytical Thinking", "Creativity & Messaging", "Communication", "Execution"],
    operations: ["Analytical Problem Solving", "Process & Execution", "Cross-functional Influence", "Communication", "Prioritization"],
    qa: ["Test Planning", "Technical Skill", "Quality Mindset", "Communication", "Attention to Detail"],
  };
  const set = [...(base[disciplineId] ?? base.engineering)];
  if (isLeader) set.push("People Leadership", "Strategic Thinking");
  return set;
}

export function lookup(disciplineId: string, roleId: string, seniorityId: string) {
  const discipline = DISCIPLINES.find((d) => d.id === disciplineId) ?? DISCIPLINES[0];
  const role = discipline.roles.find((r) => r.id === roleId) ?? discipline.roles[0];
  const seniority = SENIORITIES.find((s) => s.id === seniorityId) ?? SENIORITIES[1];
  return { discipline, role, seniority };
}

export const TONES: { id: Tone; label: string; blurb: string; accent: string; accent2: string }[] = [
  { id: "warm", label: "Warm & Supportive", blurb: "Encouraging, patient, affirming.", accent: "#FFB46E", accent2: "#FF6E9C" },
  { id: "neutral", label: "Neutral & Professional", blurb: "Balanced, clear, fair.", accent: "#6E8BFF", accent2: "#9B6BFF" },
  { id: "executive", label: "Executive & Crisp", blurb: "Concise, direct, time-aware.", accent: "#7FA8FF", accent2: "#5FE0E0" },
  { id: "high-pressure", label: "High-Pressure", blurb: "Probing, rapid follow-ups, challenging.", accent: "#FF8A5F", accent2: "#FF5F6E" },
];
