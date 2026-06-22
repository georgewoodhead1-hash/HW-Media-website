"use client";

import { useEffect, useState } from "react";

// Bottom-left mode toggle. Sits as a third item in the bottom-left row,
// to the right of the Instagram/LinkedIn social rail, on the same baseline.
// One surface for the whole site: gold and red are constant, only the
// background/foreground contrast flips. Persisted.
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

  const isDark = mode === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Light mode" : "Dark mode"}
      className="group fixed bottom-[5px] left-[88px] z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fg)]/30 bg-[var(--fg)]/[0.04] text-[var(--gold-text)] backdrop-blur-sm transition-colors duration-300 hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/10 md:bottom-[9px] md:left-[108px]"
      style={{ transitionTimingFunction: "var(--ease-expo)" }}
    >
      {isDark ? (
        // Sun — shown in dark mode (click to go light)
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-90"
          style={{ transitionTimingFunction: "var(--ease-expo)" }}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon — shown in light mode (click to go dark)
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-rotate-12"
          style={{ transitionTimingFunction: "var(--ease-expo)" }}
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
