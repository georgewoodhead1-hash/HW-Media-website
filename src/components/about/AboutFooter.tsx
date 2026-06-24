"use client";

// Footer — the closing stamp. The brand restated as a monumental wordmark that
// bleeds off the edge, with the email + socials above it. Dark. (Email + social
// URLs are placeholders until George confirms the real ones.)
export default function AboutFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#050505] px-5 pb-12 pt-[16vh] text-[#f5f1e6] md:px-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <a data-cursor="Email" href="mailto:harry@hwmedia.co.uk" className="about-display text-[clamp(1.4rem,3vw,2.6rem)] transition-colors hover:text-[var(--gold-text)]" style={{ textTransform: "none" }}>
          harry@hwmedia.co.uk
        </a>
        <div className="about-label flex gap-6 text-[#f5f1e6]/60">
          <a data-cursor="Open" href="https://www.instagram.com/hwmedia/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--gold-text)]">Instagram</a>
          <a data-cursor="Open" href="https://vimeo.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--gold-text)]">Vimeo</a>
          <a data-cursor="Open" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--gold-text)]">LinkedIn</a>
        </div>
      </div>

      <h2 className="about-display mt-12 flex items-end whitespace-nowrap leading-[0.78] text-[#f5f1e6]" style={{ fontSize: "clamp(3.4rem,17vw,16rem)" }}>
        HW&nbsp;MEDIA
        <span className="mb-[0.1em] ml-[0.06em] inline-block aspect-square w-[0.1em] rounded-full" style={{ background: "var(--gold-text)" }} />
      </h2>

      <p className="about-label mt-8 text-[#f5f1e6]/40">© 2026 HW Media · London</p>
    </footer>
  );
}
