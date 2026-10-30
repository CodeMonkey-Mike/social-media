// 30x-tao clip 6 `tao-is-the-arena-not-a-competitor-impact`: captions (montserrat preset).
// Built with video-creation/skills/captions/build_captions.py --style montserrat from
// shorts/30x-tao/tao-is-the-arena-not-a-competitor-impact/whisper-words.json (the "many, many" doubling is
// now a PROTECTED_DOUBLES key in the tool), then hand-regrouped: the opener split at the real "isn't" onset
// (RMS: "tao" 0.70-1.15, "isn't" from 1.30, "competing" from 2.20), "to compete, to / produce the best"
// re-cut on the phrase, "definitely more centralized" split so it never wraps to two lines, the
// "than, than" stutter shown once. Onsets cross-checked against medium.en (_qa/stt-results.json).
export const CAPTIONS_XT6: { t: number; h: string }[] = [
  { t:  0.76, h: 'tao isn\'t' },
  { t:  2.20, h: 'competing.' },
  { t:  3.48, h: 'it\'s the <y>arena</y>' },
  { t:  4.54, h: 'for all others' },
  { t:  5.40, h: 'to compete,' },
  { t:  6.04, h: 'to produce' },
  { t:  7.04, h: 'the best' },
  { t:  7.66, h: '<gr>decentralized</gr> ai.' },
  { t:  8.96, h: 'i agree.' },
  { t: 10.72, h: 'i mean, people' },
  { t: 11.20, h: 'buy into solana' },
  { t: 12.18, h: 'and solana is' },
  { t: 12.86, h: 'definitely more' },
  { t: 13.36, h: '<r>centralized</r>' },
  { t: 13.84, h: 'than tao, right?' },
  { t: 15.42, h: 'tao, i think' },
  { t: 16.02, h: 'you\'re going to' },
  { t: 16.28, h: 'get many, many' },
  { t: 17.14, h: '<gr>multipliers.</gr>' },
  { t: 17.90, h: 'same thing with' },
  { t: 18.30, h: '<g>kaspa.</g>' },
];
