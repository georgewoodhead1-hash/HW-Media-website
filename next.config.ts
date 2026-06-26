import type { NextConfig } from "next";

// Content-Security-Policy tuned for HW Media Rebuild.
//
// Rationale for each directive:
//   default-src 'self'       — baseline: only same-origin resources
//   script-src 'unsafe-inline' — required for the inline theme-restore <script>
//                               in layout.tsx (sets data-mode before first paint).
//                               GSAP and all other JS are bundled and served from
//                               'self' (/_next/static). A nonce approach would
//                               require editing layout.tsx, which is off-limits
//                               for this pass.
//   style-src 'unsafe-inline' — Tailwind v4 emits inline <style> blocks; component
//                               inline style props also require this.
//   img-src data: blob:      — Grain.tsx uses data:image/svg+xml in a CSS
//                               background-image; blob: covers any Next.js image
//                               optimisation edge cases.
//   media-src 'self'         — all <video src={...}> point to /public assets
//                               (self-hosted mp4 files).
//   font-src 'self' data:    — next/font/google self-hosts every Google Font to
//                               /_next/static at build time; BR Firma local font
//                               is also served from 'self'. data: covers any
//                               base64-encoded font fallbacks Next.js may emit.
//   connect-src 'self'       — contact form POSTs to /api/contact (same origin).
//   frame-ancestors 'none'   — belt-and-suspenders with X-Frame-Options.
//   base-uri 'self'          — prevents base-tag injection attacks.
//   form-action 'self'       — contact form submits to same origin only.
// React Fast Refresh / HMR uses eval() in development only — production builds
// never do, so 'unsafe-eval' is added for dev exclusively (keeps prod strict).
const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
