// captionsZomb.ts - captions for peach-minute clip #4, slug 04-i-was-a-zombie
//
// Built by the CANONICAL caption skill:
//   python video-creation/skills/captions/build_captions.py \
//     --words video-creation/shorts/peach-minute/04-i-was-a-zombie/whisper-words.json \
//     --style montserrat --var CAPTIONS_ZOMB \
//     --colorize "g=kaspa y=dollar,50-week,sma r=zombie,tariff"
//
// Corrections that now live IN the builder (so they never have to be re-hand-fixed):
//   ('think','cast')/('wish','cast') -> kaspa (PHRASE; rescoped 2026-07-29 from a global cast
//   rule, which would corrupt the real word "cast"), terror season -> tariff season, like matt like matt -> like mad
//   like mad, matt bulls -> mad bulls, 50 week moving average -> 50-week sma (PHRASE_CORRECTIONS).
//   post having -> post-halving was already there.
//
// TWO clip-local fixes applied by hand AFTER the builder run, because a global rule for either one
// would corrupt other clips:
//   1) 16.18 "i have a / really, good hopes" -> "i had / really good hopes". Whisper-small heard
//      "I have a", whisper-medium heard "as a"; the sentence continues "back when I WAS a four year
//      cycle zombie", so it is past tense. PERSONA GUARD: Mike is a FORMER four-year-cycle zombie,
//      present tense here would read as him still being one. A global ("i","have","a") rule would
//      wreck every legitimate "I have a" in the catalogue, so it is fixed here, not in the builder.
//   2) 20.60 "a year and a four months ago" -> "a year and / three or four" (+ months ago).
//      Whisper-small collapsed "three or" into a 0.38 s "a" (p=0.30); whisper-medium on 15.8-24.6 s
//      returned "a year and three or four months ago at this point". Split on the real word onset
//      (21.60) so the caption still tracks the audio.
//
// Readability regroups (same method, chunk boundaries only, no words changed): the 2.5-2.7 s
// "i wish" chunks split at their real word onsets, "below the / 50-week sma" so the term reads as
// one unit instead of a lone "sma", and "like mad, you know / mad bulls run on".
//
// No em dashes anywhere on screen.
export const CAPTIONS_ZOMB: { t: number; h: string }[] = [
  { t:   0.00, h: 'people, yeah, everybody' },
  { t:   0.94, h: 'asking me, you' },
  { t:   1.54, h: 'think <g>kaspa</g> was' },
  { t:   2.28, h: 'going to be' },
  { t:   2.72, h: 'a <y>dollar</y> by' },
  { t:   3.46, h: 'the end of the year.' },
  { t:   4.66, h: 'and no, man' },
  { t:   6.16, h: 'i wish' },
  { t:   7.34, h: 'man, i wish' },
  { t:   8.34, h: 'you know' },
  { t:   9.84, h: 'how much i wish' },
  { t:  10.34, h: '<g>kaspa</g> will be' },
  { t:  10.96, h: 'a <y>dollar.</y>' },
  { t:  11.30, h: 'i don\'t think' },
  { t:  11.84, h: 'so by the end of' },
  { t:  12.68, h: 'the year.' },
  { t:  13.16, h: 'i wish everything' },
  { t:  13.86, h: 'just gets like' },
  { t:  14.66, h: 'awesome.' },
  { t:  15.26, h: 'it starts running.' },
  { t:  16.18, h: 'i had' },
  { t:  16.68, h: 'really good hopes' },
  { t:  17.74, h: 'back when i was a' },
  { t:  18.78, h: 'four year cycle' },
  { t:  19.50, h: '<r>zombie,</r> probably like' },
  { t:  20.60, h: 'a year and' },
  { t:  21.60, h: 'three or four' },
  { t:  22.24, h: 'months ago at' },
  { t:  22.94, h: 'this point because' },
  { t:  23.52, h: '<r>tariff</r> season is' },
  { t:  24.32, h: 'what really changed' },
  { t:  25.00, h: 'me.' },
  { t:  25.34, h: 'i was like, what the' },
  { t:  25.92, h: 'hell is going' },
  { t:  26.34, h: 'on?' },
  { t:  28.38, h: 'we actually went' },
  { t:  29.40, h: 'below the' },
  { t:  29.98, h: '<y>50-week sma</y>' },
  { t:  31.18, h: 'in the post-halving' },
  { t:  32.20, h: 'year when we\'re' },
  { t:  33.12, h: 'supposed to be' },
  { t:  33.66, h: 'running like mad' },
  { t:  34.64, h: 'like mad, you know' },
  { t:  36.14, h: 'mad bulls run on' },
  { t:  38.74, h: 'whatever type of' },
  { t:  40.54, h: 'drug.' },
  { t:  41.00, h: 'i was like, what the' },
  { t:  41.50, h: 'hell is going' },
  { t:  41.98, h: 'on?' },
  { t:  42.24, h: 'like i thought' },
  { t:  42.94, h: 'that everything was' },
  { t:  44.30, h: 'going to be' },
  { t:  44.58, h: 'pumping.' },
  { t:  44.94, h: 'we\'re going to' },
  { t:  45.42, h: 'get like a' },
  { t:  45.84, h: 'magnificent cycle top' },
  { t:  47.14, h: 'and i started' },
  { t:  47.62, h: 'realizing like, no' },
  { t:  48.92, h: 'that\'s not happening' },
  { t:  49.72, h: 'man.' },
  { t:  50.26, h: 'i was like, oh' },
  { t:  50.86, h: 'that\'s not happening.' },
  { t:  51.68, h: 'so we just got to' },
  { t:  52.44, h: 'take it as it' },
  { t:  53.04, h: 'comes right now.' },
];
