# linkedin-automation — toolkit index

A small toolkit for **growing a targeted LinkedIn connection list from a group**:
find the group's members, keep the ones in target regions, invite them, track who
accepts, then deepen the new connections (endorse their skills + ask for endorsements
back). It drives the user's own logged-in LinkedIn session via Playwright + system
Chrome, mirroring the human-timing / persistent-profile pattern used by
`schedule-tweets/scripts/post-x-poll.js`.

This file (`linkedin-automation/skills/SKILL.md`) is the **index / router** — it points
to each skill's own doc and documents the **shared foundation** and **LinkedIn limits**
that all of them depend on. Each skill is **self-contained in its own folder** (doc +
script + its probe), so nothing is an orphan file.

---

## Directory layout

```
linkedin-automation/
  PROJECT-LOG.md                       history, state, decisions (start here for status)
  skills/
    SKILL.md                           <- this index
    scrape-group-members/              skill 1: find + classify
      scrape-group-members.md / .js
      _probe-location.js  _probe-search.js
    request-connections/               skill 2: invite
      request-connections.md / .js
      _probe-connect.js
    check-connections/                 skill 3: track acceptances
      check-connections.md / .js
      _probe-connections.js
    endorse-and-message/               skill 4: endorse skills + favor-request DM
      endorse-and-message.md / .js
      _probe-endorse.js  _probe-message.js
    check-endorsements/                skill 5: who endorsed us back
      check-endorsements.md / .js
      _probe-endorsements.js  _probe-endorsers-page.js
  lib/_li-session.js                   shared session + navigation module
  data/  groups.json · members-urls.json · members.json
  tools/_grab-group-name.js            one-off utility
```

All commands run **from the repo root**, e.g.
`node linkedin-automation/skills/<skill>/<skill>.js`.

---

## The five skills

| # | Skill (doc) | Script | What it does |
|---|---|---|---|
| 1 | [`scrape-group-members`](scrape-group-members/scrape-group-members.md) | `skills/scrape-group-members/scrape-group-members.js` | **Find + classify.** Collect a group's members into the work queue, then visit each profile, read its location, and capture the target-region ones into `members.json`. (Collect + process are two phases of this one script, not separate skills.) |
| 2 | [`request-connections`](request-connections/request-connections.md) | `skills/request-connections/request-connections.js` | **Invite.** Send a connection request with a note to each captured member not yet contacted, then record the outcome. |
| 3 | [`check-connections`](check-connections/check-connections.md) | `skills/check-connections/check-connections.js` | **Track acceptances.** Scan the My Network connections page and stamp `connected_on` for members who accepted. |
| 4 | [`endorse-and-message`](endorse-and-message/endorse-and-message.md) | `skills/endorse-and-message/endorse-and-message.js` | **Endorse + ask back.** For accepted connections (oldest first): endorse a random 9-15 of their top skills, then send THE one sanctioned favor-request DM asking them to endorse back. Zero endorsable skills = abandon (no DM), marked `no_skills`. |
| 5 | [`check-endorsements`](check-endorsements/check-endorsements.md) | `skills/check-endorsements/check-endorsements.js` | **Track endorse-backs.** Read OUR OWN skills page's endorser overlays, record who endorsed each skill into `data/endorsements.json` (`first_seen` = observed date — LinkedIn shows no endorsement date, so run often), and stamp `endorsed_back` onto matching members. Closes skill 4's loop. |

Typical lifecycle: **(1) scrape** a group at ≤50 profiles/day until the queue is
drained → **(2) invite** the captures at ≤10/day → **(3) check** acceptances every day
or two → **(4) endorse + DM** the accepted connections — send to ALL members connected
more than 14 days ago (no one-per-day / small-batch cap; set `--max` to cover them all;
fallback = one member ≥7 days if none are older) → **(5) check endorse-backs** every
run day (own-profile only, so its observed `first_seen` dates stay near the real
endorsement dates). Skills 1, 2
and 4 all consume the per-day profile-view budget (see "LinkedIn limits"); skills 3
and 5 are cheap (one list page / own-profile pages only).

---

## Shared & data files

The per-skill files live in each skill's folder (see Directory layout + that skill's
doc). The shared pieces are:

| Path | Role |
|---|---|
| `lib/_li-session.js` | **Shared session + navigation module.** One source of truth for the persistent Chrome session (`li-bot-profile`), the login gate, the "reach a profile like a human" search-and-click navigation, and small JSON/pacing helpers. All three scripts `require` it, so a LinkedIn DOM change (e.g. the search-box redesign) is fixed in ONE place. |
| `data/groups.json` | **Group registry.** `{ group_id, name, url, members_url, status, notes }`. `status` ∈ `active` / `completed` / `paused` / `pending`. |
| `data/members-urls.json` | **Work queue.** `{ profile_url, processed }` per member; `processed` is the resume point that makes the scrape batchable. |
| `data/members.json` | **Deliverable + outreach state.** Target-region members + invite/acceptance state (see Data model). |
| `data/endorsements.json` | **Incoming-endorsement registry.** One append-only record per (skill, endorser) with `first_seen` observed date — members and non-members alike (skill 5 writes it). |
| `tools/_grab-group-name.js` | One-off utility — prints a group's public name (to fill `data/groups.json`). |

Each skill folder also carries its own diagnostic probe(s) — `_probe-location.js` /
`_probe-search.js` (scraper), `_probe-connect.js` (invite), `_probe-connections.js`
(acceptances), `_probe-endorsements.js` / `_probe-endorsers-page.js` (endorse-backs) —
documented in that skill's Troubleshooting section.

---

## Data model

```jsonc
// members-urls.json  (the queue — every member, processed flag flips as we go)
[ { "profile_url": "https://www.linkedin.com/in/michael-luis/", "processed": true },
  { "profile_url": "https://www.linkedin.com/in/someone/",      "processed": false } ]

// members.json  (captured — target-region matches only; last fields = outreach state)
[ { "profile_url": "https://www.linkedin.com/in/michael-luis/", "location": "New York City Metropolitan Area",
    "group_id": "9078205", "contacted": false } ]
// after request-connections.js sends an invite:
//   "contacted": true, "contacted_at": "2026-06-28", "contact_status": "sent"
// after check-connections.js sees them accept:
//   "contact_status": "connected", "connected_on": "2026-06-30"
// after endorse-and-message.js endorses them + sends the favor-request DM:
//   "endorse_status": "endorsed", "endorsed_at": "2026-07-02", "endorsed_count": 7,
//   "dm_status": "sent", "dm_sent_at": "2026-07-02"
// (or "endorse_status": "no_skills" = abandoned: nothing to endorse, so NO DM, never revisited)
// after check-endorsements.js sees them among OUR endorsers (they returned the favor):
//   "endorsed_back": true, "endorsed_back_on": "2026-07-22",   // first OBSERVED date
//   "endorsed_back_skills": ["AI Solutions"], "endorsed_back_count": 1
```

`group_id` joins `members.json` back to `groups.json` (which holds the group name).

---

## Shared foundation (`_li-session.js`)

All three skills sit on one shared module so a LinkedIn change is fixed once.

**Session + login.** A dedicated persistent Chrome profile `li-bot-profile` (system
Chrome via `channel: 'chrome'`, `navigator.webdriver` hidden,
`--disable-blink-features=AutomationControlled`). On first run the window opens with no
LinkedIn session — **log in manually once**; the script waits up to 5 minutes, detects
the login, and continues. The session is reused on later runs. Login detection is
**URL-based** (`AUTHWALL_RE`): only a real `/login`/`/authwall` redirect counts as
logged out (a naive nav-selector check misfired before the SPA hydrated). Never run two
browser sessions on `li-bot-profile` at once (the persistent profile is single-instance).

**Reaching profiles via search, not bare URLs (do not remove).** LinkedIn flags
accounts whose only activity is bare back-to-back profile loads with no referrer. So
the scripts never `goto(profileUrl)` directly. `searchAndOpen()` reaches a profile the
way a person does: land on the **feed** → **type the member's name** (derived from the
slug by `nameQueryFromUrl()` — drop the trailing hash token, dashes → spaces) into the
real search box and Enter → **wait 3–15 s** "reading" results → **click** the result
whose href matches the slug, so the view arrives with a real in-app referrer. Fallback:
if the exact profile isn't on page 1 (common name ranked low) or the search UI fails,
it falls back to a direct `goto` for that one member; the log prints the nav mode
(`clicked` / `goto-notfound` / `goto-noquery` / `goto-error`). If a nav doesn't land on
a `/in/` URL, the member is **not** marked done. The live search box has placeholder
**"I'm looking for…"** (`SEARCH_BOX`); if it breaks, re-probe with `_probe-search.js`.

**Base pacing & bot-detection (do not remove).** LinkedIn runs active bot detection
(reCAPTCHA + a `li.protechts.net` anti-bot frame) and a commercial-use view limit. The
shared pacing is deliberately slow: **30–90 s** between one profile cycle and the next,
a longer **90–180 s** "human break" every **18** profiles, and randomized small pauses
during scrolling. The invite skill layers its own additional gaps on top (see its doc).
Always run in **batches** and **stop** on any checkpoint — never hammer; the queue is
safe and you can resume later.

**Selector discipline (hard-won — both bugs hit on 2026-06-29).** LinkedIn ships hashed
CSS classes and many repeated controls, so selectors fail in two recurring ways. Guard
against both whenever you write or change a `.click()`:
1. **Too-broad attribute match on a page of per-row controls.** A `button[aria-label*="X"]`
   with `.first()` will grab a *member-row* button (every row has a "More actions" ...
   button) instead of the page-level control you meant. The seed clicked member rows this
   way. Fix: match the specific control by **exact visible text** or a **scoped container**,
   never a loose `aria-label*=` substring on a list page.
2. **Assuming a tag.** LinkedIn renders the *same* action as a `<button>` on one profile and
   an `<a>` anchor on another (the primary **Connect** does exactly this). Match by
   **role/aria across both tags** (`button[...], a[...]`), never `<button>` alone.
Both are diagnosed the same way: run that skill's `_probe-*.js` to **dump the live DOM**
(tag + aria-label + text of each control) before changing a selector — don't guess. If a
probe's own dump can't see a control you can see on screen, the probe selector has the same
blind spot (e.g. it listed only `button`/`a[role=button]` and missed a plain `<a>` anchor).

---

## LinkedIn limits (read this — the binding constraint)

The hard limit is **VOLUME**: total profiles accessed over time, regardless of *how*
you navigate. On 2026-06-27, after ~120 profile views in ~24 h, LinkedIn served a
temporary **account restriction** ("accessed an unusually high volume of LinkedIn
profile data"). This is separate from the earlier navigation-pattern "unusual activity"
warning; the volume one is the hard ban (it comes with a lift time).

**Operating rules:**
- **Scraping: ≤ 50 profiles/day**, one run/day (`--max=50`). We tripped the limit at
  ~120/24 h, so 50/day stays well under.
- **Inviting: ≤ 10/day** (the script default). Each invite is also a profile view.
- **Don't run a big scrape and a batch of invites on the same day** if it pushes total
  profile views high — both feed the same volume budget. (A 30-scrape + 5-invite day =
  35 views, which is fine.)
- **Acceptance checks are cheap** (one list page) — run freely.
- The account was restricted twice in late June 2026. **A third strike risks a
  permanent ban.** If any run hits a limit/restriction page, **stop for the day.**

See [`../PROJECT-LOG.md`](../PROJECT-LOG.md) for the full restriction history,
run-by-run results, and decisions.
