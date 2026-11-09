#!/usr/bin/env python
"""
clip_transcript.py - a video's timecoded transcript WITHOUT downloading the video, so a clip's window and its verbatim
words are found before anyone approves a download. Captions only (yt-dlp); capture_clip_insert.py re-verifies the words
with Whisper on the real clip, after approval.

Usage:
  python clip_transcript.py <url or a .vtt file> [--find "regex"] [--context 2] [--every 20] [--out <file.txt>]
  python clip_transcript.py <url or a .vtt file> --phrase "first words" "last words"

Prints "<id> | <title> | <channel> | <YYYYMMDD> | <duration>", then "[m:ss] text" paragraphs of about --every seconds.
--find prints only the paragraphs that match (+ --context either side).
--phrase prints "WINDOW M:SS.s-M:SS.s (<n>s) <head>" off the caption word timings, the --start / --end a clip is cut at.
Exit: 0 = printed, 1 = no captions could be fetched.
"""
import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def parse_vtt(path: Path):
    """[(seconds, text)] with YouTube's rolling-caption repeats removed."""
    rows, last, cur = [], "", 0
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        m = re.match(r"(\d\d):(\d\d):(\d\d)\.\d+ -->", line)
        if m:
            cur = int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3])
            continue
        if not line.strip() or line.startswith(("WEBVTT", "Kind:", "Language:")) or "<c>" in line:
            continue
        text = re.sub(r"<[^>]+>", "", line).replace("&gt;", ">").replace("&amp;", "&").strip()
        if text and text != last:
            rows.append((cur, text))
            last = text
    return rows


def parse_words(path: Path):
    """[(seconds, word)] from YouTube's word-timed cue lines ("word<00:00:01.230><c> next</c>"); [] when the VTT has none."""
    words, cue = [], 0.0
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        m = re.match(r"(\d\d):(\d\d):(\d\d\.\d+) -->", line)
        if m:
            cue = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
            continue
        if "<c>" not in line:
            continue
        t = cue
        for part in re.split(r"(<\d\d:\d\d:\d\d\.\d+>)", line):
            stamp = re.fullmatch(r"<(\d\d):(\d\d):(\d\d\.\d+)>", part)
            if stamp:
                t = int(stamp[1]) * 3600 + int(stamp[2]) * 60 + float(stamp[3])
                continue
            words += [(t, w) for w in re.sub(r"<[^>]+>", "", part).split()]
    return words


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9]", "", w.lower())


def phrase_window(words, first: str, last: str, pad: float = 0.4):
    """The window from the first run of `first` to the next run of `last` after it: M:SS.s-M:SS.s, or None."""
    toks = [norm(w) for _, w in words]
    a, b = [norm(x) for x in first.split()], [norm(x) for x in last.split()]
    find = lambda needle, frm: next((i for i in range(frm, len(toks) - len(needle) + 1) if toks[i:i + len(needle)] == needle), None)
    i = find(a, 0)
    if i is None:
        return None
    j = find(b, i)
    if j is None:
        return None
    end_i = j + len(b)
    end = words[end_i][0] if end_i < len(words) else words[-1][0] + 0.5
    return max(0.0, words[i][0] - pad), end + pad


def clock(s: float) -> str:
    return f"{int(s // 60)}:{s % 60:04.1f}" if s < 3600 else f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:04.1f}"


def paragraphs(rows, every: int):
    out, buf, start = [], [], None
    for t, text in rows:
        start = t if start is None else start
        buf.append(text)
        if t - start >= every:
            out.append((start, " ".join(buf)))
            buf, start = [], None
    if buf:
        out.append((start, " ".join(buf)))
    return out


def fetch(url: str, tmp: Path):
    info = subprocess.run(
        ["yt-dlp", "--no-playlist", "--skip-download", "--write-auto-subs", "--write-subs", "--sub-langs", "en-orig,en",
         "--sub-format", "vtt", "--no-simulate", "--ignore-errors", "--print",
         "%(id)s | %(title)s | %(channel)s | %(upload_date)s | %(duration_string)s", "-o", str(tmp / "cap.%(ext)s"), url],
        capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=180)
    head = next((x for x in info.stdout.splitlines() if " | " in x), url)
    files = sorted(tmp.glob("cap*.vtt"), key=lambda p: ("orig" not in p.name, p.name))
    return head, files[0] if files else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--find", default=None)
    ap.add_argument("--context", type=int, default=1)
    ap.add_argument("--every", type=int, default=20)
    ap.add_argument("--out", default=None)
    ap.add_argument("--phrase", nargs=2, metavar=("FIRST", "LAST"), help="print the exact window from the words FIRST to the words LAST")
    a = ap.parse_args()
    with tempfile.TemporaryDirectory() as td:
        if Path(a.source).is_file():
            head, vtt = a.source, Path(a.source)
        else:
            head, vtt = fetch(a.source, Path(td))
        if not vtt:
            print(f"NO-CAPTIONS {head}")
            return 1
        paras = paragraphs(parse_vtt(vtt), a.every)
        words = parse_words(vtt)
    if a.phrase:
        win = phrase_window(words, a.phrase[0], a.phrase[1])
        if not win:
            print(f"PHRASE-NOT-FOUND {a.phrase} in {head}")
            return 1
        print(f"WINDOW {clock(win[0])}-{clock(win[1])} ({win[1] - win[0]:.1f}s) {head}")
        return 0
    keep = range(len(paras))
    if a.find:
        hit = [i for i, (_, p) in enumerate(paras) if re.search(a.find, p, re.I)]
        keep = sorted({j for i in hit for j in range(max(0, i - a.context), min(len(paras), i + a.context + 1))})
    lines = [head] + [f"[{paras[i][0] // 60}:{paras[i][0] % 60:02d}] {paras[i][1]}" for i in keep]
    if a.out:
        Path(a.out).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    sys.exit(main())
