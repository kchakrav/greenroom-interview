import { NextRequest, NextResponse } from "next/server";
import { scoreInterview } from "@/lib/engine";
import { demoMode, demoScore } from "@/lib/demo";
import type { ChatTurn, StageConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60; // Vercel Hobby max

// Stateless: score the transcript the client sends. Returns the report.
export async function POST(req: NextRequest) {
  try {
    const { config, transcript } = (await req.json()) as {
      config: StageConfig;
      transcript: ChatTurn[];
    };
    const candidateTurns = (transcript || []).filter((t) => t.role === "candidate");
    if (candidateTurns.length === 0)
      return NextResponse.json({ error: "no candidate responses to score" }, { status: 400 });

    const report = demoMode() ? demoScore(config, transcript) : await scoreInterview(config, transcript);
    return NextResponse.json({ report });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "scoring failed" }, { status: 500 });
  }
}
