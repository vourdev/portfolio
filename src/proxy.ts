import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight gate: redirect to login if there's no session cookie.
// Full HMAC verification happens in the admin layout (requireAuth).
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.cookies.has("admin_session")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
