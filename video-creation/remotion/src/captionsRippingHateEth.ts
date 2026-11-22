// batch ripping / clip #4 - `hate-eth-go-where-the-money-is` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/ripping/hate-eth-go-where-the-money-is/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_RIP4 --max-secs 1.6
//     --colorize "o=bitcoin y=ethereum|eth|$20,000|ten|etfs b=litecoin,privacy r=hate gr=flip,money,pump,crazy,dominant,conservative"
// WORD SOURCE: whisper-words-verified.json = the clip's own whisper-words.json with 4 fixes, each read the same way
// by medium.en on 2-3 staggered windows of the spine (_qa/whisper/res-spine*.json): "in the litecoin" -> "into
// litecoin" (9.76), the mumbled "me on" dropped (18.96-19.40, "starts giving me the vibe"), "the ethereum" -> "that
// ethereum" (20.40), "when" -> "but then" (26.16). Gap scan: no unexplained gap > 0.4 s in the word stream.
// "$20" + ",000" is merged by the skill's own money-figure phrase rule.
export const CAPTIONS_RIP4: { t: number; h: string }[] = [
  { t:   0.00, h: 'even believe i' },
  { t:   1.56, h: 'kid you not that one' },
  { t:   2.74, h: 'day <y>ethereum</y> is' },
  { t:   3.66, h: 'gonna <gr>flip</gr> <o>bitcoin</o>' },
  { t:   4.58, h: 'i <r>hate</r> <y>eth</y> but i' },
  { t:   5.92, h: 'gotta go where' },
  { t:   6.30, h: 'the <gr>money</gr> is' },
  { t:   6.98, h: 'i did the same' },
  { t:   7.54, h: 'thing with <b>litecoin</b>' },
  { t:   8.24, h: 'i was like, i can\'t' },
  { t:   9.00, h: 'believe i\'m getting' },
  { t:   9.46, h: 'back into <b>litecoin,</b>' },
  { t:  10.70, h: 'right?' },
  { t:  10.88, h: 'because you know' },
  { t:  11.52, h: 'it\'s a made in' },
  { t:  12.14, h: 'america token getting' },
  { t:  13.46, h: '<y>etfs</y>' },
  { t:  14.72, h: 'and now it has an' },
  { t:  15.80, h: 'optional <b>privacy</b> feature' },
  { t:  17.20, h: 'so i\'m like, okay' },
  { t:  18.10, h: '<y>ethereum</y> starts giving' },
  { t:  19.54, h: 'me the vibe that' },
  { t:  20.88, h: '<y>ethereum</y> is going' },
  { t:  21.70, h: 'to be like a' },
  { t:  22.42, h: 'totally <gr>dominant</gr> and' },
  { t:  23.70, h: 'i <r>hate</r> <y>ethereum</y>' },
  { t:  24.64, h: 'i <r>hate</r> it.' },
  { t:  25.58, h: 'i <r>hate</r> it but then' },
  { t:  26.26, h: 'it\'s okay i\'ll buy into' },
  { t:  27.44, h: 'it because i' },
  { t:  28.24, h: 'know it\'s gonna' },
  { t:  28.72, h: '<gr>pump</gr> like <gr>crazy</gr>' },
  { t:  29.90, h: 'i mean i' },
  { t:  31.04, h: 'think like that' },
  { t:  31.80, h: '<y>$20,000</y> <y>eth</y> is' },
  { t:  33.06, h: 'like really <gr>conservative</gr>' },
  { t:  34.10, h: 'in my opinion' },
  { t:  35.24, h: '<y>ten</y> years from' },
  { t:  36.06, h: 'now' },
];
