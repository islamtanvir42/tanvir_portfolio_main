"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/content/site";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import KineticName from "@/components/motion/KineticName";
import StatusDot from "@/components/motion/StatusDot";
import Marquee from "@/components/motion/Marquee";
import InteractiveField from "@/components/motion/InteractiveField";

const STACK = [
  "PostgreSQL", "MySQL", "Oracle", "SQL", "Python",
  "FastAPI", "React", "PHP", "Java", "C++", "R", "Git",
];

const RISE = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0 },
};

export default function Hero() {
  const still = useReducedMotion();

  return (
    // the interactive ground lives here and nowhere else — `relative` and
    // `overflow-hidden` are what scope it to this section
    <section className="relative -mt-[var(--nav-h)] overflow-hidden pt-[calc(var(--nav-h)+3rem)] pb-20 sm:pt-[calc(var(--nav-h)+5rem)] sm:pb-28">
      <InteractiveField />

      <Container className="relative z-10">
        <motion.div
          initial={still ? undefined : "hidden"}
          animate={still ? undefined : "shown"}
          variants={{ shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          <motion.div
            variants={RISE}
            transition={{ duration: 0.5 }}
            className="glass inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-2"
          >
            <StatusDot />
            <span className="font-mono text-[11px] tracking-wide text-bone-2">
              Open to work · Dhaka, BD
            </span>
          </motion.div>

          {/* letters react to the cursor; the second word fills in as it passes */}
          <KineticName
            text={profile.name}
            className="font-signature mt-8 flex flex-wrap gap-x-[0.22em] text-[clamp(2.4rem,8.5vw,6.6rem)] leading-[0.98] tracking-[-0.03em] [font-weight:600] [perspective:900px]"
          />

          <motion.p
            variants={RISE}
            transition={{ duration: 0.6 }}
            className="mt-8 max-w-[30ch] text-[clamp(1.15rem,2.6vw,1.75rem)] leading-[1.3] font-medium tracking-tight text-bone"
          >
            {profile.positioning}
          </motion.p>

          <motion.p
            variants={RISE}
            transition={{ duration: 0.6 }}
            className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-bone-2"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            variants={RISE}
            transition={{ duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button href="/work">See what I built</Button>
            <Button href={`mailto:${profile.email}`} variant="ghost">
              Get in touch
            </Button>
          </motion.div>

          <motion.div variants={RISE} transition={{ duration: 0.6 }} className="mt-20">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-lime/40" />
              <span className="font-mono text-[11px] tracking-[0.22em] text-bone-3 uppercase">
                Working with
              </span>
            </div>
            <Marquee items={STACK} />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
