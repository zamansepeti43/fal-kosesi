import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";

export const runtime = "nodejs";

type Row = Record<string, unknown>;

// All non-Tarot AI characters use the same first-party avatar endpoint.
// Tarot keeps its existing local artwork and is intentionally excluded here.
function generatedAvatar(id: string, kind: FortuneKind) {
  if (kind === "tarot") {
    const tarot = DIGITAL_COMMENTATORS.find((item) => item.id === id && item.specialties.includes("tarot"));
    return tarot?.avatarUrl ?? "";
  }
  return `/api/fal/avatar?id=${encodeURIComponent(id)}`;
}

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

    const tableCheck = await sql`select to_regclass('public.commentators') as table_name`;
    if (!tableCheck[0]?.table_name) {
      return NextResponse.json({
        commentators: DIGITAL_COMMENTATORS
          .filter((item) => !kind || item.specialties.includes(kind))
          .map((item) => ({
            ...item,
            type: "ai",
            favorite: false,
            avatarUrl: item.specialties.includes("tarot") ? item.avatarUrl : generatedAvatar(item.id, item.specialties[0]),
          })),
      });
    }

    const rows = kind
      ? await sql`select id, display_name, title, bio, avatar_url, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified from public.commentators where ${kind} = any(specialties) order by (status = 'online') desc, rating desc, reading_count desc`
      : await sql`select id, display_name, title, bio, avatar_url, specialties, commentator_type, rating, reading_count, avg_minutes, price_credits, voice_price_credits, status, verified from public.commentators order by (status = 'online') desc, rating desc, reading_count desc`;

    let favorites = new Set<string>();
    if (email) {
      try {
        const favoriteRows = await sql`select commentator_id from public.commentator_favorites where email = ${email}`;
        favorites = new Set(favoriteRows.map((row: Row) => String(row.commentator_id)));
      } catch { /* optional migration */ }
    }

    return NextResponse.json({
      commentators: rows.map((raw: Row) => {
        const row = raw;
        const id = String(row.id);
        const specialties = Array.isArray(row.specialties) ? row.specialties.map(String) : [];
        const commentatorType = String(row.commentator_type ?? "ai");
        const avatarKind = (specialties[0] as FortuneKind) || kind || "general";
        const avatarUrl = commentatorType === "ai"
          ? generatedAvatar(id, avatarKind)
          : String(row.avatar_url ?? generatedAvatar(id, avatarKind));
        return {
          id,
          name: String(row.display_name ?? "AI Yorumcu"),
          title: String(row.title ?? "Sanal Falcı"),
          bio: row.bio ?? null,
          specialties,
          type: commentatorType,
          rating: Number(row.rating ?? 5),
          readingCount: Number(row.reading_count ?? 0),
          etaMinutes: Number(row.avg_minutes ?? 5),
          priceCredits: Number(row.price_credits ?? 10),
          voiceCredits: Number(row.voice_price_credits ?? 5),
          availability: String(row.status ?? "offline"),
          verified: Boolean(row.verified),
          avatarUrl,
          favorite: favorites.has(id),
        };
      }),
    });
  } catch (error) {
    console.error("Commentators API error:", error);
    return NextResponse.json({
      commentators: DIGITAL_COMMENTATORS
        .filter((item) => !kind || item.specialties.includes(kind))
        .map((item) => ({
          ...item,
          type: "ai",
          favorite: false,
          avatarUrl: item.specialties.includes("tarot") ? item.avatarUrl : generatedAvatar(item.id, item.specialties[0]),
        })),
    });
  }
}
