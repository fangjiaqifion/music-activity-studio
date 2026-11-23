# Progress Tracker

Last updated: 2026-11-23

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

## O-005 slice centers and paired examples, 2026-11-13

The user found the earlier S/L placement still too low. Moved both letters upward
into the centers of the two triangular slice top faces, retaining proportional
anchors across desktop and mobile. This supersedes the previous placement acceptance.
Replaced the single example with paired illustrated cards: “L = line / 线音” and
“S = space / 间音”. Chinese instruction speech now explains both abbreviations.
English labels are correct; uppercase answer letters match the worksheet controls.

Focused Chrome checks pass paired examples, revised anchors at 1100/390 px, notehead
transparency, icons, and the full answer/erase/celebration flow. Desktop/mobile
screenshots inspected; print remains one A4 page. All 18 Node tests and build pass.
No push or deployment. Physical-device and human speech acceptance remain open.

Updated this tracker. AGENTS, README, development, provenance, and parent/worksheet/
games guidance reviewed unchanged because the established interaction and asset rules
remain accurate; no new asset or procedure is introduced. Parent coordination updated.

## Running celebration and larger O-005 staves, 2026-11-13

Redrew both worksheets' five monochrome characters with right-facing running bodies,
front-facing smiles, two banner bearers waving, and three clappers with finger detail.
Palms meet during the closed phase, with short contact sparks. Parade duration is
seven seconds (previously twelve); running legs alternate and claps repeat every
0.44 seconds. Dismissal, reset, aggregate feedback, and reduced motion are preserved.

O-005 staff width increases from 82 to 96 artwork units, spacing from 12 to 13, and
notehead size proportionally increases. The staff shifts upward so its bottom is at
80 rather than 86, leaving space above the cake outline and for the lowest notehead.
S/L positions remain unchanged.

Verification: both worksheet Chrome suites pass. New celebration browser checks pause
each staggered animation at its contact phase and confirm all three palm pairs touch
on both pages; five runners/two bearers and reduced motion pass. Screenshots visually
reviewed for gestures, staff clearance, and layout. Eighteen Node tests and build pass.
Physical-device and human-motion/speech acceptance remain open. Local-only, no push or
deployment. Updated AGENTS, development, provenance, tracker, and parent coordination.
README and parent/worksheet/games guides reviewed unchanged because capabilities,
ownership, and original masters remain accurate.

## O-002/O-004 and worksheet selector, 2026-11-13

Implemented `activities.html`, a responsive illustrated hub for O-002, O-003,
O-004, and O-005, linked from the existing six-game index. All four worksheets
return to the hub. O-002 reuses original hand PNGs, identifies both hands, and
fills all ten piano finger numbers with anchored circular controls. New pages
alternate hand placement. O-004 uses the original cow preview and six enclosed
spot masks with balanced randomized treble/bass clefs, red/blue paint, and erasing.
The user explicitly confirmed this new digital adaptation because the original
O-004 worksheet is missing. Do not mark the missing master as recovered.

Both trials retain browser-local student name/date, Chinese instruction speech,
visible fallback text, aggregate-only blank/error counts, correction, printing,
and the shared five-character dismissible celebration. No exercise records,
accounts, cloud calls, or analytics were added. Reviewed the English instructions:
“Identify each hand, then number the fingers from 1 to 5.” and “Color treble clefs
red and bass clefs blue.” Original masters and Illustrator sources are unchanged.

Verification: 20 Node tests pass, including balanced changing clef pages and piano
finger scoring. Focused Chrome checks pass four hub links, loaded images/fonts,
both complete correction/erase/reset/celebration flows, shared profiles, desktop
and 390 px mobile without overflow, and no failed resources or JavaScript errors.
Desktop/mobile screenshots were inspected, finger anchors and clef sizes refined,
and both Chrome print captures are one A4 page. Build passes. In-app preview timed
out; Chrome supplied browser evidence. Physical iPad, human audible speech, and
printed-paper acceptance remain open. Local-only, no push or deployment.

Documentation updated: AGENTS, README, development, provenance, this tracker, and
parent coordination tracker. Parent/games/worksheet guidance and overviews reviewed
unchanged: original-source ownership and the historical O-004 gap remain accurate.

## O-004 black/brown palette, 2026-11-13

The user replaced the initial red/blue mapping: treble clefs now use black and bass
clefs use brown. Updated both instruction languages, paint labels/swatches, full
and color-selection speech, answer validation, and the hub description. Filled
clefs turn white so they remain visible on dark patches. This supersedes the
initial palette above; O-003 retains its original red/blue controls.

Twenty Node tests, the build, and the focused hub/hands/cow Chrome suite pass.
The filled desktop cow screenshot was visually inspected for both colors and
readable clefs. Updated README, provenance, and this tracker. AGENTS and development
reviewed unchanged because ownership, commands, and interaction contracts are stable.
Local-only; no push/deployment. Parent coordination records the local gitlink.

## O-004 complete patches and centered clefs, 2026-11-13

Expanded from six to twenty randomized answers, balanced ten treble/ten bass.
All fifteen original enclosed white patches now carry symbols, including the
back and four legs. Five new outlines on a separate derived activity image add
forehead, muzzle, body, and flank tasks. The clean PNG and original AI stay intact.
Patch masks, area centroids, and contained ink slots are generated together.
Replaced baseline-positioned font text with exact bundled Bravura glyph SVG paths:
both glyph types center on patch area centroids using their actual ink bounds.
Black/brown fill and readable white symbols remain; no item-specific error hints.

Verified full English terms with the Open University's music-theory exercise:
https://www.open.edu/openlearn/history-the-arts/music/an-introduction-music-theory/content-section-2.7.4
It labels the symbols “Treble clef” and “Bass clef”. Expanded the previous short
example labels accordingly. The existing instruction uses the correct plural
forms “treble clefs” and “bass clefs”; its wording remains valid.

Twenty Node tests and build pass. Focused Chrome checks pass all twenty selections,
aggregate feedback, correction, erasing, reset, celebration, profiles, complete
English labels, and actual SVG ink centering within one CSS pixel. Desktop/mobile
screenshots inspected; no overflow/resources/JS errors, one-page A4 print capture.
Physical iPad, human audio, and paper acceptance remain open. Local-only, no push.
Updated AGENTS, README, development, provenance, and tracker; parent coordination
updated. Parent/games/worksheet guidance reviewed unchanged: original masters and
source ownership, including the missing O-004 master, remain accurate.

## O-004 smooth outlines, smile, and fillable ear, 2026-11-13

The user found the new raster-drawn patch edges unclear. Replaced the five added
outlines with smooth cubic SVG paths and vector luminance masks. Runtime now uses
`cow_activity.svg`, embedding the untouched clean PNG; derived raster references
remain reproducible. A supersampled raster supplies geometry calculations, while
all original patch masks are calculated from the original clean raster directly.
Removed the below-nostril patch, added a curved smiling mouth, and substituted the
whole near ear as one fillable region. Twenty balanced questions remain. Symbols
still center on each region's area centroid with readable white ink after filling.

Verification: twenty Node tests, build, and the focused Chrome suite pass, covering
all twenty answers, ear selection, correction, erasing, reset, exact ink centering,
profiles, and celebration. Filled desktop and blank mobile captures were reviewed;
new edges, smile clearance, and ear placement were inspected. Print remains one A4
page. Physical-device, audible speech, and paper acceptance remain open.
Updated AGENTS, README, development, provenance, and this tracker. Parent/games/
worksheet instructions reviewed unchanged because source ownership and workflow
remain applicable. Local-only, no push/deployment; parent records the gitlink.

## O-004 clear face and fillable horns, 2026-11-13

The user revised the artwork requirements: removed all forehead/muzzle patches,
restored the original black ear, and made both original horns fillable clef tasks.
The smile remains. There are now nineteen questions (fifteen body/leg patches,
two horns, two extra smooth body patches), with ten treble and nine bass clefs.
This supersedes the earlier face/ear region choices and twenty-question count.
Black/brown mapping, centered licensed glyphs, and aggregate-only feedback remain.

Twenty Node tests, build, and full focused Chrome answer/correction/erase/reset/
centering checks pass. Filled desktop screenshot inspected: face clear, smile
visible, ears black, both horns filled and labeled. Mobile checks pass, and print
remains one A4 page. Updated AGENTS, README, development, provenance, and tracker;
parent coordination updated. Other owning guidance reviewed unchanged because
source ownership and procedures remain accurate. Local-only, no push/deployment.

## O-007/O-008 electronic worksheet trials, 2026-11-13

Added O-007 twelve-position note placement and O-008 nine line/space numbering tasks
plus twelve pitch-direction pairs. All nine staff positions are covered; rising,
falling, and same-height pairs are balanced. Original PNG exports are copied unchanged.
The six-entry selector links both trials. Shared local student/date, Chinese speech,
large eraser, aggregate-only feedback, correction, and five-character celebration remain.
Chinese uses ZCOOL KuaiLe and English uses Patrick Hand. Source DOCX/PDF/AI unchanged.

Verification: 21 Node tests pass, including 1,000 generated pages per new worksheet.
Focused Chrome complete-answer/blank/eraser/reset/profile/celebration/resource/mobile
checks pass. Desktop/mobile captures and O-008 print render inspected; both print
captures are one A4 page. Fixed header overlap and initially two-page O-008 printing.
Production build succeeds. Physical iPad and human speech acceptance remain open.
Local preview: http://127.0.0.1:8795/activities.html. No push or deployment.

Updated AGENTS, README, development, asset provenance, and this tracker. Parent/games/
worksheet guides and overviews reviewed unchanged because ownership, source masters,
and publication boundaries remain accurate. Parent coordination/gitlink updated locally.

## Responsive web-game acceptance and O-008 refinement, 2026-11-15

The user explicitly requires all completed and future interactive content to adapt
for phone, iPad/tablet, and desktop. Paper composition and A4 pagination are not
screen acceptance. This supersedes any earlier emphasis on one-page print output.
Consolidated Note Trainer's viewport, bounds, and real-question geometry principles
in `docs/responsive_design.md`; linked it from parent/games/game guides and development.
README now describes responsive games. Original masters and Note Trainer are unchanged.

O-008 adds illustrated line/space examples, clearer English, larger choices, keyboard
focus retention, phone single-column and tablet two-column layouts. Removed its print
button. O-007 also reflows to one/two/three columns. Cake answers retain artwork anchors
while cards stack on phones and use two columns on tablets. Shared controls, profile
badges, and footers wrap. Cow artwork retains the overview and adds enlarged local
scene answer tiles sharing the same answers, avoiding tiny-phone-symbol reliance.
Optional legacy print utilities do not govern screen layout.

Added `test:responsive`: all six worksheets plus selector across 390×844, 844×390,
768×1024, 820×1180, 1180×820, 1440×900, with control/page bounds, loaded artwork,
blank checks, reset, and captures. Existing full game browser/regression and all four
worksheet interaction suites pass before the final cow enlargement follow-up.
Twenty-one Node tests pass and dependency audit reports zero vulnerabilities.
Physical devices and human speech acceptance remain unverified. Final production,
push/deployment, and online evidence will follow below.

Documentation updated: parent/games/game AGENTS, responsive guide, development,
README, and tracker. Provenance reviewed unchanged: original assets and bundled
licensed glyphs are reused, with no new source asset or license. Existing dated
print evidence is retained as historical only. Fixed Pages triggers to include all
root HTML/CSS changes. Code formatting and focus behavior reviewed before push.

Final local production verification: build `0120c6cb7c95` passes all 42 worksheet/selector
viewport cases, including enlarged cow selection synchronized to the overview; full
hands/cow and staff worksheet interaction checks pass. The legacy six-game matrix
now passes 49 screen cases including phone and iPad in both orientations. Desktop,
phone, tablet portrait, tablet landscape, and enlarged-cow captures were inspected.
The deployment workflow now enforces the 42-case responsive suite as well.

## Published responsive activities, 2026-11-15

Pushed runtime commit `85345e1` and the preceding thirteen local worksheet commits.
[Pages run 43623400526](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43623400526)
completed successfully, including the new all-worksheet responsive CI gate. Published
build `0120c6cb7c95`; all 85 deployed runtime/entry hashes match the verified local
build. Chrome loaded the actual remote release and passed all 42 worksheet/selector
phone, tablet, and desktop cases, including enlarged-cow answer synchronization.

Live selector: https://fangjiaqifion.github.io/music-activity-studio/releases/0120c6cb7c95/activities.html
Live O-008: https://fangjiaqifion.github.io/music-activity-studio/releases/0120c6cb7c95/sunshine.html

Updated README to reflect published activities rather than stale local-only status,
and corrected the operational status in development. The responsive contract remains
mandatory for existing and future content. Physical iPad/Safari and human speech
acceptance remain open; browser emulation is not physical-device evidence. Parent
coordination records this deployment and its local gitlink separately.

The remote Chrome O-007/O-008 suite also passed complete answers, keyboard focus,
blank checking, erasing, reset, profiles, celebration, mobile layout, and resources.

## O-007/O-008 corrections and O-009 through O-011, 2026-11-15

The user's correction supersedes earlier O-008 descriptions: twelve two-note
higher/same/lower comparisons only, without line/space numbering. Examples, speech,
written instructions, count, and selector agree. O-007 no longer restores SVG target
focus after pointer answers, removing the browser's blue outline across a staff
line; keyboard focus remains visible and survives answer rerendering.

Added O-009 treble, O-010 bass, and O-011 alto relative-note activities. Each preserves
four original reference groups and their staff contours, with six unknowns per
group. Every responsive card repeats the red supplied note and letter beside one
black target; answers wrap diatonically through A to G relative to that supplied
letter. This preserves the source's relative-note exercise rather than replacing
its arbitrary references with absolute note identification. Reused original sun
art and licensed BravuraText SMuFL glyphs; checked clef baselines and full glyph
bounds. Original DOCX/PDF/AI masters are unchanged. The selector now has nine entries.

Verification: 22 Node tests, full staff complete-answer/blank/erase/reset/profile/
celebration/keyboard/pointer checks, all 60 worksheet/hub viewport cases, original
six-game 49-screen suite and regressions, hands/cow, balloon and cake flows pass.
Dependency audit reports zero vulnerabilities. Production build `0a633dae2a65`
passes the six-game suites and staff interaction checks; final responsive acceptance
and deployment evidence follow below. Close-up clef and pointer-selection captures,
phone, tablet portrait/landscape, and desktop layouts inspected. Physical devices,
Safari, and human speech acceptance remain open.

Updated AGENTS, README, development, responsive coverage, asset provenance, and this
tracker. Parent/games/worksheet guides and public overviews reviewed unchanged:
ownership, original-master preservation, and publishing boundaries remain accurate.
Parent coordination/gitlink will be recorded after game commits. Unrelated research
edits and runtime state are excluded.

Final production evidence: build `0a633dae2a65` passes all 60 responsive worksheet/
hub cases, the full staff interaction suite, and both original six-game suites.
Runtime commit: `2ce66c2`. Local preview: http://127.0.0.1:8802/activities.html.
Automatic approval review rejected the push/publication command because the current
request did not explicitly authorize this deployment and destination trust was
unverified. No push or deployment occurred. User approval is required before
publishing this prepared version; the online build remains unchanged.

## Worksheet code-quality review and release preparation, 2026-11-15

The user explicitly authorized code review, push, and publication, resolving the
previous approval boundary. Reviewed the O-007 through O-011 generator/scorer,
DOM rendering, focus, speech/profile lifecycle, entry allowlist, and Pages workflow.
Fixed canceled pointer gestures suppressing subsequent keyboard focus restoration
by deriving input mode from the activating event rather than mutable pointer state.
Added a regression for pointerdown followed by keyboard activation. Removed the
unreachable numbering renderer and obsolete clef offsets. The three fixed-source
relative exercises now say “Try again” instead of implying a different new page.

The full five-page staff interaction suite now runs in Pages CI, in addition to
responsive layout and legacy-game gates; its Chrome path supports Linux CI.
Twenty-two Node tests pass and full npm audit reports zero vulnerabilities.
Final runtime build: `3a673c526017`. Production browser and deployment results
follow below. Original worksheet/AI masters and learner-storage scope are unchanged.

Updated this tracker and the canonical development procedure. AGENTS, provenance,
responsive contract, and public overview reviewed: their ownership, assets, layout,
and instructional descriptions remain accurate. README publication status will be
updated after remote verification. No claims of physical-device or human-audio
acceptance are added.

Local production acceptance passed all 60 worksheet/hub cases, the five-page staff
interaction suite, and both legacy-game suites. Pushed review commit `0bf6c4d`.
The first Pages run `43669637639` correctly blocked publication: the newly added
staff suite did not normalize the trailing slash supplied by CI's release-directory
URL, so it opened a double-slash path and saw zero selector cards. Normalized its
base URL and reproduced the exact trailing-slash production URL locally before
retrying. Runtime content and build `3a673c526017` are unchanged by this test fix.

## Published worksheet corrections and additions, 2026-11-15

[Pages run 43669737093](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43669737093)
completed successfully for commit `31b2f76`, including Node tests, both legacy-game
browser suites, the five-page staff interaction suite, and all 60 responsive cases.
Published runtime build `3a673c526017`; all 88 deployed hashes match the reviewed
local build. Chrome opened the actual remote release and passed the complete staff
suite, including keyboard/pointer focus, blank/complete answers, erase/reset,
profiles, celebration, and resource loading. Remote responsive results follow below.

Live selector: https://fangjiaqifion.github.io/music-activity-studio/releases/3a673c526017/activities.html

This release supersedes the previous pending-publication status. README now reflects
all nine published worksheets. Guidance/provenance/responsive docs reviewed unchanged
because the final fixes did not alter ownership, assets, or screen acceptance rules.
Physical iPad/Safari and human speech acceptance remain open. Parent coordination
and gitlink are recorded locally after this game's evidence commit.

Actual remote Chrome also passed all 60 worksheet/hub phone, tablet portrait/
landscape, and desktop cases with working controls, loaded artwork, blank checking,
and reset. No page errors. Final publication verification is complete.

## O-009 G-clef instructional correction, 2026-11-15

The user corrected the relative-pitch interpretation and requested O-009 first.
The earlier arbitrary row-anchor implementation was instructionally incorrect for
this activity. O-009 now introduces the treble clef's second-line G once, then
shows one black target note per question. No repeated E/A reference or supplied
answer appears on question cards. All 24 answers derive from the fixed G position,
with cyclic diatonic letters. Instructions, speech, worked reference, and scoring
agree. O-010/O-011 behavior is unchanged pending separate review.

Added an independent staff-position/name table test and browser assertions requiring
one guide note, 24 single target notes, and no per-card given-note labels. Twenty-three
Node tests pass. Production build `baea09b16f51`; browser results follow below.
This correction is local for user review; the published version is unchanged.

Updated AGENTS, README, development, and tracker. Provenance and responsive guidance
reviewed unchanged: no new artwork, fonts, source master edits, or layout contract.
Parent/games/worksheet guides and public overviews reviewed unchanged because
ownership, preservation, and publication boundaries remain accurate.

Final verification: production staff interaction checks, all 60 worksheet/hub
viewport cases, the legacy games' 49-screen suite, and regression suite pass.
Inspected the G-example and single-target card captures at tablet width. No repeated
red reference appears on target cards; scoring uses the treble G anchor. Local review:
http://127.0.0.1:8810/releases/baea09b16f51/treble.html. No push or deployment.


## O-009 movable-clef review, 2026-11-16

Replaced the mistaken fixed-G interpretation with four moving G-clef anchors. Updated scoring, the introductory example, and independent browser answer derivation from rendered clef coordinates. All 23 Node tests pass. Local review: http://127.0.0.1:8812/treble.html. No push or publication. Documentation reviewed and updated in AGENTS, README, and development; source preservation and responsive contracts remain applicable.

Verification: complete staff browser flows pass; all 60 worksheet/hub responsive cases pass across phone, iPad, and desktop. Inspected the rendered introduction and corrected stale HTML instructions.


### O-009 short daily practice, 2026-11-16

Supersedes the 24-question description: O-009 now shows nine questions. A deterministic 36-pair pool combines G anchors on lines 1–4 with all nine internal target positions. Shanghai calendar dates select disjoint nine-pair sets across four consecutive days; the cycle repeats every four days. Refreshing retains the daily set; New set advances to the next disjoint set. No student data or practice history is stored. Expanded treble SVG bounds prevent moved clefs from being clipped. O-010/O-011 are unchanged.

Verification: 23 Node tests, complete staff browser flows, and all 60 worksheet/hub responsive cases pass. Actual font glyph bounds fit their SVG viewports; the desktop introduction was visually inspected. Source artwork/provenance and responsive requirements reviewed unchanged. Local review only; no push or deployment.


## O-009 worked answers and sky illustration, 2026-11-16

The introductory G/A notes now have explicit red answer labels aligned below their noteheads. Moved the unchanged original sun PNG from the first question into the yellow guide. Added original inline vector cloud, kite, and distant-bird line drawings matching its monochrome outline style; decorative graphics are hidden from assistive technology. No external artwork or source-master changes.

Complete staff browser flows and all 60 worksheet/hub responsive checks pass. Inspected the rendered tablet-width guide. AGENTS, README, development, and responsive procedure reviewed unchanged: daily generation, scoring, nine-question length, and ownership remain accurate. Local review only, no publication.


## O-009 reasoning example revision, 2026-11-16

User superseded the sky-decoration choice: removed all cartoon elements from O-009. The labeled G/A example now includes a red curved G-to-A arrow and “向上一格 · Up one step.” No source assets changed. Inspected the rendered guide; staff browser flows pass. Operational guides and overview reviewed unchanged because generation, nine-question scope, and ownership are unchanged. Local review only, no publication.


## Single-row note-name options, 2026-11-16

Reduced A–G option text from 23px to 20px and use seven equal columns with 4px gaps across O-009/O-010/O-011. Retained 44px button height. Verified every option row stays on one line at 320, 390, 768, 820, and 1440px; all 60 worksheet/hub responsive cases pass. Inspected a rendered card. Guides and public overview reviewed unchanged because content, scoring, and operating procedures are unchanged. Local only, no publication.


## O-009 release quality review, 2026-11-16

Removed the redundant O-009 tool selector and eraser; letters are directly selectable and replace prior answers. Reviewed scoring, moving glyph coordinates, daily uniqueness, keyboard focus, speech, and release confinement. Removed unused legacy treble source rows. Updated browser coverage for direct answer replacement. Node tests: 23 pass; dependency audit: zero vulnerabilities. Build: `0a41dc48ef29`. Production checks pass: 49 legacy responsive screens and session flows, touch/audio/storage regressions, complete staff flows, and 60 worksheet/hub layouts. AGENTS, README, and development reconciled to current behavior; provenance reviewed unchanged. User explicitly authorized push and publication after checks.


## O-009 published release evidence, 2026-11-16

User-authorized runtime commit `ec927d6` published build `0a41dc48ef29`. Pages run [43860250905](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43860250905) succeeded, including CI Node, legacy browser/regression, staff flow, and 60 responsive checks. All 88 remote file hashes match the local production build. Actual remote Chrome staff flows pass, including nine O-009 answers, correction by selecting another letter, and absence of the toolbar. Live O-009: https://fangjiaqifion.github.io/music-activity-studio/releases/0a41dc48ef29/treble.html. Physical-device and human speech acceptance remain outside automated evidence. This supersedes earlier local-only release status. Documentation completion: current guides/overview reconciled; parent coordination and gitlink updated locally after game evidence push.

## O-010/O-011 movable-clef practice, 2026-11-16

Applied the approved O-009 teaching approach to bass/F and alto/C activities. Clef anchor lines move across lines 1–4; each target is named relative to that displayed anchor. Removed arbitrary red-reference groups, repeated given notes, card decoration, and selection/eraser toolbars. Added labeled F/G and C/D examples with curved one-step arrows. Both use nine daily questions from 36 distinct pairs, disjoint across four Shanghai dates, with direct letter replacement and New set advancement. Shared generation preserves O-009's daily sequence. Original DOCX/PDF/AI masters remain unchanged.

Validation: 24 Node tests pass; production build `4e6a29aa28b9`; complete staff browser flows pass, including keyboard answers, blank submission, correct answers, replacement, celebration, and reset. All 60 worksheet/hub responsive cases, 49 legacy game layouts/session checks, and touch/audio/storage regressions pass. Inspected phone, tablet portrait/landscape, and desktop captures. Physical-device and human speech acceptance remain unverified. AGENTS, README, and development updated; responsive procedure and asset provenance reviewed unchanged because no assets or operating steps changed. Local implementation only; this revision is not published.

## O-010/O-011 published verification, 2026-11-16

User reviewed the local practice and explicitly authorized push. Runtime commit `43467e2` deployed build `4e6a29aa28b9` in successful Pages run [43861372314](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43861372314). CI unit, complete staff, legacy browser/regression, and responsive checks passed. All 88 deployed file hashes match the locally verified build. Actual remote Chrome staff flows passed, including bass/alto nine-question answers and direct replacement. Live entries are `/releases/4e6a29aa28b9/bass.html` and `/releases/4e6a29aa28b9/alto.html`. This supersedes the prior local-only status. Current guides and public overview reviewed unchanged because they already describe this behavior. Physical-device and human speech limits remain.

## O-013 two-part keyboard trial, 2026-11-16

Added `keyboard.html` to the selector and runtime allowlist. The upper task colors black keys on separate C–E and F–B fragments, with tap-again erasing and selectable white keys counted as errors. The lower task asks students to circle complete C–B groups using first/last white-key taps and choose a total for each of two different 4–6-octave spans. Both spans have partial edge groups; no answer segmentation or full-piano reference is supplied. Rings are removable, counts replaceable, and keyboards support horizontal scrolling, keyboard controls, and 1.7× enlargement. Shared browser-local profiles, Shanghai dates, speech cancellation, aggregate feedback, and the five-character celebration remain. Source masters unchanged.

Verification: 25 Node tests pass, including 500 generated keyboard pages; complete O-013 browser flow and enlargement pass; all 66 worksheet/hub responsive cases, 49 legacy game layouts/session checks, and touch/audio/storage regressions pass. Build `84baea4f6adf`. Inspected phone and tablet screenshots; automated captures cover both tablet orientations and desktop. Physical-device, human speech, and print acceptance remain unverified. Updated AGENTS, README, development, responsive matrix/procedure, and this tracker. Asset provenance reviewed unchanged because the keyboard is code-native geometry with no new external assets. Local implementation only; no push or deployment.

## O-013 separated coloring fragments, 2026-11-16

Replaced the upper continuous keyboard with separate C–E (two black keys) and F–B (three black keys) fragments, matching the user's requested grouping. Each fragment retains enlargement, coloring, and erasing; scoring now expects five black keys with distinct IDs across fragments. Lower circle/count tasks unchanged. All 25 Node tests and the complete keyboard browser flow pass; inspected the tablet rendering and generated phone/landscape/desktop captures. README updated; AGENTS, development, responsive procedure, and provenance reviewed unchanged because ownership, commands, and asset sources remain accurate. Local only, no publication.

## O-013 expanded practice and circle-before-count flow, 2026-11-16

Expanded coloring to six isolated fragments, alternating C–E and F–B three times (15 black keys). Lower keyboards now show their entire span at the available width; enlargement restores large scrollable keys. Added a visible red-circle cue and full-height red ovals enclosing all keys in a selected group. Students mark groups first, then select “圈好了，开始数” to reveal number choices. Editing circles resets the count stage. Original masters and lower generation rules remain unchanged.

Verification: 25 unit tests, full keyboard coloring/circle/count/celebration/reset flow, and all 66 worksheet/hub layouts pass. Reviewed the rendered tablet layout; captures cover phone, tablet orientations, desktop, and completed circles. Updated AGENTS, README, development, and this tracker. Responsive procedure and provenance reviewed unchanged because the existing enlargement and asset requirements still apply. Physical-device and print acceptance remain unverified. Local only, no push or deployment.

## O-013 complete coloring groups and proportional keys, 2026-11-16

The six coloring keyboards now include two C–E fragments, two F–B fragments, and two complete C–B groups (20 black keys total). Updated unique answer offsets and scoring coverage. Keyboard height now scales with white-key width at 184:44, and black-key length remains 108:184 of white-key length. Whole-keyboard overviews, enlarged views, and full-height circles use the same proportions. The circle-before-count flow is unchanged.

Verification: all 25 unit tests pass; complete browser flow passes with 20 coloring targets; white-key width/height ratios are checked at phone, tablet portrait/landscape, and desktop widths. Inspected the tablet rendering. Updated AGENTS, README, and this tracker; development, responsive procedure, and provenance reviewed unchanged because commands, interaction stages, and asset ownership remain accurate. Local only; physical-device and print acceptance remain unverified.

## O-013 reduced coloring set, 2026-11-16

Reduced the upper exercise to exactly three keyboards: one C–E two-black-key fragment, one F–B three-black-key fragment, and one complete C–B group (10 black keys). Updated speech, scoring, browser assertions, AGENTS, README, and development wording. All 25 unit tests and the complete keyboard browser flow pass, including viewport proportion checks. Lower circle/count practice and scaling are unchanged. Responsive procedure and provenance reviewed unchanged because no layout rules or assets changed. Local only, no publication.

## O-013 release quality review, 2026-11-16

Reviewed coloring IDs, C–B boundaries, partial-edge exclusion, distinct lower keyboard lengths, staged count replacement, profiles, speech lifecycle, and proportional geometry. Preserved focus when ring elements are recreated. Removed an unused import, consolidated overridden layout rules, normalized O-013 source formatting, and corrected print scaling. Replaced the temporary menu symbol with an original keyboard SVG thumbnail. Updated stale ten-card menu assertions in existing browser suites. Added the complete keyboard flow to Pages CI and honored `CHROME_PATH` for Linux CI.

Production build `fa17a6b1fcb4` passes 25 unit tests, dependency audit (zero vulnerabilities), O-013 complete flow and focus regression, hands/cows flows, all staff flows, 66 worksheet/hub layouts, 49 legacy game layouts/session checks, and touch/audio/storage regressions. Phone screenshot and print preview inspected; viewport captures cover tablet orientations and desktop. Print export is secondary, with no one-page guarantee; physical-device and human speech acceptance remain unverified. Updated asset provenance and this tracker; current AGENTS and responsive procedure reviewed unchanged because the product contracts remain accurate. User explicitly authorized push/publication after review. Deployment evidence follows after verification.

CI follow-up: run `43864248271` correctly stopped before deployment because the newly added keyboard test appended a slash to CI's already slash-terminated release directory, producing an invalid URL. Normalized the test base URL, added HTTP/resource-failure checks and an explicit initial render wait. The same production test passes locally with CI's exact trailing-slash URL. Runtime build is unchanged. Retrying publication with this test fix.

## O-013 published verification, 2026-11-16

User-authorized commits `6a897a6` and `f7fad76` publish build `fa17a6b1fcb4`. Corrected Pages run [43864479571](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43864479571) succeeded, including all CI unit, legacy browser/regression, keyboard complete-flow, staff-flow, and 66 responsive checks. All 93 deployed file hashes match the verified production build. Actual remote Chrome completed coloring, circle/count answers, celebration, reset, and four viewport proportion checks with no page/resource errors.

Live O-013: https://fangjiaqifion.github.io/music-activity-studio/releases/fa17a6b1fcb4/keyboard.html. This supersedes previous local-only O-013 status. Updated current README publication scope and O-013 headings in AGENTS/development. Responsive procedure and asset provenance reviewed accurate unchanged. Physical-device and human speech acceptance remain unverified. Parent coordination and gitlink are updated locally after this evidence push; the parent repository is not pushed.

## Note Neighborhood local two-level prototype, 2026-11-16

Added `note-houses.html`, linked separately from the ten worksheet cards. Level 1 places the user-selected accessory-free whole-note characters into G3–F4 houses by pointer dragging, tap-then-place, or keyboard. Level 2 shows one resident and asks six neighbor questions covering ±1, ±2, and ±3 diatonic staff steps without leaving the seven-house range. Each level supports correction, completion, reset, and switching. Progress is ephemeral; no student profiles or records are required. Browser speech is user-triggered and canceled on lifecycle changes.

The user's initial live review identified neighboring characters leaking into cards and a cropped scrolling staff. Fixed individual SVG crop windows and replaced the scroll scene with responsive geometry that keeps both complete staves, both clefs, and all seven houses visible together. Houses retain the chosen thick softly peaked roof, no pitch labels, and 60%-of-line-spacing ink height. Space-house ink clears both bounding lines by approximately 20%; line houses center on their staff line. Separate interaction areas remain at least 44px. The first house clears the bass-clef ink. Short landscape displays reduce visible house size while retaining full-staff containment; physical-device legibility remains an acceptance limit.

Verification: 27 Node tests pass; production build `2ed7e79ebfcc` contains 98 runtime files. Complete source and packaged-build browser flows pass: real pointer drag, touch taps, keyboard selection/placement, incorrect answers, all seven placements, all six neighbor rounds, completion/reset, and seven screen sizes (320px phone through desktop). Full staff/house containment is asserted. All 72 worksheet/hub/prototype viewport cases, 49 legacy game screens/session flows, and touch/audio/storage regressions pass. Inspected phone, tablet portrait/landscape, desktop, completed-home, and neighbor screenshots. No browser/resource errors. Human speech, physical iPad/Safari, and classroom legibility acceptance are not established.

Documentation updated: AGENTS, README, development, responsive design, asset provenance, and this tracker. Parent/games/worksheet ownership guidance and public overviews reviewed unchanged because source-master ownership and repository scope remain accurate; parent coordination records this new local prototype. No original master, Illustrator source, unrelated research work, push, or deployment. Local preview: http://127.0.0.1:8816/note-houses.html.

## Note Neighborhood brace, automatic prompts, and confetti, 2026-11-16

Added the exact licensed Bravura E000 brace in a left gutter, spanning both staves. Shifted the notation gutter while preserving house alignment and full-scene containment. Neighbor prompts now use first-person Chinese wording, such as “我是 C 音，住在我上两层的音是谁？”. Every new neighbor question, level entry, and restart automatically speaks that exact prompt using the existing Chinese-voice adapter; the speech button replays it. Correct answers stop pending speech and burst three clusters of colorful confetti. Reduced-motion users receive a static success badge. Reset, next, navigation, and page hiding clear effects and speech.

Verification: 27 Node tests, the complete note-house browser suite, and all 72 existing/new activity viewport cases pass. Browser coverage checks exact speech calls and Chinese-voice selection for all six rounds, full-height brace alignment at seven screen sizes, correct-answer particles, reduced-motion alternative, cleanup, drag/tap/keyboard gameplay, and completion/reset. Inspected phone brace and desktop confetti frames. Build `0b635184b492` includes 99 runtime files. Browser speech is stubbed for repeatable tests; actual voice audibility/pronunciation and physical-device acceptance remain human checks. No publication.

Documentation updated: game AGENTS, README, development, provenance, and tracker. Responsive procedure reviewed unchanged because the full-staff and viewport contracts remain accurate; parent/games/worksheet guides and public overviews reviewed unchanged because ownership and scope remain accurate. Parent coordination and local gitlink follow this focused game commit. Original masters and unrelated work preserved.

## Note Neighborhood speaker arrow, 2026-11-16

Added a persistent rust-red downward arrow with an ivory outline above the resident's house in Level 2. It identifies the note introducing itself during the spoken prompt, follows the new resident on each question/reset, and recalculates with responsive notation geometry. The cue stays on the speaker through answering, without marking the requested neighbor. Level 1 has no arrow.

Documentation updated: this tracker and AGENTS. README, development, responsive procedure, and provenance reviewed unchanged because the two-level capability, commands, viewport contract, and existing artwork ownership remain accurate. Parent/games/worksheet guides and overviews reviewed unchanged because ownership and public scope are unchanged. Verification recorded below after final browser review; no publication or source-master changes.

Verification: complete note-house browser flows pass, including arrow-to-speaker alignment through all six neighbor questions and containment at seven phone/tablet/desktop viewports. Phone speaker-arrow screenshot inspected. Existing drag/tap/keyboard, speech, confetti, reduced-motion, reset, and completion coverage passes in the same suite. Build `97cd353ebe86` succeeds. No unrelated activity/runtime behavior changed; the previous broader activity suite remains applicable. Physical-device and human speech checks remain open.

## Note Neighborhood visible incorrect-match feedback, 2026-11-16

Level 1 incorrect placements now show a large red circled cross and “还没到家，再试一次” above the attempted house, with matching bold red status text. The cue lasts two seconds and temporarily blocks further note changes/placements so it cannot be immediately replaced. The selected note is retained for retry. Reset, switching levels, and page hiding clear the timer and indicator. Resize repositions the cue; horizontal clamping keeps its message visible. Enlarged the separate tray letter labels without altering source artwork.

Documentation updated: AGENTS and this tracker. README, development, responsive design, provenance, and parent/games/worksheet ownership guides/overviews reviewed unchanged because game scope, commands, staff geometry, and artwork ownership remain accurate. Final browser timing/layout evidence follows. Local preview only; no publication or original-master changes.

Verification: complete gameplay browser checks pass, including controlled-clock assertions that the indicator remains at 1.9 seconds and is removed after 2.001 seconds, blocked early retries, retained selection, and phone-touch reset cleanup. All 72 activity viewport cases pass with the enlarged letter labels. Inspected desktop and phone incorrect-feedback screenshots. Build `bad20bf5cf72` succeeds. Unrelated activity behavior is unchanged; previous unit/legacy regression evidence remains applicable. Physical-device acceptance remains open.

## Note Neighborhood neighbor retry feedback, 2026-11-16

Level 2 now shows the same prominent red circled cross as Level 1, anchored above the selected wrong character, with “找错了，再找找” and bold red status text. The cue remains for two seconds and blocks immediate answer changes so it can be read. It then clears to a neutral staff-counting reminder, allowing another answer to the same question. Incorrect answers cancel question speech; reset/navigation retain shared effect cleanup. No requested neighbor is highlighted.

Verification: complete browser gameplay passes, including controlled-clock persistence at 1.9 seconds and removal after 2.001 seconds for all six neighbor questions, blocked early correction, successful later correction, existing Level 1 timing, speech, confetti, and seven responsive sizes. Desktop incorrect-neighbor frame inspected. Build `a71309a2c472` succeeds. Existing viewport and unit evidence remains applicable because staff layout, CSS, generation, and other activities did not change. Physical-device/human speech acceptance remains open.

Documentation updated: AGENTS and this tracker. README, development, responsive procedure, provenance, and parent/games/worksheet guides/overviews reviewed unchanged because capabilities, commands, geometry, and source ownership remain accurate. Local only, no push or deployment; original masters and unrelated work preserved.

## Note Neighborhood piano playback, 2026-11-16

Added locally bundled Salamander Grand Piano recordings (Alexander Holm, CC BY 3.0), with accessible attribution. Seven characters map to the actual G3–F4 house pitches, MIDI 55/57/59/60/62/64/65. Selecting or picking up a dragged Level 1 character plays its note; Level 2 reference prompts and answer choices play their respective notes. Occupied houses replay their resident. Four original sample files cover these pitches using playback-rate changes of at most two semitones. No external runtime audio request, dependency, or student data was added. The local server now sends MP3 MIME types.

Playback uses a dedicated owner with cached local sample bytes/decoded buffers, short release envelopes, one active note, user-gesture context resume, and generation checks rejecting stale asynchronous resumes/decodes. Reset, switching levels, finishing, and hiding/navigation stop notes. Speech remains independent, so playing a reference does not cancel its question.

Verification: 29 Node tests pass, including seven-pitch sample-rate mapping and navigation cancellation. Actual Chrome AudioContext tests decode and play all four real MP3s, verify all seven playback rates (allowing AudioParam float32 precision), and verify Level 2 reference, resident replay, and answer playback. Complete two-level gameplay, timed mismatch, speech, confetti, touch/keyboard, and seven-size checks pass; all 72 activity viewport cases pass. Phone rendering with attribution inspected. Build `d853ebf7292b` succeeds with 105 runtime files. Acoustic timbre/volume judgment, human speech, and physical-device acceptance remain human checks; automated evidence establishes decoding, scheduled playback, and pitch-rate mapping.

Updated AGENTS, README, development, provenance, and this tracker. Responsive procedure and parent/games/worksheet ownership guides/overviews reviewed unchanged because full-staff geometry and ownership remain accurate. Local preview only, no push/deployment. Original masters and unrelated work preserved.

## Note Neighborhood pre-publication quality review, 2026-11-16

Reviewed pitch/house geometry, pointer capture, independent character clipping, keyboard/touch behavior, error-feedback timers, speech/confetti lifecycle, sample attribution, audio cancellation, and runtime packaging. Fixed failed sample fetch/decode promises remaining cached permanently, so a later tap now retries successfully. Added recovery and stale-decode tests. Preserved keyboard house focus when responsive redraws replace SVG nodes and added a real-browser resize check. Removed obsolete scene-pan code and unused scroll/house-label styles; formatted the new source/tests for maintainability. Added complete neighborhood gameplay and actual piano playback suites to Pages CI.

Acceptance: 31 Node tests pass; npm audit reports zero vulnerabilities. Production build `b6df23116434` passes complete neighborhood gameplay/audio, keyboard and staff flows, hands/cow flows, the 49-screen legacy game/session suite, touch/audio/storage regressions, and all 72 activity viewport cases. Phone rendering inspected. The user explicitly authorized quality fixes followed by push. Runtime source and samples are self-contained; no student records or original worksheet masters are included. Physical-device, human voice/timbre, and short-landscape classroom legibility remain acceptance limits.

Updated development and this tracker. Current AGENTS, README, responsive procedure, and provenance reviewed accurate; README publication status will be updated after successful remote verification. Parent/games/worksheet ownership guides and overviews reviewed unchanged. Deployment evidence follows; parent repository remains local only.

## Note Neighborhood published verification, 2026-11-16

User-authorized review/fix commit `5d79308` and the preceding six local game commits were pushed to the game's existing remote. Pages run [43889041506](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43889041506) succeeded and deployed build `b6df23116434`. All 105 deployed hashes match the accepted local artifact. Actual remote Chrome passes complete two-level gameplay, timed errors, speaker-arrow/brace containment across seven sizes, speech calls, and real piano sample decode/playback for all seven pitch mappings. Live game: https://fangjiaqifion.github.io/music-activity-studio/releases/b6df23116434/note-houses.html.

Remote audio verification exposed a test-only MIME assumption: GitHub Pages returns `audio/mp3`, while the local server sends `audio/mpeg`. Both decode correctly; the test now accepts these two audio MIME types, and the actual remote audio suite passes. The runtime artifact is unchanged. Pushing that test correction retriggers the same verified build in CI; final run evidence follows. Current README publication status and game heading updated. Development/provenance/responsive guidance reviewed accurate. No parent push or original-master changes; physical-device and human audio acceptance remain open.

Final release evidence: compatibility/evidence commit `a6c16c9` passed Pages run [43889645108](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/43889645108), redeploying the unchanged build `b6df23116434`. This includes all 31 Node tests and complete production Chrome checks, including neighborhood gameplay/audio and the 72-case responsive matrix. The actual remote gameplay and piano suites both pass, and all 105 file hashes were verified against that identical runtime artifact. Publication status is reconciled in README; remaining human/device limits are unchanged. Release evidence is pushed before the parent coordination/gitlink commit.

## P-031 pitch-motion local adaptation, 2026-11-17

Added the eleventh worksheet card and `pitch-motion.html`. Four visual examples introduce step, skip, leap, and repeat. Twelve generated pairs contain three of each category, both directions for each non-repeat category, and no duplicate pairs. Absolute consecutive line/space distance determines the answer: 0 repeat, 1 step, 2 skip, 3+ leap. Corrected the source's swapped Step/Skip English mapping in the digital UI. Direct answer replacement, local display profiles/date, instruction speech, aggregate-only feedback, and the existing five-character celebration are retained. Original worksheet/Illustrator masters are unchanged.

Verification: all 32 Node tests pass, including all 81 possible internal-staff pairs and 1,000 balanced generated sets. Production build `b3009a2e35cb` contains 110 files. Actual Chrome completes blank submission, single-error feedback, correction, keyboard focus, celebration/dismissal, regeneration, speech calls (stubbed), touch selection, and six viewports including 320px. All 78 activity/hub layouts pass, as do the existing 49-screen six-game suite/session flows, touch/audio/storage regressions, staff worksheet flows, and hands/cow/menu flows. Inspected phone question controls and tablet portrait/landscape/desktop notation. Initial legacy invocations omitted `index.html` from a release-directory URL; rerunning from the production root passed. No runtime change was required. Physical devices, Safari, human speech audibility, and optional print layout remain unverified.

Updated AGENTS, README, development, responsive coverage, asset provenance, this tracker, and future Pages CI coverage. Parent/games/worksheet ownership guides and public overviews reviewed unchanged because source preservation, repository boundaries, and project scope remain accurate. Local review only, no push/deployment. Preview: http://127.0.0.1:8817/releases/b3009a2e35cb/pitch-motion.html.

## P-031 nine questions and third-error cue, 2026-11-17

User reduced each set to nine pairs. Each category appears twice; the ninth category rotates across sets, retaining distinct pairs and both directions for non-repeats. Each question counts its own incorrect answered submissions. On its third wrong check, a red dashed ellipse surrounds that pair's notes without revealing the correct choice. Blanks do not count. Editing removes that question's cue pending the next check, and New page resets all counters. This explicit user request supersedes aggregate-only error localization for P-031.

All 32 Node tests and full P-031 Chrome flows pass, including absence of a cue after the first two errors, appearance on the third, correction cleanup, completion, reset, keyboard/touch, and six viewports. All 78 activity/hub responsive cases pass. Phone third-error rendering inspected; widened ellipse clearance for extreme note distances. Build `09853155b344` succeeds. Other game runtime code is unchanged; previous legacy interaction evidence remains applicable. Physical-device/Safari/human speech and optional print acceptance remain unverified.

Updated AGENTS, README, development, and this tracker. Responsive procedure and provenance reviewed unchanged because viewport coverage, assets, and source ownership remain accurate. Parent/games/worksheet guides and public overviews reviewed unchanged. Preview: http://127.0.0.1:8818/pitch-motion.html. Local only, no push/deployment; original masters and unrelated work preserved.

## P-031 published verification, 2026-11-17

The user explicitly approved publication. Runtime commits `e15bb31` and `c3c4d05` were pushed to the game's own origin/main. Pages run [44015589934](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/44015589934) succeeded for `c3c4d05`, publishing build `09853155b344`. All 32 Node tests and the zero-vulnerability dependency audit pass. Final local production checks pass P-031's complete flow, 49 legacy screens/session flows, and touch/audio/storage regressions. CI additionally passes keyboard, staff, Note Neighborhood gameplay/piano, and all 78 responsive cases before deployment.

All 110 remote file hashes match the accepted production artifact. The first hash check hit a transient DNS lookup failure; retry passed without code changes. Actual remote Chrome passes the complete P-031 nine-question workflow, third-error cue threshold, correction cleanup, celebration/reset, keyboard/touch, and six viewports. All 78 actual remote worksheet/hub responsive cases also pass. Live activity: https://fangjiaqifion.github.io/music-activity-studio/releases/09853155b344/pitch-motion.html.

Updated current AGENTS/README publication status, development CI coverage, and this tracker. Asset provenance and responsive procedure reviewed accurate unchanged. Parent/games/worksheet guides and public overviews reviewed unchanged because ownership, preservation, and scope are unchanged. Evidence is committed/pushed before the parent coordination and gitlink are recorded locally. Original masters and unrelated research/runtime changes remain untouched; no parent push. Physical-device/Safari, human speech, and optional print acceptance remain unverified.

## Shared graduated answer assistance, 2026-11-17

Changed answer assistance only across all scored entries: eleven worksheet activities,
five scored menu games, and both Note Neighborhood levels. Each question/task counts
incorrect answered submissions independently. The third error draws a red ellipse
around the error location; the sixth error adds the correct answer. Fourth/fifth
errors retain only localization. Blank checks do not consume attempts; edits clear
visible assistance while retaining counts, correct checks reset the item, and new
questions/sets clear counters. Rhythm lab remains unscored. The shared helper uses
noninteractive overlays, so hints never replace selections, advance rounds, or alter
first-attempt results. No artwork, question generation, audio, product CSS, source
worksheet, or unrelated game behavior changed.

Verification: all 33 Node tests pass. A new real-Chrome suite verifies blank checks,
third/sixth thresholds and reset for every scored entry and both neighborhood levels,
on source and packaged build `0a84d0a383c0` (111 runtime files). Existing P-031,
hands/cow, staff, keyboard, Note Neighborhood gameplay, 49 legacy screen/session,
and touch/audio/storage regression suites pass. All 78 worksheet/hub responsive
cases pass. Phone/tablet sixth-error rendering was inspected and answer captions placed
beside the existing feedback to avoid covering notation or answer controls; representative phone portrait/landscape,
tablet portrait/landscape, and desktop hint screenshots were captured. Shared state
unit coverage includes independent counters, blanks, success and reset. Future Pages
CI runs the new full assistance suite. No push or deployment occurred.

Documentation updated: AGENTS (canonical assistance contract), README, development,
and this tracker. Responsive procedure and provenance reviewed unchanged because
layout requirements, assets and licenses are unchanged. Parent/games ownership guides
and public overviews remain accurate; the parent records only coordination/gitlink.
Physical-device/Safari and human speech/audio acceptance remain unverified.

## Nine-balloon practice and P-002/P-003 local adaptations, 2026-11-18

Reduced O-003 from twelve to nine balloons, including the visible progress denominator and blank/completion handling. Every set permutes all nine internal staff positions (five lines, four spaces), preserving all four illustration shapes. Added P-002 group-and-white-key selection and P-003 exact-pitch fish matching, each with nine questions. The selector now has thirteen worksheet cards. P-002 covers all seven letters and both standard clefs, clears keys when changing groups, and keeps group/key error counters independent. P-003 uses scientific and corresponding Helmholtz-style labels; its nine distinct pitches follow the source staves, with bass/treble C4 alternating across sets. Source fish-label inconsistencies are corrected only in the digital adaptation. Reused an unchanged embedded source fish image, bundled Bravura, local profiles, instruction speech, correction controls, graduated hints, celebration, and lifecycle cleanup. Original masters remain unchanged.

Verification: all 35 Node tests pass, including 500 generated sets per new activity and 1,000 nine-balloon sets. Actual Chrome completes both new activities with staff-coordinate answer derivation, separate P-002 group/key third/sixth-error checks, octave distractors, keyboard/touch correction, completion and reset. Source and packaged build `01eafdd61525` (117 files) pass new activity and balloon flows. The packaged thirteen-card hub and complete hands/cow flows pass without failed resources or page errors. All 90 worksheet/hub viewport cases pass on source and packaged builds. Existing six-game 49-screen/session suite and touch/audio/storage regressions pass. Phone, tablet/landscape and desktop captures and detailed notation/key/fish grids were inspected. Physical-device/Safari, human speech and optional print acceptance remain unverified.

Documentation updated: AGENTS, README (also reconciled stale worksheet counts), development, responsive design, provenance, and this tracker. Future Pages CI includes the new full browser flow. Parent/games/worksheet ownership guidance and public overviews reviewed unchanged because source ownership, preservation and project scope remain accurate; parent coordination/gitlink records this unit. Local review only, no push or deployment. Preview: http://127.0.0.1:8832/releases/01eafdd61525/activities.html.

## P-002 independent staff-to-keyboard reasoning correction, 2026-11-18

User rejected the added C–D–E/F–G–A–B lookup guide and automatic names on selected white keys because they disclose the knowledge students must retrieve. Removed both. Each of the nine questions now displays the two unlabeled source-style keyboard groups together. Students identify the staff note independently, circle their chosen group, and then locate its white key. No group or key is preselected. Only the chosen group's white keys accept input; selection adds a neutral dot without a note name. Switching groups clears the key mark and preserves both diagrams. White-key sizes match across groups, with a 3:4 group width ratio and corresponding black-key widths. Narrow cards stack groups to preserve 44px white-key touch widths. Existing graduated hints remain governed by the separately approved third/sixth-error contract, with group/key localization targeting their respective controls. P-003 content and original masters remain unchanged.

Verification: 35 Node tests pass. Packaged build `f47ea9019ab4` passes complete P-002/P-003 answers, independent hint thresholds, no initial/selected key-name leakage, both-group visibility, switch clearing, keyboard/touch, completion/reset, equal white-key scales, five viewport captures and 44px targets. All 90 worksheet/hub responsive cases and all 49 legacy game screens/session checks pass on that final build. Touch/audio/storage regressions pass on preceding correction build `5942dfbef1e8`; the final refinement only adjusts P-002 key proportions. Inspected final phone, tablet portrait/landscape, desktop, and print-media question captures. No physical-device, Safari, actual printed-page, or human speech acceptance is claimed.

Updated AGENTS, README, development, responsive guidance, and this tracker. Provenance and parent/games/worksheet ownership guidance/public overviews reviewed unchanged because artwork, source ownership, and product scope are unchanged. Local preview: http://127.0.0.1:8834/releases/f47ea9019ab4/key-notes.html. No push/deployment. This correction supersedes the first local P-002 instructional UI, not the historical test record.

## P-002 red keyboard selection circle, 2026-11-18

Replaced the selected group's rounded rectangular panel border with a red ellipse directly around its keyboard, excluding the group-selection button. It appears for either chosen group regardless of correctness, follows group replacement, and disappears on New set. The noninteractive CSS overlay preserves white-key clicks, keyboard focus, unlabeled keys and all existing scoring/hint behavior.

Full P-002/P-003 browser flows and all 90 worksheet/hub responsive cases pass. Inspected selected-group phone and desktop captures; the existing five-size captures cover tablet orientations as well. Runtime build `664875275e7f` succeeds. Updated AGENTS and this tracker; README, development, responsive guidance and provenance reviewed unchanged because the workflow, requirements, source assets and test commands are unchanged. Parent/games/worksheet guidance and overviews remain accurate. Original masters preserved. Local preview: http://127.0.0.1:8835/key-notes.html. No push/deployment.

## P-003 nine-fish matching board, 2026-11-18

Replaced the earlier per-question three-choice trial with the original worksheet's shared fish/staff matching task. Nine source-style fish labels use letter case and octave superscripts directly on the unchanged fish artwork. Fish and nine staff targets are independently shuffled. Students select a fish, then a staff; the selected fish appears beneath that staff without immediate correctness feedback. A fish can occupy only one target: moving it clears its former target, replacing a match releases the displaced fish, and Clear match removes a pair. No pair is initially filled. The same nine verified source-staff pitches and alternating bass/treble C4 remain. Scientific labels are no longer the main fish controls. Existing profiles, instruction speech, graduated hints, and celebration apply.

Desktop/tablet layouts use a sticky fish sidebar with two staff columns. Phone layouts use a compact sticky horizontally scrollable fish bank and one/two staff columns. Preserve the bank's horizontal position and native keyboard focus through redraws. Corrected mobile grid minimum widths found during acceptance; final controls and completion buttons remain within the viewport.

Verification: all 36 Node tests pass, including 500 generated P-003 sets, independent bank ordering, and immutable one-to-one reassignment. Full P-002/P-003 source and packaged Chrome flows pass: blank/third/sixth hints, keyboard/touch, moving/replacing/clearing pairs, correct completion/celebration/reset, and five viewport checks. All 90 worksheet/hub responsive cases pass on source and final production build `f2b62ce889e2` (117 files). The original-game 49-screen/session suite and touch/audio/storage regressions pass. Inspected desktop/mobile fish and staff regions, tablet rendering, a student-selected match, and print-media fish tray/staff rendering. Physical devices, Safari, actual print pagination and human speech acceptance remain unverified.

Updated AGENTS, README, development, responsive design, and this tracker; existing CI already runs the extended full pitch-activity flow. Provenance reviewed unchanged because the embedded fish and all source masters are unchanged. Parent/games/worksheet guidance and overviews reviewed unchanged because ownership and project scope remain accurate. Local review only: http://127.0.0.1:8838/releases/f2b62ce889e2/fish-notes.html. No push or deployment. This supersedes the first P-003 multiple-choice UI while preserving its historical evidence.

## P-003 source composition restored, 2026-11-18

The user explicitly requested retaining the original worksheet layout, superseding the prior sidebar/card adaptation. Restored scattered source-relative fish positions on the left, one framed staff column on the right, the name/match-count area on the left, original underwater seaweed/bubble details below, and the bilingual task caption below the scene. Mixed fish directions use unchanged embedded source variants with CSS mirroring. Every device keeps this left/right composition; scene height derives from nine staff rows and vertical scrolling, without a fixed A4 aspect ratio. Fish targets remain at least 44px. The original masters are unchanged.

Student matches now appear as noninteractive connecting lines rather than fish in answer cards. Reassignment and clearing retain the one-to-one rules and graduated feedback. A ResizeObserver and redraw/resize hooks recompute line endpoints from actual bounds, including print-media width changes. Names are inserted as text. Removed the sticky tray, horizontal scrolling, multiple staff columns and card borders. P-002 remains unchanged.

Verification: all 36 Node tests pass. Final packaged build `2ae000e15ed6` (119 files) passes full P-002/P-003 keyboard/touch, hint thresholds, moving/replacing/clearing, nine connection paths, completion/reset and five-size checks, including single staff-column geometry, staggered fish and 44px targets. All 90 responsive cases pass. The original-game 49-screen/session suite and touch/audio/storage regressions pass on preceding composition build `29d2ced1b1a6`; the final refinement only makes fish-scene line geometry react to size changes and preserves print row heights. Phone, tablet portrait/landscape, desktop and final print-media scene captures inspected. Physical devices, Safari, actual print pagination and human speech remain unverified.

Updated AGENTS, README, development, responsive guidance, provenance and this tracker. Parent/games AGENTS record the narrowly approved source-composition exception so current instructions no longer contradict the user request. Parent/games/worksheet public overviews and worksheet ownership guidance reviewed unchanged because source ownership and product scope remain accurate. Local preview: http://127.0.0.1:8843/releases/2ae000e15ed6/fish-notes.html. No push/deployment. Historical sidebar/card acceptance remains historical only.

## P-003 perimeter seaweed and complete treble clefs, 2026-11-18

User identified missing source perimeter decoration and clipped treble clefs. Restored cropped seaweed at the left edge, upper right, middle right and lower right in addition to the existing bottom cluster, using the unchanged source seaweed asset. Reserved the source-style right outer margin (narrower on phones); decorative regions remain outside the notation frame and cannot intercept input.

Measured the rendered Bravura treble ink through y=138.6, while the rejected compact SVG ended at y=133. Removed that compact override and restored the full staff viewBox ending at y=157, so the bottom curl/tail and full glyph remain visible. This is an SVG clipping correction, not a clef redraw or notation-content change. Student pair connections, nine-question generation, clearing, hints, profiles and P-002 remain unchanged.

Verification: 36 Node tests pass. Full P-002/P-003 Chrome flows pass on source and final packaged build `7f32ed3dd08b` (119 files), including new five-size assertions for complete clef bounds, all four perimeter placements, and decoration staying outside the notation frame. All 90 worksheet/hub responsive cases pass on the final package. Inspected phone, desktop, tablet and print-media scene captures against the source layout. Physical devices/Safari, actual print pagination and human speech remain outside this evidence.

Updated AGENTS, development, responsive guidance and this tracker. README and provenance reviewed unchanged because activity scope, original artwork and source ownership are unchanged; parent/games/worksheet guidance and overviews remain accurate. Original masters preserved. Local preview: http://127.0.0.1:8845/releases/7f32ed3dd08b/fish-notes.html. No push/deployment.

## P-003 added perimeter seaweed canceled, 2026-11-18

The user canceled the newly added edge seaweed. Removed the left/upper-right/middle-right/lower-right decorative containers and their reserved gutter, restoring the wider staff column. Retained the earlier bottom cluster and the complete treble-clef SVG bounds. Matching, hints, connections, original masters and P-002 remain unchanged.

Full P-002/P-003 browser flows and all 90 responsive cases pass; the clef-containment regression remains, and the suite confirms the perimeter decorations are absent. Inspected the resulting desktop scene. Build `c0d45a17f464` succeeds. Updated AGENTS, development, responsive guidance and this tracker; README, provenance and parent/games/worksheet guidance/overviews reviewed unchanged because activity scope, original assets and source ownership remain accurate. Local preview: http://127.0.0.1:8846/fish-notes.html. No push/deployment. This supersedes the preceding perimeter-placement decision only.

## Authorized release and stale CI assertion correction, 2026-11-23

The user authorized pushing the completed local work. Pushed runtime commit `dcc34d8` to origin/main. Run `45138965974` passed unit tests, legacy browser/regression flows, shared assistance, P-031, P-002/P-003 and keyboard checks, but stopped on the staff suite's stale eleven-card assertion. Updated that assertion to the thirteen-card hub already required by the other suites; the complete staff browser flow passes locally against production build `c0d45a17f464`. No runtime behavior changed in this correction.

Pre-push verification: 36 Node tests, zero npm audit vulnerabilities, production legacy browser/regression suites, P-002/P-003 flows and 90 responsive cases pass. Reviewed AGENTS, README, development, responsive guidance and provenance unchanged because their thirteen-card requirement and release procedure remain correct.

Replacement [run 45139239882](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/45139239882) successfully tested and deployed release commit `8667536`. Every configured Chrome suite passed, including all scored-activity hint thresholds, pitch activities, staff worksheets, keyboard, Note Neighborhood interaction/audio and the 90-case responsive matrix. Build remains `c0d45a17f464`; `verify_deployed.mjs` confirmed all 119 remote file hashes. The in-app browser loaded the public root, redirected to that exact release, displayed the thirteen-card hub, and opened P-003 with nine fish and nine staff targets. Public entry: https://fangjiaqifion.github.io/music-activity-studio/. P-003: https://fangjiaqifion.github.io/music-activity-studio/releases/c0d45a17f464/fish-notes.html. Physical-device/Safari, human-audible speech and actual print acceptance remain unverified. This evidence update is documentation-only and does not trigger a second runtime deployment.

## P-004 ordered fish coloring, 2026-11-23

Added the fourteenth worksheet, P-004 whole-tone/semitone coloring, using twelve original note pairs in a fixed responsive grid. Whole tones are blue and B–C/E–F semitones red. Painting, erasing, direct correction, local profiles, instruction speech, graduated assistance and celebration are available. Fish stay in reading order; a single bottom seaweed cluster keeps its native proportions. Reset clears colors without moving fish. Existing P-003 composition remains unchanged. Original masters are preserved.

Verification: 36 Node tests pass; npm audit reports zero vulnerabilities. Packaged build `9f201c20a01a` passes all 96 worksheet/hub viewport cases. Final build `fde7303bd0c1` (123 files), differing only in the Reset label, passes the complete P-004 blank/third/sixth/erase/correction/completion/reset flow, keyboard, emulated touch and six-size captures. Phone/tablet portrait/landscape/desktop captures inspected. Source legacy six-game 49-screen/session suite, touch/audio/storage regressions, fourteen-card hub/hands/cow flow and full P-002/P-003 flows pass. Physical-device/Safari, human speech and actual print acceptance remain unverified. Preview: http://127.0.0.1:8853/releases/fde7303bd0c1/fish-steps.html. No push/deployment.

Documentation updated: AGENTS, README, development, responsive procedure, asset provenance and this tracker. Parent/games/worksheet guides and public overviews reviewed unchanged because source ownership and project scope remain accurate. Parent coordination/gitlink records this local unit; unrelated research/runtime work is preserved.

## Exercise-specific selector previews, 2026-11-23

Replaced all fourteen decorative worksheet covers with actual exercise-content captures. The three movable-clef previews show their respective notation, P-002 shows staff and keyboards, P-003 shows fish/staff matching, and P-004 shows interval fish. Note Neighborhood is the fifteenth card with matching title, description and start affordance. Cards use a consistent landscape image frame, retain native image proportions and keyboard focus, and stack on phones. Added a reproducible isolated-context capture script; no learner data or source masters were changed.

Build `37609ef0d673` passes all 36 Node tests, the complete fifteen-card/hands/cow browser flow, and all 96 worksheet/hub responsive cases. Desktop and phone hub captures were inspected, and all cover assets loaded without browser errors. Updated AGENTS, README, development and this tracker; responsive and provenance guidance reviewed unchanged because device coverage and underlying artwork ownership are unchanged. Local only, no push or deployment. Physical-device/Safari acceptance remains unverified.

## Selector release quality review, 2026-11-23

Reviewed both pending runtime commits (P-004 and selector covers), including runtime packaging, local-only profiles, assistance/lifecycle handling, image sizing, navigation and capture tooling. No blocking defect found. Added the complete hub/hands/cow browser suite to Pages CI so every release verifies all fifteen preview images. Rechecked 36 Node tests, zero npm audit vulnerabilities, reproducible build `37609ef0d673`, the hub flow and P-004 flow before the authorized push. The existing 96-case responsive evidence remains applicable because runtime files are unchanged. Deployment evidence follows after Actions completes. Development procedure updated; AGENTS/README/provenance/responsive guidance reviewed unchanged because product behavior and ownership are unchanged.

First Actions run `45141718754` caught an integration issue in the newly enabled hub test: its base URL retained the CI release directory's trailing slash, creating a double-slash request rejected by the server. Normalized base URLs in both newly integrated hub and P-004 suites. Both complete flows pass locally with the exact trailing-slash CI format. Runtime build remains `37609ef0d673`.

## Authorized selector/P-004 publication, 2026-11-23

Runtime and CI commit `2d39462` passed [Pages run 45141939789](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/45141939789). Build `37609ef0d673` is deployed. CI passed 36 Node tests, legacy games/regressions, fifteen-card hub/hands/cow, graduated hints, pitch-motion, P-002/P-003, P-004, keyboard, staff, Note Neighborhood interaction/piano and all 96 responsive cases. All 138 deployed file hashes match the local tested artifact. The actual in-app browser loaded the exact release hub and showed all fifteen entries, including the matching Note Neighborhood card. The full hub/hands/cow suite also passes against the remote release, including all preview images and no failed resources/page errors.

Live selector: https://fangjiaqifion.github.io/music-activity-studio/releases/37609ef0d673/activities.html. This supersedes earlier local-only status for P-004 and selector previews. Documentation updated: this tracker; AGENTS, README, development, responsive and provenance guidance reviewed accurate unchanged. Parent/games ownership/public guidance remains accurate. Physical-device/Safari and human-audible acceptance remain unverified.

## P-005/P-006 local keyboard adaptations, 2026-11-23

Implemented P-005 `fish-keys.html` (seven one-to-one A–G fish/marked-key pairs using C–E and F–B groups) followed by P-006 `key-names.html` (fifteen marked full keyboards with replaceable A–G answers). Both reuse browser-local display profiles, Chinese instruction speech, session-only responses, graduated third/sixth-error assistance and the five-character celebration. P-005 supports moving/replacing matches and erasing; neither activity discloses correctness before checking. Every natural note appears in each matching set and at least twice in each naming set. Shared modules own generation, immutable reassignment, rendering and lifecycle cleanup. Original worksheet/illustration masters remain unchanged.

Verification: 38 Node tests pass, including 500 generated sets per type and immutable move/replace/erase cases. Chrome checks derive answers independently from rendered red-marker coordinates and cover touch, keyboard focus, blank/third/sixth-error behavior, complete answers, celebration and reset. The seventeen-card hub loads every preview without resource/page errors. Legacy six-game checks pass 49 responsive screens and complete sessions; regressions pass touch, focus, audio cancellation and storage/speech failures. The full worksheet matrix passes 108 cases across six phone/tablet/desktop sizes. Phone, tablet portrait/landscape and desktop screenshots were inspected for both new activities; physical devices/Safari and human-audible speech remain unverified.

Final packaged build: `8398f3d42114` (145 runtime files). Preview: http://127.0.0.1:8863/releases/8398f3d42114/activities.html. No push/deployment performed. Added real unanswered selector covers and CI coverage for the new complete-answer flow. Documentation updated: AGENTS, README, development, responsive design, provenance and this tracker; corrected stale P-004 publication wording in the README. Parent/games ownership and public overviews reviewed unchanged because their scope and procedures still apply; parent coordination tracker updated separately.

## P-005 original fish and nine-question same-screen revision, 2026-11-23

The user corrected the artwork and interaction requirements. Replaced the unrelated P-003 fish with an unchanged extraction of `word/media/image1.png` from `P-005键盘B.docx` (`assets/keyboard_fish.png`). P-005 now has nine marked-key questions covering A–G plus two distinct repeated notes. All seven reusable fish choices stay on the left and all nine keyboard targets stay on the right. Answers show fish artwork; no visible used/selected text badges remain. The current choice is yellow and previously used options are green. Repeatable choices, direct correction and erasing replace the previous one-to-one matching rule.

P-005 alone now uses per-question first/second/third-error assistance: first reports how many answers need thought; second adds a red dashed ellipse around the incorrectly matched fish; third also displays the correct letter. Blank checks do not consume/reset failures, edits clear cues, and correct checks/new sets reset counters. P-006 and every other activity retain their existing assistance rules.

Verification: 38 Node tests pass. The complete packaged P-005/P-006 flow passes independent red-marker answer derivation, touch/keyboard focus, reuse/erase, exact yellow/green colors, no text badges, respective hint thresholds, complete answers, celebration and reset. P-005 verifies all choices/targets/check/new-set controls fit together with at least 44px targets in seven viewports, including 320×568. Fresh phone portrait/landscape and tablet/desktop captures were inspected; landscape uses side-by-side keyboards/fish for legibility. The final packaged full responsive matrix passes all 108 cases. Legacy six-game checks pass 49 screen cases plus complete sessions, and the interaction/audio/storage regression suite and seventeen-card hub flow also pass against this build. The in-app browser was navigated to the actual revised nine-question page. Physical devices/Safari and human-audible speech remain unverified.

Final build: `22ab1d88b5f8` (146 runtime files). Local preview: http://127.0.0.1:8865/releases/22ab1d88b5f8/fish-keys.html. No push/deployment. Updated AGENTS (explicit P-005 assistance override), README, development, responsive guidance, provenance, selector cover and this tracker. Parent/games ownership guides and public overviews reviewed unchanged because scope and workflow remain accurate. This entry supersedes the preceding P-005 implementation description; P-006 remains as previously implemented.

## P-005 belly lettering and whole-page correction, 2026-11-23

Moved note lettering into the same SVG coordinate system as the unchanged 141×142 original fish. Lettering now scales with the artwork and stays inside measured belly bounds (x 24–117, y 85–131), rather than keeping a fixed CSS font size that can overlap the outline on small fish. Empty answer slots remain empty.

Changed P-005 assistance from per-question counters to failed checks for the whole page. On the second failed check, every currently incorrect answered fish gets a red dashed border, including a newly wrong answer entered after the first check. The third failed check shows every current error's correct letter. Blank-only checks do not increment or reset the stage; editing clears cues but retains the stage; a completely correct page or new set resets it. Other activities, including P-006, retain their existing rules.

Verification: 38 Node tests pass; the packaged P-005/P-006 flow checks a newly incorrect second question alongside an earlier error, confirms both dashed borders on check two and both correct letters on check three, and verifies lettering bounds and all controls across seven viewports. All 108 responsive worksheet/hub cases, 49 legacy six-game screens, regression checks and the seventeen-card hub flow pass against build `6a79a155f590` (146 files). Phone portrait/landscape and desktop captures were inspected. The in-app browser now displays http://127.0.0.1:8867/releases/6a79a155f590/fish-keys.html. No push/deployment; physical-device/Safari and human-audible checks remain unverified.

Documentation updated: AGENTS, README, development, responsive guidance, selector preview and this tracker. Provenance reviewed unchanged because the source artwork bytes and ownership remain unchanged. Parent/games ownership guides and public overviews reviewed unchanged; parent coordination tracker updated separately. This entry supersedes the earlier per-question P-005 assistance description.

## P-005/P-006 release quality review, 2026-11-23

Reviewed the complete pending diff from `origin/main` through `602651f`, including both entry pages, pure generation/immutable answer replacement, original fish asset provenance, proportional text geometry, repeatable choices, whole-page P-005 assistance, unchanged P-006 hints, keyboard/touch focus, profile text handling, speech/celebration cleanup, responsive CSS, runtime allowlist, selector covers and CI integration. No release-blocking defect found; no runtime changes were needed during review.

Rechecked all 38 Node tests, `git diff --check`, full npm audit (zero vulnerabilities), clean game worktree and reproducible runtime build `6a79a155f590` (146 files). The previous packaged complete-answer, 108-case layout, 49-screen legacy, regression and hub evidence remains applicable because every runtime byte is unchanged. Confirmed active GitHub account `fangjiaqifion` and fetched the authorized game remote. The user explicitly authorized pushing after review; deployment evidence will follow after the exact Actions run finishes. Development/AGENTS/README/provenance/responsive guidance reviewed against the implementation; publication wording will be updated after deployment succeeds.

The first release run [45148119792](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/45148119792) stopped before deployment at the new 320px target-containment assertion; earlier Node, legacy, hub, shared-hint, P-031, P-002/P-003 and P-004 checks passed. Updated the P-005 browser test to wait for bundled fonts before measuring resized layouts and report exact failing element rectangles instead of an opaque Boolean. The original 44px/same-screen requirements remain unchanged. The full P-005/P-006 suite still passes locally with CI's trailing-slash base URL; runtime build remains `6a79a155f590`. A follow-up CI run will establish whether there is an additional Linux layout discrepancy.

Follow-up run [45148495829](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/45148495829) identified the actual discrepancy: P-005's Check button was only 40.625px wide on the Linux runner at 320×568, despite its correct 44px height and in-viewport position. Font readiness alone did not resolve it. Added an explicit 44px minimum width and disabled flex shrinking for P-005 footer buttons, making their hit width independent of platform text metrics. All 38 Node tests and the packaged seven-size complete P-005/P-006 flow pass locally. New runtime build: `d8db5436ce60`; all answer/artwork/layout contracts and verification thresholds remain unchanged. Responsive/development/AGENTS/README/provenance guidance reviewed unchanged because this implements the existing 44px requirement. Selector cover remains accurate because the local rendered appearance is unchanged.

Run [45148949168](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/45148949168) confirms the 44px fix passes the complete P-005/P-006 Linux suite, then exposed an older staff-worksheet test expecting exactly fifteen hub cards. Replaced that unrelated global count assertion with checks for its five owned worksheet links; the dedicated hub suite still requires all seventeen cards. Searched the remaining tests/workflow for stale fourteen/fifteen-card expectations; none remain. Staff worksheet interactions, Note Neighborhood interactions and real piano decoding/playback, and all 108 responsive cases pass locally against `d8db5436ce60`. This is a test-only correction; runtime build is unchanged.

## P-005/P-006 publication verification, 2026-11-23

[Release run 45149437754](https://github.com/fangjiaqifion/music-activity-studio/actions/runs/45149437754) passed Node tests, the packaged Chrome suite and GitHub Pages deployment from `6fb7b14`. The public release `d8db5436ce60` matched all 146 local runtime file hashes. Chrome also passed the seventeen-card activity hub and complete P-005/P-006 flows directly against the public release, including seven P-005 viewport checks and the simultaneous second-check outlines. Physical devices, Safari and human-audible speech were outside this verification.

Updated AGENTS and README to reflect publication. Development and responsive guidance were reviewed and remain current because the release procedure and acceptance criteria stayed the same.
