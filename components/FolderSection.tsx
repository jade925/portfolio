"use client";

import { useState, useRef, useCallback } from "react";
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
  Ainsi :
    - index 0 (rose, z-behind)  : le plus haut → son bord supérieur dépasse index 1 et 2
    - index 1 (gris, z-middle)  : intermédiaire
    - index 2 (rouge, z-on-top) : le plus bas → grande bande visible jusqu'au panneau avant

  paper_top_absolu = max(tab_h=0.103, 0.103 + clip_h(0.547) - paper_h(0.48) - bottom)
                   = max(0.103, 0.170 - bottom)

  Repos (avant ≈ y=0.143em) — espacement égal 0.013em par feuille :
    index0 : bottom=0.090 → top=0.103em (clippé)  visible: 0.103→0.116 = 0.013em
    index1 : bottom=0.054 → top=0.116em            visible: 0.116→0.129 = 0.013em
    index2 : bottom=0.041 → top=0.129em            visible: 0.129→0.143 = 0.014em ← plus grand

  Survol (avant ≈ y=0.219em à -40°) — espacement ~0.030em :
    index0 : bottom=0.090 → top=0.103em (clippé)  visible: 0.103→0.133 = 0.030em
    index1 : bottom=0.037 → top=0.133em            visible: 0.133→0.163 = 0.030em
    index2 : bottom=0.007 → top=0.163em            visible: 0.163→0.219 = 0.056em ← plus grand
*/
const PAPERS = [
  { color: "#E8A096" }, // fond  (DOM first → derrière, positionné le plus haut)
  { color: "#E8E9E9" }, // milieu
  { color: "#FF544B" }, // devant (DOM last → dessus, positionné le plus bas)
];

const PAPER_BOTTOMS_DEFAULT = [0.090, 0.054, 0.041]; // fond=haut, devant=bas
const PAPER_BOTTOMS_HOVER   = [0.090, 0.037, 0.007]; // fond reste, devant descend

/*
  Dimensions clés (em = font-size hérité ≈ clamp(8rem,22vw,30rem)) :
  ─────────────────────────────────────────────────────────────────────
  FOLDER_H    = 0.65em
  FOLDER_W    = 0.78em
  TAB_H       = 0.103em  (40/252 × 0.65 — hauteur de l'onglet)
  CLIP_H      = 0.547em  (0.65 - 0.103)
  FRONT_TOP   = 0.14em   (90.5/429 × 0.65 — Figma)
  FRONT_H     = 0.51em   (338/429 × 0.65 — Figma)
  PAPER_H     = 0.48em
  PERSP       = 3.5em    → trapèze +6-11% width en haut (Figma -26°…-40°)

  Angles :
    repos  → avant -5°,  feuilles -4°  (quasi plat, Figma Variant2)
    survol → avant -40°, feuilles -22° (ouverture prononcée, user request)

  Easing Figma :  ease-in à l'entrée, ease-out à la sortie, 0.3s
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
        style={{ position:"absolute", top:0, left:0, zIndex:1, display:"block", overflow:"visible" }}
      >
        <path d={BACK_PATH} fill={BACK_COLOR} />
      </svg>

      {/* ── CLIP CONTAINER (z 2) — confine les feuilles au corps du dossier ──
           Commence sous l'onglet (top = 0.103em) et va jusqu'en bas.
           overflow:hidden empêche les feuilles de traverser l'arrière.
           border-radius bas = coins du dossier (20/252 × 0.65 ≈ 0.052em).
      ── */}
      <div style={{
        position    : "absolute",
        top         : "0.103em",
        left        : 0,
        right       : 0,
        bottom      : 0,
        overflow    : "hidden",
        zIndex      : 2,
        borderRadius: "0 0 0.052em 0.052em",
      }}>
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
            transformOrigin: "bottom center",
            transform      : `perspective(3.5em) rotateX(${paperAngle}deg)`,
            transition     : `bottom 0.3s ${ease}, transform 0.3s ${ease}`,
          }} />
        ))}
      </div>

      {/* ── AVANT (z 3) — trapèze perspective natif ── */}
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
