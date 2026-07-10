// Page-entrance gating (client final round): every page runs its own build-in
// choreography, but it must START only once the route transition has finished
// laying the new page over the old one — otherwise the animation plays while
// the sheet is still sliding and nobody sees it (the old About bug).
//
// RouteTransitions stamps <html data-transitioning="1"> when a blend is in
// flight and dispatches "hw:page-entered" when the sheet lands. Direct loads
// have no transition, so the callback runs on the next frame.

export function onPageEntered(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (document.documentElement.dataset.transitioning === "1") {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      window.removeEventListener("hw:page-entered", run);
      window.clearTimeout(safety);
      cb();
    };
    // safety: never leave a page hidden if the transition dies
    const safety = window.setTimeout(run, 2500);
    window.addEventListener("hw:page-entered", run, { once: true });
    return () => {
      done = true;
      window.removeEventListener("hw:page-entered", run);
      window.clearTimeout(safety);
    };
  }
  const raf = window.requestAnimationFrame(() => cb());
  return () => window.cancelAnimationFrame(raf);
}
