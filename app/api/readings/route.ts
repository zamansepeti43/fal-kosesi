import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const url = new URL(request.url);
  const favoritesOnly = url.searchParams.get("favorites") === "1";
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 50), 1), 100);

  try {
    const sql = requireDb();
    const rows = favoritesOnly
      ? await sql`
          select id, email, kind, focus, question, result, is_favorite, created_at, updated_at
          from public.readings
          where email = ${email} and is_favorite = true
          order by created_at desc
          limit ${limit}
        `
      : await sql`
          select id, email, kind, focus, question, result, is_favorite, created_at, updated_at
          from public.readings
          where email = ${email}
          order by created_at desc
          limit ${limit}
        `;

    return NextResponse.json({ readings: rows });
  } catch (error) {
    console.error("Reading history error:", error);
    return NextResponse.json({ error: "Fal geçmişi alınamadı." }, { status: 500 });
  }
}
