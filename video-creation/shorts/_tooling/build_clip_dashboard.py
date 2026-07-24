"""CANONICAL clip-review dashboard builder (livestream-repurpose shorts).

WHY THIS EXISTS (2026-07-14, Mike): every batch used to carry its OWN copy-pasted dashboard HTML
inline in its `cut_topics_<batch>.py` (14 of them). Each new batch copied the previous script, so the
dashboards silently DRIFTED: `pump-season-is-back` had numbered "Clip N" chips and status chips, but
`better-coins` did not, and a later batch that copied better-coins LOST the numbers Mike relies on to
say "delete clips 2 and 3". Mike: "Shouldn't there be some sort of standardized format?" Yes.

This module is now the ONE builder. Per-batch cutters MUST call build_dashboard() and MUST NOT embed
their own HTML. The house style here is pump-season-is-back's, which is the current canonical look:
  - ONE CELL PER SHORT, numbered "Clip N" (the numbering Mike reviews against)
  - a variant chip + a STATUS chip that is replaced IN PLACE as the clip advances:
        raw -> desilenced -> tightened+desilenced
  - <details> holding source timecodes + strategist notes
  - written to shorts/<batch>/dashboard.html IN PLACE, never a second dashboard file

Related rules: "no new clip dashboard" (overwrite in place), "factor cross-cutting ops into ONE
track-agnostic skill, never inline copies".
"""
import html
import os

STATUS_CLASS = {
    "raw": "s-raw",
    "desilenced": "s-desil",
    "tightened+desilenced": "s-tight",
    # Phase 5C, added 2026-07-23: skills/filler-removal is the last spine pass before captions.
    "filler-cut (final)": "s-final",
}

CSS = """
body{font-family:system-ui,sans-serif;background:#0f1115;color:#e6e6e6;margin:0;padding:24px}
h1{font-size:20px;margin:0 0 4px}.sub{color:#8a8f98;font-size:13px;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:start}
@media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
.card{background:#171a21;border:1px solid #262b36;border-radius:12px;padding:14px}
.card h2{font-size:14px;margin:0 0 6px;line-height:1.3}
.num{background:#3a3320;color:#e2cf7e;font-size:11px;padding:1px 8px;border-radius:20px;margin-right:4px}
.meta{color:#8a8f98;font-size:12px;margin-bottom:10px}
.vtag{background:#22303f;color:#8fc7ff;font-size:11px;padding:1px 8px;border-radius:20px}
.stat{font-size:11px;padding:1px 8px;border-radius:20px}
.s-raw{background:#2a2f38;color:#9aa3ad}.s-desil{background:#1e3a2f;color:#7ee2b8}.s-tight{background:#331f3a;color:#d79fe6}.s-final{background:#3a2a1a;color:#ffc48a}
video{width:auto;max-height:320px;max-width:100%;border-radius:8px;background:#000;display:block;margin:0 auto}
details{margin-top:8px;font-size:12px;color:#8a8f98}summary{cursor:pointer}.src{color:#6f757e}
"""


def build_dashboard(batch, outdir, clips, title=None, subtitle_extra=None):
    """Write shorts/<batch>/dashboard.html IN PLACE.

    clips: list of dicts, in review order. Each:
        title    (str)   headline shown next to the "Clip N" chip
        video    (str)   path RELATIVE to dashboard.html (e.g. "my-slug/my-slug-full.mp4")
        variant  (str)   e.g. "full", "impact"
        status   (str)   one of STATUS_CLASS keys; replaced in place as the clip advances
        duration (float) seconds
        src      (str)   short provenance line (hook type, assembly order, timecodes)
        note     (str)   strategist / QA notes
        n        (int)   OPTIONAL explicit clip number. Omit and the card is numbered by
                         position. Pass it to KEEP NUMBERING STABLE after Mike deletes a
                         clip: the convention says numbering is fixed at initial-dashboard
                         time and never renumbers (he refers to shorts by number, so a
                         silent shift would repoint "clip 6" at a different short).
                         E.g. deleting clip 5 of 8 leaves 1,2,3,4,6,7,8.
    """
    cards = []
    for i, c in enumerate(clips, 1):
        i = c.get("n", i)
        scls = STATUS_CLASS.get(c.get("status", "raw"), "s-raw")
        cards.append(
            '<div class="card">\n'
            f'<h2><span class="num">Clip {i}</span> {html.escape(c["title"])}</h2>\n'
            f'<div class="meta"><span class="vtag">{html.escape(c.get("variant","full"))}</span> '
            f'<span class="stat {scls}">{html.escape(c.get("status","raw"))}</span> '
            f'&middot; {c.get("duration",0):.0f}s</div>\n'
            f'<video controls preload="metadata" src="{html.escape(c["video"])}"></video>\n'
            f'<details><summary>source + notes</summary>'
            f'<p class="src">{html.escape(c.get("src",""))}</p>'
            f'<p>{html.escape(c.get("note",""))}</p></details>\n'
            '</div>'
        )
    n = len(clips)
    nums = [c.get("n", i) for i, c in enumerate(clips, 1)]
    label = f'1-{n}' if nums == list(range(1, n + 1)) else ", ".join(str(x) for x in nums)
    sub = f'{n} short{"s" if n != 1 else ""} (each its own cell, numbered {label}) &middot; clip-strategist (Fable/max) &middot; status replaces in place: raw / desilenced / tightened+desilenced / filler-cut (final)'
    if subtitle_extra:
        sub += " &middot; " + html.escape(subtitle_extra)
    doc = (
        f'<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(batch)} clips</title>'
        f'<style>{CSS}</style></head><body>\n'
        f'<h1>{html.escape(title or batch)} &mdash; clip review</h1>\n'
        f'<div class="sub">{sub}</div>\n'
        f'<div class="grid">{"".join(cards)}</div>\n'
        '</body></html>\n'
    )
    path = os.path.join(outdir, "dashboard.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(doc)
    return path
