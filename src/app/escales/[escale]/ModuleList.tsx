"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { IconCheck, IconClock, IconLock, IconScreen } from "@/components/icons";
import { useProgress } from "@/components/useProgress";
import { points } from "@/lib/pb";
import type { ModuleMeta } from "@/lib/types";

type LabLite = { id: string; titre: string; resume: string; duree: number; disponible: boolean };

export function ModuleList({ modules, labs, escale }: { modules: ModuleMeta[]; labs: LabLite[]; escale: string }) {
  const { user } = useAuth();
  const { mine } = useProgress();
  const done = new Map((user ? mine : []).filter((p) => p.termine).map((p) => [p.module, p]));

  return (
    <div className={`esc-${escale}`} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h2 style={{ fontSize: 24 }}>Modules</h2>
        {modules.length === 0 ? (
          <p className="muted">Les modules de cette escale sont en cours d&apos;écriture par l&apos;équipe de spécialité.</p>
        ) : (
          <div className="mod-list">
            {modules.map((m, i) => {
              const d = done.get(m.key);
              return (
                <Link key={m.key} href={`/modules/${m.key}`} className="mod-card">
                  <span className="mono" style={{ fontSize: 12, color: "var(--c-text)", letterSpacing: ".06em" }}>MODULE {i + 1}</span>
                  <h3>{m.titre}</h3>
                  <p>{m.resume}</p>
                  <div className="mod-card-foot">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><IconClock size={16} />{m.duree} min</span>
                    {d ? <span className="pill pill-ok"><IconCheck size={12} strokeWidth={3} />Terminé · {points(d)} pts</span> : <span style={{ fontWeight: 700, color: "var(--c-text)" }}>Commencer →</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {labs.length > 0 && (
        <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontSize: 24 }}>Labs</h2>
          <div className="mod-list">
            {labs.map((l) =>
              l.disponible ? (
                <Link key={l.id} href={`/labs/${l.id}`} className="mod-card">
                  <span className="mono" style={{ fontSize: 12, color: "var(--c-text)", letterSpacing: ".06em" }}>LAB</span>
                  <h3>{l.titre}</h3>
                  <p>{l.resume}</p>
                  <div className="mod-card-foot">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><IconScreen size={16} />{l.duree} min</span>
                    {done.has(`lab/${l.id}`) ? <span className="pill pill-ok">Réussi</span> : <span style={{ fontWeight: 700, color: "var(--c-text)" }}>Lancer →</span>}
                  </div>
                </Link>
              ) : (
                <div key={l.id} className="mod-card" style={{ opacity: 0.7 }}>
                  <span className="mono" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: ".06em" }}>LAB · BIENTÔT</span>
                  <h3>{l.titre}</h3>
                  <p>{l.resume}</p>
                  <div className="mod-card-foot"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><IconLock size={16} />En préparation</span></div>
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}
