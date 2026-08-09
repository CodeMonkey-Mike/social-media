// captionsPsp.ts — captions for "If You Can Stick Through This Pain, You Win"
// batch peach-minute, clip #2, slug 02-the-pain-stick-through
//
// Built from the clip's whisper-words.json with the canonical caption skill
// (video-creation/skills/captions/build_captions.py --style montserrat), then hand-corrected.
//
// CORRECTIONS APPLIED (Whisper mishears in this clip):
//   "gonna crazy"            -> "kind of crazy". The delegation asked for "gone crazy" off the small
//                               model; medium WITH CONTEXT (0-9 s of the spine, and the full final
//                               mix) reads "so it is KIND OF crazy man" twice, which also fits the
//                               0.84-1.02 slot and is the only idiomatic reading. Deviation reported.
//   "are letos way up, but you know" -> "carlito's way ... pacino". Medium on the full mix reads
//                               "Carlitos way out Pacino here come the pain" and on 0-9 s of the spine
//                               "Barleto's way out Pacino here come the pain": he is naming CARLITO'S
//                               WAY (the Al Pacino film the "here come the pain" line is from), so the
//                               fragment is captioned, not dropped. Small's "but you know" was "uh,
//                               Pacino" all along.
//   "up by take profits"     -> "i take profits"
//   "everybody in their"     -> "everybody and their"
//   "thought that we're gonna" -> "thought they were gonna"
//   "flammowing / flummoing" -> "fomoing" (FOMOing; the band renders lowercase by house style)
// No em dashes anywhere on screen.
//
// Colour tags (_kit colourize): <g> teal, <y> yellow, <gr> green, <r> red.
export const CAPTIONS_PSP: { t: number; h: string }[] = [
  { t:  0.00, h: 'so it is' },
  { t:  0.84, h: 'kind of crazy man' },
  { t:  1.80, h: 'this is like' },
  { t:  2.64, h: 'the <r>pain</r> man' },
  { t:  3.40, h: 'the <r>pain</r>' },
  { t:  5.82, h: 'carlito\'s way' },
  { t:  6.86, h: '<y>pacino</y>' },
  { t:  7.50, h: 'here come the <r>pain</r>' },
  { t:  8.50, h: 'yeah man' },
  { t:  8.94, h: 'but if you\'re' },
  { t:  9.82, h: 'in it man' },
  { t: 10.30, h: 'it\'s like if you' },
  { t: 11.02, h: 'can stick through' },
  { t: 11.64, h: 'this and you' },
  { t: 12.24, h: 'haven\'t checked out' },
  { t: 13.02, h: 'like everybody else' },
  { t: 13.90, h: 'you know in the' },
  { t: 15.16, h: 'long run you\'re' },
  { t: 15.90, h: 'gonna be making' },
  { t: 16.48, h: 'a lot of <gr>money</gr>' },
  { t: 17.38, h: 'you\'re gonna be' },
  { t: 17.66, h: '<gr>sitting pretty</gr>' },
  { t: 18.18, h: 'i like the' },
  { t: 18.76, h: '<g>volatility</g>' },
  { t: 19.26, h: 'i like the' },
  { t: 19.92, h: '<g>volatility</g>' },
  { t: 20.28, h: 'i don\'t like' },
  { t: 20.84, h: 'the way things' },
  { t: 21.32, h: 'just stay <r>flat</r>' },
  { t: 22.16, h: 'it goes up' },
  { t: 22.82, h: 'i <gr>take profits</gr>' },
  { t: 23.72, h: 'right?' },
  { t: 24.38, h: 'it comes back down' },
  { t: 25.10, h: 'and buy back in' },
  { t: 25.86, h: 'so if things' },
  { t: 27.04, h: 'go down over' },
  { t: 28.34, h: 'the next <y>30 to 40</y>' },
  { t: 29.28, h: 'days okay' },
  { t: 30.18, h: 'why not just' },
  { t: 30.86, h: 'buy some more' },
  { t: 31.46, h: '<gr>lower prices</gr>' },
  { t: 32.10, h: 'if it goes up' },
  { t: 32.84, h: 'after that because' },
  { t: 33.70, h: 'everybody and their' },
  { t: 34.74, h: 'grandma is gonna' },
  { t: 35.68, h: 'be buying back in' },
  { t: 36.74, h: 'in <y>october</y>' },
  { t: 37.38, h: 'then things are' },
  { t: 38.24, h: 'gonna go up' },
  { t: 38.80, h: 'and i\'ll just' },
  { t: 39.18, h: '<gr>take profits</gr>' },
  { t: 40.90, h: 'i\'ll sell to the' },
  { t: 41.90, h: 'people who thought' },
  { t: 43.08, h: 'they were gonna' },
  { t: 43.68, h: 'buy back in' },
  { t: 44.54, h: 'at the bottom' },
  { t: 45.08, h: '<y>fomoing</y> in' },
  { t: 45.98, h: 'because prices' },
  { t: 46.66, h: 'are going <gr>nuts</gr>' },
];
