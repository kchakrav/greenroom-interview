import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFavoriteAggregates } from "@/lib/analytics";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(session.user as any)?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await getFavoriteAggregates();
  return NextResponse.json(data);
}
