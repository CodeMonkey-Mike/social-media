// algolia-key.js — Soundstripe's PUBLIC search-only key, kept out of git. It's embedded in their web client, so it
// isn't a credential of ours. Reads SOUNDSTRIPE_ALGOLIA_KEY, then the gitignored ../.algolia-key file.
// On a new machine: open Soundstripe's library in a browser, and copy the X-Algolia-API-Key request header from devtools.

const fs   = require('fs');
const path = require('path');

const KEY_FILE = path.join(__dirname, '..', '.algolia-key');

module.exports = function algoliaKey() {
  const fromEnv = (process.env.SOUNDSTRIPE_ALGOLIA_KEY || '').trim();
  if (fromEnv) return fromEnv;
  let fromFile = '';
  try { fromFile = fs.readFileSync(KEY_FILE, 'utf8').trim(); } catch (e) { /* reported below */ }
  if (fromFile) return fromFile;
  throw new Error(`Soundstripe search key missing: set SOUNDSTRIPE_ALGOLIA_KEY or create ${KEY_FILE}`);
};
