import { NextResponse } from "next/server";
import { EMAIL } from "@/content/site";

// Contact form endpoint — validates server-side and sends via Resend over HTTPS
// (no more mailto: which browsers flag as insecure and which doesn't reliably
// send). Set RESEND_API_KEY (and optionally CONTACT_FROM, a verified sender) in
// the Vercel project env for delivery to go live.
const MAX = { name: 80, email: 160, message: 4000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Body {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

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
      console.error("Resend error", res.status, await res.text());
      return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend request failed", err);
    return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
