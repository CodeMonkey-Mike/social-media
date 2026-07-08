"""Generate dataUhoh.ts (6 ShortData for the uh-oh batch) from the tightened+desilenced clips'
Whisper JSON. Captions: 2-4 word groups, lowercase, brand fixes + color tags. Thumb/broll/sounds
authored here. Mirrors dataDilemma.ts / dataZombie.ts (renders through LivestreamShort)."""
import json, os, re, subprocess

SH  = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\uh-oh"
OUT = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\remotion\src\dataUhoh.ts"

# broll filenames = gen-images.js output (broll-<id>-<slug>.png), copied into assets/.
CLIPS = [
    {"const": "D_UH_1", "slug": "october-turns-green", "asset": "uhoh-october-green.mp4",
     "thumb": {"title": "WHY OCTOBER\\nTURNS GREEN", "chip": "THE ZOMBIE TRAP", "chipColor": "#00e5ff", "titleSize": 112},
     "broll": [("broll-37832a65-uhoh-oct-zombies.png", 3.0, 10.0), ("broll-9b61dd4f-uhoh-oct-rocket.png", 24.0, 33.0)],
     "sounds": [(3.0, "WHOOSH"), (24.0, "WHOOSH"), (24.0, "BOOM")]},
    {"const": "D_UH_2", "slug": "still-here-worst-of-times", "asset": "uhoh-still-here.mp4",
     "thumb": {"title": "STILL HERE IN\\nTHE WORST OF\\nTIMES?", "chip": "YOU'RE AHEAD", "chipColor": "#39ff14", "titleSize": 100},
     "broll": [("broll-8cc35382-uhoh-still-storm.png", 3.0, 10.0), ("broll-39210bc4-uhoh-still-sunrise.png", 24.0, 34.0)],
     "sounds": [(3.0, "WHOOSH"), (24.0, "WHOOSH"), (24.0, "BOOM")]},
    {"const": "D_UH_3", "slug": "elizaos-my-favorite-ai", "asset": "uhoh-elizaos.mp4",
     "thumb": {"title": "THE AI COIN THAT\\nALREADY PROVED IT", "chip": "ELIZAOS", "chipColor": "#00e5ff", "titleSize": 92},
     "broll": [("broll-28c989c7-uhoh-elizaos-rise.png", 3.0, 10.0), ("broll-f8065d5a-uhoh-elizaos-podium.png", 20.0, 29.0)],
     "sounds": [(3.0, "WHOOSH"), (20.0, "WHOOSH"), (20.0, "BOOM")]},
    {"const": "D_UH_4", "slug": "lab-353x-surprise", "asset": "uhoh-lab-353x.mp4",
     "thumb": {"title": "WE JUST DID\\nA 353X", "chip": "ON $LAB", "chipColor": "#39ff14", "titleSize": 120},
     "broll": [("broll-09512800-uhoh-lab-explode.png", 2.5, 8.0), ("broll-e92079b2-uhoh-lab-candles.png", 13.0, 20.5)],
     "sounds": [(2.5, "WHOOSH"), (2.5, "BOOM"), (13.0, "WHOOSH")]},
    {"const": "D_UH_5", "slug": "linea-not-xrp", "asset": "uhoh-linea.mp4",
     "thumb": {"title": "SWIFT PICKED\\nLINEA, NOT XRP", "chip": "THE REAL PLAY", "chipColor": "#00e5ff", "titleSize": 104},
     "broll": [("broll-7b072bbc-uhoh-linea-swift.png", 3.0, 11.0), ("broll-af7ac951-uhoh-linea-vs-xrp.png", 28.0, 40.0)],
     "sounds": [(3.0, "WHOOSH"), (28.0, "WHOOSH"), (28.0, "BOOM")]},
    {"const": "D_UH_6", "slug": "kaspa-refused-to-break-down", "asset": "uhoh-kaspa.mp4",
     "thumb": {"title": "KASPA REFUSED\\nTO BREAK DOWN", "chip": "STRONGEST IN MY BAG", "chipColor": "#00e5ff", "titleSize": 100},
     "broll": [("broll-1a0eda6e-uhoh-kaspa-pedestal.png", 2.0, 7.0), ("broll-3776b982-uhoh-kaspa-holds-line.png", 9.5, 14.5)],
     "sounds": [(2.0, "WHOOSH"), (2.0, "BOOM"), (9.5, "WHOOSH")]},
]

FIXES = {"casper": "kaspa", "caspa": "kaspa", "kaspar": "kaspa", "kaspy": "kaspa",
         "elizo": "elizaos", "eliza": "elizaos", "linnea": "linea", "linea": "linea",
         "ai16c": "ai16z", "16c": "16z"}
TEAL_WORDS  = {"kaspa", "elizaos", "linea", "bittensor", "tao", "ton"}
RED_WORDS   = {"useless", "crash", "crashed", "down", "wrong", "dump", "dumped", "sell", "selling",
               "pain", "bear", "red", "bottom", "worst", "blindsided", "panic"}
GREEN_WORDS = {"green", "up"}

def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())
def is_short(w): return len(w.strip(".,!?'\"$")) <= 4

def clean(w): return w.lower().strip(".,!?'\"$")

def colorize(raw):
    c = clean(raw)
    fixed = FIXES.get(c, raw)
    fc = clean(fixed)
    # numbers, prices, and Nx multipliers -> yellow
    if re.match(r"^\$?\d", fc) or re.match(r"^\d+x$", fc) or fc in {"353x", "100x", "20x", "37", "200", "2024", "2025"}:
        return f"<y>{fixed}</y>"
    if fc in TEAL_WORDS:   return f"<g>{fixed}</g>"
    if fc in GREEN_WORDS:  return f"<gr>{fixed}</gr>"
    if fc in RED_WORDS:    return f"<r>{fixed}</r>"
    return fixed

ELIZA_HEADS = {"elizo", "eliza", "elisa", "aliza", "alize", "lisa", "lies"}
def premerge(words):
    """Merge STT splits into clean brand tokens. Whisper renders 'ElizaOS' as 'elizo s' / 'eliza os'
    / 'a lies os' etc., and 'ai16z' as 'ai 16z'. Collapse those so captions read 'elizaos' / 'ai16z'."""
    out = []
    i = 0
    while i < len(words):
        w = words[i]; cw = clean(w["word"])
        n1 = clean(words[i+1]["word"]) if i+1 < len(words) else ""
        n2 = clean(words[i+2]["word"]) if i+2 < len(words) else ""
        # 3-word: <head> o s   (e.g. 'eliza o s')
        if cw in ELIZA_HEADS and n1 == "o" and n2 == "s":
            out.append({"word": "ElizaOS", "start": w["start"], "end": words[i+2]["end"]}); i += 3; continue
        # 2-word: <head> (os|s)   (e.g. 'elizo s', 'eliza os', 'lies os')
        if cw in ELIZA_HEADS and n1 in {"os", "s"}:
            out.append({"word": "ElizaOS", "start": w["start"], "end": words[i+1]["end"]}); i += 2; continue
        # single token already close ('elizaos','elizos','elizaos.')
        if cw in {"elizaos", "elizos", "elizaos"}:
            out.append({"word": "ElizaOS", "start": w["start"], "end": w["end"]}); i += 1; continue
        if cw == "ai" and n1 in {"16z", "16c", "16"}:
            out.append({"word": "ai16z", "start": w["start"], "end": words[i+1]["end"]}); i += 2; continue
        out.append(w); i += 1
    return out

def captions_for(slug):
    data = json.load(open(f"{SH}/{slug}/whisper.json", encoding="utf-8"))
    words = [{"word": w["word"].strip(), "start": w["start"], "end": w["end"]}
             for seg in data["segments"] for w in seg.get("words", [])]
    words = premerge(words)
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
        # lowercase only OUTSIDE the color-tag span names (tags are already lowercase ascii)
        h = re.sub(r">([^<]+)<", lambda m: ">" + m.group(1).lower() + "<", h)
        # bare (untagged) text: lowercase the whole thing is unsafe w/ tags; lowercase token-by-token
        parts = re.split(r"(<[^>]+>)", h)
        h = "".join(p if p.startswith("<") else p.lower() for p in parts)
        h = h.replace('"', '\\"')
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

frames_ts = "export const FRAMES_UH = { " + ", ".join(f"{k}: {v}" for k, v in frames.items()) + " };\n"
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
print("FRAMES_UH:", frames)
