"use client";

import { useEffect, useState } from "react";

export type HmiEvent = "connexion" | "journal" | "motdepasse";

const JOURNAL = [
  { heure: "03:12", texte: "Consigne débit P-02 modifiée : 48 → 95 m³/h", suspect: true },
  { heure: "03:11", texte: "Connexion admin depuis 10.20.4.77", suspect: true },
  { heure: "02:40", texte: "Ronde automatique : RAS", suspect: false },
  { heure: "01:40", texte: "Ronde automatique : RAS", suspect: false },
  { heure: "22:05", texte: "Déconnexion operateur (poste supervision)", suspect: false },
  { heure: "21:58", texte: "Acquittement alarme niveau haut R-2 (operateur)", suspect: false },
];

// IHM de supervision simulée, utilisée quand aucun serveur Guacamole n'est configuré.
export function HmiSim({ onEvent }: { onEvent: (e: HmiEvent) => void }) {
  const [logged, setLogged] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<"vue" | "journal" | "comptes">("vue");
  const [adminPwd, setAdminPwd] = useState("admin");
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [level, setLevel] = useState(72);

  // La pompe P-02 tourne trop vite : la cuve se vide doucement.
  useEffect(() => {
    const t = setInterval(() => setLevel((l) => (l > 38 ? l - 1 : 72)), 1500);
    return () => clearInterval(t);
  }, []);

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const u = String(f.get("hmi-user") ?? "").trim();
    const p = String(f.get("hmi-pass") ?? "");
    if (u === "admin" && p === adminPwd) {
      setLogged(true);
      setLoginError(null);
      onEvent("connexion");
    } else {
      setLoginError("Identifiants refusés.");
    }
  }

  function flag(i: number) {
    const ok = JOURNAL[i].suspect;
    setFlags((f) => ({ ...f, [i]: ok }));
    if (ok) onEvent("journal");
  }

  function changePwd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p1 = String(f.get("new-pass") ?? "");
    const p2 = String(f.get("new-pass2") ?? "");
    if (p1 !== p2) return setPwdMsg({ ok: false, text: "Les deux saisies ne correspondent pas." });
    if (p1.length < 12) return setPwdMsg({ ok: false, text: "12 caractères minimum." });
    if (/admin|password|motdepasse|1234/i.test(p1)) return setPwdMsg({ ok: false, text: "Trop prévisible : évite admin, 1234, password…" });
    if (!/[a-zA-Z]/.test(p1) || !/\d/.test(p1)) return setPwdMsg({ ok: false, text: "Mélange lettres et chiffres (une phrase de passe fonctionne très bien)." });
    setAdminPwd(p1);
    setPwdMsg({ ok: true, text: "Mot de passe administrateur modifié." });
    e.currentTarget.reset();
    onEvent("motdepasse");
  }

  if (!logged) {
    return (
      <div className="hmi">
        <div className="hmi-top"><span>AUTOMATIS PX-200 · IHM station Kerlann</span><span className="mono" style={{ fontWeight: 400 }}>firmware 2.1.4</span></div>
        <div className="hmi-pane">
          <form className="hmi-box hmi-login" onSubmit={login}>
            <strong>Connexion opérateur</strong>
            <label htmlFor="hmi-user">Utilisateur<input id="hmi-user" name="hmi-user" autoComplete="off" /></label>
            <label htmlFor="hmi-pass">Mot de passe<input id="hmi-pass" name="hmi-pass" type="password" autoComplete="off" /></label>
            {loginError && <span className="hmi-err" role="alert">{loginError}</span>}
            <button type="submit" className="hbtn">Se connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="hmi">
      <div className="hmi-top">
        <span>STATION KERLANN · Supervision</span>
        <span className="mono" style={{ fontWeight: 400 }}>Utilisateur : admin</span>
      </div>
      <div className="hmi-tabs" role="tablist">
        {(["vue", "journal", "comptes"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t === "vue" ? "Vue générale" : t === "journal" ? "Journal" : "Comptes"}
          </button>
        ))}
      </div>

      {tab === "vue" && (
        <div className="hmi-pane" style={{ alignItems: "flex-end", justifyContent: "space-around", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div className="tank" style={{ height: 260 }}><i style={{ height: `${level}%` }} /></div>
            <strong style={{ fontSize: 14 }}>Cuve C-1</strong>
            <span className="mono num" style={{ fontSize: 13 }}>{level} % · {Math.round(level * 7.5)} m³</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="pump" style={{ background: "#3c9a5f", color: "#fff" }}>P-01</div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: 13 }}><strong>Marche</strong><span className="mono">48 m³/h</span></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="pump" style={{ background: "#e0a526" }}>P-02</div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: 13 }}><strong>Débit anormal</strong><span className="mono">95 m³/h</span></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div className="tank" style={{ height: 180 }}><i style={{ height: `${Math.min(96, 34 + (72 - level))}%` }} /></div>
            <strong style={{ fontSize: 14 }}>Réservoir R-2</strong>
            <span className="mono num" style={{ fontSize: 13 }}>{Math.min(96, 34 + (72 - level))} %</span>
          </div>
        </div>
      )}

      {tab === "journal" && (
        <div className="hmi-pane" style={{ flexDirection: "column" }}>
          <div className="hmi-box">
            <strong style={{ fontSize: 14 }}>Journal des événements · cette nuit</strong>
            <span style={{ fontSize: 13, color: "#4a5563" }}>Clique sur une entrée pour la signaler comme suspecte.</span>
            <div className="log">
              {JOURNAL.map((j, i) => (
                <button key={i} type="button" onClick={() => flag(i)} className={i in flags ? (flags[i] ? "flag-ok" : "flag-ko") : ""}>
                  {j.heure}  {j.texte}
                  {i in flags && <span style={{ fontFamily: "var(--f-body)", fontWeight: 600 }}> · {flags[i] ? "suspect, bien vu" : "activité normale"}</span>}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#4a5563" }}>Plan d&apos;adressage : postes de supervision en 10.20.0.x, bureautique en 10.20.1.x à 10.20.3.x.</span>
          </div>
        </div>
      )}

      {tab === "comptes" && (
        <div className="hmi-pane">
          <div className="hmi-box" style={{ flex: "1 1 260px" }}>
            <strong style={{ fontSize: 14 }}>Comptes</strong>
            <div className={`acc-row${adminPwd === "admin" ? " weak" : ""}`}><span>admin</span><span>{adminPwd === "admin" ? "mot de passe d'usine" : "modifié aujourd'hui"}</span></div>
            <div className="acc-row"><span>operateur</span><span>modifié il y a 8 mois</span></div>
          </div>
          <form className="hmi-box" style={{ flex: "1 1 280px" }} onSubmit={changePwd}>
            <strong style={{ fontSize: 14 }}>Changer le mot de passe admin</strong>
            <label htmlFor="new-pass" style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, fontWeight: 600 }}>Nouveau mot de passe<input id="new-pass" name="new-pass" type="password" autoComplete="new-password" /></label>
            <label htmlFor="new-pass2" style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, fontWeight: 600 }}>Confirmation<input id="new-pass2" name="new-pass2" type="password" autoComplete="new-password" /></label>
            {pwdMsg && <span className={pwdMsg.ok ? "hmi-ok" : "hmi-err"} role="status">{pwdMsg.text}</span>}
            <button type="submit" className="hbtn">Enregistrer</button>
          </form>
        </div>
      )}
    </div>
  );
}
