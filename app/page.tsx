"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";

export default function Home() {
  // heroReady  → Hero commence à se rendre SOUS le rideau (fade-in simultané)
  // preloaderOut → LoadingScreen est démonté (rideau terminé)
  const [heroReady,    setHeroReady]    = useState(false);
  const [preloaderOut, setPreloaderOut] = useState(false);

  return (
    <main>
      {!preloaderOut && (
        <LoadingScreen
          onHeroReady={() => setHeroReady(true)}
          onComplete={() => setPreloaderOut(true)}
        />
      )}
      <Hero loaded={heroReady} />
    </main>
  );
}
