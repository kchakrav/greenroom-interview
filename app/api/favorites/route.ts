import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addFavorite, listFavorites, removeFavorite, type FavoriteKind, type FavoriteSnapshot } from "@/lib/analytics";

function sessionUserId(session: any) {
  return session?.user?.id;
}

function parseSnapshot(payload: any): FavoriteSnapshot | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  return {
    title: typeof payload.title === "string" ? payload.title.slice(0, 800) : undefined,
    detail: typeof payload.detail === "string" ? payload.detail.slice(0, 3000) : undefined,
    disciplineId: typeof payload.disciplineId === "string" ? payload.disciplineId.slice(0, 120) : undefined,
    topic: typeof payload.topic === "string" ? payload.topic.slice(0, 200) : undefined,
    source: typeof payload.source === "string" ? payload.source.slice(0, 500) : undefined,
    url: typeof payload.url === "string" ? payload.url.slice(0, 1000) : undefined,
  };
}

function parseFavoritePayload(payload: any): { kind: FavoriteKind; questionId: string; note?: string; snapshot?: FavoriteSnapshot } | null {
  const kind = payload?.kind;
  const questionId = payload?.questionId;
  if ((kind !== "question" && kind !== "concept" && kind !== "reference") || typeof questionId !== "string" || !questionId.trim()) return null;
  return { kind, questionId: questionId.trim(), note: typeof payload?.note === "string" ? payload.note : undefined, snapshot: parseSnapshot(payload?.snapshot) };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = sessionUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await listFavorites(userId);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = sessionUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = parseFavoritePayload(await req.json().catch(() => null));
  if (!payload) return NextResponse.json({ error: "Invalid favorite payload" }, { status: 400 });

  const data = await addFavorite(userId, payload);
  return NextResponse.json(data, { status: data.error ? 500 : data.kvConfigured ? 200 : 503 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = sessionUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = parseFavoritePayload(await req.json().catch(() => null));
  if (!payload) return NextResponse.json({ error: "Invalid favorite payload" }, { status: 400 });

  const data = await removeFavorite(userId, payload);
  return NextResponse.json(data, { status: data.error ? 500 : data.kvConfigured ? 200 : 503 });
}
