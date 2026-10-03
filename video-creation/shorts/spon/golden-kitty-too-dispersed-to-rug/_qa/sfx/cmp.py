import json,re,sys
res=json.load(open(sys.argv[1])); tag=sys.argv[2]
cs=json.load(open(sys.argv[3] if len(sys.argv)>3 else 'cues.json'))
norm=lambda s: re.sub(r"[^a-z0-9' ]","",s.lower().replace('-',' ')).split()
bad={}
for k in sorted(res):
    if not k.endswith(tag): continue
    base=k[:-len(tag)]
    c=res.get(base+'control')
    if not c: continue
    a,b=norm(res[k]['text']),norm(c['text'])
    if a!=b:
        ci=int(base[1:3])
        bad.setdefault(ci,[]).append(base)
        print(f"{base} t={cs[ci]['t']} {cs[ci]['src'].split('/')[-1]}\n   MIX: {res[k]['text']}\n   CTL: {c['text']}")
print('cues w/ diffs:',{k:len(v) for k,v in bad.items()})
