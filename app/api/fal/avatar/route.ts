import { NextResponse } from "next/server";

export const runtime = "edge";

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = (result * 31 + value.charCodeAt(i)) >>> 0;
  return result;
}

// Curated human-looking 3D character renders hosted by three.ws.
// The picker can pass an explicit slot so the five visible characters are always unique.
const HUMAN_3D_CHARACTERS = [
  { id: "68c2e4b0-1ad6-4e53-b67d-161b8f4ccfbf", name: "Louise" },
  { id: "d13cd86b-a90f-4c8a-81c9-18fc490b40ba", name: "James" },
  { id: "f7b85d05-5f1c-47d8-9770-9a1a054bd6f6", name: "Ely" },
  { id: "d0496a75-08b9-4f4e-9f1d-f65820323cc2", name: "Erika Archer" },
  { id: "e89ec3c3-47b4-4d55-87f5-83d91e537136", name: "Maria J J Ong" },
] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "tarotella";
  const requestedSlot = Number.parseInt(url.searchParams.get("slot") || "", 10);
  const slot = Number.isInteger(requestedSlot) && requestedSlot >= 0 && requestedSlot < HUMAN_3D_CHARACTERS.length
    ? requestedSlot
    : hash(id) % HUMAN_3D_CHARACTERS.length;
  const character = HUMAN_3D_CHARACTERS[slot];
  const renderUrl = new URL("https://three.ws/api/avatar/render");
  renderUrl.searchParams.set("avatar", character.id);
  renderUrl.searchParams.set("scene", "portrait");
  renderUrl.searchParams.set("size", "720");
  renderUrl.searchParams.set("bg", "transparent");

  return NextResponse.redirect(renderUrl.toString(), {
    status: 302,
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
    },
  });
}
