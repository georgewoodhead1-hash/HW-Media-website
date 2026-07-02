import type { Metadata } from "next";
import V4 from "@/components/v4/V4";

export const metadata: Metadata = {
  title: "HW Media — V4",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V4 />;
}
