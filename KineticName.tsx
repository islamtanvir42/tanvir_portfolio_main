"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * The hero name as a field of individually reactive letters.
 *
 * Set in Unbounded — a display face with actual personality, which the name is the
 * one place on the site that earns. The letters carry a gradient that runs warm
 * across the whole name (bone → tan → lime), and proximity to the cursor drives
 * the real 'wght' axis plus a lift, so the type thickens and brightens toward
 * lime exactly where you are pointing.
 *
 * No outline treatment — a hollow word read as unfinished rather than as a
 * device, so both words are solid and the gradient does the work instead.
 *
 * The reactive pass writes styles directly in one rAF loop rather than through
 * per-letter springs: eleven elements, one pass, no React work per frame. The
 * entrance animation lives on a separate wrapper element so the two never write
 * the same transform.
 */

const RADIUS = 200; // px of influence around the pointer
const EASE_IN = 0.18; // per-frame approach to the target influence

const BONE = [236, 236, 231] as const;
const TAN = [210, 162, 115] as const;
const LIME = [191, 242, 60] as const;

const lerp = (a: readonly number[], b: readonly number[], t: number) =>
  [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ] as const;

const rgb = (c: readonly number[]) =>
  `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

/** the resting gradient across the name: bone → tan → lime */
function baseAt(t: number) {
  return t < 0.55 ? lerp(BONE, TAN, t / 0.55) : lerp(TAN, LIME, (t - 0.55) / 0.45);
}

const LETTER_IN = {
  hidden: { opacity: 0, y: "0.42em", rotateX: -62 },
  shown: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function KineticName({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const still = useReducedMotion();
  const root = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (still) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const host = root.current;
    if (!host) return;

    const letters = Array.from(host.querySelectorAll<HTMLElement>("[data-kn]"));
    if (!letters.length) return;

    const cx = new Float64Array(letters.length);
    const cy = new Float64Array(letters.length);
    const cur = new Float64Array(letters.length);
    const target = new Float64Array(letters.length);
    // resting colour per letter, precomputed from its place in the name
    const base = letters.map((_, i) =>
      baseAt(letters.length > 1 ? i / (letters.length - 1) : 0),
    );

    let px = -9999;
    let py = -9999;
    let raf = 0;
    let measureRaf = 0;

    const measure = () => {
      measureRaf = 0;
      for (let i = 0; i < letters.length; i++) {
        const r = letters[i].getBoundingClientRect();
        cx[i] = r.left + r.width / 2;
        cy[i] = r.top + r.height / 2;
      }
    };
    const remeasure = () => {
      if (!measureRaf) measureRaf = requestAnimationFrame(measure);
    };

    const paint = (i: number, v: number) => {
      const el = letters[i];
      // Unbounded's real axis range is wght 200–900; it has no width axis, so
      // the opening-out is done with tracking instead.
      el.style.fontVariationSettings = `'wght' ${Math.round(600 + 300 * v)}`;
      el.style.letterSpacing = `${(v * 0.012).toFixed(4)}em`;
      el.style.transform = `translate3d(0,${(-10 * v).toFixed(2)}px,0)`;
      el.style.color = rgb(lerp(base[i], LIME, v));
      el.style.textShadow = v > 0.01 ? `0 0 ${(26 * v).toFixed(1)}px rgba(191,242,60,${(0.32 * v).toFixed(3)})` : "none";
    };

    const tick = () => {
      raf = 0;
      let busy = false;

      for (let i = 0; i < letters.length; i++) {
        const d = Math.hypot(cx[i] - px, cy[i] - py);
        const raw = d >= RADIUS ? 0 : 1 - d / RADIUS;
        target[i] = raw * raw * (3 - 2 * raw); // smoothstep

        const next = cur[i] + (target[i] - cur[i]) * EASE_IN;
        cur[i] = Math.abs(target[i] - next) < 0.002 ? target[i] : next;
        if (cur[i] !== target[i]) busy = true;
        paint(i, cur[i]);
      }

      if (busy) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (raf) return;
      // the loop was idle, so the letters may have moved since we last looked —
      // re-measure once per burst rather than reading layout every frame
      measure();
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      kick();
    };

    const leave = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        px = -9999;
        py = -9999;
        kick();
      }
    };

    // paint the resting gradient immediately, before any pointer arrives
    for (let i = 0; i < letters.length; i++) paint(i, 0);

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const settled = window.setTimeout(measure, 1400);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (measureRaf) cancelAnimationFrame(measureRaf);
      window.clearTimeout(settled);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
      for (const el of letters) el.style.cssText = "";
    };
  }, [still, text]);

  const words = text.split(" ");
  // flat index across the whole name so the gradient spans both words
  let n = -1;

  return (
    <motion.h1
      ref={root}
      aria-label={text}
      className={className}
      initial={still ? undefined : "hidden"}
      animate={still ? undefined : "shown"}
      variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
    >
      {words.map((word, wi) => (
        <motion.span
          key={`${word}-${wi}`}
          aria-hidden="true"
          className="inline-flex whitespace-nowrap"
          variants={{ shown: { transition: { staggerChildren: 0.035 } } }}
        >
          {Array.from(word).map((ch, ci) => {
            n += 1;
            const t = n;
            return (
              <motion.span
                key={`${ch}-${ci}`}
                variants={still ? undefined : LETTER_IN}
                className="inline-block [transform-style:preserve-3d]"
              >
                <span
                  data-kn={t}
                  // resting gradient for the no-JS / reduced-motion case
                  style={{ color: rgb(baseAt(words.join("").length > 1 ? t / (words.join("").length - 1) : 0)) }}
                  className="inline-block will-change-[transform,font-variation-settings]"
                >
                  {ch}
                </span>
              </motion.span>
            );
          })}
        </motion.span>
      ))}
    </motion.h1>
  );
}
