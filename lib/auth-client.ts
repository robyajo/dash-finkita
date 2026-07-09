import { createAuthClient } from "better-auth/react";

// Call through Next.js server — the /api/auth route handler proxies to the backend
// and fixes Set-Cookie headers for cross-port cookie sharing.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
