// batch downtober / clip #2 - `tao-3000-is-not-the-ceiling` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/downtober/tao-3000-is-not-the-ceiling/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_DT2 --max-secs 1.6
//     --colorize "g=tao y=3000,three,fantastic,economic,soon gr=more,hell,expansion r=craziness"
// WORD SOURCE: whisper-words-verified.json = the clip's own word pass with 3x "How" -> TAO (Mike says "tau";
// medium.en whole-file reads "Tao" at 0.00 / 5.94 / 6.76, matching clip-plan stt_caption_fixes) and the weak
// 0.64 "is" dropped (absent from the TAO-prompted medium.en pass and from the chat line he is reading).
// "very, very soon." is kept whole by the ("expansion","very","very","soon") PROTECTED_DOUBLES entry
// (two measured limbs 18.45-18.79 / 18.865-19.03 s). GAP SCAN: no unexplained holes (_qa/stt_res.json).
// RETIME (post-render QA): "Yeah." 3.38 -> 2.58 in the verified words (RMS onset 2.58, medium.en 2.52-3.14);
// the 3.38 caption lagged the word by ~0.8 s. Fixed in the render by `render_short.py splice --frames 74-118`.
export const CAPTIONS_DT2: { t: number; h: string }[] = [
  { t:   0.00, h: '<g>tao</g> going to' },
  { t:   1.60, h: '<y>3000.</y>' },
  { t:   2.58, h: 'yeah.' },
  { t:   4.18, h: '<gr>hell</gr> yeah.' },
  { t:   4.90, h: 'i totally agree.' },
  { t:   5.80, h: '<g>tao</g> going to' },
  { t:   6.38, h: '<y>three.</y>' },
  { t:   6.56, h: 'i think <g>tao</g>' },
  { t:   7.42, h: 'can go a lot <gr>more</gr>' },
  { t:   8.42, h: 'than that in the long' },
  { t:   9.28, h: 'run, a lot <gr>more</gr> than' },
  { t:  10.12, h: 'that in the long run' },
  { t:  11.30, h: 'we just got some' },
  { t:  12.16, h: '<r>craziness</r> going on' },
  { t:  13.26, h: 'right now.' },
  { t:  13.96, h: 'we should be' },
  { t:  14.62, h: 'going into one' },
  { t:  15.54, h: '<gr>hell</gr> of a' },
  { t:  16.24, h: '<y>fantastic</y> <y>economic</y>' },
  { t:  17.68, h: '<gr>expansion.</gr>' },
  { t:  18.74, h: 'very, very <y>soon.</y>' },
];
