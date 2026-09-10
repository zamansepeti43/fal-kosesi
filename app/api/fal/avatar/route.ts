import { NextResponse } from "next/server";

export const runtime = "edge";

const palettes = [
  { scarf: "#b91c45", shirt: "#8b1638", hair: "#17151d", bg: "#261735" },
  { scarf: "#7c3aed", shirt: "#4c1d95", hair: "#16151c", bg: "#171b3a" },
  { scarf: "#be123c", shirt: "#9f1239", hair: "#25151a", bg: "#351727" },
  { scarf: "#c2410c", shirt: "#9a3412", hair: "#1c1513", bg: "#352019" },
  { scarf: "#0f766e", shirt: "#115e59", hair: "#111827", bg: "#142d32" },
  { scarf: "#a21caf", shirt: "#701a75", hair: "#211525", bg: "#2b1732" },
] as const;

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = (result * 31 + value.charCodeAt(i)) >>> 0;
  return result;
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "esmeralya";
  const h = hash(id);
  const p = palettes[h % palettes.length];
  const hairOffset = h % 3;
  const eyeOffset = h % 2;
  const smile = eyeOffset ? "M82 139 Q110 156 138 139" : "M84 140 Q110 151 136 140";
  const hairPath = hairOffset === 0
    ? "M50 103 Q46 45 110 36 Q174 45 170 103 Q151 79 126 79 Q91 79 50 103Z"
    : hairOffset === 1
      ? "M48 108 Q39 46 108 34 Q174 42 172 106 Q153 76 126 82 Q84 72 48 108Z"
      : "M52 105 Q50 48 112 38 Q171 45 168 105 Q145 78 122 84 Q85 76 52 105Z";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 250" role="img" aria-label="Sanal fal karakteri">
  <rect width="220" height="250" rx="34" fill="${p.bg}"/>
  <circle cx="110" cy="96" r="67" fill="${p.scarf}" opacity=".18"/>
  <path d="M31 224 Q40 164 110 160 Q180 164 189 224Z" fill="${p.shirt}"/>
  <path d="M47 91 Q36 72 49 54 Q69 36 110 37 Q153 37 171 57 Q184 74 171 96 Q156 72 132 70 Q94 67 47 91Z" fill="${p.scarf}"/>
  <path d="M49 62 Q54 37 79 28 Q108 17 139 29 Q164 38 171 62 Q145 49 121 51 Q88 48 49 62Z" fill="${p.scarf}"/>
  <path d="M82 37 Q99 22 111 25 Q123 22 139 37 L131 53 L111 43 L91 53Z" fill="${p.scarf}"/>
  <path d="${hairPath}" fill="${p.hair}"/>
  <ellipse cx="110" cy="107" rx="51" ry="57" fill="#f7d8cf"/>
  <path d="M58 104 Q57 77 78 61 Q93 52 110 54 Q128 52 145 63 Q163 79 162 104 Q149 82 128 80 Q92 76 58 104Z" fill="${p.hair}"/>
  <ellipse cx="76" cy="111" rx="10" ry="14" fill="#f5c6bd"/><ellipse cx="144" cy="111" rx="10" ry="14" fill="#f5c6bd"/>
  <circle cx="54" cy="113" r="14" fill="none" stroke="#eab308" stroke-width="5"/><circle cx="166" cy="113" r="14" fill="none" stroke="#eab308" stroke-width="5"/>
  <ellipse cx="88" cy="109" rx="6" ry="8" fill="#20151d"/><ellipse cx="132" cy="109" rx="6" ry="8" fill="#20151d"/>
  <circle cx="90" cy="107" r="2" fill="white"/><circle cx="134" cy="107" r="2" fill="white"/>
  <path d="M72 97 Q87 87 101 96" fill="none" stroke="#251822" stroke-width="4" stroke-linecap="round"/><path d="M119 96 Q133 87 148 97" fill="none" stroke="#251822" stroke-width="4" stroke-linecap="round"/>
  <path d="M108 111 Q103 125 110 129 Q117 125 112 111" fill="none" stroke="#b56b67" stroke-width="3" stroke-linecap="round"/>
  <path d="${smile}" fill="none" stroke="#b51d45" stroke-width="5" stroke-linecap="round"/>
  <path d="M78 174 Q110 153 142 174 L150 211 Q110 230 70 211Z" fill="${p.scarf}"/>
  <path d="M88 188 Q110 171 132 188" fill="none" stroke="#f3c5bc" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="110" cy="198" rx="20" ry="11" fill="#f8fafc"/>
  <path d="M126 196 Q148 192 148 208 Q146 219 132 218" fill="none" stroke="#f8fafc" stroke-width="6"/>
  <circle cx="33" cy="31" r="4" fill="#facc15"/><circle cx="188" cy="46" r="3" fill="#c084fc"/><path d="M190 25 l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z" fill="#facc15"/>
</svg>`;

  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}
