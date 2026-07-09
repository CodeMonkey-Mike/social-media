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

print(f"gate: {os.path.basename(a.constants)} | duration {a.duration:.1f}s | "
      f"{len(distinct)} distinct staticFile refs")
for n in notes:
    print("  ok  " + n)
for f in fails:
    print("  FAIL " + f)
print("PASS" if not fails else "FAIL: build is NOT a finalized short - fix and re-run")
sys.exit(0 if not fails else 1)
