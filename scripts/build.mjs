import { readFile, mkdir, writeFile, rm, lstat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { runtimeFiles, confinedFile } from "./runtime_files.mjs";
export async function build(
  root = fileURLToPath(new URL("../", import.meta.url)),
) {
  const files = await runtimeFiles(root);
  const input = await Promise.all(
    files.map(async (file) => [
      file,
      await readFile(await confinedFile(root, file)),
    ]),
  );
  const hash = createHash("sha256");
  for (const [file, bytes] of input)
    hash.update(file).update("\0").update(bytes).update("\0");
  const id = hash.digest("hex").slice(0, 12);
  const directory = `releases/${id}`;
  const dist = path.join(root, "dist");
  try {
    if ((await lstat(dist)).isSymbolicLink())
      throw new Error("Refusing symlink build output");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await rm(dist, { recursive: true, force: true });
  const outputs = [];
  async function emit(target, content) {
    const destination = path.join(dist, target);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);
    outputs.push([target, content]);
  }
  const stableFiles = new Set([
    "manifest.webmanifest",
    "assets/studio-icon-180.png",
    "assets/studio-icon-192.png",
    "assets/studio-icon-512.png",
  ]);
  const installLinks = input.some(([name]) => name === "manifest.webmanifest")
    ? '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" sizes="180x180" href="assets/studio-icon-180.png"><meta name="apple-mobile-web-app-title" content="音乐工坊">'
    : "";
  for (const [file, bytes] of input) {
    if (stableFiles.has(file)) await emit(file, bytes);
    if (file === "manifest.webmanifest") continue;
    const content =
      file === "index.html"
        ? Buffer.from(
            bytes.toString()
              .replace('content="dev"', 'content="' + id + '"')
              .replace('href="manifest.webmanifest"', 'href="../../manifest.webmanifest"'),
          )
        : bytes;
    await emit(`${directory}/${file}`, content);
  }
  const redirect = Buffer.from(
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive"><title>音乐游乐工坊</title>${installLinks}</head><body><script>location.replace(new URL('${directory}/index.html',location.href))</script><a href="${directory}/index.html">打开音乐游乐工坊</a></body></html>`,
  );
  await emit("index.html", redirect);
  const legacyCatalog = input.find(([name]) => name === "activities.html");
  if (legacyCatalog) await emit(...legacyCatalog);
  const manifest = {
    build: id,
    entry: `${directory}/index.html`,
    files: Object.fromEntries(
      outputs.map(([file, bytes]) => [
        file,
        createHash("sha256").update(bytes).digest("hex"),
      ]),
    ),
  };
  await writeFile(
    path.join(root, "dist", "release.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(`Build ${id}: ${outputs.length} files; entry ${manifest.entry}`);
  return manifest;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();
