// batch ripping / clip #6 - `pieverse-17x-at-a-billion-impact` (IMPACT)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/ripping/pieverse-17x-at-a-billion-impact/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_RIP6
//     --colorize "y=pieverse,billion,17x,10x,x402,billions,170x gr=pumping,holy,crap,payments"
// WORD SOURCE: whisper-words-verified.json = the clip's own whisper-words.json with the STT fixes confirmed by a
// whole-file medium.en re-decode: 'out of billion' x2 -> 'at a billion', 'I versus' / 'pi versus' -> 'Pieverse is',
// 'x4 to a' -> 'x402', '17x something' -> '17x. that thing', "I'm gonna" -> 'probably gonna', 'days is' ->
// "billions it's", "That's" -> 'That', 'a hundred seventy' -> '170x.' (ends ~28.50 by RMS); sentence stops added
// after 'billion' (3.68), 'man' (9.92), 'covered' (14.70), 'now' (21.40) so no group straddles a sentence.
export const CAPTIONS_RIP6: { t: number; h: string }[] = [
  { t:   0.00, h: '<gr>holy</gr> <gr>crap,</gr> we\'re at a' },
  { t:   1.30, h: '<y>billion.</y>' },
  { t:   1.56, h: 'i can\'t believe' },
  { t:   2.24, h: 'it.' },
  { t:   2.46, h: 'we\'re actually at' },
  { t:   3.38, h: 'a <y>billion.</y>' },
  { t:   4.16, h: 'and then we have' },
  { t:   5.64, h: 'agent to agent' },
  { t:   6.72, h: '<gr>payments,</gr> which is' },
  { t:   7.96, h: 'why <y>pieverse</y> is' },
  { t:   9.36, h: '<gr>pumping</gr> man.' },
  { t:  10.62, h: 'because <y>pieverse</y> is' },
  { t:  11.84, h: 'in the <y>x402</y>' },
  { t:  13.22, h: 'narrative man.' },
  { t:  13.88, h: 'we got our' },
  { t:  14.46, h: 'bases covered.' },
  { t:  16.18, h: '<y>17x.</y>' },
  { t:  16.70, h: 'that thing is' },
  { t:  17.30, h: 'still gonna be' },
  { t:  17.90, h: '<gr>pumping.</gr>' },
  { t:  18.34, h: 'probably gonna do' },
  { t:  19.00, h: 'another <y>10x</y> on' },
  { t:  20.62, h: 'top of where' },
  { t:  21.02, h: 'it is right' },
  { t:  21.40, h: 'now.' },
  { t:  22.06, h: 'who knows how' },
  { t:  22.78, h: 'many <y>billions</y> it\'s' },
  { t:  23.56, h: 'gonna get to?' },
  { t:  25.90, h: 'that <y>17x</y> could' },
  { t:  27.14, h: 'turn into like <y>170x.</y>' },
];
