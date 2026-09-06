import { NextResponse } from "next/server";
import { encodeMemberSession, memberCookieOptions } from "@/lib/member-session";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; name?: string; phone?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Geçerli bir e-posta gerekli." }, { status: 400 });
  }

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.rpc("ensure_credit_profile", {
      p_email: email,
      p_name: body?.name?.trim() || null,
      p_phone: body?.phone?.trim() || null,
    });
    if (error) {
      return NextResponse.json({ error: "Kredi hesabı hazırlanamadı." }, { status: 503 });
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...memberCookieOptions(), value: encodeMemberSession(email) });
  return response;
}
