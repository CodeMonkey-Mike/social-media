// Captions for October-pumps clip #3 "tao-under-200-last-chance" (variant: full).
//
// SOURCE OF TRUTH: the CANONICAL captions skill output for this clip
// (video-creation/skills/captions/build_captions.py --style montserrat ->
//  shorts/October-pumps/tao-under-200-last-chance/captions.ts), copied in VERBATIM.
// Never hand-authored, never lifted from another composition.
//
// STT-ONLY corrections applied on top (each also mirrored back into the clip's captions.ts):
//   1. 21.96  "code monkey mike" -> "codemonkey mike"  (progress.json known_stt_mishears:
//      "called monkey Mike = CodeMonkey Mike"; the caption band renders lowercase, so the brand
//      reads "codemonkey mike"). No other word is touched.
//
// CRITICAL TICKER RULE (progress.json, clip #3): Whisper renders the ticker as "towel"/"tau" in
// this span. Every one of the four occurrences below is already TAO (teal <g> accent) and must
// STAY TAO. Never "towel", never "tau".
export const CAPTIONS_TAO_UNDER_200: { t: number; h: string }[] = [
  { t:   0.00, h: 'you\'re gonna get' },
  { t:   0.42, h: 'your last chance' },
  { t:   1.22, h: 'at this point' },
  { t:   1.90, h: 'to get any of the' },
  { t:   2.60, h: 'larger cap, especially' },
  { t:   4.20, h: 'like with <g>tao.</g>' },
  { t:   5.18, h: 'you might have' },
  { t:   5.60, h: 'your last chance' },
  { t:   6.52, h: 'over these few' },
  { t:   7.22, h: 'weeks is <g>tao</g>' },
  { t:   8.36, h: 'under $200.' },
  { t:   9.44, h: 'imagine that.' },
  { t:  10.16, h: 'imagine the five' },
  { t:  10.66, h: 'years you were' },
  { t:  11.42, h: 'thinking back to' },
  { t:  12.22, h: 'when <g>tao</g> was' },
  { t:  13.06, h: 'under $200 and' },
  { t:  14.28, h: 'you\'re saying, you\'re' },
  { t:  15.12, h: 'glad that you' },
  { t:  16.08, h: 'bought <g>tao</g> under' },
  { t:  17.10, h: '$200.' },
  { t:  17.70, h: 'don\'t be that guy who' },
  { t:  18.64, h: 'says, damn, i' },
  { t:  19.56, h: 'should have bought' },
  { t:  20.14, h: 'when i saw it' },
  { t:  20.80, h: 'under $200.' },
  { t:  21.96, h: 'codemonkey mike' },
  { t:  22.60, h: 'was talking about' },
  { t:  23.38, h: 'it, but i just' },
  { t:  24.80, h: 'didn\'t pay attention.' },
  { t:  25.88, h: 'yeah, that\'s not' },
  { t:  26.34, h: 'too good.' },
  { t:  26.74, h: 'don\'t be that guy.' },
  { t:  28.14, h: 'nobody wants to' },
  { t:  28.96, h: 'be that guy.' },
];
