#!/usr/bin/env python3
"""Mix music + SFX for a film from its cue list. Measured, never claimed.
usage: python3 scripts/mix.py out/<film>/cues.json out/<film>/mix.wav [--music public/music/upbeat_128bpm.mp3]
       [--bpm 127.99 --phase 0.030] [--bars "5,6,7,8-22x3,21-30" --tail 31]
cues.json = {"dur": seconds, "cues": [{"t": s, "type": "whoosh|swish|click|pop|tick|type|shimmer|swell|sub", "v": 0..1}]}
Without --bars the track plays straight from bar 0. --tail N places source bar N..end after the last listed bar
(put the track's final hit there)."""
import json, sys, argparse, subprocess, numpy as np, soundfile as sf, librosa, os
from collections import Counter
ap=argparse.ArgumentParser(); ap.add_argument('cues'); ap.add_argument('out')
ap.add_argument('--music',default='public/music/upbeat_128bpm.mp3'); ap.add_argument('--bpm',type=float,default=127.99)
ap.add_argument('--phase',type=float,default=0.030); ap.add_argument('--bars',default=''); ap.add_argument('--tail',type=int,default=-1)
ap.add_argument('--sfx',default='public/sfx'); ap.add_argument('--music_db',type=float,default=-9.0)
a=ap.parse_args(); SR=48000
cfg=json.load(open(a.cues)); DUR=cfg['dur']; N=int((DUR+1)*SR)
def load(p,norm=True):
    y,_=librosa.load(p,sr=SR,mono=False); y=np.stack([y,y]) if y.ndim==1 else y
    return y/(np.abs(y).max()+1e-9)*0.9 if norm else y
db=lambda x:10**(x/20)
def place(buf,clip,t,g=1.0):
    s=int(round(t*SR))
    if s<0: clip=clip[:,-s:]; s=0
    e=min(N,s+clip.shape[1])
    if e>s: buf[:,s:e]+=clip[:,:e-s]*g
mus=load(a.music,False); BAR=4*60/a.bpm; XF=int(0.012*SR); r=np.linspace(0,1,XF); music=np.zeros((2,N))
if a.bars:
    seq=[]
    for part in a.bars.split(','):
        rep=1
        if 'x' in part: part,rep=part.split('x'); rep=int(rep)
        if '-' in part: lo,hi=map(int,part.split('-')); seq+=list(range(lo,hi+1))*rep
        else: seq+=[int(part)]*rep
    for n,m in enumerate(seq):
        s=int((a.phase+m*BAR)*SR); c=mus[:,s:s+int(BAR*SR)+XF].copy()
        if c.shape[1]<XF*2: continue
        c[:,:XF]*=r; c[:,-XF:]*=r[::-1]; place(music,c,n*BAR-XF/SR/2)
    if a.tail>=0:
        s=int((a.phase+a.tail*BAR)*SR); t=mus[:,s:].copy(); t[:,:XF]*=r; place(music,t,len(seq)*BAR-XF/SR/2)
    hit=len(seq)*BAR if a.tail>=0 else None
    print('music bars',len(seq),'final hit at',round(len(seq)*BAR,3),'s')
    if len(seq)*BAR>DUR: print(f'WARNING: the music runs {len(seq)*BAR-DUR:.1f} s past the film ({DUR:.1f} s): drop bars so the final hit lands on the end card')
else: place(music,mus,0)
FX={}
for k in ['whoosh','swish','click','pop','tick','shimmer','swell','sub']:
    for ext in ('mp3','wav'):
        p=f'{a.sfx}/{k}.{ext}'
        if os.path.exists(p): FX[k]=load(p); break
rng=np.random.default_rng(7)
def synth_noise(n,lo,hi):
    x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X[(f<lo)|(f>hi)]=0; return np.fft.irfft(X,n)
if 'whoosh' not in FX:
    n=int(.6*SR); seg=np.zeros(n)
    for i in range(12):
        a0,a1=i*n//12,(i+1)*n//12; c=600+3400*np.sin(np.pi*(i+.5)/12); seg[a0:a1]=synth_noise(a1-a0,c*.6,c*1.4)
    seg*=np.sin(np.linspace(0,np.pi,n))**2; seg/=np.abs(seg).max()/.9; FX['whoosh']=np.stack([seg,seg])
if 'swish' not in FX: w=FX['whoosh'][:,::2]; FX['swish']=w/np.abs(w).max()*.9
if 'click' not in FX:
    n=int(.02*SR); c=synth_noise(n,2000,9000)*np.exp(-np.linspace(0,12,n)); c/=np.abs(c).max()/.9; FX['click']=np.stack([c,c])
for k,src in [('pop','click'),('tick','click')]:
    FX.setdefault(k,FX[src])
if 'sub' not in FX:
    n=int(1.2*SR); t=np.arange(n)/SR; f=50-15*t/1.2; s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3); s/=np.abs(s).max()/.9; FX['sub']=np.stack([s,s])
FX.setdefault('shimmer',FX['swish']); FX.setdefault('swell',FX['whoosh'])
n=int(.035*SR); key=synth_noise(n,1500,6000)*np.exp(-np.linspace(0,9,n)); key/=np.abs(key).max()/.9; FX['type']=np.stack([key,key])
BASE={'whoosh':-2,'swish':-4,'click':4,'pop':-1,'tick':-3,'type':-5,'shimmer':-8,'swell':-8,'sub':-3}
LEAD={'whoosh':0.18,'swish':0.08}
sfx=np.zeros((2,N)); duck=np.ones(N); used=[]
for c in sorted(cfg['cues'],key=lambda c:c['t']):
    t,ty=c['t'],c['type']
    if ty in('swish','whoosh') and any(o['type'] in('swish','whoosh') and 0<t-o['t']<0.3 for o in used): continue
    if ty in('pop','tick','click') and any(o['type'] in('pop','tick','click') and abs(o['t']-t)<0.1 for o in used): continue
    if ty=='swell' and any(o['type']=='swell' and 0<t-o['t']<1.5 for o in used): continue
    place(sfx,FX[ty],t-LEAD.get(ty,0),db(BASE[ty])*c.get('v',1)); used.append(c)
    if ty in('whoosh','swish','sub'):
        a0=max(0,int((t-.15)*SR)); b0=min(N,int((t+.45)*SR)); d=.7 if ty=='swish' else .55; k=int(.08*SR)
        w=np.full(b0-a0,d); w[:k]=np.linspace(1,d,k)[:len(w[:k])]; w[-k:]=np.linspace(d,1,k)[-len(w[-k:]):]; duck[a0:b0]=np.minimum(duck[a0:b0],w)
m=music*db(a.music_db)*duck; mix=m+sfx
fade=np.ones(N); f0=int((DUR-.4)*SR); fade[f0:]=np.linspace(1,0,N-f0)**2; mix*=fade
raw=a.out.replace('.wav','_raw.wav'); sf.write(raw,mix[:,:int(DUR*SR)].T,SR)
subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af','loudnorm=I=-14:TP=-1:LRA=11','-ar',str(SR),a.out],check=True)
print('sfx placed',dict(Counter(c['type'] for c in used)))
def wr(x,a0,b0): return np.sqrt(np.mean(x[:,a0:b0]**2))+1e-9
print('SFX over music at each sound\'s peak (median dB) — whoosh >=12, swish/click >=6, pop/tick >=2:')
for ty in ['whoosh','swish','click','pop','tick','type','shimmer']:
    L=FX[ty].shape[1]; v=[]
    for c in [c for c in used if c['type']==ty]:
        s0=max(0,int((c['t']-LEAD.get(ty,0))*SR)); seg=sfx[0,s0:s0+L]
        if len(seg)<2400: continue
        e=np.convolve(seg**2,np.ones(2400)/2400,'same'); p=int(e.argmax()); a0=s0+max(0,p-1200)
        v.append(20*np.log10(wr(sfx,a0,a0+2400)/wr(m,a0,a0+2400)))
    if v: print(f'  {ty:8s} {np.median(v):+.1f} dB  (n={len(v)})')
