import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await decrypt(session);
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("[Middleware] decrypt error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect from login if already logged in
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (session) {
      try {
        const payload = await decrypt(session);
        if (payload.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      } catch (error) {
        // Session invalid, let user login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
