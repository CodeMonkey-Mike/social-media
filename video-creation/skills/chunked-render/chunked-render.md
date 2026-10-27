# chunked-render — every longform Remotion render, in 1-minute chunks, watched

_Canonical skill (Mike, 2026-10-27). Code: `chunked_render.py` (library + CLI) · tests `test_chunked_render.py` on the
`fake_remotion.py` stand-in · the gate `scripts/check-remotion-render.py`. Sibling: `../run-queue/run-queue.md`._

## Why

On 2026-10-27 one final render crashed at 94% and lost everything (Remotion writes the file only at the very end),
a second hung on its last 2 frames for 30+ minutes, and nobody was told: Mike found out each time by checking. The fix
is structural, not "watch it harder":

| Rule | What it buys |
|---|---|
| **1-minute chunks** (1800 frames at 30 fps), each its own file, kept the moment it verifies | a crash costs at most one chunk, never the render |
| **resume**: a re-run skips every chunk already rendered | a pause, crash or reboot is never a restart |
| **watchdog inside the renderer**: no new frame for 6 min (15 min before frame 1) kills the chunk's process tree and retries it, up to 3 attempts | a stall heals itself; nobody has to notice it |
| **every failed attempt's log is kept** + the frame it hung on recorded | the root cause of a stall can actually be found |
| **desktop notification** on stall + retry, on failure, on done | Mike hears about it without a Claude session watching (memory-pressure reaping kills session watchers) |
| **the run-queue pause** is honoured between chunks; `--deadline HH:MM` stops before a chunk that cannot finish | a meeting never freezes the machine and never loses work |

## How a render runs

1. `remotion bundle` ONCE into the work dir (`$CHUNKED_RENDER_DIR`, else `%TEMP%`, under `chunked-render/<Comp>-<key>/`;
   launchers point TEMP at D: because C: is nearly full). Bundling is deterministic (measured: two builds hash identically).
2. The composition's frame count comes from `remotion compositions <bundle>` (no `--log=error`: it hides the table).
3. A **fingerprint** (bundle code + public-dir listing + flags + props) guards the chunks: a changed comp never reuses
   a stale chunk; an unchanged one resumes.
4. Each chunk: `remotion render <bundle> <Comp> chunk-A-B.mkv --codec=h264-mkv --frames=A-B` + the quality flags. The
   **h264-mkv** codec carries UNCOMPRESSED pcm audio, so chunks join sample-exact (measured: a 2-chunk join is
   bit-identical to the same range rendered whole). Verified per chunk: frame count + audio length.
5. Join: concat demuxer, picture **stream-copied**, audio encoded to AAC (320k) ONCE, `-video_track_timescale <fps>` so
   every timestamp lands exactly on n/fps. Verified: frame count == the range, zero frames off the grid, audio length
   == picture length. The work dir is deleted after success.

**Never** concatenate AAC-bearing mp4 chunks: each one's encoder priming makes it look ~43 ms long, so the picture
drifts later at every seam and `-shortest` then drops the tail (2026-10-27: 0.68 s drift + 24 frames lost; the same
bug hit the vertical lane on golden-kitty 2026-10-02). The h264-mkv path makes that class of bug impossible.

## Who calls it

| Caller | How |
|---|---|
| longform-edited draft + final (`comp-builder` agent, graph `final_render`), ai-engineering, yuli-y-ana longform | `longform-edited/scripts/render_comp.py` (unchanged CLI; chunked inside) |
| the vertical lane (`v_render`) | ONE `render_comp.py` call (the old 12000-frame parts + their re-encoding join are retired) |
| `short_spans_from_16x9.py` | `render_comp.py --frames A-B` |
| longform-presentation spotlight | `render_spotlight.py`: each 5-minute part is one chunked render |
| a hand-run render | `python video-creation/skills/chunked-render/chunked_render.py --comp <Id> --out <mp4> --public-dir <dir> [--crf 18 \| --video-bitrate 200k] [--frames A-B] [--deadline HH:MM]` (takes the run-queue turn itself) |

**Exempt** (Mike, 2026-10-27): the livestream shorts renderer (`render_short.py`, 30-60 s shorts). It still runs inside
the batch run's queue turn.

A direct `npx remotion render` anywhere else FAILS `python scripts/check-remotion-render.py` (run it after touching
any render script). Stills and bundles are fine.

## Machine lines

`CHUNK i/n frames A-B ok|skip|FAIL attempt k/3` · `PROGRESS n%` (overall, for the graph heartbeat) ·
`CHUNKED-RENDER-DONE out=.. frames=N chunks=n minutes=m`. Exit 0 done · 1 failed (finished chunks kept; a re-run resumes)
· 3 stopped for `--deadline` (a re-run resumes). `render_comp.py` writes the chunk history JSON to its
`<out>-render.log` and copies every failed attempt's log beside it.

## Tests

`python video-creation/skills/chunked-render/test_chunked_render.py` (21 checks, no real render, about 2 minutes):
clean join (frames, timestamp grid, audio) · stall killed + retried · 3 crashes fail but keep finished chunks, re-run
resumes only the missing ones · a changed comp re-renders everything · deadline · pause · queue turns · dead holder
pruned · cancel · the supervisor re-drives a retry-set failure once and never a non-retry one.

Open (found 2026-10-27, not yet fixed): the two observed stalls both hit the END of a render (the last 2 frames; a
chunk at ~99%). With every attempt's log now kept, the next stall's log names the frame: read it before guessing.
