import { useEffect, useRef } from "react";

interface Node {
  id: string;
  /** normalised 0..1 coordinates within the canvas */
  x: number;
  y: number;
  r: number;
  ring: number;
  label?: string;
  /** organic drift phase */
  phase: number;
  amp: number;
}

const NODES: Node[] = [
  { id: "Builder", x: 0.5, y: 0.5, r: 5.5, ring: 0, label: "Builder", phase: 0, amp: 2 },
  { id: "AI", x: 0.28, y: 0.26, r: 3.6, ring: 1, label: "AI", phase: 0.8, amp: 6 },
  { id: "Software", x: 0.74, y: 0.22, r: 3.6, ring: 1, label: "Software", phase: 1.9, amp: 7 },
  { id: "Robotics", x: 0.82, y: 0.58, r: 3.4, ring: 1, label: "Robotics", phase: 3.1, amp: 6 },
  { id: "Systems", x: 0.62, y: 0.82, r: 3.4, ring: 1, label: "Systems", phase: 4.2, amp: 7 },
  { id: "Product", x: 0.22, y: 0.7, r: 3.4, ring: 1, label: "Product", phase: 5.3, amp: 6 },
  { id: "Vision", x: 0.12, y: 0.44, r: 2.4, ring: 2, phase: 2.2, amp: 8 },
  { id: "Data", x: 0.44, y: 0.12, r: 2.2, ring: 2, phase: 0.4, amp: 8 },
  { id: "Automation", x: 0.9, y: 0.36, r: 2.2, ring: 2, phase: 3.7, amp: 9 },
  { id: "Web", x: 0.9, y: 0.8, r: 2.2, ring: 2, phase: 1.2, amp: 8 },
  { id: "Edge", x: 0.36, y: 0.92, r: 2.2, ring: 2, phase: 5.9, amp: 9 },
  { id: "Design", x: 0.08, y: 0.84, r: 2.2, ring: 2, phase: 4.8, amp: 8 },
];

const EDGES: [string, string][] = [
  ["Builder", "AI"],
  ["Builder", "Software"],
  ["Builder", "Robotics"],
  ["Builder", "Systems"],
  ["Builder", "Product"],
  ["AI", "Data"],
  ["AI", "Vision"],
  ["Software", "Web"],
  ["Software", "Automation"],
  ["Robotics", "Automation"],
  ["Systems", "Edge"],
  ["Product", "Design"],
  ["Product", "Vision"],
  ["Software", "AI"],
  ["Systems", "Robotics"],
];

interface Pulse {
  edge: number;
  t: number;
  speed: number;
}

/**
 * Hero "ecosystem" visualisation: a connected system of disciplines with
 * travelling signal pulses. Canvas-based (single GPU-friendly layer), pauses
 * when off-screen, renders a static composition under prefers-reduced-motion.
 */
export function SystemGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue("--primary").trim() || "hsl(205 82% 54%)";
    const glow = styles.getPropertyValue("--primary-glow").trim() || primary;
    const fg = styles.getPropertyValue("--muted-foreground").trim() || "hsl(213 15% 70%)";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let start = performance.now();

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
    const pulses: Pulse[] = EDGES.map((_, i) => ({
      edge: i,
      t: Math.random(),
      speed: 0.05 + Math.random() * 0.07,
    }));

    const index = new Map(NODES.map((n, i) => [n.id, i]));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const positions = (time: number) => {
      const depthX = (pointer.x - 0.5) * 26;
      const depthY = (pointer.y - 0.5) * 20;
      return NODES.map((n) => {
        const drift = reduce ? 0 : Math.sin(time * 0.00035 + n.phase) * n.amp;
        const drift2 = reduce ? 0 : Math.cos(time * 0.00028 + n.phase * 1.3) * n.amp * 0.6;
        const depth = n.ring === 0 ? 0.35 : n.ring === 1 ? 0.75 : 1.15;
        return {
          ...n,
          px: n.x * width + drift2 + depthX * depth,
          py: n.y * height + drift + depthY * depth,
        };
      });
    };

    const draw = (now: number) => {
      const time = now - start;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      const pts = positions(time);
      ctx.clearRect(0, 0, width, height);

      // edges
      EDGES.forEach(([a, b], i) => {
        const na = pts[index.get(a)!];
        const nb = pts[index.get(b)!];
        if (!na || !nb) return;
        const grad = ctx.createLinearGradient(na.px, na.py, nb.px, nb.py);
        grad.addColorStop(0, withAlpha(primary, na.ring === 0 ? 0.35 : 0.16));
        grad.addColorStop(1, withAlpha(primary, nb.ring === 2 ? 0.07 : 0.16));
        ctx.strokeStyle = grad;
        ctx.lineWidth = na.ring === 0 || nb.ring === 0 ? 1.1 : 0.75;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.stroke();

        // travelling pulse
        if (!reduce) {
          const p = pulses[i]!;
          p.t += p.speed * 0.016;
          if (p.t > 1) p.t -= 1;
          const ease = p.t;
          const px = na.px + (nb.px - na.px) * ease;
          const py = na.py + (nb.py - na.py) * ease;
          const fade = Math.sin(Math.PI * ease);
          ctx.fillStyle = withAlpha(glow, 0.7 * fade);
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // nodes
      pts.forEach((n) => {
        const pulse = reduce ? 0 : (Math.sin(time * 0.0016 + n.phase) + 1) / 2;
        const radius = n.r + (n.ring === 0 ? pulse * 1.2 : pulse * 0.4);

        if (n.ring === 0) {
          const halo = ctx.createRadialGradient(n.px, n.py, 0, n.px, n.py, 74);
          halo.addColorStop(0, withAlpha(primary, 0.22));
          halo.addColorStop(1, withAlpha(primary, 0));
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(n.px, n.py, 74, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = withAlpha(n.ring === 2 ? fg : primary, n.ring === 2 ? 0.45 : 0.95);
        ctx.beginPath();
        ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
        ctx.fill();

        if (n.ring <= 1) {
          ctx.strokeStyle = withAlpha(primary, 0.25 + pulse * 0.2);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.px, n.py, radius + 6 + (n.ring === 0 ? pulse * 5 : 0), 0, Math.PI * 2);
          ctx.stroke();
        }

        if (n.label && width > 380) {
          ctx.font = "500 10px 'JetBrains Mono', monospace";
          ctx.fillStyle = withAlpha(n.ring === 0 ? primary : fg, n.ring === 0 ? 0.95 : 0.7);
          ctx.textAlign = "center";
          ctx.fillText(n.label.toUpperCase(), n.px, n.py - radius - 12);
        }
      });

      if (!reduce && running) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      pointer.ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    };
    const onPointerLeave = () => {
      pointer.tx = 0.5;
      pointer.ty = 0.5;
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      start = performance.now() - 1200;
      raf = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduce) {
      draw(performance.now());
    } else {
      startLoop();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry?.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const parent = canvas.parentElement ?? canvas;
    parent.addEventListener("pointermove", onPointerMove);
    parent.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Abstract visualisation of Andrew's building ecosystem: AI, software, robotics, systems and product connected around a central node."
    />
  );
}

/** Accepts hsl()/oklch() CSS colour strings and applies an alpha channel. */
/** Applies an alpha channel to any CSS colour string. */
function withAlpha(color: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const [r, g, b] = toRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const rgbCache = new Map<string, [number, number, number]>();

/** Resolves any CSS colour string (hex, hsl, oklch, ...) to rgb triplets. */
function toRgb(color: string): [number, number, number] {
  const cached = rgbCache.get(color);
  if (cached) return cached;
  let out: [number, number, number] = [48, 181, 128];
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      out = [d[0] ?? 0, d[1] ?? 0, d[2] ?? 0];
    }
  } catch {
    /* keep fallback */
  }
  rgbCache.set(color, out);
  return out;
}
