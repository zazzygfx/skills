// The film engine's pure half: timing, transitions, in-scene motion and cues, all as functions of time.
// No React here, so Node can import it (npm run cues) and Remotion can render it (film.tsx). One spec drives both,
// so every sound is attached to the motion that caused it.

export type Layer = {f: number; i: number; x: number; y: number; w: number; h: number; src: string; z?: number; radius?: number};
/** x, y, w, h, 'r,g,b', opacity, blur — a Figma blurred ellipse, drawn as a radial gradient. */
export type Glow = [number, number, number, number, string, number, number];
export type Rect = {x: number; y: number; w: number; h: number};
export type SfxType = 'whoosh' | 'swish' | 'click' | 'pop' | 'tick' | 'type' | 'shimmer' | 'swell' | 'sub';
export type Cue = {t: number; type: SfxType; v: number};

/** In-scene motion on one layer. `s` scene, `l` layer index, `at` in beats from the scene's start (may be negative). */
export type Anim =
  | {fx: 'blurIn' | 'rise' | 'fly'; s: number; l: number; at: number; d?: number; dx?: number; dy?: number; scale?: number; blur?: number; sfx?: SfxType; v?: number}
  | {fx: 'chip'; s: number; l: number; at: number; d?: number; sfx?: SfxType | null; v?: number}
  | {fx: 'fade' | 'hide'; s: number; l: number; at: number; d?: number}
  | {fx: 'rev'; s: number; l: number; at: number; d?: number}
  | {fx: 'type'; s: number; l: number; at: number; d: number}
  | {fx: 'draw'; s: number; l: number; at: number; d?: number}
  | {fx: 'press' | 'ring'; s: number; l: number; at: number}
  | {fx: 'pulse'; s: number; l: number; at: number; n?: number}
  | {fx: 'zoomOut'; s: number; l: number; at: number; d?: number; from?: number}
  | {fx: 'float'; s: number; l: number; amp?: number}
  | {fx: 'waves'; s: number; ls: number[]; at: number; until: number}
  | {fx: 'shimmer'; s: number; l: number; at: number; d?: number}
  | {fx: 'caret'; s: number; l: number; at: number; until: number}
  /** before/after: `l` is the full "before" layer laid over the canvas, `div`/`hnd` the divider and its handle. */
  | {fx: 'wipe'; s: number; l: number; div: number; hnd: number; at: number; d?: number; offAt?: number};

export type CursorTrack = {s: number; path: [number, number, number][]; clicks?: {at: number; l: number}[]; out?: number};
export type CutFx = 'zoomThrough' | 'push' | 'iris' | 'whip' | 'colourSwipe' | 'implode' | 'fadeThrough' | 'matchCut';
export type Shared = {from: [number, number]; to: [number, number]; d?: number; uniform?: boolean; delay?: number};
export type Cut = {to: number; fx: CutFx; x?: number; y?: number; dir?: 'left' | 'up'; colors?: [string, string]; sToScale?: number; shared?: Shared[]};

export type FilmSpec = {
  id: string; fps: number; bpm: number; w: number; h: number;
  /** public/<folder>/layers.json and glows.json, as exported from Figma. */
  folder: string;
  order: [number, number][];
  bg?: string | Record<number, string>;
  anims: Anim[];
  cursors?: CursorTrack[];
  cuts: Cut[];
  /** A layer index that persists across a run of scenes (a step rail, a nav): drawn once above them, crossfading. */
  chrome?: {l: number; from: number; to: number}[];
  /** Extra cues not tied to a motion: [scene, beat, type, volume]. */
  sfx?: [number, number, SfxType, number][];
  /** Camera moves inside a scene: keys of [beat, scale, focusX, focusY]. The focus point sits at the frame centre
   * at that scale; between keys the camera eases (and the slow drift keeps it from ever freezing). */
  camera?: {s: number; keys: [number, number, number, number][]}[];
  /** Frames to render as review stills, in [scene, beat]. Cut frames are added automatically. */
  stills?: [number, number][];
};

// ---------- easing ----------
const bz = (x1: number, y1: number, x2: number, y2: number) => (t: number) => {
  // Newton on the x(t) cubic, then y(t): enough precision for animation.
  let u = t;
  for (let k = 0; k < 6; k++) {
    const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
    const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
    if (Math.abs(dx) < 1e-6) break; u = Math.min(1, Math.max(0, u - x / dx));
  }
  return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
};
export const E = {
  out: bz(0.16, 1, 0.3, 1), in: bz(0.7, 0, 0.84, 0), io: bz(0.87, 0, 0.13, 1), p4io: bz(0.76, 0, 0.24, 1),
  p3o: bz(0.215, 0.61, 0.355, 1), p3i: bz(0.55, 0.055, 0.675, 0.19), p2io: bz(0.45, 0, 0.55, 1), p4o: bz(0.25, 1, 0.5, 1),
  lin: (t: number) => t,
  back: (t: number) => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  minJerk: (t: number) => t * t * t * (10 - 15 * t + 6 * t * t),
};
export const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (t: number, t0: number, d: number, ease = E.lin) => ease(c01((t - t0) / d));

// ---------- timing ----------
export type Timeline = {
  B: number; dur: number; frames: number;
  W: Record<number, {t0: number; t1: number; vin: number; vout: number; idx: number}>;
  at: (s: number, beat: number) => number;
  cutT: (c: Cut) => number; from: (c: Cut) => number;
  groups: Record<number, [number, number]>;
};
export function timeline(spec: FilmSpec): Timeline {
  const B = 60 / spec.bpm; const W: Timeline['W'] = {}; let t = 0;
  spec.order.forEach(([s, beats], idx) => { W[s] = {t0: t, t1: t + beats * B, vin: t, vout: t + beats * B, idx}; t += beats * B; });
  const dur = t; const frames = Math.round(dur * spec.fps);
  const from = (c: Cut) => spec.order[W[c.to].idx - 1][0];
  const cutT = (c: Cut) => W[c.to].t0;
  // visibility windows from each transition's reach
  for (const c of spec.cuts) {
    const T = cutT(c), a = from(c), [aOut, bIn] = reach(c.fx);
    W[a].vout = Math.max(W[a].vout, T + aOut); W[c.to].vin = Math.min(W[c.to].vin, T - bIn);
  }
  // match-cut chains share one camera drift
  const groups: Timeline['groups'] = {}; let start = spec.order[0][0];
  spec.order.forEach(([s], idx) => {
    const next = spec.order[idx + 1]?.[0]; const mc = next !== undefined && spec.cuts.some(c => c.to === next && c.fx === 'matchCut');
    if (!mc) { for (let k = W[start].idx; k <= idx; k++) groups[spec.order[k][0]] = [W[start].vin, W[s].vout]; if (next !== undefined) start = next; }
  });
  return {B, dur, frames, W, at: (s, beat) => W[s].t0 + beat * B, cutT, from, groups};
}
/** How far each transition reaches past the cut: [A stays visible after T, B appears before T]. */
function reach(fx: CutFx): [number, number] {
  switch (fx) {
    case 'zoomThrough': return [0.03, 0.03];
    case 'push': return [0.36, 0.36];
    case 'iris': return [0.4, 0.26];
    case 'whip': return [0.0, 0.0];
    case 'colourSwipe': return [0.0, 0.0];
    case 'implode': return [0.0, 0.0];
    case 'fadeThrough': return [0.0, 0.06];
    case 'matchCut': return [0.0, 0.0];
  }
}

// ---------- scene-level style ----------
export type SceneStyle = {visible: boolean; x: number; y: number; scale: number; rot: number; skew: number; blur: number; opacity: number; clip?: string; origin?: string; z: number; cam: number; bgK: number; camT: string};
export function sceneStyle(spec: FilmSpec, tl: Timeline, s: number, t: number): SceneStyle {
  const w = tl.W[s]; const st: SceneStyle = {visible: t >= w.vin && t <= w.vout, x: 0, y: 0, scale: 1, rot: 0, skew: 0, blur: 0, opacity: 1, z: 10 + w.idx, cam: 1, bgK: 0, camT: ''};
  const g = tl.groups[s]; const k = c01((t - g[0]) / (g[1] - g[0]));
  st.cam = 1 + 0.06 * k; st.bgK = c01((t - w.vin) / (w.vout - w.vin));
  const W0 = spec.w / 2, H0 = spec.h / 2; let cs = 1, fx = W0, fy = H0;
  const cam = spec.camera?.find(c => c.s === s);
  if (cam && cam.keys.length) {
    const ks = cam.keys.map(([b, sc, x, y]) => ({t: tl.at(s, b), sc, x, y}));
    let p = ks[0]; cs = p.sc; fx = p.x; fy = p.y;
    for (let i = 1; i < ks.length; i++) { const q = ks[i]; if (t >= q.t) { p = q; cs = q.sc; fx = q.x; fy = q.y; continue; }
      if (t > p.t) { const u = E.p2io(c01((t - p.t) / (q.t - p.t))); cs = p.sc + (q.sc - p.sc) * u; fx = p.x + (q.x - p.x) * u; fy = p.y + (q.y - p.y) * u; } break; }
  }
  const S = cs * st.cam;
  st.camT = `translate(${W0}px,${H0}px) scale(${S}) translate(${-fx}px,${-fy}px)`;
  const W_ = spec.w, H_ = spec.h;
  for (const c of spec.cuts) {
    const T = tl.cutT(c); const isA = tl.from(c) === s, isB = c.to === s; if (!isA && !isB) continue;
    switch (c.fx) {
      case 'zoomThrough': {
        const S = c.sToScale ?? 8, d = 0.55;
        if (isA) { const q = prog(t, T - d, d, (u: number) => u * u); st.scale *= Math.pow(S, q); st.origin = `${c.x ?? W_ / 2}px ${c.y ?? H_ / 2}px`;
          const f = prog(t, T - d * 0.45, d * 0.45); st.blur += 14 * f; st.opacity *= 1 - f; }
        if (isB) { const q = prog(t, T, 0.7, E.out); st.scale *= 1.4 + (1 - 1.4) * q; st.blur += 16 * (1 - q); st.origin ??= `${c.x ?? W_ / 2}px ${c.y ?? H_ / 2}px`; }
        break; }
      case 'push': {
        const q = prog(t, T - 0.35, 0.7, E.io), bl = 12 * Math.sin(Math.PI * q), up = c.dir === 'up';
        if (isA) { if (up) st.y -= H_ * q; else st.x -= W_ * q; st.blur += bl; }
        if (isB) { if (up) st.y += H_ * (1 - q); else st.x += W_ * (1 - q); st.blur += bl; }
        break; }
      case 'iris': {
        const q = prog(t, T - 0.24, 0.62, E.p3i);
        if (isB) { st.clip = `circle(${Math.max(0.5, 2300 * q)}px at ${c.x ?? W_ / 2}px ${c.y ?? H_ / 2}px)`; st.z = 100; }
        if (isA) { st.scale *= 1 - 0.08 * q; st.blur += 6 * q; }
        break; }
      case 'whip': {
        if (isA) { const q = prog(t, T - 0.22, 0.22, E.in); st.x -= 1400 * q; st.skew -= 8 * q; st.blur += 28 * q; }
        if (isB) { const q = prog(t, T, 0.45, E.out); st.x += 1400 * (1 - q); st.skew += 6 * (1 - q); st.blur += 24 * (1 - q); }
        break; }
      case 'implode': {
        if (isA) { const q = prog(t, T - 0.5, 0.5, E.in); st.scale *= 1 - 0.92 * q; st.rot += 8 * q; st.blur += 10 * q; }
        if (isB) { const q = prog(t, T, 0.7, E.out); st.scale *= 0.35 + 0.65 * q; st.blur += 12 * (1 - q); }
        break; }
      case 'fadeThrough': {
        if (isA) st.opacity *= 1 - prog(t, T - 0.25, 0.25);
        if (isB) { st.opacity *= prog(t, T - 0.05, 0.4); st.scale *= 0.94 + 0.06 * prog(t, T - 0.05, 0.5, E.out); }
        break; }
      case 'colourSwipe': case 'matchCut': break;
    }
  }
  return st;
}
/** Overlays a cut draws above every scene: colour panels and the white flash, 0..1 each. */
export function overlays(spec: FilmSpec, tl: Timeline, t: number) {
  const panels: {color: string; scaleY: number; origin: 'bottom' | 'top'}[] = []; let flash = 0;
  for (const c of spec.cuts) {
    const T = tl.cutT(c);
    if (c.fx === 'colourSwipe') (c.colors ?? ['#2E6CF6', '#8FB0FF']).forEach((col, k) => {
      const o = k * 0.05; const up = prog(t, T - 0.34 - o, 0.34, E.p3i), down = prog(t, T + o, 0.34, E.p4o);
      if (t < T + o) panels.push({color: col, scaleY: up, origin: 'bottom'}); else panels.push({color: col, scaleY: 1 - down, origin: 'top'});
    });
    if (c.fx === 'implode') flash = Math.max(flash, t < T ? prog(t, T - 0.08, 0.08) : 1 - prog(t, T, 0.3));
  }
  return {panels, flash};
}

// ---------- layer-level motion ----------
export type LayerStyle = {opacity: number; x: number; y: number; scale: number; scaleY: number; blur: number; clip?: string; mask?: string; maskSteps?: boolean};
const typeSteps = (w: number) => Math.max(10, Math.round(w / 13));
export function layerStyle(spec: FilmSpec, tl: Timeline, s: number, ly: Layer, t: number, pressed: number): LayerStyle {
  const st: LayerStyle = {opacity: 1, x: 0, y: 0, scale: 1 - 0.06 * pressed, scaleY: 1, blur: 0};
  for (const a of spec.anims) {
    if (a.s !== s) continue;
    if ('ls' in a) { if (!a.ls.includes(ly.i)) continue; } else if (a.l !== ly.i) continue;
    const t0 = 'at' in a ? tl.at(s, a.at) : tl.W[s].t0;
    switch (a.fx) {
      case 'blurIn': case 'rise': case 'fly': {
        const d = a.d ?? (a.fx === 'fly' ? 0.95 : 0.55); const q = prog(t, t0, d, E.out);
        const sc = a.scale ?? (a.fx === 'blurIn' ? 1.06 : a.fx === 'fly' ? 1.15 : 1);
        const dy = a.dy ?? (a.fx === 'rise' ? 60 : 0), dx = a.dx ?? 0, bl = a.blur ?? (a.fx === 'rise' ? 8 : a.fx === 'fly' ? 14 : 12);
        st.opacity *= prog(t, t0, d * 0.6); st.scale *= sc + (1 - sc) * q; st.blur += bl * (1 - q); st.x += dx * (1 - q); st.y += dy * (1 - q); break; }
      case 'chip': { const d = a.d ?? 0.38, q = prog(t, t0, d); st.opacity *= c01(q * 2.5); st.scale *= 0.7 + 0.3 * E.back(q); st.y += 8 * (1 - q); break; }
      case 'fade': st.opacity *= prog(t, t0, a.d ?? 0.25); break;
      case 'hide': st.opacity *= 1 - prog(t, t0, a.d ?? 0.25); break;
      case 'rev': { const p = prog(t, t0, a.d ?? 0.5, E.p3o); st.mask = `linear-gradient(90deg,#000 ${(p * 112 - 12).toFixed(3)}%,transparent ${(p * 112).toFixed(3)}%)`; st.x -= 18 * (1 - p); st.blur += 6 * (1 - p); break; }
      case 'type': { const n = typeSteps(ly.w), p = Math.floor(prog(t, t0, a.d) * n) / n; st.mask = `linear-gradient(90deg,#000 ${(p * 100).toFixed(3)}%,transparent ${(p * 100).toFixed(3)}%)`; break; }
      case 'draw': { const q = prog(t, t0, a.d ?? 0.8, E.p2io); st.clip = `inset(0% ${((1 - q) * 100).toFixed(3)}% ${((1 - q) * 100).toFixed(3)}% 0%)`; break; }
      case 'pulse': { const n = a.n ?? 4, d = n * tl.B; if (t > t0 && t < t0 + d) st.opacity *= 1 - 0.55 * Math.abs(Math.sin(Math.PI * (t - t0) / tl.B)); break; }
      case 'zoomOut': { const q = prog(t, t0, a.d ?? 1.2, E.p4o), f = a.from ?? 1.35; st.scale *= f + (1 - f) * q; st.blur += 6 * (1 - q); break; }
      case 'float': st.y += (a.amp ?? 12) * Math.sin((t - tl.W[s].t0) * 1.3 + ly.i); break;
      case 'waves': { if (t >= t0 && t <= tl.at(s, a.until)) { const p = Math.floor((t - t0) / (tl.B / 2)); st.scaleY *= 0.3 + 0.7 * Math.abs(Math.sin(ly.i * 1.7 + p * 2.3)); } break; }
      case 'wipe': break; // handled in wipeState
      default: break;
    }
  }
  return st;
}
/** Before/after state: clip percentage on the "before" layer and x offset of the divider and handle. */
export function wipeState(spec: FilmSpec, tl: Timeline, s: number, layers: Layer[], t: number) {
  const m: Record<number, {clipRight?: number; x?: number; opacity?: number}> = {};
  for (const a of spec.anims) {
    if (a.s !== s || a.fx !== 'wipe') continue;
    const b = layers.find(l => l.i === a.l)!, dv = layers.find(l => l.i === a.div)!, right = b.x + b.w, dc = dv.x + dv.w / 2;
    const ins = (right - dc) / b.w * 100, t0 = tl.at(s, a.at), d = a.d ?? 1.6, q = prog(t, t0, d, E.p4io);
    let clip = ins * q, x = (right - dc) * (1 - q), op = t >= t0 ? 1 : 0;
    if (a.offAt !== undefined) { const t1 = tl.at(s, a.offAt), r = prog(t, t1, 1.0, E.p4io); clip = clip + (100 - clip) * r; x = x + (b.x - dc - x) * r; op *= 1 - prog(t, t1 + 0.85, 0.15); }
    m[a.l] = {clipRight: clip}; m[a.div] = {x, opacity: op}; m[a.hnd] = {x, opacity: op};
  }
  return m;
}
export function pressAmount(spec: FilmSpec, tl: Timeline, s: number, l: number, t: number) {
  let p = 0;
  const hits: number[] = [];
  for (const a of spec.anims) if (a.s === s && a.fx === 'press' && a.l === l) hits.push(tl.at(s, a.at));
  for (const c of spec.cursors ?? []) if (c.s === s) for (const k of c.clicks ?? []) if (k.l === l) hits.push(tl.at(s, k.at));
  for (const h of hits) { const k = t - h; if (k > 0 && k < 0.24) p = Math.max(p, k < 0.08 ? k / 0.08 : 1 - (k - 0.08) / 0.16); }
  return p;
}
export function cursorAt(spec: FilmSpec, tl: Timeline, c: CursorTrack, t: number) {
  const pts = c.path.map(([b, x, y]) => ({t: tl.at(c.s, b), x, y}));
  if (t < pts[0].t - 0.001) return null;
  const out = c.out !== undefined ? tl.at(c.s, c.out) : tl.W[c.s].vout;
  const op = prog(t, pts[0].t, 0.2) * (1 - prog(t, out, 0.2));
  let p = pts[0];
  for (let k = 1; k < pts.length; k++) {
    const q = pts[k]; if (t >= q.t) { p = q; continue; }
    const u = E.minJerk(c01((t - p.t) / (q.t - p.t))); return {x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u, opacity: op};
  }
  return {x: p.x, y: p.y, opacity: op};
}

// ---------- cues: every sound comes from a motion ----------
export function cues(spec: FilmSpec, layersOf: (s: number) => Layer[]): {dur: number; cues: Cue[]} {
  const tl = timeline(spec); const out: Cue[] = []; const q = (t: number, type: SfxType, v = 1) => out.push({t: +t.toFixed(4), type, v});
  for (const c of spec.cuts) {
    const T = tl.cutT(c);
    if (c.fx === 'zoomThrough') q(T - 0.3, 'whoosh', 1);
    if (c.fx === 'push') q(T - 0.2, 'whoosh', 0.9);
    if (c.fx === 'iris') q(T - 0.3, 'whoosh', 0.8);
    if (c.fx === 'colourSwipe') q(T - 0.25, 'whoosh', 1);
    if (c.fx === 'whip') q(T - 0.12, 'swish', 1);
    if (c.fx === 'implode') { q(T - 1.45, 'swell', 0.8); q(T, 'sub', 1); }
    for (const sh of c.shared ?? []) q(T - (sh.d ?? 0.75) / 2 + (sh.delay ?? 0), 'swish', 0.7);
  }
  for (const a of spec.anims) {
    if (!('at' in a)) continue; const t0 = tl.at(a.s, a.at);
    if (a.fx === 'chip' && a.sfx !== null) q(t0 + 0.03, a.sfx ?? 'pop', a.v ?? 0.55);
    if ((a.fx === 'blurIn' || a.fx === 'rise' || a.fx === 'fly') && a.sfx) q(t0, a.sfx, a.v ?? 0.6);
    if (a.fx === 'draw') { q(t0, 'swish', 0.3); q(t0 + (a.d ?? 0.8), 'tick', 1); }
    if (a.fx === 'type') { const ly = layersOf(a.s).find(l => l.i === a.l); const n = typeSteps(ly?.w ?? 400); for (let k = 0; k < n; k++) q(t0 + (k + 0.5) * a.d / n, 'type', 0.55 + 0.25 * ((k * 7) % 3) / 2); }
    if (a.fx === 'wipe') { q(t0, 'swish', 0.7); q(t0 + 0.25, 'shimmer', 1); if (a.offAt !== undefined) q(tl.at(a.s, a.offAt), 'swish', 0.5); }
    if (a.fx === 'press') q(t0, 'click', 1);
  }
  for (const c of spec.cursors ?? []) for (const k of c.clicks ?? []) q(tl.at(c.s, k.at), 'click', 1);
  for (const [s, b, type, v] of spec.sfx ?? []) q(tl.at(s, b), type, v);
  return {dur: tl.dur, cues: out.sort((a, b) => a.t - b.t)};
}
/** Frames the jump check should skip: every cut and the frames its transition moves fast in. */
export function plannedFrames(spec: FilmSpec) {
  const tl = timeline(spec); const f: number[] = [];
  for (const c of spec.cuts) { const T = Math.round(tl.cutT(c) * spec.fps); for (let k = -24; k <= 24; k++) f.push(T + k); }
  return [...new Set(f)].filter(x => x > 0 && x < tl.frames).sort((a, b) => a - b);
}
