"use client";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, Download, ChevronDown, ChevronRight, BookOpen, FileText, BrainCircuit, Check, Users, Activity, Clock, LogIn } from "lucide-react";
import Image from "next/image";
import Nav from "@/components/Nav";
import { QUESTION_BANK, queryBank, bankFacets, type BankQuestion, type QType } from "@/lib/questionBank";
import { queryMCQ, mcqFacets, type MCQ } from "@/lib/quiz";
import { SENIORITIES, lookup } from "@/lib/taxonomy";
import { loadHistory } from "@/lib/history";
import { getClientSession } from "@/lib/clientSession";
import type { AttemptSummary } from "@/lib/types";
import type { AnalyticsSnapshot } from "@/lib/analytics";

type Tab = "questions" | "concepts" | "attempts" | "users";
const PAGE_SIZE = 25;

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
  const [questionPage, setQuestionPage] = useState(1);
  const [conceptPage, setConceptPage] = useState(1);
  const [attemptPage, setAttemptPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot | null>(null);
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
  const questionPageItems = useMemo(() => pageItems(results, questionPage, PAGE_SIZE), [results, questionPage]);
  const conceptPageItems = useMemo(() => pageItems(mcqResults, conceptPage, PAGE_SIZE), [mcqResults, conceptPage]);
  const reversedAttempts = useMemo(() => [...attempts].reverse(), [attempts]);
  const attemptPageItems = useMemo(() => pageItems(reversedAttempts, attemptPage, PAGE_SIZE), [reversedAttempts, attemptPage]);
  const userPageItems = useMemo(() => pageItems(analytics?.users ?? [], userPage, PAGE_SIZE), [analytics?.users, userPage]);

  useEffect(() => setQuestionPage(1), [q, discipline, level, type, source]);
  useEffect(() => setConceptPage(1), [q, discipline, mTopic, source]);
  useEffect(() => setAttemptPage(1), [attempts]);
  useEffect(() => setUserPage(1), [analytics?.users]);

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
  async function exportExcelByTopic() {
    if (tab !== "questions" && tab !== "concepts") return;
    const groups = groupedExportRows(tab, results, mcqResults);
    if (groups.length === 0) {
      download(excelWorkbook([{ name: "No results", rows: [["No results for the current filters"]], widths: [40], pdfColumnStyles: {} }]), `greenroom-${tab}-by-topic.xls`, "application/vnd.ms-excel");
      return;
    }
    download(excelWorkbook(groups), `greenroom-${tab}-by-topic.xls`, "application/vnd.ms-excel");
  }
  async function exportPDFByTopic() {
    if (tab !== "questions" && tab !== "concepts") return;
    const [{ default: jsPDF }, autoTableModule] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const autoTable = (autoTableModule as any).default ?? autoTableModule;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const groups = groupedExportRows(tab, results, mcqResults);
    doc.setFontSize(14);
    doc.text(`GreenRoom ${tab === "questions" ? "Interview Questions" : "Concept MCQs"} by Topic`, 40, 36);
    if (groups.length === 0) {
      doc.setFontSize(11);
      doc.text("No results for the current filters.", 40, 64);
      doc.save(`greenroom-${tab}-by-topic.pdf`);
      return;
    }
    groups.forEach((group, idx) => {
      if (idx > 0) doc.addPage();
      doc.setFontSize(12);
      doc.text(`${group.name} (${group.rows.length - 1})`, 40, 60);
      autoTable(doc, {
        head: [group.rows[0]],
        body: group.rows.slice(1),
        startY: 78,
        styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak" },
        headStyles: { fillColor: [110, 139, 255], textColor: [7, 9, 15] },
        columnStyles: group.pdfColumnStyles,
        margin: { left: 30, right: 30 },
      });
    });
    doc.save(`greenroom-${tab}-by-topic.pdf`);
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
          {(tab === "questions" || tab === "concepts") && (
            <>
              <button onClick={exportExcelByTopic} className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink-secondary transition hover:text-ink-primary"><Download className="h-4 w-4" /> Excel by topic</button>
              <button onClick={exportPDFByTopic} className="glass-strong flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-ink-secondary transition hover:text-ink-primary"><Download className="h-4 w-4" /> PDF by topic</button>
            </>
          )}
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

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">{results.length} result{results.length === 1 ? "" : "s"}</p>
            <Pagination page={questionPage} total={results.length} pageSize={PAGE_SIZE} onPage={setQuestionPage} />
          </div>

          <div className="mt-2 space-y-2">
            {questionPageItems.map((b) => (
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
          <Pagination className="mt-4 justify-end" page={questionPage} total={results.length} pageSize={PAGE_SIZE} onPage={setQuestionPage} />
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
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">{mcqResults.length} result{mcqResults.length === 1 ? "" : "s"}</p>
            <Pagination page={conceptPage} total={mcqResults.length} pageSize={PAGE_SIZE} onPage={setConceptPage} />
          </div>
          <div className="mt-2 space-y-2">
            {conceptPageItems.map((m) => (
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
          <Pagination className="mt-4 justify-end" page={conceptPage} total={mcqResults.length} pageSize={PAGE_SIZE} onPage={setConceptPage} />
        </>
      ) : tab === "users" ? (
        <div className="mt-6">
          {analyticsLoading && <p className="text-ink-muted">Loading analytics…</p>}
          {!analyticsLoading && analytics && (
            <>
              {analytics.kvError && (
                <div className="glass rounded-2xl p-6 text-center text-ink-secondary">
                  <p className="font-medium">Analytics storage is configured, but cannot be read.</p>
                  <p className="mt-1 text-sm text-ink-muted">{analytics.kvError} Check the KV/Upstash REST URL and token environment variables, then redeploy.</p>
                </div>
              )}
              {!analytics.kvError && !analytics.kvConfigured && (
                <div className="glass rounded-2xl p-6 text-center text-ink-secondary">
                  <p className="font-medium">Analytics storage is not configured.</p>
                  <p className="mt-1 text-sm text-ink-muted">Add KV or Upstash REST URL/token environment variables in Vercel, then redeploy.</p>
                </div>
              )}
              {!analytics.kvError && analytics.kvConfigured && analytics.totalUsers === 0 && analytics.recentLogins.length === 0 && (
                <div className="glass rounded-2xl p-6 text-center text-ink-secondary">
                  <p className="font-medium">No login data yet.</p>
                  <p className="mt-1 text-sm text-ink-muted">Analytics storage is connected. New Google or admin sign-ins will appear here after this deployment.</p>
                </div>
              )}

              {/* Stat cards */}
              {!analytics.kvError && analytics.totalUsers > 0 && (
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
                    {userPageItems.map((u) => (
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
                  <Pagination className="mt-4 justify-end" page={userPage} total={analytics.users.length} pageSize={PAGE_SIZE} onPage={setUserPage} />

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
          {attempts.length > 0 && (
            <Pagination className="justify-end" page={attemptPage} total={reversedAttempts.length} pageSize={PAGE_SIZE} onPage={setAttemptPage} />
          )}
          {attemptPageItems.map((a) => {
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
          {attempts.length > 0 && (
            <Pagination className="justify-end pt-2" page={attemptPage} total={reversedAttempts.length} pageSize={PAGE_SIZE} onPage={setAttemptPage} />
          )}
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
type ExportGroup = {
  name: string;
  rows: string[][];
  widths: number[];
  pdfColumnStyles: Record<number, { cellWidth: number }>;
};
function groupedExportRows(tab: "questions" | "concepts", questions: BankQuestion[], concepts: MCQ[]): ExportGroup[] {
  if (tab === "questions") {
    return groupBy(questions, (q) => q.competency).map(([name, items]) => ({
      name,
      rows: [
        ["id", "discipline", "topic", "levels", "type", "difficulty", "source", "prompt", "guidance"],
        ...items.map((q) => [q.id, q.disciplineId, q.competency, q.levels.join(", "), q.type, String(q.difficulty), q.source, q.prompt, q.guidance]),
      ],
      widths: [24, 16, 28, 24, 14, 10, 28, 80, 90],
      pdfColumnStyles: {
        0: { cellWidth: 58 },
        1: { cellWidth: 55 },
        2: { cellWidth: 80 },
        3: { cellWidth: 70 },
        4: { cellWidth: 45 },
        5: { cellWidth: 36 },
        6: { cellWidth: 85 },
        7: { cellWidth: 170 },
        8: { cellWidth: 180 },
      },
    }));
  }
  return groupBy(concepts, (m) => m.topic).map(([name, items]) => ({
    name,
    rows: [
      ["id", "discipline", "topic", "source", "question", "options", "correct", "explanation"],
      ...items.map((m) => [m.id, m.disciplineId, m.topic, m.source, m.question, m.options.join(" | "), m.options[m.correctIndex], m.explanation]),
    ],
    widths: [28, 16, 28, 28, 80, 80, 40, 90],
    pdfColumnStyles: {
      0: { cellWidth: 58 },
      1: { cellWidth: 55 },
      2: { cellWidth: 80 },
      3: { cellWidth: 85 },
      4: { cellWidth: 170 },
      5: { cellWidth: 145 },
      6: { cellWidth: 80 },
      7: { cellWidth: 110 },
    },
  }));
}
function excelWorkbook(groups: ExportGroup[]) {
  const usedSheetNames = new Set<string>();
  const worksheets = groups.map((group) => {
    const columns = group.widths.map((width) => `<Column ss:Width="${Math.max(60, width * 6)}"/>`).join("");
    const rows = group.rows.map((row, rowIndex) => {
      const cells = row.map((cell) => `<Cell><Data ss:Type="String">${xmlEscape(cell)}</Data></Cell>`).join("");
      const style = rowIndex === 0 ? ' ss:StyleID="header"' : "";
      return `<Row${style}>${cells}</Row>`;
    }).join("");
    return `<Worksheet ss:Name="${xmlEscape(uniqueSheetName(group.name, usedSheetNames))}"><Table>${columns}${rows}</Table></Worksheet>`;
  }).join("");
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#DCE3FF" ss:Pattern="Solid"/></Style>
 </Styles>
 ${worksheets}
</Workbook>`;
}
function groupBy<T>(items: T[], keyFn: (item: T) => string): [string, T[]][] {
  const groups = new Map<string, T[]>();
  items.forEach((item) => {
    const key = keyFn(item) || "Uncategorized";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}
function sheetName(name: string) {
  return name.replace(/[\\/?*[\]:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 31) || "Topic";
}
function uniqueSheetName(name: string, used: Set<string>) {
  const base = sheetName(name);
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    const tail = ` ${suffix}`;
    candidate = `${base.slice(0, 31 - tail.length)}${tail}`;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}
function xmlEscape(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
function pageItems<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
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
function Pagination({ page, total, pageSize, onPage, className = "" }: { page: number; total: number; pageSize: number; onPage: (page: number) => void; className?: string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  return (
    <div className={`flex items-center gap-2 text-xs text-ink-muted ${className}`}>
      <span>{start}-{end} of {total}</span>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="glass-strong rounded-full px-3 py-1 disabled:opacity-40">Prev</button>
      <span>Page {page} / {pages}</span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="glass-strong rounded-full px-3 py-1 disabled:opacity-40">Next</button>
    </div>
  );
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
