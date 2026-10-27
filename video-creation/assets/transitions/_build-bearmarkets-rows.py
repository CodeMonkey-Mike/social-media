#!/usr/bin/env python
"""
_build-bearmarkets-rows.py -- the transitions Mike's 2022 video "044 Bear Markets" used in its first 1:50 that the
library could not play yet, built for the Halloween longform `only-18-months-left` (2026-10-25). FIVE rows:

  motion-shake-optics-2x-long   MotionShake + the FULL 60 s Corner Pin master (lib/shake/motion-shake-optics-2x-60s.json)
  motion-shake-optics-3x-long   MotionShake + the FULL 60 s master (lib/shake/motion-shake-optics-3x-60s.json)
  zoom-mirror-punch-in          MirrorZoomPunch: the Finzar "Nice Camera Shake" preset (mirror-tiled zoom punch)
  scary-pumpkin-fire            AlphaPlate: the transparent jack-o-lantern-bursts-into-fire plate (lib/scary/scary-pumpkin-fire.webm)
  scary-6-normal75              StingerPlate blend 'normal' @ 0.6: the Bear Markets look of scary-6 (same plate + sound)

Source of every number: the scout study of Bear Markets 0:00-1:50 (read from the Premiere project, verified on the
render; nothing after 1:50 used), its Corner Pin exports and effect dumps, and the Finzar .prfpset (its "Nice Camera
Shake" keyframes are identical to the Bear Markets instance). The shakes are the Swiftly Studio 850 "Motion Shake
Optics - 2x / - 3x" presets (the 2 s rows motion-shake-optics-2x / -3x carry their first 2.08 s; Bear Markets held
them 5.4 / 2.7 / 3.3 s on Mike's face, so the long rows carry the whole master).

What this script does (idempotent; re-run any time):
  --ingest-shake <dir>   copies the two 60 s Corner Pin exports (motion-shake-optics-{2x,3x}-60s-cornerpin.json) into
                         the lib layout as compact masters, after checking them against the inline 2 s rows (their
                         first 53 keys must match) and the rows' lens curvature.
  --ingest-pumpkin <mov> transcodes the 4K ProRes 4444 alpha source (PREMULTIPLIED on black; a fit against the Bear
                         Markets render picked premultiplied + linear-light compositing) ONCE to a 1920x1080 30 fps VP9
                         WebM with alpha, UNPREMULTIPLIED (the browser composites straight alpha), frames 0-305 (the
                         Bear Markets span 0-10.167 s + 1 frame), no audio (the source has none).
  default                measures the assets (shake: per-key edge coverage through the engine's lens model, hard-fail
                         on any exposed edge; pumpkin: per-frame alpha coverage at the 113 % / y +15 px placement,
                         hard-fail on a plate without alpha), reads scary-6's row, builds the five rows and merges them
                         into library.json BY ID (replaced in place, never touching another row; the same JS-compatible
                         serializer as _build-scary-rows.py, round trip asserted byte-identical before writing).
  --report               prints the measurements, writes nothing.
Re-run AFTER _build-scary-rows.py if that one changes scary-6 (scary-6-normal75 copies its cut). Never run
_enrich-meta.js after this: it rewrites every row's meta.

Usage (from the repo root):
  python video-creation/assets/transitions/_build-bearmarkets-rows.py --ingest-shake <study>/data --ingest-pumpkin "<...>/evil-pumpkin-with-fire-2022-08-04-16-48-37-utc.mov"
  python video-creation/assets/transitions/_build-bearmarkets-rows.py
  python video-creation/assets/transitions/_build-bearmarkets-rows.py --report
"""
import argparse
import hashlib
import json
import math
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent                       # video-creation/assets/transitions
LIB_JSON = HERE / "library.json"
SHAKE_DIR = HERE / "lib" / "shake"
PUMPKIN = HERE / "lib" / "scary" / "scary-pumpkin-fire.webm"
IDS = ("motion-shake-optics-2x-long", "motion-shake-optics-3x-long", "zoom-mirror-punch-in",
       "scary-pumpkin-fire", "scary-6-normal75")
COMP_FPS = 30
W, H = 1920, 1080
DOC_NOTE = (" BEAR MARKETS 5 (added 2026-10-25, _build-bearmarkets-rows.py, the transitions Mike's 2022 video "
            "'044 Bear Markets' used): motion-shake-optics-2x-long / -3x-long (MotionShake + the full 60 s Corner Pin "
            "masters in lib/shake/), zoom-mirror-punch-in (MirrorZoomPunch, the Finzar Nice Camera Shake preset), "
            "scary-pumpkin-fire (AlphaPlate, the transparent jack-o-lantern fire plate lib/scary/scary-pumpkin-fire.webm), "
            "scary-6-normal75 (StingerPlate blend normal 0.6, the Bear Markets look of scary-6).")

# ---------------------------------------------------------------- shakes
SHAKES = {   # n -> (Swiftly preset, Bear Markets holds on the face)
    "2x": ("Motion Shake Optics - 2x", "5.4 s at 0:23.8 and 2.7 s at 0:47.8"),
    "3x": ("Motion Shake Optics - 3x", "3.3 s at 1:01.4"),
}
SHAKE_DEMO_S = 6.0          # the rows' durationSeconds = the demo / default hold (>= Bear Markets' longest, 5.4 s)
LENS_PX_PER_K = 5.4         # MotionShake lens: displacement px = k * 5.4 * nx * r (lensMap.ts LENS_SCALE_PER_K * A/255)

# ---------------------------------------------------------------- mirror punch (Finzar "Nice Camera Shake")
# Keyframes as in the preset (.prfpset) and the Bear Markets instance (V2 54.300, fx dump), t = s after the cut,
# AE speed (iv/ov, units per second) + influence (ii/oi). Scale/Skew land at 0.3333 s, Position at 0.4167 s.
PUNCH_PARAMS = {
    "cut": 0.5,
    "innerScale": 33.333333,      # source 33.4 % (mirror lines at 1/3, 2/3); 1/3 so the 300 % rest pose is exact
    "scale": [
        {"t": 0, "v": 100, "ov": -227.272727, "oi": 0.0001},
        {"t": 0.333333, "v": 300, "iv": 5.827505, "ii": 1},
    ],
    "skew": [
        {"t": 0, "v": 10, "ov": -53.702493, "oi": 0.0001},
        {"t": 0.333333, "v": 0, "iv": -1.568856, "ii": 1},
    ],
    "skewAxis": 135,
    "posY": [
        {"t": 0, "v": 0.481481, "ov": 0, "oi": 0.769326},
        {"t": 0.083333, "v": 0.574074, "iv": 0, "ii": 0.488475, "ov": 0, "oi": 0.541135},
        {"t": 0.15, "v": 0.462963, "iv": 0, "ii": 0.634752, "ov": 0, "oi": 0.509929},
        {"t": 0.233333, "v": 0.485566, "iv": 0, "ii": 0.489362, "ov": 0, "oi": 0.335562},
        {"t": 0.416667, "v": 0.5, "iv": 0, "ii": 1},
    ],
    "shutter": 360,
    "shutterPhase": 0,
    "samples": 16,
}
PUNCH_WIN_S = 0.8667        # 26 frames @30: 13 untouched outgoing + 13 punch frames (>= the 0.417 s punch)

# ---------------------------------------------------------------- pumpkin (Bear Markets V3 76.433-85.600 + 1 s handle)
PUMPKIN_FRAMES = 306                     # 0..305 at 30 fps = the Bear Markets span (0-10.167 s) + 1 frame
PUMPKIN_FADE_IN = 1.0                    # Cross Dissolve from nothing, 76.433-77.433
PUMPKIN_SWAP_S = 9.1667                  # the clip's end in Bear Markets (85.600) = where the next scene came in
PUMPKIN_FADE_OUT = 1.0                   # Cross Dissolve into the next scene on the clip's handle frames
PUMPKIN_WIN_S = 10.1667                  # 305 frames @30
PUMPKIN_SCALE = 1.13                     # Scale 113 %, Position (960, 555) px at 1080p
PUMPKIN_DY = 15
VP9_CRF = 24


def die(msg):
    print(f"BEAR MARKETS BUILD FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def run(cmd, binary=False):
    r = subprocess.run(cmd, capture_output=True, **({} if binary else {"text": True, "encoding": "utf-8", "errors": "replace"}))
    if r.returncode != 0:
        err = r.stderr if not binary else r.stderr.decode("utf-8", "replace")
        die(f"command failed ({r.returncode}): {' '.join(map(str, cmd))}\n{err[-2000:]}")
    return r.stdout


def js_round(x: float) -> int:
    return int(math.floor(x + 0.5))


# ------------------------------------------------------------------ JS-compatible JSON (byte-identical to the file
# the _build-*.js scripts write with JSON.stringify(d, null, 2); same serializer as _build-scary-rows.py)
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


def load_lib():
    raw = LIB_JSON.read_bytes()
    doc = json.loads(raw.decode("utf-8"))
    return raw, doc


# ------------------------------------------------------------------ ingest: shakes
def shake_path(n):
    return SHAKE_DIR / f"motion-shake-optics-{n}-60s.json"


def ingest_shake(src_dir: Path, rows_by_id):
    SHAKE_DIR.mkdir(parents=True, exist_ok=True)
    for n, (preset, _) in SHAKES.items():
        src = src_dir / f"motion-shake-optics-{n}-60s-cornerpin.json"
        if not src.is_file():
            die(f"shake export missing: {src}")
        d = json.loads(src.read_text(encoding="utf-8"))
        if d.get("preset") != preset:
            die(f"{src.name}: preset {d.get('preset')!r}, expected {preset!r}")
        corners = {"ul": d["upper_left"], "ur": d["upper_right"], "ll": d["lower_left"], "lr": d["lower_right"]}
        ts = [k[0] for k in corners["ul"]]
        if len(ts) != 1500 or any(abs(t - i * 0.04) > 1e-6 for i, t in enumerate(ts)):
            die(f"{src.name}: expected 1500 keys every 0.04 s from 0, got {len(ts)}")
        for c, keys in corners.items():
            if [k[0] for k in keys] != ts:
                die(f"{src.name}: corner {c} keys are not on the shared time grid")
        row = rows_by_id.get(f"motion-shake-optics-{n}")
        if not row:
            die(f"library row motion-shake-optics-{n} missing (the 2 s row the long one extends)")
        p = row["params"]
        if float(d["lens_curvature"]) != float(p["lensK"]):
            die(f"{src.name}: lens curvature {d['lens_curvature']} != row lensK {p['lensK']}")
        worst = 0.0
        for c, keys in corners.items():
            for i, kf in enumerate(p[c]):
                worst = max(worst, abs(kf["t"] - keys[i][0]), abs(kf["x"] - keys[i][1]), abs(kf["y"] - keys[i][2]))
        if worst > 1.5e-4:
            die(f"{src.name}: its first {len(p['ul'])} keys differ from the inline 2 s row by {worst:.6f} (> 1.5e-4)")
        out = {
            "$doc": (f"Full 60 s Corner Pin master of the Swiftly Studio 850 preset '{preset}' (AE Corner Pin, all four "
                     "corners keyed every 0.04 s = a baked real handheld wiggle; continuous-Bezier keys, sampled "
                     "linearly key to key by MotionShake like the inline rows). Read from the '044 Bear Markets' "
                     "Premiere project (the preset instance as applied, which starts the track at t = 0); its first "
                     f"2.08 s are the inline keys of library row motion-shake-optics-{n} (max diff {worst:.6f}). "
                     "Used by library row motion-shake-optics-" + n + "-long via params.track. Written by "
                     "assets/transitions/_build-bearmarkets-rows.py --ingest-shake; do not hand-edit."),
            "preset": preset,
            "keyStep": 0.04,
            "keys": 1500,
            "durationSeconds": 59.96,
            "coords": "frame fractions (x * width, y * height = px); key i at t = i * keyStep",
            "lensCurvature": float(d["lens_curvature"]),
            "sourceDataMd5": d.get("corner_data_md5"),
            **{c: [[round(k[1], 6), round(k[2], 6)] for k in keys] for c, keys in corners.items()},
        }
        dst = shake_path(n)
        dst.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8", newline="\n")
        print(f"  ingested {dst.relative_to(HERE)} ({dst.stat().st_size / 1e3:.0f} KB, inline-row match {worst:.6f})")


# ------------------------------------------------------------------ ingest: pumpkin
def ingest_pumpkin(src: Path):
    if not src.is_file():
        die(f"pumpkin source missing: {src}")
    PUMPKIN.parent.mkdir(parents=True, exist_ok=True)
    tmp = PUMPKIN.with_suffix(".tmp.webm")
    # scale in the source's premultiplied space (lanczos weights sum to 1, so YUV scaling = RGB scaling), then to
    # planar RGB + alpha (BT.709 limited -> full), UNpremultiply, back to BT.709 limited 4:2:0 + alpha for VP9
    vf = ("scale=1920:1080:flags=lanczos,"
          "scale=in_color_matrix=bt709:in_range=tv:out_range=pc,format=gbrap16le,"
          "unpremultiply=inplace=1,"
          "scale=out_color_matrix=bt709:out_range=tv,format=yuva420p")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-map", "0:v:0", "-frames:v", str(PUMPKIN_FRAMES), "-an",
         "-vf", vf, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", str(VP9_CRF),
         "-row-mt", "1", "-threads", "16", "-deadline", "good", "-cpu-used", "2", "-auto-alt-ref", "0",
         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
         str(tmp)])
    tmp.replace(PUMPKIN)
    print(f"  ingested {PUMPKIN.relative_to(HERE)} ({PUMPKIN.stat().st_size / 1e6:.1f} MB, VP9 alpha, "
          f"{PUMPKIN_FRAMES} frames)")


# ------------------------------------------------------------------ measure: shakes
def measure_shake(n, rows_by_id):
    path = shake_path(n)
    if not path.is_file():
        die(f"shake master missing: {path} (run with --ingest-shake <study data dir>)")
    d = json.loads(path.read_text(encoding="utf-8"))
    C = {c: np.array(d[c], dtype=np.float64) for c in ("ul", "ur", "ll", "lr")}
    if any(len(v) != d["keys"] for v in C.values()) or d["keys"] != 1500 or d["keyStep"] != 0.04:
        die(f"{path.name}: malformed master")
    k = float(rows_by_id[f"motion-shake-optics-{n}"]["params"]["lensK"])
    if k != d["lensCurvature"]:
        die(f"{path.name}: lens curvature {d['lensCurvature']} != the 2 s row's {k}")
    # equivalent motion over the whole master (quad centroid, top/bottom edge angle, mean edge scale)
    cx = (C["ul"][:, 0] + C["ur"][:, 0] + C["ll"][:, 0] + C["lr"][:, 0]) / 4 * W
    cy = (C["ul"][:, 1] + C["ur"][:, 1] + C["ll"][:, 1] + C["lr"][:, 1]) / 4 * H
    ang = np.degrees((np.arctan2((C["ur"][:, 1] - C["ul"][:, 1]) * H, (C["ur"][:, 0] - C["ul"][:, 0]) * W)
                      + np.arctan2((C["lr"][:, 1] - C["ll"][:, 1]) * H, (C["lr"][:, 0] - C["ll"][:, 0]) * W)) / 2)
    sc = ((C["ur"][:, 0] - C["ul"][:, 0] + C["lr"][:, 0] - C["ll"][:, 0]) / 2
          + (C["ll"][:, 1] - C["ul"][:, 1] + C["lr"][:, 1] - C["ur"][:, 1]) / 2) / 2
    # edge coverage through the engine: every output border pixel samples the corner-pinned layer at the chained
    # lens displacement (4 passes of k*5.4*nx*r/4 px, MotionShake/lensMap); it must land inside the pinned quad
    xs, ys = np.arange(0, W + 1, 8.0), np.arange(0, H + 1, 8.0)
    B = np.concatenate([np.stack([xs, np.zeros_like(xs)], 1), np.stack([xs, np.full_like(xs, H)], 1),
                        np.stack([np.zeros_like(ys), ys], 1), np.stack([np.full_like(ys, W), ys], 1)])
    fx, fy = B[:, 0].copy(), B[:, 1].copy()
    for _ in range(4):
        nx, ny = (fx - W / 2) / (H / 2), (fy - H / 2) / (H / 2)
        r = np.hypot(nx, ny)
        fx, fy = fx + k * LENS_PX_PER_K * nx * r / 4, fy + k * LENS_PX_PER_K * ny * r / 4
    worst, worst_t = 1e9, None
    for i in range(d["keys"]):
        P = [(C["ul"][i, 0] * W, C["ul"][i, 1] * H), (C["ur"][i, 0] * W, C["ur"][i, 1] * H),
             (C["lr"][i, 0] * W, C["lr"][i, 1] * H), (C["ll"][i, 0] * W, C["ll"][i, 1] * H)]
        m = np.full(len(fx), 1e9)
        for a, b in zip(P, P[1:] + P[:1]):
            ex, ey = b[0] - a[0], b[1] - a[1]
            m = np.minimum(m, (ex * (fy - a[1]) - ey * (fx - a[0])) / math.hypot(ex, ey))
        if m.min() < worst:
            worst, worst_t = float(m.min()), i * d["keyStep"]
    if worst <= 0:
        die(f"{path.name}: an edge would be exposed at t = {worst_t:.2f} s ({worst:.1f} px)")
    return {
        "n": n, "keys": d["keys"], "dur": d["durationSeconds"], "lensK": k, "kb": path.stat().st_size / 1e3,
        "tx": float(cx.max() - cx.min()), "ty": float(cy.max() - cy.min()), "rot": float(ang.max() - ang.min()),
        "scale": float(sc.mean()), "edge_margin": worst, "edge_t": worst_t,
    }


# ------------------------------------------------------------------ measure: pumpkin
def measure_pumpkin():
    if not PUMPKIN.is_file():
        die(f"pumpkin plate missing: {PUMPKIN} (run with --ingest-pumpkin <source .mov>)")
    pr = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(PUMPKIN)]))
    streams = pr["streams"]
    if len(streams) != 1 or streams[0]["codec_type"] != "video":
        die(f"pumpkin plate must hold exactly one video stream and no audio, has {[s['codec_type'] for s in streams]}")
    v = streams[0]
    if (v["codec_name"], v["width"], v["height"], v["r_frame_rate"]) != ("vp9", W, H, "30/1"):
        die(f"pumpkin plate is {v['codec_name']} {v['width']}x{v['height']} @ {v['r_frame_rate']}, expected vp9 1920x1080 @ 30")
    if str((v.get("tags") or {}).get("alpha_mode", (v.get("tags") or {}).get("ALPHA_MODE", ""))) != "1":
        die("pumpkin plate carries no alpha_mode=1 tag (the VP9 alpha plane is missing)")
    # per-frame alpha through the libvpx decoder (ffmpeg's native vp9 decoder drops the alpha plane), 480x270
    w, h = 480, 270
    raw = run(["ffmpeg", "-v", "error", "-c:v", "libvpx-vp9", "-i", str(PUMPKIN), "-vf",
               f"alphaextract,scale={w}:{h}:flags=area", "-f", "rawvideo", "-pix_fmt", "gray", "-"], binary=True)
    nfr = len(raw) // (w * h)
    if nfr < js_round(PUMPKIN_WIN_S * COMP_FPS):
        die(f"pumpkin plate has {nfr} frames, the window needs {js_round(PUMPKIN_WIN_S * COMP_FPS)}")
    A = np.frombuffer(raw[: nfr * w * h], dtype=np.uint8).reshape(nfr, h, w)
    if A.min() == 255 or A.max() == 0:
        die("pumpkin plate alpha is flat (no transparency survived the transcode)")
    # placement: Scale 113 % about the centre, y +15 px at 1080p -> output pixel (x, y) samples plate pixel
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    sx = (xx + 0.5 - w / 2) / PUMPKIN_SCALE + w / 2
    sy = (yy + 0.5 - h / 2 - PUMPKIN_DY * h / H) / PUMPKIN_SCALE + h / 2
    inside = (sx >= 0) & (sx < w) & (sy >= 0) & (sy < h)
    ix, iy = np.clip(sx.astype(int), 0, w - 1), np.clip(sy.astype(int), 0, h - 1)
    cov = []
    for f in range(nfr):
        placed = np.where(inside, A[f][iy, ix], 0)
        cov.append(float((placed > 0.95 * 255).mean()))
    win = js_round(PUMPKIN_WIN_S * COMP_FPS)
    swap = js_round(PUMPKIN_SWAP_S * COMP_FPS)
    cut = round((swap - 0.5) / (win - 1), 4)
    first_b = next(f for f in range(win) if f / (win - 1) >= cut)
    if first_b != swap:
        die(f"pumpkin cut {cut} swaps on frame {first_b}, expected {swap}")
    first90 = next((f for f in range(nfr) if cov[f] >= 0.90), None)
    return {
        "frames": nfr, "mb": PUMPKIN.stat().st_size / 1e6, "win": win, "swap": swap, "cut": cut,
        "cov": cov, "cov_swap": cov[swap], "cov_19": cov[js_round(1.9 * COMP_FPS)], "cov_0": cov[0],
        "first90": first90, "cov_max": max(cov[:win]), "alpha_min": int(A.min()), "alpha_max": int(A.max()),
        "flash_vs_cut_s": round((swap - js_round(win / 2)) / COMP_FPS, 2),
        "start_vs_cut_s": round(-js_round(win / 2) / COMP_FPS, 2),
        "md5": hashlib.md5(PUMPKIN.read_bytes()).hexdigest()[:10],
    }


# ------------------------------------------------------------------ rows
def shake_row(m, n):
    preset, used = SHAKES[n]
    return {
        "id": f"motion-shake-optics-{n}-long",
        "category": "MOTION",
        "variant": "Shake Optics",
        "intensity": f"{n} long",
        "label": f"Motion · Shake Optics · {n} long",
        "engine": "MotionShake",
        "kind": "geometric",
        "fidelity": "approximate",
        "durationSeconds": SHAKE_DEMO_S,
        "params": {
            "mode": "corner",
            "track": f"transitions/lib/shake/motion-shake-optics-{n}-60s.json",
            "trackStart": 0,
            "trackSeconds": m["dur"],
            "lensK": m["lensK"],
        },
        "sfx": None,
        "demoSameScene": True,
        "used_in": [],
        "meta": {
            "aspectRatios": ["16:9"],
            "resolution": "1920x1080",
            "family": "Motion Shake Optics",
            "engineFile": "remotion/src/transitions/engines/MotionShake.tsx",
            "description": (f"Projective camera shake through a slight barrel lens (curvature {m['lensK']:g}) over ONE "
                            f"scene, intensity {n}, running the WHOLE baked 60 s handheld master (the 2 s row "
                            f"motion-shake-optics-{n} stops at 2.08 s and freezes): a slow floaty sway with perspective "
                            f"breathing, never a jitter, up to {m['tx']:.0f} px side to side, {m['ty']:.0f} px up and "
                            f"down and {m['rot']:.1f} deg of roll over the full master. The corner pin's "
                            f"{(m['scale'] - 1) * 100:.1f} % overscan plus the lens bulge keep every edge covered for "
                            f"all 60 s (checked key by key, tightest {m['edge_margin']:.0f} px). It starts dead on "
                            f"the shot's first frame and stops dead on its last, no ease. Bear Markets held it on "
                            f"Mike's seated face {used}, right after a montage / photo cut-away."),
            "energy": "medium",
            "durationSeconds": SHAKE_DEMO_S,
            "hasSound": False,
            "fidelity": "approximate",
            "tags": ["motion", "shake", "handheld", "shake-optics", n, "long", "face", "sway", "unsettling",
                     "horror", "bear-markets"],
            "useWhen": (f"A FACE hold that should feel unsettled (tension / horror register, the Bear Markets look): "
                        f"the shake wraps the whole face shot, typically 2.5 to 6 s, any hold up to "
                        f"{m['dur']:g} s (params.trackSeconds). Not a cut: no A/B swap, no SFX. Mount the engine "
                        f"for the shot (<Sequence from={{shotStart}} durationInFrames={{hold}}>; its clock IS the "
                        f"master time, so no ping-pong) with the face as outClip: hard on at the shot's first frame "
                        f"(Bear Markets hid that start under a Glass Blocks split), hard off at its last. "
                        f"durationSeconds ({SHAKE_DEMO_S:g} s) is only the demo / default hold. Copy "
                        f"lib/shake/motion-shake-optics-{n}-60s.json into the project's public dir "
                        f"(lint_transition_assets.py checks it). params.trackStart offsets into the master "
                        f"(default 0, as the source) to vary repeated holds."),
        },
    }


def punch_row():
    return {
        "id": "zoom-mirror-punch-in",
        "category": "ZOOM",
        "variant": "Mirror Punch",
        "intensity": "In",
        "label": "Zoom · Mirror Punch · In",
        "engine": "MirrorZoomPunch",
        "kind": "geometric",
        "fidelity": "near-1:1",
        "durationSeconds": PUNCH_WIN_S,
        "params": PUNCH_PARAMS,
        "sfx": None,
        "used_in": [],
        "meta": {
            "aspectRatios": ["16:9"],
            "resolution": "1920x1080",
            "family": "Zoom Mirror Punch",
            "engineFile": "remotion/src/transitions/engines/MirrorZoomPunch.tsx",
            "description": ("Mirror zoom punch on a cut TO the face (Finzar 'Nice Camera Shake' preset): the incoming "
                            "shot lands as a 3x3 mirror-tiled kaleidoscope grid (a 1/3-size copy in the centre, true "
                            "mirror copies around it), skewed 10 deg on the 135 deg diagonal and lifted 20 px, then "
                            "slams to full frame (100 -> 300 %, a launch-fast long-landing ease, 0.333 s) while the "
                            "skew settles to 0 and a vertical bounce (+80 / -40 / -16 px) settles by 0.417 s, all "
                            "under a 360 deg motion-blur smear. The outgoing shot is untouched: a hard cut into the "
                            "punch."),
            "energy": "high",
            "durationSeconds": PUNCH_WIN_S,
            "hasSound": False,
            "fidelity": "near-1:1",
            "tags": ["zoom", "punch", "mirror", "kaleidoscope", "tile", "skew", "bounce", "face", "cut-in",
                     "motion-blur", "finzar", "bear-markets"],
            "useWhen": ("A cover (b-roll / still) -> FACE cut-in with impact, as Bear Markets did at 0:54.3 (masked-man "
                        "b-roll -> Mike): role face-cut. The window is centred on the cut: the outgoing shot plays "
                        "untouched for 0.43 s, the face appears EXACTLY on the TransitionClip cut frame and punches "
                        "for 0.42 s. A deliberate accent: a few per video, never on every face cut, never on a text "
                        "container, chart or card. No SFX (none in the source); pair a catalog impact only if the "
                        "plan wants one. Over live video the engine draws the face 9 times per motion-blur sample "
                        "(16) for the 13 punch frames: heavier than a still, fine for one beat."),
        },
    }


def pumpkin_row(m):
    return {
        "id": "scary-pumpkin-fire",
        "category": "SCARY",
        "variant": "Fire Plate",
        "intensity": "pumpkin",
        "label": "Scary · Fire Plate · Pumpkin",
        "engine": "AlphaPlate",
        "kind": "footage",
        "fidelity": "near-1:1",
        "durationSeconds": PUMPKIN_WIN_S,
        "params": {
            "plate": "transitions/lib/scary/scary-pumpkin-fire.webm",
            "plateFps": 30,
            "cut": m["cut"],
            "fadeIn": PUMPKIN_FADE_IN,
            "fadeOut": PUMPKIN_FADE_OUT,
            "opacity": 1,
            "scale": PUMPKIN_SCALE,
            "offsetX": 0,
            "offsetY": PUMPKIN_DY,
        },
        "sfx": None,
        "used_in": [],
        "meta": {
            "aspectRatios": ["16:9"],
            "resolution": "1920x1080",
            "family": "Scary Fire Plate",
            "engineFile": "remotion/src/transitions/engines/AlphaPlate.tsx",
            "description": (f"Horror act-break plate (pumpkin): real transparent footage of a carved jack-o-lantern "
                            f"whose face glows, then bursts into fire (from +0.7 s) that spreads over the frame "
                            f"({m['cov_19'] * 100:.0f} % opaque at +1.9 s, {m['cov_swap'] * 100:.0f} % at the swap), "
                            f"laid over the cut at 113 % (y +15 px) after a 1.0 s dissolve in from nothing. The scene "
                            f"underneath keeps playing around the pumpkin until the fire takes the frame; the A->B "
                            f"swap hides in the fire at +{PUMPKIN_SWAP_S:g} s, then the plate dissolves away over the "
                            f"incoming scene in 1.0 s. The source has NO sound."),
            "energy": "high",
            "durationSeconds": PUMPKIN_WIN_S,
            "hasSound": False,
            "fidelity": "near-1:1",
            "tags": ["scary", "halloween", "horror", "pumpkin", "fire-orange", "fire", "alpha", "plate",
                     "act-break", "chapter-break", "bear-markets"],
            "useWhen": (f"Halloween / horror register ONLY: the ACT BREAK into a new chapter, once per video (Bear "
                        f"Markets ran it into its 1929-crash chapter at 1:16.4 while Mike kept talking under it). "
                        f"It is LONG ({PUMPKIN_WIN_S:g} s): it fades in over the end of the outgoing chapter (the VO "
                        f"keeps running) and the chapter change happens at its fade-out, {m['flash_vs_cut_s']:+.2f} s "
                        f"from the TransitionClip cut frame (the plate starts {m['start_vs_cut_s']:+.2f} s from it): "
                        f"pass cutFrame = chapter change {-m['flash_vs_cut_s']:+.2f} s, or mount it in its own "
                        f"Sequence starting {PUMPKIN_SWAP_S:g} s before the change. Role scene-cut, bucket = the cut's "
                        f"own (face when it starts over Mike); never a card, container, chart or clip insert. Subject "
                        f"pumpkin (one subject per video: it pairs with scary-6 / scary-6-normal75). No sound in the "
                        f"source (sfx null): pair a catalog fire whoosh or impact in the plan if wanted."),
        },
    }


def normal75_row(s6):
    p6 = s6["params"]
    win = js_round(s6["durationSeconds"] * COMP_FPS)
    swap = next(f for f in range(win) if f / (win - 1) >= p6["cut"])
    flash_s = round(swap / COMP_FPS, 2)
    off = round((swap - js_round(win / 2)) / COMP_FPS, 2)
    dur = s6["durationSeconds"]
    return {
        "id": "scary-6-normal75",
        "category": "SCARY",
        "variant": "Stinger",
        "intensity": "6 normal75",
        "label": "Scary · Stinger · 6 normal 75",
        "engine": "StingerPlate",
        "kind": "footage",
        "fidelity": "approximate",
        "durationSeconds": dur,
        "params": {
            "plate": p6["plate"],
            "plateFps": p6["plateFps"],
            "cut": p6["cut"],
            "blend": "normal",
            "opacity": 0.6,
            "visible": p6.get("visible"),
        },
        "sfx": s6["sfx"],
        "used_in": [],
        "meta": {
            "aspectRatios": ["16:9"],
            "resolution": "1920x1080",
            "family": "Scary Stinger",
            "engineFile": "remotion/src/transitions/engines/StingerPlate.tsx",
            "description": (f"The Bear Markets look of scary-6 (pumpkin): the same carved jack-o-lantern stinger plate "
                            f"and baked sound, laid over the cut with a NORMAL blend at 60 % (the gamma-space stand-in "
                            f"for Premiere's linear-light Normal 75 %): the plate's black head and tail DIM the footage "
                            f"for the whole {dur:g} s, the grey grin rushes in over it, the white flash blows the frame "
                            f"out with the scene still faintly showing through. The swap sits in the white-out at "
                            f"{flash_s:.2f} s."),
            "energy": "high",
            "durationSeconds": dur,
            "hasSound": True,
            "fidelity": "approximate",
            "tags": ["scary", "halloween", "horror", "pumpkin", "fire-orange", "grey", "jump-scare", "stinger",
                     "flash", "normal-blend", "dim", "bear-markets"],
            "useWhen": (f"Halloween / horror register ONLY. Pick it over scary-6 (screen, the face haunts the footage) "
                        f"when the footage should DARKEN under the stinger: a FACE-TO-FACE cut (same speaker, new set) "
                        f"on a held punch-in, exactly Bear Markets 1:44.6 (Mike zoomed 100 -> 200 % first by the effects "
                        f"theme's hw-zoom-punch, then this over the cut). The scene stays about 40 % visible through "
                        f"the flash, so a cover cut whose change must vanish wants scary-6. Same timing as scary-6: "
                        f"the flash fires {off:+.2f} s from the TransitionClip cut frame; the baked sound starts at "
                        f"the window start (the post-mix puts it at tc - duration_s / 2, so duration_s must equal "
                        f"durationSeconds). One subject per video (pumpkin)."),
        },
    }


# ------------------------------------------------------------------ merge
def merge(rows):
    raw, doc = load_lib()
    if js_dump(doc).encode("utf-8") != raw:
        die("library.json does not round-trip byte-identically through the JS-compatible serializer; "
            "refusing to write (it would reformat other rows)")
    old = doc["transitions"]
    mine = set(IDS)
    before = {r["id"]: json.dumps(r, sort_keys=True) for r in old if r["id"] not in mine}
    new = {r["id"]: r for r in rows}
    merged, placed = [], set()
    for r in old:
        if r["id"] in new:
            merged.append(new[r["id"]])
            placed.add(r["id"])
        else:
            merged.append(r)
    # first build: each new row goes right after its family's last row (gallery + scan order stay grouped)
    for r in rows:
        if r["id"] in placed:
            continue
        anchor = {"motion-shake-optics-2x-long": "motion-shake-optics-6x",
                  "motion-shake-optics-3x-long": "motion-shake-optics-2x-long",
                  "scary-6-normal75": "scary-6"}.get(r["id"])
        idx = next((i for i, x in enumerate(merged) if x["id"] == anchor), None)
        if idx is None:
            idx = max((i for i, x in enumerate(merged) if x["category"] == r["category"]), default=len(merged) - 1)
        merged.insert(idx + 1, r)
        placed.add(r["id"])
    doc["transitions"] = merged
    if DOC_NOTE.strip() not in doc["$doc"]:
        doc["$doc"] = doc["$doc"] + DOC_NOTE
    after = {r["id"]: json.dumps(r, sort_keys=True) for r in merged if r["id"] not in mine}
    if before != after:
        die("merge would change a row this build does not own")
    if len({r["id"] for r in merged}) != len(merged):
        die("duplicate ids after merge")
    out = js_dump(doc).encode("utf-8")
    LIB_JSON.write_bytes(out)
    return len(old), len(merged), raw != out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--ingest-shake", help="folder holding motion-shake-optics-{2x,3x}-60s-cornerpin.json (the study exports)")
    ap.add_argument("--ingest-pumpkin", help="the 4K ProRes 4444 alpha source evil-pumpkin-with-fire-...-utc.mov")
    ap.add_argument("--report", action="store_true", help="print the measurements, write nothing")
    a = ap.parse_args()
    _, doc = load_lib()
    by_id = {r["id"]: r for r in doc["transitions"]}
    if a.ingest_shake:
        ingest_shake(Path(a.ingest_shake), by_id)
    if a.ingest_pumpkin:
        ingest_pumpkin(Path(a.ingest_pumpkin))
    sm = {n: measure_shake(n, by_id) for n in SHAKES}
    pm = measure_pumpkin()
    s6 = by_id.get("scary-6")
    if not s6 or s6.get("engine") != "StingerPlate":
        die("library row scary-6 (StingerPlate) missing: run _build-scary-rows.py first")
    print(f"\n{'shake':6} {'keys':>5} {'dur s':>6} {'lensK':>6} {'tx px':>6} {'ty px':>6} {'roll':>5} {'overscan':>8} "
          f"{'edge margin':>12} {'KB':>5}")
    for n, m in sm.items():
        print(f"{n:6} {m['keys']:>5} {m['dur']:>6} {m['lensK']:>6g} {m['tx']:>6.0f} {m['ty']:>6.0f} {m['rot']:>5.2f} "
              f"{(m['scale'] - 1) * 100:>7.2f}% {m['edge_margin']:>7.1f} px@{m['edge_t']:.2f}s {m['kb']:>5.0f}")
    print(f"\npumpkin plate: {pm['frames']} frames, {pm['mb']:.1f} MB, md5 {pm['md5']}, alpha {pm['alpha_min']}-{pm['alpha_max']}; "
          f"window {pm['win']} f, swap frame {pm['swap']} (cut {pm['cut']}), swap {pm['flash_vs_cut_s']:+.2f} s from "
          f"the TransitionClip cut frame")
    cov = pm["cov"]
    print("  opaque share (alpha > 0.95) at 113 % / y +15: " + " · ".join(
        f"+{f / COMP_FPS:.1f}s {cov[f] * 100:.0f}%" for f in (0, 21, 30, 45, 57, 63, 90, 150, 240, 270, pm['swap'], pm['win'] - 1)))
    print(f"  first frame >= 90 %: {pm['first90']} (+{(pm['first90'] or 0) / COMP_FPS:.2f} s), max {pm['cov_max'] * 100:.1f} %")
    if a.report:
        return
    rows = [shake_row(sm["2x"], "2x"), shake_row(sm["3x"], "3x"), punch_row(), pumpkin_row(pm), normal75_row(s6)]
    n_old, n_new, changed = merge(rows)
    print(f"\nBEAR MARKETS BUILD OK: {len(rows)} rows merged into {LIB_JSON.name} ({n_old} -> {n_new} rows"
          f"{'' if changed else ', file unchanged'})")


if __name__ == "__main__":
    main()
