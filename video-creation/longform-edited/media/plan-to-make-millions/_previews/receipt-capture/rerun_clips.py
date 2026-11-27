"""Re-cut CLIP-3 and CLIP-8 at the measured silence troughs (canonical tool, audio kept, caption burned).
CLIP-3: --file mode on the full source the tool already pulled (92.19 to 95.66 on the source clock).
CLIP-8: URL pull at the re-measured window (22.70 to 26.30; the plan's 29.2 to 35.0 were lagging caption cues)."""
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).parent
PROJECT = HERE.parent.parent
REPO = PROJECT.parents[3]
TOOL = REPO / "video-creation" / "longform-edited" / "skills" / "clip-inserts" / "capture_clip_insert.py"
OUT = PROJECT / "assets" / "clip-inserts"
SRC3 = PROJECT / "_previews" / "clip-src" / "CLIP-3-cnn-huang-resigned" / "full.mp4"

jobs = {
    "CLIP-3": ["--file", str(SRC3), "--start", "1:32.19", "--end", "1:35.66",
               "--out", str(OUT / "CLIP-3-cnn-huang-resigned.mp4"),
               "--caption", "CNN, November 12, 2026, the day Nvidia announced its CEO's resignation",
               "--expect", "resigned effective immediately", "--caption-pos", "bottom"],
    "CLIP-8": ["--url", "https://www.youtube.com/watch?v=ggWr9mRcfac", "--start", "0:22.70", "--end", "0:26.30",
               "--out", str(OUT / "CLIP-8-fox-historically-bad-day.mp4"),
               "--caption", "Fox News, on the November 20, 2026 session",
               "--expect", "historically bad day on Wall Street", "--caption-pos", "top", "--keep-src"],
}
for cid in (sys.argv[1:] or jobs):
    cmd = [sys.executable, "-u", str(TOOL)] + jobs[cid]
    print(f"\n===== {cid}", flush=True)
    r = subprocess.run(cmd, cwd=str(REPO))
    print(f"===== {cid} exit {r.returncode}", flush=True)
