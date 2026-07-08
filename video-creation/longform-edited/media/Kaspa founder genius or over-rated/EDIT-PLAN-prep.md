# Kaspa Founder: Genius or Over-Rated? — EDIT-PLAN-prep  (pre-record planning manifest)

> 📐 FORMAT: this is the **prep file** (beat-indexed tables) per `skills/edit-plan-and-cue-sheet.md` §0.
> Post-record it is SUPERSEDED by the GENERATED event-log `EDIT-PLAN.md` + the layer-grouped `CUE-SHEET.md`
> (this prep file is preserved, not overwritten).

> ⛔ STATUS: PRE-RECORD skeleton, NOT yet the render gate. Before ANY Remotion render it must be reconciled
> to the **recorded + desilenced VO transcript** (Phase-2 word-timings): build to the TRANSCRIPT not the
> screenplay, OMIT beats Mike did not say, fill real `cutFrame`s, re-verify zero orphans. Then it is the gate
> (longform-edited PRE-RENDER GATE #6). Goal: every asset already exists, so the edit is fill-in-the-timings,
> not discover-what-is-missing.

## Layer model
- **L0 VO spine** — recorded master, defumbled then desilenced (canonical skills). Spine architecture (strip
  vs full-screen gated face) TBD at record; default to gated full-screen face (silverscript model) unless a
  clean webcam strip exists.
- **L1 FACE/COVER** — gated face, OFF by default; FACE = punctuation lines only (one sentence). Tags come
  straight from the screenplay's `👤 [FACE]` / `🗣️ [COVER]` lines.
- **L2 data visuals** — the 3 system-design DIAGRAMS + 2 data CHARTS (C-RANK, C-MCAP, per `skills/charts.md`)
  + the code-rendered CONTAINERS + RECEIPTS; spotlight one-at-a-time, FILL THE FRAME (house rule #1).
  Code-rendered HTML/SVG, text-accurate (Convention 4); chart numbers `[VERIFY]` at render, never image-model sourced.
- **L3 b-roll** — sourced stills/clips + the one AI clip (CLIP-DAG: Higgsfield image -> Seedance 2.0, 480p,
  audio stripped). Sparse punctuation, 1-4s. **Acquisition detail (prompts / Envato searches / status) lives in
  `BROLL-PLAN.md`**; this doc only PLACES the b-roll, the BROLL-PLAN is where we keep adding it.
- **L4 transitions** — per the 3-bucket policy (`../../assets/transitions/README.md`): chapter title cards =
  **ONE pick for the whole video (TBD)**; AI/atmosphere stills + the blockDAG clip = glitch (Bad Signal,
  `TransitionClip`); b-roll video = fade/dissolve; FACE cuts = film burn or Blocks glitch (kit TBD) +~20% punch
  on >2s beats; container/diagram changes = cross-fade + scale-in (hand-rolled on the spine).
- **L5 captions** — **ON for this video (Mike, 2026-06-30): montserrat 1/2, on EVERY FACE moment regardless of
  length (override of the usual >5s gate), EXCEPT the plug. FACE scenes ONLY — NO intro-montage-over-b-roll.** Build via
  `build_captions.py --style montserrat --max-words 1 --max-short 2`, gate to the face windows, heavy CORRECTIONS
  dict (Whisper mangles Kaspa/Sompolinsky/SPECTRE/GHOSTDAG/DAGKnight/Lewenberg). Exact windows in `CUE-SHEET.md`.
- **L6 music + SFX** — beds DONE (CH1 Revenant · CH2-CH3 Press Play · CH4-CH7 I Will Deliver; codes in the
  screenplay Music plan). SFX: hype-reel hard-cut impacts (CH1 B2), chapter-transition impacts, reveal impacts
  on diagram payoffs; risers into big reveals. Pull at EDIT-PLAN time from `assets/sfx/`.

## Visual id legend
`R-*` = receipt (screen-cap) · `IMG-*` = sourced still · `CLIP-*` = AI clip · `BR-*` = stock/atmosphere b-roll ·
`C-*` = code-rendered container · `D-*` = Convention-4 system-design DIAGRAM · `LT-*` = lower-third.

---

## Per-beat map (beat-ordered; `cutFrame` = TBD from transcript)

### CH1 The man in the whitepaper  (title card OFF · music: Revenant)
| Beat | Face? | Visual | Transition in |
|---|---|---|---|
| B1 "name in the Ethereum whitepaper nobody can pronounce" (LOCKED) | FACE | R-WP whitepaper scroll, highlight GHOST citation | none (start) |
| B2 "His name is Yonatan Sompolinsky" | COVER | IMG-YS portrait | cut + impact |
| B2 "math cited in the Ethereum whitepaper" | COVER | R-WP flash + **C-RANK chart** (ETH #2, GHOST-citation callout; holds a beat) | cut + impact |
| B2 "looked at Bitcoin, too slow, proved it on paper" | COVER | BR-MONT | cut + impact |
| B2 "turned the blockchain into a blockDAG" | COVER | CLIP-DAG (Higgsfield->Seedance, 480p, silent) | cut + impact |
| B2 "idea off a chalkboard, launched, no premine" | COVER | BR-MONT (chart + papers) | cut + impact |
| B3 "not a CEO, not an influencer" | FACE | Mike | film burn / glitch |
| B3 "quiet academic who rewrote how blockchains agree" | COVER | BR atmosphere | fade |
| B4 "half of crypto calls him a generational genius" | FACE | Mike | (back to face) |
| B4 "the other half: over-rated, a messiah" | COVER | C-SPLIT (GENIUS \| OVER-RATED) | cross-fade |
| B5 "we put the receipts on the table" | COVER | montage of upcoming receipts | cross-fade |
| B5 "at the end I tell you where I land" | FACE | Mike | (back to face) |

### CH2 Who is Yonatan Sompolinsky  (title card ON "Who Is He, Actually" · music: Press Play)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| B1 "where does this guy even come from?" | FACE | Mike | chapter card (pick TBD) |
| B1 "before the whitepapers, before Kaspa" | COVER | BR atmosphere | fade |
| B2 "born and raised in Israel" | COVER | C-BIO bio-card (infobox) | cross-fade |
| B3 "grandfather David, Danish-resistance hero" | COVER | **IMG-FAM** period photos | cross-fade |
| B3 "father Haim, won the field's biggest prize" | COVER | **IMG-FAM** Brain Prize headline | (hold) |
| B3 "comes from a family that did big serious things" | COVER | **IMG-FAM** | (hold) |
| B4 "Hebrew University, CS + math" | COVER | C-BIO2 (bio-card update) | (hold/update) |
| B4 "still a student in 2013 when he published GHOST" | COVER | R-WP2 / GHOST paper flash | cross-fade |
| B5 "opposite of a crypto founder" | FACE | Mike | film burn / glitch |
| B5 "PhD ~2018, Harvard postdoc, the lab that became Kaspa" | COVER | C-TIMELINE strip | cross-fade |
| B6 "the people who did the research the space quotes" | COVER | R-PAPERS title cards | cross-fade |
| B7 "a strange kind of over-rated" (payoff) | FACE | Mike | (back to face) |

> ⛔ **B3 is GATED.** IMG-FAM (and the whole family beat) do NOT get sourced/placed until the Yonatan/Haim/David
> link clears the `[!WARNING]` gate in the screenplay. If it cannot be confirmed, DROP B3 and its assets.

### CH3 GHOST (2013)  (title card OFF, continues Press Play · music: Press Play)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| B1 "here is the first receipt / the 2013 paper" | FACE->COVER | Mike -> paper title | flow-in (no card, bed continues) |
| B2 "GHOST = Greedy Heaviest Observed Sub-Tree" | COVER | **D-GHOST** block tree (main white / orphans amber) | cross-fade |
| B3 "count the orphaned blocks, heaviest sub-tree" | COVER | **D-GHOST** animates (amber counted) | (spotlight) |
| B4 "Ethereum cites it; simplified uncle reward shipped" | COVER | R-WP2 whitepaper citation | cross-fade |
| B5 "2017 Brooklyn, IOTA guy explains it on stage" (PLAY A PORTION) | COVER | R-TALK clip — play a portion, **his audio UP** (VO pauses, music ducks), then duck under + resume; + LT-CHEN lower-third | glitch/cut |

### CH4 SPECTRE -> PHANTOM / GHOSTDAG  (title card ON "From Chain to BlockDAG" · music: I Will Deliver)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| B1 "GHOST only patched the tree; throw the chain out" | FACE->COVER | Mike -> into container | chapter card |
| B2 "Meet SPECTRE (you just heard the name)" | COVER | LT-SPECTRE + callback flash R-TALK | cross-fade |
| B3 "the acronym, then forget it" | COVER | C-ACRONYM (expand, dim jargon) | cross-fade |
| B4 "a cryptocurrency with no blockchain at all" | COVER | **D-SPECTRE** chain morphs into web | cross-fade |
| B5 "parallel blocks, multiple parents = the DAG" | COVER | **D-SPECTRE** fan-out + parent arrows | (spotlight) |
| B6 "blocks vote, recursive elections" | COVER | **D-SPECTRE** vote arrows | (spotlight) |
| B7 "fast head-to-head, but no full lineup" | COVER | **D-SPECTRE** two-blocks "?" | (spotlight) |
| B8 "GHOSTDAG keeps all, orders all (Kaspa runs this)" | COVER | **D-GHOSTDAG** honest cluster / attacker out / ordered line | cross-fade |
| B9 "keep them all and still agree on order" (payoff) | COVER->FACE | D-GHOSTDAG hold -> Mike | (back to face) |

### MID Mid-roll plug  (title card OFF · music: I Will Deliver · keep conversational, no impact/cube)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| whole plug (CryptoRich) | FACE <50% (rest COVERED) | **CryptoRich website screenshots over >50% of the plug** (cryptorich.vip showcase/calls) + lower-third link; **NO captions on the plug** | plain (no glitch/cube) |

### CH5 He shipped it: Kaspa (2021)  (title card OFF, continues I Will Deliver · music: I Will Deliver)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| B1 "papers are cheap, he shipped" | FACE | Mike | flow-in (no card, bed continues) |
| B2 "GHOSTDAG live in 2021; no premine/ICO/presale" | COVER | BR-EXPLORER + C-LAUNCH terms card | cross-fade |
| B3 "the fair launch is the flex" | COVER | C-LAUNCH (hold) | (spotlight) |
| B4 "DAGKnight next, with Michael Sutton" | COVER | C-LINEAGE (GHOST->...->DAGKnight) | cross-fade |
| B5 "not a man resting on one 2013 citation" (payoff) | FACE | Mike | (back to face) |

### CH6 The case for OVER-RATED (steelman)  (title card OFF, continues I Will Deliver · music: I Will Deliver)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| B1 "be honest, here is the other side" | FACE | Mike | flow-in (no card, bed continues) |
| B2 "Count 1: citations are not adoption" | COVER | C-CITEDGAP (CITED vs DEPENDED ON) | cross-fade |
| B3 "Count 2: a team, not a messiah" | COVER | C-COAUTHORS list | cross-fade |
| B4 "Count 3: DAGs are not his alone" | COVER | held container / light b-roll (note only) | fade |
| B5 "Count 4: the market is the cold judge" | COVER | **C-MCAP chart** (Kaspa small vs larger networks) | cross-fade |
| B6 "some of that is fair" (honest concession) | FACE | Mike | (back to face) |

### CH7 The verdict  (title card OFF · music: I Will Deliver, through the close)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| B1 "concede the cult framing cleanly" | COVER | held container | cross-fade |
| B2 "but look at what is still standing" | COVER | C-STACK (receipts restack one by one, incl. C-RANK from CH1) | cross-fade |
| B3 "over-rated men have one good year" | COVER | C-STACK (hold) | (spotlight) |
| B3 "a decade of work others keep building on" | FACE | Mike | (back to face) |
| B4 "that is not over-rated" | FACE | Mike | (hold) |
| B4 "a quiet genius the timeline ignored / asymmetry" | COVER | C-STACK / KAS atmosphere | cross-fade |
| B5 "tell me in the comments + CTA close" | FACE | Mike + CTA lower-third | (back to face) |
| close | — | C-ENDCARD (OPTIONAL brand/end card) | fade out |

---

## Zero-orphans check (every asset placed)
- **Diagrams (3):** D-GHOST ✓ (CH3 B2-B3) · D-SPECTRE ✓ (CH4 B4-B7) · D-GHOSTDAG ✓ (CH4 B8-B9).
- **Data charts (2, per `skills/charts.md`, build mode = code-animated, values `[VERIFY]` at render):**
  C-RANK ✓ (CH1 B2, ETH #2 + GHOST-citation callout; reused in CH7 C-STACK) · C-MCAP ✓ (CH6 B5, Kaspa small vs
  larger networks). The two are the genius/over-rated bookend.
- **Containers:** C-SPLIT ✓ (CH1 B4) · C-BIO/C-BIO2 ✓ (CH2 B2/B4) · C-TIMELINE ✓ (CH2 B5) · C-ACRONYM ✓ (CH4 B3)
  · C-LAUNCH ✓ (CH5 B2-B3) · C-LINEAGE ✓ (CH5 B4) · C-CITEDGAP ✓ (CH6 B2) · C-COAUTHORS ✓ (CH6 B3) ·
  C-STACK ✓ (CH7 B2-B4) · C-ENDCARD = OPTIONAL (CH7 close).
- **Receipts:** R-WP ✓ (CH1 B1-B2) · R-WP2 ✓ (CH2 B4 / CH3 B4) · R-TALK ✓ (CH3 B5, callback CH4 B2) ·
  R-PAPERS ✓ (CH2 B6). Lower-thirds: LT-CHEN ✓ · LT-SPECTRE ✓.
- **Images:** IMG-YS ✓ (CH1 B2) · **IMG-FAM = GATED** (CH2 B3, do not source until family link confirmed).
- **AI clip:** CLIP-DAG ✓ (CH1 B2). **B-roll:** BR-MONT ✓ (CH1 B2) · BR-EXPLORER ✓ (CH5 B2) + atmosphere fills.
- **Music (DONE):** Revenant / Press Play / I Will Deliver placed per chapter.
- ⚠ At reconcile: confirm CH6 B4 gets a held container or light b-roll (still a note-only beat; B5 now has C-MCAP), pick
  the ONE chapter transition, decide FACE-cut kit (film burn vs Blocks glitch), and drop any beat Mike did not record.

## Still needed before this becomes the render gate
1. **Decisions:** family-link gate (CH2 B3), CH4 split (Open items #7), chapter-transition pick, FACE-cut kit,
   captions on/off for the hook.
2. **Build the assets** (BROLL-PLAN list above is folded in here): 3 diagrams, ~10 containers, receipts,
   IMG-YS, CLIP-DAG, b-roll. IMG-FAM stays GATED.
3. **Record VO -> defumble -> desilence** (Phase 1-2).
4. **Reconcile this skeleton to the transcript** (real frames, omit unsaid beats, zero orphans), then GENERATE
   the event-log `EDIT-PLAN.md` + hand-author `CUE-SHEET.md`. Then render (gate #1-7).
