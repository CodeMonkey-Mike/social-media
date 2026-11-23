#!/usr/bin/env python
"""
Topic Radar dashboard builder. Python port of build-dashboard.js (2026-11-23, Mike's Python-only rule).

Tab 1 "Creator Watch List": each watchlist creator's uploads from the last N days, via YouTube RSS
(creators.json).
Tab 2 "News Clips": crypto-keyword-matched uploads from the Lane 2 business news outlets (outlets.json),
via yt-dlp flat-playlist (RSS only holds 15 entries, hours of output for these channels, so we page
deeper instead).
Tab 3 "Crypto Sites": recent articles from crypto news sites (sites.json) via their RSS feeds.
Tab 4 "Policy Radar": Polymarket odds (polymarket.json) + the X posts fetch-x-policy.py last cached.
video-ideas.json pins suggested video titles under matching rows (news rows match by videoId, article
rows by link URL) so curation survives rebuilds.
Output is a fully static dashboard.html next to this script; no server.

    python video-creation/topic-radar/build_dashboard.py [--days 5]

Companion docs (same folder): CLAUDE.md = how to operate/refresh this tool; PLAYBOOK.md = the
topic-finding doctrine it implements (Lanes 1-3).

The page it writes is byte-for-byte what the JavaScript builder wrote for the same data (checked on
2026-11-23 before the JS file was deleted), so the number and date helpers below copy JavaScript's
rounding and date parsing on purpose. Do not "simplify" them to Python's defaults.
"""
import json
import math
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from decimal import ROUND_HALF_UP, Decimal
from email.utils import parsedate_to_datetime
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# How deep to page each outlet's uploads tab. High-volume channels (Fox Business, CNBC) post 50+
# clips/day, so 5 days needs a few hundred entries.
NEWS_DEPTH = 400

# re.ASCII keeps \b and \w ASCII-only and the case-insensitive match ASCII-only, as in JavaScript.
CRYPTO_RE = re.compile(
    r"\b(crypto|cryptocurrenc\w*|bitcoin|btc|ethereum|ether|eth|stablecoin\w*|"
    r"blockchain|coinbase|binance|kraken|xrp|ripple|solana|kaspa|dogecoin|"
    r"altcoin\w*|digital assets?|tether|usdc|usdt|saylor|microstrategy|satoshi|"
    r"web3|tokeniz\w*|genius act|defi|memecoin\w*|meme coin\w*)\b",
    re.IGNORECASE | re.ASCII)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36")

DIR = Path(__file__).resolve().parent
EPOCH = datetime(1970, 1, 1, tzinfo=timezone.utc)

# JavaScript's "." (no line terminators) and "\s", spelled out so the feed regexes match the same text.
DOT = "[^\\n\\r\\u2028\\u2029]"
JS_SPACE = "\\t\\n\\x0b\\x0c\\r \\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff"
JS_TRIM = "\t\n\x0b\x0c\r \xa0                　﻿"

WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]  # en-GB


def read_json(name):
    return json.loads((DIR / name).read_text(encoding="utf-8"))


def load_config():
    return {
        "creators": read_json("creators.json"),
        "outlets": read_json("outlets.json"),
        "sites": read_json("sites.json"),
        "ideas": read_json("video-ideas.json") if (DIR / "video-ideas.json").exists() else [],
        "pm_config": read_json("polymarket.json"),
        "x_accounts": read_json("x-accounts.json"),
        "x_policy": read_json("x-policy.json") if (DIR / "x-policy.json").exists() else None,
    }


# ---------- JavaScript-compatible helpers ----------

def js_str(v):
    """String(v) for the values that reach the page."""
    if v is None:
        return "undefined"
    if v is True:
        return "true"
    if v is False:
        return "false"
    if isinstance(v, float):
        if math.isnan(v):
            return "NaN"
        if math.isfinite(v) and v == int(v):
            return str(int(v))
    return str(v)


def js_number(v):
    """Number(v): NaN when it is not a number."""
    if v is None or v == "":
        return 0.0
    if isinstance(v, bool):
        return 1.0 if v else 0.0
    if isinstance(v, (int, float)):
        return float(v)
    try:
        return float(str(v).strip())
    except ValueError:
        return math.nan


def num_or0(v):
    """Number(v) || 0."""
    x = js_number(v)
    return 0 if math.isnan(x) else x


def js_round(x):
    """Math.round: halves go up (toward +infinity). Python's round() sends halves to the even digit."""
    if math.isnan(x):
        return x
    f = math.floor(x)
    return f + 1 if x - f >= 0.5 else f


def to_fixed1(x):
    """(x).toFixed(1): halves go up on the exact binary value, so 1.25 -> "1.3" (Python's :.1f gives "1.2")."""
    return str(Decimal(x).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def date_ms(s):
    """new Date(s).getTime() for the date shapes these feeds carry; None where JavaScript gives NaN."""
    s = (s or "").strip(JS_TRIM)
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(s)
        if re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", s):
            dt = dt.replace(tzinfo=timezone.utc)  # a date with no time is UTC in JavaScript
    except ValueError:
        try:
            dt = parsedate_to_datetime(s)  # RSS 2.0 pubDate (RFC 822)
        except (TypeError, ValueError):
            return None
    if dt.tzinfo is None:
        dt = dt.astimezone()  # no offset = local time, as in JavaScript
    return (dt - EPOCH) // timedelta(milliseconds=1)


def esc(s):
    return (js_str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;").replace("'", "&#39;"))


def decode_entities(s):
    s = re.sub(r"<!\[CDATA\[([\s\S]*?)\]\]>", lambda m: m.group(1), s)
    s = (s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
         .replace("&quot;", '"'))
    s = re.sub(r"&#0?39;", "'", s).replace("&apos;", "'")
    s = re.sub(r"&#([0-9]+);", lambda m: chr(int(m.group(1))), s)
    return s.strip(JS_TRIM)


def http_text(url, headers=None):
    """GET a URL as UTF-8 text. A non-2xx answer raises "HTTP <status>", as the JS builder reported it."""
    req = urllib.request.Request(url, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            raw = res.read()
    except urllib.error.HTTPError as e:
        raise RuntimeError("HTTP " + str(e.code)) from None
    text = raw.decode("utf-8", errors="replace")
    return text[1:] if text.startswith("﻿") else text


# ---------- Tab 1: creators via YouTube RSS ----------

def _get(block, pattern):
    m = re.search(pattern, block)
    return (m.group(1) if m else "") or ""


def parse_feed(xml):
    """Minimal Atom parsing: YouTube's feed shape is stable and machine-generated."""
    entries = []
    for block in xml.split("<entry>")[1:]:
        views = _get(block, r'<media:statistics views="([0-9]+)"')
        entries.append({
            "videoId": _get(block, "<yt:videoId>(" + DOT + "*?)</yt:videoId>"),
            "title": decode_entities(_get(block, r"<title>([\s\S]*?)</title>")),
            "published": _get(block, "<published>(" + DOT + "*?)</published>"),
            "thumb": _get(block, '<media:thumbnail url="(' + DOT + '*?)"'),
            "views": int(views) if views else 0,
        })
    return entries


def creator_videos(xml, cutoff):
    """The feed's entries inside the window, newest first."""
    dated = [(date_ms(v["published"]), v) for v in parse_feed(xml)]
    kept = [(ms, v) for ms, v in dated if ms is not None and ms >= cutoff]
    kept.sort(key=lambda p: -p[0])
    return [v for _, v in kept]


def fetch_creator(c, cutoff):
    url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + c["channel_id"]
    try:
        return {**c, "videos": creator_videos(http_text(url), cutoff), "error": None}
    except Exception as e:
        return {**c, "videos": [], "error": str(e)}


# ---------- Tab 2: news outlets via yt-dlp ----------

def ytdlp(args):
    r = subprocess.run(["yt-dlp", *args], capture_output=True,
                       creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0))
    out = r.stdout.decode("utf-8", errors="replace")
    # yt-dlp exits non-zero on partial failures (e.g. one hidden video); keep whatever it printed as
    # long as we got output.
    if r.returncode != 0 and not out:
        raise RuntimeError("Command failed: yt-dlp " + " ".join(args) + "\n"
                           + r.stderr.decode("utf-8", errors="replace"))
    return out


def outlet_clips(o, cutoff_day, run=None):
    run = run or ytdlp
    out = run([
        "--no-update", "--flat-playlist",
        "--playlist-items", "1:" + str(NEWS_DEPTH),
        "--extractor-args", "youtubetab:approximate_date",
        "--print", "%(id)s\t%(upload_date)s\t%(title)s",
        "https://www.youtube.com/channel/" + o["channel_id"] + "/videos",
    ])
    matches = []
    for line in re.split(r"\r?\n", out):
        if not line:
            continue
        parts = line.split("\t")
        v = {"videoId": parts[0], "date": parts[1] if len(parts) > 1 else None,
             "title": "\t".join(parts[2:]), "outlet": o["name"]}
        if CRYPTO_RE.search(v["title"]):
            matches.append(v)

    # YouTube intermittently omits the relative-date text, leaving upload_date NA for a whole page.
    # Resolve missing dates per video (matches only, so a handful of requests). The uploads tab is
    # chronological, so once matches fall past the cutoff twice in a row, everything after is older:
    # stop.
    clips = []
    older = 0
    for v in matches:
        if not v["date"] or v["date"] == "NA":
            v["date"] = run([
                "--no-update", "--skip-download", "--print", "%(upload_date)s",
                "https://www.youtube.com/watch?v=" + v["videoId"],
            ]).strip(JS_TRIM)
        if v["date"] and v["date"] != "NA" and v["date"] >= cutoff_day:
            clips.append(v)
            older = 0
        else:
            older += 1
            if older >= 2:
                break
    return clips


def fetch_outlet(o, cutoff_day):
    try:
        return {**o, "clips": outlet_clips(o, cutoff_day), "error": None}
    except Exception as e:
        return {**o, "clips": [], "error": str(e).split("\n")[0][:200]}


# ---------- Tab 3: crypto news sites via RSS ----------

def parse_rss_items(xml):
    """RSS 2.0 <item> feeds and Atom <entry> feeds both come through here; normalized to
    {title, link, pubDate, thumb}."""
    item_re = "<item[" + JS_SPACE + ">]"
    entry_re = "<entry[" + JS_SPACE + ">]"
    is_atom = not re.search(item_re, xml) and bool(re.search(entry_re, xml))
    items = []
    for block in re.split(entry_re if is_atom else item_re, xml)[1:]:
        items.append({
            "title": decode_entities(_get(block, r"<title[^>]*>([\s\S]*?)</title>")),
            "link": (decode_entities(_get(block, r'<link[^>]*href="([^"]+)"')) if is_atom
                     else decode_entities(_get(block, r"<link>([\s\S]*?)</link>"))),
            "pubDate": (_get(block, r"<pubDate>([\s\S]*?)</pubDate>")
                        or _get(block, r"<published>([\s\S]*?)</published>")
                        or _get(block, r"<updated>([\s\S]*?)</updated>")),
            "thumb": (_get(block, r'<media:(?:content|thumbnail)[^>]*url="([^"]+)"')
                      or _get(block, r'<enclosure[^>]*url="([^"]+)"')),
        })
    return items


def site_articles(s, xml, cutoff):
    out = []
    for a in parse_rss_items(xml):
        ms = date_ms(a["pubDate"]) if a["pubDate"] else None
        if a["title"] and a["link"] and ms is not None and ms >= cutoff:
            out.append({**a, "site": s["name"]})
    return out


def fetch_site(s, cutoff):
    try:
        xml = http_text(s["feed"], {"User-Agent": UA, "Accept": "application/rss+xml,application/xml,*/*"})
        return {**s, "articles": site_articles(s, xml, cutoff), "error": None}
    except Exception as e:
        return {**s, "articles": [], "error": str(e)}


# ---------- Tab 4: Polymarket odds ----------

def polymarket_events(q, data, per_query, seen):
    """The events one search answer adds (most 24h volume first, each event once across queries)."""
    live = [e for e in (data.get("events") or [])
            if e.get("active") and not e.get("closed") and not e.get("archived")]
    live.sort(key=lambda e: -num_or0(e.get("volume24hr")))
    events = []
    for e in live[:per_query]:
        if e.get("id") in seen:
            continue
        seen.add(e.get("id"))
        markets = []
        for m in e.get("markets") or []:
            if not (m.get("active") and not m.get("closed")):
                continue
            try:
                outcomes = json.loads(m.get("outcomes") or "[]")
            except (TypeError, ValueError):
                outcomes = []
            try:
                prices = json.loads(m.get("outcomePrices") or "[]")
            except (TypeError, ValueError):
                prices = []
            markets.append({
                "label": m.get("groupItemTitle") or m.get("question"),
                "yesPct": js_round(js_number(prices[0]) * 100) if prices else None,
                "outcome": (outcomes[0] if outcomes else None) or "Yes",
                "volume": num_or0(m.get("volumeNum") or m.get("volume")),
            })
        markets.sort(key=lambda m: -m["volume"])
        events.append({
            "query": q,
            "title": e.get("title"),
            "slug": e.get("slug"),
            "volume": num_or0(e.get("volume")),
            "endDate": e.get("endDate"),
            "markets": markets[:4],
        })
    return events


def fetch_polymarket(pm_config):
    seen = set()
    events = []
    errors = []
    for q in pm_config["queries"]:
        try:
            text = http_text("https://gamma-api.polymarket.com/public-search?q=" + urllib.parse.quote(q, safe="-_.!~*'()"),
                             {"User-Agent": UA})
            events += polymarket_events(q, json.loads(text), pm_config["events_per_query"], seen)
        except Exception as e:
            errors.append(q + ": " + str(e))
    return {"events": events, "errors": errors}


# ---------- Formatting ----------

def fmt_views(n):
    if n >= 1e6:
        return re.sub(r"\.0$", "", to_fixed1(n / 1e6)) + "M"
    if n >= 1e3:
        return re.sub(r"\.0$", "", to_fixed1(n / 1e3)) + "K"
    return js_str(n)


def fmt_age(iso, now):
    h = js_round((now - date_ms(iso)) / 36e5)
    if h < 1:
        return "just now"
    if h < 24:
        return str(h) + "h ago"
    return str(h // 24) + "d " + str(h % 24) + "h ago"


def fmt_day_age(yyyymmdd, today_day):
    """upload_date is day-resolution (YYYYMMDD, approximate)."""
    def d(s):
        return datetime(int(s[0:4]), int(s[4:6]), int(s[6:8]))
    days = (d(today_day) - d(yyyymmdd)).days
    if days <= 0:
        return "today"
    if days == 1:
        return "yesterday"
    return "~" + str(days) + "d ago"


def fmt_vol(n):
    return "$" + to_fixed1(n / 1e6) + "M" if n >= 1e6 else "$" + str(js_round(n / 1e3)) + "K"


def fmt_generated(now):
    """new Date(now).toLocaleString("en-GB", {weekday, day, month: short, hour, minute}): "Mon 23 Nov, 13:05"."""
    d = datetime.fromtimestamp(now / 1000)
    return "%s %d %s, %02d:%02d" % (WEEKDAYS[d.weekday()], d.day, MONTHS[d.month - 1], d.hour, d.minute)


def day_str(ms):
    return datetime.fromtimestamp(ms / 1000).strftime("%Y%m%d")


def video_row(href, thumb, title, meta_html):
    thumb_html = ('<img class="video-thumb" src="' + esc(thumb) + '" loading="lazy" alt="">' if thumb
                  else '<div class="video-thumb thumb-ph">&#128240;</div>')
    return ('<a class="video-row" href="' + esc(href) + '" target="_blank" rel="noopener">'
            + thumb_html
            + '<div class="video-info">'
            + '<div class="video-title">' + esc(title) + "</div>"
            + '<div class="video-meta">' + meta_html + "</div>"
            + "</div>"
            + "</a>")


def idea_block_for(ideas, tab, key, rendered):
    """Render the idea block for a row if an un-rendered idea matches its key."""
    for n, idea in enumerate(ideas):
        if idea.get("tab") == tab and key in idea["match"] and n not in rendered:
            rendered.add(n)
            titles = "".join(
                "<li>" + ("<strong>" + esc(t) + "</strong> &#11088;" if i == 0 else esc(t)) + "</li>"
                for i, t in enumerate(idea["titles"]))
            return ('<div class="idea">'
                    + '<div class="idea-head">&#127916; Video idea &middot; ' + esc(idea["story"]) + "</div>"
                    + '<ol class="idea-titles">' + titles + "</ol>"
                    + "</div>")
    return ""


# ---------- The page ----------

PAGE_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Topic Radar</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f0f2f5;
      color: #1a1a1a;
    }

    header {
      background: white;
      border-bottom: 1px solid #e4e6ea;
      padding: 14px 24px;
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    header h1 { font-size: 17px; font-weight: 600; }
    .generated { font-size: 12px; color: #aaa; }

    .tabs {
      background: white;
      border-bottom: 1px solid #e4e6ea;
      padding: 0 24px;
      display: flex;
      overflow-x: auto;
    }
    .tab {
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      padding: 13px 14px;
      font-size: 13px;
      font-weight: 500;
      color: #65676b;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.15s;
    }
    .tab:hover { color: #1a1a1a; }
    .tab.active { color: #1877f2; border-bottom-color: #1877f2; }

    .badge {
      background: #e4e6ea;
      color: #65676b;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
    .tab.active .badge { background: #e7f0fd; color: #1877f2; }

    .tab-content { display: none; padding: 24px; max-width: 860px; margin: 0 auto; }
    .tab-content.active { display: block; }

    /* ---- Sections / cards ---- */
    .creator {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 14px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.07);
    }
    .creator-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .creator-name {
      font-size: 14px;
      font-weight: 700;
      color: #1a1a1a;
      text-decoration: none;
    }
    .creator-name:hover { color: #1877f2; }

    .video-row {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 8px;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
    }
    .video-row:hover { background: #f5f7fa; }
    .video-thumb {
      width: 128px;
      height: 72px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
      background: #000;
    }
    .thumb-ph {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      background: #e9ecf2;
    }
    .video-info { min-width: 0; }
    .video-title {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      margin-bottom: 3px;
    }
    .video-meta { font-size: 12px; color: #888; }

    .outlet-pill {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 8px;
      border-radius: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      background: #e7f0fd;
      color: #1877f2;
      margin-right: 4px;
    }

    /* ---- Video-idea blocks (from video-ideas.json) ---- */
    .idea {
      background: #fffbea;
      border: 1px solid #f5e6a8;
      border-radius: 10px;
      padding: 12px 14px;
      margin: 4px 8px 12px;
    }
    .idea-head {
      font-size: 12px;
      font-weight: 700;
      color: #8a6d1a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 8px;
    }
    .idea-titles { margin-left: 20px; }
    .idea-titles li {
      font-size: 13.5px;
      line-height: 1.45;
      padding: 2px 0;
      color: #333;
    }

    /* ---- Policy Radar ---- */
    .odds-card {
      display: block;
      border: 1px solid #e4e6ea;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 10px;
      text-decoration: none;
      color: inherit;
    }
    .odds-card:hover { background: #f5f7fa; }
    .odds-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
    .odds-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 13px;
      padding: 2px 0;
    }
    .odds-label { color: #555; min-width: 0; }
    .odds-pct { font-weight: 700; color: #1a7f37; white-space: nowrap; }
    .video-title.xpost { white-space: pre-wrap; font-weight: 400; }

    .no-uploads, .feed-error {
      font-size: 13px;
      color: #aaa;
      padding: 4px 8px;
    }
    .feed-error { color: #c0392b; }
  </style>
</head>
<body>
  <header>
    <h1>&#128225; Topic Radar</h1>
"""

PAGE_TAIL = """
  <script>
    document.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach(function (b) { b.classList.remove("active"); });
        document.querySelectorAll(".tab-content").forEach(function (c) { c.classList.remove("active"); });
        btn.classList.add("active");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      });
    });
  </script>
</body>
</html>
"""


def sorted_news(news_results):
    clips = [v for r in news_results for v in r["clips"]]
    return sorted(clips, key=lambda v: v["date"], reverse=True)  # reverse keeps ties in order, as JS sort


def sorted_articles(site_results):
    arts = [a for r in site_results for a in r["articles"]]
    return sorted(arts, key=lambda a: -date_ms(a["pubDate"]))


def render(now, days, cfg, creator_results, news_results, site_results, polymarket):
    """The whole dashboard page for one set of fetched results. Returns (html, counts)."""
    cutoff = now - days * 864e5
    today_day = day_str(now)
    ideas = cfg["ideas"]
    x_policy = cfg["x_policy"]
    days_s = str(days)

    total_videos = sum(len(r["videos"]) for r in creator_results)
    news_clips = sorted_news(news_results)
    articles = sorted_articles(site_results)
    rendered_ideas = set()

    creator_sections = []
    for r in creator_results:
        channel_url = "https://www.youtube.com/channel/" + r["channel_id"] + "/videos"
        if r["error"]:
            body = '<div class="feed-error">Feed failed: ' + esc(r["error"]) + "</div>"
        elif not r["videos"]:
            body = '<div class="no-uploads">No uploads in the last ' + days_s + " days</div>"
        else:
            body = "\n".join(video_row(
                "https://www.youtube.com/watch?v=" + v["videoId"], v["thumb"], v["title"],
                fmt_age(v["published"], now) + (" &middot; " + fmt_views(v["views"]) + " views" if v["views"] else ""))
                for v in r["videos"])
        creator_sections.append(
            '<section class="creator">'
            + '<div class="creator-head">'
            + '<a class="creator-name" href="' + channel_url + '" target="_blank" rel="noopener">' + esc(r["name"]) + "</a>"
            + '<span class="badge">' + str(len(r["videos"])) + "</span>"
            + "</div>"
            + body
            + "</section>")
    creator_sections = "\n".join(creator_sections)

    outlet_errors = "\n".join(
        '<div class="feed-error">' + esc(r["name"]) + " failed: " + esc(r["error"]) + "</div>"
        for r in news_results if r["error"])
    news_rows = "\n".join(
        video_row("https://www.youtube.com/watch?v=" + v["videoId"],
                  "https://i.ytimg.com/vi/" + v["videoId"] + "/mqdefault.jpg", v["title"],
                  '<span class="outlet-pill">' + esc(v["outlet"]) + "</span> " + fmt_day_age(v["date"], today_day))
        + idea_block_for(ideas, "news", v["videoId"], rendered_ideas)
        for v in news_clips)
    news_section = ('<section class="creator">'
                    + outlet_errors
                    + (news_rows if news_clips
                       else '<div class="no-uploads">No crypto clips found in the last ' + days_s + " days</div>")
                    + "</section>")

    site_errors = "\n".join(
        '<div class="feed-error">' + esc(r["name"]) + " failed: " + esc(r["error"]) + "</div>"
        for r in site_results if r["error"])
    article_rows = "\n".join(
        video_row(a["link"], a["thumb"], a["title"],
                  '<span class="outlet-pill">' + esc(a["site"]) + "</span> " + fmt_age(a["pubDate"], now))
        + idea_block_for(ideas, "articles", a["link"], rendered_ideas)
        for a in articles)
    articles_section = ('<section class="creator">'
                        + site_errors
                        + (article_rows if articles
                           else '<div class="no-uploads">No articles found in the last ' + days_s + " days</div>")
                        + "</section>")

    # ---- Policy Radar tab: Polymarket odds + cached X policy posts ----
    odds_cards = []
    for e in polymarket["events"]:
        rows = "".join(
            '<div class="odds-row">'
            + '<span class="odds-label">' + esc(m["label"]) + "</span>"
            + '<span class="odds-pct">' + ("?" if m["yesPct"] is None else js_str(m["yesPct"]) + "%")
            + " " + esc(m["outcome"]) + "</span>"
            + "</div>"
            for m in e["markets"])
        odds_cards.append(
            '<a class="odds-card" href="https://polymarket.com/event/' + esc(e["slug"]) + '" target="_blank" rel="noopener">'
            + '<div class="odds-title">' + esc(e["title"]) + "</div>"
            + rows
            + '<div class="video-meta">' + fmt_vol(e["volume"]) + ' volume &middot; matched "' + esc(e["query"]) + '"</div>'
            + "</a>")
    odds_cards = "\n".join(odds_cards)
    pm_errors = "".join('<div class="feed-error">Polymarket ' + esc(e) + "</div>" for e in polymarket["errors"])

    def in_window(p):
        ms = date_ms(p.get("timestamp"))
        return ms is not None and ms >= cutoff

    if not x_policy:
        x_section = ('<div class="no-uploads">No X data cached yet. Run <b>python fetch-x-policy.py</b> '
                     + "(needs Chrome free; uses the xbot-profile like x-reply-guy), then rebuild. Watchlist: "
                     + ", ".join("@" + esc(a["handle"]) for a in cfg["x_accounts"]) + "</div>")
    else:
        blocks = []
        for acc in x_policy["accounts"]:
            posts = [p for p in (acc.get("posts") or []) if in_window(p)]
            if acc.get("error"):
                body = '<div class="feed-error">' + esc(acc["error"]) + "</div>"
            elif posts:
                body = "".join(
                    '<a class="video-row" href="' + esc(p.get("url")) + '" target="_blank" rel="noopener">'
                    + '<div class="video-info">'
                    + '<div class="video-title xpost">' + esc(p.get("text")) + "</div>"
                    + '<div class="video-meta">' + fmt_age(p["timestamp"], now)
                    + (" &middot; " + fmt_views(p["likes"]) + " likes" if p.get("likes") else "") + "</div>"
                    + "</div>"
                    + "</a>"
                    for p in posts)
            else:
                body = '<div class="no-uploads">No posts in the last ' + days_s + " days</div>"
            blocks.append(
                '<div class="creator-head" style="margin-top:14px">'
                + '<a class="creator-name" href="https://x.com/' + esc(acc["handle"]) + '" target="_blank" rel="noopener">@'
                + esc(acc["handle"]) + "</a>"
                + '<span class="video-meta">' + esc(acc.get("note") or "") + "</span>"
                + "</div>" + body)
        x_section = ('<div class="video-meta" style="margin-bottom:10px">X posts fetched '
                     + esc(fmt_age(x_policy["fetched_at"], now))
                     + " (refresh: python fetch-x-policy.py, then rebuild)</div>"
                     + "\n".join(blocks))
    policy_section = ('<section class="creator">'
                      + '<div class="creator-head"><span class="creator-name">Polymarket odds</span></div>'
                      + pm_errors
                      + (odds_cards or '<div class="no-uploads">No active markets matched</div>')
                      + "</section>"
                      + '<section class="creator">'
                      + '<div class="creator-head"><span class="creator-name">X policy reporters</span></div>'
                      + x_section
                      + "</section>")
    policy_count = len(polymarket["events"]) + (
        sum(len([p for p in (a.get("posts") or []) if in_window(p)]) for a in x_policy["accounts"])
        if x_policy else 0)

    html = (PAGE_HEAD
            + '    <span class="generated">last ' + days_s + " days &middot; generated " + esc(fmt_generated(now))
            + " &middot; re-run build_dashboard.py to refresh</span>\n"
            + "  </header>\n"
            + "\n"
            + '  <div class="tabs">\n'
            + '    <button class="tab active" data-tab="creators">Creator Watch List <span class="badge">' + str(total_videos) + "</span></button>\n"
            + '    <button class="tab" data-tab="news">News Clips <span class="badge">' + str(len(news_clips)) + "</span></button>\n"
            + '    <button class="tab" data-tab="articles">Crypto Sites <span class="badge">' + str(len(articles)) + "</span></button>\n"
            + '    <button class="tab" data-tab="policy">Policy Radar <span class="badge">' + str(policy_count) + "</span></button>\n"
            + "  </div>\n"
            + "\n"
            + '  <div class="tab-content active" id="tab-creators">\n'
            + creator_sections + "\n"
            + "  </div>\n"
            + "\n"
            + '  <div class="tab-content" id="tab-news">\n'
            + news_section + "\n"
            + "  </div>\n"
            + "\n"
            + '  <div class="tab-content" id="tab-articles">\n'
            + articles_section + "\n"
            + "  </div>\n"
            + "\n"
            + '  <div class="tab-content" id="tab-policy">\n'
            + policy_section + "\n"
            + "  </div>\n"
            + PAGE_TAIL)
    return html, {"videos": total_videos, "news": len(news_clips), "articles": len(articles)}


# ---------- Main ----------

def parse_days(argv):
    """--days N, default 5 (a missing, zero or non-numeric value also gives 5, as the JS builder did)."""
    if "--days" in argv:
        i = argv.index("--days")
        try:
            n = float(argv[i + 1])
        except (IndexError, ValueError):
            return 5
        if not n or math.isnan(n):
            return 5
        return int(n) if n == int(n) else n
    return 5


def main():
    days = parse_days(sys.argv)
    cfg = load_config()
    now = time.time_ns() // 1_000_000
    cutoff = now - days * 864e5
    cutoff_day = day_str(cutoff)

    print("Fetching " + str(len(cfg["creators"])) + " creator feeds, " + str(len(cfg["outlets"]))
          + " outlet channels (yt-dlp, slow), " + str(len(cfg["sites"])) + " article feeds...", flush=True)
    workers = len(cfg["creators"]) + len(cfg["outlets"]) + len(cfg["sites"]) + 1
    with ThreadPoolExecutor(max_workers=workers) as pool:
        f_creators = [pool.submit(fetch_creator, c, cutoff) for c in cfg["creators"]]
        f_news = [pool.submit(fetch_outlet, o, cutoff_day) for o in cfg["outlets"]]
        f_sites = [pool.submit(fetch_site, s, cutoff) for s in cfg["sites"]]
        f_pm = pool.submit(fetch_polymarket, cfg["pm_config"])
        creator_results = [f.result() for f in f_creators]
        news_results = [f.result() for f in f_news]
        site_results = [f.result() for f in f_sites]
        polymarket = f_pm.result()

    # Machine-readable dump of the article list so curation (picking the best stories for
    # video-ideas.json) doesn't require scraping the HTML back.
    (DIR / "articles.json").write_text(
        json.dumps(sorted_articles(site_results), indent=2, ensure_ascii=False), encoding="utf-8", newline="\n")

    html, counts = render(now, days, cfg, creator_results, news_results, site_results, polymarket)
    out_path = DIR / "dashboard.html"
    out_path.write_text(html, encoding="utf-8", newline="\n")

    for r in creator_results:
        print(r["name"].ljust(18) + ("ERROR: " + r["error"] if r["error"] else str(len(r["videos"])) + " video(s)"))
    for r in news_results:
        print((r["name"] + " (news)").ljust(22)
              + ("ERROR: " + r["error"] if r["error"] else str(len(r["clips"])) + " crypto clip(s)"))
    for r in site_results:
        print((r["name"] + " (site)").ljust(22)
              + ("ERROR: " + r["error"] if r["error"] else str(len(r["articles"])) + " article(s)"))
    print("Polymarket".ljust(22) + str(len(polymarket["events"])) + " event(s)"
          + (" ERRORS: " + "; ".join(polymarket["errors"]) if polymarket["errors"] else ""))
    x_policy = cfg["x_policy"]
    print("X policy cache".ljust(22)
          + ("fetched " + x_policy["fetched_at"] if x_policy else "none (run fetch-x-policy.py)"))
    print("\nWrote " + str(out_path) + " (" + str(counts["videos"]) + " creator videos, "
          + str(counts["news"]) + " news clips, " + str(counts["articles"]) + " articles, last "
          + js_str(days) + " days)")


if __name__ == "__main__":
    main()
