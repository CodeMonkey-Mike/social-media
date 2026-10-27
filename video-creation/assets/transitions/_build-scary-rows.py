#!/usr/bin/env python
"""
_build-scary-rows.py -- SCARY / Stinger: 15 third-party horror "stinger" plates -> library.json rows, engine
StingerPlate (remotion/src/transitions/engines/StingerPlate.tsx). Added 2026-10-25 for the Halloween video.

NOT Swiftly. The source is Mike's own assets folder (`Scary Transitions 01..15.mp4`, Oct 2022, no readme, no
licence file, no .prproj): each clip is ONE finished, fully opaque 1920x1080 25 fps h264 plate (no alpha) with its
own baked stinger sound. Black head -> a scary face rushes in -> the frame blows out to white / fire orange ->
fades to black. The plate IS the effect: nothing is extracted or re-created, so CLAUDE.md Rules 1-6 have nothing
to bite on, and Rule 7's SFX lead-in trim does NOT apply (the sound is in sync with its own picture; trimming it
would pull the hit ahead of the flash).

What this script does (idempotent; re-run any time):
  1. --ingest <folder>: plate = the clip's video stream COPIED with audio stripped (`-an -c:v copy`, zero
     generation loss) -> lib/scary/scary-N.mp4; sfx = the clip's own audio, UNTRIMMED -> lib/sfx-scary-N.mp3
     (192k CBR, the library's sfx format). Existing files are kept unless --force-ingest.
  2. Measures every plate (ffprobe + ffmpeg signalstats per frame) and derives, per plate:
       - the WHITE-OUT runs (frames whose 10th-percentile luma YLOW >= WHITE_YLOW: the frame is blown out);
       - the hiding run = the longest white-out run; on a tie the one with the most FULLY white frames
         (YMIN >= FULL_YMIN), then the one nearest the plate's middle (the flash then fires closest to the
         TransitionClip cut frame);
       - `cut` = the A->B swap fraction, snapped to the 30 fps comp grid so the swap lands on a fully white
         frame at the middle of that run (the engine swaps at frame/(win-1) >= cut);
       - `visible` = [first, last] plate frame with content (mean luma > BLACK_YAVG), for blend `opaque`.
  3. Merges the 15 rows into library.json BY ID (replaced in place, never touching another row), with a
     serializer that reproduces the JS-written file byte for byte (asserted before writing), and appends the
     family once to `$doc`. Never run `_enrich-meta.js` after this: it rewrites every row's meta.

Usage (from the repo root):
  python video-creation/assets/transitions/_build-scary-rows.py --ingest "D:/Dropbox/mikeneder.me/videos/assets/transitions/scary transitions"
  python video-creation/assets/transitions/_build-scary-rows.py            # re-measure + re-merge the rows
  python video-creation/assets/transitions/_build-scary-rows.py --report   # print the measurement table only
Hard-fails (exit 1) on: a missing / mis-formatted plate, audio left in a plate, a missing sfx, a plate with no
white-out, a swap frame that does not land on white, a library round trip that would reformat other rows.
"""
import argparse
import json
import math
import re
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent                       # video-creation/assets/transitions
LIB_JSON = HERE / "library.json"
PLATE_DIR = HERE / "lib" / "scary"
SFX_DIR = HERE / "lib"
COUNT = 15
SRC_NAME = "Scary Transitions {:02d}.mp4"
COMP_FPS = 30          # every comp and the demo run at 30 fps; the cut fraction is snapped to that frame grid
PLATE_FPS = 25
WHITE_YLOW = 225       # limited-range luma (16..235): YLOW >= 225 = the frame's darkest 10 % is already blown out
FULL_YMIN = 220        # ... and YMIN >= 220 = EVERY pixel is blown out (nothing underneath can peek through)
BLACK_YAVG = 26        # mean luma <= 26 = black or the near-black fade (measured: content frames sit at >= 29)
BLEND_DEFAULT = "screen"   # Mike picks screen vs opaque by watching the scary-4 pair; flipping it is this one line
BLEND_WORDS = {
    "screen": "screen-composited over the cut (black is see-through, the face haunts the footage)",
    "opaque": "laid over the cut opaque (it covers the frame for its visible span, black head and tail keyed out)",
}
ID_RE = re.compile(r"^scary-\d+$")
DOC_NOTE = (" SCARY/Stinger 15 (scary-1..15, added 2026-10-25): third-party horror stinger plates from Mike's own "
            "assets folder, NOT Swiftly (no .prproj, origin and licence undocumented); the plate IS the effect, "
            "engine StingerPlate, built by _build-scary-rows.py.")

# What is ON each plate (checked by eye on every-2nd-frame contact sheets of all 15 plates, 2026-10-25).
# subject = the ONE-subject-per-video grouping key (7 subjects: skull 8/12/13/15 · clown 3/7 · ghost 1/2 ·
# demon 10/14 · ghoul 5/9/11 · mask 4 · pumpkin 6); palette = the colour words; look = the description body.
SUBJECTS = {
    1: ("ghost", ["black-and-white", "cold-white", "orange"],
        "a pale long-haired ghost woman rushes in black-and-white, a cold white blow-out, an orange fire flash, "
        "a second white-out, then her hollow-eyed face"),
    2: ("ghost", ["dark-grey", "orange", "red"],
        "a hooded nun with a pale mask face rushes in, a warm lens flare, a white flash, her face lit orange-red "
        "with glowing white eyes, a second white-out, an orange glow"),
    3: ("clown", ["fire-orange", "red"],
        "an evil clown in fire orange and red: a red smear, a white blow-out, a close-up of the red-nosed grin, "
        "a second white-out, the clown in flames"),
    4: ("mask", ["black-and-white", "pink-orange"],
        "a Scream ghostface mask rushes in black-and-white, a hard white blow-out, a pink-orange flare, then a "
        "black-and-white close-up of the mask"),
    5: ("ghoul", ["blue-white", "red", "orange"],
        "a cold blue-white blow-out, an old white-haired hag with hollow eyes, a red-eyed warm flare, then a "
        "fire-orange flare fading to red"),
    6: ("pumpkin", ["fire-orange", "grey"],
        "a carved jack-o-lantern pumpkin rushes in grey, lit fire orange, a single white flash, a close-up of "
        "the grin, fire streaks (the shortest plate)"),
    7: ("clown", ["red", "white", "yellow"],
        "a sharp-toothed clown with a red nose, a cyan-white flash, a white blow-out, red and pink smears, a "
        "yellow-white close-up, then a long white-out"),
    8: ("skull", ["fire-orange", "red", "grey"],
        "a skull rushes in grey, lit fire orange, a white blow-out, a white-hot skull, a red smear, then a grey "
        "skull blur"),
    9: ("ghoul", ["blue-white", "fire-orange", "grey"],
        "a skull in cold blue-white, a white blow-out, a warm skull, a second white-out, a rotting zombie face "
        "with bared teeth in fire, then grey"),
    10: ("demon", ["red", "fire-orange"],
         "a screaming demon woman with sharp teeth: a grey face, a white blow-out, orange glowing eyes, a second "
         "white-out, a red close-up, fire"),
    11: ("ghoul", ["black-and-white", "red", "orange"],
         "a gaunt hollow-eyed corpse face in black-and-white, pink on red, a fire flash, a white skull face, a "
         "white blow-out, orange eyes on red"),
    12: ("skull", ["fire-orange", "red", "black-and-white"],
         "a skull in a fire flash, a white blow-out, a white skull, red streaks, a red-orange skull close-up, "
         "then a black-and-white skull close-up"),
    13: ("skull", ["white", "orange", "grey"],
         "grey motion streaks, a white skull close-up, an orange skull, a white blow-out, the skull again, grey blur"),
    14: ("demon", ["red", "orange", "white"],
         "a FLASH-IN plate, white within its first frames: a demon woman with glowing orange-red eyes and long dark "
         "hair, a second white-out, an orange streak"),
    15: ("skull", ["pink", "red", "fire-orange"],
         "a pink-red fanged skull lit fire yellow, a white blow-out, the fanged skull in fire, a pink skull, grey"),
}


def die(msg):
    print(f"SCARY BUILD FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        die(f"command failed ({r.returncode}): {' '.join(map(str, cmd))}\n{r.stderr[-2000:]}")
    return r.stdout


# ------------------------------------------------------------------ JS-compatible JSON (byte-identical to the
# file the _build-*.js scripts write with JSON.stringify(d, null, 2): Python's own dump would rewrite 0.00002 as
# 2e-05 all over other rows).
def js_number(x):
    if isinstance(x, bool):
        return "true" if x else "false"
    if isinstance(x, int):
        return str(x)
    if x != x or x in (float("inf"), float("-inf")):
        return "null"
    if x == 0:
        return "0"
    sign = "-" if x < 0 else ""
    t = Decimal(repr(abs(x))).as_tuple()
    digits, exp = list(t.digits), t.exponent
    while len(digits) > 1 and digits[-1] == 0:
        digits.pop()
        exp += 1
    s = "".join(map(str, digits))
    k, n = len(s), exp + len(s)
    if k <= n <= 21:
        out = s + "0" * (n - k)
    elif 0 < n <= 21:
        out = s[:n] + "." + s[n:]
    elif -6 < n <= 0:
        out = "0." + "0" * (-n) + s
    else:
        e = n - 1
        out = (s if k == 1 else s[0] + "." + s[1:]) + "e" + ("+" if e >= 0 else "-") + str(abs(e))
    return sign + out


def js_dump(o, ind=0):
    sp = "  "
    if o is None:
        return "null"
    if o is True:
        return "true"
    if o is False:
        return "false"
    if isinstance(o, (int, float)):
        return js_number(o)
    if isinstance(o, str):
        return json.dumps(o, ensure_ascii=False)
    if isinstance(o, list):
        if not o:
            return "[]"
        pad = sp * (ind + 1)
        return "[\n" + ",\n".join(pad + js_dump(v, ind + 1) for v in o) + "\n" + sp * ind + "]"
    if isinstance(o, dict):
        if not o:
            return "{}"
        pad = sp * (ind + 1)
        return ("{\n" + ",\n".join(pad + json.dumps(k, ensure_ascii=False) + ": " + js_dump(v, ind + 1)
                                   for k, v in o.items()) + "\n" + sp * ind + "}")
    raise TypeError(f"not JSON-serializable: {type(o)}")


# ------------------------------------------------------------------ ingest
def ingest(src_dir: Path, force: bool):
    PLATE_DIR.mkdir(parents=True, exist_ok=True)
    for n in range(1, COUNT + 1):
        src = src_dir / SRC_NAME.format(n)
        if not src.is_file():
            die(f"source clip missing: {src}")
        plate, sfx = PLATE_DIR / f"scary-{n}.mp4", SFX_DIR / f"sfx-scary-{n}.mp3"
        if force or not plate.is_file():
            run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-map", "0:v:0", "-an", "-sn", "-dn",
                 "-c:v", "copy", "-movflags", "+faststart", str(plate)])
        if force or not sfx.is_file():
            run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-map", "0:a:0", "-vn",
                 "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "48000", str(sfx)])
        print(f"  ingested scary-{n}: {plate.name} ({plate.stat().st_size / 1e6:.1f} MB) + {sfx.name}")


# ------------------------------------------------------------------ measure
def probe(path: Path):
    out = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)]))
    return out["streams"], out["format"]


def luma(path: Path):
    """Per-frame limited-range luma stats [(ymin, ylow, yavg, yhigh, ymax)] via ffmpeg signalstats."""
    out = run(["ffmpeg", "-v", "error", "-i", str(path), "-vf", "signalstats,metadata=print:file=-", "-f", "null", "-"])
    frames, cur = [], {}
    for line in out.splitlines():
        if line.startswith("frame:"):
            if cur:
                frames.append(cur)
            cur = {}
        m = re.match(r"lavfi\.signalstats\.(YMIN|YLOW|YAVG|YHIGH|YMAX)=([\d.]+)", line.strip())
        if m:
            cur[m.group(1)] = float(m.group(2))
    if cur:
        frames.append(cur)
    return [(f["YMIN"], f["YLOW"], f["YAVG"], f["YHIGH"], f["YMAX"]) for f in frames]


def runs(flags):
    out, start = [], None
    for i, f in enumerate(flags + [False]):
        if f and start is None:
            start = i
        if not f and start is not None:
            out.append((start, i - 1))
            start = None
    return out


def js_round(x: float) -> int:
    """JavaScript Math.round (halves go up), what TransitionClip / framesForRow use."""
    return int(math.floor(x + 0.5))


def plate_frame(comp_frame: int) -> int:
    """The plate frame OffthreadVideo shows on a comp frame: the NEAREST one, x.5 rounding up (MEASURED
    2026-10-25 on the scary-4 opaque demo: 17 unambiguous frames, e.g. comp 15 -> 12.5 -> plate 13, comp 32 ->
    26.67 -> plate 27; a floor() model put the 3rd white frame one frame late)."""
    return js_round(comp_frame * PLATE_FPS / COMP_FPS)


def measure(n: int):
    plate, sfx = PLATE_DIR / f"scary-{n}.mp4", SFX_DIR / f"sfx-scary-{n}.mp3"
    if not plate.is_file():
        die(f"plate missing: {plate} (run with --ingest <folder>)")
    if not sfx.is_file():
        die(f"sfx missing: {sfx} (run with --ingest <folder>)")
    streams, _ = probe(plate)
    vids = [s for s in streams if s["codec_type"] == "video"]
    if len(streams) != 1 or len(vids) != 1:
        die(f"scary-{n}: plate must hold exactly one video stream and NO audio, has {[s['codec_type'] for s in streams]}")
    v = vids[0]
    if (v["width"], v["height"], v["r_frame_rate"]) != (1920, 1080, f"{PLATE_FPS}/1"):
        die(f"scary-{n}: plate is {v['width']}x{v['height']} @ {v['r_frame_rate']}, expected 1920x1080 @ {PLATE_FPS}/1")
    nb = int(v["nb_frames"])
    a_streams, a_fmt = probe(sfx)
    sfx_dur = float(a_fmt["duration"])
    stats = luma(plate)
    if len(stats) != nb:
        die(f"scary-{n}: signalstats saw {len(stats)} frames, container says {nb}")
    dur = round(nb / PLATE_FPS, 4)
    if abs(sfx_dur - dur) > 0.06:
        die(f"scary-{n}: sfx {sfx_dur:.3f}s vs plate {dur:.3f}s (the sound must be the plate's own, untrimmed)")
    white = [s[1] >= WHITE_YLOW for s in stats]
    full = [s[0] >= FULL_YMIN for s in stats]
    wruns = runs(white)
    if not wruns:
        die(f"scary-{n}: no white-out frame (YLOW >= {WHITE_YLOW}); it cannot hide a cut")
    mid_plate = (nb - 1) / 2
    longest = max(wruns, key=lambda r: (r[1] - r[0], sum(full[r[0]:r[1] + 1]), -abs((r[0] + r[1]) / 2 - mid_plate)))
    win = js_round(dur * COMP_FPS)                                 # = framesForRow(row, 30)
    comp_white = [f for f in range(win) if longest[0] <= plate_frame(f) <= longest[1]]
    if not comp_white:
        die(f"scary-{n}: the hiding run {longest} is never shown on the {COMP_FPS} fps grid")
    # the upper-middle comp frame of the run (so a white frame precedes the swap when the run allows it),
    # moved to the nearest FULLY white frame when the middle one is only mostly white
    mid = len(comp_white) // 2
    order = sorted(range(len(comp_white)), key=lambda i: (abs(i - mid), -i))
    swap = comp_white[next((i for i in order if full[plate_frame(comp_white[i])]), mid)]
    cut = round((swap - 0.5) / (win - 1), 4)
    first_b = next(f for f in range(win) if f / (win - 1) >= cut)  # the engine's rule: p >= cut
    if first_b != swap or not white[plate_frame(first_b)]:
        die(f"scary-{n}: cut {cut} swaps on comp frame {first_b} (plate frame {plate_frame(first_b)}), not on white")
    vis = [i for i, s in enumerate(stats) if s[2] > BLACK_YAVG]
    if not vis:
        die(f"scary-{n}: plate is black throughout")
    return {
        "n": n, "frames": nb, "dur": dur, "sfx_dur": round(sfx_dur, 3), "stats": stats, "white_runs": wruns,
        "longest": longest, "win": win, "swap": swap, "swap_plate": plate_frame(swap),
        "full_swap": full[plate_frame(swap)], "cut": cut, "visible": [vis[0], vis[-1]],
        "flash_s": round(swap / COMP_FPS, 2),
        # TransitionClip: winStart = cutFrame - Math.round(win / 2), so the swap (the flash) lands this far
        # from the cut frame it is given (negative = before it)
        "flash_vs_cut_s": round((swap - js_round(win / 2)) / COMP_FPS, 2),
    }


# ------------------------------------------------------------------ rows
def build_row(m):
    n = m["n"]
    if n not in SUBJECTS:
        die(f"scary-{n}: no SUBJECTS entry")
    subject, palette, look = SUBJECTS[n]
    dur = m["dur"]
    return {
        "id": f"scary-{n}",
        "category": "SCARY",
        "variant": "Stinger",
        "intensity": str(n),
        "label": f"Scary \u00b7 Stinger \u00b7 {n}",
        "engine": "StingerPlate",
        "kind": "footage",
        "fidelity": "near-1:1",
        "durationSeconds": dur,
        "params": {
            "plate": f"transitions/lib/scary/scary-{n}.mp4",
            "plateFps": PLATE_FPS,
            "cut": m["cut"],
            "blend": BLEND_DEFAULT,
            "visible": m["visible"],
        },
        "sfx": f"transitions/lib/sfx-scary-{n}.mp3",
        "used_in": [],
        "meta": {
            "aspectRatios": ["16:9"],
            "resolution": "1920x1080",
            "family": "Scary Stinger",
            "engineFile": "remotion/src/transitions/engines/StingerPlate.tsx",
            "description": (f"Horror stinger plate ({subject}): {look}. The hidden cut sits in the white-out at "
                            f"{m['flash_s']:.2f} s of the {dur:g} s plate, then it fades to black. Real third-party "
                            f"footage {BLEND_WORDS[BLEND_DEFAULT]}, with its own baked stinger sound."),
            "energy": "high",
            "durationSeconds": dur,
            "hasSound": True,
            "fidelity": "near-1:1",
            "tags": ["scary", "halloween", "horror", subject, *palette, "jump-scare", "stinger", "flash", "white-out"],
            "useWhen": ("Halloween / horror register ONLY, never in a normal video: a jump-scare scene change or an "
                        "AI-still hit in a scary video, never on a text container. One subject per video (do not mix "
                        f"{subject} with another subject). The flash fires {m['flash_vs_cut_s']:+.2f} s from the "
                        "TransitionClip cut frame; the baked sound starts at the window start (the post-mix puts it "
                        "at tc - duration_s / 2, so duration_s must equal durationSeconds)."),
        },
    }


def merge(rows):
    raw = LIB_JSON.read_bytes()
    doc = json.loads(raw.decode("utf-8"))
    if js_dump(doc).encode("utf-8") != raw:
        die("library.json does not round-trip byte-identically through the JS-compatible serializer; "
            "refusing to write (it would reformat other rows)")
    old = doc["transitions"]
    before = {r["id"]: json.dumps(r, sort_keys=True) for r in old if not ID_RE.match(r["id"])}
    new = {r["id"]: r for r in rows}
    merged, placed = [], set()
    for r in old:
        if r["id"] in new:
            merged.append(new[r["id"]])
            placed.add(r["id"])
        elif ID_RE.match(r["id"]):
            continue                                   # a stale scary row this build no longer makes
        else:
            merged.append(r)
    merged += [r for r in rows if r["id"] not in placed]
    doc["transitions"] = merged
    if DOC_NOTE.strip() not in doc["$doc"]:
        doc["$doc"] = doc["$doc"] + DOC_NOTE
    after = {r["id"]: json.dumps(r, sort_keys=True) for r in merged if not ID_RE.match(r["id"])}
    if before != after:
        die("merge would change a non-scary row")
    out = js_dump(doc).encode("utf-8")
    LIB_JSON.write_bytes(out)
    return len(old), len(merged), raw != out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--ingest", help="folder holding 'Scary Transitions 01..15.mp4' (copies plates + sfx into lib/)")
    ap.add_argument("--force-ingest", action="store_true", help="re-copy plates / re-extract sfx even if present")
    ap.add_argument("--report", action="store_true", help="print the measurement table, write nothing")
    a = ap.parse_args()
    if a.ingest:
        ingest(Path(a.ingest), a.force_ingest)
    ms = [measure(n) for n in range(1, COUNT + 1)]
    print(f"\n{'id':9} {'frames':>6} {'dur':>5} {'win30':>5} {'white runs (YLOW>=%d)' % WHITE_YLOW:30} "
          f"{'hiding':>7} {'swap':>4} {'plate':>5} {'full':>4} {'cut':>6} {'flash':>5} {'vs cut':>6} {'visible':>8} "
          f"{'sfx s':>6}")
    for m in ms:
        wr = " ".join(f"{a_}-{b}" if a_ != b else f"{a_}" for a_, b in m["white_runs"])
        lg = f"{m['longest'][0]}-{m['longest'][1]}"
        print(f"scary-{m['n']:<3} {m['frames']:>6} {m['dur']:>5} {m['win']:>5} {wr:30} {lg:>7} {m['swap']:>4} "
              f"{m['swap_plate']:>5} {'yes' if m['full_swap'] else 'no':>4} {m['cut']:>6} {m['flash_s']:>5} "
              f"{m['flash_vs_cut_s']:>+6.2f} {str(m['visible']):>8} {m['sfx_dur']:>6}")
    if a.report:
        return
    rows = [build_row(m) for m in ms]
    n_old, n_new, changed = merge(rows)
    print(f"\nSCARY BUILD OK: {len(rows)} rows merged into {LIB_JSON.name} ({n_old} -> {n_new} rows"
          f"{'' if changed else ', file unchanged'})")


if __name__ == "__main__":
    main()
