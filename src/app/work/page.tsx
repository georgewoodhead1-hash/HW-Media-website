import type { Metadata } from "next";
import Footer from "@/components/shell/Footer";
import WorkGallery from "@/components/work/WorkGallery";
import WorkLetsCreate from "@/components/work/WorkLetsCreate";
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
      <main data-theme="dark" data-surface="page" className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <div className="pt-28">
          <WorkGallery />
        </div>

        {/* the cream "Let's create" bubble grows up and stays */}
        <WorkLetsCreate />
      </main>
      <Footer />
    </>
  );
}
