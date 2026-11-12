# Development

Last updated: 2026-11-12

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

Remote: private `fangjiaqifion/music-activity-studio`. The user requested kebab-case
following initial underscore creation. Before renaming, a manifest recorded 14 files,
184,297 bytes; every hash and byte count matched afterward, no collision or old folder.
Git objects are outside Nutstore; `.git` is a pointer file. Keep runtime and Git objects
out of synchronized source. Standalone clones may use normal Git directories outside
synced locations. The parent records only a submodule pointer.

This task authorizes repository creation and local demonstration, not push or public
deployment. Commit this game first, then register/update the parent submodule pointer.
