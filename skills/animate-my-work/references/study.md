# Study

Read reference films with ffmpeg and numbers, never by eye alone. A finding is only real if it came from frames or
measurements you actually took.

## Reading a film

```bash
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of csv=p=0 ref.mp4
# hard cuts (few cuts usually means continuous transitions, and that's the point)
ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -vsync vfr -f null - 2>&1 | grep -o 'pts_time:[0-9.]*'
# 4 fps contact sheet, timestamped (PIL grid, 10 across)
ffmpeg -i ref.mp4 -vf "fps=4,scale=288:162" f/%04d.jpg
# 12 fps strip of each transition worth copying
ffmpeg -ss 11.3 -t 1.4 -i ref.mp4 -vf "fps=12,scale=320:180" fine/%03d.jpg
```

Audio: decode to mono with ffmpeg. Measure the tempo with `librosa.beat.beat_track` and the percussive hit rate with
HPSS plus `onset_detect`. Transcribe any voiceover with Whisper.

For each transition, write down:
- what moves;
- what is carried across the cut;
- the direction and duration;
- where the eye goes;
- what sound marks it.

## The same yardstick for references and for our cut

Measure motion the way the energy check does, at 30 fps, 160×90, greyscale. A pixel counts as moving when it changes
by 3 levels or more. A frame has visible motion when more than 1% of its pixels move.

| Film | Length | Hard cuts | Frames with motion | Median px moving | Longest still | Hits/s |
|-|-|-|-|-|-|-|
| r1 | 30.1 s | 9 | 77% | 4.7% | 0.1 s | 0.8 |
| r2 | 10.0 s | 0 | 99% | 9.6% | 0 | — |
| r3 | 7.8 s | 4 | 98% | 11.1% | 0 | — |
| r4 | 29.1 s | 11 | 75% | 9.1% | 2.2 s | 0.55 |
| r5 | 37.1 s | 10 | 75% | 2.1% | 2.0 s | 1.35 |
| r6 | 44.8 s | 12 | 59% | 2.2% | 4.9 s | 0.58 |
| r7 | 30.1 s | 12 | 100% | 11.4% | 0 | — |
| r8 | 30.0 s | 0 | 79% | 2.9% | 0.8 s | — |
| r9 | 41.0 s | 3 | 86% | 5.4% | 1.3 s | 0.88 |
| r10 | 46.2 s | 1 | 81% | 3.9% | 2.0 s | 1.28 |
| **our rejected v2 explainer** | 110.6 s | — | **41%** | **0.56%** | **4.5 s** | 2.6 |

What this says:
- **Motion.** The references move in about 80% of their frames, with 2–11% of the picture changing.
- **Holds.** They hold still for 2 s at most.
- **Hard cuts.** They cut hard rarely, or never: the cuts are transitions.
- **Sound.** They land about one strong hit per second.

The rejected cut "felt slow" because it was: still most of the time, with small moves and long holds. "Take your time
on demos" means slow, continuous motion, with the camera following the action. It never means a frozen frame.

Targets for our cuts: motion in at least 70% of frames, at least 2% of pixels moving in the median frame, and no hold
over 1 s except the end card. The template's energy check uses the looser 40% and 1% bar from design.how, so treat
passing it as the floor, not the goal.

## Transitions seen in modern product launch films

These are the ones to reach for:

- **Prompt-bar zoom.** A small UI bar appears, the camera snaps in until it fills the frame, then pans along with the
  typing caret.
- **Collage orbit, then implode into the logo.** Photos fly in and orbit a word. On the beat everything collapses to
  the centre, and the logo types on.
- **Colour-block swipe.** 1–3 brand-colour panels sweep across, and the layout swaps underneath them.
- **A highlight grows into the next scene.** The highlight behind a word scales up to fill the screen, then shrinks
  into an icon.
- **Button morphs into an icon, then zoom-through.** A click shrinks the button into an icon, rings expand, and the
  camera dives inside.
- **Persistent motif.** One element (a cursor, a dot, a line) survives every cut and leads the eye.
- **A line that continues across scenes.** A stroke keeps drawing from one scene into the next.
- **Overview to focus.** A grid of screens, and the camera zooms into one until it fills the frame.
- **Card morph chain.** One container changes shape: card, bar, pill, circle, icon.
- **Slot text.** Words and numbers roll vertically in place instead of fading.
- **Tilted UI with a light sweep.** A panel at 10–20° in 3D, with a glow travelling around its edge.
