"use client";
// Light gamification/progress layer (inspired by the product-council reference):
// XP, levels, streaks, and per-competency progress, persisted locally.

export interface Progress {
  xp: number;
  level: number;
  streak: number;
  lastActive: string; // yyyy-mm-dd
  attempts: number;
  bestByCompetency: Record<string, number>;
}

const KEY = "aiinterview-progress";

export function loadProgress(): Progress {
  if (typeof window === "undefined")
    return { xp: 0, level: 1, streak: 0, lastActive: "", attempts: 0, bestByCompetency: {} };
  try {
    return JSON.parse(localStorage.getItem(KEY) || "") as Progress;
  } catch {
    return { xp: 0, level: 1, streak: 0, lastActive: "", attempts: 0, bestByCompetency: {} };
  }
}

export function xpForLevel(level: number) {
  return level * 250;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Award XP for a completed, scored interview and update streak + bests.
export function recordCompletion(
  overall: number,
  competencies: { competency: string; score: number }[]
): Progress {
  const p = loadProgress();
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (p.lastActive === today) {
    /* same day, keep streak */
  } else if (p.lastActive === yesterday) {
    p.streak += 1;
  } else {
    p.streak = 1;
  }
  p.lastActive = today;
  p.attempts += 1;
  p.xp += Math.round(60 + overall * 30);
  while (p.xp >= xpForLevel(p.level)) {
    p.xp -= xpForLevel(p.level);
    p.level += 1;
  }
  for (const c of competencies) {
    p.bestByCompetency[c.competency] = Math.max(p.bestByCompetency[c.competency] ?? 0, c.score);
  }
  localStorage.setItem(KEY, JSON.stringify(p));
  return p;
}
