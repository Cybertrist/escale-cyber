export type EscaleId = "tronc-commun" | "usine" | "atelier" | "centrale" | "chantier";
export type Specialite = "gi" | "meca" | "ge" | "gc";

export type Escale = {
  id: EscaleId;
  numero: string;
  nom: string;
  specialite: Specialite | null;
  specialiteNom: string;
  accroche: string;
  themes: string[];
};

export const ESCALES: Escale[] = [
  {
    id: "tronc-commun",
    numero: "00",
    nom: "Tronc commun",
    specialite: null,
    specialiteNom: "Toutes spécialités",
    accroche: "Les réflexes de base que tout ingénieur doit avoir, quel que soit son terrain.",
    themes: ["Mots de passe", "Phishing", "Mises à jour"],
  },
  {
    id: "usine",
    numero: "01",
    nom: "L'usine",
    specialite: "gi",
    specialiteNom: "Génie Industriel",
    accroche: "Une ligne de production s'arrête aussi à cause d'un clic. Supply chain, ERP, clés USB : tout part de là.",
    themes: ["Commande fournisseur piégée", "Clé USB trouvée sur le parking", "Rançongiciel sur la ligne"],
  },
  {
    id: "atelier",
    numero: "02",
    nom: "L'atelier robotique",
    specialite: "meca",
    specialiteNom: "Mécatronique",
    accroche: "Robots, capteurs et systèmes embarqués : quand le logiciel pilote la matière, une faille devient physique.",
    themes: ["Firmware modifié", "Capteurs usurpés sur le bus CAN", "Prise de contrôle à distance"],
  },
  {
    id: "centrale",
    numero: "03",
    nom: "La centrale",
    specialite: "ge",
    specialiteNom: "Génie Énergétique",
    accroche: "Supervision, télémaintenance, automates : les installations énergétiques sont des cibles de choix.",
    themes: ["Supervision exposée sur Internet", "Faux technicien de télémaintenance", "Automate au mot de passe par défaut"],
  },
  {
    id: "chantier",
    numero: "04",
    nom: "Le chantier connecté",
    specialite: "gc",
    specialiteNom: "Génie Civil",
    accroche: "Maquettes BIM, drones, bâtiments intelligents : le chantier est devenu un système d'information.",
    themes: ["Maquette BIM partagée", "Caméra et drone de chantier", "Faux mail du maître d'ouvrage"],
  },
];

export const ESCALE_IDS = ESCALES.map((e) => e.id);

export const SPECIALITES: Record<Specialite, { nom: string; escale: EscaleId }> = {
  gi: { nom: "Génie Industriel", escale: "usine" },
  meca: { nom: "Mécatronique", escale: "atelier" },
  ge: { nom: "Génie Énergétique", escale: "centrale" },
  gc: { nom: "Génie Civil", escale: "chantier" },
};

export function getEscale(id: string): Escale | undefined {
  return ESCALES.find((e) => e.id === id);
}

export function escaleOf(specialite: string | null | undefined): EscaleId | null {
  if (specialite && specialite in SPECIALITES) return SPECIALITES[specialite as Specialite].escale;
  return null;
}
