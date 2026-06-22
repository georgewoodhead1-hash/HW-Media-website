import type { Metadata } from "next";
import Footer from "@/components/shell/Footer";
import ContactIntro from "@/components/contact/ContactIntro";

export const metadata: Metadata = {
  title: "Contact — HW Media",
  description: "Start a project with HW Media. Brand films, documentary, photography — London.",
};

// Simple, centred contact page: one heading + a clean four-field form. One
// font family for the form (DM Sans), display for the heading. Nothing else.
const FIELD =
  "w-full rounded-md border border-[var(--hairline-dark)] bg-transparent px-5 py-3.5 text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/40 focus:border-[var(--gold)]";

export default function Contact() {
  return (
    <>
      <ContactIntro />
      <main
        data-theme="dark"
        data-surface="page"
        className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-5 py-32 text-center text-[var(--fg)] md:px-10"
      >
        <div className="w-full max-w-xl">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95]" style={{ fontWeight: 400 }}>
            Tell us <span className="text-[var(--gold-text)]">more.</span>
          </h1>
          <p
            className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--fg)]/70"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Put your details in below and we&rsquo;ll get back to you within 24 hours of your enquiry.
          </p>

          <form
            className="mt-12 flex flex-col gap-4 text-left"
            action="mailto:harry@hwmedia.productions"
            method="post"
            encType="text/plain"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input name="First name" placeholder="First name" autoComplete="given-name" className={FIELD} required />
              <input name="Last name" placeholder="Last name" autoComplete="family-name" className={FIELD} required />
            </div>
            <input type="email" name="Email" placeholder="Email address" autoComplete="email" className={FIELD} required />
            <textarea name="Message" rows={5} placeholder="Message" className={FIELD} required />
            <button
              type="submit"
              className="lift-hover mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-8 py-3.5 text-[15px] font-medium text-[#0a0a08] transition-colors duration-300 hover:bg-[#d7c476]"
            >
              Send <span aria-hidden>⟶</span>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
