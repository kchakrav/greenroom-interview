import { NextRequest } from "next/server";
import { client, MODEL, interviewerSystemPrompt, toMessages } from "@/lib/engine";
import { demoMode, demoFollowUp } from "@/lib/demo";
import type { ChatTurn, StageConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Stateless: client sends the full transcript (ending with the candidate's
// latest answer). We stream the interviewer's next spoken turn.
export async function POST(req: NextRequest) {
  const { config, transcript } = (await req.json()) as {
    config: StageConfig;
    transcript: ChatTurn[];
  };

  const encoder = new TextEncoder();
  let full = "";

  // Demo mode: stream a scripted follow-up word-by-word for the same UX.
  if (demoMode()) {
    const { text, ended } = demoFollowUp(config, transcript);
    const clean = text.replace(/\[\[END\]\]/g, "").trim();
    const stream = new ReadableStream({
      async start(controller) {
        for (const word of clean.split(" ")) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 28));
        }
        controller.enqueue(encoder.encode(`\x00{"done":true,"ended":${ended}}`));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const system = interviewerSystemPrompt(config);
  const messages = toMessages(transcript);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = client().messages.stream({ model: MODEL, max_tokens: 1200, system, messages });
        s.on("text", (delta) => {
          full += delta;
          controller.enqueue(encoder.encode(delta));
        });
        await s.finalMessage();
        const ended = full.includes("[[END]]");
        controller.enqueue(encoder.encode(`\x00{"done":true,"ended":${ended}}`));
        controller.close();
      } catch (e: any) {
        controller.enqueue(encoder.encode(`\x00{"error":${JSON.stringify(e.message)}}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
