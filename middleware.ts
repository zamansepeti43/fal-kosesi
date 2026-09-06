import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const completed = request.cookies.get("fal-kosesi-onboarding")?.value === "completed";

  if (pathname === "/onboarding") {
    if (completed) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (pathname === "/" && !completed) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/onboarding"],
};
