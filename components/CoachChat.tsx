"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Loader2, Sparkles } from "lucide-react";
import type { InterviewSession } from "@/lib/types";

const SUGGESTIONS = [
  "What should I focus on first?",
  "How do I structure answers with STAR?",
  "Rewrite my weakest answer as a strong one.",
];

export default function CoachChat({ session }: { session: InterviewSession }) {
  const [msgs, setMsgs] = useState<{ role: "user" | "coach"; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next = [...msgs, { role: "user" as const, text }];
    setMsgs(next);
    setDraft("");
    setLoading(true);
    try {
      const r = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: session.config, transcript: session.transcript, history: next }),
      });
      const d = await r.json();
      setMsgs((m) => [...m, { role: "coach", text: d.reply || d.error || "Sorry, try again." }]);
    } catch {
      setMsgs((m) => [...m, { role: "coach", text: "Couldn't reach the coach — try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass mt-6 rounded-2xl p-6">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-secondary">
        <MessageCircle className="h-4 w-4" style={{ color: "var(--accent)" }} /> Ask your coach
      </h2>
      <p className="mb-4 text-sm text-ink-muted">Chat with the AI about your answers — how to improve, rewrites, examples.</p>

      {msgs.length > 0 && (
        <div ref={boxRef} className="mb-3 max-h-72 space-y-3 overflow-y-auto pr-1">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "btn-accent" : "glass-strong text-ink-secondary"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-sm text-ink-muted"><Loader2 className="h-4 w-4 animate-spin" /> coach is thinking…</div>}
        </div>
      )}

      {msgs.length === 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-secondary transition hover:text-ink-primary">
              <Sparkles className="h-3.5 w-3.5" /> {s}
            </button>
          ))}
        </div>
      )}

      <div className="glass-strong flex items-center gap-2 rounded-full px-4 py-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(draft)}
          placeholder="Ask the coach anything about your interview…"
          className="flex-1 bg-transparent text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
        <button onClick={() => send(draft)} disabled={!draft.trim() || loading} className="btn-accent grid h-9 w-9 place-items-center rounded-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </motion.section>
  );
}
