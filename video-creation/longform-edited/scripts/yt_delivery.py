"""yt_delivery.py — the YouTube hand-off block Mike gets at every finalize (Mike, 2026-10-20, evals): the CHAPTERS with
their timestamps on the FINAL cut, the music Content-ID codes delimited by `|` (nothing else on that line), and 10 KEYWORD
phrases for the YouTube tags field.

    python scripts/yt_delivery.py <media/<project>> [--scope ALL]

Chapters: one per MUSIC-PLAN chapter row (CH1 always 0:00). Its time is on the FINAL timeline: a carded chapter starts on
its card (the paused sidecar's card pause, `at` + every earlier pause), an uncarded one at its span start shifted by every
pause before it (card pauses AND clip inserts). Its name is, in order: `yt-delivery.json` at the project root
({"chapters": {"CH1": "...", "CH6": "..."}, "keywords": [10 phrases]}: the JUDGMENT half, written by the main loop: names
for the uncarded hook / close, and the keywords), else the card label, else the EDIT-PLAN `## CHn - NAME` heading,
title-cased. YouTube's rules are checked (first at 0:00, at least 3, each at least 10 s). Codes: `yt_license_code` of each
MUSIC-PLAN track_id in `video-creation/assets/music/library.json`, in play order, a track used twice listed once; a missing
code FAILS. Keywords: exactly 10 phrases from `yt-delivery.json` (fewer or more FAILS), printed comma-separated.
Writes `YT-DELIVERY.md` at the project root and prints the block.
Machine line: YT-DELIVERY ok|FAIL chapters=N codes=N keywords=N
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
LIBRARY = HERE.parents[1] / "assets" / "music" / "library.json"
SMALL = {"a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "via"}
ACRONYMS = {"AI", "LLM", "LLMS", "RAG", "API", "APIS", "CI", "SDK", "UI", "UX", "GPU", "CPU", "AWS", "MCP", "ETF", "ETFS", "BTC",
            "ETH", "KAS", "DAG", "ZK", "L1", "L2", "NFT", "NFTS", "DEX", "CEX", "USD", "FAQ", "QA", "SQL", "JSON", "PR", "PRS"}


def title_case(s: str) -> str:
    out = []
    for i, w in enumerate(s.split()):
        core = re.sub(r"[^\w]", "", w).upper()
        if core in ACRONYMS:
            out.append(w.upper())
        elif i and core.lower() in SMALL:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:].lower())
    return " ".join(out)


def stamp(t: float) -> str:
    t = int(t)   # floor: the stamp never lands after the card it names
    h, m, s = t // 3600, t % 3600 // 60, t % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--scope", default="ALL")
    a = ap.parse_args()
    P = Path(a.project).resolve()
    fails = []
    plan = json.loads((P / "MUSIC-PLAN.json").read_text(encoding="utf-8"))
    side = sorted((P / "spine").glob(f"{a.scope}.?.paused.json"))
    pauses = json.loads(side[-1].read_text(encoding="utf-8")).get("pauses", []) if side else []
    pauses = sorted(pauses, key=lambda p: float(p["at"]))
    cards = [p for p in pauses if p.get("card")]
    ep = P / "EDIT-PLAN.md"
    heads = {m.group(1): m.group(2).strip() for m in
             re.finditer(r"^## (CH\d+) - (.+?)(?: \(|$)", ep.read_text(encoding="utf-8"), re.M)} if ep.is_file() else {}
    jp = P / "yt-delivery.json"
    judg = json.loads(jp.read_text(encoding="utf-8")) if jp.is_file() else {}
    over = judg.get("chapters") or {}
    keywords = [k.strip() for k in judg.get("keywords") or [] if k.strip()]
    if len(keywords) != 10:
        fails.append(f"{jp.name} needs exactly 10 keyword phrases, it has {len(keywords)} (the main loop writes them)")

    # a CARVED plan (one track carved into `cover: section` rows, music.md "ONE TRACK, CARVED") holds several rows per
    # chapter, and each starts where the MUSIC lands (a splice before the chapter, a right-aligned climb), not where the
    # chapter does: one chapter per distinct chapter, timed by its EDIT-PLAN heading span (`## CHn - NAME (M:SS.s-...`).
    # A one-bed-per-chapter plan keeps its bed's span start, exactly as before.
    carved = any(b.get("cover") == "section" for b in plan["beds"])
    starts = {m.group(1): int(m.group(2)) * 60 + float(m.group(3)) for m in
              re.finditer(r"^## (CH\d+) - .*?\((\d+):(\d+(?:\.\d+)?)-", ep.read_text(encoding="utf-8"), re.M)} if ep.is_file() else {}
    chapters, done = [], set()
    for b in plan["beds"]:
        if b["chapter"] in done:
            continue
        done.add(b["chapter"])
        ch, s = b["chapter"], float(b["span"][0])
        if carved and ch in starts:
            s = starts[ch]
        card = next((c for c in cards if abs(float(c["at"]) - s) <= 0.5), None)
        if card:
            t = float(card["at"]) + sum(float(p["dur"]) for p in pauses if float(p["at"]) < float(card["at"]) - 1e-6)
        else:
            t = s + sum(float(p["dur"]) for p in pauses if float(p["at"]) <= s)
        name = over.get(ch) or (title_case(card["card"]) if card else title_case(heads.get(ch, ch)))
        chapters.append((0.0 if not chapters else t, name, ch))

    if not chapters or chapters[0][0] != 0.0:
        fails.append("the first chapter must start at 0:00")
    if len(chapters) < 3:
        fails.append(f"YouTube needs at least 3 chapters, the plan has {len(chapters)}")
    for (t0, n0, c0), (t1, _, _) in zip(chapters, chapters[1:]):
        if int(t1) - int(t0) < 10:
            fails.append(f"{c0} '{n0}' runs {int(t1) - int(t0)} s (YouTube minimum 10 s)")

    lib = {t.get("id"): t for t in json.loads(LIBRARY.read_text(encoding="utf-8")).get("tracks", []) if isinstance(t, dict)}
    codes, seen = [], set()
    for b in plan["beds"]:
        tid = b.get("track_id") or (plan.get("track") or {}).get("id")   # a carved plan names its one track at the top
        if tid in seen:
            continue
        seen.add(tid)
        code = (lib.get(tid) or {}).get("yt_license_code")
        if not code:
            fails.append(f"no yt_license_code for music track '{tid}' in {LIBRARY.name}")
        else:
            codes.append(code)

    chap_txt = "\n".join(f"{stamp(t)} {n}" for t, n, _ in chapters)
    code_txt, kw_txt = "|".join(codes), ", ".join(keywords)
    fence = "```"
    md = (f"# {P.name} - YouTube delivery\n\n_Written by `scripts/yt_delivery.py` at finalize (definition_of_done). Chapter names: "
          f"`yt-delivery.json`, else the card label, else the EDIT-PLAN heading._\n\n"
          f"## Chapters\n{fence}\n{chap_txt}\n{fence}\n\n## Music codes (YouTube only)\n{fence}\n{code_txt}\n{fence}\n\n"
          f"## Keywords\n{fence}\n{kw_txt}\n{fence}\n")
    (P / "YT-DELIVERY.md").write_text(md, encoding="utf-8")
    print(f"CHAPTERS\n{chap_txt}\n\nYT MUSIC CODES\n{code_txt}\n\nKEYWORDS\n{kw_txt}\n")
    for f in fails:
        print(f"  FAIL  {f}")
    print(f"YT-DELIVERY {'FAIL' if fails else 'ok'} chapters={len(chapters)} codes={len(codes)} keywords={len(keywords)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
