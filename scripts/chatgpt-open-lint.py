#!/usr/bin/env python
"""
chatgpt-open-lint.py — flag any script that opens chatgpt.com / the shared chatgpt Chrome
profile OUTSIDE the pool.

Why (Mike, 2026-09-17): every ChatGPT conversation our automation starts must be
registered in chatgpt-image-chats.json at birth (gated title -> counted, rotated, swept).
A script that drives the profile by hand — a one-off probe, a superseded batch script —
creates untitled chats the sweep can never see; 68 piled up in six weeks. The pool's
`chat_pool.launch_profile(p)` (pipeline code) and `chat_pool.probe_session(name)`
(probes/diagnostics) are the ONLY ways to open the profile; this lint is the mechanical
gate behind that rule. It is static (no browser) and runs inside every cleanup pass.

Usage:
  python scripts/chatgpt-open-lint.py            # WARN lines, exit 0
  python scripts/chatgpt-open-lint.py --strict   # exit 1 when anything is flagged
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# The pool + the scripts built on it (Python canonical) and the FROZEN JS rollback twins.
ALLOW = {
    "repurpose/chat_pool.py", "repurpose/chat_delete.py", "repurpose/gen_images.py",
    "repurpose/gen_batch.py", "repurpose/reconcile_chats.py", "repurpose/delete_chats.py",
    "repurpose/test_chat_lifecycle.py",
    "repurpose/chat-pool.js", "repurpose/chat-delete.js", "repurpose/delete-chats.js",
    "repurpose/gen-images.js", "repurpose/gen-batch-freshchat.js",
    "repurpose/generate-broll-reload.js", "repurpose/generate-broll-wlw.js",
    "repurpose/list-chats-api.js", "repurpose/test-chat-lifecycle.js",
    "repurpose/setup-chatgpt.js", "repurpose/diag-chatgpt.js",
}
SKIP_DIRS = {"node_modules", ".git", "archive", "_superseded", "out", "dist", "build"}
EXTS = {".py", ".js", ".mjs", ".ts"}

OPEN_RE = re.compile(
    r"""goto\(\s*['"]https://chatgpt\.com/?['"]"""          # bare fresh-chat open
    r"""|launchPersistentContext\(|launch_persistent_context\(""")  # profile launch
PROFILE_RE = re.compile(r"chatgpt-profile|chatgpt\.com")


def main():
    strict = "--strict" in sys.argv[1:]
    hits = []
    for f in ROOT.rglob("*"):
        if f.suffix not in EXTS or not f.is_file():
            continue
        rel = f.relative_to(ROOT).as_posix()
        if any(part in SKIP_DIRS for part in f.parts):
            continue
        if rel in ALLOW:
            continue
        try:
            text = f.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        if not PROFILE_RE.search(text):
            continue  # a Playwright script on some OTHER profile is not our business
        for n, line in enumerate(text.splitlines(), 1):
            if OPEN_RE.search(line):
                hits.append((rel, n, line.strip()[:110]))
    if not hits:
        print("  ok — no chatgpt.com / chatgpt-profile opener outside the pool")
        return 0
    print(f"  WARN {len(hits)} opener(s) outside the pool (must use chat_pool.launch_profile "
          "or chat_pool.probe_session; delete or archive one-off probes):")
    for rel, n, line in hits:
        print(f"    {rel}:{n}  {line}")
    return 1 if strict else 0


if __name__ == "__main__":
    sys.exit(main())
