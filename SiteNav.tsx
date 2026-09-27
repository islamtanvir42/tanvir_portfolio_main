"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/content/site";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const links = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

/**
 * Not a bar. The old full-width stripe with a solid fill and a bottom border cut
 * the page in half and killed the atmosphere behind it.
 *
 * Instead: no background of its own, just a soft gradient scrim so type stays
 * legible while scrolling under it, with the links gathered into a floating
 * glass capsule. The brand sits on the container's left edge and the capsule
 * ends on its right edge, so the nav lines up exactly with every heading below.
 */
export default function SiteNav() {
  const path = usePathname();
  // At the very top the nav must disappear into the hero — a scrim sitting over
  // a static hero reads as a solid band. It only fades in once content is
  // actually passing underneath.
  const headerRef = useRef<HTMLElement>(null);
  const [lifted, setLifted] = useState(false);

  // The hero has to start *behind* this header, not below it, or the strip
  // above the hero stays flat void and the nav reads as a solid band. Publish
  // the measured height so the hero can pull itself up by exactly that much.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void via-void/75 to-transparent transition-opacity duration-500 ${lifted ? "opacity-100" : "opacity-0"}`}
      />

      <Container className="relative flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="group font-mono text-sm font-medium tracking-tight"
        >
          tanvir
          <span className="text-lime transition-opacity group-hover:opacity-60">.</span>
          islam
        </Link>

        <nav className="glass flex items-center gap-1 rounded-full p-1.5">
          {links.map((l) => {
            const active = path === l.href || path.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                  active ? "text-void" : "text-bone-2 hover:text-bone"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-lime"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {l.label}
              </Link>
            );
          })}

          <Button href={`mailto:${profile.email}`} variant="accent" size="sm">
            hire me
          </Button>
        </nav>
      </Container>
    </header>
  );
}
