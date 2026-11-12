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
  for (const [file, bytes] of input) {
    const content =
      file === "index.html"
        ? Buffer.from(
            bytes.toString().replace('content="dev"', 'content="' + id + '"'),
          )
        : bytes;
    const target = `${directory}/${file}`;
    await mkdir(path.dirname(path.join(root, "dist", target)), {
      recursive: true,
    });
    await writeFile(path.join(root, "dist", target), content);
    outputs.push([target, content]);
  }
  const redirect = Buffer.from(
    `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive"><title>音乐游乐工坊</title><script>location.replace(new URL('${directory}/index.html',location.href))</script><a href="${directory}/index.html">打开音乐游乐工坊</a></html>`,
  );
  await mkdir(path.join(root, "dist"), { recursive: true });
  await writeFile(path.join(root, "dist", "index.html"), redirect);
  outputs.push(["index.html", redirect]);
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
