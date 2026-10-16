import json,re,sys
r=json.load(open(sys.argv[1]))
norm=lambda s: re.sub(r"[^a-z0-9' ]","",s.lower()).split()
cues=sorted({k.split('_')[0][1:] for k in r}, key=float)
for c in cues:
    print(f"=== cue t={c}")
    for k in range(3):
        m=r.get(f"c{c}_w{k}_mix",{}).get('text','').strip(); t=r.get(f"c{c}_w{k}_ctl",{}).get('text','').strip()
        if norm(m)==norm(t): print(f"  w{k} SAME: {m}")
        else: print(f"  w{k} DIFF\n     mix: {m}\n     ctl: {t}")
