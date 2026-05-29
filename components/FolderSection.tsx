"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

const BACK_COLOR  = "#1877C9";
const FRONT_COLOR = "#64C8F0";

/* ── Arrière complet (corps + onglet) ── */
const BACK_PATH = [
  "M 8 0",
  "L 101 0",
  "Q 115 0 115 12",
  "L 115 30",
  "Q 115 40 124 40",
  "L 282 40",
  "Q 302 40 302 60",
  "L 302 232",
  "Q 302 252 282 252",
  "L 20 252",
  "Q 0 252 0 232",
  "L 0 8",
  "Q 0 0 8 0",
  "Z",
].join(" ");

/*
  Onglet seul — rendu au z-index 4 (au-dessus des feuilles)
  pour que l'arrière soit toujours visible
*/
const TAB_PATH = [
  "M 8 0",
  "L 101 0",
  "Q 115 0 115 12",
  "L 115 30",
  "Q 115 40 124 40",
  "L 0 40",
  "L 0 8",
  "Q 0 0 8 0",
  "Z",
].join(" ");

/*
  Dimensions (em relatifs au font-size du parent = clamp(8rem…))
  ─────────────────────────────────────────────────────────────
  FOLDER_H = 0.65em  → hauteur ≈ x-height des minuscules
  FOLDER_W = 0.78em  → ratio 302:252 × 0.65
  TAB_H    = 0.10em  → onglet
  FRONT_H  = 0.46em  → panneau avant (plus court que le corps arrière 0.55em)
  FRONT_TOP = 0.19em → = FOLDER_H - FRONT_H
*/

/*
  Feuilles en escalier (trapèze)
  ─────────────────────────────
  Chaque feuille a un `bottom` différent :
    - feuille 0 (fond, derrière) : bottom le plus grand → position la plus haute
    - feuille 2 (devant, dessus) : bottom le plus petit → position la plus basse
  →  la feuille de fond dépasse le plus, créant l'escalier/trapèze

  Au survol, les `bottom` augmentent → l'escalier devient plus prononcé.
  Aucun translateY (feuilles ne sortent pas), aucun rotateZ (restent en ligne).
*/
const PAPERS = [
  { topColor: "#C41830", bodyColor: "#EFA8A8" }, // fond (DOM first → derrière)
  { topColor: "#B83020", bodyColor: "#F5B4B4" }, // milieu
  { topColor: "#D04828", bodyColor: "#FFC0B0" }, // devant (DOM last → dessus)
];

// bottom de chaque feuille selon l'état (default / hover)
const PAPER_BOTTOMS_DEFAULT = [0.08, 0.05, 0.02]; // feuilles peu visibles
const PAPER_BOTTOMS_HOVER   = [0.13, 0.085, 0.04]; // escalier plus prononcé

function MacFolder({ open, mouseX }: { open: boolean; mouseX: number }) {
  const fronAngle  = open ? -30 : -7;   // panneau avant : légèrement ouvert → plus ouvert
  const paperAngle = open ? -18 : -5;   // feuilles pivotent dans le même sens

  const bottoms = open ? PAPER_BOTTOMS_HOVER : PAPER_BOTTOMS_DEFAULT;

  return (
    <div style={{
      position: "relative",
      width   : "0.78em",
      height  : "0.65em",
      overflow: "visible",
    }}>

      {/* ── ARRIÈRE corps + onglet (z-index 1, sous les feuilles) ── */}
      <svg
        width="0.78em" height="0.65em" viewBox="0 0 302 252"
        style={{ position:"absolute", top:0, left:0, zIndex:1, display:"block", overflow:"visible" }}
      >
        <path d={BACK_PATH} fill={BACK_COLOR} />
      </svg>

      {/* ── FEUILLES (z-index 2) : escalier trapèze, pas de rotateZ ni translateY ── */}
      {PAPERS.map(({ topColor, bodyColor }, i) => (
        <div key={i} style={{
          position       : "absolute",
          left           : "0.04em",
          bottom         : `${bottoms[i]}em`,
          width          : "0.70em",
          height         : "0.48em",
          borderRadius   : "0.02em 0.02em 0.015em 0.015em",
          overflow       : "hidden",
          zIndex         : 2,
          transformOrigin: "bottom center",
          transform      : `perspective(0.9em) rotateX(${paperAngle}deg)`,
          transition     : [
            "bottom 0.5s cubic-bezier(0.4,0,0.18,1)",
            "transform 0.5s cubic-bezier(0.4,0,0.18,1)",
          ].join(", "),
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"0.013em", background:"#1A2450" }} />
          <div style={{ position:"absolute", top:"0.013em", left:0, right:0, height:"0.035em", background:topColor }} />
          <div style={{ position:"absolute", top:"0.048em", left:0, right:0, height:"0.004em", background:"rgba(255,255,255,0.8)" }} />
          <div style={{ position:"absolute", top:"0.052em", left:0, right:0, bottom:0, background:bodyColor }} />
        </div>
      ))}

      {/* ── AVANT (z-index 3) : pivot en bas, haut tombe vers l'avant ──
           Effet naturel du perspective+rotateX :
           - top edge apparaît plus large (perspective projection)
           - hauteur apparaît réduite (foreshortening)
           → donne l'effet trapèze ouverture
      ── */}
      <div style={{
        position       : "absolute",
        top            : "0.19em",
        left           : 0,
        width          : "0.78em",
        height         : "0.46em",
        background     : FRONT_COLOR,
        borderRadius   : "0.05em",
        zIndex         : 3,
        transformOrigin: "bottom center",
        transform      : `perspective(0.9em) rotateX(${fronAngle}deg)`,
        transition     : "transform 0.5s cubic-bezier(0.4,0,0.18,1)",
        overflow       : "hidden",
      }}>
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)",
          pointerEvents:"none",
        }} />
      </div>

      {/* ── ONGLET (z-index 4) : couche de l'onglet au-dessus des feuilles ─────
           Garantit que le fond bleu foncé reste visible même quand les feuilles
           dépassent dans la zone de l'onglet.
      ── */}
      <svg
        width="0.78em" height="0.65em" viewBox="0 0 302 252"
        style={{
          position:"absolute", top:0, left:0,
          zIndex:4, display:"block",
          pointerEvents:"none", overflow:"visible",
        }}
      >
        <path d={TAB_PATH} fill={BACK_COLOR} />
      </svg>

    </div>
  );
}

/* ── Section ── */
export default function FolderSection() {
  const [open,  setOpen]  = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const rowRef            = useRef<HTMLDivElement>(null);
  const { navigate }      = usePageTransition();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!rowRef.current) return;
    const r = rowRef.current.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
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

      <p style={{
        fontFamily   : "var(--font-poppins)",
        fontWeight   : 300,
        fontSize     : "0.78rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color        : "rgba(35,35,35,0.45)",
        marginBottom : "0.5rem",
      }}>
        Curieux ?… Voici mes
      </p>

      <div
        ref={rowRef}
        style={{
          fontSize  : "clamp(8rem, 22vw, 30rem)",
          display   : "flex",
          alignItems: "flex-end",
          gap       : "0.04em",
          cursor    : "pointer",
          userSelect: "none",
          lineHeight: 0.88,
        }}
        onClick={() => navigate("/projects")}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { setOpen(false); setMouse({ x: 0.5, y: 0.5 }); }}
        onMouseMove={handleMouseMove}
      >
        <span style={{ fontFamily:"var(--font-londrina-solid)", fontWeight:900, color:"#232323" }}>
          Pr
        </span>

        <div style={{ flexShrink:0, alignSelf:"flex-end" }}>
          <MacFolder open={open} mouseX={mouse.x} />
        </div>

        <span style={{ fontFamily:"var(--font-londrina-solid)", fontWeight:900, color:"#232323" }}>
          jets
        </span>
      </div>

    </section>
  );
}
