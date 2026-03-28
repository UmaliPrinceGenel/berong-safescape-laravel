import React, { createContext, useContext, useEffect, useState } from "react";

interface SettingsContextType {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  toggleReduceMotion: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const saved = localStorage.getItem("safescape-reduce-motion");
    if (saved !== null) {
      setReduceMotionState(saved === "true");
    } else {
      // Fallback to OS preference
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReduceMotionState(prefersReduced);
    }
  }, []);

  const setReduceMotion = (value: boolean) => {
    setReduceMotionState(value);
    localStorage.setItem("safescape-reduce-motion", String(value));
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
  };

  return (
    <SettingsContext.Provider value={{ reduceMotion, setReduceMotion, toggleReduceMotion }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
