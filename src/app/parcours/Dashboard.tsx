"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { initials } from "@/components/AppShell";
import { BadgeIcon, EscaleIcon, IconArrowRight, IconCheck } from "@/components/icons";
import { useProgress } from "@/components/useProgress";
import { BADGES, computeBadges } from "@/lib/badges";
import { ESCALES, SPECIALITES, escaleOf, getEscale, type Specialite } from "@/lib/escales";
import { points } from "@/lib/pb";
import type { ModuleMeta } from "@/lib/types";

export function Dashboard({ catalog }: { catalog: ModuleMeta[] }) {
  const { user } = useAuth();
  const { mine, everyone, loading, error } = useProgress({ all: true });
  if (!user) return null;

  const ownId = escaleOf(user.specialite) ?? "centrale";
  const own = getEscale(ownId)!;
  const done = new Map(mine.filter((p) => p.termine).map((p) => [p.module, p]));
  const tronc = catalog.filter((m) => m.escale === "tronc-commun");
  const ownModules = catalog.filter((m) => m.escale === ownId);
  const parcours = [...tronc, ...ownModules];
  const next = parcours.find((m) => !done.has(m.key));
  const doneInParcours = parcours.filter((m) => done.has(m.key)).length;
  const pct = parcours.length ? Math.round((100 * doneInParcours) / parcours.length) : 0;
  const myPoints = [...done.values()].reduce((s, p) => s + points(p), 0);
  const badges = computeBadges(mine, catalog, user.specialite);

  // Classement : points cumulés par spécialité, et rang de l'utilisateur dans la sienne.
  const bySpec = new Map<string, number>();
  const byUser = new Map<string, { spec: string; pts: number }>();
  for (const p of everyone) {
    if (!p.termine || !p.specialite) continue;
    bySpec.set(p.specialite, (bySpec.get(p.specialite) ?? 0) + points(p));
    const u = byUser.get(p.user) ?? { spec: p.specialite, pts: 0 };
    u.pts += points(p);
    byUser.set(p.user, u);
  }
  const specRanking = (Object.keys(SPECIALITES) as Specialite[])
    .map((s) => ({ s, pts: bySpec.get(s) ?? 0 }))
    .sort((a, b) => b.pts - a.pts);
  const maxSpec = Math.max(1, ...specRanking.map((r) => r.pts));
  const peers = [...byUser.entries()].filter(([, v]) => v.spec === user.specialite).sort((a, b) => b[1].pts - a[1].pts);
  const rank = peers.findIndex(([id]) => id === user.id) + 1;

  const ring = 2 * Math.PI * 50;
  const firstName = (user.name || user.email).split(" ")[0];

  return (
    <>
      <header className="page-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="muted">{user.specialite ? SPECIALITES[user.specialite as Specialite]?.nom : "Apprenant"}</span>
          <h1>{doneInParcours === 0 ? `Bienvenue à bord, ${firstName}.` : `Bon retour, ${firstName}.`}</h1>
        </div>
        <div className="avatar" aria-hidden="true">{initials(user.name, user.email)}</div>
      </header>

      {error && <div className="banner" role="alert">{error}</div>}

      <div className="dash-grid">
        <div className="dash-main">
          <section className={`feature esc-${ownId}`}>
            <div className="feature-body">
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span className="pill pill-signal">Ton escale</span>
                <span className="mono" style={{ fontSize: 12, color: "var(--on-ink-dim)" }}>ESCALE {own.numero} · {own.specialiteNom.toUpperCase()}</span>
              </div>
              <h2>{own.nom}</h2>
              <p>{next ? <>Prochain module : <strong style={{ color: "var(--on-ink)" }}>{next.titre}</strong>. {next.resume}</> : "Tu as terminé tout ton parcours. Va explorer les autres escales !"}</p>
              <div style={{ marginTop: "auto", display: "flex", gap: 12, flexWrap: "wrap" }}>
                {next ? (
                  <Link href={`/modules/${next.key}`} className="btn btn-signal">
                    {done.size === 0 ? "Commencer" : "Continuer"} : {next.titre} <IconArrowRight size={16} />
                  </Link>
                ) : (
                  <Link href="/escales" className="btn btn-signal">Explorer les escales <IconArrowRight size={16} /></Link>
                )}
              </div>
            </div>
            <div className="feature-list">
              {ownModules.map((m, i) => {
                const d = done.get(m.key);
                const isNext = next?.key === m.key;
                return (
                  <Link key={m.key} href={`/modules/${m.key}`} className={`mod-row${isNext ? " current" : ""}`}>
                    <span className={`dot-state ${d ? "dot-done" : isNext ? "dot-now" : "dot-todo"}`}>
                      {d ? <IconCheck size={14} strokeWidth={3} /> : i + 1}
                    </span>
                    <span>
                      <strong style={{ fontSize: 15 }}>{m.titre}</strong>
                      <small>{d ? `Terminé · ${points(d)} pts` : isNext ? "À faire maintenant" : `${m.duree} min`}</small>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3 style={{ fontSize: 22 }}>Tronc commun</h3>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ok)" }}>
                {tronc.filter((m) => done.has(m.key)).length} sur {tronc.length} terminés
              </span>
            </div>
            <div className="tiles3">
              {tronc.map((m) => {
                const d = done.get(m.key);
                return (
                  <Link key={m.key} href={`/modules/${m.key}`} className="tile">
                    <strong>{m.titre}</strong>
                    <span>{m.resume}</span>
                    <div className="bar" style={{ ["--c" as string]: "var(--ok)" }}><i style={{ width: d ? "100%" : "0%" }} /></div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontSize: 22 }}>Explorer les autres escales</h3>
            <div className="tiles3">
              {ESCALES.filter((e) => e.id !== "tronc-commun" && e.id !== ownId).map((e) => (
                <Link key={e.id} href={`/escales/${e.id}`} className={`esc-link esc-${e.id}`}>
                  <span className="esc-ico"><EscaleIcon escale={e.id} size={26} /></span>
                  <span><strong>{e.nom}</strong><small>{e.specialiteNom}</small></span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="dash-side">
          <section className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div className="ring-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line-soft)" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={ring} strokeDashoffset={ring * (1 - pct / 100)} transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset .6s ease" }} />
              </svg>
              <b className="num">{loading ? "…" : `${pct} %`}</b>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="num">
              <div className="stat"><b>{myPoints} pts</b><span>{doneInParcours} modules sur {parcours.length}</span></div>
              <div className="stat"><b>{rank > 0 ? `${rank}${rank === 1 ? "er" : "e"}` : "–"}</b><span>{rank > 0 ? `sur ${peers.length} en ${own.specialiteNom}` : "pas encore classé"}</span></div>
            </div>
          </section>

          <section className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 22 }}>Badges</h3>
              <span className="muted" style={{ fontSize: 14 }}>{badges.size} sur {BADGES.length}</span>
            </div>
            <div className="badge-list">
              {BADGES.map((b) => {
                const has = badges.has(b.id);
                return (
                  <div key={b.id} className="badge-row">
                    <span className={`badge${has ? "" : " locked"}`} style={has ? { ["--b" as string]: b.couleur, ["--b-on" as string]: b.texte } : undefined}>
                      <BadgeIcon badge={b.id} size={24} />
                    </span>
                    <div><strong style={{ color: has ? "var(--text)" : "var(--muted)" }}>{b.nom}</strong><span>{b.description}</span></div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontSize: 22 }}>Classement des escales</h3>
            <div className="lb num">
              {specRanking.map(({ s, pts }) => (
                <div key={s} className={`lb-row esc-${SPECIALITES[s].escale}${s === user.specialite ? " me" : ""}`}>
                  <div><span>{SPECIALITES[s].nom}</span><span>{pts.toLocaleString("fr-FR")} pts</span></div>
                  <div className="bar"><i style={{ width: `${(100 * pts) / maxSpec}%` }} /></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
