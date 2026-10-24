import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Web Admin Pages (/admin and subroutes, allow /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSessionToken(sessionCookie);

    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Admin API Endpoints (/api/admin/*, allow /api/admin/login)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const authHeader = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const token = sessionCookie || authHeader;
    const isValid = await verifyAdminSessionToken(token);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Valid administrator session required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
