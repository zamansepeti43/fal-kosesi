import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { generateFalResponse } from "@/lib/ai/provider";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { READING_COSTS } from "@/lib/credits";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";

export const runtime = "nodejs";

const ALLOWED_KINDS = new Set<FortuneKind>([
  "coffee", "love", "money", "career", "future", "daily", "dream", "astrology",
  "numerology", "general", "tarot", "katina", "lenormand", "angel",
]);

export async function POST(request: Request) {
  let email: string | null = null;
  let chargeReference = "";
  let chargeAmount = 0;

  try {
    const body = await request.json();
    email = await getMemberEmail();
    if (!email) return NextResponse.json({ error: "Kredi hesabına erişilemedi." }, { status: 401 });

    const sql = requireDb();
    const kind = String(body.kind ?? "coffee") as FortuneKind;
    if (!ALLOWED_KINDS.has(kind)) return NextResponse.json({ error: "Geçersiz fal türü." }, { status: 400 });

    const requestedCommentatorId = typeof body.commentatorId === "string" ? body.commentatorId : null;
    const commentator = requestedCommentatorId
      ? DIGITAL_COMMENTATORS.find((item) => item.id === requestedCommentatorId && item.specialties.includes(kind))
      : undefined;

    chargeAmount = commentator?.priceCredits ?? READING_COSTS[kind as keyof typeof READING_COSTS] ?? READING_COSTS.coffee;
    chargeReference = `reading-${crypto.randomUUID()}`;

    try {
      await sql`
        select public.consume_credits(
          ${email},
          ${chargeAmount},
          ${chargeReference},
          ${`${kind} falı${commentator ? ` • ${commentator.name}` : ""}`}
        ) as credits
      `;
    } catch (chargeError) {
      const message = chargeError instanceof Error ? chargeError.message : "Kredi kullanılamadı.";
      const insufficient = /yetersiz kredi/i.test(message);
      return NextResponse.json(
        { error: insufficient ? "Yeterli kredin yok." : "Kredi kullanılamadı." },
        { status: insufficient ? 402 : 500 },
      );
    }

    try {
      const result = await generateFalResponse({
        kind,
        focus: body.focus ?? "genel",
        question: body.question ?? "",
        images: Array.isArray(body.images) ? body.images : [],
        profile: body.profile,
      });

      let readingId: string | null = null;
      try {
        const input = {
          focus: String(body.focus ?? "genel"),
          question: String(body.question ?? ""),
          images: Array.isArray(body.images) ? body.images.slice(0, 3) : [],
          profile: body.profile ?? {},
          selectedCommentatorId: commentator?.id ?? null,
          selectedCommentatorName: commentator?.name ?? null,
        };
        const savedRows = await sql`
          insert into public.readings (email, kind, focus, question, result, status, delivery_mode, commentator_id, commentator_name, price_credits, input)
          values (
            ${email},
            ${kind},
            ${String(body.focus ?? "genel")},
            ${String(body.question ?? "")},
            ${JSON.stringify(result)}::jsonb,
            'ready',
            'instant',
            ${commentator?.id ?? null},
            ${commentator?.name ?? null},
            ${chargeAmount},
            ${JSON.stringify(input)}::jsonb
          )
          returning id
        `;
        readingId = savedRows[0]?.id ? String(savedRows[0].id) : null;

        if (readingId) {
          await sql`
            insert into public.notifications (email, title, body, type)
            values (
              ${email},
              'Falın hazır ✦',
              ${`${kind === "coffee" ? "Kahve falın" : "Fal yorumun"} hazırlandı. Sonuçlarını ve geçmiş okumalarını hesabından görebilirsin.`},
              'reading'
            )
          `;
        }
      } catch (saveError) {
        console.error("Reading persistence error:", saveError);
      }

      return NextResponse.json({ ...result, readingId, commentator: commentator ? { id: commentator.id, name: commentator.name, priceCredits: commentator.priceCredits } : null });
    } catch (generationError) {
      await sql`
        select public.refund_credits(
          ${email},
          ${chargeAmount},
          ${`refund-${chargeReference}`},
          ${`${kind} falı başarısız olduğu için kredi iadesi`}
        ) as credits
      `;
      throw generationError;
    }
  } catch (error) {
    console.error("Fal reading error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fal yorumu sırasında bir hata oluştu." },
      { status: 500 },
    );
  }
}
