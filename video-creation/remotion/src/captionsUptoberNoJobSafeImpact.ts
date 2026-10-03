// batch uptober / clip #7 - `no-job-is-safe-robots-impact` (IMPACT)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/uptober/no-job-is-safe-robots-impact/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_NJ7
//     --colorize "gr=anything y=robot,crypto,security,guard r=safe,torture,kill,bastard,nobody's,plumber,electrician,roofer,gardener"
//
// WORD SOURCE = whisper-words-VERIFIED.json = medium.en full-clip word timestamps on the staged spine
// (render-assets/no-job-is-safe-robots-impact.mp4), patched:
//   - "kill the best" -> "kill the bastard." (19.82-20.02). medium.en + large-v3 windows hear "best"; the
//     whole-stream transcript (2387.3) reads "robot that can kill the bastard"; RMS voiced to 20.00.
//   - held "and" 14.58 -> 15.36 (RMS continuously voiced 14.6-15.4: a held "aaand", not a hole).
//   - "I mean you have a, you have a" kept: whole-stream transcript reads "i mean you have a you have a
//     robot"; the batch whisper-words.json's "crypto and you have a" is the outlier. No PROTECTED_DOUBLES
//     entry needed (cleanup() collapses ADJACENT duplicate tokens only).
// GAP SCAN (2026-10-01): after the held-"and" fix, no inter-word gap > 0.45 s; no omitted speech.
export const CAPTIONS_NJ7: { t: number; h: string }[] = [
  { t:   0.34, h: '<r>nobody\'s</r> <r>safe.</r>' },
  { t:   0.94, h: 'no job is <r>safe.</r>' },
  { t:   2.10, h: 'like a <y>robot</y>' },
  { t:   2.56, h: 'could really do' },
  { t:   3.42, h: '<gr>anything.</gr>' },
  { t:   4.08, h: 'you have a' },
  { t:   4.52, h: '<y>robot</y> in your' },
  { t:   5.18, h: 'house you don\'t' },
  { t:   6.00, h: 'need a <r>plumber.</r>' },
  { t:   6.72, h: 'you don\'t need an' },
  { t:   7.22, h: '<r>electrician.</r>' },
  { t:   7.84, h: 'you don\'t need a' },
  { t:   8.38, h: '<r>roofer</r> you don\'t' },
  { t:   9.02, h: 'need a <r>gardener</r>' },
  { t:   9.88, h: 'and you don\'t need a' },
  { t:  10.48, h: '<y>security</y> <y>guard.</y>' },
  { t:  11.30, h: 'they could be' },
  { t:  11.68, h: 'your <y>security</y> <y>guard</y>' },
  { t:  12.62, h: 'so if somebody' },
  { t:  13.30, h: 'wants to come' },
  { t:  13.84, h: 'to your house' },
  { t:  14.58, h: 'and try to like' },
  { t:  16.04, h: '<r>torture</r> you to' },
  { t:  16.62, h: 'get all your' },
  { t:  17.04, h: '<y>crypto.</y>' },
  { t:  17.42, h: 'i mean you have a' },
  { t:  18.22, h: 'you have a' },
  { t:  18.60, h: '<y>robot</y> that can' },
  { t:  19.42, h: '<r>kill</r> the <r>bastard.</r>' },
];
