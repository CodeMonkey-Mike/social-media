// strip-hashtags.js — shared caption builder for vertical-short posters.
//
// MODEL (2026-06-05, per Mike): the `tags` array on each short is the SINGLE SOURCE OF TRUTH for
// hashtags. Stored captions are kept HASHTAG-FREE. At post time, each platform poster calls
// `buildCaption()`, which strips any stray #hashtags from the caption and appends the first N tags
// (the most relevant, by array order) as #Hashtags — N per the platform's limit below. This bakes
// the "X max 2 / BitChute 3 / others 5-6" policy into the posters instead of hand-authoring it.
//
// Rumble appends 0 hashtags to the description (it has a dedicated tags input box, filled separately
// from `short.tags`). YouTube appends 3 to the description AND sends the full array to its tags field.
// $cashtags ($KAS, $BTC) are NOT hashtags and always pass through untouched.

// Per-platform count of hashtags appended to the caption/description from `short.tags`.
const PLATFORM_HASHTAG_LIMITS = {
  x: 2,          // X caps tightly; the 2 most relevant only
  tiktok: 5,
  ig_reels: 5,
  facebook: 5,
  bitchute: 3,   // BitChute allows ~3
  rumble: 0,     // Rumble uses its dedicated tags box (short.tags) — no hashtags in the description
  yt_shorts: 3,  // 3 in the description (YouTube surfaces the first 3); full array also goes to the YT tags field
};

// Tidy whitespace only. Kept for backward compat (some callers/tools may still import it).
function stripHashtags(text) {
  if (!text) return text;
  return String(text)
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Remove #hashtag tokens (NOT $cashtags), then tidy whitespace.
function removeHashtags(text) {
  if (!text) return text;
  let out = String(text)
    .replace(/(^|[\s(])#[A-Za-z0-9_]+/g, '$1') // drop #word tokens, keep the preceding char
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

// "KaspaWiseman" -> "#KaspaWiseman" (strip any spaces/punctuation; tag boxes keep spaces, captions don't).
function toHashtag(tag) {
  const clean = String(tag || '').replace(/[^A-Za-z0-9]/g, '');
  return clean ? '#' + clean : '';
}

// Build the final caption/description for a platform: hashtag-free base + the first N tags as #Hashtags.
function buildCaption(text, tags, platform) {
  const base = removeHashtags(text);
  const n = PLATFORM_HASHTAG_LIMITS[platform] ?? 0;
  if (n <= 0) return base;
  const tagsLine = (tags || [])
    .slice(0, n)
    .map(toHashtag)
    .filter(Boolean)
    .join(' ');
  return tagsLine ? `${base}\n\n${tagsLine}` : base;
}

module.exports = { stripHashtags, removeHashtags, buildCaption, toHashtag, PLATFORM_HASHTAG_LIMITS };
