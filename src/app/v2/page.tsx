import type { Metadata } from "next";
import V2 from "@/components/v2/V2";

export const metadata: Metadata = {
  title: "HW Media — V2",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2 />;
}
