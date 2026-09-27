"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * The hero's ground — and only the hero's. It used to be fixed to the viewport
 * and sat behind every section on every page, which flattened the rest of the
 * site. It is now absolutely positioned inside whatever it is dropped into
 * (give that parent `relative` and `overflow-hidden`) and fades out at the
 * bottom edge into the page.
 *
 * At rest: warm atmosphere and film grain, no geometry. The dot lattice exists
 * only within a radius of the cursor and is tinted tan at the rim to lime at
 * the centre — brown until you touch it, lime where you do.
 *
 * Cost control: the rAF loop runs only while something is still settling. A
 * stationary pointer leaves the last frame painted and burns nothing.
 */

const R = 230; // reveal radius, px
const SPACING = 30; // lattice pitch, px
const TAU = Math.PI * 2;

const EDGE = [210, 162, 115] as const; // tan, at the rim
const CORE = [191, 242, 60] as const; // lime, under the cursor

/** smoothstep — the linear falloff was the visible "edge" on the glow */
const smooth = (t: number) => t * t * (3 - 2 * t);

type FieldSpec = {
  box: string;
  paint: string;
  drift: { x: number[]; y: number[] };
  duration: number;
  depth: number;
};

const FIELDS: FieldSpec[] = [
  {
    box: "left-[-14%] top-[-30%] h-[78vh] w-[58vw]",
    paint: "bg-clay opacity-[0.13]",
    drift: { x: [0, 60, -26, 0], y: [0, 40, 20, 0] },
    duration: 32,
    depth: 22,
  },
  {
    box: "right-[-16%] top-[-18%] h-[70vh] w-[52vw]",
    paint: "bg-bark opacity-[0.30]",
    drift: { x: [0, -48, 28, 0], y: [0, 34, -20, 0] },
    duration: 39,
    depth: 14,
  },
  {
    box: "left-[34%] top-[36%] h-[52vh] w-[46vw]",
    paint: "bg-clay opacity-[0.07]",
    drift: { x: [0, 40, -40, 0], y: [0, -26, 26, 0] },
    duration: 46,
    depth: 30,
  },
];

function Field({
  spec,
  px,
  py,
  still,
}: {
  spec: FieldSpec;
  px: MotionValue<number>;
  py: MotionValue<number>;
  still: boolean | null;
}) {
  // outer element carries the pointer parallax, inner one the slow drift —
  // one transform each, so neither overwrites the other
  const x = useTransform(px, [-1, 1], [-spec.depth, spec.depth]);
  const y = useTransform(py, [-1, 1], [-spec.depth * 0.6, spec.depth * 0.6]);

  return (
    <motion.div className={`absolute ${spec.box}`} style={{ x, y }}>
      <motion.div
        className={`h-full w-full rounded-full blur-[130px] ${spec.paint}`}
        animate={spec.drift}
        transition={{
          duration: still ? 0 : spec.duration,
          repeat: still ? 0 : Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
      />
    </motion.div>
  );
}

export default function InteractiveField() {
  const still = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 38, damping: 22, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 38, damping: 22, mass: 0.7 });

  useEffect(() => {
    if (still) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!host || !canvas || !ctx) return;

    let w = 0;
    let h = 0;
    // cached so the pointer handler never forces layout
    let rect = host.getBoundingClientRect();

    const measure = () => {
      rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      kick();
    };

    let tx = 0;
    let ty = 0;
    let ex = 0;
    let ey = 0;
    let seen = false;
    let reveal = 0;
    let target = 0;
    let raf = 0;

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      if (reveal <= 0.004) return;

      // Four stops rather than two: a straight two-stop ramp banded visibly at
      // these low alphas and read as a hard-edged disc.
      const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, R * 1.75);
      glow.addColorStop(0, `rgba(191,242,60,${0.075 * reveal})`);
      glow.addColorStop(0.32, `rgba(191,242,60,${0.04 * reveal})`);
      glow.addColorStop(0.62, `rgba(184,150,90,${0.016 * reveal})`);
      glow.addColorStop(1, "rgba(191,242,60,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(ex - R * 1.75, ey - R * 1.75, R * 3.5, R * 3.5);

      const x0 = Math.floor((ex - R) / SPACING) * SPACING;
      const y0 = Math.floor((ey - R) / SPACING) * SPACING;

      for (let gx = x0; gx <= ex + R; gx += SPACING) {
        for (let gy = y0; gy <= ey + R; gy += SPACING) {
          const dx = gx - ex;
          const dy = gy - ey;
          const d = Math.hypot(dx, dy);
          if (d > R) continue;

          const s = smooth(1 - d / R); // 0 at the rim, 1 under the cursor
          const push = s * s * 16;
          const nx = d > 0.001 ? dx / d : 0;
          const ny = d > 0.001 ? dy / d : 0;

          const r = Math.round(EDGE[0] + (CORE[0] - EDGE[0]) * s);
          const g = Math.round(EDGE[1] + (CORE[1] - EDGE[1]) * s);
          const b = Math.round(EDGE[2] + (CORE[2] - EDGE[2]) * s);

          ctx.beginPath();
          ctx.fillStyle = `rgba(${r},${g},${b},${s * 0.42 * reveal})`;
          ctx.arc(gx + nx * push, gy + ny * push, 0.6 + s * 1.5, 0, TAU);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      raf = 0;
      reveal += (target - reveal) * 0.075;
      ex += (tx - ex) * 0.16;
      ey += (ty - ey) * 0.16;
      paint();

      const settled =
        Math.abs(target - reveal) < 0.002 &&
        Math.abs(tx - ex) < 0.35 &&
        Math.abs(ty - ey) < 0.35;

      if (!settled) {
        raf = requestAnimationFrame(tick);
      } else if (target === 0) {
        reveal = 0;
        ctx.clearRect(0, 0, w, h);
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      const inside = lx >= 0 && lx <= rect.width && ly >= 0 && ly <= rect.height;

      // the field belongs to the hero: outside it, retreat rather than follow
      if (!inside) {
        target = 0;
        kick();
        return;
      }

      tx = lx;
      ty = ly;
      if (!seen) {
        seen = true;
        ex = tx;
        ey = ty;
      }
      target = 1;
      px.set((lx / rect.width - 0.5) * 2);
      py.set((ly / rect.height - 0.5) * 2);
      kick();
    };

    const retreat = () => {
      target = 0;
      kick();
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", retreat);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", retreat);
    };
  }, [still, px, py]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {FIELDS.map((spec, i) => (
        <Field key={i} spec={spec} px={sx} py={sy} still={still} />
      ))}
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="grain absolute inset-0" />
      {/* dissolve into the page rather than stopping at a hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-void" />
    </div>
  );
}
