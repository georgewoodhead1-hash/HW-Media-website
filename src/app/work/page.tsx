import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
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
        {/* Full-screen centred hero heading */}
        <section className="flex min-h-[70vh] items-center justify-center px-5 text-center md:px-10">
          <h1
            className="font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.92]"
            style={{ fontWeight: 400 }}
          >
            Selected Work
          </h1>
        </section>

        {/* Full-bleed flush mosaic — edge-to-edge, gap-0, no rings/borders between */}
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
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
                {/* subtle dark gradient so the logo always reads */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30" />
                <div className="absolute inset-0 flex items-end p-6">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/logos/${logo}.png`}
                      alt={p.client}
                      className="h-6 w-auto max-w-[150px] object-contain opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  ) : (
                    <span
                      className="text-[15px] tracking-[0.06em] text-white/90"
                      style={{ fontFamily: "var(--font-firma), sans-serif" }}
                    >
                      {p.client}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Black Crows — logo tile (project in production), flush with the grid */}
          <Link
            href="/contact"
            className="group relative flex aspect-[4/3] items-end overflow-hidden bg-[#0b0b0b] p-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/logo-black-crows-white.png"
              alt="Black Crows"
              className="h-7 w-auto max-w-[150px] object-contain opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span
              className="absolute right-6 top-6 text-[10px] tracking-[0.24em] text-white/45"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              IN PRODUCTION
            </span>
          </Link>

          {/* next-project CTA tile — keeps the mosaic square */}
          <Link
            href="/contact"
            className="group relative flex aspect-[4/3] flex-col items-start justify-end overflow-hidden bg-[#0b0b0b] p-6"
          >
            <span
              className="text-[10px] tracking-[0.24em] text-[var(--gold)]"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              NEXT
            </span>
            <h2 className="font-display mt-2 text-[clamp(1.4rem,2.2vw,2rem)] leading-[0.95] text-white" style={{ fontWeight: 400 }}>
              Have a project<br />in mind?
            </h2>
            <span
              className="mt-3 text-[10px] tracking-[0.22em] text-white/70 transition-colors duration-300 group-hover:text-[var(--gold)]"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              GET IN TOUCH ⟶
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
