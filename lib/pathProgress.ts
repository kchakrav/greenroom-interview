"use client";
// Tracks which steps of each learning path the user has completed.
const KEY = "aii-path-progress";

function load(): Record<string, number[]> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function completedSteps(pathId: string): number[] {
  return load()[pathId] ?? [];
}
export function markStepComplete(pathId: string, stepIndex: number): void {
  try {
    const all = load();
    const set = new Set(all[pathId] ?? []);
    set.add(stepIndex);
    all[pathId] = Array.from(set).sort((a, b) => a - b);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}
