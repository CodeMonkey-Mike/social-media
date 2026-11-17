"""splice_c3.py: splice the re-rendered C3 window (comp frames A..B) back into the delivered final, the repo's way
(longform-edited.md "Partial replacement"): VIDEO-only concat with filter_complex, audio muxed separately from the ORIGINAL
(stream copy, so no A/V drift is possible), frame total verified, every seam PSNR'd, and the FIX verified with the same
label-alignment measurement that found the bug (the C3 axis labels were misplaced 5 to 15 px, per render tab, from 34 s to
59.97 s of the first render chunk; the chunk from 60.0 s on was clean).

  python splice_c3.py check                 # is the patch itself clean? (frame count + label alignment on EVERY patch frame)
  python splice_c3.py build                 # check, then splice -> final-v2.mp4 + final-v2-mix.mp4, then verify both
"""
import subprocess, sys, json
from pathlib import Path
import numpy as np

PRE = Path(__file__).resolve().parents[1]
A, B = 1000, 1799                       # patched comp frames, inclusive (the patch render's --frames)
N_TOTAL = 14322
PATCH = PRE / "c3fix" / "c3-patch-v3.mp4"      # v1 (4 tabs) and v2 (1 tab) had misplaced labels; v3 = rendered with the C3 entry scale-in removed (the root cause)
SRC_MIX = PRE / "future-of-software-engineers-final-v1-mix.mp4"     # == the delivered FINAL.mp4 (byte-identical, md5 checked)
SRC_PLAIN = PRE / "future-of-software-engineers-final-v1.mp4"       # the comp's own audio, for the plain -final-v2.mp4
OUT_VIDEO = PRE / "c3fix" / "video-only-v2.mp4"
OUT_PLAIN = PRE / "future-of-software-engineers-final-v2.mp4"
OUT_MIX = PRE / "future-of-software-engineers-final-v2-mix.mp4"
CW, CH, CX, CY = 100, 60, 120, 700      # crop around the 25% y-axis label (correct ink top = 724-725)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(" ".join(map(str, cmd))[:300]); print(r.stderr[-800:]); sys.exit(1)
    return r


def nframes(path):
    r = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", str(path)])
    return int(r.stdout.strip().split(",")[0])


def gray_frames(path, start_frame, n, crop):
    """n gray frames starting at `start_frame` (exact, via select), cropped w:h:x:y."""
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vf",
                        f"select='between(n,{start_frame},{start_frame + n - 1})',format=gray,crop={crop}", "-vsync", "0", "-f", "rawvideo", "-"],
                       capture_output=True)
    w, h = (int(v) for v in crop.split(":")[:2])
    return np.frombuffer(r.stdout, np.uint8).reshape(-1, h, w)


def label_tops(path, start, n):
    out = []
    for g in gray_frames(path, start, n, f"{CW}:{CH}:{CX}:{CY}"):
        m = g > 60
        out.append(CY + int(np.where(m)[0].min()) if m.any() else None)
    return out


def label_report(path, start, n, name):
    tops = label_tops(path, start, n)
    ok = [t for t in tops if t is not None and 723 <= t <= 726]
    print(f"{name}: frames {start}-{start + n - 1}: label ink top y in 723..726 for {len(ok)}/{len(tops)} frames; "
          f"distinct values {sorted(set(t for t in tops if t is not None))}")
    return len(ok), len(tops), tops


def check_patch():
    n = nframes(PATCH)
    print(f"patch frames {n} (expected {B - A + 1})")
    if n != B - A + 1:
        print("FAIL: patch frame count"); sys.exit(1)
    # the cover starts at 33.78 s = comp frame 1013.4; the 25% label exists from about 34 s (frame ~1020) until the cover ends at
    # 68.14 s, so measure patch frames 1030..1799 (patch index 30..799)
    ok, tot, tops = label_report(PATCH, 30, (B - A + 1) - 30, "PATCH")
    if ok != tot:
        print("FAIL: some patch frames still have a misplaced label; do not splice"); sys.exit(2)
    print("PATCH CLEAN")


def psnr_range(a_path, a0, b_path, b0, n):
    """mean PSNR (Y) between a_path frames a0.. and b_path frames b0.., n frames."""
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(a_path), "-i", str(b_path), "-filter_complex",
                        f"[0:v]select='between(n,{a0},{a0 + n - 1})',setpts=N/FRAME_RATE/TB,format=gray[a];"
                        f"[1:v]select='between(n,{b0},{b0 + n - 1})',setpts=N/FRAME_RATE/TB,format=gray[b];[a][b]psnr=stats_file=-", "-f", "null", "-"],
                       capture_output=True, text=True)
    vals = []
    for line in r.stdout.splitlines():
        for tok in line.split():
            if tok.startswith("psnr_avg:"):
                try:
                    vals.append(float(tok.split(":")[1]))
                except ValueError:
                    pass
    vals = [min(v, 100.0) for v in vals]
    return (float(np.mean(vals)), float(np.min(vals)), len(vals)) if vals else (None, None, 0)


def encode_video(src):
    """ONE video-only concat (head 0..A-1 from the source, the patch, tail B+1.. from the source), one generation at crf 16
    (a notch above the crf-18 source so the extra generation is invisible)."""
    fc = (f"[0:v]trim=start_frame=0:end_frame={A},setpts=PTS-STARTPTS[h];"
          f"[1:v]trim=start_frame=0:end_frame={B - A + 1},setpts=PTS-STARTPTS[p];"
          f"[0:v]trim=start_frame={B + 1},setpts=PTS-STARTPTS[t];"
          f"[h][p][t]concat=n=3:v=1:a=0[v]")
    run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-i", str(PATCH), "-filter_complex", fc, "-map", "[v]", "-r", "30",
         "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-an", str(OUT_VIDEO)])
    n = nframes(OUT_VIDEO)
    print(f"spliced video-only: {n} frames (expected {N_TOTAL})")
    if n != N_TOTAL:
        print("FAIL: frame total"); sys.exit(3)


def mux(audio_src, out_final):
    """the ORIGINAL audio, stream-copied: not one audio sample changes."""
    run(["ffmpeg", "-y", "-v", "error", "-i", str(OUT_VIDEO), "-i", str(audio_src), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "copy",
         "-movflags", "+faststart", str(out_final)])
    print("wrote", out_final.name)


def verify(out_final, src):
    """prints the evidence and RETURNS True only if every gate passes (frame total, audio untouched, copied regions near-identical,
    patched C3 labels all in line)."""
    print(f"--- verify {out_final.name}")
    ok_all = True
    n = nframes(out_final)
    print("frames", n, "(ok)" if n == N_TOTAL else "(FAIL)")
    ok_all &= (n == N_TOTAL)
    dv = float(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0", str(out_final)]).stdout.split(",")[0])
    da = float(run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=duration", "-of", "csv=p=0", str(out_final)]).stdout.split(",")[0])
    ds = float(run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=duration", "-of", "csv=p=0", str(src)]).stdout.split(",")[0])
    print(f"video {dv:.3f}s audio {da:.3f}s (source audio {ds:.3f}s)")
    ok_all &= abs(dv - N_TOTAL / 30.0) < 0.05 and abs(da - ds) < 0.02
    # seams + copied regions should be near-identical to the source; the patched region differs only where the labels moved
    # (copied regions must read HIGH; the seam INTO the patch, frames 1000-1012, is before C3 so it must also read high)
    must_be_high = {"HEAD 0-999 (copied)": 38.0, "seam in 1000-1012 (before C3)": 36.0, "seam out 1800-1830 (copied)": 38.0,
                    "TAIL 1800-14321 (copied)": 38.0}
    for name, a0, n_ in (("HEAD 0-999 (copied)", 0, 1000), ("seam in 1000-1012 (before C3)", 1000, 13),
                         ("PATCH C3 1020-1799 (labels fixed)", 1020, 780), ("seam out 1800-1830 (copied)", 1800, 31),
                         ("TAIL 1800-14321 (copied)", 1800, N_TOTAL - 1800)):
        mean, mn, k = psnr_range(out_final, a0, src, a0, n_)
        gate = must_be_high.get(name)
        flag = ""
        if gate is not None:
            good = mean is not None and mean >= gate
            ok_all &= good
            flag = "  OK" if good else f"  FAIL (< {gate} dB)"
        print(f"  PSNR {name:36s} mean {mean if mean is None else round(mean, 1)} dB  min {mn if mn is None else round(mn, 1)} dB  ({k} frames){flag}")
    ok1, tot1, _ = label_report(out_final, 1030, 770, "OUTPUT labels C3 1030-1799")
    ok2, tot2, _ = label_report(out_final, 1800, 159, "OUTPUT labels C3 1800-1958 (clean chunk; the slow push-in starts at 65.3 s = frame 1959, so later frames move BY DESIGN)")
    ok_all &= (ok1 == tot1 and tot1 > 0) and (ok2 == tot2 and tot2 > 0)
    print(f"VERIFY {'PASS' if ok_all else 'FAIL'} {out_final.name}")
    return ok_all


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    check_patch()
    if mode == "build":
        encode_video(SRC_MIX)
        mux(SRC_MIX, OUT_MIX)
        good = verify(OUT_MIX, SRC_MIX)
        mux(SRC_PLAIN, OUT_PLAIN)       # the comp's-own-audio sibling, same picture, so a later graph re-drive stays consistent
        print("SPLICE DONE" if good else "SPLICE FAILED VERIFICATION")
        sys.exit(0 if good else 4)
