import { NextResponse } from "next/server";

export const runtime = "edge";

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = (result * 31 + value.charCodeAt(i)) >>> 0;
  return result;
}

function fallbackUrl(id: string) {
  // Stable three.ws renders of human Mixamo characters. These are used only as
  // visual renders; the raw character files are never redistributed by Fal Köşesi.
  const fallback = [
    "68c2e4b0-1ad6-4e53-b67d-161b8f4ccfbf", // Louise
    "d13cd86b-a90f-4c8a-81c9-18fc490b40ba", // James
    "f7b85d05-5f1c-47d8-9770-9a1a054bd6f6", // Ely
    "d0496a75-08b9-4f4e-9f1d-f65820323cc2", // Erika Archer
    "e89ec3c3-47b4-4d55-87f5-83d91e537136", // Maria J J Ong
  ];
  const avatar = fallback[hash(id) % fallback.length];
  return `https://three.ws/api/avatar/render?avatar=${avatar}&scene=portrait&size=720&bg=transparent`;
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "tarotella";
  const cache = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000";

  try {
    const response = await fetch("https://three.ws/api/avatars/library", {
      headers: { Accept: "application/json" },
      next: { revalidate: 604800 },
    });
    if (!response.ok) throw new Error(`avatar library ${response.status}`);

    const data = await response.json() as {
      avatars?: Array<{
        name?: string;
        label?: string;
        thumb?: string;
        license?: string;
        bytes?: number;
      }>;
    };

    // Prefer distinct, human-looking Mixamo characters instead of the single
    // CC0 Quaternius model. Mixamo permits royalty-free commercial use of its
    // characters in finished creative work; we never expose the raw GLB files.
    const preferred = [
      "louise",
      "james",
      "ely-by-k-atienza",
      "erika-archer",
      "maria-j-j-ong",
    ];

    const candidates = preferred
      .map((name) => (data.avatars || []).find((avatar) =>
        avatar.name === name &&
        avatar.license === "Mixamo" &&
        typeof avatar.thumb === "string" &&
        avatar.thumb.startsWith("https://") &&
        (avatar.bytes ?? 0) <= 60_000_000,
      ))
      .filter((avatar): avatar is NonNullable<typeof avatar> => Boolean(avatar));

    if (candidates.length) {
      const selected = candidates[hash(id) % candidates.length];
      return NextResponse.redirect(selected.thumb!, {
        status: 302,
        headers: { "Cache-Control": cache },
      });
    }
  } catch {
    // Keep the picker alive if the upstream manifest is temporarily unavailable.
  }

  return NextResponse.redirect(fallbackUrl(id), {
    status: 302,
    headers: { "Cache-Control": cache },
  });
}
