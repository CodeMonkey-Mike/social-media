# check-endorsements — who endorsed us back

Reads **our own** skills page (`…/in/michael-luis/details/skills/`), opens each
endorsed skill's endorsers overlay, records **who endorsed each skill** into
`data/endorsements.json`, and stamps `members.json` for every captured member found
among the endorsers. This closes the loop on
[`endorse-and-message`](../endorse-and-message/endorse-and-message.md): that skill's DM
asks the member to endorse back — this one finds out who actually did.

This is one of the skills in the `linkedin-automation` toolkit. See the index
**[`../SKILL.md`](../SKILL.md)** for the toolkit overview, the shared foundation
(`lib/_li-session.js`), the data model, and LinkedIn's volume limits.

---

## Running it

```bash
# from repo root
node linkedin-automation/skills/check-endorsements/check-endorsements.js [--dry-run] [--all]
```

- `--dry-run` — navigate + report everything, write NO files.
- `--all` — visit every endorsed skill's endorsers overlay even when its endorsement
  count matches what's already recorded. Default is **incremental**: a skill whose
  on-page count equals its recorded endorser count is skipped as "no change", so
  routine re-runs are quick.

**Volume: effectively free.** Everything here is our OWN profile (the skills page and
its endorser overlays) — no member profiles are visited, so it does not consume the
member profile-view budget. Like `check-connections`, run it freely — and run it
**often** (see Dates below).

## Dates are observed, not actual (run frequently)

LinkedIn does **not** show when an endorsement was made. Each new endorser is stamped
`first_seen` = the date this script first observed them (Mike, 2026-07-22 — the same
observed-date convention `check-connections.js` uses when a connect date isn't shown).
Run the script frequently (every run day, alongside `check-connections`) and
`first_seen` stays roughly in line with the real endorsement date; let it lapse and
the dates smear. Records are **append-only** — `first_seen` is never overwritten, and
a retracted endorsement is kept (the log notes when the page count drops below the
recorded count).

## Data

**`data/endorsements.json`** — the full observed endorser registry (members and
non-members alike), one record per (skill, endorser):

```jsonc
[ { "skill": "AI Solutions", "skill_id": "71677861", "slug": "jackidev",
    "profile_url": "https://www.linkedin.com/in/jackidev/",
    "name": "Jackelin Nuñez Aguirre", "headline": "RPA Developer| …",
    "first_seen": "2026-07-22" } ]
```

**`members.json`** — members found among the endorsers gain:

```jsonc
//   "endorsed_back": true,
//   "endorsed_back_on": "2026-07-22",          // earliest first_seen; set once
//   "endorsed_back_skills": ["AI Solutions"],  // kept current
//   "endorsed_back_count": 1
```

The end-of-run report shows the campaign stat directly: how many DM'd members have
endorsed back, who they are, and which DM'd members are still outstanding (with days
since the DM) — plus the count of organic (non-member) endorsers.

## How it reads the DOM (probed live 2026-07-22)

Probed with `_probe-endorsements.js` (skills page) and `_probe-endorsers-page.js`
(endorsers overlay) — **re-probe with those before changing any selector.**

- Each endorsed skill row on `/details/skills/` has **two `<a>`s to the same href
  ending `/endorsers/`** ("Endorsed by N people…" + "N endorsements"). The href embeds
  a stable skill id — `urn:li:fsd_skill:(<me>,<skillId>)` — which is the dedupe key.
  Skills with zero endorsements have no such anchor. The total is parsed from the
  `/^\d+ endorsement/` anchor text; the skill NAME comes from climbing the anchor's
  ancestors until a text line appears that isn't one of the two endorsement lines.
- Navigating to an `/endorsers/` URL opens an **overlay OUTSIDE `<main>` with NO
  `role="dialog"`** (a naive dialog wait misses it — that's why the first probe saw
  "no dialog"). Endorser rows are document-level `a[href*="/in/"]` links with text
  `"Name · 1st Headline…"` whose `closest('main')` is null; our own slug and
  `/details/`+`/edit/` hrefs are excluded.
- The overlay **lazy-loads on its own internal scroll container** — scrolling the
  window loads nothing (the 50-endorser probe rendered only 10 rows). The script
  climbs from an endorser link to the first ancestor with
  `scrollHeight > clientHeight` and drives its `scrollTop`, also clicking a
  `Show more results` / `Load more` button (exact visible text only —
  selector-discipline rule) if the overlay paginates that way.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| 0 endorsed skills found | The `/endorsers/` anchor pattern changed on the skills page. Re-run `_probe-endorsements.js` and adjust. |
| A skill's endorsers page harvests 0 rows | The overlay structure changed (row links moved inside `main`, or a dialog role appeared). Re-run `_probe-endorsers-page.js`. |
| Harvest stalls below the endorsement count | Some endorsers are unlistable (deactivated/private) — the shortfall is logged and harmless. If it happens on EVERY skill, the overlay's internal scroll container changed; re-probe. |
| A member endorsed but wasn't stamped | Slug mismatch between their `profile_url` in `members.json` and the overlay link (rare; check both slugs by hand). |
| Wrong/garbled skill names | The ancestor-climb found a different line first (layout change). Re-run `_probe-endorsers-page.js` and check its climbed-names dump. |
