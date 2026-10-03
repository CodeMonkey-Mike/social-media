// batch uptober / clip #6 - `october-coins-first-week-pump` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/uptober/october-coins-first-week-pump/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_OC6 --max-secs 1.6
//     --colorize "gr=75,million,70,29k,pump,2024 y=october,solana,pumpkin,first,week r=fast,hard"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en /
// large-v3 staggered-window decodes (shorts/uptober/october-coins-first-week-pump/_qa/stt_res.json,
// res_29k.json, res_upto.json, res_w26.json, res_wt.json): "going to" -> "gonna" x3; the false start
// "it did it on um," (8.20-9.46) dropped; "want to" restored at 27.12 (the tighten plan keeps it by design,
// 4/5 decodes of the 48 kHz AAC control hear it); sentence punctuation added for grouping.
// "October" is what is SPOKEN in every instance (medium.en AND large-v3, with and without an "Uptober"
// initial_prompt), so it stays "october" even where the screen shows the UPTOBER token.
// "I call this a 29K market cap" confirmed by 5 staggered decodes (medium.en + small.en).
// The canonical stutter-collapse folds "buy back in in October" to "buy back in / october." (reads clean).
// GAP SCAN: no unexplained holes; the only silence > 0.45 s is 8.20-9.52 (the dropped false start),
// blanked in the comp at 8.30.
export const CAPTIONS_OC6: { t: number; h: string }[] = [
  { t:   0.00, h: '<y>october</y> is one' },
  { t:   0.80, h: 'of those plays' },
  { t:   1.62, h: 'that it\'s gonna' },
  { t:   2.48, h: '<gr>pump</gr> <r>hard</r> and' },
  { t:   3.46, h: 'you\'re gonna get' },
  { t:   3.92, h: 'out really <r>fast.</r>' },
  { t:   4.74, h: 'this thing hit' },
  { t:   5.66, h: 'a <gr>75</gr> <gr>million</gr>' },
  { t:   6.80, h: 'market cap, and' },
  { t:   9.52, h: 'did it like in the' },
  { t:  10.42, h: '<y>first</y> <y>week</y> of' },
  { t:  11.04, h: '<y>october?</y>' },
  { t:  11.66, h: 'so on <y>solana</y>' },
  { t:  12.60, h: 'imagine going up' },
  { t:  13.34, h: 'out of the blue' },
  { t:  13.90, h: 'going up to' },
  { t:  14.44, h: '<gr>70</gr> <gr>million.</gr>' },
  { t:  15.22, h: 'the <y>pumpkin</y> related' },
  { t:  16.38, h: 'ones will probably' },
  { t:  17.34, h: '<gr>pump</gr> in the' },
  { t:  18.04, h: 'ending of <y>october,</y>' },
  { t:  19.30, h: 'whereas the <y>october</y>' },
  { t:  20.68, h: 'related coins will' },
  { t:  21.64, h: 'probably <gr>pump</gr> in' },
  { t:  22.86, h: 'the beginning of' },
  { t:  23.56, h: '<y>october.</y>' },
  { t:  24.04, h: 'i call this a' },
  { t:  25.18, h: '<gr>29k</gr> market cap' },
  { t:  26.30, h: 'because everybody\'s gonna' },
  { t:  27.12, h: 'want to buy back in' },
  { t:  28.06, h: '<y>october.</y>' },
  { t:  28.46, h: 'if we get that type' },
  { t:  29.42, h: 'of a <gr>pump</gr> we' },
  { t:  30.18, h: 'could be seeing' },
  { t:  30.70, h: 'something like in' },
  { t:  31.40, h: '<gr>2024</gr> like a <gr>70</gr>' },
  { t:  32.86, h: '<gr>million</gr> dollar type' },
  { t:  33.82, h: 'of <y>october</y> coin.' },
];
