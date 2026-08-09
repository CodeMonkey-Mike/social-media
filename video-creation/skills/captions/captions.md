# captions — the canonical caption skill (ALL formats)

**The ONE place captions live.** Shorts (livestream-repurpose), Kaspa Wise Man, Yuli y Ana, crypto-promo
(vertical AI persona), and longform-edited all use this. Sibling of `defumbler/` and `desilencer/`: one
track-agnostic skill, one method, the visual differences are **named presets**, not copied code. Read this
before writing any caption logic. (Established 2026-06-17, Mike: "captions are used in at least 4 places,
save them into a single skill and choose the style when using it; name the styles after the font face.")

Tool: `captions/build_captions.py`. Style spec: this file.

---

## The shared METHOD (one copy, every preset)

1. **Word timings** — local Whisper with `--word_timestamps True` (offline `whisper.exe`; never ask for an
   API key, see `reference_local_whisper_for_watch`). Transcribe on the CLEANEST audio you have; for a
   multi-clip timeline, transcribe each clip on its own audio and offset by cumulative start (most accurate).
2. **Brand / term correction** — `CORRECTIONS` dict, the single source of truth (was scattered across
   `clean_token` copies). Current entries: `casper/kasper/caspa -> kaspa`, `sailor -> saylor`,
   `tau -> tao` (Mike says "tau" for $TAO; the ticker is ALWAYS TAO, never "tau" — see
   `feedback_tao_not_tau`). **Add new mishears HERE only.**
3. **Cleanup** — drop fillers (`uh um umm hmm`), merge `pre + mine/mind -> premine`, merge a bare number +
   `% / percent / x -> 30% / 353x`, collapse consecutive duplicate words (stutters: "not, not, not").
   Captions are NOT 1:1 with audio; readability wins.
4. **Group into caption units** — params are per-preset (below).
5. **Emit** — format is per-preset (TS array vs karaoke `captions.json`).

The method never gets copied into a format again. Only the preset table grows.

---

## Presets (pick at use time: `--style <name>`; named by font face)

### `montserrat` — lowercase bounce-pop (chunk-level)
Used by: **shorts**, **Yuli y Ana**. The "caption1" base style (was `style-guide/captions.md`).
- **Font:** Montserrat Black (900). **Case:** all lowercase. **Size:** 72px @1080×1920.
- **Fill:** #fff. **Stroke:** #000 ~13-14px, `paintOrder: stroke fill`. **Align:** center. **Tracking:** ~0.01em.
- **Grouping:** max 3 words on screen, but up to 5 if EVERY word in the group is very small (<=4 chars,
  e.g. "for no reason at all"); also break on a gap > 0.45s or sentence-ending punctuation. (Mike, 2026-06-17.)
  - **`--max-secs <s>` (optional, default 0 = OFF)** — a duration cap on a group, the same guard
    `arial-black` has always had (its `MAX_SECS` = 1.6). Reach for it ONLY on a clip with **stretched
    words**, where the word caps and the 0.45s gap break stop bounding anything because a stretched run
    has no gaps in it (tutorial/94x-euphoria-impact 2026-08-09: "the 550X on NYX on BNB" is five
    <=4-char words with a 1.98s "550X" and zero gaps, so the 3/5 caps put ONE caption on screen for
    4.86s of continuous speech). Set it **above any deliberately-held vowel in the clip** so a genuine
    sustain still gets ONE caption (that clip's protected 2.74s "ohhh man" forced 2.80). Leaving it off
    reproduces every past build byte-identically.
- **Animation:** bounce pop-in per chunk, Transform scale `70 -> 110 -> 100` over ~12 frames (~0.4s @30fps),
  ease-out on the settle. (NOT word karaoke.)
- **Color tags (optional):** `<g>` teal/Kaspa, `<y>` yellow/numbers, `<gr>` green/win, `<r>` red/warning.
- **Output:** TS array `export const CAPTIONS_X: {t:number; h:string}[] = [{ t, h }, ...]` (chunk timestamp + html).
- **Renderers:** `remotion/src/HeardOfKaspaBrah.tsx`, `YuliCrypto1.tsx` (FONT = Montserrat).

### `arial-black` — UPPERCASE word karaoke
Used by: **Kaspa Wise Man**, **crypto-promo**. The "Mother-Satori" karaoke look.
- **Font:** Arial Black (900). **Case:** UPPERCASE. **Size:** 76px @1080×1920. **Tracking:** letterSpacing 1.
- **Fill:** #fff. **Stroke:** #000 9px, `paintOrder: stroke`.
- **Karaoke highlight:** the active word gets a **yellow box** `backgroundColor #ffd400`, and the active word
  itself flips to `color #1a1a1a` with `WebkitTextStroke 0` (active when `t >= w.start && t < w.end + 0.06`).
- **⚠️ THE FLICKER BUG — the active highlight must change ONLY paint, NEVER geometry (Mike, recurring, fixed 2026-06-22).**
  The active word must keep the **exact same box size** as when inactive — **constant horizontal `padding` on
  EVERY word** (e.g. `2px 12px` for active AND inactive). If the active word gets *wider* padding (the old
  `padding: active ? '2px 14px' : '2px 4px'`), it widens the line, which flips the flex-wrap between 1 and 2
  lines as the highlight advances word-to-word → the caption **rapidly bounces 1↔2 lines every frame.** Toggle
  ONLY `backgroundColor` / `color` / `WebkitTextStroke` on active (all paint-only, zero layout effect). Add
  `whiteSpace:'nowrap'` per word. This bug recurred on EVERY karaoke video because each comp copy-pasted the
  renderer — so DON'T copy-paste it (see below).
- **Grouping:** 3-4 words; break on 4 words, a group running > 1.6s, or sentence-ending punctuation. Strip
  display punctuation (clean karaoke).
- **Output:** `captions.json` = `[{ text, start, end, words: [{w, start, end}, ...] }, ...]` (per-word timings
  REQUIRED for the highlight).
- **Renderer = the ONE canonical component `remotion/src/captions/Caption2.tsx`** (flicker-free; takes a
  `captions` prop). EVERY comp must `import { Caption2 } from './captions/Caption2'` and render
  `<Caption2 captions={CAPTIONS} />` — do **NOT** inline/copy-paste a local karaoke renderer (that reintroduces
  the flicker bug). Older comps still carrying an inline copy (`WiseManFl07.tsx`, `WiseManIntro.tsx`,
  `CryptoPromo.tsx`, `AnaToccata.tsx`) should be migrated to import this component.

### longform-edited
**OFF by default; tighter density when used.** The longform-edited caption rule (when allowed, the exact
word caps, and the current density) lives in its own track skill: **`video-creation/longform-edited/skills/captions.md`**
— that is the source of truth (the number evolves; it is NOT duplicated here). It uses the `montserrat`
preset with `--max-words`/`--max-short` set there. Do not caption a longform-edited video on your own.

---

## Usage

```bash
# from a whisper word-timestamps JSON
python video-creation/skills/captions/build_captions.py --words whisper-words.json --style montserrat --var CAPTIONS_XRPK
python video-creation/skills/captions/build_captions.py --words whisper-words.json --style arial-black --out _captions/captions.json
# or transcribe a clip first (local whisper), then build
python video-creation/skills/captions/build_captions.py --transcribe clip.mp4 --style arial-black --out _captions/captions.json
```

`--colorize teal=kaspa,tao yellow=353x,58x` adds color tags (montserrat). The builder does method steps
1-5; the **render** stays in the per-format Remotion component (which must follow the preset's font/stroke/
karaoke spec above). When a component diverges from its preset, fix the component, not this doc.

## Adding a style
A new look = a new font = a new preset. Add a `### <font-name>` block here + a branch in `build_captions.py`.
Do NOT fork the method. If only the brand corrections differ, just extend `CORRECTIONS`.
