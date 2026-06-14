// play() returns a promise that rejects when interrupted by a new load
// or pause(); swallowing it is correct for muted ambient loops.
export function safePlay(v: HTMLVideoElement | null): void {
  v?.play().catch(() => {});
}
