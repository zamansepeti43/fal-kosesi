import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Fal kaydı bulunamadı." }, { status: 400 });

  try {
    const sql = requireDb();
    const rows = await sql`
      select id, email, kind, focus, question, result, is_favorite, created_at, updated_at
      from public.readings
      where id = ${id} and email = ${email}
      limit 1
    `;

    if (!rows[0]) return NextResponse.json({ error: "Fal kaydı bulunamadı." }, { status: 404 });
    return NextResponse.json({ reading: rows[0] });
  } catch (error) {
    console.error("Reading detail error:", error);
    return NextResponse.json({ error: "Fal kaydı alınamadı." }, { status: 500 });
  }
}
