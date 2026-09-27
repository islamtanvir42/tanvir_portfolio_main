import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";

/**
 * One vertical rhythm for every section on the site. Sections were each
 * choosing their own padding, which is what made the gaps read as uneven —
 * there is now exactly one value and nothing overrides it.
 */
export function Section({
  children,
  id,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/**
 * The section marker. The index is the loud part — a lime numeral, a rule that
 * runs out to the label, then the title. The subtitle is not an afterthought
 * dropped to the right; it sits in its own column on a lime rule, bottom-aligned
 * with the title, so the two read as one composition at every breakpoint.
 */
export function SectionHead({
  index,
  label,
  title,
  subtitle,
  titleClassName = "",
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <Reveal className="mb-12 sm:mb-16">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-medium text-lime">{index}</span>
            <span className="h-px w-10 bg-lime/40" />
            <span className="font-mono text-[11px] tracking-[0.22em] text-bone-2 uppercase">
              {label}
            </span>
          </div>

          <Scramble
            as="h2"
            text={title}
            className={`mt-5 block text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[1.02] font-bold tracking-[-0.03em] ${titleClassName}`}
          />
        </div>

        {subtitle && (
          <div className="border-l border-lime/30 pl-5 md:col-span-5 md:pb-1.5">
            <p className="max-w-[38ch] text-[13.5px] leading-relaxed text-bone-2">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </Reveal>
  );
}
