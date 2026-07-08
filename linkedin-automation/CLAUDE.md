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
| `skills/scrape-group-members/seed-by-name.js --group=<id> --names="A,B,C"` | **Seed the queue by name.** For a large group, search member names in the group's in-page "Search members" box and capture every match into `data/members-urls.json`. Does NOT visit profiles. Records the searched names onto `data/groups.json`. |
| `skills/scrape-group-members/scrape-group-members.js --max=N` | **Process the queue.** Visit the next N unprocessed profiles, read location, classify, capture target-region members into `data/members.json`. Each profile = 1 view against the volume budget. |
| `skills/request-connections/request-connections.js --max=N` | **Invite.** Send a connection request + note to N not-yet-contacted members from `data/members.json`. Each = 1 profile view. Default/cap **10/day**. |
| `skills/check-connections/check-connections.js` | **Track acceptances.** Scan the My Network connections list, stamp `connected_on` + `contact_status: connected`. One list page — cheap. |
| `skills/endorse-and-message/endorse-and-message.js --max=N` | **Endorse + ask back.** For accepted connections (oldest first): endorse a random 5-10 of their top skills, then send THE one sanctioned favor-request DM. Zero endorsable skills = abandon (no DM), marked `no_skills`. Each member = 1 profile view. Default/cap **3/day**. |

Typical lifecycle: **seed → scrape (≤50/day) → invite (≤10/day) → check (freely) → endorse+DM (small batches)**.

## HARD RULES (do not violate — the account has been restricted twice; a 3rd strike risks a permanent ban)

- **VOLUME is the binding limit.** Total profiles accessed over time, regardless of HOW
  you navigate. Restriction hit at ~120 views/24h on 2026-06-27.
  - **Scraping ≤ 50 profile views/day**, one run/day.
  - **Inviting ≤ 10/day** (each invite is also a profile view).
  - **Don't stack** a big scrape AND a batch of invites the same day if it pushes total
    views high. A small scrape + a few invites (e.g. 10 + 3) is fine. Acceptance checks
    are cheap (one list page) and don't count meaningfully.
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
- `members.json` — deliverable + outreach state `{ profile_url, location, group_id, contacted, contacted_at, contact_status, connected_on, endorse_status, endorsed_at, endorsed_count, dm_status, dm_sent_at }`.

Edit JSON with **Node, never PowerShell `ConvertFrom/To-Json`** (mangles emoji) — same as
the repo-wide rule.

## Status snapshot

For live counts (queue remaining, members captured, who's contacted/connected) read the
top of [`PROJECT-LOG.md`](PROJECT-LOG.md), not this file — this file is evergreen.
