import type { Metadata } from "next";
import Footer from "@/components/shell/Footer";
import WorkGallery from "@/components/work/WorkGallery";
import ContactCircle from "@/components/about/ContactCircle";
import SiteIntro from "@/components/shell/SiteIntro";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected brand films, documentary and commercial work by HW Media, London.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    siteName: "HW Media",
    title: "Work — HW Media",
    description:
      "Selected brand films, documentary and commercial work by HW Media, London.",
    url: "/work",
    images: [{ url: "/images/hero-defocus.jpg", width: 1920, height: 1080, alt: "HW Media — Work" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — HW Media",
    description:
      "Selected brand films, documentary and commercial work by HW Media, London.",
    images: ["/images/hero-defocus.jpg"],
  },
};

// Work page — the gallery wall in Harry's hierarchy order (Featured → Discover More
// → Coming soon), tiles revealing in reading order. CTA kept below.
export default function WorkIndex() {
  return (
    <>
      <SiteIntro words={["Our", "work"]} />
      <main data-theme="dark" data-surface="page" className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <div className="pt-28">
          <WorkGallery />
        </div>

        {/* the SAME "Let's create" growing circle as the About page */}
        <ContactCircle />
      </main>
      <Footer />
    </>
  );
}
