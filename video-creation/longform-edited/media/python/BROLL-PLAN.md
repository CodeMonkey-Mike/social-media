# python EP01 — BROLL-PLAN (cover layer, file-level manifest)

_Built from **`AS-RECORDED.md`**, not `SCREENPLAY.md` (house rule #6). Every timecode is FINAL-SPINE
coords (`spine/ALL.c.desilenced.mp4`, 305.20 s). **Zero orphans**: every cover second below is
assigned, and every asset built is placed here or marked REJECTED._

**The shape of the problem:** 9% face / 91% cover. 277 s of cover across 7 face windows. This video is
**container-driven**: no Envato video b-roll, no AI stills, no receipts. Everything is a code-rendered
HTML/CSS container screenshotted to PNG (Convention 4 + `deck-and-containers`), which is also what
makes the "no captions" decision safe, the containers carry the reading.

**Cancelled from the SCREENPLAY VISUAL-PLAN** (the lines that would have justified them were not
recorded, see AS-RECORDED divergences): `[D2-B]` 76-episodes stat card · `[R2-A]` playlist grid ·
`[R5-A]` capstone folders · `[R7-A]` `run.py` demo · `[R7-B]` episode 2 queued · `[R7-C]` tutorial
format glimpse. **REJECTED, do not build.**

---

## Global rules for this video

- **Containers fill the frame** at true 1920x1080. The spine is pillarboxed (~80 px bars L/R baked into
  the camera framing); containers must NOT be inset to match it, they go full frame.
- **One point on screen at a time.** A rich diagram appears whole once, then spotlights its parts.
- **No invented numbers.** Nothing on screen states an episode count, a salary, a percentage, or a
  statistic. This video has no sourced figures at all, by design.
- **No API keys on screen**, not even fake-looking ones, in the C25 APIs container.
- **No real product UI is mocked up.** C1 is a stylized terminal, not a pixel-copy of Claude Code's UI.
- **All transitions `rmn:fade`** per `TRANSITIONS.md`. Containers may animate their own contents.
- **No black > 0.5 s** anywhere in the cover layer.

---

## Cover manifest

Legend: **CTR** code-rendered container (PNG or animated comp) · **ANIM** container animated in the
comp with `useCurrentFrame` · card = chapter/title card.

| # | TC in | TC out | Dur | Asset | What is on screen |
|---|---|---|---|---|---|
| — | 0:00.0 | 0:05.7 | 5.7 | **C1** ANIM | Stylized dark terminal. Prompt line types out `build me a RAG app`, then files stream in (`main.py`, `ingest.py`, `retriever.py`, `requirements.txt`) with a fast progress feel, ending on a green check. Must read as impressive and real, never as a parody. NOT a pixel-copy of Claude Code's UI |
| — | 0:05.7 | 0:09.8 | 4.2 | **FACE 1** | "So why would you want to spend three months learning Python?" |
| — | 0:09.8 | 0:14.6 | 4.8 | **C2** ANIM | **[D1-A] the amplifier split.** One PROMPT node up top, splitting into two paths. The word AMPLIFIER on the split. Builds in on "amplify" |
| — | 0:14.6 | 0:21.9 | 7.3 | **C3** ANIM | C2's **SKILLED** branch spotlit: output accelerating, labelled shipped / working. Neutral palette, no trophy iconography |
| — | 0:21.9 | 0:27.4 | 5.5 | **C4** ANIM | C2's **UNSKILLED** branch spotlit: same speed, same volume, flagged broken. **No red X, no clown iconography** (it is about leverage, not about people) |
| — | 0:27.4 | 0:29.8 | 2.4 | **C5** CTR | Real Python, heavily defocused and dimmed, scrolling slowly past. The "code you cannot read" beat. Blurred on purpose so no text legibility question arises |
| — | 0:29.8 | 0:36.4 | 6.6 | **FACE 2** | Cost line + CH2 opener (merged window). **Title card overlays at 0:33.7** |
| card | 0:33.7 | ~0:35.2 | 1.5 | **CARD-A** | **LEARNING PYTHON FOR AI ENGINEERING**. Full frame over the face; also hides the face-to-face chapter join |
| — | 0:36.4 | 0:41.3 | 4.9 | **C6** CTR | A series rail: unlabelled, unnumbered episode cards receding. Conveys "a playlist" with **no count implied** (the 76 claim is not in this video) |
| — | 0:41.3 | 0:43.5 | 2.2 | **C7** CTR | Quiet channel mark / "more on this channel" plate for "as you've seen in some of my other videos" |
| — | 0:43.5 | 0:48.3 | 4.8 | **C8** CTR | **JS → Python.** Two language plates, arrow between. The peer-expert positioning beat |
| — | 0:48.3 | 0:58.5 | 10.2 | **C9** ANIM | Audience container, two columns landing in turn: **BEGINNERS** and **SWITCHING FROM ANOTHER LANGUAGE**. Second column carries "skilled, seasoned" |
| — | 0:58.5 | 1:06.3 | 7.8 | **C10** CTR | Cadence: **WEEKLY / BI-WEEKLY** episode rhythm. No promised dates |
| — | 1:06.3 | 1:12.9 | 6.6 | **C11** ANIM | Difficulty ramp rising from **VERY BEGINNER** to **MORE COMPLEX**, drawn over time |
| — | 1:12.9 | 1:21.4 | 8.5 | **C12** ANIM | **[D2-A] the struck-through curriculum.** Generic ~20-entry outline, about two thirds striking through in sequence. **Unbranded, never a real named course** |
| — | 1:21.4 | 1:25.9 | 4.5 | **C12b** | C12 resolves: survivors lit, struck entries faded out |
| — | 1:25.9 | 1:33.5 | 7.6 | **C13** ANIM | Scope container: **AI ENGINEERING** lit; GAMING, WEB DEV, and others visibly dimmed out. This is the beat that now carries the authority claim |
| — | 1:33.5 | 1:37.4 | 3.9 | **C14** CTR | Roadmap tease, abstract shape only. **No spoilers**: does not name the four needs, the ladder or the rule |
| — | 1:37.4 | 1:41.6 | 4.2 | **C15** CTR | **[D2-C] skip cue.** "WHAT YOU ACTUALLY NEED · 2:32". Must carry BOTH name and timestamp, because the VO no longer names the target |
| — | 1:41.6 | 1:47.5 | 5.9 | **C16** ANIM | "Hey computer, calculate five plus five" as a speech bubble at a dead, unresponsive prompt. Nothing happens |
| — | 1:47.5 | 1:48.9 | 1.4 | **FACE 3** | "Computers don't speak human." |
| — | 1:48.9 | 1:54.5 | 5.6 | **C17a** ANIM | **[D3-A] MARQUEE, the abstraction ladder.** Rung 1 **BINARY** lands full frame (`01001000 01101001`, must decode to something real and harmless) |
| — | 1:54.5 | 2:04.3 | 9.8 | **C17b** ANIM | Ladder builds: **ASSEMBLY**, **C**, **PYTHON**, **HUMAN LANGUAGE**, each on its spoken word. Axis labels "easier for machines" down / "easier for people" up. Then **the arrow reverses** to place Python one rung under human. The frame this chapter exists for |
| — | 2:04.3 | 2:08.9 | 4.6 | **C18** ANIM | Editor container: `print(5 + 5)` typed, run, `10` printed. **Code-rendered, pixel-accurate** (Mike, 2026-08-05: a container, not a screen capture) |
| — | 2:08.9 | 2:12.5 | 3.6 | **C19** CTR | Translator container: English-like code → TRANSLATOR → machine |
| — | 2:12.5 | 2:22.3 | 9.8 | **C20** ANIM | "Under the hood" layers shown then deliberately dimmed, tagged **not today** |
| — | 2:22.3 | 2:32.2 | 9.9 | **C21** ANIM | **[D3-B] the front door.** PYTHON as the single entry node, arrows out to ChatGPT, Claude, image models, self-driving. **Plain text labels if any wordmark is doubtful** |
| card | 2:32.2 | ~2:33.7 | 1.5 | **CARD-B** | **WHAT YOU ACTUALLY NEED** (also the YouTube chapter marker, and C15's skip target) |
| — | 2:33.7 | 2:38.9 | 5.2 | **C22** CTR | The open question, "what do you actually need", set against "start with what you don't" |
| — | 2:38.9 | 2:47.3 | 8.4 | **C23** ANIM | **[D4-A] train vs build.** TensorFlow / PyTorch plates in a **TRAIN A MODEL** lane, neutral "not this, not yet" treatment, no disparagement |
| — | 2:47.3 | 2:50.4 | 3.1 | **C23b** | The **BUILD ON TOP OF A MODEL** lane lights as the lane we are in |
| — | 2:50.4 | 2:53.2 | 2.8 | **C24** ANIM | **[D4-B] MARQUEE, the four groups.** Full four-card shape lands ONCE on "there are four things you need". Palette locked here and reused in C31 |
| — | 2:53.2 | 3:03.2 | 10.0 | **C24a** ANIM | Spotlight **1 FUNDAMENTALS**, sub-items building: variables, lists, dictionaries, conditionals, loops, functions, just enough OOP |
| — | 3:03.2 | 3:16.8 | 13.6 | **C24b** ANIM | Spotlight **2 APIS**: HTTP requests, JSON, key handling, failure at 3 a.m. **No key strings on screen, real or fake** |
| — | 3:16.8 | 3:20.6 | 3.8 | **C24c** ANIM | Spotlight **3 FILES**: loading documents, saving outputs, reading logs |
| — | 3:20.6 | 3:29.6 | 9.0 | **C24d** ANIM | Spotlight **4 ENVIRONMENTS**: virtual environments, pip, uv |
| — | 3:29.6 | 3:33.5 | 3.9 | **C25** ANIM | **[D4-C] the collision.** PROJECT A needs v1, PROJECT B needs v2, one shared install, and the break. The one item that needs a picture, not a label |
| — | 3:33.5 | 3:35.5 | 2.0 | **FACE 4** | "That's it. That's the whole list." |
| card | 3:35.5 | ~3:37.0 | 1.5 | **CARD-C** | **BUILD ONE PROJECT, FOUR TIMES** |
| — | 3:37.0 | 3:39.4 | 2.4 | **C26** | Four-card overview callback, all four lit, as "and then you build" lands |
| — | 3:39.4 | 3:44.1 | 4.7 | **C27** ANIM | Standard portfolio advice, "train a simple model", set aside as not-this |
| — | 3:44.1 | 3:46.5 | 2.4 | **FACE 5** | "Instead, build one project, four times." |
| — | 3:46.5 | 3:54.5 | 8.0 | **C28a** ANIM | **[D5-A] THE MARQUEE, layer 1 CALL.** YOUR SCRIPT → MODEL → back. Builds as he describes the script |
| — | 3:54.5 | 4:01.8 | 7.3 | **C28b** ANIM | Satellites land in the **C24 group colours**: JSON, REQUESTS, ERROR HANDLING, ENVIRONMENTS. The visual link back to CH4 |
| — | 4:01.8 | 4:06.3 | 4.5 | **C28c** ANIM | **Layer 2 MEMORY** clips on. Base does not move or shrink |
| — | 4:06.3 | 4:10.1 | 3.8 | **C28d** ANIM | **Layer 3 DOCUMENTS**: YOUR DOCS → CHUNKS → SIMILARITY → into the existing call |
| — | 4:10.1 | 4:14.0 | 3.9 | **C28e** ANIM | **Layer 4 TOOLS** with the decision arrow out to the tools |
| — | 4:14.0 | 4:16.6 | 2.6 | **C28f** ANIM | **AGENT** lands on the finished system, held. The screenshot frame. Never a rebuild or a wipe, always an addition |
| — | 4:16.6 | 4:22.8 | 6.2 | **C29** ANIM | Four-toy-projects vs one-system contrast, resolving on the single assembled system |
| card | 4:22.8 | ~4:24.3 | 1.5 | **CARD-D** | **THE ONE RULE** |
| — | 4:24.3 | 4:26.9 | 2.6 | **C30** CTR | "One rule. It decides whether any of this works." held plain |
| — | 4:26.9 | 4:33.1 | 6.2 | **C31** ANIM | **[D6-A] the split comparison.** LEFT, a progress bar crawling a **40 HOURS** tutorial, retention indicator flat. RIGHT, one broken line typed, failing, fixed, indicator climbing. **No numbers or axis on the indicator** (it is a mood indicator; a quantified retention chart would be an invented statistic) |
| — | 4:33.1 | 4:43.3 | 10.2 | **C32** CTR | **[D6-B] the rule card.** Two columns: ALLOWED = explain, quiz, review after you have tried. NOT ALLOWED = write it for you. Full frame, clean, a screenshot frame |
| — | 4:43.3 | 4:45.6 | 2.3 | **FACE 6** | "The struggle is the part where learning happens." |
| — | 4:45.6 | 4:56.0 | 10.4 | **C33** ANIM | **[D6-C] the three checks.** One checkbox landing per criterion, then **held ≥3 s on the final state with nothing moving**. Built to be screenshotted; verify the hold on the render, do not assume it |
| — | 4:56.0 | 5:05.2 | 9.2 | **FACE 7** | Readiness payoff + the ask + sign-off (merged window, runs to the last frame) |

**Coverage check:** every second from 0:00.0 to 5:05.2 is either a FACE window or an assigned asset.
No gaps, no orphans, no black.

---

## Build worklist

**36 containers, 4 cards.** All code-rendered HTML/CSS, screenshotted at 1920x1080 (or @2x), off the
locked container stylesheet (`../../skills/container-reference/container-canonical.css` — copy it, do
not re-derive). Group by build session:

1. **Cards (4):** CARD-A/B/C/D. One stylesheet, four strings.
2. **CH1 set (5):** C1 terminal, C2/C3/C4 amplifier states, C5 blurred code.
3. **CH2 ad-lib set (10):** C6 series rail, C7 channel plate, C8 JS→Python, C9 audience, C10 cadence,
   C11 ramp, C12/C12b curriculum, C13 scope, C14 tease, C15 skip cue. **The largest and least
   concrete block in the video, build it first while it is hardest.**
4. **CH3 set (7):** C16 dead prompt, C17a/C17b ladder, C18 print, C19 translator, C20 under-the-hood,
   C21 front door.
5. **CH4 set (8):** C22 question, C23/C23b lanes, C24 + C24a-d groups, C25 collision.
6. **CH5 set (8):** C26 callback, C27 portfolio, C28a-f the stack, C29 contrast.
7. **CH6 set (4):** C30 one rule, C31 split comparison, C32 rule card, C33 three checks.

**Animated in the comp, not baked as stills** (they need `useCurrentFrame`): C1, C2/C3/C4, C9, C11,
C12, C13, C16, C17a/b, C18, C20, C21, C23, C24 + C24a-d, C25, C27, C28a-f, C29, C31, C33. Design
states get built as PNGs first so `visual-qa` can gate the look before any animation is written.

**Nothing to capture, nothing to license.** No Envato, no ChatGPT images, no receipts, no screen
recordings. That is a consequence of the recorded take, not a shortcut.
