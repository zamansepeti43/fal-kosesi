import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";
import { READING_COSTS } from "@/lib/credits";

export const runtime = "nodejs";

const ALLOWED = new Set<FortuneKind>(["coffee", "tarot"]);

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  try {
    const body = await request.json();
    const kind = String(body.kind ?? "") as FortuneKind;
    if (!ALLOWED.has(kind)) return NextResponse.json({ error: "Geçersiz fal türü." }, { status: 400 });

    const commentatorId = typeof body.commentatorId === "string" ? body.commentatorId : null;
    const commentator = commentatorId
      ? DIGITAL_COMMENTATORS.find((item) => item.id === commentatorId && item.specialties.includes(kind))
      : undefined;
    const credits = commentator?.priceCredits ?? READING_COSTS[kind as keyof typeof READING_COSTS] ?? 0;
    const reference = `purchase-${kind}-${crypto.randomUUID()}`;
    const readingId = crypto.randomUUID();
    const sql = requireDb();

    const rows = await sql`select public.consume_credits(${email}, ${credits}, ${reference}, ${`${kind} falı • ${commentator?.name ?? "Otomatik seçim"}`}) as credits`;

    try {
      await sql`
        insert into public.readings (id, email, kind, focus, question, result, status, queued_at, delivery_mode, commentator_id, commentator_name, price_credits, input)
        values (${readingId}, ${email}, ${kind}, ${String(body.focus ?? "genel")}, '', ${JSON.stringify({ status: "pending_completion" })}::jsonb, 'pending_completion', now(), 'instant', ${commentator?.id ?? null}, ${commentator?.name ?? null}, ${credits}, ${JSON.stringify({ purchase_reference: reference, purchased_credits: credits, selected_spread_id: body.spreadId ?? null })}::jsonb)
      `;
    } catch (saveError) {
      await sql`select public.refund_credits(${email}, ${credits}, ${`refund-${reference}`}, ${`${kind} falı satın alma kaydı oluşturulamadığı için iade`}) as credits`;
      throw saveError;
    }

    return NextResponse.json({ ok: true, readingId, credits, balance: rows[0]?.credits ?? null, commentator: commentator ? { id: commentator.id, name: commentator.name, priceCredits: commentator.priceCredits } : null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kredi kullanılamadı.";
    return NextResponse.json({ error: /yetersiz kredi/i.test(message) ? "Yeterli kredin yok." : "Kredi kullanılamadı." }, { status: /yetersiz kredi/i.test(message) ? 402 : 500 });
  }
}
