"""Generate dataWcg.ts (2 ShortData for the wife-changing-gains batch) from the silence-cut
clips' Whisper JSON. Captions: 2-4 word groups, lowercase, brand fixes + color tags. Thumb/
broll/sounds authored here. Renders through LivestreamShort (mirrors _gen_dilemma_data.py)."""
import json, subprocess, re

SH = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\wife-changing-gains"
OUT = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\remotion\src\dataWcg.ts"

CLIPS = [
    {"const": "D_WCG_1", "slug": "ai-coming-for-every-job", "asset": "wcg-aijobs.mp4",
     "thumb": {"title": "AI IS COMING FOR\\nEVERY JOB", "chip": "HERE'S THE HEDGE", "chipColor": "#00e5ff", "titleSize": 100},
     "broll": [("broll-wcg-robot-surgeon.png", 1.5, 12.0), ("broll-wcg-robot-delivery.png", 30.0, 38.0),
               ("broll-wcg-nobody-safe.png", 54.0, 66.0), ("broll-wcg-kaspa-hedge.png", 66.0, 79.0)],
     "sounds": [(1.5, "WHOOSH"), (1.5, "BOOM"), (30.0, "WHOOSH"), (54.0, "WHOOSH"), (66.0, "WHOOSH")]},
    {"const": "D_WCG_2", "slug": "nobody-is-safe-punch", "asset": "wcg-punch.mp4",
     "thumb": {"title": "A ROBOT JUST BEAT\\nYOUR SURGEON", "chip": "NOBODY IS SAFE", "chipColor": "#ff4444", "titleSize": 104},
     "broll": [("broll-wcg-punch-surgeon.png", 0.5, 5.5), ("broll-wcg-punch-looming-ai.png", 5.5, 10.2)],
     "sounds": [(0.5, "WHOOSH"), (0.5, "BOOM"), (5.5, "WHOOSH")]},
]

FIXES = {"casper": "kaspa", "caspa": "kaspa", "kaspar": "kaspa"}
RED = {"bad", "wrong", "nobody", "safe", "replaceable", "lose", "lost", "terrified", "no"}
GREEN = {"crypto", "kaspa"}
def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
def is_short(w): return len(w.strip(".,!?'\"")) <= 4

def colorize(raw):
    clean = raw.lower().strip(".,!?'\"")
    fixed = FIXES.get(clean, raw)
    fclean = fixed.lower().strip(".,!?'\"")
    if re.match(r"^\$?\d", fclean):
        return f"<y>{fixed}</y>"
    if fclean in GREEN:
        return f"<g>{fixed}</g>"
    if fclean in RED:
        return f"<r>{fixed}</r>"
    return fixed

def captions_for(slug):
    data = json.load(open(f"{SH}/{slug}/whisper.json", encoding="utf-8"))
    words = [{"word": w["word"].strip(), "start": w["start"], "end": w["end"]}
             for seg in data["segments"] for w in seg.get("words", [])]
    groups, cur, cs = [], [], None
    for i, w in enumerate(words):
        if not cur:
            cur, cs = [w], w["start"]; continue
        gap = w["start"] - words[i-1]["end"]
        all_short = all(is_short(x["word"]) for x in cur + [w])
        if gap > 0.18 or len(cur) >= (4 if all_short else 3):
            groups.append((cs, cur)); cur, cs = [w], w["start"]
        else:
            cur.append(w)
    if cur: groups.append((cs, cur))
    lines = []
    for t, grp in groups:
        h = " ".join(colorize(w["word"]) for w in grp).lower()
        lines.append(f'    {{ t: {t:6.2f}, h: "{h}" }},')
    return "\n".join(lines)

def thumb_ts(th):
    return (f'{{ title: "{th["title"]}", chip: "{th["chip"]}", '
            f'chipColor: "{th["chipColor"]}", titleSize: {th["titleSize"]} }}')

def broll_ts(broll):
    return "[\n" + "\n".join(f'    {{ src: A("{f}"), tIn: {a}, tOut: {b}, mode: "full" }},' for f, a, b in broll) + "\n  ]"

def sounds_ts(sounds):
    return "[" + ", ".join(f'{{ t: {t}, src: {s} }}' for t, s in sounds) + "]"

frames = {}
blocks = []
for i, c in enumerate(CLIPS, 1):
    import os
    d = dur(os.path.join(SH, c["slug"], "final.mp4"))
    frames[f"c{i}"] = round(d * 30)
    blocks.append(
        f"export const {c['const']}: ShortData = {{\n"
        f'  clip: A("{c["asset"]}"), fps: FPS, durationS: {d:.2f}, capY: 560,\n'
        f"  thumb: {thumb_ts(c['thumb'])},\n"
        f"  captions: [\n{captions_for(c['slug'])}\n  ],\n"
        f"  broll: {broll_ts(c['broll'])},\n"
        f"  sounds: {sounds_ts(c['sounds'])},\n"
        f"}};\n"
    )

frames_ts = "export const FRAMES_WCG = { " + ", ".join(f"{k}: {v}" for k, v in frames.items()) + " };\n"
header = (
    "import { staticFile } from 'remotion';\n"
    "import type { ShortData } from './LivestreamShort';\n\n"
    "const FPS = 30;\n"
    "const A = (f: string) => staticFile(f);\n"
    "const WHOOSH = A('sfx/Cinematic Whoosh 02.wav');\n"
    "const BOOM = A('sfx/Boom - Big Reveal.wav');\n\n"
)
open(OUT, "w", encoding="utf-8").write(header + "\n".join(blocks) + "\n" + frames_ts)
print(f"Wrote {OUT}")
print("FRAMES_WCG:", frames)
