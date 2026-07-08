"""Generate dataDilemma.ts (3 ShortData for the dilemma batch) from the silence-cut clips'
Whisper JSON. Captions: 2-4 word groups, lowercase, brand fixes + color tags. Thumb/broll/sounds
are authored here. Mirrors dataZombie.ts structure (renders through LivestreamShort)."""
import json, os, re, subprocess

SH = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\dilemma"
OUT = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\remotion\src\dataDilemma.ts"

CLIPS = [
    {"const": "D_DIL_1", "slug": "so-good-it-was-bad-punch", "asset": "dil-jobs.mp4",
     "thumb": {"title": "THE JOBS REPORT\\nTHAT BROKE\\nBITCOIN", "chip": "172K JOBS", "chipColor": "#ffe600", "titleSize": 100},
     "broll": [("broll-dil-jobs-dump.png", 2.5, 8.5), ("broll-dil-jobs-strong-economy.png", 13.0, 19.0)],
     "sounds": [(2.5, "WHOOSH"), (2.5, "BOOM"), (13.0, "WHOOSH")]},
    {"const": "D_DIL_2", "slug": "four-year-cycle-not-magic", "asset": "dil-cycle.mp4",
     "thumb": {"title": "THE 4-YEAR CYCLE\\nIS NOT MAGIC", "chip": "MACRO LIQUIDITY", "chipColor": "#00e5ff", "titleSize": 104},
     "broll": [("broll-dil-cycle-zombie.png", 2.5, 9.0), ("broll-dil-cycle-winter.png", 16.0, 23.0)],
     "sounds": [(2.5, "WHOOSH"), (2.5, "BOOM"), (16.0, "WHOOSH")]},
    {"const": "D_DIL_3", "slug": "kaspa-to-3-boy-was-i-wrong", "asset": "dil-kaspa.mp4",
     "thumb": {"title": "I THOUGHT KASPA\\nWOULD HIT $3", "chip": "BOY WAS I WRONG", "chipColor": "#00e5ff", "titleSize": 104},
     "broll": [("broll-dil-kaspa-coin.png", 3.0, 10.0), ("broll-dil-kaspa-november-red.png", 58.0, 67.0), ("broll-dil-kaspa-parabolic-zombies.png", 78.0, 86.0)],
     "sounds": [(3.0, "WHOOSH"), (3.0, "BOOM"), (58.0, "WHOOSH"), (78.0, "WHOOSH")]},
]

FIXES = {"casper": "kaspa", "caspa": "kaspa", "kaspar": "kaspa", "droll": "jerome"}
RED = {"bad", "wrong", "blindsided", "winter", "crash", "sold", "dump", "dumped", "down"}
def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
def is_short(w): return len(w.strip(".,!?'\"")) <= 4

def colorize(raw):
    clean = raw.lower().strip(".,!?'\"")
    fixed = FIXES.get(clean, raw)
    fclean = fixed.lower().strip(".,!?'\"")
    if re.match(r"^\$?\d", fclean) or fclean in {"172", "85", "200", "2025", "2017", "2022"}:
        return f"<y>{fixed}</y>"
    if fclean == "kaspa":
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
        # keep color tag names intact after lower() (they're already lowercase)
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
    d = dur(f"{SH}/{c['slug']}/tightened.mp4")
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

frames_ts = "export const FRAMES_DIL = { " + ", ".join(f"{k}: {v}" for k, v in frames.items()) + " };\n"
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
print("FRAMES_DIL:", frames)
