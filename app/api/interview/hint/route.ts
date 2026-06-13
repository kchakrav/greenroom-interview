import { NextRequest, NextResponse } from "next/server";
import { coachingHint, modelOutline } from "@/lib/engine";
import { demoMode, demoHint, demoOutline } from "@/lib/demo";
import type { StageConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

// Practice-mode only: coaching help ("hint") or a strong-answer "outline".
export async function POST(req: NextRequest) {
  try {
    const { config, question, kind } = (await req.json()) as {
      config: StageConfig;
      question: string;
      kind?: "hint" | "outline";
    };
    if (config.mode !== "practice")
      return NextResponse.json({ error: "coaching help is only available in practice mode" }, { status: 403 });

    const wantOutline = kind === "outline";
    const text = demoMode()
      ? wantOutline
        ? demoOutline(config, question)
        : demoHint(config, question)
      : wantOutline
      ? await modelOutline(config, question)
      : await coachingHint(config, question);

    return NextResponse.json({ hint: text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "request failed" }, { status: 500 });
  }
}
