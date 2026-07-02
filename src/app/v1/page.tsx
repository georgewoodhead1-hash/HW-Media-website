import type { Metadata } from "next";
import V1 from "@/components/v1/V1";

export const metadata: Metadata = {
  title: "HW Media — V1",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V1 />;
}
