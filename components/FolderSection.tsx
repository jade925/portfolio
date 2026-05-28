"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

const G      = "#A7C957";
const G_DARK = "#8BBF3A";
const G_TAB  = "#7FA832";

/* ─────────────────────────────────────────────────────────────
   Dossier Mac — toutes les dimensions en em pour scaler avec
   le font-size parent (clamp 4.5rem→18rem identique au hero)
───────────────────────────────────────────────────────────── */
function MacFolder({
  open,
  mouseX,
  mouseY,
}: {
  open: boolean;
  mouseX: number;
  mouseY: number;
}) {
  const tiltZ  = (mouseX - 0.5) * 10;   // ±5 deg selon souris X
  const tiltTx = (mouseX - 0.5) * 0.07; // ±0.035 em
  const tiltTy = (mouseY - 0.5) * 0.04; // ±0.02 em

  /* Feuilles — les unes derrière les autres (stacked + tilt souris) */
  const paper = (
    rotZ  : number,  // deg de rotation de base
    tx    : number,  // translation X de base (em)
    delay : number,  // délai transition (ms)
    yOff  : number,  // décalage vertical "derrière" (em)
  ): React.CSSProperties => ({
    position      : "absolute",
    width         : "calc(1.2em - 0.16em)",
    height        : "calc(0.86em - 0.1em)",
    top           : `calc(0.12em + 0.05em + ${yOff}em)`,
    left          : "0.08em",
    background    : "#F9F8F4",
    borderRadius  : "0.03em",
    boxShadow     : "0 0.01em 0.05em rgba(0,0,0,0.09)",
    transform     : open
      ? `rotateZ(${rotZ + tiltZ * 0.22}deg) translateX(${tx + tiltTx}em) translateY(${tiltTy}em)`
      : "rotateZ(0deg) translateX(0em) translateY(0em)",
    transition    : `transform 0.42s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
  });

  return (
    /* perspective + perspectiveOrigin en haut → effet "on ouvre vers l'avant" */
    <div style={{
      position          : "relative",
      width             : "1.2em",
      height            : "0.98em",  // corps (0.86em) + onglet (0.12em)
      perspective       : "6em",
      perspectiveOrigin : "center top",
    }}>

      {/* ── Onglet ── */}
      <div style={{
        position    : "absolute",
        top         : 0,
        left        : 0,
        width       : "0.45em",
        height      : "calc(0.12em + 0.04em)",
        background  : G_TAB,
        borderRadius: "0.05em 0.05em 0 0",
        zIndex      : 1,
      }} />

      {/* ── Corps arrière ── */}
      <div style={{
        position    : "absolute",
        top         : "0.12em",
        left        : 0,
        width       : "1.2em",
        height      : "0.86em",
        background  : G_DARK,
        borderRadius: "0.02em 0.08em 0.08em 0.08em",
        zIndex      : 2,
      }} />

      {/* ── Feuilles (les unes derrière les autres) ── */}
      <div style={{
        position    : "absolute",
        top         : "0.12em",
        left        : 0,
        width       : "1.2em",
        height      : "0.86em",
        zIndex      : 3,
        overflow    : "hidden",
        borderRadius: "0.02em 0.08em 0.08em 0.08em",
      }}>
        {/* Feuille arrière */}
        <div style={paper(-5, -0.08, 90, 0.06)} />
        {/* Feuille milieu */}
        <div style={paper(0, 0, 55, 0.03)} />
        {/* Feuille avant */}
        <div style={paper(5, 0.08, 90, 0)} />
      </div>

      {/* ── Couverture — s'ouvre VERS L'AVANT (bas vers le spectateur) ── */}
      <div style={{
        position                : "absolute",
        top                     : "0.12em",
        left                    : 0,
        width                   : "1.2em",
        height                  : "0.86em",
        zIndex                  : 4,
        transformStyle          : "preserve-3d",
        transformOrigin         : "top center",
        /* rotateX positif → bas vient vers le spectateur */
        transform               : open ? "rotateX(62deg)" : "rotateX(0deg)",
        transition              : "transform 0.52s cubic-bezier(0.4,0,0.2,1)",
        backfaceVisibility      : "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}>
        <div style={{
          position      : "absolute",
          inset         : 0,
          background    : G,
          borderRadius  : "0.02em 0.08em 0.08em 0.08em",
          boxShadow     : "0 0.04em 0.15em rgba(0,0,0,0.15)",
          display       : "flex",
          alignItems    : "center",
          justifyContent: "center",
          overflow      : "hidden",
        }}>
          {/* Reflet */}
          <div style={{
            position     : "absolute",
            inset        : 0,
            borderRadius : "inherit",
            background   : "linear-gradient(130deg,rgba(255,255,255,0.22) 0%,transparent 55%)",
            pointerEvents: "none",
          }} />

          {/* "portfolio" — fixe en haut-gauche */}
          <span style={{
            position     : "absolute",
            top          : "0.12em",
            left         : "0.14em",
            fontFamily   : "var(--font-poppins)",
            fontWeight   : 300,
            fontSize     : "0.55rem",  // fixe, toujours lisible
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color        : "rgba(255,255,255,0.5)",
          }}>
            portfolio
          </span>

          {/* "JADE L." gravé (em → scale avec le dossier) */}
          <span style={{
            fontFamily      : "var(--font-londrina-solid)",
            fontWeight      : 900,
            fontSize        : "0.28em",
            letterSpacing   : "0.06em",
            color           : "transparent",
            WebkitTextStroke: "0.1em rgba(255,255,255,0.28)",
            userSelect      : "none",
            position        : "relative",
            zIndex          : 1,
          }}>
            JADE L.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────── */
export default function FolderSection() {
  const [open,  setOpen]  = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const rowRef            = useRef<HTMLDivElement>(null);
  const { navigate }      = usePageTransition();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!rowRef.current) return;
    const r = rowRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left)  / r.width,
      y: (e.clientY - r.top)   / r.height,
    });
  }, []);

  return (
    <section style={{
      minHeight     : "100vh",
      background    : "#F5F2ED",
      display       : "flex",
      flexDirection : "column",
      alignItems    : "center",
      justifyContent: "center",
      padding       : "4rem 2rem",
    }}>

      {/* Ligne 1 — Poppins */}
      <p style={{
        fontFamily   : "var(--font-poppins)",
        fontWeight   : 300,
        fontSize     : "0.8rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color        : "rgba(35,35,35,0.45)",
        marginBottom : "0.6rem",
      }}>
        Curieux ?… Voici mes
      </p>

      {/* Ligne 2 — "pr" + [dossier] + "jets", même police/taille que le hero */}
      <div
        ref={rowRef}
        style={{
          /* font-size = même clamp que .hero-name */
          fontSize      : "clamp(4.5rem, 12vw, 18rem)",
          display       : "flex",
          alignItems    : "flex-end",
          gap           : "0.06em",   /* espace entre le texte et le dossier */
          cursor        : "pointer",
          userSelect    : "none",
          lineHeight    : 0.88,
        }}
        onClick={() => navigate("/projects")}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { setOpen(false); setMouse({ x: 0.5, y: 0.5 }); }}
        onMouseMove={handleMouseMove}
      >
        {/* "pr" */}
        <span style={{
          fontFamily   : "var(--font-londrina-solid)",
          fontWeight   : 900,
          color        : "#232323",
          /* pas de textTransform → minuscules naturelles */
        }}>
          pr
        </span>

        {/* Dossier (remplace le "o") */}
        <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
          <MacFolder open={open} mouseX={mouse.x} mouseY={mouse.y} />
        </div>

        {/* "jets" */}
        <span style={{
          fontFamily: "var(--font-londrina-solid)",
          fontWeight: 900,
          color     : "#232323",
        }}>
          jets
        </span>
      </div>
    </section>
  );
}
