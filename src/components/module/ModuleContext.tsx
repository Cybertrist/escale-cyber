"use client";

import { createContext, useContext } from "react";

// Les activités (quiz, boîte mail, scénario) remontent leur score au lecteur de module.
export type ModuleCtx = { report: (id: string, score: number, max: number) => void };

export const ModuleContext = createContext<ModuleCtx | null>(null);

export function useReport() {
  const ctx = useContext(ModuleContext);
  return ctx?.report ?? (() => {});
}
