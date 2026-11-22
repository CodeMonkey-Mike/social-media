// batch ripping / clip #2 - `calls-ripping-on-a-red-day` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/ripping/calls-ripping-on-a-red-day/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_RIP2 --max-secs 1.6
//     --colorize "y=pippin,velvet,89x,58x,100,three,june,codemonkey gr=green,ripping,pumping,up,plays,community,greatest,holy,crap,yeah r=dumping,red,crazy"
// WORD SOURCE: whisper-words-verified.json = the clip's own whisper-words.json with "crypt of" -> "crypto"
// (38.00-38.54). Gap scan: 11.42-11.90 and 39.60-40.34 are breaths (the second sits over the stream's black frames).
// "code monkey" -> "codemonkey" is the skill's own token merge.
export const CAPTIONS_RIP2: { t: number; h: string }[] = [
  { t:   0.00, h: 'the <r>crazy</r> thing' },
  { t:   0.86, h: 'is, the entire' },
  { t:   2.06, h: 'market is <r>dumping</r>' },
  { t:   3.60, h: 'right now.' },
  { t:   4.54, h: 'look at all this <r>red.</r>' },
  { t:   5.58, h: 'this entire page' },
  { t:   7.06, h: 'has only <y>three</y>' },
  { t:   8.18, h: '<gr>green</gr> bubbles out' },
  { t:   9.20, h: 'of <y>100.</y>' },
  { t:  10.00, h: 'this is <r>crazy.</r>' },
  { t:  11.90, h: '<y>pippin,</y> we did' },
  { t:  12.80, h: 'an <y>89x</y> at the' },
  { t:  14.24, h: 'beginning of this' },
  { t:  14.98, h: 'year.' },
  { t:  15.60, h: '<y>pippin</y> was freaking' },
  { t:  16.48, h: '<gr>ripping</gr> and suddenly' },
  { t:  17.34, h: 'is <gr>ripping</gr> again.' },
  { t:  18.50, h: '<y>velvet,</y> another one' },
  { t:  19.16, h: 'of my <gr>plays</gr>' },
  { t:  19.72, h: 'is <gr>pumping.</gr>' },
  { t:  20.60, h: '<y>velvet,</y> <y>58x</y>' },
  { t:  21.84, h: 'in' },
  { t:  22.86, h: '<y>june,</y> just a few' },
  { t:  24.28, h: 'months back.' },
  { t:  25.20, h: 'and i think' },
  { t:  25.44, h: 'this thing is' },
  { t:  26.04, h: '<gr>pumping</gr> again.' },
  { t:  26.94, h: 'it knows that' },
  { t:  27.82, h: 'i\'m going live' },
  { t:  28.68, h: 'and it\'s going' },
  { t:  29.32, h: '<gr>up.</gr>' },
  { t:  29.62, h: 'all these <gr>plays</gr>' },
  { t:  30.78, h: 'in my <gr>community</gr>' },
  { t:  31.68, h: 'are <gr>pumping.</gr>' },
  { t:  32.42, h: 'everybody else is' },
  { t:  33.52, h: '<r>dumping,</r> man.' },
  { t:  34.24, h: '<gr>holy</gr> <gr>crap.</gr>' },
  { t:  35.26, h: 'and that\'s why' },
  { t:  35.92, h: '<y>codemonkey</y> mike has' },
  { t:  37.16, h: 'the <gr>greatest</gr> crypto' },
  { t:  38.54, h: '<gr>community</gr> on the' },
  { t:  39.28, h: 'planet.' },
  { t:  40.34, h: 'hell <gr>yeah,</gr> man.' },
];
