import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * jsdom implements no IntersectionObserver, and the reveal wrappers every
 * tested component renders call it on mount. A no-op observer keeps them
 * mountable: these tests assert markup and state, never reveal timing.
 */
class StubIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver =
    StubIntersectionObserver as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  cleanup();
});
