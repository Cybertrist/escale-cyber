/// <reference path="../pb_data/types.d.ts" />

// Schéma Escale Cyber : champs apprenant sur "users" + collection "progression".
migrate((app) => {
  const users = app.findCollectionByNameOrId("users");

  users.fields.add(new SelectField({
    name: "specialite",
    values: ["gi", "meca", "ge", "gc"],
    maxSelect: 1,
  }));
  users.fields.add(new SelectField({
    name: "role",
    values: ["apprenant", "encadrant"],
    maxSelect: 1,
  }));

  // Un apprenant ne peut pas se déclarer encadrant lui-même.
  users.createRule = '@request.body.role:isset = false || @request.body.role = "apprenant"';
  users.updateRule = 'id = @request.auth.id && @request.body.role:isset = false';
  // Les encadrants voient la liste des apprenants.
  users.listRule = 'id = @request.auth.id || @request.auth.role = "encadrant"';
  users.viewRule = 'id = @request.auth.id || @request.auth.role = "encadrant"';
  app.save(users);

  const progression = new Collection({
    type: "base",
    name: "progression",
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    updateRule: 'user = @request.auth.id && @request.body.user:isset = false',
    deleteRule: null,
    fields: [
      { type: "relation", name: "user", required: true, collectionId: users.id, cascadeDelete: true, maxSelect: 1 },
      { type: "text", name: "module", required: true, max: 120 },
      { type: "text", name: "escale", max: 40 },
      { type: "text", name: "specialite", max: 10 },
      { type: "number", name: "score", min: 0 },
      { type: "number", name: "max", min: 0 },
      { type: "bool", name: "termine" },
      { type: "autodate", name: "created", onCreate: true, onUpdate: false },
      { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_progression_user_module ON progression (user, module)",
    ],
  });
  app.save(progression);
}, (app) => {
  const progression = app.findCollectionByNameOrId("progression");
  app.delete(progression);

  const users = app.findCollectionByNameOrId("users");
  users.fields.removeByName("specialite");
  users.fields.removeByName("role");
  app.save(users);
});
