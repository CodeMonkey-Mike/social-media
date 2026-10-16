// batch grapes / clip #3 - `golden-kitty-one-of-five-impact` (IMPACT)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/grapes/golden-kitty-one-of-five-impact/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_GK3 --max-secs 1.6 --quote "0:4.6"
//     --colorize "gr=started,opportunity,3.2,million,discount,life,five y=golden,kitty,one r=dying"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en
// staggered 8 s windows every 2 s + a whole-file pass (shorts/grapes/golden-kitty-one-of-five-impact/
// _qa/res_stt.json) and the clip-plan stt_caption_fixes: "A wise one is known" -> "and wise ones know"
// (medium.en, every window); "tip" -> "dip" (the on-screen chat banner Mike reads aloud); "3 .2" -> "3.2";
// "getting at" -> "getting it at" (clip-plan; medium.en hears "getting that at", flagged for Mike's ear).
// --quote 0:4.6: the opening line is a VIEWER'S CHAT COMMENT read aloud (on the burned-in banner), so it
// is wrapped in quotation marks as reported speech.
// --max-secs 1.6: "five" is stretched (13.16-14.18 s).
// GAP SCAN: largest word gap 0.48 s (11.64 -> 12.12, a real pause); every medium.en window agrees.
export const CAPTIONS_GK3: { t: number; h: string }[] = [
  { t:   0.00, h: '"<y>golden</y> <y>kitty</y> is' },
  { t:   0.86, h: 'just getting <gr>started.</gr>' },
  { t:   1.98, h: 'and wise ones know this' },
  { t:   3.10, h: 'dip is a' },
  { t:   3.64, h: '<y>golden</y> <gr>opportunity.</gr>"' },
  { t:   4.78, h: 'it\'s a <y>golden</y>' },
  { t:   5.36, h: '<gr>opportunity</gr> to get' },
  { t:   6.40, h: 'into something that\'s' },
  { t:   7.30, h: 'not <r>dying.</r>' },
  { t:   8.20, h: 'get into this at a' },
  { t:   9.34, h: '<gr>3.2</gr> <gr>million,</gr> you\'re' },
  { t:  10.64, h: 'getting it at' },
  { t:  10.98, h: 'a <gr>discount.</gr>' },
  { t:  12.12, h: 'literally <y>one</y> of' },
  { t:  12.76, h: 'like <gr>five</gr>' },
  { t:  14.18, h: 'memes out there' },
  { t:  15.08, h: 'that\'s not <r>dying.</r>' },
  { t:  15.82, h: 'everything is <r>dying.</r>' },
  { t:  16.54, h: 'some will come back to' },
  { t:  17.48, h: '<gr>life.</gr>' },
  { t:  17.90, h: 'that\'s true.' },
  { t:  18.58, h: 'but nonetheless, everything' },
  { t:  19.46, h: 'is <r>dying.</r>' },
  { t:  20.26, h: 'everything is <r>dying.</r>' },
  { t:  21.00, h: 'except <gr>five</gr> of' },
  { t:  21.92, h: 'them and <y>golden</y>' },
  { t:  22.48, h: '<y>kitty</y> is <y>one</y>' },
  { t:  23.36, h: 'of them.' },
];
