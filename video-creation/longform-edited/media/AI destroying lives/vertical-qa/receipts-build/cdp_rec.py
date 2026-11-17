"""cdp_rec.py: real-time portrait screen recording via a CDP screencast at device resolution.
Page.startScreencast(maxWidth=1080,maxHeight=1920) on a 390x693 viewport at DSF 1080/390: frames arrive at 1080x1920,
are timestamped, and are re-timed to a constant 30 fps with ffmpeg (concat demuxer, per-frame durations)."""
import base64, time, json, subprocess, shutil
from pathlib import Path

VW, VH = 390, 693
DSF = 1080 / 390

class Rec:
    def __init__(self, pg, ctx, outdir):
        self.pg, self.ctx = pg, ctx
        self.cdp = ctx.new_cdp_session(pg)
        self.dir = Path(outdir); shutil.rmtree(self.dir, ignore_errors=True); self.dir.mkdir(parents=True)
        self.frames = []   # (timestamp, filename)
        self.cdp.on("Page.screencastFrame", self._on)
    def _on(self, ev):
        i = len(self.frames); f = self.dir / f"f{i:05d}.jpg"
        f.write_bytes(base64.b64decode(ev["data"]))
        self.frames.append((ev["metadata"]["timestamp"], f.name))
        try: self.cdp.send("Page.screencastFrameAck", {"sessionId": ev["sessionId"]})
        except Exception: pass
    def start(self):
        self.cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 92, "maxWidth": 1080, "maxHeight": 1920, "everyNthFrame": 1})
    def stop(self):
        self.cdp.send("Page.stopScreencast")
    def sleep(self, s):
        end = time.time() + s
        while time.time() < end: self.pg.wait_for_timeout(20)
    def encode(self, out, seconds=None, start_offset=0.0, fps=30):
        """frames -> constant-fps mp4 (muted, yuv420p, crf 16). Optionally keep [start_offset, start_offset+seconds)."""
        fr = self.frames
        t0 = fr[0][0] + start_offset
        fr = [x for x in fr if x[0] >= t0] or fr
        lst = self.dir / "list.txt"; lines = []
        for k, (t, name) in enumerate(fr):
            d = (fr[k + 1][0] - t) if k + 1 < len(fr) else 1 / fps
            lines.append(f"file '{name}'\nduration {max(d, 0.001):.5f}")
        lines.append(f"file '{fr[-1][1]}'")
        lst.write_text("\n".join(lines), encoding="utf-8")
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-vf", f"fps={fps},scale=1080:1920:flags=lanczos,format=yuv420p"]
        if seconds: cmd += ["-t", f"{seconds}"]
        cmd += ["-an", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-movflags", "+faststart", str(out)]
        subprocess.run(cmd, check=True)
        span = fr[-1][0] - fr[0][0]
        return len(fr), span
