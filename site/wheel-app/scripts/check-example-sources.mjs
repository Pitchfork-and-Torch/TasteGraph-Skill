/**
 * Gate: public-art pie examples should include credit + href.
 * Usage: node scripts/check-example-sources.mjs
 * Exit 1 if any example looks like a public X post without href, or has href without credit.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(join(root, "src", "slices.js"), "utf8");

// crude parse of examples blocks
const exampleRe =
  /\{\s*src:\s*"([^"]+)"\s*,\s*caption:\s*"([^"]*)"\s*,\s*credit:\s*"([^"]*)"\s*,\s*href:\s*"([^"]*)"\s*,?\s*\}/g;
const exampleLooseRe =
  /\{\s*src:\s*"([^"]+)"\s*,\s*caption:\s*"([^"]*)"(?:\s*,\s*credit:\s*"([^"]*)")?(?:\s*,\s*href:\s*"([^"]*)")?\s*,?\s*\}/g;

const items = [];
let m;
while ((m = exampleLooseRe.exec(src))) {
  items.push({
    src: m[1],
    caption: m[2] || "",
    credit: m[3] || "",
    href: m[4] || "",
  });
}

if (!items.length) {
  console.error("No examples parsed from slices.js");
  process.exit(1);
}

const issues = [];
for (const ex of items) {
  const looksPublicArt =
    Boolean(ex.credit && ex.credit.startsWith("@")) ||
    /x\.com|twitter\.com/i.test(ex.href);
  if (ex.href && !ex.credit) {
    issues.push(`${ex.src}: has href but missing credit`);
  }
  if (looksPublicArt && !ex.href) {
    issues.push(`${ex.src}: public-looking credit without href`);
  }
  if (ex.href && !/^https?:\/\//i.test(ex.href)) {
    issues.push(`${ex.src}: href is not absolute URL`);
  }
}

const withHref = items.filter((x) => x.href).length;
console.log(`examples=${items.length} with_href=${withHref}`);
if (issues.length) {
  console.error("SOURCE LINK GATE FAILED:");
  for (const i of issues) console.error(" -", i);
  process.exit(1);
}
console.log("SOURCE LINK GATE OK");
