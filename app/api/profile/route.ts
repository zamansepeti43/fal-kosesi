import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function GET() {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  try {
    const sql = requireDb();
    const rows = await sql`
      select id, email, full_name, phone, location, plan, status, member_since,
             renewal_date, readings, favorites, streak, last_reading, credits, created_at, updated_at
      from public.profiles
      where email = ${email}
      limit 1
    `;

    if (!rows[0]) return NextResponse.json({ error: "Profil bulunamadı." }, { status: 404 });
    return NextResponse.json({ profile: rows[0] });
  } catch (error) {
    console.error("Profile read error:", error);
    return NextResponse.json({ error: "Profil bilgileri alınamadı." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    phone?: string;
    location?: string;
  } | null;

  const name = body?.name?.trim();
  const phone = body?.phone?.trim() || null;
  const location = body?.location?.trim() || null;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Ad soyad en az 2 karakter olmalı." }, { status: 400 });
  }

  try {
    const sql = requireDb();
    const rows = await sql`
      update public.profiles
      set full_name = ${name},
          phone = ${phone},
          location = ${location},
          updated_at = now()
      where email = ${email}
      returning id, email, full_name, phone, location, plan, status, member_since,
                renewal_date, readings, favorites, streak, last_reading, credits, created_at, updated_at
    `;

    if (!rows[0]) return NextResponse.json({ error: "Profil bulunamadı." }, { status: 404 });
    return NextResponse.json({ profile: rows[0] });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Profil güncellenemedi." }, { status: 500 });
  }
}
