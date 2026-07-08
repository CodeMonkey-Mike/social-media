# Kaspa Wise Man — Channel Intro (episode 0)

> The first video: the wise man introduces himself + the series. NOT a bank quote (one-off special,
> so the price/future conceit is allowed; the evergreen-only rule in CONCEPT.md §5 applies to the
> bank, not to this intro). Keyframe: `keyframes/intro-wiseman-ghost.png` (full-screen layout, §3b —
> him sitting in the glowing teal flower garden with the Kasper ghost floating beside him).

## Spoken script (LOCKED wording 2026-06-02; CAPS = TTS emphasis word)

```
I am the Kaspa Wise Man. And this, is a Kaspian future.

I bring you wise thoughts from the future. A future where Kaspa's last
all time high was over ONE HUNDRED dollars.

And I may get some help delivering those thoughts. From the Kaspa mascot.
Yes. A GHOST. Not a cat.

So click that LIKE button, if you want a Kaspian future.
```

- Approx duration: ~22-28s.
- "all time high" is spelled out (not "ATH") so the TTS reads it cleanly.
- **TTS pronunciation (LOCKED 2026-06-04):** in the Seedance spoken-line prompt, spell *Kaspa* as
  **"casper"** (and *Kaspa's* as "casper's") and *Kaspian* as **"Caspian"** so it is said correctly.
  These respellings are AUDIO-ONLY and never appear in captions / on-screen text. Variant E
  ("casper") was chosen over B ("Kasp-uh"): they sound near-identical, but B's lip-sync visibly
  formed a "kas-poo" mouth on camera. See memory `kaspa-wise-man-tts-spelling`.
- No em dashes (persona hard rule). The pauses use commas / periods / a short beat after "Yes."

## Voice direction
Conviction-sage register (per `../persona-voice.json` + CONCEPT.md §2): warm and welcoming for an
intro, but still with weight and a smile in the voice — NOT a sleepy monk. Build into "ONE HUNDRED",
land the gag dryly on "Not a cat", and end firm and inviting on the "LIKE" button.

## Caption beats (karaoke, bold white all-caps, yellow highlight on the CAPS word)
1. KASPA WISE MAN
2. A KASPIAN FUTURE
3. WISE THOUGHTS / FROM THE FUTURE
4. ATH OVER **$100**
5. A LITTLE HELP
6. THE KASPA MASCOT
7. A **GHOST** / NOT A CAT
8. CLICK **LIKE** / FOR A KASPIAN FUTURE

## Production notes
- Layout: full-screen (§3b), the garden keyframe as the held scene; he speaks to camera, ghost bobs
  beside him.
- **Voice / audio: Seedance generates the spoken audio itself** (`generate_audio` default true) from
  the voice reference `../identity/my-avatar-voice-13s.mp3` passed as a `role:audio` media input. NO
  separate TTS API needed — this is the standard talking-head recipe in `../SKILL.md` §4. The script
  text drives what he says.
- **Duration / chaining:** Seedance caps at ~15s per clip, but this script is ~22-28s, so it must be
  built as ~2 chained clips (last-frame -> first-frame, ../SKILL.md §2). Keep each clip's `--duration`
  tight to its spoken segment (anti-hallucination rule). Suggested split: clip A = intro + ATH line;
  clip B = ghost gag + LIKE-button CTA.
- Per-clip: Whisper-verify the generated audio (re-roll on garbage), then caption + assemble in
  Remotion (karaoke beats above), 1080x1920.
- **Background music: YES for this video — serene, calming, new-age/ambient.** Generate the spoken
  voice DRY (keep the §4 negative-audio directive so Seedance does not invent its own bed), then lay
  a single chosen serene/calming track in Remotion during the edit. One continuous bed across both
  chained clips at a controlled volume under the voice (do NOT rely on Seedance's self-invented music
  — it is unpredictable and would mismatch across the cut). Vibe: tranquil, meditative, fits the
  glowing teal garden / wise-man register.
- Optional: drop a subtle backwards-K Kaspa logo in the scene, and bookend with the same
  "A KASPIAN FUTURE" + backwards-K caption style seen in `../a kaspian future.png`.
