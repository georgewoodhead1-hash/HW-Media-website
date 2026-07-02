// V1 "1820" grammar atoms — the typographic system the whole variant speaks:
// plus-hairlines with labels sitting ON the rule, [ brackets ] that spread on
// hover, tiny tracked labels. Gold lives ONLY on full stops.

import type { CSSProperties, ReactNode } from "react";

export const FIRMA: CSSProperties = { fontFamily: "var(--font-firma), sans-serif" };

/** Tiny tracked label — the only "small" voice on the page. */
export function Tiny({
  children,
  dim = true,
  className = "",
}: {
  children: ReactNode;
  dim?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`text-[11px] uppercase tracking-[0.26em] ${dim ? "text-[#f5f1e6]/55" : "text-[#f5f1e6]/85"} ${className}`}
      style={FIRMA}
    >
      {children}
    </span>
  );
}

/**
 * The 1820 label-on-hairline: a full-width 1px rule with `+` marks at both
 * ends and an optional tiny label sitting in the middle of the line. Both
 * line segments draw outward from the label (centre-out) via .v1-seg-l/r,
 * the plus marks spin in via .v1-plus — all choreographed in V1.tsx.
 */
export function PlusRule({ label }: { label?: string }) {
  return (
    <div className="v1-rule flex items-center" aria-hidden>
      <span className="v1-plus text-[15px] leading-none text-[#f5f1e6]/55" style={FIRMA}>
        +
      </span>
      <span className="v1-seg-l ml-3 block h-px flex-1 origin-right bg-[#f5f1e6]/30" />
      {label && (
        <span className="v1-lab shrink-0 px-4">
          <Tiny>{label}</Tiny>
        </span>
      )}
      <span className="v1-seg-r mr-3 block h-px flex-1 origin-left bg-[#f5f1e6]/30" />
      <span className="v1-plus text-[15px] leading-none text-[#f5f1e6]/55" style={FIRMA}>
        +
      </span>
    </div>
  );
}

/**
 * [ Bracketed ] interactive text. Brackets spread and brighten on hover of
 * the nearest `group` (add `group` to the parent link/button).
 */
export function Brackets({
  children,
  className = "",
  gapClass = "mx-[0.45em]",
  spreadL = "group-hover:-translate-x-[0.4em]",
  spreadR = "group-hover:translate-x-[0.4em]",
}: {
  children: ReactNode;
  className?: string;
  /** horizontal breathing room between brackets and text — tighten on huge type */
  gapClass?: string;
  /** hover spread distance per side — reduce on huge type near page edges */
  spreadL?: string;
  spreadR?: string;
}) {
  // NOTE: container stays `inline` so long labels wrap like normal text on
  // narrow viewports; only the bracket glyphs are inline-block (transforms
  // don't apply to non-replaced inline elements).
  return (
    <span className={className}>
      <span
        aria-hidden
        className={`inline-block translate-x-0 text-[#f5f1e6]/45 transition-all duration-500 ease-out group-hover:text-[#f5f1e6]/90 ${spreadL}`}
      >
        [
      </span>
      <span className={`${gapClass} transition-colors duration-500`}>{children}</span>
      <span
        aria-hidden
        className={`inline-block translate-x-0 text-[#f5f1e6]/45 transition-all duration-500 ease-out group-hover:text-[#f5f1e6]/90 ${spreadR}`}
      >
        ]
      </span>
    </span>
  );
}

/** Gold full stop — the single permitted accent. */
export function Stop({ ghost = false }: { ghost?: boolean }) {
  return <span className={ghost ? "text-[var(--gold-text)]/40" : "text-[var(--gold-text)]"}>.</span>;
}
