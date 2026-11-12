# Six-in-One Demo Acceptance

Last updated: 2026-11-12

## Scope and findings

A new independent local game offers six playable activities behind one shared menu.
The first implementation showed missing Unicode note glyphs. Bundling official,
unmodified BravuraText resolved the half/whole-note boxes; the final Chrome screenshot
shows quarter, half, dotted-half, and whole notes correctly. Pending audio resume
now uses a generation token, and navigation invalidates stale playback. A delayed
rhythm UI update also checks its question owner. Empty first attempts survive later
corrections. No Note Trainer code or data was modified.

## Evidence

- `npm test`: six passing tests, 500 seeds × two levels × six games = 6,000 distinct
  sessions, each with six generated items. Independent invariants cover valid answers,
  board/call uniqueness, one-beat rhythm cells, key bounds, and first-error retention.
- `npm run test:browser`: system Chrome, 1280 × 1000, 768 × 1024, 390 × 844,
  667 × 375. Home plus six games yields 28 non-overflow screen cases.
- Actual DOM clicks completed shop, detective, ocean, and builder sessions. All four
  deliberately began with an empty wrong answer, then finished at 5/6 first-correct.
  Stored records preserved that first answer. Same-seed replay retained the seed.
- Rhythm grid edits, diagonal selection, Web Audio start, Bingo letter/octave matching,
  and a detected winning line passed. No JavaScript page errors were observed.
- Shop printing produced two A4 pages with questions and separate answers. Both pages
  were rendered for visual review. Print/voice quality is not inferred from API success.
- Desktop and mobile screenshots were reviewed, including final font loading. Selected
  final views are [home](home.png) and [shop](shop.png). Runtime screenshots/PDF are ignored.
- Global naming checks passed: 99 curated files, 12 migration tests, eight revision
  safety checks, and strict configuration startup parsing. Unrelated config preserved.

## Limits and delivery

Chrome automation verifies the app, not human audibility or physical-device touch.
The in-app/browser-control tool encountered connection/timeouts and did not supply
successful manual acceptance. Safari and physical iPad remain unverified. The local
server is loopback-only, no-store, and there is no service worker or deployed site.
The private GitHub repository exists, but game commits remain local and unpushed.

Review all worksheet/asset provenance before public redistribution. The current
worksheet-source mappings are inspiration references, not automated source imports.
