"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Map, Check, GraduationCap, Dumbbell, Mic, Lock } from "lucide-react";
import Nav from "@/components/Nav";
import { useStage } from "@/lib/useStage";
import { PATHS, type PathStep } from "@/lib/paths";
import { completedSteps } from "@/lib/pathProgress";

const KIND_ICON = { quiz: GraduationCap, drill: Dumbbell, interview: Mic } as const;

export default function PathsPage() {
  const router = useRouter();
  const { set } = useStage();
  const [done, setDone] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const d: Record<string, number[]> = {};
    PATHS.forEach((p) => (d[p.id] = completedSteps(p.id)));
    setDone(d);
  }, []);

  function launch(pathId: string, idx: number, step: PathStep) {
    const { quizTopic, ...cfg } = step.apply;
    set({ ...cfg, mode: "practice", pathStep: { pathId, stepIndex: idx } });
    router.push(step.kind === "quiz" ? "/learn" : "/interview");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Nav />
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
        <Map className="h-7 w-7" style={{ color: "var(--accent)" }} /> Learning <span className="accent-text">paths</span>.
      </h1>
      <p className="mt-2 max-w-xl text-ink-secondary">Guided curricula that take you from concepts to a full interview. Do them in order, or jump to any step — your choice.</p>

      <div className="mt-8 space-y-5">
        {PATHS.map((p) => {
          const completed = done[p.id] ?? [];
          const pct = Math.round((completed.length / p.steps.length) * 100);
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  <p className="text-sm text-ink-muted">{p.blurb}</p>
                </div>
                <span className="text-sm text-ink-secondary">{completed.length}/{p.steps.length}</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full btn-accent" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-4 space-y-2">
                {p.steps.map((s, idx) => {
                  const Icon = KIND_ICON[s.kind];
                  const isDone = completed.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => launch(p.id, idx, s)}
                      className="flex w-full items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06]"
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${isDone ? "btn-accent" : "glass-strong"}`}>
                        {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5 text-ink-secondary" />}
                      </span>
                      <span className="flex-1 text-sm text-ink-primary">{s.label}</span>
                      <span className="text-xs uppercase tracking-wider text-ink-muted">{s.kind}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
