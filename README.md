# Music Activity Studio

Last updated: 2026-11-15

A music activity studio with six games and nine interactive worksheet adaptations, inspired by FANG, Jiaqi's illustrated worksheets.
The Chinese interface is intended for young piano beginners, with adult support where
needed. Usability and educational effects have not been established.

| Activity | Playable demo |
|---|---|
| Rhythm shop | Combine note values into a target total; equivalent answers are accepted |
| Detective cat | Complete an explicitly directed cyclic note-name sequence |
| Rhythm lab | Edit a 4 × 4 one-beat grid and hear a row, column, or diagonal |
| Ocean match | Match A–G letters to fixed-do solfege |
| Harmony builder | Select white keys to build generic intervals and four curated triads |
| Music Bingo | Match spoken letter/octave calls to a 3 × 3 board and detect winning lines |

Four question games have six rounds, first-attempt results, and same-seed replay.
Rhythm lab is unscored; Bingo ends on a winning line. Difficulty changes shop totals
and generic interval options; other demo vocabulary stays the same. Completed question
sessions and Bingo wins stay in this browser only, up to 100 entries, without names.

The original six games also offer optional browser printing with a separate answer or teacher guide page.
Rhythm lab and Bingo print the current board; other games print all six questions.
These are newly generated exercises, not replacements for original worksheet masters.

## Play and run locally

The GitHub Pages version is hosted at
[Music Activity Studio](https://fangjiaqifion.github.io/music-activity-studio/),
without a login. Current release acceptance is recorded in [the tracker](docs/progress_tracker.md).
Game pages request no search-engine indexing. This does not make the public repository
or site private or guarantee exclusion from search results.

### Local development

Requires Node.js, with no runtime packages or external asset requests:

```sh
npm run serve
```

Open [the local demo](http://127.0.0.1:8787). This URL works only on the serving Mac;
it is not a physical iPad link. Stop the server with Ctrl+C. GitHub Actions verifies and publishes the runtime-only build to Pages.
See [development](docs/development.md) for architecture and test commands.

## Limits and credits

This is a feasibility demo, not the complete worksheet library. It does not assess
singing, clapping, handwriting, or physical piano performance. Sound uses triangle
synthesis; Bingo uses browser speech voices. Audible quality and physical iPad behavior
need human checks. Browser storage can be unavailable or cleared. There is no account,
cloud synchronization, offline installation, or account login requirement.

See [asset provenance](docs/asset_provenance.md). Original illustrations are not offered
under an open-source license. BravuraText retains its supplied SIL OFL license.

## Illustrated interactive activities

The `balloons.html` activity adapts O-003 气球 B using its original hand-drawn
balloons and changing line/space notes. Children color, check, and reconsider answers
with aggregate hints; completing a page earns a monochrome musical celebration.
A browser-local student selector automatically supplies name and date. These profiles
are not cloud accounts. Cloud synchronization and data collection are future work,
deferred until the worksheet content framework is established.

The activity includes larger balloons with aligned staves, short strings, a checkmark
completion button, and optional spoken Chinese instructions using the browser's voice.
Its five smiling black-and-white cartoon notes celebrate a fully correct page.

The `cheesecake.html` activity adapts O-005 芝士蛋糕: tap S for a space
note or L for a line note on each of nine original cakes. It shares local student
profiles, Chinese speech, aggregate feedback, and the five-note celebration.
Patrick Hand and ZCOOL KuaiLe provide freely licensed handwriting-style lettering.

The [worksheet selection page](activities.html) groups O-002 musical hands,
O-003 balloons, O-004 clef cow, and O-005 cheesecake into illustrated cards. O-002
asks children to identify each hand and fill all ten piano finger numbers. O-004
colors nineteen treble/bass clef regions black/brown on the body, legs, and both
horns. The face stays clear except for its eyes, nostrils, and smile; ears remain black.
All nine illustrated activities, including the O-007/O-008 corrections and O-009 through O-011 additions, are included in the published release. The cow also
offers enlarged scene tiles for easier viewing and answering on small screens.

The selector also includes **O-007 Draw the Notes** (`ladybirds.html`)
and **O-008 Compare Two Notes** (`sunshine.html`). Place noteheads
by tapping a staff position, or compare the second note with the first using higher/same/lower arrows. O-008 does not ask for line or space numbers.
**O-009 Treble**, **O-010 Bass**, and **O-011 Alto** (`treble.html`, `bass.html`, `alto.html`) offer relative note-name exercises. The revised local O-009 introduces G on the treble clef’s second line once, then asks children to identify single notes from that position. O-010/O-011 retain their earlier reference-group behavior pending review. All follow the existing local classroom conventions. All activities reflow for
phones, iPads/tablets, and computers; the original worksheet artwork does not impose
a paper layout on the screen.


## O-009 movable G clef, 2026-11-16

The user clarified that the clef itself moves. This supersedes the fixed-second-line G instructions above. O-009 uses G anchors on lines 3, 4, 1, and 2 across four six-question groups. Each card has one target note; its answer follows the displayed clef anchor. The introduction demonstrates third-line G and adjacent A/F. O-008, O-010, and O-011 remain unchanged. Original masters are preserved.
