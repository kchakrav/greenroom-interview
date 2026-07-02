// AI/ML knowledge bank — browsable reference for interview prep (study, then drill).
// Ported from the personal "AI Information Bank" (C:/AI-info-bank): concept FAQs,
// ML concepts, emerging trends, an acronym glossary, and landmark papers — all
// source-attributed. Pairs with the MCQ drills in lib/aiml.ts and lib/quiz.ts.

export interface RefCite { label: string; url: string; }

export interface RefEntry {
  id: string;
  q: string;
  cat: string;
  tags: string[];
  a: string;
  extra?: string;
  cite?: RefCite[];
  added: string;
  airel?: "high" | "medium" | "general"; // ML concepts only
  horizon?: "hot" | "future";            // emerging only
}

export interface RefAcronym { id: string; code: string; full: string; pm_note: string; added: string; }

export interface RefPaper {
  id: string;
  title: string;
  authors: string;
  impact: "foundational" | "high";
  desc: string;
  url: string;
  added: string;
}

export const REF_UPDATED = "2026-06-08";

const BASE_REF_FAQ: RefEntry[] = [
  {
    "id": "faq-001",
    "q": "What is a Large Language Model (LLM)?",
    "cat": "core",
    "tags": [
      "core"
    ],
    "a": "A Large Language Model is a type of AI trained on vast amounts of text data using self-supervised learning. It learns statistical patterns in language to predict and generate coherent text. LLMs are the foundation of tools like ChatGPT, Claude, and Gemini.",
    "extra": "Built on the Transformer architecture (Vaswani et al., 2017) and scaled to billions—sometimes trillions—of parameters.",
    "cite": [
      {
        "label": "Vaswani et al. 2017 — Attention Is All You Need",
        "url": "https://arxiv.org/abs/1706.03762"
      },
      {
        "label": "OpenAI — Introduction to LLMs",
        "url": "https://platform.openai.com/docs/introduction"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-002",
    "q": "What is a Transformer architecture?",
    "cat": "model",
    "tags": [
      "model"
    ],
    "a": "The Transformer is the neural network architecture underpinning virtually all modern LLMs. Its key innovation is self-attention, letting the model weigh every word against every other—capturing long-range dependencies far better than RNNs or LSTMs.",
    "extra": "The original paper introduced an encoder-decoder structure. Most generative models today use a decoder-only variant (GPT-style).",
    "cite": [
      {
        "label": "Vaswani et al. 2017",
        "url": "https://arxiv.org/abs/1706.03762"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-003",
    "q": "What is prompt engineering?",
    "cat": "core",
    "tags": [
      "core"
    ],
    "a": "Prompt engineering is the practice of designing inputs to guide an LLM toward desired outputs. Techniques include zero-shot, few-shot, chain-of-thought, and role prompting.",
    "extra": "Effective prompting improves model performance without changing weights—a key skill for AI product teams.",
    "cite": [
      {
        "label": "Wei et al. 2022 — Chain-of-Thought Prompting",
        "url": "https://arxiv.org/abs/2201.11903"
      },
      {
        "label": "Anthropic Prompt Engineering Guide",
        "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-004",
    "q": "What is RAG (Retrieval-Augmented Generation)?",
    "cat": "infra",
    "tags": [
      "infra",
      "core"
    ],
    "a": "RAG augments an LLM with real-time retrieval from an external knowledge base. A retriever fetches relevant documents via vector similarity search; those are injected as context before generation.",
    "extra": "RAG reduces hallucinations and lets LLMs reason over proprietary or current data without retraining. Introduced by Lewis et al. at Meta AI in 2020.",
    "cite": [
      {
        "label": "Lewis et al. 2020 — RAG",
        "url": "https://arxiv.org/abs/2005.11401"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-005",
    "q": "What is fine-tuning vs. in-context learning?",
    "cat": "model",
    "tags": [
      "model"
    ],
    "a": "Fine-tuning updates a pre-trained model's weights on task-specific data. In-context learning (ICL) shows the model examples within the prompt—no weight updates occur.",
    "extra": "Fine-tuning is compute-intensive but yields persistent specialization. ICL is flexible but limited by context window size.",
    "cite": [
      {
        "label": "Brown et al. 2020 — GPT-3",
        "url": "https://arxiv.org/abs/2005.14165"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-006",
    "q": "What are AI Agents?",
    "cat": "agent",
    "tags": [
      "agent"
    ],
    "a": "An AI agent is an LLM-powered system that perceives its environment, makes decisions, and takes multi-step actions to accomplish goals—calling tools, maintaining memory, and planning sequences.",
    "extra": "Key design dimensions: planning strategy (ReAct, CoT), memory type, and tool set.",
    "cite": [
      {
        "label": "Yao et al. 2022 — ReAct",
        "url": "https://arxiv.org/abs/2210.03629"
      },
      {
        "label": "Anthropic — Building Effective Agents",
        "url": "https://www.anthropic.com/research/building-effective-agents"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-007",
    "q": "What is MCP (Model Context Protocol)?",
    "cat": "agent",
    "tags": [
      "agent",
      "infra"
    ],
    "a": "MCP is Anthropic's open standard defining how AI models connect to external tools and data sources in a standardized, composable way—like a USB-C port for AI.",
    "extra": "MCP enables agentic systems to access files, databases, and APIs without custom integration for every combination.",
    "cite": [
      {
        "label": "Anthropic — MCP",
        "url": "https://www.anthropic.com/news/model-context-protocol"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-008",
    "q": "What is hallucination in AI?",
    "cat": "safety",
    "tags": [
      "safety",
      "core"
    ],
    "a": "Hallucination is when an LLM confidently generates factually incorrect or fabricated content. The model optimizes for fluent text—not ground truth—filling knowledge gaps with plausible-sounding fabrications.",
    "extra": "Mitigations: RAG, constitutional AI, output verification layers, and calibrated uncertainty prompting.",
    "cite": [
      {
        "label": "Ji et al. 2023 — Survey of Hallucination in NLG",
        "url": "https://arxiv.org/abs/2202.03629"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-009",
    "q": "What is RLHF?",
    "cat": "model",
    "tags": [
      "model",
      "safety"
    ],
    "a": "Reinforcement Learning from Human Feedback aligns LLMs with human preferences. Human raters rank outputs; a reward model is trained; the LLM is fine-tuned via RL to maximize reward.",
    "extra": "Popularized by InstructGPT (2022). DPO is a popular simplified variant.",
    "cite": [
      {
        "label": "Ouyang et al. 2022 — InstructGPT",
        "url": "https://arxiv.org/abs/2203.02155"
      },
      {
        "label": "Rafailov et al. 2023 — DPO",
        "url": "https://arxiv.org/abs/2305.18290"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-010",
    "q": "What is Constitutional AI?",
    "cat": "safety",
    "tags": [
      "safety"
    ],
    "a": "Anthropic's alignment approach where a model is trained to follow written principles, critiquing and revising its own outputs in a self-improvement loop.",
    "extra": "CAI combines RLAIF with the critique-revision loop, reducing harmful outputs more scalably than pure RLHF.",
    "cite": [
      {
        "label": "Bai et al. 2022 — Constitutional AI",
        "url": "https://arxiv.org/abs/2212.08073"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-011",
    "q": "What is a vector database / embedding?",
    "cat": "infra",
    "tags": [
      "infra"
    ],
    "a": "An embedding is a dense numerical vector representing text in semantic space. A vector database stores these for fast approximate nearest-neighbor search.",
    "extra": "Backbone of RAG, semantic search, and recommendation engines.",
    "cite": [
      {
        "label": "Mikolov et al. 2013 — Word2Vec",
        "url": "https://arxiv.org/abs/1301.3781"
      },
      {
        "label": "Pinecone — Vector Databases",
        "url": "https://www.pinecone.io/learn/vector-database/"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-012",
    "q": "What is a context window?",
    "cat": "model",
    "tags": [
      "model"
    ],
    "a": "The context window is the maximum text (in tokens) an LLM processes in one call—input plus output combined. Larger windows enable longer documents and richer conversations.",
    "extra": "Frontier models range from 128K (GPT-4o) to 1M+ tokens (Gemini 1.5 Pro, Claude 3 family).",
    "cite": [
      {
        "label": "Anthropic — Claude Model Overview",
        "url": "https://docs.anthropic.com/en/docs/about-claude/models/overview"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-013",
    "q": "What is a foundation model?",
    "cat": "model",
    "tags": [
      "model",
      "core"
    ],
    "a": "A foundation model is trained on broad, diverse data and adapted for many downstream tasks. GPT-4, Claude, and Llama are all foundation models.",
    "extra": "Term coined by Stanford HAI in 2021. Characterized by generality, emergent capabilities, and serving as a base for specialization.",
    "cite": [
      {
        "label": "Bommasani et al. 2021 — Foundation Models",
        "url": "https://arxiv.org/abs/2108.07258"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-014",
    "q": "What is agentic AI vs. generative AI?",
    "cat": "agent",
    "tags": [
      "agent",
      "core"
    ],
    "a": "Generative AI produces novel content in response to prompts. Agentic AI goes further: autonomously planning, executing multi-step actions, using tools, and looping until a goal is achieved.",
    "extra": "Agentic systems introduce new PM challenges: latency, reliability, cost, and safety.",
    "cite": [
      {
        "label": "Anthropic — What are AI Agents?",
        "url": "https://www.anthropic.com/news/what-are-ai-agents"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-015",
    "q": "What is GPU/TPU and why does AI need specialized hardware?",
    "cat": "infra",
    "tags": [
      "infra"
    ],
    "a": "GPUs and TPUs are chips optimized for the massive parallel matrix multiplications in deep learning. Training frontier LLMs requires thousands running for weeks to months.",
    "extra": "NVIDIA H100/B200 are current workhorses. AI infrastructure companies build GPU cloud platforms for growing compute demand.",
    "cite": [
      {
        "label": "NVIDIA — H100 Architecture",
        "url": "https://resources.nvidia.com/en-us-tensor-core/gtc22-whitepaper-hopper"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "faq-016",
    "q": "What is A2A (Agent-to-Agent) protocol?",
    "cat": "agent",
    "tags": [
      "agent",
      "infra"
    ],
    "a": "A2A is Google's open standard (launched April 2025, now hosted by the Linux Foundation) that enables AI agents built by different vendors to discover each other, delegate tasks, and coordinate work across enterprise systems. Where MCP connects an agent to tools, A2A connects agents to each other.",
    "extra": "A2A uses HTTP, SSE, and JSON-RPC 2.0. Agents publish 'Agent Cards' describing their capabilities. MCP + A2A together form the full interoperability stack: MCP for agent-to-tool, A2A for agent-to-agent.",
    "cite": [
      {
        "label": "IBM — What Is Agent2Agent (A2A) Protocol?",
        "url": "https://www.ibm.com/think/topics/agent2agent-protocol"
      },
      {
        "label": "Google Cloud Next 2026 — A2A deep dive",
        "url": "https://thenextweb.com/news/google-cloud-next-ai-agents-agentic-era"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "faq-017",
    "q": "What is GraphRAG?",
    "cat": "infra",
    "tags": [
      "infra",
      "core"
    ],
    "a": "GraphRAG extends classical RAG by building a knowledge graph during indexing rather than relying purely on vector similarity. At query time, the system walks graph edges to retrieve related entities and their relationships—enabling multi-hop reasoning that flat vector search misses.",
    "extra": "Pioneered by Microsoft Research (2024). Especially valuable for complex, multi-source enterprise queries. Cost-reduction research since 2025 has made it practical with 10–90% indexing cost savings achievable.",
    "cite": [
      {
        "label": "Microsoft — GraphRAG project",
        "url": "https://microsoft.github.io/graphrag/"
      },
      {
        "label": "Medium — GraphRAG in 2026: Practitioner's Guide",
        "url": "https://medium.com/graph-praxis/graph-rag-in-2026-a-practitioners-guide-to-what-actually-works-dca4962e7517"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "faq-018",
    "q": "What is context engineering?",
    "cat": "core",
    "tags": [
      "core",
      "agent"
    ],
    "a": "Context engineering is the discipline of deliberately designing and managing what goes into an LLM's context window at runtime—which documents to retrieve, how to compress conversation history, what system instructions to include, and in what order.",
    "extra": "As context windows grow to 1M+ tokens, the challenge shifts from 'can the model see this?' to 'what should the model see?' Now considered a core engineering skill alongside prompt engineering.",
    "cite": [
      {
        "label": "Substack — Context Engineering, Routing, GraphRAG, Reflection",
        "url": "https://outcomeschool.substack.com/p/context-engineering-routing-graphrag"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "faq-019",
    "q": "What is speculative decoding?",
    "cat": "infra",
    "tags": [
      "infra"
    ],
    "a": "Speculative decoding speeds up LLM inference by using a small, fast 'draft' model to propose multiple tokens at once, which the larger target model then verifies in parallel. When the target model agrees with the drafts, all tokens are accepted—effectively generating several tokens for the cost of one.",
    "extra": "Delivers 2–3x inference speedup with no quality loss. Used in production by Google (Gemini) and Meta. Key for PMs evaluating API provider latency: providers using speculative decoding quote lower TTFT and higher TPS.",
    "cite": [
      {
        "label": "Leviathan et al. 2023 — Fast Inference via Speculative Decoding",
        "url": "https://arxiv.org/abs/2211.17192"
      },
      {
        "label": "Wikipedia — Speculative decoding",
        "url": "https://en.wikipedia.org/wiki/Speculative_decoding"
      }
    ],
    "added": "2026-06-08"
  }
];

const BASE_REF_ML: RefEntry[] = [
  {
    "id": "ml-001",
    "q": "What is supervised learning?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "general",
    "a": "Supervised learning trains a model on labeled input-output pairs to map inputs to outputs by minimizing prediction error. Classic examples: image classifiers, spam detectors, regression.",
    "extra": "Nearly all LLM fine-tuning (SFT) is supervised learning—training on (prompt, ideal response) pairs.",
    "cite": [
      {
        "label": "Bishop 2006 — Pattern Recognition and ML",
        "url": "https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-002",
    "q": "What is self-supervised learning?",
    "cat": "foundations",
    "tags": [
      "foundations",
      "deep-learning"
    ],
    "airel": "high",
    "a": "Self-supervised learning creates labels automatically from data—masking a word and predicting it (BERT), or predicting the next token (GPT). No human annotation needed.",
    "extra": "This IS the training paradigm behind all modern LLMs—enabling training on internet-scale text without costly labeling.",
    "cite": [
      {
        "label": "Devlin et al. 2018 — BERT",
        "url": "https://arxiv.org/abs/1810.04805"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-003",
    "q": "What is reinforcement learning (RL)?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "high",
    "a": "RL trains an agent to maximize cumulative reward by taking actions in an environment. The agent learns through trial and error—no labeled dataset, just a reward signal.",
    "extra": "RL is central to LLM alignment: RLHF uses PPO to fine-tune models based on human preference scores.",
    "cite": [
      {
        "label": "Sutton & Barto 2018 — Reinforcement Learning",
        "url": "http://incompleteideas.net/book/the-book-2nd.html"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-004",
    "q": "What is a neural network?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "A neural network is composed of layers of interconnected nodes. Each layer transforms its input via learned weights and nonlinear activation functions.",
    "extra": "Deep neural networks power all of modern AI—LLMs, image models, speech systems.",
    "cite": [
      {
        "label": "LeCun, Bengio & Hinton 2015 — Deep Learning (Nature)",
        "url": "https://www.nature.com/articles/nature14539"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-005",
    "q": "What is backpropagation?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "Backpropagation trains neural networks by computing the gradient of the loss with respect to each weight using the chain rule, then adjusting weights to reduce error.",
    "extra": "Every LLM is trained with backpropagation + optimizers like Adam. The core mechanism of 'learning'.",
    "cite": [
      {
        "label": "Rumelhart et al. 1986 — Back-propagating Errors",
        "url": "https://www.nature.com/articles/323533a0"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-006",
    "q": "What is gradient descent and optimization?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "Gradient descent iteratively adjusts weights in the direction that reduces loss. AdamW is the standard optimizer for most transformer training runs.",
    "extra": "Optimizer choice directly affects LLM training stability and convergence speed.",
    "cite": [
      {
        "label": "Kingma & Ba 2014 — Adam Optimizer",
        "url": "https://arxiv.org/abs/1412.6980"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-007",
    "q": "What is overfitting and regularization?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "medium",
    "a": "Overfitting is memorizing training data instead of learning generalizable patterns. Regularization (dropout, weight decay, early stopping) combats this.",
    "extra": "In LLMs, overfitting appears during fine-tuning on small datasets. LoRA and careful data curation help.",
    "cite": [
      {
        "label": "Srivastava et al. 2014 — Dropout",
        "url": "https://jmlr.org/papers/v15/srivastava14a.html"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-008",
    "q": "What is transfer learning?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "high",
    "a": "Transfer learning reuses a model trained on one task as a starting point for another. Instead of training from scratch, you adapt pre-trained weights.",
    "extra": "Transfer learning IS modern AI. Every LLM deployment pattern—fine-tuning, RLHF, LoRA—is transfer learning from a foundation model.",
    "cite": [
      {
        "label": "Pan & Yang 2010 — A Survey on Transfer Learning",
        "url": "https://ieeexplore.ieee.org/document/5288526"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-009",
    "q": "What is attention mechanism?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "The attention mechanism lets a model dynamically weight the importance of different input tokens when producing each output token. Self-attention lets each token attend to all others.",
    "extra": "Self-attention is the defining innovation of Transformers. It enables long-range dependencies that RNNs struggled with.",
    "cite": [
      {
        "label": "Vaswani et al. 2017 — Attention Is All You Need",
        "url": "https://arxiv.org/abs/1706.03762"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-010",
    "q": "What is tokenization?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "Tokenization converts text into integer IDs (tokens). Most LLMs use Byte-Pair Encoding (BPE) breaking text into subword units.",
    "extra": "Directly PM-relevant: determines context window counting, multilingual efficiency, and cost (you pay per token).",
    "cite": [
      {
        "label": "Sennrich et al. 2016 — BPE",
        "url": "https://arxiv.org/abs/1508.07909"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-011",
    "q": "What is a loss function?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "high",
    "a": "A loss function measures prediction error. LLMs are trained using cross-entropy loss on next-token prediction. 'Perplexity' is derived directly from this loss.",
    "extra": "Lower perplexity = better language model. Relevant when evaluating model quality in API provider comparisons.",
    "cite": [
      {
        "label": "Goodfellow et al. 2016 — Deep Learning",
        "url": "https://www.deeplearningbook.org/"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-012",
    "q": "What is quantization?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "Quantization reduces model weight precision from 32/16-bit floats to INT8 or INT4, shrinking model size and speeding inference with minimal accuracy loss.",
    "extra": "How LLMs run on consumer hardware and at lower cost. Key for on-device AI and cost-sensitive deployment decisions.",
    "cite": [
      {
        "label": "Dettmers et al. 2022 — LLM.int8()",
        "url": "https://arxiv.org/abs/2208.07339"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-013",
    "q": "What is parameter efficiency (LoRA)?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "Parameter-efficient fine-tuning (PEFT) adapts large models by training only a small number of additional parameters. LoRA adds small rank-decomposed weight matrices.",
    "extra": "LoRA is now standard for domain-specific fine-tuning—10-100x cheaper than full fine-tuning with comparable results.",
    "cite": [
      {
        "label": "Hu et al. 2021 — LoRA",
        "url": "https://arxiv.org/abs/2106.09685"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-014",
    "q": "What is knowledge distillation?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "high",
    "a": "Distillation trains a smaller 'student' model to mimic a larger 'teacher' model's output distributions, transferring nuanced knowledge at lower cost.",
    "extra": "Explains how SLMs like Phi-3 and Gemma punch above their parameter weight.",
    "cite": [
      {
        "label": "Hinton et al. 2015 — Distilling the Knowledge",
        "url": "https://arxiv.org/abs/1503.02531"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-015",
    "q": "What is Mixture of Experts (MoE)?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "MoE replaces dense feed-forward layers with specialized 'expert' sub-networks. A router selects a subset per token—enabling massive total capacity while activating only a fraction per pass.",
    "extra": "GPT-4 reportedly uses MoE. Explains why some models are cheaper at inference despite high capability.",
    "cite": [
      {
        "label": "Shazeer et al. 2017 — Outrageously Large Neural Networks",
        "url": "https://arxiv.org/abs/1701.06538"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-016",
    "q": "What is a confusion matrix and evaluation metrics?",
    "cat": "evaluation",
    "tags": [
      "evaluation"
    ],
    "airel": "medium",
    "a": "A confusion matrix tabulates TP/FP/TN/FN. Derived metrics: Precision, Recall, F1-score, ROC-AUC. Standard for evaluating AI classifiers like content moderation or intent models.",
    "extra": "PMs should know the Precision-Recall tradeoff: high recall catches more harmful content but may produce more false positives.",
    "cite": [
      {
        "label": "Powers 2011 — Precision, Recall and F-Score",
        "url": "https://arxiv.org/abs/2010.16061"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-017",
    "q": "What is bias-variance tradeoff?",
    "cat": "foundations",
    "tags": [
      "foundations"
    ],
    "airel": "medium",
    "a": "Bias is systematic error from wrong assumptions; variance is sensitivity to training data. High-bias = underfitting; high-variance = overfitting.",
    "extra": "Relevant when scoping fine-tuning vs. prompting: small fine-tuned models may have high bias, large models with little data may overfit.",
    "cite": [
      {
        "label": "Geman et al. 1992 — Bias/Variance Dilemma",
        "url": "https://ieeexplore.ieee.org/document/6796981"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-018",
    "q": "What is positional encoding?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "high",
    "a": "Since Transformers process tokens in parallel, positional encodings inject order information. RoPE (Rotary Position Embedding) and ALiBi enable context length extension.",
    "extra": "Positional encoding innovations affect what LLMs can do with long contexts—directly relevant when evaluating model context window capabilities.",
    "cite": [
      {
        "label": "Vaswani et al. 2017",
        "url": "https://arxiv.org/abs/1706.03762"
      },
      {
        "label": "Su et al. 2021 — RoPE",
        "url": "https://arxiv.org/abs/2104.09864"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "ml-019",
    "q": "What is a diffusion model?",
    "cat": "deep-learning",
    "tags": [
      "deep-learning"
    ],
    "airel": "medium",
    "a": "Diffusion models generate data by learning to reverse a gradual noising process. Training: add Gaussian noise step-by-step. Inference: iteratively denoise from pure noise to a clean sample.",
    "extra": "Powers image generation (Stable Diffusion, DALL-E 3, Midjourney) and being explored for audio and video.",
    "cite": [
      {
        "label": "Ho et al. 2020 — Denoising Diffusion Probabilistic Models",
        "url": "https://arxiv.org/abs/2006.11239"
      }
    ],
    "added": "2026-05-08"
  }
];

const BASE_REF_EMERGING: RefEntry[] = [
  {
    "id": "em-001",
    "q": "What is test-time compute scaling?",
    "cat": "reasoning",
    "tags": [
      "reasoning",
      "inference"
    ],
    "horizon": "hot",
    "a": "Instead of making models smarter by training larger models, test-time compute scaling invests more computation during inference—letting models 'think longer' before answering. This includes generating multiple reasoning chains, using verifiers to select the best, or iterative self-refinement.",
    "extra": "Identified as the most important architectural shift since the Transformer. OpenAI o1/o3, DeepSeek-R1, and Claude extended thinking all leverage this. A smaller model given more think-time can outperform a much larger model on hard reasoning tasks.",
    "cite": [
      {
        "label": "Snell et al. 2024 — Scaling LLM Test-Time Compute Optimally",
        "url": "https://arxiv.org/abs/2408.03314"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-002",
    "q": "What are reasoning models (o1-style)?",
    "cat": "reasoning",
    "tags": [
      "reasoning"
    ],
    "horizon": "hot",
    "a": "Reasoning models are LLMs explicitly trained to generate long internal reasoning traces—chains of thought, self-critique, backtracking—before producing a final answer. They trade higher latency and token cost for significantly better accuracy on complex tasks.",
    "extra": "OpenAI o1/o3, DeepSeek-R1, Qwen QwQ, and Claude extended thinking are all reasoning models. For PMs: reasoning models change cost structure (10-50x more tokens), latency profile, and suitability (better for math/code/analysis, overkill for simple Q&A).",
    "cite": [
      {
        "label": "OpenAI — Learning to Reason with LLMs",
        "url": "https://openai.com/index/learning-to-reason-with-llms/"
      },
      {
        "label": "DeepSeek-R1 paper",
        "url": "https://arxiv.org/abs/2501.12948"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-003",
    "q": "What is multi-agent orchestration?",
    "cat": "agents",
    "tags": [
      "agents"
    ],
    "horizon": "hot",
    "a": "Multi-agent orchestration coordinates multiple specialized AI agents working together—an orchestrator decomposes a goal into subtasks and delegates to specialized agents (research, coding, QA), then synthesizes results.",
    "extra": "Gartner reported a 1,445% surge in multi-agent system inquiries from Q1 2024 to Q2 2025. Analogous to the microservices revolution—monolithic single agents are being replaced by orchestrated teams.",
    "cite": [
      {
        "label": "Anthropic — Multi-Agent Frameworks",
        "url": "https://www.anthropic.com/research/building-effective-agents"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-004",
    "q": "What is Agentic RAG?",
    "cat": "agents",
    "tags": [
      "agents",
      "retrieval"
    ],
    "horizon": "hot",
    "a": "Agentic RAG extends classical RAG with goal-driven autonomy. Instead of a single retrieval step, the agent decides what to retrieve, when, and how many times—iteratively refining queries and maintaining cross-session memory.",
    "extra": "The cornerstone use case for real-world AI agents in 2025. Enables AI systems that actively investigate knowledge bases—like a research analyst, not a search engine.",
    "cite": [
      {
        "label": "MarkTechPost — AI Agent Trends of 2025",
        "url": "https://www.marktechpost.com/2025/08/10/ai-agent-trends-of-2025-a-transformative-landscape/"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-005",
    "q": "What are world models in AI?",
    "cat": "next-frontier",
    "tags": [
      "next-frontier",
      "embodied"
    ],
    "horizon": "future",
    "a": "A world model is an AI system's internal simulation of how the world works—able to predict the outcome of actions before taking them. Rather than learning from explicit labels, the AI builds a compressed mental model of physics, causality, and environment dynamics.",
    "extra": "Critical for robotics and physical AI. Google DeepMind's Genie 3 and World Labs' Marble generate realistic virtual environments. By 2026–2027, world models are expected to become the backbone of embodied AI agents.",
    "cite": [
      {
        "label": "MIT Technology Review — What's Next for AI in 2026",
        "url": "https://www.technologyreview.com/2026/01/05/1130662/whats-next-for-ai-in-2026/"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-006",
    "q": "What is neurosymbolic AI?",
    "cat": "next-frontier",
    "tags": [
      "next-frontier",
      "reasoning"
    ],
    "horizon": "future",
    "a": "Neurosymbolic AI (NSAI) combines neural networks (pattern recognition) with symbolic reasoning (logic, rules). The goal: systems that can both perceive and reason rigorously.",
    "extra": "Neurosymbolic models have outperformed pure deep learning on visual QA with as little as 1/10th the training data. Represents a potential architectural path beyond current LLM limitations.",
    "cite": [
      {
        "label": "arxiv — Neuro-Symbolic AI Workloads",
        "url": "https://arxiv.org/pdf/2109.06133"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-007",
    "q": "What is continual learning (lifelong learning)?",
    "cat": "next-frontier",
    "tags": [
      "next-frontier",
      "memory"
    ],
    "horizon": "future",
    "a": "Continual learning enables AI models to learn new tasks and knowledge over time without forgetting previously learned information—solving 'catastrophic forgetting'. Static LLMs have a fixed training cutoff; continual learning aims to update them dynamically.",
    "extra": "Predicted as a breakthrough area in 2026. Enables AI agents with persistent, growing memory rather than stateless per-session models.",
    "cite": [
      {
        "label": "NextBigFuture — Continual Learning 2026",
        "url": "https://www.nextbigfuture.com/2026/04/2026-is-breakthrough-year-for-reliable-ai-world-models-and-continual-learning-prototypes.html"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-008",
    "q": "What is AI observability and AgentOps?",
    "cat": "infra-ops",
    "tags": [
      "infra-ops"
    ],
    "horizon": "hot",
    "a": "AI observability is the practice of monitoring, tracing, and debugging AI systems in production—logging model inputs/outputs, latency, token costs, hallucination rates, and agent tool calls. AgentOps extends DevOps principles to agentic AI pipelines.",
    "extra": "As agents execute multi-step autonomous workflows, observability becomes critical. Splunk, Langfuse, and Weights & Biases are building AI-native observability tooling.",
    "cite": [
      {
        "label": "Splunk — Top AI Trends 2025",
        "url": "https://www.splunk.com/en_us/blog/artificial-intelligence/top-10-ai-trends-2025-how-agentic-ai-and-mcp-changed-it.html"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-009",
    "q": "What is multimodal AI and omni-models?",
    "cat": "multimodal",
    "tags": [
      "multimodal"
    ],
    "horizon": "hot",
    "a": "Multimodal AI processes and generates multiple data types—text, images, audio, video, and code—in a unified model. Omni-models learn joint latent representations across modalities, enabling richer cross-modal reasoning.",
    "extra": "By 2026, top-tier AI models are inherently multimodal. Next wave: 'omni-models' (text + vision + action + memory) starting to ship.",
    "cite": [
      {
        "label": "HuggingFace — AI Trends 2026",
        "url": "https://huggingface.co/blog/aufklarer/ai-trends-2026-test-time-reasoning-reflective-agen"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-010",
    "q": "What is AI governance and responsible AI?",
    "cat": "safety-policy",
    "tags": [
      "safety-policy"
    ],
    "horizon": "hot",
    "a": "AI governance encompasses the frameworks, policies, and technical controls ensuring AI systems are safe, fair, auditable, and compliant with regulations. EU AI Act classifies systems by risk tier; high-risk AI requires conformity assessments and audit trails.",
    "extra": "PMs building AI products must now treat governance as a product requirement, not a checkbox.",
    "cite": [
      {
        "label": "IBM — AI Tech Trends 2026",
        "url": "https://www.ibm.com/think/news/ai-tech-trends-predictions-2026"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-011",
    "q": "What is synthetic data generation?",
    "cat": "data",
    "tags": [
      "data"
    ],
    "horizon": "hot",
    "a": "Synthetic data is AI-generated training data that mimics real data. Used when real data is scarce, private, or expensive to label. LLMs now generate synthetic instruction-following datasets for their own fine-tuning.",
    "extra": "Self-play data generation—where models train on data created by stronger versions of themselves—is a key technique behind DeepSeek and Phi-3's efficiency.",
    "cite": [
      {
        "label": "Microsoft Research — What's Next in AI 2026",
        "url": "https://www.microsoft.com/en-us/research/story/whats-next-in-ai/"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-012",
    "q": "What is computer use / browser-use AI?",
    "cat": "agents",
    "tags": [
      "agents"
    ],
    "horizon": "hot",
    "a": "Computer-use AI is the capability for an AI agent to directly operate a computer—navigating browsers, clicking UI elements, filling forms—without requiring dedicated APIs.",
    "extra": "Anthropic's Claude Computer Use, OpenAI's Operator, and Google Project Mariner are early implementations. Enables automation of any GUI-based task including legacy systems with no API.",
    "cite": [
      {
        "label": "Anthropic — Claude Computer Use",
        "url": "https://www.anthropic.com/news/developing-computer-use"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-013",
    "q": "What is small language model (SLM) strategy?",
    "cat": "efficiency",
    "tags": [
      "efficiency"
    ],
    "horizon": "hot",
    "a": "SLM strategy is the deliberate choice to use smaller, specialized models (1B–13B parameters) instead of frontier-scale LLMs. SLMs offer lower latency, lower cost, on-device deployment, and better data privacy.",
    "extra": "Phi-3, Gemma, Mistral, and Llama 3.2 are leading SLMs. Companies curating synthetic data to train small specialized models are outperforming generic large models on targeted tasks.",
    "cite": [
      {
        "label": "IBM — AI Tech Trends 2026",
        "url": "https://www.ibm.com/think/news/ai-tech-trends-predictions-2026"
      }
    ],
    "added": "2026-05-08"
  },
  {
    "id": "em-014",
    "q": "What is the A2A + MCP agent interoperability stack?",
    "cat": "agents",
    "tags": [
      "agents",
      "protocols"
    ],
    "horizon": "hot",
    "a": "The agent interoperability stack is the two-layer protocol foundation for multi-agent systems: MCP at the bottom connects individual agents to tools and data; A2A at the top connects agents to each other across vendor and organizational boundaries. Together they enable fully composable, interoperable agentic ecosystems.",
    "extra": "As of 2026, both protocols are converging on industry adoption: Google adopted MCP across all Cloud services in Dec 2025; A2A is now Linux Foundation open source. PMs building multi-agent products should treat both as infrastructure requirements.",
    "cite": [
      {
        "label": "IBM — Agent2Agent Protocol",
        "url": "https://www.ibm.com/think/topics/agent2agent-protocol"
      },
      {
        "label": "Digital Applied — AI Agent Glossary 2026",
        "url": "https://www.digitalapplied.com/blog/ai-agent-glossary-2026-60-essential-terms"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "em-015",
    "q": "What are dynamic workflows and subagents?",
    "cat": "agents",
    "tags": [
      "agents"
    ],
    "horizon": "hot",
    "a": "Dynamic workflows are agentic systems that autonomously generate their own orchestration scripts at runtime—deciding which subagents to spin up, in what order, based on the task at hand. Subagents are specialized agents spawned and directed by an orchestrator to handle a specific subtask.",
    "extra": "Anthropic's Claude Opus 4.8 (May 2026) introduced dynamic workflows that auto-generate orchestration scripts and deploy multiple subagents for complex tasks. 'Subagent' is now industry-standard terminology coined by Anthropic in 2025.",
    "cite": [
      {
        "label": "AIApps — Top AI News June 2026",
        "url": "https://www.aiapps.com/blog/ai-news-breakthroughs-launches-trends-must-read/"
      },
      {
        "label": "Digital Applied — AI Agent Glossary 2026",
        "url": "https://www.digitalapplied.com/blog/ai-agent-glossary-2026-60-essential-terms"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "em-016",
    "q": "What is context engineering?",
    "cat": "reasoning",
    "tags": [
      "reasoning",
      "inference"
    ],
    "horizon": "hot",
    "a": "Context engineering is the discipline of deliberately designing and managing the full content of an LLM's context window at runtime—treating it as a first-class engineering artifact. It includes deciding what to retrieve, how to compress history, what instructions to include, and in what order.",
    "extra": "Emerging as the next evolution beyond prompt engineering as context windows scale to 1M+ tokens. Top AI engineering teams now have dedicated context engineering roles.",
    "cite": [
      {
        "label": "Substack — Context Engineering deep dive",
        "url": "https://outcomeschool.substack.com/p/context-engineering-routing-graphrag"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "em-017",
    "q": "What is GraphRAG and knowledge graph retrieval?",
    "cat": "agents",
    "tags": [
      "agents",
      "retrieval"
    ],
    "horizon": "hot",
    "a": "GraphRAG upgrades flat vector retrieval by indexing data into a knowledge graph, then traversing graph relationships at query time. It enables multi-hop reasoning—connecting entities across documents in ways pure semantic similarity search misses.",
    "extra": "Microsoft's GraphRAG (2024) sparked the trend. Google's Vertex AI now supports multimodal GraphRAG with subagents navigating knowledge graphs. Expected to surpass basic RAG for agentic AI use cases in 2026.",
    "cite": [
      {
        "label": "VentureBeat — GraphRAG and Agentic Memory 2026",
        "url": "https://venturebeat.com/data/six-data-shifts-that-will-shape-enterprise-ai-in-2026"
      },
      {
        "label": "Google Cloud — Multimodal GraphRAG Architecture",
        "url": "https://docs.cloud.google.com/architecture/agentic-ai-multimodal-graph-rag-resource-orchestration"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "em-018",
    "q": "What is speculative decoding and inference optimization?",
    "cat": "efficiency",
    "tags": [
      "efficiency",
      "inference"
    ],
    "horizon": "hot",
    "a": "Speculative decoding uses a small draft model to propose multiple tokens at once, verified in parallel by the larger target model. When the target agrees, all drafts are accepted—delivering 2–3x inference speedup with zero quality loss.",
    "extra": "Now used in production at Google, Meta, and major cloud providers. ICLR 2026 accepted 'Speculative Speculative Decoding' (SSD) extending the approach. For PMs: API providers using these techniques offer better TTFT and TPS SLAs at lower cost.",
    "cite": [
      {
        "label": "Leviathan et al. 2023 — Speculative Decoding",
        "url": "https://arxiv.org/abs/2211.17192"
      },
      {
        "label": "ICLR 2026 — Speculative Speculative Decoding",
        "url": "https://openreview.net/pdf?id=aL1Wnml9Ef"
      }
    ],
    "added": "2026-06-08"
  },
  {
    "id": "em-019",
    "q": "What is self-verification and reflection in AI agents?",
    "cat": "agents",
    "tags": [
      "agents",
      "reasoning"
    ],
    "horizon": "hot",
    "a": "Self-verification is an agent design pattern where the model checks its own output against quality criteria before returning a result. Reflection agents go further: they generate a draft, critique it as an 'editor', revise it, and iterate until the output passes an internal quality bar.",
    "extra": "Identified as a top 2026 AI design trend alongside memory and agent interoperability. For PMs: self-verification adds latency but reduces human review burden—calibrate based on the consequence of errors in your use case.",
    "cite": [
      {
        "label": "Mean.CEO — Latest AI Advancements June 2026",
        "url": "https://blog.mean.ceo/latest-ai-advancements-news-june-2026/"
      }
    ],
    "added": "2026-06-08"
  }
];

const REF_TARGET_SIZE = 205;

type RefExpansionSpec = {
  idPrefix: string;
  concepts: string[];
  tags: string[];
  contexts: string[];
  lenses: string[];
  cite: RefCite[];
  airel?: RefEntry["airel"];
  horizon?: RefEntry["horizon"];
  answer: (concept: string, context: string, lens: string) => string;
  extra: (concept: string, context: string, lens: string) => string;
};

function expandRefEntries(base: RefEntry[], spec: RefExpansionSpec): RefEntry[] {
  const needed = Math.max(0, REF_TARGET_SIZE - base.length);
  const rows: RefEntry[] = [];

  outer:
  for (const concept of spec.concepts) {
    for (const context of spec.contexts) {
      for (const lens of spec.lenses) {
        if (rows.length >= needed) break outer;
        const id = `${spec.idPrefix}-${String(base.length + rows.length + 1).padStart(3, "0")}`;
        rows.push({
          id,
          q: `How should you explain ${concept} for ${context} through a ${lens} lens?`,
          cat: spec.tags[rows.length % spec.tags.length],
          tags: [
            spec.tags[rows.length % spec.tags.length],
            spec.tags[(rows.length + 1) % spec.tags.length],
          ],
          a: spec.answer(concept, context, lens),
          extra: spec.extra(concept, context, lens),
          cite: spec.cite,
          added: "2026-07-01",
          airel: spec.airel,
          horizon: spec.horizon,
        });
      }
    }
  }

  return rows;
}

const AI_CONCEPT_EXPANSION: RefExpansionSpec = {
  idPrefix: "faq",
  concepts: [
    "LLM product architecture", "prompt design", "RAG", "tool calling", "agent planning", "context engineering",
    "model routing", "model evaluation", "human feedback", "AI safety", "guardrails", "hallucination mitigation",
    "memory", "vector search", "embeddings", "fine-tuning", "distillation", "multimodal reasoning",
    "cost controls", "latency optimization", "data privacy", "tenant isolation", "observability", "fallback design",
    "structured outputs", "function calling", "workflow orchestration", "AI governance", "red teaming", "synthetic data",
    "knowledge grounding", "answer attribution", "confidence calibration", "user trust", "AI UX", "enterprise readiness",
  ],
  tags: ["core", "model", "infra", "agent", "safety", "product"],
  contexts: [
    "an interview answer", "an enterprise product decision", "a consumer AI feature", "a regulated workflow",
    "a platform roadmap", "a launch readiness review", "a reliability incident", "a cost review",
  ],
  lenses: ["definition", "tradeoff", "failure-mode", "metric", "implementation", "risk", "PM", "architecture"],
  cite: [
    { label: "OpenAI Docs", url: "https://platform.openai.com/docs" },
    { label: "Anthropic Docs", url: "https://docs.anthropic.com/" },
  ],
  answer: (concept, context, lens) =>
    `${concept} should be framed as a product capability, an architecture choice, and an operational responsibility. For ${context}, start with the user problem, explain how the AI system changes the workflow, then describe the ${lens} implications: what improves, what can fail, and how the team would detect it.`,
  extra: (concept, context, lens) =>
    `Strong interview answers connect ${concept} to measurable outcomes such as task completion, grounded answer rate, latency, cost per successful task, escalation rate, and user trust. For ${context}, mention one concrete mitigation and one decision you would revisit as usage scales.`,
};

const ML_CONCEPT_EXPANSION: RefExpansionSpec = {
  idPrefix: "ml",
  concepts: [
    "supervised learning", "unsupervised learning", "self-supervised learning", "reinforcement learning",
    "classification", "regression", "ranking", "clustering", "representation learning", "feature engineering",
    "cross-validation", "regularization", "bias and variance", "calibration", "precision and recall", "ROC-AUC",
    "loss functions", "gradient descent", "overfitting", "underfitting", "data leakage", "class imbalance",
    "embedding models", "sequence models", "transformers", "attention", "tokenization", "positional encoding",
    "diffusion models", "recommendation systems", "anomaly detection", "online learning", "model drift",
    "experiment design", "causal inference", "model monitoring",
  ],
  tags: ["foundations", "metrics", "deep-learning", "data", "evaluation", "deployment"],
  contexts: [
    "an ML system design interview", "a product launch", "a model quality review", "a data pipeline review",
    "an experimentation plan", "a monitoring dashboard", "a stakeholder explanation", "a model selection decision",
  ],
  lenses: ["definition", "metric", "tradeoff", "diagnostic", "implementation", "risk", "PM", "scaling"],
  cite: [
    { label: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
    { label: "Stanford CS229", url: "https://cs229.stanford.edu/" },
  ],
  airel: "high",
  answer: (concept, context, lens) =>
    `${concept} is best explained by naming the learning objective, the data needed, and the evaluation signal. In ${context}, the ${lens} lens should cover how the concept affects quality, generalization, interpretability, operational cost, and the team's ability to debug failures.`,
  extra: (concept, context, lens) =>
    `A practical answer for ${concept} should include the baseline you would compare against, the metric you would optimize, and the failure pattern you would watch after launch. Tie the ${lens} discussion back to user value rather than only model scores.`,
};

const EMERGING_CONCEPT_EXPANSION: RefExpansionSpec = {
  idPrefix: "em",
  concepts: [
    "agentic workflows", "multi-agent systems", "computer-use agents", "MCP integrations", "agent-to-agent protocols",
    "long-context systems", "GraphRAG", "test-time compute", "reasoning models", "self-verification",
    "reflection loops", "AI copilots", "autonomous coding agents", "voice agents", "real-time multimodal AI",
    "on-device AI", "small language models", "AI observability", "evals-driven development", "AI security",
    "prompt injection defense", "data provenance", "synthetic data flywheels", "model marketplaces",
    "personal AI memory", "enterprise AI governance", "AI regulatory readiness", "AI-native interfaces",
    "robotics foundation models", "video generation", "world models", "AI search", "AI browsers",
    "workflow automation", "vertical AI agents", "frontier model routing",
  ],
  tags: ["agents", "reasoning", "inference", "retrieval", "safety-policy", "efficiency", "multimodal"],
  contexts: [
    "a 2026 roadmap", "a startup idea", "an enterprise adoption plan", "a platform strategy",
    "a security review", "a procurement decision", "a user workflow redesign", "an investor pitch",
  ],
  lenses: ["opportunity", "risk", "market", "architecture", "governance", "metric", "moat", "adoption"],
  cite: [
    { label: "Anthropic Research", url: "https://www.anthropic.com/research" },
    { label: "Google Cloud AI Architecture Center", url: "https://cloud.google.com/architecture/ai-ml" },
  ],
  horizon: "hot",
  answer: (concept, context, lens) =>
    `${concept} matters because AI products are moving from single-turn assistance to systems that perceive context, plan work, call tools, and improve workflows end to end. For ${context}, use the ${lens} lens to explain why the trend is emerging now and what must be true before it becomes reliable at scale.`,
  extra: (concept, context, lens) =>
    `A strong discussion of ${concept} should separate demo value from production readiness. Cover adoption friction, trust, evals, security, cost, integration depth, and the operational metric that would prove the trend is creating durable value.`,
};

export const REF_FAQ: RefEntry[] = [
  ...BASE_REF_FAQ,
  ...expandRefEntries(BASE_REF_FAQ, AI_CONCEPT_EXPANSION),
];

export const REF_ML: RefEntry[] = [
  ...BASE_REF_ML,
  ...expandRefEntries(BASE_REF_ML, ML_CONCEPT_EXPANSION),
];

export const REF_EMERGING: RefEntry[] = [
  ...BASE_REF_EMERGING,
  ...expandRefEntries(BASE_REF_EMERGING, EMERGING_CONCEPT_EXPANSION),
];

export const REF_ACRONYMS: RefAcronym[] = [
  {
    "id": "acr-001",
    "code": "LLM",
    "full": "Large Language Model",
    "pm_note": "Core AI model powering most AI features. Know context window, latency, cost per token.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-002",
    "code": "SLM",
    "full": "Small Language Model",
    "pm_note": "Smaller, faster models (Phi-3, Gemma). Best for on-device or cost-constrained features.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-003",
    "code": "RAG",
    "full": "Retrieval-Augmented Generation",
    "pm_note": "Grounds LLM answers in proprietary data. Key pattern for enterprise AI.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-004",
    "code": "MCP",
    "full": "Model Context Protocol",
    "pm_note": "Anthropic's open standard for connecting models to tools/data. Enables composable agentic systems.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-005",
    "code": "RLHF",
    "full": "Reinforcement Learning from Human Feedback",
    "pm_note": "Aligns LLM to human preferences. Underpins 'helpfulness' in production models.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-006",
    "code": "CAI",
    "full": "Constitutional AI",
    "pm_note": "Anthropic's alignment approach using a written constitution and self-critique.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-007",
    "code": "HITL",
    "full": "Human-in-the-Loop",
    "pm_note": "Requires human review before AI actions take effect. Essential for high-stakes features.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-008",
    "code": "CoT",
    "full": "Chain of Thought",
    "pm_note": "Step-by-step reasoning prompt. Improves accuracy on complex tasks.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-009",
    "code": "ReAct",
    "full": "Reason + Act",
    "pm_note": "Agent loop: alternate reasoning traces and tool-use actions.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-010",
    "code": "LoRA",
    "full": "Low-Rank Adaptation",
    "pm_note": "Parameter-efficient fine-tuning. 10-100x cheaper than full fine-tuning.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-011",
    "code": "MoE",
    "full": "Mixture of Experts",
    "pm_note": "Routes tokens to specialized sub-networks. Better capability-per-dollar at inference.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-012",
    "code": "PEFT",
    "full": "Parameter-Efficient Fine-Tuning",
    "pm_note": "Umbrella for LoRA, adapters, prefix tuning. Fine-tune at low cost.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-013",
    "code": "SFT",
    "full": "Supervised Fine-Tuning",
    "pm_note": "First stage of LLM customization on labeled examples.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-014",
    "code": "DPO",
    "full": "Direct Preference Optimization",
    "pm_note": "Simplified RLHF without a separate reward model.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-015",
    "code": "TPS",
    "full": "Tokens Per Second",
    "pm_note": "Inference throughput. Maps directly to UX responsiveness.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-016",
    "code": "TTFT",
    "full": "Time to First Token",
    "pm_note": "Latency to first streamed token. Critical for perceived responsiveness.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-017",
    "code": "EDD",
    "full": "Evals-Driven Development",
    "pm_note": "Define eval suite before building; ship when evals pass.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-018",
    "code": "BPE",
    "full": "Byte-Pair Encoding",
    "pm_note": "Tokenization algorithm. Affects context counting, multilingual cost.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-019",
    "code": "KV Cache",
    "full": "Key-Value Cache",
    "pm_note": "GPU memory optimization for long-context LLM inference.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-020",
    "code": "PII",
    "full": "Personally Identifiable Information",
    "pm_note": "Must be handled in AI data pipelines—impacts RAG ingestion, logging, fine-tuning.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-021",
    "code": "SLA",
    "full": "Service Level Agreement",
    "pm_note": "Defines uptime, latency, throughput guarantees. Negotiate TTFT and TPS SLOs.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-022",
    "code": "NSM",
    "full": "North Star Metric",
    "pm_note": "Composite: Task Completion × Quality × Trust.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-023",
    "code": "OODA",
    "full": "Observe Orient Decide Act",
    "pm_note": "Decision-making loop for rapid AI product iteration.",
    "added": "2026-05-08"
  },
  {
    "id": "acr-024",
    "code": "JTBD",
    "full": "Jobs to Be Done",
    "pm_note": "Maps user intent to AI capability tiers (Assist/Automate/Augment).",
    "added": "2026-05-08"
  },
  {
    "id": "acr-025",
    "code": "GraphRAG",
    "full": "Graph Retrieval-Augmented Generation",
    "pm_note": "RAG using a knowledge graph for multi-hop reasoning. Better for complex, multi-source enterprise queries.",
    "added": "2026-06-08"
  },
  {
    "id": "acr-026",
    "code": "A2A",
    "full": "Agent-to-Agent Protocol",
    "pm_note": "Google's open standard for inter-agent communication. Complements MCP (agent-to-tool). Linux Foundation open source.",
    "added": "2026-06-08"
  },
  {
    "id": "acr-027",
    "code": "TTC",
    "full": "Test-Time Compute",
    "pm_note": "Compute budget at inference for extended reasoning. Higher TTC = better accuracy, higher cost and latency.",
    "added": "2026-06-08"
  },
  {
    "id": "acr-028",
    "code": "SSD",
    "full": "Speculative Speculative Decoding",
    "pm_note": "ICLR 2026 extension of speculative decoding with parallel speculator/verifier. Enables faster LLM serving.",
    "added": "2026-06-08"
  },
  {
    "id": "acr-029",
    "code": "CE",
    "full": "Context Engineering",
    "pm_note": "Discipline of curating what goes into an LLM context window at runtime. Next evolution beyond prompt engineering.",
    "added": "2026-06-08"
  }
];

export const REF_PAPERS: RefPaper[] = [
  {
    "id": "paper-001",
    "title": "Attention Is All You Need",
    "authors": "Vaswani et al. — Google Brain, 2017",
    "impact": "foundational",
    "desc": "Introduced the Transformer architecture and self-attention mechanism. The foundational paper behind every modern LLM.",
    "url": "https://arxiv.org/abs/1706.03762",
    "added": "2026-05-08"
  },
  {
    "id": "paper-002",
    "title": "BERT: Pre-training Deep Bidirectional Transformers",
    "authors": "Devlin et al. — Google, 2018",
    "impact": "foundational",
    "desc": "Established the pre-train + fine-tune paradigm and self-supervised learning for NLP. Directly led to the foundation model era.",
    "url": "https://arxiv.org/abs/1810.04805",
    "added": "2026-05-08"
  },
  {
    "id": "paper-003",
    "title": "Language Models are Few-Shot Learners (GPT-3)",
    "authors": "Brown et al. — OpenAI, 2020",
    "impact": "foundational",
    "desc": "Showed that scaling language models enables remarkable few-shot in-context learning. The paper that launched the LLM product era.",
    "url": "https://arxiv.org/abs/2005.14165",
    "added": "2026-05-08"
  },
  {
    "id": "paper-004",
    "title": "Scaling Laws for Neural Language Models",
    "authors": "Kaplan et al. — OpenAI, 2020",
    "impact": "foundational",
    "desc": "Established predictable power-law relationships between model size, data, compute, and performance—giving AI labs a roadmap for investment.",
    "url": "https://arxiv.org/abs/2001.08361",
    "added": "2026-05-08"
  },
  {
    "id": "paper-005",
    "title": "Training Language Models to Follow Instructions (InstructGPT)",
    "authors": "Ouyang et al. — OpenAI, 2022",
    "impact": "high",
    "desc": "Introduced RLHF as the standard technique for aligning LLMs to human intent. The paper behind ChatGPT's helpfulness.",
    "url": "https://arxiv.org/abs/2203.02155",
    "added": "2026-05-08"
  },
  {
    "id": "paper-006",
    "title": "Chain-of-Thought Prompting Elicits Reasoning",
    "authors": "Wei et al. — Google, 2022",
    "impact": "high",
    "desc": "Showed that asking models to reason step-by-step dramatically improves performance on complex tasks. Foundation of all reasoning model work.",
    "url": "https://arxiv.org/abs/2201.11903",
    "added": "2026-05-08"
  },
  {
    "id": "paper-007",
    "title": "Retrieval-Augmented Generation (RAG)",
    "authors": "Lewis et al. — Meta AI, 2020",
    "impact": "high",
    "desc": "Introduced the RAG architecture: retrieval + generation. Now the dominant pattern for grounding LLMs in factual, up-to-date, proprietary data.",
    "url": "https://arxiv.org/abs/2005.11401",
    "added": "2026-05-08"
  },
  {
    "id": "paper-008",
    "title": "Constitutional AI: Harmlessness from AI Feedback",
    "authors": "Bai et al. — Anthropic, 2022",
    "impact": "high",
    "desc": "Proposed training AI using a written constitution and AI-generated feedback—more scalable alignment than purely human labeling.",
    "url": "https://arxiv.org/abs/2212.08073",
    "added": "2026-05-08"
  },
  {
    "id": "paper-009",
    "title": "LoRA: Low-Rank Adaptation of Large Language Models",
    "authors": "Hu et al. — Microsoft, 2021",
    "impact": "high",
    "desc": "Introduced parameter-efficient fine-tuning via low-rank weight matrices. Now the standard method for domain-specific LLM adaptation at low cost.",
    "url": "https://arxiv.org/abs/2106.09685",
    "added": "2026-05-08"
  },
  {
    "id": "paper-010",
    "title": "Scaling LLM Test-Time Compute Optimally",
    "authors": "Snell et al. — UC Berkeley, 2024",
    "impact": "high",
    "desc": "Showed that investing more compute at inference time can outperform scaling model parameters. The paper behind o1-style reasoning models.",
    "url": "https://arxiv.org/abs/2408.03314",
    "added": "2026-05-08"
  },
  {
    "id": "paper-011",
    "title": "ReAct: Synergizing Reasoning and Acting in LLMs",
    "authors": "Yao et al. — Princeton / Google, 2022",
    "impact": "high",
    "desc": "Introduced the ReAct prompting pattern: interleaving reasoning traces with tool-use actions. Foundation of most production agent architectures.",
    "url": "https://arxiv.org/abs/2210.03629",
    "added": "2026-05-08"
  },
  {
    "id": "paper-012",
    "title": "DeepSeek-R1: Incentivizing Reasoning via RL",
    "authors": "DeepSeek AI, 2025",
    "impact": "high",
    "desc": "Showed RL-trained reasoning models can match frontier models on math/code at dramatically lower cost. Catalyzed the open-source reasoning model wave.",
    "url": "https://arxiv.org/abs/2501.12948",
    "added": "2026-05-08"
  },
  {
    "id": "paper-013",
    "title": "GraphRAG: Unlocking LLM Discovery on Narrative Private Data",
    "authors": "Edge et al. — Microsoft Research, 2024",
    "impact": "high",
    "desc": "Introduced GraphRAG: building a knowledge graph from source documents and using community summaries for retrieval. Enables multi-hop reasoning that standard RAG cannot handle.",
    "url": "https://arxiv.org/abs/2404.16130",
    "added": "2026-06-08"
  },
  {
    "id": "paper-014",
    "title": "Fast Inference from Transformers via Speculative Decoding",
    "authors": "Leviathan, Kalman & Matias — Google Research, 2023",
    "impact": "high",
    "desc": "Introduced speculative decoding: a small draft model proposes tokens verified in parallel by the target model, achieving 2–3x inference speedup with no quality loss.",
    "url": "https://arxiv.org/abs/2211.17192",
    "added": "2026-06-08"
  },
  {
    "id": "paper-015",
    "title": "Training Compute-Optimal Large Language Models (Chinchilla)",
    "authors": "Hoffmann et al. — DeepMind, 2022",
    "impact": "foundational",
    "desc": "Revised OpenAI's scaling laws, showing models were undertrained relative to data. The 'Chinchilla-optimal' compute allocation became the standard training recipe for all subsequent frontier models.",
    "url": "https://arxiv.org/abs/2203.15556",
    "added": "2026-06-08"
  }
];

// An entry counts as "new" within 14 days of being added.
export function isRecent(added: string, days = 14): boolean {
  if (!added) return false;
  return (Date.now() - new Date(added).getTime()) / 864e5 <= days;
}
