import { staticFile } from 'remotion';

export const FPS = 30;
export const W   = 1080;
export const H   = 1920;

// publicDir is set to video-creation/assets/ in remotion.config.ts
export const FACE_VIDEO = staticFile('tyson-facecam-cut.mp4');
export const LOGO_KASPA = staticFile('logo-kaspa.png');
export const LOGO_BTC   = staticFile('logo-btc.png');
export const LOGO_ETH   = staticFile('logo-eth.png');
export const IMG_TYSON  = staticFile('broll-tyson.png');
export const IMG_KO     = staticFile('broll-knockout.png');
export const IMG_CHART  = staticFile('kas-chart.png');

// ─── B-roll panels ────────────────────────────────────────────────────────────
export const BROLL_RANGES = [
  { id: 'hook',     start:  0.00, end:  12.64 },
  { id: 'tyson',   start: 12.64, end:  32.04 },
  { id: 'knockout',start: 32.04, end:  68.72 },
  { id: 'eth-btc', start: 68.72, end:  91.04 },
  { id: 'chart',   start: 91.04, end:  99.00 },
  { id: 'kas-eth', start: 99.00, end: 110.00 },
];

// ─── Special state ranges (seconds) ──────────────────────────────────────────
export const FULLBROLL_RANGE  = { start: 32.04, end: 33.54 };
export const FULLFACE_RANGE   = { start: 46.90, end: 48.90 };
export const FACE_BADGE_RANGE = { start: 20.98, end: 23.00 };

// ─── Captions ─────────────────────────────────────────────────────────────────
export const CAPTIONS: { t: number; h: string }[] = [
  { t:   0.00, h: 'why why why I' },
  { t:   2.74, h: "think it's gonna" },
  { t:   3.40, h: 'be like a' },
  { t:   3.92, h: '<span class="r">knockout</span> you know' },
  { t:   4.68, h: "it's gonna be" },
  { t:   5.06, h: "like it's gonna" },
  { t:   5.78, h: 'be like I mean' },
  { t:   6.50, h: 'I was a' },
  { t:   7.26, h: 'young kid' },
  { t:   8.06, h: 'but anyway older' },
  { t:   8.96, h: 'older folks out' },
  { t:  10.10, h: 'there I guess' },
  { t:  10.54, h: 'my age and' },
  { t:  11.08, h: 'older right any' },
  { t:  11.82, h: 'of you older' },
  { t:  12.28, h: 'folks you remember' },
  { t:  13.18, h: 'was like <span class="o">mike</span>' },
  { t:  13.86, h: '<span class="o">tyson mike tyson</span>' },
  { t:  15.30, h: 'was like unbeatable' },
  { t:  16.44, h: "he's like every" },
  { t:  17.82, h: 'single year every' },
  { t:  19.16, h: 'single bout you' },
  { t:  19.90, h: "know he's gonna" },
  { t:  20.32, h: "win that's <span class='o'>mike</span>" },
  { t:  20.98, h: "<span class='o'>tyson</span> that's <span class='o'>bitcoin</span>" },
  { t:  21.92, h: 'like unbeatable' },
  { t:  23.08, h: 'like it feels' },
  { t:  23.90, h: "like it's gonna" },
  { t:  24.44, h: 'be forever that' },
  { t:  25.54, h: 'this guy is' },
  { t:  26.24, h: 'gonna be on' },
  { t:  26.82, h: "top right he's" },
  { t:  27.94, h: 'always gonna be' },
  { t:  28.84, h: 'on top because' },
  { t:  29.48, h: "that's just the" },
  { t:  30.08, h: 'way he is' },
  { t:  30.74, h: 'nobody can beat' },
  { t:  31.60, h: 'this guy' },
  { t:  32.16, h: 'then along comes' },
  { t:  33.30, h: '<span class="g">buster douglas</span>' },
  { t:  34.32, h: 'if you guys' },
  { t:  35.24, h: 'remember <span class="o">mike tyson</span>' },
  { t:  36.54, h: 'just went through' },
  { t:  37.22, h: 'a divorce and' },
  { t:  38.68, h: 'his his his' },
  { t:  39.40, h: 'mind was like' },
  { t:  40.44, h: 'you know out' },
  { t:  41.22, h: 'of it he' },
  { t:  41.84, h: "wasn't training" },
  { t:  42.78, h: 'and he got' },
  { t:  43.48, h: '<span class="r">knocked</span> out by' },
  { t:  44.48, h: 'james <span class="g">buster douglas</span>' },
  { t:  46.08, h: "and it's like" },
  { t:  46.90, h: 'holy crap' },
  { t:  47.78, h: 'somebody beat' },
  { t:  49.18, h: '<span class="o">mike tyson</span>' },
  { t:  50.48, h: 'somebody beat' },
  { t:  51.36, h: '<span class="o">mike tyson</span>' },
  { t:  57.62, h: 'the greatest boxer' },
  { t:  59.40, h: 'ever the iron' },
  { t:  61.32, h: '<span class="o">mike tyson</span>' },
  { t:  62.50, h: 'just got' },
  { t:  63.46, h: '<span class="r">knocked</span> out' },
  { t:  64.48, h: "he's not number" },
  { t:  65.50, h: 'one anymore right' },
  { t:  67.28, h: "so there's gonna" },
  { t:  67.76, h: 'be like that' },
  { t:  68.32, h: 'with <span class="p">eth</span>' },
  { t:  68.88, h: '<span class="p">eth</span> is gonna' },
  { t:  69.52, h: 'be <span class="o">bitcoin</span> and' },
  { t:  70.86, h: 'then when james' },
  { t:  71.48, h: '<span class="g">buster douglas</span>' },
  { t:  72.50, h: 'this unstoppable' },
  { t:  73.38, h: 'the unstoppable guy' },
  { t:  75.52, h: 'who actually beat' },
  { t:  76.56, h: 'the king he' },
  { t:  77.54, h: 'beat the guy' },
  { t:  78.24, h: "who couldn't be" },
  { t:  78.72, h: 'stopped' },
  { t:  79.16, h: '<span class="g">buster douglas</span>' },
  { t:  80.22, h: '<span class="r">lost</span> and the' },
  { t:  81.72, h: 'next bout' },
  { t:  82.44, h: 'he went <span class="r">down</span>' },
  { t:  84.20, h: 'I think' },
  { t:  85.64, h: "that's gonna happen" },
  { t:  86.34, h: 'with <span class="p">eth</span>' },
  { t:  86.98, h: '<span class="p">eth</span> is gonna' },
  { t:  87.58, h: 'be <span class="p">eth</span> is' },
  { t:  88.52, h: 'gonna beat <span class="o">bitcoin</span>' },
  { t:  89.36, h: "and then it's" },
  { t:  90.46, h: 'gonna be like' },
  { t:  91.16, h: 'you know shortly' },
  { t:  92.06, h: 'after I think' },
  { t:  93.02, h: '<span class="g">kaspa</span> is gonna' },
  { t:  93.72, h: '<span class="g">kaspa</span> is gonna' },
  { t:  94.66, h: "you know he's" },
  { t:  95.50, h: 'gonna beat <span class="g">buster</span>' },
  { t:  96.36, h: '<span class="g">douglas</span> gonna be' },
  { t:  96.98, h: 'like that so' },
  { t:  98.80, h: "we'll see we'll" },
  { t:  99.76, h: "see because that's" },
  { t: 100.56, h: 'a long road' },
  { t: 102.02, h: "that's a long" },
  { t: 102.48, h: 'way into the' },
  { t: 102.96, h: 'future but with' },
  { t: 103.78, h: 'something like this' },
  { t: 104.62, h: 'all this stuff' },
  { t: 105.14, h: "we're talking about" },
  { t: 105.80, h: 'why why' },
];

// ─── Sound events ─────────────────────────────────────────────────────────────
export const SOUND_EVENTS: { t: number; src: string }[] = [
  { t:  0.00, src: staticFile('sfx/Riser Sound Effect.mp3') },
  { t: 12.64, src: staticFile('sfx/TING SOUND EFFECT.mp3') },
  { t: 20.98, src: staticFile('sfx/Cash Register.mp3') },
  { t: 32.04, src: staticFile('sfx/Boom - Big Reveal.wav') },
  { t: 43.48, src: staticFile('sfx/Punch 1.mp3') },
  { t: 46.90, src: staticFile('sfx/WAIT WHAT  SOUND EFFECT.mp3') },
  { t: 68.72, src: staticFile('sfx/Cinematic Whoosh 02.wav') },
  { t: 91.04, src: staticFile('sfx/Cash Register Kaching  Sound Effect HD.mp3') },
];
