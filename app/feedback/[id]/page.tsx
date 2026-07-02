"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, TrendingUp, ShieldCheck, Loader2 } from "lucide-react";
import SkillRadar from "@/components/SkillRadar";
import CoachChat from "@/components/CoachChat";
import { recordCompletion, type Progress } from "@/components/gamify";
import { getClientSession } from "@/lib/clientSession";
import { addAttempt } from "@/lib/history";
import { markStepComplete } from "@/lib/pathProgress";
import { lookup } from "@/lib/taxonomy";
import type { InterviewSession, ScoreReport } from "@/lib/types";

export default function Feedback({ params }: { params: { id: string } }) {
  const { data: authSession } = useSession();
  const userId = authSession?.user?.id ?? null;
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const recorded = useRef(false);

  useEffect(() => {
    const s = getClientSession(params.id);
    if (!s) {
      setErr("This report isn't on this device. Reports are stored locally in your browser — finish an interview to see one here.");
      return;
    }
    setSession(s);
    const rep: ScoreReport | undefined = s.report;
    if (rep && !recorded.current) {
      recorded.current = true;
      setProgress(recordCompletion(rep.overall, rep.competencies));
      const { role } = lookup(s.config.disciplineId, s.config.roleId, s.config.seniorityId);
      addAttempt({
        id: s.id,
        at: s.completedAt ?? Date.now(),
        disciplineId: s.config.disciplineId,
        roleId: s.config.roleId,
        roleLabel: role.label,
        seniorityId: s.config.seniorityId,
        overall: rep.overall,
        competencies: rep.competencies.map((c) => ({ competency: c.competency, score: c.score })),
        drill: s.config.drill?.competency,
        pathId: s.config.pathStep?.pathId,
      }, userId);
      if (s.config.pathStep) markStepComplete(s.config.pathStep.pathId, s.config.pathStep.stepIndex);
    }
  }, [params.id]);

  if (err) return <Center>⚠️ {err}</Center>;
  if (!session) return <Center><Loader2 className="h-6 w-6 animate-spin" /> Loading your report…</Center>;
  const report = session.report;
  if (!report) return <Center>No report yet for this session.</Center>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/" className="text-sm text-ink-muted hover:text-ink-secondary">← New interview</Link>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-4 rounded-3xl p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-widest text-ink-muted">Overall</div>
            <div className="mt-1 text-6xl font-bold accent-text">{report.overall.toFixed(1)}<span className="text-2xl text-ink-muted">/5</span></div>
            <div className="mt-2 flex items-center gap-2 text-ink-secondary"><Award className="h-4 w-4" /> {report.recommendation}</div>
            {progress && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-ink-secondary">
                <TrendingUp className="h-4 w-4" /> +XP earned · Lvl {progress.level} · 🔥 {progress.streak}d streak
              </div>
            )}
          </div>
          <SkillRadar data={report.competencies.map((c) => ({ competency: c.competency, score: c.score }))} />
        </div>
        <p className="mt-6 text-ink-secondary">{report.summary}</p>
      </motion.div>

      {/* Delivery analytics */}
      {report.delivery && (
        <Card title="Delivery">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Stat label="Pace" value={`${Math.round(report.delivery.pace)} wpm`} />
            <Stat label="Filler words" value={String(report.delivery.fillerWords)} />
            <Stat label="Structure (STAR)" value={`${report.delivery.structure}/5`} />
            <Stat label="Clarity" value={`${report.delivery.clarity}/5`} />
            <Stat label="Confidence" value={`${report.delivery.confidence}/5`} />
          </div>
          {report.delivery.notes && <p className="mt-4 text-sm text-ink-secondary">{report.delivery.notes}</p>}
        </Card>
      )}

      {/* Competency breakdown (BARS) */}
      <Card title="Competency breakdown">
        <div className="space-y-3">
          {report.competencies.map((c) => (
            <div key={c.competency} className="rounded-xl bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.competency}</span>
                <span className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className="h-2 w-6 rounded-full" style={{ background: n <= c.score ? "var(--accent)" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-secondary"><b className="text-ink-primary">Level:</b> {c.anchor}</p>
              <p className="mt-1 text-sm text-ink-muted"><b>Evidence:</b> {c.evidence}</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <p className="text-sm text-signal-ok">✓ {c.strengths}</p>
                <p className="text-sm text-signal-warn">→ {c.improvement}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Improvement plan (mentoring) */}
      <Card title="Your improvement plan">
        <div className="space-y-3">
          {report.improvementPlan.map((p, i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] p-4">
              <div className="font-medium accent-text">{p.area}</div>
              <p className="mt-1 text-sm text-ink-secondary">{p.why}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink-secondary">
                {p.drills.map((d, j) => <li key={j}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Ask the coach — mentoring follow-up chat */}
      <CoachChat session={session} />

      {/* Fairness / transparency */}
      <div className="glass mt-6 flex gap-3 rounded-2xl p-5 text-sm text-ink-secondary">
        <ShieldCheck className="h-5 w-5 shrink-0 text-signal-ok" />
        <span><b className="text-ink-primary">Fairness & transparency:</b> {report.fairnessNote}</span>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-accent rounded-full px-8 py-3">Practice again →</Link>
      </div>
    </main>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <main className="flex h-screen items-center justify-center gap-2 text-ink-secondary">{children}</main>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-6 rounded-2xl p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-secondary">{title}</h2>
      {children}
    </motion.section>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
