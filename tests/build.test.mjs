import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  symlink,
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { build } from "../scripts/build.mjs";
import { confinedFile } from "../scripts/runtime_files.mjs";
test("release hashes match immutable runtime and exclude development files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "music-build-"));
  try {
    await mkdir(path.join(root, "src"));
    await mkdir(path.join(root, "assets"));
    await writeFile(
      path.join(root, "index.html"),
      '<meta name="app-build" content="dev">',
    );
    await writeFile(path.join(root, "style.css"), "body{}");
    await writeFile(path.join(root, "src/app.mjs"), "export const ok=true;");
    await writeFile(path.join(root, "assets/art.png"), "fake art");
    await writeFile(path.join(root, "private.txt"), "not for hosting");
    const first = await build(root),
      again = await build(root);
    assert.equal(first.build, again.build);
    assert.ok(!Object.keys(first.files).some((f) => f.includes("private")));
    for (const [file, hash] of Object.entries(first.files))
      assert.equal(
        createHash("sha256")
          .update(await readFile(path.join(root, "dist", file)))
          .digest("hex"),
        hash,
      );
    assert.match(
      await readFile(path.join(root, "dist", first.entry), "utf8"),
      new RegExp(first.build),
    );
    await writeFile(path.join(root, "style.css"), "body{color:red}");
    const changed = await build(root);
    assert.notEqual(changed.build, first.build);
    await assert.rejects(readFile(path.join(root, "dist", first.entry)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("runtime confinement rejects symlinks pointing outside the app", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "music-boundary-"));
  try {
    await symlink("/etc/hosts", path.join(root, "leak"));
    await assert.rejects(confinedFile(root, "leak"), /outside runtime/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
