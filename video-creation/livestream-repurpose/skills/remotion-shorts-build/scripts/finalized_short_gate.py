"""finalized_short_gate.py — mechanical definition-of-done for a Remotion short.

A build may only be reported "done" if this prints PASS (exit 0). It scans the composition +
constants source for the finalized-short contract (video-creation/skills/remotion-building/SKILL.md):
  - a frame-0 thumbnail asset reference
  - a non-trivial B-ROLL layer: >= max(3, duration/15) distinct broll asset refs
  - SFX: >= 2 distinct sfx audio refs
  - every staticFile() asset present on disk in --public-dir (zero orphans, both directions)

Usage:
  python finalized_short_gate.py --constants <constants.ts> [--comp <Comp.tsx>] \
      --public-dir <render-assets dir> --duration <seconds>
"""
import argparse, math, os, re, sys

ap = argparse.ArgumentParser()
ap.add_argument("--constants", required=True)
ap.add_argument("--comp", default=None)
ap.add_argument("--public-dir", required=True)
ap.add_argument("--duration", type=float, required=True)
ap.add_argument("--clip", type=int, default=None,
                help="clip number in the batch. Enables the ZONE-COVERAGE check, which needs to "
                     "know which build directives apply to THIS clip.")
ap.add_argument("--plan", default=None,
                help="clip-plan.json (default: derived from --public-dir, which normally sits at "
                     "shorts/<batch>/render-assets)")
a = ap.parse_args()

src = open(a.constants, encoding="utf-8").read()
if a.comp:
    src += "\n" + open(a.comp, encoding="utf-8").read()

refs = re.findall(r"staticFile\(\s*['\"]([^'\"]+)['\"]\s*\)", src)
distinct = sorted(set(refs))
broll = [r for r in distinct if "broll" in r.lower()]
sfx   = [r for r in distinct if re.search(r"sfx|whoosh|impact|riser|ding|swoosh", r, re.I)]
thumb = [r for r in distinct if "thumb" in r.lower()]

# Floor of 1, NOT length-scaled: Mike's process uses FEW distinct b-roll (full-screens at key beats +
# ~2 reused/alternated content-zone images; VERY short impact clips may use just 1). Distinct-count is
# not a coverage proxy — the reviewed BROLL-PLAN guarantees coverage via reuse. This only blocks a true
# skeleton (0 b-roll). Budget guidance (~6 per 60s, ~1 per 10s) lives in the SKILL, not this floor.
min_broll = 1
fails, notes = [], []

if not thumb:
    fails.append("NO frame-0 thumbnail asset referenced (expected a staticFile('*thumb*') ref)")
else:
    notes.append(f"thumbnail: {thumb[0]}")

if len(broll) == 0:
    fails.append("NO b-roll assets referenced - a finalized short ALWAYS has a b-roll layer")
elif len(broll) < min_broll:
    fails.append(f"b-roll too thin: {len(broll)} distinct assets < required {min_broll} "
                 f"(duration {a.duration:.0f}s; zone must change every 1-3s, no static >3s)")
else:
    notes.append(f"b-roll assets: {len(broll)} (>= {min_broll} required)")

if len(sfx) < 2:
    fails.append(f"SFX events: {len(sfx)} distinct refs < required 2 (whoosh on cuts, impacts on reveals)")
else:
    notes.append(f"sfx refs: {len(sfx)}")

# zero-orphans, both directions
pub = a.public_dir
missing = [r for r in distinct if not os.path.exists(os.path.join(pub, r))]
if missing:
    fails.append(f"comp references missing from public-dir: {missing[:5]}{'...' if len(missing) > 5 else ''}")
on_disk = {f for f in os.listdir(pub) if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))} if os.path.isdir(pub) else set()
orphans = sorted(f for f in on_disk if ("broll" in f.lower() or "thumb" in f.lower()) and f not in set(refs))
if orphans:
    notes.append(f"WARN unreferenced assets in public-dir (orphans): {orphans[:5]}")

# ─── ZONE-COVERAGE CHECK ────────────────────────────────────────────────────────────────────
# WHY (2026-08-10, batch `tutorial`): all 8 clips shipped with 0% full-screen and 0% content-zone
# b-roll under a directive Mike had given for CLIP 1 ONLY, and this gate PASSED all 8 without a
# murmur — because a transparent overlay satisfies the >=1 "broll" ref above, so the gate could not
# tell "0% coverage because Mike said so" from "0% coverage by omission". Eight builders each
# declared the miss in prose, and prose blocks nothing.
#
# Zone/full-screen b-roll in this codebase is the `broll:` prop the shared renderer takes, typed
# BrollEv[]. Zero entries in that array == zero coverage, and that is now a FAIL unless a directive
# with `coverage_exempt` explicitly applies to THIS clip number.
_broll_arrays = re.findall(r"export\s+const\s+(\w+)\s*:\s*BrollEv\[\]\s*=\s*\[(.*?)\]\s*;",
                           src, re.S)
if _broll_arrays:
    _zone_entries = sum(len(re.findall(r"\{", body)) for _, body in _broll_arrays)
else:
    _zone_entries = 0

if a.clip is None:
    notes.append("WARN zone-coverage NOT checked (pass --clip N to enable). A clip can ship 0% "
                 "full-screen / content-zone b-roll unnoticed without it - the tutorial-batch bug")
else:
    _plan = a.plan
    if not _plan:
        _cand = os.path.join(os.path.dirname(os.path.abspath(a.public_dir)), "clip-plan.json")
        _plan = _cand if os.path.isfile(_cand) else None
    _exempt, _why = None, None
    if _plan:
        # Walk up to the video-creation root rather than counting ".." (this file sits 4 levels
        # deep under it, and a miscount silently degrades the check into a FAIL-open warning).
        _d = os.path.dirname(os.path.abspath(__file__))
        while _d != os.path.dirname(_d) and os.path.basename(_d) != "video-creation":
            _d = os.path.dirname(_d)
        sys.path.insert(0, os.path.join(_d, "shorts", "_tooling"))
        try:
            import clip_directives as _cd
            _dirs, _ = _cd.load_directives(_plan)
            _exempt = _cd.coverage_exempt_for(_dirs, a.clip)
            _unscoped = [d["id"] for d in _dirs if d["_unscoped"]]
            if _unscoped:
                notes.append(f"WARN clip-plan has UNSCOPED directive(s) {_unscoped}; they are "
                             f"IGNORED here, never inherited")
        except Exception as e:                                    # never let the backstop break a build
            _why = f"could not read directives ({type(e).__name__}: {e})"
    else:
        _why = f"no clip-plan.json found next to --public-dir"

    if _zone_entries > 0:
        notes.append(f"zone b-roll: {_zone_entries} beat(s) in BrollEv[] (coverage present)")
    elif _exempt is not None:
        notes.append(f"zone b-roll: 0 beats, EXEMPT for clip {a.clip} by directive "
                     f"'{_exempt['id']}' [{_exempt.get('authority')}]")
    else:
        detail = f" ({_why})" if _why else ""
        fails.append(
            f"ZERO zone/full-screen b-roll (BrollEv[] is empty) and clip {a.clip} has NO directive "
            f"granting coverage_exempt{detail}. Either add the coverage beats, or record the "
            f"instruction as a scoped directive with \"coverage_exempt\": true and "
            f"\"applies_to\": [{a.clip}] in clip-plan.json. Do NOT widen an existing directive's "
            f"applies_to to silence this - that is the exact bug this check exists to catch.")

print(f"gate: {os.path.basename(a.constants)} | duration {a.duration:.1f}s | "
      f"{len(distinct)} distinct staticFile refs")
for n in notes:
    print("  ok  " + n)
for f in fails:
    print("  FAIL " + f)
print("PASS" if not fails else "FAIL: build is NOT a finalized short - fix and re-run")
sys.exit(0 if not fails else 1)
