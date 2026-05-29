"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

/* ── Couleurs des images de référence ── */
const BACK_COLOR  = "#1877C9"; // bleu foncé (arrière avec onglet)
const FRONT_COLOR = "#64C8F0"; // bleu clair (avant)

/*
  SVG viewBox 0 0 302 252 — forme exacte du dossier macOS
  Onglet : top-left, largeur 115, hauteur 40
  Courbe concave entre le bord droit de l'onglet et le haut du corps
*/
const BACK_PATH = [
  "M 8 0",
  "L 101 0",
  "Q 115 0 115 14",    // coin haut-droit de l'onglet (r≈14)
  "L 115 28",
  "Q 105 40 130 40",   // courbe concave onglet → corps (dip vers la gauche)
  "L 282 40",
  "Q 302 40 302 60",   // coin haut-droit du corps (r≈20)
  "L 302 232",
  "Q 302 252 282 252", // coin bas-droit
  "L 20 252",
  "Q 0 252 0 232",     // coin bas-gauche
  "L 0 8",
  "Q 0 0 8 0",         // coin haut-gauche de l'onglet (r≈8)
  "Z",
].join(" ");

/* ── Feuille de document ── */
function Paper({
  open, rotZ, tx, mouseX, delay, topColor, bodyColor,
}: {
  open: boolean; rotZ: number; tx: number; mouseX: number;
  delay: number; topColor: string; bodyColor: string;
}) {
  const mr = (mouseX - 0.5) * 5;

  return (
    <div style={{
      position    : "absolute",
      left        : "0.08em",
      bottom      : "0.04em",
      width       : "calc(1.2em - 0.16em)",
      height      : "0.80em",
      borderRadius: "0.025em 0.025em 0.02em 0.02em",
      overflow    : "hidden",
      boxShadow   : open ? "0 -0.015em 0.05em rgba(0,0,0,0.18)" : "none",
      transform   : open
        ? `rotateZ(${rotZ + mr * 0.3}deg) translateX(${tx}em) translateY(-0.18em)`
        : "rotateZ(0deg) translateX(0em) translateY(0em)",
      transition  : open
        ? `transform 0.45s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms, box-shadow 0.3s ease`
        : "transform 0.3s ease 0ms, box-shadow 0.3s ease",
    }}>
      {/* Bordure sombre en haut */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height  : "0.015em", background: "#1A2450",
      }} />
      {/* Bande colorée */}
      <div style={{
        position: "absolute", top: "0.015em", left: 0, right: 0,
        height  : "0.04em", background: topColor,
      }} />
      {/* Fine ligne blanche séparatrice */}
      <div style={{
        position: "absolute", top: "0.055em", left: 0, right: 0,
        height  : "0.006em", background: "rgba(255,255,255,0.85)",
      }} />
      {/* Corps de la feuille */}
      <div style={{
        position: "absolute", top: "0.061em", left: 0, right: 0, bottom: 0,
        background: bodyColor,
      }} />
    </div>
  );
}

/* ── Dossier Mac ── */
function MacFolder({ open, mouseX, mouseY }: {
  open: boolean; mouseX: number; mouseY: number;
}) {
  const TAB_H = "0.159em"; // 40/252 × 1.0em

  return (
    /*
      Container : 1.2em × 1.0em — ratio exact 302:252
      overflow visible pour que les feuilles dépassent en haut
    */
    <div style={{
      position: "relative",
      width   : "1.2em",
      height  : "1.0em",
      overflow: "visible",
    }}>

      {/* ── ARRIÈRE : SVG bleu foncé avec onglet ── */}
      <svg
        width="1.2em"
        height="1.0em"
        viewBox="0 0 302 252"
        style={{ position:"absolute", top:0, left:0, zIndex:1, display:"block", overflow:"visible" }}
      >
        <path d={BACK_PATH} fill={BACK_COLOR} />
      </svg>

      {/* ── FEUILLES : z-index 2, remontent au survol ── */}
      <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", zIndex:2, overflow:"visible" }}>
        <Paper
          open={open} rotZ={-3.5} tx={-0.05} mouseX={mouseX} delay={70}
          topColor="#C41830" bodyColor="#EFA8A8"
        />
        <Paper
          open={open} rotZ={0} tx={0} mouseX={mouseX} delay={35}
          topColor="#B83020" bodyColor="#F5B4B4"
        />
        <Paper
          open={open} rotZ={3.5} tx={0.05} mouseX={mouseX} delay={70}
          topColor="#D04828" bodyColor="#FFC0B0"
        />
      </div>

      {/* ── AVANT : panneau bleu clair, s'incline légèrement vers l'avant ── */}
      <div style={{
        position      : "absolute",
        top           : TAB_H,
        left          : 0,
        width         : "1.2em",
        height        : `calc(1.0em - ${TAB_H})`,
        background    : FRONT_COLOR,
        borderRadius  : "0.06em",
        zIndex        : 3,
        transformOrigin: "top center",
        transform     : open
          ? "perspective(6em) rotateX(10deg)"
          : "perspective(6em) rotateX(0deg)",
        transition    : "transform 0.45s cubic-bezier(0.4,0,0.18,1)",
        overflow      : "hidden",
        display       : "flex",
        alignItems    : "center",
        justifyContent: "center",
      }}>

        {/* Reflet diagonal */}
        <div style={{
          position     : "absolute", inset: 0,
          background   : "linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)",
          pointerEvents: "none",
        }} />

        {/* "JADE L." gravé */}
        <span style={{
          fontFamily      : "var(--font-londrina-solid)",
          fontWeight      : 900,
          fontSize        : "0.26em",
          letterSpacing   : "0.07em",
          color           : "transparent",
          WebkitTextStroke: "0.09em rgba(255,255,255,0.25)",
          userSelect      : "none",
          position        : "relative",
          zIndex          : 1,
        }}>
          JADE L.
        </span>

        {/* Badge "portfolio" */}
        <div style={{
          position    : "absolute",
          bottom      : "0.09em",
          left        : "0.12em",
          display     : "flex",
          alignItems  : "center",
          padding     : "0.025em 0.07em",
          border      : "0.012em solid rgba(255,255,255,0.38)",
          borderRadius: "0.06em",
        }}>
          <span style={{
            fontFamily   : "var(--font-poppins)",
            fontWeight   : 300,
            fontSize     : "0.55rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color        : "rgba(255,255,255,0.60)",
          }}>
            portfolio
          </span>
        </div>

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
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top)  / r.height,
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

      {/* Accroche */}
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
          fontSize  : "clamp(6rem, 16vw, 22rem)",
          display   : "flex",
          alignItems: "flex-end",
          gap       : "0.05em",
          cursor    : "pointer",
          userSelect: "none",
          lineHeight: 0.88,
        }}
        onClick={() => navigate("/projects")}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { setOpen(false); setMouse({ x: 0.5, y: 0.5 }); }}
        onMouseMove={handleMouseMove}
      >
        <span style={{ fontFamily: "var(--font-londrina-solid)", fontWeight: 900, color: "#232323" }}>
          Pr
        </span>

        <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
          <MacFolder open={open} mouseX={mouse.x} mouseY={mouse.y} />
        </div>

        <span style={{ fontFamily: "var(--font-londrina-solid)", fontWeight: 900, color: "#232323" }}>
          jets
        </span>
      </div>

    </section>
  );
}
