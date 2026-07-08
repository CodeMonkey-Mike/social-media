"""delete_silences.py — shorts silence removal (in-place).

THIN WRAPPER around the ONE canonical desilencer. The detection method (dual-threshold −57/−52 RMS +
8 ms declick) now lives in exactly one place so no track can diverge again:

    video-creation/skills/desilencer/scripts/desilence.py   (read video-creation/skills/desilencer/desilencer.md)

This preserves the old shorts interface: `python delete_silences.py clip.mp4 [more.mp4 ...]`,
overwriting each file in place at the shorts default of 250 ms min-silence.
"""
import os, sys, subprocess, tempfile, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
DESILENCE = os.path.normpath(os.path.join(HERE, "..", "..", "skills", "desilencer", "scripts", "desilence.py"))


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())


if __name__ == "__main__":
    files = sys.argv[1:]
    if not files:
        print("Usage: python delete_silences.py <clip.mp4> [more.mp4 ...]  (overwrites in place, 250 ms)")
        sys.exit(1)
    for f in files:
        if not os.path.exists(f):
            print(f"  MISSING: {f}"); continue
        b = dur(f)
        ext = os.path.splitext(f)[1] or ".mp4"
        tmp = tempfile.NamedTemporaryFile(suffix=ext, delete=False).name
        try:
            r = subprocess.run([sys.executable, DESILENCE, f, "--out", tmp, "--min-sil", "0.25"],
                               capture_output=True, text=True)
            if r.returncode != 0:
                print(f"  FAIL {os.path.basename(f)}:\n{r.stdout}\n{r.stderr[-800:]}"); continue
            shutil.move(tmp, f)
            a = dur(f)
            print(f"  {os.path.basename(f):28s} {b:6.1f}s -> {a:6.1f}s  (-{b-a:.1f}s, canonical desilencer)")
        finally:
            if os.path.exists(tmp):
                os.remove(tmp)
