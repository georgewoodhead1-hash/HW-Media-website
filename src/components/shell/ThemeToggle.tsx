"use client";

import { useEffect, useState } from "react";

// Bottom-left mode toggle. One surface for the whole site: gold and red are
// constant, only the background/foreground contrast flips. Persisted.
export default function ThemeToggle() {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.mode;
    if (current === "light" || current === "dark") setMode(current);
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem("hwm-mode", next);
    } catch {
      /* private mode — fine */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      title={mode === "dark" ? "Light mode" : "Dark mode"}
      className="fixed left-[8.6rem] top-[1.05rem] z-50 flex h-8 w-8 items-center justify-center rounded-full text-[15px] leading-none text-[var(--gold)] transition-transform duration-300 hover:rotate-45 md:left-[11rem]"
      style={{ transitionTimingFunction: "var(--ease-expo)" }}
    >
      ☀
    </button>
  );
}
