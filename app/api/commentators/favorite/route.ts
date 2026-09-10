import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });
  try {
    const body = await request.json();
    const commentatorId = String(body.commentatorId ?? "").trim();
    const favorite = Boolean(body.favorite);
    if (!commentatorId) return NextResponse.json({ error: "Falcı seçilmedi." }, { status: 400 });
    const sql = requireDb();
    if (favorite) {
      await sql`
        insert into public.commentator_favorites (email, commentator_id)
        values (${email}, ${commentatorId})
        on conflict (email, commentator_id) do nothing
      `;
    } else {
      await sql`
        delete from public.commentator_favorites where email = ${email} and commentator_id = ${commentatorId}
      `;
    }
    return NextResponse.json({ ok: true, favorite });
  } catch (error) {
    console.error("Commentator favorite error:", error);
    return NextResponse.json({ error: "Falcı favorisi güncellenemedi." }, { status: 500 });
  }
}
