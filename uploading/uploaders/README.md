# Uploaders

Standalone Python upload scripts for the social-video-upload skill family. One script per platform. Each script is invoked as a subprocess by one of two subagents:

- `chrome-uploader` calls: `rumble_upload.py`, `bitchute_upload.py`, `instagram_upload.py`, `x_upload.py`
- `camoufox-uploader` calls: `tiktok_upload.py`, `facebook_upload.py`

The `social-video-upload` orchestrator skill dispatches both subagents in parallel.

## Calling convention

Every script takes the same CLI shape:

```bash
python <platform>_upload.py <video_path> <metadata_path> [thumbnail_path]
```

Every script ends by writing exactly **one JSON line to stdout** as its final line:

```json
{"platform": "rumble", "status": "published", "url": "https://rumble.com/..."}
```

Status values: `published`, `processing`, `staged`, `skipped`, `failed`. Include `error` on `staged`, `skipped`, `failed`. Include `url` on `published` and `processing`. All other output (progress logs, stack traces) goes to stderr or to non-JSON lines on stdout.

This contract is what lets the subagents shell out and parse results without parsing free-form text.

## One-time setup

**For chrome-uploader scripts (Rumble, BitChute, Instagram, X):**

```bash
pip install playwright
playwright install chromium
```

**For camoufox-uploader scripts (TikTok, Facebook):**

```bash
pip install "camoufox[geoip]"
camoufox fetch
```

`camoufox fetch` downloads the patched Firefox binary (~150 MB).

## First-run login per platform

Each script uses a persistent profile dir at:

- `~/.chrome_<platform>_profile/` for Chromium-driven scripts
- `~/.camoufox_<platform>_profile/` for Camoufox-driven scripts

First run for each platform opens a headed browser window. Log in to that platform manually inside that window — the script detects the login redirect and waits up to 5 minutes. Cookies persist; subsequent runs skip the login step.

## Status of each script (as of restructure)

| Script | Browser | Tested end-to-end? |
| --- | --- | --- |
| `rumble_upload.py` | Playwright Chromium | First draft, untested standalone |
| `bitchute_upload.py` | Playwright Chromium | First draft, untested standalone |
| `instagram_upload.py` | Playwright Chromium | First draft, untested standalone |
| `x_upload.py` | Playwright Chromium | First draft, untested standalone |
| `tiktok_upload.py` | Camoufox | First draft, untested standalone |
| `facebook_upload.py` | Camoufox | First draft, untested standalone |

The platform behavior the scripts encode (selectors, gotchas, field formats) was validated live in earlier sessions via the Cowork Chrome extension flow — that knowledge is captured in:

- `../skills/chrome-upload/SKILL.md`
- `../skills/camoufox-upload/SKILL.md`

But the scripts themselves haven't been smoke-tested standalone. Expect the first run of each to need 1–3 cycles of "run, hit a selector mismatch in the live DOM, tweak, re-run."

## Where to iterate

In **Claude Code**, on the host. The bash sandbox in Cowork mode can't reach your host Python install or open a real browser window for login, so all script iteration needs to happen in Claude Code (or any plain terminal — Claude Code just makes the read-debug-edit loop tighter).

See `HANDOFF.md` in this directory for context on what's been validated, what's open, and recommended next moves.

## Facebook

`facebook_upload.py` drives Camoufox through the Page composer. Facebook is detection-hostile; if it fails repeatedly, that's expected — surface `failed` to the orchestrator and let the user know.
