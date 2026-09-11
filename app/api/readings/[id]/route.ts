import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { ensureFortuneQueueSchema } from "@/lib/fortune/bootstrap";
import { processQueuedReadings } from "@/lib/fortune/queue-worker";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Fal kaydı bulunamadı." }, { status: 400 });

  try {
    const sql = requireDb();
    await ensureFortuneQueueSchema(sql as never);

    let rows = await sql`
      select id, email, kind, focus, question, result, is_favorite, status, available_at, queued_at, started_at,
             completed_at, delivery_mode, commentator_id, commentator_name, price_credits, error_message, created_at, updated_at
      from public.readings where id = ${id} and email = ${email} limit 1
    `;
    const reading = rows[0];
    if (!reading) return NextResponse.json({ error: "Fal kaydı bulunamadı." }, { status: 404 });

    // Keep the foreground experience responsive, while the Vercel cron worker is responsible
    // for jobs when the user has already left this page.
    if (String(reading.status) === "queued" && reading.available_at && new Date(String(reading.available_at)).getTime() <= Date.now()) {
      await processQueuedReadings(1);
      rows = await sql`
        select id, email, kind, focus, question, result, is_favorite, status, available_at, queued_at, started_at,
               completed_at, delivery_mode, commentator_id, commentator_name, price_credits, error_message, created_at, updated_at
        from public.readings where id = ${id} and email = ${email} limit 1
      `;
    }

    return NextResponse.json({ reading: rows[0] });
  } catch (error) {
    console.error("Reading detail error:", error);
    return NextResponse.json({ error: "Fal kaydı alınamadı." }, { status: 500 });
  }
}
