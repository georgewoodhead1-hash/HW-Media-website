"use client";

import CustomCursor from "../CustomCursor";
import ContactCircle from "../ContactCircle";
import ReelChrome from "./ReelChrome";
import ReelColdOpen from "./ReelColdOpen";
import ReelStatement from "./ReelStatement";
import ReelCrew from "./ReelCrew";
import ReelWork from "./ReelWork";
import ReelProof from "./ReelProof";

// VERSION B — "THE REEL". HW Media's about page as one continuous cinematic
// sequence: a full-screen showreel cold open, the statement set over footage, the
// crew held one face at a time in the viewfinder, the films full-bleed and moving,
// then a calm client wall to breathe, into the kept "Let's create" circle.
// References: oceanfilms.com.br (full-bleed film, one ring, near-zero UI),
// bennettandclive.com (type over footage), podium.global (choreographed scrub).
// Dark + gold, Archivo only, agency voice. The footage is the drama.
export default function AboutReel() {
  return (
    <main id="main" className="about-experience on-media relative bg-[#050505] text-[#f5f1e6]">
      <CustomCursor />
      <ReelChrome />

      <ReelColdOpen />
      <ReelStatement />
      <ReelCrew />
      <ReelWork />
      <ReelProof />
      <ContactCircle />
    </main>
  );
}
