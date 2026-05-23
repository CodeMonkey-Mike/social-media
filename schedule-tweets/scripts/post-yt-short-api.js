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
const url         = require('url');
const { exec }    = require('child_process');
const fs          = require('fs');
const path        = require('path');

const SHORTS_JSON   = path.join(__dirname, '..', 'data', 'shorts.json');
const OAUTH_FILE    = path.join(__dirname, '..', 'config', 'yt-oauth.json');
const TOKEN_FILE    = path.join(__dirname, '..', 'config', 'yt-api-token.json');
const WORKSPACE     = path.join(__dirname, '..');
const PLATFORM      = 'yt_shorts';
const UPLOAD_SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

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
        scope: UPLOAD_SCOPES,
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

(async () => {
  const data = JSON.parse(fs.readFileSync(SHORTS_JSON, 'utf8'));

  // Unblock anything stuck mid-flight from a prior run
  for (const s of data.shorts) {
    if (s.platforms[PLATFORM]?.status === 'posting') s.platforms[PLATFORM].status = 'pending';
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

  const caption  = short.platforms[PLATFORM].caption_override || short.caption || '';
  const title    = (short.title || caption.split('\n')[0] || 'Short').slice(0, 100);
  const tags     = short.tags || ['kaspa', 'crypto'];
  // YT description supports newlines and basic text; #Shorts hashtag helps surface
  const description = caption.includes('#Shorts') ? caption : `${caption}\n\n#Shorts`;

  console.log(`Short: "${short.title}"`);
  console.log(`File:  ${videoPath}`);
  console.log(`Title: ${title}`);

  short.platforms[PLATFORM].status = 'posting';
  fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));

  try {
    const auth = await getAuthorizedClient();
    const result = await uploadVideo(auth, videoPath, title, description, tags);
    const videoUrl = `https://www.youtube.com/shorts/${result.id}`;
    console.log(`\nPosted ✓  ${videoUrl}`);
    short.platforms[PLATFORM].status    = 'posted';
    short.platforms[PLATFORM].posted_at = new Date().toISOString();
    short.platforms[PLATFORM].url       = videoUrl;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
  } catch (err) {
    short.platforms[PLATFORM].status = 'failed';
    short.platforms[PLATFORM].error  = err.message;
    fs.writeFileSync(SHORTS_JSON, JSON.stringify(data, null, 2));
    console.error('\nFailed:', err.message);
    process.exit(1);
  }
})();
