"""plan-to-make-millions: export the APPROVED chart state HTML (assets/charts/<id>.html, built by _build.py, cleared by
visual-qa) into a TEMPLATE + PER-STATE SLOTS module the Remotion comp animates LIVE (comp-build.md section 7: a real
useCurrentFrame component, never a PNG with a wipe).

Why this shape: _build.py computes every chart's geometry ONCE, so the state frames of one chart share one markup and
differ only in the draw-head clip width, the head dot, a few counters / labels, and which callouts are shown / lit /
dim. This script aligns the frames of each chart (or each run of a chart: C14 and C16 have a HOOK and a WALK run) token
by token and emits:
  tpl[]   the static markup between slots (pixel-identical to the approved stills)
  slots[] one per value that changes between states:
            num  a number inside a tag or a text node (interpolated by the comp between two states)
            str  a string that changes (snapped by the comp at its cue)
            vis  an element shown / hidden between states ('hide' class or opacity:0 in the stills): the comp fades it
                 in with the house 'opacity + 10 px rise, 8 frames' landing
  line    the polyline of the chart's clipped data line (the comp rides the head dot ON it)
The CHOREOGRAPHY (which second each state change lands on) lives in the comp (PlanToMakeMillionsCharts.tsx), straight
from each <id>.spec.md.

Run:  python assets/charts/_export_comp.py   ->  video-creation/remotion/src/PlanToMakeMillionsChartData.ts
"""
import difflib
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parents[4] / "remotion" / "src" / "PlanToMakeMillionsChartData.ts"
TOK = re.compile(r"<[^>]+>|[^<]+")
NUM = re.compile(r"(@@VIS@@|-?\d+(?:\.\d+)?)")
GROUPS = {  # chart id -> runs (frame-id prefix); a single run = the whole file
    "C14": ["C14-hook-", "C14-walk-"],
    "C16": ["C16-hook-", "C16-walk-"],
}


def frames(path):
    s = path.read_text(encoding="utf-8")
    body = s[s.rfind("</style>") + len("</style>"):]
    body = re.sub(r"<script[\s\S]*?</script>", "", body)
    starts = [m.start() for m in re.finditer(r'<div class="frame[^"]*" id="', body)]
    out = []
    for i, st in enumerate(starts):
        en = starts[i + 1] if i + 1 < len(starts) else body.find("</body>")
        chunk = body[st:en].strip()
        fid = re.match(r'<div class="frame[^"]*" id="([^"]+)"', chunk).group(1)
        out.append((fid, chunk))
    return out


def css_of(path):
    s = path.read_text(encoding="utf-8")
    return "\n".join(re.findall(r"<style>([\s\S]*?)</style>", s))


def vis_of(tag):
    cls = re.search(r'class="([^"]*)"', tag)
    if cls and "hide" in cls.group(1).split():
        return 0.0
    st = re.search(r'style="([^"]*)"', tag)
    if st:
        m = re.search(r"(?:^|;)\s*opacity\s*:\s*([\d.]+)", st.group(1))
        if m:
            return float(m.group(1))
    m = re.search(r'\sopacity="([\d.]+)"', tag)
    return None if not m else None   # presentation attribute opacity (e.g. a halo at .16) is never a show / hide


def strip_vis(tag):
    """Remove the show / hide marks and put ONE @@VIS@@ placeholder as the tag's first attribute (style="@@VIS@@<rest>"),
    the same position in every state, so a shown and a hidden copy of an element share one skeleton."""
    tag = re.sub(r'class="([^"]*)"', lambda m: 'class="' + " ".join(c for c in m.group(1).split() if c != "hide") + '"', tag)
    rest = ""
    m = re.search(r'\sstyle="([^"]*)"', tag)
    if m:
        rest = re.sub(r"(?:^|;)\s*opacity\s*:\s*[\d.]+\s*", ";", m.group(1)).strip(";")
        tag = tag[:m.start()] + tag[m.end():]
    return re.sub(r"^<([a-zA-Z0-9]+)", lambda mm: "<" + mm.group(1) + ' style="@@VIS@@' + (rest + ";" if rest else "") + '"', tag, count=1)


def decimals(s):
    return len(s.split(".")[1]) if "." in s else 0


def build(run_frames, chart):
    ids = [f for f, _ in run_frames]
    toks = [TOK.findall(c) for _, c in run_frames]
    # one clip-path id per clipPath per run (the stills name them per state): normalise BEFORE aligning
    for s, t in enumerate(toks):
        cids = []
        for x in t:
            cids += re.findall(r'<clipPath id="([^"]+)"', x)
        for k, cid in enumerate(cids):
            new = f"{chart}-clip{k}"
            toks[s] = [x.replace(f'id="{cid}"', f'id="{new}"').replace(f"url(#{cid})", f"url(#{new})") for x in toks[s]]
        toks[s] = [x.replace(f'id="{ids[s]}"', f'id="{chart}"') for x in toks[s]]
    m = max(range(len(toks)), key=lambda s: (len(toks[s]), s))
    master = toks[m]
    ops = [difflib.SequenceMatcher(None, toks[s], master, autojunk=False).get_opcodes() for s in range(len(toks))]
    spans = []
    for s in range(len(toks)):
        for tag, a1, a2, b1, b2 in ops[s]:
            if tag == "equal" or (tag == "replace" and a2 - a1 == b2 - b1):
                continue
            spans.append([b1, b2])
    spans.sort()
    blocks = []
    for b1, b2 in spans:
        if blocks and b1 <= blocks[-1][1]:
            blocks[-1][1] = max(blocks[-1][1], b2)
        else:
            blocks.append([b1, b2])

    def bound(s, B):
        """s-token boundary matching master boundary B (blocks always sit on a mappable boundary)."""
        for tag, a1, a2, b1, b2 in ops[s]:
            one = tag == "equal" or (tag == "replace" and a2 - a1 == b2 - b1)
            if one and b1 <= B <= b2:
                return a1 + (B - b1)
            if not one and B == b1:
                return a1
            if not one and B == b2:
                return a2
        raise SystemExit(f"{chart}: cannot map boundary {B} for state {ids[s]}")

    def tok_at(s, j):
        return toks[s][bound(s, j)]

    tpl, slots = [""], []

    def static(s):
        tpl[-1] += s

    def slot(sl):
        slots.append(sl)
        tpl.append("")

    def emit_block(B1, B2):
        vals = ["".join(toks[s][bound(s, B1):bound(s, B2)]) for s in range(len(toks))]
        if all(v == vals[0] for v in vals):
            static(vals[0])
        else:
            slot({"k": "str", "v": vals, "el": -1, "desc": "BLOCK " + re.sub(r"\s+", " ", vals[m][:80])})

    el = -1
    j = 0
    bi = 0
    while True:
        while bi < len(blocks) and blocks[bi][0] == j:   # merged blocks never touch, so at most one starts here
            emit_block(*blocks[bi])
            j = blocks[bi][1]
            bi += 1
        if j >= len(master):
            break
        col = [tok_at(s, j) for s in range(len(toks))]
        j += 1
        if col[0].startswith("<") and not col[0].startswith("</"):
            el += 1
        if all(c == col[0] for c in col):
            static(col[0])
            continue
        is_tag = col[0].startswith("<")
        vis = [vis_of(c) for c in col] if is_tag else [None] * len(col)
        has_vis = is_tag and len({1.0 if v is None else v for v in vis}) > 1
        if has_vis:
            col = [strip_vis(c) for c in col]
        parts = [NUM.split(c) for c in col]
        skel = [[p for j, p in enumerate(ps) if j % 2 == 0] for ps in parts]
        if all(len(p) == len(parts[0]) for p in parts) and all(s == skel[0] for s in skel):
            for q, piece in enumerate(parts[0]):
                if q % 2 == 0:
                    static(piece)
                    continue
                vals = [p[q] for p in parts]
                if piece == "@@VIS@@":
                    v = [1.0 if x is None else x for x in vis]
                    slot({"k": "vis", "v": v, "svg": not bool(re.match(r"<(div|span)\b", col[0])), "el": el,
                          "desc": re.sub(r"\s+", " ", col[0][:90])})
                elif all(v == vals[0] for v in vals):
                    static(vals[0])
                else:
                    slot({"k": "num", "v": [float(x) for x in vals], "d": max(decimals(x) for x in vals), "el": el,
                          "desc": re.sub(r"\s+", " ", (col[0][:70] if is_tag else col[0][:40])) + f" #{q // 2}"})
        else:
            if has_vis:
                a, b = zip(*[c.split("@@VIS@@", 1) for c in col])
                if len(set(a)) > 1:
                    slot({"k": "str", "v": list(a), "el": el, "desc": "A " + re.sub(r"\s+", " ", a[0][:80])})
                else:
                    static(a[0])
                slot({"k": "vis", "v": [1.0 if x is None else x for x in vis],
                      "svg": not bool(re.match(r"<(div|span)\b", col[0])), "el": el, "desc": re.sub(r"\s+", " ", col[0][:90])})
                if len(set(b)) > 1:
                    slot({"k": "str", "v": list(b), "el": el, "desc": "B " + re.sub(r"\s+", " ", b[0][:80])})
                else:
                    static(b[0])
            else:
                slot({"k": "str", "v": col, "el": el, "desc": re.sub(r"\s+", " ", col[0][:90])})
    # the data line the head dot rides: the first unfilled stroked path under the clip
    line = None
    for x in toks[-1]:
        if x.startswith("<path") and 'fill="none"' in x and "clip-path" in x:
            d = re.search(r'd="([^"]+)"', x).group(1)
            pts = [[float(a), float(b)] for a, b in re.findall(r"(-?[\d.]+),(-?[\d.]+)", d)]
            line = pts
            break
    return {"states": ids, "tpl": tpl, "slots": slots, "line": line}


def main():
    css = None
    data = {}
    for p in sorted(HERE.glob("*.html")):
        chart = p.stem
        c = css_of(p)
        if css is None:
            css = c
        elif c != css:
            raise SystemExit(f"{chart}: its stylesheet differs from the others; export it separately")
        fr = frames(p)
        runs = GROUPS.get(chart)
        if runs:
            for pre in runs:
                key = chart + "-" + pre.split("-")[-2]          # C14-hook, C14-walk
                data[key] = build([f for f in fr if f[0].startswith(pre)], key)
        else:
            data[chart] = build(fr, chart)
    lines = ["// PlanToMakeMillionsChartData.ts: GENERATED by media/plan-to-make-millions/assets/charts/_export_comp.py from the",
             "// approved chart HTML (_build.py stills, visual-qa PASS). NEVER hand-edit: re-run the exporter. Template + per-state slots;",
             "// the choreography (cue seconds) lives in PlanToMakeMillionsCharts.tsx.",
             "export type Slot = { k: 'num' | 'str' | 'vis'; v: (number | string)[]; d?: number; svg?: boolean; el: number; desc: string };",
             "export type ChartRun = { states: string[]; tpl: string[]; slots: Slot[]; line: number[][] | null };",
             "export const CHART_CSS: string = " + json.dumps(css) + ";",
             "export const CHART_RUNS: Record<string, ChartRun> = " + json.dumps(data, ensure_ascii=False) + ";", ""]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    for k, v in data.items():
        print(f"{k:12} states={v['states']} slots={len(v['slots'])} line={'yes' if v['line'] else 'no'}")
        for i, s in enumerate(v["slots"]):
            vals = s["v"] if s["k"] != "str" else [x[:28] for x in s["v"]]
            print(f"   {i:3} {s['k']:3} el{s['el']:<3} {str(vals)[:120]:120}  {s['desc'][:80]}")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
