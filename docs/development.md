# Development

Last updated: 2026-11-13

## Operation and verification

Use Node.js. Run `npm run serve` (port 8787) or `npm run serve -- 8788`.
The server binds only to loopback, sends no-store responses, and refuses hidden paths.
For development, run `npm install`, `npm test`, and, with the server running on 8787,
`npm run test:browser`. The latter uses system Google Chrome at its macOS default;
set `CHROME_PATH` for another executable. Browser launch and loopback need permissions.
Screenshots and a print-layout PDF are generated into ignored `.runtime/`.

## Architecture and Note Trainer lessons

The design adopts Note Trainer's shared session entry, centralized answer handling,
first-attempt retention, disposal of playback, and real-browser verification. No
application source, account data, cloud configuration, or credentials were copied.
This game has its own storage key and repository.

`core.mjs` has a registry, deterministic PRNG, pure generators, validators, and Bingo
checks, without DOM or storage access. Generated questions carry worksheet source IDs.
Seed and difficulty reproduce initial questions; edited rhythm grids are ephemeral
and are not reconstructed from a seed alone. `app.mjs` shares start/reset/render/check/
result across six views. `audio.mjs` stops scheduled nodes, speech, and pending resume
callbacks. There are no timed automatic answer transitions. Extract individual game
views as they grow; retain shared lifecycle and disposal contracts.

Shop tasks combine durations, not notated measures. Intervals count inclusive letter
positions. Curated triads are C major, D minor, E minor, and F major. Rhythm cells are
a quarter or two eighths, each one quarter-note beat. No microphone scoring exists.
Print mode uses the same question objects, with a separate A4 answer page. Recheck
pagination for longer content. Never modify worksheet masters through print output.

## Repository and delivery

Remote: public `fangjiaqifion/music-activity-studio` (user-authorized on 2026-11-12). The user requested kebab-case
following initial underscore creation. Before renaming, a manifest recorded 14 files,
184,297 bytes; every hash and byte count matched afterward, no collision or old folder.
Git objects are outside Nutstore; `.git` is a pointer file. Keep runtime and Git objects
out of synchronized source. Standalone clones may use normal Git directories outside
synced locations. The parent records only a submodule pointer.

The user authorized push and GitHub Pages deployment on 2026-11-12. Earlier local-only
status is historical. There is no ChatGPT hosting or login in the selected deployment.

## GitHub Pages release procedure

1. Inspect the diff and update affected docs. Run `npm test` and `npm audit`.
2. Run `npm run build`. This writes only allowlisted runtime files into ignored `dist/`,
   under a content-derived `releases/<build>/` directory. `release.json` hashes every
   served runtime file and root entry. Old generated output is replaced, not source.
3. Start a fresh production preview with `SERVE_DIST=1 node scripts/serve.mjs 8788`.
   Restart it after rebuilding, since its allowlist is loaded at startup. Run
   `BASE_URL=http://127.0.0.1:8788 npm run test:browser` and similarly
   `npm run test:regressions`. Inspect affected screenshots and printing.
4. Commit explicit paths, then push to this game's origin/main only when authorized.
   `.github/workflows/pages.yml` uses pinned official Actions, Node 24, Node tests,
   the build, and both Chrome suites against the artifact before deploying Pages.
   Documentation-only pushes do not redeploy. Runtime pushes do.
5. Watch the exact Actions run to a terminal success state. Then run
   `node scripts/verify_deployed.mjs https://fangjiaqifion.github.io/music-activity-studio/`.
   It compares the remote manifest and every file hash with the verified local build.
6. Open the actual deployed release in a browser, confirm its build metadata and
   working menu, and record the evidence. Browser automation is not physical-iPad or
   human audible acceptance. Search crawler directives are not access protection.
7. Update the audit/tracker with actual URL, build, commit, checks and remaining limits.
   Commit/push that evidence, then commit the parent's updated submodule pointer and
   coordination docs locally. Never push the parent implicitly.

The shared storage module rereads before append, caps history at 100, and reports
failed saves without replacing corrupt saved bytes. Speech failure or an unavailable
voice reveals the current written Bingo call. Navigation cancels pending playback,
speech and speech fallback timers. Keep these lifecycle properties in future game views.
