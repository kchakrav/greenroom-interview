"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library, Search, ChevronDown, ExternalLink, Flame, Clock, Link2, Minus,
  BookOpen, Brain, Rocket, FileText, Hash, ArrowRight, Sparkles,
} from "lucide-react";
import Nav from "@/components/Nav";
import {
  REF_FAQ, REF_ML, REF_EMERGING, REF_ACRONYMS, REF_PAPERS, REF_UPDATED, isRecent,
  type RefEntry,
} from "@/lib/reference";
import { QUESTION_BANK, type BankQuestion } from "@/lib/questionBank";

type TabId = "faq" | "ml" | "pmq" | "aiq" | "em" | "papers" | "acr";

const TABS: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
  { id: "faq", label: "AI Concepts", icon: BookOpen },
  { id: "ml", label: "ML Concepts", icon: Brain },
  { id: "pmq", label: "PM Questions", icon: Library },
  { id: "aiq", label: "AI Questions", icon: Sparkles },
  { id: "em", label: "Emerging", icon: Rocket },
  { id: "papers", label: "Papers", icon: FileText },
  { id: "acr", label: "Acronyms", icon: Hash },
];

const cats = (items: RefEntry[]) =>
  ["all", ...Array.from(new Set(items.flatMap((i) => i.tags)))];

export default function ReferencePage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("faq");

  const pmQuestions = QUESTION_BANK.filter((q) => q.disciplineId === "product");
  const aiQuestions = QUESTION_BANK.filter((q) => q.disciplineId === "aiml");
  const total = REF_FAQ.length + REF_ML.length + REF_EMERGING.length + REF_PAPERS.length + REF_ACRONYMS.length + pmQuestions.length + aiQuestions.length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Nav />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
            <Library className="h-7 w-7" style={{ color: "var(--accent)" }} /> Knowledge <span className="accent-text">bank</span>.
          </h1>
          <p className="mt-2 max-w-xl text-ink-secondary">
            A browsable AI/ML reference — concepts, emerging trends, an acronym glossary and landmark papers, all source-attributed. Study here, then drill it.
          </p>
        </div>
        <div className="text-right text-xs text-ink-muted">
          <div><span className="text-ink-secondary">{total}</span> entries</div>
          <div>Updated {REF_UPDATED}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-7 flex flex-wrap gap-2 border-b border-hair pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition ${
              tab === t.id ? "btn-accent" : "glass text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "faq" && <EntryList items={REF_FAQ} placeholder="Search AI concepts…" />}
        {tab === "ml" && <EntryList items={REF_ML} placeholder="Search ML concepts…" showRelevance />}
        {tab === "pmq" && <QuestionList items={pmQuestions} placeholder="Search product management interview questions…" />}
        {tab === "aiq" && <QuestionList items={aiQuestions} placeholder="Search AI interview questions…" />}
        {tab === "em" && <EntryList items={REF_EMERGING} placeholder="Search emerging concepts…" showHorizon note="Frontier concepts gaining prominence in 2025–2026." />}
        {tab === "papers" && <Papers />}
        {tab === "acr" && <Acronyms />}
      </div>

      {/* Study → drill bridge */}
      <div className="glass mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" style={{ color: "var(--accent)" }} />
          <div>
            <div className="font-semibold">Feel ready? Test yourself.</div>
            <div className="text-sm text-ink-muted">Turn what you just read into multiple-choice reps.</div>
          </div>
        </div>
        <button
          onClick={() => { try { localStorage.setItem("aii-learn-area", "aiml"); } catch {} router.push("/learn"); }}
          className="btn-accent flex items-center gap-2 rounded-full px-6 py-3"
        >
          Drill AI / ML <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}

function RelevanceBadge({ rel }: { rel?: RefEntry["airel"] }) {
  if (!rel) return null;
  if (rel === "high") return <Badge className="text-signal-ok"><Flame className="h-3 w-3" /> High AI relevance</Badge>;
  if (rel === "medium") return <Badge className="text-accent"><Link2 className="h-3 w-3" /> Medium relevance</Badge>;
  return <Badge className="text-ink-muted"><Minus className="h-3 w-3" /> General ML</Badge>;
}
function HorizonBadge({ h }: { h?: RefEntry["horizon"] }) {
  if (!h) return null;
  return h === "hot"
    ? <Badge className="text-signal-warn"><Flame className="h-3 w-3" /> Hot now</Badge>
    : <Badge className="text-accent-2"><Clock className="h-3 w-3" /> Near future</Badge>;
}
function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-hair bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}
function NewTag() {
  return <span className="rounded-full bg-signal-ok/15 px-2 py-0.5 text-[10px] font-semibold text-signal-ok">NEW</span>;
}

function EntryList({ items, placeholder, showRelevance, showHorizon, note }: {
  items: RefEntry[]; placeholder: string; showRelevance?: boolean; showHorizon?: boolean; note?: string;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const allCats = useMemo(() => cats(items), [items]);

  const shown = items.filter((it) => {
    if (cat !== "all" && !it.tags.includes(cat)) return false;
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return it.q.toLowerCase().includes(s) || it.a.toLowerCase().includes(s) || (it.extra || "").toLowerCase().includes(s);
  });

  return (
    <div>
      {note && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-hair bg-white/[0.03] p-4 text-sm text-ink-secondary">
          <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-signal-warn" /> <span>{note}</span>
        </div>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
          className="glass w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {allCats.map((c) => (
          <button
            key={c} onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition ${
              cat === c ? "btn-accent" : "glass text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {c === "all" ? "All" : c.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {shown.length === 0 && <div className="py-10 text-center text-sm text-ink-muted">No results found.</div>}
        {shown.map((it) => {
          const isOpen = open === it.id;
          return (
            <div key={it.id} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03]"
              >
                <div>
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    {it.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] capitalize text-ink-muted">{t.replace(/-/g, " ")}</span>
                    ))}
                    {showRelevance && <RelevanceBadge rel={it.airel} />}
                    {showHorizon && <HorizonBadge h={it.horizon} />}
                    {isRecent(it.added) && <NewTag />}
                  </div>
                  <div className="text-sm font-medium text-ink-primary">{it.q}</div>
                </div>
                <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-hair"
                  >
                    <div className="px-4 py-4 text-sm leading-relaxed text-ink-secondary">
                      <p>{it.a}</p>
                      {it.extra && <p className="mt-2 text-ink-muted">{it.extra}</p>}
                      {it.cite && it.cite.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {it.cite.map((c) => (
                            <a key={c.url} href={c.url} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent transition hover:bg-accent/20">
                              <ExternalLink className="h-3 w-3" /> {c.label}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 text-[11px] text-ink-muted">Added {it.added}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionList({ items, placeholder }: { items: BankQuestion[]; placeholder: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const allCats = useMemo(() => ["all", ...Array.from(new Set(items.map((i) => i.competency))).sort()], [items]);

  const shown = items.filter((it) => {
    if (cat !== "all" && it.competency !== cat) return false;
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return it.prompt.toLowerCase().includes(s) || it.guidance.toLowerCase().includes(s) || it.source.toLowerCase().includes(s) || it.competency.toLowerCase().includes(s);
  });

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
          className="glass w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {allCats.map((c) => (
          <button
            key={c} onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              cat === c ? "btn-accent" : "glass text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-ink-muted">{shown.length} of {items.length} questions</div>
      <div className="mt-4 space-y-2">
        {shown.length === 0 && <div className="py-10 text-center text-sm text-ink-muted">No results found.</div>}
        {shown.map((it) => {
          const isOpen = open === it.id;
          return (
            <div key={it.id} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.03]"
              >
                <div>
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-muted">{it.competency}</span>
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-muted">{it.type}</span>
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-muted">Difficulty {it.difficulty}</span>
                  </div>
                  <div className="text-sm font-medium text-ink-primary">{it.prompt}</div>
                </div>
                <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-hair"
                  >
                    <div className="px-4 py-4 text-sm leading-relaxed text-ink-secondary">
                      <p>{it.guidance}</p>
                      <p className="mt-3 text-xs text-ink-muted">Source: {it.source}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Papers() {
  const [q, setQ] = useState("");
  const shown = REF_PAPERS.filter((p) => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return p.title.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || p.authors.toLowerCase().includes(s);
  });
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search landmark papers…"
          className="glass w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
      </div>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {shown.map((p) => (
          <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="glass group flex flex-col rounded-2xl p-4 transition hover:ring-2 hover:ring-accent">
            <div className="flex items-start justify-between gap-2">
              <FileText className="h-5 w-5 text-accent" />
              <div className="flex items-center gap-1.5">
                {isRecent(p.added) && <NewTag />}
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.impact === "foundational" ? "bg-signal-warn/15 text-signal-warn" : "bg-signal-ok/15 text-signal-ok"}`}>
                  {p.impact === "foundational" ? "Foundational" : "High impact"}
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-ink-primary">{p.title}</div>
            <div className="mt-0.5 text-[11px] text-ink-muted">{p.authors}</div>
            <p className="mt-2 text-xs leading-relaxed text-ink-secondary">{p.desc}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-accent">
              <ExternalLink className="h-3 w-3" /> Read paper
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Acronyms() {
  const [q, setQ] = useState("");
  const shown = REF_ACRONYMS.filter((a) => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return a.code.toLowerCase().includes(s) || a.full.toLowerCase().includes(s) || a.pm_note.toLowerCase().includes(s);
  });
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter acronyms…"
          className="glass w-full rounded-xl py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-hair">
        {shown.map((a, i) => (
          <div key={a.id} className={`flex flex-col gap-1 px-4 py-3 transition hover:bg-white/[0.03] sm:flex-row sm:gap-4 ${i > 0 ? "border-t border-hair" : ""}`}>
            <div className="w-20 shrink-0 font-mono text-sm font-semibold text-accent">{a.code}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-ink-primary">
                {a.full} {isRecent(a.added) && <NewTag />}
              </div>
              <div className="mt-0.5 text-xs text-ink-secondary">{a.pm_note}</div>
            </div>
          </div>
        ))}
        {shown.length === 0 && <div className="py-10 text-center text-sm text-ink-muted">No matches.</div>}
      </div>
    </div>
  );
}
