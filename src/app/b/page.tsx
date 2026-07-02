import type { Metadata } from "next";
import HomeB from "@/components/b/HomeB";

export const metadata: Metadata = {
  title: "HW Media — Variant B",
  robots: { index: false, follow: false },
};

// VARIANT B — "The Strip". Also served at the root of :3006 (HW_VARIANT=b).
export default function VariantB() {
  return <HomeB />;
}
