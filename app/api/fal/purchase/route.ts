import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";
import { READING_COSTS } from "@/lib/credits";

export const runtime = "nodejs";

const ALLOWED = new Set<FortuneKind>(["coffee", "tarot"]);
const TAROT_SPREAD_CREDITS: Record<string, number> = { single: 5, three: 12, love: 15, career: 15, money: 15 };

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

    if (!commentator) return NextResponse.json({ error: "Önce bir sanal karakter seçmelisin." }, { status: 400 });

    const spreadId = kind === "tarot" ? String(body.spreadId ?? "three") : null;
    const spreadCredits = spreadId ? TAROT_SPREAD_CREDITS[spreadId] ?? TAROT_SPREAD_CREDITS.three : READING_COSTS[kind as keyof typeof READING_COSTS] ?? 0;
    const credits = Math.max(commentator.priceCredits, spreadCredits);
    const reference = `purchase-${kind}-${crypto.randomUUID()}`;
    const readingId = crypto.randomUUID();
    const sql = requireDb();

    const rows = await sql`select public.consume_credits(${email}, ${credits}, ${reference}, ${`${kind} falı • ${commentator.name}`}) as credits`;

    try {
      await sql`
        insert into public.readings (id, email, kind, focus, question, result, status, queued_at, delivery_mode, commentator_id, commentator_name, price_credits, input)
        values (${readingId}, ${email}, ${kind}, ${spreadId ?? "genel"}, '', ${JSON.stringify({ status: "pending_completion" })}::jsonb, 'pending_completion', now(), 'instant', ${commentator.id}, ${commentator.name}, ${credits}, ${JSON.stringify({ purchase_reference: reference, purchased_credits: credits, spread_id: spreadId })}::jsonb)
      `;
    } catch (saveError) {
      await sql`select public.refund_credits(${email}, ${credits}, ${`refund-${reference}`}, ${`${kind} falı satın alma kaydı oluşturulamadığı için iade`}) as credits`;
      throw saveError;
    }

    return NextResponse.json({ ok: true, readingId, credits, balance: rows[0]?.credits ?? null, commentator: { id: commentator.id, name: commentator.name, priceCredits: credits } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kredi kullanılamadı.";
    return NextResponse.json({ error: /yetersiz kredi/i.test(message) ? "Yeterli kredin yok." : "Kredi kullanılamadı." }, { status: /yetersiz kredi/i.test(message) ? 402 : 500 });
  }
}
