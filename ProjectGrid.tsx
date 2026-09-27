"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/content/site";
import TiltCard from "@/components/motion/TiltCard";

/** Badges are information, not controls, so they stay in the brown/ash half of
 *  the palette — lime is reserved for things you can actually act on. */
function badgeTone(badge: string) {
  if (badge === "Internship") return "border-tan/45 bg-tan/12 text-tan";
  if (badge === "Final-year thesis") return "border-glass-line-hi bg-glass text-bone";
  if (badge === "Co-authored paper") return "border-clay/70 bg-clay/25 text-tan";
  return "border-glass-line bg-glass text-bone-3";
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const still = useReducedMotion();

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2"
      initial={still ? undefined : "hidden"}
      whileInView={still ? undefined : "shown"}
      viewport={{ once: true, margin: "-8%" }}
      variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
    >
      {projects.map((p) => (
        <motion.div
          key={p.slug}
          variants={{
            hidden: { opacity: 0, y: 26 },
            shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <TiltCard className="h-full rounded-2xl">
            <Link
              href={`/work/${p.slug}`}
              data-cursor-label="Open"
              className="glass flex h-full flex-col gap-4 rounded-2xl p-6 transition-colors hover:border-glass-line-hi"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase ${badgeTone(p.badge)}`}
                >
                  {p.badge}
                </span>
                <span className="font-mono text-[11px] text-bone-3">{p.year}</span>
                <span className="ml-auto font-mono text-bone-3 transition-transform group-hover:translate-x-1 group-hover:text-lime">
                  →
                </span>
              </div>

              <h3 className="text-xl leading-snug font-semibold tracking-tight text-bone">
                {p.title}
              </h3>

              {/* Hook, then description. They are grouped on a tighter gap than
                  the card's own, and the hook takes tan rather than bone, so it
                  reads as its own line and not as the first clause of the
                  summary. Tan because a headline is information — lime stays
                  reserved for things you can act on. */}
              <div className="flex flex-col gap-2">
                <p className="text-[13.5px] leading-snug font-medium text-tan">
                  {p.headline}
                </p>
                <p className="text-sm leading-relaxed text-bone-2">{p.summary}</p>
              </div>

              <ul className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-glass-line px-2 py-1 font-mono text-[10.5px] text-bone-3"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex gap-3 border-t border-glass-line pt-4">
                <span className="mt-0.5 shrink-0 font-mono text-[10px] tracking-wider text-tan uppercase">
                  Learned
                </span>
                <span className="text-[13px] leading-relaxed text-bone-2">{p.learned}</span>
              </div>
            </Link>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
