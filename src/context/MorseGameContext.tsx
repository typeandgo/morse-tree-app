import { createContext, useContext, type ReactNode } from "react";
import { useMorseGame } from "@/hooks/useMorseGame";

type MorseGameContextValue = ReturnType<typeof useMorseGame>;

const MorseGameContext = createContext<MorseGameContextValue | null>(null);

export function MorseGameProvider({ children }: { children: ReactNode }) {
  const value = useMorseGame();
  return (
    <MorseGameContext.Provider value={value}>{children}</MorseGameContext.Provider>
  );
}

export function useMorseGameContext(): MorseGameContextValue {
  const ctx = useContext(MorseGameContext);
  if (!ctx) throw new Error("useMorseGameContext must be used within MorseGameProvider");
  return ctx;
}
