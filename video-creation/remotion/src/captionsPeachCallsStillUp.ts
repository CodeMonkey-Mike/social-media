// batch peach / clip #2 - `calls-still-up-after-the-dump` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/peach/calls-still-up-after-the-dump/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_PCH2 --max-secs 1.6
//     --colorize 'y=orbio,pieverse,$1.91,10x gr=up,excellent,awesome,unbelievable,unaffected,good,plays,holy,crap r=low,dumps'
// WORD SOURCE: whisper-words-verified.json = the clip's own small-model word pass with: the 3.92-6.28 garble
// ("or be oh how's all the or you was? Okay was") -> "ORBIO, how's ORBIO? ORBIO was" (prompted medium.en pass + the
// ORBIO/NVDA chart on screen; the clip-plan's "OREO" is wrong), "for my call" -> "from my call" x2, "orbeo" -> ORBIO,
// "pi verse" -> Pieverse x3, "a dollar 91" -> $1.91, "were my group" -> "were in my group" (clip-plan stt fix),
// "Uh," dropped, "now" -> "now." (medium.en punctuation), and "Ooh." added at 31.90 (gap scan: audio present,
// medium.en hears "Ooh."). Other gaps explained: held "yeah" 12.5-14.6, the dropped "uh" 35.85-36.3.
export const CAPTIONS_PCH2: { t: number; h: string }[] = [
  { t:   0.00, h: 'yeah, i never' },
  { t:   0.76, h: 'imagined that these' },
  { t:   1.60, h: 'some of these' },
  { t:   2.04, h: 'things would be' },
  { t:   2.60, h: 'so <r>low</r> right' },
  { t:   3.52, h: 'now.' },
  { t:   3.90, h: '<y>orbio,</y> how\'s' },
  { t:   4.82, h: '<y>orbio?</y>' },
  { t:   6.20, h: 'was one of my' },
  { t:   6.86, h: '<gr>excellent</gr> <gr>plays</gr> right' },
  { t:   8.18, h: 'still <gr>up</gr> from' },
  { t:   8.98, h: 'my call.' },
  { t:   9.38, h: 'look at that' },
  { t:  11.58, h: '<gr>holy</gr> <gr>crap.</gr>' },
  { t:  13.08, h: 'yeah' },
  { t:  14.62, h: 'look at that' },
  { t:  16.06, h: 'still <gr>up</gr> from' },
  { t:  16.90, h: 'my call <y>orbio.</y>' },
  { t:  18.44, h: '<gr>unbelievable.</gr>' },
  { t:  19.32, h: 'i did my' },
  { t:  20.04, h: '<y>pieverse</y> video' },
  { t:  21.20, h: '<y>pieverse</y> doing pretty' },
  { t:  22.16, h: '<gr>good</gr> right now' },
  { t:  22.84, h: '<y>$1.91.</y>' },
  { t:  23.78, h: 'yeah, it\'s <gr>good</gr> yeah' },
  { t:  25.22, h: 'it\'s hanging in' },
  { t:  25.84, h: 'there.' },
  { t:  26.02, h: 'look at this' },
  { t:  26.38, h: 'weekly.' },
  { t:  26.74, h: 'it\'s almost <gr>unaffected</gr>' },
  { t:  27.84, h: 'like almost <gr>unaffected</gr>' },
  { t:  29.22, h: 'from the <r>dumps</r>' },
  { t:  29.86, h: 'yesterday <y>pieverse.</y>' },
  { t:  30.66, h: 'look at that' },
  { t:  31.90, h: 'ooh.' },
  { t:  32.44, h: 'yeah, when you see a' },
  { t:  33.36, h: 'coin like this man' },
  { t:  34.00, h: 'that\'s <gr>awesome.</gr>' },
  { t:  34.60, h: 'this is one of my' },
  { t:  35.38, h: '<gr>plays</gr>' },
  { t:  36.68, h: 'like if you were in' },
  { t:  37.16, h: 'my group you\'d' },
  { t:  37.82, h: 'be <gr>up</gr> <y>10x</y> on this' },
  { t:  38.74, h: 'right now' },
];
