import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { listModules } from "@/lib/content";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = { title: "Mon parcours" };

export default async function ParcoursPage() {
  const catalog = await listModules();
  return (
    <AppShell>
      <Dashboard catalog={catalog} />
    </AppShell>
  );
}
