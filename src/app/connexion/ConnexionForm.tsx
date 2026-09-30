"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OfflineBanner, useAuth } from "@/components/AuthProvider";
import { Logo } from "@/components/icons";
import { SPECIALITES, type Specialite } from "@/lib/escales";
import { errorMessage, getPb } from "@/lib/pb";

const SPEC_ESCALE: Record<Specialite, string> = { gi: "usine", meca: "atelier", ge: "centrale", gc: "chantier" };

export function ConnexionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, logout } = useAuth();
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const suiteParam = params.get("suite");
  const suite = suiteParam && suiteParam.startsWith("/") && !suiteParam.startsWith("//") ? suiteParam : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const pb = getPb();
    setBusy(true);
    try {
      if (mode === "inscription") {
        const specialite = String(form.get("specialite") ?? "");
        if (!specialite) throw new Error("Choisis ta spécialité.");
        if (password.length < 8) throw new Error("Le mot de passe doit faire au moins 8 caractères.");
        await pb.collection("users").create({
          name: String(form.get("name") ?? "").trim(),
          email,
          password,
          passwordConfirm: password,
          specialite,
          role: "apprenant",
        });
      }
      const auth = await pb.collection("users").authWithPassword(email, password);
      const target = suite ?? (auth.record.role === "encadrant" ? "/encadrants" : "/parcours");
      router.push(target);
    } catch (err) {
      setError(err instanceof Error && !("status" in err) ? err.message : errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <Link href="/" className="logo"><Logo />Escale Cyber</Link>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="eyebrow" style={{ color: "var(--signal)" }}>Embarquement</span>
          <h1>Ton escale t&apos;attend.</h1>
          <p>Crée ton compte avec ta spécialité : ton parcours démarre par le tronc commun, puis tu rejoins l&apos;escale de ton futur métier.</p>
        </div>
        <span className="mono" style={{ fontSize: 12, color: "var(--on-ink-dim)" }}>ENSIBS · Cyberdéfense 5A · Promo 2027</span>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <OfflineBanner />
          {user ? (
            <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <strong>Tu es connecté en tant que {user.name || user.email}.</strong>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={user.role === "encadrant" ? "/encadrants" : "/parcours"} className="btn btn-ink">Continuer</Link>
                <button type="button" className="btn btn-ghost" onClick={logout}>Changer de compte</button>
              </div>
            </div>
          ) : (
            <>
              <div className="tabs" role="tablist">
                <button type="button" role="tab" aria-selected={mode === "connexion"} className={mode === "connexion" ? "on" : ""} onClick={() => setMode("connexion")}>Se connecter</button>
                <button type="button" role="tab" aria-selected={mode === "inscription"} className={mode === "inscription" ? "on" : ""} onClick={() => setMode("inscription")}>Créer un compte</button>
              </div>

              <form className="form" onSubmit={onSubmit}>
                {mode === "inscription" && (
                  <label className="field" htmlFor="name">Prénom et nom
                    <input id="name" name="name" required autoComplete="name" placeholder="Louise Martin" />
                  </label>
                )}
                <label className="field" htmlFor="email">Adresse mail
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="prenom.nom@etud.univ-ubs.fr" />
                </label>
                <label className="field" htmlFor="password">Mot de passe
                  <input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "inscription" ? "new-password" : "current-password"} />
                </label>
                {mode === "inscription" && (
                  <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend style={{ marginBottom: 6 }}>Ta spécialité</legend>
                    <div className="spec-pick">
                      {(Object.keys(SPECIALITES) as Specialite[]).map((s) => (
                        <label key={s} className={`esc-${SPEC_ESCALE[s]}`}>
                          <input type="radio" name="specialite" value={s} required />
                          {SPECIALITES[s].nom}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {error && <div className="form-error" role="alert">{error}</div>}
                <button type="submit" className="btn btn-ink btn-lg btn-block" disabled={busy}>
                  {busy ? "Un instant…" : mode === "connexion" ? "Se connecter" : "Créer mon compte"}
                </button>
              </form>

              <div className="demo-hint">
                Comptes de démonstration : <code>apprenant@escale.local</code> et <code>encadrant@escale.local</code>, mot de passe <code>Escale2027!</code>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
