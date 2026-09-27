import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Unbounded } from "next/font/google";
import { profile } from "@/content/site";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Cursor from "@/components/motion/Cursor";
import ScrollProgress from "@/components/motion/ScrollProgress";
import "./globals.css";

// Loaded as a *variable* font — no `weight` key — so the hero can animate the
// real 'wght' and 'wdth' axes under the cursor instead of faking it with scale.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

// Display face for the hero name. Swap this one import + variable if the
// letterforms are not right — nothing else in the site depends on it.
const signature = Unbounded({
  subsets: ["latin"],
  variable: "--font-signature-face",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.positioning,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.positioning,
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${signature.variable} ${mono.variable}`}
    >
      <head>
        {/* Scroll reveals prerender at opacity:0 and are un-hidden by JS. With
            JS disabled that would be a blank page, so force everything visible. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-void text-bone antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-lime focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-void"
        >
          Skip to content
        </a>
        <Cursor />
        <ScrollProgress />
        <div className="relative z-10">
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
