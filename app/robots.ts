// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "facebookexternalhit",
                allow: "/",
                disallow: "/api/",
            },
            {
                userAgent: "*",
                allow: "/",
                disallow: "/api/",
            },
        ],
        sitemap: "https://dashboard.finkita.web.id/sitemap.xml",
    };
}