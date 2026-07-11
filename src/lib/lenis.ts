import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

// per-path scroll positions for back/forward restoration — written at the
// moment of leaving (click-time, before the transition resets scroll)
export const scrollMemory = new Map<string, number>();
// set by RouteTransitions just before router.push — lets SmoothScroll tell a
// CLICK navigation (land at top) from a back/forward TRAVERSAL (restore
// position). popstate can't do this: Next commits the traversal and runs
// effects BEFORE the popstate event is dispatched.
export const navIntent = { click: false };
