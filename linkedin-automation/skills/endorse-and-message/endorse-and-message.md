# endorse-and-message — endorsement + favor-request DM skill

For each member who has **accepted** our connection request (oldest `connected_on`
first): endorse a random **9-15 of their top skills**, then send **one fixed
favor-request DM** asking them to endorse Mike's automation skills back.

This is one of five skills in the `linkedin-automation` toolkit. See the index
**[`../SKILL.md`](../SKILL.md)** for the toolkit overview, the **shared session / login
/ search-and-click navigation / base pacing** foundation (`lib/li_session.py`) this
skill is built on, the shared data model, and **LinkedIn's volume limits**. This file
documents the **endorse + DM** flow specifically.

Sibling skills: [`scrape-group-members`](../scrape-group-members/scrape-group-members.md)
(find + classify) · [`request-connections`](../request-connections/request-connections.md)
(invite) · [`check-connections`](../check-connections/check-connections.md) (acceptances).

---

## THE ONE SANCTIONED DM (read this first)

The folder rule is **no DMs** — with exactly **one exception** (Mike, 2026-07-02):
this script's **fixed template**, sent only to a member who (a) already accepted our
connection request AND (b) whose skills we **just endorsed**. Never a cold DM, never
a composed/variable message. The **only** per-member variable is the **first name in
the greeting** (Mike, 2026-07-14): the script reads the recipient's display name off
their profile top card and opens with **"Hi &lt;First&gt;,"**, falling back to
**"Hi there,"** when no clean first name is found (unreadable name, single glyph,
title-only, etc.). Everything from the greeting on is sent **VERBATIM every time**
(Mike's explicit call — including "a couple of weeks ago", regardless of the actual
connection date). Shown below with the fallback greeting:

> Hi there, we connected a couple of weeks ago. I am trying to build up my profile right
> now because my biggest issue is that I am getting a lot of recruiters contacting me about
> Front End and React roles... but I have been doing AI engineering work for almost two
> years. And my LinkedIn profile seems to be overwhelmingly optimized for front-end development. 😱
>
> I'm asking people if they could endorse some of my skills at the top of my list that
> are AI related. A direct link is here - https://www.linkedin.com/in/michael-luis/details/skills/
>
> I just endorsed you for a bunch of your skills. I was just curious if you would be
> kind enough to return the favor.
>
> Sincerely yours,
> Miguel 😇

**Zero-skills rule (Mike):** if a member has **no endorsable skills**, ABANDON them —
no endorsements means **no DM either** (the message says "I just endorsed you"). They
are marked `endorse_status: "no_skills"` and never revisited.

---

## HOW MANY DMs PER RUN — THIS IS NOW A MECHANICAL GATE, NOT A PROCEDURE

**Nobody counts this by hand any more (Mike, 2026-08-01: "the only thing I need to do
in the morning is just say run lane five").** The rule below used to be executed from
memory every morning and was miscounted once (07-29, `--max=3`), so it now lives in
code as `lane5_plan()` in `graph/lane_graph.py`, enforced by `lane5_gate()` in
`graph/run.py`. **`python graph/run.py --lane 5` takes no number.**

**The rule it implements** (Mike, 2026-07-21 — unchanged, just no longer manual):

1. Endorse + DM **every** member connected **more than 14 days** ago who has not yet
   been DM'd. There is no one-DM-per-day cap; all of them go in one run.
2. If **none** qualify → send to **exactly ONE** member connected at least **7 days**
   ago (oldest first).
3. If none qualify for that either → **do nothing at all.**

Eligibility is unchanged: `contact_status === "connected"`, no `dm_sent_at`, not
`no_skills`, not `dm_excluded`. This works because the script drains its queue
**oldest-first**, so taking the top N *is* the rule's selection — and members with no
`connected_on` sort last, so a count can never sweep one in.

**The gate refuses three ways** rather than guess (all before Chrome opens):

| Situation | What happens |
|---|---|
| Nothing qualifies under either rule | Prints why, **exits 0**, no browser, nothing sent |
| The rule selects **more than 10** | **REFUSES.** The volume call goes back to Mike — re-run with an explicit `--max` he has decided on. The rest stay queued for the next run. |
| `--max` reaches **past** what the rule selects | **REFUSES.** Those connections are too recent to DM today. (This is the hole the gate was built to close: before it, `--max 5` on a day when only one member qualified would have DM'd four people who hadn't earned it, silently and irreversibly.) |

`--max` survives only as a **reducing** override, for a day when Lane 2/3 already spent
the volume budget. It can never exceed the rule.

**Why 10 and not "all of them" (Mike's call, 2026-08-01).** The doc's own binding
constraint is **total profile-view volume**, not the DM count — and each member here is
a profile view PLUS ~10 endorse clicks PLUS a DM. A 24-member run stacked on a 60-profile
scrape is ~85 views against the ~120/24 h threshold that has restricted this account
**twice**. Above 10 the tool will not cross that line for you; it makes you decide. Same
shape as Lane 2's `--max > 75` refusal.

**One blind spot to know about:** the gate prints the profile views it can see on disk
today (Lane 3 `contacted_at` + Lane 5 `endorsed_at`), but **Lane 2 scrape views are not
dated anywhere** (`members-urls.json` has no `processed_at`, captures have no date), so
that figure is a floor. Add Lane 2's own number yourself before approving a big run.

---

## Running it

**Via the Lane 5 LangGraph graph (canonical since 2026-08-01 — port + graph + gate all
blessed on that day's live run: 2 members, 19 skills, 2 DMs, zero errors). NO NUMBER —
the 14/7-day rule above derives it:**

```bash
python linkedin-automation/graph/run.py --lane 5 [--dry-run]
```

The graph launches the Python port **`endorse_and_message.py`**, verifies the
`members.json` deltas from disk (all three of `endorse_status=endorsed`, `=no_skills`,
`dm_sent_at` must match the parsed output lines), halts on a restriction page from
either the profile OR the skills page, kill-switches on 5 consecutive per-member errors,
and always reports **which members were endorsed / DM'd / abandoned** plus the eligible
pool bucketed by connection age. `--max` is optional and only ever reduces the run (see
the gate above). Rollback = swap `ENDORSE_SCRIPT` to `ENDORSE_SCRIPT_JS` in
`graph/lane_graph.py` (`_wrap_cmd` picks `node` off the `.js` suffix, so it really is a
one-line swap). The frozen JS original still runs directly, as does the port:

```bash
python linkedin-automation/skills/endorse-and-message/endorse_and_message.py [--max=N] [--dry-run]
node   linkedin-automation/skills/endorse-and-message/endorse-and-message.js  [--max=N] [--dry-run]
```

- `--max=N` — process at most **N** members this run. **Direct calls are ungated** — the
  14/7-day rule is enforced by `graph/run.py`, NOT by the script, so a direct
  `endorse_and_message.py --max=20` will happily DM twenty people regardless of how
  recently they connected, and its `--max` default of 3 is meaningless as a safety net.
  **Go through the graph** unless you are deliberately bypassing the rule. Each member is
  a profile view against the same daily **volume budget** as the scraper and invite
  sender, PLUS ~10 endorse clicks and a DM. The binding limit is total profile-view
  VOLUME, not the DM count.
- `--dry-run` — navigate, count endorsable skills, locate the Message button; endorse
  and send **nothing**. **One thing a dry run still writes:** a member with zero
  endorsable skills is marked `no_skills` even in dry mode (the skills page really was
  opened and really had nothing to endorse, so the finding is real). This is inherited
  from the JS and deliberately preserved by the port; Lane 5's verification allows
  exactly that one delta on a dry run and flags any `endorsed` / `dm_sent` movement.

**Member selection:** `members.json` where `contact_status === "connected"`, no
`dm_sent_at`, and not `no_skills` — sorted **oldest `connected_on` first** (ties keep
file order). A member endorsed on a previous run whose DM failed resumes at the DM.

## Flow per member

1. Reach the profile via the shared **search-and-click** navigation.
2. Open `<profile>/details/skills/`. Harvest endorsable skills, take the **top**
   `random(9..15)` (display order), click **Endorse** on each with a 2-6 s gap
   (any follow-up "How do you know…" dialog is Escape-dismissed).
   Zero endorsable → mark `no_skills`, **skip the DM**, continue to next member.
3. Return to the profile (the skills page's "Navigate back to profile main screen"
   button), **read the first name off the top card** for the greeting (via
   `clean_first_name` — skips honorifics, title-cases ALL-CAPS/all-lowercase, falls
   back to "there" on anything unclean), open the **Message** composer, type the
   template with human keystroke pacing, click **Send**, verify the composer emptied.
   The name source is `<main>`'s innerText **first line**, not an `<h1>` — the 2026
   profile UI has no `<h1>` in main and ships hashed class names, same blind spot the
   scraper's `read_location` works around.
4. Record everything on `members.json` (fields below), one write per phase, so any
   interruption resumes cleanly.

## Data model additions (`members.json`)

```jsonc
// after the endorsement phase:
"endorse_status": "endorsed",     // or "no_skills" (abandoned, never revisited)
"endorsed_at": "2026-07-02",
"endorsed_count": 7,
// after the DM goes out:
"dm_status": "sent",
"dm_sent_at": "2026-07-02"
```

## Selector notes (probed live 2026-07-02; probes ported to Python 2026-08-01)

- **Endorse buttons:** `main button[aria-label^="Endorse " i]` with visible text
  exactly `Endorse` — the aria-label is "Endorse <SkillName>", so the skill name is
  logged for free. An already-endorsed skill no longer matches (no "Endorse " prefix).
  DOM order = display order = "top of their list".
  Clicked buttons drop out of the matched set, so the script collects **element
  handles**, not `locator.all()` (nth-index locators shift mid-loop and would endorse
  the wrong skills).
- **Message control (selector-discipline trap):** the profile OWNER's Message action
  is a plain `<a>` with **no aria-label**, visible text exactly `Message`, href
  `/messaging/compose/?...recipient=<their urn>`. The "More profiles for you" module
  renders several `Message <other person>` anchors that ALL carry aria-labels — so a
  bare `aria-label*="Message"` match **DMs the wrong person**. The script matches
  "no aria-label + exact text Message + compose href" first (probed live,
  `_probe_message.py`), with the older name-in-aria-label form as fallback.
- **Composer:** `div.msg-form__contenteditable[contenteditable="true"]` (aria "Write
  a message…"). Emoji are typed via `keyboard.insert_text` (surrogate pairs mangle
  through `keyboard.type`).
- **Line breaks are Shift+Enter, never bare Enter** — this account has **"Press
  Enter to send" ON**, so a bare Enter fires the message immediately.
- **There is NO Send button on this account** (probed with a non-empty composer,
  `_probe_send.py`): with Enter-to-send ON, LinkedIn hides the Send button entirely —
  the composer footer shows only a `.msg-form__send-toggle` ("Open send options")
  circle. The script still tries the classic Send-button candidates first (in case
  the setting changes), then detects the send-toggle signature and **sends with one
  bare Enter**. Before sending it verifies the typed text landed (>100 chars —
  `typing_failed` otherwise), and it clears any leftover draft before typing so a
  member can never get the template twice in one message.

## Limits

- Each member = **1 profile view** (same volume budget as scraping/inviting: the
  restriction history in [`../SKILL.md`](../SKILL.md) applies). Endorsements and DMs
  are *additional* novel actions. There is **no cap on the DM count** — send to all
  qualifying members (see "HOW MANY DMs PER RUN") — but watch for any warning page and
  **stop for the day** if one appears. The lever that matters is total profile-view
  volume, not how many DMs.
- Don't run on the same day as a big scrape + invite batch that already used the
  budget (a 40-scrape + 8-invite day is already ~48/50).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| 0 endorsable skills on a profile that visibly has them | The aria-label format changed. Run `python linkedin-automation/skills/endorse-and-message/_probe_endorse.py <profileUrl>` and re-pin `ENDORSE_BTN`. |
| `no_message_button` | Message control moved/renamed, or the profile isn't actually a 1st-degree connection. Probe dumps the top-card controls. |
| `no_send_button` | Neither a Send button NOR the `.msg-form__send-toggle` (Enter-to-send signature) was found — the composer footer changed. Re-probe with `_probe_send.py` (it types a throwaway char so the send controls render, then clears the box). |
| `typing_failed` | The template didn't land in the composer (<100 chars after typing — focus was stolen or the box selector drifted). The box is cleared and the member left for retry; re-probe the composer if it repeats. |
| `not_verified` | Send was clicked but the composer didn't empty. Check LinkedIn manually — the DM may have sent anyway. **Do not blindly re-run** (risk of a duplicate DM); verify, then set `dm_status`/`dm_sent_at` by hand if it sent. |
| DM went to the wrong person | The name-scoped Message match failed and the fallback grabbed a module anchor. This is the selector-discipline trap — re-probe and tighten; never widen to bare `a[aria-label*="Message"]`. |
