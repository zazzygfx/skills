import {Film} from '../kit/film';
import {timeline, type Glow, type Layer} from '../kit/film-core';
import {film} from './film';
import glows from './glows.json';
import layers from './layers.json';

const Demo = () => <Film spec={film} layers={layers as Layer[]} glows={glows as unknown as Record<string, Glow[]>}/>;
export const KIT_DEMO = {id: film.id, component: Demo, durationInFrames: timeline(film).frames, fps: film.fps, width: film.w, height: film.h};
