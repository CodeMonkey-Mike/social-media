// batch ripping / clip #1 - `pieverse-17x-at-a-billion` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/ripping/pieverse-17x-at-a-billion/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_RIP1 --max-secs 1.6
//     --colorize "y=pieverse,17x,17.5x,17.5x?,20,million,1.05,billion,60,bot gr=up,ooh,holy,guacamole,called,going,good,happened,pumping"
// WORD SOURCE: whisper-words-verified.json = the clip's own whisper-words.json with 'pi verse' -> 'Pieverse'
// (2.30-3.18), '1 .05' -> '1.05', '17 .5 X?' -> '17.5x?', and an INSERTED 'Ooh!' 10.25-11.25: the JSON jumps from
// 'man.' (9.60) to 'Look' (11.40) over a loud exclamation (RMS -15..-21 dB; source 169.15-170.25 by
// cross-correlation, r=0.997). medium.en prompted with "holy guacamole" still reads 'Ooh,'; large-v3 reads nothing;
// the stream's "Holy guacamole" is at source 167.6-168.9, BEFORE the cut, so it is NOT captioned here.
// and an INSERTED 'Ooh!' 40.78-41.70: the held exclamation after "17.5x?" (RMS -24..-26 dB; medium.en reads "OOOOOOH"
// on both the render and the encode-matched control). The JSON had 40.72-42.10 as a pause. Found in post-render QA.
export const CAPTIONS_RIP1: { t: number; h: string }[] = [
  { t:   0.00, h: 'if you got' },
  { t:   1.10, h: 'into' },
  { t:   2.30, h: '<y>pieverse</y> when i' },
  { t:   3.66, h: '<gr>called</gr> it' },
  { t:   5.26, h: 'earlier this year' },
  { t:   6.78, h: 'you\'d be <gr>up</gr> over' },
  { t:   8.20, h: '<y>17x</y> man.' },
  { t:  10.25, h: '<gr>ooh!</gr>' },
  { t:  11.40, h: 'look at that and i' },
  { t:  12.96, h: '<gr>called</gr> it way' },
  { t:  13.32, h: 'back over here.' },
  { t:  14.44, h: 'my <y>bot</y> <gr>called</gr>' },
  { t:  15.40, h: 'it at a <y>20</y>' },
  { t:  16.46, h: '<y>million</y> market cap.' },
  { t:  17.48, h: 'it started shooting' },
  { t:  18.14, h: 'off these messages.' },
  { t:  19.36, h: 'started <gr>going</gr> <gr>up</gr>' },
  { t:  20.14, h: 'like, i don\'t know, it' },
  { t:  21.20, h: 'looks pretty <gr>good.</gr>' },
  { t:  21.96, h: 'i don\'t want to buy' },
  { t:  22.66, h: 'it because it\'s' },
  { t:  23.04, h: '<gr>going</gr> <gr>up.</gr>' },
  { t:  23.38, h: 'then it came down a' },
  { t:  24.36, h: 'little and i' },
  { t:  24.98, h: 'bought it down' },
  { t:  25.44, h: 'in here and then look' },
  { t:  26.62, h: 'what <gr>happened.</gr>' },
  { t:  27.86, h: 'we\'re doing this' },
  { t:  29.18, h: 'right now.' },
  { t:  29.94, h: '<gr>holy</gr> <gr>guacamole</gr>' },
  { t:  31.30, h: 'dude.' },
  { t:  32.06, h: 'so it\'s like <y>1.05</y>' },
  { t:  33.58, h: '<y>billion,</y> right?' },
  { t:  34.90, h: 'so it\'s like' },
  { t:  35.26, h: 'divided by <y>60</y>' },
  { t:  36.10, h: 'because it was' },
  { t:  36.52, h: '<y>60</y> <y>million</y> market' },
  { t:  37.34, h: 'cap.' },
  { t:  37.56, h: 'so is that a' },
  { t:  38.94, h: '<y>17.5x?</y>' },
  { t:  40.78, h: '<gr>ooh!</gr>' },
  { t:  42.10, h: '<gr>holy</gr>' },
  { t:  42.66, h: '<gr>guacamole</gr> dude.' },
];
