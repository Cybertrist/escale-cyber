import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { ModulePlayer } from "@/components/module/ModulePlayer";
import { mdxComponents } from "@/components/module/mdx-components";
import { getModule, listModules } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listModules()).map((m) => ({ escale: m.escale, slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/modules/[escale]/[slug]">): Promise<Metadata> {
  const { escale, slug } = await props.params;
  const mod = await getModule(escale, slug);
  return { title: mod?.meta.titre ?? "Module" };
}

export default async function ModulePage(props: PageProps<"/modules/[escale]/[slug]">) {
  const { escale, slug } = await props.params;
  const mod = await getModule(escale, slug);
  if (!mod) notFound();

  const sections = await Promise.all(
    mod.sections.map(async (s) => {
      const { content } = await compileMDX({
        source: s.source,
        components: mdxComponents,
        // Contenu écrit par les équipes de l'école : on autorise les expressions JS (tableaux de questions…),
        // en gardant le blocage des appels dangereux.
        options: { blockJS: false, blockDangerousJS: true },
      });
      return { titre: s.titre, content };
    }),
  );

  const all = await listModules();
  const sameEscale = all.filter((m) => m.escale === mod.meta.escale);
  const idx = sameEscale.findIndex((m) => m.key === mod.meta.key);
  const suivant = sameEscale[idx + 1] ?? null;

  return <ModulePlayer meta={mod.meta} sections={sections} suivant={suivant} />;
}
