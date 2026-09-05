import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    message: "Supabase profil API hazır. Bağlantı kurulduğunda kullanıcı profili burada çekilecek.",
  });
}
