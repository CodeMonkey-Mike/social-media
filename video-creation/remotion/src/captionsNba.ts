// captionsNba.ts — word-level captions for "The New Bottom Hits in August, Not October"
// batch new-bottom, clip #1, slug new-bottom-august (variant: full)
//
// Built by the CANONICAL captions skill (video-creation/skills/captions/captions.md, `montserrat`
// preset) from this clip's OWN fresh Whisper word timings:
//   whisper (small, word_timestamps) -> shorts/new-bottom/new-bottom-august/whisper-words-nba.json
//   python video-creation/skills/captions/build_captions.py \
//     --words .../whisper-words-nba.json --style montserrat --var CAPTIONS_NBA \
//     --colorize "r=zombies g=august gr=green y=bottom"
//
// STT corrections applied through the skill (never hand-patched here):
//   - "four-year cycle zombies" (Whisper's "four" + "-year" hyphen-merge; NEVER "for your cycle")
//   - "one less buy" -> "one last buy" (PHRASE_CORRECTIONS, new-bottom batch)
// Rendered lowercase by the `montserrat` preset (LivestreamShort forces textTransform: lowercase),
// which is the house caption style. No em dashes on screen.
export const CAPTIONS_NBA: { t: number; h: string }[] = [
  { t:   0.00, h: 'i can feel it like' },
  { t:   1.20, h: 'something\'s gonna happen.' },
  { t:   2.58, h: 'alright, and i' },
  { t:   3.30, h: 'don\'t think it\'s' },
  { t:   3.74, h: 'good.' },
  { t:   5.76, h: 'but, it makes' },
  { t:   6.74, h: 'me think that' },
  { t:   7.32, h: 'it\'s all gonna' },
  { t:   7.74, h: 'be over with soon.' },
  { t:   9.00, h: 'it\'s all gonna' },
  { t:   9.40, h: 'be over with soon.' },
  { t:  10.18, h: 'a lot of' },
  { t:  10.44, h: 'people are saying' },
  { t:  11.08, h: 'that things are' },
  { t:  11.86, h: 'building up for' },
  { t:  12.80, h: 'the october <y>bottom.</y>' },
  { t:  15.80, h: 'i don\'t think' },
  { t:  16.34, h: 'it is true.' },
  { t:  17.16, h: 'so all the' },
  { t:  17.68, h: 'four-year cycle <r>zombies</r>' },
  { t:  18.68, h: 'are gonna be' },
  { t:  19.10, h: 'buying back in' },
  { t:  19.74, h: 'october to turn' },
  { t:  20.56, h: 'october <gr>green.</gr>' },
  { t:  21.76, h: 'and those who' },
  { t:  22.76, h: 'are not four-year' },
  { t:  23.50, h: 'cycle <r>zombies</r> know' },
  { t:  24.58, h: 'that they\'re gonna' },
  { t:  25.20, h: 'turn october <gr>green.</gr>' },
  { t:  26.14, h: 'they\'re gonna get' },
  { t:  26.62, h: 'one last buy in' },
  { t:  27.68, h: 'september and they\'re' },
  { t:  28.44, h: 'gonna turn september' },
  { t:  28.98, h: '<gr>green.</gr>' },
  { t:  29.46, h: 'that\'s my thesis.' },
  { t:  30.52, h: 'that\'s my base' },
  { t:  31.12, h: 'case.' },
  { t:  31.38, h: 'we\'re gonna get' },
  { t:  31.96, h: 'a new <y>bottom.</y>' },
  { t:  32.66, h: 'it\'s gonna be' },
  { t:  33.02, h: 'some point very' },
  { t:  33.68, h: 'soon.' },
  { t:  34.14, h: 'whether it is' },
  { t:  34.84, h: 'in <g>august,</g> like' },
  { t:  35.58, h: 'i say, or it\'s in' },
  { t:  36.74, h: 'october, like everybody' },
  { t:  38.42, h: 'else said.' },
  { t:  39.28, h: 'so we\'re gonna' },
  { t:  39.92, h: 'get something and' },
  { t:  40.78, h: 'we\'ll bounce back' },
  { t:  41.52, h: 'real quick.' },
];
