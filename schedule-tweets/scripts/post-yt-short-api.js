// post-yt-short-api.js — uploads one pending vertical short to YouTube via the
// Data API v3, bypassing the web UI entirely. Vertical 9:16 videos ≤60s become
// Shorts automatically.
//
// Quota: video upload costs 1600 units; default daily quota is 10,000 → ~6
// uploads/day. Plenty for current cadence.
//
// First run does an interactive OAuth consent (opens browser, captures code via
// localhost redirect). Refresh token is saved to config/yt-api-token.json and
// reused silently on every subsequent run.

const { google }  = require('googleapis');
const http        = require('http');
const https       = require('https');
const url         = require('url');
const { exec }    = require('child_process');
const fs          = require('fs');
const path        = require('path');
const { stripHashtags, buildCaption } = require('./lib/strip-hashtags');

const SHORTS_JSON   = path.join(__dirname, '..', 'data', 'shorts.json');
const OAUTH_FILE    = path.join(__dirname, '..', 'config', 'yt-oauth.json');
const TOKEN_FILE    = path.join(__dirname, '..', 'config', 'yt-api-token.json');
const CHANNEL_FILE  = path.join(__dirname, '..', 'config', 'yt-channel.json');
const WORKSPACE     = path.join(__dirname, '..');
const PLATFORM      = 'yt_shorts';
const CHECK_ONLY    = process.argv.includes('--check-only');
const UPLOAD_SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
// youtube.readonly lets the pre-upload duplicate check use the Data API (playlistItems.list on the
// channel's uploads playlist, 1 quota unit) instead of depending on YouTube's flaky public RSS feed.
// Existing upload-only tokens keep working: the API check just reports "insufficient scope" and the
// public fallbacks take over until Mike re-consents once via scripts/yt-reauth.js.
const READ_SCOPES   = ['https://www.googleapis.com/auth/youtube.readonly'];
const AUTH_SCOPES   = [...UPLOAD_SCOPES, ...READ_SCOPES];
const BROWSER_UA    = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function loadOauthClient() {
  if (!fs.existsSync(OAUTH_FILE)) {
    console.error(`OAuth credentials not found at ${OAUTH_FILE}.`);
    console.error('Download the JSON from Google Cloud Console → Credentials → your OAuth client.');
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(OAUTH_FILE, 'utf8'));
  // Google's JSON wraps creds under "installed" (Desktop) or "web"
  const creds = raw.installed || raw.web || raw;
  const { client_id, client_secret, redirect_uris } = creds;
  if (!client_id || !client_secret) {
    console.error('OAuth JSON missing client_id/client_secret');
    process.exit(1);
  }
  // For Desktop client, we open a local server on a free port and use that as
  // the redirect URI. The localhost URI is pre-allowed for Desktop clients.
  return { client_id, client_secret, redirect_uris };
}

// One-time consent: open browser, capture code from localhost redirect, exchange
// for a refresh token, write to TOKEN_FILE.
async function doInitialAuth(oauth2Client) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = url.parse(req.url, true);
      if (u.pathname !== '/oauth2callback') {
        res.writeHead(404); res.end(); return;
      }
      const code = u.query.code;
      const err  = u.query.error;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(err
        ? `<h2>Auth failed: ${err}</h2><p>You can close this tab.</p>`
        : `<h2>Authorized ✓</h2><p>You can close this tab.</p>`);
      server.close();
      if (err) return reject(new Error(err));
      oauth2Client.getToken(code, (terr, tokens) => {
        if (terr) return reject(terr);
        if (!tokens.refresh_token) {
          return reject(new Error('No refresh_token returned — revoke prior access at https://myaccount.google.com/permissions and re-run'));
        }
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
        console.log(`Refresh token saved → ${TOKEN_FILE}`);
        resolve(tokens);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
      oauth2Client.redirectUri = redirectUri;
      oauth2Client._opts = oauth2Client._opts || {};
      oauth2Client._opts.redirectUri = redirectUri;
      oauth2Client.redirect_uri = redirectUri;
      oauth2Client.redirectUri_ = redirectUri;
      // The googleapis client uses redirectUri via constructor; rebuild it
      const fixed = new google.auth.OAuth2(oauth2Client._clientId, oauth2Client._clientSecret, redirectUri);
      const authUrl = fixed.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',  // forces refresh_token even on re-auth
        scope: AUTH_SCOPES,
      });
      console.log('\nOpen this URL in your browser to authorize (will auto-redirect back):');
      console.log(`  ${authUrl}\n`);
      // Try to auto-open on Windows
      exec(`start "" "${authUrl}"`, () => {});
      // Re-bind the original oauth2Client to the same redirectUri so getToken matches
      oauth2Client._clientOptions = { redirectUri };
      oauth2Client._opts = { redirectUri };
      // Swap to the fixed client for getToken
      Object.assign(oauth2Client, fixed);
    });
  });
}

async function getAuthorizedClient() {
  const { client_id, client_secret } = loadOauthClient();
  // Initialize without redirect for now — will be set during doInitialAuth if needed
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret);

  if (fs.existsSync(TOKEN_FILE)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    oauth2Client.setCredentials(tokens);
    // googleapis auto-refreshes the access token when expired. We just need the refresh_token.
    console.log(`Reusing saved refresh token (${path.basename(TOKEN_FILE)})`);
    return oauth2Client;
  }

  console.log('No saved token — running initial OAuth consent.');
  await doInitialAuth(oauth2Client);
  // Load the freshly-saved tokens onto the client so the upload has credentials.
  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

// Derive the authenticated user's channelId. Reads from a cached config file.
// (The OAuth token's youtube.upload scope is too narrow for videos.list /
// channels.list, so we don't try to look it up at runtime — provision the
// channelId once via config/yt-channel.json.)
function getChannelId() {
  if (!fs.existsSync(CHANNEL_FILE)) {
    throw new Error(`Missing ${CHANNEL_FILE}. Create it with {"channelId":"UC..."} — fetch your channel id from https://www.youtube.com/<handle> page source.`);
  }
  const cached = JSON.parse(fs.readFileSync(CHANNEL_FILE, 'utf8'));
  if (!cached.channelId) throw new Error(`${CHANNEL_FILE} missing channelId field`);
  return cached.channelId;
}

function fetchUrl(u, ua = BROWSER_UA) {
  return new Promise((resolve, reject) => {
    https.get(u, { headers: { 'User-Agent': ua, 'Accept-Language': 'en-US,en;q=0.9' } }, res => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode} from ${u}`)); }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm  = s => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
const XML_ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const unescapeXml = s => (s || '').replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
               : XML_ENT[e.toLowerCase()]);
const hit   = (videoId, title, publishedAt, source) =>
  ({ videoId, url: `https://www.youtube.com/shorts/${videoId}`, title, publishedAt, source });

// ---- Pre-upload duplicate check -------------------------------------------------------------
// Purpose: catch a recent re-upload of the same short (a prior run that uploaded but died before
// flipping the row to 'posted'). Three independent sources, tried in order; the first one that
// ANSWERS (match or clean "no match") wins. Only if EVERY source is unavailable do we refuse to
// upload. Added 2026-09-11 after YouTube's public RSS feed 404/500'd for ~3 hours and blocked
// three shorts that had already gone out to the other six platforms.

// Source 1 — authenticated Data API. The uploads playlist id is the channel id with UC -> UU
// (documented YouTube convention), so no channels.list round-trip. Costs 1 quota unit. Needs the
// youtube.readonly scope on the token; an upload-only token gets a 403 and we fall through.
async function findViaDataApi(auth, channelId, target) {
  const youtube = google.youtube({ version: 'v3', auth });
  const playlistId = 'UU' + channelId.slice(2);
  let res;
  try {
    res = await youtube.playlistItems.list({ part: ['snippet'], playlistId, maxResults: 50 });
  } catch (err) {
    const reason = err?.errors?.[0]?.reason || '';
    if (err.code === 403 || /insufficient/i.test(reason + err.message)) {
      throw new Error('token lacks youtube.readonly (run `node scripts/yt-reauth.js` once to enable the authenticated check)');
    }
    throw err;
  }
  for (const it of res.data.items || []) {
    const sn = it.snippet || {};
    if (norm(sn.title) !== target) continue;
    const videoId = sn.resourceId?.videoId;
    if (videoId) return hit(videoId, sn.title, sn.publishedAt, 'data-api');
  }
  return null;
}

// Source 2 — the channel's public RSS feed (last ~15 uploads, no auth). It transient-404s and can
// stay down for a stretch, so retry with backoff (3+6+12+24 s ≈ 45 s worst case) before giving up.
async function findViaRss(channelId, target, attempts = 5, baseDelayMs = 3000) {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const xml = await fetchUrl(rssUrl);
      const entries = xml.split('<entry>').slice(1).map(e => e.split('</entry>')[0]);
      for (const entry of entries) {
        const title = unescapeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').trim();
        if (norm(title) !== target) continue;
        const videoId = entry.match(/<yt:videoId>([\w-]+)<\/yt:videoId>/)?.[1];
        const publishedAt = entry.match(/<published>([\w\-:.+]+)<\/published>/)?.[1];
        if (videoId) return hit(videoId, title, publishedAt, 'rss');
      }
      return null;
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        const wait = baseDelayMs * 2 ** i;
        console.log(`    RSS attempt ${i + 1}/${attempts} failed (${err.message}); retrying in ${wait / 1000}s`);
        await sleep(wait);
      }
    }
  }
  throw lastErr;
}

// Source 3 — the public channel page (/shorts, then /videos), parsing the embedded ytInitialData
// JSON (parsed, not regexed, so escaped apostrophes/quotes in titles are handled). If a page parses
// but yields ZERO items the layout has changed and we treat that as unavailable, never as "no match".
function walkInitialData(obj, out) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { for (const v of obj) walkInitialData(v, out); return; }
  const lockup = obj.shortsLockupViewModel;
  if (lockup) {
    const title = lockup.overlayMetadata?.primaryText?.content;
    const videoId = lockup.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId
      || lockup.inlinePlayerData?.onVisible?.innertubeCommand?.reelWatchEndpoint?.videoId;
    if (title && videoId) out.push({ title, videoId });
  }
  const vr = obj.videoRenderer || obj.reelItemRenderer;
  if (vr?.videoId) {
    const title = vr.title?.runs?.[0]?.text || vr.headline?.simpleText || vr.title?.simpleText;
    if (title) out.push({ title, videoId: vr.videoId });
  }
  for (const k of Object.keys(obj)) {
    if (k === 'shortsLockupViewModel' || k === 'videoRenderer' || k === 'reelItemRenderer') continue;
    walkInitialData(obj[k], out);
  }
}
async function findViaChannelPage(channelId, target) {
  const failures = [];
  for (const tab of ['shorts', 'videos']) {
    const pageUrl = `https://www.youtube.com/channel/${channelId}/${tab}`;
    try {
      const html = await fetchUrl(pageUrl);
      const m = html.match(/ytInitialData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
      if (!m) throw new Error('ytInitialData not found in page');
      const items = [];
      walkInitialData(JSON.parse(m[1]), items);
      if (!items.length) throw new Error('page parsed but yielded 0 videos (layout changed?)');
      for (const it of items) {
        if (norm(it.title) === target) return hit(it.videoId, it.title, null, `channel-page/${tab}`);
      }
      return null;
    } catch (err) {
      failures.push(`${tab}: ${err.message}`);
    }
  }
  throw new Error(failures.join(' | '));
}

// Returns {videoId,url,title,publishedAt,source} or null. Throws only when every source failed.
async function findExistingUpload(auth, channelId, targetTitle) {
  const target = norm(targetTitle.slice(0, 100));
  const sources = [
    ['Data API (authenticated)', () => findViaDataApi(auth, channelId, target)],
    ['public RSS feed',          () => findViaRss(channelId, target)],
    ['public channel page',      () => findViaChannelPage(channelId, target)],
  ];
  const failures = [];
  for (const [name, fn] of sources) {
    try {
      const found = await fn();
      console.log(`  dedup via ${name}: ${found ? `MATCH ${found.url}` : 'no match'}`);
      return found;
    } catch (err) {
      failures.push(`${name}: ${err.message}`);
      console.log(`  dedup via ${name} unavailable: ${String(err.message).split('\n')[0]}`);
    }
  }
  throw new Error('every duplicate-check source failed:\n  ' + failures.join('\n  '));
}

async function uploadVideo(auth, videoPath, title, description, tags) {
  const youtube = google.youtube({ version: 'v3', auth });
  console.log(`Uploading ${path.basename(videoPath)} (${(fs.statSync(videoPath).size / 1024 / 1024).toFixed(2)} MB)...`);
  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: title.slice(0, 100),  // YT title limit is 100 chars
        description,
        tags: tags.slice(0, 10),     // sane cap; full limit is 500 chars total
        categoryId: '22',            // People & Blogs
      },
      status: {
        privacyStatus: 'public',
        madeForKids: false,
      },
    },
    media: { body: fs.createReadStream(videoPath) },
  }, {
    // No timeout for upload — let it run
    onUploadProgress: evt => {
      const mb = (evt.bytesRead / 1024 / 1024).toFixed(1);
      process.stdout.write(`\r  uploaded ${mb} MB`);
    },
  });
  process.stdout.write('\n');
  return res.data;  // { id, snippet: {...}, ... }
}

module.exports = { findViaDataApi, findViaRss, findViaChannelPage, findExistingUpload, getAuthorizedClient, getChannelId, norm };

if (require.main === module) (async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  // Bail if anything is stuck in 'posting' — those need manual review. The
  // previous auto-reset behavior caused duplicate uploads when a prior run
  // succeeded on the platform but died before flipping the JSON to 'posted'.
  const stuck = data.shorts.filter(s => s.platforms[PLATFORM]?.status === 'posting');
  if (stuck.length > 0) {
    console.error(`${stuck.length} short(s) stuck in 'posting' — manual review required:`);
    for (const s of stuck) console.error(`  - ${s.id}: ${s.title}`);
    console.error(`Check YouTube to see if any actually published, then update data/shorts.json before retrying.`);
    process.exit(2);
  }

  const short = data.shorts.find(s => s.platforms[PLATFORM]?.status === 'pending');
  if (!short) {
    console.log('No pending YT shorts. Exiting.');
    process.exit(0);
  }

  const videoPath = path.join(WORKSPACE, short.video_path);
  if (!fs.existsSync(videoPath)) {
    console.error(`Video not found: ${videoPath}`);
    process.exit(1);
  }

  const caption  = buildCaption(short.platforms[PLATFORM].caption_override || short.caption || '', short.tags, PLATFORM);
  const title    = (short.title || caption.split('\n')[0] || 'Short').slice(0, 100);
  const tags     = short.tags || ['kaspa', 'crypto'];
  // If this short teases a related long-form video, link it in the description.
  // (The native YouTube Studio "Related video" field for a Short is NOT settable via
  //  the Data API v3, so the description link is the API-supported equivalent; set the
  //  Studio "Related video" manually if you also want the on-Short chip.)
  let description = caption;
  if (short.related_longform_url) {
    description += `\n\nWatch the full video: ${short.related_longform_url}`;
  }
  // YT description supports newlines and basic text; #Shorts hashtag helps surface
  description = description.includes('#Shorts') ? description : `${description}\n\n#Shorts`;

  console.log(`Short: "${short.title}"`);
  console.log(`File:  ${videoPath}`);
  console.log(`Title: ${title}`);

  // Pre-upload duplicate check against the channel's recent uploads (Data API, then public RSS
  // with retries, then the public channel page). If a matching title already exists, mark posted
  // with the discovered URL and skip the upload entirely.
  console.log('Checking channel for an existing copy...');
  let channelId;
  try {
    channelId = getChannelId();
  } catch (err) {
    console.error(`channelId lookup failed: ${err.message}`);
    process.exit(1);
  }
  const auth = await getAuthorizedClient();
  let existing = null;
  try {
    existing = await findExistingUpload(auth, channelId, title);
  } catch (err) {
    console.error(`Duplicate check failed: ${err.message}`);
    console.error('Refusing to upload without a working duplicate check (every source was unavailable). Retry later.');
    process.exit(1);
  }

  // --check-only: exercise the duplicate check for the next pending short and stop. Writes nothing,
  // uploads nothing. Use it to confirm the check is healthy before a posting run.
  if (CHECK_ONLY) {
    console.log(existing ? `CHECK-ONLY: already on YouTube (${existing.source}) ${existing.url}`
                         : 'CHECK-ONLY: not on YouTube; a real run would upload. Nothing written.');
    process.exit(0);
  }

  if (existing) {
    console.log(`Already on YouTube: ${existing.url}`);
    console.log(`  Matched title: "${existing.title}" (via ${existing.source})`);
    console.log(`  Published:     ${existing.publishedAt}`);
    short.platforms[PLATFORM].status    = 'posted';
    short.platforms[PLATFORM].posted_at = existing.publishedAt;
    short.platforms[PLATFORM].url       = existing.url;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.log('Marked as posted with real URL. Skipping upload.');
    process.exit(0);
  }
  console.log('  No matching title in recent uploads — proceeding with upload.');

  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  try {
    const result = await uploadVideo(auth, videoPath, title, description, tags);
    const videoUrl = `https://www.youtube.com/shorts/${result.id}`;
    console.log(`\nPosted ✓  ${videoUrl}`);
    short.platforms[PLATFORM].status    = 'posted';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = videoUrl;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    // Teaser shorts: the on-Short "Related video" chip is NOT settable via the YouTube Data API v3
    // (only the description link is, which we already appended). Flag the one manual Studio step so
    // it is never forgotten. See PUBLISH-SHORTS.md "Related long-form link".
    if (short.related_longform_url) {
      console.log('\n⚠ MANUAL STEP REQUIRED (YouTube Studio):');
      console.log(`   Set the "Related video" on this Short to the long-form. The API cannot do this.`);
      console.log(`   Short:     ${videoUrl}`);
      console.log(`   Long-form: ${short.related_longform_url}`);
      console.log('   YT Studio -> Content -> Shorts -> this Short -> Related video -> pick the long-form.');
    }
  } catch (err) {
    short.platforms[PLATFORM].status = 'failed';
    short.platforms[PLATFORM].error  = err.message;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.error('\nFailed:', err.message);
    process.exit(1);
  }
})();
