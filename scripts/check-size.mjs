import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "dist", "index.js");

try {
  const raw = readFileSync(file);
  const gzipped = gzipSync(raw);
  const rawKb = (raw.byteLength / 1024).toFixed(2);
  const gzipKb = (gzipped.byteLength / 1024).toFixed(2);
  const maxKb = 10;

  console.log(`Bundle size: ${rawKb} KB raw, ${gzipKb} KB gzipped`);
  console.log(`File: ${file} (${statSync(file).size} bytes)`);

  if (gzipped.byteLength / 1024 > maxKb) {
    console.error(`Bundle exceeds ${maxKb} KB gzipped budget.`);
    process.exit(1);
  }
} catch (error) {
  console.error("Run `pnpm build` before checking size.");
  console.error(error);
  process.exit(1);
}
