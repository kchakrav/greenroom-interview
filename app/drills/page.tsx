"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Dumbbell, Clock } from "lucide-react";
import Nav from "@/components/Nav";
import { useStage } from "@/lib/useStage";
import { competenciesFor, lookup } from "@/lib/taxonomy";
import { QUESTION_BANK } from "@/lib/questionBank";

const DRILL_QUESTION_COUNT = 10;

export default function DrillsPage() {
  const router = useRouter();
  const { config, set } = useStage();
  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const bankCompetencies = QUESTION_BANK
    .filter((q) => q.disciplineId === config.disciplineId && q.levels.includes(config.seniorityId))
    .map((q) => q.competency);
  const comps = Array.from(new Set([...role.focusAreas, ...competenciesFor(config.disciplineId, config.roleId, config.seniorityId), ...bankCompetencies]));
  const countsByCompetency = QUESTION_BANK
    .filter((q) => q.disciplineId === config.disciplineId && q.levels.includes(config.seniorityId))
    .reduce<Record<string, number>>((acc, q) => {
      acc[q.competency] = (acc[q.competency] ?? 0) + 1;
      return acc;
    }, {});

  function startDrill(competency: string) {
    set({ mode: "practice", drill: { competency, questionCount: DRILL_QUESTION_COUNT }, pathStep: undefined, modalities: ["voice", "text"], durationMin: 15 });
    router.push("/interview");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Nav />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Quick <span className="accent-text">drills</span>.</h1>
      <p className="mt-2 max-w-xl text-ink-secondary">
        Focused reps on one competency — {DRILL_QUESTION_COUNT} questions from the expanded bank, ~15 minutes, instant feedback. Perfect for targeting a weak spot.
        Currently tuned for <b className="text-ink-primary">{seniority.label} {role.label}</b> (change that on the Practice page).
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {comps.map((c, i) => (
          <motion.button
            key={c}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => startDrill(c)}
            className="glass group flex items-center justify-between rounded-2xl p-5 text-left transition hover:ring-2 hover:ring-accent"
          >
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <Dumbbell className="h-4 w-4" style={{ color: "var(--accent)" }} /> {c}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="h-3 w-3" /> ~15 min · {DRILL_QUESTION_COUNT}-question drill · {countsByCompetency[c] ?? 0} available
              </div>
            </div>
            <span className="accent-text opacity-0 transition group-hover:opacity-100">Start →</span>
          </motion.button>
        ))}
      </div>
    </main>
  );
}
