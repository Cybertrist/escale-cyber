import Link from "next/link";
import { EscaleIcon, IconArrowRight, Logo } from "@/components/icons";
import { ESCALES } from "@/lib/escales";
import { listModules } from "@/lib/content";

export default async function Home() {
  const modules = await listModules();
  const escales = ESCALES.filter((e) => e.id !== "tronc-commun");

  return (
    <>
      <header className="hero">
        <nav className="topnav" aria-label="Navigation du site">
          <Link href="/" className="logo"><Logo />Escale Cyber</Link>
          <div className="topnav-links">
            <a href="#escales">Les escales</a>
            <a href="#fonctionnement">Comment ça marche</a>
            <a href="#labs">Labs</a>
            <Link href="/encadrants">Encadrants</Link>
            <Link href="/connexion" className="btn btn-sm btn-outline-signal">Se connecter</Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <span className="eyebrow">ENSIBS Lorient · Sensibilisation cybersécurité</span>
            <h1>Chaque métier a ses failles. Apprends à les repérer.</h1>
            <p className="hero-lead">
              Usine, atelier, centrale, chantier : des scénarios tirés de ton futur quotidien d&apos;ingénieur, en modules courts,
              avec des labs à manipuler directement dans le navigateur.
            </p>
            <div className="hero-actions">
              <Link href="/parcours" className="btn btn-lg btn-signal">Commencer mon parcours <IconArrowRight size={18} /></Link>
              <Link href="/modules/centrale/faux-technicien" className="btn btn-lg btn-ghost-dark">Essayer un module</Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hv-card hv-dark hv-1">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--on-ink-dim)" }}>SUPERVISION · POMPE P-02</span>
                <span className="pill pill-signal">Alarme</span>
              </div>
              <div className="bars">
                <span style={{ height: "42%" }} /><span style={{ height: "58%" }} /><span style={{ height: "50%" }} />
                <span className="hot" style={{ height: "96%" }} /><span style={{ height: "64%" }} />
              </div>
              <span style={{ fontSize: 14, color: "var(--on-ink-muted)" }}>Consigne de débit modifiée à distance à 03:12</span>
            </div>
            <div className="hv-card hv-light hv-2">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dfe7f1", display: "grid", placeItems: "center", fontWeight: 700, color: "var(--blue)" }}>AI</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: 15 }}>Automatis Industrie</strong>
                  <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>support@automatis-<span className="mark">l</span>ndustrie.com</span>
                </div>
              </div>
              <strong style={{ fontSize: 17 }}>URGENT : mise à jour firmware de vos automates</strong>
              <span style={{ fontSize: 14, color: "var(--text-2)" }}>Une faille critique a été détectée. Installez le correctif avant 17h pour éviter l&apos;arrêt de production…</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="pill pill-warn">Domaine usurpé</span>
                <span className="pill pill-warn">Urgence artificielle</span>
              </div>
            </div>
            <div className="hv-card hv-dark hv-3">
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--signal)", display: "grid", placeItems: "center", color: "var(--ink)", flexShrink: 0 }}>
                <EscaleIcon escale="tronc-commun" size={30} strokeWidth={2} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--on-ink-dim)" }}>BADGE DÉBLOQUÉ</span>
                <strong>Sans faute</strong>
                <span style={{ fontSize: 13, color: "var(--on-ink-muted)" }}>3 phishings démasqués sur 3</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="facts">
        <div><b>4 escales</b><span>une par spécialité lorientaise</span></div>
        <div><b>{modules.length} modules</b><span>de 10 à 15 minutes chacun</span></div>
        <div><b>0 installation</b><span>les labs s&apos;ouvrent dans le navigateur</span></div>
        <div><b>Badges</b><span>et classement entre spécialités</span></div>
      </div>

      <section id="escales" className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Les escales</span>
            <h2>Un tronc commun, puis ton terrain de jeu.</h2>
          </div>
          <p>Tout le monde commence par les réflexes de base : mots de passe, phishing, mises à jour. Ensuite chaque spécialité embarque pour son escale.</p>
        </div>
        <div className="escale-grid">
          {escales.map((e) => (
            <Link key={e.id} href={`/escales/${e.id}`} className={`escale-card esc-${e.id}`}>
              <div className="escale-card-top">
                <EscaleIcon escale={e.id} size={72} strokeWidth={1.3} />
                <span className="mono">ESCALE {e.numero}</span>
              </div>
              <div className="escale-card-body">
                <span className="escale-spec">{e.specialiteNom}</span>
                <h3>{e.nom}</h3>
                <div className="escale-themes">{e.themes.map((t) => <span key={t}>{t}</span>)}</div>
                <span className="escale-cta">Embarquer →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="fonctionnement" className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Comment ça marche</span>
            <h2>Un module, quatre temps.</h2>
          </div>
        </div>
        <div className="steps4">
          <div><b>1</b><strong>Le contexte</strong><span>Une situation réaliste de ton métier, racontée en deux minutes.</span></div>
          <div><b>2</b><strong>La simulation</strong><span>Tu agis : trier des mails, inspecter une supervision, brancher ou non une clé.</span></div>
          <div><b>3</b><strong>Le quiz</strong><span>Quelques questions pour ancrer ce que tu viens de vivre.</span></div>
          <div><b>4</b><strong>La fiche réflexe</strong><span>Une page à garder, et des points pour ton escale.</span></div>
        </div>
      </section>

      <section id="labs" className="labs-band">
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span className="eyebrow">Labs</span>
          <h2>Pose les mains sur un vrai automate. Sans rien casser.</h2>
          <p>Les labs tournent sur un réseau isolé de l&apos;école. Un clic ouvre la session dans ton navigateur : supervision, poste de travail, objet connecté.</p>
          <Link href="/labs/automate-pompage" className="btn btn-signal" style={{ alignSelf: "flex-start" }}>Ouvrir le lab de démonstration</Link>
        </div>
        <div className="term">
          <div className="term-bar"><i /><i /><i /><span style={{ marginLeft: 10 }}>lab-03 · station de pompage</span></div>
          <div className="term-body">
            <div><span style={{ color: "var(--on-ink-dim)" }}>$</span> connexion IHM 10.20.0.12</div>
            <div><span style={{ color: "var(--on-ink-dim)" }}>login:</span> admin</div>
            <div><span style={{ color: "var(--on-ink-dim)" }}>mot de passe:</span> ●●●●●</div>
            <div style={{ color: "var(--signal)" }}>⚠ accès accordé avec les identifiants usine</div>
            <div>P-01 marche · P-02 marche · cuve 72 %</div>
            <div style={{ color: "var(--mint)" }}>✓ objectif : changer le mot de passe et alerter</div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <strong style={{ fontFamily: "var(--f-display)", fontSize: 22 }}>Escale Cyber</strong>
            <span>Plateforme de sensibilisation des spécialités lorientaises de l&apos;ENSIBS.</span>
          </div>
          <div>
            <strong>Encadrants et clients</strong>
            <span>Tableau de bord des résultats par spécialité et par module.</span>
            <Link href="/encadrants" style={{ color: "var(--blue)", fontWeight: 600 }}>Accès encadrant →</Link>
          </div>
          <div>
            <strong>Projet Recherche et Innovation</strong>
            <span>Cyberdéfense 5A · Promo 2027 · Équipe Prestations transversales</span>
          </div>
        </div>
      </footer>
    </>
  );
}
