// 30x-tao clip 7 `get-into-assets-now-last-chance-impact`: captions (montserrat preset).
// Built with video-creation/skills/captions/build_captions.py --style montserrat from
// shorts/30x-tao/get-into-assets-now-last-chance-impact/whisper-words.json (the "really, really" and "very, very"
// intensifier doublings are now PROTECTED_DOUBLES keys in the tool), then hand-regrouped on the measured onsets
// (medium.en _qa/stt/stt-results.json + 20 ms RMS): the "you gotta, you gotta" restart shown once, "get into" cut
// on the 3.72 onset (the hook full-screen cut), "AI" on its own onset after "that" (9.72), "better code" kept
// together, "and you have / a chance." mirrored by "we all have / a chance.". No word omitted by the JSON.
export const CAPTIONS_XT7: { t: number; h: string }[] = [
  { t:  0.10, h: 'and you' },
  { t:  1.12, h: 'gotta get in' },
  { t:  2.04, h: 'now, man.' },
  { t:  2.92, h: 'you gotta' },
  { t:  3.72, h: 'get into' },
  { t:  4.00, h: '<gr>assets</gr> now' },
  { t:  4.96, h: 'because this' },  // (spliced 2026-10-28) was 5.14: the 5.08-5.14 dip is the /k/ closure INSIDE "because" (onset ~4.95, medium.en x2)
  { t:  5.48, h: 'might be your' },
  { t:  6.12, h: '<y>last chance.</y>' },
  { t:  6.98, h: 'every engineer,' },
  { t:  8.14, h: 'every software' },
  { t:  8.40, h: 'engineer is' },
  { t:  8.86, h: 'acknowledging' },
  { t:  9.34, h: 'that <gr>ai</gr>' },
  { t: 10.26, h: 'can now' },
  { t: 11.26, h: 'produce' },
  { t: 11.62, h: '<gr>better code</gr>' },
  { t: 12.22, h: 'than us.' },
  { t: 13.14, h: 'it\'s going to be' },
  { t: 13.70, h: 'really, really' },
  { t: 14.40, h: '<r>difficult</r>' },
  { t: 14.80, h: 'in the future' },
  { t: 15.42, h: 'and it\'s going' },
  { t: 15.74, h: 'to happen' },
  { t: 15.92, h: 'very, very' },
  { t: 16.74, h: '<r>soon.</r>' },
  { t: 17.30, h: 'but the <gr>good news</gr>' },
  { t: 17.92, h: 'is you guys' },
  { t: 18.50, h: 'here are watching,' },
  { t: 19.36, h: 'you guys are' },
  { t: 19.88, h: 'all into <o>crypto,</o>' },
  { t: 20.86, h: 'and you have' },
  { t: 21.24, h: 'a <gr>chance.</gr>' },
  { t: 21.78, h: 'we all have' },
  { t: 22.22, h: 'a <gr>chance.</gr>' },
];
