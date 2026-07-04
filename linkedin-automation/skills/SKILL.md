# linkedin-automation — group member scraper

Scrapes the members of a LinkedIn **group**, reads each member's location, and
captures the ones located in **Europe / North America / South America / the
Caribbean** into a JSON list of `{ profile_url, location }` for later outreach.

Scope: this skill is specific to **this directory**. It drives the user's own
logged-in LinkedIn session via Playwright + system Chrome, mirroring the
human-timing / persistent-profile pattern used by `schedule-tweets/scripts/post-x-poll.js`.

---

## Files

| File | Role |
|---|---|
| `scrape-group-members.js` | The scraper. Collect members → visit each profile → classify location → capture matches. |
| `groups.json` | **Group registry.** Record of which LinkedIn groups we've mined: `{ group_id, name, url, members_url, status, notes }`. `status` is one of `active` (currently being scraped), `completed`, `paused`, or `pending`. |
| `members-urls.json` | **Work queue.** One object per group member: `{ profile_url, processed }`. `processed` flips to `true` once that profile has been visited. This is what makes the run batchable. |
| `members.json` | **Deliverable.** Only members located in a target zone: `{ profile_url, location, group_id }`. `group_id` joins to `groups.json` so outreach can reference the shared group by name. The contact script consumes this. |
| `_probe-location.js` | Diagnostic helper — opens one profile and dumps where the location text actually lives in the DOM. Use it when the location parser stops finding locations (see Troubleshooting). |

Data model:

```jsonc
// members-urls.json  (the queue — every member, processed flag flips as we go)
[ { "profile_url": "https://www.linkedin.com/in/michael-luis/", "processed": true },
  { "profile_url": "https://www.linkedin.com/in/someone/",      "processed": false } ]

// members.json  (captured — target-zone matches only)
[ { "profile_url": "https://www.linkedin.com/in/michael-luis/", "location": "New York City Metropolitan Area", "group_id": "9078205" } ]
```

---

## Running it

```bash
# from repo root
node linkedin-automation/scrape-group-members.js [--max=N] [--collect-only]
```

- `--max=N` — process only the next **N** unprocessed members this run, then stop.
  Run again any time to continue; there is **no state to manage** (the `processed`
  flag in the queue is the resume point). This is the normal way to run it — in
  batches, here and there.
- `--collect-only` — just (re)collect the member list into the queue, don't visit
  any profiles.
- No flags — process **all** remaining members in one (long) run.

**First run:** a fresh Chrome profile (`li-bot-profile`) opens with no LinkedIn
session. **Log in manually in that window** — the script waits up to 5 minutes,
detects the login, and continues. The session is reused on later runs (no re-login).

**Two phases per run:**
1. **Collect** (only when the queue is empty) — open the group's `/members/` page,
   scroll + click "Show more results" until the list stops growing, seed every
   member into the queue as `processed:false`.
2. **Process** — visit the next N unprocessed profiles, read location, classify,
   capture matches, flip `processed:true`.

---

## How location is read (important)

LinkedIn ships **hashed, build-generated CSS class names** (e.g. `_8d59a5a1`) and
renders **no `<h1>`**, so class/tag selectors are useless and break on every deploy.
Instead, `readLocation()` reads the **`<main>` element's innerText**, which is
stable and well-ordered:

```
<Name>
<Headline>
<Location>          <-- taken from here
·
Contact info        <-- (or "<N> followers" / "<N> connections")  = the anchor
```

The location is the line just above the "Contact info" / followers / connections
anchor. No class names involved. If LinkedIn ever reorders this, re-run
`_probe-location.js` and adjust the anchor logic.

## How location is classified

LinkedIn location strings are a comma hierarchy ending in the **country**
("Sydney, New South Wales, Australia", "Austin, Texas, United States"). So
`classify()` matches on the **last comma segment (the country)** against keyword
lists for four zones: `europe`, `north_america`, `south_america`, `caribbean`.
Classifying on the country tail is what disambiguates "New South **Wales**,
Australia" (reject) from "Cardiff, **Wales**" (Europe) — a naive whole-string scan
false-matched the substring "wales" and wrongly captured Sydney once. An `EXCLUDE`
list (Australia, New Zealand, AU states) is checked first for the no-country case.
Only a **comma-less** string (a bare metro like "San Francisco Bay Area") triggers a
whole-string region/metro scan. The raw location is stored as-is. To widen coverage,
add keywords to `ZONES`; to fix a false positive, add to `EXCLUDE`.

---

## Pacing & bot-detection (do not remove)

LinkedIn runs active bot detection on profile pages (reCAPTCHA + a `li.protechts.net`
anti-bot frame load alongside the profile) and enforces a **commercial-use limit** on
profile views. The script is deliberately slow to stay under it:

- **15–30 s** random pause between profiles (`PROFILE_MIN`/`PROFILE_MAX`).
- A longer **30–90 s** "human break" every **18** profiles (`REST_EVERY`).
- Randomized small pauses during scrolling; `navigator.webdriver` hidden;
  `--disable-blink-features=AutomationControlled`.

Best practice: run in **batches** (`--max=~30–150`) rather than all 680 at once. If
LinkedIn throws a checkpoint, **stop** — don't hammer it; the queue is safe and you
can resume later. Never run two browser sessions on `li-bot-profile` at once (the
persistent profile is single-instance).

Errors are safe: a profile that fails to load stays `processed:false` and is retried
on the next run (it is **not** silently dropped).

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Collects **0 members** | The member-list link harvest (`a[href*="/in/"]`) or the "Show more" button selector changed. Re-check against the live `/members/` page. |
| Every location is **empty** | The `<main>` text layout changed. Run `node linkedin-automation/_probe-location.js [profileUrl] [needle]` to see where the location text now lives, then fix `readLocation()`. |
| **"NOT LOGGED IN"** on every profile | Auth-wall detection misfired, or the session expired. Log in again in the Chrome window. Detection is URL-based (`AUTHWALL_RE`); only a real `/login`/`/authwall` redirect should trigger it. |
| A real Europe/Americas member was skipped | Their city wasn't in the `ZONES` keyword map. Add it. |

## Next step (separate skill, not built here)

Once `members.json` is populated, a **separate** outreach script will message the
captured members using only their `profile_url`.
