import Link from "next/link";
import { EMAIL } from "@/content/site";

// Site-wide footer (client feedback): HW logo, nav links, IG + LinkedIn,
// email only (no phone), copyright line, privacy link. Same on every page.

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-theme="dark"
      data-surface="page"
      className="relative z-10 border-t border-[var(--hairline-dark)] bg-[var(--bg)] px-5 py-14 text-[var(--fg)] md:px-10"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* logo + email — the real HW Media logo (gold), matching the nav. */}
        <div>
          <Link href="/" aria-label="HW Media — home" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/hwmedia-dark.png" alt="HW Media" className="h-14 w-auto" />
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-5 block font-[family-name:var(--font-firma)] text-[clamp(1.1rem,2vw,1.6rem)] font-medium leading-tight tracking-tight transition-colors hover:text-[var(--gold-text)]"
          >
            {EMAIL}
          </a>
        </div>

        {/* nav */}
        <nav className="flex flex-col gap-2">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="label-mono nav-link text-[11px] tracking-[0.18em]">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* socials */}
        <div className="flex items-center gap-5">
          <a href="https://www.instagram.com/hwmedia/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="opacity-70 transition-opacity hover:opacity-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/harry-wallis-98b47b161/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="opacity-70 transition-opacity hover:opacity-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5A2.49 2.49 0 1 1 5 8.48a2.49 2.49 0 0 1-.02-4.98zM3 9.75h4v10.75H3zM9.5 9.75h3.83v1.47h.05c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.79 2.6 4.79 5.98v5.25h-4v-4.65c0-1.11-.02-2.54-1.58-2.54-1.59 0-1.83 1.21-1.83 2.46v4.73h-4.04z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-[var(--hairline-dark)] pt-6 text-[11px] opacity-55 md:flex-row md:items-center md:justify-between">
        <span className="label-mono tracking-[0.18em]">© {year} HW MEDIA · LONDON</span>
        <Link href="/privacy" className="label-mono tracking-[0.18em] transition-colors hover:text-[var(--gold-text)]">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
