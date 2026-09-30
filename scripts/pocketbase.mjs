// Télécharge et lance PocketBase pour le développement local.
//   node scripts/pocketbase.mjs install   → télécharge le binaire dans ./pocketbase
//   node scripts/pocketbase.mjs serve     → lance PocketBase sur http://127.0.0.1:8090
import { spawn, spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "0.40.4";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "pocketbase");
const BIN = path.join(DIR, process.platform === "win32" ? "pocketbase.exe" : "pocketbase");

async function install() {
  const os = { win32: "windows", darwin: "darwin", linux: "linux" }[process.platform];
  const arch = { x64: "amd64", arm64: "arm64" }[process.arch];
  if (!os || !arch) throw new Error(`Plateforme non gérée : ${process.platform}/${process.arch}`);
  const url = `https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_${os}_${arch}.zip`;
  console.log(`Téléchargement de PocketBase ${VERSION} (${os}/${arch})…`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Téléchargement impossible (${res.status}) : ${url}`);
  const zip = path.join(DIR, "pocketbase.zip");
  await writeFile(zip, Buffer.from(await res.arrayBuffer()));
  const r = process.platform === "linux"
    ? spawnSync("unzip", ["-o", zip, "-d", DIR], { stdio: "inherit" })
    : spawnSync("tar", ["-xf", zip, "-C", DIR], { stdio: "inherit" });
  rmSync(zip, { force: true });
  if (r.status !== 0) throw new Error("Extraction de l'archive impossible.");
  console.log(`PocketBase installé : ${BIN}`);
}

async function serve() {
  if (!existsSync(BIN)) await install();
  const child = spawn(
    BIN,
    ["serve", "--http", "127.0.0.1:8090", "--dir", path.join(DIR, "pb_data"), "--migrationsDir", path.join(DIR, "pb_migrations")],
    { stdio: "inherit" },
  );
  const stop = () => child.kill();
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  child.on("exit", (code) => process.exit(code ?? 0));
}

const cmd = process.argv[2] ?? "serve";
try {
  if (cmd === "install") await install();
  else if (cmd === "serve") await serve();
  else throw new Error(`Commande inconnue : ${cmd}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
