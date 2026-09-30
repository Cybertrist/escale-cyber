import Link from "next/link";
import { IconAlert, IconInfo, IconPlay, IconScreen } from "@/components/icons";
import { getLab } from "@/lib/labs";

export function Fiche({ titre = "Fiche réflexe", children }: { titre?: string; children: React.ReactNode }) {
  return (
    <div className="fiche">
      <div className="fiche-head">
        <strong>{titre}</strong>
        <span className="mono">À GARDER</span>
      </div>
      <div className="fiche-body">{children}</div>
    </div>
  );
}

export function Astuce({ children }: { children: React.ReactNode }) {
  return (
    <div className="callout callout-astuce">
      <IconInfo size={20} />
      <div>{children}</div>
    </div>
  );
}

export function Attention({ children }: { children: React.ReactNode }) {
  return (
    <div className="callout callout-attention">
      <IconAlert size={20} />
      <div>{children}</div>
    </div>
  );
}

// Vidéo hébergée dans public/videos. Sans fichier, on affiche un emplacement réservé.
export function Video({ src, titre, poster }: { src?: string; titre: string; poster?: string }) {
  if (!src) {
    return (
      <div className="video" role="img" aria-label={`Vidéo à venir : ${titre}`}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <IconPlay size={40} />
          <span>Vidéo à venir : {titre}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="video">
      <video src={src} poster={poster} controls preload="metadata" aria-label={titre} />
    </div>
  );
}

export function LabLauncher({ lab }: { lab: string }) {
  const l = getLab(lab);
  if (!l) return null;
  return (
    <div className="lab-launch">
      <IconScreen size={36} />
      <div>
        <span className="mono">LAB · {l.duree} MIN</span>
        <strong>{l.titre}</strong>
        <span>{l.resume}</span>
      </div>
      {l.disponible ? (
        <Link href={`/labs/${l.id}`} className="btn btn-signal">Lancer le lab</Link>
      ) : (
        <span className="pill pill-soft">Bientôt disponible</span>
      )}
    </div>
  );
}
