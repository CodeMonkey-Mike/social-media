// batch downtober / clip #3 - `long-term-plays-58x-350x` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/downtober/long-term-plays-58x-350x/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_DT3 --max-secs 1.6
//     --colorize "gr=$lab,350x,long-term y=58x,11,months b=velvet r=down,crazy"
// WORD SOURCE: whisper-words-verified.json = the clip's own word pass with: 1.12 "where" -> "when" (medium.en whole-clip
// + isolated 0-4 s both read "when they move"; clip pass p=0.49); 7.30 "Lab" -> "$LAB" (house spelling; the preset
// lowercases via CSS so only the cashtag separates the token from the English word "lab"); RMS-onset retimes
// "Called" 7.16 -> 7.03 and "350X" 13.50 -> 13.36 (payoff caption lands on the climax cut). "went down December," is
// kept AS SPOKEN (4 of 5 medium.en passes). --max-secs 1.6 bounds the stretched "350X" (1.08 s) run.
// GAP SCAN: largest inter-word gap 0.26 s, no unexplained holes (_qa/stt_res.json). Velvet = <b> (closest tag to its violet).
export const CAPTIONS_DT3: { t: number; h: string }[] = [
  { t:   0.00, h: 'they take a long time' },
  { t:   1.12, h: 'when they move.' },
  { t:   1.80, h: 'we did the <y>58x</y> on' },
  { t:   3.08, h: '<b>velvet</b> in june' },
  { t:   4.22, h: 'and i called' },
  { t:   4.68, h: 'it in july of last' },
  { t:   6.00, h: 'year, took <y>11</y>' },
  { t:   6.62, h: '<y>months.</y>' },
  { t:   7.03, h: 'called <gr>$lab</gr> in' },
  { t:   8.14, h: 'october.' },
  { t:   8.90, h: 'we dca\'d a' },
  { t:   9.60, h: 'little bit more' },
  { t:  10.06, h: 'in december because' },
  { t:  10.90, h: 'it went <r>down</r>' },
  { t:  11.64, h: 'december, and then' },
  { t:  12.78, h: 'it does a' },
  { t:  13.36, h: '<gr>350x</gr>' },
  { t:  14.54, h: 'in may.' },
  { t:  15.42, h: '<gr>long-term</gr> play, not' },
  { t:  16.78, h: 'these <r>crazy</r> things.' },
];
