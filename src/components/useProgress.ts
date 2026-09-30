"use client";

import { useEffect, useState } from "react";
import { errorMessage, fetchAllProgress, fetchMyProgress } from "@/lib/pb";
import type { ProgressRecord } from "@/lib/types";
import { useAuth } from "./AuthProvider";

// Progression de l'utilisateur connecté (et, si demandé, de toute la plateforme pour les classements).
export function useProgress({ all = false }: { all?: boolean } = {}) {
  const { user } = useAuth();
  const [mine, setMine] = useState<ProgressRecord[]>([]);
  const [everyone, setEveryone] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    Promise.all([fetchMyProgress(user.id), all ? fetchAllProgress() : Promise.resolve([])])
      .then(([m, e]) => {
        if (!alive) return;
        setMine(m);
        setEveryone(e);
        setError(null);
      })
      .catch((err) => alive && setError(errorMessage(err)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user, all]);

  return { mine, everyone, loading: !!user && loading, error };
}
