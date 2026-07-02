import LensIntro from "@/components/home/LensIntro";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import EditorFCP from "@/components/home/EditorFCP";
import Testimonials from "@/components/home/Testimonials";
import FeatureBand from "@/components/home/FeatureBand";
import FAQs from "@/components/home/FAQs";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import SceneFlow from "@/components/shell/SceneFlow";
import HomeB from "@/components/b/HomeB";

// TWO VARIANTS (George, 2026-07-02):
//  - :3005 (default)      → Variant A — the evolving 1820-feel build below.
//  - :3006 (HW_VARIANT=b) → Variant B — "The Strip", the no-rules rebuild.
// Variant B is also always reachable at /b on either port.
export default function Home() {
  if (process.env.HW_VARIANT === "b") return <HomeB />;
  return (
    <main>
      <SceneFlow />
      <LensIntro />
      <TrustedBy />
      <OurWork />
      <EditorFCP />
      <Testimonials />
      <FeatureBand />
      <FAQs />
      <WhirlwindGallery />
    </main>
  );
}
