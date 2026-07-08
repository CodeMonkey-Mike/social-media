# request-connections — connection invite skill

Sends a connection request **with a short note** to each captured member in
`members.json` whose `contacted` is not yet `true`, then records the outcome.

This is one of three skills in the `linkedin-automation` toolkit. See the index
**[`../SKILL.md`](../SKILL.md)** for the toolkit overview, the **shared session / login
/ search-and-click navigation / base pacing** foundation (`lib/_li-session.js`) this
skill is built on, the shared data model, and **LinkedIn's volume + invite limits**.
This file documents the **invite sender** specifically.

Sibling skills: [`scrape-group-members`](../scrape-group-members/scrape-group-members.md)
(find + classify members) ·
[`check-connections`](../check-connections/check-connections.md) (record acceptances).

---

## Running it

```bash
node linkedin-automation/skills/request-connections/request-connections.js [--max=N] [--dry-run]
```

- `--max=N` — send at most **N** invites this run. **Default 10** (Mike's self-imposed
  daily cap). Run this **once per day**, not several batches that add up past ~10.
- `--dry-run` — navigate to each profile and locate the Connect button, but **don't
  click or send anything**. The safe way to confirm the flow after a LinkedIn change.

**The note** (same for everyone, no first name, no em dashes, < 300 chars):

> Hello there, I noticed we are in the same AI automation group. I am trying to build
> my connections list, and just wanted to see if I can connect with some like-minded people.

---

## Flow per member

Reach the profile via the shared search-and-click navigation (see
[`../SKILL.md`](../SKILL.md)) → read
nothing (no name needed) → click **Connect** (top-card button, or via the **More**
menu) → **Add a note** → type the message → **Send**. On success it sets
`contacted: true`, `contacted_at: <YYYY-MM-DD>`, `contact_status: sent`.

## Where the Connect button lives (READ THIS — it has two axes of variation)

LinkedIn renders Connect differently per profile, and the script handles **all** of it.
There are **two independent axes** — both must be covered or you get a false
`no_connect_button`:

1. **Location** — Connect is *either* a **top-card primary** control on the left, *or*
   it's only inside the **More** menu (click More to reveal a `div[role="menu"]` item with
   text `Connect`). Which one shows is **seemingly random** per profile.
2. **Tag (top-card primary only)** — the top-card control is *either* a `<button>` *or* an
   **`<a>` anchor** (`href=/preload/custom-invite`, `aria-label="Invite <Name> to connect"`,
   with `<span>Connect</span>` inside). **You must match BOTH tags** — the primary selector
   is `main button[aria-label*="to connect" i], main a[aria-label*="to connect" i]`.
   Matching only `<button>` is the bug that made `hamza-moghe` fail on 2026-06-29 (his
   Connect was the anchor form), so it fell through to More, which had no Connect either.

**Likely (unproven) cause of the variation:** the target's **Creator mode** — when a member
has Creator mode on, LinkedIn promotes **Follow** as the primary and pushes **Connect into
the More menu**; off, **Connect** is the top-card primary. Connection degree and LinkedIn's
own A/B UI experiments add noise, so treat it as "handle both, always," not "predict it."

The script tries the **top-card primary first** (button or anchor), then falls back to
**More**. The Add-a-note / textarea / Send selectors are scoped to `div[role="dialog"]`
(Send = aria "Send invitation"). Diagnostic: `_probe-connect.js` dumps the top-card controls
(incl. `a[aria-label]` anchors) and the More menu.

## Pacing inside the flow

On top of the base pacing in `lib/_li-session.js`, this skill adds:

- a randomized **5–20 s** gap (`CLICK_GAP_MIN/MAX`) before **every** click (open More,
  Connect, Add a note, Send),
- the note typed **character-by-character** (randomized 5–40 ms/keystroke via
  `S.typeHuman`),
- a wide **40–90 s** (`INVITE_MIN/MAX`) pause between members.

## `contact_status` values

`sent` · `already_pending` · `already_connected` (all three set `contacted: true`) ·
`no_connect_button` (follow-only / out of network; left `contacted:false` to revisit).
If LinkedIn shows a **limit** (weekly invite or personalized-note cap) or a
**restriction** page, the run **STOPS immediately** and does not mark that member — it
never hammers.

## Hard limits (LinkedIn, not the script)

- Personalized-note invites require **Premium** (Mike has it). Free accounts are
  capped at ~5 notes/month.
- There is still a **weekly invitation cap** (~100–200) regardless of notes.
- Each invite is also a profile view, so it counts toward the same **volume** limit
  that restricted the scraper on 2026-06-27 — keep the daily count low (≤10), and
  don't run a big scrape and a batch of invites on the same day if it pushes total
  profile views high (see [`../SKILL.md`](../SKILL.md) "LinkedIn limits").
- The account was restricted twice in late June 2026; a third strike risks a
  **permanent** ban. If a run hits a limit/restriction page, stop for the day.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Every member returns `no_connect_button` | The Connect/More selectors changed. Run `node linkedin-automation/skills/request-connections/_probe-connect.js <profileUrl>` to dump the live top-card + More-menu DOM, then fix the selectors. Remember the **two axes** (see "Where the Connect button lives"): top-card primary matches BOTH `<button>` AND `<a>` (`aria-label*="to connect"`); More-menu Connect = `div[role="menu"]` item matching `/^Connect$/` (More opened by a button with exact text "More"). If the probe's dump doesn't show a visible Connect at all on a profile you can see one on, the primary is probably an `<a>` the probe selector missed — confirm by inspecting the element's tag. |
| `no_connect_button` on a profile that visibly HAS Connect | Almost always the **tag** mismatch above — the top-card Connect is an `<a>` anchor and a selector is only looking for `<button>`. Match both tags. (Genuine `no_connect_button` = follow-only / out-of-network, where only Follow shows.) |
| Note typed but never sent | The Send button moved out of `div[role="dialog"]` or lost its aria label. Re-probe the modal. |
