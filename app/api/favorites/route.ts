import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function GET() {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  try {
    const sql = requireDb();
    const rows = await sql`
      select id, kind, focus, question, result, is_favorite, created_at
      from public.readings
      where email = ${email} and is_favorite = true
      order by created_at desc
    `;
    return NextResponse.json({ favorites: rows });
  } catch (error) {
    console.error("Favorites read error:", error);
    return NextResponse.json({ error: "Favoriler alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { readingId?: string; favorite?: boolean } | null;
  const readingId = body?.readingId?.trim();
  const favorite = Boolean(body?.favorite);

  if (!readingId) return NextResponse.json({ error: "Fal kaydı gerekli." }, { status: 400 });

  try {
    const sql = requireDb();
    const rows = await sql`
      update public.readings
      set is_favorite = ${favorite}, updated_at = now()
      where id = ${readingId} and email = ${email}
      returning id, is_favorite
    `;

    if (!rows[0]) return NextResponse.json({ error: "Fal kaydı bulunamadı." }, { status: 404 });

    await sql`
      update public.profiles
      set favorites = (
        select count(*)::integer
        from public.readings
        where email = ${email} and is_favorite = true
      ), updated_at = now()
      where email = ${email}
    `;

    if (favorite) {
      await sql`
        insert into public.notifications (email, title, body, type)
        values (${email}, 'Fal favorilere eklendi', 'Bu falı artık Favorilerim bölümünden hızlıca açabilirsin.', 'favorite')
      `;
    }

    return NextResponse.json({ ok: true, ...rows[0] });
  } catch (error) {
    console.error("Favorite update error:", error);
    return NextResponse.json({ error: "Favori durumu güncellenemedi." }, { status: 500 });
  }
}
