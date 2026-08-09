// Captions for batch `what-if-1000x` / clip #2 `whatif-100x-bigger-than-brett` (variant: long).
//
// SOURCE OF TRUTH: produced by the CANONICAL captions skill, not hand-authored:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/what-if-1000x/whatif-100x-bigger-than-brett/whisper-words.json \
//     --style montserrat --var CAPTIONS_WHATIF_BIGGER_THAN_BRETT
// (Whisper medium word timings taken off the EXACT final spine, so every t is clip-relative.)
// Grouping + timings are the builder's output, untouched. The ONLY edits are the STT / persona
// corrections below, mirrored into the clip folder's captions.ts:
//
//   1. spoken "hundred x" renders on screen as "100x"  (t 0.64, 11.72, 71.46)
//   2. "a coin base is" -> "coinbase is"               (t 21.80; whisper medium on an isolated
//      19.5-24.0 s window returns "A Coinbase is smaller than Robinhood", so the token is Coinbase)
//   3. "1" + ".97" merged by the builder to "1.97"     (t 3.28)
//   4. NOT changed: "2024, not 2020" (t 46.22). clip-plan/tighten-plan expected "not 2025", but two
//      independent whisper-medium passes on the final spine (full file and a 45.6-48.6 s window,
//      also at 0.7x speed) BOTH return "2020", and the token only occupies 0.40 s vs 0.78 s for the
//      preceding "2024" - too few syllables for "twenty twenty five". Captioned as transcribed.
//   5. The delegation's "gets out of Robert Hood spot listening" garble does NOT exist in this
//      spine's medium transcript; it already reads "if it gets that robinhood spot listing".
// No em dashes anywhere. Persona corrections (tau -> TAO, Casper -> Kaspa) do not apply to this clip.
//
// Colour code (see _kit colourize): <b> blue #3aa0ff = Brett / Base / Coinbase (the Base-chain side),
// <gr> green #39ff14 = $WHATIF and Robinhood upside (100x, 1000x, bigger, huge, robinhood),
// <y> yellow #ffe600 = the market-cap numbers, <r> red #ff5252 = the risk word.

export const CAPTIONS_WHATIF_BIGGER_THAN_BRETT: { t: number; h: string }[] = [
  { t:   0.00, h: 'i think it' },
  { t:   0.64, h: 'could <gr>100x</gr>' },
  { t:   1.24, h: 'from here.' },
  { t:   1.84, h: 'right.' },
  { t:   2.06, h: 'i compared it' },
  { t:   2.58, h: 'to <b>brett.</b>' },
  { t:   3.28, h: 'made it to a <y>1.97</y>' },
  { t:   5.28, h: '<y>billion</y> market cap.' },
  { t:   6.62, h: 'and then this' },
  { t:   7.12, h: 'thing for many' },
  { t:   7.84, h: 'reasons is going' },
  { t:   8.42, h: 'to be <gr>bigger</gr>' },
  { t:   8.90, h: 'than <b>brett</b> and' },
  { t:   9.60, h: '<b>brett</b> went to' },
  { t:  10.16, h: '<y>two billion.</y>' },
  { t:  10.68, h: 'so you\'re talking' },
  { t:  11.72, h: 'like <gr>100x</gr>' },
  { t:  12.44, h: 'from here, right?' },
  { t:  13.32, h: 'there will be' },
  { t:  13.90, h: '<r>retracements,</r> right?' },
  { t:  14.72, h: 'and probably won\'t' },
  { t:  15.32, h: 'do that overnight' },
  { t:  16.12, h: 'but you know' },
  { t:  17.28, h: 'i think it\'ll' },
  { t:  17.88, h: 'do that eventually.' },
  { t:  18.86, h: 'now <b>base</b> is' },
  { t:  20.14, h: 'smaller than <gr>robinhood</gr>' },
  { t:  21.62, h: 'right?' },
  { t:  21.80, h: '<b>coinbase</b> is' },
  { t:  22.56, h: 'smaller than <gr>robinhood.</gr>' },
  { t:  23.42, h: 'so it stands' },
  { t:  24.42, h: 'to reason that' },
  { t:  25.40, h: 'there\'s going to' },
  { t:  25.78, h: 'be more attention' },
  { t:  26.54, h: 'brought to meme' },
  { t:  27.74, h: 'coins on the' },
  { t:  28.78, h: '<gr>robinhood</gr> chain.' },
  { t:  29.62, h: 'if those memes' },
  { t:  30.16, h: 'managed to be' },
  { t:  30.90, h: 'listed on the' },
  { t:  31.70, h: '<gr>robinhood</gr> app.' },
  { t:  32.64, h: 'so you\'re going' },
  { t:  33.10, h: 'to get exposure' },
  { t:  34.40, h: 'from regular stock' },
  { t:  36.00, h: 'retail customers.' },
  { t:  37.06, h: 'i think it\'s' },
  { t:  37.78, h: 'probably going to' },
  { t:  38.20, h: 'be a lot more than' },
  { t:  39.18, h: '<b>brett</b> to be' },
  { t:  39.80, h: 'honest.' },
  { t:  40.30, h: 'and not only that, if' },
  { t:  41.42, h: 'you think about' },
  { t:  41.96, h: 'it this way' },
  { t:  42.72, h: '<b>brett</b> did this' },
  { t:  43.82, h: 'in december of' },
  { t:  46.22, h: '2024, not 2020, in like' },
  { t:  47.94, h: 'a local run' },
  { t:  48.94, h: 'up, that was not the' },
  { t:  50.90, h: 'cycle top.' },
  { t:  51.60, h: '<b>brett</b> did this.' },
  { t:  52.38, h: 'so the potential' },
  { t:  53.10, h: 'here, the potential' },
  { t:  54.00, h: 'is <gr>huge.</gr>' },
  { t:  54.66, h: 'because like i' },
  { t:  55.02, h: 'tell people, even' },
  { t:  55.90, h: 'you get in now' },
  { t:  56.72, h: 'obviously you\'re not' },
  { t:  57.26, h: 'going to look' },
  { t:  57.58, h: 'at <gr>1000x</gr> for' },
  { t:  58.94, h: 'now.' },
  { t:  59.20, h: 'it would be' },
  { t:  59.64, h: 'like a <y>35</y>' },
  { t:  60.68, h: '<y>billion</y> dollar one.' },
  { t:  62.08, h: 'right.' },
  { t:  62.68, h: 'i\'ll be crazy.' },
  { t:  64.32, h: 'but if it gets that' },
  { t:  65.24, h: '<gr>robinhood</gr> spot listing,' },
  { t:  66.54, h: 'it\'s on the app and' },
  { t:  67.68, h: 'we get into a' },
  { t:  68.36, h: 'cycle top scenario' },
  { t:  70.08, h: 'you could be' },
  { t:  70.86, h: 'looking at a' },
  { t:  71.46, h: '<gr>100x</gr>, right?' },
  { t:  72.20, h: 'because you\'d be' },
  { t:  72.62, h: 'like a <y>three</y>' },
  { t:  73.44, h: '<y>billion.</y>' },
];
