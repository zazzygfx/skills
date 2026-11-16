# Motion

Every value is a pure function of the frame. No CSS transitions, no timers, no unseeded randomness, no state carried
between frames. The engine already follows this; keep it that way in anything you add.

## Easing (film-core.ts `E`)

| Name | Curve | For |
|-|-|-|
| `E.out` | bezier(0.16, 1, 0.3, 1) | arrivals: a fast start and a long soft landing |
| `E.in` | bezier(0.7, 0, 0.84, 0) | leaving: still fast at the end, for the velocity handoff |
| `E.io` | bezier(0.87, 0, 0.13, 1) | pushes and moves between two rests |
| `E.p4io` | bezier(0.76, 0, 0.24, 1) | shared flights, wipes |
| `E.p2io` | bezier(0.45, 0, 0.55, 1) | camera moves, box draws |
| `E.back` | back-out 1.6 | chips only: the one overshoot allowed |
| `E.minJerk` | minimum jerk | the cursor |

Opacity runs linear; on an ease, a fade sits near full and then vanishes in one frame.

## Durations

| Motion | Time |
|-|-|
| press | 0.24 s |
| chip | 0.38 s |
| text sweep | 0.5 s |
| card entrance | 0.55 s |
| box draw | 0.8 s |
| shared flight | 0.75 s |
| push or zoom | 0.55–0.7 s |
| before/after wipe | 1.6 s |
| camera move | 1–3 s |

Staggers: words 60–120 ms apart, cards 80–300 ms, recap items one per beat.

Reading time once text has stopped moving: max(1.2 s, 0.35 s per word + 0.5 s). The end card holds at least 2 s.

## Energy (the numbers from study.md)

- **Frames with motion:** at least 70%. The energy check's own floor is 40%.
- **Pixels moving in the median frame:** at least 2%.
- **Holds:** none over 1 s, except the end card.
- **Three things alive per scene:** a main move (an entrance, a draw, a wipe), a supporting move (a cursor, typing, a
  stagger) and a slow one (the camera, a float, the background drift).
- **The camera works.** Use camera keys in every scene longer than 4 beats. The drift alone moves less than 0.5 px a
  frame, which the eye and the energy check both read as still.
- **Fill the frame.** UI text at 1920 wide is 22 px or more, or the camera pushes in until it is.

## Bugs that make jumps (each one shipped once)

- **A clip-path tween from `inset(0%)`.** The browser collapses it to one value and it won't interpolate, so it jumps
  at the end. The engine's wipe clips with numbers it computes itself. Do the same for any new clip.
- **A scene-wide scale on the beat.** It reads as bouncing. Never.
- **Blank incoming scenes.** B's content entering after the cut leaves an empty background on the cut frame. Start it
  0.1–0.4 s early (negative `at`).
- **The camera resetting at a match cut.** Chains share one drift (`timeline().groups`). Never give the second scene a
  fresh camera.
- **Fractional z-index.** It's ignored; the engine uses integers.
- **A shared element ignoring the camera.** The engine maps both rects through each scene's full keyed camera (scale
  and focus point) at the hand-off times, so a flight lands exactly where its target sits on screen.
- **A cursor blinking at a match cut.** A cursor whose path starts at the scene's first frame is carried over, so it
  stays fully visible instead of fading in again.
- **Square corners on a flying clone.** A flight keeps its layer's `radius`, scaled by the camera.
- **A before image misregistered with its after.** See the truth checks in `storyboard.md`.
- **Fonts loaded late.** Text is images from Figma, so this only bites in code-drawn scenes. Use `useThemeFonts`
  from the kit there.
