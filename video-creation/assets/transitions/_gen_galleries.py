#!/usr/bin/env python
"""
_gen_galleries.py: build the gallery.html browser pages of the transition library.

Python port of _gen-galleries.js (2026-11-27; the JS was deleted the same day). It writes the same pages, byte
for byte: the port was run next to the JS on one tree and every page compared.

The ONE source is ./library.json. The pages mirror the pack's own tree under ./browse/<CATEGORY>/<VARIANT>/, one
gallery.html per folder:
  browse/gallery.html                  cards to each category
  browse/<CAT>/gallery.html            cards to each variant
  browse/<CAT>/<VARIANT>/gallery.html  the transition videos themselves (play them here)

A leaf page embeds only its own folder's clips, so no page ever loads the whole library. For each clip that is
on disk it also pulls a poster frame (<id>.poster.jpg, the frame at 0.55 s) with ffmpeg, so a tile shows the
effect before it is played.

Run it after library.json changes or after clips are re-rendered:
  python video-creation/assets/transitions/_gen_galleries.py
  python video-creation/assets/transitions/_gen_galleries.py --no-posters   # keep the posters already there
  python video-creation/assets/transitions/_gen_galleries.py --root <folder>  # another copy of this folder (tests)

Run it where the rendered clips are (browse/**/<id>.mp4 is not in git). A clip that is missing gets a tile with
no poster and no cache-busting number, so a run in a checkout without the clips writes poorer pages.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

CSS = """
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0c0d10;color:#e8eaed}
header{padding:20px 28px;border-bottom:1px solid #23262d}
header .crumb{color:#8a90a0;font-size:14px}
header h1{margin:6px 0 0;font-size:24px;letter-spacing:.3px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px;padding:24px 28px}
.card{background:#15171c;border:1px solid #23262d;border-radius:12px;overflow:hidden;transition:border-color .15s}
.card:hover{border-color:#3a3f4b}
.card a{color:inherit;text-decoration:none;display:block}
.card video,.card .thumb{width:100%;aspect-ratio:16/9;display:block;background:#000;object-fit:cover}
.card .meta{padding:12px 14px}
.card .meta .label{font-size:15px;font-weight:600}
.badges{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
.badge{font-size:11px;padding:3px 8px;border-radius:20px;background:#23262d;color:#aeb4c2}
.badge.near{background:#10331f;color:#5fe39a}
.badge.approx{background:#3a2a10;color:#f0b35f}
.folder .thumb{display:flex;align-items:center;justify-content:center;font-size:42px;color:#4a5160}
"""

_MISSING = object()
_INDEX_KEY = re.compile(r"0|[1-9]\d*")


def js_str(v) -> str:
    """A value the way a JS template string prints it, so the pages match the JS ones: 1.0 -> '1', a missing
    field -> 'undefined', null -> 'null'."""
    if v is _MISSING:
        return "undefined"
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, float):
        return str(int(v)) if v.is_integer() else repr(v)
    return str(v)


def js_truthy(v) -> bool:
    """JS truthiness: an empty list or object counts as true there."""
    if v is _MISSING or v is None:
        return False
    if isinstance(v, (bool, int, float)):
        return bool(v) and v == v
    if isinstance(v, str):
        return bool(v)
    return True


def js_key_order(keys):
    """The order a JS object lists its keys in: whole-number names first, lowest first, then every other name in
    the order it was added. The library has variants named "1" to "4", so this decides the order of the cards."""
    keys = list(keys)
    index_keys = [k for k in keys if _INDEX_KEY.fullmatch(k) and int(k) < 2 ** 32 - 1]
    return sorted(index_keys, key=int) + [k for k in keys if k not in set(index_keys)]


def page(crumb: str, title: str, body_html: str) -> str:
    return (f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n'
            f'<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            f"<title>{title}</title><style>{CSS}</style></head>\n"
            f'<body><header><div class="crumb">{crumb}</div><h1>{title}</h1></header>\n'
            f'<div class="grid">{body_html}</div></body></html>')


def fid_badge(fidelity) -> str:
    if fidelity == "near-1:1":
        return '<span class="badge near">near-1:1</span>'
    return '<span class="badge approx">approximate</span>'


def write(folder: Path, html: str) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    with open(folder / "gallery.html", "w", encoding="utf-8", newline="\n") as f:
        f.write(html)


def make_poster(mp4: Path, jpg: Path) -> bool:
    """A mid-transition frame, so the tile shows the effect. False when the clip is not on disk or ffmpeg fails."""
    if not mp4.exists():
        return False
    try:
        r = subprocess.run(["ffmpeg", "-y", "-ss", "0.55", "-i", str(mp4), "-vframes", "1", "-q:v", "4", str(jpg)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL)
        return r.returncode == 0
    except OSError:
        return False


def group(rows):
    """category -> variant -> rows, each level in the order the JS object would list it."""
    cats = {}
    for r in rows:
        cats.setdefault(r["category"], {}).setdefault(r["variant"], []).append(r)
    return {c: {v: cats[c][v] for v in js_key_order(cats[c])} for c in js_key_order(cats)}


def build(root: Path, posters: bool = True) -> dict:
    browse = root / "browse"
    lib = json.loads((root / "library.json").read_text(encoding="utf-8"))
    cats = group(lib["transitions"])
    leaves = clips = 0

    # leaf pages: the videos themselves
    for cat, variants in cats.items():
        for variant, rows in variants.items():
            folder = browse / cat / variant
            cards = []
            for r in rows:
                mp4 = f"{r['id']}.mp4"
                poster_file = f"{r['id']}.poster.jpg"
                has_poster = (make_poster(folder / mp4, folder / poster_file) if posters
                              else (folder / mp4).exists() and (folder / poster_file).exists())
                on_disk = (folder / mp4).exists()
                clips += on_disk
                # cache-bust with the file's modified time: a demo's file name never changes across re-renders,
                # so a browser would otherwise keep playing the old video (bit Mike 2026-07-11)
                v = f"?v={(folder / mp4).stat().st_mtime_ns // 1_000_000}" if on_disk else ""
                poster = f' poster="{poster_file}{v}"' if has_poster else ""
                sfx = '<span class="badge">+ sfx</span>' if js_truthy(r.get("sfx", _MISSING)) else ""
                cards.append(
                    f'<div class="card"><video controls preload="none"{poster} src="{mp4}{v}"></video>\n'
                    f'<div class="meta"><div class="label">{js_str(r.get("label", _MISSING))}</div>\n'
                    f'<div class="badges"><span class="badge">{js_str(r.get("intensity", _MISSING))}</span>\n'
                    f'<span class="badge">{js_str(r.get("durationSeconds", _MISSING))}s</span>'
                    f'<span class="badge">{js_str(r.get("kind", _MISSING))}</span>\n'
                    f'{fid_badge(r.get("fidelity"))}{sfx}</div></div></div>')
            write(folder, page(f"transitions / {cat} /", f"{cat} · {variant}", "\n".join(cards)))
            leaves += 1

    # category pages: cards to the variants
    for cat, variants in cats.items():
        cards = []
        for variant, rows in variants.items():
            n = len(rows)
            cards.append(
                f'<div class="card"><a href="{variant}/gallery.html">'
                f'<img class="thumb" src="{variant}/{rows[0]["id"]}.poster.jpg" alt="">\n'
                f'<div class="meta"><div class="label">{variant}</div>\n'
                f'<div class="badges"><span class="badge">{n} transition{"s" if n > 1 else ""}</span>'
                f"</div></div></a></div>")
        write(browse / cat, page("transitions /", cat, "\n".join(cards)))

    # root index: cards to the categories
    root_cards = []
    for cat, variants in cats.items():
        total = sum(len(rows) for rows in variants.values())
        root_cards.append(
            f'<div class="card folder"><a href="{cat}/gallery.html">\n'
            f'<div class="thumb">▸ {cat}</div>\n'
            f'<div class="meta"><div class="label">{cat}</div>\n'
            f'<div class="badges"><span class="badge">{len(variants)} variant(s)</span>\n'
            f'<span class="badge">{total} transition(s)</span></div></div></a></div>')
    write(browse, page("transitions", "Transition Library", "\n".join(root_cards)))
    return {"categories": len(cats), "leaves": leaves, "clips": clips, "browse": browse}


def main():
    ap = argparse.ArgumentParser(description="Build the transition library's gallery.html pages from library.json.")
    ap.add_argument("--root", default=None, help="the transitions folder to work in (default: this script's folder)")
    ap.add_argument("--no-posters", action="store_true",
                    help="do not run ffmpeg: use the poster frames that are already on disk")
    args = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    root = Path(args.root) if args.root else Path(__file__).resolve().parent
    r = build(root, posters=not args.no_posters)
    print(f"Generated galleries: root + {r['categories']} category page(s) + {r['leaves']} leaf page(s), "
          f"{r['clips']} clip(s).")
    print(f"Open: {r['browse'] / 'gallery.html'}")


if __name__ == "__main__":
    main()
