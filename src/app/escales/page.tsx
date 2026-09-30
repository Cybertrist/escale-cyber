import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { EscaleIcon } from "@/components/icons";
import { ESCALES } from "@/lib/escales";
import { listModules } from "@/lib/content";

export const metadata: Metadata = { title: "Les escales" };

export default async function EscalesPage() {
  const modules = await listModules();
  return (
    <AppShell public>
      <header className="page-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="eyebrow">Carte des escales</span>
          <h1>Où veux-tu embarquer ?</h1>
        </div>
      </header>
      <div className="escale-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {ESCALES.map((e) => {
          const n = modules.filter((m) => m.escale === e.id).length;
          return (
            <Link key={e.id} href={`/escales/${e.id}`} className={`escale-card esc-${e.id}`}>
              <div className="escale-card-top" style={{ height: 140 }}>
                <EscaleIcon escale={e.id} size={56} strokeWidth={1.4} />
                <span className="mono">ESCALE {e.numero}</span>
              </div>
              <div className="escale-card-body">
                <span className="escale-spec">{e.specialiteNom}</span>
                <h3 style={{ fontSize: 24 }}>{e.nom}</h3>
                <p style={{ fontSize: 15, color: "var(--text-2)" }}>{e.accroche}</p>
                <span className="escale-cta">{n} module{n > 1 ? "s" : ""} →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
