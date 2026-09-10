import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { READING_COSTS } from "@/lib/credits";
import { getFortuneProduct, type FortuneKind, DIGITAL_COMMENTATORS } from "@/lib/fortune/catalog";

export const runtime = "nodejs";

const ALLOWED_KINDS = new Set<FortuneKind>([
  "coffee", "love", "money", "career", "future", "daily", "dream", "astrology", "numerology", "general", "tarot", "katina", "lenormand", "angel",
]);

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  try {
    const body = await request.json();
    const kind = String(body.kind ?? "coffee") as FortuneKind;
    if (!ALLOWED_KINDS.has(kind) || !getFortuneProduct(kind)) return NextResponse.json({ error: "Geçersiz fal türü." }, { status: 400 });

    const sql = requireDb();
    const commentatorId = typeof body.commentatorId === "string" ? body.commentatorId : null;
    const commentator = commentatorId ? DIGITAL_COMMENTATORS.find((item) => item.id === commentatorId && item.specialties.includes(kind)) : null;
    const priceCredits = commentator?.priceCredits ?? READING_COSTS[kind as keyof typeof READING_COSTS] ?? getFortuneProduct(kind)!.baseCredits;
    const deliveryMode = String(body.deliveryMode ?? (kind === "coffee" ? "queued" : "queued"));
    const delaySeconds = Math.max(15, Math.min(3600, Number(body.delaySeconds ?? getFortuneProduct(kind)!.defaultDelaySeconds)));
    const readingId = crypto.randomUUID();

    await sql`
      select public.consume_credits(${email}, ${priceCredits}, ${`reading-${readingId}`}, ${`${getFortuneProduct(kind)!.label} • ${commentator?.name ?? "Dijital yorumcu"}`}) as credits
    `;

    try {
      await sql`
        insert into public.readings (
          id, email, kind, focus, question, result, status, available_at, queued_at, delivery_mode,
          commentator_id, commentator_name, price_credits, input
        ) values (
          ${readingId}, ${email}, ${kind}, ${String(body.focus ?? "genel")}, ${String(body.question ?? "")},
          ${JSON.stringify({ status: "queued", message: `${getFortuneProduct(kind)!.label} sıraya alındı.` })}::jsonb,
          'queued', now() + (${delaySeconds} * interval '1 second'), now(), ${deliveryMode},
          ${commentator?.id ?? null}, ${commentator?.name ?? null}, ${priceCredits},
          ${JSON.stringify({
            focus: String(body.focus ?? "genel"),
            question: String(body.question ?? ""),
            images: Array.isArray(body.images) ? body.images.slice(0, 3) : [],
            profile: body.profile ?? {},
            selectedCommentatorId: commentator?.id ?? null,
          })}::jsonb
        )
      `;
      await sql`
        insert into public.notifications (email, title, body, type)
        values (${email}, 'Falın sıraya alındı ✦', ${`${getFortuneProduct(kind)!.label} ${delaySeconds >= 180 ? "yaklaşık 3 dakika" : "kısa bir süre"} içinde hazırlanacak. Hazır olduğunda hesabına bildirim düşecek.`}, 'reading_queue')
      `;
    } catch (saveError) {
      await sql`select public.refund_credits(${email}, ${priceCredits}, ${`refund-reading-${readingId}`}, ${`${getFortuneProduct(kind)!.label} kuyruğa alınamadığı için kredi iadesi`}) as credits`;
      throw saveError;
    }

    return NextResponse.json({
      queued: true,
      readingId,
      status: "queued",
      etaSeconds: delaySeconds,
      commentator: commentator ? { id: commentator.id, name: commentator.name, priceCredits: commentator.priceCredits, etaMinutes: commentator.etaMinutes } : null,
    });
  } catch (error) {
    console.error("Fortune queue error:", error);
    const message = error instanceof Error ? error.message : "Fal sıraya alınamadı.";
    const status = /yetersiz kredi/i.test(message) ? 402 : 500;
    return NextResponse.json({ error: status === 402 ? "Yeterli kredin yok." : "Fal sıraya alınamadı." }, { status });
  }
}
