# linkedin-automation — folder orientation (auto-loaded)

_What this folder is and the rules that bind every run. **This file points; it does not
duplicate.** Canonical detail lives in the files cited below — they win on conflict._

## What this is

A small toolkit to **grow a targeted LinkedIn connection list from a group**: find a
group's members, keep the ones in target regions, invite them with a note, track who
accepts, then deepen the accepted connections (endorse their skills + ask for
endorsements back). It drives Mike's own logged-in LinkedIn session via Playwright +
system Chrome (persistent profile `li-bot-profile`), mirroring the human-timing /
persistent-profile pattern of the `schedule-tweets` posting scripts.

## Read these first (canonical sources)

| File | Role |
|---|---|
| [`PROJECT-LOG.md`](PROJECT-LOG.md) | **Start here for STATUS** — running history, current counts, restriction history, decisions. Update it after every run. |
| [`skills/SKILL.md`](skills/SKILL.md) | Toolkit index + the **shared foundation** (`lib/_li-session.js`) + the **LinkedIn limits** every skill depends on. |
| each `skills/<skill>/<skill>.md` | Per-skill detail (how it reads the DOM, troubleshooting, its probe). |

## The scripts (run from REPO ROOT)

| Script | Lane / job |
|---|---|
| `python graph/run.py --names "A,B,C" [--group=<id>]` | **Seed the queue by name — via the Lane 1 LangGraph graph (canonical since 2026-07-28).** Wraps the blessed `seed_by_name.py` untouched, verifies the queue delta from disk, halts (no retry) on restriction/failure, checkpoints to `data/graph_checkpoints.sqlite`. `--stub ok\|restricted\|fail` = browser-free structural test. Design: `graph/DESIGN.html`. Direct `python skills/scrape-group-members/seed_by_name.py --group=<id> --names="A,B,C"` remains as fallback. _Seeder port blessed 2026-07-23; graph blessed 2026-07-28; `seed-by-name.js` = frozen rollback._ |
| `python graph/run.py --lane 2 --max N` | **Process the queue — via the Lane 2 LangGraph graph (canonical since 2026-07-28).** Visit the next N unprocessed profiles, read location, classify, capture target-region members into `data/members.json`. Each profile = 1 view against the volume budget. The graph wraps the Python port (`scrape_group_members.py`, blessed live 2026-07-28), verifies the disk delta, kill-switches on 5 consecutive profile errors, halts on restriction phrasing, and always ends with the REGIONS breakdown. `scrape-group-members.js` = frozen rollback. |
| `skills/request-connections/request-connections.js --max=N` | **Invite.** Send a connection request + note to N not-yet-contacted members from `data/members.json`. Each = 1 profile view. No fixed daily cap (rescinded 2026-07-28) — `--max` set per Mike's instruction each run. |
| `skills/check-connections/check-connections.js` | **Track acceptances.** Scan the My Network connections list, stamp `connected_on` + `contact_status: connected`. One list page — cheap. |
| `skills/endorse-and-message/endorse-and-message.js --max=N` | **Endorse + ask back.** For accepted connections (oldest first): endorse a random 9-15 of their top skills, then send THE one sanctioned favor-request DM. Zero endorsable skills = abandon (no DM), marked `no_skills`. Each member = 1 profile view. **No one-DM-per-day cap** — send to ALL members connected >14 days ago (set `--max` to cover them); fallback = one member ≥7 days if none are older. `--max` default 3 is a floor, not a ceiling. |
| `skills/check-endorsements/check-endorsements.js` | **Track endorse-backs.** Read OUR OWN skills page's endorser overlays, record who endorsed each skill into `data/endorsements.json` (`first_seen` = observed date; LinkedIn shows no real date, so run often), stamp `endorsed_back` onto matching members. Own profile only — 0 member profile views, run freely. |

Typical lifecycle: **seed → scrape (≤50/day) → invite (per Mike's ask that run, no fixed cap) → check (freely) → endorse+DM (ALL members >14 days connected — no DM-count cap; volume is the only limit) → check-endorsements (freely, every run day)**.

## HARD RULES (do not violate — the account has been restricted twice; a 3rd strike risks a permanent ban)

- **VOLUME is the binding limit.** Total profiles accessed over time, regardless of HOW
  you navigate. Restriction hit at ~120 views/24h on 2026-06-27.
  - **Scraping ≤ 50 profile views/day**, one run/day.
  - **Inviting: no fixed daily cap** (Mike rescinded the earlier 10/day self-imposed
    limit on 2026-07-28) — set `--max` to whatever Mike asks for that run, watching
    total combined volume against the ~120/24h restriction threshold.
  - **Don't stack** a big scrape AND a batch of invites the same day if it pushes total
    views high. Acceptance checks are cheap (one list page) and don't count meaningfully.
- **STOP on any restriction / "unusual activity" page** — for the rest of the day. The
  scripts detect it and stop themselves; never override and re-run.
- **One Chrome instance only.** `li-bot-profile` is single-instance — **never run two of
  these scripts at once.** Run lanes strictly **sequentially**.
- **One attempt per run; read the log, never blindly relaunch.** If a script seems stuck,
  read its output and diagnose — relaunching collides on the shared profile.
- **Reach profiles via search-and-click, never bare `goto(profileUrl)`.** This is built
  into `lib/_li-session.js` (`searchAndOpen`) — do not remove it; bare back-to-back
  profile loads are a flagged signature.
- **Pacing is deliberately slow** (30-90s between profiles, a 90-180s break every 18,
  wide gaps before every invite click). Do not tighten it.
- **One sanctioned DM, nothing else.** The only direct message any script here sends is
  `endorse-and-message.js`'s FIXED favor-request template (Mike, 2026-07-02), sent only
  to a member who already accepted our connection request AND whose skills we just
  endorsed — never a cold DM, never a composed/variable message. The only other text
  sent is the invitation note in `request-connections.js`.

## Data files (`data/`)

- `groups.json` — group registry `{ group_id, name, url, members_url, status, searched_names? }`.
- `members-urls.json` — work queue `{ profile_url, processed, group_id }`; `processed` is the resume point.
- `members.json` — deliverable + outreach state `{ profile_url, location, group_id, contacted, contacted_at, contact_status, connected_on, endorse_status, endorsed_at, endorsed_count, dm_status, dm_sent_at, endorsed_back, endorsed_back_on, endorsed_back_skills, endorsed_back_count }`.
- `endorsements.json` — incoming-endorsement registry, append-only, one record per (skill, endorser) with `first_seen` observed date (members AND non-members).

Edit JSON with **Node, never PowerShell `ConvertFrom/To-Json`** (mangles emoji) — same as
the repo-wide rule.

## Status snapshot

For live counts (queue remaining, members captured, who's contacted/connected) read the
top of [`PROJECT-LOG.md`](PROJECT-LOG.md), not this file — this file is evergreen.
