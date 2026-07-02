import { NextRequest, NextResponse } from "next/server";
import { queryQuestionStore, type QuestionStoreKind } from "@/lib/questionStore";

export const runtime = "nodejs";

function kindParam(value: string | null): QuestionStoreKind {
  return value === "concept" ? "concept" : "question";
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const data = await queryQuestionStore({
      kind: kindParam(params.get("kind")),
      q: params.get("q") ?? undefined,
      disciplineId: params.get("disciplineId") ?? undefined,
      level: params.get("level") ?? undefined,
      competency: params.get("competency") ?? undefined,
      type: params.get("type") ?? undefined,
      topic: params.get("topic") ?? undefined,
      source: params.get("source") ?? undefined,
      page: Number(params.get("page") ?? 1),
      pageSize: Number(params.get("pageSize") ?? 25),
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unable to query questions" }, { status: 500 });
  }
}
