import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import Footer from "@/components/shell/Footer";

export const metadata: Metadata = {
  title: "Work — HW Media",
  description: "Selected brand films, documentary and commercial work by HW Media, London.",
};

// Work grid (client feedback): a clean 3x3, Auteur-style — white text and the
// client's logo overlaid on each film. Runs through Norton (Chasing the Salt)
// and Black Crows; a final tile invites the next project.
const LOGO: Record<string, string> = {
  McLaren: "mclaren-logo",
  Nike: "nike-white",
  Zuma: "zuma-white",
  Salomon: "salomon-logo-white",
  Defender: "defender-white",
};

export default function WorkIndex() {
  return (
    <>
      <main
        data-theme="dark"
        data-surface="page"
        className="min-h-screen bg-[var(--bg)] px-5 pb-[8vh] pt-[16vh] text-[var(--fg)] md:px-10"
      >
        <div className="mb-10">
          <span className="label-mono text-[11px] tracking-[0.28em] text-[var(--gold)]/80">SELECTED WORK</span>
          <h1 className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[0.9]" style={{ fontWeight: 400 }}>
            Work
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.posterWide}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <div className="h-6">
                  {LOGO[p.client] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/logos/${LOGO[p.client]}.png`} alt={p.client} className="h-5 w-auto max-w-[120px] object-contain" />
                  ) : (
                    <span className="label-mono text-[10px] tracking-[0.24em] text-white/90">{p.client.toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none text-white" style={{ fontWeight: 400 }}>
                    {p.title}
                  </h2>
                  <span className="label-mono mt-2 inline-block text-[10px] tracking-[0.22em] text-white/0 transition-colors duration-300 group-hover:text-[var(--gold)]">
                    WATCH ⟶
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Black Crows — logo tile (project to come) */}
          <Link href="/contact" className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-[var(--hairline-dark)] bg-[#0b0b0b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/logo-black-crows-white.png" alt="Black Crows" className="h-8 w-auto max-w-[150px] object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="label-mono absolute bottom-5 left-5 text-[10px] tracking-[0.24em] text-white/45">IN PRODUCTION</span>
          </Link>

          {/* next-project CTA tile — keeps the grid a clean 3x3 */}
          <Link href="/contact" className="group relative flex aspect-[4/3] flex-col items-start justify-end overflow-hidden rounded-md border border-[var(--gold)]/40 bg-[#0b0b0b] p-5">
            <span className="label-mono text-[10px] tracking-[0.24em] text-[var(--gold)]">NEXT</span>
            <h2 className="font-display mt-2 text-[clamp(1.4rem,2.2vw,2rem)] leading-[0.95] text-white" style={{ fontWeight: 400 }}>
              Have a project<br />in mind?
            </h2>
            <span className="label-mono mt-3 text-[10px] tracking-[0.22em] text-white/70 transition-colors duration-300 group-hover:text-[var(--gold)]">
              GET IN TOUCH ⟶
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
