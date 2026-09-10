import { NextResponse } from "next/server";

export const runtime = "edge";

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = (result * 31 + value.charCodeAt(i)) >>> 0;
  return result;
}

function escapeXml(value: string) {
  return value.replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] || char);
}

function fallbackSvg(id: string) {
  const themes = [
    ["#2a1c3f", "#5b2d78"],
    ["#172b31", "#245f65"],
    ["#302019", "#7b3d23"],
    ["#28172d", "#713b78"],
  ];
  const [bg, outfit] = themes[hash(id) % themes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 420"><defs><radialGradient id="g"><stop stop-color="${bg}"/><stop offset="1" stop-color="#08070f"/></radialGradient></defs><rect width="360" height="420" rx="48" fill="url(#g)"/><circle cx="180" cy="145" r="82" fill="#e8b9a7"/><path d="M98 154 Q86 50 180 48 Q274 50 262 154 Q235 101 180 102 Q125 101 98 154Z" fill="#201824"/><path d="M80 420 Q92 270 180 270 Q268 270 280 420Z" fill="${outfit}"/><circle cx="150" cy="145" r="6" fill="#17121c"/><circle cx="210" cy="145" r="6" fill="#17121c"/><path d="M154 194 Q180 210 206 194" fill="none" stroke="#9d4f64" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="52" r="5" fill="#facc15"/><circle cx="318" cy="78" r="4" fill="#c084fc"/></svg>`;
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
      avatars?: Array<{ name?: string; label?: string; thumb?: string; license?: string; bytes?: number }>;
    };

    // Only use characters explicitly marked CC0: suitable for AGT Studio's commercial use.
    const candidates = (data.avatars || []).filter((avatar) =>
      avatar.license === "CC0" &&
      typeof avatar.thumb === "string" &&
      avatar.thumb.startsWith("https://") &&
      (avatar.bytes ?? 0) <= 10_000_000,
    );

    if (candidates.length) {
      const selected = candidates[hash(id) % candidates.length];
      return NextResponse.redirect(selected.thumb!, {
        status: 302,
        headers: { "Cache-Control": cache },
      });
    }
  } catch {
    // The local fallback prevents a broken picker if the remote library is temporarily unavailable.
  }

  return new NextResponse(fallbackSvg(id), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": cache,
    },
  });
}
