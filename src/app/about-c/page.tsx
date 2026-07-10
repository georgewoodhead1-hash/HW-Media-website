import type { Metadata } from "next";
import AboutVarC from "@/components/about/variants/AboutVarC";

// Client review route — About redesign variant C. Not linked, not indexed.
export const metadata: Metadata = {
  title: "About — variant C",
  robots: { index: false, follow: false },
};

export default function AboutVariantC() {
  return <AboutVarC />;
}
