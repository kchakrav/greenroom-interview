"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Download, ChevronDown, ChevronRight, BookOpen, FileText } from "lucide-react";
import Nav from "@/components/Nav";
import { QUESTION_BANK, queryBank, bankFacets, type QType } from "@/lib/questionBank";
import { SENIORITIES, lookup } from "@/lib/taxonomy";
import { loadHistory } from "@/lib/history";
import { getClientSession } from "@/lib/clientSession";
import type { AttemptSummary } from "@/lib/types";

type Tab = "questions" | "attempts";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("questions");
  const facets = useMemo(() => bankFacets(), []);
  const [q, setQ] = useState("");
  const [discipline, setDiscipline] = useState("all");
  const [level, setLevel] = useState("all");
  const [type, setType] = useState("all");
  const [source, setSource] = useState("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);

  useEffect(() => setAttempts(loadHistory()), []);

  const results = useMemo(
    () => queryBank({ q, disciplineId: discipline, level, type: type as QType, source }),
    [q, discipline, level, type, source]
  );

  function exportJSON() {
    const data = tab === "questions"
      ? { questionBank: results }
      : { attempts: attempts.map((a) => ({ ...a, session: getClientSession(a.id) })) };
    download(JSON.stringify(data, null, 2), `greenroom-${tab}.json`, "application/json");
  }
  function exportCSV() {
    if (tab === "questions") {
      const rows = [["id", "discipline", "competency", "levels", "type", "difficulty", "source", "prompt", "guidance"]];
      results.forEach((b) => rows.push([b.id, b.disciplineId, b.competency, b.levels.join("|"), b.type, String(b.difficulty), b.source, b.prompt, b.guidance]));
      download(toCSV(rows), "greenroom-questions.csv", "text/csv");
    } else {
      const rows = [["id", "at", "role", "seniority", "overall", "competencies"]];
      attempts.forEach((a) => rows.push([a.id, new Date(a.at).toISOString(), a.roleLabel, a.seniorityId, String(a.overall), a.competencies.map((c) => `${c.competency}:${c.score}`).join("|")]));
      download(toCSV(rows), "greenroom-attempts.csv", "text/csv");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Nav />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
            <Database className="h-7 w-7" style={{ color: "var(--accent)" }} /> Admin · question database
          </h1>
          <p className="mt-2 text-ink-secondary">
            Query the full question bank ({facets.total} questions across {facets.disciplines.length} disciplines, {facets.sources.length} sources) and view recorded attempts.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportJSON} className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink-secondary transition hover:text-ink-primary"><Download className="h-4 w-4" /> JSON</button>
          <button onClick={exportCSV} className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink-secondary transition hover:text-ink-primary"><Download className="h-4 w-4" /> CSV</button>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-2">
        <Tab2 active={tab === "questions"} onClick={() => setTab("questions")} icon={BookOpen} label={`Questions (${QUESTION_BANK.length})`} />
        <Tab2 active={tab === "attempts"} onClick={() => setTab("attempts")} icon={FileText} label={`Attempts (${attempts.length})`} />
      </div>

      {tab === "questions" ? (
        <>
          {/* query controls */}
          <div className="mt-4 grid gap-2 md:grid-cols-5">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="glass-strong rounded-xl px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none md:col-span-1" />
            <Select value={discipline} onChange={setDiscipline} options={["all", ...facets.disciplines]} />
            <Select value={level} onChange={setLevel} options={["all", ...SENIORITIES.map((s) => s.id)]} labels={Object.fromEntries(SENIORITIES.map((s) => [s.id, s.label]))} />
            <Select value={type} onChange={setType} options={["all", ...facets.types]} />
            <Select value={source} onChange={setSource} options={["all", ...facets.sources]} truncate />
          </div>

          <p className="mt-3 text-sm text-ink-muted">{results.length} result{results.length === 1 ? "" : "s"}</p>

          <div className="mt-2 space-y-2">
            {results.map((b) => (
              <div key={b.id} className="glass rounded-2xl">
                <button onClick={() => setOpen((o) => ({ ...o, [b.id]: !o[b.id] }))} className="flex w-full items-start gap-3 p-4 text-left">
                  {open[b.id] ? <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-ink-muted" /> : <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted" />}
                  <div className="flex-1">
                    <div className="text-ink-primary">{b.prompt}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                      <Tag>{b.disciplineId}</Tag>
                      <Tag accent>{b.competency}</Tag>
                      <Tag>{b.type}</Tag>
                      <Tag>diff {b.difficulty}/5</Tag>
                      <Tag>{b.levels.length} levels</Tag>
                    </div>
                  </div>
                </button>
                {open[b.id] && (
                  <div className="border-t border-hair px-4 pb-4 pl-11 pt-3 text-sm">
                    <p className="text-ink-secondary"><b className="text-ink-primary">Model-answer guidance:</b> {b.guidance}</p>
                    <p className="mt-2 text-ink-muted"><b>Levels:</b> {b.levels.map((l) => SENIORITIES.find((s) => s.id === l)?.label ?? l).join(", ")}</p>
                    <p className="mt-1 text-ink-muted"><b>Source:</b> {b.source}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 space-y-2">
          {attempts.length === 0 && <p className="text-ink-muted">No attempts recorded on this device yet.</p>}
          {[...attempts].reverse().map((a) => {
            const s = getClientSession(a.id);
            return (
              <div key={a.id} className="glass rounded-2xl">
                <button onClick={() => setOpen((o) => ({ ...o, [a.id]: !o[a.id] }))} className="flex w-full items-center gap-3 p-4 text-left">
                  {open[a.id] ? <ChevronDown className="h-4 w-4 text-ink-muted" /> : <ChevronRight className="h-4 w-4 text-ink-muted" />}
                  <span className="flex-1 text-ink-primary">{a.drill ? `Drill · ${a.drill}` : a.roleLabel} <span className="text-ink-muted">· {new Date(a.at).toLocaleString()}</span></span>
                  <span className="accent-text font-semibold">{a.overall.toFixed(1)}/5</span>
                </button>
                {open[a.id] && s && (
                  <div className="border-t border-hair px-4 pb-4 pt-3 text-sm">
                    <div className="mb-2 flex flex-wrap gap-1.5 text-xs">{a.competencies.map((c) => <Tag key={c.competency} accent>{c.competency}: {c.score}</Tag>)}</div>
                    <div className="space-y-1.5">
                      {s.transcript.map((t, i) => (
                        <p key={i}><b className={t.role === "interviewer" ? "accent-text" : "text-ink-muted"}>{t.role === "interviewer" ? "Q" : "A"}:</b> <span className="text-ink-secondary">{t.text}</span></p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function toCSV(rows: string[][]) {
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}
function Tab2({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition ${active ? "btn-accent" : "glass text-ink-secondary hover:text-ink-primary"}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
function Select({ value, onChange, options, labels, truncate }: { value: string; onChange: (v: string) => void; options: string[]; labels?: Record<string, string>; truncate?: boolean }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`glass-strong cursor-pointer rounded-xl px-3 py-2 text-sm text-ink-secondary focus:outline-none ${truncate ? "max-w-full" : ""}`}>
      {options.map((o) => <option key={o} value={o} className="bg-elevated text-ink-primary">{o === "all" ? "All" : labels?.[o] ?? o}</option>)}
    </select>
  );
}
function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return <span className={`rounded-full px-2 py-0.5 ${accent ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)]" : "bg-white/[0.06] text-ink-muted"}`}>{children}</span>;
}
