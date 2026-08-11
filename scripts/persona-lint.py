#!/usr/bin/env python3
"""
persona-lint.py — flag persona/persona.json formatting & terminology violations in the
schedule-tweets queue data files (or any JSON). Read-only by default.

Enforces the machine-checkable rules from persona.json (terminology_rules / avoid_in_drafts /
writing_style.formatting). Voice/tone can't be linted — that's on the writer — but these
deterministic ones can, and they're the AI-tells that slip through:

  - em dash (—) / en dash (–)        BANNED everywhere   [--fix: -> "-"]
  - chart/market emojis (📈 📉)        BANNED (AI tell)    [--fix: removed]
  - "50WMA" / "200WMA" / "50-week MA" wrong format        [report only]
  - "Casper"                          should be "Kaspa"   [report only]

Plus two structural rules that aren't string regexes:
  - longs.json: platforms must be rumble/bitchute/facebook (YouTube longform is manual)
  - ig-single-image.json: a PENDING entry's subject must be KASPA (IG is the Kaspa-facing
    surface; macro / memecoins / $IF / ElizaOS get no IG entry at all)

WHAT GETS CHECKED (scoping, added 2026-08-08 so this can gate the publish run):
  This is a PRE-POST gate. It checks copy that can still be changed, and deliberately does
  NOT check:
    1. Entries with nothing left pending. Once every platform has left 'pending' the text
       is live on the platform; the local row is a RECORD of what shipped. "Fixing" it
       would only make the record less true, and it can never change what was posted.
    2. Machine-written diagnostic fields (MACHINE_FIELDS, any depth). The posting scripts
       write prose into platforms.<name>.error / .note; those are logs that happen to live
       in JSON, not persona copy.
    3. `$`-prefixed file metadata ($schema_doc / $post_schema / $note).
  Without this scoping the gate was permanently red: on 2026-08-08 shorts.json had 131
  violations, 124 of them em dashes the posting scripts had HARDCODED into their own retry
  diagnostics, and every single one sat on an already-posted entry. Zero were actionable.
  Those five source strings were fixed the same day (post-rumble-short.js, post-bitchute-
  short.js, post-x-poll.js, recapture-rumble-url.js), so both halves of the problem are
  closed: the scripts no longer emit em dashes, and the gate no longer reads their logs.
  Every skip is COUNTED and printed, never silent.

Usage:
  python scripts/persona-lint.py                  # lint all schedule-tweets/data/*.json
  python scripts/persona-lint.py --file <path>    # lint one JSON file
  python scripts/persona-lint.py --fix            # apply the safe auto-fixes in place

Exit code: 0 = clean, 1 = violations found (so it can gate a posting step).
"""
import argparse
import json
import re
import sys
from pathlib import Path

# Windows consoles are cp1252 by default and choke on em dashes / emojis we report.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = REPO_ROOT / "schedule-tweets" / "data"

# (label, compiled regex, autofix_replacement_or_None)
CHECKS = [
    ("em/en dash", re.compile(r"[—–]"), "-"),
    ("chart emoji", re.compile(r"[\U0001F4C8\U0001F4C9]"), ""),
    ("WMA format", re.compile(r"\b(?:50|200)\s*WMA\b|\b(?:50|200)-week MA\b|\b(?:50|200) WMA\b"), None),
    ("'Casper' (should be Kaspa)", re.compile(r"\bCasper\b"), None),
]

# Structural rule (not a string regex): a longs.json entry may only fan out to these platforms.
# YouTube longform is uploaded by Mike HIMSELF, by hand — it is NOT a queue recipient and there is
# no upload-longform-youtube script, so a stray platform (e.g. "youtube") pins the entry in the
# dashboard forever. Mirrors ALLOWED_PLATFORMS in scripts/lib/longform-queue.js. Report only.
ALLOWED_LONGFORM_PLATFORMS = {"rumble", "bitchute", "facebook"}

# Structural rule (not a string regex): an ig-single-image.json entry may only exist if its subject
# is KASPA. Mike's standing rule from the day the livestream-repurpose command was written: "if any
# of the x-tweets images are about Kaspa, repurpose them to a 4:5 image and queue them as an
# Instagram single-image post." The IG feed is the Kaspa-facing surface of the account; macro,
# memecoins, $IF/Robinhood-chain, ElizaOS and geopolitics ship as tweets/threads/YT and get NO IG
# entry. Canonical prose: repurpose/SKILL.md "Topic filter - Kaspa only (HARD RULE)".
#
# This is gated in code because it is a RECURRING violation, not a one-off: the rule lived only in
# the command while this skill said to queue an IG companion for EVERY X tweet image, and five
# non-Kaspa entries were queued across if-yacht / eliza / early-crash (2026-08-05 -> 08-07) before
# Mike caught it. Only PENDING entries are checked - already-posted history is not rewritten.
KASPA_RX = re.compile(
    r"\bkaspa\b|\$kas\b|\bkrc-?20\b|\bghostdag\b|\bdagknight\b|\bkaspy\b|\bkasy\b|\bkappy\b",
    re.IGNORECASE,
)
# Fields that describe what the post is ABOUT (hashtags alone don't qualify - a #kaspa tag stapled
# to a macro post is not a Kaspa post, and that is exactly how this rule gets quietly re-broken).
IG_SUBJECT_FIELDS = ("caption", "hook", "id", "image_path", "source_post")


def lint_ig_kaspa_only(fp, data):
    """Flag any PENDING ig-single-image.json entry whose subject is not Kaspa."""
    if fp.name != "ig-single-image.json":
        return 0
    if not (isinstance(data, dict) and isinstance(data.get("posts"), list)):
        return 0
    violations = 0
    for entry in data["posts"]:
        entry = entry or {}
        if entry.get("status") != "pending":
            continue
        subject = " ".join(str(entry.get(f) or "") for f in IG_SUBJECT_FIELDS)
        if KASPA_RX.search(subject):
            continue
        violations += 1
        print(f"  [non-Kaspa IG post] {fp.name}: id=\"{entry.get('id', '?')}\"")
        print(f"      hook: \"{str(entry.get('hook', ''))[:70]}\"")
        print("      IG single-image is Kaspa only; a non-Kaspa topic gets NO IG entry")
        print("      (repurpose/SKILL.md -> Instagram single-image mode -> Topic filter)")
    return violations


def lint_longs_platforms(fp, data):
    """Flag any longs.json entry declaring a platform outside the longform allow-list."""
    if not (isinstance(data, dict) and isinstance(data.get("longs"), list)):
        return 0
    violations = 0
    for entry in data["longs"]:
        plats = (entry or {}).get("platforms") or {}
        for plat in plats:
            if plat not in ALLOWED_LONGFORM_PLATFORMS:
                violations += 1
                title = str((entry or {}).get("title", "?"))[:50]
                print(f"  [disallowed longform platform '{plat}'] {fp.name}: \"{title}\"")
                print("      longform goes to rumble/bitchute/facebook only; YouTube is manual, never queued")
    return violations


# Fields the POSTING SCRIPTS write, at any depth. These are diagnostics (retry-window
# messages, pre-check notes), never persona copy, so linting them measures our own logs.
MACHINE_FIELDS = {"error", "note"}

# Platform statuses that mean "this can still be stopped". Mirrors the posters, which all
# pick up the first entry with status == 'pending'.
ACTIONABLE_STATUS = "pending"


def walk(node, path, hits):
    """Recursively collect (json_path, string_value) for every LINTABLE string in the JSON.

    Skips MACHINE_FIELDS and `$`-prefixed metadata keys (see the module docstring)."""
    if isinstance(node, dict):
        for k, v in node.items():
            if k in MACHINE_FIELDS or k.startswith("$"):
                continue
            walk(v, f"{path}.{k}", hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{path}[{i}]", hits)
    elif isinstance(node, str):
        hits.append((path, node))


def entry_list(data):
    """The file's entry list whatever the wrapper key is (shorts/longs/posts/tweets/...).

    Returns None for a shape we don't recognise, in which case the caller lints the WHOLE
    document rather than guessing (fail loud, never silently check nothing)."""
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, list) and v and all(isinstance(x, dict) for x in v[:3]):
                return v
    return None


def is_actionable(entry):
    """True if this entry's copy can still change what gets posted.

    Per-platform entries (shorts/longs) are actionable while ANY platform is still pending;
    flat entries (tweets, polls, IG) while their own status is pending."""
    plats = entry.get("platforms")
    if isinstance(plats, dict) and plats:
        return any((p or {}).get("status") == ACTIONABLE_STATUS
                   for p in plats.values() if isinstance(p, dict))
    return entry.get("status") == ACTIONABLE_STATUS


def lint_file(fp, fix):
    try:
        text = fp.read_text(encoding="utf-8")
        data = json.loads(text)
    except Exception as e:
        print(f"  ! skip {fp.name}: {e}")
        return 0, 0
    # Scope to entries whose copy can still be changed (see the module docstring).
    entries = entry_list(data)
    strings, skipped = [], 0
    if entries is None:
        walk(data, fp.name, strings)          # unrecognised shape: lint everything
    else:
        for i, entry in enumerate(entries):
            if isinstance(entry, dict) and not is_actionable(entry):
                skipped += 1
                continue
            walk(entry, f"{fp.name}[{i}]", strings)

    violations = 0
    fixable = set()                            # distinct strings an autofix would repair
    for jpath, val in strings:
        for label, rx, repl in CHECKS:
            for m in rx.finditer(val):
                violations += 1
                if repl is not None:
                    fixable.add(val)
                s = max(0, m.start() - 30)
                e = min(len(val), m.end() + 30)
                snippet = val[s:e].replace("\n", " ")
                print(f"  [{label}] {jpath}")
                print(f"      ...{snippet}...")
    violations += lint_longs_platforms(fp, data)
    violations += lint_ig_kaspa_only(fp, data)
    if skipped:
        print(f"  ({skipped} entr{'y' if skipped == 1 else 'ies'} skipped: nothing left "
              "pending, the copy is already live and cannot be changed)")

    fixes = 0
    if fix and fixable:
        # Replace only the exact values the checks FLAGGED, matched as their JSON-encoded
        # form, so an autofix can never reach into an already-posted row or a machine log.
        # (The old whole-file regex sub rewrote all of those too.)
        raw = text
        for original in sorted(fixable, key=len, reverse=True):
            repaired = original
            for label, rx, repl in CHECKS:
                if repl is not None:
                    repaired = rx.sub(repl, repaired)
            if repaired == original:
                continue
            enc_old = json.dumps(original, ensure_ascii=False)
            enc_new = json.dumps(repaired, ensure_ascii=False)
            n = raw.count(enc_old)
            if n:
                raw = raw.replace(enc_old, enc_new)
                fixes += n
        if fixes:
            # validate it's still parseable, then write
            json.loads(raw)
            fp.write_text(raw, encoding="utf-8")
    return violations, fixes


def main():
    ap = argparse.ArgumentParser(description="Lint queue data for persona.json violations.")
    ap.add_argument("--file", help="lint a single JSON file (default: all schedule-tweets/data/*.json)")
    ap.add_argument("--fix", action="store_true", help="apply safe auto-fixes (em/en dash -> '-', strip chart emojis)")
    args = ap.parse_args()

    files = [Path(args.file)] if args.file else sorted(DATA_DIR.glob("*.json"))
    total_v = total_f = 0
    for fp in files:
        if not fp.is_file():
            print(f"  ! not found: {fp}")
            continue
        print(f"=== {fp.name} ===")
        v, f = lint_file(fp, args.fix)
        if v == 0:
            print("  clean")
        if args.fix and f:
            print(f"  fixed {f} occurrence(s) in place")
        total_v += v
        total_f += f

    print(f"\nDone. {total_v} violation(s)" + (f", {total_f} auto-fixed" if args.fix else "") + ".")
    print("(Voice/tone isn't lintable — write captions in Mike's persona; this only catches the deterministic AI-tells.)")
    sys.exit(1 if (total_v - total_f) > 0 else 0)


if __name__ == "__main__":
    main()
