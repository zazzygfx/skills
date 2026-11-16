# Engine

A film is data. `src/<film>/film.ts` exports a `FilmSpec`. `src/kit/film-core.ts` turns it into styles and sounds as
pure functions of time, and `src/kit/film.tsx` draws any frame of it. Remotion renders it, and `npm run cues` turns
the same spec into the sound list. Read `src/kit-demo/film.ts` first: it uses every feature.

## A film folder

```
src/<film>/film.ts       the spec (pure TS, no JSX: Node imports it for the cues)
src/<film>/video.tsx     <Film spec layers glows/> and the composition object
src/<film>/timing.ts     FPS, FRAMES, CUTS, STEPS, STILLS, THUMBNAIL, derived from the spec (the checks read it)
src/<film>/layers.json   from the Figma export
src/<film>/glows.json    from the Figma export
public/<film>/layers/    the layer PNGs
```

Copy `src/kit-demo/video.tsx` and `src/kit-demo/timing.ts` and change the import, then add the composition to
`src/Root.tsx`.

## FilmSpec

```ts
{
  id, fps: 60, bpm: 128, w: 1920, h: 1080, folder: '<film>',
  order: [[scene, beats], ...],            // scene = Figma frame number; beats = its length
  bg?: css | {[scene]: css},               // default: the white-to-blue brand gradient
  anims: Anim[],                           // in-scene motion, per layer
  cursors?: CursorTrack[],
  camera?: {s, keys: [beat, scale, focusX, focusY][]}[],
  cuts: Cut[],                             // one per scene change, keyed by the incoming scene
  chrome?: {l, from, to}[],                // a layer that persists across scenes from..to (a step rail)
  sfx?: [scene, beat, type, volume][],     // extra sounds not tied to a motion
}
```

All times are in **beats from the scene's start**, and may be negative: start 0.1–0.4 s before a cut, so the incoming
scene is never blank.

## Anims (`fx`)

| fx | Fields | Does | Sound |
|-|-|-|-|
| `blurIn` | at, d=0.55, scale=1.06, blur=12, dx, dy | arrives from bigger and blurred | `sfx` if set |
| `rise` | at, d=0.55, dy=60, blur=8 | rises into place | `sfx` if set |
| `fly` | at, d=0.95, dx, dy, scale=1.15, blur=14 | flies in from an offset (images from the edges) | `sfx` if set |
| `chip` | at, d=0.38 | pops in from 0.7, back-out; the only overshoot | pop (`sfx: null` for none) |
| `fade` / `hide` | at, d=0.25 | fades in / out | — |
| `rev` | at, d=0.5 | text sweeps on, left to right, behind a soft mask | — |
| `type` | at, d | text types on in hard steps (one per ~13 px) | a key click per step |
| `draw` | at, d=0.8 | a box draws from its top-left corner | swish, then a tick when it locks |
| `press` | at | presses to 94% and back | click |
| `ring` | at | a blue ring pulses out from the layer | — |
| `pulse` | at, n=4 | opacity pulses for n beats (pointing out a change) | — |
| `zoomOut` | at, d=1.2, from=1.35 | pulls back from a close-up | — |
| `float` | amp=12 | a slow sine drift, all scene long | — |
| `waves` | ls[], at, until | voice bars pulse in scaleY | — |
| `shimmer` | at, d=1 | a light sweep across the layer (rendering) | — |
| `caret` | at, until | a blinking caret at the layer's left edge | — |
| `wipe` | l=before layer, div, hnd, at, d=1.6, offAt? | before/after: the divider sweeps in from the right, the "before" clips away; at `offAt` the divider leaves to the left | swish + shimmer |

An anim with an entrance (blurIn, rise, fly, chip, fade, rev, type, draw) keeps its layer hidden until its time.
Layers without anims are visible all scene long.

## Cursors

```ts
{s, path: [[beat, x, y], ...], clicks?: [{at, l}], out?}
```

The cursor's tip glides between path points on minimum-jerk curves. A click presses layer `l`, pulses a ring around it
and plays a click. `out` is when the cursor fades away.

## Camera

`keys: [beat, scale, focusX, focusY]`: at that beat, `focus` sits at the frame centre at that scale. Between keys the
camera eases with a symmetric curve. A slow drift (×1.06 over the scene, or over a whole match-cut chain) runs on top,
so the camera never freezes.

Push in on the action as it happens (a box, a prompt), follow the cursor, and pull back for the result. This is where
a film's energy comes from: the demo went from motion in 33% of frames to 69% with camera keys alone.

## Cuts

`{to, fx, ...}`. `fx` is one of:
- `zoomThrough` (x, y, sToScale=8)
- `push` (dir 'left' | 'up')
- `iris` (x, y)
- `whip`
- `colourSwipe` (colors)
- `implode`
- `fadeThrough`
- `matchCut`

Add `shared: [{from: [scene, layer], to: [scene, layer], d=0.75, uniform=true, delay?}]` to fly elements across the
cut. A uniform flight keeps the element's proportions and crossfades into the target. Use `uniform: false` only when
both rects have the same aspect ratio. Each `fx` plays its own sound (see `transitions.md`).

`matchCut` swaps scenes with the same layout on the cut, with no motion. Its scenes share one continuous camera drift,
so nothing jumps.

## Chrome

`{l, from, to}`: layer `l` (for example the step rail at index 3) is hidden inside scenes `from`..`to` and drawn once
above them. It crossfades between the scenes' versions, fades in at the start of the run and leaves at its end. Pushes
and zooms never carry it away.

## timing.ts

The template's `render.mjs` reads it for the stills, the review cut, and the jump and energy checks:
- `CUTS` holds the cut frames;
- `STEPS` holds every frame a transition moves fast in (`plannedFrames`), so the jump check skips designed motion;
- `STILLS` adds the frames 11 frames either side of each cut.
