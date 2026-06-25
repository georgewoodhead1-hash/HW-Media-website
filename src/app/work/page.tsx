import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/shell/Footer";
import WorkGallery from "@/components/work/WorkGallery";
import SiteIntro from "@/components/shell/SiteIntro";

export const metadata: Metadata = {
  title: "Work — HW Media",
  description: "Selected brand films, documentary and commercial work by HW Media, London.",
};

// Work page — the gallery wall in Harry's hierarchy order (Featured → Discover More
// → Coming soon), tiles revealing in reading order. CTA kept below.
export default function WorkIndex() {
  return (
    <>
      <SiteIntro words={["Our", "work"]} />
      <main data-theme="dark" data-surface="page" className="min-h-screen bg-[var(--bg)] pb-[8vh] text-[var(--fg)]">
        <div className="pt-28">
          <WorkGallery />
        </div>

        {/* CTA — centred, below the films */}
        <section className="flex flex-col items-center justify-center px-5 py-[15vh] text-center md:px-10">
          <span className="about-label text-[var(--gold-text)]">Next</span>
          <h2 className="about-display mt-4 text-[clamp(2rem,5vw,4rem)] leading-[0.95] text-[var(--fg)]">
            Have a project <span className="gold-lg">in mind?</span>
          </h2>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--fg)]/45 px-8 py-3.5 text-[clamp(15px,1.4vw,18px)] transition-colors duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Start here <span aria-hidden>⟶</span>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
