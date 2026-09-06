import { NextResponse } from "next/server";
import { encodeMemberSession, memberCookieOptions } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; name?: string; phone?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Geçerli bir e-posta gerekli." }, { status: 400 });
  }

  try {
    const sql = requireDb();
    await sql`
      select public.ensure_credit_profile(
        ${email},
        ${body?.name?.trim() || null},
        ${body?.phone?.trim() || null}
      ) as credits
    `;
  } catch (error) {
    console.error("Member session database error:", error);
    return NextResponse.json({ error: "Kredi hesabı hazırlanamadı." }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...memberCookieOptions(), value: encodeMemberSession(email) });
  return response;
}
