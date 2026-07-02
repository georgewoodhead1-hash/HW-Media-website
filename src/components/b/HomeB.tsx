"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT B — "THE STRIP".
// The homepage is ONE piece of film pulled through a projector. Vertical scroll
// drives a giant horizontal filmstrip (sprocket holes and all) across a fixed
// stage. The opening showreel — "Break the ordinary." left, full screen —
// physically SHRINKS INTO FRAME ONE of the strip, and from then on everything
// (statement, featured films, trusted-by, process, testimonial, CTA) is a frame
// on the same object. The strip's speed skews it like real film under tension.
// When it runs out, the finale (kept) takes over. Nothing is a section; it is
// one continuous take.
// ─────────────────────────────────────────────────────────────────────────────

interface Frame {
  kind: "reel" | "title" | "film" | "logos" | "process" | "quote" | "cta";
  title?: string;
  sub?: string;
  clip?: string;
  slug?: string;
}

const FRAMES: Frame[] = [
  { kind: "reel" }, // the hero lands here
  { kind: "title", title: "FILMS PEOPLE CHOOSE TO WATCH." },
  { kind: "film", title: "OTOKO", clip: "/videos/films/otoko-w.mp4", slug: "otoko" },
  { kind: "film", title: "MCLAREN", clip: "/videos/films/mclaren-w.mp4", slug: "mclaren" },
  { kind: "film", title: "SALOMON", clip: "/videos/films/salomon-w.mp4", slug: "salomon" },
  { kind: "logos" },
  { kind: "film", title: "CASTLE AIR", clip: "/videos/films/castle-air-w.mp4", slug: "castle-air" },
  { kind: "process" },
  { kind: "quote", title: "The film outlived the campaign. Two years on we still open every pitch with it.", sub: "McLaren" },
  { kind: "cta" },
];

const LOGOS = ["aston-martin-white", "nike-white", "red-bull-7", "spotify-white", "defender-white", "salomon-logo-white"];
const STAGES = ["Pre-production", "Production", "Post-production", "In motion"];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (a: number, b: number, t: number) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// a row of sprocket holes — the thing that makes it FILM
function Sprockets() {
  return (
    <div aria-hidden className="flex h-[26px] items-center gap-[3.2vw] px-[1.6vw]">
      {Array.from({ length: 40 }, (_, i) => (
        <span key={i} className="h-[12px] w-[18px] shrink-0 rounded-[3px] bg-[#f5f1e6]/12" />
      ))}
    </div>
  );
}

export default function HomeB() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const strip = el.querySelector<HTMLElement>(".b-strip");
      const heroWrap = el.querySelector<HTMLElement>(".b-hero");
      const heroTitle = el.querySelector<HTMLElement>(".b-hero-title");
      const chrome = el.querySelector<HTMLElement>(".b-chrome");
      const line = el.querySelector<HTMLElement>(".b-line");
      const counter = el.querySelector<HTMLElement>(".b-count");
      const stage = el.querySelector<HTMLElement>(".b-stage");
      const vids = gsap.utils.toArray<HTMLVideoElement>("video", el);
      if (!strip || !heroWrap) return;

      // hero motto types on
      gsap.set(".b-char", { autoAlpha: 0 });
      gsap.to(".b-char", { autoAlpha: 1, duration: 0.01, stagger: 0.05, delay: 0.6, ease: "none" });
      gsap.from(".b-sub", { autoAlpha: 0, y: 18, duration: 0.8, delay: 2.2, ease: "power3.out" });

      // mouse parallax on the whole stage — the world breathes
      const qx = gsap.quickTo(stage, "x", { duration: 0.9, ease: "power3.out" });
      const qy = gsap.quickTo(stage, "y", { duration: 0.9, ease: "power3.out" });
      const onMouse = (e: MouseEvent) => {
        qx(((e.clientX / window.innerWidth) - 0.5) * -18);
        qy(((e.clientY / window.innerHeight) - 0.5) * -12);
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      let active = -1;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const vw = window.innerWidth;
          const vh = window.innerHeight;

          // PHASE 1 (0 → 0.1): the full-screen reel SHRINKS INTO FRAME ONE.
          const shrink = sm(0.0, 0.1, p);
          const frameW = Math.min(0.62 * vw, 1.7 * 0.56 * vh); // matches .b-frame size
          const frameH = frameW / 1.7;
          gsap.set(heroWrap, {
            width: lerp(vw, frameW, shrink),
            height: lerp(vh, frameH, shrink),
            x: lerp(0, 0.04 * vw, shrink),
            y: lerp(0, (vh - frameH) / 2, shrink),
            borderRadius: lerp(0, 10, shrink),
          });
          if (heroTitle) gsap.set(heroTitle, { autoAlpha: 1 - sm(0, 0.055, p), y: -sm(0, 0.08, p) * 60 });
          // hand off: once parked, the hero dissolves into frame one and the strip owns it
          gsap.set(heroWrap, { autoAlpha: 1 - sm(0.1, 0.135, p) });
          if (chrome) gsap.set(chrome, { autoAlpha: sm(0.055, 0.1, p) });

          // PHASE 2 (0.1 → 1): the strip is PULLED through the projector.
          const travel = sm(0.1, 1, p);
          const track = strip.scrollWidth - vw;
          gsap.set(strip, { x: -travel * track });

          // film-under-tension: velocity skews the strip
          const v = self.getVelocity();
          gsap.to(strip, { skewX: gsap.utils.clamp(-4, 4, v / -900), duration: 0.4, ease: "power2.out", overwrite: "auto" });

          // live line + frame counter
          if (line) gsap.set(line, { scaleX: p, transformOrigin: "left center" });
          const f = Math.min(FRAMES.length - 1, Math.floor(travel * FRAMES.length));
          if (f !== active && counter) {
            active = f;
            counter.textContent = String(f + 1).padStart(2, "0");
          }
        },
      });

      // play only the videos near the viewport
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) safePlay(v); else v.pause();
        }),
        { rootMargin: "30%" },
      );
      vids.forEach((v) => io.observe(v));

      return () => {
        st.kill();
        io.disconnect();
        window.removeEventListener("mousemove", onMouse);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#050505] text-[#f5f1e6]">
      {/* ——— THE STRIP: one pinned stage, 1000vh of pull ——— */}
      <section ref={rootRef} className="relative h-[1000vh]" aria-label="HW Media — one continuous take">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="b-stage h-full w-full will-change-transform">

            {/* chrome — live line + frame counter (fades in once the strip owns the screen) */}
            <div className="b-chrome absolute inset-x-0 top-0 z-40 px-5 pt-[10vh] opacity-0 md:px-10">
              <div className="relative h-px w-full bg-[#f5f1e6]/12">
                <span className="b-line absolute inset-0 origin-left bg-[#f5f1e6]/70" style={{ transform: "scaleX(0)" }} />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <span className="about-display text-[clamp(1.2rem,1.8vw,1.8rem)]">HW Media</span>
                <span className="about-display text-[clamp(1.2rem,1.8vw,1.8rem)] text-[#f5f1e6]/50">
                  <span className="b-count">01</span>&thinsp;/&thinsp;{String(FRAMES.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* THE FILMSTRIP */}
            <div className="b-strip absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center will-change-transform">
              <div className="flex flex-col gap-0">
                <Sprockets />
                <div className="flex items-stretch gap-[2vw] px-[4vw]">
                  {FRAMES.map((fr, i) => (
                    <div
                      key={i}
                      className="b-frame relative shrink-0 overflow-hidden rounded-[10px] border border-[#f5f1e6]/10 bg-[#0a0a09]"
                      style={{ width: "min(62vw, 95vh)", aspectRatio: "1.7" }}
                    >
                      {fr.kind === "reel" && (
                        // frame one IS the reel — the shrinking hero dissolves into it
                        <video
                          className="h-full w-full object-cover"
                          src="/videos/showreel-full.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          aria-hidden
                        />
                      )}
                      {fr.kind === "title" && (
                        <div className="flex h-full items-center justify-center px-[4vw] text-center">
                          <h2 className="font-display text-[clamp(2rem,4.6vw,4.6rem)] leading-[0.95]">
                            Films people choose to watch<span className="text-[var(--gold-text)]">.</span>
                          </h2>
                        </div>
                      )}
                      {fr.kind === "film" && (
                        <Link href={`/work/${fr.slug}`} className="group block h-full w-full">
                          <video
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            src={fr.clip}
                            poster={`/videos/films/posters/${fr.slug}-w.jpg`}
                            muted
                            loop
                            playsInline
                            preload="none"
                            aria-hidden
                          />
                          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <h3 className="font-display absolute bottom-6 left-7 text-[clamp(2rem,4.2vw,4.4rem)] leading-none">
                            {fr.title}
                          </h3>
                        </Link>
                      )}
                      {fr.kind === "logos" && (
                        <div className="flex h-full flex-col items-center justify-center gap-8">
                          <h3 className="about-display text-[clamp(1.4rem,2.4vw,2.4rem)] text-[#f5f1e6]/60">Trusted by</h3>
                          <div className="grid grid-cols-3 items-center justify-items-center gap-x-[4vw] gap-y-8 px-[4vw]">
                            {LOGOS.map((slug) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={slug} src={`/logos/${slug}.png`} alt={slug} className="max-h-[44px] max-w-[9vw] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100" />
                            ))}
                          </div>
                        </div>
                      )}
                      {fr.kind === "process" && (
                        <div className="flex h-full flex-col justify-center gap-4 px-[3.4vw]">
                          <h3 className="about-display mb-2 text-[clamp(1.4rem,2.4vw,2.4rem)] text-[#f5f1e6]/60">Our process</h3>
                          {STAGES.map((s, si) => (
                            <div key={s} className="flex items-baseline gap-5 border-t border-[#f5f1e6]/12 pt-3">
                              <span className="about-display text-[clamp(1rem,1.5vw,1.4rem)] text-[#f5f1e6]/45">0{si + 1}</span>
                              <span className="font-display text-[clamp(1.5rem,2.8vw,2.9rem)] leading-none">
                                {s}
                                {si === STAGES.length - 1 && <span className="text-[var(--gold-text)]">.</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {fr.kind === "quote" && (
                        <div className="flex h-full flex-col items-center justify-center gap-8 px-[4vw] text-center">
                          <p className="about-body text-[clamp(1.3rem,2.2vw,2.2rem)] leading-[1.35]">
                            <span className="text-[var(--gold-text)]">&ldquo;</span>{fr.title}<span className="text-[var(--gold-text)]">&rdquo;</span>
                          </p>
                          <span className="about-display text-[clamp(1rem,1.5vw,1.5rem)] text-[#f5f1e6]/55">{fr.sub}</span>
                        </div>
                      )}
                      {fr.kind === "cta" && (
                        <div className="flex h-full flex-col items-center justify-center gap-9 text-center">
                          <h3 className="font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-[0.95]">
                            Have a project in mind<span className="text-[var(--gold-text)]">?</span>
                          </h3>
                          <Link
                            href="/contact"
                            className="glass backdrop-blur-md backdrop-saturate-150 inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(15px,1.4vw,17px)] text-white"
                            style={{ fontFamily: "var(--font-firma), sans-serif" }}
                          >
                            Start here <span aria-hidden>⟶</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Sprockets />
              </div>
            </div>

            {/* THE HERO — full screen, "Break the ordinary." LEFT; shrinks into frame one */}
            <div className="b-hero absolute left-0 top-0 z-20 h-screen w-screen overflow-hidden">
              <video
                className="h-full w-full object-cover"
                src="/videos/showreel-full.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />
            </div>

            {/* hero type — its own layer so it can lift away while the reel shrinks */}
            <div className="b-hero-title pointer-events-none absolute left-0 top-[34%] z-30 px-5 mix-blend-difference md:px-10">
              <h1 className="font-display whitespace-nowrap text-[clamp(2.4rem,7vw,7.4rem)] leading-[0.9] text-white" aria-label="Break the ordinary.">
                {"Break the ordinary.".split("").map((c, i) => (
                  <span key={i} aria-hidden className="b-char inline-block whitespace-pre">{c}</span>
                ))}
              </h1>
              <p className="b-sub mt-10 uppercase tracking-[0.22em] text-white/85 text-[clamp(0.95rem,1.3vw,1.15rem)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                we go where the story is
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— THE FINALE (kept, untouched) ——— */}
      <WhirlwindGallery />
    </main>
  );
}
