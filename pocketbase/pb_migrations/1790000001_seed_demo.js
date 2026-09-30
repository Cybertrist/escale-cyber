/// <reference path="../pb_data/types.d.ts" />

// Comptes et résultats de démonstration (mot de passe commun : Escale2027!).
// Pour une base vierge : supprimer ce fichier AVANT le premier lancement, ou supprimer les comptes "@escale.local" dans l'admin.
const PASSWORD = "Escale2027!";

const DEMO = [
  { email: "encadrant@escale.local", name: "Encadrant Démo", spec: "", role: "encadrant", mods: [] },
  { email: "apprenant@escale.local", name: "Louise Martin", spec: "ge", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 5, 5], ["tronc-commun/phishing", 5, 6], ["tronc-commun/mises-a-jour", 4, 5], ["centrale/supervision-exposee", 4.5, 6]] },
  { email: "demo.gi1@escale.local", name: "Hélène Kervella (démo)", spec: "gi", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 4, 5], ["tronc-commun/phishing", 6, 6], ["tronc-commun/mises-a-jour", 5, 5], ["usine/commande-fournisseur", 5, 7]] },
  { email: "demo.gi2@escale.local", name: "Yann Le Goff (démo)", spec: "gi", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 5, 5], ["tronc-commun/phishing", 4, 6], ["usine/cle-usb", 4, 5]] },
  { email: "demo.meca1@escale.local", name: "Nora Benali (démo)", spec: "meca", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 3, 5], ["tronc-commun/phishing", 5, 6], ["atelier/firmware-robot", 4, 6]] },
  { email: "demo.meca2@escale.local", name: "Erwan Tanguy (démo)", spec: "meca", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 5, 5]] },
  { email: "demo.ge1@escale.local", name: "Maëlle Riou (démo)", spec: "ge", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 5, 5], ["tronc-commun/phishing", 6, 6], ["tronc-commun/mises-a-jour", 5, 5], ["centrale/supervision-exposee", 6, 6], ["centrale/faux-technicien", 7, 8], ["lab/automate-pompage", 4, 4]] },
  { email: "demo.gc1@escale.local", name: "Lucas Prigent (démo)", spec: "gc", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 4, 5], ["tronc-commun/phishing", 3, 6], ["chantier/bim-partage", 5, 6]] },
  { email: "demo.gc2@escale.local", name: "Inès Caradec (démo)", spec: "gc", role: "apprenant",
    mods: [["tronc-commun/mots-de-passe", 5, 5], ["tronc-commun/phishing", 6, 6], ["tronc-commun/mises-a-jour", 3, 5], ["chantier/faux-maitre-ouvrage", 6, 7]] },
];

migrate((app) => {
  const users = app.findCollectionByNameOrId("users");
  const progression = app.findCollectionByNameOrId("progression");

  for (const d of DEMO) {
    const u = new Record(users);
    u.set("email", d.email);
    u.set("name", d.name);
    u.set("role", d.role);
    if (d.spec) u.set("specialite", d.spec);
    u.set("verified", true);
    u.setPassword(PASSWORD);
    app.save(u);

    for (const [module, score, max] of d.mods) {
      const p = new Record(progression);
      p.set("user", u.id);
      p.set("module", module);
      p.set("escale", module.split("/")[0] === "lab" ? "centrale" : module.split("/")[0]);
      p.set("specialite", d.spec);
      p.set("score", score);
      p.set("max", max);
      p.set("termine", true);
      app.save(p);
    }
  }
}, (app) => {
  for (const d of DEMO) {
    try {
      app.delete(app.findAuthRecordByEmail("users", d.email));
    } catch (_) {}
  }
});
