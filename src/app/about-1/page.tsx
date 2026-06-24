import type { Metadata } from "next";
import AboutIndex from "@/components/about/index/AboutIndex";

export const metadata: Metadata = {
  title: "HW Media — The crew (Version 1: The Index)",
  description: "Who's behind the camera. HW Media, a London creative agency and production company.",
};

// Version 1 of the rebuilt About page — "The Index" (editorial restraint).
export default function AboutVersionOne() {
  return <AboutIndex />;
}
