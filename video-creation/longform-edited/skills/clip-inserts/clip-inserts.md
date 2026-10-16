# longform-edited · CLIP INSERTS (a third voice spliced into the video)

_Canonical rule for splicing a SHORT THIRD-PARTY CLIP into a longform-edited video: a public figure saying the
thing on camera, a demo, a news anchor, a founder on a podcast. The clip plays FULL-FRAME WITH ITS OWN VOICE while
Mike's spine PAUSES, with a transition in and out, the music bed ducked, and a burned-in context caption on every
frame. Standing part of the process since 2026-10-09 (Mike): it is CONSIDERED on every video, with "none this
video" as an explicit, written outcome. Born on every-job (the Jensen Huang radiology clip, 2026-10-08), where a
"splice this clip in" instruction was read as a muted cover and had to be rebuilt after the draft._

## ⛔ The rule (Mike, 2026-10-09)
1. **Every longform-edited video considers clip inserts.** Many videos will have none; one video may carry three or
   four. What is forbidden is never asking. The consideration is written down twice and gated in code:
   - `DATA.md` **"Clip candidates"** section (research node): the real clips that exist for this topic, verbatim
     words, URL + timecodes, the in-context check. "None found" with what was searched is a valid section.
   - `SCREENPLAY.md` **`## CLIP-INSERTS`** section (screenplay node, `lint_screenplay.py` FAILS without it): each
     proposed insert as a row with a status, or `NONE` with the reason. Mike rules at the screenplay gate.
2. **A spliced clip is NOT a muted cover.** "Splice it in" / "don't put his voice on mine" = Mike's spine pauses,
   the clip plays with its own audio, Mike resumes. A muted clip under his narration is a RECEIPT cover (R(other)),
   a different thing with a different worklist. When his wording matches neither option you offered, the options
   were wrong: ask, never snap his answer to the nearest menu item.
3. **The script is written around the clip.** Mike SETS UP the clip and ENDS THE SENTENCE ("...you've probably seen
   the clip of Jensen Huang, the CEO of Nvidia, saying the first job AI will destroy is radiology."); the clip says
   the words; Mike RESUMES with his answer. He never reads the exact words the clip is about to say. The set-up
   line's end is the splice point, so it must be a real sentence boundary with a breath (the baker snaps into the
   silence trough; a boundary with no trough fails and is re-picked at a different word boundary, never mid-word).
4. **Honesty travels with the clip.** The burned caption names who, where, when (e.g. "Jensen Huang, June 2026,
   repeating a warning made about 10 years earlier"). A clip is never trimmed to change what the speaker meant;
   DATA.md's do-not-air list applies to clips exactly as to numbers. The claim the video makes about the clip is
   Mike's, said as his, in the resume line.
5. **Length:** the quoted seconds only, typically 4 to 15 s; longer only on Mike's ruling. The clip's own frame rate
   and size are normalised to 1920x1080 at 30 fps by the capture script; its audio is kept (48 kHz stereo AAC).

## Pipeline (what each stage owns; every step is verified from disk by the longform graph)

| Stage (graph node) | Who | Artifact | Gate |
|---|---|---|---|
| research | `data-researcher` | `DATA.md` § Clip candidates (`CLIP-<n>` ids, verbatim words, URL + start-end, context check) | research node requires the section on a fresh DATA.md |
| screenplay | `screenplay-strategist` | 🎞️ `[INSERT]` lines in the beats (Convention 6) + `## CLIP-INSERTS` table or `NONE: <why>` | `lint_screenplay.py`: section present, every `[INSERT]` id listed, every listed PROPOSED id lands in a chapter |
| gate screenplay | Mike | rules each row: APPROVED / REJECTED (edits the status) | HITL |
| as_recorded | `as-recorded-author` | one beat row per insert: the set-up line's end as spoken, `KEPT · INSERT CLIP-n` or `DROPPED` | `lint_as_recorded.py` (verdict on every row) |
| coverage | `coverage-strategist` | `COVER-PLAN.json` `clip_inserts[]` (id, source, start/end, seconds, `splice_at` = end of the set-up line's last word on the FINAL spine, caption, expected words) + a zero-length `clip-insert` cover beat at `splice_at`; `clip_inserts_note` when none | graph `_cover_plan_check` + a silence-trough dry-run of every `splice_at` (bake_card_pauses.snap) so a bad boundary fails at the PLAN gate, not at build |
| coverage (render) | `render_cover_plan.py` | BROLL-PLAN.md **CLIP INSERTS capture worklist** | |
| assets | `receipt-capturer` | `assets/clip-inserts/CLIP-<n>-<slug>.mp4` via `capture_clip_insert.py` (audio kept, caption burned, Whisper-verified words) | `visual-qa` opens the mid frame; `verify_assets` FAILS a clip without an audio stream or off its planned length |
| edit_plan | `gen_editplan.py` seed + `edit-plan-author` | `[INSERT]` row at `splice_at` + lead-in / lead-out stills around it | `lint_edit_plan.py`: an `[INSERT]` event per planned insert |
| transitions | `transition-strategist` | bucket `insert`: one `insert-in` + one `insert-out` row per clip (default `hand:fade` 0.5 s) | `lint_transitions.py`: both rows per insert |
| card_pauses | graph (code) | `bake_card_pauses.py` (cards) then `scripts/bake_clip_insert.py` (inserts) -> the paused spine with the clip's AUDIO in the VO gap; sidecar `pauses[]` with per-pause `dur` + `clip` | `lint-pause-silence.py --inserts`, fps, duration = source + all pauses |
| comp_build | `comp-builder` | comp-build.md **§3d**: `sh()` over the pauses table, `INSERTS` export, the clip FULL-FRAME and MUTED over its paused window (its voice is already in the VO), lead-in/out stills, insert transitions | `verify_comp` runs `lint-pause-silence.py` when `INSERTS` is declared |
| mix_audio | `mix_music.py` | beds duck -14 dB (0.3 s ramp) under every insert, automatically from the sidecar | peak / duration checks |

## Capture (the canonical tool: `skills/clip-inserts/capture_clip_insert.py`)
```
python video-creation/longform-edited/skills/clip-inserts/capture_clip_insert.py --url "<page or video URL>" \
    --start 33:04.6 --end 33:14.6 --out "<project>/assets/clip-inserts/CLIP-1-huang-radiology.mp4" \
    --caption "Jensen Huang, June 2026, repeating a warning made about 10 years earlier" \
    [--expect "nobody goes into this field"] [--whisper-model small.en] [--font <ttf/otf>] [--keep-src]
```
What it does, in order (machine lines `CLIP-INSERT-PULLED`, `CLIP-INSERT-OK` / `FAIL`, `PROGRESS 100%`):
1. **Pulls the section with audio** via yt-dlp (`--download-sections "*start-end" --force-keyframes-at-cuts`, best
   video up to 1080p + best audio). If the section pull fails or comes back silent (DASH streams that will not seek,
   the every-job case), it pulls the full best audio and muxes the window onto the section video; last resort, the
   whole video trimmed with ffmpeg. The yt-dlp config on this machine sets `--js-runtimes node` (memory
   `reference_ytdlp_node_runtime`); never improvise a browser recording for audio.
2. **Normalises**: 1920x1080 (letterbox pad, never stretch), 30 fps, H.264 crf 18, AAC 48 kHz stereo, exact length.
3. **Burns the context caption** on every frame: white bold sans (Montserrat Bold by default, the look Mike approved on
   every-job), centred, over a translucent black band along the bottom edge. Never a corner badge, never a tier pill.
   **When the source carries its own lower-third (a news chyron, a network bug), pass `--caption-pos top`** so the band
   sits at the top of the frame and the two never stack (retire-early, 2026-10-10: the bottom band covered CNBC's
   lower-third on both clips and visual-qa failed them).
4. **Verifies**: an audio stream exists and is not silent (mean volume), the duration matches the window, and
   Whisper (local, `small.en` by default, GPU if present) transcribes the clip; with `--expect` the phrase must be heard
   or the script FAILS. The transcript is printed so the capturer can quote the real words back into the plan.
A capture whose words differ from the plan, or whose source is gone, is FLAGGED to Mike, never trimmed into meaning.

## Bake + comp (shared with the title-card pauses; the spine tools live in `../../scripts/`)
- `scripts/bake_clip_insert.py <final spine> --cards-json spine/<scope>.<x>.paused.json --insert "<splice_at>:<clip>:<CLIP-n>" --out spine/<scope>.<y>.paused.mp4`
  reuses the snapped card pauses, snaps each insert into the silence trough at the planned point (fails with the
  measured dB when there is none), renders ONE sync-safe concat (freeze + silence per card, freeze + THE CLIP'S AUDIO
  per insert) and writes the sidecar the comp and the mixer read (`pauses[].at/dur/clip`). The graph's `card_pauses`
  node runs it whenever COVER-PLAN.json carries `clip_inserts`.
- Comp: `comp-build.md` §3d (the pauses table in `sh()`, `INSERTS`, the clip full-frame and muted over its paused window,
  the lead-in / lead-out stills, `insert-in` / `insert-out` transitions). Captions stay gated to Mike's FACE windows.
- Mix: automatic duck from the sidecar (`mix_music.py`, -14 dB, 0.3 s ramp). No manual automation row.

## Where this sits in the other docs (pointers, not copies)
`screenplay.md` Convention 6 (the writing rule + the section) · `longform-edited.md` house rule #14 · the agents in
`.claude/agents/longform-edited/` (data-researcher, screenplay-strategist, as-recorded-author, coverage-strategist,
receipt-capturer, edit-plan-author, transition-strategist, music-placement-strategist, comp-builder) each carry the
slice they own · the reference shapes in `skills/doc-reference/` show one worked row each.
