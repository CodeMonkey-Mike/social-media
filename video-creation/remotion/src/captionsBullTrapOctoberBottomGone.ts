// batch bull-trap / clip #4 - `october-bottom-talk-is-gone` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/bull-trap/october-bottom-talk-is-gone/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_BT4 --max-secs 1.6
//     --colorize "o=bitcoin,cnbc,october,bull,official,new,highs,50-week y=bottom,millions,talk,openly,above,staying r=gone,bear,completely"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en staggered windows +
// large-v3 (_qa/res_stt.json): "No all-time highs soon" -> "New all-time highs soon" (3/5 decodes + the tweet on screen
// reads NEW ATHs SOON). GAP SCAN: no unexplained gaps (max inter-word gap 0.26 s).
export const CAPTIONS_BT4: { t: number; h: string }[] = [
  { t:   0.00, h: 'what happened to' },
  { t:   1.00, h: 'all the <y>talk</y>' },
  { t:   1.60, h: 'about how the' },
  { t:   2.48, h: '<y>bottom</y> is going' },
  { t:   3.12, h: 'to happen in' },
  { t:   3.76, h: '<o>october?</o>' },
  { t:   4.22, h: 'what happened to' },
  { t:   4.96, h: 'all that <y>talk?</y>' },
  { t:   5.88, h: 'it\'s almost like' },
  { t:   6.40, h: 'it\'s <r>completely</r> <r>gone</r>' },
  { t:   7.44, h: 'right now.' },
  { t:   8.28, h: '<o>cnbc</o> is telling' },
  { t:   9.42, h: 'its <y>millions</y> of' },
  { t:  10.18, h: 'viewers that <o>bitcoin</o>' },
  { t:  11.00, h: 'is setting up' },
  { t:  11.58, h: 'for a massive' },
  { t:  12.18, h: '<o>bull</o> market.' },
  { t:  12.94, h: 'they\'re <y>openly</y> telling' },
  { t:  13.76, h: 'you, <o>october</o> is' },
  { t:  14.70, h: 'here.' },
  { t:  15.10, h: '<o>new</o> all-time <o>highs</o>' },
  { t:  15.82, h: 'soon.' },
  { t:  16.28, h: 'we broke out' },
  { t:  16.72, h: 'of the <r>bear</r>' },
  { t:  17.14, h: 'market.' },
  { t:  17.66, h: 'we\'re <y>above</y> the' },
  { t:  18.20, h: '<o>50-week</o> moving average.' },
  { t:  19.56, h: 'we\'re <y>staying</y> <y>above</y>' },
  { t:  20.68, h: 'it.' },
  { t:  20.82, h: 'so it\'s <o>official.</o>' },
  { t:  21.68, h: 'we\'re in a <o>bull</o>' },
  { t:  22.18, h: 'market.' },
];
