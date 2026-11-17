import { readdir, realpath } from "node:fs/promises";
import path from "node:path";
export async function runtimeFiles(root) {
  const files = ["index.html", "style.css"];
  for (const name of [
    "pitch-motion.html",
    "pitch_motion.css",
    "note-houses.html",
    "note-houses.css",
    "keyboard.html",
    "keyboard.css",
    "balloons.html",
    "balloons.css",
    "cheesecake.html",
    "cheesecake.css",
    "ladybirds.html",
    "sunshine.html",
    "treble.html",
    "bass.html",
    "alto.html",
    "staff_worksheets.css",
    "hands.html",
    "cows.html",
    "activities.html",
    "activities.css",
    "activities_menu.css",
  ]) {
    try {
      await realpath(path.join(root, name));
      files.push(name);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  for (const directory of ["src", "assets"]) {
    for (const entry of await readdir(path.join(root, directory), {
      withFileTypes: true,
    })) {
      if (
        entry.isFile() &&
        !entry.name.startsWith(".") &&
        (directory === "assets" || entry.name.endsWith(".mjs"))
      )
        files.push(`${directory}/${entry.name}`);
    }
  }
  return files.sort();
}
export async function confinedFile(root, relative) {
  const absolute = await realpath(path.join(root, relative));
  const resolvedRoot = await realpath(root);
  const remainder = path.relative(resolvedRoot, absolute);
  if (
    remainder === ".." ||
    remainder.startsWith(`..${path.sep}`) ||
    path.isAbsolute(remainder)
  )
    throw new Error("File outside runtime root");
  return absolute;
}
