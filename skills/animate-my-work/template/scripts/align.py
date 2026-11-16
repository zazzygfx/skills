#!/usr/bin/env python3
"""Register an AFTER image onto its BEFORE (so a before/after wipe changes only what was edited), and report
the boxes of what actually changed (so highlights sit on the right object).
usage: python3 scripts/align.py before.png after.png out_after_aligned.png [--offset X Y]
--offset adds the canvas position so boxes print in frame coordinates."""
import cv2, numpy as np, sys
b=cv2.imread(sys.argv[1]); a=cv2.imread(sys.argv[2]); out=sys.argv[3]
ox,oy=(int(sys.argv[5]),int(sys.argv[6])) if '--offset' in sys.argv else (0,0)
g=lambda im: cv2.equalizeHist(cv2.cvtColor(im,cv2.COLOR_BGR2GRAY))
orb=cv2.ORB_create(6000); kb,db_=orb.detectAndCompute(g(b),None); ka,da=orb.detectAndCompute(g(a),None)
m=sorted(cv2.BFMatcher(cv2.NORM_HAMMING,crossCheck=True).match(da,db_),key=lambda x:x.distance)[:800]
src=np.float32([ka[x.queryIdx].pt for x in m]); dst=np.float32([kb[x.trainIdx].pt for x in m])
M,inl=cv2.estimateAffinePartial2D(src,dst,ransacReprojThreshold=3,maxIters=5000)
w=cv2.warpAffine(a,M,(b.shape[1],b.shape[0]),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT); cv2.imwrite(out,w)
print('scale %.4f  shift %.1f,%.1f  inliers %d/%d'%(np.hypot(M[0,0],M[0,1]),M[0,2],M[1,2],int(inl.sum()),len(m)))
d=np.abs(cv2.GaussianBlur(b,(9,9),0).astype(np.int16)-cv2.GaussianBlur(w,(9,9),0).astype(np.int16)).max(2)
mk=((d>60)*255).astype(np.uint8); mk=cv2.morphologyEx(mk,cv2.MORPH_OPEN,np.ones((7,7),np.uint8)); mk=cv2.dilate(mk,np.ones((25,25),np.uint8))
n,_,st,_=cv2.connectedComponentsWithStats(mk)
print('changed regions (x,y,w,h):',[(int(x)+ox,int(y)+oy,int(ww),int(hh)) for x,y,ww,hh,ar in sorted(st[1:],key=lambda s:-s[4]) if ar>3000][:8])
cv2.imwrite(out.replace('.png','_check.jpg'),np.hstack([np.where(np.arange(b.shape[1])[None,:,None]<b.shape[1]//2,b,w),cv2.addWeighted(b,.5,w,.5,0)]))
