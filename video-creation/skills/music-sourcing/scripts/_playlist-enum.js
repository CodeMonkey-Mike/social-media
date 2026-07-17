// _playlist-enum.js — open a private Soundstripe playlist with the authed profile,
// sniff the app API, and dump the playlist's songs (id + title + artists) to
// _recon/playlist-<id>.json. Recon helper for bulk-downloading a playlist.
//
//   node _playlist-enum.js <playlistId>
//
const fs   = require('fs');
const path = require('path');

const MUSIC_DIR = path.join(__dirname, '..');
const RECON     = path.join(MUSIC_DIR, '_recon');
const PROFILE   = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';

(async () => {
  const playlistId = process.argv[2];
  if (!playlistId) { console.error('Usage: node _playlist-enum.js <playlistId>'); process.exit(1); }
  fs.mkdirSync(RECON, { recursive: true });

  const { chromium } = require(path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media', 'schedule-tweets', 'node_modules', 'playwright'));
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 40, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = browser.pages()[0] || await browser.newPage();

  const apiHits = [];   // {url, status, json}
  let authToken = null;
  page.on('request', (req) => {
    const t = req.headers()['x-soundstripe-auth-token'];
    if (t && !authToken) authToken = t;
  });
  page.on('response', async (resp) => {
    const u = resp.url();
    if (/api\.soundstripe\.com/.test(u)) {
      let json = null; try { json = await resp.json(); } catch {}
      apiHits.push({ url: u.replace('https://api.soundstripe.com', ''), status: resp.status(), json });
    }
  });

  try {
    await page.goto('https://www.soundstripe.com/library', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.goto(`https://www.soundstripe.com/library/private_playlists/music/${playlistId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(9000);
    // scroll to force lazy-loaded songs to fetch
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(1200); }
    await page.screenshot({ path: path.join(RECON, `playlist-${playlistId}.png`), fullPage: true }).catch(() => {});
  } catch (e) {
    console.error('nav error:', e.message);
  }

  // If we captured the auth token, hit the playlist API directly with a big page size,
  // paging through JSON:API links until exhausted.
  const songs = [];
  if (authToken) {
    const LIMIT = 100;
    for (let offset = 0, guard = 0; guard < 40; offset += LIMIT, guard++) {
      const url = `https://api.soundstripe.com/app/playlists/${playlistId}/songs`
                + `?page%5Boffset%5D=${offset}&page%5Blimit%5D=${LIMIT}`;
      let j = null;
      try {
        const resp = await page.request.get(url, {
          headers: { 'x-soundstripe-auth-token': authToken, 'accept': 'application/vnd.api+json' },
        });
        j = await resp.json().catch(() => null);
      } catch (e) { console.log('page fetch err:', e.message); break; }
      if (!j) break;
      fs.writeFileSync(path.join(RECON, `playlist-api-${playlistId}-off${offset}.json`), JSON.stringify(j, null, 2));
      const data = Array.isArray(j.data) ? j.data : (j.data ? [j.data] : []);
      const included = j.included || [];
      const artistsById = {};
      for (const inc of included) if (/artist/i.test(inc.type)) artistsById[inc.id] = inc.attributes?.name;
      for (const s of data) {
        if (!/song/i.test(s.type)) continue;
        const arts = (s.relationships?.artists?.data || []).map(a => artistsById[a.id]).filter(Boolean);
        songs.push({ id: String(s.id), title: s.attributes?.title, artists: arts,
                     duration: s.attributes?.primary_audio_file_duration || s.attributes?.duration });
      }
      if (data.length < LIMIT) break; // last page
    }
  }

  // dedupe by id
  const seen = new Set(); const uniq = [];
  for (const s of songs) { if (!seen.has(s.id)) { seen.add(s.id); uniq.push(s); } }

  fs.writeFileSync(path.join(RECON, `playlist-${playlistId}.json`),
    JSON.stringify({ playlistId, authToken: authToken ? '(captured)' : null, count: uniq.length, songs: uniq }, null, 2));
  // dump all raw api hit urls so we can find the right endpoint if the guesses missed
  fs.writeFileSync(path.join(RECON, `playlist-${playlistId}-apihits.json`),
    JSON.stringify(apiHits.map(h => ({ url: h.url, status: h.status, keys: h.json ? Object.keys(h.json) : null })), null, 2));

  console.log(`auth token: ${authToken ? 'captured' : 'MISSING'}`);
  console.log(`songs found: ${uniq.length}`);
  for (const s of uniq) console.log(`  [${s.id}] ${s.title} — ${(s.artists||[]).join(', ')}`);
  console.log(`\nApi hits observed: ${apiHits.length} (see _recon/playlist-${playlistId}-apihits.json)`);

  try { await browser.close(); } catch {}
})();
