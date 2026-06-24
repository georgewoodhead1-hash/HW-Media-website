"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// Restrained "corner index" signature (lukebaffait / auteur). A whisper-quiet
// fixed label, bottom-RIGHT, that names the current chapter as you scroll.
// Reads each section's [data-chapter] attribute and updates when that section
// crosses mid-viewport. Uses --fg so it stays legible in light/dark, is
// pointer-events-none, and sits in the bottom-right corner — clear of the
// bottom-left social rail + theme toggle and the top nav.
export default function CornerIndex() {
  const [chapter, setChapter] = useState("");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]"),
    );
    if (sections.length === 0) return;

    // Seed with whichever chapter currently owns the middle of the viewport.
    const mid = window.innerHeight / 2;
    const initial = sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    if (initial) setChapter(initial.dataset.chapter ?? "");

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        // Entering downward, or scrolling back up into it, both claim the label.
        onEnter: () => setChapter(section.dataset.chapter ?? ""),
        onEnterBack: () => setChapter(section.dataset.chapter ?? ""),
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div
      aria-hidden
      className="label-mono pointer-events-none fixed bottom-4 right-5 z-40 text-[10px] uppercase tracking-[0.28em] text-[var(--fg)] opacity-50 md:bottom-5 md:right-10 md:text-[11px]"
    >
      {chapter}
    </div>
  );
}
