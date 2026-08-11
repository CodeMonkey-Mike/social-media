# strip_hashtags.py — CANONICAL Python port of lib/strip-hashtags.js (2026-08-11,
# posting-tail migration; the JS twin is FROZEN rollback). Plain canonical-port
# header — this is a pure-function lib, no machine line.
#
# Shared caption builder for vertical-short posters.
#
# MODEL (2026-06-05, per Mike): the `tags` array on each short is the SINGLE SOURCE OF TRUTH for
# hashtags. Stored captions are kept HASHTAG-FREE. At post time, each platform poster calls
# build_caption(), which strips any stray #hashtags from the caption and appends the first N tags
# (the most relevant, by array order) as #Hashtags — N per the platform's limit below. This bakes
# the "X max 2 / BitChute 3 / others 5-6" policy into the posters instead of hand-authoring it.
#
# Rumble appends 0 hashtags to the description (it has a dedicated tags input box, filled separately
# from short.tags). YouTube appends 3 to the description AND sends the full array to its tags field.
# $cashtags ($KAS, $BTC) are NOT hashtags and always pass through untouched.
#
# 1:1 port: same exported function names (snake_cased), same regex semantics, same
# per-platform hashtag limits/order.
import re

# Per-platform count of hashtags appended to the caption/description from `short.tags`.
PLATFORM_HASHTAG_LIMITS = {
    "x": 2,          # X caps tightly; the 2 most relevant only
    "tiktok": 5,
    "ig_reels": 5,
    "facebook": 5,
    "bitchute": 3,   # BitChute allows ~3
    "rumble": 0,     # Rumble uses its dedicated tags box (short.tags) — no hashtags in the description
    "yt_shorts": 3,  # 3 in the description (YouTube surfaces the first 3); full array also goes to the YT tags field
}


def strip_hashtags(text):
    """Tidy whitespace only. Kept for backward compat (some callers/tools may still import it)."""
    if not text:
        return text
    out = str(text)
    out = re.sub(r"[ \t]{2,}", " ", out)
    out = re.sub(r"[ \t]+$", "", out, flags=re.MULTILINE)
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out.strip()


def remove_hashtags(text):
    """Remove #hashtag tokens (NOT $cashtags), then tidy whitespace."""
    if not text:
        return text
    out = str(text)
    # drop #word tokens, keep the preceding char
    out = re.sub(r"(^|[\s(])#[A-Za-z0-9_]+", r"\1", out)
    out = re.sub(r"[ \t]{2,}", " ", out)
    out = re.sub(r"[ \t]+$", "", out, flags=re.MULTILINE)
    out = re.sub(r"[ \t]+\n", "\n", out)
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out.strip()


def to_hashtag(tag):
    """Convert a raw tag to a hashtag form: "KaspaWiseman" -> "#KaspaWiseman"
    (strip any spaces/punctuation; tag boxes keep spaces, captions don't)."""
    clean = re.sub(r"[^A-Za-z0-9]", "", str(tag or ""))
    return ("#" + clean) if clean else ""


def build_caption(text, tags, platform):
    """Build the final caption/description for a platform: hashtag-free base +
    the first N tags as #Hashtags."""
    base = remove_hashtags(text)
    n = PLATFORM_HASHTAG_LIMITS.get(platform, 0)
    if n <= 0:
        return base
    tags_line = " ".join(filter(None, (to_hashtag(t) for t in (tags or [])[:n])))
    return f"{base}\n\n{tags_line}" if tags_line else base
