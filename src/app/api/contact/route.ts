import { NextResponse } from "next/server";
import { EMAIL } from "@/content/site";

// Contact form endpoint — validates server-side and sends via Resend over HTTPS.
// Set RESEND_API_KEY (and optionally CONTACT_FROM, a verified sender) in the Vercel
// project env for delivery to go live.
const MAX = { name: 80, email: 160, message: 4000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory per-IP rate limit. On serverless this is per warm instance
// (not global), but it cheaply stops naive floods / email-bomb scripts. For hard
// cross-instance guarantees, front it with Upstash Redis or Cloudflare.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) hits.clear(); // bound memory growth
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// strip CR/LF so user values can't inject headers into the outgoing email
const noCRLF = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

interface Body {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages — please try again in a few minutes." }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = noCRLF(String(body.firstName ?? ""));
  const lastName = noCRLF(String(body.lastName ?? ""));
  const email = noCRLF(String(body.email ?? ""));
  const message = String(body.message ?? "").trim(); // kept multi-line — only ever in the body, never a header

  if (!firstName || firstName.length > MAX.name) return NextResponse.json({ error: "Please enter your first name." }, { status: 400 });
  if (lastName.length > MAX.name) return NextResponse.json({ error: "That last name is too long." }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > MAX.email) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!message || message.length > MAX.message) return NextResponse.json({ error: "Please enter a message under 4000 characters." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY not set — contact form cannot send.");
    return NextResponse.json({ error: `The form isn't connected yet. Please email ${EMAIL} directly for now.` }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "HW Media <onboarding@resend.dev>",
        to: [EMAIL],
        reply_to: email,
        subject: `New enquiry — ${firstName} ${lastName}`.trim(),
        text: `From: ${firstName} ${lastName} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      console.error("Resend delivery error", res.status); // status only — never log the response body
      return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend request failed", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
