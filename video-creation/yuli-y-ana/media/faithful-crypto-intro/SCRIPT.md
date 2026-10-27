# faithful-crypto-intro — SCRIPT (30-45 s, 16:9 longform, Yuli + Ana)

**Channel:** Faithful Crypto (new YouTube channel, Yuli y Ana). **Format:** 1920x1080 channel intro.
**Personas:** Yuli (pink cat-ear chair, `../../MASTER/studio-shots/yuli-pinkchair-webcam.png`) and Ana
(purple cat-ear chair, `../../MASTER/studio-shots/ana-purplechair-webcam.png`), each a 9:16 Seedance
lip-sync clip. **Register:** casual, warm, energetic, two friends talking to camera. Not Mike's declarative
register. No em dashes. No promissory financial claims.

**Staging:**
- Chunks 1-2: SOLO, one persona centered in the 16:9 frame, BLURRED WINGS (the same clip blurred + darkened
  fills the sides).
- Chunks 3-4: SIDE BY SIDE, Yuli left and Ana right, both say the line in UNISON (two separate clips, one
  per persona, composited; their two tracks mixed, onsets aligned).
- Chunks 5-9: SOLO beats alternating Yuli / Ana, blurred wings, cut on each speaker change.
- Chunks 10-11: SIDE BY SIDE again, unison close.

Chunks are numbered GLOBALLY across both voices (the TTS gate keys on the chunk number): odd = Yuli,
even = Ana, except chunk 9 (Yuli) and the unison pairs 3/4 and 10/11.

---

**Chunk 1 (Yuli, solo, blurred wings)**
> Hi, I'm Yuli.

**Chunk 2 (Ana, solo, blurred wings)**
> Hi, I'm Ana.

**Chunk 3 (Yuli, side by side, unison with chunk 4)**
> And welcome to Faithful Crypto!

**Chunk 4 (Ana, side by side, unison with chunk 3)**
> And welcome to Faithful Crypto!

**Chunk 5 (Yuli, solo)**
> On this channel we talk about the cryptos we truly believe in. The ones we hold through everything.

**Chunk 6 (Ana, solo)**
> Some of our favorites are Kaspa, Tao, Canton, and a few others you will hear a lot about.

**Chunk 7 (Yuli, solo)**
> We break down what each one does, why we are excited, and what is coming next. In plain, simple words.

**Chunk 8 (Ana, solo)**
> We keep it simple, we keep it fun, and we always do the homework.

**Chunk 9 (Yuli, solo)**
> So hit subscribe, and come be faithful with us.

**Chunk 10 (Ana, side by side, unison with chunk 11)**
> See you in the next one!

**Chunk 11 (Yuli, side by side, unison with chunk 10)**
> See you in the next one!

---

## Production notes
- Voice: Higgsfield Seed Speech presets **YULI-1** and **ANA-2** via `../../../skills/higgsfield-voice/`
  (`_batch-generate.js` with `HF_VOICE`, gated against this file). ANA-2 renders slow: atempo per ANA-SPEC.
- Face clips: Seedance 2.0 `--start-image <studio still> --audio <chunk> --resolution 480p --aspect_ratio 9:16`,
  MINIMAL prompt, duration = max(4, ceil(audio)). Short lines are padded with silence to the clip length.
- Edit: Remotion comp `FaithfulCryptoIntro` (1920x1080, 30 fps), arial-black karaoke captions (Caption2),
  music bed ~16-18 dB under the VO, end card.
