#!/usr/bin/env python
"""
mix_short.py — audio for a longform-derived SHORT (longform-to-short.md §5C/§4/§6), as code (graph `s_mix` node).

Concats the span VO wavs (Stage A intermediates from short_extract_spans.py, clean spine audio) with a ~12 ms
crossfade at every splice (the desilenced spine leaves only a narrow trough between words; a butt joint clicks),
appends the SHARED CTA take (`video-creation/assets/vo/cta-watch-full.mp3`, "Click below to watch the full video",
Mike's cloned voice, never re-generated per project) at VO level over the outro card, lays ONE continuous bed from
MUSIC-PLAN.json (the bed that scored the hook's chapter, at its measured seat, faded out at the end), a soft whoosh
on each seam, and muxes onto the rendered short (video copied). A NO-MUSIC plan (`"no_music": true`) lays no bed and
`"no_sfx": true` drops the whoosh (pieverse 2026-11-14: Mike's "no music, no sound effects" ruling covers the short too).

Usage: python mix_short.py <media/<project>> --video <short-video.mp4> --work <_previews/short/work> [--out <mp4>]
         [--bed-db <override seat>] [--whoosh-db -14] [--no-whoosh]
Machine lines: SHORT-MIX spans=N cta=<file> bed=<chapter> · SHORT-MIX-DONE out=<file> dur=X lufs=Y peak=Z · PROGRESS 100%
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
CTA = REPO / "video-creation" / "assets" / "vo" / "cta-watch-full.mp3"
WHOOSH = REPO / "video-creation" / "assets" / "sfx" / "transition_rapid_whoosh-tight.wav"
XFADE = 0.012
LIBRARY = REPO / "video-creation" / "assets" / "music" / "library.json"
UNDER_LU = 17.0   # a bed with no measured seat sits this far under the voice (longform-presentation drone_bed.py's level)


def duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip().splitlines()[0])
    except Exception:
        return 0.0


def lufs_peak(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    k = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    return (float(m[-1]) if m else None), (float(k[-1]) if k else None)


def library_file(track_id):
    """The audio file of a music-library track id (a presentation drone plan names the track, not a repo path)."""
    row = next((r for r in json.loads(LIBRARY.read_text(encoding="utf-8"))["tracks"] if r["id"] == track_id), None)
    return REPO / "video-creation" / row["folder"] / row["primary_file"] if row else None


def seat_db(bed_file, bed_in, total, wavs):
    """Gain that puts the bed's cut UNDER_LU below the integrated loudness of the VO spans."""
    with tempfile.TemporaryDirectory() as tmp:
        vo, cut = Path(tmp) / "vo.wav", Path(tmp) / "bed.wav"
        ins = [x for w in wavs for x in ("-i", str(w))]
        subprocess.run(["ffmpeg", "-y", "-v", "error", *ins, "-filter_complex",
                        "".join(f"[{i}:a]" for i in range(len(wavs))) + f"concat=n={len(wavs)}:v=0:a=1[a]", "-map", "[a]", str(vo)], check=True)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{bed_in:.3f}", "-t", f"{total:.3f}", "-i", str(bed_file), str(cut)], check=True)
        v, b = lufs_peak(vo)[0], lufs_peak(cut)[0]
    if v is None or b is None:
        sys.exit("FATAL: could not measure the VO / bed loudness to seat the bed")
    return round(v - UNDER_LU - b, 2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--video", required=True)
    ap.add_argument("--work", required=True)
    ap.add_argument("--out", default=None)
    ap.add_argument("--bed-db", type=float, default=None)
    ap.add_argument("--whoosh-db", type=float, default=-14.0)
    ap.add_argument("--no-whoosh", action="store_true")
    a = ap.parse_args()
    proj, work, video = Path(a.project_dir).resolve(), Path(a.work).resolve(), Path(a.video).resolve()
    out = Path(a.out).resolve() if a.out else video.with_name(video.name.replace("-video.mp4", ".mp4"))
    table = json.loads((work / "spans.json").read_text(encoding="utf-8"))
    spans = table["spans"]
    if not CTA.is_file():
        print(f"FATAL: shared CTA take missing: {CTA}", file=sys.stderr)
        sys.exit(2)
    total_vo = float(table["spans_total_seconds"])
    total = duration(video)
    # the bed: the chapter the hook (first span) came from, per MUSIC-PLAN (final-time span -> source time)
    plan = json.loads((proj / "MUSIC-PLAN.json").read_text(encoding="utf-8"))
    paused = sorted(proj.glob("spine/*.paused.json"))
    meta = json.loads(paused[-1].read_text(encoding="utf-8")) if paused else {"pauses": [], "pause_s": 0}
    card_t, pause = [float(p["at"]) for p in meta.get("pauses") or []], float(meta.get("pause_s") or 0)

    def unsh(t_final):  # final -> source seconds (undo the card pauses)
        t = t_final
        for c in sorted(card_t):
            if t > c + pause:
                t -= pause
            elif t > c:
                t = c
        return t

    hook_src = unsh(float(spans[0]["src_start"]))
    bed = next((b for b in plan.get("beds") or [] if float(b["span"][0]) <= hook_src < float(b["span"][1])), (plan.get("beds") or [None])[0])
    # a NO-MUSIC plan (`"no_music": true`, Mike's ruling on record; pieverse 2026-11-14) lays NO bed under the short either,
    # and `"no_sfx": true` drops the seam whoosh: the short is then the VO spans + the shared CTA take only
    no_music = plan.get("no_music") is True
    if not bed and not no_music:
        print("FATAL: MUSIC-PLAN has no beds", file=sys.stderr)
        sys.exit(2)
    if no_music:
        bed = None
    no_whoosh = a.no_whoosh or plan.get("no_sfx") is True
    bed_file = bed_db = None
    bed_in = 0.0
    if bed:
        bed_file = REPO / bed["source_file"] if not Path(bed["source_file"]).is_absolute() else Path(bed["source_file"])
        if not bed_file.is_file() and bed.get("track_id"):
            bed_file = library_file(bed["track_id"])
        if not bed_file or not bed_file.is_file():
            print(f"FATAL: bed file not found: {bed.get('source_file')}", file=sys.stderr)
            sys.exit(2)
        bed_in = float(bed.get("source_in") or 0.0)
        bed_db = a.bed_db if a.bed_db is not None else bed.get("remotion_gain_db")
        if bed_db is None:   # no measured seat in the plan (a presentation drone bed): seat it by measurement
            bed_db = seat_db(bed_file, bed_in, total, [work / s["wav"] for s in spans])
        bed_db = float(bed_db)
    # a bed CUT shorter than its seat + the short runs out early, and the audio ended before the picture (left-behind
    # 2026-11-03: a 37 s chorus cut seated at 6.6 s ended at 30.44 s under a 31.03 s short). Seat it earlier so the bed
    # covers the whole short; the apad on the mix below is the last-resort guard (silence, never a short stream).
    bed_len = duration(bed_file) if bed else 0.0
    if bed_len and bed_in + total > bed_len:
        bed_in = max(0.0, round(bed_len - total, 3))
    print(f"SHORT-MIX spans={len(spans)} cta={CTA.name} bed="
          + (f"{bed.get('chapter')} ({bed_file.name} @{bed_in}s, {bed_db} dB)" if bed else "none (no-music plan)"))

    inputs, k = ["-i", str(video)], 1
    chains, vo_labels = [], []
    for s in spans:
        inputs += ["-i", str(work / s["wav"])]
        chains.append(f"[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo[v{k}]")
        vo_labels.append(f"[v{k}]")
        k += 1
    # crossfaded chain of the VO spans
    cur = vo_labels[0]
    for j, lab in enumerate(vo_labels[1:], 1):
        chains.append(f"{cur}{lab}acrossfade=d={XFADE}:c1=tri:c2=tri[x{j}]")
        cur = f"[x{j}]"
    vo = cur
    # CTA at VO level, starting on the outro (right after the last span, +0.15 s breath)
    inputs += ["-i", str(CTA)]
    cta_at = total_vo + 0.15
    chains.append(f"[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(cta_at * 1000)}|{int(cta_at * 1000)}[cta]")
    k += 1
    # the bed across the whole short, its seat, 0.6 s fade-out at the end
    mix = [vo, "[cta]"]
    if bed:
        inputs += ["-i", str(bed_file)]
        g = 10 ** (bed_db / 20)
        chains.append(f"[{k}:a]atrim=start={bed_in:.3f}:end={bed_in + total:.3f},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,"
                      f"afade=t=in:st=0:d=0.3,afade=t=out:st={max(0.0, total - 0.6):.3f}:d=0.6,volume={g:.6f}[bed]")
        k += 1
        mix.append("[bed]")
    if not no_whoosh and WHOOSH.is_file():
        for s in spans[1:]:
            inputs += ["-i", str(WHOOSH)]
            t = float(s["out_start"]) - 0.08
            chains.append(f"[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={10 ** (a.whoosh_db / 20):.4f},"
                          f"adelay={int(max(0, t) * 1000)}|{int(max(0, t) * 1000)}[w{k}]")
            mix.append(f"[w{k}]")
            k += 1
    # duration=longest, then trim to the picture: `duration=first` ended the audio with the LAST SPOKEN SPAN and
    # silently dropped the CTA + the bed tail (kaspa-vprogs short, caught by Mike on first watch 2026-09-29)
    fc = ";".join(chains) + ";" + "".join(mix) + f"amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={total:.3f},atrim=end={total:.3f}[ao]"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc, "-map", "0:v", "-c:v", "copy", "-map", "[ao]",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FATAL: ffmpeg failed\n" + r.stderr[-1500:], file=sys.stderr)
        sys.exit(1)
    lu, pk = lufs_peak(out)
    (proj / "short-mix.json").write_text(json.dumps({"video": str(video), "out": str(out), "spans": len(spans), "cta": str(CTA), "cta_at": cta_at,
                                                     "bed": ({"chapter": bed.get("chapter"), "file": str(bed_file), "source_in": bed_in, "gain_db": bed_db} if bed else None),
                                                     "whoosh_db": None if no_whoosh else a.whoosh_db, "lufs": lu, "peak_dbfs": pk}, indent=2), encoding="utf-8")
    print(f"SHORT-MIX-DONE out={out} dur={duration(out):.3f} lufs={lu} peak={pk}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
