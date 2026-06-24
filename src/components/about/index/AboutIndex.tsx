"use client";

import CustomCursor from "../CustomCursor";
import ProgressRail from "../luke/ProgressRail";
import ContactCircle from "../ContactCircle";
import IndexMasthead from "./IndexMasthead";
import AgencyStatement from "./AgencyStatement";
import CrewStrip from "./CrewStrip";
import WorkIndex from "./WorkIndex";
import ServicesLedger from "./ServicesLedger";
import NumbersProof from "./NumbersProof";

// VERSION A — "THE INDEX". HW Media's about page as a restrained editorial index:
// hairline geometry, vast black space, one gold accent, dimmed indexes and a
// sideways-travelling crew strip. References: lukebaffait.fr (dimmed index + live
// frame), noxediem.ch (huge type, restraint per screen), savor.it (line geometry),
// podium.global (one choreographed scrub). Dark + gold, Archivo only, agency voice,
// ending on the kept "Let's create" circle. No two sections share a layout.
export default function AboutIndex() {
  return (
    <main id="main" className="about-experience on-media relative bg-[#050505] text-[#f5f1e6]">
      <CustomCursor />
      <ProgressRail />

      <IndexMasthead />
      <AgencyStatement />
      <CrewStrip />
      <WorkIndex />
      <ServicesLedger />
      <NumbersProof />
      <ContactCircle />
    </main>
  );
}
