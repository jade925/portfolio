"use client";

import { useState } from "react";
import { usePageTransition } from "@/context/TransitionContext";

/* ── Couleurs Figma ── */
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

/* ── Onglet seul (z-index 4) ── */
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
  3 feuilles (rose, gris, rouge).
  DOM index 0 = derrière (z-behind), index 2 = devant (z-on-top).

  RÈGLE : pour que l'escalier soit visible, le papier z-behind (index 0)
  doit être positionné PLUS HAUT que le papier z-top (index 2).
*/
const PAPERS = [
  { color: "#E8A096" }, // fond  (DOM first → derrière, positionné le plus haut)
  { color: "#E8E9E9" }, // milieu
  { color: "#FF544B" }, // devant (DOM last → dessus, positionné le plus bas)
];

const PAPER_BOTTOMS_DEFAULT = [0.147, 0.134, 0.121]; // fond=haut, devant=bas
const PAPER_BOTTOMS_HOVER   = [0.147, 0.107, 0.067]; // fond reste, devant descend

/*
  Dimensions clés (em = font-size hérité ≈ clamp(8rem,22vw,30rem)) :
  ─────────────────────────────────────────────────────────────────────
  FOLDER_H    = 0.65em
  FOLDER_W    = 0.78em
  TAB_H       = 0.103em  (40/252 × 0.65 — hauteur de l'onglet)
  CLIP_H      = 0.547em  (0.65 - 0.103)
  FRONT_TOP   = 0.14em
  FRONT_H     = 0.44em   → pivot à 0.58em, laisse 0.07em de bleu foncé visible en bas
  PAPER_H     = 0.40em
  PERSP       = 3.5em    → trapèze +6-11% width en haut

  Angles :
    repos  → avant -5°,  feuilles -3°
    survol → avant -40°, feuilles -12°

  Easing : ease-in à l'entrée, ease-out à la sortie, 0.18s
*/

function MacFolder({ open }: { open: boolean }) {
  const frontAngle = open ? -40 : -5;
  const paperAngle = open ? -12 : -3;
  const bottoms    = open ? PAPER_BOTTOMS_HOVER : PAPER_BOTTOMS_DEFAULT;
  const ease       = open ? "ease-in" : "ease-out";

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
        style={{ position:"absolute", top:0, left:0, zIndex:1, display:"block", overflow:"visible", pointerEvents:"none" }}
      >
        <path d={BACK_PATH} fill={BACK_COLOR} />
      </svg>

      {/* ── CLIP CONTAINER (z 2) — confine les feuilles au corps du dossier ── */}
      <div style={{
        position    : "absolute",
        top         : "0.103em",
        left        : 0,
        right       : 0,
        bottom      : 0,
        overflow    : "hidden",
        zIndex      : 2,
        borderRadius: "0 0 0.052em 0.052em",
        pointerEvents: "none",
      }}>
        {PAPERS.map(({ color }, i) => (
          <div key={i} style={{
            position       : "absolute",
            left           : "0.04em",
            right          : "0.04em",
            bottom         : `${bottoms[i]}em`,
            height         : "0.40em",
            borderRadius   : "0.015em 0.015em 0.01em 0.01em",
            background     : color,
            outline        : "0.004em solid rgba(255,255,255,0.7)",
            transformOrigin: "bottom center",
            transform      : `perspective(3.5em) rotateX(${paperAngle}deg)`,
            transition     : `bottom 0.18s ${ease}, transform 0.18s ${ease}`,
          }} />
        ))}
      </div>

      {/* ── AVANT (z 3) — pivot à 0.58em, 0.07em de bleu foncé visible en bas ── */}
      <div style={{
        position       : "absolute",
        top            : "0.14em",
        left           : 0,
        width          : "0.78em",
        height         : "0.44em",
        background     : FRONT_COLOR,
        borderRadius   : "0.03em",
        zIndex         : 3,
        transformOrigin: "bottom center",
        transform      : `perspective(3.5em) rotateX(${frontAngle}deg)`,
        transition     : `transform 0.18s ${ease}`,
        overflow       : "hidden",
        pointerEvents  : "none",
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
  const [open, setOpen] = useState(false);
  const { navigate }    = usePageTransition();

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
      >
        <span style={{ fontFamily:"var(--font-londrina-solid)", fontWeight:900, color:"#232323" }}>
          Pr
        </span>

        {/* Hover uniquement sur le dossier — tous les enfants ont pointerEvents:none */}
        <div
          style={{ flexShrink:0, alignSelf:"flex-end" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <MacFolder open={open} />
        </div>

        <span style={{ fontFamily:"var(--font-londrina-solid)", fontWeight:900, color:"#232323" }}>
          jets
        </span>
      </div>

    </section>
  );
}
