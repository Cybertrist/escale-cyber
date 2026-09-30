"use client";

import { useEffect, useState } from "react";
import { IconFlag, IconPaperclip } from "@/components/icons";
import { useReport } from "./ModuleContext";

export type FauxMail = {
  de: string;
  adresse: string;
  heure: string;
  objet: string;
  corps: string;
  phishing: boolean;
  indices: string[];
  bouton?: string;
  pieceJointe?: string;
};

function initialsOf(name: string) {
  return name.split(/[\s·-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function FausseBoiteMail({ id = "boite", boite = "boite de réception", mails }: { id?: string; boite?: string; mails: FauxMail[] }) {
  const report = useReport();
  const [sel, setSel] = useState(0);
  const [verdicts, setVerdicts] = useState<(boolean | null)[]>(() => mails.map(() => null));
  const correct = verdicts.filter((v, i) => v !== null && v === mails[i].phishing).length;
  const treated = verdicts.filter((v) => v !== null).length;

  useEffect(() => {
    report(id, correct, mails.length);
  }, [report, id, correct, mails.length]);

  const cur = mails[sel];
  const v = verdicts[sel];
  const right = v !== null && v === cur.phishing;

  function judge(isPhish: boolean) {
    setVerdicts((all) => all.map((x, i) => (i === sel ? isPhish : x)));
  }

  return (
    <div className="mailbox">
      <div className="mb-list">
        <div className="mb-head">
          <strong>Boîte de réception</strong>
          <span className="mono muted" style={{ fontSize: 12 }}>{boite}</span>
        </div>
        {mails.map((m, i) => {
          const mv = verdicts[i];
          const ok = mv !== null && mv === m.phishing;
          return (
            <button key={i} type="button" className={`mb-item${i === sel ? " active" : ""}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
              <span className="mb-item-top"><strong>{m.de}</strong><span>{m.heure}</span></span>
              <span className="mb-subj">{m.objet}</span>
              <span className="mb-prev">{m.corps.split("\n").find((l) => l.trim() && !/^(bonjour|salut|madame|monsieur)/i.test(l.trim())) ?? ""}</span>
              {mv !== null && (
                <span className={`pill ${ok ? "pill-ok" : "pill-ko"}`} style={{ alignSelf: "flex-start" }}>
                  {mv ? "Signalé" : "Légitime"} · {ok ? "correct" : "à revoir"}
                </span>
              )}
            </button>
          );
        })}
        <div className="mb-score">
          <span>{treated} / {mails.length} traités</span>
          <span>Bonnes réponses <b className="num">{correct}</b></span>
        </div>
      </div>

      <div className="mb-read">
        <div className="mb-read-head">
          <h4>{cur.objet}</h4>
          <div className="mb-from">
            <span className="ini">{initialsOf(cur.de)}</span>
            <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <strong>{cur.de}</strong>
              <span className="addr">{cur.adresse}</span>
            </span>
            <span className="muted" style={{ marginLeft: "auto", fontSize: 13 }}>{cur.heure}</span>
          </div>
        </div>
        <div className="mb-body">{cur.corps}</div>
        {cur.pieceJointe && <span className="mb-attach"><IconPaperclip size={16} />{cur.pieceJointe}</span>}
        {cur.bouton && <span className="mb-fake-btn" aria-label="Bouton contenu dans le mail (désactivé)">{cur.bouton}</span>}

        {v !== null && (
          <div className={`mb-feedback ${right ? "mb-ok" : "mb-ko"}`} role="status">
            <strong>
              {right
                ? cur.phishing ? "Bien vu, c'était un piège." : "Exact, ce mail est légitime."
                : cur.phishing ? "Raté : ce mail était un piège." : "Fausse alerte : ce mail était légitime."}
            </strong>
            <ul>{cur.indices.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        )}

        <div className="mb-actions">
          <button type="button" className="btn btn-ghost" onClick={() => judge(false)}>C&apos;est légitime</button>
          <button type="button" className="btn btn-ink" onClick={() => judge(true)}>
            <IconFlag size={16} style={{ color: "var(--signal)" }} /> Signaler comme phishing
          </button>
          {v !== null && sel < mails.length - 1 && (
            <button type="button" className="btn btn-signal" onClick={() => setSel(sel + 1)}>Mail suivant</button>
          )}
        </div>
      </div>
    </div>
  );
}
