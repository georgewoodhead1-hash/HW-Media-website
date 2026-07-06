"use client";

import { ReactNode, useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// Route template. The old black wipe that lived here was fighting the real
// page transition (RouteTransitions' rise-from-below) — it blacked out the
// whole viewport on every navigation, which read as "loading two pages".
// Now it only re-measures the scroll triggers once the new page settles.
export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(id);
  }, []);

  return <>{children}</>;
}
