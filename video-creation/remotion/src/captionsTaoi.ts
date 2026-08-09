// Captions for October-pumps clip #8 "tao-under-200-last-chance-impact" (variant: impact).
// COPIED VERBATIM from the clip folder's captions.ts, which is the output of the CANONICAL
// captions skill (video-creation/skills/captions/build_captions.py --style montserrat).
// Never hand-authored, never lifted from another composition.
//
// TICKER RULE (clip-plan.json, clip #3 + #8): Whisper renders the ticker as "towel"/"tau" in this
// span; the canonical builder already corrected every occurrence to "tao" (teal <g> accent). Verified
// here: 4 occurrences at 0.00 / 4.56 / 8.42, all read "tao". Never "towel", never "tau".
//
// STT-ONLY correction applied (grouping / lowercase / colour spans untouched, and mirrored back into
// the clip's captions.ts so both copies stay byte-identical):
//   14.40  'code monkey mike' -> 'codemonkey mike'
//          (the brand name is one word, "CodeMonkey Mike"; documented in clip-plan.json for the
//           sibling full cut. The caption band is text-transform:lowercase, so it renders lowercase.)
export const CAPTIONS_TAO_UNDER_200_IMPACT: { t: number; h: string }[] = [
  { t:   0.00, h: 'is <g>tao</g> under' },
  { t:   0.84, h: '$200.' },
  { t:   1.76, h: 'imagine that.' },
  { t:   2.42, h: 'imagine the five' },
  { t:   3.00, h: 'years you were' },
  { t:   3.76, h: 'thinking back to' },
  { t:   4.56, h: 'when <g>tao</g> was' },
  { t:   5.40, h: 'under $200 and' },
  { t:   6.64, h: 'you\'re saying, you\'re' },
  { t:   7.46, h: 'glad that you' },
  { t:   8.42, h: 'bought <g>tao</g> under' },
  { t:   9.42, h: '$200.' },
  { t:  10.08, h: 'don\'t be that guy who' },
  { t:  11.06, h: 'says, damn, i' },
  { t:  11.98, h: 'should have bought' },
  { t:  12.56, h: 'when i saw it' },
  { t:  13.24, h: 'under $200.' },
  { t:  14.40, h: 'codemonkey mike' },
  { t:  15.08, h: 'was talking about' },
  { t:  15.84, h: 'it, but i just' },
  { t:  17.24, h: 'didn\'t pay attention.' },
  { t:  18.32, h: 'yeah, that\'s not' },
  { t:  18.76, h: 'too good.' },
  { t:  19.14, h: 'don\'t be that guy.' },
  { t:  20.58, h: 'nobody wants to' },
  { t:  21.36, h: 'be that guy.' },
];
