"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Download, ChevronDown, ChevronRight, BookOpen, FileText, BrainCircuit, Check, Users, Activity, Clock, LogIn } from "lucide-react";
import Image from "next/image";
import Nav from "@/components/Nav";
import { QUESTION_BANK, queryBank, bankFacets, type QType } from "@/lib/questionBank";
import { queryMCQ, mcqFacets } from "@/lib/quiz";
import { SENIORITIES, lookup } from "@/lib/taxonomy";
import { loadHistory } from "@/lib/history";
import { getClientSession } from "@/lib/clientSession";
import type { AttemptSummary } from "@/lib/types";
import type { UserRecord, LoginEvent } from "@/lib/analytics";

type Tab = "questions" | "concepts" | "attempts" | "users";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("questions");
  const facets = useMemo(() => bankFacets(), []);
  const mcqF = useMemo(() => mcqFacets(), []);
  const [q, setQ] = useState("");
  const [discipline, setDiscipline] = useState("all");
  const [level, setLevel] = useState("all");
  const [type, setType] = useState("all");
  const [source, setSource] = useState("all");
  const [mTopic, setMTopic] = useState("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [analytics, setAnalytics] = useState<{ users: UserRecord[]; recentLogins: LoginEvent[]; totalUsers: number; activeToday: number; activeThisWeek: number } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => setAttempts(loadHistory()), []);

  useEffect(() => {
    if (tab !== "users" || analytics) return;
    setAnalyticsLoading(true);
    fetch("/api/admin/analytics").then((r) => r.json()).then(setAnalytics).finally(() => setAnalyticsLoading(false));
  }, [tab, analytics]);

  const results = useMemo(
    () => queryBank({ q, disciplineId: discipline, level, type: type as QType, source }),
    [q, discipline, level, type, source]
  );
  const mcqResults = useMemo(
    () => queryMCQ({ q, disciplineId: discipline, topic: mTopic, source }),
    [q, discipline, mTopic, source]
  );

  function exportJSON() {
    const data = tab === "questions"
      ? { questionBank: results }
      : tab === "concepts"
      ? { conceptMCQs: mcqResults }
      : { attempts: attempts.map((a) => ({ ...a, session: getClientSession(a.id) })) };
    download(JSON.stringify(data, null, 2), `greenroom-${tab}.json`, "application/json");
  }
  function exportCSV() {
    if (tab === "questions") {
      const rows = [["id", "discipline", "competency", "levels", "type", "difficulty", "source", "prompt", "guidance"]];
      results.forEach((b) => rows.push([b.id, b.disciplineId, b.competency, b.levels.join("|"), b.type, String(b.difficulty), b.source, b.prompt, b.guidance]));
      download(toCSV(rows), "greenroom-questions.csv", "text/csv");
    } else if (tab === "concepts") {
      const rows = [["id", "discipline", "topic", "source", "question", "options", "correct", "explanation"]];
      mcqResults.forEach((m) => rows.push([m.id, m.disciplineId, m.topic, m.source, m.question, m.options.join("|"), m.options[m.correctIndex], m.explanation]));
      download(toCSV(rows), "greenroom-concepts.csv", "text/csv");
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
            Query {facets.total} interview questions + {mcqF.total} concept MCQs (incl. the AI/ML knowledge base), across {facets.disciplines.length} disciplines and {facets.sources.length + mcqF.sources.length} sources, plus recorded attempts.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportJSON} className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink-secondary transition hover:text-ink-primary"><Download className="h-4 w-4" /> JSON</button>
          <button onClick={exportCSV} className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink-secondary transition hover:text-ink-primary"><Download className="h-4 w-4" /> CSV</button>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Tab2 active={tab === "questions"} onClick={() => setTab("questions")} icon={BookOpen} label={`Interview questions (${QUESTION_BANK.length})`} />
        <Tab2 active={tab === "concepts"} onClick={() => setTab("concepts")} icon={BrainCircuit} label={`Concept MCQs (${mcqF.total})`} />
        <Tab2 active={tab === "attempts"} onClick={() => setTab("attempts")} icon={FileText} label={`Attempts (${attempts.length})`} />
        <Tab2 active={tab === "users"} onClick={() => setTab("users")} icon={Users} label="Users & Activity" />
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
      ) : tab === "concepts" ? (
        <>
          {/* concept-MCQ query controls */}
          <div className="mt-4 grid gap-2 md:grid-cols-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="glass-strong rounded-xl px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none" />
            <Select value={discipline} onChange={setDiscipline} options={["all", ...mcqF.disciplines]} />
            <Select value={mTopic} onChange={setMTopic} options={["all", ...mcqF.topics]} truncate />
            <Select value={source} onChange={setSource} options={["all", ...mcqF.sources]} truncate />
          </div>
          <p className="mt-3 text-sm text-ink-muted">{mcqResults.length} result{mcqResults.length === 1 ? "" : "s"}</p>
          <div className="mt-2 space-y-2">
            {mcqResults.map((m) => (
              <div key={m.id} className="glass rounded-2xl">
                <button onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))} className="flex w-full items-start gap-3 p-4 text-left">
                  {open[m.id] ? <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-ink-muted" /> : <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-muted" />}
                  <div className="flex-1">
                    <div className="text-ink-primary">{m.question}</div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                      <Tag>{m.disciplineId === "aiml" ? "AI / ML" : m.disciplineId}</Tag>
                      <Tag accent>{m.topic}</Tag>
                    </div>
                  </div>
                </button>
                {open[m.id] && (
                  <div className="border-t border-hair px-4 pb-4 pl-11 pt-3 text-sm">
                    <div className="space-y-1">
                      {m.options.map((opt, idx) => (
                        <div key={idx} className={`flex items-center gap-2 ${idx === m.correctIndex ? "text-signal-ok" : "text-ink-secondary"}`}>
                          {idx === m.correctIndex ? <Check className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5" />} {opt}
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-ink-secondary"><b className="text-ink-primary">Why:</b> {m.explanation}</p>
                    <p className="mt-1 text-ink-muted"><b>Source:</b> {m.source}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : tab === "users" ? (
        <div className="mt-6">
          {analyticsLoading && <p className="text-ink-muted">Loading analytics…</p>}
          {!analyticsLoading && analytics && (
            <>
              {/* KV not configured */}
              {analytics.totalUsers === 0 && analytics.recentLogins.length === 0 && (
                <div className="glass rounded-2xl p-6 text-center text-ink-secondary">
                  <p className="font-medium">No data yet.</p>
                  <p className="mt-1 text-sm text-ink-muted">User analytics require Vercel KV. Connect a KV store in your Vercel project and redeploy, or wait for the first Google sign-in after KV is set up.</p>
                </div>
              )}

              {/* Stat cards */}
              {analytics.totalUsers > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <StatCard icon={Users} label="Total users" value={String(analytics.totalUsers)} />
                    <StatCard icon={Activity} label="Active today" value={String(analytics.activeToday)} />
                    <StatCard icon={Clock} label="Active this week" value={String(analytics.activeThisWeek)} />
                    <StatCard icon={LogIn} label="Recent logins" value={String(analytics.recentLogins.length)} />
                  </div>

                  {/* User table */}
                  <div className="glass mt-6 overflow-hidden rounded-2xl">
                    <div className="border-b border-hair px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-muted grid grid-cols-12 gap-2">
                      <span className="col-span-4">User</span>
                      <span className="col-span-3">Email</span>
                      <span className="col-span-2 text-right">Logins</span>
                      <span className="col-span-3 text-right">Last seen</span>
                    </div>
                    {analytics.users.map((u) => (
                      <div key={u.id} className="grid grid-cols-12 gap-2 items-center border-b border-hair/50 px-5 py-3 last:border-0 hover:bg-white/[0.02] transition">
                        <div className="col-span-4 flex items-center gap-2">
                          {u.image
                            ? <Image src={u.image} alt={u.name} width={28} height={28} className="rounded-full shrink-0" />
                            : <div className="h-7 w-7 rounded-full btn-accent grid place-items-center text-xs font-bold shrink-0">{u.name[0]}</div>
                          }
                          <span className="truncate text-sm text-ink-primary">{u.name}</span>
                        </div>
                        <span className="col-span-3 truncate text-sm text-ink-secondary">{u.email}</span>
                        <span className="col-span-2 text-right text-sm font-semibold accent-text">{u.loginCount}</span>
                        <span className="col-span-3 text-right text-xs text-ink-muted">{timeAgo(u.lastLoginAt)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recent login feed */}
                  <div className="glass mt-6 rounded-2xl p-5">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-secondary">Recent login activity</h2>
                    <div className="space-y-2">
                      {analytics.recentLogins.slice(0, 20).map((e, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <LogIn className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
                          <span className="font-medium text-ink-primary">{e.name}</span>
                          <span className="text-ink-muted truncate">{e.email}</span>
                          <span className="ml-auto shrink-0 text-xs text-ink-muted">{timeAgo(e.at)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
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
function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-ink-muted"><Icon className="h-3.5 w-3.5" />{label}</div>
      <div className="mt-2 text-3xl font-bold accent-text">{value}</div>
    </div>
  );
}
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
