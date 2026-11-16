import {Composition} from 'remotion';
import {EXAMPLE} from './example/video';
import {KIT_DEMO} from './kit-demo/video';

// Every video in the project. Add one line per video folder.
const VIDEOS = [EXAMPLE, KIT_DEMO];

export const Root = () => (
  <>
    {VIDEOS.map(v => <Composition key={v.id} {...v}/>)}
  </>
);
