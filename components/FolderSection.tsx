"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

/* ── Couleurs dossier ── */
const G      = "#A7C957"; // vert principal
const G_DARK = "#8BBF3A"; // vert foncé (profondeur)
const G_TAB  = "#7FA832"; // onglet (plus foncé)

/* ── Dimensions dossier ── */
const FW       = 200; // largeur corps
const FH       = 148; // hauteur corps
const TAB_H    = 24;  // hauteur onglet
const TAB_W    = 80;  // largeur onglet

/* ────────────────────────────────
   Dossier Mac 3D
──────────────────────────────── */
function MacFolder({
  open,
  mouseX,
  mouseY,
}: {
  open   : boolean;
  mouseX : number; // 0 à 1
  mouseY : number; // 0 à 1
}) {
  const totalH = FH + TAB_H;

  /* Inclinaison des feuilles selon la souris */
  const tiltRot = (mouseX - 0.5) * 12; // ±6 deg
  const tiltTx  = (mouseX - 0.5) * 14;  // ±7 px
  const tiltTy  = (mouseY - 0.5) * 8;   // ±4 px

  const paper = (
    baseRot : number,
    baseTx  : number,
    delay   : number,
  ): React.CSSProperties => ({
    position       : "absolute",
    width          : FW - 32,
    height         : FH - 24,
    top            : 12,
    left           : 16,
    background     : "#F9F8F4",
    borderRadius   : "6px",
    boxShadow      : "0 2px 10px rgba(0,0,0,0.07)",
    transformOrigin: "bottom center",
    transform      : open
      ? `rotate(${baseRot + tiltRot * 0.35}deg) translateX(${baseTx + tiltTx}px) translateY(${tiltTy}px)`
      : "rotate(0deg) translateX(0) translateY(0)",
    transition     : open
      ? `transform 0.45s cubic-bezier(0.34,1.3,0.64,1) ${delay}ms`
      : "transform 0.35s ease",
  });

  return (
    <div style={{ position: "relative", width: FW, height: totalH, perspective: "1200px" }}>

      {/* Onglet */}
      <div style={{
        position    : "absolute",
        top         : 0,
        left        : 0,
        width       : TAB_W,
        height      : TAB_H + 6,
        background  : G_TAB,
        borderRadius: "8px 8px 0 0",
        zIndex      : 1,
      }} />

      {/* Corps arrière */}
      <div style={{
        position    : "absolute",
        top         : TAB_H,
        left        : 0,
        width       : FW,
        height      : FH,
        background  : G_DARK,
        borderRadius: "4px 12px 12px 12px",
        zIndex      : 2,
      }} />

      {/* Feuilles (dans le corps, derrière la couverture) */}
      <div style={{
        position    : "absolute",
        top         : TAB_H,
        left        : 0,
        width       : FW,
        height      : FH,
        zIndex      : 3,
        overflow    : "hidden",
        borderRadius: "4px 12px 12px 12px",
      }}>
        <div style={paper(-7, -18, 80)} />
        <div style={paper(0,    0,  50)} />
        <div style={paper(7,   18,  80)} />
      </div>

      {/* Couverture (s'ouvre sur hover) */}
      <div style={{
        position              : "absolute",
        top                   : TAB_H,
        left                  : 0,
        width                 : FW,
        height                : FH,
        zIndex                : 4,
        transformStyle        : "preserve-3d",
        transformOrigin       : "top center",
        transform             : open ? "rotateX(-178deg)" : "rotateX(0deg)",
        transition            : "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        backfaceVisibility    : "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}>
        {/* Face verte */}
        <div style={{
          position    : "absolute",
          inset       : 0,
          background  : G,
          borderRadius: "4px 12px 12px 12px",
          boxShadow   : "0 6px 24px rgba(0,0,0,0.14)",
          display     : "flex",
          alignItems  : "center",
          justifyContent: "center",
          overflow    : "hidden",
        }}>
          {/* Reflet */}
          <div style={{
            position    : "absolute",
            inset       : 0,
            borderRadius: "inherit",
            background  : "linear-gradient(130deg, rgba(255,255,255,0.2) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />

          {/* "portfolio" — haut gauche */}
          <span style={{
            position     : "absolute",
            top          : 12,
            left         : 14,
            fontFamily   : "var(--font-poppins)",
            fontWeight   : 300,
            fontSize     : "0.52rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color        : "rgba(255,255,255,0.5)",
          }}>
            portfolio
          </span>

          {/* "JADE L." gravé */}
          <span style={{
            fontFamily      : "var(--font-londrina-solid)",
            fontWeight      : 900,
            fontSize        : "2.6rem",
            letterSpacing   : "0.06em",
            color           : "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.3)",
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

/* ────────────────────────────────
   Section principale
──────────────────────────────── */
export default function FolderSection() {
  const [open,   setOpen]   = useState(false);
  const [mouse,  setMouse]  = useState({ x: 0.5, y: 0.5 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const { navigate }        = usePageTransition();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left)  / r.width,
      y: (e.clientY - r.top)   / r.height,
    });
  }, []);

  /* Taille du texte = hauteur totale du dossier (FH + TAB_H = 172px ≈ 10.75rem) */
  const FS = `${(FH + TAB_H) / 16}rem`; // ~10.75rem

  return (
    <section style={{
      minHeight      : "100vh",
      background     : "#F5F2ED",
      display        : "flex",
      flexDirection  : "column",
      alignItems     : "center",
      justifyContent : "center",
      padding        : "4rem 2rem",
    }}>

      {/* Ligne 1 — Poppins light */}
      <p style={{
        fontFamily   : "var(--font-poppins)",
        fontWeight   : 300,
        fontSize     : "0.78rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color        : "rgba(35,35,35,0.45)",
        marginBottom : "0.5rem",
      }}>
        Curieux ? Voici mes
      </p>

      {/* Ligne 2 — PR + Dossier + JETS */}
      <div
        ref={containerRef}
        style={{
          display       : "flex",
          alignItems    : "flex-end",
          cursor        : "pointer",
          userSelect    : "none",
        }}
        onClick={() => navigate("/projects")}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { setOpen(false); setMouse({ x: 0.5, y: 0.5 }); }}
        onMouseMove={handleMouseMove}
      >
        {/* "PR" */}
        <span style={{
          fontFamily   : "var(--font-londrina-solid)",
          fontWeight   : 900,
          fontSize     : FS,
          lineHeight   : 1,
          color        : "#232323",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          paddingBottom: "0.08em", // ajuste l'alignement baseline
        }}>
          PR
        </span>

        {/* Dossier (remplace le "O") */}
        <div style={{ flexShrink: 0, marginBottom: "0.05em" }}>
          <MacFolder open={open} mouseX={mouse.x} mouseY={mouse.y} />
        </div>

        {/* "JETS" */}
        <span style={{
          fontFamily   : "var(--font-londrina-solid)",
          fontWeight   : 900,
          fontSize     : FS,
          lineHeight   : 1,
          color        : "#232323",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          paddingBottom: "0.08em",
        }}>
          JETS
        </span>
      </div>

    </section>
  );
}
