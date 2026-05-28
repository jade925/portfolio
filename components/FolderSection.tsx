"use client";

import { useState, useRef, useCallback } from "react";
import { usePageTransition } from "@/context/TransitionContext";

const G       = "#A7C957"; // vert principal
const G_DARK  = "#8BBF3A"; // vert arrière / tab
const G_SHADE = "#78AE28"; // ombre légère

/* ─────────────────────────────────────────────────────────────
   Feuille individuelle
───────────────────────────────────────────────────────────── */
function Paper({
  open, rotZ, tx, mouseX, mouseY, delay,
}: {
  open: boolean; rotZ: number; tx: number;
  mouseX: number; mouseY: number; delay: number;
}) {
  const mr = (mouseX - 0.5) * 6;   // tilt souris ±3 deg
  const mt = (mouseX - 0.5) * 0.06; // translate X ±0.03em

  return (
    <div style={{
      position    : "absolute",
      width       : "calc(1.14em)",
      height      : "0.72em",
      left        : "0.03em",
      bottom      : "0.08em",
      background  : "#FAFAF7",
      borderRadius: "0.025em 0.025em 0.02em 0.02em",
      boxShadow   : "0 -0.01em 0.06em rgba(0,0,0,0.08)",
      transform   : open
        ? `rotateZ(${rotZ + mr * 0.3}deg) translateX(${tx + mt}em) translateY(-0.18em)`
        : `rotateZ(0deg) translateX(0em) translateY(0em)`,
      transition  : open
        ? `transform 0.5s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`
        : "transform 0.35s ease 0ms",
    }}>
      {/* Lignes décoratives "document" */}
      {[0.18, 0.30, 0.42].map(t => (
        <div key={t} style={{
          position  : "absolute",
          top       : `${t * 100}%`,
          left      : "0.08em",
          right     : "0.08em",
          height    : "0.012em",
          background: "rgba(35,35,35,0.08)",
          borderRadius: "1px",
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Dossier Mac — toutes les dimensions en em
   Structure : arrière-plan fixe + feuilles + couvercle complet
───────────────────────────────────────────────────────────── */
function MacFolder({ open, mouseX, mouseY }: {
  open: boolean; mouseX: number; mouseY: number;
}) {
  // Dimensions (héritent du font-size parent clamp 4.5rem→18rem)
  const FW   = "1.2em";   // largeur corps
  const FH   = "0.86em";  // hauteur corps
  const TH   = "0.13em";  // hauteur onglet
  const TW   = "0.44em";  // largeur onglet

  // Ombre portée du dossier
  const shadow = open
    ? "0 0.08em 0.3em rgba(0,0,0,0.22)"
    : "0 0.04em 0.18em rgba(0,0,0,0.18)";

  return (
    /*
      Container :
        - hauteur = TH + FH (onglet + corps)
        - perspective depuis le haut (point de fuite = charnière)
        - overflow visible pour que les feuilles dépassent en haut
    */
    <div style={{
      position         : "relative",
      width            : FW,
      height           : `calc(${TH} + ${FH})`,
      perspective      : "7em",
      perspectiveOrigin: "50% 0%",   // point de fuite au niveau de la charnière
      overflow         : "visible",
    }}>

      {/* ══ ARRIÈRE-PLAN fixe (tab + corps) ══ */}

      {/* Onglet arrière */}
      <div style={{
        position    : "absolute",
        top         : 0,
        left        : 0,
        width       : TW,
        height      : `calc(${TH} + 0.04em)`,
        background  : G_SHADE,
        borderRadius: "0.05em 0.05em 0 0",
        zIndex      : 1,
      }} />

      {/* Corps arrière */}
      <div style={{
        position    : "absolute",
        top         : TH,
        left        : 0,
        width       : FW,
        height      : FH,
        background  : G_DARK,
        borderRadius: "0.02em 0.09em 0.09em 0.09em",
        zIndex      : 1,
        boxShadow   : shadow,
        transition  : "box-shadow 0.4s ease",
      }}>

        {/* ── Feuilles à l'intérieur (dépassent en haut) ── */}
        <Paper open={open} rotZ={-5} tx={-0.08} mouseX={mouseX} mouseY={mouseY} delay={80} />
        <Paper open={open} rotZ={0}  tx={0}     mouseX={mouseX} mouseY={mouseY} delay={50} />
        <Paper open={open} rotZ={5}  tx={0.08}  mouseX={mouseX} mouseY={mouseY} delay={80} />
      </div>

      {/* ══ COUVERCLE complet (onglet + corps) — s'ouvre vers l'arrière ══ */}
      <div style={{
        position              : "absolute",
        top                   : 0,
        left                  : 0,
        width                 : FW,
        height                : `calc(${TH} + ${FH})`,
        zIndex                : 4,
        transformStyle        : "preserve-3d",
        transformOrigin       : "top center",   // charnière tout en haut
        transform             : open ? "rotateX(-170deg)" : "rotateX(0deg)",
        transition            : "transform 0.55s cubic-bezier(0.4,0,0.18,1)",
        backfaceVisibility    : "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}>

        {/* Onglet du couvercle */}
        <div style={{
          position              : "absolute",
          top                   : 0,
          left                  : 0,
          width                 : TW,
          height                : `calc(${TH} + 0.04em)`,
          background            : G,
          borderRadius          : "0.05em 0.05em 0 0",
          backfaceVisibility    : "hidden",
          WebkitBackfaceVisibility: "hidden",
          filter                : "brightness(0.93)",
        }} />

        {/* Corps du couvercle */}
        <div style={{
          position              : "absolute",
          top                   : TH,
          left                  : 0,
          width                 : FW,
          height                : FH,
          background            : G,
          borderRadius          : "0.02em 0.09em 0.09em 0.09em",
          backfaceVisibility    : "hidden",
          WebkitBackfaceVisibility: "hidden",
          overflow              : "hidden",
          display               : "flex",
          alignItems            : "center",
          justifyContent        : "center",
        }}>

          {/* Reflet diagonale */}
          <div style={{
            position     : "absolute",
            inset        : 0,
            background   : "linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 50%)",
            pointerEvents: "none",
          }} />

          {/* "JADE L." gravé — centre */}
          <span style={{
            fontFamily      : "var(--font-londrina-solid)",
            fontWeight      : 900,
            fontSize        : "0.26em",
            letterSpacing   : "0.07em",
            color           : "transparent",
            WebkitTextStroke: "0.09em rgba(255,255,255,0.32)",
            userSelect      : "none",
            position        : "relative",
            zIndex          : 1,
          }}>
            JADE L.
          </span>

          {/* Badge "portfolio" — bas gauche */}
          <div style={{
            position     : "absolute",
            bottom       : "0.09em",
            left         : "0.12em",
            display      : "flex",
            alignItems   : "center",
            padding      : "0.025em 0.07em",
            border       : "0.012em solid rgba(255,255,255,0.45)",
            borderRadius : "0.06em",
            gap          : "0.03em",
          }}>
            <span style={{
              fontFamily   : "var(--font-poppins)",
              fontWeight   : 300,
              fontSize     : "0.55rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color        : "rgba(255,255,255,0.7)",
            }}>
              portfolio
            </span>
          </div>
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

      {/* "pr [dossier] jets" — même taille que le hero */}
      <div
        ref={rowRef}
        style={{
          fontSize      : "clamp(4.5rem, 12vw, 18rem)",
          display       : "flex",
          alignItems    : "flex-end",
          gap           : "0.05em",
          cursor        : "pointer",
          userSelect    : "none",
          lineHeight    : 0.88,
        }}
        onClick={() => navigate("/projects")}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { setOpen(false); setMouse({ x: 0.5, y: 0.5 }); }}
        onMouseMove={handleMouseMove}
      >
        <span style={{
          fontFamily: "var(--font-londrina-solid)",
          fontWeight: 900,
          color     : "#232323",
        }}>
          pr
        </span>

        <div style={{ flexShrink: 0, alignSelf: "flex-end" }}>
          <MacFolder open={open} mouseX={mouse.x} mouseY={mouse.y} />
        </div>

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
