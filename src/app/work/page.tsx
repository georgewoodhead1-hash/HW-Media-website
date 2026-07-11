import type { Metadata } from "next";
import FooterReveal from "@/components/shell/FooterReveal";
import WorkGallery from "@/components/work/WorkGallery";
import PageBuild from "@/components/shell/PageBuild";

const DESC =
  "Brand films, commercials and documentary work by HW Media — films for McLaren, Nike, Aston Martin, Ferrari, Land Rover and Zuma, directed and shot in-house in London.";

export const metadata: Metadata = {
  title: "Work — Films for McLaren, Nike & Aston Martin",
  description: DESC,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "Work — HW Media",
    description: DESC,
    url: "/work",
    images: [{ url: "/images/hero-defocus.jpg", width: 1920, height: 1080, alt: "HW Media — Work" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — HW Media",
    description: DESC,
    images: ["/images/hero-defocus.jpg"],
  },
};

// Work page — the gallery wall in Harry's hierarchy order (Featured → Discover More
// → Coming soon), tiles revealing in reading order. CTA kept below.
export default function WorkIndex() {
  return (
    <>
      <main data-theme="dark" data-surface="page" className="relative z-10 min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <PageBuild />
        {/* the page's H1 — the gallery wall is all tiles, so the heading is
            for crawlers and screen readers (the audit's only missing-H1 page) */}
        <h1 className="sr-only">Work — brand films and commercials by HW Media, London</h1>
        <div className="pt-28 pb-[10vh]">
          <WorkGallery />
        </div>
      </main>
      {/* one footer site-wide — the 1820 reveal footer, layered behind the page */}
      <FooterReveal />
    </>
  );
}
