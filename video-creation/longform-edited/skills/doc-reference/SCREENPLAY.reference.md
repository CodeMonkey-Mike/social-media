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

**Title cards (Convention 2):** a card lands ONLY at a chapter that STARTS A NEW music bed; a chapter that continues a bed flows in cardless. The card set falls out of the MUSIC-MOOD-PLAN.

**FACE/COVER rules (Convention 3):** face is gated OFF by default; a face cut is ONE sentence (tight pairs allowed); the line after a face line is explicitly `[COVER]`; build to the transcript, omit beats he did not say.

**Explainer visuals (Convention 4):** system-design containers, code-rendered, one per talking point, spotlight-swapped. Never tables, never AI images for text.

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

## MUSIC-MOOD-PLAN

| CH | Mood + gear | Subtle / aggressive | New bed? | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 | <dark epic, gear 3> | aggressive, hits cold on word one | **Bed A starts** | <track ids by aggression / opening meta> |
| CH2 | <steady explainer, gear 2> | subtle, loop-safe | **Bed B starts** (card ON) | <track ids> |
| CH3 | <rising epic, gear 3> | aggressive into the close | **Bed C starts** (card ON) | <an `epic_hit`-ending track> |

Exact carving (in-points, loops, dB under VO, breaths) is the `music-placement-strategist`'s job after the spine exists.

## VISUAL-PLAN

- C1 <the centerpiece system-design diagram: what it shows, which beat, which nodes light when>.
- C2 <contrast graphic>. C3 <the animated ladder>. Receipts C4, C5, C6, C9 (real-site captures).
- H0 / H1 <hook motion cards, text only, no numbers>.

## OPEN QUESTIONS / NEXT SESSION

1. <A decision Mike must make at GATE 1 (title, CTA vs hard-out, naming a team).>
2. <The handoff line (CH1 close): the scripted pick plus 2-3 alternates from persona.json `dive_in_variants`, at least one `proposed`, for Mike to choose.>
3. <The live 🔍 `[VERIFY]` checklist carried from DATA.md.>
