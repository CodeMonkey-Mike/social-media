// batch uptober / clip #1 - `spawn-doubled-for-the-haters` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/uptober/spawn-doubled-for-the-haters/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_UPT1 --max-secs 1.6
//     --colorize "gr=50k,101k,200k,doubled,money,100x,50x,5,million,guacamole y=discord,stream,woo,holy,dedicated,buy r=haters,hating,dead"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en
// staggered-window decodes (shorts/uptober/spawn-doubled-for-the-haters/_qa/res_stt.json) + clip-plan
// stt_caption_fixes: disk -> Discord; the "WOOHOOO!" the base JSON OMITTED (gap 13.34-15.48) inserted at
// 14.56-15.65 from the RMS envelope; "Holy guac. Only guacamole" false start dropped -> "holy guacamole";
// "I can go" -> "it can go"; "and the market cap" -> "if the market cap"; "going to" -> "gonna";
// "y" + "'all" -> "y'all".
// GAP SCAN: 13.34-14.56 is a real pause after "I'm like," (nothing voiced, RMS < -46 dB); 19.26-20.84
// is a pause after "guacamole." (blanked in the comp at 19.70).
export const CAPTIONS_UPT1: { t: number; h: string }[] = [
  { t:   0.00, h: 'this one is' },
  { t:   1.40, h: '<y>dedicated</y>' },
  { t:   2.22, h: 'to' },
  { t:   3.64, h: 'all y\'all <r>haters</r>' },
  { t:   5.06, h: 'out there.' },
  { t:   6.02, h: 'but i was' },
  { t:   6.34, h: 'talking about it' },
  { t:   7.12, h: 'yesterday on <y>stream.</y>' },
  { t:   8.40, h: 'i had <r>haters</r>' },
  { t:   9.00, h: 'in my own' },
  { t:   9.62, h: '<y>discord</y> <r>hating</r> on' },
  { t:  10.92, h: 'this play' },
  { t:  11.56, h: 'and i\'m' },
  { t:  13.06, h: 'like' },
  { t:  14.56, h: '<y>woo!</y>' },
  { t:  15.85, h: 'look what we did, man.' },
  { t:  17.34, h: '<y>holy</y>' },
  { t:  18.42, h: '<gr>guacamole.</gr>' },
  { t:  20.84, h: 'so <gr>50k.</gr>' },
  { t:  21.96, h: 'i was talking' },
  { t:  22.70, h: 'about it here.' },
  { t:  24.38, h: 'went up, <gr>doubled</gr>' },
  { t:  25.52, h: 'our <gr>money.</gr>' },
  { t:  26.12, h: 'it was at <gr>50k</gr>' },
  { t:  27.14, h: 'yesterday and it\'s' },
  { t:  27.94, h: 'at <gr>101k</gr> today.' },
  { t:  29.20, h: 'it is definitely' },
  { t:  29.98, h: 'not <r>dead</r> and it\'s just' },
  { t:  31.18, h: 'waiting for you' },
  { t:  31.82, h: 'guys to <y>buy</y> in.' },
  { t:  32.84, h: 'but it can go to' },
  { t:  33.60, h: '<gr>200k</gr> if the' },
  { t:  34.60, h: 'market cap goes' },
  { t:  35.24, h: 'to <gr>5</gr> <gr>million</gr>' },
  { t:  36.36, h: 'and that\'s <gr>100x.</gr>' },
  { t:  37.38, h: 'well, at least' },
  { t:  37.74, h: 'from yesterday you' },
  { t:  38.64, h: 'guys get in now.' },
  { t:  39.60, h: 'you\'re gonna do' },
  { t:  40.06, h: 'like a <gr>50x.</gr>' },
  { t:  40.90, h: 'it goes to <gr>5</gr>' },
  { t:  41.48, h: '<gr>million.</gr>' },
  { t:  41.80, h: 'but if you got in' },
  { t:  42.70, h: 'yesterday when i' },
  { t:  43.44, h: 'told you, yeah, it' },
  { t:  44.18, h: 'could be like' },
  { t:  44.62, h: '<gr>100x.</gr>' },
];
