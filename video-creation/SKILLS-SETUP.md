# video-creation skills — setup (READ on a fresh machine)

The shared skills under `video-creation/skills/` are committed to the repo, so they travel with a
checkout. But they call **external tooling that is NOT in the repo** and must be installed once per
machine. This file is that install list.

## Higgsfield (`/higgsfield-generate`, `/higgsfield-soul-id`)

The skills wrap the **Higgsfield CLI**. The skill *content* is in the repo
(`video-creation/skills/higgsfield-*/`), but the CLI binary + your login are per-machine.

1. **Install the CLI** (global npm package):
   ```bash
   npm install -g @higgsfield/cli
   ```
   (Verify: `higgsfield --version` — this repo was validated on `0.1.40`.)

2. **Log in** (interactive, opens a browser):
   ```bash
   higgsfield auth login
   ```
   Confirm with `higgsfield account status` (should print your email + plan + credits).

3. That's it — the vendored skills under `skills/` then work. If `/higgsfield-generate` isn't offered
   as a command, the repo pointers at `video-creation/.claude/skills/higgsfield-*/SKILL.md` make it
   discoverable; otherwise read `skills/higgsfield-generate/SKILL.md` directly.

### Notes / gotchas
- **No voice/TTS API.** Higgsfield has no API for the Audio/voice tab; voice work is driven through
  the web UI (see the per-project Playwright scaffolding, e.g. `higgsfield-voice/`).
- **Credits cost real money.** Honor the project hard rules — e.g. **Seedance = 480p ONLY** (root
  `CLAUDE.md`); Remotion upscales 480p for free.
- **Single source of truth.** The repo copy under `skills/` is the ONLY copy — there is no global
  duplicate (the old `~/.agents/skills/` / `~/.claude/skills/` copies were removed 2026-06-19 to avoid
  the diverged-skill lost-work trap of 2026-05-25). `/higgsfield-*` is enabled by the committed pointer
  at `.claude/skills/<name>/SKILL.md` and works automatically whenever you're inside this repo. Edit the
  skill only under `skills/`. (If you ever want the command available OUTSIDE this repo, add a symlink
  `~/.claude/skills/<name>` → this repo's `skills/<name>` — a pointer, never a second copy.)

## Why skills live in `video-creation/skills/`
These are general-purpose video-creation tools (used by vertical-ai-persona, longform-edited, and
longform-presentation alike — not specific to any one subfolder), so they sit at the `video-creation`
level. Per-track skills stay in their own track folder.
