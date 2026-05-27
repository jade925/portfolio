import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5F2ED] flex flex-col">
      <Navigation />

      {/* ─── Contenu ─── */}
      <div className="flex-1 px-8 md:px-14 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

        {/* Colonne gauche — Titre + bio */}
        <div>
          <p
            className="text-[#4A7C59] tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.7rem" }}
          >
            À propos
          </p>
          <h2
            className="text-[#232323] leading-none mb-10"
            style={{
              fontFamily: "var(--font-londrina-solid)",
              fontWeight: 800,
              fontSize: "clamp(3rem, 8vw, 7rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            Créer,<br />Communiquer,<br />Marquer.
          </h2>

          <div
            className="text-[#232323]/70 space-y-4 max-w-md"
            style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8 }}
          >
            <p>
              Je suis Jade Lelièvre, étudiante en communication et création design.
              Passionnée par l&apos;image de marque, le design graphique et la direction artistique,
              je conçois des expériences visuelles qui ont du sens et de l&apos;impact.
            </p>
            <p>
              Mon approche mêle rigueur stratégique et sensibilité esthétique —
              chaque projet est l&apos;occasion de trouver la juste tension entre forme et fond.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-4 text-[#232323] hover:text-[#4A7C59] transition-colors duration-300 group"
              style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              Voir mes projets
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>

        {/* Colonne droite — Compétences + Infos */}
        <div className="space-y-14">

          {/* Photo placeholder */}
          <div className="w-full aspect-[4/5] bg-[#232323]/8 rounded-sm overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[#232323]/20 tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.65rem" }}
              >
                Photo
              </span>
            </div>
            {/* Coin décoratif */}
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#4A7C59]/40" />
          </div>

          {/* Compétences */}
          <div>
            <p
              className="text-[#4A7C59] tracking-[0.3em] uppercase mb-6"
              style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.65rem" }}
            >
              Compétences
            </p>
            <ul className="space-y-3">
              {[
                "Direction artistique",
                "Identité visuelle & branding",
                "Design graphique",
                "Communication visuelle",
                "Photographie",
                "Adobe CC — Figma",
              ].map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-4 text-[#232323]/80 border-b border-[#232323]/10 pb-3"
                  style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.85rem" }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#4A7C59] shrink-0" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <footer className="px-8 md:px-14 py-6 border-t border-[#232323]/10 flex justify-between items-center">
        <span
          className="text-[#232323]/30 tracking-[0.18em]"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.6rem" }}
        >
          © 2025 Jade Lelièvre
        </span>
        <Link
          href="/"
          className="text-[#232323]/40 hover:text-[#232323] transition-colors tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.6rem" }}
        >
          Accueil
        </Link>
      </footer>
    </main>
  );
}
