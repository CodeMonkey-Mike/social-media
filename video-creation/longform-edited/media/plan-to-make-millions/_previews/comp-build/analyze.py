import re, sys, glob, os, difflib
TAG = re.compile(r'<[^>]+>|[^<]+')
def frames(path):
    s = open(path, encoding='utf-8').read()
    body = s[s.rfind('</style>'):]
    starts = [m.start() for m in re.finditer(r'<div class="frame[^"]*" id="', body)]
    out = []
    for i, st in enumerate(starts):
        en = starts[i+1] if i+1 < len(starts) else body.find('</body>')
        chunk = body[st:en].strip()
        fid = re.match(r'<div class="frame[^"]*" id="([^"]+)"', chunk).group(1)
        out.append((fid, chunk))
    return out
for p in sys.argv[1:]:
    fr = frames(p)
    toks = [TAG.findall(c) for _, c in fr]
    names = [[re.match(r'</?\s*([a-zA-Z0-9]+)', t).group(1) if t.startswith('<') else '#t' for t in tk] for tk in toks]
    print('==', os.path.basename(p), [f for f, _ in fr], [len(t) for t in toks], 'same-structure' if all(n == names[0] for n in names) else 'DIFF-structure')
    for i in range(1, len(fr)):
        sm = difflib.SequenceMatcher(None, toks[i-1], toks[i], autojunk=False)
        for op, a1, a2, b1, b2 in sm.get_opcodes():
            if op == 'equal': continue
            A = ' | '.join(toks[i-1][a1:a2])[:260]; B = ' | '.join(toks[i][b1:b2])[:260]
            print(f'  {fr[i-1][0]}->{fr[i][0]} {op}: {A}  ==>  {B}')
