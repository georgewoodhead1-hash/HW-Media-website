import type { Metadata } from "next";
import AboutReel from "@/components/about/reel/AboutReel";
import SiteIntro from "@/components/shell/SiteIntro";

export const metadata: Metadata = {
  title: "About — HW Media",
  description: "Who's behind the camera. HW Media, a London creative agency and production company.",
};

// About — rehauled to the cinematic "Reel" direction (matches the dark home): a
// full-screen showreel cold open, the statement over footage, the crew held one
// face at a time, the films full-bleed and moving, a client-wall breather, into
// the kept "Let's create". An "About us" intro beat wipes up to it.
export default function About() {
  return (
    <>
      <SiteIntro words={["About", "us"]} />
      <AboutReel />
    </>
  );
}
