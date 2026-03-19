import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];
const PROTECTED_PREFIXES = ["/dashboard", "/notes", "/tasks", "/habits", "/goals", "/calendar", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // We set this cookie on successful login/signup from client.
  // It is NOT sensitive. It's only for edge redirect hints.
  const hasAuthHint = req.cookies.get("isAuthenticated")?.value === "true";

  if (isProtected && !hasAuthHint) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublic && hasAuthHint) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/forgot-password", "/dashboard/:path*", "/notes/:path*", "/tasks/:path*", "/habits/:path*", "/goals/:path*", "/calendar/:path*", "/settings/:path*"],
};