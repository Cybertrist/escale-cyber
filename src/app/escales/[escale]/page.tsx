import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { EscaleIcon, IconArrowLeft } from "@/components/icons";
import { ESCALES, getEscale } from "@/lib/escales";
import { listModules } from "@/lib/content";
import { LABS } from "@/lib/labs";
import { ModuleList } from "./ModuleList";

export const dynamicParams = false;

export function generateStaticParams() {
  return ESCALES.map((e) => ({ escale: e.id }));
}

export async function generateMetadata(props: PageProps<"/escales/[escale]">): Promise<Metadata> {
  const { escale } = await props.params;
  return { title: getEscale(escale)?.nom ?? "Escale" };
}

export default async function EscalePage(props: PageProps<"/escales/[escale]">) {
  const { escale } = await props.params;
  const e = getEscale(escale);
  if (!e) notFound();
  const modules = (await listModules()).filter((m) => m.escale === e.id);
  const labs = LABS.filter((l) => l.escale === e.id);

  return (
    <AppShell public>
      <Link href="/escales" className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 15 }}>
        <IconArrowLeft size={16} /> Toutes les escales
      </Link>
      <section className={`esc-hero esc-${e.id}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="mono">ESCALE {e.numero} · {e.specialiteNom.toUpperCase()}</span>
          <h1>{e.nom}</h1>
          <p>{e.accroche}</p>
        </div>
        <EscaleIcon escale={e.id} size={96} strokeWidth={1.2} />
      </section>
      <ModuleList modules={modules} labs={labs.map((l) => ({ id: l.id, titre: l.titre, resume: l.resume, duree: l.duree, disponible: l.disponible }))} escale={e.id} />
    </AppShell>
  );
}
