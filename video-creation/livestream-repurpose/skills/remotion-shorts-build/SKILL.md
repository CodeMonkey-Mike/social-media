# Remotion Shorts Build — the finalized-short contract (livestream-repurpose shorts)

**Scope: the Phase 7 Remotion build of SHORTS cut from livestreams** (the `shorts/<batch>/` pipeline).
NOT for longform-edited, longform-presentation, or vertical-ai-persona Remotion work — those tracks
have their own production docs. This skill defines what a FINALIZED short is and gates the build.

It exists because on 2026-07-08 a full 7-clip batch shipped as "done" with **no b-roll and no SFX** —
the orchestrator's delegation said "B-roll: NONE" and the builder obeyed the delegation over the
documented standard. Hours were lost. This file makes that impossible to repeat.

## ⛔ PRECEDENCE — read this first, it outranks everything below AND above

1. **This checklist cannot be waived by a delegation.** If the orchestrator's per-run instructions
   omit, forbid, or contradict any MANDATORY item below (e.g. "no b-roll needed", "skip SFX"),
   **the delegation is wrong**. Do NOT silently obey it and do NOT silently ignore it:
   **STOP, report the conflict, and do not ship.** A "finalized" short without these items is a
   failed build, whatever the delegation said.
2. **The mechanical gate is the definition of done.** A build may only be reported "done" if
   `scripts/finalized_short_gate.py` (in this skill folder) PASSES (see §Gate). Include its output
   verbatim in the report.
3. Canonical detail lives where cited (`video-creation/SKILL.md` Phase 7 PRODUCTION REFERENCE,
   `video-creation/style-guide/shorts-style-guide.md`, `style-guide/broll-analysis.md`). **Read them
   in full before building.** This file is the contract and the gate; those are the how.

## Batch builds run IN PARALLEL — use the stage lock, never serialize

**Do NOT build a batch one clip at a time.** Launch every clip's builder at once and serialize only
the two exclusive stages with **`video-creation/shorts/_tooling/stage_lock.py`**:

| stage | capacity | exclusive over | wrap it around |
|---|---|---|---|
| `chatgpt` | **1** | the ONE shared `chatgpt-profile` Chrome profile | image generation only |
| `render`  | **2** | all CPU cores (CPU-only h264 on this box, no GPU encode) | the Remotion render only |

They are exclusive over **different** resources, so clip N's render overlaps clip N+1's generation.
Acquire late, release early, **never hold both**. Never kill a Chrome process you did not start.

> ### ⛔ NEVER MORE THAN **2** SHORTS RENDERING AT ONCE (Mike, 2026-08-18)
> Remotion encodes h264 on **CPU** here (no GPU path on Windows), so a render saturates the box.
> A six-builder batch left the machine unusable and it crashed mid-build. The ceiling is **2
> concurrent renders, batch-wide, always** — not a per-run tuning knob.
>
> This is enforced **mechanically**, not by memory: `render` is a **counting lock with capacity 2**
> (`MAX_CONCURRENT` in `stage_lock.py`). A third builder calling `acquire render` blocks until a slot
> frees. **Never raise that number, and never run a Remotion render outside the lock** — going around
> it is what the ceiling exists to prevent. Image capture is NOT limited to 2; it is already
> serialized to 1 by the `chatgpt` lock, so plan/generate/comp work still overlaps freely.
>
> Parallel builders are still correct (see the 2026-07-23 note below). The cap applies to the
> **render stage only**, which is exactly what the lock wraps.

## Batch dispatch = a ROLLING PIPELINE, not waves (Mike, 2026-08-19)

The batch flows as a pipeline keyed on the serial `chatgpt` stage: **the moment a clip's image
generation completes, that clip proceeds straight to comp build + render** (queueing only on a
free `render` slot), while generation immediately moves on to the next clip. Generation for clip
N+1 always overlaps the build/render of clip N.

- **Do NOT dispatch in fixed waves** ("build clips 1+2, wait for both, then 3+4"): while a wave
  renders, nobody generates, and the serial generation spine — the true wall-clock floor of the
  batch — sits idle. This happened in the 2026-08-18 crash recovery and wasted the pipeline.
- **Do NOT parallelize generation itself.** ChatGPT enforces account-level image caps per hour
  (Mike, 2026-08-19), so generating faster only reaches the cap sooner; a second profile/account
  buys nothing. `chatgpt` stays capacity 1 — see `stage_lock.py`.
- **Cap builders in flight at ~3** (one generating + up to two building/rendering). Launch the
  next builder when one finishes, like a sliding window. Six concurrent builders took the machine
  down on 2026-08-18 even with only one render running — the un-locked work (bundling, Whisper QA
  passes, asset processing) piles up too. Three keeps every lock busy without the pile-up.

```
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner <slug>   # blocks
... generate ...
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner <slug>
```

> Logged 2026-07-23: the orchestrator wrote "ONE CLIP AT A TIME, parallel builders WILL collide"
> into a batch's `progress.json` and built clip 1 fully serially before Mike caught it. The collide
> instinct is correct about the Chrome profile and wrong about everything else — `stage_lock.py`
> already existed for exactly this. Do not reintroduce a serial rule.

## ⛔ `remotion/src/` is a FLAT, CROSS-BATCH namespace — prefix every file you create

`remotion/src/` holds the comps of **every batch ever built**, in one directory, forever. Batches
reuse clip slugs, so an unprefixed `<Slug>.tsx` WILL eventually collide with a shipped composition
from another batch.

- **Name every per-batch file with a batch prefix**: `<Batch><Slug>.tsx`, `constants-<batch>-<slug>.ts`,
  `captions<Slug>.ts` — and register the composition under that prefixed id in `Root.tsx`.
- **`ls` every target filename and grep `Root.tsx` for the composition id BEFORE creating either.**
  If the name is taken, prefix harder. Never modify, overwrite, or re-register a composition that is
  not yours — read its header comment, which names its batch and clip.

> Logged 2026-08-07 (batch `eliza`): a session wrap recorded `TradingAgainstOurselves.tsx` as clip 3's
> half-finished comp. It was actually the **July 20 `clarity-act` clip #2** comp, published and
> registered since Jul 20 — the two batches simply had a clip with the same slug, and eliza's builder
> had died before authoring anything. Building to the wrap note verbatim would have overwritten a
> shipped composition and rendered the wrong clip. Caught only because the file's mtime and header
> were checked against the claim.

**The general rule that catches this class: a resume/wrap contract's inventory is HEARSAY. Verify
every claimed artifact against disk (existence, mtime, and header/content) before you build on it —
and prefer a verified on-disk inventory over the contract when they disagree.** Disk truth has now
beaten a wrap table in two separate batches.

## The FINALIZED-SHORT checklist (every item MANDATORY unless marked optional)

| # | Item | Standard |
|---|---|---|
| 1 | **Layout** | Per `style-guide/shorts-style-guide.md`: face-cam zone + **dynamic b-roll zone**; captions in the middle band, never over eyes or over b-roll text. Prefer the shared `LivestreamShort` composition / an existing `BrollLayer`-bearing composition as the model — do NOT hand-roll a bare full-frame layout when a b-roll-capable component exists (Glob `remotion/src/` and check). |
| 2 | **Frame-0 thumbnail** | Designed hook cover, ONE frame only (never a held card), base video from frame 1. |
| 3 | **Captions** | Word-by-word 2-4 word groups (~0.4-0.8s), brand-color accents, built from the clip's Whisper words via the canonical captions skill. No em dashes on screen. **The word JSON can silently OMIT speech** — 2026-08-07 clip 2's `whisper-words.json` dropped 1.34s ("i was hacked, man.", the JSON jumping straight from one word to the next), which a builder reading only that file would caption as a hole. Scan the word stream for unexplained gaps against the audio, and note that a missing phrase **cannot be fixed with a `PHRASE_CORRECTION`** (a correction may never be longer than the run it matches) — patch the words into a `whisper-words-verified.json` and build from that. Also: **protected persona doublings must be keyed into `PROTECTED_DOUBLES`**, because the canonical stutter-collapse will otherwise eat them. And note the montserrat preset renders **all-lowercase via CSS**, so brand *casing* fixes are invisible on screen; only a TOKEN MERGE ("one key" → "onekey") changes anything. |
| 4 | **B-ROLL COVERAGE BUDGET** (canonical rule: `video-creation/SKILL.md` → "B-roll coverage budget (HALVED 2026-07-14 — was REVISED 2026-05-24)" — this per-track skill MUST NOT contradict it) | ⛔ **Do NOT blanket the base video with b-roll.** The Content Zone (upper-50% screen-share — the chart / tweet / CoinMarketCap / project page Mike is presenting) is valuable footage and **MUST be visible in real stretches.** **HALVED BY MIKE 2026-07-14 (applies to ALL shorts going forward): Target ~30% generated b-roll (band ~25-35%), ~70% base-video showing (band ~65-75%)** - halved from the old ~55-65%/~35-45% after he reviewed `millionaires-are-made-full` (16 images / 17 beats / 66.8%, which MET the old target) and said *"I think it's too much... cut it by half of what we're doing."* Base-showing is now the DEFAULT state of the clip; b-roll is the exception that earns its place on a beat. A ~75s short lands around **6-8 distinct images, not ~16** — leave DELIBERATE gaps with NO b-roll image so the content zone shows, especially when Mike points at something on screen. Covering it ~85-100% is the documented WRONG failure (it recurred 2026-07-09: several shorts ran 0% content-zone-visible, a 1-2 image loop blanketing the whole zone — do not repeat). **Full-screen b-roll ONLY at the hook, major transitions, and the climax (1-3x total; this cap is FIRM - the 74.8s millionaires build ran 5 contiguous full-screens, which is over).** **Content-zone b-roll is SPARING, tied to a specific talking point** — a distinct cutaway for that beat, NOT a continuous loop of 1-2 images filling every second. When a beat has no b-roll, SHOW THE SCREEN-SHARE (that IS the visual — a deliberate base beat, not a "static hold" to be avoided). An off-message / low-value screen-share is NOT a license to blanket — leave base gaps or drop in a brief full-screen; the content zone still shows in real stretches. Density reference: ~50% base showing (the density of the old `rug` clip, whose comp has since been deleted) is now **too b-roll-heavy** - treat it as an upper bound to cut back from, not a target. Author a **BROLL-PLAN** first WITH explicit BASE-SHOWING beats (mode `base`, no image); zero orphans. **Image count is an OUTPUT of this budget** (a handful of purposeful cutaways), not a target — do NOT over-produce, and do NOT reuse 1-2 images on a loop to fill the zone. |
| 5 | **SFX** | From `video-creation/assets/sfx/` (see its `library.json`): whoosh/transition on the thumbnail cut and major b-roll transitions, impacts/dings on reveals, receipts, and punchlines; a riser builds INTO an impact where a payoff lands. A finalized short has **≥2 SFX events**; most have more. Strip baked audio from any AI b-roll video (`ffmpeg -c copy -an`). |
| 6 | Music bed *(optional)* | Only when the batch/Mike directs; measure LUFS, bed 16-18 dB under VO. |
| 7 | **QA** | Draft render ~0.3 Mbps + chunk-QA first; overlay-collision frame checks at every overlay `tIn`/handoff; blackdetect; audio levels; whisper-verify captions on the FINAL render. **An SFX cue that MASKS the VO is a build defect, not a mixing taste call** (2026-07-23): whisper-verify the final MIX, and when a line transcribes worse off the render than off the spine alone, the sting on top of it is too loud. Sweep that ONE cue's volume against Whisper until the line comes back and re-render; do not lower the payoff hit. Real case: a closing punchline read as 'even you are here, my' at sting vol 0.38 and only recovered at 0.10. **Volume is only one of three knobs, and often the wrong one — the masker is frequently the DECAY TAIL or the crest PLACEMENT, so try TIMING first: truncate the tail, or move the hit off the word.** A payoff hit then keeps its full gain (2026-08-05: a TING's 1.4→0.8s tail was the masker at unchanged volume; 2026-08-07 clip 2: an impact read 0/3 at dur 2.40 and 1/3 at volume 0.26→0.14, but **3/3 = control at dur 0.55 with the full 0.26 gain** — shipped as a trimmed `-short.wav` library variant). If a cue cannot be saved by timing or gain and it is decoration rather than a payoff hit, DELETE it (2026-08-07 clip 3). |
| 7a | **How to whisper-verify a mix (method, not taste)** | Two confounds produce phantom regressions. (1) **Long windows**: 12-second windows flagged four regressions on one clip and three were window-boundary artifacts — in one case the *spine* transcribed worse. Use **short, STAGGERED windows** (multiple offsets per cue) and require agreement. (2) **Encode mismatch**: scoring the render's 48 kHz AAC against the raw 44.1 kHz spine measures the codec, not the cue. Always compare against an **encode-matched control** — the bare spine pushed through the same 48 kHz/AAC chain as the render. Sweep candidates by mixing them onto the bare spine **offline** and scoring; that costs **zero renders**, and only the winner gets rendered. Use the same control to prove a residual diff is decoder variance (measure the SFX energy in the span: a real masker is not <-40 dB). **Run ALL of a step's decodes through `shorts/_tooling/whisper_jobs.py` (one jobs JSON, ONE model load) — never one whisper invocation per window.** Measured 2026-08-19: Whisper already runs on the GPU here (torch cu128, RTX 4070), so decoding is seconds — but every separate invocation pays ~20 s CUDA model load + ~5-10 s startup vs ~1.6 s per warm 4 s window. Batched 7-decode set: 44 s vs ~200 s; a 20-30 decode sweep drops from ~12-15 min to ~2 min. |
| 7b | **Frame checks land INSIDE a beat** | `BrollLayer` renders opacity 0 exactly at a beat's `tIn`, so a QA frame pulled at the literal `tIn` legitimately shows base video and reads as a missing b-roll beat. Pull the frame one or more frames INSIDE the window. (Logged 2026-07-23.) |
| 8 | **GATE** | Run `python video-creation/livestream-repurpose/skills/remotion-shorts-build/scripts/finalized_short_gate.py --constants <constants-file> --comp <composition.tsx> --public-dir <render-assets dir> --duration <seconds> --clip <n>` → must print `PASS`. **`--clip <n>` is REQUIRED** (see §Directives are per-clip): without it the ZONE-COVERAGE check is skipped and the gate only WARNs, which is how batch `tutorial` shipped 8 clips at 0% coverage. |

## ⛔ Directives are PER-CLIP. Never inherit one you were not given (2026-08-10)

**Batch `tutorial` shipped all 8 shorts with zero full-screen and zero content-zone b-roll under a
directive Mike had given for CLIP 1 ONLY.** His verbatim words carried no scope marker, the session
that took them down filed them as prose headed "WHOLE BATCH", the resume contract then said they
"ride VERBATIM in every builder contract", and the gate passed all 8 because a transparent overlay
satisfies its ≥1 b-roll ref. Eight builders each declared the coverage miss in prose. Prose blocks
nothing. Mike kept the batch but the scope was wrong.

- **Read directives ONLY via `python video-creation/shorts/_tooling/clip_directives.py --batch <b>
  --clip <n>`.** It returns just the directives whose `applies_to` includes that clip. A directive
  with no `applies_to` is reported and **NOT applied** — the tool refuses to guess a scope.
- **Never widen an existing directive's `applies_to` to make a gate pass.** That is the bug itself.
- If a clip legitimately ships zero zone coverage, the instruction must exist as a scoped directive
  with `"coverage_exempt": true` and that clip in `applies_to`. Then the gate passes and PRINTS the
  authorising directive, so the exemption is visible instead of implied.
- Precedent for doing it right: batch `early-crash` scoped the same class of directive to clips 1
  and 6, which shipped at 11.3% / 17.1% coverage while their siblings shipped at ~30%.

## B-roll — what it is and where it comes from

**B-roll = generated images (+ chart/news screenshots), NOT stock-footage services.** Canonical
flavors (from `shorts-style-guide.md`): chart/CoinMarketCap grabs, AI art (Pixar 3D / anime /
cinematic), meme images, animated coin/logo graphics, abstract motion, real article/tweet screenshots.

**Process, per clip:**
1. **Author `<clip-folder>/BROLL-PLAN.md`** from the transcript/captions BEFORE generating: one row
   per beat — timestamp, the spoken line, the visual, full-screen vs zone, reference image if any.
2. **Reference-image gate (named projects — MANDATORY, recurring miss):** for every named
   project/coin in the clip, `ls`/Glob **`schedule-tweets/images/reference/`** LIVE (never trust a
   remembered list). If a reference exists, that project's beat MUST be generated WITH the reference;
   a named-project short must carry that project's real branding, never only generic coins.

   **2a. A MISSING reference is NOT an instruction to ship a blank coin. Sort the project into one of
   three buckets first (Mike, 2026-09-03, after clip 5 of `tendies` shipped an unmarked gold coin in a
   BTC-vs-ETH argument):**

   | Bucket | What to do | Reference needed? |
   |---|---|---|
   | **WELL-KNOWN brand** — Bitcoin, Ethereum, Solana, BNB, XRP, Dogecoin, Kaspa, Bittensor, Toncoin, and non-crypto majors like Tesla, Nvidia, Coinbase, Binance, Robinhood, Apple, OpenAI | **NAME IT EXPLICITLY in the prompt and let the model draw its real logo.** The generators recognise these and reproduce them correctly. | **NO. Never blocked by a missing reference file.** |
   | **LESSER-KNOWN project WITH a reference on disk** | Generate that beat WITH the reference attached (rule 2 above). | Yes, mandatory |
   | **LESSER-KNOWN project with NO reference** | Do NOT let the model invent a logo. Use a **code-drawn Remotion text/stat card** (ticker + number as type), or a deliberately blank/generic coin. Flag it in the report so Mike can add a reference. | n/a |

   This mirrors the canonical wording in `repurpose/SKILL.md` ("Always name brands explicitly — but
   only if they're well-known... Never describe a well-known brand abstractly when you can name it"),
   which previously lived ONLY in the Lane 3 skill, so shorts builders never read it. **The reference
   folder exists to stop INVENTED logos for small projects. It was never a gate on Bitcoin.**
   Deciding "no reference on disk, therefore blank coin" for a major asset is the documented WRONG
   answer: on `tendies` clip 5 it produced a blank gold coin facing a correctly-marked Ethereum
   diamond in a clip whose entire argument is BTC vs ETH, which reads as a rendering fault rather
   than a neutral choice.
3. **Generate straight into the clip's `render-assets/`** with `broll-<batch>-<beat>.png` names;
   reference via `staticFile()`.
   - **Primary generator = `python repurpose/gen_batch.py --list <list.json> --prefix broll --batch <id>`
     (ChatGPT, pool purpose `broll`; canonical Python port 2026-08-11, built on the blessed
     `gen_images.py` capture stack — `generate-broll-reload.js` / `gen-batch-freshchat.js` are its
     FROZEN JS rollback).** Takes a `[{file, prompt}]` list (a relative `file` joins onto
     `video-creation/assets` exactly like the JS did, so a
     `..\shorts\<batch>\<clip>\render-assets\broll-<beat>.png` prefix lands it in the clip folder;
     absolute paths and the `image_id`/`slug`/`prompt`/`ref` schema are also accepted — refs upload
     with the ref-byte rejection gate). Skips existing files (safe to re-run); emits `IMG OK/SKIP/FAIL`
     machine lines and exits 1 on any fail. This is the RELIABLE capture — it beats these failure modes
     of the automated (bot-detected) Chrome session that the old DOM-poll scripts hit:
       - **Live-DOM HANG:** after a prompt is sent the streaming DOM often never surfaces the finished
         image (it just spins), though the image IS done server-side (visible if you open the same chat
         in a clean Edge browser). Fix: poll the live DOM up to **~80s**, and if still nothing, **RELOAD
         the chat** — a fresh load pulls the completed image. NEVER re-send a prompt (a re-send is a
         duplicate generation). Reload threshold is 80s, not 60s: at 60s the reload can land as the
         image is still finishing and catch a partial.
       - **WRONG-IMAGE grab:** "take the last `<img>`" mis-grabs a pre-existing image when the page
         lazy-loads. Fix: key on the STABLE estuary `file_id` (`id=file_...`, survives reloads) and
         track downloaded ids — the new image is the one whose `file_id` is unseen.
       - **LEFTOVER COMPOSER DRAFT (2026-08-05):** ChatGPT persists an UNSENT composer draft. A run
         killed mid-typing (e.g. a session wrap) leaves that half-typed prompt in the composer, and
         the next run types its prompt straight INTO it at the caret (mid-word) — one concatenated
         message, so the model renders the OLD prompt's scene and that beat's image is silently
         wrong while the generator reports OK. Real case: a killed builder left 521 chars of a
         "billboard skyline" prompt; the resumed builder's 715-char "organic tree" prompt landed
         inside it (1236 chars) and produced a second billboard image. The Python stack opens each
         run on a settled composer and uploads any ref BEFORE the baseline snapshot, so the
         attachment chip is never what a clear removes. **On any RESUMED build, still eyeball the first image of the run** — and when an
         image is off-brief, recover the truth READ-ONLY from the conversation
         (`/backend-api/conversation/<id>` + `/backend-api/files/<id>/download`) before assuming a
         capture bug: it shows the exact prompt that was actually sent.
     Typing uses the canonical human-like **~45-70ms/char** delay (anti-detection).
     Best run against a FRESH chat (retire the active broll chat first, or pass `--fresh`) so the
     seen-set starts clean.
     **After a run, ALWAYS `md5sum` the beat pngs to confirm zero duplicates** (a dup = a mis-capture to
     regenerate; the generator also byte-rejects sibling dups itself). The build agent runs this
     generator ITSELF as part of building its one clip (Mike: a single agent builds each clip end to
     end, one at a time) — the reload/`file_id`/URL/modal handling above makes it reliable enough to
     run unattended. It gets stuck ONLY if you use the old JS DOM-poll scripts; use `gen_batch.py`.
   - The old JS (`generate-broll-reload.js`, `gen-batch-freshchat.js`, `gen-images.js`,
     `generate-broll-batch.js`) is frozen rollback only — do not reach for it unless the Python
     stack is broken and the rollback is deliberate.
   - **Sanctioned fallback (Mike, 2026-07-08):** when ChatGPT is fully down, use Higgsfield
     `gpt_image_2` (`--image <ref>` for references, `--wait --json`, download the `hf_`-prefixed OUTPUT
     url, not the reference url).
4. **Reconcile before render:** every BROLL-PLAN beat has an asset, every asset is referenced in the
   comp, every comp ref exists on disk. Zero orphans.
5. **Persona inspect the b-roll (build agent, MANDATORY):** visually inspect EVERY generated b-roll
   image before rendering for a real cryptocurrency logo (Ethereum diamond/octahedron, Bitcoin ₿, any
   real project mark) or a real-person face — the image model sneaks these in. On a violation, **do NOT
   regenerate mid-build — REMAP that beat to a different clean on-disk asset** (a persona-clean one
   already generated; filenames/beat-mapping stay identical) and note the swap in the report.
   Crowds/figures are faceless silhouettes.

   **Coins: blank/generic is the default for coins the prompt did NOT ask to brand — it is NOT a ban
   on branding a coin you DID ask for.** The 2026-07-09 precedent below is about a logo the prompt
   never requested SNEAKING onto a coin specced generic (contamination), not about refusing to render
   an asset that IS the beat's subject. Both of these are correct at the same time:
   - beat subject is Bitcoin → prompt says "Bitcoin" → a real Bitcoin mark is CORRECT and expected;
   - a background coin specced generic comes back wearing an ETH diamond → that is contamination, remap it.

   Judge by **what the prompt asked for**, never by "was a reference file attached". See gate 2a above.
   (Recurred 2026-07-09: clip 3's climax + close carried UNREQUESTED ETH-diamond gems on coins specced
   generic; remapped to clean full-screens, no regen.)

## Report — extend the build JSON with the gate + checklist

In addition to the existing fields (`slug`, `render_mp4`, `qa`, `needs_review`), the report MUST
include:

```json
"finalized": {
  "gate_output": "<verbatim PASS/FAIL output>",
  "layout_broll_zone": true, "frame0_thumbnail": true, "captions": true,
  "broll_beats": 0, "broll_max_gap_s": 0, "fullscreen_at_hook": true,
  "sfx_events": 0, "reference_gate_checked": true, "broll_plan": "<path>"
}
```

Any `false`/failing value = the build is NOT done. Say so plainly instead of shipping.

### Stage timings — MANDATORY in every report (Mike, 2026-08-19)

Mike watches builders run 30-90+ minutes and could not see where the time went, so every build
report MUST also carry a `stage_timings_min` block. Track the times as you go (note the clock when
you enter/leave each stage — a `date +%s` before and after is enough; rough minutes are fine,
guessed-after-the-fact numbers are not):

```json
"stage_timings_min": {
  "canon_and_planning": 0,   // reading SKILL/style canon + authoring BROLL-PLAN + prompts
  "image_generation": 0,     // chatgpt lock held: browser generation incl. unstick waits + QA-opens
  "comp_authoring": 0,       // TSX/constants/captions build + geometry measurement (seam, capY)
  "whisper_qa": 0,           // ALL local Whisper decodes: SFX sweeps, controls, caption verify
  "renders": 0,              // render lock held: drafts + full renders + re-renders
  "frame_qa": 0,             // frame extraction + visual inspection of frames/images
  "lock_wait": 0,            // time spent blocked waiting on the chatgpt or render lock
  "other": 0
}
```

The point is visibility, not precision: the two historically invisible costs are `whisper_qa` and
the authoring/reasoning stages, and they routinely rival or exceed `image_generation`. A report
whose timings sum to wildly less than the agent's wall-clock should say where the rest went.

### Whisper decodes — ALWAYS batch them (Mike, 2026-08-19)

Every multi-decode verification step (SFX staggered windows, encode-matched controls, caption
verify, whole-file passes) runs through **`video-creation/shorts/_tooling/whisper_jobs.py`**:
write one jobs JSON, get one model load, decode every window warm. Never loop separate
`whisper` / `python -c` invocations — each pays ~20 s of CUDA model load + startup for ~1.6 s of
actual decoding, which is where the old 10-15 min `whisper_qa` stage went. Whisper is already
GPU-accelerated on this machine; the reload tax was the entire cost. (Full numbers in checklist
row 7a.)

> **⚠️ During a PARALLEL batch, pass `--device cpu` to `whisper_jobs.py` (measured 2026-08-28,
> batch `my-new-100x`).** The GPU advice above assumes you are the only builder. When the batch's
> Phase 7 builders run concurrently (the normal pattern — `stage_lock.py` serializes the chatgpt and
> render stages but NOT whisper), five builders pin the RTX 4070 at 100% / 7.5 GB of 8 GB and free
> RAM drops under 0.5 GB. Two independent builders each lost ~20-30 min to it in one batch: one
> medium.en batch died with a CUDA "unspecified launch failure" and a retry wedged ~18 min before
> being killed; another had a decode batch killed after 10 min. **On CPU the same 7-decode batch
> took 36 s** (vs 10+ min contended), and single decodes ran 3-4 s. So: solo build → GPU; anything
> running alongside sibling builders → `--device cpu`. The GPU is only a win when it is not
> contended.
