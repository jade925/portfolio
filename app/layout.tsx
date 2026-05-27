import type { Metadata } from "next";
import { Londrina_Solid, Poppins } from "next/font/google";
import "./globals.css";

const londrinaSolid = Londrina_Solid({
  variable: "--font-londrina-solid",
  subsets: ["latin"],
  weight: ["400", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jade Lelièvre — Communication & Création Design",
  description: "Portfolio de Jade Lelièvre, spécialiste en communication et création design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${londrinaSolid.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
