import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
const base = new URL(
  process.argv[2] || "https://fangjiaqifion.github.io/music-activity-studio/",
);
if (!base.pathname.endsWith("/")) base.pathname += "/";
const local = JSON.parse(
  await readFile(new URL("../dist/release.json", import.meta.url), "utf8"),
);
async function fetchFile(file) {
  const url = new URL(file, base);
  url.searchParams.set("verify", `${local.build}-${Date.now()}`);
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw Error(`${file}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
const remote = JSON.parse((await fetchFile("release.json")).toString());
if (
  remote.build !== local.build ||
  JSON.stringify(remote.files) !== JSON.stringify(local.files)
)
  throw Error("Remote release differs from local verified release");
const checks = await Promise.all(
  Object.entries(local.files).map(async ([file, expected]) => {
    const actual = createHash("sha256")
      .update(await fetchFile(file))
      .digest("hex");
    if (actual !== expected) throw Error(`Hash mismatch: ${file}`);
    return { file, sha256: actual };
  }),
);
const result = {
  build: local.build,
  url: base.href,
  entry: new URL(local.entry, base).href,
  verifiedAt: new Date().toISOString(),
  files: checks,
};
await mkdir(new URL("../.runtime/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../.runtime/deployed_verification.json", import.meta.url),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(`Verified ${checks.length} deployed file hashes: ${local.build}`);
console.log(result.entry);
