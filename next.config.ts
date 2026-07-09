import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "s.500fd.com",
            },
            {
                protocol: "https",
                hostname: "images.microCMS.io",
            },
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    async rewrites() {
        return [
            // Proxy/Rewrite untuk memuat aset statis (seperti avatar user) yang disimpan di backend storage
            // Auth API ditangani oleh route handler /app/api/auth/[...all]/route.ts
            // Other API calls go directly to backend (CORS configured in ALLOWED_ORIGINS)
            {
                source: "/storage/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/storage/:path*`,
            },
        ]
    },
}

export default nextConfig
