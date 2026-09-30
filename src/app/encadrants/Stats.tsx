"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ESCALES, SPECIALITES, type Specialite } from "@/lib/escales";
import { errorMessage, fetchAllProgress, getPb, points } from "@/lib/pb";
import type { AppUser, ProgressRecord } from "@/lib/types";

type Item = { key: string; titre: string; escale: string };

const fmtDate = (d: string) => (d ? new Date(d.replace(" ", "T")).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "–");

export function Stats({ catalog }: { catalog: Item[] }) {
  const { user } = useAuth();
  const [learners, setLearners] = useState<AppUser[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isEncadrant = user?.role === "encadrant";

  useEffect(() => {
    if (!isEncadrant) return;
    Promise.all([
      getPb().collection("users").getFullList<AppUser>({ filter: 'role != "encadrant"', sort: "name" }),
      fetchAllProgress(),
    ])
      .then(([u, p]) => { setLearners(u); setProgress(p); })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [isEncadrant]);

  if (!isEncadrant) {
    return (
      <div className="center-msg">
        <div>
          <h1 style={{ fontSize: 32 }}>Espace réservé aux encadrants</h1>
          <p className="muted">Ce tableau de bord est accessible aux comptes encadrants. Un administrateur peut attribuer ce rôle depuis l&apos;interface PocketBase.</p>
        </div>
      </div>
    );
  }

  const done = progress.filter((p) => p.termine);
  const modulesOnly = done.filter((p) => !p.module.startsWith("lab/"));
  const avg = (list: ProgressRecord[]) => (list.length ? Math.round(list.reduce((s, p) => s + points(p), 0) / list.length) : 0);
  const activeUsers = new Set(done.map((p) => p.user));
  const moduleCount = catalog.filter((c) => !c.key.startsWith("lab/")).length;

  const specs = (Object.keys(SPECIALITES) as Specialite[]).map((s) => {
    const us = learners.filter((l) => l.specialite === s);
    const ps = modulesOnly.filter((p) => p.specialite === s);
    return { s, inscrits: us.length, actifs: new Set(ps.map((p) => p.user)).size, termines: ps.length, moyenne: avg(ps) };
  });

  const byModule = catalog.map((c) => {
    const ps = done.filter((p) => p.module === c.key);
    return { ...c, termines: ps.length, moyenne: avg(ps) };
  });

  const byLearner = learners.map((l) => {
    const ps = modulesOnly.filter((p) => p.user === l.id);
    const last = done.filter((p) => p.user === l.id).map((p) => p.updated).sort().at(-1) ?? "";
    return { ...l, termines: ps.length, points: ps.reduce((s, p) => s + points(p), 0), last };
  }).sort((a, b) => b.points - a.points);

  return (
    <>
      <header className="page-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="eyebrow">Tableau de bord encadrants</span>
          <h1>Résultats de la plateforme</h1>
        </div>
      </header>
      {error && <div className="banner" role="alert">{error}</div>}

      <div className="kpis num">
        <div className="card kpi"><b>{loading ? "…" : learners.length}</b><span>apprenants inscrits</span></div>
        <div className="card kpi"><b>{loading ? "…" : activeUsers.size}</b><span>ont terminé au moins un module</span></div>
        <div className="card kpi"><b>{loading ? "…" : modulesOnly.length}</b><span>modules terminés ({moduleCount} au catalogue)</span></div>
        <div className="card kpi"><b>{loading ? "…" : `${avg(modulesOnly)} %`}</b><span>score moyen</span></div>
      </div>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 22 }}>Par spécialité</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Spécialité</th><th className="num">Inscrits</th><th className="num">Actifs</th><th className="num">Modules terminés</th><th className="num">Score moyen</th></tr></thead>
            <tbody>
              {specs.map((r) => (
                <tr key={r.s} className={`esc-${SPECIALITES[r.s].escale}`}>
                  <td><span className="swatch" />{SPECIALITES[r.s].nom}</td>
                  <td className="num">{r.inscrits}</td><td className="num">{r.actifs}</td><td className="num">{r.termines}</td><td className="num">{r.termines ? `${r.moyenne} %` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 22 }}>Par module</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Module</th><th>Escale</th><th className="num">Terminé par</th><th className="num">Score moyen</th></tr></thead>
            <tbody>
              {byModule.map((m) => (
                <tr key={m.key} className={`esc-${m.escale}`}>
                  <td>{m.titre}</td>
                  <td><span className="swatch" />{ESCALES.find((e) => e.id === m.escale)?.nom}</td>
                  <td className="num">{m.termines}</td>
                  <td className="num">{m.termines ? `${m.moyenne} %` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 22 }}>Apprenants</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nom</th><th>Spécialité</th><th className="num">Modules</th><th className="num">Points</th><th className="num">Dernière activité</th></tr></thead>
            <tbody>
              {byLearner.length === 0 && !loading && (
                <tr><td colSpan={5} className="muted">Aucun apprenant inscrit pour l&apos;instant.</td></tr>
              )}
              {byLearner.map((l) => (
                <tr key={l.id}>
                  <td>{l.name || l.email}</td>
                  <td>{l.specialite ? SPECIALITES[l.specialite as Specialite]?.nom : "–"}</td>
                  <td className="num">{l.termines} / {moduleCount}</td>
                  <td className="num">{l.points}</td>
                  <td className="num">{fmtDate(l.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
