# Kaspa Founder: Genius or Over-Rated? — BROLL-PLAN

_File-level b-roll manifest. This is the **acquisition worklist** for the b-roll layer: the atmospheric /
concept shots, the sourced real photos, and the one AI motion clip, with their prompts / search terms / status.
**This is where b-roll detail lives** (so the screenplay's `🎬 [SHOW]` lines stay short references, not shot
descriptions, and so we have one place to keep ADDING b-roll). Placement of every layer is in `EDIT-PLAN-prep.md`;
the data visuals (diagrams, charts, containers, receipts) are NOT here, they live in the deck / `skills/charts.md`
/ the prep doc. Rule: every COVER beat is covered by a named asset or marked REJECTED / BENCH, zero orphans._

## Source rules (per repo conventions)
- **Data visuals = code-rendered diagrams/charts + real captures** (NOT b-roll, NOT AI images). See
  `EDIT-PLAN-prep.md` + `skills/charts.md`. Never an image model for anything with a number/label.
- **Atmospheric / concept stills = ChatGPT** via the browser pipeline `repurpose/gen-batch-freshchat.js`
  (Mike's subscription, free). Text-free mood imagery only. NEVER gpt_image via Higgsfield CLI (burns credits).
- **Moving stock b-roll = Envato Elements** via `video-creation/skills/envato-broll/` (`search-envato.js` +
  `download-envato.js`). Silent clips, strip audio with `ffmpeg -c copy -an` after download.
- **AI motion clip (this video, the blockDAG) = Higgsfield image -> Seedance 2.0**, 480p ONLY, audio stripped.
- **Real photos (portrait, family) = sourced from real sources** (Harvard / Kaspa / archives), usage-rights
  checked. The family imagery is GATED (see screenplay CH2 B3 warning box).
- Style for atmospheric b-roll: dark, cinematic, Kaspa-teal (#49e0c8) accent, abstract, NO readable text, 16:9.
- Folders: ChatGPT stills -> `assets/broll/chatgpt/`, Envato clips -> `assets/broll/envato/`, real photos ->
  `assets/img/`, the AI clip -> `assets/broll/ai/`. Render copies -> `render-assets/` per the comp.

## Coverage map (b-roll / atmosphere beats only; data-visual beats live in EDIT-PLAN-prep)

| Chapter · Beat | Cover need | Asset | Source | Status |
|---|---|---|---|---|
| CH1 B2 "His name is..." | his face | **IMG-YS** portrait | real photo (Harvard SEAS / kaspa.org) | TODO (rights check) |
| CH1 B2 "blockDAG" | blocks stacking into a DAG | **CLIP-DAG** | Higgsfield img -> Seedance 480p, silent | TODO |
| CH1 B2 montage | whitepaper flash · KAS chart · academic papers | **BR-MONT** (R-WP flash + C-RANK/chart cap + papers still/clip) | mixed | TODO |
| CH1 B3 "quiet academic" | scholarly atmosphere | **BR-SCHOLAR** | ChatGPT | **DONE** `assets/broll/chatgpt/broll-a1b2c3d4-BR-SCHOLAR.png` |
| CH2 B1 "before any of it" | origin mood (optional, bio card may cover) | **BR-ORIGIN** | ChatGPT still | BENCH |
| CH2 B3 (GREENLIT) | grandfather + father photos | **IMG-FAM** | Mike-sourced | grandfather **DONE** `assets/img/IMG-FAM-grandfather-David.jpg`; father **Haim** photo still needed |
| CH5 B2 "GHOSTDAG live" | network / explorer atmosphere | **BR-NETWORK-blocks** | Envato | **DONE** `assets/broll/envato/BR-NETWORK-blocks.mp4` (7MB, 1080p, silent; glowing connected cubes = blocks-as-nodes; also serves the CH1 blockDAG montage) |
| CH6 B4 "DAGs not his alone" | other-networks atmosphere (note-only beat) | **BR-OTHERDAGS** | ChatGPT | **DONE** `assets/broll/chatgpt/broll-b2c3d4e5-BR-OTHERDAGS.png` |
| CH7 B4 "quiet genius / asymmetry" | hopeful dawn / ahead-of-time mood | **BR-DAWN-sea** | Envato | **DONE** `assets/broll/envato/BR-DAWN-sea.mp4` (76MB, sunrise-over-sea drone, silent) |

## Real sourced imagery
- **IMG-YS** — Yonatan Sompolinsky portrait. Source candidates: Harvard SEAS people page, kaspa.org contributors,
  a conference/interview photo. Check usage rights before use. (CH1 B2; reused small wherever he is named.)
- **IMG-FAM** *(GATED)* — David Sompolinsky (Danish-resistance-era) photo + Haim Sompolinsky Brain-Prize
  headline/photo. Do NOT source until the family link clears the screenplay CH2 B3 warning gate; if it cannot be
  confirmed, this asset is CUT.

## AI motion clip
- **CLIP-DAG** — generate the block image in Higgsfield (Nano Banana 2 / Soul), animate image-to-video with
  Seedance 2.0. **480p ONLY** (Remotion upscales free); strip the baked audio (`ffmpeg -c copy -an`). Output ->
  `assets/broll/ai/`. (CH1 B2.)

## ChatGPT still batch (feed to gen-batch-freshchat.js)
All 16:9, dark cinematic, Kaspa-teal accent, NO readable text, photographic-but-abstract:
1. `BR-SCHOLAR` (CH1 B3) — a dim study at night, a chalkboard covered in faint mathematical equations, a single
   desk lamp, stacks of papers, teal rim-light, cinematic, no text.
2. `BR-OTHERDAGS` (CH6 B4) — many faint glowing network graphs scattered across the dark (the idea was "in the
   water"), abstract, teal, cinematic, no text.
3. `BR-DAWN` (CH7 B4) — a lone figure on a dark ridge facing a faint teal dawn, "early / ahead of its time,"
   epic, hopeful, cinematic, no text.
4. `BR-ORIGIN` (CH2 B1, BENCH) — a quiet pre-dawn campus / skyline, moody, teal-tinted, no text.

## Envato clip batch (feed to search-envato.js -> download-envato.js)
16:9, pick the darkest / most abstract result per term; strip audio:
1. `BR-MONT-papers` (CH1 B2) — "old academic papers pages turning dark cinematic"
2. `BR-EXPLORER` (CH5 B2) — "blockchain network nodes data flow dark teal abstract"
3. `BR-DAWN-horizon` (CH7 B4, alt to ChatGPT) — "calm sea horizon sunrise aerial cinematic"

## Download progress + curated picks (autonomous session, 2026-06-29)

**Downloaded (Envato, in `assets/broll/envato/`, 1080p, silent):**
- `BR-NETWORK-blocks.mp4` (7MB) — glowing connected cubes grid = blocks-as-nodes. Covers CH5 network + CH1 montage.
- `BR-DAWN-sea.mp4` (76MB) — sunrise over sea, drone aerial. Covers the CH7 hopeful close.

**Curated Envato picks, NOT yet downloaded (ready to pull, results in `skills/envato-broll/r_KASGENIUS_*.json`):**
- network alt: "Animated Futuristic Global Blockchain Network Loop" (teal plexus globe) — `r_KASGENIUS_network.json[4]`.
- dawn alt: "Flying Over the Sea in Sunrise" — `r_KASGENIUS_dawn.json[5]`.
- STILL NEEDED searches (run + pick + download): a "scholar / chalkboard equations" clip and an "abstract data/code
  streams" clip if the ChatGPT stills (below) don't cover CH1 B3 / the montage. (4-5 total is the budget; 2 in.)

**ChatGPT stills — DONE (3, in `assets/broll/chatgpt/`, via `repurpose/gen-batch-freshchat.js`):**
- `broll-a1b2c3d4-BR-SCHOLAR.png` — dim study, chalkboard of equations, desk lamp, papers. CH1.B3 "quiet academic" / CH1.B2 "chalkboard".
- `broll-b2c3d4e5-BR-OTHERDAGS.png` — teal/blue plexus network graphs scattered in black. CH6.B4 "DAGs are not his alone".
- `broll-c3d4e5f6-BR-ORIGIN.png` — Jerusalem pre-dawn blue hour (BENCH; CH2.B1 origin mood if used).
- (items file kept at `assets/broll/chatgpt/items.json`; re-run with the same command if more are needed.)

**Asset path note:** the slide deck now lives at `assets/deck/Kaspa-founder-deck.html`; chart stills at
`assets/charts/`. Real photos (IMG-YS, IMG-FAM) go in `assets/img/`; the Higgsfield clip in `assets/broll/ai/`.

### Session 2 (2026-06-29 cont.) — generated/captured assets

**AI video (`assets/broll/ai/`):**
- `CLIP-DAG-source.png` — Higgsfield Soul Cinematic blockDAG still. `CLIP-DAG.mp4` — Seedance 2.0 animation of it
  (5s, **480p**, silent). CH1.B2 "blockDAG". Approved-quality.

**Real portrait (`assets/img/`):**
- `IMG-YS-portrait.jpg/.webp` — the woolypooly source (branded composite). `IMG-YS-clean.png` — Nano Banana 2
  cleanup: Yonatan isolated on a neutral dark studio background, unbranded, no text. USE the clean one. CH1.B2.

**ChatGPT stills — 4 MORE (now 7 total, `assets/broll/chatgpt/`):**
- `broll-d4e5f6a7-BR-RESEARCHER-CHALK.png` (CH2.B4 student-GHOST) · `broll-e5f6a7b8-BR-JOURNALS.png` (CH2.B6/CH1 papers)
  · `broll-f6a7b8c9-BR-AHEAD-OF-CROWD.png` (CH7.B4 asymmetry) · `broll-a7b8c9d0-BR-DATA-STREAMS.png` (general tech cover).

**Talk clips + receipts (`assets/captures/`):**
- `R-TALK_KevinChen_PencilWorks_2017.mp4` (full ~64min, 360p) + `clips/R-TALK_clipA_GHOST-credit.mp4` (the GHOST
  naming, ~13:10) + `clips/R-TALK_clipB_SPECTRE-credit.mp4` (SPECTRE naming, ~28:09). CH3.B5 + CH4.B2.
- `R-ETH-whitepaper.png` — Ethereum whitepaper page (shows "Modified GHOST Implementation" in its contents = the
  GHOST receipt). NOTE: IACR eprint paper pages are Cloudflare-blocked; capture papers another way if needed (for-later).

**b-roll tally now: 7 ChatGPT stills + 2 Envato clips + 1 Seedance AI clip + the 2 talk clips.** (Doubled.)

### Session 3 (2026-06-30) — CH3-CH7 Envato cutaways + intro chain + meetup still + standalone containers

**Envato clips (6, in `render-assets/vid/`, ≤4s silent cutaways; full 2GB originals trimmed then DELETED per the
~100 MB disk cap). Search results in `skills/envato-broll/kasgenius2/*.json`, picks in `picks.txt`:**

| Ref | What it is | Placement (source) | Status |
|---|---|---|---|
| `ghost-network` | glowing blue blockchain chain | CH3 GHOST diagram cutaway ~190-194s | **DONE** |
| `spectre-web` | blue plexus network web | CH4 SPECTRE cutaway ~305-309s | **DONE** |
| `ghostdag-order` | particle mesh flowing into order | CH4 GHOSTDAG cutaway ~355-359s | **DONE** |
| `market-growth` | bitcoin coin on green market bars | CH6 market-cap cutaway ~512-516s | **DONE** |
| `horizon-close` | sunrise over mountains | CH7 close cutaway ~567-571s | **DONE** |
| `subscribe` | YouTube like + subscribe + notification buttons (on black) | **OVERLAY** (screen-blend) over the plug ~385-390s (=7:00 final) | **DONE** |

**Code-rendered / captured cover assets (`render-assets/`):**
- `img/B-CHAIN.png` — cinematic **ChatGPT-generated blockchain** (glowing amber linked cube-blocks receding into
  bokeh, bitcoin-gold, NO text), replaces the DAG-mesh at CH1 "looked at Bitcoin" (~11s). Source
  `assets/broll/chatgpt/broll-bc10cha1-BLOCKCHAIN.png` (via `gen-batch-freshchat.js`). *(First pass was a flat SVG
  chain with a misaligned ₿ + on-image text — Mike flagged it as odd; replaced 2026-06-30.)*
- `img/MEETUP-still.png` — first frame of the **2017 Kevin Chen meetup** (grabbed from `clipA` @2s, NOT the source
  video's MACROSCAPE title card), shown after "watch this" (~229s), previewing the clip that then plays.

**Standalone CSS containers (NOT deck-crops) — `assets/deck/containers.html` -> `render-assets/deck/c-*.png`:**
`c-bio`, `c-path`, `c-acronym`, `c-launch`, `c-lineage`, `c-citedgap`, `c-coauthors`, `c-verdict`, `c-close`,
`c-uncle` (uncle-reward, replaces the repeated GHOST diagram at 3:39). Built to the look in
`skills/container-reference/` — one self-contained container per beat, never a cropped multi-card slide.

**Source-rule note (2026-06-30):** Envato stock originals now come as huge 4K files (~2 GB) and some as `.zip`
bundles. **Trim to the ≤4s cutaway you need, then DELETE the original immediately** (disk hit 2 GB free during
this pull). Downloaded to `assets/broll/envato2/` (now emptied), trimmed into `render-assets/vid/`.

**b-roll tally now: 7 ChatGPT stills + 8 Envato clips + 1 Seedance AI clip + 2 talk clips + B-CHAIN + MEETUP-still.**

## Open / next (keep ADDING b-roll here)
- This is the living b-roll list. As we find new cover beats or better shots, add rows above and prompts/searches
  below. Reconcile to `EDIT-PLAN-prep.md` (every COVER beat has a named asset, zero orphans) before the render.
- Budget per the track: ~5 Envato clips + ~5 ChatGPT stills for a longform (don't carpet the timeline); the data
  visuals are the dominant cover layer, b-roll is ≤4s punctuation.
- Trim / REJECT / swap any pick during the EDIT-PLAN pass.
