import type { Metadata } from "next";
import Footer from "@/components/shell/Footer";

export const metadata: Metadata = {
  title: "Contact — HW Media",
  description: "Start a project with HW Media. Brand films, documentary, photography — London.",
};

export default function Contact() {
  return (
    <>
    <main data-theme="dark" className="flex min-h-screen flex-col justify-center px-5 pb-[8vh] pt-40 md:px-10">
      <p className="label-mono mb-8 opacity-50">Contact</p>
      <h1 className="font-display display-xl">
        Have something <span className="font-accent text-[var(--gold)]">in mind?</span>
      </h1>
      <p className="mt-8 max-w-xl leading-relaxed text-[var(--paper-text)]/75">
        Tell us what you&apos;re making. We&apos;ll tell you exactly how we&apos;d
        film it: treatment, crew, days, cost. Straight answers from the people
        who&apos;ll be on set.
      </p>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <a href="mailto:harry@hwmedia.productions" className="group">
            <p className="label-mono mb-1 opacity-65">Email</p>
            <p className="text-2xl transition-colors group-hover:text-[var(--gold)] md:text-3xl">
              harry@hwmedia.productions
            </p>
          </a>
          <div className="mt-4">
            <p className="label-mono mb-1 opacity-65">Studio</p>
            <p className="text-2xl md:text-3xl">London</p>
          </div>
        </div>

        {/* v1 form: opens a pre-filled email — Resend/Notion wiring is Phase 2 */}
        <form
          className="flex flex-col gap-4"
          action="mailto:harry@hwmedia.productions"
          method="get"
        >
          <label className="label-mono opacity-65" htmlFor="subject">
            What&apos;s the story?
          </label>
          <input
            id="subject"
            name="subject"
            placeholder="Project / brand / idea"
            className="rounded-md border border-[var(--hairline-dark)] bg-transparent px-5 py-4 outline-none transition-colors focus:border-[var(--gold)]"
          />
          <label htmlFor="brief" className="label-mono mb-1 block opacity-60">Tell us about the project</label>
          <textarea id="brief"
            name="body"
            rows={6}
            placeholder="Tell us what you're making, timelines, budget if you have one."
            className="rounded-md border border-[var(--hairline-dark)] bg-transparent px-5 py-4 outline-none transition-colors focus:border-[var(--gold)]"
          />
          <button
            type="submit"
            className="label-mono lift-hover inline-block rounded-full bg-[var(--gold)] px-10 py-4 text-[#0a0a08] transition-colors duration-300 hover:bg-[#d7c476]"
          >
            Send it ⟶ ⟶
          </button>
          <p className="label-mono mt-3 text-[10px] opacity-65">
    This opens your email app. Prefer direct? harry@hwmedia.productions
  </p>
</form>
      </div>

      {/* FAQ — people (and AI search) ask in questions now */}
      <div className="mt-28 max-w-3xl">
        <p className="label-mono mb-8 opacity-50">Quick answers</p>
        {[
          ["How much does a film cost?", "It depends on days, crew and post. Tell us the brief and you'll get a clear number with a full breakdown, usually within 48 hours. No surprises later."],
          ["How long does a project take?", "A brand film is typically 3 to 6 weeks from brief to delivery. Live events can be same-day. Documentaries take as long as the story needs."],
          ["Do you travel?", "Yes. London is home, but we film wherever the story is: salt flats, mountains, factory floors. Travel is planned and priced up front."],
          ["What do we actually get?", "Masters plus every cutdown and format your channels need, properly finished. Stills from set if you want them. The lot, delivered organised."],
        ].map(([q, a]) => (
          <details key={q} className="group border-t border-[var(--hairline-dark)] py-6 last:border-b">
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6">
              <span className="font-display text-xl md:text-2xl">{q}</span>
              <span className="label-mono text-[var(--gold)] transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--paper-text)]/75">{a}</p>
          </details>
        ))}
      </div>
    </main>
    <Footer />
    </>
  );
}
