import { NextResponse } from "next/server";
import { encodeMemberSession, memberCookieOptions } from "@/lib/member-session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Geçerli bir e-posta gerekli." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...memberCookieOptions(), value: encodeMemberSession(email) });
  return response;
}
