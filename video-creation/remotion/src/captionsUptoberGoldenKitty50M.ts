// batch uptober / clip #5 - `golden-kitty-50-million` (FULL)
// CANONICAL captions skill output. Never hand-authored. Rebuilt by this EXACT invocation:
//   python video-creation/skills/captions/build_captions.py
//     --words video-creation/shorts/uptober/golden-kitty-50-million/whisper-words-verified.json
//     --style montserrat --var CAPTIONS_GK5 --max-secs 1.6
//     --colorize "gr=50,million,10x,pump,pumping,flying,growth,organic,up,run-up y=golden,kitty,kols,influencers,bulls,zombies"
//
// WORD SOURCE = whisper-words-VERIFIED.json = the batch whisper-words.json patched against medium.en
// staggered-window decodes (shorts/uptober/golden-kitty-50-million/_qa/res_stt.json) + clip-plan
// stt_caption_fixes: "going to" -> "gonna"; the stretched 1.38 s "is" (10.98-12.36) hides a "we're
// probably gonna," false start, trimmed to 10.98-11.30 and not captioned; "cycles, homages" -> "cycle
// zombies"; "run up" -> "run-up". "a big, big pump" is an intensifier doubling kept by PROTECTED_DOUBLES.
// GAP SCAN: no unexplained gaps (> 0.4 s) in the word stream; every medium.en window agrees on the words.
export const CAPTIONS_GK5: { t: number; h: string }[] = [
  { t:   0.00, h: '<y>golden</y> is gonna' },
  { t:   0.88, h: 'be pretty damn' },
  { t:   1.60, h: 'good.' },
  { t:   2.12, h: 'it should totally' },
  { t:   2.96, h: 'go <gr>up</gr> just' },
  { t:   3.66, h: 'because of the' },
  { t:   4.62, h: 'amount of action' },
  { t:   5.28, h: 'it has going' },
  { t:   5.82, h: 'on with <y>influencers</y>' },
  { t:   6.80, h: 'and <y>kols.</y>' },
  { t:   7.72, h: 'the <y>bulls</y> start' },
  { t:   8.34, h: 'running in a' },
  { t:   8.94, h: 'couple weeks.' },
  { t:   9.60, h: 'i mean, something' },
  { t:  10.12, h: 'like <y>golden</y> <y>kitty</y>' },
  { t:  10.98, h: 'is' },
  { t:  12.36, h: 'probably gonna go' },
  { t:  13.52, h: '<gr>up</gr> to like, you know' },
  { t:  14.74, h: 'like <gr>50</gr> <gr>million</gr>' },
  { t:  15.40, h: 'or something.' },
  { t:  15.90, h: 'that is gonna' },
  { t:  16.46, h: 'be like a big, big' },
  { t:  17.42, h: '<gr>pump.</gr>' },
  { t:  17.80, h: '<y>golden</y> <y>kitty</y> could' },
  { t:  18.48, h: 'be a pretty' },
  { t:  18.94, h: 'good meme with' },
  { t:  19.46, h: '<gr>organic</gr> <gr>growth.</gr>' },
  { t:  20.22, h: 'man, i wish we get' },
  { t:  21.62, h: 'a <gr>run-up</gr> caused' },
  { t:  22.56, h: 'by these four-year' },
  { t:  23.48, h: 'cycle <y>zombies</y> buying' },
  { t:  24.58, h: 'back in and' },
  { t:  25.28, h: 'things start <gr>pumping.</gr>' },
  { t:  26.22, h: 'like something like' },
  { t:  26.66, h: '<y>golden</y> <y>kitty</y> and' },
  { t:  27.54, h: 'a lot of them, man' },
  { t:  28.34, h: 'are gonna be' },
  { t:  29.18, h: '<gr>flying.</gr>' },
  { t:  29.34, h: 'it\'s gonna be' },
  { t:  29.92, h: 'maybe like <gr>10x</gr>' },
  { t:  30.78, h: 'from here.' },
];
