"""longform-presentation desilence PRESET: the track's standing silence definition, pinned IN CODE.

THE POLICY (Mike, 2026-10-13; tail pad widened 2026-10-14):
  * A pause >= MIN_SIL = 0.8 s is dead air and is cut. Anything shorter is natural cadence and stays
    whole (a presenter's beats cluster at 0.6-0.8 s; 800 ms sits just above that cluster, so it takes
    the dead air and leaves the delivery alone).
  * Every cut pause keeps PAD_TAIL = 0.2 s AFTER the sentence that ends it and PAD_HEAD = 0.1 s BEFORE
    the sentence that starts next, so sentences land 0.3 s apart, never back-to-back. The tail pad is the
    wider one on purpose: a word-final release after a closure (the k+s of "banks", the j of "age") is a
    short island the detector folds into the silence, and on history-of-crypto such releases measured
    up to 55 ms past the old 0.1 s tail pad (7 of 273 cuts); 0.2 s covers every measured case with
    margin (Mike heard the endings clipped, 2026-10-14).
  * ONE zone, no intro/body split.

This file holds NO detection or cutting logic. Detection (dual-threshold -57/-52 dBFS RMS, 80 ms
blip-absorb), the 8 ms declick and the frame-locked trim/atrim/concat render are all imported from the
ONE canonical tool, video-creation/skills/desilencer/scripts/desilence.py (read desilencer.md first).
This wrapper exists so the track default lives in code rather than prose (a knob that lives only in a
doc drifts the moment context rolls off: the shorts lane's 0.95 incident, 2026-08-11). It:
  1. pins MIN_SIL / PAD_TAIL / PAD_HEAD and banners any override loudly (the invocation is the deviation's record);
  2. always writes the cut/keep map beside the output (source coords; the keep joins are the natural
     sentence boundaries if a comp ever needs jump-cut anchors);
  3. runs the desilencer skill's swallowed-speech QA on the planned cuts and the A/V drift check on
     the rendered file;
  4. --dry-run previews the cut list + QA without rendering (about a minute on a 10 min file).

Usage (paths are arguments; run from anywhere):
  python video-creation/longform-presentation/skills/desilence/desilence_preset.py "media/<project>/<master>.mkv"
      -> media/<project>/<project> EDIT.mp4  (+ <project> EDIT.map.json); <project> = the folder name
  ... --out "media/<project>/<name>.mp4"   explicit output (the map goes beside it as <name>.map.json)
  ... --dry-run                            plan + QA only, no render
  ... --min-sil 0.6 --pad-tail 0.15 --pad-head 0.05
                                           an explicit DEVIATION (Mike's call; bannered, never the new default)
  ... --nvenc [--bps 2M]                   the canonical tool's NVENC proxy path (capped at 2.5 Mbps) instead
                                           of the default libx264 crf 18; crf 18 is the deliverable quality
                                           for on-screen text, NVENC is for proxies only

Input: the recording to tighten: "<project> DEFUMBLED.mp4" (Phase 1, crf 18) or the master .mkv directly when
the take needed no defumble; the crf 18 EDIT is the one lossy generation (no LOW BPS working copy on this
track, recycled 2026-10-13). Defumble FIRST if the take needs it (video-creation/skills/defumbler/defumbler.md);
this pass cuts silence only.
A >10 min encode is launched detached (visible console + log) and polled; never as a tracked
background task (OS-level memory kills take those down mid-render and leave a moov-less file).

Timeline note: the rendered EDIT runs a few ms longer per join than the map's cumulative keep lengths (the
video side of a join rounds up to the next frame and the concat pads the audio with silence to match; measured
+1.7 s over 273 joins on history-of-crypto). Cue work therefore runs on a transcript OF THE EDIT, never on the
map's arithmetic.
"""
import argparse, json, os, subprocess, sys, time

MIN_SIL = 0.8        # s: a pause this long or longer is dead air -> cut
PAD_TAIL = 0.2       # s kept AFTER the sentence that ends a cut pause (word-final releases live here)
PAD_HEAD = 0.1       # s kept BEFORE the sentence that starts after it -> 0.3 s residual between sentences
SPEECH_FLAG = 0.10   # s of > AUD_TH audio inside a planned cut that flags it (desilencer.md QA)

HERE = os.path.dirname(os.path.abspath(__file__))
CANON_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "..", "skills", "desilencer", "scripts"))
sys.path.insert(0, CANON_DIR)
import desilence as d  # noqa: E402  the ONE silence tool; nothing here re-implements it


def tc(t):
    m, s = divmod(max(0.0, t), 60)
    return f"{int(m)}:{s:05.2f}"


def stream_dur(p, kind):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", f"{kind}:0", "-show_entries",
         "stream=duration", "-of", "csv=p=0", p]).decode().strip().rstrip(",")
    return float(out) if out else float("nan")


def qa_swallowed(lv, cuts):
    """desilencer.md QA: longest run of > AUD_TH audio inside each planned cut; flag >= SPEECH_FLAG."""
    flags = []
    for a, b in cuts:
        run = best = 0.0
        peak = -100.0
        for t, v in lv:
            if a <= t < b:
                run = run + d.WIN if v > d.AUD_TH else 0.0
                best = max(best, run)
                peak = max(peak, v)
        if best >= SPEECH_FLAG:
            flags.append((a, b, best, peak))
    return flags


def main():
    ap = argparse.ArgumentParser(
        description="longform-presentation desilence preset (wraps the canonical desilencer)")
    ap.add_argument("src", help="recording to tighten (<project> DEFUMBLED.mp4, or the master .mkv when no defumble was needed)")
    ap.add_argument("--out", default=None, help='default: "<folder>/<folder name> EDIT.mp4"')
    ap.add_argument("--min-sil", type=float, default=None,
                    help=f"DEVIATION only; the preset is {MIN_SIL}s")
    ap.add_argument("--pad-tail", type=float, default=None,
                    help=f"DEVIATION only; the preset keeps {PAD_TAIL}s after the sentence before a cut")
    ap.add_argument("--pad-head", type=float, default=None,
                    help=f"DEVIATION only; the preset keeps {PAD_HEAD}s before the sentence after a cut")
    ap.add_argument("--dry-run", action="store_true", help="plan + QA, no render")
    ap.add_argument("--nvenc", action="store_true", help="NVENC proxy encode instead of libx264 crf 18")
    ap.add_argument("--bps", default="2M", help="NVENC target bitrate (only with --nvenc)")
    args = ap.parse_args()

    src = os.path.abspath(args.src)
    if not os.path.isfile(src):
        sys.exit(f"no such file: {src}")
    folder = os.path.dirname(src)
    project = os.path.basename(folder)
    out = os.path.abspath(args.out) if args.out else os.path.join(folder, f"{project} EDIT.mp4")
    map_out = os.path.splitext(out)[0] + ".map.json"
    if os.path.abspath(out) == src:
        sys.exit("output would overwrite the input")

    min_sil = MIN_SIL if args.min_sil is None else args.min_sil
    pad_tail = PAD_TAIL if args.pad_tail is None else args.pad_tail
    pad_head = PAD_HEAD if args.pad_head is None else args.pad_head
    deviation = not (args.min_sil is None and args.pad_tail is None and args.pad_head is None)
    if not deviation:
        print(f"longform-presentation preset: min-silence {min_sil*1000:.0f} ms, residual "
              f"{(pad_tail+pad_head)*1000:.0f} ms ({pad_tail*1000:.0f} ms kept after the sentence, "
              f"{pad_head*1000:.0f} ms before the next), one zone  "
              f"[longform-presentation/skills/desilence/desilence.md]")
    else:
        print("=" * 78)
        print(f"DEVIATION from the longform-presentation preset ({MIN_SIL*1000:.0f} ms / "
              f"{PAD_TAIL*1000:.0f}+{PAD_HEAD*1000:.0f} ms pads): running min-silence {min_sil*1000:.0f} ms, "
              f"tail pad {pad_tail*1000:.0f} ms, head pad {pad_head*1000:.0f} ms.")
        print("A deviation is Mike's explicit per-video call; this banner is its record. "
              "It never becomes the default.")
        print("=" * 78)
    if not (0.15 <= min_sil <= 3.0):
        sys.exit(f"--min-sil {min_sil}s is outside the sane 0.15-3.0 s range")
    if not (0.0 <= pad_tail and 0.0 <= pad_head and pad_tail + pad_head < min_sil):
        sys.exit(f"pads {pad_tail}+{pad_head}s must be >= 0 and together below the min-silence ({min_sil:.2f}s)")

    total = d.dur(src)
    vid = d.has_video(src)
    t0 = time.time()
    print(f"analyzing {os.path.basename(src)} ({tc(total)}) ...")
    lv = d.levels(src)
    regs = d.regions(lv)
    cuts = d.zone_cuts(regs, float("inf"), min_sil, min_sil, pad_tail, pad_head)
    keeps, removed = d.complement(cuts, total)
    n_sil = sum(1 for r in regs if r[0] == "sil")
    print(f"{len(cuts)} of {n_sil} pauses are >= {min_sil*1000:.0f} ms -> {removed:.1f}s removed, "
          f"{tc(total)} -> {tc(total - removed)}  ({len(keeps)} keeps)  [{time.time()-t0:.0f}s]")
    if cuts:
        big = max(cuts, key=lambda c: c[1] - c[0])
        print(f"biggest cut {tc(big[0])} - {tc(big[1])} ({big[1]-big[0]:.1f}s)")

    with open(map_out, "w", encoding="utf-8") as f:
        json.dump({"src": src, "out": out,
                   "preset": {"min_sil": min_sil, "pad_tail": pad_tail, "pad_head": pad_head,
                              "residual": pad_tail + pad_head, "deviation": deviation},
                   "src_total": total, "removed": removed, "out_total": total - removed,
                   "cuts": [[round(a, 3), round(b, 3)] for a, b in sorted(cuts)],
                   "keeps": [[round(a, 3), round(b, 3)] for a, b in keeps]}, f, indent=1)
    print("map ->", map_out)

    flags = qa_swallowed(lv, cuts)
    if flags:
        print(f"QA swallowed-speech: {len(flags)} cut(s) hold >= {SPEECH_FLAG*1000:.0f} ms above "
              f"{d.AUD_TH:.0f} dB:")
        for a, b, run, peak in flags:
            kind = "SPEECH-LEVEL, inspect" if peak > -35 else "faint (breath-level), fine"
            print(f"  {tc(a)} - {tc(b)}: {run*1000:.0f} ms, peak {peak:.1f} dB -> {kind}")
    else:
        print("QA swallowed-speech: none (no cut holds speech-level audio)")

    if args.dry_run:
        print("DRY RUN: no render.")
        return
    if not cuts:
        print("nothing to cut; no render.")
        return

    mode = f"nvenc {args.bps}" if args.nvenc else "libx264 crf 18"
    transport = "batched" if len(keeps) > d.RENDER_BATCH_AUTO else "single pass"
    print(f"rendering -> {out}  ({mode}, {transport})")
    t1 = time.time()
    d.render(src, keeps, out, vid, args.bps, args.nvenc, True)
    od = d.dur(out)
    delta = od - (total - removed)
    tol = len(keeps) / 30.0   # every join may run to the next video frame (33 ms); measured ~6 ms avg
    print(f"DONE  {tc(total)} -> {tc(od)}  (plan {tc(total - removed)}, delta {delta:+.2f}s "
          f"{'= join frame-rounding, OK' if -0.05 <= delta <= tol else 'CHECK'}; up to {tol:.2f}s expected)  "
          f"[{(time.time()-t1)/60:.1f} min]")
    if vid:
        vd, ad = stream_dur(out, "v"), stream_dur(out, "a")
        drift = abs(vd - ad) * 1000
        print(f"A/V  video {vd:.2f}s / audio {ad:.2f}s, drift {drift:.0f} ms -> "
              f"{'OK' if drift < 50 else 'CHECK (>50 ms)'}")
    print("out =", out)


if __name__ == "__main__":
    main()
