import PocketBase, { ClientResponseError } from "pocketbase";
import type { ProgressRecord } from "./types";

export const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";

let client: PocketBase | null = null;

export function getPb(): PocketBase {
  if (!client) {
    client = new PocketBase(PB_URL);
    client.autoCancellation(false);
  }
  return client;
}

export function isOffline(err: unknown): boolean {
  return err instanceof ClientResponseError && err.status === 0;
}

export function errorMessage(err: unknown): string {
  if (isOffline(err)) return "Le serveur PocketBase ne répond pas. Lance-le avec « npm run pb ».";
  if (err instanceof ClientResponseError) {
    const fields = err.response?.data as Record<string, { message: string }> | undefined;
    const first = fields && Object.entries(fields)[0];
    if (first) return `${first[0]} : ${first[1].message}`;
    return err.message;
  }
  return "Une erreur inattendue est survenue.";
}

export function points(r: Pick<ProgressRecord, "score" | "max">): number {
  return r.max > 0 ? Math.round((100 * r.score) / r.max) : 100;
}

export async function fetchMyProgress(userId: string): Promise<ProgressRecord[]> {
  const pb = getPb();
  return pb.collection("progression").getFullList<ProgressRecord>({
    filter: pb.filter("user = {:u}", { u: userId }),
  });
}

export async function fetchAllProgress(): Promise<ProgressRecord[]> {
  return getPb().collection("progression").getFullList<ProgressRecord>({
    fields: "id,user,module,escale,specialite,score,max,termine,updated",
  });
}

// Enregistre un module terminé. On garde le meilleur score obtenu.
export async function saveProgress(
  user: { id: string; specialite?: string },
  data: { module: string; escale: string; score: number; max: number },
): Promise<ProgressRecord> {
  const pb = getPb();
  const col = pb.collection("progression");
  try {
    const existing = await col.getFirstListItem<ProgressRecord>(
      pb.filter("user = {:u} && module = {:m}", { u: user.id, m: data.module }),
    );
    const better = data.max === 0 || points(data) >= points(existing);
    return await col.update<ProgressRecord>(existing.id, {
      termine: true,
      ...(better ? { score: data.score, max: data.max } : {}),
    });
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404) {
      return col.create<ProgressRecord>({
        user: user.id,
        specialite: user.specialite ?? "",
        termine: true,
        ...data,
      });
    }
    throw err;
  }
}
