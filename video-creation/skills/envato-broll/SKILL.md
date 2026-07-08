# envato-broll — skill

Find and download **full-screen video b-roll** from Envato Elements (Mike has a subscription)
for any video project in this repo: longform-edited, longform-presentation, shorts, AI-persona.
Driven by Playwright Chrome scripts in this folder, same persistent-profile pattern as the
social uploaders and the ChatGPT image automation.

**Status: validated 2026-06-11** against the NEW Envato app (`app.envato.com`, dark UI).
The old `elements.envato.com/stock-video/<terms>` URL no longer carries the query — everything
goes through `app.envato.com`.

## One-time login

```
node video-creation/skills/envato-broll/setup-envato.js
```
Opens Chrome with the dedicated `envato-profile`
(`C:\Users\mnede\AppData\Local\Google\Chrome\envato-profile`). Mike logs in once; the session
persists in the profile. Never use the main Chrome profile, never kill all Chrome processes
(global rule: per-profile kills only).

## Workflow (per b-roll slot)

1. **Plan first.** Slots come from the project's b-roll plan file (e.g.
   `media/<project>/BROLL-PLAN.md`): timestamp, the spoken line, and a concrete search query.
2. **Search:**
   ```
   node search-envato.js "bank vault door closing" --max 12 --out results.json
   ```
   Dumps candidate clips as JSON: `{ title, url, duration, resolution, previewImage }`.
   Claude evaluates candidates by title/duration/resolution and by READING the preview images
   (download the `previewImage` URLs and look at them) — pick the clip that matches the beat,
   not just the keywords. Prefer: 4K/1080, horizontal, 6-20s, clean single-subject shots,
   no burned-in text/logos.
3. **Download (licenses the item):**
   ```
   node download-envato.js "<item url>" --dir "<project>\assets\video" --name <slot-slug> --project <project>
   ```
   Handles the Elements license dialog (project name keeps the license record tied to the
   video, default = assets folder's project). Saves into the project's own `assets/video/`.
4. **Log it.** Append source URL + slot to the project's b-roll plan so the license trail and
   the edit plan stay in one place.

> **Disk rule (Mike, 2026-06-20; threshold lowered 2026-07-06): cap big originals at ~100 MB on save.**
> If a downloaded Envato clip is **larger than 800,000,000 bytes (800 MB, measured in plain decimal
> bytes, `stat -c%s`/`ls -la` — NOT binary GiB)**, immediately transcode it down to a **~100 MB** version
> and keep ONLY that (recycle the multi-GB original). The threshold was originally "1 GB" but that wording
> let a 1,040,074,139-byte file (1.04 GB decimal, but only 0.97 GiB binary) slip through uncompressed on
> `carry-trade` — 800 MB decimal with the unit stated explicitly closes that gap AND catches large files
> earlier (Mike: "800 MB is still extremely large," disk fills up fast if every download sits just under
> the old cap). B-roll is used ≤4s and muted, so the full 4K/ProRes weight buys nothing. Transcode to
> 1080p H.264, audio stripped, bitrate sized to ~100 MB by duration:
> ```
> D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "<orig>")   # seconds
> BR=$(python -c "print(int(100*8*1000/float($D)*0.92))")                      # kbps for ~100 MB
> ffmpeg -i "<orig>" -vf scale=-2:1080 -c:v libx264 -b:v ${BR}k -maxrate ${BR}k -bufsize $((BR*2))k -an "<orig>.cap.mp4"
> ```
> (If a plain `-crf 23 -vf scale=-2:1080 -an` already lands under 100 MB, that's fine too.) This is
> SEPARATE from the per-slot 1920x1080 render proxy (longform-edited house rule #4) — it just keeps
> the saved SOURCE lean.

## Selector notes (update when Envato changes DOM — keep scripts + this list in sync)

Validated 2026-06-11 on the new app:

- Search URL: `https://app.envato.com/search?itemType=stock-video&term=<q>` (`+` for spaces).
  Other itemTypes: `photos`, `video-templates`, `music`, `sound-effects`...
- A "Search tips" popup appears on first visits — dismiss `button:has-text("Okay, got it")`.
- Result cards: anchors `a[href]` matching `/search/stock-video/<uuid>`; card innerText shape
  is `"0:07 • <Title> | <Author>"`. Card contains an `<img>` cover AND often a `<video>` whose
  src is a **directly fetchable** `...video_preview_h264.mp4` — download it to WATCH the clip
  (extract frames with ffmpeg) before licensing. The grid lazy-loads: scroll to mount cards.
- Filter buttons exist on the search page (Filters / Category / Orientation / Resolution /
  People / Sort) — UI-clickable, no URL params mapped yet.
- Item overlay (same URL, renders over the grid): button text `"Download <size>"` (e.g.
  "Download 162MB") plus a Details block (Length / Resolution / Frame rate). Clicking
  Download licenses the item to the account and starts a real browser download — scripts use
  `acceptDownloads` + `waitForEvent('download')`. No project-name dialog in the current UI;
  download-envato.js still handles one defensively if it appears.
- **Downloads arrive as `.zip`**, often with multiple variants inside (`Main files/RGB_0N.mp4`
  + `Alpha_0N.mp4` mattes on 3D/motion items). Extract with `Expand-Archive`, keep the
  variants in a per-clip subfolder of the project's `assets/video/`, and keep alpha mattes
  (they let Remotion key the element over anything).

## Hard rules

- **Stock b-roll only supplements; it never replaces Mike's face time** (longform-edited
  house style: talking head holds the frame; full-screen b-roll is a short cutaway, then back).
- Assets live in the **project's** `assets/` folder, NOT in any shared assets dir, so project
  cleanup recycles them (Mike's call 2026-06-11).
- One download at a time; don't parallelize browser sessions on the same profile.
- Record the Envato item URL for every clip used (license traceability).
