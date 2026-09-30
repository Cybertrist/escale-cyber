"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@/components/icons";
import { getEscale } from "@/lib/escales";
import { errorMessage, points, saveProgress } from "@/lib/pb";
import type { ModuleMeta } from "@/lib/types";
import { ModuleContext } from "./ModuleContext";

type Section = { titre: string; content: React.ReactNode };

export function ModulePlayer({ meta, sections, suivant }: { meta: ModuleMeta; sections: Section[]; suivant: ModuleMeta | null }) {
  const { user } = useAuth();
  const escale = getEscale(meta.escale)!;
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(1);
  const [results, setResults] = useState<Record<string, { score: number; max: number }>>({});
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error" | "anon">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const report = useCallback((id: string, score: number, max: number) => {
    setResults((r) => (r[id]?.score === score && r[id]?.max === max ? r : { ...r, [id]: { score, max } }));
  }, []);
  const ctx = useMemo(() => ({ report }), [report]);

  const total = Object.values(results).reduce((acc, r) => ({ score: acc.score + r.score, max: acc.max + r.max }), { score: 0, max: 0 });
  const pts = points(total);
  const last = step === sections.length - 1;

  function go(i: number) {
    setStep(i);
    setVisited((v) => Math.max(v, i + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function finish() {
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user) {
      setSaveState("anon");
      return;
    }
    setSaveState("saving");
    try {
      await saveProgress(user, { module: meta.key, escale: meta.escale, score: total.score, max: total.max });
      setSaveState("saved");
    } catch (err) {
      setSaveError(errorMessage(err));
      setSaveState("error");
    }
  }

  return (
    <ModuleContext.Provider value={ctx}>
      <div className={`player esc-${meta.escale}`}>
        <header className="player-bar">
          <div className="player-title">
            <Link href={`/escales/${meta.escale}`} className="round-btn" aria-label={`Retour à ${escale.nom}`}><IconArrowLeft size={18} /></Link>
            <div style={{ minWidth: 0 }}>
              <span className="mono">{escale.nom} · {meta.duree} min</span>
              <strong>{meta.titre}</strong>
            </div>
          </div>
          <ol className="stepper" aria-label="Étapes du module">
            {sections.map((s, i) => {
              const state = finished || i < step ? "is-done" : i === step ? "is-now" : "";
              return (
                <li key={s.titre} className={state}>
                  {i > 0 && <span className="sep" aria-hidden="true" />}
                  <button type="button" onClick={() => { setFinished(false); go(i); }} disabled={i >= visited && !finished} aria-current={i === step && !finished ? "step" : undefined}>
                    <span className="n">{state === "is-done" ? <IconCheck size={12} strokeWidth={3.5} /> : i + 1}</span>
                    <span className="lbl">{s.titre}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </header>

        <main className="player-body">
          {finished ? (
            <section className="done-panel">
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <span className="eyebrow" style={{ color: "var(--signal)" }}>Module terminé</span>
                <h2>{pts >= 80 ? "Excellent réflexe." : pts >= 50 ? "Bien joué, quelques points à revoir." : "Pas mal de pièges t'ont eu : refais-le !"}</h2>
                <p>
                  {saveState === "saving" && "Enregistrement de ta progression…"}
                  {saveState === "saved" && "Ta progression est enregistrée. Les points comptent pour ton escale."}
                  {saveState === "anon" && "Tu n'es pas connecté : ce résultat n'est pas enregistré."}
                  {saveState === "error" && `Impossible d'enregistrer : ${saveError}`}
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {suivant ? (
                    <Link href={`/modules/${suivant.key}`} className="btn btn-signal">Module suivant : {suivant.titre} <IconArrowRight size={16} /></Link>
                  ) : (
                    <Link href="/parcours" className="btn btn-signal">Retour à mon parcours <IconArrowRight size={16} /></Link>
                  )}
                  {saveState === "anon" ? (
                    <Link href={`/connexion?suite=/modules/${meta.key}`} className="btn btn-ghost-dark">Se connecter</Link>
                  ) : (
                    <button type="button" className="btn btn-ghost-dark" onClick={() => { setFinished(false); go(0); }}>Revoir le module</button>
                  )}
                </div>
              </div>
              <div className="done-score">
                <b className="num">{pts}</b>
                <span className="mono" style={{ color: "var(--on-ink-dim)", fontSize: 13 }}>POINTS SUR 100</span>
                {total.max > 0 && <span style={{ color: "var(--on-ink-muted)" }}>{Math.round(total.score * 10) / 10} bonnes réponses sur {total.max}</span>}
              </div>
            </section>
          ) : null}

          {sections.map((s, i) => (
            <section key={s.titre} hidden={finished || i !== step} className="prose" aria-label={s.titre}>
              <h2>{s.titre}</h2>
              {s.content}
            </section>
          ))}
        </main>

        {!finished && (
          <footer className="player-foot">
            <div className="player-foot-in">
              <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
                <IconArrowLeft size={16} /> Précédent
              </button>
              <span className="muted num" style={{ fontSize: 14 }}>Étape {step + 1} sur {sections.length}</span>
              {last ? (
                <button type="button" className="btn btn-signal" onClick={finish}>Terminer le module <IconCheck size={16} strokeWidth={3} /></button>
              ) : (
                <button type="button" className="btn btn-ink" onClick={() => go(step + 1)}>
                  {sections[step + 1].titre} <IconArrowRight size={16} />
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </ModuleContext.Provider>
  );
}
