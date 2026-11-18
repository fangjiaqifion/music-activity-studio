# Asset Provenance

Last updated: 2026-11-18

Illustrations are unmodified copies from the user's existing worksheet collection.
This local reuse is not a full rights audit for public redistribution. Verify provenance
before public release. No Illustrator file was resaved. Runtime uses bundled copies.

| Bundled file | Parent-workspace original |
|---|---|
| `assets/shop.png` | `assets/pic/~自动售卖机/自动售货机.png` |
| `assets/cat.png` | `assets/pic/侦探猫/侦探猫.png` |
| `assets/dice.png` | `assets/pic/骰子/7选骰子.png` |
| `assets/whale.png` | `assets/pic/鲸鱼/鲸鱼.png` |
| `assets/mushroom.png` | `assets/pic/蔬菜/蘑菇.png` |
| `assets/lock.png` | `assets/pic/锁头与钥匙/锁.png` |

BravuraText is by Steinberg Media Technologies GmbH under SIL OFL 1.1, Reserved Font
Name Bravura. The unmodified `assets/BravuraText.woff2` and `assets/bravura_ofl.txt`
were retrieved on 2026-11-12 from the [official repository](https://github.com/steinbergmedia/bravura)
at commit `37b194378b710cc40e406ab6c4b07608bb9548ae`, source paths
`redist/woff/BravuraText.woff2` and `redist/OFL.txt`. The font ensures standard musical
glyph coverage. Its OFL terms do not license the worksheet artwork or application.

## O-003 balloon prototype, 2026-11-13

Four unmodified PNG exports are copied from the parent's
`assets/pic/气球/气球1.png` through `气球4.png`, respectively named
`balloon_round.png`, `balloon_heart.png`, `balloon_star.png`, and
`balloon_bunny.png`. SVG staff/note overlays and an SVG tint filter provide interaction.
The worksheet DOCX/PDF and Illustrator source are untouched.

Patrick Hand by Patrick Wagesreiter is bundled as `PatrickHand-1.woff2`, with
`patrick_hand_ofl.txt` (SIL OFL 1.1). Retrieved 2026-11-13 from Google's font service:
https://fonts.gstatic.com/s/patrickhand/v25/LDI1apSQOAYtSuYWp8ZhfYe8XsLLubg58w.woff2
License: https://github.com/google/fonts/blob/main/ofl/patrickhand/OFL.txt
No external runtime font request is required.

### Balloon body masks, 2026-11-13

The original heart PNG has a transparent body and opaque white highlights. Tinting
all opaque pixels incorrectly colored the highlights. Derived `balloon_*_mask.png`
assets isolate the enclosed main body using `scripts/balloon_masks.py` (Pillow),
leaving highlight bubbles unchanged. Runtime draws the original PNG at its native
aspect ratio and fills only the body mask. Original exports are preserved byte-for-byte.
Celebration characters use the existing licensed BravuraText note glyph with custom
black-and-white SVG facial features, arms, legs, and CSS animation.

### Friendly celebration revision, 2026-11-13

Celebration bodies are now original vector cartoon note characters rather than text
glyphs, with round white faces, smiling expressions, gloves, and rounded shoes.
They follow the requested early black-and-white cartoon direction; no external
character artwork was copied or downloaded. The prior glyph-based body description
is historical. BravuraText remains bundled for the existing six games.

## O-005 cheesecake local trial, 2026-11-13

- `assets/cheesecake.png` is an unmodified copy of the workspace's original
  `assets/pic/芝士蛋糕/芝士蛋糕.png`. Original worksheet, PDF, and art sources are untouched.
- The staff, open notehead, S/L controls, and example are code-rendered primitives.
- English uses the already bundled Patrick Hand and its OFL license.
- Chinese uses ZCOOL KuaiLe, copyright 2018 The ZCOOL KuaiLe Project Authors.
  Downloaded 2026-11-13 from the Google Fonts repository:
  https://github.com/google/fonts/tree/main/ofl/zcoolkuaile.
  The unmodified `ZCOOLKuaiLe-Regular.ttf` and `zcool_kuaile_ofl.txt` are bundled.
  SIL OFL 1.1 permits commercial use and embedding subject to its license conditions;
  these fonts are copyrighted open-license software, not public-domain assets.

## Worksheet eraser icon, 2026-11-13

`assets/eraser.svg` is the unmodified Lucide eraser icon, downloaded from
https://github.com/lucide-icons/lucide/blob/main/icons/eraser.svg on 2026-11-13.
The supplied ISC/MIT notices are retained in `assets/lucide_license.txt`.
Both O-003 and O-005 use this clear outline icon with accessible text labels.

## Running celebration revision, 2026-11-13

The original code-drawn monochrome characters now use right-facing running bodies,
front-facing smiles, two banner poles/waving hands, and three clapping pairs with
finger details and contact sparks. No external character art was used. This supersedes
the earlier arm/leg animation description; shared artwork remains inline SVG.

## O-002/O-004 local trials, 2026-11-13

Copied the original `assets/pic/儿童手/左手.png` and `右手.png` from the parent
workspace into `assets/hand_left.png` and `hand_right.png` without editing the files.
O-002 preserves their native proportions. No AI source was modified.

Read the PDF-compatible preview in `assets/pic/可爱小牛高低音谱号/cow new.ai`
with Poppler, cropped only surrounding whitespace, and exported `assets/cow.png`.
Nineteen runtime masks limit black/brown fills to enclosed activity
regions: fifteen original patches, two original horns, and two new body outlines on a separate derived
`cow_activity.svg` with an embedded copy of the clean PNG. New outlines and matching
masks use smooth cubic SVG paths; `cow_activity.png` remains a derived raster
reference. The face has no activity patches, ears retain their original black interiors,
and an original curved smile is added without editing the source art. The clean cow export and original AI remain unchanged.
`scripts/cow_assets.py` reproduces the export. Clefs use exact SVG paths extracted from the already bundled licensed
Bravura font (SMuFL E050/E062), retaining its license. `src/cow_regions.mjs` records
actual glyph bounds and patch centroids for centered, contained symbols. Original worksheet O-004 is absent; the user explicitly
approved creating this new digital activity around the recorded cow/clef concept.
Original artwork redistribution rights remain subject to the existing open review.
The hub reuses these assets and the existing balloon/cake exports, with no new
external runtime requests. Patrick Hand, ZCOOL KuaiLe, and Lucide retain their licenses.

## O-007/O-008 worksheet trial artwork, 2026-11-13

`assets/ladybird.png` and `assets/sun.png` are unchanged copies of workspace exports
`assets/pic/七星虫/七星虫.png` and `assets/pic/太阳/太阳.png`. Their source masters
and Illustrator files were not modified. Existing Patrick Hand, ZCOOL KuaiLe,
Lucide eraser, and original five-character celebration are reused with their existing
licenses/provenance. No new third-party asset or remote runtime request was added.

## O-009/O-010/O-011 relative-note adaptations, 2026-11-15

Reused the unchanged bundled sun artwork and OFL-licensed BravuraText font. Treble, bass, and alto clefs use exact SMuFL glyphs E050, E062, and E05C from that font. Read the original bilingual PDFs to transcribe the four given-note groups and staff contours; no source PDF, DOCX, or AI was modified. The user removed the numbering portion from the digital O-008 on this date.


## O-009 worked answers and sky illustration, 2026-11-16

The introductory G/A notes now have explicit red answer labels aligned below their noteheads. Moved the unchanged original sun PNG from the first question into the yellow guide. Added original inline vector cloud, kite, and distant-bird line drawings matching its monochrome outline style; decorative graphics are hidden from assistive technology. No external artwork or source-master changes.

Complete staff browser flows and all 60 worksheet/hub responsive checks pass. Inspected the rendered tablet-width guide. AGENTS, README, development, and responsive procedure reviewed unchanged: daily generation, scoring, nine-question length, and ownership remain accurate. Local review only, no publication.


## O-009 reasoning example revision, 2026-11-16

User superseded the sky-decoration choice: removed all cartoon elements from O-009. The labeled G/A example now includes a red curved G-to-A arrow and “向上一格 · Up one step.” No source assets changed. Inspected the rendered guide; staff browser flows pass. Operational guides and overview reviewed unchanged because generation, nine-question scope, and ownership are unchanged. Local review only, no publication.

## O-013 keyboard preview, 2026-11-16

`assets/keyboard_preview.svg` is an original code-native thumbnail using the same seven-white/five-black C–B geometry as the activity. No external artwork, font glyph, or source-master export is used. Original O-013 DOCX/PDF files remain unchanged.

## Note Neighborhood prototype, 2026-11-16

`assets/note_house_characters.png` is an unchanged copy of the user's selected image-one design sheet (`codex-clipboard-52ca3294-57b3-49f2-b6ee-6bc7d36ba27a.png`), originally created with the built-in image generation tool during this chat. Its seven accessory-free C–B characters use a vintage monochrome rubber-hose cartoon treatment. Runtime SVG viewports clip each character independently, excluding neighbors and the sheet's inaccurate staff scene. No named existing cartoon character or logo is used. The selected middle house from image two supplies the thick, softly peaked roof direction; the runtime house is original code-native geometry with explicit line/space clearance. The game reuses existing OFL Bravura clef outlines from `cow_regions.mjs` and the bundled Patrick Hand font. No original worksheet or Illustrator master was modified. No external runtime requests were added.

Note Neighborhood brace follow-up (2026-11-16): `src/note_house_glyphs.mjs` is the exact BravuraText SMuFL E000 grand-staff brace, extracted by `scripts/note_house_assets.py` with measured ink bounds. The existing SIL OFL license applies. Runtime scales that brace to the top and bottom staff lines and reserves a separate left gutter. Confetti is original CSS/DOM geometry, with no external assets or library.

## Note Neighborhood sampled piano, 2026-11-16

`assets/piano_A3.mp3`, `piano_C4.mp3`, `piano_Ds4.mp3`, and `piano_Fs4.mp3` are unchanged local copies from [Tone.js's Salamander distribution](https://github.com/Tonejs/audio/tree/master/salamander), recorded by Alexander Holm on a Yamaha C5. The distribution's [README](https://github.com/Tonejs/audio/blob/master/salamander/README) identifies the author and CC BY 3.0 license. `assets/piano_attribution.txt` records source, author, license link, download date, and playback changes; the game links to that attribution. Total bundled MP3 size is 294,982 bytes. Runtime playback-rate changes supply G3/A3/B3/C4/D4/E4/F4 from the nearest samples (maximum two semitones), with gain/release envelopes. Disk recordings are unmodified; no sample is fetched from a third party at runtime. The earlier triangle-wave synthesizer in other games is unchanged.

## P-031 pitch motion, 2026-11-17

Read the original `P-031级进跳进B.docx` text and visually inspected `P-031级进跳进PIC.jpg`. The source supplies the four-category relative-motion learning goal. Corrected the source's swapped Step/Skip English mapping in the digital UI. Staff lines and open notehead ellipses are original code-native geometry, without clefs or external graphics. `assets/pitch_motion_preview.svg` is an original staff/pair/arrow thumbnail. Reused the existing licensed Patrick Hand font and shared five-character celebration. All original DOCX/PDF/PIC/AI files remain unchanged.

## P-002/P-003 digital adaptations, 2026-11-18

P-002 derives its group-and-key task from `worksheets/p_pitch/P-002键盘B.pdf`; piano keys are code-native proportional HTML/CSS. P-003 derives its staff pitches from `worksheets/p_pitch/P-003鱼B.pdf`. `assets/pitch_fish.png` is an unchanged extraction of `word/media/image7.png` from `worksheets/p_pitch/P-003鱼B.docx`. Digital labels use verified staff pitches and explicit scientific octaves to resolve inconsistent source fish labels; nine distinct pitches replace ten source staves containing duplicate C4. BravuraText is the existing bundled licensed notation font. No AI, PNG source, DOCX, PDF, or PIC master was modified.
