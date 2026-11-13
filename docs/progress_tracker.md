# Progress Tracker

Last updated: 2026-11-13

## Six-in-one local demo

The user approved a playable demo with six menu entries, an independent private
repository, and kebab-case repository/checkout naming. All six entries have playable
core interactions. The game runs locally on port 8787, without runtime dependencies
or external asset requests. Repository creation is complete; no code push or hosting
has been authorized or performed.

Implemented shared seeded generation, two difficulty settings (shop/interval effects),
first-attempt scoring for four six-round games, a local results history, same-seed
replay, rhythm playback/editing, spoken Bingo calls, and print exercises/answer pages.
The app reuses six original illustration exports and bundles licensed BravuraText.

Verification: six Node tests pass, including 6,000 unique generation sessions
(36,000 generated items), equivalent duration answers, first-error retention, Bingo
lines, and pending-audio cancellation. Chrome passes 28 screen/viewport checks,
four completed sessions and replay, rhythm editing/playback start, Bingo completion,
printing, and no page errors. Final screenshots and the two-page A4 shop print were
visually reviewed. See [the audit](audit_20261112_demo/audit.md).

Physical iPad touch, Safari interaction, human audible playback/speech acceptance,
full worksheet coverage, and public-redistribution rights review remain open. There
are no learner accounts, cloud sync, service-worker installation, or performance
recognition. In-app preview automation timed out; automated Chrome supplied the
actual browser verification. A preview link is local to the serving Mac.

Documentation updated: AGENTS, README, development, asset provenance, and this tracker;
parent coordination/design docs and game navigation are updated separately. Worksheet
instructions and Note Trainer documentation remain accurate unchanged because neither
source collection nor existing application changed.

Source readability follow-up: formatted HTML, CSS, JavaScript, server, and tests into
standard multiline layout with pinned Prettier 3.6.2. The six Node tests passed again.
This changes formatting only; prior browser evidence remains applicable. AGENTS,
README, development, and asset guidance were reviewed unchanged because behavior,
commands, ownership, and verification limits are unchanged.

## Code quality audit and GitHub publication, 2026-11-12

The user authorized audit/fixes, push, GitHub Pages deployment, and public repository
visibility with search-engine exclusion declarations. The runtime fixes, twelve Node
tests, production-build browser checks, dependency audit and release design are recorded
in [the audit](audit_20261112_code_quality/audit.md). This supersedes the initial local-only
publication status. Pages published build `44a2e6245a64` from runtime commit `0b13fe4` on 2026-11-13.
[Actions run 43254116093](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43254116093)
succeeded. All 15 remote entry/runtime hashes match the verified local build. Both
Chrome suites passed again against the actual Pages URL, including the 28 responsive
screen cases and iPad-size touch/failure checks. Actual macOS Safari loaded the exact
release without login and completed a correct rhythm-shop answer. Physical iPad and
human audible acceptance remain open.

Live URL: https://fangjiaqifion.github.io/music-activity-studio/

The repository is public by explicit user approval. Runtime pages declare noindex,
nofollow and noarchive. The unused Sites draft was not deployed and is not part of
this application. Source and post-deployment evidence are pushed to GitHub; the parent
records only a local submodule update. Documentation-only pushes do not redeploy.

Updated runtime instructions, README, development procedure, this tracker, and the audit.
Asset provenance is unchanged: copied artwork and licensed font are the same. Existing
worksheets, Note Trainer, and unrelated parent research work remain unchanged.

## O-003 worksheet-first prototype, 2026-11-13

The user rejected the rhythm-shop visual direction and requested a faithful electronic
trial of O-003 气球 B. A separate `balloons.html` page reuses the original round,
heart, star, and bunny illustrations, with randomized staff positions, twelve balloons,
balanced line/space tasks, color selection, erasing, checking, correction, new pages,
and a print action. No source worksheet was edited. This is a local prototype, not
a published replacement for the existing six-game release.

The English instruction is corrected to “Color the space notes red and the line notes
blue.” The source misspells “distinguish” and uses nonstandard note terminology.
Patrick Hand is bundled under OFL, with no external runtime requests.

Chrome desktop (1100 px) and mobile (390 px) screenshots were inspected; mobile has
no horizontal overflow. Click/color/check behavior works. The generation test checks
1,000 pages, balanced answers, and coverage of all nine internal staff positions.
The existing twelve tests also pass. Physical tablet and print pagination acceptance
remain open. The in-app browser attempt timed out; independent Chrome supplied QA.

Documentation updated: this tracker and asset provenance. AGENTS, development,
and README were reviewed unchanged: the separate local prototype does not replace
the released menu or change existing game procedures. Parent tracker records coordination.

## O-003 local classroom refinements, 2026-11-13

The user chose local testing and browser-local student profiles for now. Real accounts,
cloud synchronization, and data collection are deferred until the content framework
is complete; a later design should study Note Trainer's backend approach. This is a
future direction, not an implemented service or publishing authorization.

Implemented local profile creation/selection, remembered active student, and automatic
worksheet header name/date in the Asia/Shanghai calendar (YYYYMMDD). Profiles are
browser-local display identities, not authenticated accounts. No exercise records,
analytics, or cloud requests were added; browser storage failure is reported.

Derived enclosed-body masks fix the transparent heart's highlight tint bug; original
heart/star and other balloons render with preserved aspect ratios. Incorrect answers
show only an aggregate error count, with uncolored balloons counted separately.
No per-balloon correctness marker or answer location is exposed. A fully correct
page triggers five monochrome note characters clapping and dancing across the screen
with a “你真棒！ / Well done!” banner. It supports dismissal, reduced motion,
automatic exit, and cancellation on edits/new pages.

Verification: 15 Node tests pass, including profile persistence/failure and Shanghai
date rollover; dedicated Chrome checks cover profile reload, blank/error-only feedback,
five celebration characters, reset, 390 px mobile overflow, and no JS errors.
Desktop, celebration, and mobile screenshots were inspected. Print and physical-device
acceptance remain open. Original worksheet/Illustrator files and Note Trainer unchanged.

Documentation updated: AGENTS, README, development, asset provenance, this tracker,
and parent coordination. Existing six-game release behavior remains unchanged.
No push or deployment.

## O-003 readability, speech, and friendly celebration, 2026-11-13

All balloon staves now share one SVG baseline, line spacing, width, and note size.
Artwork keeps its original aspect ratio and body-only tint masks. Shorter strings
and larger balloon bodies prioritize musical content. Desktop uses four columns;
mobile uses two. The completion action is now “✓ 完成 · Done”.

A user-triggered “听一听” button speaks the full Chinese instructions; selecting
red/blue speaks “请用红色涂间音气球” / “请用蓝色涂线音气球”.
The full prompt also tells children to use the checkmark when done. Speech uses the
browser's available Chinese voice, with readable fallback text if unavailable.
New playback replaces previous speech; navigation, hidden pages, completion,
printing, and new questions cancel playback. No audio file or cloud speech service
was added. Actual voice quality and audible device acceptance remain unverified.

Replaced the previous narrow note-glyph dancers with original round monochrome
cartoon characters: large white smiling faces, gloves, flexible limbs, and rounded
shoes. Five characters retain clapping/dancing, left-to-right travel, and the banner.
This supersedes the prior provenance description of font-glyph celebration bodies.

Verification: 17 Node tests pass, including speech replacement, Chinese voice choice,
and unavailable-speech fallback. Dedicated Chrome checks pass common staff positions,
completion label, profiles, aggregate-only feedback, five dancers/reset, mobile overflow,
and JS errors. Inspected desktop/mobile and celebration screenshots. Build succeeds.
Human speech acceptance, physical tablet, and print pagination remain open.

Updated this tracker, asset provenance, README, AGENTS, development, and parent
coordination. Existing six-game procedures and original masters remain unchanged.
Local-only; no push or deployment.

## O-005 cheesecake local trial, 2026-11-13

Implemented a separate `cheesecake.html` prototype faithful to the original nine-cake
S/L circle activity. Each new page permutes all nine internal staff positions. Original
art proportions, local student name/date, optional Chinese speech, aggregate-only
errors, erasing, checkmark completion, and five monochrome celebration characters are
preserved. Chinese uses bundled ZCOOL KuaiLe; English uses Patrick Hand, both SIL OFL.

English review: replace the original comma splice, unnecessary definite articles,
capitalization, and trailing tilde with “Circle S for a space note and L for a line
note.” The digital interaction also says “Tap S or L on each cake, then tap Done.”
Original DOCX/PDF files are unchanged; this correction applies only to the trial.

Verification: 18 Node tests pass, including 1,000 nine-position pages. Dedicated
Chrome checks pass empty/error-only feedback, correction, celebration, erasing, reset,
390 px overflow, and no page errors. Desktop/mobile screenshots inspected. Chrome print
capture is one A4 page. Production build succeeds. Physical iPad, human speech, and
printed-paper acceptance remain open. Local preview uses port 8791; no push/deployment.

Updated AGENTS, README, development, asset provenance, and this tracker. Parent,
worksheet, and games guides/overviews reviewed unchanged because ownership and original
masters remain applicable. Parent tracker records coordination and the local gitlink.

## Beginning-reader worksheet refinements, 2026-11-13

Both O-003 and O-005 now label instruction playback “听题干” and show a prominent
licensed Lucide eraser icon alongside text. O-005 S/L centers are anchored to the
original cake slices at all viewport sizes; removed mobile offsets and minimum-size
shifts. Transparent open noteheads preserve staff lines through line-note centers.

Both focused Chrome suites pass, including desktop/mobile S/L anchor checks,
transparent noteheads, successfully loaded eraser icons, labels, correction, erasing,
reset, aggregate-only feedback, and five-character celebration. Desktop/mobile
screenshots were visually reviewed. Eighteen Node tests and the build pass.
Physical iPad, human speech, and printed-paper acceptance remain open. Local preview
for both entries is port 8793. No push or deployment.

Updated AGENTS with the user's beginning-reader pictorial-control preference, asset
provenance, and this tracker. README/development and parent/worksheet/games guides and
overviews reviewed unchanged because capabilities and source ownership are unchanged.
Parent tracker records coordination. Original masters and unrelated work are preserved.
