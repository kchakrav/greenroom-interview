"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Check, X, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import Nav from "@/components/Nav";
import { useStage } from "@/lib/useStage";
import { DISCIPLINES, lookup } from "@/lib/taxonomy";
import { quizTopics } from "@/lib/quiz";
import { markStepComplete } from "@/lib/pathProgress";
import type { MCQ } from "@/lib/quiz";

type Phase = "setup" | "loading" | "quiz" | "done";

const AREAS = DISCIPLINES.map((d) => ({ id: d.id, label: d.label }));
const LEARN_QUESTION_COUNT = 100;

export default function LearnPage() {
  const router = useRouter();
  const { config, set } = useStage();
  const [disciplineId, setDisciplineId] = useState(config.disciplineId);
  const [topic, setTopic] = useState("all");

  // Honor a hint from the home "AI / ML" card (set just before navigation).
  useEffect(() => {
    try {
      const hint = localStorage.getItem("aii-learn-area");
      if (hint) { setDisciplineId(hint); setTopic("all"); localStorage.removeItem("aii-learn-area"); }
    } catch {}
  }, []);
  const [phase, setPhase] = useState<Phase>("setup");
  const [qs, setQs] = useState<MCQ[]>([]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const topics = quizTopics(disciplineId);

  async function start() {
    setPhase("loading");
    setErr(null);
    try {
      const r = await fetch("/api/quiz", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disciplineId, topic, count: LEARN_QUESTION_COUNT }),
      });
      const d = await r.json();
      if (!r.ok || !d.questions?.length) throw new Error(d.error || "No questions found for that selection.");
      setQs(d.questions); setI(0); setPicked(null); setAnswers([]); setPhase("quiz");
    } catch (e: any) { setErr(e.message); setPhase("setup"); }
  }

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    setAnswers((a) => [...a, { correct: idx === qs[i].correctIndex }]);
  }
  function next() {
    if (i + 1 < qs.length) { setI(i + 1); setPicked(null); }
    else {
      if (config.pathStep) markStepComplete(config.pathStep.pathId, config.pathStep.stepIndex);
      setPhase("done");
    }
  }

  const score = answers.filter((a) => a.correct).length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Nav />
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
        <GraduationCap className="h-7 w-7" style={{ color: "var(--accent)" }} /> Learn the <span className="accent-text">concepts</span>.
      </h1>
      <p className="mt-2 text-ink-secondary">Deep 100-question concept sets to build your foundation before you interview. Totally optional — learn at your pace.</p>

      {phase === "setup" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass mt-8 rounded-3xl p-8">
          <Label>Area</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AREAS.map((d) => (
              <Chip key={d.id} active={disciplineId === d.id} onClick={() => { setDisciplineId(d.id); setTopic("all"); }}>{d.label}</Chip>
            ))}
          </div>
          <Label className="mt-6">Topic</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip active={topic === "all"} onClick={() => setTopic("all")}>All topics</Chip>
            {topics.map((t) => <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>{t}</Chip>)}
          </div>
          {err && <p className="mt-4 text-sm text-signal-bad">{err}</p>}
          <button onClick={start} className="btn-accent mt-7 rounded-full px-8 py-3">Start 100-question set →</button>
        </motion.div>
      )}

      {phase === "loading" && (
        <div className="glass mt-8 flex items-center justify-center gap-2 rounded-3xl p-12 text-ink-secondary">
          <Loader2 className="h-5 w-5 animate-spin" /> Preparing your questions…
        </div>
      )}

      {phase === "quiz" && qs[i] && (
        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass mt-8 rounded-3xl p-8">
          <div className="mb-3 flex items-center justify-between text-xs text-ink-muted">
            <span>Question {i + 1} of {qs.length}</span>
            <span>{qs[i].topic}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full btn-accent" style={{ width: `${((i + (picked !== null ? 1 : 0)) / qs.length) * 100}%` }} />
          </div>
          <h2 className="mt-5 text-xl text-ink-primary">{qs[i].question}</h2>
          <div className="mt-5 space-y-2">
            {qs[i].options.map((opt, idx) => {
              const isCorrect = idx === qs[i].correctIndex;
              const chosen = picked === idx;
              const reveal = picked !== null;
              return (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  disabled={reveal}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                    reveal && isCorrect ? "border-signal-ok/50 bg-signal-ok/10 text-ink-primary"
                    : reveal && chosen ? "border-signal-bad/50 bg-signal-bad/10 text-ink-primary"
                    : "border-hair glass text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {opt}
                  {reveal && isCorrect && <Check className="h-4 w-4 text-signal-ok" />}
                  {reveal && chosen && !isCorrect && <X className="h-4 w-4 text-signal-bad" />}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {picked !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 overflow-hidden">
                <div className="rounded-xl bg-white/[0.04] p-4 text-sm">
                  <p className="text-ink-secondary">{qs[i].explanation}</p>
                  <p className="mt-2 text-xs text-ink-muted">Source: {qs[i].source}</p>
                </div>
                <button onClick={next} className="btn-accent mt-4 flex items-center gap-2 rounded-full px-6 py-2.5">
                  {i + 1 < qs.length ? "Next" : "See results"} <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass mt-8 rounded-3xl p-10 text-center">
          <div className="text-6xl font-bold accent-text">{score}/{qs.length}</div>
          <p className="mt-3 text-ink-secondary">
            {score === qs.length ? "Perfect — you've got the fundamentals down. Ready for the real thing?"
              : score >= qs.length * 0.6 ? "Nice work. Review the misses, then try a mock interview."
              : "Good start — revisit these concepts and run it again. Learning is the point."}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button onClick={() => setPhase("setup")} className="glass-strong flex items-center gap-2 rounded-full px-6 py-3 text-ink-secondary transition hover:text-ink-primary"><RotateCcw className="h-4 w-4" /> Another set</button>
            <button
              onClick={() => { set({ mode: "practice", disciplineId, drill: undefined, pathStep: undefined }); router.push("/interview"); }}
              className="btn-accent flex items-center gap-2 rounded-full px-6 py-3"
            >
              Ready — take a mock interview <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-semibold uppercase tracking-wider text-ink-secondary ${className}`}>{children}</div>;
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-4 py-2 text-sm transition ${active ? "btn-accent" : "glass text-ink-secondary hover:text-ink-primary"}`}>
      {children}
    </button>
  );
}
