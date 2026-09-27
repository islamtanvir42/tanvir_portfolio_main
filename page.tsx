import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import Reveal from "@/components/motion/Reveal";
import { Section, SectionHead } from "@/components/ui/Section";
import { projects, skills, experience, education } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      <Section id="work">
        <SectionHead
          index="01"
          label="Work"
          title="Things I have built"
          subtitle="Mostly university projects — that is what four years gets you. Each one says what it actually taught me."
        />

        <ProjectGrid projects={projects} />

        <Reveal className="mt-10">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-mono text-[13px] text-bone-2 transition-colors hover:text-lime"
          >
            All projects
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </Section>

      <Section id="journey">
        <SectionHead
          index="02"
          label="Journey"
          title="How I got here"
          subtitle="One internship, one degree, and the four years underneath it."
        />

        <div className="glass overflow-hidden rounded-2xl">
          {experience.map((e, i) => (
            <Reveal key={e.org} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-2 border-b border-glass-line p-6 sm:grid-cols-[150px_1fr] sm:gap-6">
                <span className="font-mono text-xs text-tan">{e.period}</span>
                <div>
                  <h3 className="font-semibold text-bone">
                    {e.role} <span className="text-bone-3">· {e.org}</span>
                  </h3>
                  <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-bone-2">
                    {e.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          {education.map((e, i) => (
            <Reveal key={e.qualification} delay={(experience.length + i) * 0.05}>
              <div className="grid grid-cols-1 gap-2 border-b border-glass-line p-6 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-6">
                <span className="font-mono text-xs text-tan">{e.period}</span>
                <div>
                  <h3 className="font-semibold text-bone">{e.qualification}</h3>
                  <p className="mt-1.5 text-sm text-bone-2">{e.institution}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="skills">
        <SectionHead
          index="03"
          label="Skills"
          title="What I work with"
          subtitle="Only what I have actually used — no wall of logos for things I read about once."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.group} delay={i * 0.06}>
              <div className="glass h-full rounded-2xl p-6">
                <p className="eyebrow mb-4">{s.group}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md border border-glass-line px-2.5 py-1.5 font-mono text-[11.5px] text-bone-2 transition-colors hover:border-lime hover:text-lime"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
