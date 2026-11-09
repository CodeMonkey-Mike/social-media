"""effects_gallery.py: the EFFECTS library's BROWSE dashboard (video-creation/skills/effects-library/effects-library.md section 2).

  python video-creation/skills/effects-library/scripts/effects_gallery.py            # rebuild assets/effects/browse/
  python video-creation/skills/effects-library/scripts/effects_gallery.py --force    # re-cut every source excerpt too
  python video-creation/skills/effects-library/scripts/effects_gallery.py --theme kinetic-text-2023

Mirrors the transitions browser (assets/transitions/browse/, one gallery.html per folder, play in place):
  browse/gallery.html                 -> one card per THEME, named by its `label` (Energetic, Halloween horror, ...)
  browse/<label-slug>/gallery.html    -> one card per DEVICE (and per sub-variant with its own cues): the trigger, the motion in one
                                         line, the sounds as chips, the engine (or "no engine yet"), and the PLAYERS:
                                           demo   = the engine's reference render from assets/effects/_demo/ (Mike-approved), with sound
                                           source = the excerpt of the SOURCE VIDEO at the device's `browse_cues` window, with its sound
  browse/<label-slug>/src/<id>-<n>.mp4 -> the excerpts, cut once with ffmpeg (960x540, h264 + aac) from theme.sources[src].video;
                                         re-cut only with --force or when the cue window changed (the file name carries t0-t1)
The pages embed only their own folder's clips (plus the shared _demo renders by relative path), so no page loads the whole library.
Every mp4 is gitignored (video-creation/.gitignore *.mp4); the gallery.html pages are tracked, like the transitions browser.
Hard rule carried: a halloween-2022 excerpt never crosses 110 s of Bear Markets (theme.sources.hw.duration_sec).
"""
import argparse
import html
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
VC = REPO / "video-creation"
EFFECTS = VC / "assets" / "effects"
LIB = EFFECTS / "library.json"
DEMO = EFFECTS / "_demo"
BROWSE = EFFECTS / "browse"

CSS = """
:root{color-scheme:dark;--bg:#0c0d10;--card:#15171c;--line:#23262d;--text:#e8eaed;--muted:#8a90a0;--accent:#FCFE40;--lime:#BEFF09;--hw:#27FF14}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--text)}
header{padding:20px 28px;border-bottom:1px solid var(--line)}
header .crumb{color:var(--muted);font-size:14px}
header .crumb a{color:var(--muted)}
header h1{margin:6px 0 0;font-size:24px;letter-spacing:.3px}
header h1 .id{color:var(--muted);font-weight:500;font-size:15px;margin-left:10px}
header p{margin:8px 0 0;color:var(--muted);max-width:1100px;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px;padding:24px 28px}
.devices{display:flex;flex-direction:column;gap:22px;padding:24px 28px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;transition:border-color .15s}
.card:hover{border-color:#3a3f4b}
.card a{color:inherit;text-decoration:none;display:block}
.card .thumb{width:100%;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;font-size:42px;color:#4a5160;background:#000}
.card .meta{padding:12px 14px}
.card .meta .label{font-size:17px;font-weight:700}
.card .meta .sub{color:var(--muted);font-size:13px;margin-top:2px}
.badges{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
.badge{font-size:11px;padding:3px 8px;border-radius:20px;background:#23262d;color:#aeb4c2}
.badge.engine{background:#10331f;color:#5fe39a}
.badge.noeng{background:#3a2a10;color:#f0b35f}
.badge.src{background:#1b2a3a;color:#7cc4ff}
.badge.snd{background:#2a2335;color:#d3b7ff}
.dev{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px}
.dev h2{margin:0;font-size:19px}
.dev h2 .v{color:var(--accent);font-weight:600}
.dev h2 .id{color:var(--muted);font-weight:500;font-size:14px;margin-left:10px}
.dev .trigger{margin:6px 0 0;color:var(--text);font-size:14px}
.dev .motion{margin:6px 0 0;color:var(--muted);font-size:13px}
.players{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:14px;margin-top:12px}
.player video{display:block;width:100%;aspect-ratio:16/9;background:#000;border-radius:8px}
.player .cap{font-size:12px;color:var(--muted);margin-top:4px}
.player .cap b{color:var(--text);font-weight:600}
.empty{color:var(--muted);font-size:13px;font-style:italic;margin-top:10px}
code{font-size:12px;color:var(--muted)}
"""


def page(crumb_html: str, title_html: str, intro_html: str, body_html: str, body_class: str = "grid") -> str:
    return (f"<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n"
            f"<title>{re.sub('<[^>]+>', '', title_html)}</title><style>{CSS}</style></head>\n"
            f"<body><header><div class=\"crumb\">{crumb_html}</div><h1>{title_html}</h1>{intro_html}</header>\n"
            f"<div class=\"{body_class}\">{body_html}</div></body></html>\n")


def slug(label: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")


def esc(s) -> str:
    return html.escape(str(s if s is not None else ""), quote=True)


def sound_chips(row: dict) -> list:
    """Every (id, when/meaning) pair of a row's own sound fields (not its sub-variants)."""
    out = []
    for s in row.get("sound") or []:
        if isinstance(s, dict):
            out.append((s.get("id"), s.get("when", "")))
    for s in row.get("sound_by_meaning") or []:
        if isinstance(s, dict):
            out.append((s.get("id"), s.get("meaning", "")))
    return out


def motion_line(row: dict) -> str:
    m = row.get("motion")
    if isinstance(m, str):
        return m
    if isinstance(m, dict):
        for k in ("in", "entrance", "slide", "wall", "headline", "card_in", "items", "button_pop", "whip_zoom", "burst", "image", "pop", "plate"):
            v = m.get(k)
            if isinstance(v, str):
                return f"{k}: {v}"
        for v in m.values():
            if isinstance(v, str):
                return v
    return ""


def duration(path: Path) -> float:
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
                             capture_output=True, text=True, timeout=60)
        return float(out.stdout.strip())
    except Exception:
        return 0.0


def cut_excerpt(src: Path, t0: float, t1: float, dest: Path, poster: Path, force: bool) -> bool:
    if dest.exists() and poster.exists() and not force:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}", "-i", str(src),
           "-vf", "scale=960:540:flags=lanczos", "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(dest)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size < 10_000:
        # the 4K 004 master refuses an input-side seek late in the file ("Error splitting the input into NAL units",
        # 2026-10-31 on 102.6 s): decode from the start and seek on the output side instead (slower, always lands)
        cmd2 = ["ffmpeg", "-v", "error", "-y", "-i", str(src), "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}"] + cmd[cmd.index("-vf"):]
        r = subprocess.run(cmd2, capture_output=True, text=True)
        if r.returncode != 0 or not dest.exists() or dest.stat().st_size < 10_000:
            print("  FFMPEG FAIL", dest.name, (r.stderr or "")[-300:])
            return False
    mid = max(0.0, (t1 - t0) * 0.45)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{mid:.3f}", "-i", str(dest), "-frames:v", "1", "-q:v", "4", str(poster)],
                   capture_output=True, text=True)
    return True


def vbust(p: Path) -> str:
    return f"?v={int(p.stat().st_mtime)}" if p.exists() else ""


def demo_clips(did: str) -> list:
    """The approved engine renders in _demo/ for a device: <id>.mp4 or <id>-<variant>.mp4."""
    out = []
    for p in sorted(DEMO.glob(f"{did}*.mp4")):
        rest = p.stem[len(did):]
        if rest and not rest.startswith("-"):
            continue  # another device whose id extends this one
        out.append((p, rest.lstrip("-") or "reference"))
    return out


def player(src_rel: str, poster_rel: str, cap_html: str) -> str:
    poster = f' poster="{poster_rel}"' if poster_rel else ""
    return f'<div class="player"><video controls preload="none"{poster} src="{src_rel}"></video><div class="cap">{cap_html}</div></div>'


def device_card(did: str, row: dict, theme: dict, tslug: str, srcs: dict, force: bool, variant: str | None = None,
                stats: dict | None = None) -> str:
    name = row.get("name", "")
    title = f"{esc(did)}" + (f' <span class="v">{esc(variant)}</span>' if variant else "") + f'<span class="id">{esc(name)}</span>'
    badges = []
    eng = row.get("engine")
    if row.get("house_rule_conflict"):
        badges.append('<span class="badge noeng">documentation only (house rule)</span>')
    elif eng and not variant:
        badges.append(f'<span class="badge engine">engine {esc(eng)}</span>')
    elif not variant:
        badges.append('<span class="badge noeng">no engine yet (the comp-builder builds it to the row)</span>')
    for sid, when in sound_chips(row):
        label = esc(sid) if sid else "silent"
        hint = esc(when)[:90]
        badges.append(f'<span class="badge snd" title="{hint}">{label}</span>')
    players = []
    if not variant:
        for p, v in demo_clips(did):
            rel = f"../../_demo/{p.name}{vbust(p)}"
            players.append(player(rel, "", f"<b>demo</b> · {esc(v)} · the engine's reference render ({duration(p):.1f} s)"))
    for n, cue in enumerate(row.get("browse_cues") or [], 1):
        sk = cue.get("src")
        s = srcs.get(sk)
        if not s:
            players.append(f'<div class="empty">source {esc(sk)} not declared on the theme</div>')
            continue
        src = Path(s["video"])
        t0, t1 = float(cue["t0"]), float(cue["t1"])
        limit = float(s.get("duration_sec") or 1e9)
        if t1 > limit:
            players.append(f'<div class="empty">cue {t0}-{t1} crosses the source limit {limit} s: not cut</div>')
            continue
        base = f"{did}{'-' + slug(variant) if variant else ''}-{n}-{t0:.1f}-{t1:.1f}".replace(".", "_")
        dest = BROWSE / tslug / "src" / f"{base}.mp4"
        poster = BROWSE / tslug / "src" / f"{base}.jpg"
        if not src.exists():
            players.append(f'<div class="empty">source video offline: {esc(src)}</div>')
            continue
        ok = cut_excerpt(src, t0, t1, dest, poster, force)
        if stats is not None:
            stats["cuts"] += 1 if ok else 0
        if ok:
            players.append(player(f"src/{dest.name}{vbust(dest)}", f"src/{poster.name}{vbust(poster)}",
                                  f"<b>source</b> · {esc(s.get('short', sk))} {t0:.2f}-{t1:.2f} s · {esc(cue.get('label', ''))}"))
    if not players:
        players.append('<div class="empty">no demo render and no browse_cues yet</div>')
    trig = esc(row.get("trigger", ""))
    mot = esc(motion_line(row))[:420]
    return (f'<section class="dev"><h2>{title}</h2><p class="trigger">{trig}</p><p class="motion">{mot}</p>'
            f'<div class="badges">{"".join(badges)}</div><div class="players">{"".join(players)}</div></section>')


def build(force: bool, only_theme: str | None):
    lib = json.loads(LIB.read_text(encoding="utf-8"))
    devices = {k: v for k, v in lib["devices"].items() if not k.startswith("$")}
    themes = {k: v for k, v in lib["themes"].items() if not k.startswith("$")}
    BROWSE.mkdir(parents=True, exist_ok=True)
    root_cards = []
    for tid, t in themes.items():
        label = t.get("label") or tid
        tslug = slug(label)
        srcs = {}
        for sk, s in (t.get("sources") or {}).items():
            s = dict(s)
            s["short"] = Path(s["video"]).parent.name if s.get("video") else sk
            srcs[sk] = s
        n_eng = sum(1 for d in t.get("devices", []) if devices.get(d, {}).get("engine"))
        if only_theme and tid != only_theme:
            # keep the root card from the existing state, no rebuild
            root_cards.append((label, tid, tslug, t, n_eng))
            continue
        stats = {"cuts": 0}
        cards = []
        for did in t.get("devices", []):
            row = devices.get(did)
            if not row:
                continue
            cards.append(device_card(did, row, t, tslug, srcs, force, stats=stats))
            for vk, vv in row.items():
                if isinstance(vv, dict) and vv.get("browse_cues"):
                    cards.append(device_card(did, vv, t, tslug, srcs, force, variant=vk, stats=stats))
        src_list = " · ".join(f"<b>{esc(k)}</b> = {esc(Path(s['video']).name)} ({esc(s.get('short'))}, {s.get('duration_sec', '?')} s)" for k, s in srcs.items())
        intro = (f"<p>{esc(t.get('rule', ''))}</p><p>Players: <b>demo</b> = the engine's reference render from _demo/ (approved by Mike), "
                 f"<b>source</b> = the excerpt of the source video at the device's cue, both with sound. Sources: {src_list}.</p>")
        crumb = '<a href="../gallery.html">effects</a> /'
        title = f"{esc(label)}<span class=\"id\">theme id {esc(tid)} · {len(t.get('devices', []))} devices · {n_eng} with an engine</span>"
        (BROWSE / tslug).mkdir(parents=True, exist_ok=True)
        (BROWSE / tslug / "gallery.html").write_text(page(crumb, title, intro, "\n".join(cards), "devices"), encoding="utf-8")
        print(f"theme {tid} -> browse/{tslug}/gallery.html ({len(cards)} cards, {stats['cuts']} source excerpts)")
        root_cards.append((label, tid, tslug, t, n_eng))
    root = []
    for label, tid, tslug, t, n_eng in root_cards:
        n_dev = len(t.get("devices", []))
        srcs = t.get("sources") or {}
        root.append(f'<div class="card folder"><a href="{tslug}/gallery.html"><div class="thumb">▸ {esc(label)}</div>'
                    f'<div class="meta"><div class="label">{esc(label)}</div><div class="sub">{esc(tid)} · {esc(t.get("name", ""))}</div>'
                    f'<div class="badges"><span class="badge">{n_dev} device(s)</span><span class="badge engine">{n_eng} engine(s)</span>'
                    f'<span class="badge src">{len(srcs)} source video(s)</span></div></div></a></div>')
    intro = ("<p>Every EFFECT is a device: one motion + the sound that fires with it + its graphics, grouped into THEMES (one look each). "
             "Click a theme, press play: the engine demo and the source-video excerpt both play with their sound. Catalog of record: "
             "<code>video-creation/assets/effects/library.json</code>; skill: <code>video-creation/skills/effects-library/effects-library.md</code>.</p>")
    (BROWSE / "gallery.html").write_text(page("effects", "Effects Library", intro, "\n".join(root)), encoding="utf-8")
    print(f"root -> {BROWSE / 'gallery.html'}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--force", action="store_true", help="re-cut every source excerpt")
    ap.add_argument("--theme", help="rebuild one theme page only")
    a = ap.parse_args()
    build(a.force, a.theme)
