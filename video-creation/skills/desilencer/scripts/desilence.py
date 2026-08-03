"""
desilence.py — CANONICAL silence removal for ALL tracks (shorts, longform-edited, longform-presentation).

This is the ONE place silence detection lives. Read `desilencer/desilencer.md` before using it.

METHOD (FIXED — Mike's Audition workflow, validated 2026-05-23; do NOT change the thresholds):
  - Dual-threshold level detector on per-20 ms RMS (via ffmpeg astats), NOT single-threshold
    `silencedetect` (that is peak-sensitive and a tiny lip-click/breath onset spiking to ~-40 dB
    fools it into thinking a clean -65 dB pause is "audio"). silencedetect is BANNED for cut edges.
  - silence < -57 dBFS, audio > -52 dBFS (5 dB hysteresis). A word's decaying tail stays audible
    down to ~-55 dB, so it is correctly KEPT (above -57) and never clipped.
  - min-audio 250 ms: an audio blip shorter than this (click, lip-smack, breath onset) is absorbed
    into the surrounding silence, so it cannot protect a pause from being cut.
  - DECLICK every join: 8 ms audio fade-in/out on each kept segment -> every splice lands at zero
    amplitude -> no pop. (NOT padding; it does not extend kept audio or change pacing.)
  - Video + audio are cut on the SAME keep-spans (one filter_complex, trim+atrim+concat) so they
    stay frame-locked. Works on audio-only inputs too.

WHAT IS A PARAMETER (per Mike): the MIN-SILENCE DURATION — how long a quiet gap must be before it
gets cut. He routinely asks for 200 ms, 600 ms, etc. Single value via --min-sil, OR two zones via
--split/--sil-pre/--sil-post (e.g. tight 200 ms intro, looser 600 ms body). The -57/-52 thresholds
are the METHOD and are NOT exposed as a knob (dialing them hot is what clips words).

Usage:
  # single zone, 600 ms
  python desilence.py in.mp4 --out out.mp4 --min-sil 0.6
  # two zones: 200 ms before 18s, 600 ms after
  python desilence.py in.mp4 --out out.mp4 --split 18 --sil-pre 0.2 --sil-post 0.6
  # export the cut/keep map so a downstream editor can remap its cue times
  python desilence.py in.mp4 --out out.mp4 --min-sil 0.6 --map-out map.json

RENDER TRANSPORT (2026-08-02, method UNCHANGED): the original single filtergraph
(every keep-span as a trim/atrim branch into one concat) is O(spans x frames) and
STALLED live on an hour-long livestream (878 spans: ~17% output in ~110 min, ffmpeg
pegged on one core — what-if-1000x Lane 1). Above RENDER_BATCH_AUTO spans the render
now runs in seek-windowed BATCHES: each batch input-seeks its window, applies the
IDENTICAL trim/atrim + 8 ms afade declick graph (times shifted), encodes with the
IDENTICAL codec params, and the parts are concat-demuxer stream-copied. Same cut
points, same fades, same output — different transport. Small files (shorts, chapter
files) still take the original single-pass path, byte-for-byte the same behavior.
--render-batch N forces a batch size (testing); 0 = auto. Also stdout is now
line-buffered so long renders stream progress instead of buffering it silently.
"""
import argparse, json, os, re, subprocess, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace",
                              line_buffering=True)

# FIXED METHOD CONSTANTS — do not expose as CLI knobs (see module docstring).
#   MIN_AUD = blip-absorb ceiling: an audio island shorter than this is treated as a click/lip-smack
#   and folded into the surrounding silence. MUST stay BELOW the shortest real word (~120 ms) or it
#   eats words: the shorts tool's 0.25 swallowed short words like "for"/"to" when they sat between two
#   pauses (silverscript, 2026-06-13 — "for two years" became "two years"). 0.08 absorbs true clicks
#   (<60 ms) while preserving every real word.
SIL_TH, AUD_TH, MIN_AUD, WIN = -57.0, -52.0, 0.08, 0.02
FADE = 0.008  # 8 ms declick fade at each kept-segment edge
# Batched-render thresholds (transport only, see header). Auto-batch above 60 spans;
# 40 spans/window keeps each part's filtergraph tiny and each render seconds long.
RENDER_BATCH_AUTO, RENDER_BATCH_SIZE = 60, 40


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]
    ).decode().strip())


def has_video(p):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
         "stream=codec_type", "-of", "csv=p=0", p]).decode().strip()
    return "video" in out


def levels(f):
    """Per-WIN (20 ms) RMS level in dBFS via ffmpeg astats -> [(t, rms_db), ...]."""
    n = int(round(44100 * WIN))
    r = subprocess.run(
        ["ffmpeg", "-i", f, "-af",
         f"aresample=44100,asetnsamples=n={n}:p=0,astats=metadata=1:reset=1,ametadata=print",
         "-f", "null", "-"], capture_output=True, text=True)
    ts = [float(x) for x in re.findall(r'pts_time:([\d.]+)', r.stderr)]
    vs = [(-100.0 if x in ('-inf', 'nan') else float(x))
          for x in re.findall(r'lavfi\.astats\.Overall\.RMS_level=(-?[\d.]+|-inf|nan)', r.stderr)]
    m = min(len(ts), len(vs))
    return [(ts[i], vs[i]) for i in range(m)]


def coalesce(regs):
    out = []
    for typ, s, e in regs:
        if out and out[-1][0] == typ:
            out[-1][2] = e
        else:
            out.append([typ, s, e])
    return out


def regions(lv):
    """Hysteresis state machine -> [['aud'|'sil', s, e], ...]. Short audio blips (< MIN_AUD)
    are absorbed into silence so clicks/breath-onsets can't protect a pause. NO min-silence
    collapse here — which silences to actually CUT is a zone decision made by the caller."""
    if not lv:
        return []
    regs = []
    st = 'sil'
    start = lv[0][0]
    for t, v in lv:
        if st == 'sil' and v > AUD_TH:
            regs.append(['sil', start, t]); st = 'aud'; start = t
        elif st == 'aud' and v < SIL_TH:
            regs.append(['aud', start, t]); st = 'sil'; start = t
    regs.append([st, start, lv[-1][0] + WIN])
    for r in regs:                       # absorb tiny audio blips (clicks/lip-smacks)
        if r[0] == 'aud' and (r[2] - r[1]) < MIN_AUD:
            r[0] = 'sil'
    return coalesce(regs)


def zone_cuts(regs, split, sil_pre, sil_post, pad):
    """For each SILENCE region, cut it if it is >= the zone's min-silence. Keep shorter gaps
    (natural cadence). pad leaves a sliver of silence on each side (default 0 — declick handles
    clicks, so no pad is needed; the -57 floor guarantees we never cut into a word tail)."""
    cuts = []
    for typ, s, e in regs:
        if typ != 'sil':
            continue
        zmin = sil_pre if s < split else sil_post
        if (e - s) >= zmin:
            a = s + pad
            b = max(a, e - pad)
            if b - a > 0.02:
                cuts.append((a, b))
    return cuts


def complement(cuts, total):
    keeps, cur = [], 0.0
    removed = 0.0
    for a, b in sorted(cuts):
        if a > cur:
            keeps.append((cur, a))
        removed += max(0.0, b - max(a, cur))
        cur = max(cur, b)
    if cur < total:
        keeps.append((cur, total))
    return keeps, removed


def _filter_script(keeps, vid, declick, t0=0.0):
    """The ONE trim/atrim(+afade declick)+concat graph, span times shifted by t0
    (0 for the single-pass path; the window start for a batched part)."""
    parts, labels = [], []
    for i, (a, b) in enumerate(keeps):
        seg = b - a
        ra, rb = a - t0, b - t0
        if vid:
            parts.append(f"[0:v]trim=start={ra:.3f}:end={rb:.3f},setpts=PTS-STARTPTS[v{i}];")
        af = f"[0:a]atrim=start={ra:.3f}:end={rb:.3f},asetpts=PTS-STARTPTS"
        if declick:
            fo = max(0.0, seg - FADE)
            af += f",afade=t=in:st=0:d={FADE},afade=t=out:st={fo:.3f}:d={FADE}"
        parts.append(af + f"[a{i}];")
        labels.append((f"[v{i}]" if vid else "") + f"[a{i}]")
    parts.append("".join(labels) + f"concat=n={len(keeps)}:v={1 if vid else 0}:a=1["
                 + ("outv][outa]" if vid else "outa]"))
    return "\n".join(parts)


def _encode_args(vid, bps, nvenc):
    args = []
    if vid:
        args += ["-map", "[outv]"]
        if nvenc:
            args += ["-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", bps, "-maxrate", "2.5M",
                     "-bufsize", "4M", "-preset", "p5"]
        else:
            args += ["-c:v", "libx264", "-preset", "slow", "-crf", "18"]
    args += ["-map", "[outa]", "-c:a", "aac", "-b:a", "192k"]
    return args


def _ffmpeg_graph(in_args, src, fc_text, fc_path, enc_args, out):
    with open(fc_path, "w", encoding="utf-8") as f:
        f.write(fc_text)
    cmd = ["ffmpeg", "-y", *in_args, "-i", src, "-filter_complex_script", fc_path,
           *enc_args, out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        os.remove(fc_path)
    except OSError:
        pass
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-2000:]); sys.exit(1)


def render(src, keeps, out, vid, bps, nvenc, declick, batch=0):
    n = len(keeps)
    enc = _encode_args(vid, bps, nvenc)
    size = batch if batch > 0 else (RENDER_BATCH_SIZE if n > RENDER_BATCH_AUTO else 0)
    if not size or n <= size:
        # single-pass path — unchanged behavior for shorts / chapter-length files
        _ffmpeg_graph([], src, _filter_script(keeps, vid, declick), out + ".filter.txt",
                      enc, out)
        return

    # batched path (see header): seek-windowed parts + stream-copy concat
    groups = [keeps[i:i + size] for i in range(0, n, size)]
    part_files = []
    try:
        for gi, g in enumerate(groups):
            w0, w1 = g[0][0], g[-1][1]
            part = f"{out}.part{gi:03d}.mp4"
            part_files.append(part)
            print(f"  render part {gi + 1}/{len(groups)}: {len(g)} spans, "
                  f"window {w0:.1f}s-{w1:.1f}s")
            _ffmpeg_graph(["-ss", f"{w0:.3f}", "-to", f"{w1 + 0.05:.3f}"], src,
                          _filter_script(g, vid, declick, t0=w0), part + ".filter.txt",
                          enc, part)
        lst = out + ".concat.txt"
        with open(lst, "w", encoding="utf-8") as f:
            for p in part_files:
                f.write("file '" + os.path.abspath(p).replace("\\", "/") + "'\n")
        r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                            "-c", "copy", "-fflags", "+genpts", out],
                           capture_output=True, text=True)
        try:
            os.remove(lst)
        except OSError:
            pass
        if r.returncode != 0:
            print("FFMPEG FAIL (concat):\n", r.stderr[-2000:]); sys.exit(1)
    finally:
        for p in part_files:
            try:
                os.remove(p)
            except OSError:
                pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", required=True)
    ap.add_argument("--min-sil", type=float, default=0.25,
                    help="single-zone min silence to cut (sec). Default 0.25.")
    ap.add_argument("--split", type=float, default=None,
                    help="zone boundary (sec): before it use --sil-pre, after it --sil-post")
    ap.add_argument("--sil-pre", type=float, default=None, help="min silence before --split")
    ap.add_argument("--sil-post", type=float, default=None, help="min silence after --split")
    ap.add_argument("--pad", type=float, default=0.0, help="silence to leave each side (sec); default 0")
    ap.add_argument("--no-declick", action="store_true", help="disable 8 ms join fades (NOT advised)")
    ap.add_argument("--nvenc", action="store_true", help="use h264_nvenc --bps instead of libx264 crf18")
    ap.add_argument("--bps", default="2M")
    ap.add_argument("--map-out", default=None, help="write cut/keep JSON (source coords) for cue remap")
    ap.add_argument("--render-batch", type=int, default=0,
                    help="force batched-render window size (0 = auto: batch only above "
                         f"{RENDER_BATCH_AUTO} spans; transport only, method unchanged)")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        print("no such file:", args.src); sys.exit(1)

    if args.split is not None:
        split = args.split
        pre = args.sil_pre if args.sil_pre is not None else args.min_sil
        post = args.sil_post if args.sil_post is not None else args.min_sil
    else:
        split, pre, post = float("inf"), args.min_sil, args.min_sil

    total = dur(args.src)
    vid = has_video(args.src)
    regs = regions(levels(args.src))
    cuts = zone_cuts(regs, split, pre, post, args.pad)
    keeps, removed = complement(cuts, total)

    zinfo = (f"zones: <{split}s>={pre*1000:.0f}ms / >={post*1000:.0f}ms"
             if split != float("inf") else f"min-sil {pre*1000:.0f}ms")
    print(f"src {total:.2f}s | {zinfo} | {len(cuts)} silence cuts = {removed:.1f}s removed "
          f"-> {len(keeps)} keeps {'(declicked)' if not args.no_declick else ''}")

    if args.map_out:
        with open(args.map_out, "w", encoding="utf-8") as f:
            json.dump({"src_total": total, "removed": removed, "out_total": total - removed,
                       "cuts": [[round(a, 3), round(b, 3)] for a, b in sorted(cuts)],
                       "keeps": [[round(a, 3), round(b, 3)] for a, b in keeps]}, f, indent=1)
        print("map ->", args.map_out)

    render(args.src, keeps, args.out, vid, args.bps, args.nvenc, not args.no_declick,
           batch=args.render_batch)
    od = dur(args.out)
    print(f"DONE  {total:.2f}s -> {od:.2f}s   out={args.out}")


if __name__ == "__main__":
    main()
