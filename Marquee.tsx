"use client";

import { motion, useReducedMotion } from "motion/react";

/** Seamless ticker: the list is rendered twice and translated by exactly -50%. */
export default function Marquee({ items }: { items: string[] }) {
  const still = useReducedMotion();
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]">
      <motion.ul
        className="flex w-max gap-3"
        animate={still ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((it, i) => (
          <li
            key={`${it}-${i}`}
            className="glass rounded-full px-4 py-2 font-mono text-xs whitespace-nowrap text-bone-2"
          >
            {it}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
