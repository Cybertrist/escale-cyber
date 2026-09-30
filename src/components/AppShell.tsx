"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { OfflineBanner, useAuth } from "./AuthProvider";
import { IconChart, IconHome, IconLogout, IconMap, IconScreen, Logo } from "./icons";
import { SPECIALITES, type Specialite } from "@/lib/escales";

export function initials(name: string, email: string) {
  const src = name.trim() || email;
  const parts = src.split(/[\s.@_-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

// Coque des pages connectées : barre latérale + garde d'authentification.
export function AppShell({ children, public: isPublic = false }: { children: React.ReactNode; public?: boolean }) {
  const { user, ready, offline, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isPublic && ready && !user && !offline) router.replace(`/connexion?suite=${encodeURIComponent(pathname)}`);
  }, [isPublic, ready, user, offline, pathname, router]);

  const nav = [
    { href: "/parcours", label: "Mon parcours", icon: <IconHome /> },
    { href: "/escales", label: "Les escales", icon: <IconMap /> },
    { href: "/labs", label: "Labs", icon: <IconScreen /> },
    ...(user?.role === "encadrant" ? [{ href: "/encadrants", label: "Encadrants", icon: <IconChart /> }] : []),
  ];

  const spec = user?.specialite ? SPECIALITES[user.specialite as Specialite]?.nom : undefined;

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="logo">
          <Logo size={28} />
          Escale Cyber
        </Link>
        <nav className="side-nav" aria-label="Navigation principale">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? "active" : undefined}>
              {n.icon}
              {n.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <div className="side-user">
            <strong>{user.name || user.email}</strong>
            <span>{user.role === "encadrant" ? "Encadrant" : spec ?? "Apprenant"}</span>
            <button type="button" onClick={() => { logout(); router.push("/"); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><IconLogout size={16} />Se déconnecter</span>
            </button>
          </div>
        ) : (
          <div className="side-user">
            <span>Connecte-toi pour enregistrer ta progression.</span>
            <Link href={`/connexion?suite=${encodeURIComponent(pathname)}`} style={{ color: "var(--signal)", fontWeight: 600 }}>Se connecter →</Link>
          </div>
        )}
      </aside>
      <main className="shell-main">
        <OfflineBanner />
        {isPublic || user ? children : <div className="center-msg"><p className="muted">Chargement…</p></div>}
      </main>
    </div>
  );
}
