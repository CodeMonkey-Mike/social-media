# Subagent definitions

These are Claude Code subagent definitions in the standard format (YAML frontmatter + system prompt body).

**Setup for Claude Code:** Claude Code looks for custom subagents in `.claude/agents/` relative to the project root. To use these definitions, copy or symlink them into place:

```bash
mkdir -p .claude/agents
cp subagents/*.md .claude/agents/
```

Or symlink the whole folder:

```bash
mkdir -p .claude
ln -s ../subagents .claude/agents
```

(The `subagents/` folder lives at the workspace root because Cowork blocks writes to `.claude/` directly. Once they're under `.claude/agents/`, Claude Code will pick them up automatically.)

## Files

- **`chrome-uploader.md`** — uploads to Rumble, BitChute, Instagram, X via Playwright Chromium scripts in `../uploaders/`.
- **`camoufox-uploader.md`** — uploads to TikTok, Facebook via Camoufox-driven Python scripts in `../uploaders/`.

## How they're invoked

The `social-video-upload` orchestrator skill (in `../skills/social-video-upload/SKILL.md`) dispatches these via the Task tool, both in a single assistant message so they run in parallel. See that skill's "Subagent dispatch contract" section for the exact prompt shape.
