"use client";
// Instant, warm between-answer encouragement for practice mode (client-side,
// zero latency). Friendly nudges based on lightweight signals in the answer.

const FILLERS = ["um", "uh", "like", "you know", "basically", "literally"];

export function encouragement(text: string): string {
  const t = text.trim();
  const words = t ? t.split(/\s+/).length : 0;
  const hasNumber = /\b\d/.test(t);
  const fillers = FILLERS.reduce((n, f) => n + (t.toLowerCase().match(new RegExp(`\\b${f}\\b`, "g"))?.length ?? 0), 0);

  if (words < 12) return "Good start — try expanding with a specific example next time. 🙂";
  if (hasNumber) return "Nice — you quantified the impact. That really lands. 👏";
  if (fillers >= 5) return "Solid answer — a beat of silence beats a filler word. You've got this.";
  if (words > 90) return "Great detail. If you can, land it on one crisp result at the end.";
  return "Thoughtful answer — keep that structure going.";
}
