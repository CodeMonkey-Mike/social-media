// batch ripping / clip #7 - `ai-jobs-own-assets-impact` (IMPACT)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/ripping/ai-jobs-own-assets-impact/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_RIP7 --max-secs 1.6 --max-short 4
//     --colorize "g=ai,code,software,engineer,engineer.,codemonkey,codemonkey, y=official,better,term,geek r=can't"
// WORD SOURCE: whisper-words-verified.json = the clip's whisper-words.json with ONE patch: the trailing '-' token
// (19.40) dropped. The spine ends mid-sentence on "on a" (4/4 staggered decodes, medium.en + large-v3); the final
// "a" group (19.34) sits past the last frame (19.267) and never shows. No gap > 0.16 s in the word stream.
// The canonical token merge renders "code monkey" as "codemonkey" (Mike's brand), coloured teal.
export const CAPTIONS_RIP7: { t: number; h: string }[] = [
  { t:   0.00, h: 'it is <y>official</y>' },
  { t:   1.40, h: 'that <g>ai</g> can <g>code</g>' },
  { t:   2.72, h: '<y>better</y> than any' },
  { t:   3.86, h: '<g>software</g> <g>engineer.</g>' },
  { t:   4.86, h: 'there\'s no need' },
  { t:   6.20, h: 'anymore to be' },
  { t:   7.26, h: 'a <g>codemonkey,</g> right?' },
  { t:   8.46, h: 'the <g>codemonkey</g> is' },
  { t:   9.16, h: 'just a <y>term</y> for' },
  { t:   9.98, h: 'a <y>geek</y> who' },
  { t:  10.42, h: 'likes to sit' },
  { t:  10.84, h: 'there and just' },
  { t:  11.40, h: 'write <g>code</g> all' },
  { t:  12.28, h: 'day.' },
  { t:  12.56, h: 'right?' },
  { t:  12.74, h: 'that\'s where i' },
  { t:  13.18, h: 'got that <y>term</y> from.' },
  { t:  14.20, h: 'and you <r>can\'t</r> be' },
  { t:  15.58, h: 'a <g>codemonkey</g> going' },
  { t:  16.44, h: 'forward in the' },
  { t:  17.12, h: 'future.' },
  { t:  17.36, h: 'you just <r>can\'t</r> do' },
  { t:  18.06, h: 'it.' },
  { t:  18.34, h: 'you\'re going to' },
  { t:  18.78, h: 'find yourself on' },
  { t:  19.34, h: 'a' },
];
