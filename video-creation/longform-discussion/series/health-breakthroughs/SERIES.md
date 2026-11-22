# Series: health and medical breakthroughs

_Mike, 2026-11-19. Crypto channel. A running series, not one video: talking points for a week's recording or a livestream._

**The idea:** medical progress is ramping up alongside the adoption of AI, one of the positive effects of AI on the economy
(Mike often talks about AI's effect on the economy). Chronological: one past month per episode, starting with January 2024,
then a short "this week" closer of real news from the last 7 days, so the series always lands on the present.

**What counts (Mike's rule):** FDA or EMA approvals, major trial readouts, papers in top journals (Nature, Science, NEJM,
Lancet and their family journals), firsts such as first-in-human. Any of these, as long as it was in the news that month.
Not health policy, funding or deals unless they are the breakthrough itself.

## Where things are

```
series/health-breakthroughs/
  SERIES.md          this file
  <YYYY-MM>/         one month = one session: TOPICS.json, TOPICS.docx (Mike narrows it), RUNDOWN.md after approval
```

A month is an ordinary session whose name carries the `series/` prefix, so every command works on it as is:

```
python scripts/discussion.py series health-breakthroughs                       # months done, AI share, next month
python scripts/discussion.py render  series/health-breakthroughs/2024-01      # TOPICS.docx
python scripts/discussion.py approve series/health-breakthroughs/2024-01 --from-doc
python scripts/discussion.py tabs    series/health-breakthroughs/2024-01 --check
```

## Doing a month

1. `discussion.py series health-breakthroughs` names the next month (the latest month folder + 1).
2. Research it into `<YYYY-MM>/TOPICS.json`: `shape: menu`, `channel: crypto`, 12 to 15 candidates in date order, then
   2 to 3 "this week" items marked `week: true`, last. Every topic carries `date`, `category` (approval / trial / paper /
   first), `ai` (yes / no) and `ai_how`; a title ends in " (AI)" when `ai` is yes, so he sees it at a glance in the doc.
   Tabs: the news article from that month, then the primary source (FDA release, journal page, company release).
3. Sourcing, the Word gate, the persona and the hard rules are `../../longform-discussion.md`, unchanged. Something that
   later went badly (a recall, a halted trial) goes in `careful`, so he never says a line that is no longer true.
4. `render`, give Mike the `TOPICS.docx` path, wait for his ruling.

## The AI share (the thesis as a number)

`ai` on every topic is what lets "medicine is speeding up with AI" be shown instead of claimed: `series` prints the count
per month. Once a few months are in, a `local` slide tab (one slide, built from the month folders) can chart breakthroughs
per month and how many involved AI. Build it when Mike asks for it.

## Pace

January 2024 to November 2026 is around 35 months, so at one month an episode the history reaches the present around
mid-2027. The "this week" closer keeps every episode current meanwhile. Two months an episode is the option if he wants
to catch up faster.
