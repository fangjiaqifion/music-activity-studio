# Responsive Web Game Design

Last updated: 2026-11-18

## Product contract

All completed and future interactive activities are responsive web games. Original
worksheets supply learning goals, illustration assets, and interaction ideas. Their
paper composition is not a screen template. Never constrain the screen experience
to A4 dimensions, a fixed aspect ratio, a print page count, or a scaled page image.
User-approved exception for composition, 2026-11-18: P-003 preserves the original
left-scattered-fish/right-single-staff-column arrangement at every viewport. It uses
natural staff-row height, usable fish targets, and vertical scrolling, not a locked
A4 image or print pagination.
Existing print exports are optional secondary utilities and cannot establish screen
acceptance. Preserve original DOCX/PDF/AI masters.

Every delivery requires phone, iPad/tablet, and desktop checks. Reflow the controls,
question grids, examples, navigation, and feedback for available width and height.
Keep artwork proportions and place embedded controls relative to artwork coordinates.
Do not shrink an entire activity to fit: reduce columns or stack content instead.
Vertical scrolling is permitted. Keep notation readable and choices separated; use
44 CSS pixel targets for ordinary answer/tool buttons. Closely packed scene targets
need scene-specific hit testing and a usable enlargement/reflow interaction if small.
Avoid overlapping headers, name/date badges, answer controls, and feedback. Preserve
keyboard focus after answer rerenders. Touch and keyboard are both supported.

## Lessons consolidated from Note Trainer

Reviewed Note Trainer's `tests/smoke.mjs` layoutCheck and question-layout matrix.
It renders actual question types at 390×844, 844×390, 820×1180, and 1180×820,
checks element bounds rather than relying solely on document overflow, and verifies
notation and keyboard geometry. Its development guide requires hit tests at multiple
viewports. Reuse these principles, not its account infrastructure or release scripts.

For this project, include 768×1024 and 1440×900 as additional tablet/desktop cases.
Test both orientations, full interaction flows, generated content variants, resource
loading, feedback, reset, and celebration. Check controls as well as page bounds.
Inspect screenshots for readable notation, overlap, and touch spacing. A viewport
emulation is evidence of browser layout, not physical iPad or Safari acceptance.

## Mandatory completion procedure

1. Finish the new activity and run its generator/scoring and complete-answer checks.
2. Run the existing six-game browser and regression suites.
3. Run `BASE_URL=<runtime-directory-url> node tests/responsive_worksheets.mjs` for
   every completed worksheet and the selector after each new activity. Extend its
   page list when adding content. The URL is the versioned release directory for a
   production build, or the source preview origin during development.
4. Inspect phone, tablet portrait/landscape, and desktop captures in
   `.runtime/responsive/`; fix clipping, unreadable notation, and overlapping controls.
5. Update current docs and tracker with actual evidence and remaining device limits.
   Do not substitute successful A4 output for this gate.

The legacy six-game suite visits every game at its viewport matrix; the worksheet
suite covers the illustrated selector, all thirteen completed electronic worksheets, and the Note Neighborhood prototype (90 viewport cases). The new prototype additionally checks 320px width, real touch selection, and complete staff/house containment. It recomputes scene geometry to keep both staves and all houses visible without scrolling. Very short landscape displays necessarily reduce visible house size; interaction hit regions stay at least 44px. Physical-device legibility remains a user acceptance check.
Keep both matrices maintained as content grows. Printing may be checked separately
only when printing is within scope.

P-002 uses one or two question columns; P-003 preserves scattered fish at source-relative positions on the left and one framed staff column on the right across all device classes. P-002 always displays both unlabeled keyboard groups, side by side when the card can retain 44px white-key widths, or stacked otherwise. Match white-key width across groups; do not compress either group to fit. Piano white keys remain individual controls, while black keys are noninteractive visual landmarks. Fish retain native illustration proportions with note names and octave superscripts on their bodies. The complete scene scrolls vertically when needed; there is no horizontal tray. Student-pair connections track actual fish/target bounds after resize. All fish, targets and completion controls remain within the viewport. New-activity acceptance includes complete keyboard/touch answers and generated staff/ledger containment.

The user canceled P-003’s added edge seaweed and its reserved gutter on 2026-11-18. Retain only the earlier bottom cluster. Verify full clef glyph bounds within each staff SVG, including the treble-clef tail.
