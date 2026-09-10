import { NextResponse } from "next/server";
import { encodeMemberSession, memberCookieOptions } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { WELCOME_CREDITS } from "@/lib/credits";
import { hashPassword, verifyPassword } from "@/lib/password";

export const runtime = "nodejs";

type Body = { action?: "login" | "register"; email?: string; name?: string; phone?: string; password?: string };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password || "";
  const action = body?.action || "login";

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta gerekli." }, { status: 400 });
  }
  if (password.length < 6) return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });

  try {
    const sql = requireDb();
    const rows = await sql`select email, full_name, phone, password_hash from public.profiles where email = ${email} limit 1`;
    const existing = rows[0];

    if (action === "register") {
      if (existing) return NextResponse.json({ error: "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene." }, { status: 409 });
      const passwordHash = await hashPassword(password);
      await sql`
        insert into public.profiles (email, full_name, phone, password_hash, credits, plan, status, member_since)
        values (${email}, ${body?.name?.trim() || null}, ${body?.phone?.trim() || null}, ${passwordHash}, ${WELCOME_CREDITS}, 'Normal Üye', 'Üye', to_char(now(), 'DD Mon YYYY'))
      `;
      await sql`
        insert into public.credit_transactions (email, amount, balance_after, type, reference_id, description)
        values (${email}, ${WELCOME_CREDITS}, ${WELCOME_CREDITS}, 'welcome', ${`welcome:${email}`}, ${`${WELCOME_CREDITS} hoş geldin kredisi`})
        on conflict do nothing
      `;
    } else {
      if (!existing?.password_hash || !(await verifyPassword(password, String(existing.password_hash)))) {
        return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
      }
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({ ...memberCookieOptions(), value: encodeMemberSession(email) });
    return response;
  } catch (error) {
    console.error("Member authentication error:", error);
    return NextResponse.json({ error: "İşlem sırasında bir sunucu hatası oluştu." }, { status: 503 });
  }
}

export async function GET() {
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
