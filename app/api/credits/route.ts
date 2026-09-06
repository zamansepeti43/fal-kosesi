import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function GET() {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ authenticated: false, credits: 0 }, { status: 401 });

  try {
    const sql = requireDb();
    const rows = await sql`
      select credits
      from public.profiles
      where email = ${email}
      limit 1
    `;
    return NextResponse.json({ authenticated: true, credits: Number(rows[0]?.credits ?? 0) });
  } catch (error) {
    console.error("Credits balance error:", error);
    return NextResponse.json({ error: "Kredi sistemi hazır değil." }, { status: 503 });
  }
}
