# screenplay.md — how to write a longform-edited SCREENPLAY

_Canonical scripting skill for the **longform-edited** track. Sibling to `longform-edited.md` (which
covers EDITING / Phase-4 production); this file covers writing the **SCREENPLAY.md** that lives in each
`media/<project>/` folder. When a rule here conflicts with a project's own PROJECT-LOG decision, the
project decision wins for that video; promote anything durable back here._

The screenplay is the pre-production script: the chapter map + per-chapter outline that the recording and
the Phase-4 edit are both built from. It is NOT a transcript and NOT the final word-for-word VO (Mike
records in his own words off the outline). Its job is to lock structure, beats, receipts, and the visual
plan, and to be unambiguous about **what Mike says vs what the editor does**, and **when his face is on
screen**.

---

## ⛔ RULE — there is NO "cold open." The opening IS Chapter 1. (Mike, hard rule, 2026-06-24)

The hook and the opening **always live inside Chapter 1**. There is NEVER a separate "cold open" (or
"intro" / "teaser") segment before Chapter 1 — **Chapter 1 is the first thing on screen, and nothing comes
before it.** Never label the opening anything other than Chapter 1. Lock CH1's opening lines verbatim if the
exact words matter, but it is still Chapter 1.

_Why this rule exists: on smartmoney-backing-kaspa a screenplay "Cold open" section was read as a real
pre-CH1 segment, so the reconciliation reported CH1's own hook as a MISSING/orphaned "cold open." There was
never anything before CH1._

---

## File skeleton (each `media/<project>/SCREENPLAY.md`)

```
# <project> — SCREENPLAY
Working title / track / spine architecture / register
The hook / thesis  (+ any VERIFIED-FALSE boxes so a debunked claim never sneaks back on screen)
Chapter map  (one line per chapter) <- the spine; CH1 carries the hook + opening (NO separate "cold open")
  (lock CH1's opening lines verbatim if the exact words matter — see the No-Cold-Open rule above)
Production conventions  (line-tag legend + title-card flags table + FACE/COVER rules; see below)
Per-chapter sections: register · Title card flag · tagged beats (Convention 5) · a `[!IMPORTANT]` verify box
Facts + receipts (sources)
Open items / next session
```

Keep a companion **PROJECT-LOG.md** (decision trail + resume pointer) and, once locked, a **BROLL-PLAN.md**.

---

## Convention 1 — the bullet IS what he says; (parens) is the note

> **LAYOUT UPDATE (Mike, 2026-06-29): the preferred on-page layout is now the TAGGED-LINE format in
> Convention 5 below** (one job per line, an emoji+bracket tag at the START of every line, heavy notes/verify
> in colored callout boxes). Convention 1 still defines the SEMANTICS (what counts as spoken vs direction vs
> verbatim); Convention 5 is how those semantics are LAID OUT on the page so the classes have real visual
> contrast. New screenplays use Convention 5; this section stays for the reasoning + the older prose format.

The #1 confusion to prevent: a reader cannot tell a line Mike SAYS from a note ABOUT the video. Fix it by
flipping the default — **an Outline bullet IS what Mike says** (in his own words, not verbatim), and
anything that is NOT for his mouth is wrapped so it reads as a direction. No separate "convert the outline
into spoken lines" pass — the outline already is the loose script.

Three states, each unambiguous:

- **Plain bullet = SAY IT, loosely.** It's a talking-point in his own words; the wording is his to
  improvise. This is the default and the bulk of every chapter. A **bold label** at the front is just a
  signpost/beat name, still part of the same spoken bullet.
- **`(parentheses) = direction / note to Mike**, NOT spoken** — register, camera, b-roll, a "tighten
  this", a lightweight word-swap ("(say 'a tech CEO', don't name Amazon)"). Inline parens are for
  LIGHTWEIGHT directions only.
- **No unglossed jargon in spoken bullets (Mike, 2026-07-06).** Mike reads bullets near-verbatim — never
  hand him a term of art he hasn't been given a plain-language handle for ("pips", "basis points", "OI",
  "contango"…). Either replace it with plain language in the bullet, or gloss it INSIDE the same bullet
  ("500 to 1,000 pips, that's a 5 to 10 yen move"), and plan an on-screen gloss for the viewer if the term
  survives to the take. (Origin: carry-trade CH5 — "500 to 1000 pips" was scripted and recorded with
  neither Mike nor the viewer given the meaning; needed a post-hoc on-screen gloss.)
- **Comma liberally for read-aloud pacing (Mike, 2026-07-06).** He reads bullets close to word-for-word, not
  as a loose paraphrase prompt, so a long comma-less sentence forces him to guess where the pauses/emphasis
  land on the fly. Favor MORE commas than normal prose style would use, breaking a long sentence into the
  breath-groups he'd actually speak, rather than one unbroken clause. When in doubt, add the comma.
- **`>` blockquote = SAY THIS EXACTLY (verbatim).** The rare locked line where the words matter (e.g. CH1's
  opening hook). Everything else stays loose; reserve `>` for lines that must come out word-for-word.

Reserved-for-the-editor brackets stay distinct from parens: **`[FACE]` / `[COVER]` / `[VERIFY]`** are
structured tags (Conventions 2-3 + verify), a different job from a parenthetical note. Parens = prose
direction to Mike; brackets = the gated-face / verify spine. They never collide.

Rule of thumb: **not in parens = say it; in parens = my note; in a `>` quote = say it exactly.**

- **HARD guardrails stay out-of-line.** A load-bearing "do NOT say X on screen" goes in the facts/verify
  block, never as an inline paren — a single paren mid-bullet is easy to read straight past while
  recording. State it plainly, no internal shorthand ("VERIFIED FALSE", "the boxed note") without a
  one-line restatement. (Inline parens are fine for soft directions; the load-bearing ones live in notes.)

## Convention 2 — Title-card flag (show the chapter title on screen?)

Each chapter header carries a **`Title card:`** line; keep a canonical at-a-glance table in the
production-conventions block.

- **ON** = show the chapter's on-screen title card at the chapter open (cube transition). The on-screen
  text is a short VIEWER-FACING title, NOT the long production name in the `## CHx` heading.
- **OFF** = no on-screen card AND not spoken; flow straight in. Default for **framing / connective beats**:
  any mid-roll plug and usually the close (and CH1 if it opens on a pure hook). Content/teaching chapters default ON.
- **⛔ MUSIC-CONTINUITY RULE (Mike, 2026-06-29) — a title card lands on a music-bed CHANGE, never mid-bed.**
  A card goes **ON only at a chapter that STARTS A NEW music bed**. A chapter that **CONTINUES** the previous
  chapter's bed is **OFF** (flow straight in), **even if it's a content/teaching chapter** (this OVERRIDES the
  "content/teaching default ON" above). A hard title card over a continuous bed reads as a section break the
  music never makes; cards and bed changes land together. So when you write the Music plan, the set of cards
  falls out of it: one card per new bed. (Worked example: a video on 3 beds where CH2 and CH4 start new beds
  shows cards only at CH2 + CH4; CH3/CH5/CH6 continue a bed and flow in cardless.)

## Convention 3 — [FACE] / [COVER] (when is Mike's face on screen?)

The spine is a **gated face** (longform-edited house rule #6): face is NOT on screen by default.

- **`[FACE]`** = viewer sees Mike, full-screen, direct to camera. Punctuation on the beats/lines that
  carry conviction or connect.
- **`[COVER]`** = VO continues over a container / diagram / b-roll / image. This is the DEFAULT; an
  untagged beat is a cover.
- **`[FACE] HOLD`** = deliberately stay on the face, no cutaway.
- **Tag at the BEAT level** (on the bold label) — you do NOT need exact scripted words; gating is a
  per-beat call (this is how silverscript / banks-own-chain were tagged). For `SAY:` beats you may tag per
  sentence for finer control.
- **KEEP FACE SPARSE (Mike's hard rule):** face moments are individual sentences **here and there**, used
  as PUNCTUATION. NOT entire blocks of sentences, and NOT every-other-sentence. The vast majority of the
  runtime is `[COVER]`; `[FACE]` is the rare cut back to his eyes that lands one line. When a beat runs
  several sentences, put `[FACE]` on the ONE that hits and cover the rest. Every chapter still gets at
  least one face beat (usually its opener and its payoff). A mid-roll plug is `[FACE]` throughout;
  mechanics chapters are almost entirely `[COVER]`.
- **A `[FACE]` cut = ONE sentence (Mike's hard rule):** show the face for a single sentence; more than one
  ONLY if they're very small/tight ("Gone. For everyone."). **Tag the very next line `[COVER]` explicitly**
  after a face sentence so the cut can't visually carry across the lines that follow. Untagged still
  defaults to COVER, but inside a `>` verbatim block (e.g. CH1's opening, locked SAY: beats) write the `[COVER]`
  return out — gating there must be unambiguous, not inferred from the default.
- Rule of thumb: a beat that TEACHES → `[COVER]`; Mike making a point / connecting → `[FACE]`.

## Convention 4 — Explainer visuals = SYSTEM-DESIGN containers, one per talking point

For any mechanics/explainer chapter, build a **system-design diagram per bullet** (topology / flow /
engine with nodes + arrows), NOT a table/card-grid and NOT an AI image. They **spotlight-swap** one at a
time as Mike speaks each bullet (cued to Phase-2 word-timings; one-container-at-a-time house rule).

- Build as **code-rendered HTML/SVG containers** so every label/number is pixel-accurate (the silverscript
  "text accuracy" lesson). AI image-gen is reserved for the text-free atmosphere/b-roll layer only.
- Render proofs via headless Chrome: `chrome --headless=new --screenshot=... <file>` — write to `$TEMP`
  then copy out (the Documents folder blocks direct headless writes). **SVG `<text>` does NOT honor
  `<b>`** — use `<tspan fill=...>` for emphasis or the rest of the line silently drops.
- Role color-coding helps readability (e.g. miners=cyan, validators=indigo, money/TAO=amber, rogue=red).
- See `media/bittensor-for-the-future/graphics/` for the worked set + `feedback_diagrams_system_design_not_tables` memory.

---

## Convention 5 — the line-tag layout (one job per line, tagged at the front)

The PREFERRED page layout (Mike, 2026-06-29, validated on `media/Kaspa founder genius or over-rated/`). It
operationalizes Convention 1: same semantics, but every line does **exactly one job** and carries an
**emoji + bracket tag at the very start**, so a reader sorts spoken-vs-direction-vs-note-vs-verify in one
pass. This replaces the older "plain bullet + inline `(parens)` + inline `[VERIFY]`" prose, which welds
several jobs into one sentence and reads as a wall. _Why it exists: Mike used colored Word docs with his
editors; markdown gets the same contrast from leading tags + emoji + VS Code callout boxes._

**The tag legend (tags sit at the START of every line):**

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike's face on screen (gated, sparse, ONE sentence — Convention 3) |
| 🗣️ `[COVER]` | spoken, voice over visuals (face off, the default) |
| 🔒 `[SAY-EXACT]` | spoken, the exact locked words (the `>` verbatim case, Convention 1) |
| 🎬 `[SHOW]` | on-screen direction: b-roll, container, image, receipt, transition, lower-third |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |

**Rules:**
- **One job per line.** Never weld a spoken line to a direction or a verify in the same line. If a beat needs
  a visual and a caution, that's a `🗣️ [COVER]` line, then a `🎬 [SHOW]` line, then a `🔍 [VERIFY]` line.
- **Beats keep a bold signpost.** Each beat is `**Beat N — signpost**` with its tagged lines under it. The
  signpost is a label, not spoken.
- **Heavy `[NOTE]` and `[VERIFY]` go in GitHub-style callout boxes**, which render colored in the VS Code
  preview Mike reads in: `> [!NOTE]` (chapter style/intent note), `> [!IMPORTANT]` (the chapter's verify
  list), `> [!WARNING]` (a HARD GATE — a do-not-air-until-confirmed claim). This keeps load-bearing
  guardrails OUT of the spoken flow (the Convention 1 "HARD guardrails stay out-of-line" rule).
- **`[SHOW]` is the single umbrella for non-spoken visual direction** (it replaces bare `(parens)` directions
  and the cryptic `DIR`). Transitions/SFX get their detailed treatment later in the EDIT-PLAN; the screenplay
  only needs the umbrella cue.
- **`[VERIFY]` replaces the cryptic `CHK`/inline `[VERIFY]`** sprawl; a one-line check stays inline as a
  `🔍 [VERIFY]` line, anything load-bearing moves to the `> [!IMPORTANT]`/`> [!WARNING]` box.
- Tags are plain text, so they survive raw view + every renderer; the emoji is the color anchor. Renaming a
  tag is a clean find/replace if a project wants different words.

---

## Register (how it's spoken) — defer to persona

All voice rules live in `persona/persona.json` (`spoken_voice`). Three gears: (1) off-the-cuff,
(2) polished explainer, (3) EPIC/DECLARATIVE hype (the longform-edited default for intros + conviction
beats; drop toward gear 2 for mechanics). No "right?" tags / no conviction-then-hedge in gear 3. No em
dashes anywhere.

## Honesty / verified-claims rules (persona `verified_claims_only`)

- Fact-check every named entity, date, stat, and call before it goes on screen; mark unverified ones
  `[VERIFY]` and confirm live at render time (numbers drift).
- Keep speculative upside CONDITIONAL ("could be") — opportunity/asymmetry framing, never a promised
  target.
- Never frame Mike's own calls as a timing mistake (`avoid_in_drafts`: no self-undermining). Conviction
  reads vindicated and forward-looking.
- Put any debunked-claim warning in a VERIFIED-FALSE box near the thesis so it can't creep back on screen.

---

## Build order (resume map)

1. Lock topic / title / spine architecture / register (PROJECT-LOG decision).
2. Lock the **chapter map** + **CH1's opening** (the hook lives in CH1 — no separate "cold open").
3. Draft each chapter as **Outline (beats)** with `[FACE]/[COVER]` + Title-card flag + facts/`[VERIFY]`.
4. Build the **system-design containers** for explainer chapters (Convention 4).
5. Resolve open decisions + run live `[VERIFY]` checks.
6. Pull music (LUFS + MUSIC_DB) + write **BROLL-PLAN.md** (cover every non-`[FACE]` beat). Music is
   PICKED from the analyzed catalog `video-creation/assets/music/library.json` (music-sourcing `SKILL.md`
   §2c; whole-video bed plan = the `music-placement-strategist` agent) — no listening/auditioning pass.
7. Record -> Phase 1-4 per `longform-edited.md`.
```
