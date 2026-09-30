import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { IconLock, IconScreen } from "@/components/icons";
import { getEscale } from "@/lib/escales";
import { LABS } from "@/lib/labs";

export const metadata: Metadata = { title: "Labs" };

export default function LabsPage() {
  return (
    <AppShell public>
      <header className="page-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="eyebrow">Labs</span>
          <h1>Mettre les mains dans le cambouis</h1>
          <p className="muted" style={{ maxWidth: "65ch" }}>
            Chaque lab ouvre une session sur un réseau isolé, directement dans le navigateur. Sans serveur de lab configuré,
            une version simulée tourne dans la page.
          </p>
        </div>
      </header>
      <div className="mod-list">
        {LABS.map((l) => {
          const e = getEscale(l.escale)!;
          const body = (
            <>
              <span className="mono" style={{ fontSize: 12, color: "var(--c-text)", letterSpacing: ".06em" }}>{e.nom.toUpperCase()} · {e.specialiteNom.toUpperCase()}</span>
              <h3>{l.titre}</h3>
              <p>{l.resume}</p>
              <div className="mod-card-foot">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {l.disponible ? <IconScreen size={16} /> : <IconLock size={16} />}
                  {l.disponible ? `${l.duree} min` : "En préparation"}
                </span>
                {l.disponible && <span style={{ fontWeight: 700, color: "var(--c-text)" }}>Lancer →</span>}
              </div>
            </>
          );
          return l.disponible ? (
            <Link key={l.id} href={`/labs/${l.id}`} className={`mod-card esc-${l.escale}`}>{body}</Link>
          ) : (
            <div key={l.id} className={`mod-card esc-${l.escale}`} style={{ opacity: 0.7 }}>{body}</div>
          );
        })}
      </div>
    </AppShell>
  );
}
