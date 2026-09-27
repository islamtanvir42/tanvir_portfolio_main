"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The "open to work" indicator.
 *
 * Two alignment rules, both learned the hard way:
 *
 * 1. The rings are drawn from the centre of a box that is the size of the
 *    *widest* ring, not the size of the dot. Sizing the box to the dot meant the
 *    rings bled past the pill's left edge and the whole thing read as misaligned.
 * 2. Rings start *and* end at opacity 0 so the loop seam is invisible, and two
 *    are offset by half a cycle so there is always one in flight.
 */

const RINGS = [
  { delay: 0, duration: 3.2 },
  { delay: 1.6, duration: 3.2 },
];

export default function StatusDot() {
  const still = useReducedMotion();

  return (
    // box is ring-sized (20px) and the dot is centred in it, so the rings expand
    // into space the layout has already reserved
    <span className="relative grid h-5 w-5 shrink-0 place-items-center">
      {!still &&
        RINGS.map((r) => (
          <motion.span
            key={r.delay}
            className="col-start-1 row-start-1 h-2 w-2 rounded-full border border-lime"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.8, 2.5], opacity: [0, 0.55, 0] }}
            transition={{
              duration: r.duration,
              delay: r.delay,
              repeat: Infinity,
              ease: "easeOut",
              times: [0, 0.35, 1],
            }}
          />
        ))}

      <motion.span
        className="col-start-1 row-start-1 h-2 w-2 rounded-full bg-lime"
        animate={
          still
            ? undefined
            : {
                opacity: [1, 0.62, 1],
                boxShadow: [
                  "0 0 0px rgba(191,242,60,0.5)",
                  "0 0 10px rgba(191,242,60,0.5)",
                  "0 0 0px rgba(191,242,60,0.5)",
                ],
              }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}
