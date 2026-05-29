"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

/* ── Couleurs extraites du Figma ── */
const BACK_COLOR  = "#0274BD";
const FRONT_COLOR = "#4FC2F6";

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

/* ── Onglet seul (z-index 4, au-dessus des feuilles) ── */
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
  Feuilles — 3 couleurs Figma (rouge, gris, rose).
  DOM index 0 = derrière (z-behind), index 2 = devant (z-on-top).

  Positions calculées depuis le Figma (Variant2=repos, Default=survol) :
    Paper 2 (rouge, devant) : top ≈ 0.090em — reste fixe au survol
    Paper 1 (gris, milieu)  : top monte légèrement
    Paper 0 (rose, fond)    : top monte le plus → escalier s'écarte

  PAPER_BOTTOMS = folder_h(0.65) - paper_top - paper_height(0.48)
*/
const PAPERS = [
  { color: "#E8A096" }, // fond  (DOM first → derrière)
  { color: "#E8E9E9" }, // milieu
  { color: "#FF544B" }, // devant (DOM last → dessus)
];

const PAPER_BOTTOMS_DEFAULT = [0.061, 0.068, 0.080]; // escalier serré au repos
const PAPER_BOTTOMS_HOVER   = [0.041, 0.055, 0.080]; // fond descend, devant fixe

/*
  Proportions (em) — Figma 557×429 → CSS 0.78×0.65em
  ─────────────────────────────────────────────────────
  FRONT_TOP = 0.14em  (90.5 / 429 × 0.65)
  FRONT_H   = 0.51em  (338  / 429 × 0.65)
  PERSP     = 3.5em   → +6% width en haut à -26°, conforme au trapèze Figma
  Repos : rotateX(-5°)  → panneau légèrement ouvert, quasi plat
  Survol: rotateX(-26°) → trapèze ouvert, -5% height, +6% width en haut
*/

function MacFolder({ open }: { open: boolean }) {
  const frontAngle = open ? -26 : -5;
  const paperAngle = open ? -8  : -3;
  const bottoms    = open ? PAPER_BOTTOMS_HOVER : PAPER_BOTTOMS_DEFAULT;
  const ease       = open ? "ease-in" : "ease-out"; // conforme Figma

  return (
    <div style={{
      position: "relative",
      width   : "0.78em",
      height  : "0.65em",
      overflow: "visible",
    }}>

      {/* ── ARRIÈRE (z 1) ── */}
      <svg
        width="0.78em" height="0.65em" viewBox="0 0 302 252"
        style={{ position:"absolute", top:0, left:0, zIndex:1, display:"block", overflow:"visible" }}
      >
        <path d={BACK_PATH} fill={BACK_COLOR} />
      </svg>

      {/* ── FEUILLES (z 2) — escalier via bottom, pas de rotateZ ni translateY ── */}
      {PAPERS.map(({ color }, i) => (
        <div key={i} style={{
          position       : "absolute",
          left           : "0.04em",
          right          : "0.04em",
          bottom         : `${bottoms[i]}em`,
          height         : "0.48em",
          borderRadius   : "0.015em 0.015em 0.01em 0.01em",
          background     : color,
          outline        : "0.004em solid rgba(255,255,255,0.7)",
          zIndex         : 2,
          transformOrigin: "bottom center",
          transform      : `perspective(3.5em) rotateX(${paperAngle}deg)`,
          transition     : `bottom 0.3s ${ease}, transform 0.3s ${ease}`,
        }} />
      ))}

      {/* ── AVANT (z 3) — perspective(3.5em) rotateX → trapèze naturel ── */}
      <div style={{
        position       : "absolute",
        top            : "0.14em",
        left           : 0,
        width          : "0.78em",
        height         : "0.51em",
        background     : FRONT_COLOR,
        borderRadius   : "0.03em",
        zIndex         : 3,
        transformOrigin: "bottom center",
        transform      : `perspective(3.5em) rotateX(${frontAngle}deg)`,
        transition     : `transform 0.3s ${ease}`,
        overflow       : "hidden",
      }}>
        <div style={{
          position     : "absolute",
          inset        : 0,
          background   : "linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── ONGLET (z 4, au-dessus des feuilles) ── */}
      <svg
        width="0.78em" height="0.65em" viewBox="0 0 302 252"
        style={{
          position     : "absolute", top:0, left:0,
          zIndex       : 4,
          display      : "block",
          pointerEvents: "none",
          overflow     : "visible",
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
          <MacFolder open={open} />
        </div>

        <span style={{ fontFamily:"var(--font-londrina-solid)", fontWeight:900, color:"#232323" }}>
          jets
        </span>
      </div>

    </section>
  );
}
