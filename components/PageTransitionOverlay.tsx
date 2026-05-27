"use client";

import { useEffect, useRef, useState } from "react";

const W1 = ["J", "A", "D", "E"];
const W2 = ["L", "E", "L", "I", "E", "V", "R", "E"];
const TOTAL = W1.length + W2.length;

export default function PageTransitionOverlay({
  onNavigate,
  onComplete,
}: {
  onNavigate: () => void;
  onComplete: () => void;
}) {
  const [textVisible,  setTextVisible]  = useState(false);
  const [textFlipIdx,  setTextFlipIdx]  = useState(-1);
  const [bgExiting,    setBgExiting]    = useState(false);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Flip lettre — reste noire, pas de changement de couleur */
  useEffect(() => {
    if (textFlipIdx < 0 || textFlipIdx >= TOTAL) return;
    const el = letterRefs.current[textFlipIdx];
    if (!el) return;
    el.classList.remove("letter-flip");
    void el.offsetWidth;
    el.classList.add("letter-flip");
  }, [textFlipIdx]);

  useEffect(() => {
    /* 100 ms → texte fade-in */
    const t1 = setTimeout(() => setTextVisible(true), 100);

    /* 380 ms → flip lettre par lettre */
    const t2 = setTimeout(() => {
      let idx = 0;
      const next = () => {
        setTextFlipIdx(idx);
        idx++;
        if (idx < TOTAL) {
          setTimeout(next, 70);
        } else {
          setTimeout(() => {
            setTextFlipIdx(-1);
            setBgExiting(true); // rideau monte
            onNavigate();       // router.push déclenché simultanément
            setTimeout(onComplete, 720);
          }, 280);
        }
      };
      next();
    }, 380);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onNavigate, onComplete]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>

      {/* Fond beige — monte comme rideau */}
      <div
        key={bgExiting ? "exit" : "on"}
        className={bgExiting ? "curtain-exit" : ""}
        style={{ position: "absolute", inset: 0, backgroundColor: "#F5F2ED" }}
      />

      {/* Texte centré */}
      <div style={{
        position   : "relative",
        zIndex     : 1,
        width      : "100%",
        height     : "100%",
        display    : "flex",
        alignItems : "center",
        justifyContent: "center",
        perspective: "800px",
        opacity    : textVisible ? 1 : 0,
        transition : bgExiting ? "opacity 0.35s ease" : "opacity 0.28s ease",
      }}>
        <h1 className="hero-name" style={{ color: "#232323" }}>
          {W1.map((l, i) => (
            <span key={`w1-${i}`}
              ref={el => { letterRefs.current[i] = el; }}
              style={{ display: "inline-block", backfaceVisibility: "hidden" }}>
              {l}
            </span>
          ))}
          <span style={{ display: "inline-block", width: "0.25em" }} />
          {W2.map((l, i) => (
            <span key={`w2-${i}`}
              ref={el => { letterRefs.current[W1.length + i] = el; }}
              style={{ display: "inline-block", backfaceVisibility: "hidden" }}>
              {l}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}
