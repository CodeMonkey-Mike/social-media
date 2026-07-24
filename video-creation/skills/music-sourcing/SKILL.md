# SKILL — Music sourcing (Soundstripe) for video-creation

> General music-bed sourcing for **all** video-creation work (not just kaspa-wise-man). Search Mike's
> paid Soundstripe library, audition candidates, and download tracks **with their YouTube/Content-ID
> license code** so finished videos don't get copyright claims. Envato Elements is a future second
> source (same pattern). Status: **2026-06-04 — search + download + license-code auto-capture all
> working end to end.**

## WHERE FILES GO (the tool/asset model — established 2026-06-13, folder renamed music/ -> music-sourcing/)
This folder is the **TOOL**. It is NOT where music is stored. Two homes, by intent:
- **Sourcing FOR a specific video** → download into **that project's media folder**
  (e.g. `longform-edited/media/<project>/`). Project-specific, cleaned up with the project.
- **A reusable go-to bed** (Mike's ~20-30 tracks reused across videos) → **`video-creation/assets/music/`**
  (the permanent reusable LIBRARY) + register it in **`assets/music/library.json`** (the canonical
  catalog: source, artist, soundstripe_id/url, yt_license_code, energy/genre/mood, `used_in[]`).
- A `downloads/` scratch folder here is **throwaway audition staging only** — promote keepers out of it.
- Flow: search → audition (candidates.json / board.html) → download (to project folder, or assets/music
  if you already know it's a keeper) → if reusable, **promote master into assets/music/ + register in the catalog**.
- LICENSING IS SOURCE-SPECIFIC: Soundstripe = a bare `yt_license_code` (into the **YouTube description ONLY**
  — not FB/IG; Soundstripe clearance is YouTube Content-ID); Envato Elements = the Elements license
  certificate (no per-video code) — record per-track in the catalog.

## 0. Why this exists
Background music for the AI-persona / repurpose videos must be **commercially licensed across all 7
platforms** (YouTube + FB/IG run Content ID). Mike has a Soundstripe subscription, which whitelists
his channels — but each download has a **Content-ID "YouTube code"** (16-char alphanumeric, e.g.
`JEUIQQLGUPZZL9EZ`) that must be pasted into the video **description** on YouTube/Facebook/Instagram
or the upload still gets claimed. So we capture the file **and** the code, store both, and propagate
the code to the posting step. (Per Mike: dry-voice clips + ONE chosen bed laid in Remotion — never
the platforms' in-app music, whose license is app-only and gets claimed on cross-post.)

## 1. Auth (same pattern as schedule-tweets posters)
Real Chrome + a dedicated persistent profile:
`C:\Users\mnede\AppData\Local\Google\Chrome\soundstripe-profile`. Log in **once** (Google OAuth);
the session persists across runs, exactly like `xbot-profile` etc. `launchPersistentContext(..., {
channel:'chrome' })`. No login step in the scripts.

## 2. Commands
```
node scripts/soundstripe.js search "<query>" [--limit 24] [--all-partners]
node scripts/soundstripe.js download <objectID> [--query "<title>"] [--dest <dir>]
node scripts/soundstripe.js download-alt <objectID> [--query "<title>"] [--dest <dir>] [--stems]
```
- **search** — calls Soundstripe's **Algolia** index directly over HTTP (public search key; NO
  browser, NO auth, no side effects). Writes `candidates.json` + **`board.html`** — a self-contained
  audition board (cards with artwork, title/artist, duration, bpm, energy, mood/genre tags, and an
  `<audio>` **preview player** per track). Open `board.html`, audition, note the `objectID` you want.
  - **Algolia AND-matches every word**, so keep queries short/broad ("serene calm", not a 6-word
    phrase) or you get 0–2 hits. `--all-partners` drops the `content_partner.name:Soundstripe`
    facet (default keeps only Soundstripe's own catalog, safest for clearance).
- **download** — drives the logged-in profile: navigates to the track's OWN page
  (`/library/songs/<objectID>`, **objectID-exact** — the first `song-license-btn` there is the target
  track, "Similar Songs" follow below), opens the **Download Song** modal, clicks **MP3** (Full Track),
  saves the file to `downloads/`, and upserts `library.json`. Resolves the title from the `objectID`
  via Algolia `getObject`. Leaves diagnostic screenshots in `_recon/shots/d*.png`.
  - **Why song-page nav, not title search (fixed 2026-07-16):** the old flow searched `filter[q]=<title>`
    and clicked the first row, which grabbed the WRONG file on title collisions (Diamonds / Like Diamonds
    / Chocolate Diamonds all coexist). Navigating by objectID is exact. `download-alt` uses the same nav.
- **download-alt** — grabs the **Alternate Versions** bundle (the broken-up section cuts:
  intro/chorus/verse/bridge, instrumental + bg-vocal mixes) as one WAV zip
  (`<Title>_alternate_tracks_wav.zip`) — the same bundle the modal offers under "Alternate Versions".
  Flags: `--stems` ALSO grabs the per-instrument **Stems** zip (`<Title>_STEMS.zip`: DRUMS/BASS/
  STRINGS/SYNTHS/SVOX… each ~60MB, wrapped in an `<Artist>_<Title>/` subfolder + macOS `__MACOSX`/
  `.DS_Store` junk to strip on unzip); `--no-alt` skips the alternate-versions zip (use with `--stems`
  to fetch stems only when you already have the sections). Use `--dest "<the track's assets/music
  folder>"`. Workflow per track: download → **unzip into the folder** (sections flat; stems keep their
  `<Artist>_<Title>/` subfolder; exclude `__MACOSX`/`.DS_Store`) → **DELETE the zip** once every file
  is confirmed on disk (Mike: don't leave unpacked zips around) → register on that track's entry in
  **`assets/music/library.json`**: `sections[]` + `sections_note`, and `stems{folder,files[],note}`;
  same `yt_license_code` covers them all. Same modal/auth flow as `download`; it **awaits each download
  to finish** before closing (bg-vocal/stems zips run 130MB+ and used to outrun a fixed timer). It does
  NOT touch the tool's `library.json` log (the master already does).

## 2b. Bulk-download a whole playlist (added 2026-07-16)
To ingest an entire Soundstripe **private playlist** into the reusable library (full track + license
code + Alternate-Versions instrumentals, per track), use the three `_playlist*` helpers in `scripts/`
(they wrap the documented `download` / `download-alt` commands — not a substitute for them):
```
node scripts/_playlist-enum.js     <playlistId>              # 1. enumerate the playlist's songs
node scripts/_playlist-download.js <playlistId> [--limit N] [--skip a,b]  # 2. batch download (resumable)
node scripts/_register-playlist.js <playlistId> [--skip a,b] # 3. register all into assets/music/library.json
```
- **enum** — opens the playlist with the authed profile, sniffs the app API
  (`/app/playlists/<id>/songs?page[offset]=&page[limit]=`, offset/limit paged), and writes the song list
  to `_recon/playlist-<id>.json`.
- **download** — for each not-yet-present track: `download` (full mp3 + license) THEN `download-alt`
  (instrumentals / section cuts), unzips into `assets/music/<Title>/`, deletes the zip. **Resumable** via
  `_recon/playlist-<id>-progress.json` — re-invoke to continue; SEQUENTIAL (shared Chrome profile), so
  run it in bounded chunks (`--limit`) rather than one giant call. `--skip` = objectIDs already in the
  library. First determine which playlist ids already exist by cross-referencing `soundstripe_id` in
  `assets/music/library.json`.
- **register** — upserts one full catalog entry per track (artist/bpm/energy/mood/genre/key from the
  stored Algolia meta, `yt_license_code`, `folder`, `primary_file`, `sections[]`), keyed by `soundstripe_id`.
- Precedent run: private playlist **430508** → 39 songs, 2 already present (9141, 11370) → **37 added**.

## 2c. Waveform analysis — the catalog is the picker's eyes (added 2026-07-17)
Every library track gets a MACHINE-WRITTEN `analysis` block per audio file (full master + every
section cut; stems excluded) so music is **chosen from `assets/music/library.json` alone — no
audio scanning at selection time**. Schema + semantics live in the `$analysis_note` key at the top
of that file: `env` = the waveform as a 0-9 text sparkline (2s per char, absolute dBFS scale, so
char_index*2 = seconds and digits compare across files), `aggression` 0-100 (punchy vs smooth),
`segments` (ready [tIn,tOut] energy regions for slicing on the video timeline), `opening`/`ending`
classes (`ending: epic_hit` = "ends epically"), and derived `roles[]` (intro_hype / hype_peak /
explainer_bed / epic_outro). Loudness uses ffmpeg volumedetect semantics; calibrated 2026-07-17
against the hand-measured Common High Speeds numbers (exact match).
```
python scripts/analyze-music.py <track-id>        # (re)analyze one library track -> writes library.json
python scripts/analyze-music.py --all             # every track missing analysis_complete (backfill/ingest sweep)
python scripts/analyze-music.py --file "<path>"   # analyze ANY audio file, print JSON, write nothing
```
- **Ingest rule:** run the analyzer after EVERY download/promote into `assets/music/` — the §2b playlist
  flow is enum → download → register → **analyze**. An entry without `analysis_complete: true` is not done.
- **Picking rule (any track/agent):** query the catalog, never re-scan audio that has an `analysis` block.
  For music NOT in the library (project-local beds under `longform-edited/media/<project>/`), use
  `--file` so the numbers stay comparable — NEVER hand-roll a different ffmpeg/RMS pass.
- `analysis` blocks are machine-written: never hand-edit, re-run the script. Human judgment lives in
  `vibe` / `roles_pinned[]` / `used_in[]` / `*_note`.

## 3. Data model
- **`library.json`** (this folder) — canonical per-track store. One entry per downloaded track:
  `{ objectID, title, file, license_code, source, downloaded_at, meta{...} }`. The code belongs to
  the **track** (one track is reused across many videos), so it lives here, not in a video's entry.
- **Propagation (the plan):** when a video uses a track, its queue entry references the track and the
  `license_code` is appended to the **description** (`caption_override`) on **yt_shorts + facebook +
  instagram** at queue/post time — same mechanism as the existing CryptoRich disclaimer block in
  `schedule-tweets/data/shorts.json`. The raw code never needs to live in `batches.json`.

## 4. The Soundstripe API map (discovered 2026-06-04)
- **Search = Algolia.** App `W1S5J3A2XP`, public key `48f01ee0b25b928f7423513dcdbc0d01`, index
  `prod_songs_all_partners_most_recent`. `POST https://w1s5j3a2xp-dsn.algolia.net/1/indexes/*/queries`
  body `{requests:[{indexName,query,params}]}`. Hits carry `objectID` (=song id), `title`, `artists`,
  `bpm`, `energy`, `key`, `tags{mood,genre,instrument,characteristic}`, `keywords`,
  `primary_audio_file_duration`, and `audio_files[].playback_url` (tokened mp3 preview).
- **App API = `https://api.soundstripe.com/app/...`** (JSON:API; auth is a custom JWT header
  **`x-soundstripe-auth-token`**, NOT a Bearer/cookie — cookies/Bearer alone give 403 — plus
  `Content-Type: application/vnd.api+json`). The web app injects the token on every API call; the
  scripts sniff it off any observed request and replay it.
  - Download: `POST /app/songs/<id>/download`, body `{"description":"","tv_broadcast":false}` → returns
    a `sales` record; the actual file is a tokened `cdn.soundstripe.com/uploads/audio_file/...mp3`.
  - **YouTube/Content-ID code:** `POST /app/content_id_licenses`, body **`{"song_id":"<objectID>"}`**
    (the song_id is the same Algolia objectID used everywhere else) → `{"code":"<16 chars>"}`.
    **Each call mints a NEW code** (not idempotent) — so mint ONCE at download time, persist it in
    `library.json`, and reuse the stored code forever. Do not re-mint/overwrite.
  - In the UI: **Profile ▸ Downloads** (`/library/licenses/music`) ▸ the YouTube icon on a track's
    row opens an overlay with the code; that click is what fires `content_id_licenses`.

## 5. License-code auto-capture — SOLVED 2026-06-04
`download` now captures `license_code` automatically. After saving the file it sniffs the
`x-soundstripe-auth-token` off any observed API request, then replays
`POST /app/content_id_licenses` with `{"song_id":"<objectID>"}` and stores the returned `code` in
`library.json`. No navigation to the licenses page or supervised click needed — the song_id is the
objectID we already pass to `download`. (Mapped via the one-shot supervised capture
`scripts/_license-capture.js` → `_recon/license-capture.json`.) Because each POST mints a fresh code,
`download` only fetches it once per track; the persisted `library.json` value is the source of truth.

## 6. Files
```
video-creation/skills/music-sourcing/
  SKILL.md             <- this file
  scripts/
    soundstripe.js     <- the skill (search + download)
    analyze-music.py   <- waveform analyzer (env sparkline / aggression / segments -> library.json, §2c)
    _*.js              <- throwaway recon/discovery (explore, autodrive, grab, inspect)
  library.json         <- downloaded tracks + license codes (SOURCE OF TRUTH)
  candidates.json      <- last search results
  board.html           <- audition board (open in browser)
  downloads/           <- downloaded mp3s
  _recon/              <- captured network/DOM/screenshots (throwaway)
```
