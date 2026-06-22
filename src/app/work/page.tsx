import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import { BOOKING_URL } from "@/content/site";
import Footer from "@/components/shell/Footer";

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
          {projects.map((p) => {
            const logo = LOGO[p.client];
            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden"
              >
                <video
                  className="absolute inset-0 h-full w-full scale-[1.12] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.18]"
                  src={p.wide}
                  poster={p.posterWide}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                {/* subtle dark wash so the centred logo always reads */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/45" />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/logos/${logo}.png`}
                      alt={p.client}
                      className="h-10 w-auto max-w-[58%] object-contain opacity-95 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <span
                      className="text-[clamp(1.1rem,2vw,1.6rem)] uppercase tracking-[0.12em] text-white/95"
                      style={{ fontFamily: "var(--font-firma), sans-serif" }}
                    >
                      {p.client}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

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
            Have a project <span className="text-[var(--gold)]">in mind?</span>
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
