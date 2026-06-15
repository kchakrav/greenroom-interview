// Concept Q&A — multiple-choice questions to learn theory/concepts before
// interviewing. Optional prep phase. Curated + source-attributed; a live model
// can also generate fresh questions when an API key is present.

export interface MCQ {
  id: string;
  disciplineId: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export const QUIZ_BANK: MCQ[] = [
  // ───── Engineering: Technical Depth / DS&A ─────
  { id: "q-eng-1", disciplineId: "engineering", topic: "Technical Depth",
    question: "What is the average time complexity of a lookup in a hash table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctIndex: 0,
    explanation: "Hash tables give amortized O(1) lookups; worst case is O(n) with many collisions.",
    source: "Cracking the Coding Interview (McDowell)" },
  { id: "q-eng-2", disciplineId: "engineering", topic: "Technical Depth",
    question: "Which data structure best implements a LIFO order?",
    options: ["Queue", "Stack", "Heap", "Linked list (tail-insert)"], correctIndex: 1,
    explanation: "A stack is Last-In-First-Out; a queue is First-In-First-Out.",
    source: "Elements of Programming Interviews" },
  { id: "q-eng-3", disciplineId: "engineering", topic: "Technical Depth",
    question: "Binary search requires the input to be…",
    options: ["A hash set", "Sorted", "A linked list", "Of even length"], correctIndex: 1,
    explanation: "Binary search halves a SORTED range each step, giving O(log n).",
    source: "Cracking the Coding Interview" },
  // ───── Engineering: System Design ─────
  { id: "q-sd-1", disciplineId: "engineering", topic: "System Design",
    question: "In the CAP theorem, during a network partition a system must choose between…",
    options: ["Consistency and Availability", "Latency and Throughput", "Caching and Sharding", "SQL and NoSQL"], correctIndex: 0,
    explanation: "Under a partition (P), you trade off Consistency vs Availability.",
    source: "Designing Data-Intensive Applications (Kleppmann)" },
  { id: "q-sd-2", disciplineId: "engineering", topic: "System Design",
    question: "What is the main purpose of a load balancer?",
    options: ["Encrypt traffic", "Distribute requests across servers", "Store sessions", "Compress responses"], correctIndex: 1,
    explanation: "Load balancers spread traffic across instances for scale and availability.",
    source: "System Design Interview (Alex Xu)" },
  { id: "q-sd-3", disciplineId: "engineering", topic: "System Design",
    question: "A write-heavy feed system often prefers which fan-out strategy for most users?",
    options: ["Fan-out on read", "Fan-out on write", "No fan-out", "Synchronous replication"], correctIndex: 1,
    explanation: "Fan-out on write precomputes feeds for fast reads; the celebrity/hot-user case is the exception.",
    source: "System Design Interview (Alex Xu)" },
  // ───── Engineering leadership ─────
  { id: "q-em-1", disciplineId: "engineering", topic: "People Leadership",
    question: "Per 'The Manager's Path', a 1:1 is primarily for…",
    options: ["Status updates only", "The report's growth and concerns", "Assigning tickets", "Performance ratings"], correctIndex: 1,
    explanation: "1:1s are the report's time — growth, blockers, feedback — not a status meeting.",
    source: "The Manager's Path (Camille Fournier)" },
  { id: "q-em-2", disciplineId: "engineering", topic: "People Leadership",
    question: "Conway's Law says system design tends to mirror…",
    options: ["The CEO's preferences", "The org's communication structure", "The programming language", "The cloud provider"], correctIndex: 1,
    explanation: "Conway's Law: systems reflect the communication structures of the organizations that build them.",
    source: "An Elegant Puzzle (Will Larson); Team Topologies" },

  // ───── Product: Product Sense / Metrics ─────
  { id: "q-pm-1", disciplineId: "product", topic: "Product Sense",
    question: "A good North Star Metric primarily reflects…",
    options: ["Revenue this quarter", "Value delivered to users", "Number of features shipped", "Team headcount"], correctIndex: 1,
    explanation: "The North Star captures the value users get; revenue tends to follow it.",
    source: "Amplitude North Star Playbook" },
  { id: "q-pm-2", disciplineId: "product", topic: "Product Sense",
    question: "In an MVP, the 'minimum' should still be…",
    options: ["Feature-complete", "Viable — delivering real user value", "Bug-free and polished", "Profitable"], correctIndex: 1,
    explanation: "An MVP is the smallest thing that delivers and validates real value with users.",
    source: "Inspired (Marty Cagan); The Lean Startup (Ries)" },
  { id: "q-pm-3", disciplineId: "product", topic: "Execution",
    question: "In RICE prioritization, RICE stands for Reach, Impact, Confidence, and…",
    options: ["Effort", "Engagement", "Equity", "Efficiency"], correctIndex: 0,
    explanation: "RICE = (Reach × Impact × Confidence) / Effort.",
    source: "Intercom RICE framework" },
  { id: "q-pm-4", disciplineId: "product", topic: "Analytical Thinking",
    question: "If DAU drops suddenly, the FIRST step is usually to…",
    options: ["Ship a fix", "Clarify the metric and segment the drop", "Email leadership", "Run an A/B test"], correctIndex: 1,
    explanation: "Define the metric precisely and isolate where the drop is before hypothesizing causes.",
    source: "Cracking the PM Interview; Exponent" },

  // ───── Data / ML ─────
  { id: "q-data-1", disciplineId: "data", topic: "Analytical Rigor",
    question: "A 95% confidence interval means…",
    options: ["95% chance the true value is in this interval", "If we repeated the study, ~95% of such intervals would contain the true value", "The result is 95% accurate", "p < 0.05 always"], correctIndex: 1,
    explanation: "It's a statement about the procedure across repetitions, not the probability for one interval.",
    source: "Practical Statistics for Data Scientists; StatQuest" },
  { id: "q-data-2", disciplineId: "data", topic: "Experiment Design",
    question: "'Peeking' at A/B results and stopping when significant tends to…",
    options: ["Improve power", "Inflate the false-positive rate", "Reduce sample size needed safely", "Have no effect"], correctIndex: 1,
    explanation: "Repeated significance testing without correction inflates Type-I error.",
    source: "Trustworthy Online Controlled Experiments (Kohavi)" },
  { id: "q-data-3", disciplineId: "data", topic: "Analytical Rigor",
    question: "Optimizing a classifier purely for accuracy is risky when…",
    options: ["Classes are balanced", "Classes are highly imbalanced", "You have lots of data", "Features are numeric"], correctIndex: 1,
    explanation: "With imbalance, accuracy is misleading; use precision/recall, F1, or PR-AUC.",
    source: "Designing Machine Learning Systems (Chip Huyen)" },

  // ───── Design ─────
  { id: "q-des-1", disciplineId: "design", topic: "Craft",
    question: "Jakob Nielsen's heuristics include 'recognition rather than recall', which means…",
    options: ["Hide options to reduce clutter", "Make options/actions visible so users needn't remember", "Use long forms", "Prefer text over icons"], correctIndex: 1,
    explanation: "Minimize memory load by making information and actions visible.",
    source: "NN/g 10 Usability Heuristics (Jakob Nielsen)" },
  { id: "q-des-2", disciplineId: "design", topic: "User Empathy",
    question: "A usability test with how many users typically surfaces most major issues?",
    options: ["1", "~5", "30", "100+"], correctIndex: 1,
    explanation: "Nielsen's research: ~5 users uncover the majority of usability problems per round.",
    source: "NN/g (Nielsen) 'Why You Only Need to Test with 5 Users'" },

  // ───── Sales ─────
  { id: "q-sales-1", disciplineId: "sales", topic: "Discovery",
    question: "In SPIN selling, the 'I' stands for…",
    options: ["Interest", "Implication", "Introduction", "Investment"], correctIndex: 1,
    explanation: "SPIN = Situation, Problem, Implication, Need-payoff questions.",
    source: "SPIN Selling (Neil Rackham)" },
  { id: "q-sales-2", disciplineId: "sales", topic: "Business Acumen",
    question: "The Challenger Sale argues the best reps primarily…",
    options: ["Build rapport and wait", "Teach, tailor, and take control", "Discount early", "Avoid pushing back"], correctIndex: 1,
    explanation: "Challengers teach the customer something new, tailor the message, and assert control.",
    source: "The Challenger Sale (Dixon & Adamson)" },

  // ───── Marketing ─────
  { id: "q-mkt-1", disciplineId: "marketing", topic: "Marketing Strategy",
    question: "April Dunford's positioning starts from…",
    options: ["Your feature list", "Competitive alternatives customers would choose", "Your logo and brand", "The pricing page"], correctIndex: 1,
    explanation: "Positioning is relative: start from the alternatives, then your unique value for a segment.",
    source: "Obviously Awesome (April Dunford)" },

  // ───── Operations ─────
  { id: "q-ops-1", disciplineId: "operations", topic: "Process & Execution",
    question: "In the Theory of Constraints, you improve throughput by first…",
    options: ["Optimizing every step equally", "Finding and relieving the bottleneck", "Adding more people everywhere", "Cutting the cheapest step"], correctIndex: 1,
    explanation: "Throughput is governed by the constraint; focus there first.",
    source: "The Goal (Eliyahu Goldratt)" },

  // ───── General behavioral concept ─────
  { id: "q-gen-1", disciplineId: "general", topic: "Communication",
    question: "The STAR method structures answers as…",
    options: ["Story, Theme, Action, Recap", "Situation, Task, Action, Result", "Setup, Tension, Answer, Reflection", "Summary, Tactic, Analysis, Result"], correctIndex: 1,
    explanation: "STAR = Situation, Task, Action, Result — the backbone of strong behavioral answers.",
    source: "STAR method; structured-interview research (Levashina 2014)" },
  { id: "q-gen-2", disciplineId: "general", topic: "Problem Solving",
    question: "Research on hiring shows which interview type is most predictive and least biased?",
    options: ["Unstructured chats", "Structured interviews with anchored rating scales", "Resume review only", "Brainteasers"], correctIndex: 1,
    explanation: "Structured interviews with behaviorally-anchored scales are the gold standard (higher validity, less adverse impact).",
    source: "Levashina et al. 2014; Taylor & Small 2002" },
];

export interface QuizFilter { disciplineId?: string; topic?: string; }

export function quizQuestions(f: QuizFilter, count = 6): MCQ[] {
  let pool = QUIZ_BANK.filter((m) =>
    (!f.disciplineId || f.disciplineId === "all" || m.disciplineId === f.disciplineId || m.disciplineId === "general") &&
    (!f.topic || f.topic === "all" || m.topic === f.topic)
  );
  if (pool.length < 3) pool = QUIZ_BANK.filter((m) => !f.disciplineId || m.disciplineId === f.disciplineId || m.disciplineId === "general");
  return pool.slice(0, count);
}

export function quizTopics(disciplineId?: string): string[] {
  const pool = QUIZ_BANK.filter((m) => !disciplineId || disciplineId === "all" || m.disciplineId === disciplineId || m.disciplineId === "general");
  return Array.from(new Set(pool.map((m) => m.topic))).sort();
}
