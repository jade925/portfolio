"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about", label: "À propos" },
  { href: "/projects", label: "Projets" },
  { href: "mailto:jade.lelievre@gmail.com", label: "Contact", external: true },
];

export default function Navigation({ delay = 0 }: { delay?: number }) {
  const pathname = usePathname();

  return (
    <nav
      className="hero-enter flex items-center justify-between px-8 md:px-14 py-8 w-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-[#232323] tracking-[0.22em] uppercase text-xs font-light hover:opacity-60 transition-opacity"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        Jade Lelièvre
      </Link>

      {/* Links */}
      <ul className="flex items-center gap-8">
        {links.map(({ href, label, external }) => {
          const isActive = !external && pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-xs tracking-[0.18em] uppercase transition-all hover:opacity-60 ${
                  isActive ? "text-[#4A7C59]" : "text-[#232323]"
                }`}
                style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 300 }}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
