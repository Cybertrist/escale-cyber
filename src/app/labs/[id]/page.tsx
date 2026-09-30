import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LABS, getLab } from "@/lib/labs";
import { LabRunner } from "./LabRunner";

export const dynamicParams = false;

export function generateStaticParams() {
  return LABS.filter((l) => l.disponible).map((l) => ({ id: l.id }));
}

export async function generateMetadata(props: PageProps<"/labs/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return { title: getLab(id)?.titre ?? "Lab" };
}

export default async function LabPage(props: PageProps<"/labs/[id]">) {
  const { id } = await props.params;
  const lab = getLab(id);
  if (!lab || !lab.disponible) notFound();
  const guacBase = process.env.NEXT_PUBLIC_GUACAMOLE_URL;
  const guacUrl = guacBase && lab.guacamole ? `${guacBase.replace(/\/$/, "")}/${lab.guacamole}` : null;
  return <LabRunner lab={lab} guacUrl={guacUrl} />;
}
