/**
 * Lightweight, provider-agnostic analytics helper.
 *
 * Forwards a named event to whichever analytics provider happens to be present
 * (GA4 / GTM / Plausible / Umami) and always emits a DOM CustomEvent so any
 * future listener — or a local debugging session — can observe it.
 * Safe to call during SSR: it no-ops when `window` is unavailable.
 */

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

/** Canonical event names so call sites can't drift. */
export const AnalyticsEvents = {
  contactLinkClick: "contact_link_click",
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

interface AnalyticsWindow extends Window {
  gtag?: (command: string, eventName: string, params?: AnalyticsPayload) => void;
  dataLayer?: Array<Record<string, unknown>>;
  plausible?: (eventName: string, options?: { props?: AnalyticsPayload }) => void;
  umami?: { track?: (eventName: string, data?: AnalyticsPayload) => void };
}

export function trackEvent(name: AnalyticsEventName | string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const w = window as AnalyticsWindow;
  const props: AnalyticsPayload = {
    ...payload,
    page_path: window.location.pathname,
  };

  try {
    w.gtag?.("event", name, props);
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...props });
    w.plausible?.(name, { props });
    w.umami?.track?.(name, props);
    window.dispatchEvent(new CustomEvent("analytics", { detail: { name, props } }));

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[analytics]", name, props);
    }
  } catch {
    /* analytics must never break the UI */
  }
}
