# endorse-and-message — endorsement + favor-request DM skill

For each member who has **accepted** our connection request (oldest `connected_on`
first): endorse a random **9-15 of their top skills**, then send **one fixed
favor-request DM** asking them to endorse Mike's automation skills back.

This is one of four skills in the `linkedin-automation` toolkit. See the index
**[`../SKILL.md`](../SKILL.md)** for the toolkit overview, the **shared session / login
/ search-and-click navigation / base pacing** foundation (`lib/_li-session.js`) this
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
their profile `<h1>` and opens with **"Hi &lt;First&gt;,"**, falling back to
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

## HOW MANY DMs PER RUN (read this — Mike, 2026-07-21)

**There is NO one-DM-per-day cap. Send to ALL qualifying members.** The default run
policy is: **every member connected more than 14 days ago who has not yet been DM'd
gets endorsed + DM'd this run** — not just the oldest one. Do not stop at one and do
not ask; that is the intended behavior, so run it straight through.

- **Set `--max` to cover all qualifiers.** Count the eligible >14-day members first
  (connected, `dm_status !== "sent"`, not `no_skills`, not `dm_excluded`), then pass
  `--max=<that count>` (or higher). The old `--max=3` default is just a floor for a
  bare invocation — it is NOT a daily ceiling.
- **Fallback when none are >14 days old:** send to **one** member connected at least
  **7 days** ago (oldest first). If none meet even that, do nothing.
- The only per-member gate is still the **zero-skills rule** (no skills → no DM) and
  the manual **`dm_excluded`** flag.
- The genuine constraint is **total profile-view volume**, not a DM count — see Limits
  below. Watch for a restriction page and stop for the day if one appears, but do not
  self-limit the DM count for its own sake.

---

## Running it

```bash
node linkedin-automation/skills/endorse-and-message/endorse-and-message.js [--max=N] [--dry-run]
```

- `--max=N` — process at most **N** members this run. **Default 3 is only a floor for a
  bare call, NOT a daily cap** — set `--max` to cover all qualifying members (see "HOW
  MANY DMs PER RUN" above). Each member is a profile view against the same daily
  **volume budget** as the scraper and invite sender, PLUS ~10 endorse clicks and a DM.
  The binding limit is total profile-view VOLUME, not the DM count; don't stack a large
  endorse run on top of a big same-day scrape if together they push total views high.
- `--dry-run` — navigate, count endorsable skills, locate the Message button; endorse
  and send **nothing**.

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
   button), **read the first name off the profile `<h1>`** for the greeting (via
   `cleanFirstName` — skips honorifics, title-cases ALL-CAPS/all-lowercase, falls
   back to "there" on anything unclean), open the **Message** composer, type the
   template with human keystroke pacing, click **Send**, verify the composer emptied.
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

## Selector notes (probed live 2026-07-02, `_probe-endorse.js`)

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
  `_probe-message.js`), with the older name-in-aria-label form as fallback.
- **Composer:** `div.msg-form__contenteditable[contenteditable="true"]` (aria "Write
  a message…"). Emoji are typed via `keyboard.insertText` (surrogate pairs mangle
  through `keyboard.type`).
- **Line breaks are Shift+Enter, never bare Enter** — this account has **"Press
  Enter to send" ON**, so a bare Enter fires the message immediately.
- **There is NO Send button on this account** (probed with a non-empty composer,
  `_probe-send.js`): with Enter-to-send ON, LinkedIn hides the Send button entirely —
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
| 0 endorsable skills on a profile that visibly has them | The aria-label format changed. Run `node linkedin-automation/skills/endorse-and-message/_probe-endorse.js <profileUrl>` and re-pin `ENDORSE_BTN`. |
| `no_message_button` | Message control moved/renamed, or the profile isn't actually a 1st-degree connection. Probe dumps the top-card controls. |
| `no_send_button` | Neither a Send button NOR the `.msg-form__send-toggle` (Enter-to-send signature) was found — the composer footer changed. Re-probe with `_probe-send.js` (it types a throwaway char so the send controls render, then clears the box). |
| `typing_failed` | The template didn't land in the composer (<100 chars after typing — focus was stolen or the box selector drifted). The box is cleared and the member left for retry; re-probe the composer if it repeats. |
| `not_verified` | Send was clicked but the composer didn't empty. Check LinkedIn manually — the DM may have sent anyway. **Do not blindly re-run** (risk of a duplicate DM); verify, then set `dm_status`/`dm_sent_at` by hand if it sent. |
| DM went to the wrong person | The name-scoped Message match failed and the fallback grabbed a module anchor. This is the selector-discipline trap — re-probe and tighten; never widen to bare `a[aria-label*="Message"]`. |
