"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, Play, Search } from "lucide-react";
import Nav from "@/components/Nav";
import FavoriteButton from "@/components/FavoriteButton";
import { QUESTION_BANK, type BankQuestion } from "@/lib/questionBank";
import { DISCIPLINES } from "@/lib/taxonomy";
import { queryMCQ, type MCQ } from "@/lib/quiz";
import { useStage } from "@/lib/useStage";
import type { FavoriteRecord } from "@/lib/analytics";

type FavoriteItem =
  | { favorite: FavoriteRecord; kind: "question"; item: BankQuestion; title: string; detail: string; disciplineId: string; topic: string }
  | { favorite: FavoriteRecord; kind: "concept"; item: MCQ; title: string; detail: string; disciplineId: string; topic: string }
  | { favorite: FavoriteRecord; kind: "reference"; title: string; detail: string; disciplineId: string; topic: string; source?: string; url?: string };

const disciplineLabel = new Map(DISCIPLINES.map((d) => [d.id, d.label]));

export default function FavoritesPage() {
  const router = useRouter();
  const { set } = useStage();
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("all");
  const [topic, setTopic] = useState("all");
  const [kind, setKind] = useState<"all" | "question" | "concept" | "reference">("all");

  const mcqById = useMemo(() => new Map(queryMCQ().map((m) => [m.id, m])), []);
  const questionById = useMemo(() => new Map(QUESTION_BANK.map((q) => [q.id, q])), []);

  useEffect(() => {
    let active = true;
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (active) setFavorites(data.favorites ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const items = useMemo<FavoriteItem[]>(() => {
    const next: FavoriteItem[] = [];
    for (const favorite of favorites) {
      if (favorite.kind === "question") {
        const item = questionById.get(favorite.questionId);
        if (item) next.push({ favorite, kind: "question", item, title: item.prompt, detail: item.guidance, disciplineId: item.disciplineId, topic: item.competency });
        else if (favorite.snapshot?.title) next.push(snapshotItem(favorite, "question"));
      } else if (favorite.kind === "concept") {
        const item = mcqById.get(favorite.questionId);
        if (item) next.push({ favorite, kind: "concept", item, title: item.question, detail: item.explanation, disciplineId: item.disciplineId, topic: item.topic });
        else if (favorite.snapshot?.title) next.push(snapshotItem(favorite, "concept"));
      } else if (favorite.snapshot?.title) {
        next.push(snapshotItem(favorite, "reference"));
      }
    }
    return next;
  }, [favorites, mcqById, questionById]);

  const topics = useMemo(() => ["all", ...Array.from(new Set(items.map((item) => item.topic))).sort()], [items]);
  const disciplines = useMemo(() => ["all", ...Array.from(new Set(items.map((item) => item.disciplineId))).sort()], [items]);
  const shown = items.filter((item) => {
    if (discipline !== "all" && item.disciplineId !== discipline) return false;
    if (topic !== "all" && item.topic !== topic) return false;
    if (kind !== "all" && item.kind !== kind) return false;
    const needle = query.toLowerCase().trim();
    if (!needle) return true;
    return `${item.title} ${item.detail} ${item.topic} ${item.disciplineId}`.toLowerCase().includes(needle);
  });

  function removeFavorite(questionId: string, favoriteKind: FavoriteRecord["kind"], active: boolean) {
    if (active) return;
    setFavorites((current) => current.filter((favorite) => !(favorite.questionId === questionId && favorite.kind === favoriteKind)));
  }

  function practiceFirst() {
    const first = shown[0];
    if (!first) return;
    const conceptItems = shown.filter((item) => item.kind === "concept");
    if (conceptItems.length > 0) {
      const firstConcept = conceptItems[0];
      const conceptIds = conceptItems.map((item) => item.favorite.questionId);
      try {
        localStorage.setItem("aii-learn-area", firstConcept.disciplineId);
        localStorage.setItem("aii-learn-topic", firstConcept.topic);
        localStorage.setItem("aii-learn-favorite-ids", JSON.stringify(conceptIds));
      } catch {}
      router.push("/learn");
      return;
    }
    set({ disciplineId: first.disciplineId, focusAreas: [first.topic], mode: "practice", drill: { competency: first.topic }, pathStep: undefined });
    router.push("/interview");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Nav />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
            <Heart className="h-7 w-7" style={{ color: "var(--accent)" }} /> My <span className="accent-text">Favorites</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-ink-secondary">Save interview prompts and concept questions for quick review and focused practice.</p>
        </div>
        <button disabled={shown.length === 0} onClick={practiceFirst} className="btn-accent inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm disabled:opacity-40">
          <Play className="h-4 w-4" /> Practice shown
        </button>
      </div>

      <div className="glass mt-7 rounded-3xl p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search favorites..." className="w-full rounded-xl bg-white/[0.06] py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SelectChip value={kind} onChange={(value) => setKind(value as typeof kind)} options={["all", "question", "concept", "reference"]} label={(value) => value === "all" ? "All types" : value === "question" ? "Interview" : value === "concept" ? "Concept" : "Reference"} />
          <SelectChip value={discipline} onChange={setDiscipline} options={disciplines} label={(value) => value === "all" ? "All disciplines" : disciplineLabel.get(value) ?? value} />
          <SelectChip value={topic} onChange={setTopic} options={topics} label={(value) => value === "all" ? "All topics" : value} />
        </div>
      </div>

      {loading ? (
        <div className="glass mt-6 flex items-center justify-center gap-2 rounded-3xl p-10 text-ink-secondary">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading favorites...
        </div>
      ) : shown.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-10 text-center text-sm text-ink-muted">
          No favorites match these filters. Star questions from Learn, Reference, or Admin to build this list.
        </div>
      ) : (
        <div className="mt-6 grid gap-3 xl:grid-cols-2">
          {shown.map((entry) => (
            <article key={`${entry.kind}:${entry.favorite.questionId}`} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <Badge>{entry.kind === "question" ? "Interview" : entry.kind === "concept" ? "Concept" : "Reference"}</Badge>
                    <Badge>{disciplineLabel.get(entry.disciplineId) ?? entry.disciplineId}</Badge>
                    <Badge>{entry.topic}</Badge>
                  </div>
                  <h2 className="text-sm font-semibold text-ink-primary">{entry.title}</h2>
                </div>
                <FavoriteButton kind={entry.kind} questionId={entry.favorite.questionId} initialActive onChange={(active) => removeFavorite(entry.favorite.questionId, entry.kind, active)} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{entry.detail}</p>
              {"url" in entry && entry.url && (
                <a href={entry.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-medium text-accent hover:underline">Open source</a>
              )}
              <div className="mt-3 text-[11px] text-ink-muted">Saved {new Date(entry.favorite.createdAt).toLocaleDateString()}</div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function snapshotItem(favorite: FavoriteRecord, kind: FavoriteItem["kind"]): FavoriteItem {
  const snapshot = favorite.snapshot ?? {};
  return {
    favorite,
    kind,
    title: snapshot.title ?? favorite.questionId,
    detail: snapshot.detail ?? "Saved favorite",
    disciplineId: snapshot.disciplineId ?? "general",
    topic: snapshot.topic ?? "Saved",
    source: snapshot.source,
    url: snapshot.url,
  } as FavoriteItem;
}

function SelectChip({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: string[]; label: (value: string) => string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-full border border-hair bg-white/[0.06] px-3 py-2 text-xs text-ink-secondary focus:outline-none">
      {options.map((option) => <option key={option} value={option}>{label(option)}</option>)}
    </select>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-muted">{children}</span>;
}
