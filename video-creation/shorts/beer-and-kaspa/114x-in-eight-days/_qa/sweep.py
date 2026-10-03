import json,sys,copy
sys.path.insert(0,'114x-in-eight-days/_qa')
from sfxmix import events, mix, Q
ev=events()
idx={round(e[0],3):i for i,e in enumerate(ev)}
# variants: cue t -> list of (label, new_t, new_vol, new_dur or None=keep, delete)
V={
 0.0:[('v10',0.0,0.10,None),('t033',0.033,0.12,None),('del',None,None,None)],
 3.435:[('v12',3.435,0.12,None),('late',3.56,0.20,None),('early',3.25,0.20,None),('tight',3.435,0.20,'tight')],
 13.905:[('early',13.72,0.18,None),('v10',13.905,0.10,None),('tail03',13.905,0.18,0.30),('del',None,None,None)],
 19.65:[('v08',19.65,0.08,None),('early',19.35,0.14,None),('short',19.65,0.14,0.45),('del',None,None,None)],
}
CREST={0.0:0.198,3.435:3.60,13.905:14.04,19.65:19.80}
jobs=[]
meta={}
for t0,vars_ in V.items():
    i=idx[t0]
    for lab,nt,nv,nd in [('base',t0,ev[i][2],None)]+vars_:
        e2=copy.deepcopy(ev)
        if nt is None: del e2[i]
        else:
            e2[i][0]=nt; e2[i][2]=nv
            if nd=='tight': e2[i][1]='sfx/transition_rapid_whoosh-tight.wav'; e2[i][3]=0.45
            elif nd: e2[i][3]=nd
        out=f'{Q}/sw_{t0}_{lab}.m4a'; mix(e2,out)
        c=CREST[t0]
        for j,(a,b) in enumerate([(-2.0,2.0),(-1.4,2.6),(-2.6,1.4),(-1.7,1.9)]):
            s=max(0,c+a); en=c+b
            jobs.append({'id':f'{t0}|{lab}|{j}','audio':out,'model':'medium.en','clip':f'{s:.2f},{en:.2f}'})
            if lab=='base': jobs.append({'id':f'{t0}|ctrl|{j}','audio':Q+'/mix_ctrl.m4a','model':'medium.en','clip':f'{s:.2f},{en:.2f}'})
json.dump(jobs,open(Q+'/jobs_sweep.json','w')); print(len(jobs))
