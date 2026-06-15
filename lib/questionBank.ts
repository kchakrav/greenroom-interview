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

  // ═══════════════ RESEARCH-SOURCED (link-cited, deep-research pass 2026-06-14) ═══════════════
  // Product Management — Meta PM behavioral set (IGotAnOffer, mined from 300+ Glassdoor reports)
  { id: "r-pm-1", disciplineId: "product", competency: "Execution", levels: ["mid", "senior", "staff"], type: "behavioral",
    prompt: "Tell me about a product you led from idea to launch.",
    guidance: "End-to-end ownership: the insight, how you scoped v1, cross-functional execution, the launch, and measured impact. Strong: your specific decisions and a metric.",
    source: "IGotAnOffer — Meta PM behavioral questions (https://igotanoffer.com/blogs/product-manager/behavioral-interview-questions-tech-companies)", difficulty: 3 },
  { id: "r-pm-2", disciplineId: "product", competency: "Execution", levels: ["senior", "staff", "manager"], type: "behavioral",
    prompt: "Tell me about a time you had to prioritize numerous different projects and priorities.",
    guidance: "A real prioritization framework, the tradeoffs, stakeholder comms, and what you consciously deprioritized.",
    source: "IGotAnOffer — Meta PM behavioral questions (https://igotanoffer.com/blogs/product-manager/behavioral-interview-questions-tech-companies)", difficulty: 3 },
  { id: "r-pm-3", disciplineId: "product", competency: "Strategic Thinking", levels: SENIOR_LEADERS.concat(["staff", "senior-manager"]), type: "strategy",
    prompt: "How would you set the product vision and strategy for a 0→1 bet, and how would you get leadership to fund it?",
    guidance: "Market insight, a clear vision, sequencing of bets, risks, and an executive-grade narrative with leading indicators.",
    source: "IGotAnOffer — Product leader interview prep (https://igotanoffer.com/blogs/product-manager/product-leader-interview-prep)", difficulty: 5 },

  // Engineering Management / leadership (IGotAnOffer EM; em-interviews; Exponent)
  { id: "r-em-1", disciplineId: "engineering", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "Tell me about a time you had to give difficult feedback to a senior engineer. How did you approach it?",
    guidance: "Specific, timely, behavior-focused feedback; SBI or similar; psychological safety; and the outcome on performance/behavior.",
    source: "IGotAnOffer — Engineering Manager interviews (https://igotanoffer.com/blogs/tech/engineering-manager-interviews)", difficulty: 4 },
  { id: "r-em-2", disciplineId: "engineering", competency: "People Leadership", levels: SENIOR_LEADERS, type: "leadership",
    prompt: "How do you measure the health and productivity of an engineering organization?",
    guidance: "Beyond velocity: DORA metrics, delivery predictability, attrition/engagement, and outcome (not output) measures. Avoid lines-of-code thinking.",
    source: "IGotAnOffer — Google EM interview (https://igotanoffer.com/blogs/tech/google-engineering-manager-interview)", difficulty: 5 },
  { id: "r-staff-1", disciplineId: "engineering", competency: "Strategic Thinking", levels: ["staff", "senior-manager", "director"], type: "leadership",
    prompt: "Describe a time you identified and drove a major technical-debt or architecture initiative across teams.",
    guidance: "Framing the business case, an RFC/vision, alignment without authority, sequencing, and measurable risk reduction.",
    source: "em-tools.io — Staff Engineer interview prep (https://www.em-tools.io/interview-prep/staff-engineer); Staff Engineer (Will Larson)", difficulty: 5 },

  // Senior system design (interviewing.io)
  { id: "r-sd-1", disciplineId: "engineering", competency: "Technical Depth", levels: SENIOR_IC.concat(["senior-manager"]), type: "system-design",
    prompt: "Design a chat/messaging system like WhatsApp. Cover delivery guarantees, presence, and scale.",
    guidance: "Connection mgmt (long-poll/websockets), message store, delivery/read receipts, fan-out, offline delivery, and E2E-encryption tradeoffs.",
    source: "interviewing.io — system design questions & WhatsApp mock (https://interviewing.io/system-design-interview-questions)", difficulty: 5 },
  { id: "r-sd-2", disciplineId: "engineering", competency: "Technical Depth", levels: SENIOR_IC, type: "system-design",
    prompt: "Design a web crawler. How do you handle politeness, dedup, and scale to billions of pages?",
    guidance: "Frontier/queue, politeness/robots, URL dedup (bloom filter), distributed workers, storage, and freshness recrawl policy.",
    source: "interviewing.io — system design questions (https://interviewing.io/system-design-interview-questions)", difficulty: 5 },

  // Data / ML (Exponent data science guide)
  { id: "r-ds-1", disciplineId: "data", competency: "Technical Skill", levels: ["mid", "senior", "staff"], type: "technical",
    prompt: "How does a random forest work, and when would you prefer it over a single decision tree?",
    guidance: "Bagging + feature randomness reduces variance; ensemble averaging; handles nonlinearity; less overfit than one deep tree. Strong: bias-variance framing.",
    source: "Exponent — Data Science interview guide (https://www.tryexponent.com/blog/data-science-interview-guide)", difficulty: 3 },
  { id: "r-ds-2", disciplineId: "data", competency: "Analytical Rigor", levels: ["mid", "senior", "staff"], type: "technical",
    prompt: "Your model has high variance (overfitting). How would you improve it?",
    guidance: "More data, regularization, simpler model, cross-validation, feature selection, ensembling/bagging. Strong: diagnoses before prescribing.",
    source: "Exponent — Data Science interview guide (https://www.tryexponent.com/blog/data-science-interview-guide)", difficulty: 3 },
  { id: "r-ds-3", disciplineId: "data", competency: "Business Insight", levels: ["senior", "staff", "manager"], type: "behavioral",
    prompt: "Tell me about a time you had to influence a decision without authority, or handle stakeholder pushback on your analysis.",
    guidance: "Translating data to the stakeholder's goals, evidence, listening, and a concrete decision changed. Strong: rigor + EQ.",
    source: "Exponent — Data Science interview guide (https://www.tryexponent.com/blog/data-science-interview-guide)", difficulty: 4 },

  // Cross-discipline behavioral by competency (Harvard Medical School HR; SHRM)
  { id: "r-beh-lead-1", disciplineId: "general", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "Describe a situation where you had to lead a team through a significant change or uncertainty.",
    guidance: "Change framing, communication cadence, addressing resistance, and the outcome for the team and goals.",
    source: "Harvard Medical School HR — Sample Behavioral Questions by Competency (https://hr.hms.harvard.edu/sites/default/files/pdf/sample-behavioral-questions.pdf)", difficulty: 4 },
  { id: "r-beh-strat-1", disciplineId: "general", competency: "Strategic Thinking", levels: SENIOR_LEADERS, type: "strategy",
    prompt: "Tell me about a time you developed a long-term strategy. How did you balance long-term goals with short-term needs?",
    guidance: "Vision + pragmatism, resource tradeoffs, stakeholder alignment, and measurable progress against the strategy.",
    source: "Harvard Medical School HR — Sample Behavioral Questions by Competency (https://hr.hms.harvard.edu/sites/default/files/pdf/sample-behavioral-questions.pdf)", difficulty: 4 },
  { id: "r-beh-deleg-1", disciplineId: "general", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "Give an example of how you delegated a challenging assignment. How did you decide who and how much to delegate?",
    guidance: "Matching task to growth, clear expectations, appropriate support, and trusting without abandoning.",
    source: "Harvard Medical School HR — Sample Behavioral Questions by Competency (https://hr.hms.harvard.edu/sites/default/files/pdf/sample-behavioral-questions.pdf)", difficulty: 3 },

  // Sales leadership & Chief of Staff (Exponent / Chief of Staff Network)
  { id: "r-cos-1", disciplineId: "operations", competency: "Strategic Thinking", levels: SENIOR_LEADERS, type: "strategy",
    prompt: "As Chief of Staff, how would you prioritize the CEO's time and the leadership team's agenda in your first 90 days?",
    guidance: "Listening tour, identifying the top org problems, an operating cadence, and a 30/60/90 with measurable goals.",
    source: "Chief of Staff Network — interview questions (https://www.chiefofstaff.network/blog/33-chief-of-staff-interview-questions-answers)", difficulty: 5 },
  { id: "r-sales-meddic-1", disciplineId: "sales", competency: "Business Acumen", levels: ["senior", "manager", "senior-manager"], type: "behavioral",
    prompt: "Walk me through how you qualify an enterprise deal. What signals tell you it's real?",
    guidance: "MEDDIC: Metrics, Economic buyer, Decision criteria/process, Identify pain, Champion. Strong: a real deal mapped to each.",
    source: "MEDDICC — interview guidance (https://meddicc.com/resources/tips-for-your-job-interview-with-a-meddic-company)", difficulty: 4 },

  // UX Research (User Interviews)
  { id: "r-uxr-1", disciplineId: "design", competency: "User Empathy", levels: ["mid", "senior", "staff"], type: "craft",
    prompt: "How do you choose a research method, and how do you handle a stakeholder who dismisses your findings?",
    guidance: "Match method to question (generative vs evaluative, qual vs quant), rigor, and influencing with evidence + empathy.",
    source: "User Interviews — common UX research interview questions (https://www.userinterviews.com/blog/common-ux-research-job-interview-questions-how-to-answer-them)", difficulty: 3 },

  // ═══════════════ PRODUCT MANAGEMENT — DEEP SET (framework-backed, leveled) ═══════════════
  // ── Product Sense / Design (CIRCLES method) ──
  { id: "pm-d-sense-1", disciplineId: "product", competency: "Product Sense", levels: ["junior", "mid", "senior"], type: "case",
    prompt: "Design an alarm clock for people who are visually impaired. Walk me through your thinking.",
    guidance: "Use CIRCLES: Comprehend the situation, Identify the user, Report needs, Cut through prioritization, List solutions, Evaluate tradeoffs, Summarize. Strong: a sharp persona, prioritized needs, and a clear v1 with a metric.",
    source: "Decode and Conquer / The Product Manager Interview (Lewis C. Lin) — CIRCLES method", difficulty: 3 },
  { id: "pm-d-sense-2", disciplineId: "product", competency: "Product Sense", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "Pick a product you love. What's the single most important improvement you'd make, and how would you validate it?",
    guidance: "Real user insight, a focused improvement (not a laundry list), a hypothesis, a validation plan (experiment/research), and a success metric with a guardrail.",
    source: "Cracking the PM Interview (McDowell & Bavaro); Exponent (https://www.tryexponent.com/guides/google-product-manager-interview)", difficulty: 3 },
  { id: "pm-d-sense-3", disciplineId: "product", competency: "Product Sense", levels: ["senior", "staff", "manager"], type: "case",
    prompt: "How would you design the next product or feature for our company to drive its next phase of growth?",
    guidance: "Company mission → user problem → market opportunity → a bet with a clear thesis. Strong: ties to the business model and a measurable growth lever.",
    source: "Exponent — Google PM interview guide (https://www.tryexponent.com/guides/google-product-manager-interview)", difficulty: 4 },

  // ── Metrics / Analytical / RCA (AARM, HEART) ──
  { id: "pm-d-metric-1", disciplineId: "product", competency: "Analytical Thinking", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "How would you measure the success of [a feature like Stories / comments / a referral program]?",
    guidance: "Tie to the goal, then a metric tree: acquisition, activation, engagement, retention, revenue (AARM) or Google's HEART. Pick ONE primary metric + guardrails. Avoid vanity metrics.",
    source: "Lewis C. Lin (AARM metrics); Google HEART framework (Kerr et al.)", difficulty: 3 },
  { id: "pm-d-metric-2", disciplineId: "product", competency: "Analytical Thinking", levels: ["senior", "staff", "manager"], type: "case",
    prompt: "A core engagement metric dropped 15% in one region only over two weeks. How do you root-cause it?",
    guidance: "Clarify metric & segment, internal (release, bug, logging) vs external (seasonality, competitor, event), funnel/cohort isolation, hypotheses → validation. Strong: a structured tree, not guesses.",
    source: "Cracking the PM Interview; Exponent metric-debugging frameworks", difficulty: 4 },
  { id: "pm-d-est-1", disciplineId: "product", competency: "Analytical Thinking", levels: ["mid", "senior"], type: "case",
    prompt: "Estimate the market size / how many [e.g. ride-share trips happen in NYC] per day.",
    guidance: "Top-down or bottom-up, state assumptions explicitly, segment the population, sanity-check the order of magnitude. Strong: clear structure and reasonable numbers, not the 'right' answer.",
    source: "Decode and Conquer (Lewis C. Lin); RocketBlocks PM estimation", difficulty: 3 },

  // ── Execution / Prioritization / Trade-offs ──
  { id: "pm-d-exec-1", disciplineId: "product", competency: "Execution", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "You're about to launch but QA finds a non-critical bug. Do you ship or slip? Walk me through the decision.",
    guidance: "Frame the tradeoff (user impact, severity, reversibility, commitments), data needed, stakeholders, and a defensible call with a mitigation. Strong: a decision framework, not a gut feel.",
    source: "Exponent — PM execution questions; Cracking the PM Interview", difficulty: 3 },
  { id: "pm-d-exec-2", disciplineId: "product", competency: "Execution", levels: ["senior", "staff", "manager"], type: "behavioral",
    prompt: "Tell me about a time you used data to make a difficult prioritization or trade-off decision.",
    guidance: "A real framework (RICE/ICE/cost-of-delay), the data, the tradeoff, stakeholder alignment, and the outcome. Strong: quantified impact.",
    source: "Intercom RICE (https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/); IGotAnOffer PM behavioral", difficulty: 4 },

  // ── Strategy (senior/GPM/Director/VP) ──
  { id: "pm-d-strat-1", disciplineId: "product", competency: "Strategic Thinking", levels: ["staff", "manager", "senior-manager", "director", "senior-director", "vp"], type: "strategy",
    prompt: "Should our company enter [an adjacent market]? Build, buy, or partner — and why?",
    guidance: "Market attractiveness, right-to-win, strategic fit, build/buy/partner tradeoffs, risks, and a recommendation with leading indicators. Strong: a clear POV, not 'it depends'.",
    source: "Playing to Win (Lafley & Martin); IGotAnOffer — product leader interview prep (https://igotanoffer.com/blogs/product-manager/product-leader-interview-prep)", difficulty: 5 },
  { id: "pm-d-strat-2", disciplineId: "product", competency: "Strategic Thinking", levels: ["director", "senior-director", "vp"], type: "strategy",
    prompt: "What is our company's biggest strategic threat over the next 3 years, and how would you position the product org to respond?",
    guidance: "Market/competitive insight, a prioritized threat, a strategic response, org/resourcing implications, and measurable milestones. Director+ scope.",
    source: "Good Strategy Bad Strategy (Rumelt); IGotAnOffer product leader prep", difficulty: 5 },
  { id: "pm-d-strat-3", disciplineId: "product", competency: "Strategic Thinking", levels: ["senior", "staff", "manager", "director"], type: "case",
    prompt: "How would you grow [a specific product]'s key metric by 20% in the next year?",
    guidance: "Growth-loop / funnel framing, identify the highest-leverage lever, a portfolio of bets sized by impact/effort, and how you'd measure. Strong: not just 'more marketing'.",
    source: "Reforge growth loops; Lenny's Newsletter (https://www.lennysnewsletter.com/p/my-favorite-pm-interview-questions)", difficulty: 4 },

  // ── Behavioral / Leadership (senior → VP) ──
  { id: "pm-d-beh-1", disciplineId: "product", competency: "Stakeholder Influence", levels: ["mid", "senior", "staff", "manager"], type: "behavioral",
    prompt: "Tell me about a time you influenced engineering or design to adopt your direction without formal authority.",
    guidance: "Shared goals, data + narrative, listening to their constraints, and a concrete win. Strong: you changed a mind, not 'pulled rank'.",
    source: "IGotAnOffer — PM behavioral questions (https://igotanoffer.com/blogs/product-manager/behavioral-interview-questions-tech-companies)", difficulty: 3 },
  { id: "pm-d-beh-2", disciplineId: "product", competency: "Execution", levels: ["mid", "senior", "staff"], type: "behavioral",
    prompt: "Tell me about a product or feature that failed. What happened and what did you learn?",
    guidance: "Genuine ownership, the root cause, specific lessons, and evidence you applied them later. Red flag: blaming others or a non-failure.",
    source: "Cracking the PM Interview; IGotAnOffer PM behavioral", difficulty: 3 },
  { id: "pm-d-beh-3", disciplineId: "product", competency: "People Leadership", levels: ["manager", "senior-manager", "director", "senior-director"], type: "leadership",
    prompt: "How do you set product vision and strategy for your team, and keep PMs aligned and growing?",
    guidance: "Vision-setting process, how it cascades to roadmaps/OKRs, coaching PMs, and measuring both outcomes and team health. Director+ scope.",
    source: "IGotAnOffer — product leader interview prep (https://igotanoffer.com/blogs/product-manager/product-leader-interview-prep); Empowered (Cagan)", difficulty: 5 },
  { id: "pm-d-beh-4", disciplineId: "product", competency: "People Leadership", levels: ["director", "senior-director", "vp"], type: "leadership",
    prompt: "How have you built or scaled a product organization — hiring, leveling, and culture?",
    guidance: "Org design, hiring bar and process, leveling/career frameworks, product culture/operating model, and measurable outcomes.",
    source: "Empowered (Marty Cagan & Chris Jones); IGotAnOffer product leader prep", difficulty: 5 },

  // ── Technical PM ──
  { id: "pm-d-tech-1", disciplineId: "product", competency: "Communication", levels: ["mid", "senior", "staff"], type: "technical",
    prompt: "Explain what an API is to a non-technical stakeholder, then tell me how you'd decide between building a feature in-house vs using a third-party API.",
    guidance: "A clear analogy, then a build-vs-buy framework (cost, speed, control, risk, core vs context). Strong: ties the technical choice to product strategy.",
    source: "Cracking the PM Interview (technical PM); Swipe to Unlock", difficulty: 3 },

  // ═══════════════ RESEARCH-SOURCED — PASS 2 (gaps: Design/Marketing/Ops, leveled senior) ═══════════════
  // Design / UX — NN/g (use STAR for behavioral, METEOR for situational)
  { id: "r2-des-1", disciplineId: "design", competency: "Collaboration", levels: ["mid", "senior", "staff"], type: "behavioral",
    prompt: "Tell me about a time you had to compromise with the development team on a feature's design. How did you resolve it?",
    guidance: "Answer with STAR and quantify the result. Strong: shared goals, the constraint, your specific actions, and a resolution that preserved craft and the relationship.",
    source: "NN/g — How to Answer UX Job Interview Questions (https://www.nngroup.com/articles/answer-ux-job-interview-questions/)", difficulty: 3 },
  { id: "r2-uxr-1", disciplineId: "design", competency: "Communication", levels: ["mid", "senior", "staff"], type: "behavioral",
    prompt: "Describe a time you presented research insights to stakeholders. How did you prepare and what were the results?",
    guidance: "STAR; tailoring to the audience, turning findings into decisions, and a measurable outcome (a decision changed, a metric moved).",
    source: "NN/g — How to Answer UX Job Interview Questions (https://www.nngroup.com/articles/answer-ux-job-interview-questions/)", difficulty: 3 },
  { id: "r2-uxr-2", disciplineId: "design", competency: "User Empathy", levels: ["mid", "senior"], type: "technical",
    prompt: "How do you choose the best research method to inform a decision — and when shouldn't you do research at all?",
    guidance: "Work backwards from the decision, not forwards from your favorite method. Match generative vs evaluative, qual vs quant; know when existing evidence is enough.",
    source: "User Interviews — UX research interview questions (https://www.userinterviews.com/blog/common-ux-research-job-interview-questions-how-to-answer-them)", difficulty: 3 },
  { id: "r2-des-crit-1", disciplineId: "design", competency: "Critique & Iteration", levels: ["junior", "mid", "senior"], type: "case",
    prompt: "Open Google Maps (or Spotify). Why was it designed this way, and what would you improve from a UX standpoint?",
    guidance: "Infer the design intent and constraints, critique against heuristics, prioritize improvements by user impact, and note what you'd test.",
    source: "Exponent — UX Designer interview guide (https://www.tryexponent.com/blog/ux-designer-interview)", difficulty: 3 },

  // Marketing — PMM & Growth (Exponent)
  { id: "r2-pmm-1", disciplineId: "marketing", competency: "Marketing Strategy", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "How would you price a mid-segment phone with improved cameras that costs more to produce?",
    guidance: "Identify target personas, assess willingness-to-pay, choose a pricing model, and explore revenue-offset strategies. Tie price to positioning.",
    source: "Exponent — Product Marketing Manager interview questions (https://www.tryexponent.com/blog/top-product-marketing-manager-interview-questions)", difficulty: 4 },
  { id: "r2-pmm-2", disciplineId: "marketing", competency: "Analytical Thinking", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "How would you measure the success of a go-to-market strategy?",
    guidance: "A Research → Planning → Execution GTM framework; pick leading + lagging metrics across funnel stages; tie to the launch goal with guardrails.",
    source: "Exponent — Product Marketing Manager interview questions (https://www.tryexponent.com/blog/top-product-marketing-manager-interview-questions)", difficulty: 4 },
  { id: "r2-growth-1", disciplineId: "marketing", competency: "Analytical Thinking", levels: ["mid", "senior"], type: "behavioral",
    prompt: "Walk me through a growth experiment you designed and ran with product, engineering, and design. How did you use funnel data?",
    guidance: "Hypothesis from funnel data, experiment design (metric, guardrails, sizing), cross-functional execution, result, and the learning. Strong: rigor + iteration.",
    source: "Exponent — Growth Marketing questions (https://www.tryexponent.com/questions?role=growth-marketing-manager)", difficulty: 3 },

  // Operations — Strategy & Operations (IGotAnOffer, Google S&O)
  { id: "r2-ops-1", disciplineId: "operations", competency: "Analytical Problem Solving", levels: ["mid", "senior", "manager"], type: "behavioral",
    prompt: "Tell me about a time you faced ambiguity and had to come up with a creative solution.",
    guidance: "Explain the solution, step through implementation, and focus on YOUR contribution. Strong: structure amid ambiguity and a measurable outcome.",
    source: "IGotAnOffer — Google Strategy & Operations interview (https://igotanoffer.com/en/advice/Google-strategy-and-operations-interview)", difficulty: 3 },
  { id: "r2-ops-2", disciplineId: "operations", competency: "Cross-functional Influence", levels: ["senior", "manager", "senior-manager"], type: "behavioral",
    prompt: "Describe a project where you had to reconcile your point of view with that of another key stakeholder.",
    guidance: "Seek to understand, find shared goals, use data, and reach a durable resolution — not a win/lose. Show the relationship outcome.",
    source: "IGotAnOffer — Google Strategy & Operations interview (https://igotanoffer.com/en/advice/Google-strategy-and-operations-interview)", difficulty: 4 },

  // Engineering management — people-management (IGotAnOffer EM)
  { id: "r2-em-1", disciplineId: "engineering", competency: "People Leadership", levels: MGMT, type: "leadership",
    prompt: "How do you handle a low performer, and (separately) how do you keep a high performer engaged?",
    guidance: "Low: diagnose (skill vs will vs fit), clear plan, support, honest timeline. High: stretch, autonomy, growth path, recognition. Strong: concrete cadence.",
    source: "IGotAnOffer — Engineering Manager interviews (https://igotanoffer.com/blogs/tech/engineering-manager-interviews)", difficulty: 4 },
  { id: "r2-em-2", disciplineId: "engineering", competency: "People Leadership", levels: SENIOR_LEADERS, type: "leadership",
    prompt: "How would you grow a team 10×? Walk me through hiring, structure, and maintaining quality.",
    guidance: "Hiring bar/process, team topology, leveling, onboarding, preserving culture and quality at scale, and the risks of fast growth.",
    source: "IGotAnOffer — Engineering Manager interviews (https://igotanoffer.com/blogs/tech/engineering-manager-interviews)", difficulty: 5 },

  // Senior system design with explicit rubric (interviewing.io, L5)
  { id: "r2-sd-1", disciplineId: "engineering", competency: "Technical Depth", levels: ["senior", "staff"], type: "system-design",
    prompt: "Design a 'free food' giveaway: 6M burgers in 10 minutes, users tap a button to claim, no one gets more than one, and we must not over-promise beyond 6M.",
    guidance: "Rubric: scope functional + non-functional requirements; an Estimations section (QPS, storage); API design BEFORE high-level architecture; explicit trade-off pros/cons; handle the distributed-counter/race condition.",
    source: "interviewing.io — Google L5 system design mock (https://interviewing.io/mocks/google-system-design-design-a-free-food-app)", difficulty: 5 },

  // ═══════════════ RESEARCH-SOURCED — PASS 3 (deep PM: company flavors + senior strategy) ═══════════════
  { id: "r3-pm-meta-1", disciplineId: "product", competency: "Analytical Thinking", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "How would you pick the North Star metric for Facebook Events (or Reels), and what inputs would you track?",
    guidance: "Use GAME (Goals, Actions, Metrics, Evaluation): tie to the product goal, choose a value-capturing NSM, then 2-4 input metrics + a counter-metric/guardrail. Meta values analytical rigor.",
    source: "Exponent — Meta PM interview guide (https://www.tryexponent.com/guides/meta-pm-interview); Amplitude North Star", difficulty: 4 },
  { id: "r3-pm-rca-1", disciplineId: "product", competency: "Analytical Thinking", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "Instagram engagement is down 10%. How do you find out why?",
    guidance: "Build a MECE internal-vs-external tree: internal (release, bug, logging, ranking change) vs external (seasonality, competitor, event, platform). Clarify metric/segment first, then isolate via funnel/cohort.",
    source: "Exponent — Google PM interview guide (https://www.tryexponent.com/guides/google-product-manager-interview)", difficulty: 4 },
  { id: "r3-pm-strat-1", disciplineId: "product", competency: "Strategic Thinking", levels: ["staff", "manager", "senior-manager", "director", "senior-director", "vp"], type: "strategy",
    prompt: "How would you grow Google (or our core product) 5×? Where would the growth come from?",
    guidance: "Six-step strategy scaffold + Porter: assess the market & moat, identify the biggest levers (new segments, geos, adjacencies, monetization), size bets, and recommend with leading indicators. Director+ depth.",
    source: "Exponent — product strategy questions (https://www.tryexponent.com/blog/product-strategy-interview-questions); IGotAnOffer product-leader prep", difficulty: 5 },
  { id: "r3-pm-strat-2", disciplineId: "product", competency: "Strategic Thinking", levels: ["senior", "staff", "manager", "director", "senior-director"], type: "strategy",
    prompt: "A strong competitor (e.g. Apple TV vs Netflix, or TikTok) is taking share. How should we respond?",
    guidance: "Diagnose their wedge and our right-to-win, segment the threat, choose a response (differentiate / fast-follow / new moat), and sequence it. Use Porter's Five Forces. Strong: a clear POV with risks.",
    source: "Exponent — product strategy questions (https://www.tryexponent.com/blog/product-strategy-interview-questions)", difficulty: 5 },
  { id: "r3-pm-lead-1", disciplineId: "product", competency: "People Leadership", levels: ["manager", "senior-manager", "director", "senior-director", "vp"], type: "leadership",
    prompt: "Tell me about the hardest people decision you've made as a product leader (e.g. managing out a PM, resolving a leadership conflict).",
    guidance: "Ownership, fairness and process, the human handling, and the outcome for the team. Strong: hard call made with empathy and clear reasoning.",
    source: "IGotAnOffer — product leader interview prep (https://igotanoffer.com/blogs/product-manager/product-leader-interview-prep)", difficulty: 5 },
  { id: "r3-pm-amz-1", disciplineId: "product", competency: "Execution", levels: ["mid", "senior", "staff", "manager"], type: "behavioral",
    prompt: "Tell me about a time you had to make a decision with incomplete data and were later proven right or wrong. (Amazon-style)",
    guidance: "Answer with STAR mapped to Amazon Leadership Principles (e.g. Bias for Action, Are Right A Lot, Dive Deep): concrete scope, the data you had, the call, and the measurable result.",
    source: "Exponent — Amazon PM interview guide (https://www.tryexponent.com/guides/amazon-product-manager-interview)", difficulty: 4 },

  // ── PM Product Sense — Lenny's Newsletter definitive guide (user-provided source) ──
  { id: "r4-pm-sense-1", disciplineId: "product", competency: "Product Sense", levels: ["junior", "mid", "senior", "staff"], type: "case",
    prompt: "You're a PM at Meta — design a product for gardening. (Or: build a podcast product for Netflix.)",
    guidance: "5-component flow: (1) clear communication — state assumptions + game plan and align; (2) product motivation — why it matters, tie to company strategy, a mission statement; (3) segmentation — pick one segment with a vivid persona; (4) problem identification — map the journey, prioritize pains by frequency/severity; (5) solution — brainstorm, evaluate on an impact-effort matrix, define v1. Excellence in one area can't compensate for weakness in another.",
    source: "Lenny's Newsletter — The Definitive Guide to Mastering Product Sense (https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering)", difficulty: 4 },
  { id: "r4-pm-sense-2", disciplineId: "product", competency: "Product Sense", levels: ["junior", "mid", "senior"], type: "case",
    prompt: "Tell me about a product you love and how you would improve it.",
    guidance: "Don't jump to features. Establish who it's for and the mission, segment + pick a persona, find the highest frequency/severity pain, then propose a v1 chosen via impact-effort. Communicate structure throughout.",
    source: "Lenny's Newsletter — The Definitive Guide to Mastering Product Sense (https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering)", difficulty: 3 },

  // ── PM Analytical Thinking — Lenny's Newsletter definitive guide (user-provided source) ──
  { id: "r4-pm-analytic-1", disciplineId: "product", competency: "Analytical Thinking", levels: ["mid", "senior", "staff"], type: "case",
    prompt: "What should be the North Star metric for DoorDash (or Spotify / Instagram Reels), and how would you measure success?",
    guidance: "4-step: (1) assumptions + game plan; (2) product rationale — context, maturity, business model, competitive position, mission; (3) metric framework — map ecosystem players, define implementable metrics with timeframes, pick a NSM that can grow indefinitely and CAN'T be gamed (avoid averages/ratios), add guardrails for its weaknesses; (4) bridge to goal-setting. Strong: a cohesive 'healthy growth' story, not a vanity metric.",
    source: "Lenny's Newsletter — The Definitive Guide to Mastering Analytical Thinking (https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering-f81)", difficulty: 4 },
  { id: "r4-pm-analytic-2", disciplineId: "product", competency: "Analytical Thinking", levels: ["senior", "staff", "manager"], type: "case",
    prompt: "You're a PM at Meta — set a goal for Instagram Reels for the next 6 months.",
    guidance: "Tie the goal to the NSM and product maturity; make it specific and time-bound; name the input metrics that drive it and the guardrails that protect quality. Strong: realistic target with the reasoning, not a round number.",
    source: "Lenny's Newsletter — The Definitive Guide to Mastering Analytical Thinking (https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering-f81)", difficulty: 4 },
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
