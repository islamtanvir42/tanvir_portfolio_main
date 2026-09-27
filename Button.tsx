"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useScrambleText } from "@/components/motion/Scramble";

/**
 * The site's only button. No magnetic pull — the interaction is an ink fill
 * that grows from the exact point the cursor crossed the edge, plus a label
 * that rolls over to a second copy of itself. Leaving re-seeds the origin from
 * the exit point, so the ink retreats the way the pointer went.
 *
 * Everything is a CSS transition on transform/colour, so it costs nothing per
 * frame, works from keyboard focus, and collapses to an instant state change
 * under prefers-reduced-motion (see the global rule in globals.css).
 */

type Variant = "primary" | "ghost" | "accent";

const SHELL: Record<Variant, string> = {
  primary:
    "bg-lime text-void hover:shadow-[0_10px_40px_-12px_rgba(191,242,60,0.55)] focus-visible:shadow-[0_10px_40px_-12px_rgba(191,242,60,0.55)]",
  ghost:
    "border border-glass-line text-bone-2 hover:border-lime hover:text-lime focus-visible:border-lime focus-visible:text-lime",
  accent:
    "border border-lime/30 text-lime hover:border-lime focus-visible:border-lime",
};

const INK: Record<Variant, string> = {
  primary: "bg-lime-hi",
  ghost: "bg-ash-2",
  accent: "bg-lime/12",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  size?: "sm" | "md";
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const [hot, setHot] = useState(false);

  // The rolling label decodes on the way in, so the button speaks the same
  // language as the headings. Only when the label is a plain string — anything
  // richer is left alone.
  const label = typeof children === "string" ? children : null;
  const scrambled = useScrambleText(label ?? "", hot && !still && !!label, 700);

  /** seed the ink origin from wherever the pointer crossed the edge */
  function seed(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
  }

  function enter(e: React.PointerEvent) {
    seed(e);
    if (e.pointerType === "mouse") setHot(true);
  }
  function leave(e: React.PointerEvent) {
    seed(e);
    setHot(false);
  }

  const pad = size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-6 py-3 text-[13px]";

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute aspect-square w-[280%] origin-center -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-focus-visible:scale-100 ${INK[variant]}`}
        style={{ left: "var(--fx, 50%)", top: "var(--fy, 50%)" }}
      />
      {/* One label, decoding in place. The old version rolled a second copy up
          behind the first, which meant two things moving at once and the
          decode reading as a stutter rather than a resolve. */}
      <span className="relative block whitespace-nowrap" aria-label={label ?? undefined}>
        <span aria-hidden={label ? "true" : undefined}>
          {label ? scrambled : children}
        </span>
      </span>
    </>
  );

  const shell = `group relative isolate inline-block overflow-hidden rounded-full font-mono font-medium transition-[color,border-color,box-shadow] duration-300 ${pad} ${SHELL[variant]} ${className}`;

  // internal routes go through the router; mailto/tel/external stay plain
  const internal = href.startsWith("/");

  if (internal) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onPointerEnter={enter}
        onPointerLeave={leave}
        data-cursor={variant === "primary" ? "dark" : undefined}
        className={shell}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      ref={ref as React.Ref<HTMLAnchorElement>}
      onPointerEnter={enter}
      onPointerLeave={leave}
      data-cursor={variant === "primary" ? "dark" : undefined}
      className={shell}
    >
      {content}
    </a>
  );
}
