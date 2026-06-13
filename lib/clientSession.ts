"use client";
// Client-side session storage (localStorage). Keeps the app fully stateless on
// the server so it deploys cleanly to serverless platforms like Vercel.
import type { InterviewSession } from "./types";

const PREFIX = "aii-session-";

export function newId(): string {
  return "s_" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}

export function saveClientSession(s: InterviewSession): void {
  try {
    localStorage.setItem(PREFIX + s.id, JSON.stringify(s));
  } catch {
    /* quota / private mode — feedback page will show a friendly error */
  }
}

export function getClientSession(id: string): InterviewSession | null {
  try {
    const raw = localStorage.getItem(PREFIX + id);
    return raw ? (JSON.parse(raw) as InterviewSession) : null;
  } catch {
    return null;
  }
}
