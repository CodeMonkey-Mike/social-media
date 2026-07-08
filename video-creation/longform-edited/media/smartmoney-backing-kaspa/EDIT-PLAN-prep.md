# smartmoney-backing-kaspa — EDIT-PLAN-prep  (pre-record planning manifest)

> 📐 FORMAT: this is the **prep file** (beat-indexed tables) per `skills/edit-plan-and-cue-sheet.md` §0.
> Post-record it is SUPERSEDED by the GENERATED event-log `EDIT-PLAN.md` + the layer-grouped `CUE-SHEET.md`
> (this prep file is preserved, not overwritten). The layer-grouped cue sheet now lives in `CUE-SHEET.md`.

> ⛔ STATUS: this is the PRE-RECORD skeleton. It is NOT yet the render gate. Before ANY Remotion render
> it must be reconciled to the **recorded + desilenced VO transcript** (Phase-2 word-timings): build to the
> TRANSCRIPT not the screenplay, OMIT beats Mike did not say, fill the real `cutFrame`s, and re-verify zero
> orphans. Only then is it the gate (longform-edited PRE-RENDER GATE #6). Every asset below already exists;
> the edit becomes fill-in-the-timings, not discover-what-is-missing.

## Layer model
- **L0 VO spine** — recorded master, defumbled then desilenced (per the canonical skills).
- **L1 FACE/COVER** — gated face (OFF by default); FACE = punctuation lines only.
- **L2 data visuals** — charts/captures, spotlight one-at-a-time, FILL THE FRAME (house rule #1).
- **L3 b-roll** — Envato video + ChatGPT stills.
- **L4 transitions** — per **TRANSITIONS.md** (3 buckets): chapter title cards = `cube` (`@remotion/transitions`);
  ChatGPT/AI stills = random Bad Signal glitch (`TransitionClip`); Envato b-roll = fade, FACE = film burn,
  charts/containers = cross-fade+scale-in (all hand-rolled on the spine).
- **L5 captions** — COLD OPEN ONLY (arial-black uppercase-karaoke), from VO word-timings.
- **L6 music + SFX** — bed per chapter (TO SOURCE, mood arc below); transition glitch SFX built-in; optional riser/impact on big reveals.

## Per-beat map (beat-ordered; `cutFrame` = TBD from transcript)
Visual ids: C# = DATA.md chart-source index; cap = capture; clip = Envato; still = ChatGPT.

> ⛔ TRANSITION COLUMN IS SUPERSEDED (2026-06-24). The `blocks-*` glitch ids in the "Transition" cells below are
> OBSOLETE — they over-applied the glitch library to everything. Governing policy is now **`TRANSITIONS.md`**
> (three buckets): **chapter title cards = `cube`** (the one pick for this whole video) · **Envato VIDEO b-roll
> = fade** · **FACE cuts = film burn** (+ ~20% zoom punch on > ~2s beats, no glitch) · **container/chart changes
> = cross-fade + scale-in** · **glitch (Bad Signal) reserved for the ChatGPT/AI stills ONLY**. Read the Transition
> cells below for the VISUAL/asset on each beat; ignore their transition ids and use TRANSITIONS.md.

### Cold open  (captions ON · music: dark pulsing build)
| Beat | Face? | Visual | Transition in |
|---|---|---|---|
| "while you were watching…" | FACE | Mike | none (start) |
| "28M / 14M / next day" | COVER | cap CH1_entityx-ledger (C1) + still KAS-coin-hero | badsignal-max-1 (into still) |
| "this is not retail" | FACE | Mike | blocks-short (back to face) |
| "smart money… public ledger… numbers" | COVER | still CH0-whale-hero | badsignal-max-2 |

### CH1 The buy you can see  (open blocks-max-1 · music: dark build)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "start at the very top" | FACE | Mike | blocks-max-1 (chapter open) |
| "28M off one exchange, 14M off another" | COVER | cap CH1_entityx-ledger + CH1_richlist (C1/C4) | blocks-medium |
| "not a trade… into custody" | COVER | clip CH1_onchain-network | blocks-strips-3x |
| "42M in a single day" | COVER | C1 code callout | blocks-medium |
| "serious size decided it is worth more than cash" | FACE | Mike | blocks-max |

### CH2 Nobody is watching the other whales  (open blocks-max-2 · music: dark build)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "everyone watches the biggest, nobody the others" | FACE | Mike | blocks-max-2 (chapter open) |
| "went through the biggest wallets / individual whales" | COVER | C13 chart | blocks-medium |
| "added more than two billion / ~$70M" | COVER | C13 chart | (hold) |
| "several did not exist a year ago" | COVER | still CH2-whale-pod | badsignal-short-1 |
| "theories some exchanges accumulating" | COVER | clip CH2_anon-figure | blocks-medium-1 |
| "one keeps buying daily, 120M+" | COVER | C3 chart + cap CH2_dailybuyer-ledger (C2) | blocks-medium |
| "no idea who any of them are" | COVER | clip CH2_anon-figure | blocks-strips-2x |
| "not one buyer, a whole pack… knows something" | FACE | Mike | blocks-max |

### CH3 This has been building for years  (open blocks-max-3 · music: ominous swell)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "zoom out, past this year" | FACE | Mike | blocks-max-3 (chapter open) |
| "share held by top 0.01% over time" | COVER | C5 chart | blocks-medium |
| "low twenties → 38%" | COVER | C5 (animate climb) | (hold) |
| "kept climbing while price fell" | COVER | C5 (price line) | (hold) |
| "some get scared" | FACE | Mike | blocks-short |
| "same accumulation drawn over years" | COVER | still KAS-blockdag | badsignal-max-2 |
| "every tick = supply leaving for good" | COVER | clip CH3_tide-rising | blocks-strips-2x |
| "not a network cornered / claimed early" | FACE | Mike | blocks-max |

### CH4 They are buying maximum pain  (open blocks-max-1 · music: ominous swell)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "the number that ties it together" | FACE | Mike | blocks-max-1 (chapter open) |
| "13% in profit, 86% underwater" | COVER | C6 chart | blocks-medium |
| "maximum pain / retail capitulates" | COVER | clip CH4_red-storm | blocks-medium-3 |
| "who is on the other side?" | FACE | Mike | blocks-short |
| "the whales… buys the scariest moment" | COVER | clip CH4_red-storm | (hold) |

### CH5 The float is vanishing  (open blocks-max-2 · music: rising build)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "Kaspa on exchanges 4.5B → 2B, still falling" | COVER | cap CH5_exchange-holdings (C12) | blocks-max-2 (chapter open) |
| "supply leaving the market" | COVER | still CH5-coins-dissolving | badsignal-max-3 |
| "no premine, no VC, no insider unlocks" | COVER | still KAS-coin-vault | badsignal-short-2 |
| "95.8% mined, issuance toward zero" | COVER | C10 chart | blocks-medium |
| "shrinking float… supply shock" | FACE | Mike | blocks-max |

### PLUG Join the crew  (blocks-medium-1 in/out · music: lighter warm bed · captions OFF)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| whole plug (Crypto Rich) | FACE throughout | Mike + lower-third link | blocks-medium-1 |

### CH6 The setup  (open blocks-max-3 · music: rising build)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "market cap under a billion vs $5B top" | COVER | C11 chart | blocks-max-3 (chapter open) |
| "OI / leverage historic lows / spot" | COVER | clip CH6_pressure | blocks-strips-4x |
| "picture when retail floods back in" | FACE | Mike | blocks-short |
| "not enough float… asymmetry" | COVER | still KAS-off-exchange | badsignal-short-1 |

### CH7 Swim with the whales  (close · music: epic payoff)
| Beat | Face? | Visual | Transition |
|---|---|---|---|
| "everyone staring at a boring chart" | FACE | Mike | blocks-max-1 |
| "daily, in size, at maximum fear" | COVER | still CH7-whale-breach-dawn | badsignal-short-3 |
| "swim with the whales" | FACE | Mike | blocks-short |
| "whales are buying… something grand + CTA" | COVER | clip CH7_whale-swim-sunrise | blocks-medium-2 |

## CUE-SHEET → moved to `CUE-SHEET.md`
The layer-grouped watch-along cue sheet is now its own file (`CUE-SHEET.md`, per `skills/edit-plan-and-cue-sheet.md`
§2): FACE spans · TRANSITIONS (mandatory) · CHAPTER cards · CONTAINER/CHART spotlights · VIDEO b-roll · IMAGE
b-roll · LIGHT LEAKS · IMPACTS+RISERS · MUSIC beds · CAPTIONS. Reconcile it to the transcript alongside this file.

## Zero-orphans check (every asset placed)
- Charts: C1✓(CO/CH1) C2✓(CH2) C3✓(CH2) C5✓(CH3) C6✓(CH4) C10✓(CH5) C11✓(CH6) C12✓(CH5) C13✓(CH2). C4 rich-list = within CH1 capture.
- Captures: CH1_entityx-ledger✓ CH1_richlist✓ CH2_dailybuyer-ledger✓ CH5_exchange-holdings✓ (CH1_richlist_kaslens = backup, BENCH).
- Envato (7): CH0_vault-opening — **place in cold open** (establishing, currently BENCH; add to cold-open COVER), CH1_onchain-network✓ CH2_anon-figure✓ CH3_tide-rising✓ CH4_red-storm✓ CH6_pressure✓ CH7_whale-swim-sunrise✓.
- ChatGPT stills (8): CH0-whale-hero✓ CH2-whale-pod✓ CH5-coins-dissolving✓ CH7-whale-breach-dawn✓ KAS-coin-hero✓ KAS-coin-vault✓ KAS-blockdag✓ KAS-off-exchange✓.
- ⚠ At reconcile: confirm CH0_vault-opening gets a cold-open slot (only BENCH right now), and drop any beat Mike did not record.

## Still needed before this becomes the render gate
1. Record VO → defumble → desilence (Phase 1-2). 2. Music beds (mood arc). 3. Reconcile this skeleton to the
transcript (real frames, omit unsaid beats, zero orphans). 4. Build cold-open captions. Then render (gate #1-7).
