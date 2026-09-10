import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawKind = url.searchParams.get("kind");
  const validKinds = new Set<FortuneKind>([
    "coffee", "love", "money", "career", "future", "daily", "dream", "astrology",
    "numerology", "general", "tarot", "katina", "lenormand", "angel",
  ]);
  const kind = rawKind && validKinds.has(rawKind as FortuneKind) ? rawKind as FortuneKind : null;
  const email = await getMemberEmail();

  try {
    const sql = requireDb();

    // Keep production logs clean while the optional commentator migration is not installed yet.
    const tableCheck = await sql`select to_regclass('public.commentators') as table_name`;
    if (!tableCheck[0]?.table_name) {
      return NextResponse.json({
        commentators: DIGITAL_COMMENTATORS
          .filter((item) => !kind || item.specialties.includes(kind))
          .map((item) => ({ ...item, type: "ai", favorite: false })),
      });
    }

    const rows = kind
      ? await sql`select id, display_name, title, bio, avatar_url, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified from public.commentators where ${kind} = any(specialties) order by (status = 'online') desc, rating desc, reading_count desc`
      : await sql`select id, display_name, title, bio, avatar_url, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified from public.commentators order by (status = 'online') desc, rating desc, reading_count desc`;

    let favorites = new Set<string>();
    if (email) {
      try {
        const favoriteRows = await sql`select commentator_id from public.commentator_favorites where email = ${email}`;
        favorites = new Set(favoriteRows.map((row) => String((row as Row).commentator_id)));
      } catch { /* optional migration */ }
    }

    return NextResponse.json({
      commentators: rows.map((raw) => {
        const row = raw as Row;
        const specialties = Array.isArray(row.specialties) ? row.specialties.map(String) : [];
        return {
          id: String(row.id),
          name: String(row.display_name ?? "AI Yorumcu"),
          title: String(row.title ?? "Sanal Falcı"),
          bio: row.bio ?? null,
          specialties,
          type: String(row.commentator_type ?? "ai"),
          rating: Number(row.rating ?? 5),
          readingCount: Number(row.reading_count ?? 0),
          etaMinutes: Number(row.avg_minutes ?? 5),
          priceCredits: Number(row.price_credits ?? 10),
          voiceCredits: Number(row.voice_price_credits ?? 5),
          availability: String(row.status ?? "offline"),
          verified: Boolean(row.verified),
          avatarUrl: String(row.avatar_url ?? `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(String(row.id))}&backgroundColor=161326`),
          favorite: favorites.has(String(row.id)),
        };
      }),
    });
  } catch (error) {
    console.error("Commentators API error:", error);
    return NextResponse.json({
      commentators: DIGITAL_COMMENTATORS
        .filter((item) => !kind || item.specialties.includes(kind))
        .map((item) => ({ ...item, type: "ai", favorite: false })),
    });
  }
}
