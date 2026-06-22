import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { BOOKING_URL } from "@/content/site";
import Footer from "@/components/shell/Footer";
import WorkTile from "@/components/work/WorkTile";

export const metadata: Metadata = {
  title: "Work — HW Media",
  description: "Selected brand films, documentary and commercial work by HW Media, London.",
};

// Work grid (client feedback): a tight, flush 3-col mosaic — no gutters, no
// borders between tiles. Every tile is its film, autoplaying at once, with the
// client's logo overlaid over a soft dark gradient. The title lives only on the
// project detail page.
const LOGO: Record<string, string> = {
  McLaren: "mclaren-logo",
  Nike: "nike-white",
  Zuma: "zuma-white",
  Salomon: "salomon-logo-white",
  Defender: "defender-white",
  "Black Crows": "logo-black-crows-white",
};

export default function WorkIndex() {
  return (
    <>
      <main
        data-theme="dark"
        data-surface="page"
        className="min-h-screen bg-[var(--bg)] pb-[8vh] text-[var(--fg)]"
      >
        {/* Full-bleed flush mosaic — edge-to-edge, gap-0, no rings/borders between. pt-28 clears the fixed nav. */}
        <div className="grid grid-cols-1 gap-0 pt-28 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <WorkTile
              key={p.slug}
              slug={p.slug}
              wide={p.wide}
              posterWide={p.posterWide}
              client={p.client}
              logo={LOGO[p.client]}
            />
          ))}

        </div>

        {/* CTA — centred on the page, below the films (client) */}
        <section className="flex flex-col items-center justify-center px-5 py-[15vh] text-center md:px-10">
          <span
            className="text-[11px] uppercase tracking-[0.24em] text-[var(--gold-text)]"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Next
          </span>
          <h2 className="font-display mt-4 text-[clamp(2rem,5vw,4rem)] leading-[0.95]" style={{ fontWeight: 400 }}>
            Have a project <span className="text-[var(--gold-text)]">in mind?</span>
          </h2>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--fg)]/45 px-8 py-3.5 text-[clamp(15px,1.4vw,18px)] transition-colors duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Book a call with us <span aria-hidden>⟶</span>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
