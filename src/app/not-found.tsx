import Link from "next/link";

export default function NotFound() {
  return (
    <div className="center-msg">
      <div>
        <span className="eyebrow">Erreur 404</span>
        <h1 style={{ fontSize: 40 }}>Cette escale n&apos;existe pas.</h1>
        <p className="muted">La page demandée est introuvable ou n&apos;est pas encore publiée.</p>
        <Link href="/" className="btn btn-ink">Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
