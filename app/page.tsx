"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useStage } from "@/lib/useStage";
import { DISCIPLINES, SENIORITIES, TONES, lookup } from "@/lib/taxonomy";
import Nav from "@/components/Nav";
import type { Modality } from "@/lib/types";

const MODALITIES: { id: Modality; label: string }[] = [
  { id: "voice", label: "Voice" },
  { id: "text", label: "Text" },
  { id: "video", label: "Video" },
  { id: "coding", label: "Coding" },
];

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as any)[name] ?? Icons.Circle;
  return <C className={className} />;
}

export default function Onboarding() {
  const router = useRouter();
  const { config, set } = useStage();
  const { discipline, role } = lookup(config.disciplineId, config.roleId, config.seniorityId);

  useEffect(() => {
    const t = TONES.find((t) => t.id === config.tone)!;
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent2", t.accent2);
  }, [config.tone]);

  const toggleFocus = (f: string) =>
    set({ focusAreas: config.focusAreas.includes(f) ? config.focusAreas.filter((x) => x !== f) : [...config.focusAreas, f] });
  const toggleModality = (m: Modality) =>
    set({ modalities: config.modalities.includes(m) ? config.modalities.filter((x) => x !== m) : [...config.modalities, m] });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Nav />

      {/* Choose how to practice — non-rigid: pick what fits today */}
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">How do you want to practice?</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <PracticeCard icon="GraduationCap" title="Learn concepts" blurb="Multiple-choice Q&A to build your foundation." onClick={() => router.push("/learn")} />
        <PracticeCard icon="Library" title="Knowledge bank" blurb="Browse AI/ML concepts, trends, acronyms & papers." onClick={() => router.push("/reference")} />
        <PracticeCard icon="BrainCircuit" title="AI / ML" blurb="Knowledge base: fundamentals → LLMs, RAG, agents → latest." onClick={() => { try { localStorage.setItem("aii-learn-area", "aiml"); } catch {} router.push("/learn"); }} />
        <PracticeCard icon="Dumbbell" title="Quick drill" blurb="2-question rep on one competency." onClick={() => router.push("/drills")} />
        <PracticeCard icon="Map" title="Learning path" blurb="A guided curriculum, concepts → interview." onClick={() => router.push("/paths")} />
        <PracticeCard icon="Mic" title="Mock interview" blurb="Full adaptive interview. Set it up below ↓" highlight />
      </div>

      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-4xl font-bold tracking-tight md:text-5xl">
        Set the <span className="accent-text">stage</span>.
      </motion.h1>
      <p className="mt-3 max-w-xl text-ink-secondary">
        Configure a full mock interview — pick your discipline, role, level and the interviewer's tone, then step into the room.
      </p>

      {/* Discipline */}
      <Section title="Discipline">
        {DISCIPLINES.map((d) => (
          <Tile key={d.id} active={config.disciplineId === d.id} onClick={() => set({ disciplineId: d.id, roleId: d.roles[0].id, focusAreas: [] })}>
            <Icon name={d.icon} className="h-5 w-5" />
            {d.label}
          </Tile>
        ))}
      </Section>

      {/* Role */}
      <Section title="Role">
        {discipline.roles.map((r) => (
          <Chip key={r.id} active={config.roleId === r.id} onClick={() => set({ roleId: r.id, focusAreas: [] })}>
            {r.label}
          </Chip>
        ))}
      </Section>

      {/* Seniority */}
      <Section title="Seniority">
        {SENIORITIES.map((s) => (
          <Chip key={s.id} active={config.seniorityId === s.id} onClick={() => set({ seniorityId: s.id })}>
            {s.label}
          </Chip>
        ))}
      </Section>

      {/* Focus areas */}
      <Section title="Focus areas" hint="optional — defaults to the role's standard set">
        {role.focusAreas.map((f) => (
          <Chip key={f} active={config.focusAreas.includes(f)} onClick={() => toggleFocus(f)}>
            {f}
          </Chip>
        ))}
      </Section>

      {/* Tone — retints the whole UI */}
      <Section title="Interviewer tone">
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => set({ tone: t.id })}
            className={`glass rounded-xl px-4 py-3 text-left transition ${config.tone === t.id ? "ring-2" : "opacity-80 hover:opacity-100"}`}
            style={config.tone === t.id ? ({ ["--tw-ring-color" as any]: t.accent, boxShadow: `0 0 30px ${t.accent}55` }) : {}}
          >
            <div className="flex items-center gap-2 font-medium">
              <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(90deg, ${t.accent}, ${t.accent2})` }} />
              {t.label}
            </div>
            <div className="mt-1 text-xs text-ink-muted">{t.blurb}</div>
          </button>
        ))}
      </Section>

      {/* Modalities + duration */}
      <Section title="Modalities">
        {MODALITIES.map((m) => (
          <Chip key={m.id} active={config.modalities.includes(m.id)} onClick={() => toggleModality(m.id)}>
            {m.label}
          </Chip>
        ))}
      </Section>
      <Section title="Duration">
        {[15, 30, 45, 60].map((d) => (
          <Chip key={d} active={config.durationMin === d} onClick={() => set({ durationMin: d })}>
            {d} min
          </Chip>
        ))}
      </Section>

      <div className="sticky bottom-6 mt-12 flex justify-center">
        <button
          onClick={() => { set({ mode: "practice", drill: undefined, pathStep: undefined }); router.push("/interview"); }}
          className="btn-accent rounded-full px-10 py-4 text-base"
        >
          Enter the Interview Room →
        </button>
      </div>
    </main>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">{title}</h2>
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${active ? "btn-accent" : "glass text-ink-secondary hover:text-ink-primary"}`}
    >
      {children}
    </button>
  );
}
function Tile({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`glass flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "ring-2 ring-accent" : "text-ink-secondary hover:text-ink-primary"}`}
    >
      {children}
    </button>
  );
}
function PracticeCard({ icon, title, blurb, onClick, highlight }: { icon: string; title: string; blurb: string; onClick?: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`glass group rounded-2xl p-5 text-left transition hover:ring-2 hover:ring-accent ${highlight ? "ring-1 ring-accent/40" : ""}`}
    >
      <Icon name={icon} className="h-5 w-5" />
      <div className="mt-2 font-semibold">{title}</div>
      <div className="mt-1 text-xs text-ink-muted">{blurb}</div>
    </button>
  );
}
