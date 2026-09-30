# Guide des auteurs · Escale Cyber

Ce guide s'adresse aux équipes de spécialité (Génie Industriel, Mécatronique, Génie Énergétique, Génie Civil) qui écrivent les modules de leur escale. Pas besoin de savoir coder : un module est un fichier texte `.mdx` (du Markdown avec quelques composants).

## Où placer un module

```
content/modules/<escale>/<nom-du-module>.mdx
```

| Spécialité          | Dossier        |
| ------------------- | -------------- |
| Toutes (socle)      | `tronc-commun` |
| Génie Industriel    | `usine`        |
| Mécatronique        | `atelier`      |
| Génie Énergétique   | `centrale`     |
| Génie Civil         | `chantier`     |

Le nom du fichier devient l'adresse du module : `content/modules/usine/cle-usb.mdx` → `/modules/usine/cle-usb`. Lettres minuscules, chiffres et tirets uniquement.

## Squelette d'un module

```mdx
---
titre: La clé USB du parking
resume: Une clé USB « Salaires 2026 » traîne près de l'entrée. Tu la branches ?
duree: 10        # en minutes
ordre: 2         # position dans l'escale
lab: poste-piege # optionnel : lab associé
---

# Contexte

Texte en Markdown : **gras**, listes, citations…

# Simulation

<Scenario noeuds={{ ... }} />

# Quiz

<Quiz questions={[ ... ]} />

# Fiche réflexe

<Fiche titre="Les 3 réflexes">
1. Premier réflexe
2. Deuxième réflexe
</Fiche>
```

**Chaque titre de niveau 1 (`# ...`) devient une étape** du module, affichée dans la barre de progression. On recommande les 4 étapes Contexte, Simulation, Quiz, Fiche réflexe, mais vous pouvez en mettre plus ou moins.

## Les composants

### `<Quiz>`

```mdx
<Quiz
  questions={[
    {
      question: "Tu trouves une clé USB inconnue. Que fais-tu ?",
      choix: ["Je la branche", "Je la remets au service informatique", "Je la garde"],
      bonne: 1,
      explication: "Aucun poste n'est « sans importance » : tous sont sur le même réseau.",
    },
  ]}
/>
```

`bonne` est la position de la bonne réponse **en partant de 0** (0 = première réponse). Chaque bonne réponse vaut un point.

### `<FausseBoiteMail>`

Une boîte de réception où l'apprenant classe chaque mail en légitime ou phishing.

```mdx
<FausseBoiteMail
  boite="station-kerlann"
  mails={[
    {
      de: "Automatis Industrie",
      adresse: "support@automatis-lndustrie.com",
      heure: "08:47",
      objet: "URGENT : mise à jour firmware",
      corps: "Bonjour,\n\nInstallez le correctif avant 17h…",
      bouton: "Télécharger le correctif",   // optionnel : faux bouton dans le mail
      pieceJointe: "correctif.pdf",         // optionnel
      phishing: true,
      indices: ["Le domaine est usurpé…", "L'urgence est artificielle…"],
    },
  ]}
/>
```

`\n` fait un retour à la ligne dans le corps du mail. Chaque mail bien classé vaut un point.

### `<Scenario>`

Une histoire à embranchements. Chaque nœud a un texte et des choix qui mènent à d'autres nœuds, jusqu'à une fin (`bon`, `moyen` ou `mauvais`). Le premier nœud s'appelle `debut`.

```mdx
<Scenario
  noeuds={{
    debut: {
      texte: "Tu trouves une clé USB sur le parking.",
      choix: [
        { label: "Je la branche", suivant: "branche" },
        { label: "Je la donne à l'informatique", suivant: "fin_bonne" },
      ],
    },
    branche: {
      texte: "Une fenêtre noire s'ouvre et se ferme…",
      choix: [{ label: "Voir la suite", suivant: "fin_mauvaise" }],
    },
    fin_bonne: { fin: "bon", bilan: "Bon réflexe !" },
    fin_mauvaise: { fin: "mauvais", bilan: "Le poste est compromis." },
  }}
/>
```

Une fin `bon` vaut 1 point, `moyen` 0,5, `mauvais` 0.

### Blocs de mise en forme

```mdx
<Astuce>Un conseil pratique.</Astuce>

<Attention>Un point de vigilance.</Attention>

<Fiche titre="Les 3 réflexes">
1. …
</Fiche>

<Video titre="Témoignage d'un RSSI" src="/videos/rssi.mp4" />

<LabLauncher lab="automate-pompage" />
```

Les vidéos se déposent dans `public/videos/`. Sans `src`, un emplacement « Vidéo à venir » s'affiche.

## Pièges à éviter

- Dans les composants, les textes vont **entre guillemets doubles** `"..."`. Les apostrophes à l'intérieur ne posent pas de problème.
- Les accolades `{ }` ont un sens spécial en MDX : ne les utilisez pas dans le texte courant.
- Vérifiez chaque module en local avec `npm run dev:all` avant de le proposer.
- Pas de vraies adresses mail ni de vrais noms de personnes dans les scénarios : utilisez des noms et domaines fictifs.
