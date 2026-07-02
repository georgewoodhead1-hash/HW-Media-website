import type { Metadata } from "next";
import V3 from "@/components/v3/V3";

export const metadata: Metadata = {
  title: "HW Media — V3",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V3 />;
}
