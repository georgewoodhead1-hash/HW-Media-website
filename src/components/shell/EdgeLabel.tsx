// The one element that rides the entire page: a Bennett-style micro
// label on the right edge. Quiet enough to forget, present enough to
// stitch the scenes. Dies at the B1 gate if George reads it as clutter.
export default function EdgeLabel() {
  return (
    <div
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      aria-hidden
    >
      <span className="label-mono block text-[9px] tracking-[0.32em] opacity-40 [writing-mode:vertical-rl]">
        HW MEDIA — LONDON — EST. 2018
      </span>
    </div>
  );
}
