"use client";
// Local history of completed attempts — powers the progress dashboard and
// learning-path step completion. Stored in localStorage (serverless-friendly).
import type { AttemptSummary } from "./types";

const BASE_KEY = "aii-history";

function historyKey(userId?: string | null): string {
  return userId ? `${BASE_KEY}-${userId}` : BASE_KEY;
}

export function loadHistory(userId?: string | null): AttemptSummary[] {
  if (typeof window === "undefined") return [];
  try {
    return (JSON.parse(localStorage.getItem(historyKey(userId)) || "[]") as AttemptSummary[]).sort((a, b) => a.at - b.at);
  } catch {
    return [];
  }
}

export function addAttempt(a: AttemptSummary, userId?: string | null): void {
  try {
    const all = loadHistory(userId);
    if (all.some((x) => x.id === a.id)) return; // idempotent
    all.push(a);
    localStorage.setItem(historyKey(userId), JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

// Best score reached per competency, across all attempts.
export function bestByCompetency(h: AttemptSummary[]): Record<string, number> {
  const best: Record<string, number> = {};
  for (const a of h) for (const c of a.competencies) best[c.competency] = Math.max(best[c.competency] ?? 0, c.score);
  return best;
}

// First vs latest score per competency → improvement deltas.
export function improvement(h: AttemptSummary[]): { competency: string; first: number; latest: number; delta: number }[] {
  const firstSeen: Record<string, number> = {};
  const latest: Record<string, number> = {};
  for (const a of h) for (const c of a.competencies) {
    if (firstSeen[c.competency] === undefined) firstSeen[c.competency] = c.score;
    latest[c.competency] = c.score;
  }
  return Object.keys(latest).map((k) => ({ competency: k, first: firstSeen[k], latest: latest[k], delta: latest[k] - firstSeen[k] }));
}
