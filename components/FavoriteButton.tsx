"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { FavoriteKind, FavoriteSnapshot } from "@/lib/analytics";

export default function FavoriteButton({
  kind,
  questionId,
  initialActive = false,
  count,
  snapshot,
  onChange,
  className = "",
}: {
  kind: FavoriteKind;
  questionId: string;
  initialActive?: boolean;
  count?: number;
  snapshot?: FavoriteSnapshot;
  onChange?: (active: boolean) => void;
  className?: string;
}) {
  const [active, setActive] = useState(initialActive);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => setActive(initialActive), [initialActive]);

  async function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    const next = !active;
    setActive(next);
    setBusy(true);
    setError(false);
    onChange?.(next);
    try {
      const res = await fetch("/api/favorites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, questionId, snapshot }),
      });
      if (!res.ok) throw new Error("Favorite update failed");
    } catch {
      setActive(!next);
      setError(true);
      onChange?.(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={active}
      title={error ? "Favorite could not be saved. Check storage configuration." : active ? "Remove from favorites" : "Add to favorites"}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition ${
        error ? "bg-signal-bad/15 text-signal-bad" : active ? "bg-yellow-400/15 text-yellow-300" : "bg-white/[0.06] text-ink-muted hover:text-ink-primary"
      } ${busy ? "opacity-60" : ""} ${className}`}
    >
      <Star className={`h-3.5 w-3.5 ${active ? "fill-current" : ""}`} />
      {typeof count === "number" && <span>{count}</span>}
    </button>
  );
}
