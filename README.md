# Music Activity Studio

Music Activity Studio (音乐游乐工坊) is a browser-based collection of interactive
music exercises for beginning piano learners. It is designed for short sessions
at home, in individual lessons, and in the classroom.

[Open Music Activity Studio](https://fangjiaqifion.github.io/music-activity-studio/)

## Choose a practice area

| Practice area | Examples |
| --- | --- |
| Staff and notation | Identify lines, spaces, and clefs, compare pitches, and find neighboring notes on the grand staff |
| Piano keyboard and fingering | Identify finger numbers, recognize keyboard patterns, and match notes to keys |
| Note names and listening | Complete note-name sequences, match fixed-do syllables, and play listening Bingo |
| Intervals and chords | Distinguish whole and half steps and build note combinations on the keyboard |
| Rhythm and composition | Combine note values to fill a measure and create playable rhythm patterns |

The catalog brings 25 activities together. Choose a training area and open an
exercise. Illustrated exercises reuse artwork from original teaching worksheets.
Depending on the activity, learners can use spoken instructions, retry with hints,
replay generated questions, or print a practice sheet.
Staff Race lets a learner and a teacher or parent take turns moving note pieces
through adjacent lines and spaces on one shared staff. Players choose a character
and race from the first space below the staff to the first space above it.

## Open from the iPhone or iPad Home Screen

Open the Studio in Safari, choose **Share → Add to Home Screen**, and enable
**Open as Web App** if Safari offers it. Launch from the green music-note icon.
An internet connection is required to load the site.

Where activities offer student profiles or save results, those records are stored
in the current browser or web app on the device.

## Development

Use Node.js 24. Run `npm ci` and `npm run serve`, then open
[the local preview](http://127.0.0.1:8787/). Run `npm test` for the unit suite
and `npm run build` to package the site. See the
[development guide](docs/development.md) for browser checks and release verification.
