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

  // ───── Research-sourced (link-cited, deep-research pass) ─────
  { id: "rq-pm-rice", disciplineId: "product", topic: "Execution",
    question: "In the RICE score, how is it calculated?",
    options: ["Reach + Impact + Confidence + Effort", "(Reach × Impact × Confidence) ÷ Effort", "Reach × Impact ÷ (Confidence × Effort)", "(Reach + Impact) × Confidence ÷ Effort"], correctIndex: 1,
    explanation: "RICE = (Reach × Impact × Confidence) ÷ Effort — Effort is the divisor, so lower effort raises the score.",
    source: "Intercom (originator of RICE) — https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/" },
  { id: "rq-pm-rice2", disciplineId: "product", topic: "Execution",
    question: "On Intercom's RICE Impact scale, what value represents 'massive' impact?",
    options: ["1", "2", "3", "0.5"], correctIndex: 2,
    explanation: "Impact uses a discrete scale: 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal.",
    source: "Intercom — https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/" },
  { id: "rq-mkt-pos", disciplineId: "marketing", topic: "Marketing Strategy",
    question: "April Dunford's positioning exercise begins by telling you to…",
    options: ["List every feature", "Let go of where you came from (your existing self-perception)", "Pick a price", "Choose a logo"], correctIndex: 1,
    explanation: "Step 1 is to let go of your existing notion of what the product is, so you can position it freshly for the best market.",
    source: "April Dunford — https://www.aprildunford.com/post/a-product-positioning-exercise" },
  { id: "rq-sd-cap", disciplineId: "engineering", topic: "System Design",
    question: "CAP theorem: during a network partition, a distributed system must sacrifice…",
    options: ["Performance or cost", "Consistency or Availability", "Durability or Latency", "Reads or Writes"], correctIndex: 1,
    explanation: "When a partition (P) occurs, you must choose between Consistency and Availability — you can't have both.",
    source: "Hello Interview — CAP theorem (https://www.hellointerview.com/learn/system-design/core-concepts/cap-theorem)" },
  { id: "rq-data-peek", disciplineId: "data", topic: "Experiment Design",
    question: "A common A/B testing mistake is 'peeking' — repeatedly checking and stopping when significant. This…",
    options: ["Is fine if you check daily", "Inflates the false-positive (Type I error) rate", "Increases statistical power", "Only matters for small samples"], correctIndex: 1,
    explanation: "Repeated significance testing without correction dramatically inflates false positives; fix the sample size or use sequential methods.",
    source: "CXL — A/B testing mistakes (https://cxl.com/blog/12-ab-split-testing-mistakes-i-see-businesses-make-all-the-time/); Kohavi et al." },
  { id: "rq-gen-star", disciplineId: "general", topic: "Communication",
    question: "The behavioral-interview format rests on which principle?",
    options: ["Hypothetical reasoning predicts performance", "Past behavior is the best predictor of future behavior", "IQ predicts everything", "Confidence predicts competence"], correctIndex: 1,
    explanation: "Behavioral-description questions (answered with STAR) rest on behavioral consistency — past behavior predicts future behavior.",
    source: "U.S. OPM — Structured Interviews (https://www.opm.gov/policy-data-oversight/assessment-and-selection/other-assessment-methods/structured-interviews/)" },
  { id: "rq-gen-valid", disciplineId: "general", topic: "Problem Solving",
    question: "In Sackett et al. (2022), structured interviews had a mean validity of about…",
    options: [".10", ".25", ".42", ".75"], correctIndex: 2,
    explanation: "Structured interviews showed the highest mean validity (~.42) among top selection predictors, with lower adverse impact than most.",
    source: "Cambridge / Sackett et al. 2022 (https://www.cambridge.org/core/journals/industrial-and-organizational-psychology/article/structured-interviews-moving-beyond-mean-validity/7CB1F7C86CB0D15328B3F07AD5F964E2)" },

  // ───── Product Management concept set (frameworks PMs are tested on) ─────
  { id: "pmq-circles", disciplineId: "product", topic: "Product Sense",
    question: "In Lewis Lin's CIRCLES method for product design questions, what does the first 'C' stand for?",
    options: ["Compete", "Comprehend the situation", "Customer", "Cut features"], correctIndex: 1,
    explanation: "CIRCLES = Comprehend the situation, Identify the customer, Report needs, Cut through prioritization, List solutions, Evaluate tradeoffs, Summarize.",
    source: "Decode and Conquer (Lewis C. Lin)" },
  { id: "pmq-heart", disciplineId: "product", topic: "Analytical Thinking",
    question: "Google's HEART framework for UX metrics stands for Happiness, Engagement, Adoption, Retention, and…",
    options: ["Revenue", "Reach", "Task success", "Trust"], correctIndex: 2,
    explanation: "HEART = Happiness, Engagement, Adoption, Retention, Task success — paired with Goals-Signals-Metrics.",
    source: "Google (Kerr, Rodden et al.) — HEART framework" },
  { id: "pmq-aarrr", disciplineId: "product", topic: "Analytical Thinking",
    question: "The AARRR 'pirate metrics' funnel is Acquisition, Activation, Retention, Referral, and…",
    options: ["Reach", "Revenue", "Reactivation", "Ranking"], correctIndex: 1,
    explanation: "AARRR = Acquisition, Activation, Retention, Referral, Revenue (Dave McClure / 500 Startups).",
    source: "Dave McClure — Startup Metrics for Pirates (AARRR)" },
  { id: "pmq-northstar", disciplineId: "product", topic: "Product Sense",
    question: "A well-chosen North Star Metric should primarily…",
    options: ["Maximize quarterly revenue", "Capture the core value customers get from the product", "Count features shipped", "Track headcount"], correctIndex: 1,
    explanation: "The North Star reflects delivered customer value; sustainable revenue tends to follow it. Pair with input metrics.",
    source: "Amplitude North Star Playbook; Reforge" },
  { id: "pmq-jtbd", disciplineId: "product", topic: "Product Sense",
    question: "The 'Jobs To Be Done' lens says customers fundamentally…",
    options: ["Buy products for their features", "'Hire' a product to make progress in a situation", "Choose by brand loyalty", "Pick the cheapest option"], correctIndex: 1,
    explanation: "JTBD: people hire products to get a 'job' done; focus on the underlying progress, not demographics or features.",
    source: "Clayton Christensen — Competing Against Luck (JTBD)" },

  // ───── Research-sourced — pass 2 (data/stats primary sources) ─────
  { id: "rq-data-srm", disciplineId: "data", topic: "Experiment Design",
    question: "In an A/B test, a Sample Ratio Mismatch (SRM) means…",
    options: ["The test reached significance early", "The observed split between variants differs significantly from the configured split", "The sample was too small", "Both variants performed equally"], correctIndex: 1,
    explanation: "SRM = the actual A/B user ratio differs significantly from what was configured (detected via a chi-square test). Don't trust the result until you find the cause — it can even reverse the apparent effect.",
    source: "Microsoft Research — Diagnosing Sample Ratio Mismatch (https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/)" },
  { id: "rq-data-pval", disciplineId: "data", topic: "Analytical Rigor",
    question: "Per the ASA's 2016 statement, a p-value does NOT measure…",
    options: ["How extreme the data are under a model", "The probability that the hypothesis being studied is true", "Compatibility of data with a specified model", "Anything about the data"], correctIndex: 1,
    explanation: "A p-value is the probability of data as/more extreme under a specified model — NOT the probability the hypothesis is true, nor that results are due to chance alone.",
    source: "American Statistical Association — 2016 Statement on p-Values (https://doi.org/10.1080/00031305.2016.1154108)" },
  { id: "pmq-game", disciplineId: "product", topic: "Analytical Thinking",
    question: "Meta's 'GAME' framework for metrics/analytical PM questions stands for…",
    options: ["Goals, Actions, Metrics, Evaluation", "Growth, Acquisition, Monetization, Engagement", "Goals, Audience, Metrics, Execution", "Gather, Analyze, Measure, Execute"], correctIndex: 0,
    explanation: "GAME = Goals (what success means), Actions (user actions that drive it), Metrics (how to measure), Evaluation (interpret + guardrails).",
    source: "Exponent — Meta PM interview guide (https://www.tryexponent.com/guides/meta-pm-interview)" },
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
