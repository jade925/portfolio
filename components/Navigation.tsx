"use client";

import TransitionLink from "@/components/TransitionLink";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isMenu   = pathname === "/menu";

  return (
    <nav className="flex items-center justify-between px-8 md:px-14 py-8 w-full">

      {/* Logo */}
      <TransitionLink
        href="/"
        style={{
          fontFamily   : "var(--font-londrina-solid)",
          fontWeight   : 900,
          fontSize     : "1.6rem",
          color        : "#A7C957",
          letterSpacing: "0.06em",
          lineHeight   : 1,
        }}
      >
        JADE L.
      </TransitionLink>

      {/* Bouton Menu / Fermer — rectangle entièrement transparent */}
      <TransitionLink
        href={isMenu ? "/" : "/menu"}
        style={{
          fontFamily   : "var(--font-poppins)",
          fontWeight   : 300,
          fontSize     : "0.95rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color        : "#232323",
          padding      : "12px 32px",
          background   : "transparent",
          border       : "none",
          cursor       : "pointer",
          transition   : "opacity 0.25s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.4")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {isMenu ? "Fermer" : "Menu"}
      </TransitionLink>
    </nav>
  );
}
