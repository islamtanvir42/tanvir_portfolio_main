"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useScrambleText } from "@/components/motion/Scramble";

/**
 * A terminal caret, not a dot-and-ring.
 *
 * The dot-with-trailing-circle is on every second portfolio, so this borrows
 * from the subject instead: the cursor is a blinking block caret, the thing you
 * actually see in a psql session. Over anything clickable it stops blinking,
 * squares up, and a prompt capsule types itself in behind — `› open`, decoded
 * with the same scramble the headings use.
 *
 * Only mounts for a fine pointer with motion allowed, and only then does it
 * hide the native cursor. Touch and reduced-motion visitors keep the system
 * cursor, which is also why every interactive element still sets
 * `cursor: pointer` in CSS.
 */
export default function Cursor() {
  const still = useReducedMotion();
  const [on, setOn] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  const [dark, setDark] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  // caret tracks exactly; the prompt lags on a spring so it reads as trailing
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const px = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 });
  const py = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 });

  const shown = useScrambleText(label || "", !!label, 260);

  useEffect(() => {
    if (still) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setOn(true);
    document.documentElement.classList.add("cursor-custom");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const over = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const hit = target.closest<HTMLElement>(
        "a,button,[data-cursor],[data-cursor-label]",
      );
      if (!hit) {
        setActive(false);
        setLabel("");
        setDark(false);
        return;
      }
      setActive(true);
      setLabel(hit.dataset.cursorLabel ?? "");
      setDark(hit.dataset.cursor === "dark");
    };

    const out = (e: PointerEvent) => {
      if (e.relatedTarget === null) setVisible(false);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    const blur = () => {
      setVisible(false);
      setDown(false);
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("blur", blur);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      window.removeEventListener("blur", blur);
    };
  }, [still, x, y]);

  if (!on) return null;

  const tone = dark ? "#0a0a0b" : "#bff23c";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      {/* prompt capsule — trails the caret, only when there is something to say */}
      <motion.div className="absolute top-0 left-0" style={{ x: px, y: py }}>
        <div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase transition-[opacity,transform] duration-300 ease-out"
          style={{
            color: tone,
            border: `1px solid ${tone}`,
            background: dark ? "rgba(191,242,60,0.92)" : "rgba(10,10,11,0.72)",
            backdropFilter: "blur(6px)",
            opacity: label ? 1 : 0,
            transform: `translate(16px, 14px) scale(${label ? 1 : 0.8})`,
          }}
        >
          <span style={{ opacity: 0.6 }}>›</span>
          {shown}
        </div>
      </motion.div>

      {/* the caret itself — exact position, no lag */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <div
          className={`rounded-[1px] ${active || down ? "" : "animate-[caret_1.1s_steps(1)_infinite]"}`}
          style={{
            background: tone,
            width: active ? 14 : 4,
            height: active ? 14 : 20,
            opacity: down ? 0.7 : 1,
            transform: `translate(-50%,-50%) rotate(${active ? 45 : 0}deg) scale(${down ? 0.75 : 1})`,
            transition:
              "width 260ms cubic-bezier(0.22,1,0.36,1), height 260ms cubic-bezier(0.22,1,0.36,1), transform 260ms cubic-bezier(0.22,1,0.36,1), opacity 150ms ease",
            boxShadow: dark ? "none" : `0 0 14px ${tone}66`,
          }}
        />
      </motion.div>

      <style>{`@keyframes caret{0%,55%{opacity:1}56%,100%{opacity:0}}`}</style>
    </div>
  );
}
