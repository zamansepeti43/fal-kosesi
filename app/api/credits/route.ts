import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET() {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ authenticated: false, credits: 0 }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: "Supabase sunucu bağlantısı hazır değil." }, { status: 503 });

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("credits")
    .eq("email", email)
    .maybeSingle();

  return NextResponse.json({ authenticated: true, credits: Number(data?.credits ?? 0) });
}
