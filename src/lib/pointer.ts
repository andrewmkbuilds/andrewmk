/**
 * One pointer tracker for the whole app.
 *
 * Every pointer-driven surface (the custom cursor, the ambient pointer light)
 * subscribes here instead of attaching its own listener. A pointer move costs
 * one passive `pointermove` listener, one `requestAnimationFrame` batch and
 * one callback loop — never a React render per move.
 *
 * Cursor *state* (what the pointer is over) is resolved by a single delegated
 * `pointerover` listener writing `data-cursor` on <html>; CSS turns that into
 * the visual feedback. Components opt in with `data-cursor="view"` etc.
 */

export type CursorState =
  "default" | "link" | "view" | "grab" | "grabbing" | "cta";

type PointerCallback = (x: number, y: number) => void;

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

const subscribers = new Set<PointerCallback>();
let frame = 0;
let lastX = 0;
let lastY = 0;

function hasFinePointer() {
  return (
    typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches
  );
}

export function isFinePointer() {
  return hasFinePointer();
}

function flush() {
  frame = 0;
  for (const callback of subscribers) callback(lastX, lastY);
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType && event.pointerType !== "mouse") return;
  lastX = event.clientX;
  lastY = event.clientY;
  if (!frame) frame = requestAnimationFrame(flush);
}

/** Interaction state for the cursor, driven by delegation (no per-node listeners). */
function onPointerOver(event: PointerEvent) {
  const target = event.target as Element | null;
  if (!target || typeof target.closest !== "function") return;

  const host = target.closest<HTMLElement>("[data-cursor]");
  if (host) {
    setCursorState((host.dataset["cursor"] as CursorState) || "link");
    return;
  }
  if (target.closest("input, textarea, select, [contenteditable='true']")) {
    setCursorState("default");
    return;
  }
  if (target.closest("a, button, [role='button'], label, summary")) {
    setCursorState("link");
    return;
  }
  setCursorState("default");
}

function onPointerDown() {
  document.documentElement.dataset["cursorPress"] = "";
}

function onPointerUp() {
  delete document.documentElement.dataset["cursorPress"];
}

function onDocumentLeave() {
  document.documentElement.dataset["cursorOut"] = "";
}

function onDocumentEnter() {
  delete document.documentElement.dataset["cursorOut"];
}

/** Set the cursor state imperatively (e.g. while a card is being dragged). */
export function setCursorState(state: CursorState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (state === "default") delete root.dataset["cursor"];
  else root.dataset["cursor"] = state;
}

function start() {
  const root = document.documentElement;
  root.classList.add("cursor-custom");
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointercancel", onPointerUp, { passive: true });
  document.addEventListener("pointerleave", onDocumentLeave, { passive: true });
  document.addEventListener("pointerenter", onDocumentEnter, { passive: true });
}

function stop() {
  const root = document.documentElement;
  root.classList.remove("cursor-custom");
  delete root.dataset["cursor"];
  delete root.dataset["cursorPress"];
  delete root.dataset["cursorOut"];
  window.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerover", onPointerOver);
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("pointerup", onPointerUp);
  document.removeEventListener("pointercancel", onPointerUp);
  document.removeEventListener("pointerleave", onDocumentLeave);
  document.removeEventListener("pointerenter", onDocumentEnter);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/**
 * Subscribe to the batched pointer position. Returns an unsubscribe function.
 * The listener tree is only mounted while at least one subscriber exists and
 * the device actually has a fine pointer.
 */
export function subscribePointer(callback: PointerCallback): () => void {
  if (typeof window === "undefined") return () => {};

  const fine = hasFinePointer();
  subscribers.add(callback);
  if (fine && subscribers.size === 1) start();

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0 && fine) stop();
  };
}
