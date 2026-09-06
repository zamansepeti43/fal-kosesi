import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { generateFalResponse } from "@/lib/ai/provider";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { READING_COSTS } from "@/lib/credits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let email: string | null = null;
  let chargeReference = "";
  let chargeAmount = 0;

  try {
    const body = await request.json();
    email = await getMemberEmail();
    if (!email) return NextResponse.json({ error: "Kredi hesabına erişilemedi." }, { status: 401 });

    const sql = requireDb();
    const kind = body.kind ?? "coffee";
    chargeAmount = READING_COSTS[kind] ?? READING_COSTS.coffee;
    chargeReference = `reading-${crypto.randomUUID()}`;

    try {
      await sql`
        select public.consume_credits(
          ${email},
          ${chargeAmount},
          ${chargeReference},
          ${`${kind} falı`}
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
      });
      return NextResponse.json(result);
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
