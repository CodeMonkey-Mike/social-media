# LinkedIn Connection-Builder — Setup & Operating Guide (Mac)

You received a zip of a small, battle-tested toolkit that grows a targeted LinkedIn
connection list from a LinkedIn group, safely and slowly, driving **your own logged-in
LinkedIn session** in a real Chrome window via Playwright. It was built and hardened on
Mike's account over two months (including two temporary account restrictions that taught
it its speed limits — those lessons are baked into the code as pacing and daily caps).

It is designed to be operated **with Claude Code as your copilot**: you open Claude Code
in this folder every morning and say what to run; Claude runs the lanes, reads the logs,
and reports. The bundled `CLAUDE.md` file teaches your Claude everything it needs — you
should not need to explain the system to it.

**How to use this guide:** work through Parts 1-5 once, top to bottom, with Claude Code
open in the folder ("help me work through SETUP-GUIDE.md" is a fine first prompt). Parts
6-8 are your daily reference.

---

## Part 0 — What the system does (2-minute version)

Five "lanes", run one at a time, each a small LangGraph graph with verification built in:

| Lane | Name | What it does | Cost against the daily budget |
|---|---|---|---|
| 1 | **seed** | Searches a first name (e.g. "Albert") in the group's member list and captures every matching member's profile URL into a work queue. | ~0 (search result pages, not profile visits) |
| 2 | **scrape** | Visits queued profiles one by one (slowly, like a human), reads their location, keeps the ones in your target regions. | 1 profile view each |
| 3 | **invite** | Sends a connection request **with a personal note** to captured members. | 1 profile view each |
| 4 | **check** | Scans your "My Network" connections page and records who accepted. | ~0 (one list page) |
| 5 | **endorse** | For connections older than 14 days: endorses 9-15 of their skills, then sends ONE fixed favor-request DM asking them to endorse you back. | 1 profile view each (heaviest lane) |

Plus a sixth tool, `check-endorsements` (still JavaScript), which reads **your own**
skills page and records who endorsed you back. Free to run.

Lifecycle: seed → scrape → invite → check → endorse → check-endorsements, every morning.
A local dashboard (http://localhost:8766) shows live lane progress, run history, and
your profile-view budget for the day.

**The one number that matters:** LinkedIn restricts accounts on *volume* — total
profiles accessed per day, no matter how politely. Mike's account was restricted at
~120 profile views in 24h. All limits in this system exist to stay far under that.

---

## Part 1 — Prerequisites (before touching the code)

1. **A Mac** with **Google Chrome** installed (the scripts drive your installed system
   Chrome — not a bundled browser).
2. **Claude Code** installed and signed in (`npm install -g @anthropic-ai/claude-code`,
   then `claude` in a terminal — or the desktop app).
3. **Python 3.11+** (`python3 --version`) and **Node.js 20+** (`node --version`).
   Node is only needed for the `check-endorsements` tool, which hasn't been ported to
   Python yet.
4. **Your LinkedIn account, in good standing.** All activity happens as you.
5. **Join the target group** and wait until you're approved as a member — the member
   list is invisible to non-members, and Lane 1 cannot run without it:

   > **Engineering & Management group: https://www.linkedin.com/groups/1954246/**

6. **LinkedIn Premium (strongly recommended, likely required).** The invite lane always
   attaches a personal note, and it never sends a bare invite. Free accounts have a very
   small monthly allowance of personalized-note invites; Premium removes that problem.
   If you stay on free, expect Lane 3 to hit the note limit quickly — the script detects
   it, stops cleanly, and tells you.

---

## Part 2 — Install

Unzip the bundle somewhere permanent, e.g. `~/linkedin`, then in a terminal:

```bash
cd ~/linkedin

# Python environment
python3 -m venv .venv
source .venv/bin/activate
pip install playwright langgraph langgraph-checkpoint-sqlite

# Node (only for check-endorsements)
npm init -y
npm install playwright
```

Notes:
- No `playwright install` browser download is needed — the scripts launch your system
  Chrome (`channel: "chrome"`).
- Remember `source .venv/bin/activate` in each new terminal (or ask Claude to handle it;
  it will see the `.venv` folder).

---

## Part 3 — One-time adaptations (do these WITH Claude Code)

The code arrives configured for Mike: Windows paths, his group, his invite note, his DM.
Open Claude Code in the folder and ask it to make these six changes. Every location is
listed precisely so this is a 10-minute job.

### 3a. Chrome profile directory (2 files — they MUST point to the same folder)

The bot uses a dedicated persistent Chrome profile so your LinkedIn login sticks between
runs. Both the Python and the JavaScript session libraries hardcode Mike's Windows path;
change both to the **same** Mac path, e.g. `/Users/<you>/li-bot-profile`:

- `lib/li_session.py` — the `CHROME_PROFILE = r"C:\Users\mnede\..."` line near the top.
  Good replacement: `CHROME_PROFILE = str(Path.home() / "li-bot-profile")` (it already
  imports `Path`; if not, add `from pathlib import Path`).
- `lib/_li-session.js` — the `const CHROME_PROFILE = 'C:\\Users\\mnede\\...'` line.
  Replacement: `const CHROME_PROFILE = require('os').homedir() + '/li-bot-profile';`

The folder is created automatically on first launch. **Never** run two scripts against
this profile at once — it is single-instance.

### 3b. Default group id (3 places: `6665791` → `1954246`)

- `graph/run.py` — the `--group` argument default (`ap.add_argument("--group", default="6665791", ...)`).
- `skills/scrape-group-members/seed_by_name.py` — `GROUP_ID = flag("group", "6665791")`.
- `graph/lane_graph.py` — `group_id = state.get("group_id", "6665791")`.

(You could instead pass `--group=1954246` on every Lane 1 run, but editing the defaults
once removes a daily chance to forget.)

### 3c. Your invite note (REQUIRED before Lane 3 ever runs — ready-made text below)

`skills/request-connections/request_connections.py`, the `MESSAGE = "..."` constant.
The shipped text is Mike's ("...same AI automation group..."). Have Claude replace it
with this ready-made version (or tweak the wording to taste — keep it under 300
characters, no links, warm and low-pressure, with the shared group as the reason):

> Hello there, I noticed we are in the same engineering and management group. I am
> trying to build my connections list, and just wanted to see if I can connect with
> some like-minded people.

### 3d. Your Lane 5 favor-request DM (YOU write this one — Lane 5 is blocked until then)

Two weeks after someone accepts, Lane 5 endorses their skills and sends ONE follow-up
DM asking them to endorse you back. The shipped template is Mike's **personal career
story**, his name, and his skills-page URL — it cannot be sent from your account, and
unlike the invite note it can't be ghostwritten: the story only works if it's true.

**Type out your own version yourself** (a few sentences: the greeting "Hi <FirstName>,"
is added automatically; then *your* honest "why I'm building my profile" story, the ask
to endorse some of your top skills, your skills link
`https://www.linkedin.com/in/<your-slug>/details/skills/`, "I just endorsed you", and
your sign-off). Give the text to Claude and it will install it into the two constants
near the top of `skills/endorse-and-message/endorse_and_message.py` (`MESSAGE_INTRO`
and `MESSAGE_BODY_LINES`).

Your Claude is instructed (in `CLAUDE.md`) to **refuse to run Lane 5 until you have
provided this text**. Everything else works without it, and Lane 5 has nothing to do
in your first ~3 weeks anyway — but write it early so it never blocks a morning.

### 3e. Target regions (optional — review, then keep or edit)

Lane 2 keeps only members whose location matches a target zone. The zones live in
`skills/scrape-group-members/scrape_group_members.py` in the `ZONES` dict:
`europe`, `north_america`, `south_america`, `caribbean` — each a keyword list of
countries/states/metros. Members that match nothing are marked processed and skipped.
If those regions suit you, change nothing. If not, have Claude edit the lists.

### 3f. Dashboard page (2 small edits in `dashboard/langgraph.html`)

- In the `AUTOMATIONS` config block, the `lanes:` list marks lane 1 `retired: true`
  (Mike finished seeding his group). Set it to `retired: false` — you seed daily.
- In the left nav near the bottom of the file, delete the
  `<a href="index.html">... Social</a>` line — that page is part of Mike's larger
  system and isn't in your bundle.
- (Optional) in the same block, the budget `note` says "the level that restricted this
  account twice" — that's Mike's history; reword or keep as a warning.

---

## Part 4 — First run: log in once, then seed the letter A

Everything resumes safely and all state lives in `data/*.json`, so nothing here is
scary. Two steps:

**1. Structural test (no browser, no data written):**

```bash
python3 graph/run.py --stub ok
```

You should see the Lane 1 graph run end-to-end with fake data and exit 0. This proves
Python, LangGraph, and the graph wiring are healthy.

**2. Real first seed — this is also your one-time login:**

```bash
python3 graph/run.py --lane 1 --names "Albert,Andrew,Anthony,Amanda"
```

A Chrome window opens with no LinkedIn session. **Log in manually in that window**
(you have 5 minutes; 2FA is fine). The script detects the login and continues: it opens
the group's member list, types each name into the "Search members" box, scrolls the
results until they stop growing, and records every matching member into
`data/members-urls.json`. Expect a few hundred queue entries — LinkedIn substring-matches,
so "Albert" also captures Alberto, John Albert, etc. That's the point.

From now on the session persists in the profile folder; you won't log in again unless
LinkedIn expires it.

Afterwards, look at `data/groups.json`: the four names now appear in `searched_names`.
That file is the seeding progress tracker (see Part 6).

---

## Part 5 — The dashboard

```bash
python3 dashboard/serve_dashboard.py
```

Open **http://localhost:8766**. You get the LangGraph page: which lane is running right
now (live, node by node, member i/N), today's profile-view budget, and the full run
history. Leave it running in a spare terminal; it's read-only and can't break anything.

---

## Part 6 — The daily routine (the "morning contract")

Each morning, open Claude Code in the folder and tell it what to run. The bundled
`CLAUDE.md` teaches it the exact commands, the letter-rotation rule, and the safety
rules — so plain English is enough:

> "Run the morning lanes: lane 1 next letter, lane 2 forty, lane 3 ten, lane 4,
> then check endorsements."

What that means, lane by lane:

**Lane 1 — seed the next letter (while letters remain).**
`data/groups.json` holds `names_to_search` — a proven, alphabet-covering list of 128
common first names (4-6 per letter, A through Z) inherited from Mike's runs — and
`searched_names`, which the seeder fills in automatically as it goes. The rule your
Claude follows: **the next letter is the first letter, in A→Z order, that still has
planned names not yet in `searched_names`; seed all of that letter's remaining names in
one run.** One letter per day ≈ 26 seeding days, then Lane 1 is simply done and you skip
it. Seeding costs ~0 profile views, so it stacks fine with the other lanes.

**Lane 2 — scrape:** `python3 graph/run.py --lane 2 --max N`. Hard ceiling **75/day**,
and lower it on days with many invites (shared budget — see Part 7). The run report ends
with a REGIONS breakdown of what was captured.

**Lane 3 — invite:** `python3 graph/run.py --lane 3 --max N`. N is your call each
morning; 10-15 is a sensible steady state, start smaller the first week. Each invite is
a profile view. LinkedIn also enforces its own weekly invite cap (~100/week) — the
script warns loudly when it hits it.

**Lane 4 — check acceptances:** `python3 graph/run.py --lane 4`. Takes no number,
costs nothing, run it every day (it reads only the ~20 most recent connections, so
frequency is what gives coverage).

**Lane 5 — endorse + DM:** `python3 graph/run.py --lane 5`. **No number** — the code
derives who qualifies from a mechanical rule (everyone connected >14 days ago; else
exactly one member in the 7-14-day band; else it refuses to run, before Chrome even
opens). Only run after your DM is rewritten (3d). This lane naturally does nothing for
your first ~3 weeks, since nobody will be 14 days connected yet.

**Check endorse-backs:** `node skills/check-endorsements/check-endorsements.js`.
Reads your own skills page only, free, run every day you run anything else.

**After the runs:** have Claude append a dated entry to `PROJECT-LOG.md` (counts,
anything odd). That log is the memory of the system — future sessions, and future
debugging, start there.

The first ~2 weeks look like: seed a letter + scrape 40-75 daily. Invites start once a
few hundred members are captured. Acceptances trickle in over days; Lane 5 wakes up in
week 3.

---

## Part 7 — Hard safety rules (inherited from two real restrictions — do not bend them)

Mike's account was temporarily restricted twice in June 2026 learning these numbers.
Your account starts with a clean history; keep it that way.

1. **Volume is the binding limit.** Stay well under ~100 total profile views/day
   (scrape + invite + endorse all count; seed and check ~don't). The known restriction
   level is ~120/24h.
2. **STOP for the day on any restriction / "unusual activity" page.** The scripts
   detect these and halt themselves — never override, never re-run "to check".
3. **One Chrome instance, lanes strictly sequential.** The bot profile is
   single-instance. Never run two scripts at once, ever.
4. **One attempt per run.** If something looks stuck, read the log output and diagnose —
   never blindly relaunch (a relaunch collides with the still-open Chrome profile).
5. **Never navigate straight to profile URLs.** The code reaches every profile via
   search-and-click, like a human. Don't "simplify" that away — bare back-to-back
   profile loads are a known flagged signature.
6. **Don't tighten the pacing.** The 30-90s gaps, the long breaks every 18 profiles,
   the slow typing — all deliberate. A faster bot is a banned bot.
7. **One sanctioned DM only.** The only message the system ever sends is Lane 5's fixed
   favor-request, to someone who already accepted your invite and whose skills you just
   endorsed. No other DMs, no improvised messages.
8. **Edit `data/*.json` only via the scripts, Python, or Node** — never by hand in a
   rich editor that might mangle encoding, and never with tools that reserialize
   unicode (emoji live in some fields).

---

## Part 8 — Troubleshooting

- **"NOT LOGGED IN" and a Chrome window waiting** — expected on first run or after
  LinkedIn expires the session: log in manually in that window; the script continues by
  itself.
- **A lane halts with a restriction message** — that's the safety system working.
  Nothing is lost; the queue resumes tomorrow. Stop all lanes for the day.
- **A selector stops working** (LinkedIn redesigns constantly): each skill folder ships
  `_probe-*.py` / `_probe-*.js` diagnostic scripts that dump the live DOM (tag +
  aria-label + text of every control). Have Claude run the relevant probe and fix the
  selector from the dump — never guess selectors. The two classic traps are documented
  in `skills/SKILL.md` ("Selector discipline").
- **Lane 5 "refuses" to run** — by design: either nobody qualifies yet (normal early
  on) or the derived batch is too big for one day and it wants an explicit `--max`.
  Read its message; it says which.
- **Where is everything?** `data/members-urls.json` = the work queue,
  `data/members.json` = captured members + all outreach state, `data/groups.json` =
  group + seeding progress, `data/endorsements.json` = who endorsed you back,
  `data/lane_runs.json` = run history (feeds the dashboard). `skills/SKILL.md` is the
  full reference; each skill's own `.md` file goes deeper.
- **The `.js` files next to the Python scripts** (e.g. `request-connections.js`) are
  frozen rollback copies from before the Python port. Never run them; they still carry
  Windows paths on purpose.

---

*Provenance: this system was built by Mike with Claude Code, June-August 2026. The
docs and code comments reference his account's history and decisions — treat those
numbers as inherited defaults, and treat YOUR `PROJECT-LOG.md` as the authoritative
record for your account from day one.*
