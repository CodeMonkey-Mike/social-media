// Topic Radar dashboard builder.
// Tab 1 "Creator Watch List": each watchlist creator's uploads from the last
// N days, via YouTube RSS (creators.json).
// Tab 2 "News Clips": crypto-keyword-matched uploads from the Lane 2 business
// news outlets (outlets.json), via yt-dlp flat-playlist (RSS only holds 15
// entries — hours of output for these channels — so we page deeper instead).
// Tab 3 "Crypto Sites": recent articles from crypto news sites (sites.json)
// via their RSS feeds.
// video-ideas.json pins suggested video titles under matching rows (news rows
// match by videoId, article rows by link URL) so curation survives rebuilds.
// Output is a fully static dashboard.html next to this script; no server.
//
//   node video-creation/topic-radar/build-dashboard.js [--days 5]
//
// Companion doc: video-creation/TOPIC-FINDING-PLAYBOOK.md (Lanes 2 & 3).

const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const DAYS = (() => {
  const i = process.argv.indexOf("--days");
  return i > -1 ? Number(process.argv[i + 1]) || 5 : 5;
})();

// How deep to page each outlet's uploads tab. High-volume channels (Fox
// Business, CNBC) post 50+ clips/day, so 5 days needs a few hundred entries.
const NEWS_DEPTH = 400;

const CRYPTO_RE = new RegExp(
  "\\b(crypto|cryptocurrenc\\w*|bitcoin|btc|ethereum|ether|eth|stablecoin\\w*|" +
  "blockchain|coinbase|binance|kraken|xrp|ripple|solana|kaspa|dogecoin|" +
  "altcoin\\w*|digital assets?|tether|usdc|usdt|saylor|microstrategy|satoshi|" +
  "web3|tokeniz\\w*|genius act|defi|memecoin\\w*|meme coin\\w*)\\b", "i");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const DIR = __dirname;
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
const creators = readJson("creators.json");
const outlets  = readJson("outlets.json");
const sites    = readJson("sites.json");
const ideas    = fs.existsSync(path.join(DIR, "video-ideas.json")) ? readJson("video-ideas.json") : [];
const pmConfig = readJson("polymarket.json");
const xAccounts = readJson("x-accounts.json");
const xPolicy  = fs.existsSync(path.join(DIR, "x-policy.json")) ? readJson("x-policy.json") : null;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .trim();
}

// ---------- Tab 1: creators via YouTube RSS ----------

// Minimal Atom parsing — YouTube's feed shape is stable and machine-generated.
function parseFeed(xml) {
  const entries = [];
  const blocks = xml.split("<entry>").slice(1);
  for (const block of blocks) {
    const get = (re) => (block.match(re) || [])[1] || "";
    entries.push({
      videoId:   get(/<yt:videoId>(.*?)<\/yt:videoId>/),
      title:     decodeEntities(get(/<title>([\s\S]*?)<\/title>/)),
      published: get(/<published>(.*?)<\/published>/),
      thumb:     get(/<media:thumbnail url="(.*?)"/),
      views:     Number(get(/<media:statistics views="(\d+)"/)) || 0,
    });
  }
  return entries;
}

async function fetchCreators(cutoff) {
  return Promise.all(creators.map(async (c) => {
    const url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + c.channel_id;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const videos = parseFeed(await res.text())
        .filter((v) => new Date(v.published).getTime() >= cutoff)
        .sort((a, b) => new Date(b.published) - new Date(a.published));
      return { ...c, videos, error: null };
    } catch (e) {
      return { ...c, videos: [], error: e.message };
    }
  }));
}

// ---------- Tab 2: news outlets via yt-dlp ----------

function ytdlp(args) {
  return new Promise((resolve, reject) => {
    execFile("yt-dlp", args, { maxBuffer: 32 * 1024 * 1024, windowsHide: true },
      (err, stdout) => {
        // yt-dlp exits non-zero on partial failures (e.g. one hidden video);
        // keep whatever it printed as long as we got output.
        if (err && !stdout) return reject(err);
        resolve(stdout);
      });
  });
}

async function fetchNews(cutoffDay) {
  return Promise.all(outlets.map(async (o) => {
    try {
      const out = await ytdlp([
        "--no-update", "--flat-playlist",
        "--playlist-items", "1:" + NEWS_DEPTH,
        "--extractor-args", "youtubetab:approximate_date",
        "--print", "%(id)s\t%(upload_date)s\t%(title)s",
        "https://www.youtube.com/channel/" + o.channel_id + "/videos",
      ]);
      const matches = out.split(/\r?\n/).filter(Boolean).map((line) => {
        const [id, date, ...rest] = line.split("\t");
        return { videoId: id, date, title: rest.join("\t"), outlet: o.name };
      }).filter((v) => CRYPTO_RE.test(v.title));

      // YouTube intermittently omits the relative-date text, leaving
      // upload_date NA for a whole page. Resolve missing dates per video
      // (matches only, so a handful of requests). The uploads tab is
      // chronological, so once matches fall past the cutoff twice in a
      // row, everything after is older — stop.
      const clips = [];
      let older = 0;
      for (const v of matches) {
        if (!v.date || v.date === "NA") {
          v.date = (await ytdlp([
            "--no-update", "--skip-download", "--print", "%(upload_date)s",
            "https://www.youtube.com/watch?v=" + v.videoId,
          ])).trim();
        }
        if (v.date && v.date !== "NA" && v.date >= cutoffDay) {
          clips.push(v);
          older = 0;
        } else if (++older >= 2) {
          break;
        }
      }
      return { ...o, clips, error: null };
    } catch (e) {
      return { ...o, clips: [], error: e.message.split("\n")[0].slice(0, 200) };
    }
  }));
}

// ---------- Tab 3: crypto news sites via RSS ----------

function parseRssItems(xml) {
  // RSS 2.0 <item> feeds and Atom <entry> feeds (Blockworks) both come
  // through here; normalize to {title, link, pubDate, thumb}.
  const isAtom = !/<item[\s>]/.test(xml) && /<entry[\s>]/.test(xml);
  const blocks = xml.split(isAtom ? /<entry[\s>]/ : /<item[\s>]/).slice(1);
  return blocks.map((block) => {
    const get = (re) => (block.match(re) || [])[1] || "";
    return {
      title:   decodeEntities(get(/<title[^>]*>([\s\S]*?)<\/title>/)),
      link:    isAtom
        ? decodeEntities(get(/<link[^>]*href="([^"]+)"/))
        : decodeEntities(get(/<link>([\s\S]*?)<\/link>/)),
      pubDate: get(/<pubDate>([\s\S]*?)<\/pubDate>/) ||
               get(/<published>([\s\S]*?)<\/published>/) ||
               get(/<updated>([\s\S]*?)<\/updated>/),
      thumb:   get(/<media:(?:content|thumbnail)[^>]*url="([^"]+)"/) ||
               get(/<enclosure[^>]*url="([^"]+)"/),
    };
  });
}

async function fetchArticles(cutoff) {
  return Promise.all(sites.map(async (s) => {
    try {
      const res = await fetch(s.feed, { headers: { "User-Agent": UA, "Accept": "application/rss+xml,application/xml,*/*" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const articles = parseRssItems(await res.text())
        .filter((a) => a.title && a.link && a.pubDate && new Date(a.pubDate).getTime() >= cutoff)
        .map((a) => ({ ...a, site: s.name }));
      return { ...s, articles, error: null };
    } catch (e) {
      return { ...s, articles: [], error: e.message };
    }
  }));
}

// ---------- Tab 4: Polymarket odds ----------

async function fetchPolymarket() {
  const seen = new Set();
  const events = [];
  const errors = [];
  for (const q of pmConfig.queries) {
    try {
      const res = await fetch("https://gamma-api.polymarket.com/public-search?q=" + encodeURIComponent(q),
        { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      (data.events || [])
        .filter((e) => e.active && !e.closed && !e.archived)
        .sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0))
        .slice(0, pmConfig.events_per_query)
        .forEach((e) => {
          if (seen.has(e.id)) return;
          seen.add(e.id);
          const markets = (e.markets || [])
            .filter((m) => m.active && !m.closed)
            .map((m) => {
              let outcomes = [], prices = [];
              try { outcomes = JSON.parse(m.outcomes || "[]"); } catch {}
              try { prices = JSON.parse(m.outcomePrices || "[]"); } catch {}
              return {
                label: m.groupItemTitle || m.question,
                yesPct: prices.length ? Math.round(Number(prices[0]) * 100) : null,
                outcome: outcomes[0] || "Yes",
                volume: Number(m.volumeNum || m.volume) || 0,
              };
            })
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 4);
          events.push({
            query: q,
            title: e.title,
            slug: e.slug,
            volume: Number(e.volume) || 0,
            endDate: e.endDate,
            markets,
          });
        });
    } catch (e) {
      errors.push(q + ": " + e.message);
    }
  }
  return { events, errors };
}

// ---------- Formatting ----------

function fmtViews(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function fmtAge(iso, now) {
  const h = Math.round((now - new Date(iso).getTime()) / 36e5);
  if (h < 1) return "just now";
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  return d + "d " + (h % 24) + "h ago";
}

// upload_date is day-resolution (YYYYMMDD, approximate).
function fmtDayAge(yyyymmdd, todayDay) {
  const d = (dstr) => new Date(dstr.slice(0, 4) + "-" + dstr.slice(4, 6) + "-" + dstr.slice(6, 8));
  const days = Math.round((d(todayDay) - d(yyyymmdd)) / 864e5);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return "~" + days + "d ago";
}

function videoRow({ href, thumb, title, metaHtml }) {
  const thumbHtml = thumb
    ? '<img class="video-thumb" src="' + esc(thumb) + '" loading="lazy" alt="">'
    : '<div class="video-thumb thumb-ph">&#128240;</div>';
  return (
    '<a class="video-row" href="' + esc(href) + '" target="_blank" rel="noopener">' +
      thumbHtml +
      '<div class="video-info">' +
        '<div class="video-title">' + esc(title) + "</div>" +
        '<div class="video-meta">' + metaHtml + "</div>" +
      "</div>" +
    "</a>"
  );
}

// Render the idea block for a row if an un-rendered idea matches its key.
function ideaBlockFor(tab, key, rendered) {
  const idea = ideas.find((i) => i.tab === tab && i.match.includes(key) && !rendered.has(i));
  if (!idea) return "";
  rendered.add(idea);
  return (
    '<div class="idea">' +
      '<div class="idea-head">&#127916; Video idea &middot; ' + esc(idea.story) + "</div>" +
      '<ol class="idea-titles">' +
        idea.titles.map((t, n) =>
          "<li>" + (n === 0 ? "<strong>" + esc(t) + "</strong> &#11088;" : esc(t)) + "</li>"
        ).join("") +
      "</ol>" +
    "</div>"
  );
}

// ---------- Main ----------

async function main() {
  const now = Date.now();
  const cutoff = now - DAYS * 864e5;
  const dayStr = (t) => {
    const d = new Date(t);
    return d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  };
  const cutoffDay = dayStr(cutoff);
  const todayDay  = dayStr(now);

  console.log("Fetching " + creators.length + " creator feeds, " + outlets.length +
    " outlet channels (yt-dlp, slow), " + sites.length + " article feeds...");
  const [creatorResults, newsResults, siteResults, polymarket] = await Promise.all([
    fetchCreators(cutoff),
    fetchNews(cutoffDay),
    fetchArticles(cutoff),
    fetchPolymarket(),
  ]);

  const totalVideos = creatorResults.reduce((n, r) => n + r.videos.length, 0);
  const newsClips = newsResults.flatMap((r) => r.clips)
    .sort((a, b) => b.date.localeCompare(a.date));
  const articles = siteResults.flatMap((r) => r.articles)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const generatedAt = new Date(now).toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  // Machine-readable dump of the article list so curation (picking the best
  // stories for video-ideas.json) doesn't require scraping the HTML back.
  fs.writeFileSync(path.join(DIR, "articles.json"),
    JSON.stringify(articles, null, 2), "utf8");

  const renderedIdeas = new Set();

  const creatorSections = creatorResults.map((r) => {
    const channelUrl = "https://www.youtube.com/channel/" + r.channel_id + "/videos";
    let body;
    if (r.error) {
      body = '<div class="feed-error">Feed failed: ' + esc(r.error) + "</div>";
    } else if (!r.videos.length) {
      body = '<div class="no-uploads">No uploads in the last ' + DAYS + " days</div>";
    } else {
      body = r.videos.map((v) => videoRow({
        href: "https://www.youtube.com/watch?v=" + v.videoId,
        thumb: v.thumb,
        title: v.title,
        metaHtml: fmtAge(v.published, now) + (v.views ? " &middot; " + fmtViews(v.views) + " views" : ""),
      })).join("\n");
    }
    return (
      '<section class="creator">' +
        '<div class="creator-head">' +
          '<a class="creator-name" href="' + channelUrl + '" target="_blank" rel="noopener">' + esc(r.name) + "</a>" +
          '<span class="badge">' + r.videos.length + "</span>" +
        "</div>" +
      body +
      "</section>"
    );
  }).join("\n");

  const outletErrors = newsResults.filter((r) => r.error).map((r) =>
    '<div class="feed-error">' + esc(r.name) + " failed: " + esc(r.error) + "</div>"
  ).join("\n");
  const newsRows = newsClips.map((v) =>
    videoRow({
      href: "https://www.youtube.com/watch?v=" + v.videoId,
      thumb: "https://i.ytimg.com/vi/" + v.videoId + "/mqdefault.jpg",
      title: v.title,
      metaHtml: '<span class="outlet-pill">' + esc(v.outlet) + "</span> " + fmtDayAge(v.date, todayDay),
    }) + ideaBlockFor("news", v.videoId, renderedIdeas)
  ).join("\n");
  const newsSection =
    '<section class="creator">' +
      outletErrors +
      (newsClips.length
        ? newsRows
        : '<div class="no-uploads">No crypto clips found in the last ' + DAYS + " days</div>") +
    "</section>";

  const siteErrors = siteResults.filter((r) => r.error).map((r) =>
    '<div class="feed-error">' + esc(r.name) + " failed: " + esc(r.error) + "</div>"
  ).join("\n");
  const articleRows = articles.map((a) =>
    videoRow({
      href: a.link,
      thumb: a.thumb,
      title: a.title,
      metaHtml: '<span class="outlet-pill">' + esc(a.site) + "</span> " + fmtAge(a.pubDate, now),
    }) + ideaBlockFor("articles", a.link, renderedIdeas)
  ).join("\n");
  const articlesSection =
    '<section class="creator">' +
      siteErrors +
      (articles.length
        ? articleRows
        : '<div class="no-uploads">No articles found in the last ' + DAYS + " days</div>") +
    "</section>";

  // ---- Policy Radar tab: Polymarket odds + cached X policy posts ----
  const fmtVol = (n) => n >= 1e6 ? "$" + (n / 1e6).toFixed(1) + "M" : "$" + Math.round(n / 1e3) + "K";
  const oddsCards = polymarket.events.map((e) => {
    const rows = e.markets.map((m) =>
      '<div class="odds-row">' +
        '<span class="odds-label">' + esc(m.label) + "</span>" +
        '<span class="odds-pct">' + (m.yesPct === null ? "?" : m.yesPct + "%") + " " + esc(m.outcome) + "</span>" +
      "</div>"
    ).join("");
    return (
      '<a class="odds-card" href="https://polymarket.com/event/' + esc(e.slug) + '" target="_blank" rel="noopener">' +
        '<div class="odds-title">' + esc(e.title) + "</div>" +
        rows +
        '<div class="video-meta">' + fmtVol(e.volume) + ' volume &middot; matched "' + esc(e.query) + '"</div>' +
      "</a>"
    );
  }).join("\n");
  const pmErrors = polymarket.errors.map((e) => '<div class="feed-error">Polymarket ' + esc(e) + "</div>").join("");

  let xSection;
  if (!xPolicy) {
    xSection =
      '<div class="no-uploads">No X data cached yet. Run <b>python fetch-x-policy.py</b> ' +
      "(needs Chrome free; uses the xbot-profile like x-reply-guy), then rebuild. Watchlist: " +
      xAccounts.map((a) => "@" + esc(a.handle)).join(", ") + "</div>";
  } else {
    const fetchedAge = fmtAge(xPolicy.fetched_at, now);
    xSection =
      '<div class="video-meta" style="margin-bottom:10px">X posts fetched ' + esc(fetchedAge) +
      " (refresh: python fetch-x-policy.py, then rebuild)</div>" +
      xPolicy.accounts.map((acc) => {
        const posts = (acc.posts || []).filter((p) => new Date(p.timestamp).getTime() >= cutoff);
        const body = acc.error
          ? '<div class="feed-error">' + esc(acc.error) + "</div>"
          : posts.length
            ? posts.map((p) =>
                '<a class="video-row" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
                  '<div class="video-info">' +
                    '<div class="video-title xpost">' + esc(p.text) + "</div>" +
                    '<div class="video-meta">' + fmtAge(p.timestamp, now) +
                      (p.likes ? " &middot; " + fmtViews(p.likes) + " likes" : "") + "</div>" +
                  "</div>" +
                "</a>"
              ).join("")
            : '<div class="no-uploads">No posts in the last ' + DAYS + " days</div>";
        return (
          '<div class="creator-head" style="margin-top:14px">' +
            '<a class="creator-name" href="https://x.com/' + esc(acc.handle) + '" target="_blank" rel="noopener">@' + esc(acc.handle) + "</a>" +
            '<span class="video-meta">' + esc(acc.note || "") + "</span>" +
          "</div>" + body
        );
      }).join("\n");
  }
  const policySection =
    '<section class="creator">' +
      '<div class="creator-head"><span class="creator-name">Polymarket odds</span></div>' +
      pmErrors +
      (oddsCards || '<div class="no-uploads">No active markets matched</div>') +
    "</section>" +
    '<section class="creator">' +
      '<div class="creator-head"><span class="creator-name">X policy reporters</span></div>' +
      xSection +
    "</section>";
  const policyCount = polymarket.events.length +
    (xPolicy ? xPolicy.accounts.reduce((n, a) => n + (a.posts || []).filter((p) => new Date(p.timestamp).getTime() >= cutoff).length, 0) : 0);

  const html = `<!DOCTYPE html>
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
    <span class="generated">last ${DAYS} days &middot; generated ${esc(generatedAt)} &middot; re-run build-dashboard.js to refresh</span>
  </header>

  <div class="tabs">
    <button class="tab active" data-tab="creators">Creator Watch List <span class="badge">${totalVideos}</span></button>
    <button class="tab" data-tab="news">News Clips <span class="badge">${newsClips.length}</span></button>
    <button class="tab" data-tab="articles">Crypto Sites <span class="badge">${articles.length}</span></button>
    <button class="tab" data-tab="policy">Policy Radar <span class="badge">${policyCount}</span></button>
  </div>

  <div class="tab-content active" id="tab-creators">
${creatorSections}
  </div>

  <div class="tab-content" id="tab-news">
${newsSection}
  </div>

  <div class="tab-content" id="tab-articles">
${articlesSection}
  </div>

  <div class="tab-content" id="tab-policy">
${policySection}
  </div>

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
`;

  const outPath = path.join(DIR, "dashboard.html");
  fs.writeFileSync(outPath, html, "utf8");

  for (const r of creatorResults) {
    console.log(r.name.padEnd(18) + (r.error ? "ERROR: " + r.error : r.videos.length + " video(s)"));
  }
  for (const r of newsResults) {
    console.log((r.name + " (news)").padEnd(22) + (r.error ? "ERROR: " + r.error : r.clips.length + " crypto clip(s)"));
  }
  for (const r of siteResults) {
    console.log((r.name + " (site)").padEnd(22) + (r.error ? "ERROR: " + r.error : r.articles.length + " article(s)"));
  }
  console.log("Polymarket".padEnd(22) + polymarket.events.length + " event(s)" +
    (polymarket.errors.length ? " ERRORS: " + polymarket.errors.join("; ") : ""));
  console.log("X policy cache".padEnd(22) + (xPolicy ? "fetched " + xPolicy.fetched_at : "none (run fetch-x-policy.py)"));
  console.log("\nWrote " + outPath + " (" + totalVideos + " creator videos, " +
    newsClips.length + " news clips, " + articles.length + " articles, last " + DAYS + " days)");
}

main().catch((e) => { console.error(e); process.exit(1); });
