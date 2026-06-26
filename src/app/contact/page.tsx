import type { Metadata } from "next";
import Footer from "@/components/shell/Footer";
import ContactIntro from "@/components/contact/ContactIntro";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with HW Media. Brand films, documentary, photography — London.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "Contact — HW Media",
    description:
      "Start a project with HW Media. Brand films, documentary, photography — London.",
    url: "/contact",
    images: [{ url: "/images/hero-defocus.jpg", width: 1920, height: 1080, alt: "HW Media — Contact" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — HW Media",
    description:
      "Start a project with HW Media. Brand films, documentary, photography — London.",
    images: ["/images/hero-defocus.jpg"],
  },
};

// Simple, centred contact page: one heading + the secure ContactForm (posts to
// /api/contact over HTTPS — no mailto, no "not secure" warning). Display font for
// the heading, BR Firma for the form.
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
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95]">
            Tell us <span className="text-[var(--gold-text)]">more.</span>
          </h1>
          <p
            className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--fg)]/70"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Put your details in below and we&rsquo;ll get back to you within 24 hours of your enquiry.
          </p>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
