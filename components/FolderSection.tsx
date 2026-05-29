"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

const BACK_COLOR  = "#1877C9";
const FRONT_COLOR = "#64C8F0";

/*
  SVG viewBox 0 0 302 252
  Onglet top-left, courbe de transition douce vers le corps
*/
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
  Dimensions en em (relatives au font-size du parent = clamp(8rem…))
  ─────────────────────────────────────────────────────
  FOLDER_H = 0.65em  → même hauteur que les minuscules (≈ x-height)
  FOLDER_W = 0.78em  → 302/252 × 0.65
  TAB_H    = 0.10em  → hauteur de l'onglet
  FRONT_H  = 0.46em  → panneau avant plus court que l'arrière
  FRONT_TOP = 0.19em → = FOLDER_H − FRONT_H, laisse ~0.065em de feuilles visibles
*/

const PAPERS = [
  { rotZ: -3,  topColor: "#C41830", bodyColor: "#EFA8A8" },
  { rotZ:  0,  topColor: "#B83020", bodyColor: "#F5B4B4" },
  { rotZ:  3,  topColor: "#D04828", bodyColor: "#FFC0B0" },
];

function MacFolder({ open, mouseX }: { open: boolean; mouseX: number }) {
  const mr = (mouseX - 0.5) * 4; // léger tilt horizontal selon souris

  // Angles : légèrement ouvert par défaut, plus ouvert au survol
  const frontAngle = open ? -28 : -7;
  const paperAngle = open ? -18 : -5;

  return (
    <div style={{
      position: "relative",
      width   : "0.78em",
      height  : "0.65em",
      overflow: "visible",
    }}>

      {/* ── ARRIÈRE (SVG bleu foncé + onglet) ── */}
      <svg
        width="0.78em"
        height="0.65em"
        viewBox="0 0 302 252"
        style={{ position:"absolute", top:0, left:0, zIndex:1, display:"block", overflow:"visible" }}
      >
        <path d={BACK_PATH} fill={BACK_COLOR} />
      </svg>

      {/* ── FEUILLES — pivotent vers l'avant (même sens que l'avant), PAS de slide ── */}
      {PAPERS.map(({ rotZ, topColor, bodyColor }, i) => (
        <div key={i} style={{
          position       : "absolute",
          left           : "0.04em",
          bottom         : "0.015em",
          width          : "calc(0.78em - 0.08em)",
          height         : "0.52em",
          borderRadius   : "0.02em 0.02em 0.015em 0.015em",
          overflow       : "hidden",
          zIndex         : 2,
          transformOrigin: "bottom center",
          transform      : `perspective(1.2em) rotateX(${paperAngle}deg) rotateZ(${rotZ + mr * 0.25}deg)`,
          transition     : "transform 0.5s cubic-bezier(0.4,0,0.18,1)",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"0.012em", background:"#1A2450" }} />
          <div style={{ position:"absolute", top:"0.012em", left:0, right:0, height:"0.035em", background:topColor }} />
          <div style={{ position:"absolute", top:"0.047em", left:0, right:0, height:"0.004em", background:"rgba(255,255,255,0.8)" }} />
          <div style={{ position:"absolute", top:"0.051em", left:0, right:0, bottom:0, background:bodyColor }} />
        </div>
      ))}

      {/* ── AVANT (bleu clair, plus court, pivot en bas → haut tombe vers l'avant) ── */}
      <div style={{
        position       : "absolute",
        top            : "0.19em",   // = FOLDER_H − FRONT_H
        left           : 0,
        width          : "0.78em",
        height         : "0.46em",
        background     : FRONT_COLOR,
        borderRadius   : "0.05em",
        zIndex         : 3,
        transformOrigin: "bottom center",
        transform      : `perspective(1.2em) rotateX(${frontAngle}deg)`,
        transition     : "transform 0.5s cubic-bezier(0.4,0,0.18,1)",
        overflow       : "hidden",
      }}>
        {/* Reflet diagonal */}
        <div style={{
          position     : "absolute", inset: 0,
          background   : "linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)",
          pointerEvents: "none",
        }} />
      </div>

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

      {/* "Pr [dossier] jets" */}
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

        {/* Aligné sur la ligne de base — hauteur = x-height */}
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
