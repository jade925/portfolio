"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";

const W1 = ["J", "A", "D", "E"];
const W2 = ["L", "E", "L", "I", "E", "V", "R", "E"];
const TOTAL = W1.length + W2.length; // 12 lettres

export default function Hero({ loaded }: { loaded: boolean }) {
  const [visible, setVisible] = useState(false);

  /* ── Refs lettres pour manipulation DOM directe ── */
  const letterRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseTarget = useRef(0.5);   // position souris cible  (0 = gauche, 1 = droite)
  const mouseCurrent = useRef(0.5);  // position lissée (lerp)
  const rafId = useRef<number | undefined>(undefined);

  /* ── Effet perspective basé sur position souris ──────────────────────────
     Quand souris à gauche  → lettres gauche petites,  lettres droite grandes
     Quand souris à droite  → lettres droite petites,  lettres gauche grandes
     Quand souris au centre → aucun changement (direction = 0)
     ──────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.current = e.clientX / window.innerWidth;
    };

    const tick = () => {
      /* Lerp fluide vers la position cible */
      mouseCurrent.current += (mouseTarget.current - mouseCurrent.current) * 0.07;

      const direction = (mouseCurrent.current - 0.5) * 2; // -1 à +1
      const MAX_EFFECT = 1.0; // amplitude max : scale 0.5 à 1.5 aux extrêmes

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        /* Normalise la position de la lettre : 0 = gauche, 1 = droite */
        const letterNorm = i / (TOTAL - 1);
        /* Position relative au centre : -0.5 à +0.5 */
        const letterPos  = letterNorm - 0.5;
        /* Scale uniforme (largeur + hauteur) — comme sur juanmora.co
           Souris opposée → lettre grandit | Souris même côté → lettre rétrécit */
        const scale = 1 - letterPos * direction * MAX_EFFECT;
        const s = Math.max(0.4, Math.min(1.8, scale)).toFixed(3);
        el.style.transform     = `scale(${s})`;
        /* Croissance vers le haut (texte collé en bas de page) */
        el.style.transformOrigin = "center bottom";
      });

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* Fade-in quand le hero apparaît */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, [loaded]);

  const fade = (delay = 0): React.CSSProperties => ({
    opacity   : visible ? 1 : 0,
    transform : visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundImage: "url('/photo-hero.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* ── Navigation ── */}
      <nav
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-14 py-8"
        style={{ zIndex: 10, ...fade(0) }}
      >
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

        {/* Bouton Menu — rectangle entièrement transparent */}
        <TransitionLink
          href="/menu"
          style={{
            fontFamily   : "var(--font-poppins)",
            fontWeight   : 300,
            fontSize     : "0.95rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color        : "#F5F2ED",
            padding      : "12px 32px",
            background   : "transparent",
            border       : "none",
            cursor       : "pointer",
            transition   : "opacity 0.25s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Menu
        </TransitionLink>
      </nav>

      {/* ── "Communication & Création Design" — milieu-haut gauche ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "3rem", top: "25%", zIndex: 5, ...fade(200) }}
      >
        <p style={{
          fontFamily   : "var(--font-londrina-solid)",
          fontWeight   : 400,
          fontSize     : "2rem",
          lineHeight   : 1.2,
          color        : "#A7C957",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}>
          Communication &amp;<br />Création Design
        </p>
      </div>

      {/* ── Espace flexible ── */}
      <div className="flex-1" style={{ zIndex: 2 }} />

      {/* ── JADE LELIEVRE — effet perspective souris par lettre ── */}
      <div style={{ position: "relative", zIndex: 2, ...fade(100) }}>
        <h1 className="hero-name" style={{ color: "#A7C957" }}>
          {W1.map((l, i) => (
            <span
              key={`w1-${i}`}
              ref={el => { letterRefs.current[i] = el; }}
              style={{ display: "inline-block" }}
            >
              {l}
            </span>
          ))}
          {/* Espace entre prénom et nom */}
          <span style={{ display: "inline-block", width: "0.3em" }} />
          {W2.map((l, i) => (
            <span
              key={`w2-${i}`}
              ref={el => { letterRefs.current[W1.length + i] = el; }}
              style={{ display: "inline-block" }}
            >
              {l}
            </span>
          ))}
        </h1>
      </div>

      {/* ── Barre inférieure ── */}
      <div
        className="flex items-center justify-between px-8 md:px-14 py-6"
        style={{ position: "relative", zIndex: 2, ...fade(200) }}
      >
        <div className="flex items-center gap-3">
          <div className="w-[1px] h-10 overflow-hidden" style={{ background: "rgba(245,242,237,0.25)" }}>
            <div className="w-full" style={{
              height   : "50%",
              background: "#A7C957",
              animation: visible ? "scrollPulse 2s ease-in-out 0.5s infinite" : "none",
            }} />
          </div>
          <span className="tracking-[0.25em] uppercase" style={{
            fontFamily: "var(--font-poppins)", fontWeight: 300,
            fontSize: "0.6rem", color: "rgba(245,242,237,0.55)",
          }}>
            Scroll
          </span>
        </div>
        <span className="tracking-[0.18em]" style={{
          fontFamily: "var(--font-poppins)", fontWeight: 300,
          fontSize: "0.6rem", color: "rgba(245,242,237,0.4)",
        }}>
          © 2025 Jade Lelièvre
        </span>
      </div>
    </section>
  );
}
