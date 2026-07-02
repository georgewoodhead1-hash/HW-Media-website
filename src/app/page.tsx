import LensIntro from "@/components/home/LensIntro";
import TrustedBy from "@/components/home/TrustedBy";
import OurWork from "@/components/home/OurWork";
import PlayReel from "@/components/home/PlayReel";
import EditorFCP from "@/components/home/EditorFCP";
import Testimonials from "@/components/home/Testimonials";
import FeatureBand from "@/components/home/FeatureBand";
import FAQs from "@/components/home/FAQs";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// Home: hero -> trusted by -> featured work -> process -> testimonials ->
// Defender band -> FAQs -> finale ("Every film is a chance to break the
// ordinary" is the finale AND the footer).
export default function Home() {
  return (
    <main>
      <LensIntro />
      <TrustedBy />
      <PlayReel />
      <OurWork />
      <EditorFCP />
      <Testimonials />
      <FeatureBand />
      <FAQs />
      <WhirlwindGallery />
    </main>
  );
}
