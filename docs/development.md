# Development

Last updated: 2026-11-26

## Operation and verification

Use Node.js. Run `npm run serve` (port 8787) or `npm run serve -- 8788`.
The server binds only to loopback, sends no-store responses, and refuses hidden paths.
For development, run `npm install`, `npm test`, and, with the server running on 8787,
`npm run test:browser`. The latter uses system Google Chrome at its macOS default;
set `CHROME_PATH` for another executable. Browser launch and loopback need permissions.
Screenshots and a print-layout PDF are generated into ignored `.runtime/`.

## Staff Race local preview

Open `/staff-race.html` on the preview server. Run
`BASE_URL=http://127.0.0.1:<port> node tests/staff_race_browser.mjs` for the
catalog-to-match flow, character selection, touch and keyboard input, retry cues,
notehead placement, immediate finish, ten-round height comparison, and restart. The test also runs against the Pages build.

## Architecture and Note Trainer lessons

### Note Neighborhood local preview

Open `/note-houses.html` on the source preview server. Run `BASE_URL=http://127.0.0.1:<port> node tests/note_houses_browser.mjs` for complete tap, keyboard, wrong-answer/correction, six-neighbor-round, completion/reset, full-staff containment, and viewport checks. The same flow verifies brace alignment, exact per-question automatic speech calls using a stubbed Chinese voice, confetti, and reduced-motion cleanup. Generate the brace path from bundled Bravura with `/opt/anaconda3/envs/ds/bin/python scripts/note_house_assets.py` when updating its source. Pure pitch/clearance tests run with `npm test`; the responsive worksheet suite also includes this page. Run `BASE_URL=http://127.0.0.1:<port> node tests/note_houses_audio_browser.mjs` to verify actual local MP3 decoding, playback rates for all seven pitches, and Level 2 reference/answer/resident playback. Transient sample fetch/decode failures are evicted so the next tap can retry; navigation cancels pending playback. Resizing preserves keyboard focus on a house. Audio sources use `note_house_piano.mjs`; sample files and attribution live in `assets/piano_*`. No profile or saved student data is required. The scene uses `ResizeObserver` and uniform house/clef scaling, not a large scrollable canvas. Individual character crops use nested clipped SVG viewports; a single viewBox with mismatched aspect ratio can expose adjacent characters and must not replace the clipping viewport. Keep the source art unchanged.

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
   the build, both legacy Chrome suites, the unified catalog and hands/cow flow, the complete P-031 pitch-motion, keyboard, staff worksheet, and Note Neighborhood interaction/audio suites, the Staff Race interaction suite, and all worksheet responsive cases against the artifact before deploying Pages.
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

## Unified catalog and hands/cow exercises

Open the source root to browse all activities in the shared catalog. Add new
entries to a training-area group in `src/catalog.mjs`. Worksheet covers are real
exercise captures generated by `scripts/activity_previews.mjs`. The shared
`studio.css` supplies the app navigation and presentation. `activities.html`
redirects to the catalog for existing links.

Keep the same grid tracks in every training area. The shared stylesheet uses
`auto-fill` to preserve empty columns when a group or final row has few cards.
Give each card a short title that identifies the exercise and a description that
adds a concrete cue, action, or objective. Check both lines against the actual
learner flow, especially when nearby exercises cover similar skills.

Run `npm run test:responsive` against the packaged preview to compare card
dimensions across training areas and verify that a simulated single-card group
retains the standard width. Review screenshots after fonts and covers load.
See the [catalog release evidence](progress_tracker.md#catalog-cards-and-learner-facing-copy-november-25-2026)
for the copy audit and deployed verification.

The Pages build publishes the installation manifest and PNG icons at stable paths
in the site root. Both the root landing document and the versioned catalog
declare the Apple touch icon. The manifest launches the stable site root, which
resolves to the current release. Verify both HTML entry points and icon URLs when
changing the packaging. On iOS, verify the Share sheet and Home Screen launch on
a real device.

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

Open `/ladybirds.html` or `/sunshine.html` from the shared catalog.
Run `node tests/staff_worksheets_browser.mjs` against port 8795, or set `BASE_URL`.
The suite checks blank submissions, complete answers, erasing, regeneration, local
profiles, five celebration characters, failed resources, mobile overflow, and print
capture. `npm test` checks 1,000 pages per type, nine-position placement coverage, pair-only direction
semantics and reference-relative note names, and aggregate scoring. SVG placement targets support Enter and Space.
O-008 has only twelve pair comparisons. O-009/O-010/O-011 are `treble.html`, `bass.html`, and `alto.html`. All three have nine daily movable-clef questions. The same suite covers complete answers, direct answer replacement, and keyboard flows. Pointer placement must not preserve SVG focus outlines. Original worksheet masters remain unchanged; corrected English applies to digital UI.

## Required responsive acceptance

Follow [responsive design](responsive_design.md) for every existing and future
activity. Phone, iPad/tablet, and desktop are mandatory. After finishing new content,
run the full existing-content layout matrix and inspect captures. A4 print output
is optional and never substitutes for web-game verification.


## O-009 through O-011 daily movable-clef practice

Each activity uses nine questions selected from 36 distinct clef-anchor/target pairs (G for O-009, F for O-010, C for O-011) (anchor lines 1–4 and nine internal staff positions). Shanghai dates select disjoint sets across four consecutive days; the four-day cycle repeats. Refresh keeps the daily set; New set advances it. Students click A–G directly and click another letter to correct an answer; there is no selection/eraser toolbar on these three activities. Each example labels its anchor and the next higher note (G/A, F/G, C/D) with a curved arrow and one-step explanation, without cartoon decoration. Clef glyphs have expanded SVG bounds. All relative-note A–G controls use one row. No original masters are modified.

## O-013 keyboard practice

Open `/keyboard.html` from the selector. Run `BASE_URL=http://127.0.0.1:8797 node tests/keyboard_browser.mjs` for three-keyboard coloring, complete circle/count answers, enlargement, celebration, reset, and screenshots. Lower keyboards fit the viewport initially; enlarged keyboards scroll. Students mark full-height red circles before revealing count options with “圈好了，开始数.” `npm test` covers partial edge exclusion, distinct keyboard lengths, and scoring. The full responsive matrix includes this entry; clipped keys inside intentionally scrollable keyboards are excluded from viewport-bound control checks.

## P-031 pitch motion

Open `/pitch-motion.html` from the shared catalog. Run `BASE_URL=<runtime-directory-url> node tests/pitch_motion_browser.mjs` for full blank/error/correction/completion/reset, speech calls, keyboard/touch, and six-size checks. `npm test` checks all 81 staff pairs plus 1,000 balanced generated pages. Generation uses two unique pairs of each type plus a rotating ninth type, includes both directions for non-repeats, and does not require a clef because only relative staff distance is assessed. Answers and per-question incorrect-submission counters are session-only. Follow the [shared assistance contract](../AGENTS.md#graduated-answer-assistance-2026-11-17) for third-error localization, sixth-error answers, blank checks, edits, and resets. Original DOCX/PDF/PIC sources remain unchanged.

## Answer-assistance verification

Use the canonical [shared assistance contract](../AGENTS.md#graduated-answer-assistance-2026-11-17).
Run `BASE_URL=<preview-origin-or-release-directory> node tests/retry_hints_browser.mjs`
for every scored worksheet, the five scored menu games, and both neighborhood levels.
The suite verifies no early answer disclosure, third-error ellipses, sixth-error
answers, new-set cleanup, blank checks, and representative responsive hint captures.
Counters are not learner records and are never persisted.

## P-002/P-003 local pitch adaptations

Open `/key-notes.html` and `/fish-notes.html`. Run `BASE_URL=<runtime-directory-url> node tests/pitch_notes_browser.mjs` for independent staff-coordinate answer derivation, nine-question completion, wrong-answer thresholds, correction, keyboard/touch input, reset and five viewport captures. The full responsive suite covers both pages and all existing activities (108 cases). CI includes the new flow. Pure generation checks cover 500 sets per activity. The P-002 browser flow additionally asserts that both keyboards remain visible, initial and selected keys have no note-name labels, changing groups clears the marked position, and white-key scales match with at least 44px touch widths. No static note-to-key lookup guide or named anchors are permitted. P-002 uses C3–B3 in bass and C4–B4 in treble, with all seven letters per set. P-003 labels the nine shared fish with source-style letter case and octave superscripts, using verified staff pitches to resolve inconsistent source fish text; its source has ten staves and nine distinct pitches, with C4 represented twice. The digital version alternates the C4 clef and independently shuffles fish and staff targets. The bank must contain exactly the nine staff pitches and must not duplicate their display order. `assignFish` enforces one-to-one reassignment without mutating the prior answers. The browser suite tests keyboard/touch matching, moving, replacing, clearing, hints, and completion/reset. P-003 retains the source left-scattered-fish/right-single-column composition on phone, tablet and desktop by explicit user instruction. There is no mobile horizontal tray or per-question card grid. `fishPositions` owns source-relative fish anchors; `drawFishLines` recomputes student-pair paths from actual element bounds after redraw/resize. The scene height derives from nine staff rows, with minimum 44px fish controls. The pitch browser flow checks single-column staff geometry, staggered fish, touch target sizes and all nine connection paths. It also checks every clef bounding box against its SVG viewBox at all five sizes, and confirms that the canceled perimeter seaweed is absent. Use the full staff bounds; the former compact viewBox clipped the treble-clef tail. Both activities share the existing local profile/speech and celebration contracts, with session-only answers. No source master is edited.

O-003 now generates a permutation of all nine internal staff positions per page (five line notes, four space notes); progress and blank counts use nine. `BASE_URL=<runtime-directory-url> node tests/balloons_browser.mjs` checks the visible denominator and full correction/completion/reset flow.

## P-004 fish coloring

Open `/fish-steps.html`. Run `BASE_URL=<runtime-directory-url> node tests/fish_steps_browser.mjs` for blank checks, third/sixth-error thresholds, erasing, correction, completion/reset, keyboard and six viewport captures. P-004 uses twelve source note pairs in a fixed responsive grid, with three columns on larger screens, two on phones, and one on very narrow screens. Never randomize fish positions or distort decorations. Keep a single proportionally scaled bottom seaweed cluster separate from answer targets. Whole tones are blue; B–C and E–F semitones are red. Brush selection, fish painting, erasing, direct correction, local profiles, speech, third/sixth-error assistance and celebration share existing contracts. Answers are session-only; New page clears colors without rearranging fish. Original source masters remain unchanged.

## Selector cover maintenance

The catalog uses real unanswered exercise captures for worksheet, Note Neighborhood, and Staff Race cards, bundled as `assets/preview_*.jpg`. Run `BASE_URL=<source-preview-origin> node scripts/activity_previews.mjs` with a local source server to regenerate them. The script uses an isolated browser context, waits for fonts/images, and captures content rather than profile fields. Restart the preview server after adding assets. Inspect every cover and run the hub browser flow and full responsive matrix against the packaged build. Covers are illustrative snapshots, not the next generated question set.

## P-005/P-006 verification

Open `/fish-keys.html` and `/key-names.html`. Run `BASE_URL=<runtime-directory-url> node tests/keyboard_names_browser.mjs` for independent answer derivation from rendered red-marker coordinates, reusable fish choices/erase, touch, keyboard focus, P-005 whole-page first/second/third-error hints (including newly incorrect answers on the second check) and P-006 third/sixth-error hints, complete answers, celebration and reset. Node tests cover 500 generated sets per type and immutable answer replacement. P-005 additionally checks seven viewport sizes (including 320px width), 44px interaction targets and simultaneous visibility of every option, target and completion button without vertical page scrolling, and SVG text bounds within the fish belly. Both pages are included in the 108-case responsive matrix and runtime allowlist.

## P-007 verification

Run `BASE_URL=<runtime-directory-url> node tests/sea_neighbors_browser.mjs` for the nine prompts, eleven blank positions, visible dropdowns, question spacing, shared hint thresholds, completion/reset, speech dispatch, keyboard focus, emulated touch, and six viewport captures. Repeat the command with `--solfege` to open “唱名版海底世界” from the catalog and check the lowercase choices and all eleven expected answers. The variants share `sea-neighbors.html`, with `?notation=solfege` selecting fixed-do syllables. Regenerate the two menu images with `BASE_URL=<source-origin> node scripts/activity_previews.mjs sea-neighbors` and the same command with `sea-solfege`. Both entries are in the responsive matrix.
