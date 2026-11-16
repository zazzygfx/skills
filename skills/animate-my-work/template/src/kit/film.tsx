import {useMemo, type CSSProperties} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {c01, cursorAt, E, type FilmSpec, type Glow, type Layer, layerStyle, overlays, pressAmount, prog, sceneStyle, timeline, wipeState} from './film-core';

// The film engine's React half. A film is data (film.ts): Figma layers, in-scene anims, cuts, cursors. This draws
// any frame of it, so Remotion renders the whole film. Nothing here keeps state: every value comes from the frame.

type Props = {spec: FilmSpec; layers: Layer[]; glows: Record<string, Glow[]>};

const ARROW = 'M2 2 L2 27 L8.5 21 L13 31.5 L17.5 29.5 L13 19.5 L22 19.5 Z';
function Cursor({x, y, opacity, press}: {x: number; y: number; opacity: number; press: number}) {
  return (
    <svg width={32} height={42} viewBox="0 0 26 34" style={{position: 'absolute', left: x - 2, top: y - 2, opacity, transform: `scale(${1 - 0.1 * press})`, transformOrigin: '2px 2px', overflow: 'visible', zIndex: 50}}>
      <path d={ARROW} fill="#111" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round"/>
    </svg>
  );
}

const GlowDiv = ({g}: {g: Glow}) => {
  const [x, y, w, h, c, o, bl] = g; const p = bl * 0.7;
  return <div style={{position: 'absolute', left: x - p, top: y - p, width: w + 2 * p, height: h + 2 * p,
    background: `radial-gradient(closest-side, rgba(${c},${(o * 1.25).toFixed(3)}) 0%, rgba(${c},${(o * 0.75).toFixed(3)}) 45%, rgba(${c},0) 100%)`}}/>;
};

export function Film({spec, layers, glows}: Props) {
  const frame = useCurrentFrame(); const t = frame / spec.fps;
  const tl = useMemo(() => timeline(spec), [spec]);
  const byScene = useMemo(() => {
    const m: Record<number, Layer[]> = {};
    for (const l of layers) (m[l.f] ??= []).push(l);
    for (const k in m) m[k].sort((a, b) => (a.z ?? a.i) - (b.z ?? b.i));
    return m;
  }, [layers]);
  const find = (s: number, i: number) => byScene[s]?.find(l => l.i === i);
  const chromeOf = (s: number) => (spec.chrome ?? []).filter(c => tl.W[s].idx >= tl.W[c.from].idx && tl.W[s].idx <= tl.W[c.to].idx).map(c => c.l);
  const bg = (s: number) => typeof spec.bg === 'string' ? spec.bg : spec.bg?.[s] ?? 'linear-gradient(180deg,#FFFFFF 0%,#F4F6FD 55%,#DCE5FD 100%)';

  // shared elements: which layers are in flight, and the clone's box
  const flights: {src: Layer; box: CSSProperties}[] = []; const hiddenA = new Set<string>(); const handIn: Record<string, number> = {};
  for (const c of spec.cuts) for (const sh of c.shared ?? []) {
    const T = tl.cutT(c) + (sh.delay ?? 0), d = sh.d ?? 0.75, a = tl.from(c);
    const A = find(a, sh.from[1]), Bl = find(c.to, sh.to[1]); if (!A || !Bl) continue;
    const ka = `${a}_${A.i}`, kb = `${c.to}_${Bl.i}`;
    if (t >= T - d / 2) hiddenA.add(ka);
    const uni = sh.uniform ?? true;
    handIn[kb] = uni ? prog(t, T + d * 0.05, d * 0.45, E.out) : (t >= T + d / 2 - 0.05 ? 1 : 0);
    if (t < T - d / 2 || t > T + d / 2 + (uni ? d * 0.1 : 0.15)) continue;
    // where each layer actually sits on screen: through its scene's camera at the hand-off times
    const ca = sceneStyle(spec, tl, a, T - d / 2), cb = sceneStyle(spec, tl, c.to, T + d / 2);
    const tr = (l: Layer, c: {camS: number; camFx: number; camFy: number}) => ({x: spec.w / 2 + (l.x - c.camFx) * c.camS, y: spec.h / 2 + (l.y - c.camFy) * c.camS, w: l.w * c.camS, h: l.h * c.camS});
    const r = tr(A, ca), q = tr(Bl, cb), k = prog(t, T - d / 2, d, E.p4io);
    let left: number, top: number, sx: number, sy: number, op = 1;
    if (uni) { const s = Math.sqrt((q.w * q.h) / (r.w * r.h)); const cx = r.x + r.w / 2 + (q.x + q.w / 2 - r.x - r.w / 2) * k, cy = r.y + r.h / 2 + (q.y + q.h / 2 - r.y - r.h / 2) * k;
      sx = sy = 1 + (s - 1) * k; left = cx - (r.w * sx) / 2; top = cy - (r.h * sy) / 2; op = 1 - prog(t, T + d * 0.1, d * 0.4); }
    else { left = r.x + (q.x - r.x) * k; top = r.y + (q.y - r.y) * k; sx = 1 + (q.w / r.w - 1) * k; sy = 1 + (q.h / r.h - 1) * k; op = t > T + d / 2 ? 0 : 1; }
    flights.push({src: A, box: {position: 'absolute', left, top, width: r.w, height: r.h, borderRadius: A.radius ? A.radius * ca.camS : undefined, transform: `scale(${sx},${sy})`, transformOrigin: '0 0', opacity: op}});
  }
  const ov = overlays(spec, tl, t);

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      {spec.order.map(([s]) => {
        const st = sceneStyle(spec, tl, s, t); if (!st.visible) return null;
        const ls = byScene[s] ?? []; const wipe = wipeState(spec, tl, s, ls, t); const chrome = chromeOf(s);
        const sceneCss: CSSProperties = {position: 'absolute', inset: 0, overflow: 'hidden', zIndex: st.z, background: bg(s), opacity: st.opacity, clipPath: st.clip,
          transform: `translate(${st.x}px,${st.y}px) scale(${st.scale}) rotate(${st.rot}deg) skewX(${st.skew}deg)`, transformOrigin: st.origin ?? '50% 50%',
          filter: st.blur > 0.05 ? `blur(${st.blur}px)` : undefined};
        return (
          <div key={s} style={sceneCss}>
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${-30 * st.bgK}px) scale(${1 + 0.1 * st.bgK})`}}>
              {(glows[String(s)] ?? []).map((g, k) => <GlowDiv key={k} g={g}/>)}
            </div>
            <div style={{position: 'absolute', inset: 0, transform: st.camT, transformOrigin: '0 0'}}>
              {ls.map(ly => {
                if (chrome.includes(ly.i)) return null;
                const key = `${s}_${ly.i}`; const p = pressAmount(spec, tl, s, ly.i, t); const a = layerStyle(spec, tl, s, ly, t, p); const w = wipe[ly.i];
                let op = a.opacity * (w?.opacity ?? 1); if (hiddenA.has(key)) op = 0; if (key in handIn) op *= handIn[key];
                const clip = w?.clipRight !== undefined ? `inset(0% ${w.clipRight.toFixed(3)}% 0% 0%)` : a.clip;
                const css: CSSProperties = {position: 'absolute', left: ly.x, top: ly.y, width: ly.w, height: ly.h, opacity: op, borderRadius: ly.radius,
                  transform: `translate(${a.x + (w?.x ?? 0)}px,${a.y}px) scale(${a.scale},${a.scale * a.scaleY})`, transformOrigin: '50% 50%',
                  filter: a.blur > 0.05 ? `blur(${a.blur}px)` : undefined, clipPath: clip, WebkitMaskImage: a.mask, maskImage: a.mask};
                return <Img key={ly.i} src={staticFile(`${spec.folder}/layers/${ly.src}`)} style={css}/>;
              })}
              {spec.anims.filter(a => a.s === s && (a.fx === 'ring' || a.fx === 'shimmer' || a.fx === 'caret')).map((a, k) => {
                const ly = ls.find(l => 'l' in a && l.i === a.l); if (!ly || !('at' in a)) return null; const t0 = tl.at(s, a.at);
                if (a.fx === 'ring') { const q = prog(t, t0, 0.7, E.out); if (t < t0 || q >= 1) return null;
                  return <div key={k} style={{position: 'absolute', left: ly.x + 4, top: ly.y + 4, width: ly.w - 8, height: ly.h - 8, borderRadius: 999, border: '4px solid #2E6CF6', boxSizing: 'border-box', opacity: 0.85 * (1 - q), transform: `scale(${1 + 0.45 * q})`}}/>; }
                if (a.fx === 'shimmer') { const d = a.d ?? 1, q = prog(t, t0, d, E.p2io); if (t < t0 || t > t0 + d) return null;
                  return <div key={k} style={{position: 'absolute', left: ly.x + 4, top: ly.y + 4, width: ly.w - 8, height: ly.h - 8, borderRadius: 14, backgroundImage: 'linear-gradient(100deg,rgba(255,255,255,0) 35%,rgba(255,255,255,.7) 50%,rgba(255,255,255,0) 65%)', backgroundSize: '250% 100%', backgroundPosition: `${130 - 160 * q}% 0`}}/>; }
                if (a.fx === 'caret') { const on = t >= t0 && t < tl.at(s, a.until) && Math.floor((t - t0) / (tl.B / 2)) % 2 === 0; if (!on) return null;
                  return <div key={k} style={{position: 'absolute', left: ly.x + 4, top: ly.y + ly.h / 2 - 17, width: 3, height: 34, borderRadius: 2, background: '#2E6CF6'}}/>; }
                return null;
              })}
              {(spec.cursors ?? []).filter(c => c.s === s).flatMap((c, k) => {
                const els = []; const pos = cursorAt(spec, tl, c, t);
                for (const cl of c.clicks ?? []) { const ly = ls.find(l => l.i === cl.l); const t0 = tl.at(s, cl.at), q = prog(t, t0, 0.7, E.out);
                  if (ly && t >= t0 && q < 1) els.push(<div key={`r${k}${cl.at}`} style={{position: 'absolute', left: ly.x + 4, top: ly.y + 4, width: ly.w - 8, height: ly.h - 8, borderRadius: 999, border: '4px solid #2E6CF6', boxSizing: 'border-box', opacity: 0.85 * (1 - q), transform: `scale(${1 + 0.45 * q})`}}/>); }
                if (pos) { const press = Math.max(0, ...(c.clicks ?? []).map(cl => { const d = t - tl.at(s, cl.at); return d > 0 && d < 0.24 ? 1 - Math.abs(d - 0.08) / 0.16 : 0; }));
                  els.push(<Cursor key={`c${k}`} x={pos.x} y={pos.y} opacity={pos.opacity} press={press}/>); }
                return els;
              })}
            </div>
          </div>
        );
      })}
      {(spec.chrome ?? []).map((c, k) => {
        const i0 = tl.W[c.from].idx, i1 = tl.W[c.to].idx;
        return spec.order.slice(i0, i1 + 1).map(([s], j) => {
          const ly = find(s, c.l); if (!ly) return null; const w = tl.W[s];
          const fin = j === 0 ? prog(t, w.t0 - 0.25, 0.5, E.out) : prog(t, w.t0 - 0.1, 0.25);
          const fout = s === c.to ? prog(t, w.t1 - 0.3, 0.3, E.in) : prog(t, w.t1 + 0.1, 0.25);
          const op = c01(fin) * (1 - c01(fout)); if (op <= 0) return null;
          return <Img key={`${k}_${s}`} src={staticFile(`${spec.folder}/layers/${ly.src}`)} style={{position: 'absolute', left: ly.x, top: ly.y, width: ly.w, height: ly.h, opacity: op, zIndex: 500, transform: j === 0 ? `translateY(${-16 * (1 - c01(fin))}px)` : undefined}}/>;
        });
      })}
      {flights.map((fl, k) => <Img key={`f${k}`} src={staticFile(`${spec.folder}/layers/${fl.src.src}`)} style={{...fl.box, zIndex: 600}}/>)}
      {ov.panels.map((p, k) => <div key={`p${k}`} style={{position: 'absolute', inset: 0, background: p.color, transform: `scaleY(${p.scaleY})`, transformOrigin: p.origin, zIndex: 700 + k}}/>)}
      {ov.flash > 0 && <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: ov.flash, zIndex: 800}}/>}
    </AbsoluteFill>
  );
}
