# Code Quality Audit and GitHub Pages Release

Last updated: 2026-11-13

## Scope

Reviewed all runtime modules, CSS/HTML, Node server, generators, storage, tests,
asset boundaries, dependency metadata, and publishing workflow. The user authorized
fixes, pushing, GitHub-based deployment, a public repository, and noindex declarations.
The parent workspace and Note Trainer remain outside the runtime change scope.

## Findings and resolutions

| Priority | Finding | Resolution and regression evidence |
|---|---|---|
| P1 | Black-key artwork passed touches into the white keys underneath, selecting a different pitch | Black regions intercept input; iPad-size real touch test confirms no white selection |
| P2 | A rejected audio resume from an abandoned question could display an error in the new game | Error handling checks the originating question; delayed rejection after navigation is tested |
| P2 | Bingo ignored failed history writes, and stale per-tab histories could overwrite sequential completions | Shared storage module rereads before append, caps history, preserves corrupt raw data, reports unsaved Bingo wins; Node and browser failure tests |
| P2 | Exposed but unusable speech APIs had no failure path | Central speech owner supports error/timeout fallback and cancellation; written call is shown only for the current question/call |
| P2 | Replacing the whole view discarded keyboard focus | Matching controls regain focus without scrolling; Enter-key regression verifies focus retention |
| P2 | Generic validator accepted missing answers for unsupported question kinds | Only supported scalar kinds validate; explicit negative regression |
| P2 | Small route controls were inconvenient for touch | Minimum 44-pixel height for routes, choices, toolbar and navigation controls; four-viewport checks |
| P2 | Development server served arbitrary non-hidden files and did not resolve symlink boundaries | Runtime allowlist, realpath confinement, GET/HEAD-only responses, and font MIME; confinement regression |
| P2 | No reproducible deployment artifact or online file verification existed | Content-derived build directories, SHA-256 manifest, official Actions pinned by commit, and verification script |

No unresolved P1/P2 runtime defect was identified in this review. The original demo's
single UI module remains manageable at this scope; extract game views as they grow.
Speech timbre and actual physical-device usability remain human acceptance questions.

## Verification

The audit began on 2026-11-12 and publication continued after midnight on 2026-11-13.
One production browser run timed out waiting for a menu button to stabilize in the
landscape sequence. Independent desktop/landscape entry-return checks and a fresh
complete production run passed without reproducing it; the failing run is not counted
as acceptance. The final production run passed both suites and all 15 local served hashes.
Verified build: `44a2e6245a64`.


- Twelve Node tests pass, including 6,000 unique generation sessions (36,000 items),
  duration equivalence, first-error persistence, speech cancellation/failure, storage,
  release determinism/hashes and symlink confinement.
- The complete Chrome suite passes four viewport sizes and all six menu entries,
  four complete question sessions, replay, rhythm editing/playback start, Bingo and print.
- Dedicated regressions use an 810 × 1080 touch/mobile context to check black-key
  isolation, focus, delayed audio rejection, speech failure, and Bingo quota failure.
- `npm audit` reports zero known vulnerabilities. There are no runtime dependencies.
- The final production package, not just source, receives these browser suites and
  15 runtime/entry-file hash comparisons. Runtime-only build output excludes docs,
  tests, Git metadata and user records.
- The first production-preview attempt used an already-running server with an old
  allowlist after rebuild and correctly failed. Restarting that server loads the
  current manifest; CI always starts its server after building. This was a local
  preview setup failure, not accepted runtime evidence.

## Hosting decision

An unused owner-private Sites draft was briefly created before the user clarified
GitHub hosting. Draft ID: `appgprj_6af5daafef1c81919ea2006da1b37826`. No source was
pushed there and no Site deployment occurred. Its local hosting manifest was removed;
no Sites credential is stored in this repository. GitHub Pages is the selected host.

The user explicitly approved public visibility for `fangjiaqifion/music-activity-studio`.
Pages serves a runtime-only build via Actions, with no login. Both redirect and game
pages declare noindex/nofollow/noarchive; the game additionally names Googlebot and
Bingbot. These are crawler directives, not access controls, and cannot control indexing
of github.com's repository page itself. See [GitHub's hosting documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Deployment evidence

Pending initial push and Pages workflow. Record actual commit, build, run, online hash,
and browser evidence here after successful publication. Do not infer deployment
from the configured URL or a completed local build.
