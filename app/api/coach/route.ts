import { NextRequest, NextResponse } from "next/server";
import { coachChat } from "@/lib/engine";
import { demoMode, demoCoachChat, shouldFallbackToDemo } from "@/lib/demo";
import type { ChatTurn, StageConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// "Ask the coach" — follow-up chat grounded in the candidate's interview.
export async function POST(req: NextRequest) {
  try {
    const { config, transcript, history } = (await req.json()) as {
      config: StageConfig;
      transcript: ChatTurn[];
      history: { role: "user" | "coach"; text: string }[];
    };
    if (demoMode()) return NextResponse.json({ reply: demoCoachChat(config, transcript, history) });
    try {
      const reply = await coachChat(config, transcript, history);
      return NextResponse.json({ reply });
    } catch (e: any) {
      if (shouldFallbackToDemo(e)) {
        console.warn("coach: falling back to demo —", e?.message);
        return NextResponse.json({ reply: demoCoachChat(config, transcript, history) });
      }
      throw e;
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "coach failed" }, { status: 500 });
  }
}
