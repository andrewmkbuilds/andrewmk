import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * EchoHeadline — one word that grows a 3D slab of its own copies as you
 * scroll, stacking out into a trail of echoes that fade with depth. The
 * browser does the 3D (one perspective per slab); the component only writes
 * custom properties on the track and the CSS composes them.
 *
 * Adapted from the supplied `EchoHeadline` demo, not copied:
 *
 * 1. **`motion/react`, no GSAP.** The site ships one animation library and
 *    the integration protocol forbids a second, so the scroll progress and
 *    the smoothing spring come from motion.
 * 2. **No light stage.** The demo paints `#ebebe9` and loads Switzer; here
 *    the slab speaks in the site's serif display voice and the echoes fade
 *    into the ambient navy room, so the section sits inside the existing 3D
 *    scene instead of on a page of its own.
 * 3. **No colour probing.** The site has a single dark ground, so the echo
 *    colour is a token mix (`--eh-ink` → `--eh-ground`) rather than walking
 *    the DOM for the first painted background.
 * 4. **No `useReducedMotion()`.** It resolves differently on the server;
 *    reduced motion comes from `useHydratedReducedMotion()` and leaves the
 *    word as one plain, unpinned headline.
 */

interface Geo {
  hw: number;
  hh: number;
  p: number;
  d: number;
  vy: number;
}

export interface EchoHeadlineProps {
  /** The word. One line, never wrapped. */
  text: string;
  /** Mono eyebrow on the bottom rail — real site copy, not invented. */
  eyebrow?: string;
  copies?: number;
  depth?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  fade?: "opacity" | "color";
  trigger?: "scrub" | "onEnter";
  /** Share of the track at the end where the finished slab holds. */
  hold?: number;
  /**
   * Section-header size: no sticky track, no scroll hint, and the slab plays
   * once when it scrolls into view. Same slab, same 3D, just a heading.
   */
  compact?: boolean;
  once?: boolean;
  /** Comma-separated breakpoints the effect stays off on. */
  disable?: string;
  className?: string;
}

// Camera distance as a multiple of the word's width, so a short word and a
// long one foreshorten the same way when they turn.
const PERSPECTIVE = 1.6;
// The vanishing point, in word heights above the word's centre: the echoes
// recede toward it, so the slab stacks out on top of the word.
const VANISH_LIFT = 1.2;
// Color mode: how far each end of the slab mixes toward the ground.
const FADE_NEAR = 30;
const FADE_FAR = 90;
// Opacity mode: geometric, because overlapping see-through layers add up.
const OPACITY_NEAR = 0.35;
const OPACITY_FAR = 0.02;
// Below this spread every echo sits inside the word's own outline.
const HIDE_BELOW = 0.002;
// onEnter: plays once when the word is well into view.
const ENTER_DUR = 1.6;
const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BREAKPOINTS: Record<string, string> = {
  mobile: "(max-width: 479px)",
  landscape: "(orientation: landscape) and (max-width: 767px)",
  tablet: "(max-width: 991px)",
  desktop: "(min-width: 992px)",
};

const em = (v: number) => `${v.toFixed(4)}em`;

function isDisabled(disable: string): boolean {
  if (!disable) return false;
  return disable.split(",").some((v) => {
    const q = BREAKPOINTS[v.trim()];
    return q ? window.matchMedia(q).matches : false;
  });
}

export function EchoHeadline({
  text,
  eyebrow,
  copies = 8,
  depth = 1,
  rotateX = 20,
  rotateY = 20,
  rotateZ = 0,
  fade = "opacity",
  trigger = "scrub",
  hold = 0.2,
  compact = false,
  once = false,
  disable = "",
  className,
}: EchoHeadlineProps) {
  const rootRef = useRef<HTMLElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const geoRef = useRef<Geo | null>(null);
  const revealedRef = useRef(false);

  const reduce = useHydratedReducedMotion();
  const [built, setBuilt] = useState(false);

  const copiesC = Math.min(20, Math.max(4, Math.round(Number(copies)) || 8));
  // The farthest echo ends at 1 / (1 + depth) of the word's size.
  const depthC = Math.min(5, Math.max(0.5, Number(depth) || 1));
  const rotXC = Math.min(80, Math.max(-80, Number(rotateX) || 0));
  const rotYC = Math.min(80, Math.max(-80, Number(rotateY) || 0));
  const rotZC = Math.min(180, Math.max(-180, Number(rotateZ) || 0));
  const fadeC = fade === "color" ? "color" : "opacity";
  // A compact header has no scroll track to scrub, so it always plays on
  // enter: one pass, then the finished slab holds.
  const triggerC = compact || trigger === "onEnter" ? "onEnter" : "scrub";
  const holdC = Math.min(0.6, Math.max(0, Number(hold) || 0));

  // Farthest first, so the nearest echo paints last and the word, after them
  // in the DOM, stays on top. Each echo knows its place in the slab; the CSS
  // turns that into its depth and tone.
  const echoes = useMemo(() => {
    const list: { i: number; style: CSSProperties }[] = [];
    for (let i = copiesC; i >= 1; i--) {
      const far = (i - 1) / (copiesC - 1);
      const base = { "--eh-i": (i / copiesC).toFixed(4) };
      list.push({
        i,
        style: (fadeC === "opacity"
          ? {
              ...base,
              opacity: OPACITY_NEAR * Math.pow(OPACITY_FAR / OPACITY_NEAR, far),
            }
          : {
              ...base,
              "--eh-fade": `${(FADE_NEAR + (FADE_FAR - FADE_NEAR) * far).toFixed(1)}%`,
            }) as CSSProperties,
      });
    }
    return list;
  }, [copiesC, fadeC]);

  // Scrub: the track's first (1 − hold) drives the slab, the rest holds it.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const scrubP = useTransform(scrollYProgress, [0, 1 - holdC], [0, 1]);
  const smoothP = useSpring(scrubP, {
    stiffness: 150,
    damping: 30,
    mass: 0.4,
  });
  const enterP = useMotionValue(0);
  const inView = useInView(wordRef, {
    margin: "0px 0px -35% 0px",
    once,
  });
  const progress = triggerC === "onEnter" ? enterP : smoothP;
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const slab = slabRef.current;
    if (!root || !slab) return;
    // All in em: the word never wraps, so its size in em holds at any width.
    const fs = parseFloat(getComputedStyle(slab).fontSize) || 100;
    const hw = slab.offsetWidth / fs / 2;
    const hh = slab.offsetHeight / fs / 2;
    const p = PERSPECTIVE * hw * 2;
    const d = depthC * p;
    const vy = -VANISH_LIFT * hh * 2;
    geoRef.current = { hw, hh, p, d, vy };
    root.style.setProperty("--eh-perspective", em(p));
    root.style.setProperty("--eh-depth", em(d));
    root.style.setProperty("--eh-vanish", `50% calc(50% + ${em(vy)})`);
  }, [depthC]);

  // One progress drives the turn and the extrusion together; the browser
  // does the 3D, so the slab moves as one solid object, never a stagger.
  const renderFrame = useCallback(
    (s: number) => {
      const root = rootRef.current;
      const geo = geoRef.current;
      if (!root || !geo) return;

      root.style.setProperty("--eh-rx", `${(rotXC * s).toFixed(3)}deg`);
      root.style.setProperty("--eh-ry", `${(rotYC * s).toFixed(3)}deg`);
      root.style.setProperty("--eh-rz", `${(rotZC * s).toFixed(3)}deg`);
      root.style.setProperty("--eh-reach", s.toFixed(4));

      // Project the word and the farthest echo at the current pose, the same
      // maths the browser runs, and shift the slab so both sit centred. At
      // rest the shift is zero, so the word starts dead centre.
      const { hw, hh, p, d, vy } = geo;
      const a = (rotXC * s * Math.PI) / 180;
      const b = (rotYC * s * Math.PI) / 180;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const z of [0, -d * s]) {
        for (const x of [-hw, hw]) {
          for (const y of [-hh, hh]) {
            const x1 = x * Math.cos(b) + z * Math.sin(b);
            const z1 = z * Math.cos(b) - x * Math.sin(b);
            const y2 = y * Math.cos(a) - z1 * Math.sin(a);
            const z2 = y * Math.sin(a) + z1 * Math.cos(a);
            const f = p / (p - z2);
            const sx = x1 * f;
            const sy = vy + (y2 - vy) * f;
            minX = Math.min(minX, sx);
            maxX = Math.max(maxX, sx);
            minY = Math.min(minY, sy);
            maxY = Math.max(maxY, sy);
          }
        }
      }

      root.style.setProperty(
        "--eh-shift",
        `${em(-(minX + maxX) / 2)}, ${em(-(minY + maxY) / 2)}`,
      );

      const show = s > HIDE_BELOW;
      if (show !== revealedRef.current) {
        revealedRef.current = show;
        root.classList.toggle("eh-is-revealed", show);
      }
    },
    [rotXC, rotYC, rotZC],
  );

  useMotionValueEvent(progress, "change", renderFrame);

  useEffect(() => {
    const root = rootRef.current;
    if (reduce || isDisabled(disable)) {
      setBuilt(false);
      return undefined;
    }
    setBuilt(true);
    measure();
    renderFrame(progress.get());

    // A late webfont changes the word's width; measure again once it lands.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled || !geoRef.current) return;
      measure();
      renderFrame(progress.get());
    });

    return () => {
      cancelled = true;
      revealedRef.current = false;
      root?.classList.remove("eh-is-revealed");
    };
  }, [reduce, disable, measure, renderFrame, progress]);

  useEffect(() => {
    if (!built || triggerC !== "onEnter") return undefined;
    const controls = animate(enterP, inView ? 1 : 0, {
      duration: ENTER_DUR,
      ease: ENTER_EASE,
    });
    return () => controls.stop();
  }, [built, triggerC, inView, enterP]);

  return (
    <section
      ref={rootRef}
      className={cn(
        "eh-headline",
        compact && "eh-is-compact",
        built && "eh-is-built",
        built && triggerC === "scrub" && "eh-is-scrub",
        className,
      )}
    >
      <div className="eh-stage">
        <div ref={slabRef} className="eh-slab">
          {echoes.map((echo) => (
            <span
              key={echo.i}
              className="eh-echo"
              aria-hidden="true"
              style={echo.style}
            >
              {text}
            </span>
          ))}
          <h2 ref={wordRef} className="eh-word">
            {text}
          </h2>
        </div>

        <div className="eh-rail">
          {eyebrow ? <p className="eh-eyebrow">{eyebrow}</p> : <span />}
          {built && !compact ? (
            <motion.p className="eh-hint" style={{ opacity: hintOpacity }}>
              Scroll
            </motion.p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
