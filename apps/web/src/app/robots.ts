import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/seeker/", "/employer/", "/messages/", "/settings/"] }, sitemap: "https://talentsouq.it.com/sitemap.xml" }; }
