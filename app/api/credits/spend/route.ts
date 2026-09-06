import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { READING_COSTS } from "@/lib/credits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { type?: string; referenceId?: string } | null;
  const type = body?.type || "";
  const amount = READING_COSTS[type];
  if (!amount) return NextResponse.json({ error: "Geçersiz fal türü." }, { status: 400 });

  const referenceId = body?.referenceId || crypto.randomUUID();

  try {
    const sql = requireDb();
    const rows = await sql`
      select public.consume_credits(
        ${email},
        ${amount},
        ${referenceId},
        ${`${type} falı`}
      ) as credits
    `;

    return NextResponse.json({
      ok: true,
      spent: amount,
      credits: Number(rows[0]?.credits ?? 0),
      referenceId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kredi kullanılamadı.";
    const insufficient = /yetersiz kredi/i.test(message);
    return NextResponse.json(
      { error: insufficient ? "Yeterli kredin yok." : "Kredi kullanılamadı." },
      { status: insufficient ? 402 : 500 },
    );
  }
}
