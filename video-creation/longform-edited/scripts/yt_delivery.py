"""yt_delivery.py — the YouTube METADATA block Mike gets for every finished video (Mike, 2026-10-20, evals: chapters, music
codes, keywords; 2026-11-01, lets-get-rich: + the title, a two-sentence description, hashtags and the common misspellings,
"if I request the metadata for a project when we're finished with the project, you give me all this stuff"). Printed in
paste order:

  TITLE        the video's title
  DESCRIPTION  exactly TWO sentences, the FIRST an OPEN LOOP, then 2-3 hashtags on their own line
  CHAPTERS     their timestamps on the FINAL cut
  MUSIC CODES  the Content-ID codes delimited by `|`, nothing else on that line (YouTube only, never another platform)
  KEYWORDS     the YouTube tags field: exactly 10 keyword phrases + their COMMON MISSPELLINGS, comma-separated, inside
               YouTube's 500-character tag budget

    python scripts/yt_delivery.py <media/<project>> [--scope ALL]

The JUDGMENT half is `yt-delivery.json` at the project root, written by the main loop before finalize (the graph's
definition_of_done runs this and FAILS on a gap), or when Mike asks for the metadata of a finished project:

  {"title": "...",                            optional when publish-meta.json carries it (a mismatch is flagged)
   "description": ["<open loop>", "<second sentence>"],
   "hashtags": ["#a", "#b", "#c"],            2-3, letters/digits only; YouTube shows the first three above the title
   "chapters": {"CH1": "...", "CH6": "..."},  names for the uncarded chapters (the hook, the close)
   "keywords": [exactly 10],                  search phrases a viewer would type
   "misspellings": [3 or more]}               how viewers actually mistype THOSE phrases

- OPEN LOOP: the first sentence opens a curiosity gap the video pays off: it names what the viewer will get without giving
  it away (lets-get-rich: "Warren Buffett's best deals came when everyone else was terrified, and there is one kind of coin
  my community is buying in this crash for exactly that reason."). The second sentence says what the video walks through,
  with its hardest numbers, and still does not close the loop. Every number comes from AS-RECORDED / DATA.md.
- MISSPELLINGS: the misspellings people really type, never invented typos: the names they get wrong ("warren buffet"),
  homophones ("crypto bare market"), split forms ("bit coin", "alt coin"), common coin / brand slips ("bitcon", "cripto").
- Copy rules (persona.json; checked here): no em or en dashes; no day-relative words (today, tonight, yesterday, tomorrow,
  this morning, last night: the upload lands days later); no links in the description (a third-party source link got Mike
  flagged by YouTube; his own community link he adds himself); cashtags for coins in the description ($BTC, $KAS); the
  crypto channel never explains the AI production process.

Chapters: one per MUSIC-PLAN chapter row (CH1 always 0:00). Its time is on the FINAL timeline: a carded chapter starts on
its card (the paused sidecar's card pause, `at` + every earlier pause), an uncarded one at its span start shifted by every
pause before it (card pauses AND clip inserts). Its name is, in order: `yt-delivery.json` "chapters", else the card label,
else the EDIT-PLAN `## CHn - NAME` heading, title-cased. YouTube's rules are checked (first at 0:00, at least 3, each at
least 10 s). Codes: `yt_license_code` of each MUSIC-PLAN track_id in `video-creation/assets/music/library.json`, in play
order, a track used twice listed once; a missing code FAILS.
A project with NO MUSIC-PLAN.json (a longform-presentation format) names its chapters in yt-delivery.json as
`"chapter_stamps": [["0:00", "Intro"], ["1:25", "..."]]` (none = no chapter block) and its music as
`"music_track_ids": ["..."]` (resolved through the same library; none = no music line).
Writes `YT-DELIVERY.md` at the project root and prints the block; hand it to Mike exactly as printed.
Machine line: YT-DELIVERY ok|FAIL title=0|1 description=N hashtags=N chapters=N codes=N keywords=N misspellings=N tag_chars=N
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
# the same gate as repurpose/queue_writer.DAY_WORDS (persona avoid_in_drafts, Mike 2026-09-11)
DAY_WORDS = re.compile(r"\b(today|tonight|yesterday|tomorrow|this (morning|afternoon|evening)|last night)\b", re.I)
DASHES = ("—", "–")
TAG_BUDGET, TITLE_MAX = 500, 100


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


def unstamp(s: str) -> float:
    parts = [float(x) for x in str(s).strip().split(":")]
    return sum(v * 60 ** i for i, v in enumerate(reversed(parts)))


def tag_chars(tags) -> int:
    """YouTube's count for the tags field: every character, +2 for the quotes it adds around a tag with a space, +1 per comma."""
    return sum(len(t) + (2 if " " in t else 0) for t in tags) + max(0, len(tags) - 1)


def copy_fails(label: str, text: str) -> list:
    out = []
    if any(d in text for d in DASHES):
        out.append(f"{label}: an em/en dash (persona hard rule: use a comma, colon or period)")
    m = DAY_WORDS.search(text)
    if m:
        out.append(f"{label}: day-relative word '{m.group(0)}' (the upload lands days later: say the date or 'this week')")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--scope", default="ALL")
    a = ap.parse_args()
    P = Path(a.project).resolve()
    fails = []
    jp = P / "yt-delivery.json"
    judg = json.loads(jp.read_text(encoding="utf-8")) if jp.is_file() else {}
    mp = P / "MUSIC-PLAN.json"
    plan = json.loads(mp.read_text(encoding="utf-8")) if mp.is_file() else None

    # TITLE: yt-delivery.json, else the queue's publish-meta.json (written by stage_longform, AFTER finalize on a first run)
    pm = P / "publish-meta.json"
    pm_title = (json.loads(pm.read_text(encoding="utf-8")).get("title") or "").strip() if pm.is_file() else ""
    title = (judg.get("title") or "").strip() or pm_title
    if not title:
        fails.append(f"no title: write `title` in {jp.name} (Mike's locked title)")
    elif len(title) > TITLE_MAX:
        fails.append(f"title is {len(title)} characters (YouTube maximum {TITLE_MAX})")
    fails += copy_fails("title", title)
    if pm_title and title != pm_title:
        print(f"  NOTE  the title differs from publish-meta.json ('{pm_title}'), which the queue posts on the other platforms")

    # DESCRIPTION: exactly two sentences, the first an open loop (judgment; the shape is checked here)
    desc = judg.get("description") or []
    desc = [str(s).strip() for s in ([desc] if isinstance(desc, str) else desc) if str(s).strip()]
    if len(desc) != 2:
        fails.append(f"{jp.name} `description` needs exactly 2 sentences (a list of two, the FIRST an open loop), it has {len(desc)}")
    for i, s in enumerate(desc, 1):
        if not re.search(r"[.!?]$", s):
            fails.append(f"description sentence {i} must end with . ! or ?")
    if re.search(r"https?://|www\.", " ".join(desc), re.I):
        fails.append("description: no links (third-party source links got Mike flagged by YouTube)")
    fails += copy_fails("description", " ".join(desc))

    # HASHTAGS: 2-3, on their own line under the description
    hashtags = [str(h).strip() for h in judg.get("hashtags") or [] if str(h).strip()]
    if not 2 <= len(hashtags) <= 3:
        fails.append(f"{jp.name} `hashtags` needs 2 or 3, it has {len(hashtags)}")
    bad = [h for h in hashtags if not re.fullmatch(r"#[A-Za-z0-9]+", h)]
    if bad:
        fails.append(f"hashtags must be # + letters/digits only, no spaces: {bad}")

    # KEYWORDS + their COMMON MISSPELLINGS = the YouTube tags field
    keywords = [str(k).strip() for k in judg.get("keywords") or [] if str(k).strip()]
    if len(keywords) != 10:
        fails.append(f"{jp.name} needs exactly 10 keyword phrases, it has {len(keywords)} (the main loop writes them)")
    misspellings = [str(m).strip() for m in judg.get("misspellings") or [] if str(m).strip()]
    if len(misspellings) < 3:
        fails.append(f"{jp.name} `misspellings` needs 3 or more common misspellings of the keywords, it has {len(misspellings)}")
    kw_low = {k.lower() for k in keywords}
    same = [m for m in misspellings if m.lower() in kw_low]
    if same:
        fails.append(f"misspellings repeat a keyword: {same}")
    if len({m.lower() for m in misspellings}) != len(misspellings):
        fails.append("misspellings carry a duplicate")
    tags = keywords + misspellings
    n_chars = tag_chars(tags)
    if n_chars > TAG_BUDGET:
        fails.append(f"keywords + misspellings are {n_chars} tag characters (YouTube maximum {TAG_BUDGET}): drop the rarest misspellings")
    if any("#" in t for t in tags):
        fails.append("keywords / misspellings carry a '#' (hashtags go in `hashtags`)")
    fails += copy_fails("keywords", ", ".join(tags))

    # CHAPTERS
    over = judg.get("chapters") or {}
    chapters, done = [], set()
    if plan is not None:
        heads, starts = {}, {}
        side = sorted((P / "spine").glob(f"{a.scope}.?.paused.json"))
        pauses = json.loads(side[-1].read_text(encoding="utf-8")).get("pauses", []) if side else []
        pauses = sorted(pauses, key=lambda p: float(p["at"]))
        cards = [p for p in pauses if p.get("card")]
        ep = P / "EDIT-PLAN.md"
        if ep.is_file():
            ep_txt = ep.read_text(encoding="utf-8")
            heads = {m.group(1): m.group(2).strip() for m in re.finditer(r"^## (CH\d+) - (.+?)(?: \(|$)", ep_txt, re.M)}
            starts = {m.group(1): int(m.group(2)) * 60 + float(m.group(3)) for m in
                      re.finditer(r"^## (CH\d+) - .*?\((\d+):(\d+(?:\.\d+)?)-", ep_txt, re.M)}
        # a CARVED plan (one track carved into `cover: section` rows, music.md "ONE TRACK, CARVED") holds several rows per
        # chapter, and each starts where the MUSIC lands (a splice before the chapter, a right-aligned climb), not where the
        # chapter does: one chapter per distinct chapter, timed by its EDIT-PLAN heading span (`## CHn - NAME (M:SS.s-...`).
        # A one-bed-per-chapter plan keeps its bed's span start, exactly as before.
        carved = any(b.get("cover") == "section" for b in plan["beds"])
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
    else:
        for st, name in judg.get("chapter_stamps") or []:
            chapters.append((unstamp(st), str(name).strip(), ""))
    if chapters:
        if chapters[0][0] != 0.0:
            fails.append("the first chapter must start at 0:00")
        if len(chapters) < 3:
            fails.append(f"YouTube needs at least 3 chapters, the plan has {len(chapters)}")
        for (t0, n0, c0), (t1, _, _) in zip(chapters, chapters[1:]):
            if int(t1) - int(t0) < 10:
                fails.append(f"{c0 or stamp(t0)} '{n0}' runs {int(t1) - int(t0)} s (YouTube minimum 10 s)")
        fails += copy_fails("chapters", " ".join(n for _, n, _ in chapters))

    # MUSIC CODES
    lib = {t.get("id"): t for t in json.loads(LIBRARY.read_text(encoding="utf-8")).get("tracks", []) if isinstance(t, dict)}
    if plan is not None:
        # a carved plan names its one track at the top; a bed without a track_id is resolved from its source file
        # (2026-11-02, left-behind: two tracks, Kitsune + a Lightheart carve, and the fallback dropped Lightheart's code)
        known = [t.get("id") for t in (plan.get("tracks") or []) if isinstance(t, dict) and t.get("id")]
        def _tid(b):
            if b.get("track_id"):
                return b["track_id"]
            src = str(b.get("source_file") or b.get("file") or "").replace("\\", "/").lower()
            hit = next((k for k in known if k and (f"/{k}/" in src or f"_{k}_" in src)), None)
            return hit or (plan.get("track") or {}).get("id")
        tids = [_tid(b) for b in plan["beds"]]
    else:
        tids = list(judg.get("music_track_ids") or [])
    codes, seen = [], set()
    for tid in tids:
        if tid in seen:
            continue
        seen.add(tid)
        code = (lib.get(tid) or {}).get("yt_license_code")
        if not code:
            fails.append(f"no yt_license_code for music track '{tid}' in {LIBRARY.name}")
        else:
            codes.append(code)
    # licensed music that is not a MUSIC-PLAN bed, e.g. a one-off sting placed as an SFX row (bullish-on-kaspa 2026-11-05)
    codes += [c for c in (judg.get("extra_music_codes") or []) if c not in codes]

    desc_txt, hash_txt = " ".join(desc), " ".join(hashtags)
    chap_txt = "\n".join(f"{stamp(t)} {n}" for t, n, _ in chapters) or "(none: no chapter map)"
    code_txt = "|".join(codes) or "(none: no licensed music)"
    kw_txt = ", ".join(tags)
    kw_head = f"KEYWORDS ({len(keywords)} keywords + {len(misspellings)} common misspellings, {n_chars} of {TAG_BUDGET} tag characters)"
    fence = "```"
    md = (f"# {P.name} - YouTube metadata\n\n_Written by `scripts/yt_delivery.py` (at finalize, and whenever Mike asks for the "
          f"metadata). The judgment half is `yt-delivery.json`; the spec is the script's docstring._\n\n"
          f"## Title\n{fence}\n{title}\n{fence}\n\n"
          f"## Description (two sentences, the first an open loop) + hashtags\n{fence}\n{desc_txt}\n\n{hash_txt}\n{fence}\n\n"
          f"## Chapters\n{fence}\n{chap_txt}\n{fence}\n\n## Music codes (YouTube only)\n{fence}\n{code_txt}\n{fence}\n\n"
          f"## Keywords: the tags field ({len(keywords)} + {len(misspellings)} common misspellings, {n_chars} of {TAG_BUDGET} "
          f"characters)\n{fence}\n{kw_txt}\n{fence}\n")
    (P / "YT-DELIVERY.md").write_text(md, encoding="utf-8")
    print(f"TITLE\n{title}\n\nDESCRIPTION\n{desc_txt}\n\n{hash_txt}\n\nCHAPTERS\n{chap_txt}\n\nYT MUSIC CODES\n{code_txt}\n\n"
          f"{kw_head}\n{kw_txt}\n")
    for f in fails:
        print(f"  FAIL  {f}")
    print(f"YT-DELIVERY {'FAIL' if fails else 'ok'} title={1 if title else 0} description={len(desc)} hashtags={len(hashtags)} "
          f"chapters={len(chapters)} codes={len(codes)} keywords={len(keywords)} misspellings={len(misspellings)} tag_chars={n_chars}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
