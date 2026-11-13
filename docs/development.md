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

## Local O-003 prototype

Open `/balloons.html` on the source preview server. A remembered browser-local
student selection supplies the worksheet name; the date updates in Asia/Shanghai.
This is a display profile, not authentication. No exercise data is collected.
The user deferred real accounts/synchronization until the content framework stabilizes.

Run `node tests/balloons_browser.mjs` against port 8790, or set `BASE_URL` to the
source/production preview origin. Screenshots go to ignored `.runtime/`.
Run `scripts/balloon_masks.py` with a Pillow-capable Python only when regenerating
derived masks. Never overwrite source artwork. The heart body is transparent;
do not infer its tintable area from alpha alone.

The balloon prototype's speech adapter lives in `src/balloon_speech.mjs`. Trigger it
from explicit user actions, select an available Chinese voice, replace prior speech,
and cancel on page hiding/navigation, completion, printing, and new questions.
Keep the visible instructions usable when browser speech is unavailable.
All balloon SVGs share the staff baseline/spacing; derive artwork placement around
that baseline while preserving native aspect ratios.

## Local O-005 prototype

Open `/cheesecake.html` on a freshly started source preview server. The server loads
its runtime allowlist at startup, so restart it after adding entry files.
Run `BASE_URL=http://127.0.0.1:8791 node tests/cheesecake_browser.mjs` for nine-cake
selection, correction, erasing, reset, celebration, mobile overflow, and print capture.
The generator permutes all nine internal staff positions, using the same S/L rule as
the original. UI selections are ephemeral; only the existing display profiles persist.

Run `node tests/celebration_browser.mjs` against the local preview (default port 8793,
or `BASE_URL`) to verify both worksheet celebrations, banner bearers, clapper counts,
actual palm contact at a paused clap frame, and reduced-motion behavior. Captures go
into ignored `.runtime/`. The parade crosses in seven seconds; individual claps repeat
every 0.44 seconds. Keep animation delay in frame calculations for staggered characters.

## Six-worksheet hub and hands/cow trials

Open `/activities.html` on the source server; the original index links to it, and
all six worksheets link back. `/hands.html` identifies both hands and fills ten
piano finger numbers. `/cows.html` permutes ten treble and nine bass clefs among
nineteen enclosed regions. Both use the shared profile/speech adapters and preserve
aggregate-only feedback, erasing, correction, and the five-character celebration.
Selections stay in memory. New hands pages alternate their layout; cow pages change
the clef layout. This is local content, with no new publishing authorization.

Run `BASE_URL=http://127.0.0.1:8794 node tests/activities_browser.mjs` for the hub,
both complete exercise flows, failed resources, profiles, desktop/mobile captures,
and one-page A4 print captures. Pure generation/scoring checks run in `npm test`.
The in-app preview connection timed out in this session; independent Chrome checks
provided actual browser verification.

Regenerate the derived cow asset/masks with a Pillow-capable Python environment:
`python scripts/cow_assets.py '<path to original cow new.ai>'`. Pillow, NumPy, and fontTools are required. Poppler must be on
PATH when exporting from the AI source. Omit the source argument to reuse the clean
bundled cow PNG. The generator also creates smooth vector activity patches, a smile, both original horns as fillable
regions, a patch-free face, and the original black ears, and SVG glyph
paths from bundled Bravura, with each glyph centered on its patch area centroid. The source is read as PDF-compatible artwork and never saved or modified.
The source file and missing original O-004 worksheet are not runtime dependencies.

## O-007/O-008 staff worksheets

Open `/ladybirds.html` or `/sunshine.html` from the six-worksheet selector.
Run `node tests/staff_worksheets_browser.mjs` against port 8795, or set `BASE_URL`.
The suite checks blank submissions, complete answers, erasing, regeneration, local
profiles, five celebration characters, failed resources, mobile overflow, and print
capture. `npm test` checks 1,000 pages per type, nine-position coverage, direction
semantics, and aggregate scoring. SVG placement targets support Enter and Space.
Original worksheet masters remain unchanged; corrected English applies to digital UI.
