import { NextRequest, NextResponse } from "next/server";
import { generateQuiz } from "@/lib/engine";
import { demoMode, shouldFallbackToDemo } from "@/lib/demo";
import { quizQuestions } from "@/lib/quiz";
import { databaseQuestionsEnabled, queryQuestionStore } from "@/lib/questionStore";
import type { MCQ } from "@/lib/quiz";

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
    const n = Math.min(Math.max(count ?? 6, 3), 120);
    if (databaseQuestionsEnabled()) {
      const db = await queryQuestionStore({ kind: "concept", disciplineId, topic, page: 1, pageSize: n });
      if (db.items.length > 0) return NextResponse.json({ questions: db.items as MCQ[], demo: demoMode(), source: db.source, databaseFallback: db.databaseFallback });
    }
    // Product and AI/ML have deep, source-attributed banks. Serve those directly
    // so 100-question learning sets use the curated coverage instead of making
    // a very large live model-generation request.
    let questions;
    if (disciplineId === "aiml" || disciplineId === "product") {
      questions = quizQuestions({ disciplineId, topic }, n);
      if (!demoMode() && questions.length < n) {
        try {
          const gen = await generateQuiz(disciplineId === "aiml" ? "AI/ML" : "Product Management", topic ?? "", n - questions.length);
          questions = [...questions, ...gen];
        } catch { /* bank is enough */ }
      }
    } else if (demoMode()) {
      questions = quizQuestions({ disciplineId, topic }, n);
    } else {
      try {
        questions = await generateQuiz(disciplineId, topic ?? "", n);
      } catch (e: any) {
        if (!shouldFallbackToDemo(e)) throw e;
        console.warn("quiz: falling back to curated bank —", e?.message);
        questions = quizQuestions({ disciplineId, topic }, n);
      }
    }
    return NextResponse.json({ questions, demo: demoMode() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "quiz failed" }, { status: 500 });
  }
}
