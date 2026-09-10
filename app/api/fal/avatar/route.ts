import { NextResponse } from "next/server";

export const runtime = "edge";

const PORTRAITS = [75, 24, 56, 35, 63] as const;

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = (result * 31 + value.charCodeAt(i)) >>> 0;
  return result;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "fortune-character";
  const requestedSlot = Number.parseInt(url.searchParams.get("slot") || "", 10);
  const slot = Number.isInteger(requestedSlot) && requestedSlot >= 0 && requestedSlot < PORTRAITS.length
    ? requestedSlot
    : hash(id) % PORTRAITS.length;
  const imageUrl = `https://randomuser.me/api/portraits/women/${PORTRAITS[slot]}.jpg`;

  try {
    const response = await fetch(imageUrl, { cache: "force-cache" });
    if (!response.ok || !response.body) return new NextResponse(null, { status: 502 });
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
