#!/usr/bin/env python
"""cue_script.py: line a SCRIPT.md up with the FINAL spine's word timings (scripted option of format 4).

Read script.md (this folder) first. Run it after the spine is final and transcribed, before cover_runs.py.

  python cue_script.py "media/standard/<p>/SCRIPT.md" --words "media/standard/<p>/spine/<final spine>.medium-words.json"
      [--spine "media/standard/<p>/spine/<final spine>.mp4"] [--out-dir "media/standard/<p>/overlays"] [--allow-missing]

What it does (no judgment, no rewriting; the word JSON is never edited):
  1. ALIGN. Mike reads the script, so the transcript is close. Every spoken line's words are aligned to the transcript
     words in ONE monotonic pass (difflib over the two token streams: a line can never match earlier than the line
     before it). Per line: the first and last word he said, status KEPT (said as written), CHANGED (reworded) or
     MISSING (not said), and the heard text.
  2. AD-LIBS. A stretch of 4+ transcript words no script line covers is reported; it inherits the scene of the line
     before it (the card on screen stays up; under a screen-share line the recording keeps playing).
  3. THE NUMBER CHECK. Per line, the numbers and magnitudes (thousand / million / billion / percent) in the script
     against what he said. Every mismatch is listed at the TOP of the report: "170 thousand" read as "170 million"
     is caught here, before any card is rendered over it.
  4. WINDOWS. A line's window starts in the pause before its first word (up to 0.3 s early, never before the
     previous word ends) and runs to the next line's window, so the windows are contiguous. Consecutive `[COVER]`
     lines form one RUN (cover_runs.py renders each run as one clip); consecutive lines on the same card and state
     are one card window inside it. A run's edges sit in the silence next to the neighbouring `[SCREENSHARE]` line.

Writes <out-dir>/cues.json (the machine record cover_runs.py reads) and <out-dir>/CUE-REPORT.md (for a human).
FAIL (exit 1) only when a `[COVER]` line is MISSING (it has no window, so its card would never show; read the list,
then re-run with --allow-missing if Mike dropped those lines on purpose) or the windows are not monotonic. Number
mismatches, changed lines and ad-libs are FLAGS, never failures.

PINS: `--pin <script line>=<seconds>` sets a line's window start by hand (a mis-resolved start, an ad-lib that should
already show the next card, or a MISSING line he said in other words: a pinned line always gets a window). Pins are
saved in <out-dir>/cue-pins.json and re-applied on every run; delete the entry to drop one. Never edit the word JSON.

`number_mismatches` in the machine line counts the lines where he said a DIFFERENT number (both sides disagree); a
number only left out or only added is listed under them in the report and is not counted.

Machine line: SCRIPT-CUE PASS|FAIL lines=N kept=N changed=N missing=N adlibs=N number_mismatches=N runs=N
"""
import argparse
import difflib
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import script_common as SC  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LEAD = 0.3            # s: a window may start this much before its first word (inside the pause)
ADLIB_MIN = 4         # transcript words no line covers, before it is reported as an ad-lib
KEPT, CHANGED_MIN = 0.85, 0.34
TOK = re.compile(r"[a-z0-9']+")
MAG = {"hundred": 1e2, "k": 1e3, "thousand": 1e3, "m": 1e6, "million": 1e6, "b": 1e9, "bn": 1e9, "billion": 1e9, "trillion": 1e12}
MAG_WORDS = "hundred|thousand|million|billion|trillion"
SMALL = {"two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
         "ten": "10", "eleven": "11", "twelve": "12"}
SMALL_RE = re.compile(r"\b(" + "|".join(SMALL) + r")\b")
DOLLARS_CENTS = re.compile(r"\b(\d+)\s+dollars?\s+and\s+(\d{1,2})\s+cents?\b")
NUM = re.compile(r"(\d+(?:\.\d+)?)(?:(k|m|bn|b)\b|(?:st|nd|rd|th)\b|\s*(" + MAG_WORDS + r"|percent)\b)?")
ONE_MAG = re.compile(r"\b(?:one|a)\s+(" + MAG_WORDS + r")\b")
BARE_MAG = re.compile(r"(?<![\d.])(?<!\d\s)\b(" + MAG_WORDS + r")\b")


def toks(text):
    return TOK.findall(text.lower().replace("’", "'").replace("%", " percent ").replace("&", " and "))


def load_words(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    segs = data.get("segments", data) if isinstance(data, dict) else data
    words = []
    for seg in segs:
        for w in seg.get("words", []):
            raw = w.get("word", w.get("text", ""))
            if raw.strip():
                words.append({"start": float(w["start"]), "end": float(w["end"]), "raw": raw})
    return words


def numbers(text):
    """[(absolute value, is_percent, as written)] for every number in a line, script side or heard side."""
    t = text.lower().replace("’", "'").replace("$", " ").replace("%", " percent ")
    t = re.sub(r"(?<=\d),(?=\d{3}\b)", "", t)
    t = re.sub(r"(?<=\d)\s+(?=\.\d)", "", t)                 # Whisper sometimes splits "0 .02"
    t = DOLLARS_CENTS.sub(lambda m: f"{m.group(1)}.{int(m.group(2)):02d}", t)
    t = SMALL_RE.sub(lambda m: SMALL[m.group(1)], t)
    t = ONE_MAG.sub(lambda m: "1 " + m.group(1), t)          # "one billion", "a million"
    t = BARE_MAG.sub(lambda m: "1 " + m.group(1), t)         # "a few hundred dollars" against the script's "a few 100 dollars"
    out = []
    for m in NUM.finditer(t):
        v = float(m.group(1))
        unit = m.group(2) or m.group(3) or ""
        pct = unit == "percent"
        if unit in MAG:
            v *= MAG[unit]
        out.append((v, pct, m.group(0).strip()))
    return out


def number_diff(script_text, heard_text):
    """(only in the script, only in what he said) as written; empty lists when the numbers agree."""
    a, b = numbers(script_text), numbers(heard_text)
    rest = list(b)
    only_a = []
    for v, pct, w in a:
        hit = next((x for x in rest if x[1] == pct and abs(x[0] - v) <= 1e-9 * max(1.0, abs(v))), None)
        if hit:
            rest.remove(hit)
        else:
            only_a.append(w)
    only_b = [w for _, _, w in rest]
    # a bare 1 on one side is satisfied by the word "one" on the other ("1 paid install" read as "one paid install")
    for mine, other_text in ((only_a, heard_text), (only_b, script_text)):
        ones = len(re.findall(r"\bone\b", other_text.lower()))
        for w in [w for w in mine if w == "1"][:ones]:
            mine.remove(w)
    return only_a, only_b


def duration_of(spine):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(spine)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return None


def align(lines, words):
    """Monotonic token alignment. Returns per line: first / last transcript WORD index (or None), score, k_head, k_tail."""
    S, starts = [], []
    for li, e in enumerate(lines):
        starts.append(len(S))
        S += [(t, li) for t in toks(e["text"])]
    starts.append(len(S))
    T = []
    for wi, w in enumerate(words):
        T += [(t, wi) for t in toks(w["raw"])]
    sm = difflib.SequenceMatcher(None, [s[0] for s in S], [t[0] for t in T], autojunk=False)
    per = [[] for _ in lines]
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            per[S[a + k][1]].append((a + k, b + k))
    res = []
    for li, pairs in enumerate(per):
        n_tok = starts[li + 1] - starts[li]
        if not pairs or not n_tok:
            res.append(None)
            continue
        clusters, cur = [], [pairs[0]]
        for p, q in zip(pairs, pairs[1:]):
            if (q[1] - p[1]) > (q[0] - p[0]) * 3 + 8:        # a stray far-away match: a new cluster
                clusters.append(cur)
                cur = []
            cur.append(q)
        clusters.append(cur)
        best = max(clusters, key=len)
        score = len(best) / n_tok
        if score < CHANGED_MIN:
            res.append(None)
            continue
        res.append({"si_f": best[0][0], "ti_f": best[0][1], "si_l": best[-1][0], "ti_l": best[-1][1], "score": score,
                    "k_head": best[0][0] - starts[li], "k_tail": starts[li + 1] - 1 - best[-1][0]})
    return res, T


def build(script_path, words_path, spine=None, allow_missing=False, pins=None):
    parsed = SC.parse(Path(script_path).read_text(encoding="utf-8"))
    bad = [f"line {n}: {msg}" for n, msg in parsed["problems"]]
    bad += [f"line {e['n']}: not a `[SCREENSHARE]` line or a `[COVER]` line with words and a `[SHOW]` card" for e in parsed["lines"]
            if e["tag"] not in SC.SPOKEN_TAGS or not e["text"] or (e["tag"] == "COVER" and not e["card"])]
    if bad:
        return None, ["SCRIPT.md is not lint-clean (run lint_script.py first): " + "; ".join(bad[:5])]
    lines = parsed["lines"]
    words = load_words(words_path)
    if not words or not lines:
        return None, ["no words in the transcript" if not words else "no spoken lines in the script"]
    res, T = align(lines, words)
    dur = (duration_of(spine) if spine else None) or round(words[-1]["end"] + 0.35, 3)

    matched = [i for i, r in enumerate(res) if r]
    # each matched line's first / last TOKEN index, extended over the unmatched words at its own head and tail
    first_t, last_t = {}, {}
    for pos, i in enumerate(matched):
        r = res[i]
        prev_l = res[matched[pos - 1]]["ti_l"] if pos else -1
        g = r["ti_f"] - prev_l - 1
        k_a = res[matched[pos - 1]]["k_tail"] if pos else 0
        k_b = r["k_head"]
        if g <= 0 or (k_a + k_b) == 0:
            tail_ext = head_ext = 0
        elif g <= k_a + k_b:
            tail_ext = round(g * k_a / (k_a + k_b))
            head_ext = g - tail_ext
        else:
            tail_ext, head_ext = k_a, k_b
        ft = r["ti_f"] - head_ext
        if head_ext:                                         # snap the start onto a sentence start / the widest pause
            lo = max(prev_l + 1, ft - 2)
            cands = [c for c in range(lo, r["ti_f"] + 1) if c == 0 or T[c][1] != T[c - 1][1]]

            def gap(c):
                w = T[c][1]
                return words[w]["start"] - (words[w - 1]["end"] if w else 0.0)

            def sentence_start(c):
                w = T[c][1]
                return w == 0 or words[w - 1]["raw"].rstrip()[-1:] in ".?!"
            if cands:
                bestc = max(cands, key=lambda c: gap(c) + (0.25 if sentence_start(c) else 0.0))
                if gap(bestc) >= 0.15 or sentence_start(bestc):
                    ft = bestc
        first_t[i] = ft
        if pos:
            last_t[matched[pos - 1]] = min(prev_l + tail_ext, ft - 1)
    if matched:
        r = res[matched[-1]]
        last_t[matched[-1]] = min(len(T) - 1, r["ti_l"] + r["k_tail"])

    out_lines, adlibs, mism, flags = [], [], [], []

    def said(a_tok, b_tok):
        wa, wb = T[a_tok][1], T[b_tok][1]
        return "".join(w["raw"] for w in words[wa:wb + 1]).strip(), words[wa]["start"], words[wb]["end"]

    def adlib(a_tok, b_tok, after):
        if b_tok - a_tok + 1 < ADLIB_MIN:
            return
        wa, wb = T[a_tok][1], T[b_tok][1]
        if wb - wa + 1 < ADLIB_MIN:
            return
        text, t0, t1 = said(a_tok, b_tok)
        scene = "as filmed (before the first line)" if after is None else \
            (f"stays on {lines[after]['card']}" + (f".{lines[after]['state']}" if lines[after]["state"] else "")
             if lines[after]["tag"] == "COVER" else "screen share, as filmed")
        adlibs.append({"after_line": None if after is None else lines[after]["n"], "tIn": round(t0, 3), "tOut": round(t1, 3),
                       "text": text, "scene": scene})

    if matched and first_t[matched[0]] > 0:
        adlib(0, first_t[matched[0]] - 1, None)
    for pos, i in enumerate(matched):
        nxt = first_t[matched[pos + 1]] if pos + 1 < len(matched) else len(T)
        if nxt - 1 >= last_t[i] + 1:
            adlib(last_t[i] + 1, nxt - 1, i)

    t_in = {}
    for pos, i in enumerate(matched):
        fw = T[first_t[i]][1]
        ws = words[fw]["start"]
        prev_end = words[fw - 1]["end"] if fw else 0.0
        t = min(ws, max(prev_end, ws - LEAD))
        if pos == 0 and lines[i]["tag"] == "COVER" and first_t[i] <= 2:
            t = 0.0                                          # the video opens on a cover: cover it from the first frame
        t_in[i] = round(max(0.0, t), 3)
    by_n = {e["n"]: i for i, e in enumerate(lines)}
    for n, t in (pins or {}).items():                        # a pinned window start always wins (cue-pins.json)
        if int(n) in by_n:
            t_in[by_n[int(n)]] = round(float(t), 3)
    live_idx = sorted(t_in)
    for i, e in enumerate(lines):
        row = {"n": e["n"], "tag": e["tag"], "card": e["card"], "state": e["state"], "text": e["text"]}
        if i in t_in:
            pos = live_idx.index(i)
            t_out = t_in[live_idx[pos + 1]] if pos + 1 < len(live_idx) else round(dur, 3)
            if res[i]:
                heard, s0, s1 = said(first_t[i], last_t[i])
                status, score = ("KEPT" if res[i]["score"] >= KEPT else "CHANGED"), res[i]["score"]
            else:                                            # not matched, but pinned by hand: what he says in its window
                ws_ = [w for w in words if t_in[i] - 0.05 <= w["start"] < t_out]
                heard = "".join(w["raw"] for w in ws_).strip()
                s0, s1 = (ws_[0]["start"], ws_[-1]["end"]) if ws_ else (t_in[i], t_in[i])
                status, score = "PINNED", 0.0
            if str(e["n"]) in (pins or {}) and res[i]:
                status += " (pinned)"
            row.update({"status": status, "score": round(score, 3), "tIn": t_in[i], "tOut": t_out,
                        "said_in": round(s0, 3), "said_out": round(s1, 3), "heard": heard})
            only_s, only_h = number_diff(e["text"], heard)
            if only_s or only_h:
                mism.append({"n": e["n"], "kind": "different" if (only_s and only_h) else "left out" if only_s else "added",
                             "script_only": only_s, "heard_only": only_h, "text": e["text"], "heard": heard,
                             "tIn": row["said_in"]})
        else:
            row.update({"status": "MISSING", "score": 0.0, "tIn": None, "tOut": None, "said_in": None, "said_out": None, "heard": ""})
        out_lines.append(row)

    problems = []
    live = [r for r in out_lines if r["status"] != "MISSING"]
    for a, b in zip(live, live[1:]):
        if not (a["tIn"] < b["tIn"] and abs(a["tOut"] - b["tIn"]) < 1e-6):
            problems.append(f"windows not monotonic at script lines {a['n']} -> {b['n']} ({a['tIn']} -> {b['tIn']})")
    if live and not live[-1]["tIn"] < live[-1]["tOut"]:
        problems.append(f"the last line's window is empty ({live[-1]['tIn']} -> {live[-1]['tOut']})")
    missing_cover = [r["n"] for r in out_lines if r["status"] == "MISSING" and r["tag"] == "COVER"]
    if missing_cover and not allow_missing:
        problems.append(f"{len(missing_cover)} `[COVER]` line(s) were not said and have no window (script lines "
                        f"{', '.join(map(str, missing_cover))}): read them in CUE-REPORT.md; if Mike dropped them on purpose "
                        "re-run with --allow-missing, otherwise fix the script line or the transcript match")

    runs, cur = [], None
    for r in live:
        if r["tag"] != "COVER":
            cur = None
            if r["tOut"] - r["tIn"] < 1.5:
                flags.append(f"script line {r['n']}: a `[SCREENSHARE]` scene of {r['tOut'] - r['tIn']:.2f} s between covers "
                             "(the covers fade out and straight back in; consider making it a cover line)")
            continue
        if cur is None:
            cur = {"id": f"run-{len(runs) + 1:02d}", "tIn": r["tIn"], "tOut": r["tOut"], "lines": [], "segments": []}
            runs.append(cur)
        cur["tOut"] = r["tOut"]
        cur["lines"].append(r["n"])
        seg = cur["segments"][-1] if cur["segments"] else None
        if seg and seg["card"] == r["card"] and seg["state"] == r["state"]:
            seg["tOut"] = r["tOut"]
            seg["lines"].append(r["n"])
        else:
            cur["segments"].append({"card": r["card"], "state": r["state"], "kind": parsed["cards"].get(r["card"], {}).get("kind", "card"),
                                    "tIn": r["tIn"], "tOut": r["tOut"], "lines": [r["n"]]})
    for run in runs:
        for seg in run["segments"]:
            if seg["tOut"] - seg["tIn"] < 1.0:
                flags.append(f"{run['id']}: card {seg['card']}{'.' + seg['state'] if seg['state'] else ''} is up for only "
                             f"{seg['tOut'] - seg['tIn']:.2f} s (script line {seg['lines'][0]})")

    n_kept = sum(1 for r in out_lines if r["status"].startswith("KEPT"))
    n_chg = sum(1 for r in out_lines if r["status"].startswith(("CHANGED", "PINNED")))
    n_miss = sum(1 for r in out_lines if r["status"] == "MISSING")
    n_diff = sum(1 for m in mism if m["kind"] == "different")
    machine = (f"SCRIPT-CUE {'FAIL' if problems else 'PASS'} lines={len(out_lines)} kept={n_kept} changed={n_chg} missing={n_miss} "
               f"adlibs={len(adlibs)} number_mismatches={n_diff} runs={len(runs)}")
    cues = {"script": str(Path(script_path).resolve()), "words": str(Path(words_path).resolve()),
            "spine": str(Path(spine).resolve()) if spine else None, "duration": round(dur, 3),
            "lead_s": LEAD, "allow_missing": bool(allow_missing),
            "pins": pins or {},
            "project": parsed["settings"].get("project"),
            "extras": SC.extras(parsed["settings"])[0],     # vertical / short / yt post, as named in the header (absent = off)
            "cards": {k: {"kind": v["kind"], "states": v["states"]} for k, v in parsed["cards"].items()},
            "lines": out_lines, "adlibs": adlibs, "number_mismatches": mism, "runs": runs, "flags": flags,
            "problems": problems, "machine": machine}
    return cues, problems


def mmss(t):
    return f"{int(t // 60)}:{t % 60:05.2f}"


def extras_line(cues):
    """The extras named in the script header, as one line (script.md, "The extras": each is built only when it is on)."""
    ex = cues.get("extras") or {}
    return ("Extras named in the script header: vertical cut " + ("ON" if ex.get("vertical") else "off") + ", short "
            + (f"ON ({ex['short']} s)" if ex.get("short") else "off") + ", YT post " + ("ON" if ex.get("yt_post") else "off") + ".")


def report(cues):
    L = ["# CUE-REPORT", "",
         f"_Written by `cue_script.py` from `{Path(cues['script']).name}` and `{Path(cues['words']).name}`. Regenerated on every run: "
         "fix the script or pass a flag, never edit this file. Times are FINAL-spine seconds._", "",
         f"`{cues['machine']}`", ""]
    L += [extras_line(cues), ""]
    L += ["## 1. Numbers he said differently from the script (read these first)", ""]
    diff = [m for m in cues["number_mismatches"] if m["kind"] == "different"]
    other = [m for m in cues["number_mismatches"] if m["kind"] != "different"]
    if diff:
        L += ["| script line | at | the script says | he said | the line as heard |", "|---|---|---|---|---|"]
        for m in diff:
            L.append(f"| {m['n']} | {mmss(m['tIn'])} | {', '.join(m['script_only'])} | {', '.join(m['heard_only'])} | {m['heard']} |")
        L += ["", "A mismatch is a FLAG, not a failure: a card prints the sourced figure, the voice says the other one. Mike rules "
              "(re-record the line, or leave it); Whisper can also mishear a number, so listen at the timecode before raising it.", ""]
    else:
        L += ["None: no number was said differently from the script.", ""]
    if other:
        L += ["Numbers only left out or only added (not counted in the machine line; usually harmless, a dropped year or an extra figure):",
              "", "| script line | at | in the script only | said only | the line as heard |", "|---|---|---|---|---|"]
        for m in other:
            L.append(f"| {m['n']} | {mmss(m['tIn'])} | {', '.join(m['script_only'])} | {', '.join(m['heard_only'])} | {m['heard']} |")
        L.append("")
    miss = [r for r in cues["lines"] if r["status"] == "MISSING"]
    L += ["## 2. Script lines he did not say", ""]
    if miss:
        L += ["| script line | scene | the line |", "|---|---|---|"]
        for r in miss:
            sc = "SCREENSHARE" if r["tag"] != "COVER" else f"COVER {r['card']}" + (f".{r['state']}" if r["state"] else "")
            L.append(f"| {r['n']} | {sc} | {r['text']} |")
        L += ["", "A missing `[COVER]` line has no window, so that card (or state) never shows for it. "
              + ("Accepted with --allow-missing." if cues["allow_missing"] else "The run FAILS until it is re-run with --allow-missing "
                 "(Mike dropped the lines) or the script is fixed."), ""]
    else:
        L += ["None.", ""]
    chg = [r for r in cues["lines"] if r["status"].startswith(("CHANGED", "PINNED"))]
    L += ["## 3. Lines he reworded", ""]
    if chg:
        L += ["| script line | at | match | as scripted | as heard |", "|---|---|---|---|---|"]
        for r in chg:
            L.append(f"| {r['n']} | {mmss(r['said_in'])} | {r['score']:.2f} | {r['text']} | {r['heard']} |")
        L.append("")
    else:
        L += ["None.", ""]
    L += ["## 4. Ad-libs (said, in no script line)", ""]
    if cues["adlibs"]:
        L += ["| after script line | from | to | on screen | what he said |", "|---|---|---|---|---|"]
        for a in cues["adlibs"]:
            L.append(f"| {a['after_line'] if a['after_line'] is not None else '(start)'} | {mmss(a['tIn'])} | {mmss(a['tOut'])} | "
                     f"{a['scene']} | {a['text']} |")
        L.append("")
    else:
        L += ["None.", ""]
    L += ["## 5. Flags", ""]
    L += [f"- {f}" for f in cues["flags"]] or ["None."]
    L += [f"- **FAIL:** {p}" for p in cues["problems"]]
    L += ["", "## 6. Cover runs (one clip each, built by `cover_runs.py`)", ""]
    if cues["runs"]:
        L += ["| run | from | to | length | cards in order |", "|---|---|---|---|---|"]
        for run in cues["runs"]:
            order = " > ".join(f"{s['card']}{'.' + s['state'] if s['state'] else ''} ({s['tOut'] - s['tIn']:.1f} s)" for s in run["segments"])
            L.append(f"| {run['id']} | {mmss(run['tIn'])} | {mmss(run['tOut'])} | {run['tOut'] - run['tIn']:.1f} s | {order} |")
        L.append("")
    else:
        L += ["No cover run: the whole video plays as filmed.", ""]
    L += ["## 7. Every line", "", "| script line | scene | window in | window out | status | as heard |", "|---|---|---|---|---|---|"]
    for r in cues["lines"]:
        sc = "SCREENSHARE" if r["tag"] != "COVER" else f"COVER {r['card']}" + (f".{r['state']}" if r["state"] else "")
        if r["status"] == "MISSING":
            L.append(f"| {r['n']} | {sc} | | | MISSING | ({r['text']}) |")
        else:
            L.append(f"| {r['n']} | {sc} | {r['tIn']:.3f} | {r['tOut']:.3f} | {r['status']} | {r['heard']} |")
    return "\n".join(L).replace(chr(0x2014), ", ") + "\n"


def main():
    ap = argparse.ArgumentParser(description="Cue a SCRIPT.md against the final spine's word timings.")
    ap.add_argument("script")
    ap.add_argument("--words", required=True, help="the FINAL spine's <name>.medium-words.json")
    ap.add_argument("--spine", default=None, help="the FINAL spine (for its duration; recorded for cover_runs.py)")
    ap.add_argument("--out-dir", default=None, help="default: <script folder>/overlays")
    ap.add_argument("--allow-missing", action="store_true", help="Mike dropped the missing [COVER] lines on purpose: do not fail on them")
    ap.add_argument("--pin", action="append", default=[], metavar="LINE=SECONDS",
                    help="pin a script line's window start by hand (repeatable; saved in <out-dir>/cue-pins.json, re-applied every run)")
    a = ap.parse_args()
    out_dir = Path(a.out_dir) if a.out_dir else Path(a.script).resolve().parent / "overlays"
    pins_p = out_dir / "cue-pins.json"
    pins = json.loads(pins_p.read_text(encoding="utf-8")) if pins_p.is_file() else {}
    for pin in a.pin:
        n, _, t = pin.partition("=")
        pins[str(int(n))] = float(t)
    if a.pin:
        out_dir.mkdir(parents=True, exist_ok=True)
        pins_p.write_text(json.dumps(pins, indent=1) + "\n", encoding="utf-8", newline="\n")
    cues, problems = build(a.script, a.words, a.spine, a.allow_missing, pins)
    if cues is None:
        for p in problems:
            print(f"  FAIL  {p}")
        print("SCRIPT-CUE FAIL lines=0 kept=0 changed=0 missing=0 adlibs=0 number_mismatches=0 runs=0")
        sys.exit(1)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "cues.json").write_text(json.dumps(cues, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    (out_dir / "CUE-REPORT.md").write_text(report(cues), encoding="utf-8", newline="\n")
    for m in cues["number_mismatches"]:
        print(f"  NUMBER ({m['kind']})  script line {m['n']} at {mmss(m['tIn'])}: script {m['script_only'] or '-'} | said {m['heard_only'] or '-'}")
    for r in cues["lines"]:
        if r["status"] == "MISSING":
            print(f"  MISSING script line {r['n']} ({r['tag']}): {r['text'][:80]}")
    for f in cues["flags"]:
        print(f"  FLAG  {f}")
    for p in problems:
        print(f"  FAIL  {p}")
    print(f"WROTE {out_dir / 'cues.json'}")
    print(f"WROTE {out_dir / 'CUE-REPORT.md'}")
    print(extras_line(cues))
    print(cues["machine"])
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
