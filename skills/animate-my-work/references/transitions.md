# Transitions

Every cut gets a designed transition, timed so its fastest frame lands on the beat. Use 5–8 kinds per film and repeat
them. Twenty gimmicks read as noise. Write the transition sheet before the spec: one row per cut.

| Cut | A → B | Carried element | Transition | Direction | Beat | Eye A → B | Sound |
|-|-|-|-|-|-|-|-|

## Choosing

1. Does an element exist in both A and B (a chip, a button, a card, a pill, an image)? Use a **shared element**: it
   flies from rect A to rect B and becomes B's copy.
2. Is there a point of interest to dive into (a button, a box, a photo)? Use **zoom-through**: A accelerates into it,
   B arrives already moving.
3. Is B the next item of the same kind? Use **push**: A and B move together on one curve.
4. Is it a reveal from a click or a finished state? Use **iris**, opening from that point.
5. Is it the same layout with new content (an editor, a page)? Use a **match cut**: swap on the cut, with one camera
   drift running across both.
6. Is it an energy spike, or unrelated content? Use a **whip** or a **colour swipe**.
7. Is it the end? Use **implode**: everything collapses to the centre, a white flash, the logo bursts out.
8. Nothing fits? Use **fade-through**, rarely.

## What the engine does (film-core.ts)

| fx | A | B | Sound |
|-|-|-|-|
| zoomThrough | scale to 8× exponentially into (x, y), blur, fade out over the last 45% (0.55 s) | from 1.4× to 1, blur 16 to 0, expo-out (0.7 s) | whoosh 0.3 s before |
| push | slides out on one shared expo-in-out curve, with blur peaking mid-move | slides in on the same curve (0.7 s, centred on the cut) | whoosh 0.2 s before |
| iris | shrinks to 0.92, blurs | revealed by a circle growing from (x, y) to 2300 px (starts 0.24 s early) | whoosh 0.3 s before |
| whip | out to the left with skew and blur (0.22 s, ease-in) | in from the right, settling (0.45 s, ease-out) | swish |
| colourSwipe | covered by two brand panels rising from the bottom | uncovered as they leave from the top | whoosh 0.25 s before |
| implode | collapses to 8% and rotates 8° (0.5 s, ease-in) | white flash, then bursts out from 0.35× | swell 1.45 s before, sub on the cut |
| fadeThrough | fades out (0.25 s) | fades in from 0.94× | — |
| matchCut | swaps on the cut | swaps on the cut | — |
| shared | the original hides as the flight starts | the target fades in as the clone crossfades out | swish |

## Continuity rules

- **Velocity handoff.** A leaves on an ease that is still fast at the cut; B arrives already fast. Ending A at speed
  zero and starting B from zero is the dead stop that reads as a slideshow.
- **Cut on the fastest frame, on the beat.**
- **Carry something across every cut.** If nothing exists in both, use a motivated move: a dive into a point, a whip
  or a swipe.
- **Overlap.** B starts 0.1–0.4 s before A finishes. Exits are about 20% shorter than entrances.
- **Eye trace.** The last thing in A sits where the first thing in B appears.
- **Persistent chrome stays put.** A step rail or nav lives in `chrome`, above the scenes.
- **No blank frames.** On the cut frame, B's first content is already visible and moving.

## Patterns from launch films (to build on top of the engine)

- **Highlight grows into the next scene.** A box behind a word scales until it fills the frame with the brand colour.
  Build it with a `zoomThrough` into that box, with B's background set to the colour.
- **Button into icon into dive.** Press, morph into an icon (a shared flight to an icon layer), then `zoomThrough`.
- **Overview to focus.** A grid scene, then `zoomThrough` into one tile, which is B's full frame.
- **A line that continues.** Two layers drawn with `draw`, the second starting on the cut where the first ends.
- **Prompt-bar zoom.** Camera keys: a quick push in on the prompt bar, then follow the caret as `type` runs.
