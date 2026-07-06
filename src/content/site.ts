// Central site config.
//
// BOOKING_URL — Harry's "Book a call" scheduler (links to his Google Calendar).
// TODO(client): replace this PLACEHOLDER with the real booking link. If it's a
// Google Calendar Appointment Schedule, an embed is possible too — drop the URL
// and say the word.
export const BOOKING_URL = "https://calendly.com/hw-media/intro-call";

// Single source of truth for the public email. hwmedia.co.uk is the live domain
// (hwmedia.productions was the old site). Used by the contact API, footer, and
// the "Let's create" section — keep them all pointing here.
export const EMAIL = "harry@hwmedia.co.uk";

export const SOCIALS = {
  instagram: "https://www.instagram.com/hwmedia/",
  linkedin: "https://www.linkedin.com/in/harry-wallis-98b47b161/",
};

// Canonical site origin — the FINAL domain, used for canonicals, sitemap,
// robots and all JSON-LD. Deliberately hwmedia.co.uk even while the build
// lives on the Vercel URL: it stops the temp domain being indexed, and at
// launch nothing needs touching.
export const SITE_URL = "https://hwmedia.co.uk";

// The FAQ ledger copy — rendered by TestimonialsFaqs AND emitted as FAQPage
// JSON-LD on the homepage (AI answer engines quote these verbatim), so it
// lives here as the single source of truth.
export const FAQS: { q: string; a: string }[] = [
  { q: "How much does a film cost?", a: "Every project is scoped to the story and the budget. You get a clear, fixed quote before anything is booked — no surprises later." },
  { q: "How long does a project take?", a: "Usually two to six weeks from first brief to final master, depending on shoot days and the edit. Full campaigns have turned around in under 72 hours when it mattered." },
  { q: "Is everything handled in-house?", a: "Direction, cinematography, edit and grade are all in-house — and Harry directs and shoots every project. The crew scales with the job; the standard never moves." },
  { q: "What do we get at the end?", a: "The master film plus every vertical, square and short-form cutdown your channels need — mastered properly, not cropped as an afterthought." },
  { q: "How do we get started?", a: "Send us a line about the project and we'll come back with ideas and a quote within a couple of days." },
];
