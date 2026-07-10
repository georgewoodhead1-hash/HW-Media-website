"use client";

import { useEffect } from "react";

// Client final round: the site defaults to LIGHT mode, but the work pages
// stay dark only. Mount this on a page to force dark for its lifetime; on
// unmount the visitor's saved preference (or the light default) returns.
export default function ForceDark() {
  useEffect(() => {
    const prev = document.documentElement.dataset.mode;
    document.documentElement.dataset.mode = "dark";
    return () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem("hw-mode"); } catch {}
      document.documentElement.dataset.mode = saved ?? prev ?? "light";
    };
  }, []);
  return null;
}
