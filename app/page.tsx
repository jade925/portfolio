"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import FolderSection from "@/components/FolderSection";

export default function Home() {
  const [heroReady,    setHeroReady]    = useState(false);
  const [preloaderOut, setPreloaderOut] = useState(false);

  useEffect(() => {
    // Si le site a déjà été chargé cette session → passe le preloader entier
    if (sessionStorage.getItem("siteLoaded")) {
      setHeroReady(true);
      setPreloaderOut(true);
    } else {
      sessionStorage.setItem("siteLoaded", "1");
    }
  }, []);

  return (
    <main>
      {!preloaderOut && (
        <LoadingScreen
          onHeroReady={() => setHeroReady(true)}
          onComplete={() => setPreloaderOut(true)}
        />
      )}
      <Hero loaded={heroReady} />
      <FolderSection />
    </main>
  );
}
