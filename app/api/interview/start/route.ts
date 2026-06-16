import { NextRequest, NextResponse } from "next/server";
import { client, MODEL, interviewerSystemPrompt } from "@/lib/engine";
import { demoMode, demoOpening, shouldFallbackToDemo } from "@/lib/demo";
import type { StageConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Stateless: returns the opening line. The client holds the transcript.
export async function POST(req: NextRequest) {
  try {
    const { config } = (await req.json()) as { config: StageConfig };

    if (demoMode()) {
      return NextResponse.json({ opening: demoOpening(config), demo: true });
    }

    try {
      const system = interviewerSystemPrompt(config);
      const msg = await client().messages.create({
        model: MODEL,
        max_tokens: 1000,
        system,
        messages: [
          {
            role: "user",
            content:
              "[The candidate has just joined the call. Greet them warmly by acknowledging the role and level, set expectations in one sentence, then ask your first question. Keep it short and natural — this is spoken aloud.]",
          },
        ],
      });
      const opening = msg.content
        .filter((b) => b.type === "text")
        .map((b: any) => b.text)
        .join("")
        .replace(/\[\[END\]\]/g, "")
        .trim();
      return NextResponse.json({ opening, demo: false });
    } catch (e: any) {
      // No credits / billing / auth / rate limit → fall back to the demo flow.
      if (shouldFallbackToDemo(e)) {
        console.warn("interview/start: falling back to demo —", e?.message);
        return NextResponse.json({ opening: demoOpening(config), demo: true });
      }
      throw e;
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "start failed" }, { status: 500 });
  }
}
