"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OfflineBanner, useAuth } from "@/components/AuthProvider";
import { IconArrowLeft, IconArrowRight, IconCheck, IconScreen } from "@/components/icons";
import { getEscale } from "@/lib/escales";
import type { Lab } from "@/lib/labs";
import { errorMessage, saveProgress } from "@/lib/pb";
import { HmiSim, type HmiEvent } from "./HmiSim";

const ALERTE_CHOIX = [
  { id: "responsable", label: "Mon responsable d'exploitation et le référent cyber", ok: true },
  { id: "personne", label: "Personne : j'ai changé le mot de passe, c'est réglé", ok: false },
  { id: "prestataire", label: "Le prestataire qui a installé l'IHM, par mail", ok: false },
  { id: "groupe", label: "Le groupe de discussion de l'équipe, pour prévenir tout le monde", ok: false },
];

const ALERTE_RETOUR: Record<string, string> = {
  personne: "Changer le mot de passe ne dit pas ce que l'intrus a fait d'autre. Il faut une analyse.",
  prestataire: "Pas en premier : ta hiérarchie et le référent cyber décident de qui impliquer.",
  groupe: "Une alerte de sécurité ne se diffuse pas largement : l'attaquant lit peut-être ces canaux.",
};

function useCountdown(minutes: number) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
}

export function LabRunner({ lab, guacUrl }: { lab: Lab; guacUrl: string | null }) {
  const { user } = useAuth();
  const escale = getEscale(lab.escale)!;
  const [done, setDone] = useState<Set<string>>(new Set());
  const [wrongAlert, setWrongAlert] = useState<string | null>(null);
  const [finished, setFinished] = useState<null | "saving" | "saved" | "anon" | string>(null);
  const timer = useCountdown(lab.duree);

  const mark = (id: string) => setDone((d) => (d.has(id) ? d : new Set(d).add(id)));
  const toggle = (id: string) => setDone((d) => { const n = new Set(d); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  async function finish() {
    if (!user) return setFinished("anon");
    setFinished("saving");
    try {
      await saveProgress(user, { module: `lab/${lab.id}`, escale: lab.escale, score: done.size, max: lab.objectifs.length });
      setFinished("saved");
    } catch (err) {
      setFinished(errorMessage(err));
    }
  }

  return (
    <div className={`player esc-${lab.escale}`}>
      <header className="player-bar">
        <div className="player-title">
          <Link href={`/escales/${lab.escale}`} className="round-btn" aria-label={`Retour à ${escale.nom}`}><IconArrowLeft size={18} /></Link>
          <div>
            <span className="mono">{escale.nom} · lab</span>
            <strong>{lab.titre}</strong>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--mint)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mint)" }} />
            {guacUrl ? "Session active · réseau isolé" : "Mode simulé dans le navigateur"}
          </span>
          <span className="mono num" style={{ fontSize: 14, color: "var(--on-ink-muted)" }}>⏱ {timer}</span>
        </div>
      </header>

      <div className="lab-layout">
        <aside className="lab-side">
          <OfflineBanner />
          <section className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="eyebrow" style={{ fontSize: 12 }}>Le contexte</span>
            <p style={{ color: "var(--text-2)" }}>{lab.resume} L&apos;IHM est joignable depuis le réseau bureautique et personne n&apos;a touché à ses réglages depuis l&apos;installation.</p>
          </section>

          <section className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong style={{ fontSize: 18 }}>Objectifs</strong>
              <span className="muted num" style={{ fontSize: 14 }}>{done.size} / {lab.objectifs.length}</span>
            </div>
            {lab.objectifs.map((o) => {
              const isDone = done.has(o.id);
              const inner = (
                <>
                  <span className="box">{isDone && <IconCheck size={13} strokeWidth={3.5} />}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
                    <strong>{o.titre}</strong>
                    <span>{o.aide}</span>
                    {o.id === "alerte" && !isDone && !guacUrl && (
                      <span className="goal-choices">
                        {ALERTE_CHOIX.map((c) => (
                          <button key={c.id} type="button" className={wrongAlert === c.id ? "wrong" : ""}
                            onClick={() => { if (c.ok) { mark("alerte"); setWrongAlert(null); } else setWrongAlert(c.id); }}>
                            {c.label}
                          </button>
                        ))}
                        {wrongAlert && <span style={{ color: "var(--ko-fg)", fontSize: 13 }}>{ALERTE_RETOUR[wrongAlert]}</span>}
                      </span>
                    )}
                  </span>
                </>
              );
              // Avec un vrai lab Guacamole, l'apprenant coche lui-même ; en mode simulé, la page valide toute seule.
              return guacUrl ? (
                <button key={o.id} type="button" className={`goal${isDone ? " done" : ""}`} onClick={() => toggle(o.id)} aria-pressed={isDone}>{inner}</button>
              ) : (
                <div key={o.id} className={`goal${isDone ? " done" : ""}`}>{inner}</div>
              );
            })}

            {finished === null ? (
              <button type="button" className="btn btn-ink btn-block" onClick={finish} disabled={done.size === 0}>Terminer le lab</button>
            ) : (
              <div className="card" style={{ padding: 16, background: "var(--card-soft)", display: "flex", flexDirection: "column", gap: 10 }}>
                <strong>{done.size === lab.objectifs.length ? "Lab réussi" : `${done.size} objectif${done.size > 1 ? "s" : ""} sur ${lab.objectifs.length}`}</strong>
                <span className="muted" style={{ fontSize: 14 }}>
                  {finished === "saving" ? "Enregistrement…" : finished === "saved" ? "Résultat enregistré." : finished === "anon" ? "Connecte-toi pour enregistrer ton résultat." : finished}
                </span>
                <Link href="/parcours" className="btn btn-signal btn-sm" style={{ alignSelf: "flex-start" }}>Retour au parcours <IconArrowRight size={14} /></Link>
              </div>
            )}
          </section>
        </aside>

        <section className="lab-screen" aria-label="Écran du lab">
          <div className="lab-screen-bar">
            <IconScreen size={16} />
            IHM-POMPAGE · 10.20.0.12 · {guacUrl ? "via Guacamole" : "simulation"}
          </div>
          {guacUrl ? (
            <iframe src={guacUrl} title={`Session Guacamole : ${lab.titre}`} allow="clipboard-read; clipboard-write" />
          ) : (
            <HmiSim onEvent={(e: HmiEvent) => mark(e)} />
          )}
        </section>
      </div>
    </div>
  );
}
