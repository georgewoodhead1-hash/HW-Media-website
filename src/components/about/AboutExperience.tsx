"use client";

import CustomCursor from "./CustomCursor";
import AboutIntro from "./AboutIntro";
import KnockoutHero from "./KnockoutHero";
import Statement from "./Statement";
import Work from "./Work";
import Harry from "./Harry";
import Method from "./Method";
import ContactCircle from "./ContactCircle";
import AboutFooter from "./AboutFooter";

// About — original high-end build (creative freedom). One dark surface, Bar/Archivo
// type only, smooth scrubbed motion. The name IS the work (knockout hero), then
// what HW Media is, Harry the one director, how we work, and the expanding-circle
// "Let's create" close. Images/stills only, no big horizontal video. See
// docs/superpowers/plans/2026-06-24-hw-about-creative.md. (Work scene + a circle
// transition still to add per the plan.)
export default function AboutExperience() {
  return (
    <main className="about-experience on-media relative bg-[#050505] text-[#f5f1e6]">
      <AboutIntro />
      <CustomCursor />

      <KnockoutHero />
      <Statement />
      <Work />
      <Harry />
      <Method />
      <ContactCircle />
      <AboutFooter />
    </main>
  );
}
