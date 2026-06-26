import type { NextConfig } from "next";

// Security headers applied to every route. A full Content-Security-Policy is
// intentionally left out here — it needs per-embed testing (video, fonts, any
// Calendly/embed) before enforcing or it silently breaks the page. The headers
// below are safe, non-breaking, and close the gaps flagged in the audit.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
