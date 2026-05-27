"use client";

import Navigation from "@/components/Navigation";
import TransitionLink from "@/components/TransitionLink";

const links = [
  { href: "/about",    label: "À propos"    },
  { href: "/projects", label: "Mes projets" },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#F5F2ED" }}>
      <Navigation />

      <div className="flex-1 flex flex-col justify-center px-8 md:px-14">
        <ul className="flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <li key={href}>
              <TransitionLink
                href={href}
                style={{
                  fontFamily   : "var(--font-londrina-solid)",
                  fontWeight   : 900,
                  fontSize     : "clamp(3.5rem, 10vw, 9rem)",
                  lineHeight   : 1.05,
                  color        : "#232323",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                  display      : "block",
                  transition   : "filter 0.3s ease, opacity 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter  = "blur(6px)";
                  e.currentTarget.style.opacity = "0.5";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter  = "blur(0px)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
