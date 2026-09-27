"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A template re-mounts on every navigation, which is what makes it the right
 * place for a route transition — a layout would not re-run.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const still = useReducedMotion();
  if (still) return <>{children}</>;

  return (
    // Fade only. A y-translate here shifts the whole page, and since the hero
    // now sits flush under the nav that briefly exposes a strip of bare void
    // along the top edge on every load.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
