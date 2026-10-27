#!/usr/bin/env python
"""
bake_clip_insert.py — bake the title-card pauses AND a spliced CLIP INSERT into the FINAL spine (2026-10-08, every-job R17:
Mike: "just splice this clip into our video and transition in and out" = the spine PAUSES, the clip plays with its OWN
voice in the VO track, the bed ducks under it; never a muted cover).

Renders ONE new paused spine from the SOURCE (final) spine with every pause in one sync-safe filter_complex:
  * each title card  -> freeze frame + SILENCE for pause_s (exactly bake_card_pauses.py)
  * each clip insert -> freeze frame + THE CLIP'S AUDIO for the clip's length (the comp lays the clip's PICTURE over the
    gap, with the transition in and out; the audio is already in the VO, so the mix carries it without the comp)
Every insert point is SNAPPED into a silence trough on the source spine (bake_card_pauses.snap: RMS <= -45 dB, >= 30 ms,
the lint's own containment guard); a point with no trough FAILS and prints what it measured.

Usage:
  python bake_clip_insert.py <final spine.mp4> --cards-json <spine/ALL.e.paused.json> \
         --insert "612.64:assets/receipts/R17-huang-radiology-clip.mp4:R17" [--insert ...] \
         --out <spine/ALL.f.paused.mp4> [--json <sidecar>] [--dry-run]
The cards come from the existing card sidecar (their snapped `at` is reused, no re-snap). The sidecar written carries
per-pause `dur` (cards = pause_s, inserts = the clip length) plus `clip` on the insert rows; comp and mixer read
`pauses[].at/dur` (mix_music.py sh() sums `dur`, 2026-10-08). Machine lines: INSERT-SNAP <label> planned=t at=t ... ·
BAKED <out> dur=X · PROGRESS 100%
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from bake_card_pauses import probe, snap  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def decoded_excess(path, sr):
    """seconds of audio the file DECODES beyond its frame timestamps (overlapping decoded frames add samples, gaps remove
    them). A clean encode returns 0; a desilencer join can leave a few tens of ms (retire-early 2026-10-11)."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "frame=pts,nb_samples", "-of", "csv=p=0",
                        str(path)], capture_output=True, text=True)
    prev, jumps = None, 0
    for ln in r.stdout.splitlines():
        parts = ln.strip().split(",")
        if len(parts) < 2 or not parts[0] or not parts[1]:
            continue
        pts, ns = int(parts[0]), int(parts[1])
        if prev is not None:
            jumps += pts - prev
        prev = pts + ns
    return -jumps / float(sr)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spine", help="the FINAL (source) spine, e.g. spine/ALL.d.desilenced.mp4")
    ap.add_argument("--cards-json", required=True, help="the card sidecar written by bake_card_pauses.py (snapped card times reused)")
    ap.add_argument("--insert", action="append", default=[], help='"t:clip.mp4:label" planned source time of the splice')
    ap.add_argument("--out", required=True)
    ap.add_argument("--json", default=None)
    ap.add_argument("--dry-run", action="store_true", help="snap and report only, render nothing")
    a = ap.parse_args()
    spine, out = Path(a.spine), Path(a.out)
    if not spine.is_file():
        print(f"FATAL: {spine} missing", file=sys.stderr); sys.exit(2)
    cards_meta = json.loads(Path(a.cards_json).read_text(encoding="utf-8"))
    pause_s = float(cards_meta.get("pause_s") or 1.5)
    # a card pause carries {"card": label}, a beat pause (a braam between sentences) {"beat": label}: both pass through
    pauses = [{"at": float(p["at"]), "planned": p.get("planned"), "dur": float(p.get("dur") or pause_s),
               **{k: p[k] for k in ("card", "beat") if k in p}, "sits_in": p.get("sits_in")} for p in cards_meta.get("pauses") or []]
    bad = []
    for item in a.insert:
        # "t:clip:label"; the clip path may carry a Windows drive colon (C:/...), so the label is the LAST field and the
        # path is everything between (2026-10-09: the graph passes absolute asset paths)
        parts = item.split(":")
        if len(parts) < 3:
            print(f"FATAL: --insert must be t:clip.mp4:label, got {item!r}", file=sys.stderr); sys.exit(2)
        t_s, clip_s, label = parts[0], ":".join(parts[1:-1]), parts[-1]
        t, clip = float(t_s), Path(clip_s)
        if not clip.is_file():
            bad.append(f"{label}: clip missing {clip}"); continue
        has_audio = "audio" in probe(clip, "stream=codec_type")
        if not has_audio:
            bad.append(f"{label}: {clip.name} has NO audio stream; a spliced clip must carry its own voice"); continue
        dur = float(probe(clip, "format=duration") or 0)
        at, where = snap(spine, t)
        if at is None:
            bad.append(f"{label} @{t}: {where}"); continue
        pauses.append({"at": at, "planned": t, "dur": round(dur, 3), "clip": str(clip.resolve()), "label": label, "sits_in": where})
        print(f"INSERT-SNAP {label} planned={t} at={at} dur={dur:.3f} {where}")
    if bad:
        for b in bad:
            print(f"FAIL  {b}")
        sys.exit(1)
    pauses.sort(key=lambda p: p["at"])
    if a.dry_run:
        print("DRY-RUN pauses:", json.dumps([{k: v for k, v in p.items() if k in ("at", "dur", "card", "label")} for p in pauses]))
        return
    src_dur = float(probe(spine, "format=duration") or 0)
    num, den = probe(spine, "stream=r_frame_rate", "v:0").splitlines()[0].split("/")
    fps = float(num) / float(den)
    # FRAME-EXACT (2026-10-11): every pause is a whole number of frames, rounded UP so a clip's audio is never cut short
    import math
    for p in pauses:
        p["dur_exact"] = p["dur"]
        p["frames"] = max(1, math.ceil(p["dur"] * fps - 1e-6))
        p["dur"] = round(p["frames"] / fps, 6)

    src_v = float((probe(spine, "stream=duration", "v:0").splitlines() or ["0"])[0] or src_dur)
    src_a = float((probe(spine, "stream=duration", "a:0").splitlines() or ["0"])[0] or src_dur)

    # the source's REAL frame timestamps: a desilencer join can hold one frame for two durations (tao-detailed 2026-10-17:
    # 5 such holds), so a frame INDEX is not t * fps. Indexing by round(t * fps) cut the picture one frame late after
    # every hold, concat padded the audio to match, and the VO drifted +0.17 s late by the end. Look the index up instead.
    import bisect
    pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "packet=pts_time", "-of", "csv=p=0",
                         str(spine)], capture_output=True, text=True)
    vts = sorted(float(x) for x in pr.stdout.split() if x.strip() and x.strip() != "N/A")

    def fr(t):
        """the index of the source frame nearest to time t by its real timestamp (video cuts land here; the audio cut
        stays at t). Past the last frame it returns the frame count, so fr(src_v) ends the last segment."""
        if not vts:
            return int(round(t * fps))
        return bisect.bisect_left(vts, t - 0.5 / fps)
    sr = probe(spine, "stream=sample_rate", "a:0").splitlines()[0] or "48000"
    ch = probe(spine, "stream=channel_layout", "a:0").splitlines()[0] or "stereo"
    inputs = ["-i", str(spine)]
    clip_index = {}
    for p in pauses:
        if p.get("clip") and p["clip"] not in clip_index:
            clip_index[p["clip"]] = len(inputs) // 2
            inputs += ["-i", p["clip"]]
    fparts, order, prev, k = [], [], 0.0, 0
    for p in pauses:
        at, dur = p["at"], p["dur"]
        fparts.append(f"[0:v]trim=start_frame={fr(prev)}:end_frame={fr(at)},setpts=PTS-STARTPTS[v{k}];"
                      f"[0:a]atrim=start={prev:.6f}:end={at:.6f},asetpts=PTS-STARTPTS[a{k}]")
        order += [f"[v{k}][a{k}]"]; k += 1
        # the looped frame keeps its OWN duration: a desilencer-held frame (two frame lengths) looped p['frames'] times made a
        # 1.5 s card pause 3.0 s (kcc20 2026-10-21, the CH5 card at 244.295 sat on the hold at 244.267). Re-time the loop to
        # one frame per 1/fps before counting frames.
        fparts.append(f"[0:v]trim=start_frame={fr(at)}:end_frame={fr(at) + 2},setpts=PTS-STARTPTS,loop=loop=-1:size=1:start=0,"
                      f"setpts=N/({fps:g}*TB),trim=end_frame={p['frames']},setpts=PTS-STARTPTS[v{k}]")
        if p.get("clip"):
            ci = clip_index[p["clip"]]
            fparts.append(f"[{ci}:a]atrim=start=0:end={dur:.6f},asetpts=PTS-STARTPTS,aformat=sample_rates={sr}:channel_layouts={ch},"
                          f"apad=whole_dur={dur:.6f},atrim=duration={dur:.6f}[a{k}]")
        else:
            fparts.append(f"anullsrc=r={sr}:cl={ch},atrim=duration={dur:.6f},asetpts=PTS-STARTPTS[a{k}]")
        order += [f"[v{k}][a{k}]"]; k += 1
        prev = at
    # the last segment stops at the source's REPORTED ends: decoding runs past the AAC edit list (encoder tail padding)
    fparts.append(f"[0:v]trim=start_frame={fr(prev)}:end_frame={fr(src_v)},setpts=PTS-STARTPTS[v{k}];"
                  f"[0:a]atrim=start={prev:.6f}:end={src_a:.6f},asetpts=PTS-STARTPTS[a{k}]")
    order += [f"[v{k}][a{k}]"]; k += 1
    fc = ";".join(fparts) + ";" + "".join(order) + f"concat=n={k}:v=1:a=1[vo][ao]"
    out.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc, "-map", "[vo]", "-map", "[ao]",
                        "-r", f"{fps:g}", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "192k", str(out)], capture_output=True, text=True)
    if r.returncode != 0:
        print("FATAL: ffmpeg failed\n" + r.stderr[-1500:], file=sys.stderr); sys.exit(1)
    out_dur = float(probe(out, "format=duration") or 0)
    expect = src_dur + sum(p["dur"] for p in pauses)
    v_out = float((probe(out, "stream=duration", "v:0").splitlines() or ["0"])[0] or 0)
    a_out = float((probe(out, "stream=duration", "a:0").splitlines() or ["0"])[0] or 0)
    print(f"BAKED {out} dur={out_dur:.3f} (expected {expect:.3f} = {src_dur:.3f} + pauses {sum(p['dur'] for p in pauses):.3f}; "
          f"video {v_out:.3f} audio {a_out:.3f}, frame-exact pauses)")
    pz = sum(p["dur"] for p in pauses)
    excess = decoded_excess(spine, int(float(sr)))
    dv, da = v_out - (src_v + pz), a_out - (src_a + excess + pz)
    print(f"  video {v_out:.3f} vs {src_v + pz:.3f} ({dv:+.3f}) · audio {a_out:.3f} vs {src_a + excess + pz:.3f} ({da:+.3f}; "
          f"the source decodes {excess * 1000:+.1f} ms past its audio timestamps, kept as recorded)")
    if abs(dv) > 0.07 or abs(da) > 0.1:
        print(f"FAIL  output duration off: video {dv:+.3f}s, audio {da:+.3f}s", file=sys.stderr); sys.exit(1)
    side = Path(a.json) if a.json else out.with_suffix(".json")
    side.write_text(json.dumps({"pauses": pauses, "pause_s": pause_s, "mixed_durations": True, "source": str(spine), "output": str(out),
                                "output_duration_s": round(out_dur, 3), "fps": fps,
                                "note": "every comp cue is a SOURCE time; sh(t) adds each pause's `dur` whose `at` <= t (cards = pause_s, "
                                        "clip inserts = the clip length, their audio already in this VO track)"}, indent=2), encoding="utf-8")
    print(f"WROTE {side}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
