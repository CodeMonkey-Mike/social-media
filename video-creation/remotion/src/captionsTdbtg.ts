// captionsTdbtg.ts — captions for "TAO Under $200: Don't Be That Guy"
// batch new-bottom, clip #3, slug tao-dont-be-that-guy (variant: full)
//
// SOURCE OF TRUTH: the canonical captions skill run on THIS clip's own fresh Whisper words
// (silence removal shifted every word off the master, so the clip was transcribed on its own audio):
//   whisper small --word_timestamps -> shorts/new-bottom/tao-dont-be-that-guy/whisper-words-tdbtg.json
//   python video-creation/skills/captions/build_captions.py --words <that> --style montserrat
//          --var CAPTIONS_TDBTG --colorize "g=tao,bittensor y=189,188,200,100x r=fud,weak,crying,dip"
//
// STT-ONLY corrections applied on top (delegated + persona hard rules; each re-checked against a
// medium-model re-transcription of the exact span before editing):
//   0.32   "spreading fun"           -> "spreading FUD"        (medium model also heard "fun")
//   13.40  "check out a crypto"      -> "check out of crypto"
//   27.32  "you can have having a chance" -> "speaking of having a chance"  (medium model: "Speaking of having a chance")
//   47.48  "bit tensor tao"          -> "bittensor tao"
//   35.90/42.40  stray article "a" before the ticker dropped ("you saw TAO", "that TAO") - readability,
//                the skill's method step 3 explicitly allows non 1:1 cleanup.
//
// CRITICAL TICKER RULE (persona hard rule, feedback_tao_not_tau): Whisper renders the ticker as
// "towel"/"tau" throughout. EVERY occurrence below is TAO in teal <g>, matching the prior TAO clips
// (captionsTao200.ts / captionsTaoi.ts). Never "towel", never "tau" - the Greek letter is only ever
// correct as a logo glyph, never as the word.
//
// Colour: <g> TAO/Bittensor, <y> numbers/prices, <r> danger/weak-hands/FUD, <gr> the pump he missed.
// No em dashes anywhere.
export const CAPTIONS_TDBTG: { t: number; h: string }[] = [
  { t:   0.00, h: 'and i\'m not' },
  { t:   0.32, h: 'spreading <r>fud,</r> i\'m' },
  { t:   1.24, h: 'just being realistic.' },
  { t:   2.26, h: 'and when things' },
  { t:   2.74, h: 'go down, the best' },
  { t:   3.82, h: 'thing you can' },
  { t:   4.26, h: 'do is just buy more' },
  { t:   6.06, h: 'man, buy the dip.' },
  { t:   6.88, h: 'we\'re like, don\'t' },
  { t:   7.28, h: 'sweat it.' },
  { t:   7.86, h: 'you know, be' },
  { t:   8.16, h: 'having those <r>weak</r>' },
  { t:   8.84, h: '<r>hands</r> and making' },
  { t:   9.62, h: 'one to just get out' },
  { t:  10.70, h: 'and just like, oh' },
  { t:  11.90, h: 'the hell with this' },
  { t:  12.70, h: 'right?' },
  { t:  12.94, h: 'and it\'s like you' },
  { t:  13.40, h: 'check out of' },
  { t:  13.92, h: 'crypto and then' },
  { t:  14.88, h: 'one day you' },
  { t:  15.48, h: 'start seeing things' },
  { t:  16.42, h: 'flash on the' },
  { t:  17.14, h: 'news and all' },
  { t:  17.98, h: 'these people sharing' },
  { t:  19.74, h: 'things about how' },
  { t:  20.74, h: 'crypto is <gr>flying</gr>' },
  { t:  21.78, h: 'and you start' },
  { t:  22.56, h: '<r>crying</r> about how' },
  { t:  24.36, h: 'you should have' },
  { t:  25.46, h: 'gotten in when' },
  { t:  26.34, h: 'you had the' },
  { t:  26.68, h: 'chance.' },
  { t:  27.32, h: 'speaking of having' },
  { t:  27.96, h: 'a chance.' },
  { t:  28.48, h: 'i got me' },
  { t:  29.18, h: 'another <g>tao</g> today.' },
  { t:  30.64, h: 'it was at <y>189,</y>' },
  { t:  32.90, h: 'i think it was' },
  { t:  33.30, h: 'like <y>188.</y>' },
  { t:  34.10, h: 'i keep saying' },
  { t:  34.84, h: 'don\'t be that guy.' },
  { t:  35.90, h: 'you said you saw' },
  { t:  36.58, h: '<g>tao</g> below <y>$200.</y>' },
  { t:  38.02, h: 'don\'t be that guy' },
  { t:  38.82, h: 'and then you just' },
  { t:  39.46, h: 'didn\'t do anything.' },
  { t:  40.40, h: 'don\'t be that <r>guy.</r>' },
  { t:  41.42, h: 'yeah, a lot of' },
  { t:  41.80, h: 'hopes for <g>tao.</g>' },
  { t:  42.40, h: 'i think that <g>tao</g>' },
  { t:  43.80, h: 'is gonna be' },
  { t:  44.42, h: 'big time.' },
  { t:  45.70, h: 'i think it\'s' },
  { t:  45.98, h: 'gonna be big' },
  { t:  46.44, h: 'time.' },
  { t:  46.86, h: 'i think the' },
  { t:  47.48, h: '<g>bittensor tao,</g>' },
  { t:  48.46, h: 'i think <g>tao</g>' },
  { t:  48.98, h: 'is gonna be' },
  { t:  49.48, h: 'like near <y>100x.</y>' },
];
