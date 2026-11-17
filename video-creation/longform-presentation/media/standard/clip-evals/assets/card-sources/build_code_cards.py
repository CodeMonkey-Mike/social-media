#!/usr/bin/env python
"""build_code_cards.py: render the clip-evals CODE and JSON cards from the REAL source files.

  python build_code_cards.py [--only card,card] [--no-shoot]               16:9, cards-code.html -> ../cards/
  python build_code_cards.py --vertical [--only card,card] [--no-shoot]    9:16, cards-code-vertical.html
                                                                            -> ../vertical/cards/ (1080x1920)

--vertical: the same cards re-laid out for a phone (base.css + portrait-code.css): code 26 to 30px, the panel and
the timeline above y 1450, the footnote above y 1700, 60px side margins. A block's optional `vertical_show` (same
format as `show`; a list for every state, or {state: list} for one excerpt per state) replaces `show` in this mode
only, so a tall card can drop context into gap markers; every lit line must stay shown (checked). VERTICAL_SKIP
lists the stills Mike never speaks over, which get no vertical version.

Reads ../code-cards.json (its `about` field is the format), reads every block's lines from the real file (paths are
relative to the repo root), checks every `expect` anchor and STOPS on a mismatch (the file moved: fix the JSON, never
guess), and writes cards-code.html next to this script: one <section class="frame" id="<card>-<state>"> per state
(just "<card>" when the only state is `_`). Code text is HTML-escaped and otherwise character for character what the
file holds; a line's leading spaces become its indent (--ind), so a wrapped line hangs under it.

Then it FITS each card: it opens the page in headless Chromium and picks, per card, the largest code font from 30px
down to 22px at which the whole card stays inside the 1920x1080 frame with its margins (every state of a card gets the
same size, so states are pixel-stable). A card that does not fit at 22px is reported with the overflow in px and the
build FAILS (it is never shrunk below 22px). Finally it calls shoot.py to write the PNGs to ../cards/.

Machine line: CODE-CARDS PASS|FAIL cards=N frames=N
"""
import argparse
import html
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent
REPO = HERE.parents[6]          # .../social-media
SPEC = ASSETS / "code-cards.json"
OUT_HTML = HERE / "cards-code.html"
CARDS_DIR = ASSETS / "cards"
FS_MAX, FS_MIN = 30, 22
MARGIN_Y = 44                   # px kept free above and below the card content
# --vertical (phone rules, Mike's vertical-repurpose.md section 1): code 26px minimum, the code panel and the timeline
# end above SAFE_Y (a phone's interface covers the lower part), the footnote above FOOT_Y.
SAFE_Y, FOOT_Y = 1450, 1700
# Code stills Mike never says a line over: no vertical version (coordinator, 2026-11-16).
VERTICAL_SKIP = {"pairing-code", "replay-code", "replay-prompt-answer-key"}
LANDSCAPE = {"portrait": False, "w": 1920, "h": 1080, "fs_max": FS_MAX, "fs_min": FS_MIN, "skip": set(),
             "html": OUT_HTML, "out": CARDS_DIR}
VERTICAL = {"portrait": True, "w": 1080, "h": 1920, "fs_max": 30, "fs_min": 26, "skip": VERTICAL_SKIP,
            "html": HERE / "cards-code-vertical.html", "out": ASSETS / "vertical" / "cards"}

FONTS = ("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,wght@0,400;"
         "0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap")

PY_KW = set("""def return if elif else for in not and or is try except as from import with while class lambda yield
raise pass continue break global nonlocal assert del await async finally""".split())
PY_CONST = {"None", "True", "False"}
JSON_CONST = {"null", "true", "false"}

TOKEN = re.compile(r"""
  (?P<comment>\#.*$)
| (?P<tri>[rRbBfFuU]{0,2}(?:\"\"\"|'''))
| (?P<str>[rRbBfFuU]{0,2}(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))
| (?P<open>[rRbBfFuU]{0,2}["'].*$)
| (?P<num>(?<![\w.])\d+(?:\.\d+)?(?![\w]))
| (?P<name>[A-Za-z_]\w*)
| (?P<other>.)
""", re.X)


class Stop(Exception):
    pass


def esc(s):
    return html.escape(s, quote=False)


def nobreak_hyphens(s, tail=True):
    """U+2060 WORD JOINER (zero width, invisible) after a hyphen, so a soft wrap never splits "--resume" or
    "clip-evals" at the hyphen. Applied to the raw line before colouring; nothing visible changes."""
    if not s:
        return s
    s = re.sub(r"-(?=\S)", "-\u2060", s)
    # a NO-BREAK SPACE (same width in a monospace font) before a 1-2 character tail, so a wrap never leaves a lone `"`
    return re.sub(r" (\S{1,2})$", "\u00a0\\1", s) if tail else s


def soft_breaks(s, longest=28):
    """--vertical only: U+200B ZERO WIDTH SPACE (invisible) after '.', '(' and '/' inside a run of non-space characters longer
    than `longest`, so a narrow portrait line wraps at a code boundary ("...encode('utf-8')).|hexdigest()") instead of
    splitting a word. The text check strips it; the 16:9 build never adds it."""
    if not s:
        return s
    def fix(m):
        run = m.group()
        return re.sub(r"([.(/])(?=\S)", "\\1\u200b", run) if len(run) > longest else run
    return re.sub(r"\S+", fix, s)


def span(cls, text):
    return f'<span class="{cls}">{esc(text)}</span>' if text else ""


def _join(out):
    """Join lexed pieces; consecutive plain tokens become ONE <span class="sx-p">, so every piece of a code line is a
    span (a resting line dims its spans, and a comment span can rest brighter than the rest)."""
    html_, run = [], []
    for x in out:
        if isinstance(x, tuple):
            run.append(x[1])
            continue
        if run:
            html_.append(span("sx-p", "".join(run)))
            run = []
        html_.append(x)
    if run:
        html_.append(span("sx-p", "".join(run)))
    return "".join(html_)


def lex(text, lang, state):
    """Light syntax colouring of one code line. `state` carries an open triple-quoted string across lines."""
    out, i = [], 0
    if state.get("tri"):
        q = state["tri"]
        j = text.find(q)
        if j < 0:
            return span("sx-s", text)
        out.append(span("sx-s", text[: j + 3]))
        i = j + 3
        state["tri"] = None
    while i < len(text):
        m = TOKEN.match(text, i)
        kind, tok = m.lastgroup, m.group()
        if lang == "python" and kind == "comment":
            out.append(span("sx-c", tok))
        elif lang == "python" and kind == "tri":
            q = tok[-3:]
            j = text.find(q, m.end())
            if j < 0:
                out.append(span("sx-s", text[i:]))
                state["tri"] = q
                return _join(out)
            out.append(span("sx-s", text[i: j + 3]))
            i = j + 3
            continue
        elif kind in ("str", "open", "tri"):
            if kind == "tri":
                tok = text[i:]
                kind = "open"
            is_key = lang == "json" and kind == "str" and re.match(r"\s*:", text[m.end():])
            out.append(span("sx-key" if is_key else "sx-s", tok))
            if kind == "open":
                return _join(out)
        elif kind == "num":
            out.append(span("sx-n", tok))
        elif kind == "name":
            if lang == "python" and tok in PY_KW:
                out.append(span("sx-k", tok))
            elif (lang == "python" and tok in PY_CONST) or (lang in ("json", "text") and tok in JSON_CONST):
                out.append(span("sx-d", tok))
            else:
                out.append(("P", tok))
        else:
            out.append(("P", tok))
        i = m.end()
    return _join(out)


def render_text(text, lang, state, mark):
    if mark and mark not in text:
        raise Stop(f"mark {mark!r} not found in the rendered line {text!r}")
    if mark:
        a = text.index(mark)
        pre = lex(text[:a], lang, state)
        mid = lex(mark, lang, state)
        post = lex(text[a + len(mark):], lang, state)
        return f'{pre}<mark class="cc-mark">{mid}</mark>{post}'
    return lex(text, lang, state)


def expand(show):
    """show list -> [('line', n) | ('gap', label)]"""
    rows = []
    for s in show:
        if isinstance(s, dict):
            rows.append(("gap", s.get("gap", "")))
        elif isinstance(s, int):
            rows.append(("line", s))
        else:
            rows.extend(("line", n) for n in range(s[0], s[1] + 1))
    return rows


def check_rows(cid, bi, b, rows, lines):
    for kind, v in rows:
        if kind == "line" and not (0 < v <= len(lines)):
            raise Stop(f"{cid}: block {bi}: line {v} is past the end of {b['file']} ({len(lines)} lines)")


def load_blocks(cid, card, vertical=False):
    """Each block gets `rows` (its `show`) and `state_rows` {state: rows}. In --vertical mode a block's optional
    `vertical_show` replaces `show`: a list (the same excerpt for every state) or {state: list} (one excerpt per state,
    any state left out falls back to `show`)."""
    blocks = []
    for bi, b in enumerate(card["blocks"]):
        path = REPO / b["file"]
        if not path.is_file():
            raise Stop(f"{cid}: block {bi}: no such file {b['file']}")
        lines = path.read_text(encoding="utf-8").split("\n")
        for k, want in (b.get("expect") or {}).items():
            n = int(k)
            got = lines[n - 1] if 0 < n <= len(lines) else "<past the end of the file>"
            if not got.lstrip().startswith(want):
                raise Stop(f"{cid}: block {bi} ({b['file']}): line {n} should start with {want!r} but is "
                           f"{got.strip()!r}. The file has moved: update code-cards.json, do not guess.")
        rows = expand(b["show"])
        check_rows(cid, bi, b, rows, lines)
        state_rows = {s: rows for s in card["states"]}
        vs = b.get("vertical_show") if vertical else None
        if isinstance(vs, list):
            state_rows = {s: expand(vs) for s in card["states"]}
        elif isinstance(vs, dict):
            for s, show in vs.items():
                if s not in card["states"]:
                    raise Stop(f"{cid}: block {bi}: vertical_show names an unknown state {s!r}")
                state_rows[s] = expand(show)
        for r in state_rows.values():
            check_rows(cid, bi, b, r, lines)
        blocks.append({"label": b.get("label", ""), "rows": rows, "state_rows": state_rows, "lines": lines})
    return blocks


def card_states(cid, card, blocks, skip=()):
    states = card["states"]
    out = []
    for sname, st in states.items():
        fid = cid if (sname == "_" and len(states) == 1) else f"{cid}-{sname}"
        if fid in skip:
            continue
        lit = set()
        for bi, a, z in st.get("lit", []):
            shown = {v for k, v in blocks[bi]["state_rows"][sname] if k == "line"}
            for n in range(a, z + 1):
                if n not in shown:
                    raise Stop(f"{cid}/{sname}: lit line {n} of block {bi} is not a shown line")
                lit.add((bi, n))
        marks = {}
        for bi, n, sub in st.get("mark", []):
            if sub not in blocks[bi]["lines"][n - 1]:
                raise Stop(f"{cid}/{sname}: mark {sub!r} not found on line {n} of block {bi}")
            marks[(bi, n)] = sub
        out.append((fid, lit, marks, sname))
    return out


def timeline(extra):
    pts = extra["points"]
    cls = ["c", "go"]
    items = []
    for i, p in enumerate(pts):
        tag = f'<div class="tl-tag">{esc(p["tag"])}</div>' if p.get("tag") else ""
        items.append(f'<div class="tl-pt {cls[min(i, 1)]}"><div class="tl-when">{esc(p["when"])}</div>'
                     f'<div class="tl-what">{esc(p["what"])}</div>{tag}</div>')
    span_ = f'<div class="tl-span">{esc(extra["span"])}</div>' if extra.get("span") else ""
    return (f'<div class="tl"><div class="tl-title">{esc(extra.get("title", ""))}</div>'
            f'<div class="tl-rail">{span_}</div><div class="tl-pts">{"".join(items)}</div></div>')


def title_html(title, portrait):
    """Portrait titles are balanced (portrait-code.css); a number is glued to the word after it with a no-break space
    so a balanced break never leaves "1" apart from "line". Same visible text; the 16:9 title is untouched."""
    t = esc(title)
    return re.sub(r"\b(\d+) ", "\\1&nbsp;", t) if portrait else t


def frame_html(cid, card, blocks, fid, lit, marks, fs, sname, portrait=False):
    lang = card.get("language", "python")
    cls_ = "frame code-frame portrait" if portrait else "frame code-frame"
    parts = [f'<section class="{cls_}" id="{fid}" data-card="{cid}" style="--cc-fs:{fs}px">',
             '<div class="cc-wrap">',
             f'<div class="ey">{esc(card["eyebrow"])}</div>',
             f'<h1 class="cc-title">{title_html(card["title"], portrait)}</h1>',
             '<div class="cc-panel">']
    for bi, b in enumerate(blocks):
        parts.append(f'<div class="cc-block"><div class="cc-label">{esc(b["label"])}</div>')
        state = {}
        for kind, v in b["state_rows"][sname]:
            if kind == "gap":
                state = {}
                dots = '<span class="cc-dots">···</span>'
                parts.append(f'<div class="cc-gap"><span class="cc-ln"></span><span class="cc-tx">{dots}{esc(v)}</span></div>')
                continue
            raw = b["lines"][v - 1].rstrip("\r")
            body = raw.lstrip(" ")
            ind = len(raw) - len(body)
            text, mark = nobreak_hyphens(body), nobreak_hyphens(marks.get((bi, v)), tail=False)
            if portrait:
                text = soft_breaks(text)
                if mark and mark not in text:   # the mark sits in a long run: give it the same break points
                    mark = soft_breaks(mark, longest=0) if soft_breaks(mark, longest=0) in text else mark
            txt = render_text(text, lang, state, mark)
            cls = "cc-line lit" if (bi, v) in lit else "cc-line"
            parts.append(f'<div class="{cls}" style="--ind:{ind}"><span class="cc-ln">{v}</span>'
                         f'<span class="cc-tx">{txt}</span></div>')
        parts.append("</div>")
    parts.append("</div>")
    if card.get("extra", {}).get("type") == "timeline":
        parts.append(timeline(card["extra"]))
    if card.get("note"):
        foot = re.sub(r"`([^`]+)`", r'<span class="mono">\1</span>', esc(card["note"]))
        parts.append(f'<div class="cc-foot">{foot}</div>')
    parts.append("</div></section>")
    return "\n".join(parts)


def page(frames, portrait=False):
    extra_css = '<link href="portrait-code.css" rel="stylesheet">\n' if portrait else ""
    kind = "VERTICAL 1080x1920 " if portrait else ""
    return ("<!DOCTYPE html>\n<html lang=\"en\"><head><meta charset=\"UTF-8\">\n"
            f"<title>clip-evals: {kind}code and JSON cards (GENERATED by build_code_cards.py, do not edit)</title>\n"
            f'<link href="{FONTS}" rel="stylesheet">\n<link href="base.css" rel="stylesheet">\n{extra_css}'
            # inline rule naming the 3 families, so shoot.py's font check can see them
            "<style>.font-probe{font-family:'Playfair Display','DM Sans','JetBrains Mono'}"
            "body{display:flex;flex-direction:column;gap:40px;align-items:flex-start}</style>\n"
            "</head><body>\n" + "\n\n".join(frames) + "\n" + PROBE + "\n</body></html>\n")


# off-frame probe: renders each family at weight 400 so shoot.py's document.fonts.check() sees it loaded
PROBE = ('<div class="font-probe" style="position:absolute;left:-9999px;top:0">'
         "<span style=\"font-family:'Playfair Display'\">Aa</span><span style=\"font-family:'DM Sans'\">Aa</span>"
         "<span style=\"font-family:'JetBrains Mono'\">Aa</span></div>")


FIT_JS = """([fsMax, fsMin, margin]) => {
  const res = {};
  const seen = new Set();
  for (const fr of document.querySelectorAll('section.frame.code-frame')) {
    const cid = fr.dataset.card;
    if (seen.has(cid)) continue;
    seen.add(cid);
    const wrap = fr.querySelector('.cc-wrap');
    let chosen = null, over = 0;
    for (let fs = fsMax; fs >= fsMin; fs--) {
      fr.style.setProperty('--cc-fs', fs + 'px');
      const h = wrap.getBoundingClientRect().height;
      const wideOver = wrap.scrollWidth - wrap.clientWidth;
      over = Math.ceil(h - (1080 - 2 * margin));
      if (over <= 0 && wideOver <= 0) { chosen = fs; break; }
    }
    res[cid] = {fs: chosen, over: over};
  }
  return res;
}"""


# Portrait fit: every state of a card is tried at the same size (largest first); a size passes when, in EVERY state,
# the code panel and the timeline end above `safe` (the phone's interface covers the lower part of the frame), the
# footnote ends above `foot`, and nothing is wider than the frame's content box.
FIT_PORTRAIT_JS = """([fsMax, fsMin, safe, foot]) => {
  const byCard = {};
  for (const fr of document.querySelectorAll('section.frame.code-frame')) {
    (byCard[fr.dataset.card] = byCard[fr.dataset.card] || []).push(fr);
  }
  const res = {};
  for (const [cid, frames] of Object.entries(byCard)) {
    let chosen = null, over = 0;
    for (let fs = fsMax; fs >= fsMin; fs--) {
      let worst = -1e9;
      for (const fr of frames) {
        fr.style.setProperty('--cc-fs', fs + 'px');
        const top = fr.getBoundingClientRect().top;
        const wrap = fr.querySelector('.cc-wrap');
        const main = [fr.querySelector('.cc-panel'), fr.querySelector('.tl')].filter(Boolean);
        const mainBottom = Math.max(...main.map(e => e.getBoundingClientRect().bottom - top));
        worst = Math.max(worst, mainBottom - safe);
        const f = fr.querySelector('.cc-foot');
        if (f) worst = Math.max(worst, f.getBoundingClientRect().bottom - top - foot);
        if (wrap.scrollWidth - wrap.clientWidth > 0) worst = Math.max(worst, 1);
      }
      over = Math.ceil(worst);
      if (over <= 0) { chosen = fs; break; }
    }
    for (const fr of frames) fr.style.setProperty('--cc-fs', (chosen || fsMin) + 'px');
    res[cid] = {fs: chosen, over: over};
  }
  return res;
}"""


def fit(html_path, mode):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": mode["w"], "height": mode["h"]})
        pg.goto(html_path.as_uri(), wait_until="networkidle")
        pg.evaluate("document.fonts.ready")
        loaded = pg.evaluate("['Playfair Display','DM Sans','JetBrains Mono'].map(f => "
                             "Array.from(document.fonts).some(x => x.family.replace(/\"/g,'') === f && x.status === 'loaded'))")
        if mode["portrait"]:
            res = pg.evaluate(FIT_PORTRAIT_JS, [mode["fs_max"], mode["fs_min"], SAFE_Y, FOOT_Y])
        else:
            res = pg.evaluate(FIT_JS, [mode["fs_max"], mode["fs_min"], MARGIN_Y])
        shown = pg.evaluate("Array.from(document.querySelectorAll('section.frame.code-frame')).map(fr => "
                            "[fr.id, Array.from(fr.querySelectorAll('.cc-line')).map(l => "
                            "[l.querySelector('.cc-ln').textContent, l.querySelector('.cc-tx').textContent])])")
        b.close()
    return res, loaded, shown


def check_text(cards, shown):
    """Character-for-character proof: every rendered line (its text read back from the page, the invisible
    U+2060 / no-break space wrap helpers undone, its indent restored) must equal the file's line exactly."""
    want = {}
    for cid, card, blocks, sts in cards:
        for fid, _, _, sname in sts:
            want[fid] = [(str(v), b["lines"][v - 1].rstrip("\r"))
                         for b in blocks for k, v in b["state_rows"][sname] if k == "line"]
    bad = []
    for fid, lines in shown:
        exp = want.get(fid, [])
        if len(lines) != len(exp):
            bad.append(f"{fid}: {len(lines)} lines rendered, {len(exp)} expected")
            continue
        for (ln, tx), (eln, etx) in zip(lines, exp):
            body = etx.lstrip(" ")
            got = tx.replace("\u2060", "").replace("\u200b", "").replace("\u00a0", " ")
            if ln != eln or got != body:
                bad.append(f"{fid}: line {eln} renders as {got!r}, the file has {body!r}")
    return bad


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", default=None, help="comma list of card ids")
    ap.add_argument("--no-shoot", action="store_true")
    ap.add_argument("--vertical", action="store_true",
                    help="the 1080x1920 set: cards-code-vertical.html + portrait-code.css -> ../vertical/cards/")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    mode = VERTICAL if a.vertical else LANDSCAPE
    out_html, fs_min = mode["html"], mode["fs_min"]
    spec = json.loads(SPEC.read_text(encoding="utf-8"))
    only = set(a.only.split(",")) if a.only else None
    cards = []
    try:
        for cid, card in spec["cards"].items():
            if only and cid not in only:
                continue
            if cid in mode["skip"]:
                continue
            blocks = load_blocks(cid, card, vertical=a.vertical)
            sts = card_states(cid, card, blocks, skip=mode["skip"])
            if sts:
                cards.append((cid, card, blocks, sts))
    except Stop as e:
        print(f"  STOP  {e}")
        print("CODE-CARDS FAIL cards=0 frames=0")
        return 1

    def write(sizes):
        frames = [frame_html(cid, card, blocks, fid, lit, marks, sizes.get(cid, fs_min), sname, a.vertical)
                  for cid, card, blocks, sts in cards for fid, lit, marks, sname in sts]
        out_html.write_text(page(frames, a.vertical), encoding="utf-8", newline="\n")
        return len(frames)

    try:
        write({})
        res, loaded, shown = fit(out_html, mode)
    except Stop as e:
        print(f"  STOP  {e}")
        print("CODE-CARDS FAIL cards=0 frames=0")
        return 1
    fails = check_text(cards, shown)
    if not fails:
        print(f"  text  every rendered line equals its source line ({sum(len(x[1]) for x in shown)} lines checked)")
    if not all(loaded):
        fails.append("fonts did not load during the fit pass (Playfair Display, DM Sans, JetBrains Mono): " + str(loaded))
    sizes = {}
    for cid, r in res.items():
        if r["fs"] is None:
            fails.append(f"{cid}: does not fit at {fs_min}px, {r['over']} px too tall")
        else:
            sizes[cid] = r["fs"]
            print(f"  fit  {cid:18s} {r['fs']}px")
    n = write(sizes)
    print(f"  wrote {out_html.name}: {n} frames")
    if fails:
        for f in fails:
            print(f"  FAIL  {f}")
        print(f"CODE-CARDS FAIL cards={len(cards)} frames={n}")
        return 1
    if not a.no_shoot:
        ids = ",".join(fid for _, _, _, sts in cards for fid, _, _, _ in sts)
        rc = subprocess.call([sys.executable, str(HERE / "shoot.py"), str(out_html), "--out", str(mode["out"]),
                              "--size", f"{mode['w']}x{mode['h']}", "--only", ids])
        if rc:
            print(f"CODE-CARDS FAIL cards={len(cards)} frames={n} (shoot.py failed)")
            return 1
    print(f"CODE-CARDS PASS cards={len(cards)} frames={n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
