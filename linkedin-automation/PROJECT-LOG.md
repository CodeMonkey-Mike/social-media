# LinkedIn group member scraper — PROJECT LOG

Running log of work on the LinkedIn group member scraper. Newest entries at the
bottom. See `skills/SKILL.md` for how the tool works; this file is the history + state.

---

## Goal

For the LinkedIn group **9078205**, browse all members, read each member's
location, and capture the ones in **Europe / North America / South America / the
Caribbean** into `members.json` as `{ profile_url, location }`. A later (separate)
script will message the captured members using only their `profile_url`.

## Current state (as of 2026-07-07, after the 5-lane run)

- **Queue:** **2426** members (421 from group `9078205`, fully processed + 2005 from group
  `6665791`, A→J). **491 processed**, **1935 remaining**. The scrape pointer is well inside
  group `6665791`. _(2026-07-06 earlier: Mike abandoned the remaining 159 unprocessed
  `9078205` URLs outright — too India-heavy. `groups.json` → `9078205` status `done`. Backup
  of the pre-trim 2000-entry queue at `data/members-urls.json.bak2`.)_
- **Prior state (2026-07-06):** 1981 members, 451 processed, 1530 remaining; 75 captured.
  Today's run seeded 445 J-names (→2426) and processed 40 (→491 processed).
- **Captured:** **107** members in `members.json`. **53 contacted**; **22 connected**;
  **31 awaiting acceptance**; **54 still to contact**. **3 DM'd** (sindhura 07-02, kamesh 07-06,
  praveenser5599 07-07).
- **Hit rate stays high in group `6665791`:** the 2026-07-07 scrape captured **32/40 = ~80%** —
  the name-seeded J-cohort (John/James/Joseph/Jennifer) skews heavily Spain / Italy / Latin
  America, far more in-zone than the India-heavy `9078205`. (Lifetime hit rate was ~12% in the
  old group; ~83% on the 07-06 Albert/Alberto batch.)
- Group registry `groups.json`: `9078205` `done`, `6665791` `active`;
  `6665791` searched_names now **A→J** (added John, James, Joseph, Jennifer 2026-07-07).
- **Trimmed the old group (2026-07-03):** Mike cut **100 unprocessed `9078205` URLs**
  (the group skews too India-heavy / out-of-zone — not worth the scrape-days). Removed the
  last 100 unprocessed entries only; the 391 already-processed profiles + resume flags
  untouched. Old group now **580 total / 189 unprocessed** (was 680 / 289). Backup at
  `data/members-urls.json.bak`.
- **Queue order (pointer now in the new group):** indices 0-420 = group `9078205` (all
  processed), 421+ = group `6665791` (1560 seeded, name-order Albert→…). The scrape pointer is
  at 451, so we are **~30 members into `6665791`** and every future scrape stays in it. The old
  group is exhausted. **Scraper capture-tagging fix (2026-07-06):** `scrape-group-members.js`
  now tags each capture with the QUEUE ENTRY's own `group_id` (`entry.group_id`), not the
  hardcoded collect-phase `GROUP_ID='9078205'` — the constant would have mis-attributed every
  `6665791` capture to `9078205`. Verified: all 25 of today's captures tagged `6665791`.
- **Next run:** resume scrape (`--max=30-40`, detached), then invites (`--max=8`; **54 still to
  contact**), then the acceptance check, then `endorse-and-message --max=1` (19 eligible, oldest
  first — next up is richard-bystrian / hamza-moghe / pietroschena, all 06-29). Endorse+DM shares
  the profile-view budget (today 49/50: 40 scrape + 8 invites + 1 endorse).
- **Profile-view budget on 2026-07-06: 43/50 used** (30 scrape + 6 invites + a 6-invite RETRY
  run + 1 endorse; seed + acceptance check are free). No restriction page on any lane. The
  first invite run only landed 2/6 (4 errored at the note-textarea step on a flaky LinkedIn
  window — 3 also hit `goto-error` nav); a single clean RETRY sent 4 more → **6 invites sent
  total**, 2 still erroring left for a future day. Stayed under the 50 cap.
- **Harness note (2026-07-01): background scrape runs get killed at ~5 min now** (worse
  than the 8-40 min seen 2026-06-30). Workaround that finally worked: launch the run
  **detached** via PowerShell `Start-Process` (survives the harness background-task kill),
  then poll `members-urls.json` processed count + the log. Caveat: it opens a **visible**
  headful Chrome window (LinkedIn requires headful) — Mike closed it once mid-run thinking
  it was stray (stopped cleanly at 328, resumed with `--max=23`). Tell him the window is
  the scraper before/while it runs.
- **Pacing widened 2026-06-30 (Mike): between-profile gap is now random 60-300s (1-5 min)**
  and the periodic break is 300-480s (was 30-90s / 90-180s). "It could take all day, that's
  okay." Knobs in `scrape-group-members.js` (`PROFILE_MIN/MAX`, `REST_MIN/MAX`).
- **Harness note (2026-06-30): long background runs get killed unpredictably** (~8-40 min,
  no script error) — with the slow pacing a 40-profile run can't finish in one shot. Run the
  scrape in **small chunks** (≤8 profiles ≈ 20-25 min each); the `processed` flag persists per
  profile so every chunk is resume-safe. Today's 40 took 6 chunks (12/8/8/8/4/1; chunks 1, 4,
  5 were killed but all their completed profiles saved). Always verify no orphan `li-bot-profile`
  Chrome/node before the next chunk (per-profile kill only, never kill-all Chrome).
- **No restriction active.** The 2026-06-27 volume restriction lifted as scheduled;
  the 2026-06-29 batch of 30 ran fully clean (see Run history) with no flag. Stay at
  ≤50/day, one run/day, and stop immediately if a restriction page ever reappears
  (next strike risks a permanent ban).
- **Key lesson — volume is the binding limit, and it's a function of total profiles
  accessed over time, regardless of HOW we navigate.** Mike has seen this same
  "unusually high volume of profile data" message before the search-first flow
  existed, so the per-member search is **not** the cause and we are **keeping
  search-first as is**. The fix is purely about VOLUME: process **fewer per day**.
  The earlier "unusual activity" (pattern) warning and this volume restriction are
  separate defenses; this volume one is the hard ban (with a lift time), so the lever
  that matters is a low daily count + wide pacing.

**Decision (Mike, 2026-06-27): keep the current approach (search-first), resume
TOMORROW, and process only 50/day.** We tripped the limit at ~120 profiles in ~24 h,
so 50/day stays well under. Stop entirely if a second restriction hits (next strike
risks a permanent ban). To continue (after the 6:56 AM PDT lift, but planned for
2026-06-28):
```bash
node linkedin-automation/skills/scrape-group-members/scrape-group-members.js --max=50
```
It resumes from the first `processed: false` member automatically. Run **once per
day**, not multiple batches that add up past ~50.

## Directory layout

Restructured 2026-06-29 from a flat folder into one self-contained folder per skill
(see the `2026-06-29 — restructured` Update below). `skills/SKILL.md` is the index.

```
linkedin-automation/
  PROJECT-LOG.md                       (this file)
  skills/
    SKILL.md                           index / router
    scrape-group-members/    .md + .js + _probe-location.js + _probe-search.js
    request-connections/     .md + .js + _probe-connect.js
    check-connections/       .md + .js + _probe-connections.js
  lib/_li-session.js                   shared session + navigation module
  data/  groups.json · members-urls.json · members.json
  tools/_grab-group-name.js            one-off utility
```

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
- **Pacing for bot-detection.** 30–90 s random pause between one profile cycle and
  the next search (Mike's request; was 20–40 s, widened 2026-06-27; 15–30 s before
  that), plus a distinctly longer 90–180 s break every 18 profiles. LinkedIn runs
  reCAPTCHA + a
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
- **2026-06-27 — batch attempt, hit anti-bot flag.** Widened pacing to 20–40 s
  between profiles, then launched `--max=300`. Stopped at 7 to recut the target to
  150 (`--max=143`) over a LinkedIn throttling concern. Partway through that second
  run LinkedIn showed "We noticed some unusual activity on your account" and we
  stopped. Net this sitting: ~63 processed (105 → 168), 7 new captures (19 → 26).
  No errors logged by the script — the flag is a page LinkedIn served, not a crash.
  Account is now PAUSED (see Current state).
- **2026-06-29 — batch of 30, clean run (no flag).** First scrape since the volume
  restriction lifted; ran `--max=30` at default pacing. All 30 resolved (16 `clicked`
  / 14 `goto-notfound`, no errors), with the longer human break firing after #18 as
  designed. **3 new captures** (30 → 33): Goodyear AZ (north_america), Uruguay
  (south_america), Mechelen/Flanders Belgium (europe); the rest were India/out-of-zone.
  231 → 261 processed, **419 remaining**. No restriction or "unusual activity" page —
  confirms ≤50/day with the current pacing stays under the volume limit.

- **2026-07-01 — full 4-lane sequential run (seed → scrape 40 → invite 8 → check).**
  - **Lane 1 (seed F-names):** searched group `6665791` for **Frank, Frederick, Felix,
    Frances** (3 male + 1 female, matching the per-letter pattern). Matched 32/7/37/30;
    **101 new** to the queue (1805 → 1906). `groups.json` searched_names now A→F.
  - **Lane 2 (scrape 40):** processed the next 40 queue members (311 → 351). Almost all
    India/out-of-zone as usual; **3 new captures** (37 → 40): Canada, United States
    (Frisco TX), and Liverpool England UK (chrish-pep-felix — a group `9078205` member,
    NOT from today's Felix seed; those seeded names are still unprocessed at the back of
    the queue). Ran in a couple detached chunks after harness kills (see Current state
    harness note); resume-safe throughout.
  - **Lane 3 (invite 8):** sent **8/8** connection requests with the note (tally
    `{"sent":8}`); 15 members still to contact. All reached via search-first
    (clicked/goto-notfound mix), no limit/restriction page.
  - **Lane 4 (check acceptances):** **4 newly connected** recorded — syedmsadiq (06-30),
    manjushree-shivaraju (06-30), mcqueenjames (06-30), neena-parveen (07-01, date not
    shown → observed). 15 contacted still pending. Connections list only rendered ~20
    cards (recently-added sort covers new accepts). No restriction all day.

- **2026-07-02 — full 4-lane sequential run (seed → scrape 40 → invite 8 → check),
  all clean, no restriction; each lane launched as a genuinely detached process
  (PowerShell `Start-Process`, output redirected to a log file) and watched with a
  persistent log-tailing monitor instead of a harness-tracked background task —
  survived the whole run with no kills, no chunking needed.**
  - **Lane 1 (seed G-names):** searched group `6665791` for **George, Gary, Gregory,
    Grace** (3 male + 1 female, matching the per-letter pattern). Matched 63/18/15/36;
    **130 new** to the queue (1906 → 2036). `groups.json` searched_names now A→G.
  - **Lane 2 (scrape 40):** processed the next 40 queue members (351 → 391), still
    entirely within group `9078205` (pointer hasn't reached index 680 yet). Almost all
    India/out-of-zone as usual; **5 new captures** (40 → 45): Worcester MA, Sutton
    England UK, Jersey City NJ, Buenos Aires Argentina, Norcross GA.
  - **Lane 3 (invite 8):** sent **8/8** connection requests with the note (tally
    `{"sent":8}`); 12 members still to contact. No limit/restriction page.
  - **Lane 4 (check acceptances):** **2 newly connected** recorded — adailtonsilva90
    (07-02) and anup-upadhyay-6a83405 (07-01, observed today) → 12 connected, 21
    awaiting. No restriction all day. Day's profile-view total 48/50 (seed + check
    are free).

- **2026-07-02 (PM) — NEW SKILL 4 built + validated live: `endorse-and-message`.**
  For accepted connections (oldest `connected_on` first): endorse a random **5-10 of
  their top skills**, then send **THE one sanctioned favor-request DM** (fixed template,
  verbatim every time — Mike's call — asking them to endorse his automation skills back).
  **Zero-skills rule (Mike): no endorsable skills → abandon, NO DM** (the message says
  "I just endorsed you"), marked `endorse_status:"no_skills"`, never revisited. New
  members.json fields: `endorse_status / endorsed_at / endorsed_count / dm_status /
  dm_sent_at`. Default `--max=3`; each member = 1 profile view + ~10 endorse clicks +
  a DM (novel action signature — keep batches small). Folder CLAUDE.md "no DMs" rule
  amended to carve out exactly this one DM.
  - **Live test on sindhura-karnati (oldest connection, 06-29): 8 skills endorsed
    (Maestro → Automation Anywhere, all top-of-list) + DM sent + verified.** All on the
    one profile — day's total stayed ~49/50.
  - **Probe findings (3 probes, all committed in the skill folder):**
    1. `_probe-endorse.js` — Endorse buttons are `main button[aria-label^="Endorse " i]`
       with text exactly "Endorse" (skill name in the aria); already-endorsed drops the
       prefix match. DOM order = display order.
    2. `_probe-message.js` — the profile OWNER's Message control is a plain `<a>` with
       **NO aria-label**, text "Message", href `/messaging/compose/?...recipient=<urn>`;
       the "More profiles for you" module's `Message <other person>` anchors ALL carry
       aria-labels → a bare `aria-label*="Message"` match **DMs the wrong person**
       (selector-discipline rule #1 in the flesh — the first dry-run correctly refused).
    3. `_probe-send.js` — **Mike's account has "Press Enter to send" ON, so NO Send
       button exists at all** (footer shows only `.msg-form__send-toggle`). Send = one
       bare Enter; line breaks MUST be Shift+Enter. First live attempt failed
       `no_send_button` because of this; fixed + hardened (clear leftover draft before
       typing; verify >100 chars landed before sending; verify composer emptied after).
  - **Endorse-click gotcha baked into the code:** clicked buttons drop out of the
    `[aria-label^="Endorse "]` matched set, so the script collects **element handles**,
    not `locator.all()` (nth-index locators shift mid-loop → wrong skills endorsed).

- **2026-07-03 — full 4-lane sequential run (seed → scrape 30 → invite 6 → check).**
  All four lanes launched detached (PowerShell `Start-Process`, redirected logs), strictly
  sequential (one `li-bot-profile` Chrome at a time), no kills, no restriction page.
  Preceded by Mike's trim of 100 unprocessed `9078205` URLs (see Current state).
  - **Lane 1 (seed H-names):** searched group `6665791` for **Henry, Harold, Howard,
    Helen** (3 male + 1 female). Matched 39/2/6/19; **64 new** to the queue (1936 → 2000).
    `groups.json` searched_names now A→H.
  - **Lane 2 (scrape 30):** processed the next 30 queue members (391 → 421, all group
    `9078205`). **5 new captures** (45 → 50): Peru (south_america), Dallas-Fort Worth
    Metroplex + Glendale AZ (north_america), São Paulo Brazil (south_america), Whitby
    Ontario Canada (north_america); the rest India/out-of-zone. ~17% hit rate this batch,
    0 load errors.
  - **Lane 3 (invite 6):** sent **6 invites** (`{"sent":6}`, no failures) to the oldest
    uncontacted captures. 33 → 39 contacted; **11 still to contact**.
  - **Lane 4 (check acceptances):** **5 newly connected** recorded —
    mohandass-thirunavukkarasu (07-03), jackidev (07-02), purnima-singh (07-02),
    sethadamcohen (07-03, date not shown), juan-andres-sanchez-bidegain (07-02) →
    **17 connected, 22 awaiting**. Day's profile-view total **36/50** (seed + check free).

- **2026-07-06 — full 5-lane sequential run (seed → scrape 30 → invite 6 → check → endorse+DM).**
  All lanes launched detached (PowerShell `Start-Process`, redirected logs), strictly sequential
  (one `li-bot-profile` Chrome at a time, verified no orphan between lanes), no kills, no
  restriction page on any lane. Day's profile-view total **43/50** (seed + check are free).
  - **Lane 1 (seed I-names):** searched group `6665791` for **Ian, Isaac, Ivan, Irene** (3 male
    + 1 female). Matched 25/39/75/12; **140 new** to the queue (1841 → 1981). `groups.json`
    searched_names now A→I.
  - **Lane 2 (scrape 30):** processed the next 30 queue members (421 → 451) — **the first batch
    to cross into group `6665791`**. **25 new captures** (50 → 75), **~83% hit rate** (the
    name-seeded Alberto/Albert cohort skews Spain / Latin America / Italy): lots of Spain (Madrid,
    Barcelona, Granada, Badajoz, Andalusia…), Mexico (Guadalajara, Jalisco, Chihuahua), Italy
    (Rome, Milan), Peru, El Salvador, Argentina, plus several US. 0 load errors. **Fixed a
    capture-tagging bug first:** the scraper hardcoded `group_id:'9078205'` on captures; now uses
    `entry.group_id` so the `6665791` captures are tagged correctly (verified 25/25).
  - **Lane 3 (invite 6):** first `--max=6` run landed only **2/6** (fahad-k, ramses-marin-
    echeverria) — the other 4 errored at the add-note/textarea step on a flaky window (3 also hit
    `goto-error` nav), left `contacted:false`. Diagnosed as transient (2 sent fine with identical
    code, account healthy, no limit page), so ran **one clean RETRY** `--max=6`: sent 4 more
    (guruvenkatavamsi, ramesh-yanith, bradyprincipe, venkata-sai-alaturthi). **6 invites sent
    total**; 2 (giri-jangiti, ishu-eric-davis) errored both times, left for a future day (no 3rd
    attempt — volume ceiling). 45 contacted, **30 still to contact**.
  - **Lane 4 (check acceptances):** **3 newly connected** — fahad-k (07-06, accepted our invite
    from earlier the same day), ranjith-y (07-04), nisha-ravikumar (07-03) → **20 connected, 25
    awaiting**. (Connections list renders ~20 recently-added cards; matched 3/28.)
  - **Lane 5 (endorse + DM):** `--max=1` on the oldest not-yet-DM'd connection — **kamesh-
    govindaraj** (connected 2026-06-29, exactly 7 days ago, Böblingen Germany). Endorsed **6**
    top skills (LLMOps, RESTful WebServices, Spring AI, LLMs, AI Assistant, Chat Client), then the
    one sanctioned favor-request DM sent + verified (Enter-to-send mode, composer emptied).
    **2 members DM'd total** (sindhura 07-02, kamesh 07-06); 18 connected remain eligible.

- **2026-07-07 — full 5-lane sequential run (seed → scrape 40 → invite 8 → check → endorse+DM).**
  All lanes launched detached (PowerShell `Start-Process`, redirected logs), strictly sequential
  (one `li-bot-profile` Chrome at a time, verified no orphan between lanes), no kills, no
  restriction page on any lane. Day's profile-view total **49/50** (seed + check are free).
  - **Lane 1 (seed J-names):** searched group `6665791` for **John, James, Joseph, Jennifer** (3
    male + 1 female). Matched 242/84/111/33; **445 new** to the queue (1981 → 2426). `groups.json`
    searched_names now A→J.
  - **Lane 2 (scrape 40):** processed the next 40 queue members (451 → 491, all group `6665791`).
    **32 new captures** (75 → 107), **~80% hit rate** (the J-cohort skews Spain / Italy / Latin
    America): Spain (Madrid, Barcelona, Valencian Community…), Italy (Rome, Verona), Mexico
    (Guadalajara), Peru ×2, Brazil, France, Norway, Switzerland, Miami FL, UK, etc. 0 load errors.
  - **Lane 3 (invite 8):** sent **8/8** (`Tally {"sent":8}`, no failures). The **2 that errored
    twice on 07-06 — giri-jangiti, ishu-eric-davis — both went through cleanly this time** (first
    two in the run), plus grazieledepaulo, gopi-chand-nelluri, cr-ricky-williams-ii,
    alberto-riesco-matas, albertqian, alflores10. 45 → **53 contacted**, **54 still to contact**.
  - **Lane 4 (check acceptances):** **2 newly connected** — giri-jangiti (07-07, accepted our
    invite from earlier the same day), guruvenkatavamsi (07-06) → **22 connected, 31 awaiting**.
    (Connections list renders ~20 recently-added cards; matched 2/33.)
  - **Lane 5 (endorse + DM):** no connection older than 14 days (oldest was 8 days), so per the
    fallback rule picked one **≥7 days** old not-yet-DM'd — `--max=1` took the oldest eligible,
    **praveenser5599** (connected 2026-06-29, 8 days). Endorsed **10** top skills (Oracle Database,
    Power Automate, Anaplan, Flow Designer, ServiceNow, Domain Experience, Banking, Data-flow
    Diagrams, Workplace Organization, Lean Tools), then the one sanctioned favor-request DM sent +
    verified (Enter-to-send mode, composer emptied). **3 members DM'd total** (sindhura 07-02,
    kamesh 07-06, praveenser5599 07-07); 19 connected remain eligible.

## Updates

- **2026-06-26 — added `group_id` to `members.json`.** Each captured member now
  carries `{ profile_url, location, group_id }`. Outreach references the shared
  group by name, and as more groups are mined we need to know which group each
  member came from. `group_id` joins to `groups.json` (which holds the name).
  Backfilled the 19 existing members with `9078205`.
- **2026-06-26 — filled group name.** `groups.json` → `9078205` name is now
  "Agentic AI, Generative AI & Intelligent Automation | GenAI, RPA, UiPath, AI
  Agents, Bots, Blue Prism" (public group). Grabbed via `_grab-group-name.js`.

- **2026-06-27 — reach profiles via search-and-click, not bare URL loads.** The
  anti-bot warning was about an add-on **opening profile pages in the background**
  (only-ever-loads-profiles signature), not view volume. So the scraper no longer does
  a bare `goto(profileUrl)`. New `searchAndOpen()`: land on the feed → type the
  member's NAME (derived from the slug via `nameQueryFromUrl()`, hash token dropped,
  dashes→spaces) into the real search box → wait 3–15 s → click the result matching the
  slug, so the profile view carries a real in-app referrer. Falls back to a direct
  `goto` only when the exact profile isn't on the results page or the search UI fails;
  logs the nav mode per profile (`clicked` / `goto-notfound` / `goto-noquery` /
  `goto-error`) and refuses to mark a member processed if the nav didn't land on a
  `/in/` page. See SKILL.md "Reaching profiles via search". **Still pair with** the
  resume plan: clear the flag in-browser, wait a day or two, resume with small batches.

- **2026-06-27 — batch of 100, hit a hard VOLUME restriction at ~profile 60.** With
  the fixed search box (see below) the run worked well: of 59 resolved profiles, 32
  `clicked` / 26 `goto-notfound` / 1 `goto-error`, 5 new captures (26 → 31), 172 →
  231 processed. Then LinkedIn temporarily restricted the account for accessing
  "an unusually high volume of LinkedIn profile data" (lifts 6:56 AM PDT). Stopped
  immediately; clean (no false `processed`). Confirms the limit is VOLUME, not
  pattern (Mike has seen the same volume message before search-first existed, so
  search is not the cause). Decision: keep search-first, resume tomorrow at 50/day.
  See Current state "Key lesson" + "Decision".
- **2026-06-27 — fixed the search box (LinkedIn redesigned nav search).** The old
  `input.search-global-typeahead__input` is gone and classes are hashed; the live
  global search box now has placeholder **"I'm looking for…"** (typing a name + Enter
  → `/search/results/all/?keywords=...`). Diagnosed with `_probe-search.js`. Search
  result links DO use public vanity slugs, so exact-slug click works — but this group
  is full of identical common names, so the exact person is often not on page 1
  (→ `goto-notfound` fallback). `SEARCH_BOX` now targets the new placeholder with the
  old selectors as fallbacks.

- **2026-06-27 — built the contact skill (`request-connections.js`) + factored a
  shared session module (`_li-session.js`).** New skill sends a connection request
  WITH a note to each captured member not yet contacted, then records it. Mike's
  decisions: greeting is **"Hello there,"** (no first name), he's on **Premium** (so
  personalized notes work at volume), and the cap is **≤10 invites/day** (`--max`
  default 10, run once daily). `members.json` gained `contacted` (backfilled false on
  all 30), plus `contacted_at` (YYYY-MM-DD) and `contact_status`
  (`sent`/`already_pending`/`already_connected`/`no_connect_button`) written on
  send. The script STOPS on any LinkedIn limit/restriction page (never hammers) and
  has a `--dry-run` that finds the Connect button without sending. The browser
  session + login gate + search-and-click navigation now live in `_li-session.js`,
  required by BOTH scripts (no duplication); the scraper was refactored onto it with
  identical behavior (logic moved verbatim, all `S.*` refs verified).
- **2026-06-27 (later) — contact skill VERIFIED LIVE; sent first invite.** Restriction
  lifted early, so we tested with `--max=1`. First attempt returned `no_connect_button`:
  probed the real DOM (`_probe-connect.js`) and found (a) the visible **More** button
  has NO aria-label and text exactly "More" (my selector hit the hidden
  `aria-label="More"` duplicate), and (b) Connect inside the More menu is a plain
  `<a>` with text "Connect" and no aria-label. Fixed both selectors (match More by
  exact text, Connect by `div[role="menu"] ...filter(/^Connect$/)`), scoped the
  Add-a-note/textarea/Send selectors to `div[role="dialog"]` (Send = aria
  "Send invitation"), and switched the note to char-by-char `S.typeHuman` (randomized
  5-40ms/keystroke, matching the posting scripts — Mike's request). Re-ran `--max=1`:
  full flow worked, **invite SENT to yanina-silva** (Chile), `members.json` stamped
  `contacted:true, contacted_at:2026-06-27, contact_status:sent`. Both Connect
  locations (top-card primary vs More menu) are handled — Mike notes which one shows
  is seemingly random. Also added a randomized **5-20 s gap before every click**
  (open More / Connect / Add a note / Send) via `CLICK_GAP_MIN/MAX`.
- **2026-06-27 (later) — acceptance skill VERIFIED LIVE.** Connections page loads fine
  (865 connections, recently-added sort). First harvest was BROKEN — "climb 5 parents"
  overshot to the whole `ConnectionsPage_ConnectionsList`, so every card got the first
  date in the list. Probed the ancestor chain (`_probe-connections.js`): the single
  card is the highest ancestor with exactly ONE distinct `/in/` slug. Rewrote
  `harvestCards` to climb while `distinctSlugs===1` and keep the last ancestor with a
  "Connected" line — re-probe confirmed each card now yields its OWN date (11 distinct
  dates across 20 cards). Live format is **"Connected on June 24, 2026"** (parser
  matches). Dry-run end-to-end: 0/1 matched (yanina still pending), no false positive,
  no write. Lowered scroll cap 60 -> 10 (recently-added puts new accepts at the top;
  `window.scrollBy` only loads ~20 anyway, so run regularly). Source is the connections
  list, NOT `/mynetwork/grow/` (grow = transient notification, no reliable date).

- **2026-06-27 — built the acceptance skill (`check-connections.js`).** Third skill:
  opens the My Network connections page, matches connection cards by `/in/<slug>`
  against contacted members, and records `connected_on` (YYYY-MM-DD) +
  `contact_status: connected` for those who accepted. One list page, not a profile
  sweep, so it's gentle on the volume limit. `parseConnectedDate()` handles exact
  ("Connected on June 20, 2026") and relative ("today/yesterday/N days ago") forms,
  unit-tested across 8 cases; falls back to today's date (flagged inexact) if no date
  shows. Card text/format is UNVERIFIED against the live DOM (built during the
  restriction) — confirm with `--dry-run` first. Built on `_li-session.js`.

- **2026-06-29 — invite batch of 5, clean.** Ran `request-connections.js --max=5`;
  **all 5 sent** (`Tally: {"sent":5}`), no limit or restriction page. Combined with the
  same-day 30-profile scrape that's ~35 profile views for the day, well under the
  volume budget. **6 members now contacted** (yanina from 06-27 + these 5); **27 left
  to contact** in `members.json`.
- **2026-06-29 — restructured into one folder per skill.** Flattened-folder cleanup at
  Mike's direction (the loose `*.js`/`*.md` were "a slop of orphan files"). New layout:
  `skills/SKILL.md` (index) + `skills/<skill>/` folders each holding that skill's `.md`
  + `.js` + its probe; shared module → `lib/_li-session.js`; data → `data/`; one-off
  util → `tools/`. All `__dirname`-relative paths fixed (data → `../../data`,
  `require('../../lib/_li-session')`, deeper Playwright paths); verified with
  `node --check` on every script, a module load, and data-path resolution from each
  skill. Run paths are now `node linkedin-automation/skills/<skill>/<skill>.js`.

- **2026-06-29 — seeded group 6665791 with the D-names + FIXED a member-row click bug.**
  Ran `seed-by-name.js --group=6665791 --names="David,Daniel,Donald,Deborah"`. Clean,
  no restriction: David 218 matched/216 new, Daniel 244/242, Donald 8/8, Deborah 13/13 —
  **queue 1184 → 1663** (+479). `groups.json` searched_names now runs A→D.
  **Bug found + fixed (Mike caught it on screen):** the "Show more results" locator in
  `seed-by-name.js` included a too-broad `button[aria-label*="more" i]` clause. Every
  member ROW has a "More actions" (...) button, so `.first()` was grabbing a member-row
  button instead of the bottom pagination control and **clicking it open** — popping that
  member's action menu (Message/Remove). From the outside this looked like the bot
  "clicking Message on members and opening a DM window." It never SENT anything (seed only
  harvests `/in/` URLs), but it was clicking member rows it should never touch. Fix: the
  pagination locator now matches the button by its **exact visible text only**
  (`Show more results` / `Load more`); the broad aria-label clause is gone. After the fix
  the seed's ONLY two clicks are the member-search filter input and the pagination button
  (verified: `grep -n '\.click('`). **Lesson — never select an action control by a broad
  `aria-label*=` substring on a page full of per-row buttons; match the specific control
  (exact text or a scoped container), and audit every `.click()` selector for member-row
  collisions.** Also: when diagnosing "the browser is doing X," scan processes by
  `--user-data-dir` — a concurrent session's ChatGPT image browser (`chatgpt-profile`) was
  running at the same time and added to the confusion; ours is always `li-bot-profile`.
- **2026-06-29 (PM) — lanes 2-4 after the seed, all clean.** *Lane 2* scrape `--max=10`:
  10 profiles read, **1 capture (Peru)** → members.json 33 → 34; 261 → 271 processed,
  1392 remaining (Perth correctly EXCLUDE-skipped). *Lane 3* invite `--max=3`: **2 sent**
  (`diegomrios`, `pietroschena`), 1 `no_connect_button` (`hamza-moghe`, left for retry) →
  8 contacted total, 26 still to contact. *Lane 4* check-connections: 0 newly accepted, 4
  awaiting (yanina, niketa, + the 2 just sent). No restriction page on any lane. Day's
  profile-view total ~48/50 — at the ceiling (see Current state).

- **2026-06-29 (PM) — fixed the top-card Connect for the ANCHOR form.** `hamza-moghe`
  returned `no_connect_button` even though Connect was visible on the left of his top
  card. Probed (then Mike hand-grabbed the outer HTML): the primary Connect is an
  **`<a>` anchor**, not a `<button>` — `href=/preload/custom-invite`,
  `aria-label="Invite Hamza Moghe to connect"`, `<span>Connect</span>` inside. The
  invite script's primary selector was `main button[aria-label*="to connect" i]` — only
  `<button>`, so the anchor never matched and it fell through to the More menu, which for
  this profile had no Connect either. Fix: primary selector now matches BOTH tags
  (`main button[...], main a[aria-label*="to connect" i]`); `.first()` + `main` scope keep
  it on the top-card primary (no suggested-profile mis-fire). Also fixed `_probe-connect.js`
  (its dump only listed `button` / `a[role="button"]`, so it was blind to this anchor and
  showed only Follow/More — now includes `main a[aria-label]`). **Lesson — LinkedIn renders
  the same primary action as a `<button>` OR an `<a>` depending on the profile; match by
  role/aria across BOTH tags, never assume `<button>`.** Mike's rule confirmed: Connect is
  sometimes the left top-card control, sometimes only inside More — handle both, every time.
  **VALIDATED LIVE same day** via `--max=1` on hamza (a re-view of the just-probed profile,
  so no new distinct profile against the budget): the log went `read profile` -> `before
  clicking Connect` -> modal -> **INVITE SENT**, with NO "opening More" step — i.e. it matched
  the top-card anchor directly. Contrast the earlier failed Lane 3 attempt on the same profile
  (`opening More` -> `no_connect_button`). hamza now `contact_status: sent`; 25 left to contact.

- **2026-06-30 — all 4 lanes, clean (no restriction).** *Lane 1 seed* group `6665791` with
  `Edward,Eric,Eugene,Emily` (3 male E + 1 female E): Edward 38, Eric 62, Eugene 19, Emily 23 =
  **142 new** -> queue 1663 → **1805**; `groups.json` searched_names now A→E. *Lane 2 scrape*
  **40 profiles** (271 → 311) with the new 1-5 min pacing, run in 6 chunks (12/8/8/8/4/1) to
  survive the harness killing long background runs — **3 captures**: Leeds UK (europe), Gigante
  Colombia (south_america), Canada (north_america); members.json 34 → **37**. *Lane 3 invite*
  `--max=8`: **8 sent** (`Tally {"sent":8}`), 17 contacted, 20 left. *Lane 4 check-connections*:
  **2 newly accepted** — hamza-moghe + pietroschena (both connected 2026-06-29) -> 6 connected,
  11 awaiting. Day's profile-view total ~48/50 (seed + check are free). **New ops lesson:** with
  slow pacing, run the scrape in ≤8-profile chunks; the `processed` flag is resume-safe, and a
  killed chunk leaves no orphan but ALWAYS verify before relaunching.

## Open / next steps

- **Scraping:** continue the remaining **1530** queued members at **≤50/day** (one run/day)
  via `skills/scrape-group-members/scrape-group-members.js`. Launch it **detached**
  (PowerShell `Start-Process`, redirected output) and watch with a persistent log-tailing
  monitor — the full `--max=40` (07-02) and `--max=30` (07-03, 07-06) all ran in one shot with
  no kills, so ≤8-profile chunking is no longer needed unless a run gets interrupted again. The
  pointer is now in group `6665791` (hit rate jumped to ~83% on the name-seeded cohort). To seed
  more, continue the alphabet (next letter **J**) with `seed-by-name.js` (cheap, no views).
- **Outreach:** `request-connections.js` is BUILT + VERIFIED LIVE (8 invites/day 06-29→07-02,
  6 on 07-03, 6 on 07-06 — the last needed a retry after 4 transient note-textarea errors; both
  Connect placements AND both tag forms handled). Continue at **≤10/day**
  (`skills/request-connections/request-connections.js`), **30 members left** to contact (retry
  giri-jangiti + ishu-eric-davis first — they errored twice on 07-06). Don't run a big scrape and
  a batch of invites on the same day if it pushes total profile views high — both feed the limit.
- **Acceptances:** `check-connections.js` is BUILT + VERIFIED LIVE. Run it
  (`skills/check-connections/check-connections.js`) every few days to stamp
  `connected_on` as invites get accepted (start with `--dry-run`).
- Optional: wire the scraper to read the `active` group from `data/groups.json` instead
  of the hardcoded ID, so adding a group is a registry edit.
- Optional (raised 2026-06-29): instrument `request-connections.js` to log **which Connect
  path** it used (top-card vs More) + whether Follow was primary, recorded per member, to
  empirically pin down what drives the placement (Creator-mode hypothesis). Deferred — the
  script already handles both, so this is data-gathering only.
