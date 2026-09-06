import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "fal-kosesi-member";

function secret() {
  return process.env.MEMBER_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "development-only-change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function encodeMemberSession(email: string) {
  const normalized = email.trim().toLowerCase();
  return `${Buffer.from(normalized, "utf8").toString("base64url")}.${sign(normalized)}`;
}

export function decodeMemberSession(value?: string | null) {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  try {
    const email = Buffer.from(encoded, "base64url").toString("utf8");
    if (!email || !crypto.timingSafeEqual(Buffer.from(sign(email)), Buffer.from(signature))) return null;
    return email;
  } catch {
    return null;
  }
}

export async function getMemberEmail() {
  const store = await cookies();
  return decodeMemberSession(store.get(COOKIE_NAME)?.value);
}

export function memberCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  };
}
