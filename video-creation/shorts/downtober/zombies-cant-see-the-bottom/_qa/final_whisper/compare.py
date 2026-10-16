import json, re, difflib
r = json.load(open('_qa/final_whisper/res.json'))
def norm(s):
    return ' '.join(re.sub(r"[^a-z' ]", " ", s.lower().replace('-', ' ')).split())
cap = open('../../../remotion/src/captionsDowntoberZombiesBottom.ts', encoding='utf-8').read()
hs = re.findall(r"h: '(.*)' \},", cap)
captxt = norm(re.sub(r'<[^>]+>', '', ' '.join(h.replace("\'", "'") for h in hs)))
print('CAPTION:', captxt)
for src in ['whole_render', 'whole_control']:
    a = captxt.split(); b = norm(r[src]['text']).split()
    sm = difflib.SequenceMatcher(a=a, b=b)
    print(f'caption-vs-{src} word ratio {sm.ratio():.3f}')
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op != 'equal':
            print('   ', op, a[i1:i2], '->', b[j1:j2])
diffs = 0
for k in sorted(r):
    if not k.startswith('R_'):
        continue
    c = k[2:]; m = norm(r[k]['text']); ctl = norm(r['C_' + c]['text'])
    if m != ctl:
        diffs += 1
        print(f'DIFF {c}:\n   R: {m}\n   C: {ctl}')
print('window diffs:', diffs, '/ 30')
