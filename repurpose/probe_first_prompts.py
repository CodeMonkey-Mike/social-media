# probe_first_prompts.py — READ-ONLY: fetch each candidate conversation's first user
# prompts, so who made a chat is judged on its CONTENT, not its sidebar title (titles
# misclassify: Mike's manual thumbnail chats and pipeline b-roll chats get similar
# auto-titles, 2026-07-22). Prints the first 2 user messages (trimmed) per chat id.
# Python port of probe-first-prompts.js (2026-11-27; the JS was deleted the same day).
#
# Sends nothing and deletes nothing, so it starts no conversation.
#
# Usage: python repurpose/probe_first_prompts.py --ids <file, one chat id per line> [--json <out>]
# Needs the chatgpt profile free: do not run while an image run holds it.

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool  # noqa: E402
import gen_images  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Literal JS (page.evaluate body), session-token authed, like the other backend-API reads.
_FIRST_PROMPTS_JS = r"""
async (cid) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' }).then(x => x.json());
  const resp = await fetch('/backend-api/conversation/' + cid, {
    credentials: 'include', headers: { Authorization: 'Bearer ' + s.accessToken },
  });
  if (!resp.ok) return { id: cid, error: 'HTTP ' + resp.status };
  const j = await resp.json();
  // walk the mapping in chronological order, take user-authored text parts
  const nodes = Object.values(j.mapping || {})
    .filter(n => n.message && n.message.author && n.message.author.role === 'user')
    .sort((a, b) => (a.message.create_time || 0) - (b.message.create_time || 0));
  const prompts = nodes.slice(0, 2).map(n => {
    const parts = (n.message.content && n.message.content.parts) || [];
    return parts.filter(p => typeof p === 'string').join(' ').replace(/\s+/g, ' ').slice(0, 280);
  });
  return { id: cid, title: j.title, user_messages: nodes.length, prompts };
}
"""


def main():
    ap = argparse.ArgumentParser(description="Print the first user prompts of each chat id (read-only).")
    ap.add_argument("--ids", required=True, help="text file, one chat id per line")
    ap.add_argument("--json", default=None, help="also write the results to this file")
    args = ap.parse_args()

    ids = [s.strip() for s in Path(args.ids).read_text(encoding="utf-8-sig").splitlines() if s.strip()]

    from playwright.sync_api import sync_playwright
    results = []
    with sync_playwright() as p:
        ctx = pool.launch_profile(p)
        try:
            page = ctx.new_page()
            page.goto("https://chatgpt.com/", wait_until="domcontentloaded", timeout=60000)
            gen_images.composer_loaded(page, 30000)
            for cid in ids:
                r = page.evaluate(_FIRST_PROMPTS_JS, cid)
                results.append(r)
                if r.get("error"):
                    print(f"\n### {cid}\n  ERROR {r['error']}")
                else:
                    print(f"\n### {r.get('title')}  ({cid[:8]}…, {r['user_messages']} user msgs)")
                    for i, text in enumerate(r["prompts"], 1):
                        print(f"  [{i}] {text or '(image/file-only message)'}")
                page.wait_for_timeout(400)   # gentle pacing
        finally:
            ctx.close()
    if args.json:
        Path(args.json).write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
        print(f"\nWrote {args.json}")


if __name__ == "__main__":
    main()
