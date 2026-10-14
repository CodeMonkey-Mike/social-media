"""longform-presentation desilence PRESET: the track's standing silence definition, pinned IN CODE.

THE POLICY (Mike, 2026-10-13):
  * A pause >= MIN_SIL = 0.8 s is dead air and is cut. Anything shorter is natural cadence and stays
    whole (a presenter's beats cluster at 0.6-0.8 s; 800 ms sits just above that cluster, so it takes
    the dead air and leaves the delivery alone).
  * Every cut pause keeps PAD = 0.1 s on EACH side, so sentences land 0.2 s apart, never back-to-back.
  * ONE zone, no intro/body split.

This file holds NO detection or cutting logic. Detection (dual-threshold -57/-52 dBFS RMS, 80 ms
blip-absorb), the 8 ms declick and the frame-locked trim/atrim/concat render are all imported from the
ONE canonical tool, video-creation/skills/desilencer/scripts/desilence.py (read desilencer.md first).
This wrapper exists so the track default lives in code rather than prose (a knob that lives only in a
doc drifts the moment context rolls off: the shorts lane's 0.95 incident, 2026-08-11). It:
  1. pins MIN_SIL / PAD and banners any override loudly (the invocation is the deviation's record);
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
  ... --min-sil 0.6 --pad 0.05             an explicit DEVIATION (Mike's call; bannered, never the new default)
  ... --nvenc [--bps 2M]                   the canonical tool's NVENC proxy path (capped at 2.5 Mbps) instead
                                           of the default libx264 crf 18; crf 18 is the deliverable quality
                                           for on-screen text, NVENC is for proxies only

Input: the recording to tighten. The master .mkv directly when nothing downstream needs a LOW BPS
working copy (no deck, no Remotion: one lossy generation, sharper screen text); otherwise the
DEFUMBLED / LOW BPS file per longform-presentation.md Phase 3. Defumble FIRST if the take needs it
(video-creation/skills/defumbler/defumbler.md); this pass cuts silence only.
A >10 min encode is launched detached (visible console + log) and polled; never as a tracked
background task (OS-level memory kills take those down mid-render and leave a moov-less file).
"""
import argparse, json, os, subprocess, sys, time

MIN_SIL = 0.8        # s: a pause this long or longer is dead air -> cut
PAD = 0.1            # s kept on EACH side of a cut -> 0.2 s residual between sentences
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
         "stream=duration", "-of", "csv=p=0", p]).decode().strip()
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
    ap.add_argument("src", help="recording to tighten (master .mkv, DEFUMBLED or LOW BPS file)")
    ap.add_argument("--out", default=None, help='default: "<folder>/<folder name> EDIT.mp4"')
    ap.add_argument("--min-sil", type=float, default=None,
                    help=f"DEVIATION only; the preset is {MIN_SIL}s")
    ap.add_argument("--pad", type=float, default=None,
                    help=f"DEVIATION only; the preset is {PAD}s each side ({2*PAD:.1f}s residual)")
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
    pad = PAD if args.pad is None else args.pad
    if args.min_sil is None and args.pad is None:
        print(f"longform-presentation preset: min-silence {min_sil*1000:.0f} ms, residual "
              f"{2*pad*1000:.0f} ms ({pad*1000:.0f} ms kept each side), one zone  "
              f"[longform-presentation/skills/desilence/desilence.md]")
    else:
        print("=" * 78)
        print(f"DEVIATION from the longform-presentation preset ({MIN_SIL*1000:.0f} ms / "
              f"{2*PAD*1000:.0f} ms residual): running min-silence {min_sil*1000:.0f} ms, "
              f"residual {2*pad*1000:.0f} ms.")
        print("A deviation is Mike's explicit per-video call; this banner is its record. "
              "It never becomes the default.")
        print("=" * 78)
    if not (0.15 <= min_sil <= 3.0):
        sys.exit(f"--min-sil {min_sil}s is outside the sane 0.15-3.0 s range")
    if not (0.0 <= pad < min_sil / 2):
        sys.exit(f"--pad {pad}s must be >= 0 and below half the min-silence ({min_sil/2:.2f}s)")

    total = d.dur(src)
    vid = d.has_video(src)
    t0 = time.time()
    print(f"analyzing {os.path.basename(src)} ({tc(total)}) ...")
    lv = d.levels(src)
    regs = d.regions(lv)
    cuts = d.zone_cuts(regs, float("inf"), min_sil, min_sil, pad)
    keeps, removed = d.complement(cuts, total)
    n_sil = sum(1 for r in regs if r[0] == "sil")
    print(f"{len(cuts)} of {n_sil} pauses are >= {min_sil*1000:.0f} ms -> {removed:.1f}s removed, "
          f"{tc(total)} -> {tc(total - removed)}  ({len(keeps)} keeps)  [{time.time()-t0:.0f}s]")
    if cuts:
        big = max(cuts, key=lambda c: c[1] - c[0])
        print(f"biggest cut {tc(big[0])} - {tc(big[1])} ({big[1]-big[0]:.1f}s)")

    with open(map_out, "w", encoding="utf-8") as f:
        json.dump({"src": src, "out": out,
                   "preset": {"min_sil": min_sil, "pad_each_side": pad, "residual": 2 * pad,
                              "deviation": not (args.min_sil is None and args.pad is None)},
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
    tol = len(keeps) / 30.0   # every join may run to the next video frame (33 ms); measured ~5 ms avg
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
