import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { seedQuestionStore } from "@/lib/questionStore";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(session.user as any)?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const result = await seedQuestionStore();
    if (!result.databaseEnabled) {
      return NextResponse.json({ error: "Database question mode is not enabled. Set ENABLE_DATABASE_QUESTIONS=true and DATABASE_URL." }, { status: 503 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unable to seed questions" }, { status: 500 });
  }
}
