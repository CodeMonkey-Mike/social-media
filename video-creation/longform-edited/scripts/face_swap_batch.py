"""face_swap_batch.py — build the background-swap clip for MANY face windows in one run (comp-build.md 3b, face-bg-swap.reference.md).

    python scripts/face_swap_batch.py <media/<project>> --windows <windows.json> --backdrop <img> --prompt-file <txt>
                                      [--look-ref <img>] [--parallel 3] [--only F2,F3] [--dry-run]

windows.json = [{"name": "F2", "window": [28.3, 31.233], "handle": 0.9}, ...]   (spine seconds on the FINAL spine; handle optional)
For every window, in order: source clip (build_face_swap_source.py, --whole-seconds; --approx-src is COMPUTED from the spine
maps, final -> coarse -> defumbled), voice reference (build_swap_voice_ref.py), then the Seedance generations run `--parallel`
at a time (gen_face_swap.py, 480p), then each returned clip is re-timed onto the real voice (retime_swap_to_voice.py), given
its sidecar JSON, a preview WITH the real voice and a before/after strip under _previews/qa/bg-swap/.
A window longer than about 8 s must be split by hand at a footage join (two entries F<n>a / F<n>b, then join_face_swap_halves.py).
Machine lines: SWAP-WINDOW ok|FAIL name=<n> ... and a final SWAP-BATCH ok|FAIL summary.
"""
import argparse, json, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
FPS = 30


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)
    return r.returncode, (r.stdout or "") + (r.stderr or "")


def map_out_to_src(t, cuts):
    """out-time -> source-time for a cut list expressed in SOURCE time ([start, end] removed)."""
    src = t
    for s, e in sorted(cuts):
        if s <= src + 1e-6:
            src += (e - s)
        else:
            break
    return src


def approx_src_for(P, scope, t_final):
    """final-spine time -> a.defumbled time through the d (final) and c (coarse) desilencer maps."""
    d = json.loads((P / "spine" / f"{scope}.d.desilenced.map.json").read_text(encoding="utf-8"))
    c = json.loads((P / "spine" / f"{scope}.c.desilenced.map.json").read_text(encoding="utf-8"))
    t_c = map_out_to_src(t_final, d["cuts"])
    t_b = map_out_to_src(t_c, c["cuts"])
    return round(t_b, 3)          # blackout does not move time: b == a


def sidecar_single(P, name, w0, w1):
    D = P / "assets/face-swap"
    src = json.loads((D / f"{name}-raw-for-higgsfield.json").read_text(encoding="utf-8"))
    clip = D / f"{name}-higgsfield-bg-swap.mp4"
    rc, out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=nb_frames,duration", "-of", "csv=p=0", str(clip)])
    dur, nb = out.strip().split(",")[0], out.strip().split(",")[1] if "," in out else ""
    rep = {}
    rj = clip.with_suffix(".retime.json")
    if rj.is_file():
        rep = json.loads(rj.read_text(encoding="utf-8"))
    at = float(src["window_starts_at_clip_s"])
    side = {"name": name, "clip": str(clip), "clip_frames": int(nb) if nb.isdigit() else None, "clip_s": round(float(dur), 3), "fps": FPS,
            "window_s": [w0, w1], "window_frames": [round(w0 * FPS), round(w1 * FPS)],
            "window_starts_at_clip_s": at, "window_starts_at_clip_frame": round(at * FPS),
            "built_from": "one generation (window under ~8 s)", "retime": rep}
    (D / f"{name}-higgsfield-bg-swap.json").write_text(json.dumps(side, indent=2), encoding="utf-8")
    return side


def preview(P, scope, name, side):
    Q = P / "_previews/qa/bg-swap"; Q.mkdir(parents=True, exist_ok=True)
    at = side["window_starts_at_clip_s"]; w0, w1 = side["window_s"]; L = w1 - w0
    spine = P / "spine" / f"{scope}.d.desilenced.mp4"
    prev = Q / f"{name}-preview-with-voice.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{at:.3f}", "-i", side["clip"], "-ss", f"{w0:.3f}", "-t", f"{L:.3f}", "-i", str(spine),
         "-map", "0:v", "-map", "1:a", "-t", f"{L:.3f}", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", str(prev)])
    try:
        from PIL import Image
        tiles = []
        for k in range(3):
            t = L * (k + 0.5) / 3
            a = Q / f"_{name}_a.png"; b = Q / f"_{name}_b.png"
            run(["ffmpeg", "-y", "-v", "error", "-ss", f"{w0 + t:.3f}", "-i", str(spine), "-frames:v", "1", str(a)])
            run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(prev), "-frames:v", "1", str(b)])
            tiles.append((Image.open(a).convert("RGB").resize((640, 360)), Image.open(b).convert("RGB").resize((640, 360))))
            a.unlink(); b.unlink()
        sheet = Image.new("RGB", (1280, 360 * len(tiles)))
        for i, (x, y) in enumerate(tiles):
            sheet.paste(x, (0, i * 360)); sheet.paste(y, (640, i * 360))
        sheet.save(Q / f"{name}-before-after.png")
    except Exception as e:  # the strip is a convenience, never a gate
        print(f"  (strip skipped for {name}: {e})")
    return prev


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project"); ap.add_argument("--windows", required=True); ap.add_argument("--backdrop", required=True)
    ap.add_argument("--prompt-file", required=True); ap.add_argument("--look-ref", default=None)
    ap.add_argument("--parallel", type=int, default=3); ap.add_argument("--only", default=None); ap.add_argument("--scope", default="ALL")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    P = Path(a.project).resolve()
    wins = json.loads(Path(a.windows).read_text(encoding="utf-8"))
    if a.only:
        keep = {s.strip() for s in a.only.split(",")}; wins = [w for w in wins if w["name"] in keep]
    results = {}

    # 1 + 2: sources and voice references (fast, sequential)
    for w in wins:
        n = w["name"]; w0, w1 = w["window"]; handle = w.get("handle")
        approx = approx_src_for(P, a.scope, w0)
        cmd = [sys.executable, str(HERE / "build_face_swap_source.py"), str(P), "--window", f"{w0}-{w1}", "--name", n, "--approx-src", str(approx), "--whole-seconds"]
        if handle: cmd += ["--handle", str(handle)]
        print(f"[{n}] window {w0}-{w1} ({w1 - w0:.2f}s) approx-src {approx} handle {handle or 'default'}", flush=True)
        if a.dry_run:
            continue
        rc, out = run(cmd)
        line = next((l for l in out.splitlines() if l.startswith("FACE-SWAP-SOURCE")), out[-300:])
        print("  ", line, flush=True)
        if rc != 0:
            results[n] = ("FAIL", "source: " + out[-300:]); continue
        rc, out = run([sys.executable, str(HERE / "build_swap_voice_ref.py"), str(P), n])
        line = next((l for l in out.splitlines() if l.startswith("SWAP-VOICE-REF")), out[-300:])
        print("  ", line, flush=True)
        if rc != 0 or "SWAP-VOICE-REF ok" not in out:
            results[n] = ("FAIL", "voice: " + out[-300:]); continue
        src = json.loads((P / "assets/face-swap" / f"{n}-raw-for-higgsfield.json").read_text(encoding="utf-8"))
        if float(src["clip_s"]) > 8.5:
            results[n] = ("FAIL", f"clip {src['clip_s']} s is longer than ~8 s: split this window at a footage join (F{n}a / F{n}b)"); continue
    if a.dry_run:
        return

    # 3: generations, --parallel at a time
    todo = [w["name"] for w in wins if w["name"] not in results]

    def gen(n):
        cmd = [sys.executable, str(HERE / "gen_face_swap.py"), str(P), n, "--backdrop", a.backdrop, "--prompt-file", a.prompt_file]
        if a.look_ref: cmd += ["--look-ref", a.look_ref]
        rc, out = run(cmd)
        line = next((l for l in out.splitlines() if l.startswith("SWAP-GEN")), out[-300:])
        print("  ", line, flush=True)
        return n, rc == 0 and "SWAP-GEN ok" in out, out

    with ThreadPoolExecutor(max_workers=max(1, a.parallel)) as ex:
        for n, ok, out in ex.map(gen, todo):
            if not ok:
                results[n] = ("FAIL", "gen: " + out[-300:])

    # 4: retime, sidecar, preview
    for w in wins:
        n = w["name"]
        if n in results: continue
        w0, w1 = w["window"]
        Q = P / "_previews/qa/bg-swap"
        rc, out = run([sys.executable, str(HERE / "retime_swap_to_voice.py"), str(Q / f"{n}-returned.mp4"), str(Q / f"{n}-audio.mp3"),
                       "--out", str(P / "assets/face-swap" / f"{n}-higgsfield-bg-swap.mp4"), "--source-json", str(P / "assets/face-swap" / f"{n}-raw-for-higgsfield.json")])
        line = next((l for l in out.splitlines() if l.startswith("SWAP-RETIME")), out[-300:])
        print(f"[{n}]", line, flush=True)
        if rc != 0 or "SWAP-RETIME ok" not in out:
            results[n] = ("FAIL", "retime: " + line); continue
        side = sidecar_single(P, n, w0, w1)
        prev = preview(P, a.scope, n, side)
        results[n] = ("ok", f"clip {side['clip_s']}s window_starts_at_clip_s={side['window_starts_at_clip_s']} preview={prev.name}")

    bad = 0
    for w in wins:
        st, msg = results.get(w["name"], ("FAIL", "not processed"))
        bad += st != "ok"
        print(f"SWAP-WINDOW {st} name={w['name']} {msg}")
    print(f"SWAP-BATCH {'ok' if bad == 0 else 'FAIL'} windows={len(wins)} failed={bad}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
