# uploading/

Multi-platform social video uploader. One command takes a video + metadata file and posts to Rumble, BitChute, Instagram, X, TikTok, and Facebook in parallel.

## Architecture

An **orchestrator** skill dispatches **two specialized subagents** in parallel — one per browser runtime — each of which shells out to per-platform Python scripts.

```
                       social-video-upload (orchestrator skill)
                                      |
                  ┌───────────────────┴───────────────────┐
                  ↓                                       ↓
          chrome-uploader                          camoufox-uploader
          (subagent)                               (subagent)
                  |                                       |
   ┌──────┬───────┼───────┬────────┐         ┌────────────┴─────────┐
   ↓      ↓       ↓       ↓        ↓         ↓                      ↓
rumble  bitchute  instagram  x   (Playwright   tiktok               facebook
                                  Chromium)    (Camoufox)            (Camoufox*)
```

\* `facebook_upload.py` uses Camoufox.

## Folder map

| Path | Purpose |
| --- | --- |
| `skills/social-video-upload/` | Orchestrator skill. Reads metadata, classifies platforms by runtime, dispatches both subagents in a single message (parallel). |
| `skills/chrome-upload/` | Per-platform reference for Rumble / BitChute / Instagram / X. Loaded by chrome-uploader. |
| `skills/camoufox-upload/` | Per-platform reference for TikTok / Facebook. Loaded by camoufox-uploader. |
| `subagents/chrome-uploader.md` | Subagent definition. **Copy to `.claude/agents/` to activate in Claude Code.** |
| `subagents/camoufox-uploader.md` | Subagent definition. **Copy to `.claude/agents/` to activate in Claude Code.** |
| `uploaders/<platform>_upload.py` | One Python script per platform. Standard CLI: `python <platform>_upload.py video metadata [thumbnail]`. Outputs one JSON line. |
| `new/` | User's working directory for video + metadata + thumbnail files. |

## Setup (one-time)

```bash
# For chrome-uploader scripts
pip install playwright
playwright install chromium

# For camoufox-uploader scripts
pip install "camoufox[geoip]"
camoufox fetch

# Activate subagents (Claude Code)
mkdir -p .claude/agents
cp subagents/*.md .claude/agents/
```

First run of each platform script opens a headed browser window — log in once, the persistent profile saves the session for all future runs.

## Running it

In Claude Code, point it at a video and ask it to upload. The orchestrator handles everything:

```
> Upload "i keep winning LIVE FINAL.mp4" using metadata.json
```

The orchestrator reads `metadata.platforms`, splits into chrome and camoufox groups, dispatches both subagents in parallel, collects the results, and reports a unified summary like:

```
Posted:
  • Rumble — https://rumble.com/v...
  • Instagram — https://www.instagram.com/p/...
  • X — https://x.com/.../status/...

Processing (will auto-publish):
  • BitChute — https://www.bitchute.com/content

Skipped:
  • TikTok — bot detection blocked the upload
  • Facebook — Page composer blocked; Camoufox didn't beat detection this run
```

## Where to iterate

In Claude Code, on your host machine. The standalone Python scripts can't run from Cowork's sandboxed bash (different OS, no host browser access). All script debugging and selector-tweaking happens in Claude Code or a plain terminal.

See `uploaders/HANDOFF.md` for context on what's been validated, what's open, and recommended next moves.

## What's NOT here

- **YouTube** — intentionally excluded. The user uploads to YouTube manually.
- **A `cowork-driven` path** — the original Cowork-driven implementation has been replaced by this orchestrator pattern. The Cowork Chrome extension flow was useful for validating per-platform behavior live (which is now captured in the two skill files), but the production runtime is Claude Code.
