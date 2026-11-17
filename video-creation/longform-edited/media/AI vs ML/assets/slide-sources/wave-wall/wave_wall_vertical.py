"""AI vs ML: the WAVE WALL for the VERTICAL (9:16) cut, ffmpeg only (slide-builder, 2026-11-11).

The wave wall is a RENDERED template (kt-wave-wall: render the template, never stills) and After Effects is never
opened again for it (_state-cues.md, Mike 2026-11-10/11). So the portrait version is DERIVED from the existing 16:9
render `assets/kt-renders/wave-wall.mp4` (71 frames, 1080p30, already offset to its readable range) by ffmpeg:

  why not scale-to-cover: a cover crop keeps a 607 px wide window of the source, and the whole word TRAIN is ~620 px
  wide, so a cover crop can NEVER show a whole TRAIN (centre crop reads "HIP . SH" / ". TRA"). Rejected.

  what this does instead (1:1, no scaling): crop a 1080 px wide column x 500-1580 of the source (it holds a whole
  TRAIN in every frame from clip frame 15, where the 16:9 also reads whole: TRAIN drifts left from x 1016-1533 to
  x 566-1147 over the clip, union 566-1533) and the band y 37-869 (rows SHIP / TRAIN / SHIP / TRAIN; both cut lines
  are pure black in every frame, measured), then stack that band 4x and keep a 1920 px window from y 806, so the rows
  keep alternating SHIP / TRAIN at the same ~205 px pitch: 9 rows (5 SHIP, 4 TRAIN) fill the portrait frame.
  Same frames, same timing, same 71-frame length, same encode (x264 crf 16), no audio.

Writes  assets/vertical/kt-renders/wave-wall.mp4   (the comp input; play FROM ITS FRAME 0, exactly like the 16:9 clip)
        assets/vertical/card-slides/wave-wall.png  (the QA poster = clip frame 28, the same frame as the 16:9 poster;
                                                    NOT for the comp)
Run: python wave_wall_vertical.py
"""
import subprocess
import sys
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[2]
SRC = ASSETS / "kt-renders" / "wave-wall.mp4"
OUT = ASSETS / "vertical" / "kt-renders" / "wave-wall.mp4"
POSTER = ASSETS / "vertical" / "card-slides" / "wave-wall.png"
X0, BAND_Y, BAND_H, WIN_Y = 500, 37, 832, 806
POSTER_FRAME = 28
FRAMES = 71


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"FAILED: {' '.join(cmd)}\n{r.stderr[-2000:]}")
    return r.stdout


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    vf = (f"crop=1080:{BAND_H}:{X0}:{BAND_Y},split=4[a][b][c][d];[a][b][c][d]vstack=inputs=4,"
          f"crop=1080:1920:0:{WIN_Y},setsar=1,format=yuv420p")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-filter_complex", vf, "-an", "-r", "30",
         "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-movflags", "+faststart", str(OUT)])
    probe = run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries",
                 "stream=width,height,nb_read_frames,r_frame_rate", "-of", "csv=p=0", str(OUT)]).strip()
    w, h, fr, n = probe.split(",")
    if (w, h, n) != ("1080", "1920", str(FRAMES)) or fr != "30/1":
        sys.exit(f"GATE: {OUT.name} is {w}x{h} {n} frames @ {fr}, want 1080x1920 {FRAMES} frames @ 30/1")
    if run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(OUT)]).strip():
        sys.exit("GATE: audio stream present")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(OUT), "-vf", f"select=eq(n\\,{POSTER_FRAME})", "-frames:v", "1", str(POSTER)])
    print("wrote", OUT, f"({w}x{h}, {n} frames @ {fr}, no audio)")
    print("wrote", POSTER, f"(clip frame {POSTER_FRAME})")


if __name__ == "__main__":
    main()
