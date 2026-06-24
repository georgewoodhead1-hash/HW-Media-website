"use client";

import CustomCursor from "./CustomCursor";
import ProgressRail from "./luke/ProgressRail";
import LukeHero from "./luke/LukeHero";
import SelectedWork from "./luke/SelectedWork";
import HarryAbout from "./luke/HarryAbout";
import ContactCircle from "./ContactCircle";

// About — rebuilt FROM the Luke Baffait reference (not my own template). Tiny-intro
// hero, the work as a dimmed list with a live vertical preview, Harry as a
// statement + craft list, and the kept "Let's create" expanding circle. Dark +
// gold, Archivo only, scrubbed motion, a right-edge progress rail tying it together.
export default function AboutExperience() {
  return (
    <main className="about-experience on-media relative bg-[#050505] text-[#f5f1e6]">
      <CustomCursor />
      <ProgressRail />

      <LukeHero />
      <SelectedWork />
      <HarryAbout />
      <ContactCircle />
    </main>
  );
}
