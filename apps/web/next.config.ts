import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  async redirects() {
    return [
      // Company pages moved to the live career pages (report RPT-2026-014 §6:
      // /companies/<slug> showed demo companies). Temporary, so the slug space
      // stays free if company profiles return.
      { source: "/companies/:slug", destination: "/careers/:slug", permanent: false }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }]
      }
    ];
  }
};

export default nextConfig;
