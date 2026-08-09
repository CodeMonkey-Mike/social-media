// Copied VERBATIM from the clip's captions.ts, which is the output of the CANONICAL captions skill
// (video-creation/skills/captions/build_captions.py --style montserrat). Never hand-authored and never
// lifted from another composition. Grouping, casing and colour spans are untouched.
//
// MECHANICAL FIX (applied before the first render): the builder joins Whisper tokens with a space, and
// Whisper splits the number "$10,000" into the two tokens "$10" + ",000", so four captions rendered on
// screen as "$10 ,000" with a visible space inside the number. The space between those two tokens is
// deleted at t=22.22 / 23.74 / 26.16 / 28.48. No word, no grouping, no colour span changed.
//
// STT-ONLY corrections applied after whisper-verifying the FIRST full render (casing / colour spans /
// style untouched, and every one mirrored back into the clip's captions.ts so both copies stay
// identical). Each was confirmed by the MASTER transcript
// (livestream-repurpose/transcripts/clarity-act LOW BPS VERTICAL/*.json, an independent whole-file
// decode) PLUS at least one of two fresh Whisper passes (small.en on the render, medium.en on the clean
// cut). Nothing was changed on a single pass's say-so, and no unverifiable word was guessed:
//   1.92/2.56  "something but you" + "need to make"  ->  "something but you're" + "in it to make"
//              Master: "you don't like something, but you're IN IT TO make money." Both fresh passes
//              also hear "you're" (small.en "you're going to", medium.en "you're gonna have to"); only
//              the prepared word file had "you need". This is the clip's thesis line, so it matters.
//   22.74      "i mean like i talk"  ->  "i'm like i talk"
//              Master: "I'm like, I talk about $10,000 ETH easily." medium.en agrees ("I'm like I talk").
//   26.16      "bearish $10,000" + "eth."  ->  "bearish even if" + "you have $10,000" + "eth."
//              The prepared word file DROPPED ~0.5 s of speech here (it stretched "$10" across
//              26.62-27.32). Master: "That's like really bearish EVEN IF YOU HAVE $10,000 ETH." Both
//              fresh passes hear something at 26.66-27.18 (small.en "even if I have", medium.en "even
//              half"). Without it the conditional became a flat assertion, which changes the meaning.
// Re-verified on the corrected render (medium.en): word-level agreement rose 81.8% -> 86.8% and every
// remaining diff is benign (Whisper spelling ETH as "eath", the dropped fillers, "gonna" vs "going to").
// Two unstressed monosyllables stay ambiguous across passes and are left on the MASTER transcript's
// reading, because the meaning is identical either way and the master is the higher-authority decode:
// "you're IN IT to make money" (the render pass still hears "gonna have to") and "even if YOU have"
// (two render passes hear "even if I have").
// Deliberately NOT changed: "i even though" at 7.50 (all three passes hear the mumbled "even know I I",
// but clip-plan.json explicitly directs captioning it as "even though"); the dropped fillers "um" /
// "you know" (the captions skill drops fillers by design); and the two places where only the redundant
// ticker "eth" is omitted after "$10,000" (an abbreviation, not a wrong word).
export const CAPTIONS_HATE_ETH_BOUGHT_IT: { t: number; h: string }[] = [
  { t:   0.00, h: 'like sometimes you' },
  { t:   0.76, h: 'don\'t like you don\'t like' },
  { t:   1.92, h: 'something but you\'re' },
  { t:   2.56, h: 'in it to make' },
  { t:   2.88, h: 'money.' },
  { t:   3.36, h: 'i recently bought' },
  { t:   3.98, h: 'some eth not to' },
  { t:   5.00, h: 'trade meme coins' },
  { t:   5.80, h: 'but i bought' },
  { t:   6.18, h: 'some eth as an' },
  { t:   6.88, h: 'investment.' },
  { t:   7.50, h: 'i even though' },
  { t:   8.04, h: 'i like i <r>hate</r> eth.' },
  { t:   9.74, h: 'i never liked' },
  { t:  10.22, h: 'eth but i' },
  { t:  10.86, h: 'think i think' },
  { t:  12.46, h: 'eth is very' },
  { t:  13.04, h: '<gr>bullish</gr> man i' },
  { t:  14.20, h: 'think it\'s gonna' },
  { t:  14.62, h: 'be going somewhere.' },
  { t:  15.48, h: 'i give it the' },
  { t:  16.24, h: 'potential eventually to' },
  { t:  17.48, h: 'flip bitcoin ethereum' },
  { t:  18.74, h: 'there\'s gonna be' },
  { t:  19.36, h: 'a lot of' },
  { t:  19.90, h: 'multipliers so people' },
  { t:  21.66, h: 'talk about a' },
  { t:  22.22, h: '$10<y>,000.</y>' },
  { t:  22.74, h: 'i\'m like i talk' },
  { t:  23.74, h: 'about $10<y>,000</y>' },
  { t:  24.48, h: 'easily.' },
  { t:  25.58, h: 'that\'s like really' },
  { t:  26.16, h: 'bearish even if' },
  { t:  26.90, h: 'you have $10<y>,000</y>' },
  { t:  27.92, h: 'eth.' },
  { t:  28.48, h: 'yeah, $10<y>,000</y> eth' },
  { t:  29.98, h: 'would be like' },
  { t:  30.38, h: 'near term like a mild' },
  { t:  31.74, h: 'rally not even' },
  { t:  32.58, h: 'a cycle top' },
];
