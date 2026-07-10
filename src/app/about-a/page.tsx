import type { Metadata } from "next";
import AboutVarA from "@/components/about/variants/AboutVarA";

// Client review route — About redesign variant A. Not linked, not indexed.
export const metadata: Metadata = {
  title: "About — variant A",
  robots: { index: false, follow: false },
};

export default function AboutVariantA() {
  return <AboutVarA />;
}
