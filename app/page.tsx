"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import FolderSection from "@/components/FolderSection";

/*
  Variable module-level : se remet à false à chaque rechargement de page
  (le JS est ré-exécuté), mais reste true lors des navigations SPA.
  → preloader joue à chaque F5/Cmd+R, mais pas quand on revient de /projects.
*/
let hasPlayedPreloader = false;

export default function Home() {
  const [heroReady,    setHeroReady]    = useState(false);
  const [preloaderOut, setPreloaderOut] = useState(false);

  useEffect(() => {
    if (hasPlayedPreloader) {
      setHeroReady(true);
      setPreloaderOut(true);
    }
  }, []);

  return (
    <main>
      {!preloaderOut && (
        <LoadingScreen
          onHeroReady={() => setHeroReady(true)}
          onComplete={() => {
            setPreloaderOut(true);
            hasPlayedPreloader = true;
          }}
        />
      )}
      <Hero loaded={heroReady} />
      <FolderSection />
    </main>
  );
}
