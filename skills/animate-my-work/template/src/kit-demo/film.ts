import type {FilmSpec} from '../kit/film-core.ts';

// A smoke test for the film engine, built the way a real film is: layers exported from "Figma" (here, made by a
// script), then motion as data. Every transition in the kit appears once. Not a film to copy.
export const film: FilmSpec = {
  id: 'kit-demo', fps: 60, bpm: 128, w: 1920, h: 1080, folder: 'kit-demo',
  order: [[1, 8], [2, 6], [3, 14], [4, 10], [5, 6], [6, 8]],
  anims: [
    // 1 hook: cards fly in from the edges, headline sweeps on
    {fx: 'fly', s: 1, l: 3, at: 0.5, dx: -300, dy: -200, sfx: 'pop'}, {fx: 'fly', s: 1, l: 4, at: 0.9, dx: 300, dy: -200},
    {fx: 'fly', s: 1, l: 5, at: 1.3, dx: -300, dy: 200, sfx: 'pop'}, {fx: 'fly', s: 1, l: 6, at: 1.7, dx: 300, dy: 200},
    {fx: 'rev', s: 1, l: 1, at: 3}, {fx: 'rev', s: 1, l: 2, at: 4},
    {fx: 'float', s: 1, l: 3, amp: 10}, {fx: 'float', s: 1, l: 6, amp: 10},
    // 2 step card
    {fx: 'rise', s: 2, l: 1, at: -0.5, dy: 90, blur: 10}, {fx: 'rev', s: 2, l: 2, at: 0.5}, {fx: 'rev', s: 2, l: 3, at: 1}, {fx: 'chip', s: 2, l: 4, at: 2},
    // 3 editor: box drawn on the sun, prompt types, Generate, render sweep
    {fx: 'draw', s: 3, l: 4, at: 2.5, d: 0.85}, {fx: 'chip', s: 3, l: 5, at: 4.3, sfx: null},
    {fx: 'caret', s: 3, l: 7, at: 0, until: 5.5}, {fx: 'type', s: 3, l: 7, at: 5.5, d: 2.2},
    {fx: 'shimmer', s: 3, l: 2, at: 12.6, d: 1}, {fx: 'hide', s: 3, l: 4, at: 13.2}, {fx: 'hide', s: 3, l: 5, at: 13.2},
    // 4 result: the edit wipes in, divider leaves, the change is pointed out
    {fx: 'wipe', s: 4, l: 9, div: 10, hnd: 11, at: 0.4, d: 1.6, offAt: 5}, {fx: 'chip', s: 4, l: 12, at: 7.5},
    // 5 recap
    {fx: 'rise', s: 5, l: 1, at: -0.3, dy: 80, sfx: 'tick'}, {fx: 'rise', s: 5, l: 2, at: 0.7, dy: 80, sfx: 'tick'}, {fx: 'rise', s: 5, l: 3, at: 1.7, dy: 80, sfx: 'tick'},
    // 6 end
    {fx: 'blurIn', s: 6, l: 1, at: -0.05, scale: 1.2, blur: 12, d: 0.9},
  ],
  cursors: [{s: 3, path: [[1.2, 1500, 900], [2.4, 1010, 300], [3.4, 1170, 470], [10.5, 1180, 820], [11.8, 1400, 868]], clicks: [{at: 12.3, l: 8}], out: 13.5}],
  camera: [
    {s: 1, keys: [[0, 1.0, 960, 540], [7.5, 1.12, 960, 560]]},
    {s: 2, keys: [[0, 1.0, 960, 540], [6, 1.1, 700, 520]]},
    // push in on the box as it's drawn, follow the cursor down to the prompt, pull back for the render
    {s: 3, keys: [[0, 1.0, 960, 540], [2, 1.45, 1110, 400], [4.6, 1.45, 1110, 400], [6, 1.35, 900, 860], [10.5, 1.35, 1000, 860], [12, 1.1, 1100, 700], [14, 1.0, 960, 540]]},
    {s: 4, keys: [[0, 1.0, 960, 540], [2.2, 1.18, 860, 480], [6, 1.25, 1060, 470], [10, 1.05, 960, 540]]},
    {s: 5, keys: [[0, 1.0, 960, 540], [3, 1.12, 700, 540], [6, 1.2, 1250, 540]]},
    {s: 6, keys: [[0, 1.3, 960, 540], [8, 1.0, 960, 540]]},
  ],
  cuts: [
    {to: 2, fx: 'zoomThrough', x: 1310, y: 800},
    {to: 3, fx: 'push', shared: [{from: [2, 4], to: [3, 3]}]},
    {to: 4, fx: 'matchCut'},
    {to: 5, fx: 'colourSwipe'},
    {to: 6, fx: 'implode'},
  ],
  sfx: [[6, 6, 'sub', 0.8]],
};
