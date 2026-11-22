// batch ripping / clip #5 - `anthropic-ipo-money-rotating-out` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/ripping/anthropic-ipo-money-rotating-out/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_RIP5 --max-secs 1.6 --max-short 4
//     --colorize "y=spacex,anthropic,ipo,ipo.,money,weekly,weeks gr=plays,pumping,crazy,insane r=rotating,out,bottomed,down,further"
// WORD SOURCE: whisper-words-verified.json = the clip's whisper-words.json with ONE patch: 28.84-29.54
// "I'm gonna get a pump in" -> "that are pumping," (3 of 4 staggered decodes, incl. large-v3, hear "that are
// pumping"; _qa/build/res_pre.json). A phrase correction cannot do it (the fix is a different word count), so the
// words file is patched per the contract. No gap > 0.35 s anywhere in the word stream.
export const CAPTIONS_RIP5: { t: number; h: string }[] = [
  { t:   0.00, h: 'this was like the' },
  { t:   1.54, h: '<y>spacex</y> <y>ipo,</y> right?' },
  { t:   2.96, h: 'and so now the' },
  { t:   4.22, h: 'thing is this' },
  { t:   4.94, h: 'is the <y>anthropic</y>' },
  { t:   5.70, h: '<y>ipo.</y>' },
  { t:   6.50, h: 'all this <y>money</y>' },
  { t:   7.14, h: '<r>rotating</r> <r>out</r> by' },
  { t:   8.40, h: 'the <y>anthropic</y> <y>ipo.</y>' },
  { t:   9.30, h: '<y>spacex</y> <y>ipo,</y> i' },
  { t:  10.64, h: 'believe it was' },
  { t:  11.34, h: 'like over here.' },
  { t:  12.34, h: 'this date, candles' },
  { t:  13.16, h: 'are <y>weekly,</y> it' },
  { t:  13.72, h: 'was a few more' },
  { t:  14.32, h: '<y>weeks</y> before it' },
  { t:  15.12, h: 'actually <r>bottomed</r> over' },
  { t:  15.90, h: 'here.' },
  { t:  16.28, h: 'does that mean that' },
  { t:  16.98, h: 'we\'re gonna have' },
  { t:  17.62, h: 'like a bunch' },
  { t:  18.16, h: 'of extra <y>weeks</y>' },
  { t:  19.00, h: 'going here, maybe' },
  { t:  20.06, h: 'a little bit' },
  { t:  20.46, h: '<r>further</r> <r>down</r> the' },
  { t:  21.38, h: 'same way this' },
  { t:  21.90, h: 'happened over here?' },
  { t:  22.78, h: 'well, you know, it' },
  { t:  23.44, h: 'is what it is' },
  { t:  24.12, h: 'we\'ll take it as' },
  { t:  24.80, h: 'it comes.' },
  { t:  25.30, h: 'man, i have no' },
  { t:  26.16, h: 'problem with it' },
  { t:  26.58, h: 'right now because' },
  { t:  27.28, h: 'like got a few' },
  { t:  28.16, h: '<gr>plays,</gr> man, that' },
  { t:  28.96, h: 'are <gr>pumping,</gr> like' },
  { t:  29.82, h: 'at a day like' },
  { t:  30.82, h: 'this, it\'s <gr>crazy.</gr>' },
  { t:  31.88, h: 'absolutely <gr>insane.</gr>' },
];
