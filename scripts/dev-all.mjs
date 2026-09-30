// Lance PocketBase et le site Next.js ensemble (Ctrl+C arrête les deux).
import { spawn } from "node:child_process";

const opts = { stdio: "inherit", shell: process.platform === "win32" };
const procs = [
  spawn("node", ["scripts/pocketbase.mjs", "serve"], opts),
  spawn("npx", ["next", "dev"], opts),
];

let stopping = false;
function stopAll(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const p of procs) p.kill();
  process.exit(code);
}
for (const p of procs) p.on("exit", (code) => stopAll(code ?? 0));
process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));
