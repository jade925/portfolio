"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";

type TransitionContextType = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({ navigate: () => {} });

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const router  = useRouter();
  const hrefRef = useRef("");

  const navigate = useCallback((href: string) => {
    if (active) return;
    hrefRef.current = href;
    setActive(true);
  }, [active]);

  const handleNavigate  = useCallback(() => { router.push(hrefRef.current); }, [router]);
  const handleComplete  = useCallback(() => { setActive(false); }, []);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      {active && (
        <PageTransitionOverlay
          onNavigate={handleNavigate}
          onComplete={handleComplete}
        />
      )}
    </TransitionContext.Provider>
  );
}
