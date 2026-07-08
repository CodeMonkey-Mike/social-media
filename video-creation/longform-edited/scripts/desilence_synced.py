"""Presentation desilence that keeps A/V locked.

The livestream concat-DEMUXER approach drifts audio vs video (the "mouth moving, no sound"
bug). This instead does ONE filter_complex pass with trim+atrim+concat, which re-times audio
and video together so they cannot desync.

Pipeline: Whisper-transcribe (word timings, saved for QA/captions) -> silencedetect for
accurate cut points (same criteria as the livestream longform script) -> single NVENC pass ->
self-QA (per-stream duration match + no long silence left in the output).

Usage:
    python desilence_synced.py "media/<clip>.mp4" [--out PATH] [--noise -50dB] [--min-sil 0.5] [--pad 0.06] [--bps 2M]
"""
import argparse, json, os, re, subprocess, sys


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", p]).decode().strip())


def stream_dur(p, kind):  # kind = 'v' or 'a'
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", f"{kind}:0",
         "-show_entries", "stream=duration", "-of", "csv=p=0", p]).decode().strip())


def detect_silences(src, noise, min_sil, total, pad):
    r = subprocess.run(["ffmpeg", "-i", src, "-af",
                        f"silencedetect=noise={noise}:d={min_sil}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start:\s*([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end:\s*([\d.]+)", r.stderr)]
    sils = []
    for s in starts:
        e = next((e for e in ends if e > s), total)
        sils.append((s + pad, max(s + pad, e - pad)))
    return [(a, b) for a, b in sils if b - a > 0.05]


def keep_spans(sils, total):
    keeps, cur = [], 0.0
    for a, b in sils:
        if a > cur:
            keeps.append((cur, a))
        cur = max(cur, b)
    if cur < total:
        keeps.append((cur, total))
    return keeps


def transcribe(src, out_json):
    import whisper
    model = whisper.load_model("base")
    result = model.transcribe(src, word_timestamps=True, language="en")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    nwords = sum(len(s.get("words", [])) for s in result["segments"])
    return result["text"].strip(), nwords


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", default=None)
    ap.add_argument("--noise", default="-50dB")
    ap.add_argument("--min-sil", type=float, default=0.5)
    ap.add_argument("--pad", type=float, default=0.06)
    ap.add_argument("--bps", default="2M")
    args = ap.parse_args()

    src = args.src
    if not os.path.isfile(src):
        print("no such file:", src); sys.exit(1)
    base = os.path.splitext(os.path.basename(src))[0]
    out = args.out or os.path.join(os.path.dirname(src), base + " SYNCED.mp4")
    json_out = os.path.join(os.path.dirname(src), base + ".whisper-words.json")

    total = dur(src)

    print(f"[1/4] transcribing {base} ({total:.1f}s)...")
    text, nwords = transcribe(src, json_out)
    print(f"      {nwords} words. opening: {text[:80]!r}")

    print(f"[2/4] detecting silences (noise={args.noise} min_sil={args.min_sil} pad={args.pad})...")
    sils = detect_silences(src, args.noise, args.min_sil, total, args.pad)
    keeps = keep_spans(sils, total)
    cut = sum(b - a for a, b in sils)
    print(f"      {len(sils)} silence spans ({cut:.1f}s), {len(keeps)} keep spans")

    print(f"[3/4] single filter_complex pass (A/V locked)...")
    import json as _json
    with open(out + ".spans.json", "w", encoding="utf-8") as f:
        _json.dump({"src": src, "sil_cuts": sils, "keeps": keeps}, f, indent=1)
    parts, labels = [], []
    for i, (a, b) in enumerate(keeps):
        d = b - a
        # DECLICK: 8ms edge fades force every join to zero amplitude (anti-pop, same as shorts).
        fade = f",afade=t=in:st=0:d=0.008,afade=t=out:st={max(0.0, d - 0.008):.3f}:d=0.008" if d > 0.02 else ""
        parts.append(f"[0:v]trim=start={a:.3f}:end={b:.3f},setpts=PTS-STARTPTS[v{i}];")
        parts.append(f"[0:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS{fade}[a{i}];")
        labels.append(f"[v{i}][a{i}]")
    parts.append("".join(labels) + f"concat=n={len(keeps)}:v=1:a=1[outv][outa]")
    fc = "\n".join(parts)
    fc_path = out + ".filter.txt"
    with open(fc_path, "w", encoding="utf-8") as f:
        f.write(fc)
    maxrate = args.bps.replace("M", "") and args.bps  # keep simple; cap below
    r = subprocess.run(["ffmpeg", "-y", "-i", src,
                        "-filter_complex_script", fc_path,
                        "-map", "[outv]", "-map", "[outa]",
                        "-c:v", "h264_nvenc", "-rc", "vbr", "-b:v", args.bps,
                        "-maxrate", "2.5M", "-bufsize", "4M", "-preset", "p5",
                        "-c:a", "aac", "-b:a", "128k", out], capture_output=True, text=True)
    try: os.remove(fc_path)
    except OSError: pass
    if r.returncode != 0:
        print("FFMPEG FAIL:\n", r.stderr[-1800:]); sys.exit(1)

    print(f"[4/4] QA...")
    vd, ad, od = stream_dur(out, "v"), stream_dur(out, "a"), dur(out)
    drift = abs(vd - ad)
    # re-detect silence on the OUTPUT: nothing longer than min_sil should survive
    out_sils = detect_silences(out, args.noise, args.min_sil, od, 0.0)
    worst = max(((b - a) for a, b in out_sils), default=0.0)
    worst_at = next((a for a, b in out_sils if (b - a) == worst), None)

    print(f"      out duration {od:.2f}s  (video {vd:.2f}s / audio {ad:.2f}s, drift {drift*1000:.0f}ms)")
    print(f"      residual silence spans >{args.min_sil}s: {len(out_sils)}; worst {worst:.2f}s"
          + (f" @ {worst_at:.1f}s" if worst_at is not None else ""))

    ok = drift < 0.10 and worst < (args.min_sil + args.pad + 0.15)
    print("      VERDICT:", "PASS" if ok else "FAIL (inspect)")
    print(f"out={out}")
    print(f"json={json_out}")
    sys.exit(0 if ok else 2)


if __name__ == "__main__":
    main()
