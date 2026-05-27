"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation({ delay = 0 }: { delay?: number }) {
  const pathname = usePathname();
  const isMenu   = pathname === "/menu";

  return (
    <nav
      className="flex items-center justify-between px-8 md:px-14 py-8 w-full"
    >
      {/* Logo */}
      <Link
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
      </Link>

      {/* Bouton Menu / Fermer */}
      <Link
        href={isMenu ? "/" : "/menu"}
        className="block tracking-[0.2em] uppercase text-xs"
        style={{
          fontFamily  : "var(--font-poppins)",
          fontWeight  : 300,
          color       : "#232323",
          border      : "1px solid rgba(35,35,35,0.3)",
          borderRadius: "9999px",
          padding     : "9px 28px",
          transition  : "opacity 0.25s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {isMenu ? "Fermer" : "Menu"}
      </Link>
    </nav>
  );
}
