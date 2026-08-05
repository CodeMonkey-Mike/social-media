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

**Via the Lane 3 LangGraph graph (canonical since 2026-07-30 — port + graph blessed
on the "Lane 3, 5" live run, 5/5 sent):**

```bash
python linkedin-automation/graph/run.py --lane 3 --max N [--dry-run]
```

The graph launches the Python port **`request_connections.py`** (1:1 with the JS:
same selectors, pacing, identity guards, output lines), verifies the members.json
deltas from disk, kill-switches on 5 consecutive per-member errors, halts on a
restriction page, and reports (without halting) if the weekly invite limit stops the
run. Rollback = swap `INVITE_SCRIPT` to `INVITE_SCRIPT_JS` in `graph/lane_graph.py`;
the frozen JS original still runs directly:

```bash
node linkedin-automation/skills/request-connections/request-connections.js [--max=N] [--dry-run]
```

- `--max=N` — send at most **N** invites this run. **Default 10** if omitted; no fixed
  daily cap (rescinded 2026-07-28) — pass `--max` per Mike's ask each run. Run this
  **once per day**, not several batches that add up past what Mike asked for.
- `--dry-run` — navigate to each profile and locate the Connect button, but **don't
  click or send anything**. The safe way to confirm the flow after a LinkedIn change.

**The note** (same for everyone, no first name, no em dashes, < 300 chars):

> Hello there, I noticed we are in the same AI automation group. I am trying to build
> my connections list, and just wanted to see if I can connect with some like-minded people.

---

## Flow per member

Reach the profile via the shared search-and-click navigation (see
[`../SKILL.md`](../SKILL.md)) → **verify identity** → click **Connect** (top-card
button, or via the **More** menu) → **Add a note** → type the message → **Send**.
On success it sets `contacted: true`, `contacted_at: <YYYY-MM-DD>`,
`contact_status: sent`.

**Identity guards (2026-07-22 — do not remove).** Before this date the script sent
~55 invites to complete strangers (see PROJECT-LOG): search-result clicks matched by
URL *substring* (so `/in/ben-olson` clicked a different person at
`/in/ben-olson-02b90545`), and when a top card had no Connect the first
"Invite <name> to connect" control in `main` was a **"More profiles for you"
suggestion card**. Three mechanical gates now prevent both:

1. search-result clicks require the result URL slug to **equal** the saved slug
   (`lib/_li-session.js`);
2. after navigation the landed URL slug must equal the target's or the member errors
   out untouched;
3. the profile owner's name must resolve (sources in order: `main h1` → tab title →
   top-card "Follow <Name>" aria-label; the 2026 UI has no `main h1`) and the Connect
   control's aria-label must **contain that name** — any other "to connect" button
   on the page (e.g. a "More profiles for you" suggestion card) is ignored.

Members that come back `no_connect_button` twice are **retired** (stamped
`contacted: true, contact_status: no_connect_button`) so follow-only profiles don't
clog the queue front on every run.

**Same-day strike guard (2026-07-23).** The two-strike rule assumes **one run/day**. On a
multi-batch day (the 60-invite backlog run) the next batch re-hit a strike-1 member minutes
later, burning a second profile view and retiring them with no real retry gap. A strike now
also stamps `nocb_last: <YYYY-MM-DD>`, and the batch selector skips anyone whose
`nocb_last` is today — so strike 2 can only land on a **later day**, and nobody is viewed
twice in one day (which is also a bot-ish signature).

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
`no_connect_button` (follow-only / out of network, OR the member requires an email to
verify you know them before connecting, which we never have; left `contacted:false` to
revisit — logged and skipped, not stopped).
If LinkedIn shows a **limit** (weekly invite or personalized-note cap) or a
**restriction** page, the run **STOPS immediately** and does not mark that member — it
never hammers.

## Hard limits (LinkedIn, not the script)

- Personalized-note invites require **Premium** (Mike has it). Free accounts are
  capped at ~5 notes/month.
- There is still a **weekly invitation cap** (~100–200) regardless of notes.
- Each invite is also a profile view, so it counts toward the same **volume** limit
  that restricted the scraper on 2026-06-27 — no fixed daily cap, but stay volume-aware,
  and don't run a big scrape and a batch of invites on the same day if it pushes total
  profile views high (see [`../SKILL.md`](../SKILL.md) "LinkedIn limits").
- The account was restricted twice in late June 2026; a third strike risks a
  **permanent** ban. If a run hits a limit/restriction page, stop for the day.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Every member returns `no_connect_button` | The Connect/More selectors changed. Run `node linkedin-automation/skills/request-connections/_probe-connect.js <profileUrl>` to dump the live top-card + More-menu DOM, then fix the selectors. Remember the **two axes** (see "Where the Connect button lives"): top-card primary matches BOTH `<button>` AND `<a>` (`aria-label*="to connect"`); More-menu Connect = `div[role="menu"]` item matching `/^Connect$/` (More opened by a button with exact text "More"). If the probe's dump doesn't show a visible Connect at all on a profile you can see one on, the primary is probably an `<a>` the probe selector missed — confirm by inspecting the element's tag. |
| `no_connect_button` on a profile that visibly HAS Connect | Almost always the **tag** mismatch above — the top-card Connect is an `<a>` anchor and a selector is only looking for `<button>`. Match both tags. (Genuine `no_connect_button` = follow-only / out-of-network, where only Follow shows.) |
| Note typed but never sent | The Send button moved out of `div[role="dialog"]` or lost its aria label. Re-probe the modal. |
