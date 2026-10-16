// soundstripe.js — search Soundstripe (Algolia) and download tracks with their
// YouTube/Content-ID license code, for use as background music in video-creation.
//
//   node soundstripe.js search "<query>" [--limit 24] [--all-partners]
//   node soundstripe.js download <objectID> [--query "<locate text>"] [--dest <dir>]
//
// search  -> writes _recon/.. no; writes <music>/candidates.json + <music>/board.html
//            (a self-contained audition board with <audio> preview players). No auth.
// download-> drives the logged-in soundstripe-profile Chrome, clicks the track's
//            download button, saves the mp3, captures the content-id license code,
//            and upserts <music>/library.json.
//
// Algolia creds are the PUBLIC search-only key embedded in Soundstripe's web client.

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const MUSIC_DIR = path.join(__dirname, '..');
const LIBRARY   = path.join(MUSIC_DIR, 'library.json');
const CANDID    = path.join(MUSIC_DIR, 'candidates.json');
const BOARD     = path.join(MUSIC_DIR, 'board.html');
const DEFAULT_DEST = path.join(MUSIC_DIR, 'downloads');

const ALGOLIA = {
  app:   'W1S5J3A2XP',
  key:   'REDACTED_SOUNDSTRIPE_SEARCH_KEY',
  index: 'prod_songs_all_partners_most_recent',
};

const PROFILE = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\soundstripe-profile';
// Soundstripe's login cookie (_soundstripe_session) became a SESSION cookie (no expiry) in 2026-10,
// so Chrome drops it every time the automated browser closes and the next run is logged out.
// `login` saves the cookies once (after Mike signs in); every browser run re-injects them.
const SESSION = path.join(MUSIC_DIR, '_recon', 'session-cookies.json');

// ── helpers ──────────────────────────────────────────────────────────────────
async function injectSession(ctx) {
  if (!fs.existsSync(SESSION)) { console.log('  (no saved session; run `node soundstripe.js login` if the run turns out logged out)'); return false; }
  try { const ck = JSON.parse(fs.readFileSync(SESSION, 'utf8')); await ctx.addCookies(ck); return true; }
  catch (e) { console.log('  session inject failed:', e.message); return false; }
}
async function saveSession(ctx) {
  try { const ck = await ctx.cookies(); fs.mkdirSync(path.dirname(SESSION), { recursive: true }); fs.writeFileSync(SESSION, JSON.stringify(ck)); }
  catch (e) { console.log('  session save failed:', e.message); }
}
// Is the page rendered for a signed-in member? (every download control carries this flag)
async function signedIn(page) {
  return page.evaluate(() => {
    const el = document.querySelector('[data-download-handoff-signed-in-value]');
    return el ? el.getAttribute('data-download-handoff-signed-in-value') === 'true' : null;
  }).catch(() => null);
}
// The song page's download control for THIS objectID (markup changed 2026-10: the controls are
// <a data-controller="download-handoff"> anchors; the old button[data-testid="song-license-btn"] is gone).
function downloadControl(page, objectID) {
  return page.locator([
    `a[data-song-detail-row-action="download"][data-download-handoff-media-id-value="${objectID}"]`,
    `a[data-song-detail-action="download"][data-download-handoff-media-id-value="${objectID}"]`,
    'button[data-testid="song-license-btn"]',
  ].join(', ')).first();
}
// A Download-Song modal row ("Full Track" / "Alternate Versions" / "Stems"): the heading text's nearest
// ancestor that contains a WAV button. Markup-agnostic (the rows stopped being <li> in 2026-10).
function modalRow(page, heading) {
  return page.getByText(heading, { exact: true }).first()
    .locator('xpath=ancestor::*[.//button[contains(normalize-space(.), "WAV")]][1]');
}
const NOT_SIGNED_IN = 'NOT SIGNED IN: the soundstripe-profile session is gone. Run `node soundstripe.js login`, sign in, then retry.';
function mmss(sec) { sec = Math.round(sec || 0); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
function arg(flag, def) { const i = process.argv.indexOf(flag); return i > -1 ? process.argv[i + 1] : def; }
function has(flag) { return process.argv.includes(flag); }

function algoliaSearch(query, { limit = 24, allPartners = false } = {}) {
  const facetFilters = allPartners ? [] : [["content_partner.name:Soundstripe"]];
  const params = new URLSearchParams({ hitsPerPage: String(limit), facetFilters: JSON.stringify(facetFilters) }).toString();
  const body = JSON.stringify({ requests: [{ indexName: ALGOLIA.index, query, params }] });
  const url = `https://${ALGOLIA.app.toLowerCase()}-dsn.algolia.net/1/indexes/*/queries`
            + `?x-algolia-agent=soundstripe-skill&x-algolia-api-key=${ALGOLIA.key}&x-algolia-application-id=${ALGOLIA.app}`;
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d).results[0]); } catch (e) { reject(new Error('Algolia parse failed: ' + d.slice(0, 200))); }
      });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}

function algoliaGetObject(objectID) {
  const url = `https://${ALGOLIA.app.toLowerCase()}-dsn.algolia.net/1/indexes/${ALGOLIA.index}/${encodeURIComponent(objectID)}`
            + `?x-algolia-api-key=${ALGOLIA.key}&x-algolia-application-id=${ALGOLIA.app}`;
  return new Promise((resolve) => {
    https.get(url, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(null); } }); })
         .on('error', () => resolve(null));
  });
}

function hitToRecord(h) {
  const primary = (h.audio_files || []).find(a => a.primary) || (h.audio_files || [])[0] || {};
  return {
    objectID: String(h.objectID),
    title: h.title,
    artists: (h.artists || []).map(a => a.name),
    duration_sec: Math.round(h.primary_audio_file_duration || primary.duration || 0),
    bpm: h.bpm, energy: h.energy, key: h.key ? `${h.key.name} ${h.key.mode}` : null,
    mood: h.tags?.mood || [], genre: h.tags?.genre || [], instrument: h.tags?.instrument || [],
    characteristic: h.tags?.characteristic || [], keywords: (h.keywords || []).slice(0, 12),
    has_vocal_version: h.has_vocal_version, content_partner: h.content_partner?.name,
    artwork: h.album_artwork?.thumbnail_url || null,
    preview_url: primary.playback_url || null,
    primary_audio_file_id: h.primary_audio_file_id,
  };
}

function buildBoard(query, records) {
  const cards = records.map(r => `
    <div class="card">
      <div class="top">
        ${r.artwork ? `<img src="${r.artwork}" />` : '<div class="noart"></div>'}
        <div class="meta">
          <div class="title">${r.title}</div>
          <div class="artist">${r.artists.join(', ')}</div>
          <div class="facts">${mmss(r.duration_sec)} &middot; ${r.bpm || '?'}bpm &middot; ${r.energy || ''}</div>
        </div>
      </div>
      <div class="tags">${[...r.mood, ...r.genre].slice(0, 6).map(t => `<span>${t}</span>`).join('')}</div>
      ${r.preview_url ? `<audio controls preload="none" src="${r.preview_url}"></audio>` : '<div class="noaudio">no preview</div>'}
      <div class="dl"><code>node soundstripe.js download ${r.objectID}</code></div>
    </div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>Soundstripe: ${query}</title>
  <style>
    body{background:#0d0f12;color:#e8eaed;font:14px/1.4 system-ui,Segoe UI,Arial;margin:0;padding:20px}
    h1{font-size:18px;font-weight:600}.q{color:#8ab4f8}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-top:14px}
    .card{background:#16191d;border:1px solid #23272e;border-radius:10px;padding:12px}
    .top{display:flex;gap:10px}.top img,.noart{width:60px;height:60px;border-radius:6px;object-fit:cover;background:#23272e;flex:none}
    .title{font-weight:600}.artist{color:#9aa0a6;font-size:13px}.facts{color:#6b7177;font-size:12px;margin-top:3px}
    .tags{margin:8px 0;display:flex;flex-wrap:wrap;gap:5px}.tags span{background:#23272e;color:#9aa0a6;border-radius:4px;padding:1px 7px;font-size:11px}
    audio{width:100%;margin-top:6px;height:34px}
    .dl{margin-top:8px}.dl code{background:#0a0c0f;color:#7ee787;font-size:11px;padding:3px 6px;border-radius:4px;display:block;overflow:auto}
  </style></head><body>
  <h1>Soundstripe results for <span class="q">"${query}"</span> &middot; ${records.length} tracks</h1>
  <div class="grid">${cards}</div></body></html>`;
}

// ── commands ─────────────────────────────────────────────────────────────────
async function cmdSearch() {
  const query = process.argv[3];
  if (!query) { console.error('Usage: node soundstripe.js search "<query>" [--limit N] [--all-partners]'); process.exit(1); }
  const limit = parseInt(arg('--limit', '24'), 10);
  const r = await algoliaSearch(query, { limit, allPartners: has('--all-partners') });
  const records = r.hits.map(hitToRecord);
  fs.writeFileSync(CANDID, JSON.stringify({ query, nbHits: r.nbHits, fetched: records.length, at: new Date().toISOString(), records }, null, 2));
  fs.writeFileSync(BOARD, buildBoard(query, records));
  console.log(`"${query}" -> ${r.nbHits} total, showing ${records.length}.`);
  for (const x of records) console.log(`  [${x.objectID}] ${x.title} — ${x.artists.join(', ')} | ${mmss(x.duration_sec)} | ${x.bpm}bpm ${x.energy} | ${x.mood.join('/')}`);
  console.log(`\nAudition board: ${BOARD}`);
  console.log(`Download one:   node soundstripe.js download <objectID>`);
}

async function cmdDownload() {
  const objectID = process.argv[3];
  if (!objectID || objectID.startsWith('--')) { console.error('Usage: node soundstripe.js download <objectID> [--query "text"] [--dest dir]'); process.exit(1); }
  const dest = arg('--dest', DEFAULT_DEST);
  fs.mkdirSync(dest, { recursive: true });

  // look the track up by objectID so we know its title (to locate its row in the UI)
  const obj = await algoliaGetObject(objectID);
  const title = obj && obj.title ? obj.title : null;
  const locate = arg('--query', title || '');
  if (!locate) { console.error('Could not resolve a title for', objectID, '— pass --query "<track title>".'); process.exit(1); }
  console.log(`Downloading [${objectID}] "${title || locate}" -> ${dest}`);

  const { chromium } = require(path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media', 'schedule-tweets', 'node_modules', 'playwright'));
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 60, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  await injectSession(browser);
  const page = browser.pages()[0] || await browser.newPage();

  const SHOT = path.join(MUSIC_DIR, '_recon', 'shots'); fs.mkdirSync(SHOT, { recursive: true });
  let licenseCode = null, savedFile = null, authToken = null;
  const posts = [];
  page.on('request', (req) => {
    const u = req.url();
    if (/api\.soundstripe\.com/.test(u)) {
      // Soundstripe authenticates app API calls with this custom JWT header (NOT a
      // Bearer/cookie). Captured from any observed request, then replayed below to
      // fetch the Content-ID license code for this exact song.
      const t = req.headers()['x-soundstripe-auth-token']; if (t && !authToken) authToken = t;
      if (req.method() === 'POST' && /\/download|content_id_licenses/.test(u)) {
        let pd = null; try { pd = req.postData(); } catch {}
        posts.push({ url: u, postData: pd }); console.log('  [POST]', u.replace('https://api.soundstripe.com', ''), '|', pd);
      }
    }
  });
  page.on('response', async (resp) => {
    if (/content_id_licenses/.test(resp.url())) { try { const j = await resp.json(); if (j && j.code) licenseCode = j.code; } catch {} }
  });
  page.on('download', async (dl) => {
    const out = path.join(dest, dl.suggestedFilename() || `${objectID}.mp3`);
    await dl.saveAs(out).catch(() => {});
    savedFile = out; console.log('  downloaded:', path.basename(out));
  });

  try {
    // load library first so the app emits the bearer token, then go straight to the
    // song's OWN page (objectID-exact). This avoids the fuzzy title search grabbing the
    // wrong track on collisions (e.g. Diamonds / Like Diamonds / Chocolate Diamonds).
    // On the song page the FIRST song-license-btn is the target track's row (its own
    // download control); "Similar Songs" rows follow below.
    await page.goto('https://www.soundstripe.com/library', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    await page.goto(`https://www.soundstripe.com/library/songs/${objectID}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(7000);
    await page.screenshot({ path: path.join(SHOT, 'd1-results.png') }).catch(() => {});
    if (await signedIn(page) === false) throw new Error(NOT_SIGNED_IN);

    const btn = downloadControl(page, objectID);
    await btn.waitFor({ timeout: 15000 });

    // robust mouse click on the button center (matches the repo's posting scripts)
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    const bb = await btn.boundingBox();
    if (bb) await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    else await btn.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(SHOT, 'd2-after-click.png') }).catch(() => {});

    // if a format/confirm dialog/menu appears, click its Download / MP3 control
    for (const sel of ['[role="dialog"] button:has-text("Download")', 'button:has-text("Download MP3")',
                       '[role="menuitem"]:has-text("MP3")', 'button:has-text("MP3")',
                       '[data-testid="download-button"] button', 'button:has-text("Download")']) {
      const b = page.locator(sel).first();
      if (await b.count() && await b.isVisible().catch(() => false)) { console.log('  clicking format/confirm:', sel); await b.click().catch(() => {}); await page.waitForTimeout(4000); break; }
    }
    await page.waitForTimeout(6000); // allow download + license calls to settle
    await page.screenshot({ path: path.join(SHOT, 'd3-final.png') }).catch(() => {});

    // Fallback (2026-10-14): some downloads fire NO api.soundstripe.com request at all (served from
    // cache), so no auth token is sniffed and the code cannot be minted below. The modal's own
    // "Generate YouTube Code" control POSTs /app/content_id_licenses for this song; the response
    // listener above captures the code (and the request sniffer captures the token).
    if (!licenseCode && !authToken) {
      const gen = page.getByText('Generate YouTube Code', { exact: true }).first();
      if (await gen.count() && await gen.isVisible().catch(() => false)) {
        console.log('  no API traffic seen; clicking "Generate YouTube Code" in the modal');
        await gen.click().catch((e) => console.log('  generate-code click err:', e.message));
        await page.waitForTimeout(5000);
      }
    }

    // Fetch the YouTube/Content-ID license code directly (the download modal never
    // fires it). POST /app/content_id_licenses {"song_id":"<objectID>"} with the
    // captured x-soundstripe-auth-token -> {"code":"<16 chars>"}. (Mapped 2026-06-04
    // via supervised capture; see _recon/license-capture.json.)
    if (!licenseCode && authToken) {
      try {
        const resp = await page.request.post('https://api.soundstripe.com/app/content_id_licenses', {
          headers: { 'x-soundstripe-auth-token': authToken, 'content-type': 'application/vnd.api+json', 'accept': 'application/vnd.api+json' },
          data: JSON.stringify({ song_id: String(objectID) }),
        });
        const j = await resp.json().catch(() => null);
        if (j && j.code) { licenseCode = j.code; console.log('  license code:', licenseCode); }
        else console.log('  content_id_licenses returned', resp.status(), JSON.stringify(j));
      } catch (e) { console.log('  license fetch failed:', e.message); }
    }
    console.log('  auth token captured?', !!authToken, '| download/license POSTs seen:', posts.length);
    await saveSession(browser);
  } catch (e) {
    console.error('  download error:', e.message);
  }
  try { await browser.close(); } catch {}

  if (savedFile) {
    upsertLibrary({ objectID, title, file: path.relative(MUSIC_DIR, savedFile), license_code: licenseCode, source: 'soundstripe', downloaded_at: new Date().toISOString(), meta: obj ? hitToRecord(obj) : null });
    console.log(`\nDONE. file: ${savedFile}\n      license_code: ${licenseCode || '(NOT captured — check Soundstripe download section)'}`);
  } else {
    console.error('\nNo file downloaded. The download click flow needs adjustment (see screenshots / re-run supervised).');
    process.exit(2);
  }
}

// download-alt — grabs the "Alternate Versions" zip (the broken-up section cuts:
// chorus / verse / intro / bridge, instrumental + bg-vocal mixes) as a single
// WAV zip, the same bundle the UI's Download-Song modal offers under "Alternate
// Versions". Optionally also grabs the "Stems" zip with --stems. Saves into
// --dest (default the track's reusable folder). Does NOT touch library.json —
// the section files are registered in assets/music/library.json (the canonical
// catalog) by hand after unzip, since the master full-track entry already lives
// there. Same modal/auth flow as cmdDownload.
async function cmdDownloadAlt() {
  const objectID = process.argv[3];
  if (!objectID || objectID.startsWith('--')) { console.error('Usage: node soundstripe.js download-alt <objectID> [--query "text"] [--dest dir] [--stems] [--no-alt]'); process.exit(1); }
  const dest = arg('--dest', DEFAULT_DEST);
  const wantStems = has('--stems');
  const wantAlt = !has('--no-alt'); // --no-alt skips the alternate-versions zip (e.g. when you only want --stems)
  fs.mkdirSync(dest, { recursive: true });

  const obj = await algoliaGetObject(objectID);
  const title = obj && obj.title ? obj.title : null;
  const locate = arg('--query', title || '');
  if (!locate) { console.error('Could not resolve a title for', objectID, '— pass --query "<track title>".'); process.exit(1); }
  console.log(`Alt-tracks for [${objectID}] "${title || locate}" -> ${dest}${wantStems ? ' (+stems)' : ''}`);

  const { chromium } = require(path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media', 'schedule-tweets', 'node_modules', 'playwright'));
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, slowMo: 60, acceptDownloads: true,
    ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await browser.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  await injectSession(browser);
  const page = browser.pages()[0] || await browser.newPage();
  const SHOT = path.join(MUSIC_DIR, '_recon', 'shots'); fs.mkdirSync(SHOT, { recursive: true });
  const saved = [];
  const pending = []; // await these BEFORE closing — alternate/stems zips can be 150MB+ and outrun a fixed timer
  page.on('download', (dl) => {
    const out = path.join(dest, dl.suggestedFilename() || `${objectID}_alt.zip`);
    console.log('  saving:', path.basename(out), '...');
    pending.push(
      dl.saveAs(out)
        .then(() => { saved.push(out); console.log('  downloaded:', path.basename(out)); })
        .catch((e) => console.log('  saveAs failed:', path.basename(out), e.message))
    );
  });

  try {
    await page.goto('https://www.soundstripe.com/library', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    // objectID-exact: go to the song's own page (see cmdDownload note on collisions)
    await page.goto(`https://www.soundstripe.com/library/songs/${objectID}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(7000);

    // open the Download-Song modal (same control the full-track download uses)
    if (await signedIn(page) === false) throw new Error(NOT_SIGNED_IN);
    const lic = downloadControl(page, objectID);
    await lic.waitFor({ timeout: 15000 });
    const bb = await lic.boundingBox();
    if (bb) await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); else await lic.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(SHOT, 'alt1-modal.png') }).catch(() => {});

    // Alternate Versions zip: the "Alternate Versions" header <li> has its own
    // WAV button that bundles every section cut into <Title>_alternate_tracks_wav.zip
    if (wantAlt) {
      // 2026-10 modal: the rows are no longer <li>; find the heading text, then the nearest ancestor that holds a WAV button (= the row)
      const altRow = modalRow(page, 'Alternate Versions');
      if (await altRow.count()) {
        const wav = altRow.locator('button:has-text("WAV")').first();
        if (await wav.count()) {
          await wav.scrollIntoViewIfNeeded().catch(() => {});
          await wav.click().catch((e) => console.log('  alt WAV click err:', e.message));
          await page.waitForTimeout(7000);
        } else console.log('  no WAV button in Alternate Versions row');
      } else console.log('  NO "Alternate Versions" section for this track (nothing to grab).');
    }

    // Stems zip (optional): the "Stems" <li> has a WAV button -> <Title>_stems_wav.zip
    if (wantStems) {
      const stemRow = modalRow(page, 'Stems');
      if (await stemRow.count()) {
        const swav = stemRow.locator('button:has-text("WAV")').first();
        if (await swav.count()) { await swav.scrollIntoViewIfNeeded().catch(() => {}); await swav.click().catch((e) => console.log('  stems WAV click err:', e.message)); await page.waitForTimeout(8000); }
      } else console.log('  NO "Stems" section for this track.');
    }
    await page.screenshot({ path: path.join(SHOT, 'alt2-final.png') }).catch(() => {});
    await saveSession(browser);
  } catch (e) {
    console.error('  download-alt error:', e.message);
  }
  // wait for every started download to finish writing before closing the browser
  if (pending.length) { console.log(`  waiting for ${pending.length} download(s) to finish...`); await Promise.all(pending); }
  try { await browser.close(); } catch {}

  if (saved.length) console.log(`\nDONE. ${saved.length} file(s):\n  ` + saved.map((s) => path.basename(s)).join('\n  '));
  else { console.error('\nNo file downloaded (no alternate versions, or the click flow needs adjustment — see _recon/shots/alt*.png).'); process.exit(2); }
}

// login — open the soundstripe-profile Chrome on the sign-in page, wait (up to --wait minutes,
// default 10) for Mike to sign in, then persist the cookies to _recon/session-cookies.json so
// every later download/download-alt run can re-inject them (the login cookie is session-only).
async function cmdLogin() {
  const waitMin = parseFloat(arg('--wait', '10'));
  const { chromium } = require(path.join('C:\\Users\\mnede\\Documents\\Claude\\social-media', 'schedule-tweets', 'node_modules', 'playwright'));
  const browser = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'], args: ['--disable-blink-features=AutomationControlled'], viewport: null,
  });
  await injectSession(browser);
  const page = browser.pages()[0] || await browser.newPage();
  await page.goto('https://www.soundstripe.com/library/songs/15847', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  if (await signedIn(page) === true) { await saveSession(browser); console.log('Already signed in; session saved to', SESSION); await browser.close(); return; }
  await page.goto('https://app.soundstripe.com/login', { waitUntil: 'domcontentloaded' });
  console.log(`Sign in to Soundstripe in the Chrome window that just opened. Waiting up to ${waitMin} min...`);
  const deadline = Date.now() + waitMin * 60000;
  let ok = false;
  while (Date.now() < deadline) {
    await page.waitForTimeout(5000);
    const probe = await browser.newPage();
    try {
      await probe.goto('https://www.soundstripe.com/library/songs/15847', { waitUntil: 'domcontentloaded' });
      await probe.waitForTimeout(3000);
      if (await signedIn(probe) === true) ok = true;
    } catch {}
    await probe.close().catch(() => {});
    if (ok) break;
  }
  if (ok) { await saveSession(browser); console.log('Signed in. Session saved to', SESSION); }
  else console.error('Timed out waiting for sign-in; nothing saved.');
  await browser.close();
  if (!ok) process.exit(2);
}

function upsertLibrary(entry) {
  let lib = { $doc: 'Downloaded music tracks + their Soundstripe Content-ID license codes. license_code must be placed in the YouTube/Facebook/IG video description to avoid copyright claims.', tracks: [] };
  if (fs.existsSync(LIBRARY)) { try { lib = JSON.parse(fs.readFileSync(LIBRARY, 'utf8')); } catch {} }
  lib.tracks = (lib.tracks || []).filter(t => t.objectID !== entry.objectID);
  lib.tracks.push(entry);
  fs.writeFileSync(LIBRARY, JSON.stringify(lib, null, 2));
  console.log('  library.json updated.');
}

(async () => {
  const cmd = process.argv[2];
  if (cmd === 'search') return cmdSearch();
  if (cmd === 'download') return cmdDownload();
  if (cmd === 'download-alt') return cmdDownloadAlt();
  if (cmd === 'login') return cmdLogin();
  console.error('Usage:\n  node soundstripe.js login [--wait 10]\n  node soundstripe.js search "<query>" [--limit N] [--all-partners]\n  node soundstripe.js download <objectID> [--query "text"] [--dest dir]\n  node soundstripe.js download-alt <objectID> [--query "text"] [--dest dir] [--stems]');
  process.exit(1);
})();
