# Asset Provenance

Last updated: 2026-11-12

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
