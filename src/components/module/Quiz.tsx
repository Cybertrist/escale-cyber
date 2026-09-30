"use client";

import { useEffect, useState } from "react";
import { useReport } from "./ModuleContext";

export type QuizQuestion = {
  question: string;
  choix: string[];
  bonne: number; // index de la bonne réponse (0 = première)
  explication?: string;
};

export function Quiz({ id = "quiz", questions }: { id?: string; questions: QuizQuestion[] }) {
  const report = useReport();
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const score = answers.filter((a, i) => a === questions[i].bonne).length;
  const complete = answers.every((a) => a !== null);

  useEffect(() => {
    report(id, checked ? score : 0, questions.length);
  }, [report, id, checked, score, questions.length]);

  return (
    <div className="quiz">
      {questions.map((q, qi) => (
        <div key={qi} className="q-card">
          <fieldset>
            <legend><span className="mono">Q{qi + 1}</span>{q.question}</legend>
            {q.choix.map((c, ci) => {
              const sel = answers[qi] === ci;
              let cls = "q-opt";
              if (checked && ci === q.bonne) cls += " good";
              else if (checked && sel) cls += " bad";
              else if (sel) cls += " sel";
              return (
                <label key={ci} className={cls}>
                  <input
                    type="radio"
                    name={`${id}-q${qi}`}
                    checked={sel}
                    disabled={checked}
                    onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? ci : v)))}
                  />
                  {c}
                </label>
              );
            })}
          </fieldset>
          {checked && q.explication && <div className="q-expl">{q.explication}</div>}
        </div>
      ))}
      {checked ? (
        <div className="q-result">
          <span>Ton score au quiz</span>
          <b className="num">{score} / {questions.length}</b>
          <button type="button" className="btn btn-ghost-dark btn-sm" onClick={() => { setChecked(false); setAnswers(questions.map(() => null)); }}>Recommencer</button>
        </div>
      ) : (
        <button type="button" className="btn btn-ink" style={{ alignSelf: "flex-start" }} disabled={!complete} onClick={() => setChecked(true)}>
          {complete ? "Valider mes réponses" : `Réponds aux ${questions.length} questions`}
        </button>
      )}
    </div>
  );
}
