"""crop_clip.py: hide a source's name bar, network logo, ticker, name plaque or set sign on a captured clip. No band, no
caption (the longest-bear "no names, no captions" rule).

The captured clip (capture_clip_insert.py --no-caption) is already 1920x1080 / 30 fps with its own audio. Edits, applied in
this order, all in the clip's own 1920x1080 coordinates (before any crop):
  --key-black X:Y:W:H  (repeatable) inside the rectangle, pixels that are bluer than they are red (a cyan sign on a black
                       backdrop) become black. Skin, hair and clothes are red-dominant, so a face in the rectangle is untouched
  --blur X:Y:W:H       (repeatable) box-blur a rectangle in place (a small bug). A big blur looks like a pasted patch: prefer a crop
  --rect X:Y:W:H       a 16:9 rectangle scaled back to 1920x1080 (lanczos): a zoom-in that drops a bar or logo at an edge
  --shot T=X:Y:W:H     (repeatable) like --rect, but from T seconds on (T=0 for the first): for a clip with a shot change
                       inside it, one crop per shot, cut exactly where the source cuts (find the frame with the sheet below)
  --start / --end      trim to the spoken words (seconds into the captured clip)
The audio is stream-copied; the video is encoded once (libx264 crf 12).

    python crop_clip.py "<in.mp4>" --out "<out.mp4>" [--rect ... | --shot T=... --shot T=...] [--blur ...] [--key-black ...]

A crop's W:H must be 16:9 (within 1 %) so nothing is stretched, and at least --min-w wide (default 960: more than a 2x zoom
looks soft; lower it only for a 1080p source). The machine line is `CROP-CLIP PASS|FAIL`.
"""
import argparse
import subprocess
import sys


def probe(path, entries, stream="v:0"):
    cmd = ["ffprobe", "-v", "error"]
    if stream:
        cmd += ["-select_streams", stream]
    cmd += ["-show_entries", entries, "-of", "csv=p=0", path]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def fail(msg, code=1):
    print(f"CROP-CLIP FAIL {msg}")
    sys.exit(code)


def rect4(text, what):
    try:
        x, y, w, h = (int(v) for v in text.split(":"))
    except ValueError:
        fail(f"{what} must be X:Y:W:H integers", 2)
    if x < 0 or y < 0 or w < 2 or h < 2 or x + w > 1920 or y + h > 1080:
        fail(f"{what} {text} is outside the 1920x1080 frame")
    return x, y, w, h


def check_crop(r, min_w, what):
    x, y, w, h = r
    if w < min_w:
        fail(f"{what} is {w} px wide, under --min-w {min_w} (a bigger zoom looks soft)")
    if abs(w / h - 16 / 9) > 0.01 * 16 / 9:
        fail(f"{what} {w}x{h} is not 16:9 ({w / h:.3f})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", required=True)
    ap.add_argument("--rect", default=None, help="X:Y:W:H, 16:9, scaled back to 1920x1080")
    ap.add_argument("--shot", action="append", default=[], help="T=X:Y:W:H, a crop from T seconds on (repeatable)")
    ap.add_argument("--blur", action="append", default=[], help="X:Y:W:H blurred in place (repeatable)")
    ap.add_argument("--key-black", action="append", default=[], help="X:Y:W:H: bluer-than-red pixels go black (repeatable)")
    ap.add_argument("--min-w", type=int, default=960)
    ap.add_argument("--start", type=float, default=None, help="trim: seconds into the captured clip where the kept part starts")
    ap.add_argument("--end", type=float, default=None, help="trim: seconds into the captured clip where it ends")
    a = ap.parse_args()
    if not (a.rect or a.shot or a.blur or a.key_black) and a.start is None and a.end is None:
        fail("give --rect/--shot, --blur, --key-black and/or --start/--end", 2)
    if a.rect and a.shot:
        fail("use --rect or --shot, not both", 2)
    wh = probe(a.src, "stream=width,height").split(",")
    if wh != ["1920", "1080"]:
        fail(f"source is {'x'.join(wh)}, expected 1920x1080 (a captured clip)")

    chain, cur = [], "0:v"
    for i, kb in enumerate(a.key_black):
        x, y, w, h = rect4(kb, "--key-black")
        chain.append(f"[{cur}]split=2[kbase{i}][kcut{i}]")
        chain.append(f"[kcut{i}]crop={w}:{h}:{x}:{y},format=rgb24,"
                     "geq=r='if(gt(b(X,Y),r(X,Y)+12),0,r(X,Y))':g='if(gt(b(X,Y),r(X,Y)+12),0,g(X,Y))':"
                     f"b='if(gt(b(X,Y),r(X,Y)+12),0,b(X,Y))'[kk{i}]")
        chain.append(f"[kbase{i}][kk{i}]overlay={x}:{y}[kov{i}]")
        cur = f"kov{i}"
    for i, b in enumerate(a.blur):
        x, y, w, h = rect4(b, "--blur")
        r = max(8, min(w, h) // 5)
        chain.append(f"[{cur}]split=2[base{i}][cut{i}]")
        chain.append(f"[cut{i}]crop={w}:{h}:{x}:{y},boxblur={r}:3[bl{i}]")
        chain.append(f"[base{i}][bl{i}]overlay={x}:{y}[ov{i}]")
        cur = f"ov{i}"

    zoom = ""
    if a.shot:
        shots = []
        for s in a.shot:
            try:
                t, r = s.split("=", 1)
                shots.append((float(t), rect4(r, "--shot")))
            except ValueError:
                fail("--shot must be T=X:Y:W:H", 2)
        shots.sort()
        if shots[0][0] != 0:
            fail("the first --shot must start at T=0", 2)
        n = len(shots)
        for _, r in shots:
            check_crop(r, a.min_w, "--shot crop")
        chain.append(f"[{cur}]split={n}" + "".join(f"[sh{i}]" for i in range(n)))
        for i, (t, (x, y, w, h)) in enumerate(shots):
            t_end = shots[i + 1][0] if i + 1 < n else None
            trim = f"trim=start={t:.4f}" + (f":end={t_end:.4f}" if t_end is not None else "")
            chain.append(f"[sh{i}]{trim},setpts=PTS-STARTPTS,crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos,setsar=1[sv{i}]")
        chain.append("".join(f"[sv{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0,format=yuv420p[v]")
        zoom = " shots=" + ",".join(f"{t:g}s:{1920 / r[2]:.2f}x" for t, r in shots)
    else:
        tail = "setsar=1,format=yuv420p"
        if a.rect:
            r = rect4(a.rect, "--rect")
            check_crop(r, a.min_w, "--rect")
            x, y, w, h = r
            tail = f"crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos," + tail
            zoom = f" zoom={1920 / w:.2f}x"
        chain.append(f"[{cur}]{tail}[v]")

    trim_args = []
    if a.start is not None:
        trim_args += ["-ss", f"{a.start:.3f}"]
    if a.end is not None:
        trim_args += ["-to", f"{a.end:.3f}"]
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", a.src] + trim_args + [
        "-filter_complex", ";".join(chain), "-map", "[v]", "-map", "0:a:0",
        "-c:v", "libx264", "-crf", "12", "-preset", "medium", "-c:a", "copy", "-movflags", "+faststart", a.out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        fail("ffmpeg: " + (r.stderr or "").strip()[-500:])
    d_in, d_out = float(probe(a.src, "format=duration", "")), float(probe(a.out, "format=duration", ""))
    if a.start is not None or a.end is not None:
        d_in = (a.end if a.end is not None else d_in) - (a.start or 0.0)
    if abs(d_in - d_out) > 0.1:
        fail(f"length changed {d_in:.2f}s -> {d_out:.2f}s")
    print(f"CROP-CLIP PASS {a.out} blurs={len(a.blur)} keys={len(a.key_black)}{zoom} dur={d_out:.2f}s")


if __name__ == "__main__":
    main()
