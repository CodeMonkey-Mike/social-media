"""Generate dataMarketMeltdown.ts (3 ShortData for the market-meltdown batch) from the
tightened+desilenced clips' Whisper JSON. Captions: 2-4 word groups, lowercase, brand fixes +
color tags. Thumb/broll/sounds authored here. Mirrors _gen_uhoh_data.py (renders through
LivestreamShort). B-roll + clips live under assets/projects/market-meltdown/."""
import json, os, re, subprocess

SH  = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\market-meltdown"
OUT = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\remotion\src\dataMarketMeltdown.ts"
PFX = "projects/market-meltdown/"  # staticFile path prefix (assets/ is the public dir)

CLIPS = [
    {"const": "D_MM_1", "slug": "sold-my-excavator-for-kaspa", "asset": "mm-excavator.mp4",
     "thumb": {"title": "I SOLD MY\\nEXCAVATOR\\nFOR KASPA", "chip": "BOUGHT AT 11 CENTS", "chipColor": "#00e5ff", "titleSize": 92},
     "broll": [("broll-0b1a79b8-exc-kaspa-coin.png", 1.5, 6.5)],
     "sounds": [(1.5, "WHOOSH"), (1.5, "BOOM")]},
    {"const": "D_MM_2", "slug": "tao-10k-per-token", "asset": "mm-tao.mp4",
     "thumb": {"title": "TAO AT $10K\\nA TOKEN?", "chip": "AT THE AI CYCLE TOP", "chipColor": "#00e5ff", "titleSize": 108},
     "broll": [("broll-ce08bf0e-tao-rise.png", 1.5, 7.5), ("broll-2be15c59-tao-peak-10k.png", 11.0, 17.5)],
     "sounds": [(1.5, "WHOOSH"), (11.0, "WHOOSH"), (11.0, "BOOM")]},
    {"const": "D_MM_3", "slug": "saylor-forced-the-cascade", "asset": "mm-saylor.mp4",
     "thumb": {"title": "SAYLOR FORCED\\nTHE CASCADE", "chip": "THEN BOUGHT THE DIP", "chipColor": "#f7931a", "titleSize": 100},
     "broll": [("broll-3897000e-saylor-channel-break.png", 2.0, 12.0),
               ("broll-b0f43e0d-saylor-cascade-down.png", 22.0, 34.0),
               ("broll-dc448e52-saylor-buys-bottom.png", 46.0, 58.0)],
     "sounds": [(2.0, "WHOOSH"), (22.0, "WHOOSH"), (22.0, "BOOM"), (46.0, "WHOOSH")]},
]

FIXES = {"casper": "kaspa", "caspa": "kaspa", "kaspar": "kaspa", "kaspy": "kaspa", "kasper": "kaspa",
         "tau": "tao", "taos": "tao", "bittensor": "bittensor"}
TEAL_WORDS  = {"kaspa", "tao", "bittensor", "ton"}
RED_WORDS   = {"crash", "crashed", "down", "dump", "dumped", "sell", "selling", "cascade", "cascaded",
               "panic", "panicked", "bear", "red", "bottom", "drop", "dropped", "freaked"}
GREEN_WORDS = {"green", "up", "brilliant", "parabolic", "bought", "buys"}

def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
def is_short(w): return len(w.strip(".,!?'\"$")) <= 4
def clean(w): return w.lower().strip(".,!?'\"$")

def colorize(raw):
    c = clean(raw)
    fixed = FIXES.get(c, raw)
    fc = clean(fixed)
    if re.match(r"^\$?\d", fc) or re.match(r"^\d+x$", fc):
        return f"<y>{fixed}</y>"
    if fc in TEAL_WORDS:   return f"<g>{fixed}</g>"
    if fc in GREEN_WORDS:  return f"<gr>{fixed}</gr>"
    if fc in RED_WORDS:    return f"<r>{fixed}</r>"
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
        h = " ".join(colorize(w["word"]) for w in grp)
        parts = re.split(r"(<[^>]+>)", h)
        h = "".join(p if p.startswith("<") else p.lower() for p in parts)
        h = h.replace('"', '\\"')
        lines.append(f'    {{ t: {t:6.2f}, h: "{h}" }},')
    return "\n".join(lines)

def thumb_ts(th):
    return (f'{{ title: "{th["title"]}", chip: "{th["chip"]}", '
            f'chipColor: "{th["chipColor"]}", titleSize: {th["titleSize"]} }}')

def broll_ts(broll):
    return "[\n" + "\n".join(f'    {{ src: A("{PFX}{f}"), tIn: {a}, tOut: {b}, mode: "full" }},' for f, a, b in broll) + "\n  ]"

def sounds_ts(sounds):
    return "[" + ", ".join(f'{{ t: {t}, src: {s} }}' for t, s in sounds) + "]"

frames = {}
blocks = []
for i, c in enumerate(CLIPS, 1):
    d = dur(f"{SH}/{c['slug']}/tightened.mp4")
    frames[f"c{i}"] = round(d * 30)
    blocks.append(
        f"export const {c['const']}: ShortData = {{\n"
        f'  clip: A("{PFX}{c["asset"]}"), fps: FPS, durationS: {d:.2f}, capY: 560,\n'
        f"  thumb: {thumb_ts(c['thumb'])},\n"
        f"  captions: [\n{captions_for(c['slug'])}\n  ],\n"
        f"  broll: {broll_ts(c['broll'])},\n"
        f"  sounds: {sounds_ts(c['sounds'])},\n"
        f"}};\n"
    )

frames_ts = "export const FRAMES_MM = { " + ", ".join(f"{k}: {v}" for k, v in frames.items()) + " };\n"
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
print("FRAMES_MM:", frames)
