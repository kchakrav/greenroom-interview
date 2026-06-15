// Extensive, SOURCE-ATTRIBUTED interview question bank.
//
// Questions are paraphrased/standardized representations of the kinds of
// questions taught in well-known interview-prep resources (books, courses,
// channels) and the I/O-psychology literature — attributed per item. They are
// not verbatim copies. A live deep-research pass can expand this set with
// additional, link-cited questions over time (see docs/RESEARCH.md).
//
// Levels use the taxonomy seniority ids:
// junior · mid · senior · staff · manager · senior-manager · director · senior-director · vp

export type QType =
  | "behavioral" | "technical" | "system-design" | "coding"
  | "case" | "leadership" | "strategy" | "craft";

export interface BankQuestion {
  id: string;
  disciplineId: string; // taxonomy discipline id, or "general"
  competency: string;
  levels: string[];
  type: QType;
  prompt: string;
  guidance: string; // what a strong answer covers (model-answer guidance)
  source: string; // attribution
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const IC = ["junior", "mid", "senior", "staff"];
const SENIOR_IC = ["senior", "staff"];
const MGMT = ["manager", "senior-manager", "director", "senior-director", "vp"];
const SENIOR_LEADERS = ["director", "senior-director", "vp"];
const ALL = ["junior", "mid", "senior", "staff", "manager", "senior-manager", "director", "senior-director", "vp"];

export const QUESTION_BANK: BankQuestion[] = [
  // ───────────────────────── GENERAL / BEHAVIORAL (all disciplines) ─────────────────────────
  { id: "g-beh-1", disciplineId: "general", competency: "Communication", levels: ALL, type: "behavioral",
    prompt: "Tell me about a time you had to explain something complex to a non-expert audience. What did you do?",
    guidance: "STAR. Strong answers show audience adaptation, a concrete analogy, and a check for understanding. Look for outcome (decision unblocked, alignment reached).",
    source: "STAR method; Levashina et al. 2014 (Personnel Psychology) on past-behavior questions", difficulty: 2 },
  { id: "g-beh-2", disciplineId: "general", competency: "Collaboration", levels: ALL, type: "behavioral",
    prompt: "Describe a conflict with a coworker. How did you resolve it?",
    guidance: "Look for ownership (not blame), seeking to understand the other view, a concrete resolution, and a relationship preserved/strengthened.",
    source: "Amazon Leadership Principles ('Earn Trust', 'Have Backbone; Disagree and Commit')", difficulty: 2 },
  { id: "g-beh-3", disciplineId: "general", competency: "Problem Solving", levels: ALL, type: "behavioral",
    prompt: "Walk me through the hardest problem you've solved with incomplete information. What was your process?",
    guidance: "Structured decomposition, assumptions made explicit, how they reduced uncertainty, and reflection on the result.",
    source: "Huffcutt et al. 2001 (JAP) interview construct taxonomy", difficulty: 3 },
  { id: "g-beh-4", disciplineId: "general", competency: "Resilience", levels: ALL, type: "behavioral",
    prompt: "Tell me about a significant failure. What happened and what did you change afterward?",
    guidance: "Genuine ownership, specific lessons, and evidence the lesson was applied later. Red flag: blaming others or a 'fake' failure.",
    source: "Amazon LP ('Learn and Be Curious'); STAR", difficulty: 2 },
  { id: "g-beh-5", disciplineId: "general", competency: "Strategic Thinking", levels: SENIOR_LEADERS, type: "strategy",
    prompt: "Describe a long-range bet (12–36 months) you championed. How did you build conviction and align the org?",
    guidance: "Market/insight basis, how they sized the bet, stakeholder alignment, leading indicators chosen, and how it played out.",
    source: "Good Strategy Bad Strategy (Richard Rumelt); Amazon LP ('Think Big')", difficulty: 4 },

  // ───────────────────────── ENGINEERING ─────────────────────────
  { id: "eng-code-1", disciplineId: "engineering", competency: "Problem Solving", levels: IC, type: "coding",
    prompt: "Given an array of integers, return the indices of the two numbers that add up to a target. Explain your time/space complexity.",
    guidance: "Brute force O(n²) → hash map O(n). Strong: states complexity, handles duplicates and no-solution, tests an example.",
    source: "Cracking the Coding Interview (Gayle Laakmann McDowell); LeetCode #1", difficulty: 2 },
  { id: "eng-code-2", disciplineId: "engineering", competency: "Problem Solving", levels: IC, type: "coding",
    prompt: "Detect whether a linked list has a cycle, using O(1) extra space.",
    guidance: "Floyd's tortoise-and-hare. Strong: explains why fast/slow pointers meet, handles empty/one-node lists.",
    source: "Cracking the Coding Interview; Elements of Programming Interviews", difficulty: 3 },
  { id: "eng-code-3", disciplineId: "engineering", competency: "Technical Depth", levels: SENIOR_IC, type: "coding",
    prompt: "Design and implement an LRU cache with O(1) get and put.",
    guidance: "Hash map + doubly linked list. Strong: discusses eviction, thread-safety tradeoffs, and capacity edge cases.",
    source: "LeetCode #146; Cracking the Coding Interview", difficulty: 4 },
  { id: "eng-sd-1", disciplineId: "engineering", competency: "Code/Design Quality", levels: SENIOR_IC.concat(["mid"]), type: "system-design",
    prompt: "Design a URL shortener (like bit.ly). Walk me through the API, data model, and how it scales.",
    guidance: "Key gen (hashing vs counter/base62), read-heavy caching, DB choice, redirect path, analytics. Strong: estimates QPS/storage, discusses collisions.",
    source: "System Design Interview – An Insider's Guide (Alex Xu); Grokking the System Design Interview", difficulty: 3 },
  { id: "eng-sd-2", disciplineId: "engineering", competency: "Technical Depth", levels: SENIOR_IC, type: "system-design",
    prompt: "Design a news feed (e.g., Twitter/Facebook timeline). How do you handle fan-out and ranking at scale?",
    guidance: "Fan-out-on-write vs read, hot-user problem, caching, ranking signals, pagination. Strong: discusses tradeoffs and the celebrity edge case.",
    source: "System Design Interview (Alex Xu); Designing Data-Intensive Applications (Martin Kleppmann)", difficulty: 4 },
  { id: "eng-sd-3", disciplineId: "engineering", competency: "Technical Depth", levels: SENIOR_IC, type: "system-design",
    prompt: "Design a rate limiter for a public API. What algorithm and where does it live?",
    guidance: "Token bucket / sliding window, distributed counter (Redis), per-key limits, failure modes. Strong: discusses accuracy vs cost and edge bursts.",
    source: "System Design Interview (Alex Xu); Grokking the System Design Interview", difficulty: 4 },
  { id: "eng-beh-1", disciplineId: "engineering", competency: "Collaboration", levels: IC, type: "behavioral",
    prompt: "Tell me about a time you disagreed with a technical decision. How did you handle it?",
    guidance: "Data-driven argument, disagree-and-commit, respect for the decision-maker, and the eventual outcome.",
    source: "Amazon LP ('Have Backbone; Disagree and Commit')", difficulty: 3 },
  { id: "eng-beh-2", disciplineId: "engineering", competency: "Problem Solving", levels: IC, type: "behavioral",
    prompt: "Walk me through a production incident you were part of. What did you do during and after?",
    guidance: "Calm triage, mitigation vs root cause, comms, and the durable fix / postmortem actions.",
    source: "Google SRE Book (incident management); The Staff Engineer's Path (Tanya Reilly)", difficulty: 3 },
  { id: "eng-staff-1", disciplineId: "engineering", competency: "Strategic Thinking", levels: ["staff", "senior-manager", "director", "senior-director"], type: "leadership",
    prompt: "Describe a cross-team technical initiative you drove without direct authority. How did you create alignment?",
    guidance: "Influence, a written technical vision/RFC, stakeholder buy-in, and measurable adoption. Hallmark of staff+ scope.",
    source: "Staff Engineer (Will Larson); The Staff Engineer's Path (Tanya Reilly)", difficulty: 4 },
  { id: "eng-em-1", disciplineId: "engineering", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "Tell me about a time you turned around an underperforming engineer. What did you do week to week?",
    guidance: "Clear expectations, specific feedback, a written plan, support, and an honest outcome (improved or managed out humanely).",
    source: "The Manager's Path (Camille Fournier); Radical Candor (Kim Scott)", difficulty: 4 },
  { id: "eng-em-2", disciplineId: "engineering", competency: "People Leadership", levels: SENIOR_LEADERS, type: "leadership",
    prompt: "How have you designed an org or restructured teams for a changing strategy? What was the reasoning and the result?",
    guidance: "Conway's law awareness, team topologies, why the structure fit the strategy, change management, and outcomes.",
    source: "An Elegant Puzzle (Will Larson); Team Topologies (Skelton & Pais)", difficulty: 5 },

  // ───────────────────────── PRODUCT MANAGEMENT ─────────────────────────
  { id: "pm-sense-1", disciplineId: "product", competency: "Product Sense", levels: ["junior", "mid", "senior"], type: "case",
    prompt: "Design a product to help people make new friends in a new city. Who is it for and what do you build first?",
    guidance: "User segmentation, a sharp primary persona, prioritized JTBD, an MVP, and success metrics. Strong: a crisp tradeoff and a clear v1.",
    source: "Cracking the PM Interview (McDowell & Bavaro); Decode and Conquer (Lewis Lin); Exponent (YouTube)", difficulty: 3 },
  { id: "pm-sense-2", disciplineId: "product", competency: "Product Sense", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "Your favorite app — what's one thing you'd improve and how would you measure success?",
    guidance: "Insight into a real user pain, a focused improvement, a hypothesis, and a measurable success metric with a guardrail.",
    source: "Decode and Conquer (Lewis Lin); Lenny's Newsletter", difficulty: 2 },
  { id: "pm-metrics-1", disciplineId: "product", competency: "Analytical Thinking", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "DAU dropped 8% week-over-week. How do you investigate?",
    guidance: "Clarify metric/segment, internal vs external causes, funnel/cohort breakdown, instrumentation check, hypothesis → validation. Strong: structured tree, not random guesses.",
    source: "Cracking the PM Interview; Exponent; Stratechily metric-debugging frameworks", difficulty: 3 },
  { id: "pm-metrics-2", disciplineId: "product", competency: "Analytical Thinking", levels: ["senior", "staff", "manager"], type: "case",
    prompt: "How would you choose the North Star Metric for a marketplace, and what input metrics support it?",
    guidance: "Value-exchange focus, supply/demand balance, a NSM that reflects delivered value, and a metrics tree. Avoid vanity metrics.",
    source: "Amplitude North Star Playbook; Reforge growth frameworks", difficulty: 4 },
  { id: "pm-exec-1", disciplineId: "product", competency: "Execution", levels: ["mid", "senior", "staff"], type: "behavioral",
    prompt: "Tell me about a time you cut scope to hit a deadline. How did you decide what to drop?",
    guidance: "Ruthless prioritization tied to user value, stakeholder comms, and the outcome. Strong: a framework (RICE/MoSCoW) applied to a real call.",
    source: "Inspired (Marty Cagan); Cracking the PM Interview", difficulty: 3 },
  { id: "pm-prio-1", disciplineId: "product", competency: "Execution", levels: ["senior", "staff", "manager"], type: "behavioral",
    prompt: "Walk me through how you prioritized a roadmap when senior stakeholders strongly disagreed.",
    guidance: "Surfacing the real goals, a transparent prioritization framework, data + judgment, and how alignment was reached.",
    source: "Inspired (Marty Cagan); Escaping the Build Trap (Melissa Perri)", difficulty: 4 },
  { id: "pm-strat-1", disciplineId: "product", competency: "Strategic Thinking", levels: ["staff", "manager", "senior-manager", "director", "senior-director"], type: "strategy",
    prompt: "How would you set a 1–3 year product strategy for a business unit facing a new competitor?",
    guidance: "Market analysis, differentiation/wedge, sequencing, bets vs table-stakes, and measurable milestones. Strong: a clear point of view.",
    source: "Good Strategy Bad Strategy (Rumelt); Playing to Win (Lafley & Martin)", difficulty: 5 },
  { id: "pm-lead-1", disciplineId: "product", competency: "Stakeholder Influence", levels: SENIOR_LEADERS, type: "leadership",
    prompt: "Tell me about a time you drove a major decision across an executive team with competing incentives.",
    guidance: "Mapping stakeholders, framing in their terms, building coalition, handling dissent, and the outcome. Director+ scope.",
    source: "Empowered (Cagan & Jones); Crucial Conversations", difficulty: 5 },

  // ───────────────────────── DATA / ML ─────────────────────────
  { id: "data-sql-1", disciplineId: "data", competency: "Technical Skill", levels: ["junior", "mid", "senior"], type: "technical",
    prompt: "Write a SQL query to find the second-highest salary per department. Then explain how you'd handle ties.",
    guidance: "Window functions (DENSE_RANK) vs subquery; ties handled explicitly; NULL awareness. Strong: discusses readability vs performance.",
    source: "Ace the Data Science Interview (Huang & Singh); LeetCode SQL", difficulty: 3 },
  { id: "data-stats-1", disciplineId: "data", competency: "Analytical Rigor", levels: ["mid", "senior", "staff"], type: "technical",
    prompt: "Explain p-values and what a 95% confidence interval does and does not mean.",
    guidance: "Correct frequentist interpretation, common misconceptions, and practical significance vs statistical significance.",
    source: "StatQuest (Josh Starmer, YouTube); Practical Statistics for Data Scientists (Bruce)", difficulty: 3 },
  { id: "data-exp-1", disciplineId: "data", competency: "Experiment Design", levels: ["senior", "staff", "manager"], type: "case",
    prompt: "Design an A/B test for a new checkout flow. How do you size it, and what could invalidate the result?",
    guidance: "Hypothesis, metric + guardrails, power/sample-size, randomization unit, novelty/interaction effects, peeking. Strong: names threats to validity.",
    source: "Trustworthy Online Controlled Experiments (Kohavi, Tang, Xu)", difficulty: 4 },
  { id: "data-ml-1", disciplineId: "data", competency: "Technical Skill", levels: SENIOR_IC, type: "system-design",
    prompt: "Design an ML system to detect fraudulent transactions in real time. Walk through data, features, model, and serving.",
    guidance: "Label strategy, class imbalance, feature/latency tradeoffs, online vs offline, monitoring/drift, precision-recall tradeoff at business cost.",
    source: "Designing Machine Learning Systems (Chip Huyen)", difficulty: 5 },
  { id: "data-biz-1", disciplineId: "data", competency: "Business Insight", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "A metric you report looks great but the business feels worse. How do you reconcile that?",
    guidance: "Metric definition audit, Simpson's paradox/segmentation, leading vs lagging, and translating to a decision. Strong: skepticism + rigor.",
    source: "Ace the Data Science Interview; Trustworthy Online Controlled Experiments", difficulty: 4 },
  { id: "data-lead-1", disciplineId: "data", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "How have you built or scaled a data/analytics function and shifted the org to be data-informed?",
    guidance: "Hiring, standards/tooling, partnership with product/eng, measuring impact of the function, and culture change.",
    source: "Creating a Data-Driven Organization (Carl Anderson)", difficulty: 5 },

  // ───────────────────────── DESIGN ─────────────────────────
  { id: "des-port-1", disciplineId: "design", competency: "Design Craft", levels: IC, type: "craft",
    prompt: "Walk me through a project in your portfolio: the problem, your process, and the impact.",
    guidance: "Problem framing, research → ideation → iteration, rationale for decisions, and outcome (qual + quant). Strong: shows tradeoffs and what they'd change.",
    source: "Articulating Design Decisions (Tom Greever); NN/g portfolio guidance", difficulty: 3 },
  { id: "des-ex-1", disciplineId: "design", competency: "Critique & Iteration", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "Design exercise: improve the onboarding for a meditation app. How do you approach it?",
    guidance: "Clarify goals/constraints/users, sketch flows, justify with heuristics, define success, and note what you'd test.",
    source: "Don't Make Me Think (Steve Krug); NN/g heuristics", difficulty: 3 },
  { id: "des-beh-1", disciplineId: "design", competency: "Communication", levels: ["mid", "senior", "staff"], type: "behavioral",
    prompt: "Tell me about a time you had to defend a design decision to a skeptical stakeholder.",
    guidance: "Translating design into business/user value, evidence, listening to concerns, and a constructive resolution.",
    source: "Articulating Design Decisions (Tom Greever)", difficulty: 3 },
  { id: "des-lead-1", disciplineId: "design", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "How do you build and maintain craft quality across a growing design team?",
    guidance: "Critique culture, design systems, hiring bar, career growth, and balancing consistency with autonomy.",
    source: "Org Design for Design Orgs (Kristin Skinner & Peter Merholz)", difficulty: 4 },

  // ───────────────────────── SALES ─────────────────────────
  { id: "sales-disc-1", disciplineId: "sales", competency: "Discovery", levels: ["junior", "mid", "senior"], type: "case",
    prompt: "Role-play a discovery call: I'm a prospect who said 'we're just looking.' Take it from here.",
    guidance: "Open questions, uncovering pain/impact, qualifying (budget/authority/need/timing), and a clear next step. SPIN structure.",
    source: "SPIN Selling (Neil Rackham)", difficulty: 3 },
  { id: "sales-obj-1", disciplineId: "sales", competency: "Objection Handling", levels: ["mid", "senior"], type: "behavioral",
    prompt: "Tell me about a time you handled a hard 'your price is too high' objection. What did you do?",
    guidance: "Reframe to value/ROI, isolate the real concern, evidence, and a path forward — not discounting reflexively.",
    source: "The Challenger Sale (Dixon & Adamson)", difficulty: 3 },
  { id: "sales-deal-1", disciplineId: "sales", competency: "Business Acumen", levels: ["senior", "manager"], type: "behavioral",
    prompt: "Walk me through the most complex deal you've closed. Who were the stakeholders and how did you navigate them?",
    guidance: "Multi-threading, champion development, mutual action plan, handling procurement/legal, and forecasting accuracy.",
    source: "The Challenger Sale; MEDDIC framework", difficulty: 4 },
  { id: "sales-lead-1", disciplineId: "sales", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "How do you coach a rep who's missing quota? Walk me through your cadence.",
    guidance: "Diagnose (activity vs skill vs pipeline), call coaching, metrics, accountability, and an honest timeline.",
    source: "The Sales Acceleration Formula (Mark Roberge)", difficulty: 4 },

  // ───────────────────────── MARKETING ─────────────────────────
  { id: "mkt-pos-1", disciplineId: "marketing", competency: "Marketing Strategy", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "How would you position a new product entering a crowded category?",
    guidance: "Competitive alternatives, unique attributes → value, target segment, and a sharp positioning statement. Avoid feature-listing.",
    source: "Obviously Awesome (April Dunford)", difficulty: 4 },
  { id: "mkt-growth-1", disciplineId: "marketing", competency: "Analytical Thinking", levels: ["mid", "senior"], type: "case",
    prompt: "A paid channel's CAC doubled this quarter. How do you diagnose and respond?",
    guidance: "Funnel breakdown (CTR/CVR/AOV), audience fatigue, attribution, creative testing, and channel reallocation. Strong: structured + experiment-driven.",
    source: "Lenny's Newsletter; Reforge growth frameworks", difficulty: 3 },
  { id: "mkt-lead-1", disciplineId: "marketing", competency: "Strategic Thinking", levels: SENIOR_LEADERS, type: "strategy",
    prompt: "How would you build the go-to-market strategy for entering a new segment?",
    guidance: "ICP, messaging, channel mix, sales/marketing alignment, budget, and leading indicators. Strong: sequencing and a measurable plan.",
    source: "Crossing the Chasm (Geoffrey Moore); Building a StoryBrand (Donald Miller)", difficulty: 5 },

  // ───────────────────────── OPERATIONS ─────────────────────────
  { id: "ops-prob-1", disciplineId: "operations", competency: "Analytical Problem Solving", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "A key process is breaking down as the company scales. How do you diagnose and redesign it?",
    guidance: "Map current state, find bottlenecks/handoffs, redesign with owners and metrics, pilot, and measure. Strong: data + change management.",
    source: "High Output Management (Andy Grove); The Goal (Goldratt)", difficulty: 4 },
  { id: "ops-pgm-1", disciplineId: "operations", competency: "Process & Execution", levels: ["mid", "senior", "manager"], type: "behavioral",
    prompt: "Tell me about a complex cross-functional program you ran. How did you manage scope, risk, and stakeholders?",
    guidance: "Clear charter, RACI, risk register, comms cadence, and on-time delivery with measurable outcomes.",
    source: "PMI/PMBOK; Shape Up (Basecamp)", difficulty: 4 },
  { id: "ops-cos-1", disciplineId: "operations", competency: "Strategic Thinking", levels: SENIOR_LEADERS, type: "strategy",
    prompt: "As a Chief of Staff, how would you set up an operating rhythm (planning, reviews, OKRs) for a scaling org?",
    guidance: "Cadence design, decision-making forums, OKR hygiene, information flow to leadership, and how you'd measure org health.",
    source: "High Output Management (Andy Grove); The Great CEO Within (Matt Mochary)", difficulty: 5 },
];

// ───────────────────────── Query helpers ─────────────────────────
export interface BankFilter {
  q?: string;
  disciplineId?: string;
  level?: string;
  competency?: string;
  type?: QType;
  source?: string;
}

export function queryBank(f: BankFilter = {}): BankQuestion[] {
  const q = f.q?.toLowerCase().trim();
  return QUESTION_BANK.filter((b) => {
    if (f.disciplineId && f.disciplineId !== "all" && b.disciplineId !== f.disciplineId) return false;
    if (f.level && f.level !== "all" && !b.levels.includes(f.level)) return false;
    if (f.competency && f.competency !== "all" && b.competency !== f.competency) return false;
    if (f.type && (f.type as string) !== "all" && b.type !== f.type) return false;
    if (f.source && f.source !== "all" && b.source !== f.source) return false;
    if (q && !(b.prompt.toLowerCase().includes(q) || b.guidance.toLowerCase().includes(q) || b.competency.toLowerCase().includes(q) || b.source.toLowerCase().includes(q))) return false;
    return true;
  });
}

export function bankFacets() {
  const disciplines = Array.from(new Set(QUESTION_BANK.map((b) => b.disciplineId))).sort();
  const competencies = Array.from(new Set(QUESTION_BANK.map((b) => b.competency))).sort();
  const types = Array.from(new Set(QUESTION_BANK.map((b) => b.type))).sort();
  const sources = Array.from(new Set(QUESTION_BANK.map((b) => b.source))).sort();
  return { disciplines, competencies, types, sources, total: QUESTION_BANK.length };
}

// Seed questions for a live interview from the bank, matched to the config.
export function seedQuestions(disciplineId: string, seniorityId: string, limit = 6): BankQuestion[] {
  const exact = QUESTION_BANK.filter((b) => (b.disciplineId === disciplineId || b.disciplineId === "general") && b.levels.includes(seniorityId));
  const pool = exact.length >= 3 ? exact : QUESTION_BANK.filter((b) => b.disciplineId === disciplineId || b.disciplineId === "general");
  return pool.slice(0, limit);
}
