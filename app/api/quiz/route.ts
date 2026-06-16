import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/engine";
import { demoMode } from "@/lib/demo";
import { quizQuestions } from "@/lib/quiz";

export const runtime = "nodejs";
export const maxDuration = 60;

// Concept Q&A questions: curated bank in demo mode, Claude-generated with a key.
export async function POST(req: NextRequest) {
  try {
    const { disciplineId, topic, count } = (await req.json()) as {
      disciplineId: string;
      topic?: string;
      count?: number;
    };
    const n = Math.min(Math.max(count ?? 6, 3), 10);
    // The AI/ML area is a curated, source-attributed knowledge base — always
    // serve it from the bank (don't generate). With a key, top up with freshly
    // generated questions on the chosen topic for variety/recency.
    let questions;
    if (disciplineId === "aiml") {
      questions = quizQuestions({ disciplineId, topic }, n);
      if (!demoMode() && questions.length < n) {
        try {
          const gen = await generateQuiz("AI/ML", topic ?? "", n - questions.length);
          questions = [...questions, ...gen];
        } catch { /* bank is enough */ }
      }
    } else {
      questions = demoMode()
        ? quizQuestions({ disciplineId, topic }, n)
        : await generateQuiz(disciplineId, topic ?? "", n);
    }
    return NextResponse.json({ questions, demo: demoMode() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "quiz failed" }, { status: 500 });
  }
}
