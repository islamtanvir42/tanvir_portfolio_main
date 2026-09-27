"use client";

import { usePathname } from "next/navigation";
import { profile } from "@/content/site";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { SectionHead } from "@/components/ui/Section";

const CHANNELS = [
  { label: "email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "phone", value: profile.phone, href: "tel:+8801740640605" },
  { label: "github", value: "github.com/islamtanvir42", href: profile.links.github },
  { label: "linkedin", value: "/in/tanvir-islam", href: profile.links.linkedin },
];

/**
 * The footer is in the root layout, so every page ends on it.
 *
 * About is the exception. It ran the full closing section — same heading, same
 * paragraph, same call to action as the homepage — which made the page end on
 * the site's ending rather than its own. There it gets a one-line sign-off
 * instead. The channel list stays on both: it is the only place GitHub and
 * LinkedIn appear anywhere on the site, and About is a page recruiters land on
 * directly.
 */
export default function SiteFooter() {
  const compact = usePathname() === "/about";

  return (
    <footer id="contact" className="pt-20 pb-10 sm:pt-28">
      <Container>
        {compact ? (
          <Reveal className="flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-glass-line pt-8">
            <p className="font-mono text-[13px] text-bone-2">{profile.signoff}</p>
            <a
              href={`mailto:${profile.email}`}
              data-cursor-label="Email"
              className="font-mono text-[13px] text-lime underline-offset-4 transition-colors hover:underline"
            >
              {profile.email}
            </a>
          </Reveal>
        ) : (
          <>
            {/* same marker and same decode as every other section — this one was
                the odd one out, static and differently labelled */}
            <SectionHead
              index="04"
              label="Contact"
              title="Let's build something together"
              subtitle={`${profile.seeking} If that sounds like a fit, or you just want to talk about databases, my inbox is open.`}
            />

            <Reveal>
              <Button href={`mailto:${profile.email}`}>{profile.email}</Button>
            </Reveal>
          </>
        )}

        <Reveal delay={0.08} className={compact ? "mt-10" : "mt-16"}>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-glass-line bg-glass-line sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((c) => (
              <div key={c.label} className="bg-void/60 p-5 backdrop-blur-xl">
                <dt className="eyebrow mb-1.5">{c.label}</dt>
                <dd>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-mono text-[12.5px] break-all text-bone-2 transition-colors hover:text-lime"
                  >
                    {c.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-glass-line pt-6">
          <p className="font-mono text-[11px] text-bone-3">
            © {new Date().getFullYear()} {profile.name} · Dhaka, Bangladesh
          </p>
          <p className="font-mono text-[11px] text-bone-3">
            References available on request
          </p>
        </div>
      </Container>
    </footer>
  );
}
