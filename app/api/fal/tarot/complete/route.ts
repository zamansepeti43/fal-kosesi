import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { generateFalResponse } from "@/lib/ai/provider";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  try {
    const body = await request.json();
    const commentatorId = String(body.commentatorId ?? "");
    const commentator = DIGITAL_COMMENTATORS.find((item) => item.id === commentatorId && item.specialties.includes("tarot" as FortuneKind));
    if (!commentator) return NextResponse.json({ error: "Seçilen tarot karakteri bulunamadı." }, { status: 400 });

    const question = String(body.question ?? "");
    const cards = String(body.cards ?? "");
    if (!cards || !question.trim()) return NextResponse.json({ error: "Tarot sorusu ve kartlar gerekli." }, { status: 400 });

    const sql = requireDb();
    const purchasedRows = await sql`
      select id, price_credits, created_at
      from public.readings
      where email = ${email}
        and kind = 'tarot'
        and commentator_id = ${commentator.id}
        and status = 'pending_completion'
      order by created_at desc
      limit 1
    `;

    const purchased = purchasedRows[0];
    if (!purchased) {
      return NextResponse.json({ error: "Bu tarot açılımı için satın alma kaydı bulunamadı." }, { status: 409 });
    }

    const result = await generateFalResponse({
      kind: "tarot",
      focus: String(body.spreadId ?? "three"),
      question: `Tarot açılımı: ${String(body.spreadLabel ?? "3 Kart")}.\n${cards}\nKullanıcının 4 kişisel cevabı:\n${Array.isArray(body.answers) ? body.answers.map((x: unknown, i: number) => `${i + 1}. ${String(x)}`).join("\n") : ""}\nAna soru: ${question}`,
      images: [],
      profile: body.profile ?? {},
    });

    const readingId = String(purchased.id);
    await sql`
      update public.readings
      set question = ${question},
          result = ${JSON.stringify(result)}::jsonb,
          status = 'ready',
          completed_at = now(),
          input = ${JSON.stringify({ commentatorId: commentator.id, commentatorName: commentator.name, spreadId: String(body.spreadId ?? "three"), spreadLabel: String(body.spreadLabel ?? "3 Kart"), cards, answers: Array.isArray(body.answers) ? body.answers : [], profile: body.profile ?? {} })}::jsonb
      where id = ${readingId} and email = ${email}
    `;

    await sql`
      insert into public.notifications (email, title, body, type)
      values (${email}, 'Tarot açılımın hazır ✦', ${`${commentator.name} karakterinin tarot yorumun hazırlandı.`}, 'reading')
    `;

    return NextResponse.json({ ...result, readingId, commentator: { id: commentator.id, name: commentator.name, priceCredits: commentator.priceCredits } });
  } catch (error) {
    console.error("Tarot completion error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Tarot yorumu hazırlanamadı." }, { status: 500 });
  }
}
