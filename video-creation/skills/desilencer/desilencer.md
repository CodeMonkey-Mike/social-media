# Desilencer — canonical silence removal (ALL tracks)

**The ONE place silence detection lives.** Shorts, longform-edited, and longform-presentation all use
this — never write a new silence script, never use a different method. This is the sibling of
`defumbler/defumbler.md`: defumbler removes fumbles/retakes (keeps pacing); the desilencer tightens
pacing by removing silence. They are separate, explicit steps in that order.

Tool: `desilencer/scripts/desilence.py`. Read this doc before running it.

> **The desilencer KEEPS loud anomalies.** A throat-clear / cough / click / mic-bump is above the
> audio threshold, so it is preserved (correctly — it's not silence) and rides through to the finished
> spine. To remove a specific reported burst, use the sibling **burst-removal skill**
> (`video-creation/skills/burst-removal/burst-removal.md`), a targeted end-of-word-A → start-of-word-B cut.

---

## Why this skill exists (the divergence that caused it)

Three longform scripts (`build_two_zone.py`, `desilence_audio.py`, `desilence_synced.py`) each
re-implemented silence detection with ffmpeg's single-threshold `silencedetect`, instead of reusing
the validated dual-threshold RMS detector from the shorts tool. That divergence led to an off-protocol
`-42 dB` pass that clipped words (silverscript, 2026-06-13). All of them now redirect here. See
[[feedback_factor_cross_cutting_into_skill]].

## Hard rules (do not violate)

- **Dual-threshold RMS detector, NEVER single-threshold `silencedetect`.** `silencedetect` is
  peak-sensitive: a tiny lip-click/breath-onset spiking to ~−40 dB fools it into thinking a clean
  −65 dB pause is "audio" (it then reports "no silence", which is what tempted the −42 dB mistake).
  Detection is per-20 ms **RMS** via ffmpeg `astats`, run through a hysteresis state machine.
  **`silencedetect` is BANNED for defining any cut edge.**
- **The thresholds are the METHOD, not knobs:** silence < **−57 dBFS**, audio > **−52 dBFS** (5 dB
  hysteresis). Validated 2026-05-23 (Mike's Audition workflow). A word's decaying tail stays audible
  down to ~−55 dB, so −57 keeps it — that is what makes word-clipping impossible. **Never dial these
  hotter to "find more silence"** — that clips word tails (the −40/−42/−45 region eats syllables).
- **The PARAMETER is the min-silence DURATION** — how long a quiet gap must be before it is cut. Mike
  sets this per request (200 ms, 500 ms, 600 ms…). Single value `--min-sil`, or two zones
  `--split/--sil-pre/--sil-post` (e.g. tight intro, looser body). Default 250 ms.
- **MIN_AUD blip-absorb = 80 ms (fixed).** An audio island shorter than this is folded into silence as
  a click. It MUST stay below the shortest real word (~120 ms): the shorts tool's 250 ms swallowed
  short words like "for"/"to" (silverscript, 2026-06-13 — "for two years" → "two years"). Don't raise it.
- **Declick every join (8 ms fades), always.** Each kept segment gets an 8 ms audio fade in/out so every
  splice lands at zero amplitude → no pop. NOT padding (doesn't extend audio or change pacing).
- **Video + audio stay frame-locked** — both are cut on the same keep-spans in one `filter_complex`.
- **Defumble FIRST, as a separate pass** (`defumbler/defumbler.md`). Never combine fumble removal and
  silence removal in one operation. Run the desilencer on the already-defumbled master.
- **QA every render: scan all cuts for swallowed speech** before delivering (see QA below).

## Picking the min-silence (do this, don't guess)

A person's natural inter-line pause clusters at one length. Setting `--min-sil` *at* that length barely
cuts anything (it sits right on the cluster); set it **just below** the cluster. Find the cluster with a
gap histogram, then a sweep:

```bash
python -c "import sys; sys.path.insert(0,'desilencer/scripts'); import desilence as d
src='FILE.mp4'; regs=d.regions(d.levels(src)); total=d.dur(src)
import collections; b=collections.Counter()
for t,s,e in regs:
    if t=='sil': b[round(e-s,1)]+=1
print('gap histogram:', dict(sorted(b.items())))
for ms in [0.30,0.40,0.45,0.50,0.60]:
    c=d.zone_cuts(regs,1e9,ms,ms,0.0); k,r=d.complement(c,total)
    print(f'{ms*1000:.0f}ms -> {len(c)} cuts, {r:.1f}s removed')"
```

Silverscript example: pauses clustered at ~0.6 s, so 600 ms removed only 9.5 s (too loose); **500 ms**
removed ~46 s and gave the desired rapid-fire pacing. Mike approved 250 ms intro / 500 ms body.

## Usage

```bash
# single zone
python desilencer/scripts/desilence.py in.mp4 --out out.mp4 --min-sil 0.5
# two zones (tight intro, looser body) — the longform default shape
python desilencer/scripts/desilence.py in.mp4 --out out.mp4 --split 18 --sil-pre 0.25 --sil-post 0.5
# export the cut/keep map so a Remotion comp can remap its cue times to the tightened timeline
python desilencer/scripts/desilence.py in.mp4 --out out.mp4 --min-sil 0.5 --map-out map.json
# big talking-head file: --nvenc for speed (matches a 2M master); default is libx264 crf18 (quality)
```

Audio-only inputs work (no `[outv]`). `--map-out` writes `{cuts, keeps}` in **source** coords for
re-timing a downstream editor. `--pad` defaults to 0 (declick makes padding unnecessary).

**The map's keep-boundaries double as JUMP-CUT ANCHORS (Mike, 2026-07-06).** Every keep→keep join in the
output is a cut that sat in silence, i.e. a natural sentence/phrase boundary. For longform-edited comps,
convert the joins to final-video coords (add any baked card-pause shifts) and save them as
`media/<project>/spine/jumpcuts-final.json` — mid-face punch-ins, zoom hits, and any mid-face transition
must snap to these anchors instead of arbitrary times (a hit mid-sentence is the bug this prevents; see
`longform-edited/skills/comp-build.md` §5).

## QA (mandatory before delivery)

Scan every cut for speech-level audio it may have swallowed:

```bash
python -c "import sys; sys.path.insert(0,'desilencer/scripts'); import desilence as d
src='FILE.mp4'; lv=d.levels(src); regs=d.regions(lv)
cuts=d.zone_cuts(regs, SPLIT, PRE, POST, 0.0)
def run(a,b):
    w=c=0
    for t,v in lv:
        if a<=t<b: c=(c+d.WIN) if v>-52 else 0; w=max(w,c)
    return w
flag=[(a,b,run(a,b)) for a,b in cuts if run(a,b)>=0.10]
print('FLAGS (>=100ms speech inside a cut):', flag or 'none')"
```

A flag at speech level (−16 to −25 dB) = a clipped word → lower `MIN_AUD` is NOT the answer, inspect the
spot. A flag that is only −45 to −52 dB is a faint breath, not a word (false positive) — fine to keep.
