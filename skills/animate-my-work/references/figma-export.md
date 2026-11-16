# Figma export

Every layer becomes its own positioned PNG, so the film looks exactly like the Figma frames. The child index in Figma
is the layer index `i` in `layers.json`, `film.ts` and the storyboard.

## Steps

1. **Export sheets.** For a group of frames, create a temporary frame named `TMP …` (no fill, `clipsContent` false,
   4096 wide). For each visible child of each frame:
   - `rb = node.absoluteRenderBounds` (it includes shadows and blur), `fb = frame.absoluteBoundingBox`;
   - clone the child into the sheet at a packed cell, where the cell is the size of `rb` plus 4 px of padding;
   - place the clone with `clone.x = cellX + PAD + (node.x - (rb.x - fb.x))` (and the same for y);
   - record `{f, i, name, sheet, px, py, w, h, x: rb.x - fb.x - PAD, y: rb.y - fb.y - PAD}`.
2. **Glows.** Skip blurred ellipses; their blur spills over the cells. Record `[x, y, w, h, 'r,g,b', opacity, blur]`
   per frame in `glows.json` instead. The renderer draws them as radial gradients with padding `p = blur*0.7`.
3. **Screenshots.** Screenshot each sheet at 1:1 with `get_screenshot`, `maxDimension` set to the sheet's longer edge
   and `contentsOnly` true. Crop each cell with PIL into `public/<film>/layers/fFF_II.png`.
4. **layers.json.** Write `src/<film>/layers.json`: `[{f, i, x, y, w, h, src, z?, radius?}]`.
   - `z` orders layers within a frame (the default is `i`). Use it to slot an extra layer, such as a full "before"
     image, between existing ones (`z: 6.5`).
   - `radius` rounds an image's corners.
5. **Hi-res layers.** Anything the camera zooms past 1.3×: clone it, `rescale(2.5)`, screenshot that, and keep its
   `w` and `h` at 1×. A screenshot never upscales.
6. **Extra images.** Images the export doesn't contain on its own get their own layer entries with an explicit `z`:
   a full before image, an aligned after image, or the canvas photo a dropped card turns into.
7. **Check.** Recompose 6–8 frames from the layers in PIL and compare them with Figma. If a recompose is blank, the
   clone's position wasn't set: screenshot the frame directly instead.
8. **Clean up.** Delete every `TMP` sheet and clone in Figma. Leave my file as you found it, plus the storyboard.

## A GIF of the frames for X

1. Clone the frames into one temporary grid frame, scaled to 1200 px wide.
2. Take a single screenshot of it and crop the frames out.
3. Delete the grid.
4. Run `scripts/gif.sh <dir> <out.gif> <seconds> <width>`. It builds a fresh palette per frame; a global palette
   wrecks the colours.

Keep it under 15 MB: hard cuts at 1200 px are about 6 MB for 23 frames, and crossfades about double that.
