import type { EscaleId } from "./escales";

export type Lab = {
  id: string;
  escale: EscaleId;
  titre: string;
  resume: string;
  duree: number;
  disponible: boolean;
  // Chemin de la connexion dans Guacamole (ex. "#/client/MQBjAHBvc3RncmVzcWw"), utilisé si NEXT_PUBLIC_GUACAMOLE_URL est défini.
  guacamole?: string;
  objectifs: { id: string; titre: string; aide: string }[];
};

export const LABS: Lab[] = [
  {
    id: "automate-pompage",
    escale: "centrale",
    titre: "L'automate au mot de passe d'usine",
    resume: "L'IHM d'une station de pompage n'a jamais été reconfigurée. Quelqu'un s'est connecté cette nuit.",
    duree: 20,
    disponible: true,
    guacamole: "",
    objectifs: [
      { id: "connexion", titre: "Te connecter à l'IHM", aide: "Beaucoup d'équipements sortent d'usine avec admin / admin. Et celui-ci ?" },
      { id: "journal", titre: "Repérer l'action suspecte", aide: "Onglet Journal : clique sur l'entrée qui t'inquiète." },
      { id: "motdepasse", titre: "Changer le mot de passe admin", aide: "Onglet Comptes, 12 caractères minimum." },
      { id: "alerte", titre: "Alerter la bonne personne", aide: "Qui préviens-tu en premier ?" },
    ],
  },
  {
    id: "poste-piege",
    escale: "usine",
    titre: "Le poste de l'atelier",
    resume: "Une clé USB a été branchée sur le poste de contrôle qualité. Que s'est-il passé ?",
    duree: 20,
    disponible: false,
    objectifs: [],
  },
  {
    id: "robot-distant",
    escale: "atelier",
    titre: "Le robot qui bouge tout seul",
    resume: "Un bras robotisé reçoit des ordres qui ne viennent pas de l'atelier.",
    duree: 25,
    disponible: false,
    objectifs: [],
  },
  {
    id: "camera-chantier",
    escale: "chantier",
    titre: "La caméra de chantier",
    resume: "La caméra qui surveille la base vie est visible par n'importe qui sur Internet.",
    duree: 15,
    disponible: false,
    objectifs: [],
  },
];

export function getLab(id: string): Lab | undefined {
  return LABS.find((l) => l.id === id);
}
