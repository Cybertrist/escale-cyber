import type { EscaleId } from "./escales";

export type ModuleMeta = {
  key: string; // "centrale/faux-technicien"
  escale: EscaleId;
  slug: string;
  titre: string;
  resume: string;
  duree: number; // minutes
  ordre: number;
  lab?: string;
};

export type ProgressRecord = {
  id: string;
  user: string;
  module: string;
  escale: string;
  specialite: string;
  score: number;
  max: number;
  termine: boolean;
  updated: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  specialite?: string;
  role?: string;
};
