"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic, MicOff, Send, PhoneOff, Loader2, Captions, Volume2, VolumeX,
  Lightbulb, FileText, RotateCcw, SkipForward, Pause, Play, Sparkles, CheckCircle2,
} from "lucide-react";
import AvatarOrb from "@/components/AvatarOrb";
import { useStage } from "@/lib/useStage";
import { useSpeech } from "@/lib/useSpeech";
import { encouragement } from "@/components/coach";
import { TONES, lookup } from "@/lib/taxonomy";
import { newId, saveClientSession } from "@/lib/clientSession";
import type { ChatTurn } from "@/lib/types";

type Phase = "connecting" | "interviewer" | "awaiting" | "thinking" | "scoring" | "ended";
type HelpKind = "hint" | "outline";

export default function InterviewRoom() {
  const router = useRouter();
  const { config } = useStage();
  const speech = useSpeech();
  const isPractice = config.mode === "practice";

  const [inReady, setInReady] = useState(true); // warm Ready Room first
  const [micOk, setMicOk] = useState<"idle" | "ok" | "fail">("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [live, setLive] = useState("");
  const [phase, setPhase] = useState<Phase>("connecting");
  const [draft, setDraft] = useState("");
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [speakAloud, setSpeakAloud] = useState(config.modalities.includes("voice"));
  const [paused, setPaused] = useState(false);
  const [encourage, setEncourage] = useState("");
  // coaching help: hint = how to approach; outline = strong-answer skeleton
  const [help, setHelp] = useState<Record<HelpKind, string>>({ hint: "", outline: "" });
  const [helpOpen, setHelpOpen] = useState<HelpKind | null>(null);
  const [helpLoading, setHelpLoading] = useState(false);
  const started = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { role, seniority } = lookup(config.disciplineId, config.roleId, config.seniorityId);
  const tone = TONES.find((t) => t.id === config.tone)!;

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tone.accent);
    document.documentElement.style.setProperty("--accent2", tone.accent2);
  }, [tone]);

  useEffect(() => {
    if (!speech.speaking && !speech.listening) { setLevel(0); return; }
    const id = setInterval(() => setLevel(0.3 + Math.random() * 0.6), 120);
    return () => clearInterval(id);
  }, [speech.speaking, speech.listening]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, live, speech.interim]);

  // fresh coaching help per question
  useEffect(() => {
    setHelp({ hint: "", outline: "" });
    setHelpOpen(null);
  }, [turns.length]);

  async function checkMic() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      setMicOk("ok");
    } catch {
      setMicOk("fail");
    }
  }

  function beginInterview() {
    if (started.current) return;
    started.current = true;
    setInReady(false);
    setPhase("connecting");
    (async () => {
      try {
        const r = await fetch("/api/interview/start", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Could not start");
        setSessionId(newId());
        setDemo(!!data.demo);
        setTurns([{ role: "interviewer", text: data.opening, ts: Date.now() }]);
        setPhase("interviewer");
        if (speakAloud) speech.speak(data.opening, () => setPhase("awaiting"));
        else setPhase("awaiting");
      } catch (e: any) {
        setError(e.message);
        setPhase("ended");
      }
    })();
  }

  async function fetchHelp(kind: HelpKind) {
    setHelpOpen(kind);
    if (help[kind] || helpLoading) return;
    const question = [...turns].reverse().find((t) => t.role === "interviewer")?.text || "";
    if (!question) return;
    setHelpLoading(true);
    try {
      const r = await fetch("/api/interview/hint", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, question, kind }),
      });
      const d = await r.json();
      setHelp((h) => ({ ...h, [kind]: d.hint || d.error || "Not available." }));
    } catch {
      setHelp((h) => ({ ...h, [kind]: "Couldn't load — try again." }));
    } finally {
      setHelpLoading(false);
    }
  }

  async function sendAnswer(text: string) {
    if (!sessionId || !text.trim()) return;
    speech.stopListening();
    setDraft("");
    if (isPractice) {
      const e = encouragement(text);
      setEncourage(e);
      setTimeout(() => setEncourage(""), 4000);
    }
    const updated: ChatTurn[] = [...turns, { role: "candidate", text, ts: Date.now() }];
    setTurns(updated);
    setPhase("thinking");
    setLive("");
    try {
      const r = await fetch("/api/interview/turn", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, transcript: updated }),
      });
      const reader = r.body!.getReader();
      const dec = new TextDecoder();
      let acc = "";
      let ctrl: any = {};
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        const nul = acc.indexOf("\x00");
        const spoken = (nul >= 0 ? acc.slice(0, nul) : acc).replace(/\[\[END\]\]/g, "");
        if (nul >= 0) { try { ctrl = JSON.parse(acc.slice(nul + 1)); } catch {} }
        setLive(spoken);
        if (phase !== "interviewer") setPhase("interviewer");
      }
      const finalText = (acc.indexOf("\x00") >= 0 ? acc.slice(0, acc.indexOf("\x00")) : acc)
        .replace(/\[\[END\]\]/g, "")
        .trim();
      setLive("");
      setEncourage("");
      const withReply: ChatTurn[] = [...updated, { role: "interviewer", text: finalText, ts: Date.now() }];
      setTurns(withReply);
      if (ctrl.error) throw new Error(ctrl.error);
      if (ctrl.ended) {
        if (speakAloud) speech.speak(finalText, () => finishAndScore(withReply));
        else finishAndScore(withReply);
        return;
      }
      if (speakAloud) speech.speak(finalText, () => setPhase("awaiting"));
      else setPhase("awaiting");
    } catch (e: any) {
      setError(e.message);
      setPhase("awaiting");
    }
  }

  function redoAnswer() {
    speech.stopListening();
    setDraft("");
  }
  function skipQuestion() {
    sendAnswer("I'd like to skip this one and move on to the next question, please.");
  }
  function togglePause() {
    setPaused((p) => {
      if (!p) { speech.stopSpeaking(); speech.stopListening(); }
      return !p;
    });
  }

  async function finishAndScore(finalTranscript?: ChatTurn[]) {
    if (!sessionId) return;
    const tx = finalTranscript ?? turns;
    speech.stopSpeaking();
    setPhase("scoring");
    try {
      const r = await fetch("/api/interview/score", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, transcript: tx }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "scoring failed");
      saveClientSession({
        id: sessionId,
        config,
        transcript: tx,
        createdAt: Date.now(),
        completedAt: Date.now(),
        report: d.report,
      });
      router.push(`/feedback/${sessionId}`);
    } catch (e: any) {
      setError(e.message);
      setPhase("awaiting");
    }
  }

  const orbState =
    phase === "thinking" || phase === "scoring" ? "thinking" : speech.speaking || phase === "interviewer" ? "speaking" : speech.listening ? "listening" : "idle";
  const lastInterviewer = [...turns].reverse().find((t) => t.role === "interviewer");

  // ---------- Ready Room ----------
  if (inReady) {
    return (
      <main className="ambient flex min-h-screen items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-xl rounded-3xl p-8 text-center">
          <div className="mx-auto mb-4 grid place-items-center"><AvatarOrb level={0.2} state="idle" size={150} /></div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isPractice ? "Let's warm up." : "Ready when you are."}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-ink-secondary">
            {isPractice
              ? `This is a safe space to practice for your ${seniority.label} ${role.label} interview. No pressure — you can pause, skip, redo, and ask for hints anytime.`
              : `You're about to start a ${seniority.label} ${role.label} screen. Find a quiet spot and take your time.`}
          </p>

          <div className="mt-6 space-y-2 text-left text-sm text-ink-secondary">
            <div className="flex items-center gap-2"><span className="accent-text">•</span> {tone.label} interviewer — questions {speakAloud ? "spoken aloud + shown as text" : "shown as text"}.</div>
            <div className="flex items-center gap-2"><span className="accent-text">•</span> Answer by typing or speaking — your speech fills the box so you can review before sending.</div>
            <div className="flex items-center gap-2"><span className="accent-text">•</span> A few questions with follow-ups, then an instant scored report.</div>
          </div>

          {/* breathe + mic check */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <motion.span
              className="rounded-full glass px-4 py-1.5 text-sm text-ink-secondary"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Breathe in… and out 🌬️
            </motion.span>
            <button onClick={checkMic} className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-ink-secondary transition hover:text-ink-primary">
              {micOk === "ok" ? <CheckCircle2 className="h-4 w-4 text-signal-ok" /> : <Mic className="h-4 w-4" />}
              {micOk === "ok" ? "Mic ready" : micOk === "fail" ? "No mic (text is fine)" : "Test microphone"}
            </button>
          </div>

          <button onClick={beginInterview} className="btn-accent mt-7 w-full rounded-full px-8 py-3.5 text-base">
            {isPractice ? "I'm ready — let's begin →" : "Begin interview →"}
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative flex h-screen flex-col overflow-hidden">
      {/* pause overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 grid place-items-center bg-base/70 backdrop-blur-md"
          >
            <div className="text-center">
              <AvatarOrb level={0.15} state="idle" size={160} />
              <p className="mt-4 text-lg text-ink-primary">Paused — take a breath.</p>
              <p className="text-sm text-ink-muted">Nothing is being recorded right now.</p>
              <button onClick={togglePause} className="btn-accent mt-5 inline-flex items-center gap-2 rounded-full px-6 py-2.5">
                <Play className="h-4 w-4" /> Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* top bar */}
      <div className="glass z-10 flex items-center justify-between px-6 py-3 text-sm">
        <div className="flex items-center gap-2 text-ink-secondary">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: `linear-gradient(90deg, ${tone.accent}, ${tone.accent2})` }} />
          {seniority.label} {role.label} · <span className="capitalize">{config.mode}</span> · {tone.label}
          {demo && (
            <span className="ml-2 rounded-full bg-signal-warn/15 px-2.5 py-0.5 text-xs font-medium text-signal-warn">
              Prototype mode · add ANTHROPIC_API_KEY for real AI
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeakAloud((v) => { if (v) speech.stopSpeaking(); return !v; })}
            className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-ink-secondary transition hover:text-ink-primary"
            title={speakAloud ? "Switch to text-only questions" : "Turn interviewer voice on"}
          >
            {speakAloud ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {speakAloud ? "Voice" : "Text"}
          </button>
          <button
            onClick={() => finishAndScore()}
            disabled={phase === "scoring" || turns.filter((t) => t.role === "candidate").length === 0}
            className="glass-strong flex items-center gap-2 rounded-full px-4 py-1.5 text-ink-secondary transition hover:text-ink-primary disabled:opacity-40"
          >
            <PhoneOff className="h-4 w-4" /> End & get feedback
          </button>
        </div>
      </div>

      {/* stage */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <AvatarOrb level={level} state={orbState as any} size={240} />
        <div className="mt-2 text-xs uppercase tracking-widest text-ink-muted">
          {phase === "connecting" && "connecting…"}
          {phase === "thinking" && "thinking…"}
          {phase === "scoring" && "scoring your interview…"}
          {phase === "interviewer" && "interviewer speaking"}
          {phase === "awaiting" && (speech.listening ? "listening…" : "your turn")}
        </div>

        {/* warm between-answer encouragement (practice) */}
        <AnimatePresence>
          {encourage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-signal-ok/15 px-4 py-1.5 text-sm text-signal-ok"
            >
              <Sparkles className="h-4 w-4" /> {encourage}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={(live || lastInterviewer?.text || "").slice(0, 24)}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 max-w-2xl text-center text-xl leading-relaxed text-ink-primary"
        >
          {live || lastInterviewer?.text}
        </motion.div>

        {/* practice coaching help: hint + model outline */}
        {isPractice && phase === "awaiting" && (
          <div className="mt-5 w-full max-w-2xl">
            {!helpOpen ? (
              <div className="flex justify-center gap-2">
                <button onClick={() => fetchHelp("hint")} className="flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-ink-secondary transition hover:text-ink-primary">
                  <Lightbulb className="h-4 w-4" style={{ color: "var(--accent)" }} /> Stuck? Get a hint
                </button>
                <button onClick={() => fetchHelp("outline")} className="flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-ink-secondary transition hover:text-ink-primary">
                  <FileText className="h-4 w-4" style={{ color: "var(--accent)" }} /> See a model outline
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 text-left">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold accent-text">
                    {helpOpen === "hint" ? <Lightbulb className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    {helpOpen === "hint" ? "How to approach this" : "A strong answer outline"}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <button onClick={() => fetchHelp(helpOpen === "hint" ? "outline" : "hint")} className="text-ink-muted hover:text-ink-secondary">
                      {helpOpen === "hint" ? "see outline" : "see hint"}
                    </button>
                    <button onClick={() => setHelpOpen(null)} className="text-ink-muted hover:text-ink-secondary">hide</button>
                  </div>
                </div>
                {helpLoading && !help[helpOpen] ? (
                  <div className="flex items-center gap-2 text-sm text-ink-muted"><Loader2 className="h-4 w-4 animate-spin" /> thinking…</div>
                ) : (
                  <div className="space-y-1.5 text-sm leading-relaxed text-ink-secondary">
                    {help[helpOpen].split("\n").filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* captions transcript */}
      <div ref={scrollRef} className="mx-auto max-h-[22vh] w-full max-w-2xl overflow-y-auto px-6">
        <AnimatePresence initial={false}>
          {turns.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2 text-sm">
              <span className={t.role === "interviewer" ? "accent-text font-semibold" : "text-ink-muted font-semibold"}>
                {t.role === "interviewer" ? "AI" : "You"}:
              </span>{" "}
              <span className="text-ink-secondary">{t.text}</span>
            </motion.div>
          ))}
          {speech.interim && <div className="mb-2 text-sm italic text-ink-muted">You: {speech.interim}</div>}
        </AnimatePresence>
      </div>

      {error && <div className="mx-auto mb-2 max-w-2xl rounded-lg bg-signal-bad/15 px-4 py-2 text-sm text-signal-bad">{error}</div>}

      {/* low-pressure practice controls */}
      {isPractice && phase === "awaiting" && (
        <div className="flex items-center justify-center gap-2 pb-1">
          <SmallBtn onClick={redoAnswer} disabled={!draft.trim()}><RotateCcw className="h-3.5 w-3.5" /> Redo</SmallBtn>
          <SmallBtn onClick={skipQuestion}><SkipForward className="h-3.5 w-3.5" /> Skip</SmallBtn>
          <SmallBtn onClick={togglePause}><Pause className="h-3.5 w-3.5" /> Pause</SmallBtn>
        </div>
      )}

      {/* control dock */}
      <div className="z-10 flex items-center justify-center gap-3 px-6 py-4">
        {speech.supported && (
          <button
            onClick={() => (speech.listening ? speech.stopListening() : speech.startListening((t) => setDraft((d) => (d ? d + " " : "") + t)))}
            disabled={phase !== "awaiting"}
            className={`grid h-14 w-14 place-items-center rounded-full transition disabled:opacity-30 ${speech.listening ? "btn-accent" : "glass-strong text-ink-primary"}`}
            title={speech.listening ? "Stop — your words land in the box to review" : "Tap to speak (review before you send)"}
          >
            {speech.listening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>
        )}
        <div className="glass-strong flex flex-1 items-center gap-2 rounded-full px-4 py-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendAnswer(draft)}
            placeholder={phase === "awaiting" ? "Type your answer, or tap the mic…" : "…"}
            disabled={phase !== "awaiting"}
            className="flex-1 bg-transparent text-ink-primary placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
          />
          <button onClick={() => sendAnswer(draft)} disabled={phase !== "awaiting" || !draft.trim()} className="btn-accent grid h-9 w-9 place-items-center rounded-full">
            {phase === "thinking" || phase === "scoring" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {!speech.supported && (
        <p className="pb-3 text-center text-xs text-ink-muted">
          <Captions className="mr-1 inline h-3 w-3" /> Voice isn't supported in this browser — use text (try Chrome/Edge for speech).
        </p>
      )}
    </main>
  );
}

function SmallBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="glass flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-ink-secondary transition hover:text-ink-primary disabled:opacity-30"
    >
      {children}
    </button>
  );
}
