# Music Activity Studio: Internal Guide

Last updated: 2026-11-16

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
Update docs and tracker before delivery. Ignore `.runtime/` and `node_modules/`.
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
proportions and highlight bubbles with enclosed-body masks. Error feedback reports
counts only, with no per-item answer hints. Keep the five-character monochrome
celebration dismissible, respect reduced motion, and stop it on edits/new pages.

Keep O-003 staff baseline, spacing, and note size consistent across shapes. Balloon
speech is user-triggered, uses available browser Chinese voices, and must cancel
on lifecycle transitions. Preserve written instructions and unavailable-voice feedback.

## O-005 local prototype

`cheesecake.html`, `cheesecake.css`, and `src/cheesecake*.mjs` adapt the original
nine-cake S/L worksheet. Share the O-003 local profile and speech adapters and preserve
aggregate-only feedback and the five-character celebration. Every page includes all
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

`activities.html` is the nine-worksheet selection hub, linked from the existing
six-game index. Every worksheet returns to this hub. `hands.html` and `cows.html`
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
Apply the same local-profile, speech, aggregate-feedback, eraser, and celebration
contracts as O-003/O-005. Keep all nine worksheet entries in the runtime allowlist.

## O-007/O-008 local trials

`ladybirds.html`, `sunshine.html`, `staff_worksheets.css`, and `src/staff_worksheets*.mjs`
own the staff placement, two-note comparison, and relative-note trials. O-007 has twelve
requested placements covering all nine internal staff positions. O-008 uses twelve two-note comparisons, balanced across rising, falling, and repeated pitches. The user explicitly removed line/space numbering on 2026-11-15; do not restore it. Count lines/spaces from the bottom. Use open
noteheads with transparent centers, accessible SVG targets, and native artwork ratios.
Preserve shared local profiles, speech cancellation, aggregate-only feedback, erasing,
and the five-character celebration. O-009 uses nine daily single-note questions with movable G-clef anchors. Name every target relative to its displayed clef position; never treat source row letters as arbitrary reference pitches or repeat given notes in its cards. O-010/O-011 use the same nine-question daily practice with movable F/C anchors and single target notes. BravuraText uses a 100-unit font size and a shared bottom-line baseline at SVG y=106 for 20-unit staff spacing. Pointer placement must not restore SVG target focus; retain visible keyboard focus. The selector has nine worksheet entries.

## Responsive web games, confirmed 2026-11-15

All existing and future interactive content must adapt to phone, iPad/tablet, and
desktop screens. Reuse source learning goals and artwork, never copy a paper/A4
composition into the game. Screen acceptance requires all three device classes,
including portrait/landscape and usable controls; print pagination is not evidence.
After completing new content, recheck all completed activities. The canonical design
and verification procedure is [responsive design](docs/responsive_design.md).


## O-009 through O-011 daily movable-clef practice

Each activity uses nine questions selected from 36 distinct clef-anchor/target pairs (G for O-009, F for O-010, C for O-011) (anchor lines 1–4 and nine internal staff positions). Shanghai dates select disjoint sets across four consecutive days; the four-day cycle repeats. Refresh keeps the daily set; New set advances it. Students click A–G directly and click another letter to correct an answer; there is no selection/eraser toolbar on these three activities. Each example labels its anchor and the next higher note (G/A, F/G, C/D) with a curved arrow and one-step explanation, without cartoon decoration. Clef glyphs have expanded SVG bounds. All relative-note A–G controls use one row. No original masters are modified.
