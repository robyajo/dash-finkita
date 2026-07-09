import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function proxyAuth(
  request: NextRequest,
  { all }: { all: string[] },
) {
  const path = all.join("/");
  const targetUrl = new URL(`/api/auth/${path}`, BACKEND_URL);
  targetUrl.search = request.nextUrl.search;

  console.log(`[AUTH PROXY] ${request.method} /api/auth/${path}`);
  console.log(`[AUTH PROXY] Cookie:`, request.headers.get("cookie")?.substring(0, 80) || "NONE");

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  // Set Origin header for Better Auth CSRF protection
  if (!headers.has("origin")) {
    headers.set("origin", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);

  console.log(`[AUTH PROXY] Response: ${response.status} ${response.statusText}`);
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    console.log(`[AUTH PROXY] Set-Cookie:`, fixSetCookie(setCookie).substring(0, 100));
  }

  // If backend returns a redirect, follow it manually
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      // Rewrite redirect URL to go through Next.js server
      const redirectUrl = new URL(location, request.url);
      if (redirectUrl.hostname === "localhost" && redirectUrl.port === "8000") {
        redirectUrl.port = "3000";
      }
      const redirectResponse = NextResponse.redirect(redirectUrl.toString(), response.status as 301 | 302 | 303 | 307 | 308);

      // Forward Set-Cookie from redirect response
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        redirectResponse.headers.set("set-cookie", fixSetCookie(setCookie));
      }

      return redirectResponse;
    }
  }

  // Build response with forwarded headers
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      newResponse.headers.append("set-cookie", fixSetCookie(value));
    } else {
      newResponse.headers.set(key, value);
    }
  });

  return newResponse;
}

/**
 * Fix Set-Cookie headers for cross-port cookie sharing:
 * - Change Domain=localhost:PORT to Domain=localhost
 * - Remove Secure flag (HTTP localhost doesn't support it)
 * - Change SameSite=None to SameSite=Lax (for HTTP)
 */
function fixSetCookie(cookie: string): string {
  return cookie
    .replace(/Domain=localhost:\d+/gi, "Domain=localhost")
    .replace(/;\s*Secure/gi, "")
    .replace(/SameSite=None/gi, "SameSite=Lax");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  return proxyAuth(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  return proxyAuth(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  return proxyAuth(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  return proxyAuth(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  return proxyAuth(request, await params);
}
