import type { Metadata } from "next";
import Process from "@/components/home/Process";

// Client review page: both horizontal-scroll Process variants stacked, so the
// client can ride through each and pick one. Not linked from the site nav and
// kept out of the index.
export const metadata: Metadata = {
  title: "Process — variants",
  robots: { index: false, follow: false },
};

export default function ProcessVariants() {
  return (
    <main className="relative z-10 bg-[var(--bg)] text-[var(--fg)]">
      <div className="px-5 pt-[16vh] text-center md:px-10">
        <p className="label-mono text-[11px] tracking-[0.24em]">VARIANT A — EDITORIAL CARDS</p>
      </div>
      <Process key="variant-a" variant="a" />
      <div className="px-5 pt-[16vh] text-center md:px-10">
        <p className="label-mono text-[11px] tracking-[0.24em]">VARIANT B — CINEMA CARDS</p>
      </div>
      <Process key="variant-b" variant="b" />
      <div aria-hidden className="h-[12vh]" />
    </main>
  );
}
