"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { safePlay } from "@/lib/video";

const ITEMS = [
  { href: "/work", label: "Work", loop: "/videos/loop-03.mp4" },
  { href: "/about", label: "About", loop: "/videos/loop-02.mp4" },
  { href: "/contact", label: "Contact", loop: "/videos/loop-05.mp4" },
];

export default function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState(0);
  const [clock, setClock] = useState("");

  // open/close animation + scroll lock
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      gsap.set(root, { display: "flex" });
      gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "expo.out" });
      gsap.fromTo(
        root.querySelectorAll(".menu-item"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "expo.out", delay: 0.08 },
      );
      safePlay(videoRef.current);
    } else {
      lenis?.start();
      videoRef.current?.pause();
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "expo.out",
        onComplete: () => gsap.set(root, { display: "none" }),
      });
    }
  }, [open]);

  // esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // london clock (call-sheet detail)
  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/London",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // swap preview loop
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !open) return;
    v.src = ITEMS[preview].loop;
    safePlay(v);
  }, [preview, open]);

  return (
    <div
      ref={rootRef}
      className="on-media fixed inset-0 z-[90] hidden flex-col bg-[#070705] px-5 pb-8 pt-24 opacity-0 md:px-10"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <button
        onClick={onClose}
        className="label-mono absolute right-5 top-5 px-2 py-2 text-[var(--paper-text)] transition-colors hover:text-[var(--gold)] md:right-10"
      >
        Close ✕
      </button>

      <div className="grid flex-1 items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <nav className="flex flex-col gap-2">
          {ITEMS.map((item, i) => (
            <div key={item.href} className="overflow-hidden">
              <div className="menu-item">
                <Link
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setPreview(i)}
                  className={`font-display display-lg flex items-baseline gap-5 transition-colors duration-300 ${
                    preview === i ? "text-[var(--paper-text)]" : "text-[var(--paper-text)]/35"
                  }`}
                >
                  <span className="label-mono w-8 shrink-0 text-[var(--gold)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </div>
            </div>
          ))}
        </nav>

        {/* film preview */}
        <div className="hidden overflow-hidden rounded-xl md:block">
          <video ref={videoRef} className="aspect-video w-full object-cover" muted loop playsInline />
        </div>
      </div>

      <div className="label-mono flex items-center justify-between border-t border-[var(--hairline-dark)] pt-5 opacity-70">
        <a href="mailto:harry@hwmedia.productions" className="hover:text-[var(--gold)]">
          harry@hwmedia.productions
        </a>
        <span className="hidden md:inline">London — {clock}</span>
        <a href="https://www.instagram.com/" className="hover:text-[var(--gold)]">
          Instagram
        </a>
      </div>
    </div>
  );
}
