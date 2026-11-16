# Storyboard

A motion film is many frames. The anchor frames (one per scene) say what each scene ends up as; the storyboard says
how it gets there and how it leaves. Animate from the storyboard, never from the anchors alone. That is what made
early versions feel like slides.

## What to draw

In the same Figma file, in one Section called `<film> — storyboard (<n> frames)`:

- **2–4 keyframes per scene:** the empty state, the element arriving, the action halfway, the result.
- **One designed transition frame per important cut:** the in-between. For example:
  - a button halfway to becoming the page;
  - the zoom filling the screen through a box;
  - cards flying into a tray;
  - a pill dropping into the mic;
  - everything collapsing into the logo;
  - colour panels mid-sweep;
  - two scenes side by side mid-push.

Expect 3–4 storyboard frames per anchor; 23 anchors became 83 frames.

## How to build it (Figma Plugin API)

- **Keyframes:** clone the anchor frame and change its children by index (the child index is the layer index used
  everywhere later). You can:
  - hide (`visible = false`);
  - fade (`opacity`);
  - move (`x`, `y`);
  - scale about the centre (`rescale`, then re-centre);
  - blur (a `LAYER_BLUR` effect);
  - truncate text, after loading its fonts.
- **Transition frames:**
  - mid-push: shift A's children by half a frame, then clone B's children in from the other side;
  - mid-wipe: put B's content in a clipping frame;
  - a flight: place a scaled clone partway along its path;
  - flashes and panels: plain rectangles and ellipses.
- **Captions:** a 40 px caption under every frame reading `sbNN · m:ss.s · <what happens>`. Keyframe captions are
  grey; transition captions are blue and start with `TRANSITION`. Compute the times from the beat plan, and update
  them if the plan changes.
- **Layout:** 8 frames per row, 2040 px apart horizontally and 1500 px vertically. Wrap it all in a Section placed
  clear of existing content.
- **Size of each call:** build about 20 frames per `use_figma` call. Return the ids, and screenshot the Section to
  check.

## Truth checks (before animating)

Two bugs that shipped once, and must never ship again:

1. **A before/after pair that isn't registered.** If the "after" image is a few pixels off, or cropped differently,
   the wipe shows the whole picture shifting. Run:
   `python3 scripts/align.py before.png after.png after_aligned.png --offset <canvasX> <canvasY>`
   It matches ORB features, fits a partial affine with RANSAC, and warps the *after* onto the *before*. Use the aligned
   image in the film, and look at the `_check.jpg` it writes (a half/half split plus a blend).
2. **A highlight on the wrong object.** The same command prints the boxes of what actually changed. Every region box,
   badge and cursor target must sit on one of them. If one doesn't, fix it in Figma first (the anchor and its
   storyboard copies), then re-export that layer. Boxing the green plush while the blue one changes is the example to
   remember.

For a global change (relighting, golden hour), the diff covers the whole canvas. That's expected; there's no box to
check.
