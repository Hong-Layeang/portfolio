export type PerfTier = "high" | "mid" | "low";

let cachedTier: PerfTier | null = null;

export function getPerfTier(): PerfTier {
  if (cachedTier) return cachedTier;

  if (typeof window === "undefined") {
    cachedTier = "low";
    return cachedTier;
  }

  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    "ontouchstart" in window;

  const cores = navigator.hardwareConcurrency ?? 2;
  const memoryGB = (navigator as any).deviceMemory ?? 2; // Chrome-only API

  if (isMobile || cores <= 2 || memoryGB <= 2) {
    cachedTier = "low";
  } else if (cores <= 4 || memoryGB <= 4) {
    cachedTier = "mid";
  } else {
    cachedTier = "high";
  }

  return cachedTier;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasPointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}
