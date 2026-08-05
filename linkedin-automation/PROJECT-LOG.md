# LinkedIn group member scraper — PROJECT LOG

Running log of work on the LinkedIn group member scraper. Newest entries at the
bottom. See `skills/SKILL.md` for how the tool works; this file is the history + state.

---

## Goal

For the LinkedIn group **9078205**, browse all members, read each member's
location, and capture the ones in **Europe / North America / South America / the
Caribbean** into `members.json` as `{ profile_url, location }`. A later (separate)
script will message the captured members using only their `profile_url`.

## Current state (as of 2026-08-04, after the full 5-lane run — see entry below)

- **Queue:** **6525** members (unchanged, no Lane 1 seed run), **1208 processed**
  (+60 today, Lane 2), **5317 remaining**. **Captured: 613** members (+42 today).
  **430 contacted** (+26 today, Lane 3 — stopped early on LinkedIn's own weekly
  invite limit, not our choice); **120 connected** (+9 today); **41 DM'd** (+2 today);
  **183 still to contact**; **310 contacted and still awaiting acceptance**;
  **76 eligible for endorse+DM (0 past 14 days, 29 in the 7-14 day band).**
- **Lane commands are the graph for all five lanes** (see `CLAUDE.md`): `--lane 1`
  seed · `--lane 2 --max N` scrape · `--lane 3 --max N` invite · `--lane 4` check ·
  `--lane 5` endorse+DM (blessed 2026-08-01) — **Lane 5 takes NO number**, the
  14/7-day rule is a mechanical gate (`lane5_plan`/`lane5_gate`).
- **Next port: `check-endorsements`** (the 6th lane) — still JS, along with `tools/`
  and the frozen lane 1-5 JS rollbacks.
- **2026-07-30 run — full 5-lane run. Mike asked for Lane 2 = 60 and, when flagged
  against the documented 50/day cap, explicitly chose to override it and run all 60
  anyway. The script's own mechanical gate (`graph/run.py`, `--max > 50` hard-blocks,
  no override flag) refused regardless of that choice, so the run was capped at 50
  by the tool, not by Mike's decision.**
  - **Lane 1 (seed 6 Z-names, 0 profile views):** 4 male short forms + 2 female per
    Mike's ask — **Zach** 15 matched/12 new (biggest hit), **Zane** 6/5, **Zeke** 0/0
    (no matches, rare-letter class same as Yancy/Quincy), **Zed** 1/1, **Zoe** 6/6,
    **Zara** 11/10 → queue 6491→6525. `groups.json` searched_names now spans the full
    alphabet A→Z.
  - **Lane 2 (scrape 50, exactly 50 profile views across the whole session): 35 new
    captures, 3 errors (repeat 404 on the same stale URL, left for retry), a genuinely
    rough day.** In order:
    - **First `--max=60` attempt refused outright** by the script's own hard-coded gate
      (`graph/run.py:104`, `Lane 2 hard rule: scraping <= 50 profile views/day.`) — not
      a bug, working as designed; re-ran at `--max=50`.
    - **NEW BUG — `UnicodeEncodeError` crashed the whole graph 6 profiles in**
      (`andreea-david`'s "Braşov, Romania" capture): `lane_graph.py`'s live-tee
      `print(line, ...)` hit Windows' cp1252 console encoding on the accented
      character. Confirmed **zero data lost** (the capture had already been written to
      disk before the print crashed) and **fixed the root cause**: added
      `sys.stdout/stderr.reconfigure(encoding="utf-8")` to the top of `graph/run.py` so
      the outer process can't choke on non-ASCII profile text again (the subprocess it
      wraps already had `PYTHONIOENCODING=utf-8`; the outer process didn't).
    - **Orphaned Chrome blocked the resume**: the crash left `li-bot-profile` Chrome
      running (never closed cleanly), so the next launch hit
      `TargetClosedError: ...browser has been closed`. Confirmed via
      `Get-CimInstance` (never bash `kill -0`) this was the dedicated automation
      profile (not Mike's main Chrome), force-closed the orphaned tree, retried clean.
    - **Then an unusually aggressive run of the background-task reaper** — killed
      **six separate chunk launches within 10-20s of starting** (far faster than the
      previously documented ~90-450s), with a couple of chunks finishing clean in
      between. Each kill was orphan-checked (clean every time, nothing left running)
      and resumed via the standard smaller-chunk retry (`--max=6`/`5`), same pattern
      as 07-28/07-29 but a noticeably worse day for it. **Zero data lost across every
      kill/resume boundary.** Total distinct chunk launches to complete the 50: 12
      (2 pre-empted by the bug/orphan issues above, ~6 reaper-killed, 4 completed
      clean).
    - **Correctly skipped:** Nigeria x2, Ghana, Kenya x2, Israel, India, South Korea,
      Botswana.
  - **Lane 3 (invite 25): 25/25 sent, zero errors, one continuous run** — a heavy
    Carlos/Carl cohort. 293→318 contacted, 200 still to contact.
  - **Lane 4 (check-connections): 10 new acceptances** — `robertocarlosmedina`,
    `juan-carlos-ojeda-62489525`, `carlosoeiras`, `carlos-eduardo-de-sousa-81847852`,
    `sergiocncruz`, `benjamin-goldschmidt-07547524a`, `carlacopper`, `cafl`,
    `lnogueram`, `carlos-eduardo-2753a92b5` → 74→84 connected.
  - **Lane 5 (endorse+DM, Mike's stated criteria this run: DM everyone >14 days with
    no DM yet, fallback one member >=7 days if none qualify, else do nothing):**
    computed the eligible pool (49 connected, no DM yet, not `no_skills`) **before**
    picking `--max` this time (lesson from 07-29's `--max=3` miscount) — exactly
    **one** member cleared the strict >14-day bar: `anthony-allen-47b97268` (15d),
    so the >=7-day fallback wasn't needed. Ran `--max=1`: 10/10 skills endorsed,
    "Hi Anthony," sent. 33→34 DM'd, 48 eligible remain.
  - **Post-run policy change (Mike): scrape cap raised 50→75/day.** Mike asked for
    Lane 2 = 60 mid-run; the hard-coded gate in `graph/run.py` refused it outright
    (no override flag), and Mike then said he'd believed the scrape cap was already
    lifted (it wasn't — only the **invite** cap was rescinded 2026-07-28, scrape
    stayed at 50). Mike's call: raise the ceiling rather than remove it outright.
    Updated the mechanical gate (`graph/run.py:107`, now `--max > 75`) plus every
    doc reference (`CLAUDE.md`, `skills/SKILL.md`,
    `skills/scrape-group-members/scrape-group-members.md`). Underlying restriction
    risk is unchanged (still ~120/24h trips it) — 75/day leaves less headroom than
    50 did if a big invite/endorse batch runs the same day.

- **Queue:** **6491** members (+56 from Lane 1's Y-name seed), **1032 processed** (+20 from
  Lane 2), **5459 remaining**. `groups.json` searched_names now **A→Y**. **Captured: 483**
  members (+15 today, all in-zone: 7 North America / 5 Europe / 2 South America /
  1 Caribbean; then **-2** for the `no_skills` cleanup below). **295 contacted** (+15);
  **76 connected** (+5); **33 DM'd** (+3); **188 still to contact**.
- **2026-07-29 run — full 5-lane run, no restriction page at any point (~38 profile views:
  20 scrape + 15 invite-lane + 3 endorse-lane, comfortably under the 50/day scrape
  ceiling).**
  - **Lane 1 (seed 6 Y-names, 0 profile views):** 4 male short forms + 2 female per Mike's
    ask — **Yale** 1 matched/1 new, **Yancy** 0/0 (Y is a very rare letter, same class as
    Q/U), **Yves** 4/4, **Yusuf** 46 matched/**43 new** (by far the biggest hit — heavy
    substring match), **Yvonne** 6/5 new, **Yolanda** 3/3 new → queue 6435→6491,
    `groups.json` searched_names now **A→Y**.
  - **Lane 2 (scrape 20): 15 new captures, 0 hard errors** — regions **7 North America /
    5 Europe / 2 South America / 1 Caribbean**. Correctly skipped: Lagos Nigeria, Nairobi
    Kenya ×2, Chengdu China. **NEW FAILURE CLASS — the background-task reaper killed the
    LangGraph Lane 2 port mid-run, the first time this has hit the Python port.** The
    initial `--max=20` launch was silently reclaimed after profile 7/20 (no LinkedIn
    restriction page, no script error — the same external idle/background-task kill
    documented for the old JS scraper on 2026-06-30/07-01, now confirmed on `graph/run.py`
    too). Verified the checkpointed writes were intact (`processed` 1012→1019, `captured`
    470→475, exactly matching the last printed profile) and confirmed no orphan
    `li-bot-profile` Chrome or stray python process via `Get-CimInstance` (never bash
    `kill -0`), then **finished the remaining 13 profiles as three small foreground chunks**
    (`--max=4`, `--max=5`, `--max=4`) — each ran to completion (one auto-backgrounded by the
    tool's own timeout but finished cleanly on its own, not reaper-killed). Zero data lost
    across every kill/resume boundary — same lesson as the 06-30 harness notes, now
    confirmed to apply to `graph/run.py` as well.
  - **Lane 3 (invite 15): 15/15 sent, zero errors.** One continuous run (not reaper-killed
    this time), mostly a Carlos/David/Andrew cohort. 280→295 contacted, 190 still to
    contact.
  - **Lane 4 (check-connections): 5 new acceptances** — `andrew-koziol-26313439b`,
    `juan-carlos-lumbreras-diaz-93440611b`, `molerocarlos`, `carlos-anegon-arenas`,
    `chris-andaur-ing` (all dated 07-28/07-29) → 71→76 connected.
  - **Lane 5 (endorse+DM, `--max=3`): 3/3 sent.** Per Mike's stated criteria this run (DM
    everyone connected >14 days with no DM yet; fall back to one ≥7-day member if none
    qualify). The script's own eligible pool (42, not the 44 I'd first counted) permanently
    excludes two members already stuck at `endorse_status: no_skills`
    (`juan-andres-sanchez-bidegain-a64747197` 27d and `giri-jangiti-b9950920b` 22d, both
    abandoned no-DM back on 07-17/07-22 — genuinely zero endorsable skills). So the true
    >14-day primary-branch match was **only `albertqian`** (15d, 9/10 top skills endorsed,
    "Hi Albert," sent). **Flag for Mike:** I sized `--max=3` off my own count of 3 apparent
    >14-day members *before* checking `endorse_status`, so the script's own oldest-first
    sort filled the other 2 slots from the next tier down — `cubicleberts` and
    `andrewwhitepeng`, both connected **exactly 14 days** (07-15→07-29), not strictly over
    14. This is the same boundary the 07-28 run deliberately excluded `albertchitiyo` on
    ("more than 14 days" read as strict). Both DMs already sent (10/10 and 10/10 skills
    endorsed, "Hi Alberto," and "Hi Andrew,") — cannot be undone; flagging for awareness
    only. 30→33 DM'd, 39 eligible remain.
  - **Post-run cleanup (Mike's ask): removed both `endorse_status: no_skills` members
    from `members.json` entirely** — `juan-andres-sanchez-bidegain-a64747197` and
    `giri-jangiti-b9950920b`, confirmed as the only two in the whole file. Note the
    endorse+DM eligibility filter (`skills/endorse-and-message/endorse-and-message.js`)
    already excludes `endorse_status === 'no_skills'` from its own `todo` list, so this
    was already a structural no-visit — the removal is purely a data-cleanup ask, not a
    behavior fix. Their `members-urls.json` queue entries stay `processed: true` (same
    treatment as the two redirect-deletions on 07-22), so no future scrape re-captures
    them. Captured 485→483.

## Superseded state (as of 2026-07-28 night: 5-lane morning run + LangGraph Lanes 1 AND 2 both blessed)

- **Queue:** **6435** members, **1012 processed**, **5423 remaining** (+50 processed in the
  morning run, +4 in the evening Lane 2 graph bless, +1 chronic-404 retirement).
  `groups.json` searched_names **A→X**. **Captured: 470** members (+2 evening: Michigan,
  Toronto). Lanes 1 AND 2 now run through `graph/run.py` (LangGraph), both Python
  end-to-end; `seed-by-name.js` + `scrape-group-members.js` = frozen rollback.
- **Captured:** **468** members in `members.json` (+29 today: 21 NA / 6 EU / 2 SA true
  zones; a Tbilisi-Georgia capture mislabeled `[north_america]` — same classifier gap
  as the Porto Alegre case below).
  **280 contacted**; **71 connected** (+3 today); **30 DM'd** (+3 today);
  **188 still to contact**.
- **2026-07-26 run — full 5-lane run, no restriction page at any point (~67 profile
  views: 50 scrape + 8 invite-lane incl. 2 errors + 9 endorse-lane incl. 1 error).**
  - **Lane 2 (scrape 50):** 39 new captures, 1 hard error (`carolina-bermudez-b55b54227`
    → 404, stays unprocessed for retry), 8 skipped as out-of-zone. Regions (true, after
    correcting the known mislabel): **17 North America, 11 Europe, 11 South America.**
    **Recovered the same recurring classifier bug** (comma-less metro string): `david-helfer`
    "Greater Porto Alegre" captured correctly (in-zone, Brazil = South America) but tagged
    `[europe]` by the whole-string scan — zone LABEL wrong, capture right, left as-is per
    the standing "still-unfixed, candidate fix overdue" note.
  - **Lane 3 (invite 5): ran as two batches, 5/8 viewed sent (63%).** Batch 1 (`--max=5`,
    the reordered-to-front backlog): `christopher-n-95029035` and `christopherhamel2022`
    sent; `cwcala` retired at **2nd `no_connect_button` strike**; `christopher-taylor` and
    `christopher-maly` both failed again at the note/Send step — their **3rd and 2nd**
    consecutive transient failure respectively across 07-24 and today, so (matching the
    documented repeat-offender fix used for other stuck members on 07-20/07-22) **both were
    reordered to the end of `members.json`** (data unchanged, order only) so they stop
    blocking the front of the queue. Batch 2 (`--max=3`, drawn after the reorder):
    `christopherpaquet`, `christopher-lafumee-488685327`, `christopher-bartsch-12a09a201` all
    **sent** — reaching the requested 5 total for the day.
  - **Lane 4 (check-connections):** **19 new acceptances** dated 07-23 through 07-26 (7 exact
    same-day, rest backfilled from relative "N days ago" text) — 49→68 connected.
  - **Lane 5 (endorse+DM, `--max=9`):** all 9 members connected **>14 days ago** (15-22 d)
    with no DM yet. **8/9 endorsed + DM'd** (`ranjith-y-a9097815a`, 22 d, hit its now-familiar
    `linkedin.com/404` — 4th run in a row it's failed to load, still unprocessed for retry).
    Sent: `yanina-silva-76781a255` (18 d, 7 skills), `gopi-chand-nelluri-5a479b124` (18 d, 10),
    `carlos-alberto-mariani-80357b148` (17 d, 10), `daniele-alberti-844a9363` (16 d, 10),
    `sastre` (16 d, 10), `alberto-bellemo-bullo` (16 d, 10), `albertstewart` (15 d, 6),
    `luizleite48` (15 d, 10). `albertchitiyo` (exactly 14 d) intentionally left out of this
    batch — "more than 14 days" read as strict, so it rolls into the next >14-day cohort.
- **2026-07-24 run — RE-INVITE BACKLOG CLEARED, invites only (Mike: "continue with the
  re-invites, do all of the remaining"). 40/44 sent, no restriction page at any point.**
  Only Lane 3 ran. The 44 remaining `reinvite_note` members had scattered to indices 10-263
  after the 07-23 run, so they were re-ordered to the front of `members.json` first, then run
  as **5 sequential batches** (8/8/8/8/12), each launched detached via PowerShell
  `Start-Process` + watched with `Monitor`, orphan-checked (`Get-CimInstance`) between every
  batch. **~44 profile views; the week now sits at ~175 invites** (LinkedIn weekly cap
  ~100-200; flagged to Mike before starting). **Zero misfires — every send passed the identity
  guard**, including `ben-olson` (the exact substring-bug name from 07-22: reached via exact-slug
  click, owner "benjamin olson" confirmed — NOT the `-02b90545` stranger).
  - **Backlog 44 → cleared.** Tally: **40 sent**, 1 `no_connect_button` strike-2 retirement
    (`alberto-ruiz-pérez`, parked at strike 1 on 07-23), and **3 deferred to the next run day**:
    `cwcala` (follow-only, `no_connect_button` strike 1) and two **safe-abort transient errors**
    (`christopher-taylor`, `christopher-maly` — identity verified, Connect modal opened, then the
    note/textarea step failed, so the script aborted WITHOUT sending a blank invite; left
    `contacted:false`). **Not retried same-day on purpose:** two consecutive modal failures at the
    tail of a 40-invite day can be an early soft-throttle signal, and with the account one strike
    from a permanent ban it wasn't worth hammering. Overall **40 sent / 44 viewed = 91%**.
  - **First launch failed at startup** (Chrome closed during Playwright connect,
    `launchPersistentContext: ...browser has been closed`) — no invite sent, no orphan. Cause was
    the detached `Start-Process -WindowStyle Hidden` flag interfering with the headful Chrome
    launch; **dropping `-WindowStyle Hidden` fixed it** and every batch launched cleanly after.
  - **Mike asked why it still searches by name** rather than going straight to profile URLs (his
    concern: search is what invited strangers on 07-22). Clarified + confirmed no change needed:
    the stranger invites came from **URL-substring** result matching (fixed 07-22 → exact-slug
    equality), not from searching; the flow already falls back to direct navigation when search
    finds no exact-slug match, and re-verifies the landed slug + Connect-button owner either way.
    Search-first is also a **hard anti-detection rule** (`CLAUDE.md`: bare `goto` is a flagged
    signature), so it stays.
- **2026-07-23 run — RE-INVITE BACKLOG DAY 2, invites only (Mike: "send 60 of those
  re-invites today, and then that's all"). 60/60 sent, no restriction page at any point.**
  Only Lane 3 ran: **no seed, no scrape, no acceptance check, no endorse+DM, no
  check-endorsements** — Mike's explicit scope. Run as **8 sequential batches**
  (6/8/10/10/10/12/12/1), each launched detached via PowerShell `Start-Process` + watched
  with the `Monitor` tool, with an orphan check (`li-bot-profile` Chrome AND linkedin node,
  via `Get-CimInstance`, never bash `kill -0`) between every batch. **~72 profile views**
  — over the informal 50 ceiling per Mike's explicit 60-invite ask, and the week now sits
  at roughly **135 invites** (LinkedIn's weekly cap is ~100-200; flagged to Mike before
  starting, he confirmed). **Zero misfires — every send passed the identity guard.**
  - **Backlog: 112 → 47.** Tally across batches: **60 sent**, 3 `no_connect_button`
    retirements (2nd strike), 1 strike-1 deferral, 3 identity-guard/transient errors.
  - **Send rate rose as the queue front cleared:** batch 1 was 3/6 (the two known
    strike-1 follow-only profiles sat at the front), batches 6-7 were 12/12 and 11/12.
    Overall **60 sent / 72 viewed = 83%**.
- **NEW GUARD — same-day double-strike (`nocb_last`), added mid-run.** The two-strike
  retirement rule (07-22) assumed **one run/day**; on a 8-batch day the next batch re-hit a
  strike-1 member minutes later (`sergiobrindis`, batch 1 → batch 2), burning a second
  profile view and retiring them with no real retry gap. `request-connections.js` now stamps
  `nocb_last: <today>` with each strike and the batch selector skips anyone struck today, so
  **strike 2 can only land on a later day** and no member is viewed twice in one day (itself
  a bot-ish signature). Documented in `skills/request-connections/request-connections.md`.
  In effect from batch 3 on; one member is currently parked at strike 1
  (`alberto-ruiz-pérez-1bb0b860`).
- **NEW FAILURE CLASS — stored profile URL no longer resolves to its own slug.** Two
  backlog members' saved URLs 404'd on search and then **redirected to a DIFFERENT slug** on
  the direct-load fallback, so the 07-22 landed-slug guard aborted them untouched (correctly
  — a redirect is not proof of identity, which is the exact assumption behind yesterday's
  ~55 stranger invites). Each one re-blocked the front of every batch, costing a view per
  batch, so both were moved to the end of `members.json` mid-run and then, **per Mike's call,
  DELETED from our records so they are never tried again** (members.json 402 → 400). Their
  `members-urls.json` entries stay `processed: true`, so no future scrape re-captures them.
  Deleted records, verbatim for audit:
  - `https://www.linkedin.com/in/alberto-bonguele-1096b2297/` — "Paris, Île-de-France,
    France", group `6665791`, `contacted:false`, reinvite_note (07-22 audit) — redirected to
    `/in/alberto-bonguele`.
  - `https://www.linkedin.com/in/andrew-teesdale-jr/` — "Greater Seattle Area", group
    `6665791`, `contacted:false`, reinvite_note (07-22 audit) — redirected to `/in/awtjr`.
- **Not done today (deliberately deferred, all still pending):** the acceptance check, the
  endorse+DM lane (**3 members now over 14 days**: `ranjith-y-a9097815a` 19 d — retry, it
  404'd on 07-22 — plus `yanina-silva-76781a255` and `gopi-chand-nelluri-5a479b124` at 15 d;
  27 eligible in total), `check-endorsements`, and the next seed letter (**W**).
- **Still-unfixed classifier gap (now 5 runs running).** Untouched today since no scrape ran.
  Comma-less metro strings ("<City> Metropolitan Area" / "Greater <City> Area") fall through
  the whole-string scan and are silently skipped, then marked `processed:true`; it also
  mis-zoned "Greater Porto Alegre" as Europe. **Candidate fix (overdue):** a metro→country
  lookup, or extend the comma-less city list with the metros already seen (San Diego,
  Medellín, Badajoz, Tallinn, Bogotá, Arequipa, Valencia, Orlando, Tuscaloosa, Malmö, Lyon,
  Porto Alegre, Memphis). **Do this before the next scrape.**

## Superseded state (as of 2026-07-22, after a full 5-lane run)

- **Queue:** **6261** members. **910 processed**, **5351 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Captured:** **402** members in `members.json`. **267 contacted**; **49 connected**;
  **135 still to contact**. **19 DM'd.**
- **2026-07-22 run (5 lanes, all clean, no restriction page at any point):** (1) seeded 6
  V-names (**+410**, 0 profile views: Vince 31, Vic 153, Vern 6, Van 202, Vicky 0, Vera 18 —
  4 male + 2 female per Mike's ask) → queue 5851→6261, `groups.json` searched_names now
  **A→V**. Note **Vicky returned 19 matches but 0 new** — the "Vic" substring search had
  already pulled every Vicky; and **Van** substring-matches heavily (Vandana/Vanessa/van der).
  The seed ran in **two launches**: the first was interrupted after "Vince" (the known external
  background-task kill), and my orphan-Chrome cleanup then killed Chrome under a node process
  that was actually still alive (the bash `kill -0 <winpid>` liveness check is invalid across
  the Git-Bash/Windows PID boundary and falsely reported the process dead), which errored the
  remaining 5 names out; relaunched with just those 5 and they completed cleanly. **Lesson:
  verify process liveness with `tasklist //FI "PID eq N"`, never bash `kill -0`, before killing
  anything on `li-bot-profile`.** (2) scraped 20 → **16 auto-captured**, 1 hard error
  (`carolina-bermudez-b55b54227` → linkedin.com/404, stays unprocessed for retry) — regions
  **7 South America / 3 Europe / 5 NA (+1 mislabeled, see below)** — **+1 recovered classifier
  miss** (the same comma-less-metro gap, now **5 runs running**: `carolinejanekennedy`
  "Memphis Metropolitan Area" = Tennessee = North America, manually added at 0 extra views since
  already spent) → members.json **385→402**, effectively **8 SA / 3 EU / 6 NA** in-zone.
  Correctly skipped: Chennai ×2 (India). **New classifier bug (zone label, not capture):**
  `ana-carolina-carrasco` "Greater Porto Alegre" was captured but labeled **`[europe]`** —
  Porto Alegre is **Brazil (South America)**. Still in-zone so the capture is right, only the
  zone tag is wrong; the comma-less whole-string scan matched a European substring. (3) sent
  **5/5 invites** across two launches — the first run was `{"sent":4,"error":1}`, the error
  being **`aseguillon` for the THIRD consecutive run** (07-15 email-verification gate, 07-21
  and 07-22 `locator.click: Timeout 6000ms` on Send) → left `contacted:false` and **reordered
  to the end of `members.json`** (data unchanged, order only), same treatment as
  `amandacrawfordcodes`/`amanda-warrell` on 07-20, then a `--max=1` run landed the 5th invite
  (`christopherpaquet`) → 262→267 contacted, 135 still to contact. Invited:
  `christopher-maly-227086158`, `christopher-n-95029035`, `christopherhamel2022`, `cwcala`,
  `christopherpaquet`. (4) acceptance check → **1 new: christopher-p-453bb33 (07-21)** → 49
  connected. (5) endorse+DM ran the **primary `>14-day` branch across ALL 5 qualifying members**
  (`--max=5`, per the skill's no-DM-cap rule — first run to send more than one DM in a day):
  `Tally {"sent":3,"error":1,"no_skills":1}` → **3 DM'd** — `mohandass-thirunavukkarasu-8b560855`
  (19 d, 10/10 skills, "Hi Mohandass,"), `guruvenkatavamsi` (16 d, 10/10, "Hi Guruvenkatavamsi,"),
  `fahad-k-859b691b6` (16 d, 7/7, "Hi Fahad,"); `ranjith-y-a9097815a` (18 d) hit a
  **linkedin.com/404** and stays for retry; `giri-jangiti-b9950920b` (15 d) had **no endorsable
  skills** → abandoned `no_skills`, no DM → **19 DM'd total** (2 `no_skills` total), 28 eligible
  remain. Profile-view budget **~31/50** (20 scrape + 6 invite-lane incl. the 1 error + 5
  endorse-lane) — comfortably under the ceiling, the first run in a week that stayed under it.
  Lanes ran strictly sequential (one `li-bot-profile` Chrome; verified zero orphan Chrome AND
  zero stray linkedin node process before every lane launch).
- **2026-07-22 (later): built skill 5 — `check-endorsements` (endorse-back tracking, Mike's ask).**
  Answers "who has endorsed us back?" — the loop-closer for skill 4's favor-request DM. Two live
  DOM probes first (`_probe-endorsements.js`, `_probe-endorsers-page.js`), which established: each
  endorsed skill row on our own `/details/skills/` carries a stable `/endorsers/` URN href (skill id
  embedded, 2 anchors per skill → dedupe by href); the endorsers list renders in an overlay OUTSIDE
  `<main>` with NO `role="dialog"`; and the overlay lazy-loads on its OWN internal scroll container
  (window scroll loads nothing — the 50-endorser skill rendered only 10 rows until the script drove
  the overlay's scrollTop). Data: new append-only `data/endorsements.json` (one record per
  skill×endorser, members AND non-members) with **`first_seen` = observed date** — LinkedIn shows no
  real endorsement date (Mike accepted the observed-date convention, same as check-connections; run
  the skill every run day so the dates stay roughly right). Members found among endorsers get
  `endorsed_back / endorsed_back_on / endorsed_back_skills / endorsed_back_count` in members.json.
  Incremental by default (skill skipped when its on-page count == recorded count; `--all` forces).
  Own-profile pages only → 0 member profile views, run freely. **First run: 69/69 endorsements
  harvested cleanly across 10 skills (incl. the full lazy-loaded 50 on Python) → CAMPAIGN: 2/19
  DM'd members have endorsed back — `neena-parveen-864b43188` (10 skills, DM'd 07-14) and
  `jackidev` (8 skills, DM'd 07-15); 17 outstanding; 50 organic (non-member) endorsers on file.**
  Docs updated: skills/SKILL.md (five skills now), folder CLAUDE.md, this log.
- **Still-unfixed classifier gap (now 5 runs running: 07-15, 07-17, 07-20, 07-21, 07-22).**
  Comma-less metro strings ("<City> Metropolitan Area" / "Greater <City> Area") fall through the
  whole-string scan and are silently skipped, then marked `processed:true`. Today it cost
  "Memphis Metropolitan Area" and also **mis-zoned** "Greater Porto Alegre" as Europe. **Candidate
  fix (unchanged, now overdue):** a metro→country lookup, or extend the comma-less city list with
  the metros already seen (San Diego, Medellín, Badajoz, Tallinn, Bogotá, Arequipa, Valencia,
  Orlando, Tuscaloosa, Malmö, Lyon, Porto Alegre, Memphis). Worth doing before the next scrape.

## Superseded state (as of 2026-07-21, after a full 5-lane run)

- **Queue:** **5851** members. **891 processed**, **4960 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Captured:** **385** members in `members.json`. **262 contacted**; **48 connected**;
  **123 still to contact**. **16 DM'd.**
- **2026-07-21 run (5 lanes, all clean, no restriction page at any point):** (1) seeded 6
  U-names (+157, 0 profile views: Uriel 4, Usman 43, Ulrich 2, Uma 108, Ulysses 0, Ursula 0 —
  4 male + 2 female per Mike's ask; **U is a rare first-letter**, Ulysses/Ursula returned zero
  and Uma substring-matches heavily → Umar/Umang/Kumar etc.) → queue 5694→5851, `groups.json`
  searched_names now **A→U**; (2) scraped 40 → **35 auto-captured**, 0 hard errors — regions
  **14 South America / 10 Europe / 10 North America / 1 Caribbean** — **+3 recovered classifier
  misses** (same comma-less-metro gap as 07-17/07-20: "Bogotá D.C. Metropolitan Area" Colombia,
  "Arequipa Metropolitan Area" Peru, "Greater Valencia Metropolitan Area" — Valencia is in-zone
  either way, Spain=EU or Venezuela=SA; all manually added at 0 extra views since already spent)
  → members.json **347→385**, effectively **16 SA / 11 EU / 10 NA / 1 Caribbean** in-zone.
  Correctly skipped: "Greater Brisbane Area" (Australia) and Kenya; (3) sent **24/25 invites**
  (`Tally {"sent":24,"error":1}`) — the 1 error was **`aseguillon`**, the SAME member that hit
  the email-verification gate on 07-15, this time a `locator.click: Timeout 6000ms` on Send; it
  did NOT block the run (the other 24 proceeded), so it was left `contacted:false` for retry and
  **not** reordered → 238→262 contacted, 123 still to contact; (4) acceptance check → **3 new:
  benjamin-walden-479979253 (07-21), charliehunger (07-21), benjamin-randoing (07-20)** → 48
  connected; (5) endorse+DM **1: sethadamcohen** (connected 2026-07-03, **18 days** — primary
  `>14-day` branch; **5 members qualified at >14 days**, picked oldest per the script's own sort,
  one DM per the established daily cap) — 10/10 skills endorsed (Artificial Intelligence (AI),
  Coaching, Training, Employee Training, Training and Development (HR), Social Issues,
  Fundraising, Business Networking, Social Impact, Brand Storytelling), DM sent + verified,
  greeting "Hi Seth," → **16 DM'd total**, 30 eligible remain. Profile-view budget **~66/50**
  (40 scrape + ~25 invite-lane incl. the 1 error + 1 endorse member) — over the informal ceiling
  per Mike's explicit 40 scrape + 25 invites ask, same override pattern as 07-16/07-17/07-20.
  Lanes ran strictly sequential (one `li-bot-profile` Chrome; verified no orphan between every
  lane), each launched detached via PowerShell `Start-Process` + watched with the `Monitor` tool.
- **Still-unfixed classifier gap (now 4 runs running: 07-15, 07-17, 07-20, 07-21).** Comma-less
  metro strings ("<City> Metropolitan Area" / "Greater <City> Area") fall through the whole-string
  scan and are silently skipped, then marked `processed:true` — so they are lost unless caught by
  hand in the log. Every run since 07-17 has needed 2-3 manual recoveries. **Candidate fix:** add a
  metro→country lookup, or extend the comma-less city list with the well-known metros already seen
  (San Diego, Medellín, Badajoz, Tallinn, Bogotá, Arequipa, Valencia, Orlando, Tuscaloosa, Malmö,
  Lyon, Porto Alegre). Worth doing before the next scrape.

## Superseded state (as of 2026-07-20, after a full 5-lane run)

- **Queue:** **5694** members. **851 processed**, **4843 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Captured:** **347** members in `members.json`. **238 contacted**; **45 connected**;
  **109 still to contact**. **15 DM'd.**
- **2026-07-20 run (5 lanes, no restriction page, but Lane 3 was repeatedly interrupted by
  an external tool-level kill, not LinkedIn):** (1) seeded 6 T-names (+188, 0 profile views:
  Tom 112, Tim 50, Ted 6, Todd 7, Tina 8, Toni 5 — 4 male short-forms + 2 female per Mike's
  ask) → queue 5506→5694, `groups.json` searched_names now **A→T**; (2) scraped 40 → **34
  auto-captured** (345 total), 0 hard errors — regions **16 South America / 11 Europe / 6
  North America / 1 Caribbean** — **+2 recovered classifier misses** (same comma-less-metro
  gap as 07-17: "Greater Badajoz Metropolitan Area" Spain and "Tallinn Metropolitan Area"
  Estonia, both genuinely Europe, manually added at 0 extra views since already spent) →
  members.json **311→347**, effectively **16 SA / 13 EU / 6 NA / 1 Caribbean** in-zone;
  (3) sent **25/25 invites** — but the run required **9 separate relaunches** because the
  background task kept getting killed externally (not a LinkedIn restriction/limit page,
  no such page ever appeared) at unpredictable points (~90s to ~450s in) regardless of the
  timeout requested; verified no orphaned Chrome/node process before every relaunch. Two
  members (`amandacrawfordcodes`, `amanda-warrell-977b8760`) hit the same `locator.click:
  Timeout 6000ms exceeded` error on the Send button **3x and 2x respectively** (same flaky-
  Send class seen before, but repeated on the identical two people — possibly profile-
  specific, unconfirmed) → left `contacted:false` for retry, and **reordered their
  `members.json` position to the end of the array** (data unchanged, just order) so they
  stopped blocking the front of every relaunch's queue; 213→238 contacted, 109 still to
  contact; (4) acceptance check → **4 new: benjamingolds (07-20), billu-aswini-6001982a4
  (07-18), kieuanhbilliot (07-20, date not shown, recorded as observed today), amandafetters
  (07-17)** → 45 connected; (5) endorse+DM **1: nisha-ravikumar-6a6414239** (connected
  2026-07-03, **17 days** — primary `>14-day` branch; 4 members qualified at 15+ days, picked
  oldest per the script's own sort, one DM per the established daily cap) — 10/10 skills
  endorsed, DM sent + verified, greeting "Hi Nisha," → **15 DM'd total**, 28 eligible remain.
  Profile-view budget **~78/50** (40 scrape + ~35 invite-lane incl. retries/errors + 1 endorse
  member) — over the informal ceiling per Mike's explicit 40 scrape + 25 invites ask, in line
  with the same override pattern as 07-16/07-17; **no restriction/unusual-activity page at
  any point** despite the tool-level interruptions. Lanes ran strictly sequential (one
  `li-bot-profile` Chrome; verified no orphan between every relaunch).

## Superseded state (as of 2026-07-17, after a full 5-lane run)

- **Queue:** **5506** members. **811 processed**, **4695 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Captured:** **311** members in `members.json`. **213 contacted**; **41 connected**;
  **98 still to contact**. **14 DM'd.**
- **First time the endorse+DM `>14-day` PRIMARY branch fired.** Every prior run fell through
  to the `>=7-day` fallback (nothing had crossed 14 days). Today **two** connections hit 15
  days (both connected 2026-07-02): `juan-andres-sanchez-bidegain` and `purnima-singh`. Ran
  `endorse-and-message.js --max=1` per the "keep DM batches small" hard rule (one DM/day) — it
  picked the oldest, **juan-andres**, who had **NO endorsable skills** → abandoned `no_skills`,
  no DM (zero-skills rule). Since that was a mechanical no-op (not a criteria failure), ran
  `--max=1` **once more** to actually land a DM on a >14-day member → **purnima-singh** (10/10
  top skills endorsed, DM sent + verified, greeting "Hi Purnima,"). Net: **1 DM today.** The
  script's eligibility filter has **no hard day-floor in code** — it just takes the oldest
  not-yet-DM'd connection; the >14 / >=7 distinction is applied by *when Mike runs it*, and
  today the oldest was already 15 days so the primary criterion was satisfied by the data.
- **Classifier-miss recovery (2026-07-17).** Two genuine in-zone members were skipped by the
  known comma-less-metro gap (whole-string scan lacks these metros): **carl-hubacher-a00462123**
  "San Diego Metropolitan Area" (California = North America) and **jkvillavo12col** "Medellín
  Metropolitan Area" (Colombia = South America). Both were already marked `processed:true` (so
  they'd be lost forever). Since we'd already spent the profile views and Lane 2's goal is
  literally "capture in-zone members," I **manually added both to `members.json`** (0 extra
  views). Same known-miss class as prior "Greater Orlando"/"Greater Tuscaloosa"/"Greater Malmö"
  — still not fixed in the classifier (candidate: add San Diego / Medellín / other well-known
  comma-less metros to the city list, or a metro→country lookup).
- **2026-07-17 run (5 lanes, all clean, no restriction page):** (1) seeded 6 S-names (+899,
  0 profile views: Sam 571, Steve 46, Scott 21, Stan 34, Sue 5, Sara 222 — 4 male short-forms +
  2 female per Mike's ask; Sam/Sara substring-match heavily → Samuel/Samantha/Samir, Sara→Sarah
  etc.) → queue 4607→5506, `groups.json` searched_names now **A→S**; (2) scraped 40 → **32
  auto-captured** (309 total), 0 hard errors — regions **16 South America / 9 Europe / 6 North
  America / 1 Caribbean** (the Sam/Sara cohort skews Spain / Argentina / Brazil; Central-America
  members Nicaragua+Guatemala tagged north_america) — **+2 recovered classifier misses** (see
  above) → members.json **277→311**, effectively **17 SA / 9 EU / 7 NA / 1 Caribbean** in-zone;
  (3) sent **23/25 invites** (2 transient `locator.click: Timeout 6000ms` errors, same flaky-window
  class seen before, left `contacted:false` for retry) → 213 contacted, 98 still to contact;
  (4) acceptance check → **2 new: amanda-marlow-3723a112 (07-17, observed today), amanda-fannin-uc-davis
  (07-16)** → 41 connected; (5) endorse+DM **1: purnima-singh** (see above) → **14 DM'd total**,
  25 eligible remain. Profile-view budget **~67/50** (40 scrape + ~25 invite-lane incl. 2 errors
  + 2 endorse members [juan no_skills + purnima]) — over the informal ceiling per Mike's explicit
  40 scrape + 25 invites ask (highest single-day yet; prior high was 63/50 on 07-16); **no
  restriction/unusual-activity page at any point.** Lanes ran strictly sequential (one
  `li-bot-profile` Chrome; verified no orphan between each), detached via PowerShell `Start-Process`
  + watched with the `Monitor` tool.

## Superseded state (as of 2026-07-16, after a full 5-lane run)

- **Queue:** **4607** members. **771 processed**, **3836 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Captured:** **277** members in `members.json`. **190 contacted**; **39 connected**;
  **87 still to contact**. **13 DM'd.**
- **New: manual DM/endorse exclusion mechanism (Mike, 2026-07-16).** A member can now carry
  `dm_excluded: true` (+ `dm_excluded_reason`) on their `members.json` record to permanently
  skip endorse+DM regardless of connection age; `endorse-and-message.js`'s eligibility filter
  (and its end-of-run remaining-count) now check `!m.dm_excluded`. First use: **andrew-masih**
  (`andrew-masih-ai-ui-ux-web-designer`, connected 2026-07-13) — a personal connection Mike
  asked never be endorsed or DM'd. He was still only 3 days connected (under the 7-day
  fallback floor) so today's Lane 5 wouldn't have picked him up regardless, but the flag is
  now permanent so no future run can either. Set the data flag only AFTER Lane 3 (invites)
  finished writing, since `request-connections.js` holds `members.json` in memory for the
  whole run and rewrites the full file on each send — editing the file mid-run would have
  been silently clobbered on its next write.
- **2026-07-16 run (5 lanes, all clean, no restriction page):** (1) seeded 6 R-names (+304,
  0 profile views: Rob 126, Ron 59, Roy 86, Russ 8, Rita 21, Robin 4 — 4 male short-forms +
  2 female per Mike's ask) → queue 4303→4607, `groups.json` searched_names now **A→R**;
  (2) scraped 40 → **24 captured** (277 total), 0 hard errors — regions **17 North America**
  / **6 Europe** / **1 South America**; (3) sent **18/20 invites** (2 transient
  `locator.click` timeouts, same flaky-window class seen before, left `contacted:false` for
  retry) → 190 contacted, 87 still to contact; (4) acceptance check → **3 new: aforca
  (07-16), cubicleberts (07-15), anthony-allen-47b97268 (07-15)** → 39 connected; (5)
  endorse+DM **1**: **adailtonsilva90** (connected 07-02, 14 days — none over 14 so took the
  oldest ≥7-day eligible per the fallback, tied with 2 others at exactly 14 days; 10/10 top
  skills endorsed; DM sent + Enter-to-send, verified, greeting "Hi Adailton,") → **13 DM'd
  total**, 25 eligible remain. Profile-view budget **~63/50** (40 scrape + ~22 invite-lane
  views incl. the 2 retried errors + 1 endorse — over the usual buffer since Mike explicitly
  asked for 40 scrape + 20 invites; no restriction/unusual-activity page at any point).
  Lanes ran strictly sequential (one `li-bot-profile` Chrome; verified no orphan between
  each). Lane 2 + Lane 3 ran detached via PowerShell `Start-Process` per the harness note
  below (their Bash log-tail poll wrappers got reclaimed mid-run once each, but the detached
  node processes themselves were unaffected — re-armed via the `Monitor` tool, which
  survived to completion).

## Superseded state (as of 2026-07-15, after a full 5-lane run)

- **Queue:** **4303** members. **731 processed**, **3572 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Captured:** **253** members in `members.json`. **172 contacted**; **36 connected**;
  **81 still to contact**. **12 DM'd.**
- **Endorsement count increased (Mike, 2026-07-15):** `endorse-and-message.js` now endorses a
  random **9-15** of a member's top skills (was 5-10) — `ENDORSE_MIN`/`ENDORSE_MAX` in the
  script, plus the doc/comment references, all updated to match.
- **New edge case discovered + fixed: email-verification-required invites.** Some members'
  privacy settings require the sender to already know their email before LinkedIn will accept
  a connection request (a per-recipient gate, not an account-wide default) — modal text "please
  enter their email to connect... You can also include a personal note." We never collect
  member emails and won't guess/type into an unfamiliar modal, so `sendConnectionRequest()` now
  detects `/enter their email/i` in the dialog body right after the Connect modal opens, presses
  Escape to back out cleanly, and returns `no_connect_button` (reusing the existing status —
  no new data-model field) so the member is logged, left `contacted:false` for revisit, and the
  run continues to the next member rather than getting stuck or mistyping. First hit on
  `aseguillon` (France) — repeatedly resurfaced as first-in-queue since nothing gets written for
  a skipped member; manually reordered to the back of `members.json` per Mike's ask so the run
  could proceed to new profiles instead of retrying the same one every chunk.
- **Harness note (background-job reclaim, recurring):** long scrape/invite runs that exceed the
  foreground tool timeout get auto-backgrounded, and backgrounded runs here got killed
  mid-flight twice today (once at 20/30 scrape profiles, once at 3/5 invite profiles) — consistent
  with the known "background jobs reclaimed on idle" issue. No data lost either time (writes
  persist per-profile), but wall-clock is wasted. Fix: run remaining profiles as small
  **foreground** chunks (`--max=1` to `--max=4`) that finish inside the timeout window instead of
  letting the tool auto-background them.
- **2026-07-15 run (5 lanes, all clean, no restriction page):** (1) seeded 6 Q-names (+7, 0
  profile views: Quincy 0, Quentin 3, Quinton 0, Quinn 4, Queenie 0, Quiana 0 — Q is a very rare
  first-letter, per Mike's 4-male/2-female ask) → queue 4296→4303; (2) scraped 30 → **21
  captured** (253 total), 0 hard errors — regions **15 North America** / **6 Europe**; two likely
  classifier misses noted but not fixed mid-run: "Greater Tuscaloosa Area" (Alabama, US) and
  "Greater Malmö Metropolitan Area" (Sweden), both comma-less metros not in the whole-string scan
  list — same known-miss class as prior "Greater Orlando"/"Greater Porto Alegre"/"Greater Lyon
  Area"; (3) sent **20 invites** (chunked `--max=1..4`, Mike's explicit ask above the ≤10/day cap)
  → 172 contacted, 81 still to contact — hit the new email-verification gate on `aseguillon`
  (see above), fixed live, deferred that member, continued; (4) acceptance check → **2 new:
  andrewwhitepeng (07-15), albertqian (07-14)** → 36 connected; (5) endorse+DM **1**: **jackidev**
  (connected 07-02, 13 days — none >14 days so took the oldest ≥7-day eligible per the fallback;
  10 of 10 skills endorsed — the new 9-15 range, capped by their profile only listing 10; DM sent
  + Enter-to-send, verified, greeting "Hi Jackelin,") → **12 DM'd total**. Profile-view budget
  **~54/50** (30 scrape + ~24 invite-lane views, incl. the aseguillon retries — over the usual
  ~50 buffer since Mike explicitly asked for 30 scrape + 20 invites; no restriction/unusual-
  activity page seen at any point). Lanes ran strictly sequential (one `li-bot-profile` Chrome).

## Superseded state (as of 2026-07-14, after a lanes 3-5 run — scrape/seed skipped)

- **Queue:** **4296** members. **701 processed**, **3595 remaining**. The scrape pointer is
  well inside group `6665791`.
- **Prior state (2026-07-12):** 3291 members, 671 processed, 2620 remaining; 214 captured.
  Today's run seeded 1005 P-names (→4296) and processed 30 (→701 processed).
- **Captured:** **232** members in `members.json`. **152 contacted**; **34 connected**;
  **80 still to contact**. **11 DM'd** (sindhura 07-02, kamesh 07-06, praveenser5599 07-07,
  richard-bystrian 07-08, hamza-moghe 07-09, pietroschena 07-10, mcqueenjames 07-11, syedmsadiq 07-12,
  manjushree-shivaraju 07-13, neena-parveen 07-14, anup-upadhyay 07-14).
- **DM greeting is now personalized (Mike, 2026-07-14):** `endorse-and-message.js` opens the DM with
  **"Hi &lt;First&gt;,"** using the recipient's first name read off `<main>`'s first innerText line
  (LinkedIn profiles have **no `<h1>`** + hashed classes — same technique as the scraper's
  `readLocation`; my first attempt used `main h1` and wrongly fell back to "there" every time — fixed).
  `cleanFirstName` skips honorifics, title-cases ALL-CAPS/all-lowercase, and falls back to "Hi there,"
  on anything unclean. Verified live: dry-run + live both read **"Hi Anup,"** and the DM sent.
- **2026-07-14 run (lanes 3-5 only, seed + scrape SKIPPED per Mike, all clean, no restriction):**
  (3) sent **24 invites** (`--max=25`, `Tally {"sent":24,"error":1}` — Mike's explicit ask above the
  ≤10/day cap; the 25th, anthony-narjollet-a1b90631, errored on a Send-click timeout and was left
  `contacted:false` for retry, not marked) → 152 contacted, **80 still to contact**; (4) acceptance
  check → **1 new: william-andrews-92b5a4291 (07-13)** → 34 connected; (5) endorse+DM **1**:
  **neena-parveen** (connected 07-01, 13 days — none >14 days so took the oldest ≥7-day eligible per
  the fallback; **7 of 10** top skills endorsed; the one sanctioned favor-request DM sent + verified,
  Enter-to-send mode, composer emptied). **Then, after adding the personalized greeting (below), a
  SECOND endorse+DM: anup-upadhyay** (connected 07-01, 13 days; 8 of 10 skills endorsed — a first
  attempt DM'd with the old "Hi there," and Mike closed the window mid-send, so the endorsements saved
  and it resumed straight at the DM; the greeting fix landed the retry as **"Hi Anup,"**, sent +
  verified) → **11 DM'd total**, 23 connected remain eligible. Profile-view budget **~29/50** (24
  invites + 2 endorse members + a dry-run re-view; no scrape/seed today; check is free) — under the 50
  ceiling. Lanes ran strictly sequential (one `li-bot-profile` Chrome), verified no orphan between each.
- **2026-07-13 run (5 lanes, all clean, no restriction page):** (1) seeded 6 P-names
  (+1005, 0 profile views: Paul 155, Pete 94, Phil 58, Pat 674, Pam 23, Penny 1 — 4 male
  + 2 female per Mike's ask; Pat substring-matches heavily → Patricia/Patel/Patrick, hence 674);
  (2) scraped 30 → **18 captured** (232 total), 0 errors — **~60% hit rate** — regions
  **7 North America** (Dallas TX, Irvine CA, Henderson NV, Kuna ID, Stanford CA, Nashville TN,
  + one bare "United States") / **9 Europe** (Brighton UK, Letchworth UK, Manchester UK, London UK,
  + 2 bare "United Kingdom", Grenoble France, Hannover Germany, Portugal) / **2 South America**
  (Santiago Metro Chile ×2); many skips were West-Africa/South-Asia (Ghana, Nigeria, Zimbabwe,
  Morocco, Malaysia) — the pointer is in the Benjamin cohort. **Harness note:** the first two
  --max scrape attempts were reclaimed mid-run by the idle-background killer (7 + 13 profiles,
  persisted incrementally, no dupes); finished the remaining 10 as foreground --max=3 chunks;
  (3) sent **15 invites** (5× `--max=3`, `Tally {"sent":3}` each, Mike's explicit ask above the
  ≤10/day cap, no failures; several used the More-menu Connect path) → 128 contacted, 104 still
  to contact; (4) acceptance check → **3 new: andrew-masih (07-13), miguel-albert-villanova
  (07-13), albertchitiyo (07-12)** → 33 connected; (5) endorse+DM **1**: **manjushree-shivaraju**
  (connected 06-30, 13 days — none >14 days so took the oldest ≥7-day eligible per the fallback;
  5 skills endorsed: IT Business Analysis, SQL, Documentation, UiPath, MySQL; DM sent +
  Enter-to-send, verified). Profile-view budget **46/50** (30 scrape + 15 invites + 1 endorse;
  seed + check free) — under the 50 ceiling. `groups.json` searched_names now **A→P**.
- **2026-07-12 run (5 lanes, all clean, no restriction page):** (1) seeded 6 O-names
  (+209, 0 profile views: Oscar 21, Oliver 15, Owen 13, Omar 89, Olivia 8, Olive 63 — 4 male
  + 2 female per Mike's ask; Omar/Olive substring-match heavily, e.g. Olive→Oliver/Oliveira);
  (2) scraped 30 → **15 captured** (214 total), 0 errors — **~50% hit rate** — regions
  **12 North America** (Metuchen NJ, Frederick MD, Denver CO, LA Metro, Charlottesville VA,
  Louisville KY, Sacramento CA, Littleton CO, St. Petersburg FL, Choctaw OK, Canton MA,
  Memphis TN) / **3 Europe** (Ireland, Winterthur Switzerland, London UK). The scrape pointer
  was processing the earlier **Bill/Benjamin/Andrew** cohort (queue is name-order, pointer
  lags the seeds), which skews more South-Asian (Pakistan, Bangladesh, India) + a few
  Nigeria/Singapore — hence the lower hit rate than the Alberto/O cohorts; (3) sent **15 invites**
  (`Tally {"sent":15}`, Mike's explicit ask above the ≤10/day cap, no failures; one used the
  More-menu Connect path) → 113 contacted, 101 still to contact; (4) acceptance check → **1 new:
  luizleite48 (07-11)** → 30 connected; (5) endorse+DM **1**: **syedmsadiq** (connected 06-30,
  12 days — none >14 days so took the oldest ≥7-day eligible per the fallback; 10 skills
  endorsed: DAX, Sybase Adaptive Server, Sybase Products, Performance Tuning, Intelligence
  Analysis, Computer Science, ETL, Python, Problem Solving, Data Modeling; DM sent + Enter-to-send,
  verified). Profile-view budget **46/50** (30 scrape + 15 invites + 1 endorse; seed + check
  free) — under the 50 ceiling. `groups.json` searched_names now **A→O**. **Classifier note:**
  "Greater Lyon Area" was skipped (comma-less metro not in the city list) — Lyon = France =
  Europe, a known miss (same class as "Greater Orlando" 07-11 / "Greater Porto Alegre" 07-10),
  not fixed mid-run.
- **2026-07-11 run (5 lanes, all clean, no restriction page):** (1) seeded 6 N-names
  (+88, 0 profile views: Nick 29, Nate 8, Neil 11, Norman 7, Nancy 15, Nina 18 — 4 male
  short forms + 2 female per Mike's ask); (2) scraped 30 → **18 captured** (199 total),
  0 errors — regions **14 North America** (Columbus OH, Gainesville VA, Austin TX, Greater
  Chicago, Avon OH, Fort Worth TX, Richmond Hill GA, Tempe AZ, Detroit MI, Hubbardston MA,
  SF Bay Area, Brampton ON ×2, NYC Metro) / **2 Europe** (Leeds UK, Dublin Ireland) /
  **2 South America** (Apodi + São Paulo, Brazil) — ~60% hit rate; (3) sent **15 invites**
  (`Tally {"sent":15}`, Mike's explicit ask above the ≤10/day cap, no failures) → 98
  contacted, 101 still to contact; (4) acceptance check → **3 new: albertstewart (07-11),
  sastre (07-10), alberto-bellemo-bullo (07-10)** → 29 connected; (5) endorse+DM **1**:
  **mcqueenjames** (connected 06-30, 11 days — none >14 days so took the oldest ≥7-day
  eligible per the fallback; 6 skills endorsed: Marketing, Social Media Marketing, Financial
  Services, Marketing Strategy, Digital Marketing, Business Development; DM sent + Enter-to-send,
  verified). Profile-view budget **46/50** (30 scrape + 15 invites + 1 endorse; seed + check
  free) — under the 50 ceiling. `groups.json` searched_names now **A→N**. **Classifier note:**
  "Greater Orlando" was skipped (comma-less metro not in the city list) — a known miss, not
  fixed mid-run.
- **Superseded state (2026-07-10):** 2994 members, 611 processed; 181 captured, 83 contacted,
  26 connected, 6 DM'd.
- **Prior state (2026-07-09):** 2628 members, 571 processed, 2057 remaining; 154 captured.
  Today's run seeded 366 M-names (→2994) and processed 40 (→611 processed).
- **Captured:** **181** members in `members.json`. **83 contacted**; **26 connected**;
  **57 awaiting acceptance**; **98 still to contact**. **6 DM'd** (sindhura 07-02, kamesh 07-06,
  praveenser5599 07-07, richard-bystrian 07-08, hamza-moghe 07-09, pietroschena 07-10).
- **Hit rate stays high in group `6665791`:** the 2026-07-10 scrape captured **27/40 = 68%** —
  the Michael/Mark/Anthony-cohort skewed heavily North America (19 NA, 4 Europe, 4 South
  America), far more in-zone than the India-heavy `9078205`. (Lifetime hit rate was ~12% in
  the old group.)
- Group registry `groups.json`: `9078205` `done`, `6665791` `active`;
  `6665791` searched_names now **A→M** (added Michael, Mark, Matthew, Mary 2026-07-10 —
  Michael 150 / Mark 93 / Matthew 41 / Mary 82 new = +366 queued).
- **2026-07-10 run (5 lanes, all clean, no restriction page):** (1) seeded 4 M-names (+366,
  0 profile views: Michael 150, Mark 93, Matthew 41, Mary 82); (2) scraped 40 → **27 captured**
  (181 total) — regions 19 North America / 4 Europe (Swinton, Greater Manchester, Toulouse,
  Paris) / 4 South America (Venezuela, Peru ×2, Porto Alegre-Brazil); (3) sent **12 invites**
  (tally sent:12, 98 still to contact) — Mike's explicit ask, above the ≤10/day cap; (4)
  acceptance check → **1 new: daniele-alberti-844a9363 (07-10)** → 26 connected, 57 awaiting;
  (5) endorse+DM **1**: pietroschena (connected 06-29, 11 days — none >14 days so took the
  oldest ≥7-day eligible per the fallback; 7 skills endorsed: SAP ERP, Cross-functional Team
  Leadership, BlackLine, PeopleSoft, Vendor Management, Workday, ERP Implementations; DM sent +
  verified, Enter-to-send). **Note:** the scraper LOGGED "Greater Porto Alegre" as `europe`
  (comma-less whole-string scan matched "Porto"→Portugal), but the region tag is NOT persisted —
  members.json stores only `{profile_url, location, group_id}`, so the capture is correct; the
  member is Brazil = South America. Profile-view budget **53/50** (40 scrape + 12 invites + 1
  endorse; seed + check free) — **3 over** the informal ceiling per Mike's explicit 40/12 ask;
  no restriction seen, but watch closely on the next run before repeating 40+12 same-day.
- **2026-07-09 run (5 lanes, all clean, no restriction page):** (1) seeded 4 L-names (+91,
  0 profile views: Larry 8, Leonard 36, Lawrence 18, Laura 29); (2) scraped 40 → 22 captured
  (154 total); (3) sent **10 invites** (tally sent:10, 83 still to contact); (4) acceptance
  check → **2 new: carlos-alberto-mariani (07-09), yanina-silva-76781a255 (07-08)** → 25
  connected, 46 awaiting; (5) endorse+DM **1**: hamza-moghe (7 skills endorsed; first DM
  attempt failed `typing_failed` — composer landed 0 chars, a transient glitch matching the
  07-06 note-textarea flake — script correctly aborted rather than send garbled text; one
  clean RETRY sent it, no re-endorsement needed since `endorse_status` gated it). Profile-view
  budget **51/50** (40 scrape + 10 invites + 1 endorse; seed + check free) — 1 over the
  informal ceiling since Mike's ask was explicitly 40 scrape + 10 invite; no restriction seen,
  but watch for one on the next run before repeating 40+10 same-day.
- **2026-07-08 run (5 lanes, all clean, no restriction page):** (1) seeded 4 K-names (+111,
  0 profile views); (2) scraped 40 → 25 captured; (3) sent **8 invites** (tally sent:8);
  (4) acceptance check → **1 new: gopi-chand-nelluri** (connected_on 2026-07-08, date not shown,
  recorded as observed today); (5) endorse+DM **1**: richard-bystrian (5 skills endorsed, DM
  sent + verified). Profile-view budget **49/50** (40 scrape + 8 invites + 1 endorse; seed +
  acceptance check free).
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
- **Next run:** seed next letter **P** (`seed-by-name.js`, cheap), then resume scrape
  (`--max=30-40`, detached), then invites (`--max=10-15`; **101 still to contact**), then the
  acceptance check, then `endorse-and-message --max=1` (**22 eligible**, oldest first — next
  up is manjushree at 06-30, then neena-parveen/anup-upadhyay at 07-01, then the 07-02 quartet).
  Budget was 46/50 on 07-12 (Mike's explicit 30 scrape + 15 invite) — if a restriction ever
  appears, dial invites back to ≤10 and total views to ≤50.
  Profile-view budget today (2026-07-09) was **51/50** (40 scrape + 10 invites + 1 endorse,
  1 over the informal ceiling per Mike's explicit 40/10 ask) — watch for a restriction
  tomorrow and dial back toward ≤50 if one appears.
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

### 2026-07-22 (later): WRONG-PERSON INVITE INCIDENT — found, root-caused, guarded

- **Trigger:** Ja'Claylyn Hamner (never in any data file) replied to our invite note:
  'I don't recall joining an AI Automation group.' Sent-invitations audit
  (`tools/audit-sent-invites.js`, read-only, new) harvested the 120 newest pending sent
  invites: **~55 went to people who appear NOWHERE in our data** (her included, invited
  ~07-16, still pending — she replied to the note without accepting, which is why the
  thread timestamp looked fresh). Today alone 2 of 5 invites misfired (christopher-n,
  christopherhamel2022 stamped 'sent' while the invites actually went to strangers).
- **Root causes (both = 'script never verifies WHO it is inviting'):**
  1. `searchAndOpen` clicked search results via substring match
     (`href*="/in/<slug>"`) — saved `/in/ben-olson` also matched a DIFFERENT person
     `/in/ben-olson-02b90545`. Queue URLs were always saved correctly; the LOOKUP was loose.
  2. `sendConnectionRequest` took the FIRST 'Invite <name> to connect' control in main;
     when the top card had none (follow-primary / unavailable-profile shell), that is a
     'More profiles for you' SUGGESTION CARD → invited a random suggested stranger.
- **Fixes (in code, mechanical gates):** exact slug-equality result matching + landed-URL
  verification in `lib/_li-session.js`; in `request-connections.js`: landed slug must
  equal the target, profile h1 must exist (dead-page shells have none), and the Connect
  button's aria-label must NAME the page's h1 person — otherwise skip as no_connect_button.
- **Data repair:** christopher-n-95029035, christopherhamel2022, christopherpaquet reset to
  contacted:false (+misfire_note) — their invites provably went to strangers (paquet's went
  to a different person, 'christopherpaquette', via the substring bug). Older stamped-'sent'
  entries missing from the Sent list are ambiguous (ignored vs misfired) — NOT reset.
- **Ja'Claylyn:** benign; needs no action (invite still pending, Mike may reply or ignore).

### 2026-07-22 (later still): stray-invite cleanup + re-invite queue rebuilt

- Mike manually withdrew a chunk of the 88 stray invites from the Sent list (list:
  data/stray-invites-to-withdraw-2026-07-22.txt); remaining old strays left to expire
  (harmless). Ja Claylyn Hamner intentionally left pending.
- Automated withdrawal (tools/withdraw-stray-invites.js) got as far as clicking the
  card control + opening the modal, but the modal confirm (shadow-DOM span, no dialog
  role) was never reliably clickable; abandoned in favor of manual withdrawal.
- Full 30-day sent-list audit: 215 members stamped sent -> only 78 genuinely pending.
  The other 137 (misfired ~88 / ignored ~49, indistinguishable) were RESET to
  contacted:false with reinvite_note; queue now 275 awaiting invite. Backlog members
  sit earlier in members.json so they re-invite first.
- **Mike raised the invite cap to 20/day for the re-invite backlog** (from the default
  10). Run with --max=20 and SHRINK the scrape lane those days so total profile views
  stay low. Backlog clears in ~7 runs. Start tomorrow (2026-07-23) - today already
  carried invites + audits + mass withdrawals.

### 2026-07-22 (evening): re-invite backlog day 1 — 28 sent, guards proven

- Identity-guard regression found+fixed the same day: the new LinkedIn UI has NO
  main>h1, so the guard failed closed and zeroed batch 1. Owner name now resolves
  h1 -> tab title -> top-card Follow aria-label (request-connections.js).
- New two-strike rule: no_connect_button members retire from the queue on the 2nd
  failed attempt instead of clogging the batch front.
- Day tally: 33 invites sent total (5 morning + 28 re-invite backlog across 5
  batches of --max=5..10, run sequentially with orphan checks; 2 no_connect strike-1
  deferrals). All sends passed the name guard — zero misfires. ~54 profile views
  total, well under the ~120 restriction threshold.
- Backlog remaining: ~109 of 137 re-invites; at 30/day clears in ~4 days. Watch the
  LinkedIn weekly invite cap (~100-200; this week ~75 so far).
- Notable: abaksaj (Ana Bakšaj, follow-only profile whose original invite misfired
  to a suggestion-card stranger) got her real invite via the More-menu path.

### 2026-07-23: re-invite backlog day 2 — 60 sent, invites only

- Mike's scope: "send 60 of those re-invites today, and then that's all." Lane 3 ONLY —
  no seed, no scrape, no acceptance check, no endorse+DM, no check-endorsements.
- **60/60 sent** across 8 sequential batches (6/8/10/10/10/12/12/1), ~72 profile views,
  83% send rate, **zero misfires**, no restriction or limit page at any point.
  Backlog **112 → 47**; members.json 402 → **400**.
- Two new things came out of it (detail in Current state at the top of this file):
  1. **`nocb_last` same-day strike guard** — the two-strike retirement rule assumed one
     run/day and was retiring strike-1 members minutes later on a multi-batch day.
  2. **URL-drift failure class** — two members whose saved URL redirects to a different
     slug; the landed-slug guard aborted both, and Mike had them deleted outright.
- Weekly invite total is now ~135 (cap ~100-200). Watch for a limit page on the next
  invite run and dial back if one appears.

### 2026-07-23 (evening): DECISION — this folder is the LangGraph pilot lane

- Mike confirmed the repo-wide plan: **everything migrates to LangGraph orchestration
  (Python spine), and linkedin-automation goes FIRST** because it's the smallest,
  lowest-blast-radius lane. Full plan: root `ORCHESTRATOR-PLAN.md` §"Phase 2 direction
  chosen — LangGraph, Python (2026-07-23)".
- **Nothing operational changes yet.** When built, the graph WRAPS the existing JS
  skills as subprocess nodes at batch granularity (`--max=N`) — the scripts, their
  guards (identity, nocb_last, landed-slug), and every hard rule in `CLAUDE.md` stay
  exactly as they are. The hard rules later become graph topology (volume budget in
  state, single browser-owning node, zero-retry policy, restriction page → hard
  interrupt) — same rules, structurally enforced.
- Porting these scripts to Python comes under the repo's freeze-and-port policy
  (root `CLAUDE.md` Python-first rule) and this folder's actions go **last** among
  ports — the account has 2 strikes and the scripts only verify against live runs.
- Source material saved in this folder: `langgraph-conversation-transcript.md`
  (the LangChain/LangGraph strategy conversation that picked this lane as pilot).
  Motivation/evidence: repo-root `claudeisnaughty.md`. The one-session build plan
  (state schema, node list, ~4-5h MVP) is in Claude Code session transcript
  `0206c116` (2026-07-18).

### 2026-07-23 (late): FIRST PYTHON PORT — seed_by_name.py (Lane 1 seeding)

- Per Mike ("change it over to Python now, as a prerequisite to LangGraph"), the
  lowest-stakes script in the folder was ported first: `seed-by-name.js` →
  `skills/scrape-group-members/seed_by_name.py`, a 1:1 translation (same flags,
  selectors, pacing, scroll/stall logic, restriction stop, per-name persistence,
  output format) on the new **`lib/li_session.py`** — the Python foundation that
  future ports grow (holds ONLY what ported scripts use; port helpers WITH the
  script that needs them so live runs exercise every ported line).
- Static verification done: py_compile clean; no-names exit path correct;
  `canonical_profile_url` parity-tested against the JS on 7 edge cases (incl.
  percent-encoded slugs); `write_json` **byte-identical** to Node's
  `JSON.stringify(x, null, 2)` incl. emoji/accents (LF, no trailing newline), so
  queue-file diffs stay clean whichever side writes them.
- **NOT yet verified live. The next Lane 1 morning seed run is the blessing run**
  — use the Python command (`python skills/scrape-group-members/seed_by_name.py
  --group=... --names="..."`), watch it end-to-end, and log the result here. The
  JS original stays in place as rollback until that run is clean; after that it's
  frozen history. Docs updated: folder `CLAUDE.md` table row + the seeding section
  of `scrape-group-members.md`.
- Same hard rules apply to the Python script: single li-bot-profile instance,
  never alongside another lane, stop on restriction page.

### 2026-07-23 (later): BLESSING RUN CLEAN — seed_by_name.py verified live, port blessed

- Ran Mike's next-morning Lane 1 (letter **W**, 4 male + 2 female short forms) under the
  Python port, launched detached + log-monitored, right after the pre-flight orphan check
  came back clean: `python -u skills/scrape-group-members/seed_by_name.py --group=6665791
  --names=Will,Walt,Wayne,Wes,Wendy,Wanda`.
- **Result: 179 matched, 148 new → queue 6261 → 6409.** Per name: Will 118/98,
  Walt 17/13, Wayne 2/0, Wes 34/29, Wendy 5/5, Wanda 3/3. (Wayne's low count is genuine —
  results rendered "scroll 1: 2 matches" then stalled naturally; Wes's 34 right after
  rules out a loading failure.)
- **Post-run verification all green:** JSON parses; all 148 new entries exactly
  `{profile_url, processed:false, group_id:"6665791"}`; zero duplicate URLs in the queue;
  `searched_names` correctly appended `...Vera,Will,Walt,Wayne,Wes,Wendy,Wanda`; stderr
  empty (0 bytes); clean process exit; no orphan Chrome/python after. Login gate,
  pacing, scroll/stall, and per-name persistence all behaved identically to the JS.
- **Port BLESSED. `seed_by_name.py` is now the canonical Lane 1 seeder; `seed-by-name.js`
  is frozen history (rollback only).** First freeze-and-port migration complete —
  the `lib/li_session.py` foundation is live-proven for the next port.

### 2026-07-24: re-invite backlog cleared — 40 sent, invites only

Mike: "continue with the re-invites, do all of the remaining." Invites-only, Lane 3 only.
The 44 remaining `reinvite_note` members had scattered through indices 10-263 after the
07-23 run, so they were re-ordered to the front of `members.json` first (so `--max` draws
only the backlog, never spilling into the 135 never-contacted). Then run as 5 sequential
detached batches (8/8/8/8/12), Monitor-watched, orphan-checked between each.

- **40/44 sent, zero misfires, no restriction page.** `ben-olson` (the 07-22 substring-bug
  name) sent cleanly via exact-slug click, owner confirmed. ~44 profile views; the week is
  now ~175 invites (weekly cap ~100-200; flagged before starting).
- **3 deferred to the next run day:** `cwcala` (follow-only, no_connect strike 1, blocked
  same-day by the `nocb_last` guard) + two safe-abort transient errors (`christopher-taylor`,
  `christopher-maly` — identity verified, Connect modal opened, note step failed, aborted
  without sending a blank invite). Not retried same-day: two modal failures at the tail of a
  40-invite day can be an early soft-throttle signal, and the account is one strike from a
  permanent ban. `alberto-ruiz-pérez` retired at strike 2 (was parked at strike 1 on 07-23).
- **Startup gotcha:** the first launch died during Playwright connect
  (`launchPersistentContext: ...browser has been closed`) — no send, no orphan. Cause was the
  detached `Start-Process -WindowStyle Hidden` flag; dropping it fixed the headful launch.
- **Nav question (Mike):** clarified the search-then-goto-fallback flow already does what he
  wanted — direct navigation when search finds no exact-slug match, with landed-slug +
  Connect-owner re-verification either way. The 07-22 stranger invites were a URL-substring
  match bug (fixed → exact-slug), not "searching." Search-first stays: it's a hard
  anti-detection rule (bare `goto` is a flagged signature). No code change.
- **Deferred lanes unchanged** from 07-23: acceptance check, endorse+DM (the 3 members flagged
  >14 d on 07-23, now a day older, plus any others aging into the window), check-endorsements,
  next seed letter (W done → X), and the comma-less-metro classifier gap before the next scrape.

### 2026-07-26: full 5-lane run — scrape 50 → invite 5 → check → endorse+DM 8

Mike's ask: scrape 50 into `members.json` (report regions), invite 5, check acceptances,
then endorse+DM anyone connected >14 days with no DM yet (fallback ≥7 days if none older).
Ran as a straight sequential 5-lane day; every lane detached via PowerShell `Start-Process`
+ `Monitor`-watched, orphan-checked (`Get-CimInstance`) before every launch. **No restriction
page at any point.** Flagged the combined scrape+invite+endorse profile-view budget
(~67) to Mike before starting — well under the ~120/24h threshold that tripped the two June
restrictions.

- **Lane 2 (scrape, `--max=50`):** 50 visited, **39 captured** (queue 400→439), 1 hard error
  (`carolina-bermudez-b55b54227` → `linkedin.com/404`, stays `processed:false` for retry),
  8 skipped out-of-zone (Uganda, Nigeria x2, Australia, Sweden, Spain-Sevilla, Armenia, Ghana).
  **Regions: 17 North America, 11 Europe, 11 South America** (true zones). Recovered the
  **same recurring comma-less-metro classifier bug** (now spanning many runs): `david-helfer`'s
  "Greater Porto Alegre" (Brazil, South America) was captured correctly but zone-tagged
  `[europe]` by the whole-string scan. Capture is right, only the label is wrong; left as-is
  per the standing note that a metro→country lookup fix is overdue, not done today.
- **Lane 3 (invite, requested 5 sent):** first batch (`--max=5`, backlog reordered to front)
  landed only **2/5** — `christopher-n-95029035` and `christopherhamel2022` sent; `cwcala`
  retired at 2nd `no_connect_button` strike; `christopher-taylor-1076b8272` and
  `christopher-maly-227086158` both failed again at the Add-a-note/Send step (identity
  verified, Connect modal opened, then the step itself errored — same failure class as
  07-24). That makes 2 (christopher-maly) and effectively 3 (christopher-taylor, which also
  hit this on 07-15/07-21 in a different flow) consecutive transient failures for these two,
  so — matching the repeat-offender reorder used for other stuck members on 07-20/07-22 —
  **both were moved to the end of `members.json`** (data unchanged, order only) via a Node
  one-off script (never PowerShell `ConvertFrom/To-Json`) so they stop occupying the front of
  every future batch. A follow-up `--max=3` batch then drew fresh candidates and **sent all
  3** (`christopherpaquet`, `christopher-lafumee-488685327`, `christopher-bartsch-12a09a201`),
  bringing the day's total to **5 sent / 8 viewed (63%)** — matching the requested count.
- **Lane 4 (check-connections):** **19 new acceptances** (49→68 connected), dated 07-23
  through 07-26 across a mix of exact "Connected on ..." text and relative "N days/weeks ago"
  fallback parsing. Single list-page scan, effectively free against the volume budget.
- **Lane 5 (endorse+DM, `--max=9`):** selected the exact >14-day cohort by hand (the script
  itself has no day-threshold logic — it just processes oldest-`connected_on`-first up to
  `--max`, so the caller sets `--max` to cover the cohort). 9 members qualified at 15-22 days
  connected with no DM yet; a 10th (`albertchitiyo`, exactly 14 days) was deliberately left
  out under a strict reading of "more than 14 days" and rolls into the next run's cohort.
  **8/9 endorsed (6-10 skills each) + DM'd**; `ranjith-y-a9097815a` (22 d, the longest-waiting
  member) hit `linkedin.com/404` yet again — its 4th failed load across recent runs — and
  stays unprocessed for retry. DM'd count: 19→**27** total.
- **Net for the day:** queue 6409/910→959 processed; members.json 400→439; contacted
  259→265; connected 49→68; DM'd 19→27.

## 2026-07-28 — full 5-lane run, no restriction page at any point (~69 profile views:
50 scrape + 15 invite + 4 endorse-lane incl. 1 error). Mike rescinded the ≤10/day invite
cap this session (it was never a LinkedIn-imposed limit, just his own earlier
self-imposed default) — `CLAUDE.md`/`skills/SKILL.md`/`request-connections.md` updated
to drop the fixed cap; `--max` is now set per Mike's ask each run, still volume-aware.

- **Lane 2 (scrape 50):** ran as two batches (`--max=7` then `--max=43`, the first
  auto-backgrounded past the 600s foreground window). **29 new captures**, 1 skip-error
  (`carolina-bermudez-b55b54227` → 404 again, this is at least its 2nd consecutive
  failed load — chronic, still unprocessed for retry, worth considering for retirement
  if it keeps failing), several out-of-zone skips (Nigeria x5, South Africa, Tanzania,
  Pakistan, Kenya, India, Rwanda, Australia-area). **Regions: 21 North America, 6
  Europe, 2 South America.** Recovered a **new instance of the classifier's
  comma-less/ambiguous-string gap**: `david-maisuradze`'s "Tbilisi, Georgia" (the
  country) was captured correctly (in-zone... arguably — flagged for Mike, not
  auto-corrected) but zone-tagged `[north_america]` because the country-tail matcher
  read "Georgia" as the US state. Same class of bug as the Porto Alegre mislabel; left
  as-is pending the standing metro/country-disambiguation fix. Per-profile pacing ran
  much longer than the documented 30-90s baseline (observed 60-435s between profiles,
  incl. two "longer human break" pauses) — not a script fault, just slower live pacing
  than the doc describes; noted for future run-time estimates.
- **Lane 3 (invite 15, above the now-rescinded 10/day default): 15/15 sent, zero
  failures, no restriction page.** Every identity guard passed; no repeat-offender
  reorders needed.
- **Lane 4 (check-connections):** **3 new acceptances** — `coderssolutions` and
  `lucas-reis-cea-pqo-07441a188` (07-27), `andrew-ahabwe-475b4312a` (07-26). 68→71
  connected. Single list-page scan, effectively free against the volume budget.
- **Lane 5 (endorse+DM, `--max=4`):** exactly 4 members qualified at >14 days connected
  with no DM yet (`ranjith-y-a9097815a` 24d, `albertchitiyo` 16d,
  `miguel-albert-villanova-359b4763` 15d, `william-andrews-92b5a4291` 15d) — no >7-day
  fallback needed since the >14-day cohort was non-empty. **3/4 endorsed (9-10 skills
  each) + DM'd**; `ranjith-y-a9097815a` hit `linkedin.com/404` yet again — its 5th
  failed load across recent runs (see 07-26 entry for the 4th). **Retired (Mike's call)
  via `dm_excluded: true`** rather than left for another retry — permanently out of the
  endorse+DM pool now. DM'd count: 27→**30** total.
- **Net for the day:** queue 6409/959→1007 processed; members.json 439→468; contacted
  265→280; connected 68→71; DM'd 27→30.

### 2026-07-28 (evening): FIRST LANGGRAPH RUN — Lane 1 seed through the graph, BLESSED

The Phase 2 pilot's first actual graph (ORCHESTRATOR-PLAN §"Phase 2 direction chosen").
Scope deliberately Lane 1 ONLY (Mike: this is the learning MVP; Lane 1 likely retires
after letter Z, so the *pattern* is the deliverable — wrap → verify-from-disk → halt
topology → checkpoints — which carries to Lanes 2-5).

- **Built `graph/`**: `lane_graph.py` (StateGraph: `seed` subprocess-wraps the blessed
  `seed_by_name.py` byte-untouched + streams output; `verify_seed` re-reads the queue +
  `groups.json` from disk; conditional halt edge; zero retries) + `run.py` (CLI with
  `--stub ok|restricted|fail` structural tests; exit 0/2/1 = done/halted/failed) +
  `DESIGN.html` (the system-design page Mike reviewed). Installed `langgraph 1.2.10` +
  `langgraph-checkpoint-sqlite 3.1.0` (Python 3.12; no API keys — deterministic graph).
  Checkpoint DB `data/graph_checkpoints.sqlite` gitignored: it's LangGraph's private
  resume mechanism, holds LaneState snapshots (counts/status only, never member data);
  the JSONs remain the source of truth.
- **Restriction detection nuance:** the seeder exits 0 after a restriction (it saves
  partial progress first), so the wrapper detects the printed marker line
  ("restriction/unusual-activity page"), not the exit code → `halted_restricted`, exit 2.
- **Stub tests green** (no browser, no writes): ok → DONE; restricted → halt route,
  verify skipped; fail → FAILED with output tail preserved.
- **Blessing run (live, detached + Monitor-watched):** `python linkedin-automation/graph/run.py
  --names "Xavier,Xander,Ximena,Xiomara" --thread seed-6665791-20260728-live`.
  **26 new → queue 6409→6435.** Per name: Xavier 22/21, Xander 1/1, Ximena 4/4,
  Xiomara 0/0 (genuine zero — Mike predicted the thin X letter). No restriction page.
- **Post-run verification all green:** queue exactly 6435, zero duplicate URLs, every
  entry `{profile_url, processed, group_id}`, searched_names appended
  `...Wanda,Xavier,Xander,Ximena,Xiomara`, stderr 0 bytes, no warnings/errors in the
  log, checkpoint thread `seed-6665791-20260728-live` holds 4 snapshots.
- **GRAPH BLESSED. `graph/run.py` is now the canonical way to run Lane 1** (Claude still
  picks the names conversationally each morning; the graph replaces execution, not
  judgment). Direct `seed_by_name.py` invocation remains as fallback.

### 2026-07-28 (later): Lane 2 graph BUILT (stub-tested) — bless pending on the next morning run

Mike's Lane 2 contract, decided this session: he types just **"Lane 2, N"** (N = his
per-day number: 10/40/50, whatever) → `python linkedin-automation/graph/run.py --lane 2
--max N`. **No interrupt gate** — the number in the ask IS the human decision; no
lane-chaining / "run my morning" graph for LinkedIn, lanes stay individually invoked.
The **regions breakdown is built into the run report** (his standing "tell me what
regions they were from"), never asked for.

- **Built:** `scrape` node (subprocess-wraps the frozen `scrape-group-members.js
  --max=N`, byte-untouched) + `verify_scrape` (re-reads queue processed flags +
  `members.json` count, cross-checks disk delta vs parsed CAPTURE lines, composes the
  regions report from the CAPTURE zone tags). CLI hard-refuses `--max>50` (daily scrape
  cap). Checkpoint threads: `scrape-<YYYYMMDD>`.
- **Wrapper kill-switch (new safety the frozen JS lacks):** the scraper never calls
  `isRestricted` and its per-profile try/catch swallows errors, so a mid-run
  restriction/logout/DOM-change would grind through the whole batch failing. The
  wrapper watches the stream: **5 CONSECUTIVE per-profile errors → `taskkill /T` the
  process tree** (node + its own Playwright Chrome only — never main Chrome) →
  `failed`, diagnose before any rerun. Restriction phrasing anywhere in output
  (`temporarily restricted|unusual activity|high volume...|access to your account`) →
  `halted_restricted`, exit 2, stop for the day.
- **Stub tests all green** (no browser, no writes): ok (regions report renders,
  disk-delta cross-check works), errors (kill-switch fired at exactly 5), restricted
  (halt, exit 2), fail (FATAL + exit code caught, exit 1). Lane 1 regression stub also
  green after the shared-runner refactor.
- **NOT blessed live yet — deliberately.** Today's scrape budget was already spent by
  the morning run (50 views; hard rule: ≤50/day, one scrape run/day). **The blessing
  run is the next morning "Lane 2, N"** — useful work as verification, same as the
  Lane 1 pattern. Until it's blessed, direct `node skills/scrape-group-members/
  scrape-group-members.js --max=N` remains the canonical Lane 2 command.

### 2026-07-28 (last): scrape_group_members.py — the scraper PORTED to Python (bless pending)

Mike corrected the ordering mid-session: Lane 1's precedent is **port first, graph
second**, so the scraper port happens NOW, not after the wrapper blesses. Written
tonight, statically verified, NOT yet live-blessed:

- **`lib/li_session.py` grew** (per-port doctrine): `type_human`, `slug_from_url`,
  `name_query_from_url`, nav `SEARCH_BOX`, and `search_and_open` — incl. the
  exact-slug-only result click (the 2026-07-22 stranger-invites lesson) and the
  search-then-goto fallback modes (`clicked`/`goto-notfound`/`goto-noquery`/`goto-error`).
- **`skills/scrape-group-members/scrape_group_members.py`**: 1:1 port — ZONES/EXCLUDE
  classifier, `read_location` (main-innerText anchor method), collect phase, batch loop,
  identical pacing (60-300s between profiles, 5-8 min rest every 18), identical output
  format (the graph wrapper parses it). **One deliberate divergence, documented in the
  header:** collect-phase "Show more" selector = exact visible text only (the JS still
  carries the broad `aria-label*="more"` member-row-menu bug fixed in the seeder
  2026-06-29; the port applies the documented fix instead of re-importing the bug).
- **Parity battery: 54/54 PASS** (Node evaluating the real JS vs the port):
  `classify()` over 30 locations — bug-for-bug identical incl. the known mislabels
  (Porto Alegre→europe, Tbilisi-Georgia→north_america) and the fixed cases
  (Sydney→None, Cardiff-Wales→europe); `slugFromUrl`/`nameQueryFromUrl`/
  `canonicalProfileUrl` over 8 URL shapes. ("Washington, D.C."→None is a shared gap
  in BOTH sides — parity holds; noted, not fixed.)
- **The Lane 2 graph node now launches the Python port** (`SCRAPE_SCRIPT` in
  `graph/lane_graph.py`; the JS path stays one line away as `SCRAPE_SCRIPT_JS`
  rollback). Stub suite re-run green after the switch.
- **Blessing plan (next morning "Lane 2, N"):** run through the graph — it blesses the
  port AND the wrapper together; the wrapper is observational-only around the script
  (tee + parse + verify-from-disk) and its kill-switch actively protects the port's
  maiden run. If the run misbehaves: rollback = swap `SCRAPE_SCRIPT` to the JS, and
  the JS direct command stays canonical meanwhile.

### 2026-07-28 (night): "Lane 2, 5" BLESSING RUN CLEAN — scraper port + Lane 2 graph both blessed

Mike moved the bless up to the same evening ("Lane 2, 5") rather than waiting for
morning — his call on budget: ~69 morning views + 5 = ~74, well under the ~120/24h
threshold; the one-scrape-run/day doctrine deliberately bent this once. Pre-flight
orphan check clean; launched detached + Monitor-watched via
`python -u linkedin-automation/graph/run.py --lane 2 --max 5 --thread scrape-20260728-bless5`.

- **Result: 5/5 visited, 2 captured, 2 skipped out-of-zone, 1 known error. No
  restriction page.** Per profile: `carolina-bermudez` → 404 again (3rd consecutive;
  stayed `processed:false`, exactly right); `nitzan-davidson` → clicked, "Tel Aviv
  District, Israel" skip; `davidwillliamsdev` → goto-notfound fallback (dash-less slug
  → junk name query, documented path), **CAPTURE [north_america] Rockwood, Michigan**;
  `david-jeannette-ph-d-01560522` → clicked (name-query "david jeannette ph d" worked),
  **CAPTURE [north_america] Toronto, Ontario, Canada**; `david-adamu` → clicked,
  "Abuja, Nigeria" skip. Search-and-click landed exact slugs every time it fired.
- **Verification all green:** queue 1007→1011 processed (error member correctly NOT
  marked), members.json 468→470, both captures perfectly shaped incl. `group_id:
  "6665791"` from the queue entry, zero duplicates, stderr 0 bytes, no orphan
  processes, checkpoint thread `scrape-20260728-bless5` = 4 snapshots, graph regions
  report (2x north_america) matches disk.
- **Post-run: `carolina-bermudez-b55b54227` RETIRED (Mike's call)** — `processed:true`
  via the byte-parity writer, so no future batch draws her; done after the run
  completed (never edit the queue mid-run: the scraper rewrites the whole file from
  memory after every profile). Queue now 1012 processed / 5423 remaining.
- **BOTH BLESSED: `scrape_group_members.py` is the canonical scraper and
  `graph/run.py --lane 2 --max N` is the canonical Lane 2 command.**
  `scrape-group-members.js` = frozen rollback (`SCRAPE_SCRIPT_JS` one-line swap).
  Lanes 1 and 2 are now Python end-to-end under LangGraph; next frontier: Lane 3
  (invite) — port first, then wrap, same as this.

### 2026-07-30 (evening): Lane 3 (invite) — PORT + GRAPH BUILT, bless pending

Lane 3 built on the Lane 1/2 precedent: **port first, graph second**, JS frozen as
rollback until a live bless run.

- **`skills/request-connections/request_connections.py`** — 1:1 freeze-and-port of
  `request-connections.js` onto `lib/li_session.py` (which already held every helper
  Lane 3 needs from the earlier ports; zero lib growth this time). Logic, selectors,
  pacing (5-20s click gaps, 40-90s between invites), the 2026-07-22 identity guards
  (exact-slug landing + profile-owner name in the Connect aria-label), the two-strike
  no_connect_button retirement with the same-day gate, limit/restriction stops, and
  the OUTPUT FORMAT are byte-identical — the graph wrapper parses the lines.
  `--max` default 10, `--dry-run` supported. Startup smoke test (`--max=0`, no
  browser): reads members.json correctly (518/318/200), exits clean.
- **Lane 3 graph** (`graph/lane_graph.py` + `run.py --lane 3 --max N [--dry-run]`):
  same wrap-subprocess → verify-from-disk → halt topology. `invite` node launches the
  port, tees output, watches for the inviter's own restriction-stop marker line +
  restriction phrasing (→ `halted_restricted`, exit 2) and runs the 5-consecutive-
  error kill-switch (streak-reset patterns generalized per lane — Lane 2's
  capture/skip lines vs Lane 3's sent/already/no-connect lines). `verify_invite`
  trusts disk: members.json contacted-per-status deltas, remaining-to-contact, and a
  parsed-sent vs disk-sent mismatch check. A weekly invite/note LIMIT stop is NOT a
  halt (the account is fine) — it reports `GRAPH DONE` with a loud do-not-rerun
  WARNING. Thread id `invite-YYYYMMDD`.
- **Stub suite green** (`--stub ok | restricted | fail | errors | limit` — limit is
  new, Lane 3 only): correct routing + exit codes on all five, and the Lane 2 ok-stub
  re-run green after the kill-switch generalization. No browser, no data writes.
- **Bless plan:** next invite ask runs through the graph
  (`python linkedin-automation/graph/run.py --lane 3 --max N`) — a small live batch
  blesses port + wrapper together. Optional extra-cautious first step:
  `--dry-run` locates Connect on real profiles without sending (still burns profile
  views). Rollback = swap `INVITE_SCRIPT` to `INVITE_SCRIPT_JS` in `lane_graph.py`;
  `request-connections.js` direct stays canonical until the bless.

### 2026-07-30 (night): "Lane 3, 5" BLESSING RUN CLEAN — inviter port + Lane 3 graph both blessed

Mike called the bless run the same evening the lane was built ("lane 3, 5"). Budget:
~75-80 views already today (50 scrape + morning invites) + 5 = ~85, under the ~120/24h
threshold. Pre-flight orphan check clean; ran detached via
`python -u linkedin-automation/graph/run.py --lane 3 --max 5 --thread invite-20260730-bless5`.
No reaper kill this time — completed in one launch (~11 min).

- **Result: 5/5 INVITE SENT, zero errors, no restriction page, no limit.** Members:
  `carlos-antonio-dos-santos-43950037`, `jeancjunior`, `carlos-eduardo-oliveira-a8570a32`,
  `carlos-avila-7b281621`, `cv-mx`. Both Connect paths exercised live: More-menu
  Connect on 4 profiles, top-card primary on 1 (`cv-mx`). Identity guard resolved the
  owner name on every profile (incl. `jeancjunior` -> "jean carlos vieira junior",
  where slug != display name, and `cv-mx` -> "carlos v.") and every send went through
  the Add-a-note -> type -> Send invitation flow.
- **All 5 navigations were `goto-notfound`** (search typed + results scanned, but the
  exact slug wasn't on page 1 -> documented direct-visit fallback). Expected for this
  batch: very common LatAm names (three Carloses) bury the exact match. The
  human-looking search traffic still preceded every visit, and the exact-slug landing
  guard passed 5/5. Watch on future runs: a batch with rarer names should show
  `clicked` again (Lane 2's bless did).
- **Verification all green:** graph verify-from-disk reports contacted delta
  `sent +5`, parsed-vs-disk mismatch check silent, members.json entries perfectly
  shaped (contacted / contacted_at 2026-07-30 / contact_status sent on top of
  profile_url / location / group_id), 195 still to contact, no orphan Chrome after
  close, checkpoint thread `invite-20260730-bless5` written. Sent-today total now 27
  (22 morning JS run + 5 bless).
- **BOTH BLESSED: `request_connections.py` is the canonical inviter and
  `graph/run.py --lane 3 --max N` is the canonical Lane 3 command.**
  `request-connections.js` = frozen rollback (`INVITE_SCRIPT_JS` one-line swap).
  Lanes 1, 2, and 3 are now Python end-to-end under LangGraph; next frontier:
  Lane 4 (check-connections) — port first, then wrap, same pattern.

### 2026-07-30 (night): Lane 4 (check acceptances) — PORT + GRAPH BUILT, bless pending

Same evening as the Lane 3 bless; Mike asked for Lane 4 next. Same discipline:
**port first, graph second**, JS frozen as rollback.

- **`skills/check-connections/check_connections.py`** — port of
  `check-connections.js` onto `lib/li_session.py` (again zero lib growth: the
  scanner only needs session/login/restriction/JSON/pause helpers already there).
  Card-isolation JS (climb while distinctSlugs === 1, keep the last ancestor
  containing "Connected") kept verbatim as an `eval_on_selector_all` string; scroll
  caps (10 rounds / 5 stalls), date parsing, and output lines all 1:1.
- **TWO DELIBERATE, DOCUMENTED DIVERGENCES — both fix live defects** (header of the
  port + the skill md spell them out, so a rollback to the JS is an informed choice):
  1. **Percent-encoded slugs never matched in the JS.** `outstanding` is keyed by
     `slugFromUrl()` (decoded) but `harvestCards`' `slugOf` reads the href **raw**, so
     e.g. `alberto-ruiz-pérez-1bb0b860` (map) vs
     `alberto-ruiz-p%C3%A9rez-1bb0b860` (card) can never be equal. **Verified against
     live data: members.json holds 16 percent-encoded members, 8 of them contacted,
     and ZERO have ever received a `connected_on` — vs 84/315 (~27%) of ASCII-slug
     contacted members.** Those 8 acceptances were being silently missed on every run
     since the skill was written. The port decodes + lowercases both sides
     (`match_key()`), which also makes the CONNECTED log line human-readable.
  2. **Relative month/year math clamps instead of overflowing.** JS setMonth/setFullYear
     roll forward off a short month ("1 month ago" on May 31 -> May 1; "1 year ago" on
     Feb 29 -> Mar 1); the port gives Apr 30 / Feb 28. Edge case only (LinkedIn shows
     the exact "Connected on <Month D, YYYY>" form in practice), but `connected_on`
     feeds Lane 5's ">14 days connected" DM gate, so an accurate date matters.
- **Lane 4 graph** (`graph/lane_graph.py` + `run.py --lane 4 [--dry-run]`): same
  wrap → verify-from-disk → halt topology. **No `--max`** (one list page; `--max` is
  rejected outright) and **no kill-switch** — there is no per-member visit loop to go
  systemically wrong, so the only failure modes are a restriction page (halt, exit 2)
  or a crash (fail, exit 1). `verify_check` compares the disk `connected_on` delta
  against the parsed CONNECTED lines, and on `--dry-run` asserts the OPPOSITE: any
  write at all is a defect and gets flagged. Report lists every newly-connected member
  with their date and marks inexact/observed dates. Default thread is
  `check-YYYYMMDD-HHMM` (not just the date) because this lane is run repeatedly.
- **Tests green:** all four Lane 4 stubs (`ok`/`restricted`/`fail`/`nothing`, the last
  being the no-browser empty-queue path), the arg guards (`--max` on lane 4,
  `--stub nothing` off lane 4, `--dry-run` on lanes 1-2), Lanes 1/2/3 stub regressions
  after the shared-code edits, and a unit pass over `parse_connected_date` (9 cases:
  exact/abbreviated/comma-less months, today/yesterday, N days/weeks, unparseable ->
  observed-today-inexact) plus a live-data proof of the slug fix (JS match False,
  port match True on `alberto-ruiz-p%C3%A9rez-1bb0b860`).
- **Bless plan:** next "Lane 4" ask runs through the graph. Because of fix 1, expect
  the first blessed run to possibly catch acceptances from the 8 accented-slug members
  that the JS could never see — that would be the fix proving itself. Rollback =
  `CHECK_SCRIPT_JS` swap (which reintroduces both defects).

### 2026-07-30 (night): "Lane 4" BLESSING RUN CLEAN — scanner port + Lane 4 graph both blessed, and the slug fix caught a member the JS never could

Ran immediately after the Lane 4 build, foreground (short single-page scan, so no
exposure to the background reaper): `python -u linkedin-automation/graph/run.py --lane 4
--thread check-20260730-bless`. Pre-flight orphan check clean, ~40s total, ~0 profile
views.

- **Result: 7 members newly marked connected** (239 awaiting -> 232). `carlos-avila-7b281621`,
  `juan-carlos-françois`, `shaunsummerlin`, `davidcarlondata`, `luiz-viana-ceo-vorcon`
  (no date shown -> recorded as observed today, correctly flagged), `juan-carlos-pereda`,
  `vinicius-alberto`. members.json `connected_on` 84 -> 91, `contact_status: connected`
  also 91 (the two counts agree exactly), verify-from-disk delta +7 = the 7 parsed
  CONNECTED lines, no mismatch warning, no orphan Chrome.
- **THE PERCENT-ENCODED SLUG FIX PAID OFF ON ITS FIRST RUN:
  `juan-carlos-fran%C3%A7ois` was matched.** He was invited hours earlier in the Lane 3
  bless run and accepted the same day. Under the JS he would have been invisible to
  every future scan -- stuck in the "awaiting acceptance" bucket permanently and never
  becoming eligible for Lane 5's endorse+DM. This is the exact failure the port's
  documented divergence 1 predicted, caught in production the first time it ran.
  (The other 7 contacted encoded-slug members simply haven't accepted yet.)
- **Scroll behaviour matched the documented limitation exactly:** 20 cards on the page,
  no growth across rounds, stall counter tripped at 5 -> exited after round 6 of a
  possible 10, so only the top-of-recently-added slice is read (7/239 of ours). That is
  the known `window.scrollBy` ceiling recorded in the skill md, not a port defect --
  and the reason this lane is meant to be run often.
- **BOTH BLESSED: `check_connections.py` is the canonical acceptance scanner and
  `graph/run.py --lane 4` is the canonical Lane 4 command.** `check-connections.js` =
  frozen rollback (`CHECK_SCRIPT_JS` one-line swap, which reintroduces both defects).
  **Lanes 1, 2, 3 and 4 are now Python end-to-end under LangGraph**; next frontier:
  Lane 5 (endorse-and-message) -- port first, then wrap, same pattern. Note for that
  port: Lane 5's ">14 days connected" gate reads `connected_on`, the field this lane
  writes, so the two ports share a contract worth re-checking there.

### 2026-07-31 (morning): full 5-lane run — Lane 2/10, Lane 3/50, Lane 4, Lane 5;
an unusually aggressive reaper day on Lane 3, worked through via foreground chunking
plus a stuck-profile reorder fix

Mike's ask: Lane 2=10, Lane 3=50, Lane 4 (no number), Lane 5 = all members connected
>14 days with no DM yet, fallback one member ≥7 days if none qualify, else nothing.
Pre-flight orphan check clean before every launch, as always.

- **Lane 2 (scrape 10): clean, one continuous background run, no kill.** 8 new
  captures (5 Europe, 2 North America, 1 South America), 1 skipped out-of-zone
  (Bologna), 1 error (stale 404 on `david-61293b107`, left for retry). 518→526
  captured, queue 5447→5438 remaining.
- **Lane 3 (invite 50): by far the roughest Lane 3 to date — 7 separate kills before
  it finished, but zero data lost across every one.** The first background launch got
  reaper-killed at 29/50 (26 genuinely sent) — normal, matches prior days. The next
  **6 relaunches in a row all died within ~40-70s of starting, every one before
  completing even a single invite** — a materially more aggressive kill pattern than
  any prior day's log entry. Diagnosed two compounding issues:
  1. **Two members were genuinely stuck, not reaper victims**: `amandacrawfordcodes`
     and `amanda-warrell-977b8760` both hit a real `Locator.click: Timeout 6000ms
     exceeded` on the Send button, repeatedly, and since they sat first in
     `members.json`'s array order, every relaunch re-burned ~90s retrying them before
     reaching fresh profiles. Fix (precedent from 07-20, see
     `reference_linkedin_bg_task_kills`): moved both entries to the end of the array
     via a Node one-liner (order-only, zero field changes, count unchanged) so future
     runs skip past them to unstuck members. They remain in the eligible queue for a
     future run/manual look, just no longer blocking the front.
  2. **The reaper itself was hitting `run_in_background: true` launches almost
     immediately** (not the documented ~90-450s window — more like 40-70s today).
     Switching to a **foreground** Bash call (`timeout: 600000`, no
     `run_in_background`) reliably survived past that window every time; small chunks
     (`--max=4`) completed cleanly inside the 10-minute foreground cap without ever
     touching the background path. Two larger foreground attempts (`--max=20`,
     `--max=24`) ran past 10 minutes, auto-converted to background by the harness, and
     were then vulnerable again (one killed after landing 4 more invites first, no
     data lost) — so **for this account, small foreground chunks that finish inside
     the 10-minute window are the reliable pattern, not just "foreground over
     background" in general.**
  - Final tally: **50/50 invited** (26 initial + 4+4+4+4+4+4 across six foreground
    `--max=4` chunks after the reorder fix). 323→373 contacted, 153 still to contact.
- **Lane 4 (check-connections): clean, foreground, ~40s, no kill.** 4 new
  acceptances — `carlos-gomes-financeiro`, `carlos-bistrain-69278b46`,
  `carloschuquillanqui`, `charlie-bamford-175a062a1` → 91→95 connected.
- **Lane 5 (endorse+DM):** computed the eligible pool from disk **before** picking
  `--max` (per the 07-30 lesson) — 59 connected/no-DM/not-`no_skills`/not-excluded
  members, of which exactly **2** cleared the strict >14-day bar (both connected
  2026-07-16, 15 days): `aforca` ("Hi Anthony," off-profile name) and
  `amanda-fannin-uc-davis` ("Hi Amanda,"). The 7-day fallback wasn't needed since the
  primary pool wasn't empty. Ran `--max=2`: 10/10 and 9/10 skills endorsed, both DMs
  sent clean, one continuous foreground run. 34→36 DM'd, 57 eligible remain.
- **Total profile views today: ~10 (Lane 2) + 50 (Lane 3) + 2 (Lane 4 list page ≈0) +
  2 (Lane 5) ≈ 62** — well inside the ~120/24h restriction threshold, no restriction
  page seen at any point despite the rough Lane 3 reaper day.

---

## 2026-08-01 — Lane 5 (endorse+DM) ported to Python + joined the LangGraph graph

**Mike's ask:** port everything lane-5 related from JS to Python, then move Lane 5 onto
the graph, ready for a live run. Done; **bless pending on that live run.** Lanes 1-4 were
already on the graph, so this closes the morning-lane migration for the five lanes Mike
runs daily.

**Ported (freeze-and-port, same policy as lanes 1-4 — the JS originals stay as rollback):**
- `endorse-and-message.js` → **`endorse_and_message.py`**, 1:1: same selectors, same
  pacing constants, same DM template, same zero-skills rule, same one-write-per-phase
  resume behaviour, and **byte-identical output lines** (the graph parses them).
- The three probes → **`_probe_endorse.py` · `_probe_message.py` · `_probe_send.py`**.
- Two Python-specific notes, both deliberate:
  - `\p{L}` has no `re` equivalent, so `clean_first_name` uses `str.isalpha()` — the same
    Unicode letter class. Verified identical on 37 name cases (see parity below).
  - Added `sys.stdout.reconfigure(encoding="utf-8")`: this script PRINTS skill names and
    display names, and Windows' cp1252 console is exactly what crashed the Lane 2 run on
    07-30. The wrapper already sets `PYTHONIOENCODING`; this covers a direct call.

**Parity test (JS vs Python, byte-diff of a JSON dump — identical apart from line
endings).** The harness `eval`s the REAL `cleanFirstName` / `buildMessageLines` sliced out
of the JS file, so it compares shipped code, not a retyped copy. Covered: both greeting
forms + all 8 DM lines incl. both emoji; 37 first-name cases (honorifics, ALL-CAPS,
all-lowercase, hyphens, apostrophes, accented/Cyrillic/CJK/emoji, too-short, too-long,
title-only, empty/null); and the eligibility filter + oldest-first stable sort across 12
member shapes (missing/empty `connected_on`, `dm_excluded`, `no_skills`, already endorsed).

**Lane 5 graph** (`graph/lane_graph.py` + `--lane 5 --max N [--dry-run]` in `run.py`),
same wrap → verify-from-disk → halt shape as lanes 2-4:
- Halts on the restriction marker from **either** the profile page or the skills page
  (this script has two).
- Kill-switch on 5 consecutive per-member errors (process tree, `taskkill /T`).
- Verification is stricter than other lanes because **a DM cannot be unsent**: all three
  members.json deltas (`endorse_status=endorsed`, `=no_skills`, `dm_sent_at`) must equal
  their parsed line counts, or the report carries a WARNING.
- **Dry-run quirk found while wiring this and preserved on purpose:** `--dry-run` endorses
  and DMs nothing but still records a genuine zero-skills finding (the JS does this too —
  the skills page really was opened and really had nothing to endorse). So the dry-run
  check allows exactly that one delta and flags any `endorsed`/`dm_sent` movement. Also
  documented in `endorse-and-message.md`.
- **Standing report** (the Lane 2 REGIONS precedent): names every member endorsed / DM'd /
  abandoned, plus the eligible pool bucketed by connection age (>14d · 7-14d · <7d), and
  WARNS when `--max` under-covered the >14-day members. This is the 07-29 `--max=3`
  miscount turned into a mechanical check instead of a remembered procedure — the graph
  still never picks `--max`, it only shows the number it should have come from.
- `_wrap_cmd()` added: picks `node` for a `.js` path, so the Lane 5 rollback really is a
  one-line `ENDORSE_SCRIPT` → `ENDORSE_SCRIPT_JS` swap. Lanes 1-4 predate it, untouched.
- **Stub sweep green:** `ok` (exit 0) · `restricted` (exit 2) · `fail` (exit 1) · `errors`
  (kill-switch, exit 1) · `nothing` (exit 0), plus `ok --dry-run`. Lanes 1-4 stubs re-run
  after the edits: no regression. No browser, no writes, no DM in any stub.

**Pool as of today (read from disk, for the live run):** 57 eligible members, of which
**2 are connected more than 14 days ago** — `amandafetters` and `amanda-marlow-3723a112`,
both connected 2026-07-17 (15 days). So the documented rule gives **`--lane 5 --max 2`**;
the 7-day fallback is not needed. 21 more cross the 14-day line within a week.

**Still JavaScript in this folder** (flagged to Mike — porting Lane 5 did not empty it):
`skills/check-endorsements/` (the 6th lane, not yet ported or graphed) · `tools/`
(`audit-sent-invites.js`, `withdraw-stray-invites.js`, `_grab-group-name.js`, 2 probes) ·
`lib/_li-session.js` and the frozen lane 1-4 rollback scripts + their probes, which the
freeze-and-port policy keeps until each port is blessed (lanes 1-4 all are, so those are
deletable on Mike's call).

### Same day — the 14/7-day rule became a MECHANICAL GATE (Mike's call)

Mike: *"whenever I process this every morning, I use those instructions about the 14 days
and 7 days... The only thing I need to do in the morning is to just say 'run lane five'
without any further instructions."* Agreed and built — **`--lane 5` now takes no number.**

**Why this lane and not lanes 2/3:** on Lane 2 and Lane 3 the `--max` is a genuine
judgment call (how much of the day's volume budget to spend). On Lane 5 it never was — it
is a documented rule applied to the data, which is exactly why it got miscounted by hand
on 07-29. So deriving it does not violate the 07-28 "the number in the ask IS the human
decision" contract; it recognises that on this lane there was no decision to make.

**What the audit found before building it** (this is the bug the gate closes): the age
rule lived only in the doc and in Mike's head. **Nothing in any code path implemented
it** — not the JS, not the port, not the wrapper. The script's only filter is
connected / not-DM'd / not-`no_skills` / not-`dm_excluded`, oldest first, then `--max`
takes the top N *regardless of age*. And the wrapper's under-coverage warning is
one-directional (fires when `--max` is too SMALL). Verified against the real logic:

- none >14d but some in the 7-14 band → `--max 3` silently endorses+DMs a 3-day-old
  connection. No warning.
- **none >14d and none ≥7d** (rule says: do nothing) → `--max 1` cheerfully DMs a 5-day
  connection. No warning, no halt.
- above the line too: today `over_14d = 2`, and `--max 5` would have reached into three
  members connected 12 days ago.

An irreversible DM, unguarded, on a rule executed from memory every morning.

**The gate** — `lane5_plan()` (rule, in `lane_graph.py`) + `lane5_gate()` (enforcement,
in `run.py`, before Chrome opens, matching Lane 2's `--max > 75` precedent):

| Situation | Behaviour |
|---|---|
| Nothing qualifies under either rule | prints why, **exit 0**, no browser |
| Rule selects ≤ 10 | runs it, no argument needed |
| Rule selects > 10 (`LANE5_AUTO_MAX`) | **REFUSES** — the volume call goes back to Mike via an explicit `--max` |
| `--max` reaches PAST the rule | **REFUSES** — those connections are too recent to DM |
| `--max` below the rule | allowed (reducing override for a heavy-volume day) |

**On the ceiling (Mike chose refuse-above-10 over auto-capping):** the doc's own binding
constraint is total profile-view VOLUME, not DM count, and each member here is a view
PLUS ~10 endorse clicks PLUS a DM. A 24-member run on a 60-scrape day is ~85 views
against the ~120/24h threshold that restricted this account twice. Above 10 the tool
refuses rather than decide for him.

**Blind spot, documented not papered over:** the gate prints the day's views it can see
on disk (`contacted_at` + `endorsed_at`), but **Lane 2 scrape views are dated NOWHERE**
(no `processed_at` on the queue, no capture date), so that number is a floor. A future
`data/lane_runs.json` written by the graph would close it for every lane.

Also: Lane 5's default checkpoint thread now carries the time (`endorse-YYYYMMDD-HHMM`,
same as Lane 4) — a refused run is meant to be re-run immediately with an explicit
`--max`, so same-day repeats are the normal flow.

**Tests: 13/13 gate branches** verified against synthetic pools (at/above/below the ceiling,
both fallback shapes, nothing-qualifies with and without an explicit number, `--max 0`,
stub bypass), plus the full lane 5 stub sweep and the lane 1-4 regression re-run. The
`--stub` path bypasses the gate on purpose (a stub never reads real member data), so the
gate is tested directly instead.

**A direct `endorse_and_message.py --max=N` call is UNGATED** — the rule is enforced by
the graph, not the script. Noted in bold in the skill doc; go through `--lane 5`.

### LIVE RUN — Lane 5 BLESSED (2026-08-01, ~11:55)

Bare `python graph/run.py --lane 5`, **no number given** — the gate derived it. First run
of the ported script, the graph, and the gate, all three together.

```
Lane 5 rule: 2 member(s) connected more than 14 days ago (oldest 15 days).
  eligible pool: 57  (>14d: 2, 7-14d: 21, <7d: 34)
Lane 5 endorse+DM graph | max 2 (auto, from the rule)
  - amandafetters:            9/10 skill(s) endorsed, "Hi Amanda," DM SENT
  - amanda-marlow-3723a112:  10/10 skill(s) endorsed, "Hi Amanda," DM SENT
  members.json delta: endorsed +2 | no_skills +0 | dm_sent +2   (matched parsed lines)
  eligible remaining: 55  (>14d: 0, 7-14d: 21, <7d: 34)
```

- **2/2 members, 19 skills endorsed, 2 DMs sent, ZERO errors** — no endorse failures, no
  DM failures, no `no_skills` abandons, no restriction page.
- **Verification green:** all three from-disk deltas equalled their parsed line counts,
  so no mismatch WARNING. The `--max` under-coverage warning correctly stayed silent
  (the run covered the whole >14-day pool: it is now 0).
- **The gate did its job unassisted:** Mike typed no number anywhere. Both selected
  members were exactly the two 15-day connections; the 21 members in the 7-14 day band
  were correctly left alone.
- Both profiles used the Enter-to-send path (`no Send button + send-toggle present`), as
  documented — the account still has "Press Enter to send" ON.
- **One continuous FOREGROUND run, ~5 minutes, no reaper kill.** Orphan check
  (`Get-CimInstance`, li-bot-profile only) run before launching: clean.
- **Volume today: 2 profile views.** Nothing else run today.

**Status: port + graph + gate all BLESSED.** `endorse-and-message.js` stays as frozen
rollback per policy but is now deletable on Mike's call, same as lanes 1-4.

**Next `--lane 5` will report "nothing qualifies today, exit 0"** — `>14d` is 0 and the
7-day fallback only fires when the >14d pool is empty AND the 7-14 band is non-empty, so
it will select ONE member from the 21 in that band. Worth watching on the next run day
that the fallback branch behaves live the way it does in the branch tests.

### Same day — run log, live heartbeat, and the dashboard's LangGraph page

Mike asked to visualise graph progress in the dashboard: a left nav (`Social` |
`LangGraph`), a **diagram** rather than only a table, and specifically *"which nodes are
currently active"* — with the eventual main use case being *"see if the human-in-the-loop
interrupt has fired"*. Built steps 1-3 of the four proposed; step 4 (interrupt capture)
deliberately deferred until a graph actually interrupts.

**Two corrections that shaped the design, both worth remembering:**

1. **It is not five nodes — it is five graphs of two nodes each** (`work → verify` + a
   halt edge). Only one runs at a time (the single-Chrome rule). The page draws both
   levels: five lane cards each showing their own inner pipeline, plus the focused lane's
   full `START → work → verify → END`.
2. **LangGraph's checkpoints cannot provide live progress here.** LangGraph checkpoints
   only BETWEEN nodes, and each lane's work node is a single long subprocess — Lane 5's
   ran ~5 minutes, during which the graph knew only "endorse is running". The granularity
   exists in the subprocess STREAM, which `_run_streaming` already parses. So the
   heartbeat is written from there, which means **one change in one shared function gave
   all five lanes live progress**.

**Why not build on `graph_checkpoints.sqlite`** (checked before deciding): it holds 89
threads of which **only 14 are real runs** — the rest are stub tests; it is gitignored and
documented as *disposable*; and its two tables are LangGraph's internal msgpack
serialization, not our schema. A UI on it breaks the first time someone deletes it, which
the design says is safe. So: two purpose-built files instead.

- **`data/lane_runs.json`** — committed history, one record per finished run (lane,
  status, duration, the whole verify block, profile views), written by `run.py` at END.
  Stub runs are recorded but flagged and hidden by default. **This also closes the volume
  blind spot** found while building the Lane 5 gate: `members-urls.json` has no
  `processed_at`, so a same-day profile-view total existed nowhere. Now it does, and the
  Lane 5 gate's flat ceiling of 10 can eventually become a real budget.
- **`data/lane_progress.json`** — transient, gitignored, rewritten while a run is in
  flight. Atomic writes (temp + `os.replace`) because the page polls it mid-write, and
  every write is wrapped in try/except: **a dashboard feed must never break a live run.**
- The 11:55 bless run was **backfilled** into the log (flagged `backfilled: true`) since
  it predates the log by an hour.

**Staleness is a first-class state, because of this repo's history.** A reaper kill leaves
a `running` heartbeat that simply stops updating. Anything with no update for 90 s renders
as **stale** with an explicit "check whether the process is still alive before
relaunching" warning — relaunching collides on the shared `li-bot-profile` Chrome.

**Dashboard changes:** `serve_dashboard.py` gained a `/linkedin/<file>` route that is an
**allowlist** (the two feed files), not a directory mount — that folder also holds
`members.json` and the restriction history. Served `no-store`. `index.html` gained the
shared left nav and was renamed **Social**; its tab bar now wraps (the 190px nav had
pushed Shorts/Longs off-screen at 1280px).

**Design notes:** status colours come from the dataviz skill's fixed status palette, and
every status ships an **icon + text label** so colour never carries the meaning alone —
the skill's own validator flagged `warning`↔`serious` at ΔE 13.6 (hard to tell apart) with
both under 3:1 on white, so `serious` is unused and *running* uses the dashboard's accent
blue instead. The view budget is a **meter** (single ratio against a limit), not a chart.

**Verified:** all 20 lane × stub-mode combinations still exit correctly; the Lane 5 gate
still passes 13/13 branches; both pages screenshot-checked with zero console errors; the
live state was captured mid-flight by driving the REAL `_run_streaming` with a slow
synthetic stream (stub runs finish in 0.2 s, too fast to catch); the stale path was
verified by backdating a `running` heartbeat. Also fixed a real bug found in review: the
page sliced strings AFTER escaping them, which can cut an HTML entity in half.

## 2026-08-01 evening — 4-lane sequence on the new dashboard (Mike: "Lane 2, 6 / Lane 3, 3 / Lane 4 / Lane 5")

First run watched live on the LangGraph dashboard page. **12 profile views total** for
the day (2 morning endorse + 6 scrape + 3 invite + 1 endorse), against the ~120 that
restricted the account. Run strictly sequentially, one attempt each, zero relaunches.

- **Lane 4 (pre-sequence, 0 views):** **13 newly connected** off 278 awaiting —
  `connected_on` 95 → 108. Scroll plateaued at 20 cards on all 6 rounds: LinkedIn only
  renders the most recently added connections, so this lane sees a WINDOW, not history.
  Frequency, not depth, is what gives coverage. A second run 25 min later found 0 (correct).
- **Lane 2 (scrape 6):** visited 6, processed +5, **captured +4** (Zug CH, Bogotá CO,
  Argentina, San Francisco US), skipped 1 out-of-zone (Lagos), 1 dead URL (`/404/`,
  correctly left unconsumed to retry). Queue 5433 remaining. Wall clock ~17 min — the
  inter-profile gaps ran 88-196s, so **6 profiles is a ~15+ minute run**; it exceeded the
  600s foreground tool ceiling and finished in the background. Expect that, do not relaunch.
- **Lane 3 (invite 3):** **3/3 sent**, zero errors, zero strikes. 154 still to contact.
- **Lane 5 (gate-derived, no number):** rule picked **max 1** (nobody past 14 days →
  the 7-14 day fallback). The selected member had **no endorsable skills** → abandoned,
  **no DM**, marked `no_skills`. Correct: the sanctioned DM only goes to someone whose
  skills we just endorsed.

### Fixed this run

- **The Lane 5 gate's printed view total silently omitted scrape** — the single BIGGEST
  consumer of the daily budget (a scrape run is up to 75 views). It read only
  members.json's dated fields (`contacted_at`/`endorsed_at`), which structurally cannot
  see Lane 2, and printed an obsolete caveat saying so. That caveat predated
  `lane_runs.json`, which has recorded scrape views correctly since it was added.
  `_views_today()` now **merges both sources, taking the larger per category**: the run
  log is the only source for scrape, while members.json still catches invite/endorse from
  a DIRECT ungated script call the run log never sees. The gate now prints
  `N of ~120 (scrape + invite + endorse)` and warns past 80. Verified: reported 12,
  matching the hand tally. Gate rule re-tested, 11/11 branches pass.
- **Dashboard lane cards showed stale runs as current** (Mike, watching Lane 2 run):
  Lanes 4 and 5 rendered bright green `done` beside the live lane, so three lanes looked
  equally active. The card status keyed off `isToday`, but **recency is not currency** —
  a run from ten minutes ago is as much history as one from last week. Now: only the
  running lane is present-tense (color, lit node, live counters); every other lane dims
  to 55% with a neutral pill and `last run 22m ago`; the inner `work → verify` nodes
  light ONLY while live. **Deliberate exception: failed/halted/killed keeps its warning
  colour** until that lane runs again — greying out an unresolved restriction would bury
  the most important thing on the page. The live card also now shows live counters
  instead of the previous run's headline, which described the wrong run.

### Open, not fixed

- **`goto-notfound` fallback rate is high.** Lane 2 reached **4 of 6** profiles by direct
  navigation because search-and-click found no match; Lane 3, 1 of 3. The hard rule says
  reach profiles via search-and-click precisely because bare `goto(profileUrl)` is a
  flagged signature. The pacing (88-196s gaps) means these are nowhere near the
  back-to-back pattern the rule targets, so this is not an incident — but two thirds of a
  scrape sample taking the fallback path is a pattern worth diagnosing, likely in how the
  search query is built from the URL slug.
- **Lane 3's completion line still prints "run again, max 3/day"** — a stale string from
  the self-imposed invite cap Mike **rescinded 2026-07-28**. `CLAUDE.md` says no fixed
  daily cap. Cosmetic, but it contradicts the canonical doc inside a blessed script.

### Dashboard: LangGraph page generalized to tabs (same session)

Mike: the LangGraph section will need tabs like the Social page does, because this page is
currently all-LinkedIn and there will be several LangGraph automations.

The page now renders from an **`AUTOMATIONS` registry** — lane cards, graph diagram, budget
meter and run-history summaries all come from the active entry, so nothing on it is
LinkedIn-specific. LinkedIn is tab 1. The server route generalized from a hardcoded
`/linkedin/` to a folder registry, still a **filename allowlist, not a directory mount**
(this folder holds members.json and the restriction history; re-verified both 404).

**Tabs carry live status, and every automation is polled — not just the visible one.** The
stated purpose of this page is catching a graph that needs a human, which fails the moment
the interesting automation is the one you are not looking at. `awaiting_input` shows a red
**needs you** badge (a word, not just a colour — the graph stays blocked until answered);
also running / stale / halted / failed / idle. Verified against four simulated automations
driven into different states.

The budget meter is per-automation and hides itself when an automation rations nothing —
profile views vs the restriction threshold is a LinkedIn fact, not a LangGraph one.

**Canonical detail (incl. how to add an automation) lives in
`schedule-tweets/skills/dashboard.md`** — not duplicated here.

## 2026-08-04 — full 5-lane run (Lane 2=60, Lane 3=30, Lane 4, Lane 5)

Ran all four active lanes via `graph/run.py`, chunked `--max=4`/`5` foreground calls per
the reaper-mitigation pattern (checked for orphaned `li-bot-profile` Chrome before every
relaunch; killed chunks were confirmed safely persisted to disk, no data lost, just retried).

- **Lane 2 (scrape 60): 60/60 profile views, 0 errors across all 15 chunks.** 571→613
  captured (+42). Two chunks (9, 10) got reaper-killed after landing all/most of their
  profiles; disk state confirmed intact both times before resuming.
- **Lane 3 (invite, asked 30): sent 26, then LinkedIn's own weekly invite/note limit hit
  and the script self-stopped ("do NOT rerun today") — a platform-side stop, not pushed
  past.** 404→~431 contacted. **Fix applied mid-run:** `aseguillon` and
  `ana-carolina-barbosa-8996621ba` failed at the identical Send-button timeout twice in a
  row, burning two batch slots each time with zero progress — moved both to the end of
  `members.json` (order only, no field changes), same mitigation as the 07-20/07-31
  incidents. Every chunk after the reorder sent clean.
- **Lane 4 (check): 9 new acceptances** — `david-redondo-jimenez-40432535`,
  `luiz-carlos-aparecido-rosa-321901293`, `david-j-carroll`, `ana-carolina-fbrito`,
  `caroline-kennedy-81110980`, `ana-carolina-carrasco`, `carolinemsabino`,
  `caroline-de-castro-vidal-343572127`, `aloisiocarolina` → 111→120 connected.
- **Lane 5 (endorse+DM, no number — mechanical 14/7-day gate): 2 members** cleared the
  strict >14-day bar (`benjamingolds`, `benjamin-randoing`, both connected 2026-07-20,
  15 days) — 10 skills endorsed + DM sent each, 0 errors. Gate's own running total read
  85/120 profile views before this lane ran (53 scrape + 32 invite by its accounting,
  which merges `lane_runs.json` with `members.json` timestamps and reads slightly
  different from the raw per-chunk sums above); ended the day comfortably under the
  ~120/24h restriction threshold.

No restriction pages hit at any point. Lane 3 not retried today per its own limit warning.
