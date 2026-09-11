import { requireDb } from "@/lib/neon/db";
import { generateQualityFortune } from "@/lib/fortune/generate";
import { ensureFortuneQueueSchema } from "@/lib/fortune/bootstrap";

type Sql = ReturnType<typeof requireDb>;

type Processed = { id: string; status: "ready" | "failed" };

export async function processQueuedReadings(limit = 3): Promise<Processed[]> {
  const sql = requireDb() as Sql;
  await ensureFortuneQueueSchema(sql as never);

  const claimed = await sql`
    update public.readings
    set status = 'processing', started_at = now(), updated_at = now()
    where id in (
      select id from public.readings
      where status = 'queued' and available_at <= now()
      order by available_at asc
      for update skip locked
      limit ${Math.max(1, Math.min(10, limit))}
    )
    returning id, email, kind, focus, question, input, commentator_name, price_credits
  `;

  const results: Processed[] = [];

  for (const job of claimed) {
    const id = String(job.id);
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
        set result = ${JSON.stringify(result)}::jsonb, status = 'ready', completed_at = now(), updated_at = now(), error_message = null
        where id = ${id} and status = 'processing'
      `;
      await sql`
        insert into public.notifications (email, title, body, type)
        values (${String(job.email)}, 'Falın hazır ✦', ${`${String(job.commentator_name ?? "Yorumcun")} hazırladığı falın hazır. Sonuç ekranından okuyabilirsin.`}, 'reading_ready')
      `;
      results.push({ id, status: "ready" });
    } catch (generationError) {
      const detail = generationError instanceof Error ? generationError.message : "Yorum üretilemedi.";
      await sql`
        update public.readings
        set status='failed', error_message=${detail.slice(0, 500)}, updated_at=now()
        where id=${id} and status='processing'
      `;
      await sql`
        select public.refund_credits(${String(job.email)}, ${Number(job.price_credits ?? 0)}, ${`refund-${id}`}, 'Kuyrukta fal üretimi başarısız olduğu için kredi iadesi') as credits
      `;
      await sql`
        insert into public.notifications (email, title, body, type)
        values (${String(job.email)}, 'Fal hazırlanamadı', 'Falın hazırlanırken bir sorun oluştu. Kredi iaden yapıldı; lütfen yeniden deneyebilirsin.', 'reading_failed')
      `;
      results.push({ id, status: "failed" });
    }
  }

  return results;
}
