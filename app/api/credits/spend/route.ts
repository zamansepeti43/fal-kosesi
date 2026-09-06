import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { READING_COSTS } from "@/lib/credits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: "Kredi sistemi hazır değil." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { type?: string; referenceId?: string } | null;
  const type = body?.type || "";
  const amount = READING_COSTS[type];
  if (!amount) return NextResponse.json({ error: "Geçersiz fal türü." }, { status: 400 });

  const referenceId = body?.referenceId || crypto.randomUUID();
  const { data, error } = await supabaseAdmin.rpc("consume_credits", {
    p_email: email,
    p_amount: amount,
    p_reference_id: referenceId,
    p_description: `${type} falı`,
  });

  if (error) {
    const insufficient = /yetersiz kredi/i.test(error.message);
    return NextResponse.json({ error: insufficient ? "Yeterli kredin yok." : "Kredi kullanılamadı." }, { status: insufficient ? 402 : 500 });
  }

  return NextResponse.json({ ok: true, spent: amount, credits: Number(data ?? 0), referenceId });
}
