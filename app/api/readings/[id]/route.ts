import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { generateQualityFortune } from "@/lib/fortune/generate";

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
      select id, email, kind, focus, question, result, is_favorite, status, available_at,
             queued_at, started_at, completed_at, delivery_mode, commentator_id, commentator_name,
             price_credits, error_message, created_at, updated_at
      from public.readings
      where id = ${id} and email = ${email}
      limit 1
    `;
    const reading = rows[0];
    if (!reading) return NextResponse.json({ error: "Fal kaydı bulunamadı." }, { status: 404 });

    if (String(reading.status) === "queued" && reading.available_at && new Date(String(reading.available_at)).getTime() <= Date.now()) {
      const claimed = await sql`
        update public.readings
        set status = 'processing', started_at = now(), updated_at = now()
        where id = ${id} and email = ${email} and status = 'queued' and available_at <= now()
        returning id, kind, focus, question, input, commentator_name, price_credits
      `;
      const job = claimed[0];
      if (job) {
        try {
          const input = (job.input ?? {}) as Record<string, unknown>;
          const result = await generateQualityFortune({
            kind: String(job.kind) as Parameters<typeof generateQualityFortune>[0]["kind"],
            focus: String(input.focus ?? job.focus ?? "genel"),
            question: String(input.question ?? job.question ?? ""),
            images: Array.isArray(input.images) ? input.images.filter((item): item is string => typeof item === "string") : [],
            profile: (input.profile ?? {}) as Parameters<typeof generateQualityFortune>[0]["profile"],
          });
          await sql`
            update public.readings
            set result = ${JSON.stringify(result)}::jsonb,
                status = 'ready', completed_at = now(), updated_at = now(), error_message = null
            where id = ${id} and email = ${email}
          `;
          await sql`
            insert into public.notifications (email, title, body, type)
            values (${email}, 'Falın hazır ✦', ${`${String(job.commentator_name ?? "Yorumcunun")} hazırladığı falın hazır. Sonuç ekranından okumaya devam edebilirsin.`}, 'reading_ready')
          `;
        } catch (generationError) {
          const detail = generationError instanceof Error ? generationError.message : "Yorum üretilemedi.";
          await sql`
            update public.readings
            set status = 'failed', error_message = ${detail.slice(0, 500)}, updated_at = now()
            where id = ${id} and email = ${email}
          `;
          await sql`
            select public.refund_credits(${email}, ${Number(job.price_credits ?? 0)}, ${`refund-${id}`}, 'Kuyrukta fal üretimi başarısız olduğu için kredi iadesi') as credits
          `;
        }
      }

      const refreshed = await sql`
        select id, email, kind, focus, question, result, is_favorite, status, available_at,
               queued_at, started_at, completed_at, delivery_mode, commentator_id, commentator_name,
               price_credits, error_message, created_at, updated_at
        from public.readings where id = ${id} and email = ${email} limit 1
      `;
      return NextResponse.json({ reading: refreshed[0] });
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Reading detail error:", error);
    return NextResponse.json({ error: "Fal kaydı alınamadı." }, { status: 500 });
  }
}
