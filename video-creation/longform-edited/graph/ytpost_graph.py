"""
ytpost_graph.py: the OPTIONAL last step of a longform-edited OR longform-presentation video, run once the video is LIVE
on YouTube (Mike, 2026-11-11, canton): a YouTube community post that promotes it, a square image CAROUSEL in the video's
own look with Mike's picture on the first and last slides (the "watch the full video" format other crypto channels run),
queued as a `pending` row of the YT post queue of the CHANNEL the video is on (CHANNELS below, Mike 2026-11-17):
schedule-tweets/data/yt-posts.json for the crypto channel (posted by Mike's posting run, post-yt-community.js),
schedule-tweets/data/ai-yt-posts.json for AI Engineering Simplified (the dashboard's "AI YouTube Posts" tab; posted by
schedule-tweets/scripts/post_yt_community.py --channel ai, from its own ai-ytbot-profile, since 2026-11-17).

  python video-creation/longform-edited/graph/run.py ytpost --project <name> --url <youtube link> [--face <still>] [--logo <img>]

Nodes (no HITL gate: the queue row IS the review point, nothing posts until Mike runs posting):
  y_preflight  the link is checked against the project (oEmbed title == the video's title; a wrong link FAILS, canton
               2026-11-11: the first link given was another video) and its channel must have a queue -> yt-post/video.json;
               picks Mike's face still + logo
  y_plan       yt-post-author agent -> yt-post/YT-POST.json (slides + post copy); the node stamps the fixed fields and
               FAILS a number on a slide that the video never said (AS-RECORDED.md / DATA.md)
  y_build      skills/yt-post/build_yt_post.py -> yt-post/slides/NN.png (1080x1080, the video's locked stylesheet)
  y_qa         visual-qa on every slide; a FAIL goes back to the author with the defects (2 rounds), then rebuild
  y_queue      slides -> schedule-tweets/images/<channel dir>/, the row upserted into the channel's queue with Node
               (never PowerShell)
Canonical rules: ../skills/yt-post/yt-post.md
"""
import json
import re
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request
import uuid
from datetime import datetime
from pathlib import Path
from typing import TypedDict

from langgraph.graph import StateGraph, START, END

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402

SK = C.SKILLS / "yt-post"
BUILD = SK / "build_yt_post.py"
DATA_DIR = C.REPO_ROOT / "schedule-tweets" / "data"
IMAGES_DIR = C.REPO_ROOT / "schedule-tweets" / "images"
# The queue a promo post joins = the one for the channel the LIVE video is on, read off its oEmbed author_url in
# y_preflight, never off the track: a longform-edited or a longform-presentation video can be on either channel (Mike,
# 2026-11-17: "the queue will be specifically for the AI engineering simplified channel"). Keyed by the lower-cased
# handle; a video on any other channel fails y_preflight. `posting` is what the run report says happens next.
CHANNELS = {
    "@codemonkeymike": {"label": "the crypto channel", "queue": "yt-posts.json", "images": "yt", "prefix": "yt-posts",
                        "row": "yt-post", "tab": "YT Posts", "posting": "posts on Mike's next YT post run"},
    "@aiengineeringsimplified": {"label": "AI Engineering Simplified", "queue": "ai-yt-posts.json", "images": "ai-yt",
                                 "prefix": "ai-yt-posts", "row": "ai-yt-post", "tab": "AI YouTube Posts",
                                 "posting": "posts when Mike asks: post_yt_community.py --channel ai"},
}
QA_ROUNDS = 2
NUM_RE = re.compile(r"\d+(?:[.,]\d+)*")


class YtPostState(TypedDict, total=False):
    project: str
    project_dir: str
    scope: str
    thread: str
    lane: str
    stub: str
    url: str
    face: str
    logo: str
    approve: list
    done: list
    redo: list
    steps: dict
    status: str
    error: str


def _proj(state) -> Path:
    return Path(state["project_dir"])


def _redo(state, node) -> bool:
    return node in (state.get("redo") or [])


def _dir(proj: Path) -> Path:
    d = proj / "yt-post"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _norm(t: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (t or "").lower())


def channel_of(handle: str):
    """The CHANNELS entry for a channel handle ("@aiEngineeringSimplified"), else None."""
    return CHANNELS.get((handle or "").strip().lower())


def video_id(url: str):
    """The 11-char id of a youtu.be / watch?v= / shorts / live link, else None."""
    u = urllib.parse.urlparse((url or "").strip())
    if u.netloc.endswith("youtu.be"):
        vid = u.path.strip("/").split("/")[0]
    elif "youtube.com" in u.netloc:
        q = urllib.parse.parse_qs(u.query)
        vid = (q.get("v") or [""])[0] or (u.path.split("/")[2] if u.path.startswith(("/shorts/", "/live/")) else "")
    else:
        vid = ""
    return vid if re.fullmatch(r"[\w-]{11}", vid or "") else None


is_presentation = C.is_presentation   # shared with the short lane (common.py)


def final_of(proj: Path):
    """The delivered FINAL: `<project>-FINAL.mp4` (longform-edited), else the newest `<project> FINAL-vN.mp4`
    (longform-presentation; a `VERTICAL` cut is never the FINAL)."""
    hits = sorted(proj.glob("*-FINAL.mp4")) or sorted(
        (f for f in proj.glob("* FINAL-v*.mp4") if re.fullmatch(r".* FINAL-v\d+\.mp4", f.name)),   # never a -LINKEDIN cut
        key=lambda p: p.stat().st_mtime)
    return hits[-1] if hits else None


def _transcript_text(proj: Path) -> str:
    """What he SAID, from the newest word-time JSON in spine/ (a presentation project has no AS-RECORDED.md)."""
    hits = sorted((proj / "spine").glob("*medium-words.json"), key=lambda p: p.stat().st_mtime)
    if not hits:
        return ""
    try:
        data = json.loads(hits[-1].read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return ""
    segs = data.get("segments", data) if isinstance(data, dict) else data
    return " ".join(str(w.get("word", w.get("text", ""))).strip() for s in segs for w in (s.get("words") or []))


def project_title(proj: Path) -> str:
    for name, key in (("yt-delivery.json", "title"), ("publish-meta.json", "title")):
        try:
            t = json.loads((proj / name).read_text(encoding="utf-8")).get(key)
            if t:
                return t
        except (OSError, ValueError):
            continue
    return ""


# ── nodes ────────────────────────────────────────────────────────────────────────────

def y_preflight(state: YtPostState) -> YtPostState:
    """The video is delivered AND the link plays THIS video (oEmbed), plus the face still and the logo exist."""
    node = "y_preflight"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    d = _dir(proj)
    vj = d / "video.json"
    prev = json.loads(vj.read_text(encoding="utf-8")) if vj.is_file() else {}
    url = state.get("url") or prev.get("url") or ""
    vid = video_id(url)
    if not vid:
        return C._fail(state, node, f"no usable YouTube link ({url or 'none given'}): pass --url <youtu.be/... link of the LIVE video>")
    if not final_of(proj):
        return C._fail(state, node, f"{proj.name} has no delivered FINAL (`*-FINAL.mp4`, or `<project> FINAL-vN.mp4` in the "
                                    "presentation track): the YT post promotes a finished, live video")
    want = project_title(proj)
    if not want:
        return C._fail(state, node, "no title in yt-delivery.json / publish-meta.json to check the link against")
    try:
        q = urllib.parse.quote(f"https://www.youtube.com/watch?v={vid}", safe="")
        with urllib.request.urlopen(f"https://www.youtube.com/oembed?url={q}&format=json", timeout=20) as r:
            emb = json.loads(r.read().decode("utf-8"))
    except Exception as e:  # noqa: BLE001
        return C._fail(state, node, f"YouTube oEmbed could not read {vid} ({e}): is the video public / live yet?")
    if _norm(emb.get("title")) != _norm(want):
        return C._fail(state, node, f"the link {url} plays \"{emb.get('title')}\" ({emb.get('author_name')}), not this video "
                                    f"\"{want}\": pass the link of THIS video")
    handle = "@" + emb.get("author_url", "").rstrip("/").rsplit("@", 1)[-1] if "@" in emb.get("author_url", "") else ""
    ch = channel_of(handle)
    if not ch:
        return C._fail(state, node, f"the video is on {handle or emb.get('author_url') or 'an unknown channel'} "
                                    f"({emb.get('author_name')}), which has no YT post queue (known: "
                                    f"{', '.join(c['label'] + ' ' + c['queue'] for c in CHANNELS.values())}; CHANNELS in ytpost_graph.py)")
    face = state.get("face") or prev.get("face") or ""
    if not face:
        # the still the THUMBNAIL was built from is the one Mike already approved; else the best-scored hook still
        cand = sorted((proj / "thumbnail" / "stills").glob("*next-frame*.jpg")) or sorted((proj / "thumbnail" / "stills").glob("f1-*.jpg"))
        face = str(cand[0].relative_to(proj)).replace("\\", "/") if cand else ""
    if not face or not (proj / face).is_file():
        return C._fail(state, node, f"no face still for slide 1 ({face or 'none found under thumbnail/stills/'}): pass --face <a real "
                                    "frame of Mike, project-relative> (never an AI image)")
    logo = state.get("logo") or prev.get("logo") or ""
    if not logo:
        cand = sorted((proj / "thumbnail" / "refs").glob("*logo*400*")) or sorted((proj / "thumbnail" / "refs").glob("*logo*"))
        logo = str(cand[0].relative_to(proj)).replace("\\", "/") if cand else ""
    if logo and not (proj / logo).is_file():
        return C._fail(state, node, f"logo {logo} not found under the project folder")
    info = {"url": f"https://youtu.be/{vid}", "id": vid, "title": emb.get("title"), "channel": handle,
            "channel_name": (emb.get("author_name") or "").split(" - ")[0], "queue": ch["queue"], "face": face, "logo": logo,
            "checked_at": C._now_iso()}
    C._write_json_atomic(vj, info)
    return {"steps": C._step(state, node, "ran", f"{info['url']} = \"{info['title']}\" on {handle} (queue {ch['queue']}); "
                                                 f"face {face}; logo {logo or 'none'}")}


def _corpus(proj: Path) -> str:
    txt = ""
    # a presentation project: what he said = the cue report's "as heard" column + the transcript, its number source = RESEARCH.md
    names = ("AS-RECORDED.md", "DATA.md", "yt-delivery.json", "publish-meta.json") + \
        (("RESEARCH.md", "SCRIPT.md", "overlays/CUE-REPORT.md") if is_presentation(proj) else ())
    for name in names:
        f = proj / name
        if f.is_file():
            txt += f.read_text(encoding="utf-8", errors="replace") + "\n"
    if is_presentation(proj):
        txt += _transcript_text(proj) + "\n"
    return txt


def _sources_brief(proj: Path) -> str:
    """Which files the author reads: the longform-edited plan documents, or a presentation project's own set."""
    if not is_presentation(proj):
        return (f"Read `{proj / 'AS-RECORDED.md'}` (what Mike actually SAID, and its guard notes), `{proj / 'DATA.md'}` (every number's "
                f"source), `{proj / 'yt-delivery.json'}` (title, hashtags), `{proj / 'COVER-PLAN.json'}` and the built assets under "
                f"`{proj / 'assets'}` (charts/, diagrams/, card-slides/, title-slides/, receipts/) for the image slides.\n")
    words = sorted((proj / "spine").glob("*medium-words.json"), key=lambda p: p.stat().st_mtime)
    said = []
    if (proj / "overlays" / "CUE-REPORT.md").is_file():
        said.append(f"`{proj / 'overlays' / 'CUE-REPORT.md'}` (section 7 = every line AS HEARD; section 1 = numbers he said differently "
                    "from the script: never print the spoken one, print the sourced figure or leave that fact out)")
    if (proj / "SCRIPT.md").is_file():
        said.append(f"`{proj / 'SCRIPT.md'}` (the script and its CARDS table)")
    if words:
        said.append(f"`{words[-1]}` (the word-time transcript of the final spine: what he actually said)")
    return ("This is a longform-PRESENTATION project: it has NO AS-RECORDED.md, DATA.md or COVER-PLAN.json, so use its own files in "
            "their place. What Mike SAID: " + "; ".join(said) + f". Every number's source: `{proj / 'RESEARCH.md'}` (the only number "
            f"source). Title and hashtags: `{proj / 'yt-delivery.json'}`. The image slides come from the built assets under "
            f"`{proj / 'assets'}` (cards/, diagrams/, charts/ stills; `overlays/*.png` deck cards in a free-talk video); the look "
            "stays the canonical one.\n")


def _spec_strings(spec: dict):
    for s in spec.get("slides") or []:
        for k in ("headline", "body", "stat", "stat_sub", "caption", "sub"):
            if s.get(k):
                yield f"slide {spec['slides'].index(s) + 1} {k}", str(s[k])
        for a, b in s.get("rows") or []:
            yield f"slide {spec['slides'].index(s) + 1} row", f"{a} {b}"
    p = spec.get("post") or {}
    for k in ("headline",):
        if p.get(k):
            yield "post headline", p[k]
    for x in p.get("points") or []:
        yield "post point", x


def unsaid_numbers(spec: dict, corpus: str) -> list:
    """Numbers on a slide / in the post that appear nowhere in what the video said or sourced (AS-RECORDED, DATA.md)."""
    flat = corpus.replace(",", "")
    bad = []
    for where, text in _spec_strings(spec):
        for n in NUM_RE.findall(re.sub(r"[\[\]{}]", "", text)):
            if n.replace(",", "") not in flat:
                bad.append(f"{where}: {n}")
    return bad


def _author(state, node, proj: Path, spec_p: Path, info: dict, defects: str = ""):
    ch = channel_of(info.get("channel")) or {}
    prompt = (f"Author the YouTube PROMO CAROUSEL for the delivered video `{proj.name}` (folder `{proj}`), "
              f"live at {info['url']} as \"{info['title']}\" on the channel {info.get('channel_name') or ch.get('label', '')} "
              f"({info.get('channel')}: apply your rules for that channel), per your agent definition and "
              f"`video-creation/longform-edited/skills/yt-post/yt-post.md`.\n"
              + _sources_brief(proj)
              + (f"REVISE the existing `{spec_p}`: visual-qa FAILED these slides, fix exactly these and keep every passing slide as it "
                 f"is:\n{defects}\n" if defects else "")
              + f"Write the JSON to EXACTLY `{spec_p}` with Bash (a quoted heredoc) and return it.")
    rc, out = C.spawn_agent(state, node, "yt-post-author", prompt, f"agent-ytpost-{proj.name}.log")
    return C.persist_agent_json(out, spec_p, want_key="slides"), rc, out


def _stamp(spec_p: Path, info: dict):
    """The fixed fields come from preflight, never from the agent: link, title, channel, face, logo."""
    spec = json.loads(spec_p.read_text(encoding="utf-8"))
    spec.update({"video_url": info["url"], "video_title": info["title"], "channel": info["channel"],
                 "channel_name": info["channel_name"], "face": info["face"], "author": spec.get("author") or "Mike"})
    if info.get("logo"):
        spec["logo"] = info["logo"]
    C._write_json_atomic(spec_p, spec)
    return spec


def y_plan(state: YtPostState) -> YtPostState:
    node = "y_plan"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    d = _dir(proj)
    info = json.loads((d / "video.json").read_text(encoding="utf-8"))
    spec_p = d / "YT-POST.json"
    if not spec_p.is_file() or _redo(state, node):
        spec_p.unlink(missing_ok=True)
        ok, rc, out = _author(state, node, proj, spec_p, info)
        if not ok:
            return C._fail(state, node, f"yt-post-author returned no usable YT-POST.json (rc {rc})", out)
    spec = _stamp(spec_p, info)
    if "—" in json.dumps(spec, ensure_ascii=False):
        return C._fail(state, node, "em dash in YT-POST.json (persona: never; use a comma, colon or period)")
    bad = unsaid_numbers(spec, _corpus(proj))
    if bad:
        return C._fail(state, node, "numbers the video never said or sourced (AS-RECORDED.md / DATA.md): " + "; ".join(bad[:8])
                       + " (fix YT-POST.json or --redo y_plan)")
    n = len(spec.get("slides") or [])
    return {"steps": C._step(state, node, "ran", f"{n} slides; post headline \"{(spec.get('post') or {}).get('headline', '')}\"")}


def _build(state, node, proj: Path):
    return C.run_streaming([sys.executable, "-u", str(BUILD), str(_dir(proj) / "YT-POST.json")], state, node)


def y_build(state: YtPostState) -> YtPostState:
    node = "y_build"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    rc, out = _build(state, node, proj)
    m = re.search(r"^YT-POST-BUILD (PASS|FAIL) slides=(\d+)", out or "", re.M)
    if rc != 0 or not m or m.group(1) != "PASS":
        return C._fail(state, node, "build_yt_post.py FAILED (layout / spec problems above): fix YT-POST.json and re-drive", out)
    return {"steps": C._step(state, node, "ran", f"{m.group(2)} slides rendered 1080x1080 -> yt-post/slides/")}


def y_qa(state: YtPostState) -> YtPostState:
    node = "y_qa"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub")}
    d = _dir(proj)
    info = json.loads((d / "video.json").read_text(encoding="utf-8"))
    spec_p = d / "YT-POST.json"
    qa_p = d / "YT-POST-QA.json"
    for rnd in range(1, QA_ROUNDS + 2):
        slides = sorted((d / "slides").glob("[0-9][0-9].png"))
        stamp = ";".join(f"{f.name}:{f.stat().st_size}" for f in slides)
        if qa_p.is_file() and not _redo(state, node):
            prev = json.loads(qa_p.read_text(encoding="utf-8"))
            if prev.get("stamp") == stamp and str(prev.get("verdict", "")).upper() == "PASS":
                return {"steps": C._step(state, node, "skipped", f"{len(slides)} slides already passed visual-qa")}
        new = d / "YT-POST-QA.new.json"
        new.unlink(missing_ok=True)
        spec = json.loads(spec_p.read_text(encoding="utf-8"))
        prompt = (f"Visual QA of a YouTube community-post CAROUSEL (square 1080x1080 slides) promoting the video `{proj.name}`. Open "
                  "EVERY slide and judge it against the spec below and the video's locked look (Playfair Display 900 headlines with "
                  "the accent-coloured highlight words, DM Sans body, JetBrains Mono numbers, the project accent palette). Hunt for: "
                  "text cut off or overflowing, a headline with one orphan word on its last line, text over Mike's face (eyes, nose, "
                  "mouth), a face cut at the frame edge, an image slide whose picture is too small to read on a phone, wrong / "
                  "misspelled words vs the spec, an em dash, a dollar sign, blank or broken images, header / footer / progress bar "
                  "misaligned, slide numbers wrong. Mike's face is a REAL frame by design (no matte, no AI): judge only framing.\n"
                  + "\n".join(f"- `{f}`" for f in slides)
                  + f"\nSpec (`{spec_p}`): {json.dumps(spec.get('slides'), ensure_ascii=False)[:6000]}\n"
                  + f"Return {{\"verdict\": \"PASS\"|\"FAIL\", \"assets\": [{{\"path\", \"verdict\", \"defects\": [], \"fix\"}}]}} AND save it "
                  + f"to EXACTLY `{new}` with Bash. Every slide appears with PASS or FAIL.")
        rc, out = C.spawn_agent(state, node, "visual-qa", prompt, f"agent-ytpost-qa-{proj.name}.log")
        if not C.persist_agent_json(out, new, want_key="assets"):
            return C._fail(state, node, f"visual-qa returned no verdict (rc {rc})", out)
        qa = json.loads(new.read_text(encoding="utf-8"))
        new.unlink(missing_ok=True)
        fails = [a for a in qa.get("assets") or [] if str(a.get("verdict", "")).upper() != "PASS"]
        verdict = "PASS" if not fails and str(qa.get("verdict", "PASS")).upper() == "PASS" else "FAIL"
        C._write_json_atomic(qa_p, {**qa, "verdict": verdict, "stamp": stamp, "round": rnd})
        if verdict == "PASS":
            return {"steps": C._step(state, node, "ran", f"{len(slides)} slides PASS visual-qa (round {rnd})")}
        defects = "\n".join(f"- {Path(str(a.get('path', ''))).name}: {'; '.join(a.get('defects') or [])} (fix: {a.get('fix', '')})"
                            for a in fails)
        if rnd > QA_ROUNDS:
            return C._fail(state, node, f"visual-qa still FAILS after {QA_ROUNDS} revision(s): {defects[:600]} (see {qa_p.name})")
        ok, rc2, out2 = _author(state, node, proj, spec_p, info, defects)
        if not ok:
            return C._fail(state, node, f"yt-post-author revision returned nothing usable (rc {rc2})", out2)
        _stamp(spec_p, info)
        rc3, out3 = _build(state, node, proj)
        if rc3 != 0:
            return C._fail(state, node, "build_yt_post.py FAILED on the revised spec", out3)
    return C._fail(state, node, "visual-qa loop ended without a verdict")


UPSERT_JS = r"""
const fs = require('fs');
const [qPath, rowPath] = process.argv.slice(1);
const raw = fs.readFileSync(qPath, 'utf8');
const d = JSON.parse(raw);
const row = JSON.parse(fs.readFileSync(rowPath, 'utf8'));
const i = d.posts.findIndex(p => p.id === row.id);
let what = 'appended';
if (i >= 0) {
  if (d.posts[i].status !== 'pending') { console.log('UPSERT SKIP ' + row.id + ' is ' + d.posts[i].status); process.exit(0); }
  d.posts[i] = { ...d.posts[i], ...row, created_at: d.posts[i].created_at }; what = 'replaced';
} else d.posts.push(row);
fs.writeFileSync(qPath, JSON.stringify(d, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
const pend = d.posts.filter(p => p.status === 'pending').map(p => p.id);
console.log('UPSERT ' + what.toUpperCase() + ' ' + row.id + ' pending_position=' + (pend.indexOf(row.id) + 1) + '/' + pend.length);
"""


def post_body(spec: dict) -> str:
    p = spec.get("post") or {}
    parts = [f"▶ Watch the full video: {spec['video_url']}", p.get("headline", "").strip()]
    pts = "\n".join(f"→ {x.strip()}" for x in p.get("points") or [] if x.strip())
    if pts:
        parts.append(pts)
    if p.get("hashtags"):
        parts.append(" ".join(p["hashtags"]))
    return "\n\n".join(x for x in parts if x)


def _slug(t: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (t or "").lower()).strip("-")[:28].strip("-") or "slide"


def y_queue(state: YtPostState) -> YtPostState:
    """The carousel joins the YT post queue OF ITS CHANNEL as a `pending` row (nothing posts here)."""
    node = "y_queue"
    proj = _proj(state)
    if state.get("stub"):
        return {"steps": C._step(state, node, "stub"), "status": "done"}
    d = _dir(proj)
    spec = json.loads((d / "YT-POST.json").read_text(encoding="utf-8"))
    ch = channel_of(spec.get("channel"))
    if not ch:
        return C._fail(state, node, f"no YT post queue for the channel {spec.get('channel')!r} (CHANNELS in ytpost_graph.py): "
                                    "re-run y_preflight with the live link")
    queue, img_dir = DATA_DIR / ch["queue"], IMAGES_DIR / ch["images"]
    if not queue.is_file():
        return C._fail(state, node, f"the {ch['label']} queue {queue} does not exist")
    slides = sorted((d / "slides").glob("[0-9][0-9].png"))
    if len(slides) != len(spec.get("slides") or []):
        return C._fail(state, node, f"{len(slides)} slide PNGs for {len(spec.get('slides') or [])} spec slides: rebuild (--redo y_build)")
    rid = f"{ch['row']}-{datetime.now():%Y-%m-%d}-{proj.name}-video"
    old = {}
    q = json.loads(queue.read_text(encoding="utf-8"))
    prev = next((p for p in q.get("posts", []) if p.get("id", "").endswith(f"-{proj.name}-video")), None)
    if prev:
        if prev.get("status") != "pending":
            return {"steps": C._step(state, node, "skipped", f"{prev['id']} is already {prev.get('status')}: not touched"), "status": "done"}
        rid = prev["id"]
        old = {im.get("seq"): im for im in prev.get("images") or []}
    img_dir.mkdir(parents=True, exist_ok=True)
    images = []
    for seq, (f, s) in enumerate(zip(slides, spec["slides"]), 1):
        iid = (old.get(seq) or {}).get("image_id") or uuid.uuid4().hex[:8]   # a regen reuses its image_id (same file)
        dest = img_dir / f"{ch['prefix']}-{iid}-{seq:02d}-{_slug(s.get('headline') or s.get('kind'))}.png"
        prev_path = (old.get(seq) or {}).get("image_path")
        if prev_path and (C.REPO_ROOT / prev_path).is_file() and (C.REPO_ROOT / prev_path) != dest:
            (C.REPO_ROOT / prev_path).unlink()
        shutil.copyfile(f, dest)
        text = " / ".join(x for x in (s.get("headline"), s.get("stat"), s.get("body"), s.get("caption"), s.get("sub")) if x)
        images.append({"seq": seq, "image_id": iid, "image_path": str(dest.relative_to(C.REPO_ROOT)).replace("\\", "/"),
                       "slide_text": re.sub(r"[\[\]{}]", "", text)})
    body = post_body(spec)
    if "—" in body:
        return C._fail(state, node, "em dash in the post body")
    row = {"id": rid, "topic": f"Promo carousel for the live video \"{spec['video_title']}\"", "source_transcript": None,
           "variation_label": "video promo carousel", "body_style": "watch-the-full-video link + headline + two arrow points + hashtags",
           "cta_target": "watch_video", "created_at": datetime.now().isoformat(timespec="seconds"), "status": "pending",
           "posted_at": None, "post_url": None, "body": body, "engagement_question": None, "char_count": len(body),
           "images": images, "carousel_version": "video-promo", "source": f"longform-edited ytpost lane ({proj.name})",
           "video_url": spec["video_url"]}
    rowp = d / "queue-row.json"
    C._write_json_atomic(rowp, row)
    r = subprocess.run(["node", "-e", UPSERT_JS, str(queue), str(rowp)], capture_output=True, text=True, encoding="utf-8")
    m = re.search(r"^UPSERT (\w+) (\S+)(?: pending_position=(\S+))?", r.stdout or "", re.M)
    if r.returncode != 0 or not m:
        return C._fail(state, node, f"the {ch['queue']} upsert failed", (r.stdout or "") + (r.stderr or ""))
    return {"steps": C._step(state, node, "ran", f"{m.group(2)} {m.group(1).lower()} in {ch['queue']} ({ch['label']}, dashboard tab "
                                                 f"\"{ch['tab']}\"), {len(images)} images, pending position {m.group(3)} "
                                                 f"({ch['posting']})"), "status": "done"}


ORDER = ["y_preflight", "y_plan", "y_build", "y_qa", "y_queue"]
NODES = {n: globals()[n] for n in ORDER}


def _after(next_node):
    def route(state):
        return END if state.get("status") == "failed" else (next_node or END)
    return route


def build_ytpost_graph(checkpointer=None):
    g = StateGraph(YtPostState)
    for n in ORDER:
        g.add_node(n, NODES[n])
    g.add_edge(START, ORDER[0])
    for i, n in enumerate(ORDER):
        g.add_conditional_edges(n, _after(ORDER[i + 1] if i + 1 < len(ORDER) else None))
    return g.compile(checkpointer=checkpointer)
