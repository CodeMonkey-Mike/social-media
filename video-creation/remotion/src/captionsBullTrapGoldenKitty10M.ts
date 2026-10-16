// batch bull-trap / clip #2 - `golden-kitty-10-million-while-everything-bleeds` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/bull-trap/golden-kitty-10-million-while-everything-bleeds/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_BT2 --max-secs 1.6
//     --colorize "gr=10,million,pump,pumps,pumping,excellent,good,recovery,up,gains,crazy,4-hour y=golden,kitty,gold,october,board,discord,easily r=bleeding,dying,crap"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en
// staggered 8 s windows every 4 s (CPU; shorts/bull-trap/golden-kitty-.../_qa/res_stt.json) + clip-plan
// stt_caption_fixes: "flower candle" -> "4-hour candle" (medium.en: "one 4 hour candle"); "diskware" ->
// "Discord" (medium.en: "especially my Discord"); "we got so many gains" -> "we had some gains" (medium.en,
// 2 windows); "stop pumping" -> "start pumping" (clip-plan meaning-critical fix: medium.en ALSO hears
// "stop" on 2 windows, so this is flagged for Mike's ear in the build report). "I really, really want" is
// an intensifier doubling kept by PROTECTED_DOUBLES ("i","really","really","want").
// GAP SCAN: no unexplained gaps (> 0.4 s) in the word stream; every medium.en window agrees on the words.
export const CAPTIONS_BT2: { t: number; h: string }[] = [
  { t:   0.00, h: 'everything else is' },
  { t:   1.16, h: 'like <r>bleeding</r> man' },
  { t:   2.28, h: 'everything is like' },
  { t:   3.26, h: '<r>dying</r> right' },
  { t:   4.36, h: 'except' },
  { t:   5.58, h: '<y>golden</y> <y>kitty</y> look' },
  { t:   6.92, h: 'at this candle' },
  { t:   7.62, h: 'right there\'s one' },
  { t:   8.50, h: '<gr>4-hour</gr> candle right' },
  { t:   9.52, h: 'here is one' },
  { t:   9.98, h: 'straight <gr>up</gr> probably' },
  { t:  11.12, h: 'going to a' },
  { t:  11.66, h: 'nice <gr>recovery</gr> right' },
  { t:  12.64, h: 'there considering how' },
  { t:  14.02, h: 'everything else is' },
  { t:  14.78, h: 'this is like' },
  { t:  15.32, h: 'pretty damn <gr>good</gr>' },
  { t:  16.04, h: 'it\'s <gr>excellent</gr>' },
  { t:  17.02, h: '<y>golden</y> <y>kitty</y> is' },
  { t:  18.50, h: 'an awesome project' },
  { t:  19.32, h: 'it is paired' },
  { t:  19.98, h: 'to <y>gold</y> and like' },
  { t:  21.28, h: 'now i\'m in it i\'m' },
  { t:  22.54, h: 'on <y>board</y> i' },
  { t:  23.36, h: 'really really want' },
  { t:  24.06, h: 'to see some' },
  { t:  24.54, h: '<y>october</y> <gr>pumps</gr> if' },
  { t:  25.76, h: 'things just start' },
  { t:  26.42, h: '<gr>pumping</gr> you know' },
  { t:  27.36, h: 'now' },
  { t:  28.34, h: 'and next week and then' },
  { t:  29.86, h: 'a week after' },
  { t:  30.62, h: 'and <y>golden</y> <y>kitty</y>' },
  { t:  31.38, h: 'could <y>easily</y> make' },
  { t:  32.46, h: 'like <gr>10</gr> <gr>million</gr>' },
  { t:  33.50, h: 'in the next like' },
  { t:  34.42, h: 'couple weeks' },
  { t:  35.46, h: '<y>easily</y> i think' },
  { t:  36.30, h: 'so <y>easily</y> just' },
  { t:  37.28, h: 'hope for those' },
  { t:  37.84, h: '<gr>pumps</gr> man it\'s' },
  { t:  38.80, h: 'been like things' },
  { t:  39.36, h: 'have been <r>crap</r> for so' },
  { t:  40.60, h: 'long i mean we had' },
  { t:  41.46, h: 'some <gr>gains</gr> here' },
  { t:  42.56, h: 'and there especially' },
  { t:  43.24, h: 'my <y>discord</y> but' },
  { t:  44.10, h: 'i want to see like' },
  { t:  44.90, h: 'everything <gr>pump</gr> like' },
  { t:  46.06, h: 'goddamn it i' },
  { t:  46.84, h: 'want to see' },
  { t:  47.16, h: 'things going <gr>crazy</gr>' },
];
