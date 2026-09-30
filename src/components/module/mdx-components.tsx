import { Astuce, Attention, Fiche, LabLauncher, Video } from "./Blocs";
import { FausseBoiteMail } from "./FausseBoiteMail";
import { Quiz } from "./Quiz";
import { Scenario } from "./Scenario";

// Composants utilisables dans les fichiers .mdx des modules (voir content/GUIDE-AUTEURS.md).
export const mdxComponents = {
  Quiz,
  FausseBoiteMail,
  Scenario,
  Fiche,
  Astuce,
  Attention,
  Video,
  LabLauncher,
};
