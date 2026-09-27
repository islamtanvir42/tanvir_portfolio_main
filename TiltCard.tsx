"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Pointer-tracking tilt plus a light that follows the cursor across the card.
 * Mouse only — a coarse pointer gets a plain card.
 */
export default function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  // built at the top level — a hook inside the conditional render below would
  // change hook order between renders
  const glow = useTransform(
    [px, py],
    ([gx, gy]: number[]) =>
      `radial-gradient(340px circle at ${gx * 100}% ${gy * 100}%, rgba(191,242,60,0.09), transparent 65%)`,
  );

  function move(e: React.PointerEvent) {
    if (still || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      style={still ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`group relative overflow-hidden ${className ?? ""}`}
    >
      {!still && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
      )}
      {children}
    </motion.div>
  );
}
