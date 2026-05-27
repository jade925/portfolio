"use client";

import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────
   Digit slot
──────────────────────────────── */
const FONT_SIZE = "clamp(7rem, 22vw, 20rem)";
const DIGIT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-londrina-solid), sans-serif",
  fontWeight: 900, fontSize: FONT_SIZE,
  color: "#EBEAE4", lineHeight: 1,
  letterSpacing: "-0.02em", display: "block", textAlign: "center",
};

function DigitSlot({ digit }: { digit: string }) {
  const [current,   setCurrent]   = useState(digit);
  const [exitDigit, setExitDigit] = useState<string | null>(null);
  const [exitKey,   setExitKey]   = useState(0);
  const [enterKey,  setEnterKey]  = useState(0);
  const [animating, setAnimating] = useState(false);
  const prev = useRef(digit);

  useEffect(() => {
    if (digit === prev.current) return;
    const old = prev.current;
    prev.current = digit;
    setExitKey(k => k + 1);
    setEnterKey(k => k + 1);
    setExitDigit(old);
    setCurrent(digit);
    setAnimating(true);
    const t = setTimeout(() => { setExitDigit(null); setAnimating(false); }, 380);
    return () => clearTimeout(t);
  }, [digit]);

  return (
    <div style={{ position: "relative", overflow: "hidden", fontSize: FONT_SIZE, height: "1.05em", display: "inline-block", minWidth: "0.62em" }}>
      {exitDigit !== null && (
        <span key={`exit-${exitKey}`} className="digit-exit"
          style={{ ...DIGIT_STYLE, position: "absolute", top: 0, left: 0, right: 0 }}>
          {exitDigit}
        </span>
      )}
      <span key={`enter-${enterKey}`} className={animating ? "digit-enter" : ""}
        style={{ ...DIGIT_STYLE, position: animating ? "absolute" : "relative", top: 0, left: 0, right: 0 }}>
        {current}
      </span>
    </div>
  );
}

function toDigits(n: number): [string, string, string] {
  const s = String(n).padStart(3, "0");
  return [s[0], s[1], s[2]];
}

/* ────────────────────────────────
   Lettres du nom
──────────────────────────────── */
const W1 = ["J", "A", "D", "E"];
const W2 = ["L", "E", "L", "I", "E", "V", "R", "E"];
const TOTAL_LETTERS = W1.length + W2.length;

/* ────────────────────────────────
   Composant principal
──────────────────────────────── */
export default function LoadingScreen({
  onHeroReady,
  onComplete,
}: {
  onHeroReady: () => void;
  onComplete: () => void;
}) {
  const randomNum = useRef(Math.floor(Math.random() * 98) + 1).current;
  const steps     = [0, randomNum, 100] as const;

  const [stepIdx,        setStepIdx]        = useState(0);
  const [phase,          setPhase]          = useState<"numbers" | "text">("numbers");
  const [textVisible,    setTextVisible]    = useState(false);
  const [textDescending, setTextDescending] = useState(false); // déclenche la descente
  const [textExiting,    setTextExiting]    = useState(false); // fade-out du texte
  const [textFlipIdx,    setTextFlipIdx]    = useState(-1);
  const [bgExiting,      setBgExiting]      = useState(false); // rideau

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Flip lettre → verte via reflow DOM */
  useEffect(() => {
    if (textFlipIdx < 0 || textFlipIdx >= TOTAL_LETTERS) return;
    const el = letterRefs.current[textFlipIdx];
    if (!el) return;
    el.classList.remove("letter-flip-to-green");
    void el.offsetWidth;
    el.classList.add("letter-flip-to-green");
  }, [textFlipIdx]);

  /* Séquence complète */
  useEffect(() => {
    const NUMS_DONE = 550 + 380 + 500 + 380; // 1810 ms

    const t1 = setTimeout(() => setStepIdx(1), 550);
    const t2 = setTimeout(() => setStepIdx(2), 550 + 380 + 500);
    const t3 = setTimeout(() => setPhase("text"),     NUMS_DONE + 200);
    const t4 = setTimeout(() => setTextVisible(true), NUMS_DONE + 450);

    const t5 = setTimeout(() => {
      /* Descente ET flip partent en même temps */
      setTextDescending(true);

      let idx = 0;
      const next = () => {
        setTextFlipIdx(idx);
        idx++;
        if (idx < TOTAL_LETTERS) {
          setTimeout(next, 70);
        } else {
          /* Toutes les lettres sont vertes — descente probablement terminée aussi */
          setTimeout(() => {
            setTextFlipIdx(-1);
            /* Legère pause au bas, puis tout démarre simultanément */
            setTimeout(() => {
              setTextExiting(true);   // texte fade-out
              setBgExiting(true);     // rideau monte
              onHeroReady();          // Hero commence à se rendre en dessous
              setTimeout(onComplete, 720); // Hero totalement visible → démonte le preloader
            }, 250);
          }, 340);
        }
      };
      next();
    }, NUMS_DONE + 600);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onHeroReady, onComplete]);

  const [d0, d1, d2] = toDigits(steps[stepIdx]);

  /* ── Style du bloc texte selon la phase ── */
  const textWrapStyle: React.CSSProperties = {
    position   : "absolute",
    left       : 0,
    right      : 0,
    top        : "50%",
    /* perspective ici → rotateY des lettres enfant devient un vrai flip 3D */
    perspective: "800px",
    /* Centré → descend en bas (même position que dans le Hero) */
    transform  : textDescending
      ? "translateY(calc(50vh - 240px))"
      : "translateY(-50%)",
    opacity    : textExiting ? 0 : (textVisible ? 1 : 0),
    transition : textExiting
      ? "opacity 0.5s ease"
      : textDescending
        ? "transform 0.95s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.35s ease"
        : "opacity 0.35s ease",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999 }}>

      {/* ── Fond — transite #232323 → #F5F2ED, puis monte comme rideau ── */}
      <div
        key={bgExiting ? "bg-exit" : "bg-on"}
        className={bgExiting ? "curtain-exit" : ""}
        style={{
          position       : "absolute",
          inset          : 0,
          backgroundColor: phase === "numbers" ? "#232323" : "#F5F2ED",
          transition     : "background-color 0.5s ease",
        }}
      />

      {/* ── Contenu ── */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Chiffres */}
        {phase === "numbers" && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.04em" }}>
            <DigitSlot digit={d0} />
            <DigitSlot digit={d1} />
            <DigitSlot digit={d2} />
          </div>
        )}

        {/* Texte JADE LELIEVRE : centré, puis descend en bas avec flip → vert */}
        {phase === "text" && (
          <div style={textWrapStyle}>
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
        )}
      </div>
    </div>
  );
}
