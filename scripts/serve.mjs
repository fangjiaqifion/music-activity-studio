import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { runtimeFiles, confinedFile } from "./runtime_files.mjs";
const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
const root =
  process.env.SERVE_DIST === "1" ? path.join(sourceRoot, "dist") : sourceRoot;
const port = Number(process.argv[2] || 8787);
const allowed = new Set(
  process.env.SERVE_DIST === "1"
    ? [
        ...Object.keys(
          JSON.parse(await readFile(path.join(root, "release.json"), "utf8"))
            .files,
        ),
        "release.json",
      ]
    : await runtimeFiles(root),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".mjs": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405).end();
      return;
    }
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://local").pathname,
      );
      const relative = pathname === "/" ? "index.html" : pathname.slice(1);
      if (!allowed.has(relative)) {
        res.writeHead(404).end("Not found");
        return;
      }
      const file = await confinedFile(root, relative);
      const bytes = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch {
      res.writeHead(404).end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Local: http://127.0.0.1:${port}`),
  );
