# Music Activity Studio: Internal Guide

Last updated: 2026-11-26

An independent repository. When nested, inherit parent and games guides. Write project
documentation in English; product UI may remain Chinese. Repository and checkout names
use kebab-case. Keep this guide usable when cloned alone.

`src/core.mjs` owns pure seeded generation and validation; `src/app.mjs` owns the
shared menu/session flow and six views; `src/audio.mjs` owns playback and cancellation.
`src/storage.mjs` owns safe bounded browser history.
`style.css` owns responsive and print styles. Follow [development](docs/development.md)
for operation and [the tracker](docs/progress_tracker.md) for current evidence.

All six entries must remain playable. Keep quarter-note beat units explicit, accept
multiple valid duration combinations, distinguish generic interval degrees from
semitones, retain curated chord spellings and scientific pitch octaves, and label
fixed-do tasks clearly. Preserve first attempts, including empty submissions. Each
rhythm cell is exactly one quarter-note beat. Bingo calls must cover distinct board
tokens; repeated taps cannot advance the call. Stop audio/speech on navigation and
cancel pending resume callbacks. Keep runtime assets self-contained and maintain
licenses. Do not resave Illustrator originals or change Note Trainer.

No accounts, cloud, analytics, paid generation, or service worker without a product
decision. Run relevant Node and browser checks; inspect changed screens and printing.
Close each substantive task by reviewing this guide, operating docs, public overview,
and tracker without waiting for a user request. Update durable rules here, record
verification in the tracker, and record which documents were updated or reviewed and why.
In a nested checkout, explicitly review the games and workspace guides for effects on
shared guidance and apply their documentation completion gate. In a standalone checkout,
record any needed parent follow-up in the tracker. Ignore `.runtime/` and `node_modules/`.
Commit complete units locally with Chinese verb-first subjects under 50 characters.
Push/deployment needs authorization. Commit this game before updating its parent gitlink.

## Release and visibility

The user authorized public GitHub Pages publication on 2026-11-12. This repository is
public by that explicit exception to the private-by-default workspace rule. Deploy only
the runtime build from `npm run build`, not the source tree. Preserve noindex crawler
directives. Follow the canonical release procedure in `docs/development.md`, including
online hashes, actual browser checks, and post-deployment documentation before handoff.

## O-003 local prototype

The user selected browser-local student profiles on 2026-11-13. Real authentication,
cloud synchronization, and data collection are deferred until the content framework
is stable; later backend design should consult Note Trainer. Do not present local
profiles as authenticated accounts or send learner data to a service.

`balloons.html`, `balloons.css`, and `src/balloons*.mjs` own the separate trial;
`src/balloon_profiles.mjs` owns local display profiles. Preserve native artwork
proportions and highlight bubbles with enclosed-body masks. Error feedback follows the shared graduated assistance contract below. Keep the five-character monochrome
celebration dismissible, respect reduced motion, and stop it on edits/new pages.

Each O-003 page contains nine balloons, covering all five lines and four spaces once.
Keep O-003 staff baseline, spacing, and note size consistent across shapes. Balloon
speech is user-triggered, uses available browser Chinese voices, and must cancel
on lifecycle transitions. Preserve written instructions and unavailable-voice feedback.

## O-005 local prototype

`cheesecake.html`, `cheesecake.css`, and `src/cheesecake*.mjs` adapt the original
nine-cake S/L worksheet. Share the O-003 local profile and speech adapters and preserve
graduated answer assistance and the five-character celebration. Every page includes all
nine internal staff positions once. Bundle Patrick Hand and ZCOOL KuaiLe with their
OFL licenses. Keep the original worksheet and illustration sources unchanged.

## Beginning-reader controls

Prioritize recognizable pictorial controls for young beginners who may not read yet.
Keep accessible text labels alongside clear, prominent icons. Both worksheet erasers
use the bundled Lucide eraser SVG; the instruction-speech label is “听题干”. Anchor
O-005 S/L controls to artwork coordinates across screen sizes. Open noteheads must
leave staff lines visible through their centers for line notes.

The shared five-character celebration runs toward the right with front-facing smiles:
two banner bearers and three clappers. Palms must visibly meet during each clap;
retain reduced-motion support and dismissal. O-005 enlarged staves must leave visible
clearance above the cake-slice outline, including the lowest notehead.

## Worksheet selection, O-002 and O-004

`index.html` is the shared entry for the six games and all worksheet exercises.
Add each new activity to its training-area group in `src/catalog.mjs`. Give each
card a short title and a supporting description that explains the learner's task.
Keep the same responsive card widths across groups, including single-card groups. Use
`studio.css` for shared app presentation and retain each exercise's teaching layout.
Every exercise returns to the shared catalog. `activities.html` redirects there. `hands.html` and `cows.html`
share `src/activities.mjs`, `src/activities_core.mjs`, and `activities.css`.
O-002 preserves both hand identifications and all ten piano finger numbers, with
artwork-relative finger anchors. O-004 is a user-authorized new digital adaptation
of the planned cow clef activity, not a recovered worksheet. Use bundled Bravura
clefs and enclosed spot masks; never redraw clefs or modify original AI files.
The nineteen cow regions include fifteen original body/leg patches, both original
horns, and two extra body outlines on a derived SVG image. The face has no activity
patches, the original black ears remain decorative, and the muzzle retains its smile.
New outlines and masks use smooth cubic SVG paths; source AI/clean PNG stay untouched.
`src/cow_regions.mjs` records patch area centroids and exact Bravura glyph paths/bounds;
center visible glyph ink inside each patch. Display full English names “Treble clef”
and “Bass clef”.
Apply the same local-profile, speech, graduated-feedback, eraser, and celebration
contracts as O-003/O-005. Keep all worksheet entry pages in the runtime allowlist.

## O-007/O-008 local trials

`ladybirds.html`, `sunshine.html`, `staff_worksheets.css`, and `src/staff_worksheets*.mjs`
own the staff placement, two-note comparison, and relative-note trials. O-007 has twelve
requested placements covering all nine internal staff positions. O-008 uses twelve two-note comparisons, balanced across rising, falling, and repeated pitches. The user explicitly removed line/space numbering on 2026-11-15; do not restore it. Count lines/spaces from the bottom. Use open
noteheads with transparent centers, accessible SVG targets, and native artwork ratios.
Preserve shared local profiles, speech cancellation, graduated answer assistance, erasing,
and the five-character celebration. O-009 uses nine daily single-note questions with movable G-clef anchors. Name every target relative to its displayed clef position; never treat source row letters as arbitrary reference pitches or repeat given notes in its cards. O-010/O-011 use the same nine-question daily practice with movable F/C anchors and single target notes. BravuraText uses a 100-unit font size and a shared bottom-line baseline at SVG y=106 for 20-unit staff spacing. Pointer placement must not restore SVG target focus; retain visible keyboard focus.

## Responsive web games, confirmed 2026-11-15

All existing and future interactive content must adapt to phone, iPad/tablet, and
desktop screens. Reuse source learning goals and artwork, never copy a paper/A4
composition into the game. Screen acceptance requires all three device classes,
including portrait/landscape and usable controls; print pagination is not evidence.
After completing new content, recheck all completed activities. The canonical design
and verification procedure is [responsive design](docs/responsive_design.md).


## O-009 through O-011 daily movable-clef practice

Each activity uses nine questions selected from 36 distinct clef-anchor/target pairs (G for O-009, F for O-010, C for O-011) (anchor lines 1–4 and nine internal staff positions). Shanghai dates select disjoint sets across four consecutive days; the four-day cycle repeats. Refresh keeps the daily set; New set advances it. Students click A–G directly and click another letter to correct an answer; there is no selection/eraser toolbar on these three activities. Each example labels its anchor and the next higher note (G/A, F/G, C/D) with a curved arrow and one-step explanation, without cartoon decoration. Clef glyphs have expanded SVG bounds. All relative-note A–G controls use one row. No original masters are modified.

## O-013 keyboard practice

`keyboard.html`, `keyboard.css`, and `src/keyboard*.mjs` own three black-key coloring keyboards (one each of C–E, F–B, and C–B) and two circle/count keyboards. A complete group is C–B (seven white keys and five black keys); cropped edge groups do not count. Do not presegment or label answer groups. Preserve correct keyboard geometry and proportional scaling of key width and height, first/last-key circle creation, circle removal, whole-keyboard overview, circle-then-count staging, direct count replacement, horizontal scrolling when enlarged, enlargement, keyboard access, and graduated answer assistance. Original worksheet masters remain unchanged.

## Note Neighborhood

`note-houses.html`, `note-houses.css`, and `src/note_houses*.mjs` own a separate two-level game. Use the user-selected accessory-free seven-character artwork, individually clipped from the original sheet. Houses use the selected softly peaked thick roof and have no pitch labels. The complete grand staff, both clefs, and all seven houses must remain visible together without scene scrolling. Recompute notation geometry from the available scene dimensions; never stretch houses or clefs nonuniformly. House centers are G3–F4, half a staff spacing apart, with a short middle-C ledger. House ink height is 60% of staff spacing: space houses keep approximately 20% clearance on either side; line houses straddle the line. Preserve a separate minimum 44px interaction region without enlarging the visible artwork.

Level 1 supports pointer dragging, tap-then-place, and keyboard controls. Incorrect placements show a large red cross and retry message above the attempted house for two seconds; preserve the selected note and block new placements during that interval. Reset/navigation clears the indicator and timer. Tray letter labels are enlarged for recognition. Level 2 marks the speaking resident with a persistent, high-contrast downward arrow above its house, updated on every question and resize. Incorrect Level 2 answers show a large red cross and “找错了，再找找” above the selected character for two seconds, using the same retry lock and cleanup as Level 1. It places one resident at home and asks about neighbors one to three diatonic staff steps above/below, within these seven pitches. Each six-question round includes all six direction/distance combinations. Progress is session-only; no learner records are collected. Every neighbor question automatically speaks its exact visible first-person prompt on entry, next, and restart, using a Chinese voice when available; the speech button replays it. Speech stops on correct answers, reset, navigation, and page hiding. A licensed Bravura E000 brace spans both staves. Correct answers trigger brief confetti, with a static alternative for reduced motion and cleanup on lifecycle changes. This prototype has its own completion dialog, rather than the worksheet celebration, and does not require a local student profile. It uses the shared catalog card format. `src/note_house_piano.mjs` owns local Salamander piano sample playback. Match characters to G3/A3/B3/C4/D4/E4/F4 (MIDI 55/57/59/60/62/64/65), never to a single shared octave. Play on selection/drag pickup, each Level 2 reference prompt, and resident-house replay. Stop notes on reset/navigation/hiding and reject stale asynchronous resume/decode results. Keep bundled sample attribution accessible. No publication is authorized by local preview work.

## P-031 pitch motion

`pitch-motion.html`, `pitch_motion.css`, and `src/pitch_motion*.mjs` own a nine-pair practice with two each of step, skip, leap, and repeat plus one extra category that rotates across new sets. Count consecutive staff line/space positions: absolute distance 0 = repeat, 1 = step, 2 = skip, and 3 or more = leap. Non-repeat categories include both ascending and descending pairs; all pairs are distinct and stay within the nine internal staff positions. Show four worked examples, direct replaceable answer buttons, shared local profiles, speech cancellation, graduated feedback, and the five-character celebration. Use the shared graduated assistance contract below, circling the two noteheads on the third error. Use correct English Step/Skip labels rather than the swapped labels in the source. Preserve original P-031 masters. Published with explicit user authorization on 2026-11-17; subsequent pushes require authorization.

## Graduated answer assistance, 2026-11-17

Except for the later P-005-specific override below, the user requested this contract for every scored activity, superseding earlier
aggregate-only and never-reveal rules. `src/retry_hints.mjs` owns session-only
per-question counters, noninteractive red ellipse overlays, and correct-answer text
next to the existing feedback. The third
incorrect answered submission circles the error location; the sixth incorrect
submission displays the correct answer. Errors four and five retain localization
without revealing the answer. Blank checks do not increment or reset counters.
A correct check resets that question; a new question/set/restart resets its counters.
Answer edits clear displayed cues while retaining counts until checked again.
Rhythm lab has no scored answers and remains unchanged. Bingo counts per call;
Note Neighborhood counts per character placement or neighbor question, preserving
its existing two-second retry lock. Keyboard coloring counts selected white-key
errors individually, while circle ranges and counts are separate tasks per keyboard.
Correct answers remain hints only: never replace student selections, mark them
correct automatically, advance rounds, or alter first-attempt scoring.

Run `BASE_URL=<preview-origin-or-release-directory> node tests/retry_hints_browser.mjs`
for blank/third/sixth/reset coverage across all scored entries and both neighborhood
levels. Original artwork, source worksheets, layouts, audio, and question generation
are outside this change. Local changes do not authorize push or deployment.

## P-002 and P-003 local adaptations, 2026-11-18

`key-notes.html`, `fish-notes.html`, `pitch_notes.css`, and `src/pitch_notes*.mjs` own two nine-question activities. P-002 requires independent staff-note identification, circling one of two simultaneously visible unlabeled keyboard groups, and then locating its white key. Do not show C–D–E/F–G–A–B lookup diagrams, named anchor keys, automatic names on selected keys, or an automatically chosen group. Selecting a group draws a red ellipse directly around that keyboard, excluding its selection button; the ellipse follows the selected group, clears on a new set, and cannot intercept key input. A selected key receives only a neutral position marker. Both groups use the same white-key scale, with at least 44px key widths; stack groups on narrow cards. The existing third/sixth-error assistance contract still applies; each set includes all seven letters and both standard clefs. Changing groups clears the selected key. P-003 is a one-to-one matching board with nine source-style note-name fish and nine independently shuffled staff targets. Render the letter case and octave superscripts on the fish body. Select a fish, then a staff target; show only the student-selected fish beneath that staff. Moving a fish clears its former target, replacing an occupied target releases the displaced fish, and each target has Clear match. Do not pre-match, add per-question answer choices, or reveal correctness before checking. By the user’s explicit 2026-11-18 instruction, retain the source composition at every viewport: staggered fish on the left, a single framed staff column on the right, the name/match-count area on the left, the retained bottom seaweed cluster, and the bilingual task caption below the scene. Do not restore cards, a fixed fish sidebar, a mobile horizontal tray, or multiple staff columns. Use natural staff-row height, vertical scrolling, and at least 44px fish targets rather than scaling a locked A4 image. Show each student match as a noninteractive line from its fish to its staff; recompute endpoints after redraw and resize. The user canceled the added perimeter seaweed on 2026-11-18; do not restore edge decorations or their reserved gutter. Keep the full staff SVG bounds (including the treble-clef tail), not the rejected compact viewBox. Keep source labels, native illustration proportions and keyboard focus. Its nine distinct source-staff pitches are F2, C3, A3, B3, C4, D4, A4, C5, G5; alternate the two source C4 clefs across sets. Use these rendered staff pitches rather than inconsistent fish text in the original. Preserve Bravura clefs, proper ledger lines, transparent noteheads, local profiles, user-triggered speech, keyboard/touch controls, shared graduated assistance, celebration and lifecycle cleanup. P-002 group/key attempts are independent. `assets/pitch_fish.png` is extracted unchanged from the original DOCX. Original masters remain unchanged. Local review only; no push/deployment authorization is inferred.

## P-004 whole tones and semitones, 2026-11-23

`fish-steps.html`, `fish_steps.css`, and `src/fish_steps*.mjs` own this activity. P-004 uses twelve source note pairs in a fixed responsive grid, with three columns on larger screens, two on phones, and one on very narrow screens. Never randomize fish positions or distort decorations. Keep a single proportionally scaled bottom seaweed cluster separate from answer targets. Whole tones are blue; B–C and E–F semitones are red. Brush selection, fish painting, erasing, direct correction, local profiles, speech, third/sixth-error assistance and celebration share existing contracts. Answers are session-only; New page clears colors without rearranging fish. Original source masters remain unchanged.

## Selector previews, 2026-11-23

Each illustrated worksheet card and the Note Neighborhood card use an actual exercise screenshot. The six generated mini-games use their identifying illustrations. Keep each preview specific to its destination. Regenerate bundled `assets/preview_*.jpg` with `BASE_URL=<source-preview-origin> node scripts/activity_previews.mjs` after relevant visual changes; use an isolated browser context without learner data. Preserve the shared card, keyboard focus, and phone/tablet/desktop layout.

## P-005/P-006 keyboard note names, 2026-11-23

`fish-keys.html`, `key-names.html`, `keyboard_names.css`, and `src/keyboard_names*.mjs` own these adaptations. P-005 has nine marked C–E/F–B keyboard questions covering all A–G notes plus two different repeated notes. Keep all seven reusable note-name fish options on the left and all nine targets on the right, visible together without page scrolling on phone, tablet and desktop in either orientation. Use the unchanged original round fish extracted from `P-005键盘B.docx` as `assets/keyboard_fish.png`. Current selection is yellow; options used in answers are green. Never add visible used/selected text badges. Answers show the selected fish, rather than a text-only match. Allow repeated use, direct replacement and erasing.

P-005 is a user-requested exception to the shared third/sixth-error contract. Count failed checks for the whole page: the first check containing incorrect answers only reports how many need thought; the second marks every currently incorrect answered fish with a red dashed ellipse, including answers made wrong after the first check; the third additionally shows all their correct letters. Blank-only checks do not consume/reset the page counter; edits clear cues while retaining its count. A completely correct page or a new set resets the counter. Do not change global hint thresholds. Fish letters use the same SVG coordinate system as the original image, with measured interior belly clearance, so all labels scale with the artwork instead of colliding with its outline. P-006 retains fifteen full C–B keyboards, A–G direct answers and shared third/sixth-error hints. Both retain local profiles, user-triggered speech, session-only answers, keyboard/touch controls and celebration. Original worksheet masters remain unchanged. Published on November 23, 2026, in release `d8db5436ce60`.

## P-007 neighboring note names, 2026-11-23

`sea-neighbors.html` groups the original ten three-letter prompts by seahorse, round fish, and pointed-fin fish. Preserve the twelve blank positions and the repeating A–G order, including G–A–B and F–G–A. Use uppercase consistently because this exercise assesses letter order. Keep each triple intact when groups wrap. Individual select controls support correction and clearing; shared third/sixth-error hints apply per blank. Keep artwork proportions, 44px answer targets, local display profiles, user-triggered speech, session-only answers, and celebration.

## Staff Race

`staff-race.html`, `staff_race.css`, and `src/staff_race*.mjs` own this same-device
game. Players select distinct characters with different colors and silhouettes.
Both pieces start in the first space below the staff and finish in the first space
above it. Show five extended staff lines with equal spacing and clear outer
margins. Keep the dice below the wide board. Center each notehead vertically on
its row and keep character decoration within the neighboring line bounds. Every adjacent line or space is one step. Roll a legal
direction and one to four steps, requiring one deliberate placement per step.
The optional move guide shows circles on all 11 rows in the active player's lane
during a move in levels 1 and 2. Keep both pieces visible on shared rows. Use the
shared third/sixth-error cues in levels 1 and 2 and leave the piece in place on
an error. The next-level action starts a fresh match. From level 3 onward, hide
the guide and give basic retry feedback without identifying the correct row. First arrival wins immediately. Compare
final height after ten rounds if neither arrives, allowing ties. A round gives
each player one turn. Restart returns to character selection, retains selections,
and alternates the opening player. Match state lasts for the session. Keep the
page and its board preview in the catalog and runtime package.
