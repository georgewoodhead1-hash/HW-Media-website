import type { Metadata } from "next";
import Footer from "@/components/shell/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HW Media, a London film and photography production company, collects, uses and protects your personal information under UK GDPR and the Data Protection Act 2018.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "1. Who we are",
    p: [
      "This website (hwmedia.productions) is operated by HW Media, a film and photography production company based in London, United Kingdom (“HW Media”, “we”, “us”). For any privacy question or to exercise your rights, contact harry@hwmedia.productions. We are the data controller for the personal information described here.",
    ],
  },
  {
    h: "2. The information we collect",
    p: [
      "Information you give us directly: when you email us or get in touch, we collect what you choose to provide — typically your name, email address and the contents of your message.",
      "Information collected automatically: our hosting provider may log basic technical data (IP address, browser and device type, pages viewed) for security and reliability. We do not use it to identify you personally.",
      "Cookies: our website uses only cookies that are strictly necessary to function and stay secure. We do not use advertising or analytics cookies.",
    ],
  },
  {
    h: "3. How we use it, and our lawful basis",
    p: [
      "We use your information to respond to enquiries and discuss potential work (legitimate interests, and steps prior to a contract), to provide our services if you become a client (performance of a contract), to keep our site secure (legitimate interests), and to meet legal obligations such as tax records (legal obligation). We do not sell your personal information or use it for automated decision-making.",
    ],
  },
  {
    h: "4. Who we share it with",
    p: [
      "We share data only with trusted providers that help us operate: hosting and infrastructure (Vercel, GitHub) and email (Google Workspace). We may also share with professional advisers or authorities where required by law. These providers act on our instructions.",
    ],
  },
  {
    h: "5. How long we keep it",
    p: [
      "We keep enquiry emails only as long as needed to deal with your request and a reasonable period afterwards, then delete them. Client records are kept for the duration of our work and as long as required for legal, tax and accounting purposes (generally up to six years), after which they are securely deleted or anonymised.",
    ],
  },
  {
    h: "6. International transfers",
    p: [
      "Some providers (such as Vercel and Google) may process data outside the UK. Where that happens we rely on appropriate safeguards recognised under UK data protection law, such as the UK International Data Transfer Addendum or an adequacy decision.",
    ],
  },
  {
    h: "7. Your rights",
    p: [
      "Under UK data protection law you can access your data, have it corrected or erased, restrict or object to processing, and request portability. Where we rely on consent you may withdraw it at any time. To exercise any right, email harry@hwmedia.productions; we respond within one month. You may also complain to the Information Commissioner’s Office (ico.org.uk), though we’d appreciate the chance to put things right first.",
    ],
  },
  {
    h: "8. Security & children",
    p: [
      "We take reasonable technical and organisational measures to protect your information. No internet transmission is completely secure, but we work to protect your data and review our measures regularly. Our website is aimed at businesses and adults; we do not knowingly collect data from children under 13.",
    ],
  },
  {
    h: "9. Changes",
    p: [
      "We may update this policy from time to time. The date below shows when it last changed; material changes are posted on this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main data-theme="dark" data-surface="page" className="min-h-screen bg-[var(--bg)] px-5 pb-24 pt-[18vh] text-[var(--fg)] md:px-10">
        <div className="mx-auto max-w-3xl">
          <span className="label-mono text-[11px] tracking-[0.28em] text-[var(--gold-text)]/80">LEGAL</span>
          <h1 className="font-display mt-4 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95]" style={{ fontWeight: 400 }}>
            Privacy <span className="text-[var(--gold-text)]">Policy</span>
          </h1>
          <p className="mt-4 text-sm opacity-55">Last updated: 16 June 2026</p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="font-display text-xl" style={{ fontWeight: 500 }}>{s.h}</h2>
                {s.p.map((para, i) => (
                  <p key={i} className="mt-3 max-w-prose leading-relaxed text-[var(--fg)]/75">{para}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
