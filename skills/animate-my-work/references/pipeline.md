# Pipeline

## Setup (once per project)

1. **Tools.** Node 22.6 or later (`node -v`), ffmpeg, git and Python 3. Install Python packages with
   `pip install pillow numpy opencv-python-headless soundfile librosa`, adding `--break-system-packages` if pip refuses.
2. **Project.** Copy this skill's `template/` to the project as `video/`, then `cd video && npm install`. That
   installs Remotion 4. The first render downloads Chrome Headless Shell (about 95 MB) into `.remotion/`.
3. **Prove it.** Run `npm run stills kit-demo`, then `npm run review kit-demo && npm run jumps kit-demo && npm run energy kit-demo`.
   Optionally run `npm run render kit-demo -- --bars "5,6,7,8-15" --tail 31` for the full picture, cues, mix and
   mux.
4. **Linux Chrome libraries.** If the headless Chrome won't launch, run `apt-get install libnss3 libatk-bridge2.0-0 libgbm1
   libxkbcommon0 libasound2t64 libxcomposite1 libxdamage1 libxrandr2 libpango-1.0-0 libcairo2`.
5. **Fonts.** The template loads Inter Tight from a local file (`public/fonts/`), so it works offline and behind
   proxies. For another family, `npm i -D @fontsource-variable/<family>`, copy its `latin-wght-normal.woff2` into
   `public/fonts/`, and point the theme's `src` at `{file: 'fonts/<Family>.woff2'}`. Never turn off TLS checks.

Remotion is free for individuals and companies of up to 3 people; a bigger company needs a Remotion company licence
(remotion.dev/license). The template is built on design.how's make-motion template (MIT, see `LICENSE-design-how`).

## Commands (in video/)

| Command | Does |
|-|-|
| `npm run studio` | Remotion Studio, to scrub a film |
| `npm run typecheck` | TypeScript over `src/` |
| `npm run stills <film>` | the frames in `STILLS`, to `out/<film>/stills/` |
| `npm run review <film>` | a silent cut at scale 1, plus a contact sheet |
| `npm run jumps <film>` | the jump check (planned frames come from timing.ts) |
| `npm run energy <film>` | the energy check per scene |
| `npm run cues <film>` | `out/<film>/cues.json` from the spec |
| `npm run render <film> -- <mix flags>` | **the final render:** Remotion picture (CRF 16, BT.709), then cues, then mix.py, then mux to `out/<film>/<film>.mp4` |
| `python3 scripts/mix.py cues.json mix.wav [--music --bpm --phase --bars --tail]` | the mix alone, with the report |
| `python3 scripts/align.py before after out [--offset x y]` | before/after registration and change boxes |
| `scripts/gif.sh <dir> <out.gif> [sec] [width]` | frames to a GIF, with a palette per frame |

## Timing

Remotion renders at roughly 6–8 frames a second per machine here, about 3 minutes for 24 s at 1080p60. A 110 s film
takes roughly 15 minutes. Render the review cut while you iterate; render the final once.

## X

1080p is fine for X. Post the final MP4; it's under X's limits. For a GIF of the frames, see `figma-export.md`.

## Troubleshooting

- **`fonts.googleapis.com` fails:** apply the local-font fix (setup step 5).
- **Chrome won't launch:** install the libraries in setup step 4.
- **The jump check flags a designed motion:** add its frames to `STEPS` in timing.ts. Don't loosen the check.
- **Energy fails on a scene:** add camera keys, overlap the entrances, and add a `float` or a cursor move.
- **A sound is buried:** raise its gain in mix.py's `BASE` and mix again; the report shows the change.
