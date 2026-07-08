#!/usr/bin/env node
/**
 * yt-reauth.js — Re-authorize + validate the YouTube Data API OAuth token.
 *
 * Why this exists: the test-mode OAuth token (config/yt-api-token.json) expires
 * ~weekly → `post-yt-short-api.js` fails with `invalid_grant`. There is NO
 * browser fallback for YT shorts (root CLAUDE.md), so the ONLY fix is re-auth.
 * This helper does JUST the consent + validation — it never uploads anything.
 *
 * Flow:
 *   1. Back up any existing token to config/yt-api-token.<ts>.bak
 *   2. Open the Google consent URL (auto-opens in the browser), wait for the
 *      localhost redirect, exchange the code for a refresh token, save it.
 *   3. Validate: mint a fresh access token from the refresh token (a refresh
 *      call — the exact thing that was failing). Success = auth is good.
 *
 * Usage:  node scripts/yt-reauth.js
 * (Complete the Google login/consent in the browser tab that opens.)
 */

const { google } = require('googleapis');
const http  = require('http');
const url   = require('url');
const { exec } = require('child_process');
const fs    = require('fs');
const path  = require('path');

const OAUTH_FILE    = path.join(__dirname, '..', 'config', 'yt-oauth.json');
const TOKEN_FILE    = path.join(__dirname, '..', 'config', 'yt-api-token.json');
const UPLOAD_SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

function loadOauthClient() {
  if (!fs.existsSync(OAUTH_FILE)) {
    console.error(`OAuth credentials not found at ${OAUTH_FILE}.`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(OAUTH_FILE, 'utf8'));
  const creds = raw.installed || raw.web || raw;
  if (!creds.client_id || !creds.client_secret) {
    console.error('OAuth JSON missing client_id/client_secret');
    process.exit(1);
  }
  return creds;
}

function backupExistingToken() {
  if (!fs.existsSync(TOKEN_FILE)) return null;
  // Stamp the backup using the file's own mtime (Date.now is fine in a plain CLI).
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const bak = `${TOKEN_FILE}.${stamp}.bak`;
  fs.copyFileSync(TOKEN_FILE, bak);
  return bak;
}

function consentAndSave(client_id, client_secret) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = url.parse(req.url, true);
      if (u.pathname !== '/oauth2callback') { res.writeHead(404); res.end(); return; }
      const code = u.query.code, err = u.query.error;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(err
        ? `<h2>Auth failed: ${err}</h2><p>You can close this tab.</p>`
        : `<h2>Authorized &#10003;</h2><p>You can close this tab and return to the terminal.</p>`);
      server.close();
      if (err) return reject(new Error(err));
      client.getToken(code, (terr, tokens) => {
        if (terr) return reject(terr);
        if (!tokens.refresh_token) {
          return reject(new Error('No refresh_token returned — revoke prior access at https://myaccount.google.com/permissions and re-run'));
        }
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
        console.log(`\nRefresh token saved → ${TOKEN_FILE}`);
        resolve(tokens);
      });
    });
    let client;
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
      client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
      const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',           // force a fresh refresh_token even on re-auth
        scope: UPLOAD_SCOPES,
      });
      console.log('\nOpen this URL in your browser to authorize (it should auto-open):');
      console.log(`  ${authUrl}\n`);
      exec(`start "" "${authUrl}"`, () => {});
      console.log('Waiting for the browser redirect on '
        + `http://127.0.0.1:${port}/oauth2callback ...`);
    });
  });
}

async function validate(client_id, client_secret) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  const client = new google.auth.OAuth2(client_id, client_secret);
  client.setCredentials(tokens);
  // Force a refresh — this is exactly what was throwing invalid_grant.
  const at = await client.getAccessToken();
  if (!at || !at.token) throw new Error('Refresh returned no access token');
  console.log('Validation ✓ — refresh token mints an access token (no invalid_grant).');
}

(async () => {
  const { client_id, client_secret } = loadOauthClient();
  const bak = backupExistingToken();
  if (bak) console.log(`Backed up old token → ${path.basename(bak)}`);
  console.log('Starting YouTube OAuth re-consent (this will NOT upload anything)...');
  await consentAndSave(client_id, client_secret);
  await validate(client_id, client_secret);
  console.log('\nDone. YouTube API auth is valid. Next post-yt-short-api.js run will work.');
  process.exit(0);
})().catch(err => {
  console.error(`\nRe-auth FAILED: ${err.message}`);
  process.exit(1);
});
