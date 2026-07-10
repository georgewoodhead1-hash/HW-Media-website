import type { Metadata } from "next";
import LensIntro from "@/components/home/LensIntro";
import TrustedBy from "@/components/home/TrustedBy";
import ImageBand from "@/components/home/ImageBand";
import OurWork from "@/components/home/OurWork";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import Faqs from "@/components/home/Faqs";
import HomeCTA from "@/components/home/HomeCTA";
import FeatureBand from "@/components/home/FeatureBand";
import { jsonLd } from "@/lib/jsonld";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";
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

// Home (client final round order): hero -> trusted by -> featured work ->
// testimonials -> CTA -> process -> mission band ("creative agency") ->
// Defender band ("Wherever the story is") -> FAQs -> finale -> the footer
// reveals LAYERED BEHIND the page (Stone Visuals sticky reveal).
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
        <Testimonials />
        <HomeCTA />
        <Process />
        <ImageBand />
        <FeatureBand />
        <Faqs />
        <WhirlwindGallery />
      </main>
      <FooterReveal />
    </>
  );
}
