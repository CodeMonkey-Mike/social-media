"""face_swap_batch.py — build the background-swap clip for MANY face windows in one run (comp-build.md 3b, face-bg-swap.reference.md).

    python scripts/face_swap_batch.py <media/<project>> --windows <windows.json> --backdrop <img> --prompt-file <txt>
                                      [--look-ref <img>] [--parallel 3] [--only F2,F3] [--dry-run | --prep-only]

windows.json = [{"name": "F2", "window": [28.3, 31.233], "handle": 0.9, "line": "<the words spoken in it>"}, ...]   (spine seconds on the
FINAL spine; handle optional; "line" required when the prompt file is a {line} template, see main(); "max_clip_s" optional, see below)
For every window, in order: source clip (build_face_swap_source.py, --whole-seconds; --approx-src is COMPUTED from the spine
maps on disk, final -> [insert stages] -> [burst cuts] -> coarse -> defumbled: see approx_src_for), voice reference (build_swap_voice_ref.py), then the Seedance generations run `--parallel`
at a time (gen_face_swap.py, 480p), then each returned clip is re-timed onto the real voice (retime_swap_to_voice.py), given
its sidecar JSON, a preview WITH the real voice and a before/after strip under _previews/qa/bg-swap/.
A window longer than about 8 s must be split by hand at a footage join (two entries F<n>a / F<n>b, then join_face_swap_halves.py).
A window with NO join to split at may carry "max_clip_s" (Mike's call per window, e.g. only-18-months-left F4a 2026-10-26: one
11 s generation); never above 15 s, Seedance 2.0's longest clip.
--prep-only builds the sources and the voice references and stops before any credit is spent (check the words in each
_previews/qa/bg-swap/<name>-audio.mp3 against its "line" first); the generating run then takes --reuse-sources so it does not
rebuild them (a source is reused only when it is for the same window frames, final spine and handle); --dry-run builds nothing.
Machine lines: SWAP-WINDOW ok|FAIL name=<n> ... and a final SWAP-BATCH ok|FAIL summary.
"""
import argparse, json, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
FPS = 30


def run(cmd, **kw):
    # stdin closed for every child (and the ffmpeg they start, which inherit it): ffmpeg without -nostdin blocked for minutes on an
    # inherited stdin when the batch ran from a background shell (only-18-months-left F7 source, 2026-10-26: 0.6 s CPU in 7 min)
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", stdin=subprocess.DEVNULL, **kw)
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


def cut_list(p):
    """the removed spans [[start, end], ...] in the stage's INPUT time, from a desilencer map (`cuts`: [[s, e]]) or a
    burst-removal sidecar (`cuts`: [{"cut_start", "cut_end", ...}])."""
    return [[float(c["cut_start"]), float(c["cut_end"])] if isinstance(c, dict) else [float(c[0]), float(c[1])]
            for c in json.loads(p.read_text(encoding="utf-8"))["cuts"]]


def insert_stages(S, scope, above):
    """the INSERT stages lettered above `above` (the final desilence letter) -> [(letter, at, dur, file)]: a sidecar
    `<scope>.<x>.<name>.json` whose `insert` names the point it went in at, in the previous stage's time (`at_<letter>_s`), and
    the time it added (`shift_after_s`, else the insert's `dur_s`). First one: only-18-months-left `ALL.f.restored.json`
    (2026-10-26, 0.233 s of the clipped "nothing" put back at e 332.5). A sidecar of any other shape (a lead-in offset, the evals
    breath insert with `at_s`, card pauses, an audio-only pickup) is not read, so those chains map exactly as before."""
    out = []
    for p in sorted(S.glob(f"{scope}.?.*.json")):
        x = p.name[len(scope) + 1]
        if x <= above or p.name.endswith(("-words.json", ".map.json", ".cuts.json")):
            continue
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        ins = d.get("insert") if isinstance(d, dict) else None
        if not isinstance(ins, dict):
            continue
        at = next((ins[k] for k in ins if re.fullmatch(r"at_[a-z]_s", k)), None)
        dur = d.get("shift_after_s", ins.get("dur_s"))
        if isinstance(at, (int, float)) and isinstance(dur, (int, float)) and dur > 0:
            out.append((x, float(at), float(dur), p.name))
    return out


def approx_src_for(P, scope, t_final):
    """final-spine time -> a.defumbled time, back through the time-moving stages ON DISK (same chain rule as list_face_joins.py):
    first any INSERT stage lettered above the final desilence (insert_stages: t after the insert moves back by its length, t
    inside it maps to the insert point), then the FINAL desilence map = the highest-letter `<scope>.<x>.desilenced.map.json`
    above c (d on the classic chain, e after a burst stage), then any burst-removal cuts `<scope>.<y>.cleaned.mp4.cuts.json`
    lettered between c and it (cuts in c-time), then the COARSE map `<scope>.c.desilenced.map.json`. The classic chain
    (c.desilenced -> d.desilenced) maps exactly as before. Other bespoke stages (a lead-in offset, the evals breath insert, an
    audio-only pickup) are not mapped: they move time by tenths of a second and this is only the hint
    build_face_swap_source.py searches +-3 s around."""
    S = P / "spine"
    t = t_final
    finals = sorted(p for p in S.glob(f"{scope}.?.desilenced.map.json") if p.name[len(scope) + 1] > "c")
    for _x, at, dur, _f in sorted(insert_stages(S, scope, finals[-1].name[len(scope) + 1] if finals else "c"), reverse=True):
        t = t - dur if t >= at + dur else (at if t >= at else t)        # the latest stage first
    if finals:
        fl = finals[-1].name[len(scope) + 1]
        t = map_out_to_src(t, cut_list(finals[-1]))
        bursts = sorted(p for p in S.glob(f"{scope}.?.cleaned.mp4.cuts.json") if "c" < p.name[len(scope) + 1] < fl)
        for bp in reversed(bursts):
            t = map_out_to_src(t, cut_list(bp))
    c = json.loads((S / f"{scope}.c.desilenced.map.json").read_text(encoding="utf-8"))
    t_b = map_out_to_src(t, c["cuts"])
    return round(t_b, 3)          # blackout does not move time: b == a


def final_spine_of(P, scope):
    """the FINAL spine: highest letter from c up, never a lowbps / paused file (same rule as build_face_swap_source.final_spine)."""
    hits = sorted(h for h in (P / "spine").glob(f"{scope}.?.*.mp4")
                  if h.name[len(scope) + 1] >= "c" and ".lowbps." not in h.name and ".paused." not in h.name)
    return hits[-1] if hits else None


def prebuilt(P, scope, name, w0, w1, handle):
    """the source + voice reference already built for EXACTLY this window (--reuse-sources): the same window frames, the
    current final spine, the same head handle, the clip on disk and a voice reference written after it; else None (rebuild)."""
    sj = P / "assets/face-swap" / f"{name}-raw-for-higgsfield.json"
    vr = P / "_previews/qa/bg-swap" / f"{name}-audio.mp3"
    if not (sj.is_file() and vr.is_file()) or vr.stat().st_mtime < sj.stat().st_mtime:
        return None
    src = json.loads(sj.read_text(encoding="utf-8"))
    fs = final_spine_of(P, scope)
    head = int(round((handle or 0.4) * FPS))
    if (fs is None or Path(src["final_spine"]).resolve() != fs.resolve() or not Path(src["clip"]).is_file()
            or [int(x) for x in src["window_frames"]] != [int(round(w0 * FPS)), int(round(w1 * FPS))]
            or int(src["head_handle_frames"]) != min(head, int(src["source_index_of_first_window_frame"]))):
        return None
    return src


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
    # the FINAL spine (highest letter from c up), not a fixed d.desilenced: a burst-removal / lead-in / breath stage
    # adds letters (evals 2026-10-20 ends at ALL.g); same rule as build_face_swap_source.final_spine
    spine = sorted(h for h in (P / "spine").glob(f"{scope}.?.*.mp4")
                   if h.name[len(scope) + 1] >= "c" and ".lowbps." not in h.name and ".paused." not in h.name)[-1]
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
    ap.add_argument("--prep-only", action="store_true", help="build the sources + voice references, then stop before any credit is spent")
    ap.add_argument("--reuse-sources", action="store_true",
                    help="reuse a source + voice reference already built (e.g. by --prep-only) for the SAME window, final spine and handle")
    a = ap.parse_args()
    P = Path(a.project).resolve()
    wins = json.loads(Path(a.windows).read_text(encoding="utf-8"))
    if a.only:
        keep = {s.strip() for s in a.only.split(",")}; wins = [w for w in wins if w["name"] in keep]
    results = {}

    # A prompt file holding `{line}` is a TEMPLATE: every window gets its own prompt, assets/face-swap/<name>-prompt.txt,
    # with ITS spoken words pinned (windows.json "line"). Without them Seedance re-synthesises the speech and can invent
    # dialogue that the lips then follow (only-18-months-left F1 v1, 2026-10-26: "...the first wave of Jack's attack on the
    # Citadel", retime residual 280 ms, FAIL). Checked here, before any credit is spent. No `{line}`: one prompt for all, as before.
    template = Path(a.prompt_file).read_text(encoding="utf-8")
    prompt_for = {}
    for w in wins:
        n = w["name"]
        if "{line}" not in template:
            prompt_for[n] = a.prompt_file
            continue
        line = " ".join(str(w.get("line") or "").split()).rstrip(" .")
        bad = sorted(set('"%&|<>^') & set(line))          # gen_face_swap.py goes through cmd.exe (shell=True)
        if not line or bad:
            results[n] = ("FAIL", f"the prompt template needs this window's spoken words: windows.json line is "
                                  + ("missing" if not line else f"unsafe on the cmd.exe command line ({''.join(bad)})"))
            continue
        pf = P / "assets/face-swap" / f"{n}-prompt.txt"
        pf.parent.mkdir(parents=True, exist_ok=True)
        pf.write_text(template.replace("{line}", line + "."), encoding="utf-8")
        prompt_for[n] = str(pf)

    # 1 + 2: sources and voice references (sequential; slow deep into a long defumbled file, every frame lookup decodes from its start)
    for w in wins:
        n = w["name"]; w0, w1 = w["window"]; handle = w.get("handle")
        if n in results:
            print(f"[{n}] skipped: {results[n][1]}", flush=True)
            continue
        src = prebuilt(P, a.scope, n, w0, w1, handle) if a.reuse_sources and not a.dry_run else None
        if src:
            print(f"[{n}] window {w0}-{w1} ({w1 - w0:.2f}s) reusing its source ({src['clip_s']} s) + voice reference, prompt {Path(prompt_for[n]).name}", flush=True)
        else:
            approx = approx_src_for(P, a.scope, w0)
            cmd = [sys.executable, str(HERE / "build_face_swap_source.py"), str(P), "--window", f"{w0}-{w1}", "--name", n, "--approx-src", str(approx), "--whole-seconds"]
            if handle: cmd += ["--handle", str(handle)]
            print(f"[{n}] window {w0}-{w1} ({w1 - w0:.2f}s) approx-src {approx} handle {handle or 'default'} prompt {Path(prompt_for[n]).name}", flush=True)
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
        cap = min(15.0, float(w.get("max_clip_s", 8.5)))   # 8.5 = the ~8 s house rule; a per-window waiver never passes Seedance's 15 s
        if float(src["clip_s"]) > cap + 1e-6:
            results[n] = ("FAIL", f"clip {src['clip_s']} s is longer than ~8 s: split this window at a footage join ({n}a / {n}b)"
                          if "max_clip_s" not in w else f"clip {src['clip_s']} s is longer than its max_clip_s ({cap} s)"); continue
    if a.dry_run:
        return
    if a.prep_only:
        built = [w for w in wins if w["name"] not in results]
        secs = sum(float(json.loads((P / "assets/face-swap" / f"{w['name']}-raw-for-higgsfield.json").read_text(encoding="utf-8"))["clip_s"])
                   for w in built)
        for w in wins:
            if w["name"] in results:
                print(f"SWAP-WINDOW FAIL name={w['name']} {results[w['name']][1]}")
        print(f"SWAP-PREP {'ok' if not results else 'FAIL'} windows={len(built)} seconds={secs:g} est_credits={secs * 3:g} "
              f"(480p, about 3 credits a second) failed={len(results)}")
        sys.exit(1 if results else 0)

    # 3: generations, --parallel at a time
    todo = [w["name"] for w in wins if w["name"] not in results]

    def gen(n):
        cmd = [sys.executable, str(HERE / "gen_face_swap.py"), str(P), n, "--backdrop", a.backdrop, "--prompt-file", prompt_for[n]]
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
