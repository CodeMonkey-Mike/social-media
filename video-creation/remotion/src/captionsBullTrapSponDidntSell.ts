// batch bull-trap / clip #3 - `spon-didnt-sell-holding-the-line` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/bull-trap/spon-didnt-sell-holding-the-line/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_BT3 --max-secs 1.6
//     --colorize "gr=bullish,holding,line,first,take,off,tech,unique y=spon,discord,research,deep,members,project,investigative r=down,ship,sell,nothing,random"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en
// staggered-window decodes (_qa/res_stt.json) + large-v3 spot checks (_qa/res_lg.json):
// "Spawn" -> "SPON"; "bean" -> "meme" (clip-plan stt_caption_fixes). "a ship" KEPT as spoken (all three
// decoders hear "a"). GAP SCAN: no unexplained gaps.
export const CAPTIONS_BT3: { t: number; h: string }[] = [
  { t:   0.00, h: '<y>spon</y> is another' },
  { t:   1.22, h: 'interesting one.' },
  { t:   2.04, h: 'now i have put some' },
  { t:   3.14, h: 'really <y>deep</y> <y>research</y>' },
  { t:   4.44, h: 'into this and i\'m' },
  { t:   5.84, h: 'still <gr>holding</gr> so' },
  { t:   6.96, h: 'my <y>members</y> are' },
  { t:   7.74, h: '<gr>holding</gr> i\'m in' },
  { t:   8.72, h: 'and like if it goes' },
  { t:   9.42, h: '<r>down</r> i\'m going' },
  { t:   9.88, h: '<r>down</r> with a <r>ship</r> i' },
  { t:  10.90, h: 'didn\'t <r>sell</r> for' },
  { t:  11.76, h: 'any of you who are' },
  { t:  12.54, h: 'not in my' },
  { t:  13.14, h: '<y>discord</y> and have' },
  { t:  14.28, h: 'bought into this' },
  { t:  15.02, h: 'because i\'ve been' },
  { t:  15.74, h: 'talking about it' },
  { t:  16.62, h: 'publicly just so' },
  { t:  18.10, h: 'you know, i\'m' },
  { t:  18.92, h: 'still <gr>bullish</gr> on' },
  { t:  20.04, h: 'it and i\'m' },
  { t:  20.74, h: 'still <gr>holding</gr> the' },
  { t:  21.54, h: '<gr>line</gr> they have' },
  { t:  22.42, h: 'a <y>project</y>' },
  { t:  23.68, h: 'behind the scenes' },
  { t:  24.56, h: 'it\'s not just like a' },
  { t:  25.74, h: '<r>random</r> meme that' },
  { t:  26.42, h: 'does <r>nothing</r> put' },
  { t:  27.16, h: 'a lot of you know' },
  { t:  28.14, h: '<y>investigative</y> effort into' },
  { t:  29.34, h: 'it and it has' },
  { t:  30.70, h: 'something good going' },
  { t:  31.62, h: 'on for it.' },
  { t:  32.40, h: 'it\'s like its own' },
  { t:  33.44, h: '<gr>unique</gr> <gr>tech</gr> so' },
  { t:  34.46, h: 'when you have the' },
  { t:  35.02, h: '<gr>first</gr> type of' },
  { t:  35.88, h: 'anything you usually' },
  { t:  36.66, h: '<gr>take</gr> <gr>off</gr>' },
];
