// captionsKdk.ts — captions for "Kaspa at 2.7 Cents: Absolutely Unbelievable"
// batch new-bottom, clip #2, slug kaspa-dagknight-100x (variant: full)
//
// Built from the SPINE's own Whisper words (small model, word_timestamps) via the canonical
// captions skill: video-creation/skills/captions/build_captions.py --style montserrat
//   --words shorts/new-bottom/kaspa-dagknight-100x/whisper-words-kdk.json
//   --colorize "g=kaspa,dagknight,krc20,dog y=2.7,25,40,100,100xs,100x,200k,20,million,unbelievable
//               gr=pump,pumps r=pain"
//
// Delegated STT corrections — all now CANONICAL in build_captions.py (added 2026-07-25), not
// hand-patched here:
//   "Casper"/"Caspa" -> kaspa           (CORRECTIONS, pre-existing)
//   "Dagnight"/"Dagnite" -> dagknight   (CORRECTIONS, added this build: the single-token form the
//                                        ("dag","night") PHRASE rule can never match)
//   "KC20"/"KR20" -> krc20              (CORRECTIONS, pre-existing)
//   "2" + ".7" -> "2.7"                 (cleanup() decimal-continuation merge, added this build)
// ONE readability fix applied by hand after the build: "100xs" -> "100x's" (t 41.10).
// Colour: <g> Kaspa teal (kaspa / krc20 / dagknight dog), <y> numbers + "unbelievable",
// <gr> the pump, <r> the pain. No em dashes.
export const CAPTIONS_KDK: { t: number; h: string }[] = [
  { t:   0.00, h: 'let\'s not forget' },
  { t:   0.62, h: 'about <g>kaspa.</g>' },
  { t:   1.66, h: 'it\'s at <y>2.7</y>' },
  { t:   2.98, h: 'cents.' },
  { t:   4.68, h: 'anybody out there' },
  { t:   5.60, h: 'wants to collect' },
  { t:   6.26, h: '<y>2.7</y> cents right' },
  { t:   8.28, h: 'now.' },
  { t:   9.58, h: '<y>unbelievable.</y>' },
  { t:  13.02, h: 'absolutely <y>unbelievable.</y>' },
  { t:  14.32, h: 'when we get this <y>25</y>' },
  { t:  15.88, h: 'blocks per second' },
  { t:  17.10, h: 'upgrade and <y>40</y>' },
  { t:  17.94, h: 'blocks per second' },
  { t:  18.62, h: 'upgrade and eventually' },
  { t:  19.52, h: 'the eventual <y>100</y>' },
  { t:  20.46, h: 'blocks per second' },
  { t:  21.16, h: 'upgrade, i mean' },
  { t:  22.04, h: 'it\'s really gonna' },
  { t:  22.68, h: 'stand out.' },
  { t:  23.20, h: 'it\'s gonna be' },
  { t:  23.62, h: 'probably in time' },
  { t:  24.34, h: 'for some like' },
  { t:  24.90, h: 'massive <gr>pumps</gr> in' },
  { t:  25.94, h: 'the market overall.' },
  { t:  26.96, h: 'i don\'t think' },
  { t:  27.52, h: 'any of us out' },
  { t:  28.56, h: 'there should be' },
  { t:  29.06, h: 'sleeping on.' },
  { t:  29.62, h: 'some of these' },
  { t:  30.10, h: '<g>krc20</g> tokens, i' },
  { t:  31.30, h: 'don\'t think you' },
  { t:  31.68, h: 'should be sleeping' },
  { t:  32.20, h: 'on them either' },
  { t:  32.80, h: 'because they are' },
  { t:  33.56, h: 'gonna <gr>pump,</gr> eventually' },
  { t:  34.40, h: 'gonna <gr>pump.</gr>' },
  { t:  35.22, h: 'it\'s just a' },
  { t:  35.62, h: 'matter of enduring' },
  { t:  36.42, h: 'the <r>pain,</r> right?' },
  { t:  37.44, h: 'until they do' },
  { t:  38.22, h: 'enduring the <r>pain.</r>' },
  { t:  39.24, h: 'some of these' },
  { t:  39.60, h: 'tokens, man, you' },
  { t:  40.62, h: 'can get easy' },
  { t:  41.10, h: '<y>100x\'s</y> on them.' },
  { t:  42.22, h: '<g>dagknight</g> <g>dog</g> is' },
  { t:  43.14, h: 'a <y>200k</y> market' },
  { t:  45.06, h: 'cap.' },
  { t:  45.50, h: 'just go to <y>20</y>' },
  { t:  46.10, h: '<y>million.</y>' },
  { t:  46.74, h: 'i think that\'s' },
  { t:  47.26, h: '<y>100x.</y>' },
];
