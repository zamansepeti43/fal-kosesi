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
      select id, title, body, type, read_at, created_at
      from public.notifications
      where email = ${email}
      order by created_at desc
      limit 100
    `;
    const unread = rows.filter((item) => !item.read_at).length;
    return NextResponse.json({ notifications: rows, unread });
  } catch (error) {
    console.error("Notifications read error:", error);
    return NextResponse.json({ error: "Bildirimler alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { notificationId?: string; markAllRead?: boolean } | null;

  try {
    const sql = requireDb();
    if (body?.markAllRead) {
      await sql`
        update public.notifications
        set read_at = coalesce(read_at, now())
        where email = ${email} and read_at is null
      `;
      return NextResponse.json({ ok: true });
    }

    const notificationId = body?.notificationId?.trim();
    if (!notificationId) return NextResponse.json({ error: "Bildirim seçilmedi." }, { status: 400 });

    const rows = await sql`
      update public.notifications
      set read_at = coalesce(read_at, now())
      where id = ${notificationId} and email = ${email}
      returning id, read_at
    `;

    if (!rows[0]) return NextResponse.json({ error: "Bildirim bulunamadı." }, { status: 404 });
    return NextResponse.json({ ok: true, ...rows[0] });
  } catch (error) {
    console.error("Notification update error:", error);
    return NextResponse.json({ error: "Bildirim güncellenemedi." }, { status: 500 });
  }
}
