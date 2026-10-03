// batch uptober / clip #3 - `no-job-is-safe-robots` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/uptober/no-job-is-safe-robots/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_NJ3
//     --colorize "gr=set,anything y=robot,crypto,five,years,future,unimaginable r=safe,torture,kill,bastard,nobody's"
//
// WORD SOURCE = whisper-words-VERIFIED.json = medium.en full-clip word timestamps on the staged spine, patched:
//   - "kill the best" -> "kill the bastard." (19.58-19.80). medium.en, large-v3 and the batch whisper-words.json
//     all hear "best" on the cut clip: the "-tard" tail is soft and ends at a desilence join (floor at
//     19.82-19.86). The whole-stream transcript reads "kill the bastard" (2390.44-2390.76), as do the clip-plan
//     peak beat and the tighten log ("audio ends 2390.70"). Flagged for Mike's ear.
//   - "gonna make be all set" -> "gonna be all set" (clip-plan stt_caption_fixes, clip 3).
//   - "a really really on like" -> "a really really like" (whole-stream transcript; "on" is a medium.en artefact).
//   - "and" held 13.90 -> 14.66 (RMS envelope is continuously voiced 14.0-14.8, a held "aaand", not a hole).
//   - "It's" after "bastard" starts 19.86 (after the 19.82-19.86 join floor).
//   PROTECTED_DOUBLES: ("a","really","really","like") added 2026-10-01 so "a really, really, like" keeps both limbs.
// GAP SCAN (2026-10-01, this build): after the held-"and" fix, no inter-word gap > 0.45 s; no omitted speech.
export const CAPTIONS_NJ3: { t: number; h: string }[] = [
  { t:   0.00, h: '<r>nobody\'s</r> <r>safe.</r>' },
  { t:   0.96, h: 'no job is <r>safe.</r>' },
  { t:   2.00, h: 'like a <y>robot</y>' },
  { t:   2.56, h: 'could really do' },
  { t:   3.44, h: '<gr>anything.</gr>' },
  { t:   4.06, h: 'you have a' },
  { t:   4.54, h: '<y>robot</y> in your' },
  { t:   5.18, h: 'house you don\'t' },
  { t:   5.96, h: 'need a plumber.' },
  { t:   6.72, h: 'you don\'t need an' },
  { t:   7.24, h: 'electrician.' },
  { t:   7.86, h: 'you don\'t need a' },
  { t:   8.40, h: 'roofer.' },
  { t:   8.72, h: 'you don\'t need a' },
  { t:   9.32, h: 'gardener you don\'t' },
  { t:  10.18, h: 'need like <gr>anything.</gr>' },
  { t:  11.02, h: 'you don\'t need a' },
  { t:  11.46, h: 'security guard.' },
  { t:  12.24, h: 'so if somebody' },
  { t:  12.66, h: 'wants to come' },
  { t:  13.22, h: 'to your house' },
  { t:  13.90, h: 'and try to like' },
  { t:  15.42, h: '<r>torture</r> you to' },
  { t:  15.96, h: 'get all your' },
  { t:  16.38, h: '<y>crypto.</y>' },
  { t:  16.74, h: 'i mean you have a' },
  { t:  17.58, h: '<y>robot</y> that can' },
  { t:  18.82, h: '<r>kill</r> the <r>bastard.</r>' },
  { t:  19.86, h: 'it\'s i think' },
  { t:  20.50, h: 'we\'re in for like an' },
  { t:  21.78, h: '<y>unimaginable</y> <y>future</y> a' },
  { t:  23.48, h: 'really really like' },
  { t:  24.56, h: 'an <y>unimaginable</y> <y>future</y>' },
  { t:  25.86, h: 'it\'s hard to' },
  { t:  26.82, h: 'imagine how it\'s' },
  { t:  27.62, h: 'gonna be just' },
  { t:  28.34, h: '<y>five</y> <y>years</y> from' },
  { t:  29.08, h: 'now and the good news' },
  { t:  30.30, h: 'is anybody here' },
  { t:  31.48, h: 'in <y>crypto</y> probably' },
  { t:  32.44, h: 'gonna be all' },
  { t:  33.24, h: '<gr>set</gr>' },
];
