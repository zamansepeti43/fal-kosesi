import { NextResponse } from "next/server";

export const runtime = "edge";

const palettes = [
  { scarf: "#8f2348", dress: "#5b1736", hair: "#20161b", bg: "#26172d", skin: "#e7b9a8", lip: "#a83255" },
  { scarf: "#65408d", dress: "#39224f", hair: "#17141d", bg: "#1d1930", skin: "#c99078", lip: "#8f3e57" },
  { scarf: "#a84a23", dress: "#632719", hair: "#211713", bg: "#302019", skin: "#d7a184", lip: "#9e3d3f" },
  { scarf: "#276d72", dress: "#183f49", hair: "#171b20", bg: "#172b31", skin: "#e1b49a", lip: "#8f4054" },
  { scarf: "#a06a28", dress: "#4c321d", hair: "#2a1a16", bg: "#302519", skin: "#b9795e", lip: "#813747" },
  { scarf: "#873a8f", dress: "#48214f", hair: "#17131d", bg: "#28172d", skin: "#f0c6b4", lip: "#a23d60" },
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
  const older = h % 5 === 0;
  const glasses = h % 7 === 0;
  const hair = h % 3;
  const cup = h % 2 === 0;
  const hairPath = hair === 0
    ? "M49 104 Q43 49 74 32 Q109 12 145 34 Q177 53 170 105 Q153 79 129 75 Q91 71 49 104Z"
    : hair === 1
      ? "M53 106 Q46 61 66 39 Q91 12 128 25 Q168 39 169 91 Q160 113 151 121 L143 82 Q116 61 79 76 Q67 87 53 106Z"
      : "M51 107 Q49 52 86 31 Q123 10 155 40 Q174 59 168 106 Q148 79 124 79 Q85 73 51 107Z";
  const faceRx = older ? 49 : 51;
  const faceRy = older ? 55 : 58;
  const eyeSize = older ? 5.5 : 6.2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 420" role="img" aria-label="Sanal fal karakteri">
  <defs>
    <radialGradient id="bg" cx="50%" cy="25%" r="80%"><stop offset="0" stop-color="${p.bg}"/><stop offset="1" stop-color="#090810"/></radialGradient>
    <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.scarf}"/><stop offset="1" stop-color="${p.dress}"/></linearGradient>
    <radialGradient id="skin" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#f5d3c5"/><stop offset="1" stop-color="${p.skin}"/></radialGradient>
    <filter id="shadow"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <rect width="360" height="420" rx="54" fill="url(#bg)"/>
  <circle cx="180" cy="144" r="126" fill="${p.scarf}" opacity=".12"/>
  <ellipse cx="180" cy="390" rx="126" ry="28" fill="#000" opacity=".42" filter="url(#shadow)"/>

  <path d="M54 414 Q62 291 180 278 Q298 291 306 414Z" fill="url(#cloth)"/>
  <path d="M119 302 Q180 260 241 302 L254 356 Q180 382 106 356Z" fill="${p.scarf}" opacity=".9"/>

  <path d="M49 111 Q38 67 70 38 Q103 8 150 25 Q180 12 211 28 Q256 50 260 111 Q240 89 214 79 Q175 61 126 76 Q86 84 49 111Z" fill="${p.scarf}"/>
  <path d="${hairPath}" fill="${p.hair}"/>

  <ellipse cx="180" cy="158" rx="${faceRx}" ry="${faceRy}" fill="url(#skin)"/>
  <path d="M132 137 Q133 103 158 83 Q181 69 204 82 Q226 94 232 132 Q211 111 189 110 Q159 108 132 137Z" fill="${p.hair}"/>
  <path d="M132 157 Q119 165 125 183 Q132 193 143 183" fill="none" stroke="${p.skin}" stroke-width="10" stroke-linecap="round"/>
  <path d="M228 157 Q241 165 235 183 Q228 193 217 183" fill="none" stroke="${p.skin}" stroke-width="10" stroke-linecap="round"/>

  ${glasses ? `<rect x="135" y="141" width="34" height="28" rx="13" fill="none" stroke="#c9a55b" stroke-width="4"/><rect x="191" y="141" width="34" height="28" rx="13" fill="none" stroke="#c9a55b" stroke-width="4"/><path d="M169 151 Q180 146 191 151" fill="none" stroke="#c9a55b" stroke-width="4"/>` : ""}
  <ellipse cx="153" cy="155" rx="${eyeSize}" ry="7" fill="#1c1720"/><ellipse cx="207" cy="155" rx="${eyeSize}" ry="7" fill="#1c1720"/>
  <circle cx="155" cy="153" r="2" fill="#fff"/><circle cx="209" cy="153" r="2" fill="#fff"/>
  <path d="M137 137 Q153 128 169 136" fill="none" stroke="#3a2327" stroke-width="5" stroke-linecap="round"/><path d="M191 136 Q207 128 223 137" fill="none" stroke="#3a2327" stroke-width="5" stroke-linecap="round"/>
  <path d="M180 157 Q173 177 181 181 Q188 178 185 158" fill="none" stroke="#a56e63" stroke-width="3" stroke-linecap="round"/>
  <path d="M157 198 Q180 ${older ? 211 : 215} 203 198" fill="none" stroke="${p.lip}" stroke-width="6" stroke-linecap="round"/>
  ${older ? `<path d="M145 185 Q151 188 157 185 M203 185 Q209 188 215 185" fill="none" stroke="#b88476" stroke-width="2" opacity=".55"/>` : ""}

  <path d="M120 268 Q180 235 240 268" fill="none" stroke="${p.scarf}" stroke-width="32" stroke-linecap="round"/>
  <path d="M132 276 Q180 250 228 276" fill="none" stroke="#f0c8ba" stroke-width="8" stroke-linecap="round"/>
  ${cup ? `<g transform="translate(205 302)"><ellipse cx="32" cy="47" rx="35" ry="10" fill="#000" opacity=".2"/><path d="M0 12 Q31 0 62 12 L56 51 Q31 63 6 51Z" fill="#efe7e4"/><path d="M61 21 Q82 19 80 37 Q78 51 59 49" fill="none" stroke="#efe7e4" stroke-width="9"/><ellipse cx="31" cy="12" rx="31" ry="8" fill="#b99176"/><path d="M19 4 Q24 -12 31 4 M34 4 Q41 -13 46 5" fill="none" stroke="#d7b49e" stroke-width="3" stroke-linecap="round"/></g>` : ""}

  <circle cx="37" cy="44" r="5" fill="#facc15"/><circle cx="321" cy="65" r="4" fill="#c084fc"/><path d="M318 35 l4 8 8 4-8 4-4 8-4-8-8-4 8-4Z" fill="#facc15"/>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
