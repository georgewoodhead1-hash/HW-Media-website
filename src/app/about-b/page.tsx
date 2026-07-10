import type { Metadata } from "next";
import AboutVarB from "@/components/about/variants/AboutVarB";

// Client review route — About redesign variant B. Not linked, not indexed.
export const metadata: Metadata = {
  title: "About — variant B",
  robots: { index: false, follow: false },
};

export default function AboutVariantB() {
  return <AboutVarB />;
}
