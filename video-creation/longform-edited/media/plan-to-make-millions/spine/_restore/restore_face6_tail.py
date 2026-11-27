"""plan-to-make-millions, 2026-11-23: put the picture back under the last word of FACE 6.

The FACE 6 line is "That's my edge. I can't watch every launch, but the software available in my community to my
members can." The chunk map missed the short word "can." (0.2 s, alone after a 0.37 s pause), so cover-blackout painted
black from the middle of that pause: the face went dark 0.2 s BEFORE his last word (final spine 470.628; "can." is heard
470.81 to 471.05). The sound was never cut (the desilencer kept the span to a-time 899.51 = final 471.204).

Repair, video only, nothing moves in time: the 17 black frames at final pts 470.628 .. 471.162 are replaced by the
un-blacked frames they were painted over, taken from `ALL.a.defumbled.mp4` at a-time 898.967 .. 899.500 (frame-matched:
the 12 face frames before the blackout sit at a constant a - final = 428.3385 s, mse 0.33). The frame at 471.195 stays
black: it is past the desilencer join at 471.204 in sound terms. The audio stream is COPIED. Every frame keeps its
timestamp. FACE 6 on the final spine is then 464.528 to 471.195.

    python restore_face6_tail.py            -> spine/_restore/ALL.e.enhanced.restored.mp4 + checks (nothing replaced)
    python restore_face6_tail.py --install  -> also: the old spine moves to _previews/spine-backups/, the repaired file
                                               takes its name, and spine/ALL.e.enhanced.restore.json records the repair
"""
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SPINE = HERE.parent
PROJ = SPINE.parent
FINAL = SPINE / "ALL.e.enhanced.mp4"
SRC = SPINE / "ALL.a.defumbled.mp4"
OUT = HERE / "ALL.e.enhanced.restored.mp4"
FIRST_BLACK, LAST_RESTORED, N = 470.62819, 471.162, 17      # final pts
A_FIRST = 898.9667                                          # a pts of the frame that belongs at FIRST_BLACK


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", stdin=subprocess.DEVNULL)
    return r.returncode, (r.stdout or "") + (r.stderr or "")


def pts(path):
    rc, out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "packet=pts_time", "-of", "csv=p=0", str(path)])
    return sorted(round(float(x.strip(",")), 4) for x in out.split() if x.strip(","))


def stream_md5(path, sel):
    rc, out = run(["ffmpeg", "-v", "error", "-i", str(path), "-map", sel, "-c", "copy", "-f", "md5", "-"])
    return out.strip()


def main():
    graph = (f"[1:v]setpts=PTS-STARTPTS+{FIRST_BLACK - 0.001:.5f}/TB,format=yuv420p[ov];"
             f"[0:v][ov]overlay=eof_action=pass:enable='between(t,{FIRST_BLACK - 0.005:.3f},{LAST_RESTORED + 0.010:.3f})'[v]")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(FINAL), "-ss", f"{A_FIRST - 0.001:.4f}", "-t", f"{N / 30:.4f}", "-i", str(SRC),
           "-filter_complex", graph, "-map", "[v]", "-map", "0:a:0", "-c:a", "copy",
           "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
           "-fps_mode", "passthrough", "-enc_time_base:v", "1/15360", "-video_track_timescale", "15360",
           "-movflags", "+faststart", str(OUT)]
    rc, out = run(cmd)
    if rc != 0 or not OUT.is_file():
        sys.exit("RESTORE FAIL ffmpeg: " + out[-600:])
    a, b = pts(FINAL), pts(OUT)
    same_pts = len(a) == len(b) and max(abs(x - y) for x, y in zip(a, b)) < 0.0015
    same_audio = stream_md5(FINAL, "0:a:0") == stream_md5(OUT, "0:a:0")
    fps = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", str(OUT)])[1].strip()
    rc, bd = run(["ffmpeg", "-hide_banner", "-ss", "460", "-t", "16", "-i", str(OUT), "-vf", "blackdetect=d=0.05:pix_th=0.10", "-an", "-f", "null", "-"])
    blacks = [ln[ln.index("black_start"):].strip() for ln in bd.splitlines() if "black_start" in ln]
    print(f"frames {len(a)} -> {len(b)}; timestamps identical: {same_pts}; audio stream identical: {same_audio}; fps {fps}")
    print("black spans in 460-476 s of the repaired file (times from 460):", blacks)
    ok = same_pts and same_audio and fps == "30/1"
    print("RESTORE", "ok" if ok else "FAIL", OUT)
    if not ok:
        sys.exit(1)
    if "--install" in sys.argv:
        bak = PROJ / "_previews" / "spine-backups"
        bak.mkdir(parents=True, exist_ok=True)
        old = bak / "ALL.e.enhanced.pre-restore.mp4"
        if not old.is_file():
            shutil.move(str(FINAL), str(old))
        else:
            FINAL.unlink()
        shutil.move(str(OUT), str(FINAL))
        (SPINE / "ALL.e.enhanced.restore.json").write_text(json.dumps({
            "what": "17 black frames under the last word of FACE 6 ('can.') replaced by the un-blacked footage; video only, no time moved",
            "final_pts_restored": [round(FIRST_BLACK, 3), LAST_RESTORED], "from": SRC.name, "a_pts_first": A_FIRST,
            "face6_window_s": [464.528, 471.195], "audio": "stream copied", "backup": str(old),
            "sha1": hashlib.sha1(FINAL.read_bytes()).hexdigest()}, indent=1), encoding="utf-8")
        print("INSTALLED", FINAL, "backup", old)


if __name__ == "__main__":
    main()
