# receipt-capture — canonical screenshot tool for edit-time "receipts"

Reusable, track-agnostic tool to capture clean **receipt** screenshots (news articles, charts, coin
aggregators like CoinMarketCap / TradingView / CryptoRank, project blogs, wiki/founder pages) that get
popped in as edit-time cutaway assets. Replaces the old per-project throwaway `_capture_*.js` scripts, which
lived inside disposable `media/<project>/` folders and had to be re-derived every video — **this is the
durable copy. Do not re-write a capture script inside a project folder; call this.**

## Why it's a skill (not a project script)
A capture script kept only in a project's media folder dies when that folder is recycled, so the next video
re-derives it (and re-hits the same consent/bot-wall gotchas). The engine lives here; a project supplies
only its **jobs list** (URLs + what to capture).

## Tool
`video-creation/skills/receipt-capture/capture.js` (Node + Playwright; Playwright is pulled from the
repo-level `repurpose/node_modules`, so it survives project deletion).

```
# batch (recommended) — jobs.json lives in the project's assets/receipts/ folder
node video-creation/skills/receipt-capture/capture.js <path/to/jobs.json> [nameFilter]

# one-off
node video-creation/skills/receipt-capture/capture.js --url "<url>" --out "<abs.png>" [--full] [--wait 6000] [--w 1600] [--h 2200] [--click "Token Unlocks"]
```

### jobs.json schema (array of jobs)
```json
[{
  "name": "R1_cmc-unlocks",
  "url": "https://coinmarketcap.com/currencies/zebec-network/",
  "out": "R1_cmc-unlocks.png",          // written into the jobs.json's own folder unless absolute
  "wait": 7000,                          // ms after domcontentloaded (JS-heavy pages need 6-11k)
  "full": false,                         // true = fullPage; false = viewport (w x h)
  "w": 1600, "h": 2200,
  "clicks": [ {"text": "Token Unlocks"} ],   // click a tab/timeframe AFTER load+consent (text or {"sel": "..."})
  "waitAfterClick": 2500,
  "removeSel": ["[class*=promo]"],        // extra elements to nuke (on top of the built-in cookie/consent kill-list)
  "clip": {"x":0,"y":0,"width":1600,"height":900}   // optional region crop
}]
```

Built in automatically: headless Chrome (real channel + desktop UA), `deviceScaleFactor: 2` (crisp/retina),
cookie/consent button-click + common consent-container removal.

## Output convention
Capture into the project's **`media/<project>/assets/receipts/`** (per longform-edited house rule #1,
receipts are edit-time cutaway assets). Keep the `jobs.json` beside the PNGs so the capture is reproducible.
For a vertical repurpose, capture in MOBILE VIEW (narrow `w`, e.g. 430) — memory `feedback_vertical_screenshots_mobile_view`.

## HARD RULES (the reasons this exists)
- **VERIFY every capture is the real page, not a block/consent/blank page — by LOOKING at the PNG.** Bot
  walls (Cloudflare, Crunchbase) and consent modals produce a "successful" screenshot of nothing. Open each
  output and confirm the headline/chart/numbers are actually there. A green "OK" from the script is NOT
  proof. (Same DNA as the burst-removal "verify on the file" rule.)
- **Live numbers → capture DAY-OF-RENDER.** Price/mcap/supply/holders on CMC etc. drift; the number on the
  receipt MUST match the VO and the live page the day the video is finalized, or a viewer screenshots the
  mismatch.
- **Get the RIGHT view, not just the page.** A tab/timeframe often needs a click: CMC "Token Unlocks" tab,
  TradingView "All" timeframe (not the 1D default), a specific chart module. Use `clicks`.
- **Bot-walled sites need a fallback, not a fake.** If a source hard-blocks headless (Crunchbase did), pick
  an equivalent credible source (e.g. iq.wiki for a founder) rather than shipping a block-page grab.
- **Full width, readable, top-aligned** (house rule #1): a webpage cap fills the video WIDTH; don't ship a
  tiny contained thumbnail. Crop to the relevant module with `clip` when the page has a lot of chrome.
