"use client";

import Link from "next/link";
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

      {/* Bouton Menu / Fermer — glassmorphism, navigation directe sans overlay */}
      <Link
        href={isMenu ? "/" : "/menu"}
        style={{
          fontFamily          : "var(--font-poppins)",
          fontWeight          : 300,
          fontSize            : "0.85rem",
          letterSpacing       : "0.22em",
          textTransform       : "uppercase",
          color               : "#232323",
          padding             : "10px 28px",
          backdropFilter      : "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background          : "rgba(35,35,35,0.06)",
          border              : "1px solid rgba(35,35,35,0.15)",
          borderRadius        : "6px",
          transition          : "opacity 0.25s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {isMenu ? "Fermer" : "Menu"}
      </Link>
    </nav>
  );
}
