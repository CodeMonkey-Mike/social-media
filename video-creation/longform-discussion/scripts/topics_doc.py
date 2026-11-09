#!/usr/bin/env python
"""
topics_doc.py - a session's topic list as a .docx Mike narrows by deleting (Mike, 2026-11-05).

Why a document: he reads the list and cuts it down to what he wants to say. Markdown reads well only in preview, and the
preview cannot be edited. So TOPICS.docx is the deliverable AND the ruling: what is still in the saved file is what he approved.
His .docx files open in LibreOffice by default, and Word works too, so both apps' saved files are read here.

The shape is the way he records: topic > tab > what to say while that tab is on screen (Mike: "If I'm on a tab, I need to
know what to talk about"). Each tab is a Heading 2, so deleting one in the Navigator takes its facts with it.

build_doc()     writes it from TOPICS.json (python-docx).
rule_from_doc() reads the saved file back into a ruling. It reads the raw XML on purpose: a tracked deletion is still in the
                file, and a library's paragraph text can miss tracked insertions. apply_ruling() writes it into the session.

What each edit means:
  a topic's heading gone        topic rejected
  order of the topic headings   the running order
  a tab's heading gone          tab dropped, with whatever was deleted along with it
  order of the tab headings     the order he opens them
  a fact / caution / line gone  dropped from the session (a deleted clip never downloads)
  a line under another tab      moved there, so "this fact belongs on that tab" is fixed by moving it
  a line above a topic's tabs   said on camera with no tab
  a line reworded               the item stays, his wording is recorded and printed for a check
  a line that matches nothing   his note on that tab or topic (a comment counts too)
  a new heading                 a new topic or tab for me to find, never auto-approved
  title ideas left at the top   the titles he is still considering
"""
import difflib
import re
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
BODY, BULLET, TOPIC, TAB = "Normal", "List Bullet", "Heading 1", "Heading 2"
KIND_WORD = {"article": "Article", "chart": "Chart", "x-post": "X post", "odds": "Odds", "local": "Chart I would build"}
CHILD_KINDS = {"highlight": "highlights", "inspiring": "inspiring", "prompt": "prompts", "fact": "facts", "careful": "careful"}   # line kind -> the list it lives in
INSPIRE_RGB, HIGHLIGHT_RGB = "0B7A53", "8A6D00"
FONT = "Calibri"
LINK_RGB, MUTED_RGB, WARN_RGB, INK_RGB = "0563C1", "595959", "9C2A00", "1F2933"
TEXT_LINK_MIN = 15   # a shorter fragment of an item could be coincidence, so it counts as a note


def clock_s(tc: str) -> float:
    secs = 0.0
    for part in str(tc).split(":"):
        secs = secs * 60 + float(part)
    return secs


def timestamp_link(url: str, start: str) -> str:
    """A link that opens the source at the clip's first second, so Mike can watch before anything is downloaded."""
    t = int(clock_s(start))
    return f"{url}{'&' if '?' in url else '?'}t={t}s"


def short_date(iso: str) -> str:
    d = date.fromisoformat(iso)
    return f"{d:%b} {d.day}"


def norm(s: str) -> str:
    """Compare text the way a reader would: an app may curl a quote or swap a hyphen, and neither is an edit."""
    s = unicodedata.normalize("NFKC", s)
    s = s.translate({0x2018: "'", 0x2019: "'", 0x201c: '"', 0x201d: '"', 0x2010: "-", 0x2011: "-", 0x2013: "-", 0x2014: "-"})
    return " ".join(s.split()).casefold()


# ── what the document says ────────────────────────────────────────────────────────────────────────────────────────────
@dataclass(eq=False)
class Line:
    """One paragraph of a topic. pieces = [(text, url or None, "bold" | "muted" | "warn" | None)]."""
    kind: str      # why_now | angle | tab | show | words | context | prompt | fact | careful
    topic: int
    owner: object  # the tab this line sits under, or the topic's no_tab bucket, or None for a topic-level line
    obj: object    # the fact or tab dict, or the string itself
    style: str
    pieces: list

    @property
    def text(self) -> str:
        return "".join(p[0] for p in self.pieces)


def fact_pieces(f):
    when = short_date(f["read"])
    if f["source"].startswith("http"):
        return [(f["text"], None, None), (" (", None, "muted"), ("source", f["source"], None), (f", read {when})", None, "muted")]
    return [(f["text"], None, None), (f" ({f['source']}, read {when})", None, "muted")]


def tab_pieces(t):
    if t["kind"] == "clip":
        secs = clock_s(t["end"]) - clock_s(t["start"])
        # once downloaded, the link is his local MP4 of only those seconds; until then, the source at the clip's first second
        link = Path(t["file"]).resolve().as_uri() if t.get("file") else timestamp_link(t["url"], t["start"])
        return [(f"Clip ({secs:.0f} s): ", None, None), (t["label"], link, None)]
    word = t.get("word") or KIND_WORD[t["kind"]]   # a finished local deck says so, instead of "Chart I would build"
    if t["url"].startswith("pending"):   # built only after approval: no link to offer yet
        return [(f"{word}: {t['label']}", None, None)]
    return [(f"{word}: ", None, None), (t["label"], t["url"], None)]


def child_lines(tid, owner):
    """What Mike says while this tab is up. Holds what he dropped earlier too, so a re-ruling can restore it."""
    lines = [Line("highlight", tid, owner, p, BULLET, [("Highlight: ", None, "highlight"), (f'"{p}"', None, None)]) for p in owner.get("highlights", [])]
    lines += [Line("inspiring", tid, owner, p, BULLET, [("Inspiring: ", None, "inspire"), (p, None, None)]) for p in owner.get("inspiring", [])]
    lines += [Line("prompt", tid, owner, p, BULLET, [("Say: ", None, "bold"), (p, None, None)]) for p in owner.get("prompts", [])]
    lines += [Line("fact", tid, owner, f, BULLET, fact_pieces(f)) for f in owner.get("facts", [])]
    for c in owner.get("careful", []) + owner.get("careful_dropped", []):
        lines.append(Line("careful", tid, owner, c, BULLET, [("Careful: ", None, "warn"), (c, None, None)]))
    return lines


def layout(t):
    """Every paragraph of one topic in reading order: the topic's framing, then each tab with what to say under it."""
    tid = t["id"]
    lines = [Line("why_now", tid, None, t["why_now"], BODY, [("Why now: ", None, "bold"), (t["why_now"], None, None)]),
             Line("angle", tid, None, t["angle"], BODY, [("Your angle: ", None, "bold"), (t["angle"], None, None)])]
    if t.get("no_tab"):
        lines += child_lines(tid, t["no_tab"])
    for tab in t["tabs"]:
        lines.append(Line("tab", tid, tab, tab, TAB, tab_pieces(tab)))
        if tab.get("show"):
            lines.append(Line("show", tid, tab, tab["show"], BODY, [("On this tab: ", None, "muted"), (tab["show"], None, "muted")]))
        if tab["kind"] == "clip":
            words = f'"{tab["words"]}"'
            ctx = f"Context check: {tab['context']}"
            lines.append(Line("words", tid, tab, words, BODY, [(words, None, None)]))
            lines.append(Line("context", tid, tab, ctx, BODY, [(ctx, None, "muted")]))
        lines += child_lines(tid, tab)
    return lines


def est_minutes(s):
    """Tabs are runtime, because he stops and talks at each one. Money and I: 14:58 over around 12 sources, so 1.25 minutes a tab.
    A deck says how long it takes (`minutes`). A topic with no tabs is his face for around a minute."""
    total = 0.0
    for t in s["topics"]:
        if t.get("status") == "REJECTED":
            continue
        tabs = [tab for tab in t.get("tabs", []) if not tab.get("dropped")]
        total += sum(tab.get("minutes", 1.25) for tab in tabs) if tabs else 1.0
    return total


def length_line(s):
    n = sum(1 for t in s["topics"] if t.get("status") != "REJECTED" for tab in t.get("tabs", []) if not tab.get("dropped"))
    if s.get("shape") == "plan" or any(t.get("status") == "APPROVED" for t in s["topics"]):
        return f"Length: {n} tabs, around {round(est_minutes(s))} minutes at a source a minute."
    return f"Length: this is a menu of {n} tabs, around {round(est_minutes(s))} minutes if you kept it all. A 15-minute video is around 12 tabs, so keep around that many."


def preface_lines(s):
    lines = [f"Discussion topics: {s['session']}", length_line(s),
             f"Researched {short_date(s['researched'])}. Each topic lists its tabs in the order you'd open them. Under each tab "
             "is what to say while it's on screen.",
             "Delete anything you don't want: a whole topic, a tab, or one line. What's left is your list. Move a topic, tab or "
             "fact to change the order or which tab it goes with, and type notes anywhere.",
             "Tip: View > Navigator (F5) lists the topics and tabs. Drag one to move it, or right-click it and delete it. "
             "Ctrl+click opens a link, and a clip's link opens at its first second.",
             "Save and close this when you're done, then tell me. Nothing downloads before that."]
    if s.get("note"):
        lines.append(s["note"])
    return lines


def video_lines(s):
    """Title and thumbnail ideas for the whole recording: (kind, text). Delete the ones you don't want."""
    video = s.get("video") or {}
    return [("title", x) for x in video.get("titles", [])] + [("thumbnail", x) for x in video.get("thumbnails", [])]


# ── writing ───────────────────────────────────────────────────────────────────────────────────────────────────────────
def build_doc(s, out: Path):
    from docx import Document
    from docx.enum.text import WD_LINE_SPACING
    from docx.opc.constants import RELATIONSHIP_TYPE as RT
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Inches, Pt, RGBColor

    def set_font(style, size, bold=None, rgb=None):
        style.font.name, style.font.size = FONT, Pt(size)
        if bold is not None:
            style.font.bold = bold
        if rgb:
            style.font.color.rgb = RGBColor.from_string(rgb)
        fonts = style.element.get_or_add_rPr().get_or_add_rFonts()
        for attr in ("asciiTheme", "hAnsiTheme", "eastAsiaTheme", "cstheme"):   # a theme font beats the named one
            fonts.attrib.pop(qn(f"w:{attr}"), None)
        fonts.set(qn("w:eastAsia"), FONT)

    def add_link(par, text, url):
        link = OxmlElement("w:hyperlink")
        link.set(qn("r:id"), par.part.relate_to(url, RT.HYPERLINK, is_external=True))
        run = OxmlElement("w:r")
        props = OxmlElement("w:rPr")
        color, under = OxmlElement("w:color"), OxmlElement("w:u")
        color.set(qn("w:val"), LINK_RGB)
        under.set(qn("w:val"), "single")
        props.append(color)
        props.append(under)
        body = OxmlElement("w:t")
        body.text = text
        body.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        run.append(props)
        run.append(body)
        link.append(run)
        par._p.append(link)

    def add_text(par, text, mark):
        run = par.add_run()
        run.bold = True if mark in ("bold", "warn", "inspire", "highlight") else None
        if mark in ("muted", "warn", "inspire", "highlight"):
            run.font.color.rgb = RGBColor.from_string({"muted": MUTED_RGB, "warn": WARN_RGB, "inspire": INSPIRE_RGB, "highlight": HIGHLIGHT_RGB}[mark])
        # A minus sign that wraps away from its number reads as a different number on camera.
        for i, chunk in enumerate(re.split(r"(?<!\w)-(?=[\d$])", text)):
            if i:
                run._r.append(OxmlElement("w:noBreakHyphen"))
            if chunk:
                run.add_text(chunk)

    def add_label(text):
        par = doc.add_paragraph()
        par.add_run(text).bold = True
        par.paragraph_format.space_before, par.paragraph_format.space_after = Pt(8), Pt(3)
        par.paragraph_format.keep_with_next = True

    doc = Document()
    for sec in doc.sections:
        sec.left_margin = sec.right_margin = Inches(1)
        sec.top_margin = sec.bottom_margin = Inches(0.9)
    set_font(doc.styles[BODY], 11, rgb=INK_RGB)
    fmt = doc.styles[BODY].paragraph_format
    fmt.space_after, fmt.line_spacing_rule, fmt.line_spacing = Pt(6), WD_LINE_SPACING.MULTIPLE, 1.12
    set_font(doc.styles[BULLET], 11, rgb=INK_RGB)
    doc.styles[BULLET].paragraph_format.space_after = Pt(4)
    for name, size, before in ((TOPIC, 17, 26), (TAB, 12.5, 14)):
        set_font(doc.styles[name], size, bold=True, rgb=INK_RGB)
        doc.styles[name].paragraph_format.space_before, doc.styles[name].paragraph_format.space_after = Pt(before), Pt(4)
        doc.styles[name].paragraph_format.keep_with_next = True

    head, *rest = preface_lines(s)
    par = doc.add_paragraph()
    run = par.add_run(head)
    run.bold, run.font.size = True, Pt(22)
    par.paragraph_format.space_after = Pt(8)
    for line in rest:
        par = doc.add_paragraph()
        par.add_run(line).font.color.rgb = RGBColor.from_string(MUTED_RGB)

    labelled = set()
    for kind, text in video_lines(s):
        if kind not in labelled:
            labelled.add(kind)
            add_label({"title": "Title ideas", "thumbnail": "Thumbnail ideas"}[kind])
        doc.add_paragraph(text, style=BULLET)

    for t in s["topics"]:
        doc.add_paragraph(f"{t['id']}. {t['title']}", style=TOPIC)
        for line in layout(t):
            par = doc.add_paragraph(style=line.style)
            for text, url, mark in line.pieces:
                if url:
                    add_link(par, text, url)
                else:
                    add_text(par, text, mark)
    doc.core_properties.title = f"Discussion topics: {s['session']}"
    doc.core_properties.author = ""
    doc.save(str(out))


# ── reading it back ───────────────────────────────────────────────────────────────────────────────────────────────────
def open_in(path: Path):
    """-> the app holding this file open, or None. Word locks the file. LibreOffice does not: it leaves a lock file beside it,
    so a plain lock test would call a document open in LibreOffice closed and miss its unsaved deletions."""
    if path.with_name(f".~lock.{path.name}#").is_file():
        return "LibreOffice"
    try:
        with open(path, "r+b"):
            return None
    except PermissionError:
        return "Word"


def live_text(node) -> str:
    """The text a reader sees: tracked deletions and the source side of a tracked move do not count."""
    out = []
    for child in node:
        if child.tag in (W + "del", W + "moveFrom", W + "pPr", W + "rPr"):
            continue
        if child.tag == W + "t":
            out.append(child.text or "")
        elif child.tag == W + "noBreakHyphen":
            out.append("-")
        elif child.tag in (W + "tab", W + "br"):
            out.append(" ")
        else:
            out.append(live_text(child))
    return "".join(out)


def read_doc(path: Path):
    """-> [(text, heading level or 0, [comment texts])], every non-empty paragraph in document order."""
    with zipfile.ZipFile(path) as z:
        body = ET.fromstring(z.read("word/document.xml"))
        styles = ET.fromstring(z.read("word/styles.xml"))
        notes = {}
        if "word/comments.xml" in z.namelist():
            for c in ET.fromstring(z.read("word/comments.xml")).iter(W + "comment"):
                notes[c.get(W + "id")] = " ".join(" ".join(live_text(p) for p in c.iter(W + "p")).split())
    # An app or a localized install can rename a style's id, but the name inside the file stays "heading 1".
    levels = {}
    for st in styles.iter(W + "style"):
        name = st.find(W + "name")
        m = re.fullmatch(r"heading ([12])", name.get(W + "val", "").lower()) if name is not None else None
        if m:
            levels[st.get(W + "styleId")] = int(m.group(1))
    out = []
    for p in body.iter(W + "p"):
        props = p.find(W + "pPr")
        style = props.find(W + "pStyle") if props is not None else None
        level = levels.get(style.get(W + "val"), 0) if style is not None else 0
        text = " ".join(live_text(p).split())
        comments = [notes[r.get(W + "id")] for r in p.iter(W + "commentReference") if notes.get(r.get(W + "id"))]
        if text or comments:
            out.append((text, level, comments))
    return out


def heading_topic(text, topics, seen):
    """-> (topic id or None, title as he left it). The number decides; a heading that lost it falls back to the title."""
    m = re.match(r"\s*(\d+)\s*[.):]\s*", text)
    if m and int(m.group(1)) in topics:
        return int(m.group(1)), text[m.end():].strip()
    titles = {norm(t["title"]): i for i, t in topics.items() if i not in seen}
    close = difflib.get_close_matches(norm(text), list(titles), n=1, cutoff=0.6)
    return (titles[close[0]], text) if close else (None, text)


def closest_line(text, candidates):
    """The deleted-looking line this paragraph is an edit of, or None if it is a new note."""
    key, best, best_score = norm(text), None, 0.6
    for line in candidates:
        was = norm(line.text)
        score = 1.0 if len(key) >= TEXT_LINK_MIN and key in was else difflib.SequenceMatcher(None, key, was).ratio()
        if score >= best_score:
            best, best_score = line, score
    return best


@dataclass(eq=False)
class Section:
    tab: object = None                          # the tab's Line, or None for what sits above a topic's first tab
    items: list = field(default_factory=list)   # Line, or str until it is resolved
    notes: list = field(default_factory=list)
    edits: list = field(default_factory=list)


def rule_from_doc(path: Path, s):
    """Read the saved document into a ruling, without changing the session."""
    topics = {t["id"]: t for t in s["topics"]}
    own = {t["id"]: layout(t) for t in s["topics"]}
    index = {}
    for lines in own.values():
        for line in lines:
            index.setdefault(norm(line.text), []).append(line)
    preface = {norm(x) for x in preface_lines(s)} | {"title ideas", "thumbnail ideas"}
    video = {norm(text): (kind, text) for kind, text in video_lines(s)}
    paras = read_doc(path)
    tab_headings = {norm(p[0]) for p in paras if p[1] == 2}

    claimed = set()

    def take(text, cur, tabs):
        # The same line can live in two topics: its own topic's copy wins, then any free copy (he moved it).
        options = [x for x in index.get(norm(text), []) if id(x) not in claimed and (x.kind == "tab") == tabs]
        line = next((x for x in options if x.topic == cur), options[0] if options else None)
        if line:
            claimed.add(id(line))
        return line

    order, errors, general, new_topics, kept_video = [], [], [], [], []
    sections, retitled = {}, {}
    cur, sec = None, None
    for text, level, comments in paras:
        if level == 1:
            tid, title = heading_topic(text, topics, sections)
            if tid is None:
                cur, sec = {"title": text, "notes": []}, None
                new_topics.append(cur)
            elif tid in sections:
                errors.append(f"topic {tid} appears twice in the document")
            else:
                order.append(tid)
                sec = Section()
                sections[tid], cur = [sec], tid
                if norm(title) != norm(topics[tid]["title"]):
                    retitled[tid] = title
        elif cur is None:
            key = norm(text)
            if key in video:
                kept_video.append(video[key])
            elif key and key not in preface and not key.startswith("length:"):   # the length line changes as he narrows
                general.append(text)
        elif isinstance(cur, dict):
            if text:
                cur["notes"].append(text)
        elif text:
            tab = take(text, cur, tabs=True)
            if tab is None and level == 2:   # a heading he reworded, or one he made up
                options = [x for x in own[cur] if x.kind == "tab" and id(x) not in claimed and norm(x.text) not in tab_headings]
                tab = closest_line(text, options)
                if tab:
                    claimed.add(id(tab))
                    sec = Section(tab=tab, edits=[{"kind": "tab", "was": tab.text, "now": text}])
                    sections[cur].append(sec)
                else:
                    sec.notes.append(f"New tab wanted: {text}")
            elif tab:
                sec = Section(tab=tab)
                sections[cur].append(sec)
            else:
                sec.items.append(take(text, cur, tabs=False) or text)
        for note in comments:
            if isinstance(cur, dict):
                cur["notes"].append(note)
            elif cur is None:
                general.append(note)
            else:
                sec.notes.append(f'Comment on "{text[:70]}": {note}')

    for tid, secs in sections.items():
        for sec in secs:
            for i, item in enumerate(sec.items):
                if isinstance(item, Line):
                    continue
                line = closest_line(item, [x for x in own[tid] if x.kind != "tab" and id(x) not in claimed])
                if line:
                    claimed.add(id(line))
                    sec.items[i] = line
                    sec.edits.append({"kind": line.kind, "was": line.text, "now": item})
                else:
                    sec.notes.append(item)
            sec.items = [x for x in sec.items if isinstance(x, Line)]

    if not order:
        errors.append("no topics are left in the document")
    return {"order": order, "errors": errors, "general": general, "new_topics": new_topics, "sections": sections, "own": own,
            "claimed": claimed, "retitled": retitled, "kept_video": kept_video}


def apply_ruling(s, r):
    """Write a ruling into the session. Rebuilt whole each time, so narrowing further or restoring a line both work.
    -> (changed, report lines)."""
    in_doc, own, claimed = r["sections"], r["own"], r["claimed"]
    report = []
    kept, tabs_kept = {}, {}
    for t in s["topics"]:
        for holder in [t, t.get("no_tab") or {}] + t["tabs"]:
            holder.pop("mike_notes", None)
            holder.pop("mike_edits", None)
    for tid, secs in in_doc.items():
        t = next(x for x in s["topics"] if x["id"] == tid)
        tabs_kept[tid] = []
        for sec in secs:
            holder = sec.tab.obj if sec.tab else t.setdefault("no_tab", {})
            if sec.tab:
                tabs_kept[tid].append(sec.tab.obj)
            bucket = kept.setdefault(id(holder), {field: [] for field in CHILD_KINDS.values()})
            for line in sec.items:
                if line.kind in CHILD_KINDS:
                    bucket[CHILD_KINDS[line.kind]].append(line.obj)
            target = sec.tab.obj if sec.tab else t
            if sec.notes:
                target.setdefault("mike_notes", []).extend(sec.notes)
            if sec.edits:
                target.setdefault("mike_edits", []).extend(sec.edits)
    live = {id(tab) for tabs in tabs_kept.values() for tab in tabs}

    # Every list is rebuilt from the document, so a line he moved leaves its old tab by itself.
    gone = {tid: [x for x in lines if id(x) not in claimed] for tid, lines in own.items()}
    holders = {}
    for t in s["topics"]:
        for holder in ([t["no_tab"]] if t.get("no_tab") else []) + t["tabs"]:
            holders[id(holder)] = (holder, t["id"])
    for holder, tid in holders.values():
        ruled = tid in in_doc or id(holder) in live
        bucket = kept.get(id(holder), {field: [] for field in CHILD_KINDS.values()})
        mine = [x for x in gone[tid] if x.owner is holder]
        for kind, name in CHILD_KINDS.items():
            lost = [x.obj for x in mine if x.kind == kind]
            if kind == "fact":
                for f in bucket[name]:
                    f.pop("dropped", None)
                for f in lost:
                    if ruled:
                        f["dropped"] = True
                    else:
                        f.pop("dropped", None)
                holder[name] = bucket[name] + lost
            elif kind == "careful":
                holder.pop("careful_dropped", None)
                holder[name] = bucket[name] if ruled else bucket[name] + lost
                if ruled and lost:
                    holder["careful_dropped"] = lost
            else:
                holder[name] = bucket[name] + ([] if ruled else lost)

    changed = False
    for t in s["topics"]:
        tid = t["id"]
        here = tid in in_doc
        was_order = [x.obj["label"] for x in own[tid] if x.kind == "tab" and not x.obj.get("dropped")]
        lost_tabs = [x.obj for x in gone[tid] if x.kind == "tab"]
        t["tabs"] = tabs_kept.get(tid, []) + lost_tabs
        for tab in tabs_kept.get(tid, []):
            tab.pop("dropped", None)
        for tab in lost_tabs:
            if here:
                tab["dropped"] = True
            else:
                tab.pop("dropped", None)
        t["status"] = "APPROVED" if here else "REJECTED"
        if t.get("no_tab") == {} or (t.get("no_tab") and not any(t["no_tab"].values())):
            t.pop("no_tab", None)
        if not here:
            changed = True
            continue
        if tid in r["retitled"]:
            t["title"] = r["retitled"][tid].replace("—", ",")
            report.append(f"RETITLED topic {tid}: {t['title']}")
            changed = True
        for x in gone[tid]:
            changed = True
            if x.kind == "tab":
                n = sum(1 for y in gone[tid] if y.owner is x.obj and y.kind in CHILD_KINDS)
                report.append(f"REMOVED tab from topic {tid}: {x.obj['label']}" + (f" (lines under it: {n})" if n else ""))
            elif x.kind in CHILD_KINDS and x.owner not in lost_tabs:
                report.append(f"REMOVED from topic {tid}: {x.text[:90]}")
        now_order = [tab["label"] for tab in tabs_kept[tid]]
        if now_order != [x for x in was_order if x in now_order]:
            report.append(f"REORDERED tabs in topic {tid}: {' > '.join(now_order)}")
            changed = True
        for sec in in_doc[tid]:
            holder = sec.tab.obj if sec.tab else t.get("no_tab")
            where = sec.tab.obj["label"] if sec.tab else "no tab, on camera"
            if sec.tab and sec.tab.topic != tid:
                report.append(f"MOVED tab to topic {tid} from topic {sec.tab.topic}: {where}")
                changed = True
            for line in sec.items:
                if line.kind in CHILD_KINDS and line.owner is not holder:
                    report.append(f"MOVED to '{where}' in topic {tid}: {line.text[:90]}")
                    changed = True
            for e in sec.edits:
                report.append(f"CHANGED in topic {tid}, {where} ({e['kind']}): {e['now']}")
                changed = True
            for n in sec.notes:
                report.append(f"NOTE on topic {tid}, {where}: {n}")
                changed = True
    s["order"] = r["order"]
    changed = changed or r["order"] != [t["id"] for t in s["topics"]]

    if video_lines(s):
        all_video = video_lines(s)
        if len(r["kept_video"]) != len(all_video):
            changed = True
            report.append("TITLES AND THUMBNAILS KEPT: " + (" | ".join(x[1] for x in r["kept_video"]) or "none"))
        s.setdefault("video", {})["kept"] = [x[1] for x in r["kept_video"]]
    for key, value in (("mike_notes", r["general"]), ("mike_new_topics", r["new_topics"])):
        s.pop(key, None)
        if value:
            s[key] = value
            changed = True
    report += [f"GENERAL NOTE: {n}" for n in r["general"]]
    report += [f"NEW TOPIC to research: {n['title']}" + (f" ({' / '.join(n['notes'])})" if n["notes"] else "") for n in r["new_topics"]]
    return changed, report
