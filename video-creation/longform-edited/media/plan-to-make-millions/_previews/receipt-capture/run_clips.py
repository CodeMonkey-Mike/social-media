"""Run the four CLIP INSERT captures through the canonical tool, one after another (args from COVER-PLAN.json)."""
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).parent
PROJECT = HERE.parent.parent
REPO = PROJECT.parents[3]
TOOL = REPO / "video-creation" / "longform-edited" / "skills" / "clip-inserts" / "capture_clip_insert.py"
OUT = PROJECT / "assets" / "clip-inserts"

# id -> (slug, url, start, end, caption, expect, caption_pos)
JOBS = {
    "CLIP-1": ("bloomberg-crypto-exchange-hacked", "https://www.youtube.com/watch?v=cw7WST9jBFI", "0:12.3", "0:14.9",
               "Bloomberg Television, October 30, 2026", "crypto exchange was hacked", "top"),
    "CLIP-4": ("abc-democrats-control-congress", "https://www.youtube.com/watch?v=fofOXOr9uQ8", "0:24.3", "0:27.5",
               "ABC News, November 4, 2026", "House and Senate", "bottom"),
    "CLIP-3": ("cnn-huang-resigned", "https://www.youtube.com/watch?v=gCwpCPZeIGQ", "1:32.1", "1:35.6",
               "CNN, November 12, 2026, the day Nvidia announced its CEO's resignation", "resigned effective immediately", "bottom"),
    "CLIP-8": ("fox-historically-bad-day", "https://www.youtube.com/watch?v=ggWr9mRcfac", "0:29.2", "0:35.0",
               "Fox News, on the November 20, 2026 session", "historically bad day on Wall Street", "bottom"),
}
only = sys.argv[1:]
overrides = {}  # e.g. CLIP-4=top
args_only = []
for a in only:
    if "=" in a:
        k, v = a.split("=", 1)
        overrides[k] = v
    else:
        args_only.append(a)
OUT.mkdir(parents=True, exist_ok=True)
for cid, (slug, url, st, en, cap, exp, pos) in JOBS.items():
    if args_only and cid not in args_only:
        continue
    pos = overrides.get(cid, pos)
    out = OUT / f"{cid}-{slug}.mp4"
    cmd = [sys.executable, "-u", str(TOOL), "--url", url, "--start", st, "--end", en, "--out", str(out),
           "--caption", cap, "--expect", exp, "--caption-pos", pos, "--keep-src"]
    print(f"\n===== {cid}: {' '.join(cmd)}", flush=True)
    r = subprocess.run(cmd, cwd=str(REPO))
    print(f"===== {cid} exit {r.returncode}", flush=True)
