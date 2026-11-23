#!/usr/bin/env python
"""
_grab_recent.py: download the top-N most-recent renders from the Image & Video HISTORY tab to
cand-<i>.mp4, so they can be transcribed and the right one picked (handles duplicate same-model
renders). Python port of _grab-recent.js (2026-11-23).

    python _grab_recent.py [N=5] [out_dir]

out_dir defaults to the system temp folder (the candidates are throwaway: pick one, copy it into the
video's project folder, delete the rest). The files are the History previews, the same file
fetch_result.py saves (for the full export of one render use fetch_download.py).

Changed from the JS version, which no longer found anything: it read the Assets page, which stopped
showing the renders (it is /app/files now, 0 videos), and it only accepted the old
storage.googleapis.com/xi-backend video host. Renders are listed on History and served from
elevenlabsusercontent.com. It refuses to run on any tab but History, because the Explore tab's
<video> elements are the avatar-preset previews (the trap SKILL.md warns about).
"""
import base64
import sys
import tempfile
from pathlib import Path

from _el import FETCH_B64_JS, URL, launch, open_history, run, shot

SRCS_JS = """(n) => { const out = []; const seen = new Set();
  for (const v of document.querySelectorAll('video')) {
    const u = v.currentSrc || v.src || '';
    if (/elevenlabsusercontent\\.com\\/database\\/workspace|storage\\.googleapis\\.com.*xi-backend/.test(u) && !seen.has(u)) { seen.add(u); out.push(u); }
    if (out.length >= n) break;
  }
  return out; }"""


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(tempfile.gettempdir())
    out_dir.mkdir(parents=True, exist_ok=True)
    with launch() as (_ctx, page):
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        open_history(page, wait_ms=3500)
        if "/history" not in page.url:
            shot(page, "el-grab-recent.png")
            print("NOT on the History tab (url:", page.url + "): refusing to scrape, the videos here are presets.",
                  file=sys.stderr)
            sys.exit(2)
        page.wait_for_timeout(1500)
        # scroll to load
        for _ in range(3):
            page.mouse.wheel(0, 1000)
            page.wait_for_timeout(800)
        shot(page, "el-grab-recent.png")
        print("History URL:", page.url)
        # collect render video srcs in DOM order (newest first), dedup
        srcs = page.evaluate(SRCS_JS, n)
        print("found", len(srcs), "videos")
        for i, src in enumerate(srcs):
            f = out_dir / f"cand-{i}.mp4"
            f.write_bytes(base64.b64decode(page.evaluate(FETCH_B64_JS, src)))
            print(f"cand-{i}: {f.stat().st_size} bytes -> {f}")


if __name__ == "__main__":
    run(main, "_grab-recent")
