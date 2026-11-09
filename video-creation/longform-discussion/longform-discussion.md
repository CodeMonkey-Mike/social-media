# longform-discussion

_Canonical doc for this track (Mike, 2026-11-05). `CLAUDE.md` in this folder only routes here._

**What it is:** research for a video Mike records freeform on the crypto channel, talking over browser tabs he is
sharing. Usually one recording covering several topics, sometimes one topic. **This track makes no video.** It ends
when the tabs are ready and Mike has his talking points. What happens to the recording afterward is not decided here
(the closest existing format is `longform-presentation/` format 2, `desilence-only`).

**How it differs from its neighbors:** `topic-radar/` finds a topic for a whole video and is one of this track's feeds.
`longform-edited/` researches and then scripts a heavy edit. This borrows its sourcing rules and its clip tool, then
stops at talking points.

**Triggers:** "find me things to talk about" · "discussion topics" · "scan this video" · any influencer URL Mike hands
over in this context · "open the tabs".

## The two data files

| File | What it is | Lifetime |
|---|---|---|
| `circumstances/circumstances.json` | Things Mike can point out + the market conditions that make each relevant, each with its chart tab | ONGOING, it grows with every video Mike hands over |
| `media/<session>/TOPICS.json` | One session's candidates, Mike's rulings, the running order | One recording |

Mike's copy of the list: `media/<session>/TOPICS.docx`, the Word document he narrows (below). Generated, never hand-edited:
`circumstances/CIRCUMSTANCES.md`, `media/<session>/RUNDOWN.md`.

## The commands (`scripts/`, run from this folder)

```
python scripts/discussion.py scan                     # which dataset entries are live now, from real data
python scripts/discussion.py lint                     # validate the dataset, regenerate CIRCUMSTANCES.md
python scripts/discussion.py render <session>         # validate TOPICS.json, write TOPICS.docx (+ RUNDOWN.md once approved)
python scripts/discussion.py approve <session> --from-doc   # read the ruling out of the TOPICS.docx he narrowed
python scripts/discussion.py approve <session> --order 3,1,5 [--reject 2,4] [--drop-clip CLIP-2]   # same, when he rules in words
python scripts/discussion.py clips <session>          # downloads ONLY approved clips, ONLY the approved seconds
python scripts/discussion.py tabs <session> [--check] [--open]
python scripts/discussion.py status <session>
python scripts/market_data.py                         # refresh the daily series (Yahoo + FRED) into circumstances/data/
python scripts/clip_transcript.py <url> [--find "regex"] [--phrase "first words" "last words"]
```

`--open` makes a new window in Mike's normal Chrome so his logins apply, and never closes anything. Run it only on
Mike's word ("open the tabs"), never unprompted.

## Flow A: INGEST (Mike hands over a video)

Mike will keep finding things: a creator mentions a chart, Mike gives the URL, it goes in the dataset so it can be
recommended later.

1. Watch it with `/watch` (transcript first via `clip_transcript.py`, then frames at the chart moments; a focused
   range beats a sparse full scan). Note what chart is on screen and the timestamp of each point.
2. One entry per reusable observation in `circumstances.json`. Log the video under `videos[]`. Record Mike's own remark
   about it verbatim in `mike_note` (flagged entries sort first in `scan`).
3. **Check the creator's claims before saving them**, so Mike never repeats a bad number, never so he can rebut anyone.
   Compute from `market_data.py` when it is a market number; open the page otherwise. Set `status` honestly: `verified`, `partly-verified` or `unverified`. A claim that fails or could
   not be checked goes in `careful`, never in `numbers`. Example from the first ingest: Cowen's Caterpillar example
   checked out, while 3M and Ford could not be confirmed.
4. Give it a trigger in `when.checks` (below) and at least one tab. Add a new series to `market_data.py` if a trigger
   needs one.
5. `discussion.py lint`.

Entry kinds: `precedent` (this happened before, here is how it played out) · `pattern` (a statistic across many cases)
· `recurring-chart` (a chart worth a look whenever it has something to say) · `claim-check` (a circulating claim and
what the primary source says, for Mike's own accuracy, never an on-camera correction).

### Triggers (`when.checks`)

| Type | Fires when | Params |
|---|---|---|
| `midterm_window` | within N days after a midterm | `days` |
| `fed_hike_within` | the Fed's latest move was a hike within N days | `days` |
| `drawdown` | a series is N% or more below its high | `series`, `min_pct` |
| `day_drop` / `day_jump` | the last session moved N% or more | `series`, `min_pct` |
| `level_above` / `level_below` | a series crossed a level | `series`, `value` |
| `near_sma` | within N% of a weekly SMA | `series`, `weeks`, `within_pct` |
| `near_low` | at or within N% of a date window's low | `series`, `start`, `end`, `within_pct` |
| `manual` | needs a person or a logged-in browser | `question` |
| `always` | a standing tab | `note` |

`when.match` is `any` (default) or `all`.

## Flow B: A SESSION (Mike wants to record)

1. **Feeds.** `discussion.py scan` · `node video-creation/topic-radar/build-dashboard.js --days 7` (outlets, watchlist
   creators, sites, Polymarket; read `articles.json` and the dashboard's tabs) · web search on the week's stories and
   on Mike's stack (`persona/persona.json` `stacking_lineup`). Read recent titles in `schedule-tweets/data/longs.json`,
   `shorts.json` and the latest `repurpose/output/*-lane3-plan.json` so nothing is repeated. Search his transcripts for
   his prior stance on the subject.
2. **Selection filter:** `topic-radar/PLAYBOOK.md` (named entity, trending, contested, verifiable, ties to his thesis).
3. **Write `media/<session>/TOPICS.json`** (`<session>` = `YYYY-MM-DD-slug`). A broad "what can I talk about" is `shape: menu`,
   10 to 15 candidates. When he names the coins or the subject it is `shape: plan`: write the video itself, around 15 minutes,
   Kaspa up front and any other coin kept short, with `coin` on each coin topic. Topics run in a suggested order. Each: `why_now`, `angle` (the turn back to his thesis),
   `tabs[]` in the order he would open them, `circumstances[]`. **The tab is the parent: `facts[]`, `careful[]` and
   `prompts[]` sit under the tab open while he says them** (Mike: "If I'm on a tab, I need to know what to talk about"). A
   topic's optional `no_tab` holds the same three for what he says to camera. A fact whose source is one of the tabs goes
   under that tab. A tab with nothing under it fails lint: find something real to say on it, or drop it. Optional `video`
   holds `titles[]` and `thumbnails[]` for the whole recording. Sourcing rules are the `data-researcher` agent's: open what
   you cite, date everything, primary sources first, never invent. Conditional language for anything unresolved. Then
   `discussion.py render`, and give him the `TOPICS.docx` path.
4. **HITL gate: Mike narrows `TOPICS.docx`.** He deletes what he does not want and tells me he is done. `discussion.py
   approve --from-doc`, then relay what it printed so he can see how his edits were read. `clips`, `tabs` and `RUNDOWN.md`
   refuse until then. A vague "continue" is not a ruling (memory: `feedback_clip_gate_needs_explicit_verdict`), and neither is
   an untouched document, which `--from-doc` refuses. If he rules in words instead, use `--order`.
5. **After approval:** act on every `NOTE`, `CHANGED` and `NEW TOPIC` it printed (a fact he reworded gets checked before it
   counts as verified), give every approved tab its `prompts[]` (short talking points in his spoken voice, never a script),
   build any local chart he approved, `discussion.py render`, `clips`, `tabs --check`, and read every screenshot in
   `_tab-check/`. A `WALL` or a clip `FAIL` gets fixed or flagged to him.
6. **Right before he records:** he says "open the tabs" (`tabs --open`). Re-pull anything live-drifting.

## The Word document (Mike, 2026-11-05)

He reads the list and cuts it down to what he wants to say. Markdown reads well only in preview, and the preview cannot be
edited, so `TOPICS.docx` is both the deliverable and the ruling: what is left in the saved file is what he approved
(`scripts/topics_doc.py`). Never hand him a list to narrow as markdown. **His `.docx` files open in LibreOffice by default**,
not Word (measured 2026-11-05), so any tip written in the document is for LibreOffice's Navigator.

The shape is the way he records: topic (Heading 1) > tab (Heading 2) > what to say while that tab is up.

| In the saved document | Means |
|---|---|
| A topic's heading is gone | Topic rejected |
| Order of the topic headings | Running order |
| A tab's heading is gone | Tab dropped, so a deleted clip never downloads |
| Order of the tab headings | The order he opens them |
| A fact or caution is gone | Dropped from the session |
| A line sits under another tab or topic | Moved there |
| A line sits above a topic's first tab | Said on camera with no tab |
| A line was reworded | The item stays, his wording is recorded and printed |
| A line matches nothing, or a comment | His note on that tab, carried into `RUNDOWN.md` |
| A new heading | A new topic or tab to find, never auto-approved |
| Title ideas still at the top | The titles he is considering |

Tracked changes work: a tracked deletion counts as deleted. `--from-doc` refuses while the file is open, because unsaved
deletions would be missed. Word locks the file, and LibreOffice leaves a `.~lock.TOPICS.docx#` beside it, so both are checked.
It can run again after he narrows further or restores a line.

**`render` never overwrites an edited document.** It keeps a hash of what it wrote, and any later save makes the file his.
If research changes after he starts editing, tell him rather than regenerating.

## Tabs

| Kind | What opens | Notes |
|---|---|---|
| `article` | the URL | `--check` catches login and paywall text. List the words to highlight with his Glasp tool in `highlights[]`, verbatim from the page, so they appear under the tab in the doc (Mike, 2026-11-07) |
| `chart` | TradingView, DexScreener, FRED, CoinGlass, ... | `show` says what to do on it. A TradingView URL sets symbol and interval only; he scrolls to the date |
| `x-post` | the permalink | Needs his X login, so `--check` skips it |
| `odds` | Polymarket, Kalshi | Read the live number on camera |
| `clip` | a local player page | See below |
| `local` | a chart or a single slide built from our data | For a chart only a paid site shows, build after approval. **A slide he asks for is ONE slide in one tab, never a slideshow (Mike, 2026-11-06: "I just want to have a tab open to a single slide").** It lives in `media/<session>/slides/` with its build script (the `yt-presentation` look, every number pulled from data at build time, no scrolling), and its `url` is the `file:///` path |

## Clips

The source link opens at the clip's first second, so Mike can watch before anything is downloaded. **Nothing downloads
before he approves.** Then `discussion.py clips` calls the canonical
`longform-edited/skills/clip-inserts/capture_clip_insert.py`: section-only pull with audio, 1920x1080 H.264 + AAC, Whisper
checks the words (`expect`). Its honesty rules apply here too: verbatim words from the audio, a context check against the
full source, the who / where / when band burned on the frame, and never a trim that changes the meaning.

**Find the window with `clip_transcript.py --phrase`**, which reads caption word timings without downloading anything.

**Each clip opens through a player page, never the bare mp4** (`write_player`). Chrome autoplays a directly opened video
with sound, background tabs included (measured 2026-11-05), so a window of clip tabs would all talk at once. The page
holds on the first frame until space or play. R returns to the start.

Target length is the quoted seconds, around 15 s, as Mike described it. Longer is flagged in the list for his call.

**Local paths stay off the stream:** Mike's OBS capture starts just below Chrome's address bar (Mike, 2026-11-05), so a clip
tab's `file:///` path is never visible and clips can stay in `media/<session>/clips/`.

## Format reference (Mike: "perfect example" of how he wants to make these)

**Money and I, 2026-11-04, 14:58** (https://youtu.be/RJ0W1lfgMrY): a source on screen roughly every minute, each one
fact and one take, returning to his face between them.

| At | On screen | What he does with it |
|---|---|---|
| 0:00 | Face | Hook, what is at stake |
| 1:04 | TradingView, 4h | Where price is right now, his earlier levels marked |
| 3:44 | X post | A post he liked, read aloud, then his take |
| 5:21 | X post (The Block) | News via a post: 50 companies object |
| 6:25 | Prediction market page | The odds as an argument |
| 6:57 | CoinGlass liquidation map | 7 day, then 30 day (Mike liked this one, 7:20) |
| 8:33 | Yahoo seasonality tab | A table read as an argument |
| 9:37 | TradingView chart | Support, broke, reclaimed |
| 10:41 | X post | Rich list thresholds |
| 11:14 | X post | DTCC 0.1% capture (Mike liked this one, 11:39) |
| 12:18 | Two more charts | His other coins |
| 14:26 | Face | Back to the thesis, sign-off |

**Benjamin Cowen, 2026-11-05, 15:18** (https://youtu.be/aYrDQOrtY3A): one precedent, a chart for it, three named parallels,
one closing question. His webcam stays on as a corner picture throughout. So a session can be many sources or one argument.

Money and I recorded at 80,600 and Bitcoin was 75,700 a day later. Live-market takes age fast: record close to publish.

**His packaging (40 uploads, Sep 24 to Nov 4 2026, around one a day, median 14:31):** the coin names carry the most, with
XRP/XLM/HBAR at a median 7,011 views against 2,759 for memecoins, so on Mike's channel Kaspa has to do that job. "Rich",
"retire" and "legends" median 7,011 against 2,532 for "millionaire", partly because the millionaire titles are newer. He reuses
winning titles verbatim. A stated payoff, a deadline, then an urgency tag. Thumbnails are 2 to 5 heavy words, usually not the
title's, one pose, logos as the "this is about your coin" signal.

**"We are here" (Mike, 2026-11-06: "he shows something on the chart from 2022 and says 'we are here'... And Ben Cowen even more
so"):** scroll to a moment on a past chart, circle it with the brush, say "we are here", then come back to this week. Zack
Ventura does it through the whole of https://youtu.be/tmGIboohoXI, and Cowen builds whole videos on it. Every plan has at least
one (a tab whose `show` starts "We are here", checked in code), and each coin should get its own moment from its own chart.
Compute both sides from `market_data.py`. It is about the move and the liquidity, not the calendar, because Mike rejects the
four-year cycle. Say "last time", never "this time it will".

**Inspiration (Mike, 2026-11-06):** Zack's moves are worth borrowing: put the viewer inside the moment ("you're seeing it, you're
feeling it"), name the feeling, and stay warm. Rewrite in Mike's words instead of copying, keep the standing lines in the
`inspiration-lines` dataset entry, and grow it. His targets (300x, 10x), "final dip" certainty and cycle reasoning stay out.

**A session in this shape:** a `video` block with `titles[]` and `thumbnails[]`, a topic that opens on his face (a `no_tab`
with `prompts[]`, no tabs), a source on every other beat, and a close back on his face with the motivational lines. Motivation
is about patience and doing the reading, never a guaranteed outcome. Use his own recorded words where they exist.

## Hard rules

- **Never call out another creator (Mike, 2026-11-05: "I'm not going to talk about another influencer and say they were wrong
  about something. I wouldn't do that").** No correction segment, no "X said this but actually", no holding anyone to a call, no
  "what he left out", no agree-or-push-back framing, on Money and I, Cowen or anyone else. Creators are in the dataset because
  they gave Mike something to use. If a claim fails the check, it simply never comes out of his mouth: a private `careful` note
  at most, with no on-camera line. `lint` rejects this wording in titles, angles and spoken lines.
- **Bullish by default, because the coin's fans are watching (Mike, 2026-11-05: "they have to be excited to watch it").** Every
  coin topic carries `prompts[]` with why to be bullish and inspiring lines, written before approval, using his own recorded
  words where they exist. Fact-check them like any fact, including after a price move. Keep a coin's strengths up front, and
  `careful` to what stops a false line. Excitement never becomes a price promise. Motivational lines go in `inspiring[]`, which the doc labels in green, so Mike can spot them at a glance (2026-11-06).
- **Tabs are runtime, because he stops and talks at every one.** Money and I runs around 12 sources in 15 minutes, one fact and
  one take each, and a double or triple-length video is the failure. A `shape: plan` session (he named the subject) is capped in
  code at 12 tabs, 3 facts and 2 cautions a tab, and no coin except Kaspa over a third of the tabs. A `shape: menu` session
  (a broad list he narrows) can run long, so its doc says how long and `approve` prints the length of what he kept. A deck
  sets its own `minutes`.
- **Crypto channel persona applies** (`persona/persona.json`): no em dashes, "around" not "about" for numbers, never
  "honest", "50-week SMA" spelling, verified claims only, no bear-case section in a bullish video.
- **Mike rejects the four-year cycle.** A midterm-year or seasonal pattern is shown as data with a macro cause, never as a
  rule he follows. His stance: `repurpose/transcripts-ad-hoc/2026-05-13_krc20-mania-revival.txt` at 9:35.
- **Do not re-announce.** Check recent output first. A topic he already covered gets only what is new.
- **ElizaOS is off the list** entirely (persona `avoid_in_drafts`).
- **Reading X uses the shared `xbot-profile`:** never while a posting script runs, read-only, one script at a time.
- **Never kill or restart Mike's Chrome.** `--check` uses a throwaway profile.

## Known limits

- **`python-docx` is required** for `render`. On a fresh machine: `pip install --no-deps --no-cache-dir python-docx` (its
  `lxml` and `typing_extensions` must be there too).
- **`--from-doc` was tested on files saved by Word and by LibreOffice** (delete, move, reword, comment, tracked changes), with
  the edits made by automation, not by hand in LibreOffice's Navigator. Those save the same kind of file, but his first real
  narrowing is still the first by hand. A stale `.~lock` after a LibreOffice crash also reads as open until it is deleted.
- **CoinGlass:** headless browsers need a normal User-Agent (it 404s `HeadlessChrome`), and the chart sits behind "Log in
  to unlock full data", so there is no live reading without Mike's login. Be logged in before recording, and dismiss the
  cookie bar.
- **FRED** drops the connection on a browser User-Agent, so `market_data.py` sends a plain one. Yahoo needs the browser one.
- **`scan` reads daily closes.** During market hours the last value is partial. BTC's "close" is a UTC day.
- **The radar's X policy cache** only refreshes with `topic-radar/fetch-x-policy.py`.
- **`tabs --open` has not been run against Mike's real Chrome** yet. The player page was tested in a separate Chrome profile.
