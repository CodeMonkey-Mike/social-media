// Captions for batch what-if-1000x / clip 5 "What If Could Be the Next Dogecoin" (slug
// whatif-next-dogecoin, variant solo).
//
// CANONICAL SOURCE: video-creation/skills/captions/build_captions.py --style montserrat, run on the
// clip's own whisper-words.json (medium-model word timings taken on the FINAL spine). Copied in
// verbatim from shorts/what-if-1000x/whatif-next-dogecoin/captions.ts. NEVER hand-authored and never
// lifted from another composition.
//
// Rebuild command (reproduces this file byte-identically):
//   python video-creation/skills/captions/build_captions.py //     --words video-creation/shorts/what-if-1000x/whatif-next-dogecoin/whisper-words.json //     --style montserrat --var CAPTIONS_WHATIF_NEXT_DOGECOIN //     --colorize "gr=dogecoin,community,timeless,robinhood,concept y=billion,htx,gate,mexc //                 r=insider,insiders,pumped o=pepe,pepe's,pengu" //     --out video-creation/shorts/what-if-1000x/whatif-next-dogecoin/captions.ts
//
// STT fixes live in build_captions.py PHRASE_CORRECTIONS (never edited by hand here). Each one was
// re-verified against THIS clip's own audio on 2026-08-03:
//   "gate/gait and Mexi/maxi" -> "gate and mexc"  APPLIED. Whisper renders the pair as "Gate and
//        Mexi"; "Mexi" is a non-name and Mike's own on-screen research panel (31.9-41.0 s) reads
//        "ahead of Gate.io and MEXC the next day".
//   "I'm gonna go tired"      -> "i'm so tired"   APPLIED. A medium re-transcribe of 8.6-13.8 s in
//        isolation returns "I mean, I'm so tired of all these animals that keep coming out".
//   "robinhood lists what if" -> NOT CORRECTED. The delegated candidate ("lists it and it runs")
//        came off the ORIGINAL master transcript and does NOT survive here: four 1x medium passes
//        (shipped words, isolated tail, 0.8x, and the UNTIGHTENED source with full context) all
//        return "Robin Hood lists WHAT IF, right?" - he is naming the token, exactly as the rest of
//        the clip captions it. The rule was REMOVED from build_captions.py rather than shipped.
//   "listened" -> "listed"    NOT PRESENT in this clip (Whisper already writes "was listed on HTX"
//        and "it was listed on Gate"), so there was nothing to correct.
//   "tau" -> "TAO" / "Casper" -> "Kaspa": neither word occurs in this clip.
//   "Robin Hood"              -> "robinhood"      (pre-existing ("robin","hood") rule)
// Colours: <gr> green = the Robinhood-chain/$WHATIF side (teal is Kaspa's colour and is never used
// here), <y> numbers/exchanges, <r> insider/pump, <o> the other memes (pepe, pengu).
export const CAPTIONS_WHATIF_NEXT_DOGECOIN: { t: number; h: string }[] = [
  { t:   0.00, h: 'now the thing' },
  { t:   0.50, h: 'with the what if is' },
  { t:   1.26, h: 'kind of unique.' },
  { t:   1.88, h: 'this is a' },
  { t:   2.52, h: 'boring cat.' },
  { t:   3.30, h: 'what if is a' },
  { t:   4.00, h: '<gr>concept?</gr>' },
  { t:   4.98, h: 'i\'m surprised nobody\'s' },
  { t:   6.20, h: 'ever thought of' },
  { t:   6.72, h: 'this before.' },
  { t:   7.32, h: 'i\'ve been saying' },
  { t:   7.90, h: 'that for like well over' },
  { t:   8.94, h: 'a year.' },
  { t:   9.38, h: 'i\'m so tired' },
  { t:  10.20, h: 'of all these' },
  { t:  10.84, h: 'animals that keep' },
  { t:  11.66, h: 'coming out and' },
  { t:  12.38, h: 'needs to be' },
  { t:  12.82, h: 'something new, right?' },
  { t:  13.76, h: '<o>pepe</o> launched and' },
  { t:  15.26, h: 'had investors, right?' },
  { t:  16.82, h: 'had <r>insiders</r> and' },
  { t:  17.92, h: 'then literally one' },
  { t:  18.88, h: 'week later, it' },
  { t:  19.92, h: 'starts getting listed' },
  { t:  20.72, h: 'on a whole' },
  { t:  21.14, h: 'bunch of centralized' },
  { t:  21.96, h: 'exchanges.' },
  { t:  22.74, h: 'now, and it just' },
  { t:  23.80, h: '<r>pumped</r> like' },
  { t:  24.70, h: 'it <r>pumped</r> like' },
  { t:  25.26, h: 'your typical <r>insider</r>' },
  { t:  26.40, h: 'coin.' },
  { t:  26.76, h: 'you like <o>pengu.</o>' },
  { t:  27.78, h: 'it launched and' },
  { t:  28.68, h: '<o>pengu</o> <r>pumped</r> to' },
  { t:  29.52, h: 'like four <y>billion,</y>' },
  { t:  30.36, h: 'right?' },
  { t:  30.58, h: 'in the next day or' },
  { t:  31.80, h: 'something.' },
  { t:  32.00, h: 'the first centralized' },
  { t:  32.94, h: 'exchange was listed' },
  { t:  33.84, h: 'on <y>htx.</y>' },
  { t:  34.72, h: 'it was a' },
  { t:  35.00, h: 'pretty damn big' },
  { t:  36.06, h: 'centralized exchange.' },
  { t:  37.22, h: 'and then the next day' },
  { t:  38.66, h: 'it was listed' },
  { t:  39.12, h: 'on <y>gate</y> and <y>mexc.</y>' },
  { t:  40.98, h: 'so <o>pepe\'s</o> not' },
  { t:  41.58, h: 'like a <gr>community</gr>' },
  { t:  42.80, h: 'driven coin.' },
  { t:  43.66, h: 'obviously what if' },
  { t:  44.28, h: 'is going up' },
  { t:  44.74, h: 'like crazy, but' },
  { t:  45.32, h: 'is doing it' },
  { t:  45.98, h: 'because the <gr>community</gr>' },
  { t:  46.84, h: 'is getting behind' },
  { t:  47.56, h: 'it.' },
  { t:  47.78, h: 'so that hasn\'t' },
  { t:  48.46, h: 'happened with what' },
  { t:  49.52, h: 'if.' },
  { t:  49.78, h: 'you know, it' },
  { t:  50.48, h: 'could go to' },
  { t:  52.16, h: 'show that even what if' },
  { t:  53.20, h: 'might be even' },
  { t:  53.72, h: 'a better play' },
  { t:  54.58, h: 'than <o>pepe.</o>' },
  { t:  55.18, h: 'it might be' },
  { t:  55.94, h: 'like your typical' },
  { t:  56.68, h: '<gr>dogecoin</gr> type of' },
  { t:  57.74, h: 'meme is what i\'m' },
  { t:  58.40, h: 'saying.' },
  { t:  58.88, h: 'it could be' },
  { t:  59.34, h: 'like a <gr>dogecoin.</gr>' },
  { t:  60.36, h: 'what if is' },
  { t:  60.90, h: 'something that could' },
  { t:  61.44, h: 'be <gr>timeless.</gr>' },
  { t:  62.22, h: 'what if <gr>robinhood</gr>' },
  { t:  63.28, h: 'lists what if' },
  { t:  64.06, h: 'right?' },
];
