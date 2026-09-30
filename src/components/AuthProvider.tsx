"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getPb } from "@/lib/pb";
import type { AppUser } from "@/lib/types";

type AuthState = {
  user: AppUser | null;
  ready: boolean;
  offline: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({ user: null, ready: false, offline: false, logout: () => {} });

function toUser(record: unknown): AppUser | null {
  if (!record || typeof record !== "object") return null;
  const r = record as Record<string, unknown>;
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    email: String(r.email ?? ""),
    specialite: r.specialite ? String(r.specialite) : undefined,
    role: r.role ? String(r.role) : undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const pb = getPb();
    // L'état d'authentification vit dans le localStorage : on ne le lit qu'après le montage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(pb.authStore.isValid ? toUser(pb.authStore.record) : null);
    setReady(true);
    const unsubscribe = pb.authStore.onChange((_token, record) => setUser(toUser(record)));

    pb.health
      .check()
      .then(() => {
        setOffline(false);
        if (pb.authStore.isValid) {
          pb.collection("users").authRefresh().catch(() => pb.authStore.clear());
        }
      })
      .catch(() => setOffline(true));

    return unsubscribe;
  }, []);

  const logout = useCallback(() => getPb().authStore.clear(), []);

  return <AuthContext.Provider value={{ user, ready, offline, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function OfflineBanner() {
  const { offline } = useAuth();
  if (!offline) return null;
  return (
    <div className="banner" role="alert">
      <span>
        Le serveur PocketBase ne répond pas : la connexion et la sauvegarde de la progression sont indisponibles.
        Lance-le avec <code>npm run pb</code> dans un autre terminal.
      </span>
    </div>
  );
}
