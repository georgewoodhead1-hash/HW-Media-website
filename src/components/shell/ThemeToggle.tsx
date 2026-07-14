"use client";

import { useEffect, useState } from "react";

// Light/dark switch (George): a little upright rectangle with a knob that
// slides top (light) / bottom (dark). Dark is the default; the choice
// persists. Light mode = the cream canvas, near-black type.
export default function ThemeToggle() {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("hw-mode"); } catch {}
    if (saved === "light") {
      setMode("light");
      document.documentElement.dataset.mode = "light";
    }
  }, []);

  const flip = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.mode = next;
    try { localStorage.setItem("hw-mode", next); } catch {}
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      aria-pressed={mode === "light"}
      className="group relative ml-3 flex h-9 w-5 items-start justify-center rounded-full border border-[var(--gold-accent)]/60 p-[3px] transition-colors duration-300 hover:border-[var(--gold-accent)]"
    >
      <span
        className="block h-3.5 w-3 rounded-full bg-[var(--gold-accent)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: mode === "light" ? "translateY(0)" : "translateY(13px)" }}
      />
    </button>
  );
}
