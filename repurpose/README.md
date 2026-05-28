# Repurpose

A Claude skill for turning livestream transcripts into tweets.

## How to use

1. Drop a transcript into `transcripts/` (any `.txt`, `.md`, `.srt`, or `.vtt` file).
2. In Cowork (or Claude Code), say something like:
   - "Repurpose my latest transcript"
   - "Make tweets from the transcript I just added"
   - "Read the transcript in the repurpose folder and find topics I can post"
3. Claude reads the transcript, lists 3–7 topics, and asks which one(s) you want tweets for.
4. Pick a topic. Claude drafts 3 tweet variations and saves them to `output/`.

## Folder layout

```
repurpose/
├── SKILL.md          # the skill instructions Claude follows
├── README.md         # this file (for you)
├── transcripts-ad-hoc/  # manual drop for one-off transcripts (override; batches.json is the default)
└── output/              # tweet drafts get saved here
```

## Activating the skill

For Claude to auto-load this when you mention repurposing, the `SKILL.md` needs to be somewhere Claude scans for skills. Two ways to handle that:

**Quickest path** — just tell Claude where it is. In any new chat, say "Read the SKILL.md in my repurpose folder, then follow it." That points Claude at the file and it'll act on the instructions.

**Cleaner path** — install it as a real skill via the skills plugin so Claude picks it up automatically. Ask Claude to help package and install it when you're ready.

## Cost

Zero extra cost. Everything runs through your existing Claude subscription — no Anthropic API key, no separate billing.

## Extending later

The skill currently does Twitter only. When you want to add LinkedIn, Instagram, etc., open `SKILL.md` and add new "Phase 2" sections with the rules for each platform.
