import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { listModules } from "@/lib/content";
import { LABS } from "@/lib/labs";
import { Stats } from "./Stats";

export const metadata: Metadata = { title: "Encadrants" };

export default async function EncadrantsPage() {
  const catalog = await listModules();
  const labs = LABS.filter((l) => l.disponible).map((l) => ({ key: `lab/${l.id}`, titre: `Lab · ${l.titre}`, escale: l.escale }));
  return (
    <AppShell>
      <Stats catalog={[...catalog.map((m) => ({ key: m.key, titre: m.titre, escale: m.escale })), ...labs]} />
    </AppShell>
  );
}
