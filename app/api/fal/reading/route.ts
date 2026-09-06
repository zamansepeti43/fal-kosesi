import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { generateFalResponse } from "@/lib/ai/provider";
import { getMemberEmail } from "@/lib/member-session";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { READING_COSTS } from "@/lib/credits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let email: string | null = null;
  let chargeReference = "";
  let chargeAmount = 0;

  try {
    const body = await request.json();
    email = await getMemberEmail();
    if (!email || !supabaseAdmin) return NextResponse.json({ error: "Kredi hesabına erişilemedi." }, { status: 401 });

    const kind = body.kind ?? "coffee";
    chargeAmount = READING_COSTS[kind] ?? READING_COSTS.coffee;
    chargeReference = `reading-${crypto.randomUUID()}`;

    const { error: chargeError } = await supabaseAdmin.rpc("consume_credits", {
      p_email: email,
      p_amount: chargeAmount,
      p_reference_id: chargeReference,
      p_description: `${kind} falı`,
    });
    if (chargeError) {
      const insufficient = /yetersiz kredi/i.test(chargeError.message);
      return NextResponse.json({ error: insufficient ? "Yeterli kredin yok." : "Kredi kullanılamadı." }, { status: insufficient ? 402 : 500 });
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
      await supabaseAdmin.rpc("refund_credits", {
        p_email: email,
        p_amount: chargeAmount,
        p_reference_id: `refund-${chargeReference}`,
        p_description: `${kind} falı başarısız olduğu için kredi iadesi`,
      });
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
