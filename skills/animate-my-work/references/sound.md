# Sound

Upbeat music plus sound effects, with no voiceover unless I ask. Nobody in the loop can listen, so every claim about
the sound is a measurement. Say "measured", never "sounds good".

## Music

In order of preference:

1. **My track, re-cut on bar lines.** `public/music/upbeat_128bpm.mp3` is 127.99 BPM, beat phase 0.030 s, with the
   drop at bar 8, breaks at bars 15 and 23, and the final hit at bar 31.
   - `mix.py --bars` lists source bars in film order (`5,6,7,8-22x3`); `--tail 31` puts the final hit after the last
     listed bar.
   - Choose bars so the **drop lands on the logo or first reveal**, a break lands on a calm scene, and the **final hit
     lands on the end card**: the number of listed bars equals the end card's start in bars.
   - mix.py warns if the music runs past the film.
2. **The code synth** (`npm run audio src/<film>` with `audio/cues.mjs`, from design.how). Free, and on the frame grid.
3. **Only if I ask:** new music. Measure its BPM and phase with librosa; never trust a prompt.

## The SFX palette (`public/sfx/`)

whoosh, swish, click, pop, tick, shimmer, swell and sub, plus `type`, a key click mix.py synthesises. If a file is
missing, mix.py synthesises a stand-in and the hand-off says so.

| Sound | Comes from |
|-|-|
| whoosh | zoomThrough, push, iris, colourSwipe (0.18 s lead) |
| swish | shared flights, whips, box draws, wipes (0.08 s lead) |
| click | cursor clicks, `press` |
| pop | chips; `blurIn`, `rise` or `fly` with `sfx: 'pop'` |
| tick | a box locking; recap items with `sfx: 'tick'` |
| type | one per typing step |
| shimmer | wipe reveals |
| swell | 1.45 s before an implode, or wherever `sfx` puts it |
| sub | the logo cuts (implode), or `sfx` |

Density rules, enforced by mix.py: no two whooshes or swishes within 0.3 s, no two pops, ticks or clicks within 0.1 s,
and no two swells within 1.5 s. Aim for 0.5–1.5 strong hits a second (the references measured 0.55–1.35).

## The mix (scripts/mix.py)

1. Normalise every SFX file to a 0.9 peak; raw files differ by 20 dB, which is how sound effects end up buried.
2. Music at −9 dB.
3. Duck the music to 0.55 around each whoosh or sub, and to 0.7 around each swish, from −0.15 to +0.45 s.
4. SFX gains: whoosh −2, swish −4, click +7, pop −1, tick −3, type −5, shimmer −8, swell −8, sub −3 dB.
5. Fade out over the last 0.4 s.
6. Run loudnorm to −14 LUFS integrated and −1 dBTP.

## The measurement (printed by mix.py)

At each sound's own peak, its 50 ms RMS over the music's:

| Sound | Target |
|-|-|
| whoosh | +12 dB or more |
| swish, click | +6 dB or more |
| pop, tick | +2 dB or more |

Below target means buried: raise that gain and mix again. Report these numbers in the hand-off. The kit demo measured
whoosh +20.9, swish +7.9, click +7.9, pop +10.1 and tick +9.2.
