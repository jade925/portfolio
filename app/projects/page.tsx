import Navigation from "@/components/Navigation";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Projet 01",
    category: "Identité visuelle",
    year: "2025",
    color: "#232323",
  },
  {
    id: 2,
    title: "Projet 02",
    category: "Direction artistique",
    year: "2025",
    color: "#4A7C59",
  },
  {
    id: 3,
    title: "Projet 03",
    category: "Communication",
    year: "2024",
    color: "#232323",
  },
  {
    id: 4,
    title: "Projet 04",
    category: "Design graphique",
    year: "2024",
    color: "#4A7C59",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#F5F2ED] flex flex-col">
      <Navigation />

      {/* ─── Header ─── */}
      <div className="px-8 md:px-14 pt-8 pb-16">
        <p
          className="text-[#4A7C59] tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.7rem" }}
        >
          Sélection
        </p>
        <h2
          className="text-[#232323] leading-none"
          style={{
            fontFamily: "var(--font-londrina-solid)",
            fontWeight: 800,
            fontSize: "clamp(3rem, 8vw, 7rem)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          Projets
        </h2>
      </div>

      {/* ─── Grille de projets ─── */}
      <div className="flex-1 px-8 md:px-14 pb-24">

        {/* Liste style editorial */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="group border-t border-[#232323]/15 py-8 flex items-center justify-between cursor-pointer hover:bg-[#232323]/[0.02] transition-colors duration-300 -mx-8 md:-mx-14 px-8 md:px-14"
            >
              {/* Numéro + Titre */}
              <div className="flex items-baseline gap-8">
                <span
                  className="text-[#232323]/25 tabular-nums"
                  style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.1em" }}
                >
                  0{i + 1}
                </span>
                <h3
                  className="text-[#232323] group-hover:text-[#4A7C59] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-londrina-solid)",
                    fontWeight: 800,
                    fontSize: "clamp(1.6rem, 4vw, 3.5rem)",
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {project.title}
                </h3>
              </div>

              {/* Catégorie + Année + Flèche */}
              <div className="flex items-center gap-8 md:gap-14">
                <span
                  className="hidden md:block text-[#232323]/50 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.7rem" }}
                >
                  {project.category}
                </span>
                <span
                  className="text-[#232323]/40 tabular-nums"
                  style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.75rem" }}
                >
                  {project.year}
                </span>
                <span
                  className="text-[#232323]/30 group-hover:text-[#4A7C59] group-hover:translate-x-1 transition-all duration-300"
                  style={{ fontSize: "1rem" }}
                >
                  →
                </span>
              </div>
            </div>
          ))}
          {/* Bordure finale */}
          <div className="border-t border-[#232323]/15" />
        </div>

        {/* Placeholder vignettes (layout optionnel) */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="aspect-[3/4] rounded-sm overflow-hidden relative group cursor-pointer"
              style={{ backgroundColor: `${project.color}08` }}
            >
              {/* Fond coloré au hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: `${project.color}10` }}
              />
              {/* Label */}
              <div className="absolute bottom-4 left-4">
                <p
                  className="text-[#232323]/30 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-poppins)", fontWeight: 300, fontSize: "0.55rem" }}
                >
                  {project.category}
                </p>
                <p
                  className="text-[#232323]/60 mt-1"
                  style={{ fontFamily: "var(--font-londrina-solid)", fontWeight: 900, fontSize: "0.9rem" }}
                >
                  {project.title}
                </p>
              </div>
              {/* Coin décoratif */}
              <div
                className="absolute top-4 right-4 w-4 h-4 border-t border-r opacity-30 group-hover:opacity-80 transition-opacity duration-300"
                style={{ borderColor: project.color }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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
