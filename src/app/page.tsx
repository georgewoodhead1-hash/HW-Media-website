import type { Metadata } from "next";
import LensIntro from "@/components/home/LensIntro";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import Process from "@/components/home/Process";
import WhatWeDo from "@/components/home/WhatWeDo";
import Faqs from "@/components/home/Faqs";
import FeatureBand from "@/components/home/FeatureBand";
import { jsonLd } from "@/lib/jsonld";
import FooterReveal from "@/components/shell/FooterReveal";
import { FAQS } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The FAQ ledger as FAQPage JSON-LD — AI answer engines (ChatGPT, Perplexity,
// AI Overviews) lift Q&A pairs from here when someone asks what a brand film
// costs or how long production takes.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

// Home (final round order): hero -> trusted by -> featured work -> process
// (1820 full-screen panels, untouched) -> testimonials -> diagonal tiles band
// ("Start here") -> FAQs -> Defender band (pen stroke) -> the footer reveals
// LAYERED BEHIND the page (Stone Visuals sticky reveal). The "creative
// agency" photo band and the spiral finale are BINNED (spiral saved to
// Reference/patterns/spinning-animation for reuse).
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />
      <main className="relative z-10 bg-[var(--bg)]">
        <LensIntro />
        <TrustedBy />
        <OurWork />
        {/* Testimonials render INSIDE Process — the strip's outro screen composes the title + testimony (George, 2026-07-14) */}
        <Process />
        {/* ROUND-8: the diagonal tiles band is GONE — What we do moved here
            from About (all the services on the home page, George) */}
        <WhatWeDo />
        <Faqs />
        <FeatureBand />
      </main>
      <FooterReveal />
    </>
  );
}
