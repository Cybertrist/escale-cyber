import { escaleOf } from "./escales";
import { points } from "./pb";
import type { ProgressRecord } from "./types";

export type BadgeId =
  | "premiers-pas"
  | "socle"
  | "escale-bouclee"
  | "sans-faute"
  | "explorateur"
  | "laborantin"
  | "capitaine";

export type Badge = { id: BadgeId; nom: string; description: string; couleur: string; texte: string };

export const BADGES: Badge[] = [
  { id: "premiers-pas", nom: "Premiers pas", description: "Terminer un premier module", couleur: "#1f5fd6", texte: "#fff" },
  { id: "socle", nom: "Socle solide", description: "Terminer tout le tronc commun", couleur: "#0e1b2c", texte: "#f2b33d" },
  { id: "escale-bouclee", nom: "Escale bouclée", description: "Terminer tous les modules de ton escale", couleur: "#f2b33d", texte: "#0e1b2c" },
  { id: "sans-faute", nom: "Sans faute", description: "Obtenir 100 % à un module", couleur: "#1f8a5a", texte: "#fff" },
  { id: "explorateur", nom: "Explorateur", description: "Terminer un module d'une autre escale", couleur: "#6d3fd1", texte: "#fff" },
  { id: "laborantin", nom: "Laborantin", description: "Réussir un lab", couleur: "#c2410c", texte: "#fff" },
  { id: "capitaine", nom: "Capitaine", description: "Terminer tous les modules de la plateforme", couleur: "#16263b", texte: "#7fd3a8" },
];

export function computeBadges(
  progress: Pick<ProgressRecord, "module" | "termine" | "score" | "max">[],
  catalog: { key: string; escale: string }[],
  specialite: string | undefined,
): Set<BadgeId> {
  const done = progress.filter((p) => p.termine);
  const doneKeys = new Set(done.map((p) => p.module));
  const own = escaleOf(specialite);
  const got = new Set<BadgeId>();
  const all = (list: { key: string }[]) => list.length > 0 && list.every((m) => doneKeys.has(m.key));

  if (done.some((p) => !p.module.startsWith("lab/"))) got.add("premiers-pas");
  if (all(catalog.filter((m) => m.escale === "tronc-commun"))) got.add("socle");
  if (own && all(catalog.filter((m) => m.escale === own))) got.add("escale-bouclee");
  if (done.some((p) => !p.module.startsWith("lab/") && p.max > 0 && points(p) === 100)) got.add("sans-faute");
  if (catalog.some((m) => m.escale !== "tronc-commun" && m.escale !== own && doneKeys.has(m.key))) got.add("explorateur");
  if (done.some((p) => p.module.startsWith("lab/") && points(p) >= 75)) got.add("laborantin");
  if (all(catalog)) got.add("capitaine");
  return got;
}
