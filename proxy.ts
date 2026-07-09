import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find Better Auth session cookie
  const getSessionCookie = () => {
    for (const [name, cookie] of request.cookies as any) {
      if (name.includes("better-auth") || name.includes("session_token")) {
        return cookie;
      }
    }
    return null;
  };

  // Protect dashboard — redirect to / (login) if no session
  if (pathname.startsWith("/dashboard")) {
    if (!getSessionCookie()) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect logged-in users away from auth pages to /dashboard
  if (pathname === "/" || pathname === "/signup") {
    if (getSessionCookie()) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/signup",
  ],
};
