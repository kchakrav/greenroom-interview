"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import SkillRadar from "@/components/SkillRadar";
import { loadHistory, improvement, bestByCompetency } from "@/lib/history";
import { loadProgress, type Progress } from "@/components/gamify";
import type { AttemptSummary } from "@/lib/types";

export default function ProgressPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;
  const [h, setH] = useState<AttemptSummary[]>([]);
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => { setH(loadHistory(userId)); setP(loadProgress()); }, [userId]);

  const imp = improvement(h);
  const best = bestByCompetency(h);
  const overalls = h.map((a) => a.overall);
  const maxOverall = 5;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Nav />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your <span className="accent-text">progress</span>.</h1>
      <p className="mt-2 text-ink-secondary">Every practice run is tracked here so you can watch yourself improve.</p>

      {h.length === 0 ? (
        <div className="glass mt-8 rounded-3xl p-10 text-center">
          <p className="text-ink-secondary">No attempts yet. Your scores, trends, and improvement will appear here.</p>
          <Link href="/" className="btn-accent mt-5 inline-block rounded-full px-6 py-2.5">Start your first interview →</Link>
        </div>
      ) : (
        <>
          {/* headline stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Interviews" value={String(h.length)} />
            <Stat label="Level" value={String(p?.level ?? 1)} />
            <Stat label="Streak" value={`${p?.streak ?? 0}d 🔥`} />
            <Stat label="Best overall" value={`${Math.max(...overalls).toFixed(1)}/5`} />
          </div>

          {/* overall trend */}
          <Card title="Overall score over time">
            <div className="flex items-end gap-2" style={{ height: 140 }}>
              {h.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ height: 0 }}
                  animate={{ height: `${(a.overall / maxOverall) * 100}%` }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative flex-1 rounded-t-md btn-accent"
                  title={`${new Date(a.at).toLocaleDateString()} · ${a.overall.toFixed(1)}/5 · ${a.roleLabel}`}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-ink-muted opacity-0 transition group-hover:opacity-100">
                    {a.overall.toFixed(1)}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-ink-muted">
              <span>{new Date(h[0].at).toLocaleDateString()}</span>
              <span>{new Date(h[h.length - 1].at).toLocaleDateString()}</span>
            </div>
          </Card>

          {/* improvement per competency */}
          <Card title="Improvement by competency (first → latest)">
            <div className="space-y-2">
              {imp.map((c) => (
                <div key={c.competency} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                  <span className="w-40 shrink-0 truncate text-sm">{c.competency}</span>
                  <div className="flex flex-1 items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className="h-2 flex-1 rounded-full" style={{ background: n <= c.latest ? "var(--accent)" : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <span className={`flex w-16 items-center justify-end gap-1 text-sm ${c.delta > 0 ? "text-signal-ok" : c.delta < 0 ? "text-signal-bad" : "text-ink-muted"}`}>
                    {c.delta > 0 ? <TrendingUp className="h-4 w-4" /> : c.delta < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    {c.delta > 0 ? `+${c.delta}` : c.delta}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* best radar + attempts */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">Best scores</h2>
              <SkillRadar data={Object.entries(best).map(([competency, score]) => ({ competency, score }))} />
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-secondary">Recent attempts</h2>
              <div className="space-y-2">
                {[...h].reverse().slice(0, 8).map((a) => (
                  <Link key={a.id} href={`/feedback/${a.id}`} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-sm transition hover:bg-white/[0.06]">
                    <span className="text-ink-secondary">
                      {a.drill ? `Drill · ${a.drill}` : a.roleLabel}
                      <span className="ml-2 text-ink-muted">{new Date(a.at).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold accent-text"><Award className="h-3.5 w-3.5" /> {a.overall.toFixed(1)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-6 rounded-2xl p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-secondary">{title}</h2>
      {children}
    </motion.section>
  );
}
