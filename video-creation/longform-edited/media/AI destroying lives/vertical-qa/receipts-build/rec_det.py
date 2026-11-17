"""rec_det.py: DETERMINISTIC portrait page recording at 1080x1920 (Chrome cannot screencast above CSS size, so each output
frame is a real Page.captureScreenshot at device-scale 1080/390 of the live page at scroll position y(t) and video time(s) t).
Muted by construction. 30 fps, h264 yuv420p crf 16."""
import base64, io, subprocess, shutil, time
from pathlib import Path

VW, VH = 390, 693
DSF = 1080 / 390
WIN_H = 1920 * VW / 1080

def ease(u):                      # smootherstep, 0..1
    u = max(0.0, min(1.0, u)); return u * u * u * (u * (u * 6 - 15) + 10)

SEEK_JS = """async ([sel, times]) => {
  const vs = [...document.querySelectorAll(sel)];
  await Promise.all(vs.map((v, i) => new Promise(res => {
    const t = times[i]; if (t === null || t === undefined || !isFinite(v.duration)) return res();
    const tt = v.loop ? (t % v.duration) : Math.min(t, v.duration - 0.05);
    if (Math.abs(v.currentTime - tt) < 0.001) return res();
    const done = () => { v.removeEventListener('seeked', done); res(); };
    v.addEventListener('seeked', done); v.pause(); v.currentTime = tt; setTimeout(res, 1500);
  })));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}"""

def render(pg, ctx, out_mp4, seconds, scroll_fn, work_dir, fps=30, video_fn=None, video_sel="video", q=92, log_every=60):
    cdp = ctx.new_cdp_session(pg)
    d = Path(work_dir); shutil.rmtree(d, ignore_errors=True); d.mkdir(parents=True)
    n = round(seconds * fps); t_start = time.time()
    for k in range(n):
        t = k / fps
        pg.evaluate(f"window.scrollTo(0,{scroll_fn(t):.2f})")
        if video_fn:
            pg.evaluate(SEEK_JS, [video_sel, video_fn(t)])
        else:
            pg.evaluate("new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
        shot = cdp.send("Page.captureScreenshot", {"format": "jpeg", "quality": q})
        (d / f"f{k:05d}.jpg").write_bytes(base64.b64decode(shot["data"]))
        if k % log_every == 0: print(f"   frame {k}/{n}  {time.time()-t_start:.0f}s", flush=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(fps), "-i", str(d / "f%05d.jpg"),
                    "-vf", "scale=1080:1920:flags=lanczos,format=yuv420p", "-an", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                    "-r", str(fps), "-movflags", "+faststart", str(out_mp4)], check=True)
    return n
