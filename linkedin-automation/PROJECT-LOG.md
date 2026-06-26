# LinkedIn group member scraper — PROJECT LOG

Running log of work on the LinkedIn group member scraper. Newest entries at the
bottom. See `SKILL.md` for how the tool works; this file is the history + state.

---

## Goal

For the LinkedIn group **9078205**, browse all members, read each member's
location, and capture the ones in **Europe / North America / South America / the
Caribbean** into `members.json` as `{ profile_url, location }`. A later (separate)
script will message the captured members using only their `profile_url`.

## Current state (as of 2026-06-26)

- **Queue:** 680 members collected. **105 processed**, **575 remaining**.
- **Captured:** **19** members in `members.json`.
- **Hit rate so far:** ~20% (the group skews heavily India, which is out of zone).
- Group registry `groups.json`: group `9078205` = `status: active`.

To continue: just run another batch (no state to manage) —
```bash
node linkedin-automation/scrape-group-members.js --max=70
```
It resumes from the first `processed: false` member automatically.

## Files in this directory

- `scrape-group-members.js` — the scraper.
- `members-urls.json` — work queue: `{ profile_url, processed }` per member.
- `members.json` — captured deliverable: `{ profile_url, location }`.
- `groups.json` — registry of groups mined + status.
- `SKILL.md` — how it all works.
- `_probe-location.js` — diagnostic for the location selector.

---

## Decisions & rationale

- **Two-file model.** Queue (`members-urls.json`, every member + `processed` flag)
  is separate from the captured deliverable (`members.json`, target-zone matches
  only). The `processed` flag is the resume point — lets us run in batches here and
  there. (Replaced an earlier `visited.json` + `unclassified.json` design at Mike's
  direction: "no new JSON, just a property on the member.")
- **Batching via `--max=N`.** Processes the next N unprocessed members, then stops.
  Errors stay `processed: false` so they retry next run (never silently dropped).
- **Dedicated Chrome profile** `li-bot-profile` (persistent), system Chrome via
  `channel: 'chrome'`, webdriver hidden — same pattern as the posting scripts. Log
  in manually once on first run; session reused after.
- **Pacing for bot-detection.** 15–30 s random pause between profiles (Mike's
  request), plus a 30–90 s break every 18 profiles. LinkedIn runs reCAPTCHA + a
  `li.protechts.net` anti-bot frame and enforces a commercial-use view limit, so
  run in batches, not all 680 at once.

## Problems hit & fixed

1. **Login false-positive.** First profile visit wrongly triggered "NOT LOGGED IN"
   because the nav selector was checked before the SPA hydrated. Fixed: detection
   is now URL-based (`AUTHWALL_RE`) — only a real `/login`/`/authwall` redirect
   counts as logged out.
2. **Location selector returned nothing.** LinkedIn ships hashed CSS class names
   (`_8d59a5a1`) and no `<h1>`, so class/tag selectors found nothing. Fixed:
   `readLocation()` now parses the `<main>` element's innerText and takes the line
   just above the "Contact info" / followers / connections anchor — immune to class
   churn. (Diagnosed with `_probe-location.js`.)
3. **Classification false-positive.** "Sydney, New South Wales, Australia" was
   captured as Europe because the whole-string scan matched the substring "wales".
   Fixed: `classify()` now matches on the **country** (last comma segment) + an
   `EXCLUDE` list; whole-string scan only for comma-less metros. Regression-tested
   12/12. Removed the bad Sydney row from `members.json`.

## Run history

- **Test run (5 profiles).** Validated login, collection (680 URLs), location read,
  classification, output shape. Surfaced problems 1 & 2 above.
- **Batch of 30.** 6 captures (5 after removing the Australia false-positive).
  Surfaced problem 3.
- **Batch of 70.** 14 captures, no errors. Running total: 19 captured, 105
  processed, 575 remaining.

## Updates

- **2026-06-26 — added `group_id` to `members.json`.** Each captured member now
  carries `{ profile_url, location, group_id }`. Outreach references the shared
  group by name, and as more groups are mined we need to know which group each
  member came from. `group_id` joins to `groups.json` (which holds the name).
  Backfilled the 19 existing members with `9078205`. **Still TODO:** fill
  `groups.json` → `name` for `9078205` (currently blank) so the name is available.

## Open / next steps

- Continue processing the remaining **575** members in batches (~5–6 h total at the
  current pacing).
- Fill in `groups.json` → `name` for group 9078205 (left blank; needs a moment with
  Chrome free to read the group page).
- Once `members.json` is complete: build the **separate outreach script** that
  messages captured members by `profile_url`.
- Optional: wire `scrape-group-members.js` to read the `active` group from
  `groups.json` instead of the hardcoded ID, so adding a group is a registry edit.
