# faithful-crypto-intro — PROJECT-LOG

**What:** the 30-45 s channel intro for **Faithful Crypto**, the new Yuli y Ana YouTube channel (longform, 16:9).
Yuli and Ana each say hi solo (blurred wings), then side by side say "And welcome to Faithful Crypto", then a
short alternating script about the cryptos they cover (Kaspa, Tao, Canton, others). Script: `SCRIPT.md`.

**Pipeline (per `../../CLAUDE.md`, longform row):** verbatim SCRIPT.md -> `tts-chunks-*.json` gated by
`skills/higgsfield-voice/verify-tts.js` -> Seed Speech clone tracks (YULI-1, ANA-2) -> Seedance 2.0 lip-sync
clips off the studio stills (480p, 9:16, minimal prompt) -> Remotion comp `FaithfulCryptoIntro` -> QA -> FINAL.
Too small for the longform graph (no cover layer); driven by `build.py` in this folder instead.

## Status
- 2026-10-17: project created. SCRIPT.md written; both chunk files pass the script gate (6 Yuli + 5 Ana).
  Seedance cost probed: minimum duration 4 s, 12 credits per 4 s clip at 480p (3 cr/s). Music picked from the
  catalog: `happy-feet` (fresh in the usage ledger; intro cut 38 s, -12.2 LUFS, ends on a hit).
- 2026-10-17 (cont.): the `hfbot-profile` Chrome was logged OUT of Higgsfield; Mike re-logged in (Google). Lesson for
  the voice skill: the Audio page no longer mounts an `<audio>` element for a fresh generation, the result is a
  History card whose mp3 loads on Play, and `higgsfield generate list` (the CLI) lists the Text-to-Speech jobs
  WITH their mp3 URLs: the simplest capture path (used `_grab-history.js` this time).
- VOICE DONE: 6 Yuli lines (YULI-1) + 5 Ana lines (ANA-2), all Whisper-verified. Ana's "Canton" came out as
  "Hanten": re-rolled with the spoken spelling "Kanton" (gate rule added to `verify-tts.js`), now heard "Canton" by
  two Whisper models. Ana atempo 1.2x (1.3x hello; unison lines matched to Yuli's take length). Yuli VO lines 1.08x.
- SCOPE CHANGE (Mike): only the 4 intro lines are face video; chunks 5-11 are voice-over covered by ChatGPT images +
  Envato b-roll (BROLL-PLAN.md, 6 + 6, dispatched to the envato-sourcer and image-gen agents). Unison close =
  comp-built end card (two stills + wordmark).
- FACE CLIPS (Seedance 2.0, 480p, 4 s, minimal prompt, 12 cr each): Yuli 01 + 03 clean. Ana: the first takes grinned
  wide (persona rule) and Seedance invented extra speech / stretched the line (lips 0.8 s late on 04). Re-rolled x2
  with a calm closed-lip prompt (02-v2a usable, 04-v2a/b stretched). Parallel attempt via ElevenLabs Creatify
  Aurora (the route BOTH shipped persona videos used): `_aurora.sh` -> `clips/chunk-0{2,4}-aurora.mp4`.
- TIMELINE locked (`timeline.json`, 44.03 s): S1 Yuli 0-2.34 · S2 Ana 2.34-5.13 · S3 duo 5.13-8.45 · VO 8.45-40.49 ·
  end card 40.79-44.03. VO master `render-assets/audio/vo.wav` (-15.3 LUFS). Captions = canonical arial-black
  karaoke (`render-assets/captions.json`, mishears fixed: Ana / Faithful / TAO, coin names on their own cards).
- COMP `remotion/src/FaithfulCryptoIntro.tsx` + generated `FaithfulCryptoIntroData.ts` (`build_data.py`, re-run after
  any asset change; face take per scene in `clips/choice.json`). Music: Seabreeze 0:46 instrumental cut (Mike, 2026-10-17; replaced happy-feet) at -19 dB clip gain
  (bed -12.5 LUFS -> ~16.5 dB under the VO), from 0 s so its natural ending lands on the end card; 1 s safety fade.

## DELIVERED 2026-10-17 -> `faithful-crypto-intro-FINAL-v3.mp4` (1920x1080, 30 fps, 44.1 s, crf 18, ~55 MB)
- Comp `remotion/src/FaithfulCryptoIntro.tsx` + generated data; render `npx remotion render src/index.ts FaithfulCryptoIntro <out>
  --public-dir media/faithful-crypto-intro/render-assets --codec=h264 --crf=18` (re-run `build_data.py` first after any asset change).
- QA: no black frames (v1 had 0.3 s black at three VO joins -> cover layer made continuous in build_data.py), peak -0.7 dB,
  Whisper transcript of the file = the full script in order, visual-qa gate 12/12 after two re-sources (BR-2 branded coins
  with readable XRP/SOLANA -> abstract glowing orbs; BR-5 two stock women -> hands-only neon keyboard).
- Advisory left for Mike: IMG-4 (Canton) is brighter / more photoreal than the Pixar house look (no Canton mark exists, so it
  is a generic city of glass towers); BR-5 reads "simple" more than "fun". Face clips: Yuli = Seedance, Ana = Aurora.
- Cleanup after Mike approves: `assets/vid/_orig/` (untrimmed Envato downloads, ~1 GB) and `clips/*v2*` / `chunk-0{2,4}.mp4`
  (rejected Seedance takes) can be recycled. Not queued anywhere (new channel, no uploader yet); deliver by path.

## v4 (2026-10-17 evening, Mike's review of v3)
Mike: Ana still too slow -> +10% (solo lines 1.32x, hello 1.43x; unison lines stay matched to Yuli). "Yuli" must be said
"Julie" -> chunk-01 re-voiced as "Hi, I'm Julie." (YULI-1; `julie -> yuli` gate rule; captions print YULI). The chair's
cat-ears moved with Yuli's head in the Seedance clips -> Yuli's two face clips re-done through Aurora (ears static).
All four face clips are now Aurora. Timeline rebuilt (`build_timeline.py`, 42.87 s), captions rebuilt
(`make_captions.py`), cover slots remapped onto the new VO spans (`COVER-PLAN.json` `scene_spans` + `build_data.py`).
Deliverable: `faithful-crypto-intro-FINAL-v4.mp4`.

## v6 (2026-10-18, Mike's review of v4: Ana "robotic", welcome needs a big smile)
- Ana's VOICE moved to **ElevenLabs v3 on the Higgsfield Audio page with the ana-2 clone**, inline delivery tags
  (`[excited] [cheerfully]` welcome, `[warmly] ... [laughs softly]` homework line), NO atempo (the 1.3x time-stretch of
  Seed Speech was part of the robotic sound). Seed Audio 1.0 was tried first and rejected (multi-speaker scene model:
  repeated the hello 3x, stretched a line to 28 s). Candidates kept in `audio/_cand/` (`el3-*` = v3, `sa-*` = Seed
  Audio) and the old Seed Speech takes as `audio/_seedspeech-chunk-NN-raw.mp3` for an A/B by ear.
- Per-line LOUDNESS MATCH added to `build_timeline.py` (every chunk gained to -15 LUFS, peak-capped): the v3 lines
  were up to 5 dB hotter than Yuli's and v5 peaked at 0.0 dB.
- Welcome face (chunk 04) re-rendered through Aurora with the guidance prompt "smiles big and bright with genuine
  excitement..." on the `[excited]` take: big smile + lifted brows at the end of the line (frames checked).
- Tooling: `skills/higgsfield-voice/_gen-model.js` (any Audio-page model, CLI job capture), `_aurora.sh` takes
  `AURORA_PROMPT`, `verify-tts.js` strips `[tags]`. Deliverable: `faithful-crypto-intro-FINAL-v6.mp4` (v5 = same
  content before the level match; v4 = Seed Speech Ana).

## v9 (2026-10-18): Yuli's welcome face matched to Ana's
Aurora's expression follows the AUDIO energy, so the smile prompt alone did nothing on Yuli's calm Seed Speech take
(v7 identical to v6). Her welcome line was re-voiced on ElevenLabs v3 with the yuli-1 clone: "[excited]" variants
mangled "Faithful Crypto" ("Feedful Kipto", caught by the Whisper gate), "[cheerfully]" passed both Whisper models
and drove a livelier, smiling Aurora take. Only chunk 03 of Yuli's lines is on v3; the rest stay Seed Speech.
Deliverable: `faithful-crypto-intro-FINAL-v9.mp4` (43.5 s). v4 kept as the all-Seed-Speech reference.

## v11 (2026-10-18): the cat-ears came back on the welcome line, now locked IN CODE and SPLICED
Mike uploaded v9 and saw the chair's cat-ears move on Yuli's "welcome to Faithful Crypto" (deleted the upload; the
opening "Hi, I'm Julie" was fine). Cause: v4 only hid the defect by switching to Aurora; Aurora still moves the ears with
the head, and v9's livelier ElevenLabs take moved her more (ear-pixel motion 51 on the welcome vs ~10 on the hello;
Ana's purple-chair clips measure static).
- A first attempt (v10, deleted) locked a blindly dilated ear zone on BOTH Yuli clips and re-rendered the whole video:
  it froze her hairline while the face moved, and the full re-render broke the splice rule. Both wrong.
- The lock that shipped (`build_data.py` `ear_lock`, scenes in `EAR_LOCK` = {'03'}): frame-0 pink pixels above the
  hairline, dilated 60 px (wall + monitors are static too), pasted from frame 0 ONLY where both frame 0 and the current
  frame are NOT the head (hair/skin = warm tones r >= g >= b; the pink ear, magenta wall and blue/green monitors are not).
  Hair moves freely over the static ears. Measured: ear-pixel motion 51.0 -> 0.4 on the clip.
- Shipped by SPLICE: Remotion rendered only frames 126-242 (`_previews/window-S3-v11.mp4`), ffmpeg concat-filter put it
  into v9 (head 0-125 + window + tail 243-1303, v9 audio copied). 1304 frames, head/tail PSNR vs v9 53.8 / 50.6 dB
  (copies), window 36.2 dB (patched), no black gaps. Ears pinned at 5.0 / 6.0 / 6.6 / 7.2 s in the final.
Deliverable: `faithful-crypto-intro-FINAL-v11.mp4` (43.52 s). v9 kept as the pre-fix reference.
