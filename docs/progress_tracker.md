# Progress Tracker

Last updated: 2026-11-12

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
