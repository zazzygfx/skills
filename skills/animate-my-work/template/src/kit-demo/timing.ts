// What the template's render, jumps and energy scripts read. Derived from the film spec, never typed by hand.
import {plannedFrames, timeline} from '../kit/film-core.ts';
import {film} from './film.ts';
const tl = timeline(film);
export const FPS = film.fps;
export const FRAMES = tl.frames;
const f = (s: number, b: number) => Math.round(tl.at(s, b) * film.fps);
export const CUTS = film.cuts.map(c => Math.round(tl.cutT(c) * film.fps));
export const STEPS = plannedFrames(film);
export const STILLS = [f(1, 5), f(2, 3), f(3, 4), f(3, 9), f(4, 1.2), f(4, 8), f(5, 4), f(6, 5), ...CUTS.flatMap(c => [c - 11, c, c + 11])].sort((a, b) => a - b);
export const THUMBNAIL = f(4, 8);
