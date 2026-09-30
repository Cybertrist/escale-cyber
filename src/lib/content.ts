import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { ESCALE_IDS, type EscaleId } from "./escales";
import type { ModuleMeta } from "./types";

// Les modules sont écrits par les équipes de spécialité dans content/modules/<escale>/<slug>.mdx
const ROOT = path.join(process.cwd(), "content", "modules");
const SAFE = /^[a-z0-9-]+$/;

export type ModuleSection = { titre: string; source: string };

async function readModuleFile(escale: EscaleId, slug: string) {
  const raw = await fs.readFile(path.join(ROOT, escale, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const meta: ModuleMeta = {
    key: `${escale}/${slug}`,
    escale,
    slug,
    titre: String(data.titre ?? slug),
    resume: String(data.resume ?? ""),
    duree: Number(data.duree ?? 10),
    ordre: Number(data.ordre ?? 99),
    ...(data.lab ? { lab: String(data.lab) } : {}),
  };
  return { meta, content };
}

export async function listModules(): Promise<ModuleMeta[]> {
  const all: ModuleMeta[] = [];
  for (const escale of ESCALE_IDS) {
    let files: string[] = [];
    try {
      files = await fs.readdir(path.join(ROOT, escale));
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      const slug = file.slice(0, -4);
      if (!SAFE.test(slug)) continue;
      const { meta } = await readModuleFile(escale, slug);
      all.push(meta);
    }
  }
  return all.sort(
    (a, b) => ESCALE_IDS.indexOf(a.escale) - ESCALE_IDS.indexOf(b.escale) || a.ordre - b.ordre,
  );
}

// Chaque titre de niveau 1 (# Contexte, # Simulation…) devient une étape du module.
export async function getModule(escale: string, slug: string) {
  if (!ESCALE_IDS.includes(escale as EscaleId) || !SAFE.test(slug)) return null;
  try {
    const { meta, content } = await readModuleFile(escale as EscaleId, slug);
    const sections: ModuleSection[] = [];
    const parts = content.split(/^# (.+)$/m);
    for (let i = 1; i < parts.length; i += 2) {
      sections.push({ titre: parts[i].trim(), source: (parts[i + 1] ?? "").trim() });
    }
    if (sections.length === 0) sections.push({ titre: meta.titre, source: content.trim() });
    return { meta, sections };
  } catch {
    return null;
  }
}
