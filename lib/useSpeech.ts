"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Browser-native speech: SpeechRecognition (STT) + speechSynthesis (TTS).
// Zero external keys. Includes voice selection with a sensible default:
// a pleasant American (en-US) female voice.

type SR = any;
export interface VoiceOption {
  uri: string;
  name: string;
  lang: string;
}

const VOICE_KEY = "aii-voice-uri";

// Preferred American-English female voices across platforms, best first.
const PREFERRED = [
  "google us english", // Chrome (en-US, female)
  "microsoft aria", "aria",
  "microsoft jenny", "jenny",
  "microsoft michelle", "michelle",
  "microsoft ava", "ava",
  "samantha", // macOS/iOS (en-US female)
  "allison", "susan", "zoe", "nicky",
  "microsoft zira", "zira", // Windows offline en-US female
];
// Names that are typically male — de-prioritize when auto-picking.
const MALE = /\b(david|mark|guy|eric|christopher|roger|james|alex|fred|daniel|george|paul|ryan|aaron)\b/i;

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  const lang = (v.lang || "").toLowerCase();
  let s = 0;
  if (lang === "en-us" || lang === "en_us") s += 100;
  else if (lang.startsWith("en")) s += 40; // other English accents are okay, not preferred
  const idx = PREFERRED.findIndex((p) => name.includes(p));
  if (idx >= 0) s += 60 - idx; // earlier in the list = higher
  if (/female|woman/.test(name)) s += 10;
  if (MALE.test(name)) s -= 25;
  if (/natural|neural|premium|enhanced/.test(name)) s += 8; // higher quality
  return s;
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const recRef = useRef<SR | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef<((t: string) => void) | null>(null);
  const allVoicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // STT setup
  useEffect(() => {
    const w = window as any;
    const SRClass = w.SpeechRecognition || w.webkitSpeechRecognition;
    setSupported(!!SRClass && !!window.speechSynthesis);
    if (SRClass) {
      const r: SR = new SRClass();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-US";
      r.onresult = (e: any) => {
        let interimText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalRef.current += t + " ";
          else interimText += t;
        }
        setInterim(interimText);
      };
      r.onend = () => {
        setListening(false);
        const text = finalRef.current.trim();
        finalRef.current = "";
        setInterim("");
        if (text && onFinalRef.current) onFinalRef.current(text);
      };
      recRef.current = r;
    }
  }, []);

  // Load voices (async on some browsers) and pick a sensible default.
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      allVoicesRef.current = all;
      // Show English voices in the picker, best-ranked first.
      const english = all
        .filter((v) => (v.lang || "").toLowerCase().startsWith("en"))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a));
      const list = (english.length ? english : all).map((v) => ({ uri: v.voiceURI, name: v.name, lang: v.lang }));
      setVoices(list);

      const saved = localStorage.getItem(VOICE_KEY);
      const savedExists = saved && all.some((v) => v.voiceURI === saved);
      const best = (english[0] || all[0])?.voiceURI || "";
      setVoiceURI(savedExists ? (saved as string) : best);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const setVoice = useCallback((uri: string) => {
    setVoiceURI(uri);
    try { localStorage.setItem(VOICE_KEY, uri); } catch {}
  }, []);

  const startListening = useCallback((onFinal: (t: string) => void) => {
    if (!recRef.current) return;
    onFinalRef.current = onFinal;
    finalRef.current = "";
    try {
      recRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      if (!window.speechSynthesis) {
        onDone?.();
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.05; // slightly brighter = pleasant
      const chosen = allVoicesRef.current.find((v) => v.voiceURI === voiceURI);
      if (chosen) {
        u.voice = chosen;
        u.lang = chosen.lang;
      } else {
        u.lang = "en-US";
      }
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        onDone?.();
      };
      window.speechSynthesis.speak(u);
    },
    [voiceURI]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  // Preview the currently selected voice.
  const previewVoice = useCallback(
    (uri?: string) => {
      const v = allVoicesRef.current.find((x) => x.voiceURI === (uri || voiceURI));
      const u = new SpeechSynthesisUtterance("Hi, I'll be your interviewer today. Let's begin when you're ready.");
      u.rate = 1.0;
      u.pitch = 1.05;
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-US";
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(u);
    },
    [voiceURI]
  );

  return {
    supported, listening, speaking, interim,
    voices, voiceURI, setVoice, previewVoice,
    startListening, stopListening, speak, stopSpeaking,
  };
}
