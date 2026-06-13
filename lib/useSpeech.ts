"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Browser-native speech: SpeechRecognition (STT) + speechSynthesis (TTS).
// Zero external keys. Pluggable later for Hume/Deepgram/ElevenLabs (PRD §10).

type SR = any;

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const recRef = useRef<SR | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef<((t: string) => void) | null>(null);

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

  const speak = useCallback((text: string, onDone?: () => void) => {
    if (!window.speechSynthesis) {
      onDone?.();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find((v) => /natural|google|samantha|aria|jenny/i.test(v.name));
    if (pref) u.voice = pref;
    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      onDone?.();
    };
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { supported, listening, speaking, interim, startListening, stopListening, speak, stopSpeaking };
}
