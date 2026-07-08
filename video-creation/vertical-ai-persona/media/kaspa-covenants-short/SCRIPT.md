# kaspa-covenants-short — SCRIPT (30s vertical teaser)

> **STATUS 2026-06-22: EDITED + RENDERED + QA-PASSED.** Final =
> `renders/kaspa-covenants-short-FINAL.mp4` (1080x1920, 24.0s, 17 MB). Pipeline: desilence @200ms
> (55.2->24.1s) -> bake 3 faces (`spine.mp4`) -> Remotion `KaspaCovenantsShort` (cover-cropped spine,
> vertical C3b/C5b React containers, tunnel/coin/ecosystem b-roll, hard-cut + glitch SFX, arial-black
> karaoke captions, Race Against Time bed). EDIT-PLAN.md + CUE-SHEET.md reconciled; black-scan clean.
> Came in at 24s (not 30) because 200ms desilence is rapid-fire — punchy, under the Shorts cap. NOT
> yet published (queue via schedule-tweets/data/shorts.json). Lessons -> `../../CLAUDE.md`.


**Purpose:** a 9:16 YouTube Short (also TikTok/IG/Reels) whose ONE job is to make people go watch the
longform **"Kaspa's Covenants Put It Lightyears Ahead Of Every Other Crypto"**
(`longform-edited/media/kaspa-covenants/`). Open-loop tease, do NOT fully explain — hook, fast jabs,
hard CTA to the full video.

**Format:** ~30s, vertical 9:16. The spine is **b-roll / container cutaways** (all 9:16); Mike's face only
pops in a few times as punctuation. Captions ON the whole way.

**Register / delivery:** gear 3 (epic, declarative, short hammer sentences). Energetic — liberal "!" and
ALL-CAPS on the emphasis words (persona TTS rule). No "right?" tags, no hedging.

## FACE RULE (Mike, 2026-06-20)
Mike's face is on screen **at most 2 seconds at a time — 1 to 2 seconds each, exactly 3 times** across the
30s, spread out, **even if it lands on a partial sentence.** Everything else is a cutaway with the VO over
it. (This is tighter than the longform's one-sentence gating — for a 30s short the face is pure punctuation.)

---

## The script (VO is verbatim; (parens) = direction)

| t | On screen | VO (say it) | Notes |
|---|---|---|---|
| 0:00-0:02 | **`[FACE #1]`** (~2s, glitch in) | "Kaspa just did something" | open on his face, hard energy |
| 0:02-0:05 | COVER: data-tunnel clip (9:16) | "Bitcoin has been ARGUING about for YEARS." | cut OFF his face mid-sentence |
| 0:05-0:10 | COVER: coin image (9:16, `coin-vert`) | "It's called a COVENANT. A coin that carries its OWN rules." | |
| 0:10-0:16 | COVER: rule-list container C3b (9:16) | "Send only here. Locked until later. Royalties you CAN'T skip." | rules reveal fast |
| 0:16-0:18 | **`[FACE #2]`** (~1.5s) | "The coin enforces itself." | partial-sentence face pop |
| 0:18-0:24 | COVER: 3-way matrix container C5b (9:16) | "No virtual machine. Proof-of-work security AND real programmability. NOTHING else has both." | |
| 0:24-0:28 | COVER: ecosystem image (9:16, `ecosystem-vert`) | "This could put Kaspa LIGHTYEARS ahead of every other crypto." | |
| 0:28-0:30 | **`[FACE #3]`** (~1.5s) + end card | "Go watch it!" | end card: Kaspa logo + longform thumb, "FULL VIDEO" cue |

3 face pops = ~2s + ~1.5s + ~1.5s, all ≤ 2s. **Word count ~70** (≈30s energetic). If long, cut the
royalties clause.

**Cold-open alt hook** (swap-in if the Bitcoin angle tests weak): "Every coin you own obeys ONE rule.
Kaspa just changed that."

---

## Visual plan — ALL 9:16, vertical-native

**Assets live in this folder's `assets/`** (`assets/images/`, `assets/video/`). Do NOT stretch the
longform's 16:9 assets; make true vertical versions:

- **Images → ChatGPT-repurposed to 9:16 — DONE** (referenced the longform originals so they match, not
  stretched): `assets/images/broll-f2a9c7e1-coin-vert.png` (gold coin in teal vault, god-ray) +
  `assets/images/broll-a8d3b04f-ecosystem-vert.png` (epic teal city, central spire). Both true 9:16, on-brand,
  no text. QA'd.
- **Video b-roll → Envato 9:16 (portrait filter `--portrait`)**: `assets/video/vTunnel-tunnel.*` (vertical
  data tunnel, hook energy) — downloaded, >1GB→100MB cap applied. **Vault clip DROPPED** — portrait vault
  stock was poor (storefront OPEN/CLOSED signs, not bank vaults) and that beat is already carried by the
  rule-list container C3b, so no loss.
- **Containers → re-rendered 9:16** from `longform-edited/media/kaspa-covenants/kaspa-covenants-containers.html`
  (the rule-list C3b and the 3-way matrix C5b) at 1080×1920, type scaled up for the vertical safe area. (These
  are HTML re-renders, not ChatGPT/Envato.)
- **Face spine:** same method as the longform face (lip-synced real VO, or Seedance synth — **480p ONLY** if
  Seedance, Remotion upscales). Only ~5s of face total across the 3 pops, so this is cheap.
- **Transitions:** glitch cuts. The transition library is authored 16:9; a 9:16 variant is a separate row
  (`aspectRatios` must include `"9:16"`) — build/confirm a vertical variant or use hard-cut + glitch SFX.

## Captions
AI-persona karaoke style (arial-black, UPPERCASE, yellow active-word box — the crypto-promo / Mother-Satori
look), built post-VO from Whisper word-timings via the canonical caption skill. (Confirm vs the `montserrat`
shorts preset — Mike's call.) CORRECTIONS: "Kaspa" (never Casper), "KRC-20", "TAO".

## Music / SFX
One driving bed (reuse **Race Against Time**, the longform cold-open bed, trimmed to 30s) + a glitch SFX on
each cut. Bed ~16-18 dB under VO.

## CTA / distribution
- Spoken CTA = "Go watch it" + on-screen "FULL VIDEO" cue. Link in the description only on
  **yt_shorts / rumble / bitchute** (link-split rule); TikTok/IG/X/FB captions stay clean.
- Queue via `schedule-tweets/data/shorts.json` like every other short.

## [VERIFY] before render
- Toccata activation status — if live by record date, hook → "Kaspa just SHIPPED something Bitcoin has argued
  about for years" (stronger).
- Bitcoin-covenant framing: "argued about for years," never "Bitcoin can never."
- No price / market-cap claims; keep upside conditional ("could put Kaspa...").

## Open
- Lock the hook (main vs alt) + face method (match the longform).
- Build the 9:16 container crops + confirm a vertical glitch transition (or hard-cut + SFX).
