#!/usr/bin/env python
"""fake_remotion.py — a stand-in for `npx remotion` so test_chunked_render.py can prove the watchdog, retries, resume,
deadline and pause WITHOUT a real render (chunked_render.py uses it when CHUNKED_RENDER_FAKE points here).

Commands: bundle · compositions · render (writes a REAL small h264 + pcm .mkv with exact frame/sample counts via ffmpeg).
Behaviour per chunk attempt comes from the JSON file in FAKE_PLAN: {"<A>-<B>": ["stall", "crash", "ok", ...]} = attempt 1
stalls, attempt 2 crashes, attempt 3 renders (missing = ok). Attempt counts live in FAKE_PLAN + ".count.json".
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path


def main():
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == "bundle":
        out = Path(args[args.index("--out-dir") + 1])
        out.mkdir(parents=True, exist_ok=True)
        (out / "index.html").write_text("<html></html>")
        (out / "bundle.js").write_text(os.environ.get("FAKE_BUNDLE", "v1"))
        return 0
    if cmd == "compositions":
        n = int(os.environ.get("FAKE_TOTAL", "200"))
        print(f"FakeComp                 30      320x180      {n} ({n / 30:.2f} sec)")
        return 0
    if cmd == "render":
        out = args[2]
        a, b = (int(x) for x in next(x for x in args if x.startswith("--frames=")).split("=")[1].split("-"))
        n = b - a + 1
        key = f"{a}-{b}"
        plan_p = os.environ.get("FAKE_PLAN")
        plan = json.loads(Path(plan_p).read_text()) if plan_p and Path(plan_p).is_file() else {}
        cnt_p = Path((plan_p or "fake") + ".count.json")
        counts = json.loads(cnt_p.read_text()) if cnt_p.is_file() else {}
        counts[key] = counts.get(key, 0) + 1
        cnt_p.write_text(json.dumps(counts))
        behaviour = (plan.get(key) or [])[counts[key] - 1] if counts[key] <= len(plan.get(key) or []) else "ok"
        delay = float(os.environ.get("FAKE_FRAME_DELAY", "0"))
        for k in range(0, n + 1, max(1, n // 4)):
            print(f"Rendered {k}/{n}, time remaining: 1s", flush=True)
            time.sleep(delay)
            if behaviour == "stall" and k >= n // 2:
                while True:                      # the hang: the same progress line, forever
                    print(f"Rendered {k}/{n}, time remaining: 0s", flush=True)
                    time.sleep(0.5)
            if behaviour == "crash" and k >= n // 2:
                print("Error: Could not extract frame from compositor", flush=True)
                return 1
        print(f"Rendered {n}/{n}", flush=True)
        r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", f"testsrc=size=320x180:rate=30:duration={n / 30}",
                            "-f", "lavfi", "-i", f"aevalsrc=0.1*sin(440*2*PI*t):s=48000:d={n / 30}",
                            "-frames:v", str(n), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", out],
                           capture_output=True, text=True)
        return r.returncode
    print(f"fake_remotion: unknown command {cmd}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
