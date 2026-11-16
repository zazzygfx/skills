---
name: animate-my-work
description: Use when I want my own designs animated, such as "animate this Figma file", "make a launch film from these frames", "explainer for X" or "/animate-my-work". It storyboards in Figma, then Remotion renders it, with synced music and loud SFX.
metadata:
  summary: Animates my designs into motion films with Remotion
---

# Animate my work

I bring work I designed, usually Figma frames I made with Claude, plus Krea or FLORA images, shoe and brand work, or a
partner launch. This skill turns that work into a motion film whose in-betweens are designed, not improvised: a
storyboard in Figma first, then a film spec that **Remotion renders**. Claude writes data and checks numbers. It never
screenshots frames itself.

| I say | It does |
|-|-|
| `/animate-my-work <brief>` | the whole loop, no questions, an MP4 at the end |
| `/animate-my-work step <brief>` | stops for my yes after the storyboard, the stills and the review cut |
| `/animate-my-work storyboard <brief>` | steps 1–4 only: the beat sheet plus the full storyboard in Figma |
| `/animate-my-work gif <frames>` | a looping GIF of Figma frames for X (`references/pipeline.md`, "GIF") |

If I say "don't ask, just go", take the defaults, say which ones you took, and go.

## Before anything

Setup is in `references/pipeline.md`, "Setup": copy `template/` into the project as `video/`, run `npm install`, and
render the demo once (`npm run stills kit-demo`). Say this once: Remotion is free for individuals and companies of up
to 3 people; a bigger company needs a Remotion company licence (remotion.dev/license).

## Steps

1. **Brief.** Collect in one message:
   - what the piece is for and who watches;
   - the source: the Figma file key and page, image folders, a URL;
   - the length and the aspect ratio;
   - what must be on screen.

   Defaults: 1920×1080, 60 fps, 128 BPM, upbeat, 45–60 s for a launch, 90–120 s for an explainer. For a "how to use X"
   piece, research X on the web first so every claim on screen is true.

   Done when the brief and the defaults are written down.

2. **Study.** Only if I gave reference films. Process every one with ffmpeg as `references/study.md` describes, and
   write down what each transition does.

   Done when there is a findings list. Never claim to have watched a video you didn't process.

3. **Beat sheet.** Write `SCRIPT.md`: the story in one sentence, then one row per scene with its beats, every word on
   screen, the main move, the eye point in and out, the camera, and the sounds. Use `references/story.md`.

   Done when the length is within one bar of the target, and every demo scene shows its action literally.

4. **Storyboard in Figma.** Build 2–4 keyframes inside every scene and one designed transition frame at every
   important cut, captioned, in one Section (`references/storyboard.md`).

   Done when someone could animate the film from the storyboard alone. In `step` mode, stop here for my yes.

5. **Truth checks.** Register before/after pairs and check every highlight against what actually changed
   (`references/storyboard.md`, "Truth checks").

   Done when `align.py` shows every box sitting on its change.

6. **Export the layers.** Export each frame's layers as positioned PNGs, plus `layers.json` and `glows.json`
   (`references/figma-export.md`). Recompose 6 frames and compare them with Figma.

   Done when the recomposed frames match.

7. **Film spec.** Write `src/<film>/film.ts`, `video.tsx` and `timing.ts` using the engine
   (`references/engine.md`), the transitions (`references/transitions.md`) and the motion rules
   (`references/motion.md`).

   Done when `npm run typecheck` passes.

8. **Review cut.** Run `npm run stills <film>`, then `npm run review <film>`, `npm run jumps <film>` and
   `npm run energy <film>`. Look at every still yourself (`references/review.md`). Fix, then re-render the review cut.

   Done when there are 0 unplanned jumps, energy passes, and the stills hold up as posters. In `step` mode, put the
   review cut to me.

9. **Render.** Run `npm run render <film> -- <music flags>`. Remotion renders the picture, `cues.mjs` writes every
   sound from the spec, `mix.py` mixes and measures, and ffmpeg muxes (`references/sound.md`).

   Done when the final hit lands on the end card and every sound reaches its target over the music.

10. **Hand-off.** Report:
    - the file and its length;
    - the transitions used;
    - what the review changed;
    - the measured audio numbers;
    - the Figma link;
    - the sources for any research claims;
    - the cost (normally nothing new);
    - anything not verified.

## Rules

- **The in-between is the film.** Every cut is a designed move that carries the eye. Never a hard jump, never one
  style frame per scene.
- **Something is always moving.** The camera works on every scene: it pushes in on the action, follows it and pulls
  back for the result. Three things are alive in every scene. No hold over 1 s, except the end card.
- **No beat bounce.** Energy comes from transitions, staggered entrances and the camera. Never scale the whole frame
  on the beat.
- **Demos never rush.**
  - The cursor travels.
  - A box drags out over about 0.8 s and locks with a tick.
  - Prompts type letter by letter.
  - The cursor moves to Generate and clicks, and a render sweep plays.
  - The before/after wipe takes about 1.6 s.
  - The changes are pointed out again on the result.
- **Sound follows motion.** Every sound comes from the spec, so it lands on what caused it. Whooshes on moving cuts,
  clicks on presses, pops on chips, key clicks on typing. Sound effects stand clearly over the music; measure it.
- **Copy stays true.** When the length changes, every on-screen claim about it changes too.
- **Real assets only.** Use my images, and official assets from the source site. For partner work (I'm a Krea creative
  partner, for example) the partner's official name and logo file are allowed. Never redraw a logo.

## Never

- **A credit card.** No "made with", no name or watermark card, unless I ask.
- **A voiceover,** unless I ask.
- **Paid generation unless I ask.** No paid music, images or video. Reuse my sound pack, re-cut my track, or use the
  code synth. If I ask for AI video clips, make one at a time and wait for my yes between them.
- **A claim that didn't run.** Never say a check passed, a video was watched or a mix "sounds good" unless it actually
  ran. Say "not run" or "measured".
- **Mentioning references in my posts.** If I'm posting about the work, references are mine to mention, not yours.
- **Leaving temporary Figma sheets** in my file.

## Files

- `references/study.md`: how to read reference films with numbers, and what the ones I studied measured.
- `references/story.md`: the beat sheet, pacing curve, demo grammar and on-screen copy.
- `references/storyboard.md`: keyframes, transition frames, captions and the truth checks.
- `references/figma-export.md`: layers to PNGs with exact positions, glows, hi-res layers and clean-up.
- `references/engine.md`: the film spec (`FilmSpec`), every anim, cursor, camera, cut and chrome field.
- `references/transitions.md`: the transition vocabulary, when to use each, and the patterns from launch films.
- `references/motion.md`: easing, durations, continuity, camera and the bugs that make jumps.
- `references/sound.md`: music re-cut on bars, the SFX palette, mix targets and the measurement.
- `references/review.md`: stills at every cut, jumps, energy, the contact sheet and the QA list.
- `references/pipeline.md`: setup, commands, render, X cut, GIF and troubleshooting.
- `template/`: the Remotion project. `src/kit/film-core.ts` holds the timing, transitions, anims and cues as pure
  functions; `src/kit/film.tsx` is the renderer; `src/kit-demo/` is a working example of every transition.
  `scripts/` holds `film-render.mjs` (the one-command render), `cues.mjs`, `mix.py`, `align.py`, `gif.sh` and the
  design.how render, jumps and energy checks. `public/sfx/` and `public/music/` hold my sound pack and a 128 BPM track.
