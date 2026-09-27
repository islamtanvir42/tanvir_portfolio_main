"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Glyph set is deliberately narrow-range: no I, l, 1, W or M. Wildly different
 * character widths are what made the earlier version thrash.
 */
export const GLYPHS = "ABCDEFGHKNOPQRSTUVXYZ0234568";

/**
 * Drives the decode. Progress comes from elapsed wall-clock time, not a tick
 * count — background tabs clamp timers to ~1Hz and counting ticks would strand
 * the text as gibberish.
 */
export function useScrambleText(text: string, active: boolean, duration = 900) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    const start = performance.now();
    const id = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / duration);
      const settled = Math.floor(p * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) =>
            i < settled || ch === " "
              ? ch
              : GLYPHS[(Math.random() * GLYPHS.length) | 0],
          )
          .join(""),
      );
      if (p >= 1) {
        setOut(text);
        window.clearInterval(id);
      }
    }, 34);

    return () => window.clearInterval(id);
  }, [active, text, duration]);

  return out;
}

/**
 * Decodes a heading out of noise when it scrolls into view.
 *
 * The smoothness problem on multi-line headings was reflow: scrambled glyphs are
 * not the width of the glyphs they stand in for, so the line breaks moved every
 * frame and the whole block juddered between one and two lines.
 *
 * Fix: while it animates, every word is rendered inside a box sized by the
 * *final* word — the noise is absolutely positioned inside that box and cannot
 * push anything. Line breaks are therefore the finished line breaks from the
 * first frame. Once it settles we drop back to plain text, which costs nothing
 * visually (the boxes were already the final widths) and restores real kerning.
 */
export default function Scramble({
  text,
  className,
  duration = 900,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  duration?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const still = useReducedMotion();

  const [running, setRunning] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    if (!inView || still || fired.current) return;
    fired.current = true;
    setRunning(true);
    const id = window.setTimeout(() => setRunning(false), duration + 80);
    return () => window.clearTimeout(id);
  }, [inView, still, duration]);

  const out = useScrambleText(text, running, duration);

  /** words with their offset into the flat string, so we can slice `out` */
  const words = useMemo(() => {
    const res: { text: string; start: number }[] = [];
    let i = 0;
    for (const w of text.split(" ")) {
      res.push({ text: w, start: i });
      i += w.length + 1;
    }
    return res;
  }, [text]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {!running
        ? text
        : words.map((w, wi) => (
            <Fragment key={wi}>
              <span className="relative inline-block whitespace-nowrap">
                {/* sizer: holds the finished width so nothing can reflow */}
                <span className="invisible">{w.text}</span>
                <span aria-hidden="true" className="absolute inset-y-0 left-0">
                  {out.slice(w.start, w.start + w.text.length)}
                </span>
              </span>
              {wi < words.length - 1 ? " " : null}
            </Fragment>
          ))}
    </Tag>
  );
}
