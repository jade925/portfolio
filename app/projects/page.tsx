"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

const PROJECTS = [
  { id: 1,  slug: "ethikwear",       title: "Éthikwear",         category: "Identité visuelle",    year: "2025", image: "/projets/ethikwear.jpg"      },
  { id: 2,  slug: "appartstudy",     title: "Appart'study",      category: "Direction artistique", year: "2025", image: "/projets/appartstudy.jpg"    },
  { id: 3,  slug: "piscineo",        title: "Piscineo",          category: "Design digital",       year: "2024", image: "/projets/piscineo.jpg"       },
  { id: 4,  slug: "superheroes",     title: "Affiche superhéro", category: "Affiche",              year: "2024", image: "/projets/superheroes.png"    },
  { id: 5,  slug: "barz",            title: "Barz",              category: "Identité visuelle",    year: "2025", image: "/projets/barz.png"           },
  { id: 6,  slug: "queen",           title: "QUEEN",             category: "Direction artistique", year: "2025", image: "/projets/queen.png"          },
  { id: 7,  slug: "jobymatch",       title: "JobyMatch",         category: "Design UI",            year: "2026", image: "/projets/jobymatch.png"      },
  { id: 8,  slug: "stade-bordelais", title: "Stade Bordelais",   category: "Communication",        year: "2025", image: "/projets/stade-bordelais.png"},
  { id: 9,  slug: "brandboost",      title: "Brandboost",        category: "Identité visuelle",    year: "2025", image: "/projets/brandboost.png"     },
  { id: 10, slug: "expo-ia",         title: "Expo photo & IA",   category: "Communication",        year: "2025", image: "/projets/expo-ia.png"        },
];

/*
  Principe de l'arc :
  - Chaque carte calcule son Y en fonction de sa position ACTUELLE sur l'écran
  - Carte au centre de l'écran → haut de l'arc (translateY = 0)
  - Carte sur les bords → descend (translateY = dist² × MAX_Y)
  ⇒ Au scroll, chaque carte monte en s'approchant du centre puis redescend en partant
*/

const MAX_Y   = 130; // chute max aux bords (px)
const MAX_ROT = 7;   // rotation max aux bords (deg)

export default function ProjectsPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    const hint    = hintRef.current;
    if (!section || !track) return;

    /* ── Met à jour la position de chaque carte selon son X courant ── */
    const updateCards = (translateX: number) => {
      const cx = window.innerWidth / 2;
      track.style.transform = `translateX(${translateX}px)`;

      /*
        el.offsetLeft est relatif au parent positionné (le conteneur absolut),
        pas au track. Le translateX du track déplace visuellement toutes les
        cartes d'autant → cardCenterX = translateX + offsetLeft + halfWidth
      */
      Array.from(track.children).forEach((child) => {
        const el  = child as HTMLElement;
        const cardCenterX = translateX + el.offsetLeft + el.offsetWidth / 2;
        const dist = (cardCenterX - cx) / cx; // −∞ à +∞, 0 = centre écran
        const d    = Math.max(-2.5, Math.min(2.5, dist));
        el.style.transform = `translateY(${d * d * MAX_Y}px) rotate(${d * MAX_ROT}deg)`;
      });
    };

    /* ── Initialise padding, hauteur de section, état courant ── */
    const setup = () => {
      // Centre la 1ère carte : padding latéral = (viewport - 1 carte) / 2
      const cardW = (track.children[0] as HTMLElement)?.offsetWidth || 192;
      const pad   = Math.max(0, (window.innerWidth - cardW) / 2);
      track.style.paddingLeft  = `${pad}px`;
      track.style.paddingRight = `${pad}px`;

      // Forcer le reflow en lisant une propriété layout avant de mesurer scrollWidth
      void track.offsetWidth;

      const maxPan = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${maxPan + window.innerHeight}px`;

      const scrolled = window.scrollY - (section.offsetTop || 0);
      const progress = maxPan > 0 ? Math.max(0, Math.min(1, scrolled / maxPan)) : 0;
      updateCards(-progress * maxPan);
      if (hint) hint.style.opacity = progress > 0.05 ? "0" : "1";
    };

    /* ── Handler scroll ── */
    const onScroll = () => {
      const maxPan = Math.max(0, track.scrollWidth - window.innerWidth);
      if (maxPan <= 0) return;
      const scrolled = window.scrollY - (section.offsetTop || 0);
      const progress = Math.max(0, Math.min(1, scrolled / maxPan));
      updateCards(-progress * maxPan);
      if (hint) hint.style.opacity = progress > 0.05 ? "0" : "1";
    };

    setup();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setup);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <main style={{ background: "#F5F2ED" }}>
      <div ref={sectionRef}>

        {/* ── Fenêtre sticky ── */}
        <div style={{
          position: "sticky",
          top     : 0,
          height  : "100vh",
          overflow: "hidden",
        }}>

          {/* Navigation */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
            <Navigation />
          </div>

          {/* Titre bas-gauche */}
          <div style={{
            position     : "absolute",
            bottom       : "2.8rem",
            left         : "2.8rem",
            zIndex       : 10,
            pointerEvents: "none",
          }}>
            <p style={{
              fontFamily   : "var(--font-poppins)",
              fontWeight   : 300,
              fontSize     : "0.65rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color        : "rgba(35,35,35,0.38)",
              marginBottom : "0.2rem",
            }}>Sélection</p>
            <h1 style={{
              fontFamily   : "var(--font-londrina-solid)",
              fontWeight   : 900,
              fontSize     : "clamp(2.2rem, 5vw, 4.5rem)",
              color        : "#232323",
              lineHeight   : 1,
              textTransform: "uppercase",
            }}>Projets</h1>
          </div>

          {/* Hint scroll */}
          <div ref={hintRef} style={{
            position     : "absolute",
            bottom       : "3rem",
            right        : "2.8rem",
            zIndex       : 10,
            display      : "flex",
            alignItems   : "center",
            gap          : "0.5rem",
            transition   : "opacity 0.4s ease",
            pointerEvents: "none",
          }}>
            <span style={{
              fontFamily   : "var(--font-poppins)",
              fontWeight   : 300,
              fontSize     : "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color        : "rgba(35,35,35,0.32)",
            }}>Défiler</span>
            <span style={{ color: "rgba(35,35,35,0.32)", fontSize: "0.85rem" }}>→</span>
          </div>

          {/* ── Conteneur de l'arc ── */}
          {/*
            top: 80px  → sous la nav
            bottom: 100px → au-dessus du titre
            Le track est centré verticalement dans cet espace
          */}
          <div style={{
            position  : "absolute",
            top       : "80px",
            left      : 0,
            right     : 0,
            bottom    : "220px",
            display   : "flex",
            alignItems: "center",
          }}>
            <div
              ref={trackRef}
              style={{
                display    : "flex",
                alignItems : "center",
                gap        : "1.4vw",
                willChange : "transform",
                flexShrink : 0,
              }}
            >
              {PROJECTS.map((project) => (
                <div key={project.id} style={{ flexShrink: 0 }}>
                  <Link href={`/projects/${project.slug}`} style={{ display: "block", textDecoration: "none" }}>
                    <div
                      style={{
                        width       : "clamp(140px, 15vw, 230px)",
                        aspectRatio : "2 / 3",
                        borderRadius: "0.45rem",
                        overflow    : "hidden",
                        position    : "relative",
                        background  : "#1a1a1a",
                        cursor      : "pointer",
                        transition  : "box-shadow 0.35s ease",
                        boxShadow   : "0 8px 32px rgba(0,0,0,0.14)",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.25)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.14)"; }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 140px, 230px"
                        style={{ objectFit: "cover" }}
                      />
                      <div style={{
                        position  : "absolute",
                        inset     : 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
                      }} />
                      <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem" }}>
                        <p style={{
                          fontFamily   : "var(--font-poppins)",
                          fontWeight   : 300,
                          fontSize     : "0.52rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color        : "rgba(255,255,255,0.52)",
                          marginBottom : "0.22rem",
                        }}>{project.category} · {project.year}</p>
                        <p style={{
                          fontFamily: "var(--font-londrina-solid)",
                          fontWeight: 900,
                          fontSize  : "0.95rem",
                          color     : "#fff",
                          lineHeight: 1.15,
                        }}>{project.title}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
