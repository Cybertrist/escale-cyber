"use client";

import { useEffect, useState } from "react";
import { useReport } from "./ModuleContext";

export type ScenarioNoeud = {
  texte?: string;
  choix?: { label: string; suivant: string }[];
  fin?: "bon" | "moyen" | "mauvais";
  bilan?: string;
};

const FIN_TITRE = { bon: "Bonne décision", moyen: "Pas idéal, mais limité", mauvais: "Incident" } as const;
const FIN_SCORE = { bon: 1, moyen: 0.5, mauvais: 0 } as const;

// Histoire à embranchements : chaque nœud propose des choix qui mènent à d'autres nœuds, jusqu'à une fin.
export function Scenario({ id = "scenario", depart = "debut", noeuds }: { id?: string; depart?: string; noeuds: Record<string, ScenarioNoeud> }) {
  const report = useReport();
  const [path, setPath] = useState<{ node: string; choice?: string }[]>([{ node: depart }]);
  const current = noeuds[path[path.length - 1].node];
  const fin = current?.fin;

  useEffect(() => {
    report(id, fin ? FIN_SCORE[fin] : 0, 1);
  }, [report, id, fin]);

  if (!current) return <div className="banner">Nœud de scénario introuvable : {path[path.length - 1].node}</div>;

  const depth = Math.min(path.length, 4);

  return (
    <div className="scenario">
      <div className="sc-track" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <i key={i} className={i < depth ? "on" : ""} />)}
      </div>

      {path.length > 1 && (
        <div className="sc-history">
          {path.slice(0, -1).map((_, i) => (
            <span key={i}>→ {path[i + 1].choice}</span>
          ))}
        </div>
      )}

      {current.texte && <p className="sc-text">{current.texte}</p>}

      {current.choix && !fin && (
        <div className="sc-choices">
          {current.choix.map((c, i) => (
            <button key={c.suivant + i} type="button" className="sc-choice" onClick={() => setPath((p) => [...p, { node: c.suivant, choice: c.label }])}>
              <span className="k">{String.fromCharCode(65 + i)}</span>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {fin && (
        <>
          <div className={`sc-end ${fin}`} role="status">
            <strong>{FIN_TITRE[fin]}</strong>
            {current.bilan && <span>{current.bilan}</span>}
          </div>
          <button type="button" className="btn btn-ghost-dark btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setPath([{ node: depart }])}>
            Rejouer le scénario
          </button>
        </>
      )}
    </div>
  );
}
