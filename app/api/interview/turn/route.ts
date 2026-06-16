import { NextRequest } from "next/server";
import { client, MODEL, interviewerSystemPrompt, toMessages } from "@/lib/engine";
import { demoMode, demoFollowUp, shouldFallbackToDemo } from "@/lib/demo";
import type { ChatTurn, StageConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Stream the scripted demo follow-up word-by-word (same UX as real streaming).
function streamDemo(config: StageConfig, transcript: ChatTurn[], encoder: TextEncoder) {
  const { text, ended } = demoFollowUp(config, transcript);
  const clean = text.replace(/\[\[END\]\]/g, "").trim();
  return new ReadableStream({
    async start(controller) {
      for (const word of clean.split(" ")) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 28));
      }
      controller.enqueue(encoder.encode(`\x00{"done":true,"ended":${ended}}`));
      controller.close();
    },
  });
}

// Stateless: client sends the full transcript (ending with the candidate's
// latest answer). We stream the interviewer's next spoken turn.
export async function POST(req: NextRequest) {
  const { config, transcript } = (await req.json()) as {
    config: StageConfig;
    transcript: ChatTurn[];
  };

  const encoder = new TextEncoder();
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" };

  if (demoMode()) {
    return new Response(streamDemo(config, transcript, encoder), { headers });
  }

  const system = interviewerSystemPrompt(config);
  const messages = toMessages(transcript);

  const stream = new ReadableStream({
    async start(controller) {
      let full = "";
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
        // If nothing has streamed yet (e.g. no credits / auth), fall back to the
        // scripted demo follow-up so the interview continues seamlessly.
        if (full === "" && shouldFallbackToDemo(e)) {
          console.warn("interview/turn: falling back to demo —", e?.message);
          const { text, ended } = demoFollowUp(config, transcript);
          const clean = text.replace(/\[\[END\]\]/g, "").trim();
          for (const word of clean.split(" ")) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((r) => setTimeout(r, 28));
          }
          controller.enqueue(encoder.encode(`\x00{"done":true,"ended":${ended}}`));
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(`\x00{"error":${JSON.stringify(e.message)}}`));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
