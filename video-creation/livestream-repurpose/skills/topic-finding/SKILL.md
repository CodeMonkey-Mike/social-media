# Find topics in the transcript (Phase 3) (livestream-repurpose track skill - CANONICAL)

_Moved VERBATIM from `video-creation/SKILL.md` on 2026-07-08 (Mike: per-track skills live in the track folder; this predates that convention). **This file is now canonical**; the master SKILL.md keeps a pointer stub and the phase-map table points here. Paths inside are written relative to `video-creation/` exactly as in the original._

## Phase 3 — Find topics in the transcript

### Default method: 90-second chunk-and-group

**Do NOT do a single holistic read — it skips topics.** (Real miss, 2026-05-23: a one-pass read of the Weekend Red stream missed a SUI segment entirely and under-weighted Kaspa; a 90s chunk pass caught SUI plus 4 more gems.) Instead:

1. **Chunk** the Whisper JSON into **90-second windows** (preserve each window's start/end). 90s is the right size: each window holds 1–2 topics, so tagging is precise and hook boundaries stay tight. Bigger windows (3 min) blend topics together and bury the punchy 10–15s moments.
2. **Tag each window independently** — list the topics it covers, even briefly. Going window-by-window forces attention so nothing gets skipped.
3. **Group by topic** — merge windows sharing a topic into one entry with multiple timestamp ranges. This re-joins any topic split across a 90s boundary, so smaller-then-merge is strictly safer than larger chunks.
4. **Output:** "here are N topics; topic X appears in M segments" — feeds straight into Phase 4 multi-snippet cutting.

Background: `Chunk Possibilities.md`. After building the inventory, apply the short-worthiness criteria below to filter it. (A generated 90s-window transcript like `livestream-repurpose/transcript_chunks_90s.txt` is the working artifact for the tagging pass.)

### Read the whole transcript — via the chunks

Don't sample. Work through every 90s window before finalizing the topic list. Topics that seem minor early in the stream often pay off later, and the best hooks are frequently not in the first few minutes.

### The multi-snippet rule

**A topic does not have to be a single contiguous block of the transcript.** If Mike discusses the same subject at multiple separate points in the livestream — even 30 or 40 minutes apart — every one of those segments is valid source material for a single short.

The editor's job is to find the best version of each moment across the whole stream, not just the first time it comes up. A short built from three non-contiguous clips that each hit the same thesis is often stronger than one built from a single uninterrupted passage.

When identifying a topic, note every timestamp range where Mike touches it, even briefly. The production phase can then choose which clips to use and in what order.

### What makes a topic short-worthy

A topic is worth surfacing if it has all three of these:

1. **A hook that earns a scroll-stop.** A specific number, a named opponent, a contradiction, a strong outcome, or a personal story with stakes. Vague takes ("crypto is going to be big") don't qualify.
2. **Self-contained meaning.** Someone who never watched the livestream should be able to understand and feel the point of the short without prior context.
3. **Emotional or tribal energy.** Mike's delivery has to be live in at least one of the clips — conviction, anger, humor, excitement, or disbelief. Flat explainer segments without energy don't carry a short.

### Content priority — lead with hype and conviction, NOT market-state recaps (Mike's standing preference, added 2026-06-11)

**Rank hype / project / philosophical / inspiring clips ABOVE time-bound market-data clips. This is a repeated, explicitly-flagged miss:** a first pass on a stream tends to over-pick news-like clips (what just happened in crypto, the current CPI/jobs/Fed print, what the chart or market is "about to do", recent headlines, double-bottom calls) and under-pick the project-hype and inspirational moments Mike actually wants to lead with. He was "surprised to see basically nothing" hype/project-oriented in a first selection. Do not repeat that.

Prioritize, in this rough order:
1. **Project hype** — bullish, excited takes on named projects Mike champions (Kaspa, ElizaOS, $TAO, $TON, Linea, Housecoin, and community calls/wins like the LAB 353x). If he gets genuinely hyped about a project, that is a clip — even a short one.
2. **Philosophical / inspiring / motivational** — conviction, tribal identity, "stick through the pain and you win," fair-launch / decentralization ethos, the long-game vision. Evergreen and shareable, not tied to this week's candle.
3. **Tribal contrast** — Mike vs a named group (four-year cycle zombies, BTC maxis).

De-prioritize (clip these ONLY when they carry strong hype/conviction/tribal energy, NEVER as a flat readout):
- News-like recaps of recent crypto/market events ("here's what happened this week", a fresh CPI/jobs/Fed print, an exchange or Saylor headline).
- Current market-state commentary and chart/price predictions ("what the market/charts are going to look like", "we hit a double bottom", "where BTC goes this summer").

These macro/data segments go stale in days and are low on hype; a batch made of only these is the failure mode. Macro earns a clip ONLY when it is really a conviction / tribal / philosophical take wearing a macro coat (e.g. the four-year-cycle-zombie thesis), not a data readout. When in doubt, pick the moment that makes a viewer FEEL something or want to ape a project, not the moment that reports a number. (This sharpens criterion 3 above and the "Topic types that work best" ranking below — apply it as the tie-breaker on every batch.)

### What does NOT make a topic short-worthy

- **Stream housekeeping — the opening welcome / greeting and the closing sign-off.** "What's going on, how's everybody doing, let me welcome all the [X]," and the end-of-stream "alright that's it for me, click the link, catch you later." These have NO substance — no claim, number, or argument to react to — so they NEVER make a clip on their own, no matter how on-brand the phrasing sounds (e.g. "welcome all the four-year cycle zombies" is a greeting, not a take). The *thesis* a welcome gestures at is the clip; the welcome itself is not. Skip them by default.
- Segments that are primarily audience interaction ("what's going on Brian?", chat responses, shoutouts) unless there's a payoff moment embedded in them
- Technical jargon runs that Mike himself says he doesn't fully understand — unless paired with a "here's what it means for your money" moment
- Price predictions with heavy hedging ("we'll see, we'll see, who knows") — these don't give the viewer something to react to
- Segments that rely on a screen share that can't be recreated with static b-roll

### How many topics to surface

Surface **5–10 topics** per transcript. Fewer than 5 means you're undershooting what's in a typical 2-3 hour stream. More than 10 becomes overwhelming to review.

For each topic, provide:
- A short title (4–8 words). **Match the title's tense to the tense Mike uses for the core claim
  in that clip.** If he recounts something as a completed past event ("it *was* the opposite of how
  it's always been," "we *did* a 353x"), the title is past tense ("Zombies *Were* Selling Into the
  Crash"). If he frames it as still-true / ongoing ("the economy *is* the strongest since 1948"),
  keep it present. This is tense FIDELITY, not a blanket switch to past — a present-tense title on a
  past-tense recount misleads the viewer into thinking it's happening live, and a past-tense title on
  a still-true claim drains the urgency. Check the clip's actual verbs before titling.
- A one-sentence hook summary using Mike's actual words or framing (same tense-fidelity rule applies)
- Every timestamp range in the transcript where he touches the topic
- A note on whether it needs multi-snippet assembly or is a single contiguous block
- **Peak beat(s):** within the topic's run, flag the single most impactful 5–15s moment(s) — the line that hits hardest — with its own timestamp(s). This is identification only; capture it now while you're reading the whole transcript, because it's the seed for a short high-impact cut variant in Phase 4 (see length variants there). A topic can have more than one peak beat.

### Topic types that work best for Mike's shorts

In rough order of past performance:

1. **Tribal contrast** — Mike vs a named group ("four-year cycle zombies", "BTC maxis", "the stable coin crowd"). Highest engagement because it gives viewers a side to pick.
2. **Personal conviction story** — Something Mike did or believed that turned out wrong or right. The excavator story, cashing out BTC to buy Kaspa. Relatable and shareable.
3. **Data-anchored take** — Specific numbers that land hard: 98x on LAB, 80% of poll chose Kaspa, 4 years of contractionary territory never seen since 1948. Credibility + scroll-stop.
4. **Outsized prediction with a reason** — "$3 Kaspa is realistic. Here's why." Not just the claim; the reasoning is what earns the share.
5. **Technical thing explained plainly** — "You keep hearing about covenants. Here's what it actually means for your money." Works when Mike's plain-English explanation is vivid.
6. **Analogy-anchored thesis** — Mike Tyson / Buster Douglas / Kaspa. The slingshot. When the analogy is strong enough to carry the visual.

---
