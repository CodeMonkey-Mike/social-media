# Reply Guy List — Project Handoff for Claude Code

## Project Goal

Build a private X (Twitter) **"Reply Guy" List** for account **@mikeneder** — a curated feed of 191 high-signal crypto accounts across Kaspa (KAS), Bittensor (TAO), broader Crypto Twitter, and Toncoin (TON) ecosystems. The purpose is to enable @mikeneder to systematically reply to influential accounts to grow his presence on Crypto Twitter.

The list is **private** (only @mikeneder can see it).

---

## X List Details

- **List name:** Reply Guy
- **List ID:** `2051819466921533779`
- **Direct URL:** https://x.com/i/lists/2051819466921533779
- **Owner account:** @mikeneder

---

## Research Document

The full 191-account research doc with all handles, links, follower counts, and rationale is at:

```
research_accounts.md
```

---

## Current Progress

Tracked automatically in `state.json`. Run a dry-run to see the queue:

```bash
python add_members.py --dry-run
```

---

## How to Run

```bash
cd "C:\Users\mnede\Documents\Claude\social-media\x-reply-guy"
python add_members.py                # up to 10 adds, 30-90 min delays
python add_members.py --max 3        # cap this session at 3 adds
python add_members.py --dry-run      # preview queue without opening browser
```

---

## Rate Limit Rules — Critical

X applies account-level rate limits if too many members are added too quickly.

- **Maximum 10–15 adds per day**
- **Minimum 30–60 minutes between each add** (the script handles this automatically)
- **Do not run more than one session per day**
- If any add returns a rate-limit error, the script stops immediately — wait 24–72 hours before running again
