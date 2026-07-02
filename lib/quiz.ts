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

  // ───── PM thought-leader frameworks ─────
  { id: "pmq-lno", disciplineId: "product", topic: "Execution",
    question: "In Shreyas Doshi's LNO framework, an 'L' (Leverage) task should be…",
    options: ["Done as fast as possible", "Done excellently — it has outsized impact", "Delegated or skipped", "Done only if time remains"], correctIndex: 1,
    explanation: "LNO = Leverage (do excellently, high ROI), Neutral (do efficiently), Overhead (do quickly / good-enough). Match effort to impact.",
    source: "Shreyas Doshi — LNO framework" },
  { id: "pmq-dhm", disciplineId: "product", topic: "Product Sense",
    question: "Gibson Biddle's DHM model says a great product strategy should…",
    options: ["Delight customers, in Hard-to-copy, Margin-enhancing ways", "Design, Hypothesize, Measure", "Discover, Headline, Market", "Differentiate, Harmonize, Monetize"], correctIndex: 0,
    explanation: "DHM = Delight customers, in Hard-to-copy (a moat), Margin-enhancing ways. Advantage must be durable and improve economics.",
    source: "Gibson Biddle — DHM product strategy model" },
  { id: "pmq-buildtrap", disciplineId: "product", topic: "Strategic Thinking",
    question: "Melissa Perri's 'build trap' is when an organization measures success by…",
    options: ["Customer outcomes and value", "Output — features and projects shipped", "Revenue per employee", "NPS alone"], correctIndex: 1,
    explanation: "The build trap = focusing on output (shipping features) instead of the outcomes/value those features create.",
    source: "Melissa Perri — Escaping the Build Trap" },
  { id: "pmq-ost", disciplineId: "product", topic: "Product Sense",
    question: "In Teresa Torres' Opportunity Solution Tree, the root node is the…",
    options: ["List of features", "Desired outcome", "Competitor analysis", "Tech stack"], correctIndex: 1,
    explanation: "OST flows: desired Outcome → Opportunities (unmet needs) → Solutions → Experiments — keeping discovery tied to a clear outcome.",
    source: "Teresa Torres — Continuous Discovery Habits" },
  { id: "pmq-cagan-risks", disciplineId: "product", topic: "Product Sense",
    question: "Marty Cagan's four big product risks are value, usability, feasibility, and…",
    options: ["Marketing", "Business viability", "Velocity", "Visibility"], correctIndex: 1,
    explanation: "Discovery tests value (will they use/buy it?), usability, feasibility (can we build it?), and business viability (does it work for the business?).",
    source: "Marty Cagan — Inspired (the four risks)" },
  { id: "pmq-captivate", disciplineId: "product", topic: "Product Sense",
    question: "In product design interviews, why is it risky to jump straight to solutions?",
    options: ["It makes the answer too short", "It skips user, problem, and success definition", "It overuses metrics", "It requires technical design"], correctIndex: 1,
    explanation: "Strong product sense starts with clarifying the goal, user segment, pain, and success metric before ideating solutions.",
    source: "Coursera PM Interview Prep Guide 2026; CIRCLES / CAPTIVATE frameworks" },
  { id: "pmq-guardrail", disciplineId: "product", topic: "Analytical Thinking",
    question: "A guardrail metric is used to…",
    options: ["Replace the primary metric", "Ensure optimizing the primary metric doesn't harm important secondary outcomes", "Track only revenue", "Avoid experiments"], correctIndex: 1,
    explanation: "Guardrails catch negative side effects, such as churn, latency, spam, or quality degradation while a primary metric improves.",
    source: "Trustworthy Online Controlled Experiments; Lenny's Newsletter analytics guide" },
  { id: "pmq-activation", disciplineId: "product", topic: "Growth",
    question: "In PLG, activation most directly measures whether a user…",
    options: ["Saw an ad", "Reached the product's first meaningful value moment", "Paid an invoice", "Contacted sales"], correctIndex: 1,
    explanation: "Activation tracks whether users reach the aha moment or first value experience, often before retention and monetization improve.",
    source: "Aakash Gupta — onboarding / PLG; Reforge activation" },
  { id: "pmq-retention-curve", disciplineId: "product", topic: "Growth",
    question: "A retention curve that flattens above zero usually suggests…",
    options: ["No one finds value", "A retained core segment may exist", "Acquisition is broken", "Pricing is too high"], correctIndex: 1,
    explanation: "A flattening curve means some users keep returning; PMs then inspect who they are and what value loop retains them.",
    source: "Reforge retention; Aakash Gupta metrics" },
  { id: "pmq-incrementality", disciplineId: "product", topic: "Experimentation",
    question: "Why use a holdout group for a referral incentive?",
    options: ["To make the experiment slower", "To estimate incremental invites beyond what would have happened anyway", "To avoid measuring retention", "To hide the incentive"], correctIndex: 1,
    explanation: "Holdouts help distinguish true incremental growth from rewarding users who would have referred without the incentive.",
    source: "Reforge growth loops; Trustworthy Online Controlled Experiments" },
  { id: "pmq-build-buy-partner", disciplineId: "product", topic: "Strategy",
    question: "In a build-buy-partner decision, the strongest reason to build in-house is usually…",
    options: ["It is always cheaper", "The capability is core to differentiation or control", "Vendors are never reliable", "It avoids roadmap tradeoffs"], correctIndex: 1,
    explanation: "Build when the capability is strategically core, creates durable advantage, or requires control unavailable through vendors.",
    source: "Playing to Win; product strategy interview practice" },
  { id: "pmq-output-outcome", disciplineId: "product", topic: "Execution",
    question: "An outcome-oriented roadmap is organized around…",
    options: ["Features shipped", "Problems, hypotheses, and metrics to move", "Engineering estimates only", "Executive requests"], correctIndex: 1,
    explanation: "Outcome roadmaps connect bets to user/business results instead of treating feature delivery as success by itself.",
    source: "Escaping the Build Trap; Inspired / Empowered" },
  { id: "pmq-opportunity-solution", disciplineId: "product", topic: "Product Sense",
    question: "In an Opportunity Solution Tree, opportunities represent…",
    options: ["Features to build", "Customer needs, pain points, or desires that could drive the outcome", "Engineering tasks", "Competitor logos"], correctIndex: 1,
    explanation: "Opportunities sit between the desired outcome and solutions, keeping discovery focused on user needs before feature ideas.",
    source: "Teresa Torres — Continuous Discovery Habits" },
  { id: "pmq-vanity", disciplineId: "product", topic: "Analytical Thinking",
    question: "A vanity metric is dangerous because it…",
    options: ["Is always hard to measure", "Looks positive but may not guide decisions or predict value", "Must be a ratio", "Only applies to marketing"], correctIndex: 1,
    explanation: "Vanity metrics can rise without improving retention, revenue, satisfaction, or any decision-making signal.",
    source: "Lean Analytics; Amplitude North Star Playbook" },
  { id: "pmq-platform", disciplineId: "product", topic: "Platform Thinking",
    question: "For a platform API, a PM should usually optimize for…",
    options: ["Internal requests only", "Adoption, reliability, developer experience, and long-term compatibility", "The largest surface area possible", "Frequent breaking changes"], correctIndex: 1,
    explanation: "Platform products succeed through trust, clear contracts, reliability, and developer productivity, not just new endpoints.",
    source: "Platform PM practice; Stripe API design principles" },
];

const SYSTEM_DESIGN_CONCEPT_MCQ: MCQ[] = [
  { id: "sdq-capacity", disciplineId: "system-design", topic: "Scalability & Capacity",
    question: "In a system design interview, why do back-of-the-envelope estimates come before choosing databases?",
    options: ["They prove the exact cloud bill", "They reveal scale, bottlenecks, and whether simple designs are sufficient", "They replace requirements", "They determine the UI"], correctIndex: 1,
    explanation: "Traffic, storage, QPS, and bandwidth estimates shape architecture choices and show the interviewer your assumptions.",
    source: "donnemartin/system-design-primer; System Design Interview practice" },
  { id: "sdq-hotkey", disciplineId: "system-design", topic: "Scalability & Capacity",
    question: "A 'hot key' problem usually means…",
    options: ["One partition receives disproportionate traffic", "Encryption keys expired", "All caches are cold", "The API key is public"], correctIndex: 0,
    explanation: "Hot keys overload a shard/cache node; mitigation includes key salting, replication, special-case routing, or fanout changes.",
    source: "Distributed systems interview practice; system-design-primer" },
  { id: "sdq-index", disciplineId: "system-design", topic: "Data Modeling & Storage",
    question: "The strongest reason to start data modeling from access patterns is that…",
    options: ["It avoids all migrations", "Storage choices depend on reads, writes, consistency, and query shapes", "SQL is always best", "Indexes are free"], correctIndex: 1,
    explanation: "Access patterns determine schema, indexes, partition keys, denormalization, and whether a relational, document, KV, or search store fits.",
    source: "Designing Data-Intensive Applications; system-design-primer" },
  { id: "sdq-cache-invalidate", disciplineId: "system-design", topic: "Caching & Performance",
    question: "Cache invalidation is hard primarily because…",
    options: ["RAM is slow", "Stale data and distributed writes make freshness/correctness tradeoffs explicit", "Caches cannot scale", "CDNs only support images"], correctIndex: 1,
    explanation: "Caching improves latency and load, but every placement needs a strategy for staleness, write-through/write-around, TTLs, and invalidation.",
    source: "Caching pattern literature; system design practice" },
  { id: "sdq-queue", disciplineId: "system-design", topic: "Queues & Streams",
    question: "A queue is most useful when you need to…",
    options: ["Make every operation synchronous", "Decouple producers from slower or bursty consumers", "Guarantee zero duplicates automatically", "Avoid retries"], correctIndex: 1,
    explanation: "Queues absorb bursts, enable async work, and isolate failures, but usually require idempotency and retry handling.",
    source: "Kafka architecture references; distributed systems practice" },
  { id: "sdq-idempotency", disciplineId: "system-design", topic: "Payments & Idempotency",
    question: "An idempotency key helps payment APIs because it…",
    options: ["Encrypts card data", "Lets retried requests avoid duplicate side effects", "Replaces fraud checks", "Makes all distributed transactions exact"], correctIndex: 1,
    explanation: "Retries are unavoidable; idempotency lets clients safely retry while the server deduplicates the business operation.",
    source: "Stripe API/idempotency references; payment backend practice" },
  { id: "sdq-slo", disciplineId: "system-design", topic: "Reliability & Observability",
    question: "An SLO should be defined around…",
    options: ["What users experience", "How many dashboards exist", "How many servers are deployed", "The team's sprint velocity"], correctIndex: 0,
    explanation: "Good SLOs reflect user-visible reliability, such as availability, latency, freshness, or correctness over a measured window.",
    source: "SRE practice; incident response interviews" },
  { id: "sdq-search", disciplineId: "system-design", topic: "Search & Indexing",
    question: "A search index is usually maintained separately from the primary database because…",
    options: ["Primary databases cannot store text", "Search serving needs inverted/vector indexes, ranking, and different freshness tradeoffs", "It removes the need for storage", "It guarantees perfect relevance"], correctIndex: 1,
    explanation: "Search systems optimize query/relevance paths separately from source-of-truth storage, often with ingestion pipelines and eventual consistency.",
    source: "Search architecture practice; system-design-primer" },
  { id: "sdq-crdt", disciplineId: "system-design", topic: "Collaboration & Conflict Resolution",
    question: "CRDTs are useful in collaborative systems because they…",
    options: ["Prevent all offline edits", "Allow concurrent replicas to merge deterministically under specific data types", "Require a single leader for every edit", "Only work for payments"], correctIndex: 1,
    explanation: "CRDTs make certain concurrent updates mergeable without central coordination, trading complexity for offline/multi-writer collaboration.",
    source: "CRDT/OT literature; collaborative editor design practice" },
  { id: "sdq-rag", disciplineId: "system-design", topic: "ML / AI System Design",
    question: "In a RAG system, retrieval quality is critical because…",
    options: ["The LLM can always infer missing facts", "The generated answer is bounded by the relevance, permissions, and freshness of supplied context", "Embeddings replace all evals", "Latency no longer matters"], correctIndex: 1,
    explanation: "RAG quality depends on ingestion, chunking, embeddings, filters, reranking, citations, and evals that catch missing or wrong context.",
    source: "chiphuyen/machine-learning-systems-design; RAG practice" },
];

const AI_PM_CONCEPT_MCQ: MCQ[] = [
  { id: "aipmq-evals", disciplineId: "product", topic: "AI Evaluation & Metrics",
    question: "For an AI PM, an offline eval is most useful before launch because it…",
    options: ["Guarantees product-market fit", "Creates a repeatable quality gate before exposing users to regressions", "Replaces online metrics", "Eliminates human review"], correctIndex: 1,
    explanation: "Offline evals provide regression checks and launch thresholds; online product metrics still validate user value after launch.",
    source: "AI PM interview kit; GitHub Copilot AI PM guide" },
  { id: "aipmq-ai-necessity", disciplineId: "product", topic: "AI Product Sense",
    question: "The first AI product-sense question is often…",
    options: ["Which model is newest?", "Is AI necessary for the user problem and workflow?", "Can we make the UI look intelligent?", "How many tokens can we spend?"], correctIndex: 1,
    explanation: "Strong AI PMs start with user value and workflow fit, then reason about probabilistic failures, cost, latency, and trust.",
    source: "AI Product Sense interview guides; Google PAIR" },
  { id: "aipmq-cost", disciplineId: "product", topic: "Model Cost & Latency Tradeoffs",
    question: "A model-routing strategy usually balances…",
    options: ["Only brand perception", "Quality, latency, cost, safety, and task complexity", "Only token count", "Only UI performance"], correctIndex: 1,
    explanation: "AI PMs often route easy tasks to cheaper/faster models and hard or risky tasks to stronger models with stricter checks.",
    source: "AI FinOps practice; LLM API economics" },
  { id: "aipmq-trust", disciplineId: "product", topic: "Responsible AI & Safety",
    question: "A good AI UX for uncertainty should…",
    options: ["Hide uncertainty", "Show confidence, citations, or escalation paths when the answer may be wrong", "Always block output", "Make the model sound more confident"], correctIndex: 1,
    explanation: "Trustworthy AI products help users calibrate reliance and correct errors, especially in high-impact workflows.",
    source: "Google PAIR; NIST AI RMF; AI UX practice" },
  { id: "aipmq-enterprise", disciplineId: "product", topic: "Enterprise AI Adoption",
    question: "Enterprise AI adoption often fails when teams ignore…",
    options: ["Admin controls, data governance, security review, change management, and measurable workflow value", "The product logo", "Consumer-only virality", "The longest possible onboarding"], correctIndex: 0,
    explanation: "Enterprise buyers need trust, controls, integration, rollout, and ROI proof, while end users need clear workflow value.",
    source: "Enterprise AI product practice; AI PM interview kit" },
];

const FDE_CONCEPT_MCQ: MCQ[] = [
  { id: "fdeq-role", disciplineId: "fde", topic: "Customer Discovery & Scoping",
    question: "What most distinguishes a Forward Deployed Engineer from a traditional sales engineer?",
    options: ["They carry quota", "They own production technical outcomes and write deployment code", "They only create slide decks", "They avoid customer contact"], correctIndex: 1,
    explanation: "FDEs are customer-facing builders. They scope, build, deploy, and stabilize systems rather than only demoing or handing off advice.",
    source: "Palantir Dev versus Delta; OpenAI FDE postings" },
  { id: "fdeq-one-customer", disciplineId: "fde", topic: "Field-to-Product Feedback",
    question: "Palantir's classic FDSE model is often summarized as…",
    options: ["One capability, many customers", "One customer, many capabilities", "One model, no customization", "One dashboard, no code"], correctIndex: 1,
    explanation: "Forward deployed engineers focus on making many capabilities work for one specific customer, then feeding reusable learning back into the platform.",
    source: "Palantir Dev versus Delta model" },
  { id: "fdeq-decomp", disciplineId: "fde", topic: "Deployment Decomposition",
    question: "In an FDE decomposition interview, the most common failure mode is…",
    options: ["Asking too many clarifying questions", "Jumping to a solution before clarifying goals and constraints", "Mentioning stakeholders", "Defining success criteria"], correctIndex: 1,
    explanation: "The round grades the process: clarify the business goal, data, stakeholders, constraints, and risks before choosing a plan.",
    source: "Exponent decomposition guide; Perspective AI FDE interview guide" },
  { id: "fdeq-rag-prod", disciplineId: "fde", topic: "RAG & Agentic Workflows",
    question: "For an enterprise RAG deployment, the FDE should treat permissions as…",
    options: ["A UI concern only", "Part of retrieval and answer generation from the start", "Something to add after launch", "Unnecessary if documents are internal"], correctIndex: 1,
    explanation: "Enterprise RAG must enforce source permissions during retrieval/context assembly, not just in the frontend.",
    source: "OpenAI FDE postings; enterprise RAG deployment practice" },
  { id: "fdeq-evals", disciplineId: "fde", topic: "Evals, Guardrails & Observability",
    question: "Why are evals a core FDE deliverable for AI deployments?",
    options: ["They replace customer adoption", "They create repeatable acceptance and regression gates for production behavior", "They make observability unnecessary", "They prove every answer is correct"], correctIndex: 1,
    explanation: "Evals let FDEs define launch thresholds, catch regressions, compare versions, and communicate reliability to customers.",
    source: "OpenAI FDE postings; AI eval and observability practice" },
  { id: "fdeq-enterprise-ready", disciplineId: "fde", topic: "Enterprise Data & Security",
    question: "Enterprise readiness for an AI FDE deployment usually includes…",
    options: ["Only a working demo", "Identity, permissions, auditability, data boundaries, deployment topology, and support ownership", "A single prompt template", "Skipping legal review"], correctIndex: 1,
    explanation: "FDEs need to handle enterprise constraints early so security, compliance, and operations do not block rollout late.",
    source: "OpenAI Technical Deployment Lead postings; FDE deployment guides" },
  { id: "fdeq-debug", disciplineId: "fde", topic: "Production Debugging",
    question: "An AI agent works in staging but fails in production. What should you compare first?",
    options: ["Only the frontend CSS", "Model/prompt versions, retrieved context, permissions, traffic mix, tool responses, and timeouts", "Only company revenue", "Only the user's browser"], correctIndex: 1,
    explanation: "Production AI failures often come from environment, data, permission, traffic, or tool-call differences that were absent in staging.",
    source: "fde.academy interview patterns; production AI debugging practice" },
  { id: "fdeq-adoption", disciplineId: "fde", topic: "Adoption & Change Management",
    question: "A technically successful deployment with low usage is primarily a signal to inspect…",
    options: ["Whether users were forced to log in", "Workflow fit, value moments, training, champions, and operational incentives", "The company logo", "Only the cloud provider"], correctIndex: 1,
    explanation: "FDE success is measured by production adoption and workflow impact, not just code stability.",
    source: "OpenAI Technical Deployment Lead postings; enterprise adoption practice" },
  { id: "fdeq-stakeholder", disciplineId: "fde", topic: "Stakeholder Communication",
    question: "If a customer engineer refuses access, the strongest FDE response starts by treating it as…",
    options: ["A trust and risk problem to understand", "A reason to bypass them", "A sales objection only", "A request to abandon security"], correctIndex: 0,
    explanation: "Strong FDEs earn trust by understanding objections, minimizing access, co-owning guardrails, and making the customer engineer successful.",
    source: "Awesome-FDE-Roadmap stakeholder examples; client simulation interview practice" },
  { id: "fdeq-field-product", disciplineId: "fde", topic: "Field-to-Product Feedback",
    question: "When should customer-specific deployment learning become product roadmap signal?",
    options: ["When it recurs across accounts or reveals a platform gap", "Never", "Only when the customer asks loudly", "Only after a sales renewal"], correctIndex: 0,
    explanation: "The FDE creates leverage by converting repeated field pain into reusable capabilities, tools, playbooks, or product improvements.",
    source: "OpenAI FDE postings; Palantir Dev versus Delta model" },
];

export interface QuizFilter { disciplineId?: string; topic?: string; }

// Full MCQ corpus = general/discipline bank + the AI/ML knowledge base.
import { AIML_BANK } from "./aiml";
import { QUESTION_BANK } from "./questionBank";

const INTERVIEW_BANK_MCQ: MCQ[] = QUESTION_BANK
  .filter((q) => q.disciplineId === "product" || q.disciplineId === "aiml" || q.disciplineId === "system-design" || q.disciplineId === "fde")
  .map((q) => ({
    id: `learn-${q.id}`,
    disciplineId: q.disciplineId,
    topic: q.competency,
    question: `For this interview scenario, what is the strongest first approach? ${q.prompt}`,
    options: [
      "Clarify the goal, users, constraints, success metric, tradeoffs, and evidence needed before recommending a path.",
      "Jump directly to a feature idea and defend it as the final answer.",
      "List every possible metric or technology without choosing a primary decision criterion.",
      "Avoid assumptions, tradeoffs, and guardrails so the answer stays broad.",
    ],
    correctIndex: 0,
    explanation: q.guidance,
    source: q.source,
  }));

const ALL_MCQ: MCQ[] = [...QUIZ_BANK, ...SYSTEM_DESIGN_CONCEPT_MCQ, ...AI_PM_CONCEPT_MCQ, ...FDE_CONCEPT_MCQ, ...AIML_BANK, ...INTERVIEW_BANK_MCQ];

export function quizQuestions(f: QuizFilter, count = 6): MCQ[] {
  // AI/ML is a self-contained knowledge base — don't fold in "general".
  const includeGeneral = f.disciplineId !== "aiml";
  let pool = ALL_MCQ.filter((m) =>
    (!f.disciplineId || f.disciplineId === "all" || m.disciplineId === f.disciplineId || (includeGeneral && m.disciplineId === "general")) &&
    (!f.topic || f.topic === "all" || m.topic === f.topic)
  );
  if (pool.length < 3) {
    pool = ALL_MCQ.filter((m) => !f.disciplineId || f.disciplineId === "all" || m.disciplineId === f.disciplineId || (includeGeneral && m.disciplineId === "general"));
  }
  return pool.slice(0, count);
}

export function quizTopics(disciplineId?: string): string[] {
  const includeGeneral = disciplineId !== "aiml";
  const pool = ALL_MCQ.filter((m) => !disciplineId || disciplineId === "all" || m.disciplineId === disciplineId || (includeGeneral && m.disciplineId === "general"));
  return Array.from(new Set(pool.map((m) => m.topic))).sort();
}

// ───────── Admin: query the full concept-MCQ corpus (general + AI/ML) ─────────
export interface MCQFilter { q?: string; disciplineId?: string; topic?: string; source?: string; }

export function queryMCQ(f: MCQFilter = {}): MCQ[] {
  const q = f.q?.toLowerCase().trim();
  return ALL_MCQ.filter((m) => {
    if (f.disciplineId && f.disciplineId !== "all" && m.disciplineId !== f.disciplineId) return false;
    if (f.topic && f.topic !== "all" && m.topic !== f.topic) return false;
    if (f.source && f.source !== "all" && m.source !== f.source) return false;
    if (q && !(m.question.toLowerCase().includes(q) || m.explanation.toLowerCase().includes(q) || m.topic.toLowerCase().includes(q) || m.source.toLowerCase().includes(q))) return false;
    return true;
  });
}

export function mcqFacets() {
  const disciplines = Array.from(new Set(ALL_MCQ.map((m) => m.disciplineId))).sort();
  const topics = Array.from(new Set(ALL_MCQ.map((m) => m.topic))).sort();
  const sources = Array.from(new Set(ALL_MCQ.map((m) => m.source))).sort();
  return { disciplines, topics, sources, total: ALL_MCQ.length };
}
