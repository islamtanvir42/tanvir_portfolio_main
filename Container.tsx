import type { ReactNode } from "react";

/**
 * The single content measure for the whole site — nav, every page, footer.
 *
 * Alignment was drifting because pages picked their own max-width (some 6xl,
 * some 5xl) while the nav used another. Everything goes through here now, so
 * the brand in the nav sits on the same vertical line as the first character of
 * every heading below it. If a page needs a narrower column, narrow the *inner*
 * element — never this.
 */
export default function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "header" | "footer" | "section" | "nav";
}) {
  return (
    <Tag className={`mx-auto w-full max-w-6xl px-6 sm:px-10 ${className}`}>
      {children}
    </Tag>
  );
}
