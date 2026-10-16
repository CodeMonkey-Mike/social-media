// batch aliens / clip #3 - `meme-dominance-off-a-cliff` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/aliens/meme-dominance-off-a-cliff/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_AL3 --max-secs 1.6
//     --colorize "r=crazy,dangerous.,dangerous,low,cliff.,cliff,risky.,dropped,goddamn y=meme,memes,memes.,dominance,anymore.,cult o=ourselves.,nobody,new,2024."
// WORD SOURCE: whisper-words-verified.json = whisper-words.json + 3 token patches verified against medium.en
// (full file + 3 windows, meme-dominance-off-a-cliff/_qa/stt_res.json): "And certainly" -> "considering",
// "Thought" -> "It's not", "called" -> "cult". GAP SCAN: max inter-word gap 0.56 s (15.16-15.72, a real pause).
export const CAPTIONS_AL3: { t: number; h: string }[] = [
  { t:   0.00, h: 'the <y>meme</y> market' },
  { t:   0.68, h: 'is <r>crazy,</r> <r>dangerous.</r>' },
  { t:   1.96, h: 'considering the <y>meme</y>' },
  { t:   2.48, h: 'coin <y>dominance</y> is' },
  { t:   3.32, h: 'so <r>low,</r> like' },
  { t:   4.34, h: '<o>nobody</o> wants to' },
  { t:   5.34, h: 'get into <y>memes</y>' },
  { t:   5.78, h: 'anymore.' },
  { t:   6.18, h: 'it\'s us trading' },
  { t:   7.06, h: 'against ourselves.' },
  { t:   8.18, h: 'no <o>new</o> market' },
  { t:   9.14, h: 'participants.' },
  { t:  10.10, h: 'the <y>meme</y> coin' },
  { t:  10.70, h: '<y>dominance</y> in the' },
  { t:  11.68, h: 'market has <r>dropped</r>' },
  { t:  12.58, h: 'considerably.' },
  { t:  13.34, h: 'look at them' },
  { t:  13.92, h: 'since 2024.' },
  { t:  15.72, h: '<r>crazy,</r> falling off' },
  { t:  16.34, h: 'a <r>cliff.</r>' },
  { t:  16.74, h: 'it\'s not for' },
  { t:  17.16, h: 'anybody who has' },
  { t:  17.80, h: 'a <y>meme</y> only' },
  { t:  18.88, h: 'mentality, definitely isn\'t' },
  { t:  20.36, h: 'enough people.' },
  { t:  21.12, h: 'and in the' },
  { t:  21.52, h: '<y>memes,</y> definitely <y>cult</y>' },
  { t:  22.26, h: '<y>memes.</y>' },
  { t:  22.62, h: 'anything <o>new</o> is' },
  { t:  23.56, h: 'just like so' },
  { t:  24.66, h: '<r>goddamn</r> risky.' },
];
