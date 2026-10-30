import json,sys
def kept(m):
    cuts=sorted(m["cuts"]); k=[]; t=0.0
    for a,b in cuts:
        if a>t: k.append((t,a))
        t=max(t,b)
    if t<m["src_total"]: k.append((t,m["src_total"]))
    return k
def out2src(m,x):
    acc=0.0
    for a,b in kept(m):
        if x<=acc+(b-a): return a+(x-acc)
        acc+=b-a
def src2out(m,s):
    acc=0.0
    for a,b in kept(m):
        if a<=s<=b: return acc+(s-a)
        acc+=b-a
