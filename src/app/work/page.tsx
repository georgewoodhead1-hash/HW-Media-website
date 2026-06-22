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
        {/* Centred hero heading — one line, restrained scale */}
        <section className="flex min-h-[50vh] items-center justify-center px-5 text-center md:px-10">
          <h1
            className="font-display whitespace-nowrap text-[clamp(2.4rem,7vw,6rem)] leading-[0.92]"
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
