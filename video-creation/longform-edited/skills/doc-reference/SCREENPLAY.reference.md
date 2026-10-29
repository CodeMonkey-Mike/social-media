# <project> - SCREENPLAY

_REFERENCE SHAPE (skills/doc-reference, 2026-09-17). Copy this structure exactly; replace the content. Format owner: `screenplay.md` (Convention 5). Lint: `skills/doc-reference/lint_screenplay.py`. Every tagged line = emoji + BACKTICKED tag; a locked line = 🔒 `[SAY-EXACT]` then its gate; one job per line; no em dashes; no cold open._

- **Working title:** <title> (alternates for Mike at GATE 1: "<alt 1>" · "<alt 2>")
- **Track:** longform-edited (16:9, heavily edited).
- **Archetype / register:** <EPIC informative explainer>. Gear map: **CH1 = gear 3** (peak epic hook) → **CH2 = gear 2** (polished explainer) → **CH3 = gear 3** (conviction close).
- **Spine architecture:** full-screen GATED face (longform-edited.md house rule #6). **<N> `[FACE]` beats in the whole video** (where: <CH1 hook line, CH1 thesis landing>). Every other line is `[COVER]`.
- **Target runtime:** <M:SS> (hard window <a> to <b>). Spoken-word budget ~<N> words; per-chapter budgets on each chapter header. Lines flagged 💬 trim-first come out first if a take runs long.
- **Fact source:** every number, date, name and quote traces to `DATA.md` in this folder (compiled <date>). Chart IDs C1 to C<n> = DATA.md CHART-SOURCE INDEX.

---

## THE HOOK / THESIS

<One paragraph: the thesis in plain language, every claim traceable to DATA.md.>

> [!WARNING]
> **DO NOT AIR "<popular but wrong claim>".** <Why, per DATA.md do-not-air.> Airable instead: "<the honest line>".

> [!WARNING]
> **<second do-not-air guard>.** <why> <airable instead>

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | <NAME> | Hook (opens the video, no cold open): <what lands>; the FACE beats; the thesis lands | Bed A starts | OFF (pure hook, face is frame one) | ~<s> / ~<words> |
| CH2 | <NAME> | <the teaching chapter: the centerpiece diagram, the receipts> | Bed B starts | **ON: "<CARD TEXT>"** | ~<s> / ~<words> |
| CH3 | <NAME> | <where it stands + conviction close + CTA (or hard-out, Mike's call)> | Bed C starts | **ON: "<CARD TEXT>"** | ~<s> / ~<words> |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it.

---

## PRODUCTION CONVENTIONS

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike full-screen to camera. SPARSE: one sentence as punctuation (tight pairs allowed) |
| 🗣️ `[COVER]` | spoken, VO over container / diagram / receipt / b-roll. The DEFAULT |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate written out: 🔒 `[SAY-EXACT]` 👤 `[FACE]` or 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` |
| 🎬 `[SHOW]` | on-screen direction (chart, container, receipt, b-roll cue). Not spoken |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |
| 🎞️ `[INSERT]` | a third-party clip plays with its OWN voice while the spine pauses (Convention 6). Names its CLIP-<n> row. Not spoken |

**Title cards (Convention 2):** a card lands ONLY at a chapter that STARTS A NEW music bed; a chapter that continues a bed flows in cardless. The card set falls out of the MUSIC-MOOD-PLAN.

**FACE/COVER rules (Convention 3):** face is gated OFF by default; a face cut is ONE sentence (tight pairs allowed); the line after a face line is explicitly `[COVER]`; build to the transcript, omit beats he did not say.

**Explainer visuals (Convention 4):** system-design containers, code-rendered, one per talking point, spotlight-swapped. Never tables, never AI images for text.

**Clip inserts (Convention 6):** CONSIDERED on every video. A third-party clip that plays with its OWN voice while the spine pauses is a 🎞️ `[INSERT]` line between its set-up line (which ENDS the sentence) and the resume line, plus a row in `## CLIP-INSERTS`; when nothing fits that section says NONE with the reason. Never a muted cover.

---

## CH1 - <NAME>
**Register:** gear 3, peak epic. Short hammer sentences. No "right?" tags, no hedge, no whole-video preview.
**Title card:** OFF. **Music:** Bed A starts (<mood>; see MUSIC-MOOD-PLAN).
**Budget:** ~<s>, ~<words> spoken words.

**Beat 1 - the hook (LOCKED opening)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **<The locked hook line, one sentence, declarative.>**
🎬 `[SHOW]` Face for the locked line only (frame one of the video is Mike). On "<word>" cut to H0, a full-frame motion-type card "<TEXT>" over dark atmosphere b-roll.

**Beat 2 - <signpost>**

🗣️ `[COVER]` <A spoken talking point in Mike's own words, commas for read-aloud pacing, no unglossed jargon.>
🎬 `[SHOW]` C4 receipt, a 2s flash of <the primary source page>, then out.
💬 `[NOTE]` Trim-first if CH1 runs long: <which line>.

**Beat 3 - the thesis (LOCKED landing)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **<The locked thesis line.>**
🔒 `[SAY-EXACT]` 🗣️ `[COVER]` <The locked continuation, face off.>
🎬 `[SHOW]` On "<word>" cut to <the marquee motion card>. Hold the dark atmosphere under the locked line.
🔍 `[VERIFY]` <A one-line live check for a number in this beat; load-bearing ones go in the box below.>
🗣️ `[COVER]` <The handoff line into the body, ROTATED per video: one `approved` line from persona.json `dive_in_variants`, e.g. "So, let's break it all down.">
💬 `[NOTE]` Handoff alternates for Mike are listed in OPEN QUESTIONS.

> [!IMPORTANT]
> CH1 verify list:
> - "<spoken figure>" = <DATA.md row, source, date>. Never inflate to <the banned number>.
> - "<spoken quote>" = <who said it, where, date>; captured as receipt C<n>.
> - The face lines above are the video's ONLY face beats. Do not ad-lib another to camera.

---

## CH2 - <NAME>
**Register:** gear 2 explainer, declarative edges. This chapter TEACHES; every line is cover.
**Title card:** ON, "<CARD TEXT>". **Music:** Bed B starts (subtle explainer bed, loop-safe).
**Budget:** ~<s>, ~<words> spoken words.

**Beat 1 - <signpost>**

🗣️ `[COVER]` <talking point>
🎬 `[SHOW]` C1, THE system-design diagram, fills the frame: <nodes and arrows, labels pixel-accurate>. Spotlight <node> on "<word>".
🗣️ `[COVER]` <talking point>
🎬 `[SHOW]` C9 receipt: <real-site capture, the sentence highlighted>. Real-site capture, never restyled.

**Beat 2 - <the quoted voice (a clip insert, Convention 6)>**

🗣️ `[COVER]` <The SET-UP line: names the speaker and what they said, and ENDS THE SENTENCE. e.g. "You've probably seen the clip of <name>, the CEO of <company>, saying <the claim>.">
🎞️ `[INSERT]` CLIP-1: <name>, <n> s with their own voice, the spine pauses after the set-up line; burned caption "<name>, <month year>, <context>". Transition in and out.
🗣️ `[COVER]` <The RESUME line: Mike's own answer to the clip, said as his.>

> [!IMPORTANT]
> CH2 verify list:
> - <every figure and quote in this chapter, with its DATA.md source>.

---

## CH3 - <NAME>
**Register:** gear 3, conviction. Declarative, all upside conditional. Still all cover.
**Title card:** ON, "<CARD TEXT>". **Music:** Bed C starts (epic, rising, RIGHT-ALIGNED so its epic_hit ending lands on the last spoken word).
**Budget:** ~<s>, ~<words> spoken words.

**Beat 1 - <signpost>**

🗣️ `[COVER]` <the shipped-vs-planned ladder, spoken>
🎬 `[SHOW]` C3, the animated ladder timeline (code-built): rungs land one at a time as spoken.

**Beat 2 - close**

🗣️ `[COVER]` <conviction beat, no price, no target, no multiplier> Click the like button, comment <the ask>, and click the link in the description to get involved in the best community ever. I'm gonna catch you guys, later.
🎬 `[SHOW]` End card: logo bug + community link lower-third. Bed C epic_hit lands on "later."
💬 `[NOTE]` If Mike calls a HARD-OUT instead of the CTA: the take ends on "<last content line>" and the edit cuts to black on the hit, no end card.

> [!IMPORTANT]
> CH3 verify list:
> - <ladder dates with their primary sources>.

---

## CLIP-INSERTS

_Considered on every video (Convention 6; rule + pipeline in `skills/clip-inserts/clip-inserts.md`). A clip insert plays with its OWN voice while the spine pauses; never a muted cover. Mike rules each row at GATE 1. When nothing fits, this section is one line: `NONE: <what DATA.md's Clip candidates found and why none earns its seconds>`._

| id | Who / what plays (verbatim words) | Source + timecodes | Length | Lands (chapter / beat, after which set-up line) | Burned caption | Status |
|---|---|---|---|---|---|---|
| CLIP-1 | <name, role>: "<the words, verbatim from the video, DATA.md Clip candidates>" | <video URL> <M:SS.s-M:SS.s> | <n> s | CH2 Beat 2, after "...saying <the claim>." | <name>, <month year>, <one-line context> | PROPOSED |

## MUSIC-MOOD-PLAN

| Chapter | Mood + gear | Subtle / aggressive | Bed / carve (which section of the file plays, how it is extended or right-aligned) | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 <NAME> (0:00-0:<ss>) | <dark epic, gear 3> | aggressive, hits cold on word one | **Bed A starts at frame 0**: <the file's intro groove, its first drop on "<word>"> | <track ids by aggression / opening meta> |
| CH2 <NAME> (0:<ss>-<m:ss>) | <steady explainer, gear 2> | subtle, loop-safe | **Bed B starts** (card ON): <the verse plateau, extended to the chapter by a bar-aligned remix loop> | <track ids> |
| CH3 <NAME> (<m:ss>-<m:ss>) | <rising epic, gear 3> | aggressive into the close | Bed B continues: <the chorus RIGHT-ALIGNED so its ending hits on the last word "<word>"> | <an `epic_hit`-ending track> |

The first column is `CHn TITLE` as in the chapter heading (a time range may follow); the `Bed / carve` column says WHICH
SECTION of the file plays and how it is extended (remix loop) or right-aligned (a drop on a word, an ending on the last word),
never a bare "continues" (Mike, 2026-10-28; `lint_screenplay.py` rule 16). A new BED is a new TRACK (and a card, Convention 2);
another section of the same track is a carve, not a bed change. Exact carving (bar lines, in-points, loops, dB under VO,
breaths) is the `music-placement-strategist`'s job after the spine exists (`../music/music.md` section ONE TRACK, CARVED).

## VISUAL-PLAN

### Chapter themes (Convention 4b, optional: one accent + one image style per chapter, mirroring the beds)
| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 | #ffd700 (gold) | photoreal cinematic, warm amber rim, deep charcoal | <why this look for this chapter> |
| CH2 | #00c2ff (cyan) | house | <...> |

- C1 <the centerpiece system-design diagram: what it shows, which beat, which nodes light when>.
- C2 <contrast graphic>. C3 <the animated ladder>. Receipts C4, C5, C6, C9 (real-site captures).
- H0 / H1 <hook motion cards, text only, no numbers>.

## OPEN QUESTIONS / NEXT SESSION

1. <A decision Mike must make at GATE 1 (title, CTA vs hard-out, naming a team).>
2. <The handoff line (CH1 close): the scripted pick plus 2-3 alternates from persona.json `dive_in_variants`, at least one `proposed`, for Mike to choose.>
3. <The live 🔍 `[VERIFY]` checklist carried from DATA.md.>
4. <Each PROPOSED clip insert (CLIP-1 ...): in or out, and the exact set-up wording.>
