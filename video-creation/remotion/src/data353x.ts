import { staticFile } from 'remotion';
import { TEAL, YELLOW, GREEN, RED, ORANGE } from './_kit';
import type { ShortData } from './LivestreamShort';

const FPS = 30;
const RISER = staticFile('sfx/ding/rising-dramatic-riser-sfx.mp3');
const WHOOSH = staticFile('sfx/Cinematic Whoosh 02.wav');
const DING = staticFile('sfx/DING.mp3');
const BOOM = staticFile('sfx/Boom - Big Reveal.wav');

const A = (f: string) => staticFile(f);

export const FRAMES = { short: 480, medium: 1143, long: 2269, moonbag: 1651, saylor: 1779, warsh: 580 };

// macro b-roll (clips 6/7) — generated via repurpose/broll-353x-macro-images.json
const SAYLOR = A('broll-353x-saylor-btc.png');
const BTC_BREAK = A('broll-353x-btc-breakdown.png');
const BTC_LEVELS = A('broll-353x-btc-levels.png');
const WARSH = A('broll-353x-warsh-portrait.png');
const FED_CRYPTO = A('broll-353x-fed-crypto.png');

// b-roll assets (generated via repurpose/broll-353x-images.json)
const ROCKET = A('broll-353x-rocket.png');
const BEAR = A('broll-353x-bear.png');
const LABGEM = A('broll-353x-labgem.png');
const BEAUTIFUL = A('broll-353x-beautiful.png');
const LAB_LOGO = A('lab-logo.png');   // the real $LAB logo (green flask + LAB wordmark)
const LAB_LOGO_DEF = { src: LAB_LOGO, glow: GREEN, watermark: { width: 196, top: 26, left: 26 } };

// ── UNIQUE per-clip b-roll for the MEDIUM (#2) and LONG (#3) edits ────────────
// No-duplicate rule: short(#1) keeps ROCKET/BEAR; medium and long each get their
// own distinct treatment of every repeated beat. (regen 2026-06-03)
const M_JACKPOT   = A('broll-353x-m-jackpot.png');     // vault bursting w/ coins (distinct opener)
const M_BEAR      = A('broll-353x-m-bear.png');        // bull over frozen bear
const M_GEM       = A('broll-353x-m-gem.png');         // gem in tongs
const M_RECOVER   = A('broll-353x-m-recover.png');     // V-shape bounce
const M_BEAUTIFUL = A('broll-353x-m-beautiful.png');   // parabolic curve
const L_FIREWORKS = A('broll-353x-l-fireworks.png');   // fireworks over skyline (distinct opener)
const L_REVEAL    = A('broll-353x-l-reveal.png');      // supernova starburst (distinct reveal, no rocket)
const L_BEAR      = A('broll-353x-l-bear.png');        // candle through cage
const L_GEM       = A('broll-353x-l-gem.png');         // gem in scanner beam
const L_BEAUTIFUL = A('broll-353x-l-beautiful.png');   // aurora wave
// transparent image overlays (alpha PNGs, glow-on-black -> alpha-from-luminance)
const OV_M_ARROW  = A('ov-353x-m-arrow.png');          // glowing up-arrow
const OV_L_COIN   = A('ov-353x-l-coin.png');           // glowing radar + coin

// ─── Clip 1: 353x reveal — SHORT punch (16.17s) ──────────────────────────────
export const D353X_SHORT: ShortData = {
  clip: A('353x-short.mp4'), fps: FPS, durationS: 16.17,
  captions: [
    { t: 0.40, h: 'we have a' },
    { t: 1.48, h: '<gr>353x.</gr>' },
    { t: 7.84, h: '<y>unbelievable.</y>' },
    { t: 9.10, h: "i can't" },
    { t: 9.54, h: 'believe it.' },
    { t: 10.70, h: "i can't" },
    { t: 11.10, h: 'believe it.' },
    { t: 12.88, h: 'and we did it' },
    { t: 13.60, h: 'in a <r>bear market.</r>' },
    { t: 14.68, h: 'in a <r>bear market.</r>' },
    { t: 15.64, h: 'it is <y>crazy.</y>' },
  ],
  broll: [
    { src: ROCKET, tIn: 0.0, tOut: 7.6, mode: 'full' },
    { src: BEAR, tIn: 13.3, tOut: 15.5, mode: 'full' },
  ],
  badges: [
    { tIn: 2.4, tOut: 7.5, color: GREEN, line1: '353X', sub: 'IN A BEAR MARKET', top: 460 },
  ],
  thumb: { title: '353X\nIN A BEAR\nMARKET', chip: 'PRIVATE GEM CALL', chipColor: GREEN, titleSize: 118, durS: 2.3 },
  logo: { ...LAB_LOGO_DEF, reveal: { tIn: 2.4, tOut: 7.4, top: 120, width: 420 } },
  sounds: [{ t: 0.0, src: RISER }, { t: 1.5, src: BOOM }, { t: 13.3, src: WHOOSH }],
};

// ─── Clip 2: 353x reveal — MEDIUM (38.45s) ───────────────────────────────────
export const D353X_MEDIUM: ShortData = {
  clip: A('353x-medium.mp4'), fps: FPS, durationS: 38.45,
  captions: [
    { t: 0.40, h: 'we have a' },
    { t: 1.48, h: '<gr>353x.</gr>' },
    { t: 7.84, h: '<y>unbelievable.</y>' },
    { t: 9.10, h: "i can't" },
    { t: 9.54, h: 'believe it.' },
    { t: 10.70, h: "i can't" },
    { t: 11.10, h: 'believe it.' },
    { t: 12.88, h: 'and we did it' },
    { t: 13.60, h: 'in a <r>bear market.</r>' },
    { t: 14.68, h: 'in a <r>bear market.</r>' },
    { t: 15.64, h: 'it is <y>crazy.</y>' },
    { t: 17.16, h: '<gr>353x</gr> and that' },
    { t: 18.56, h: 'is on <gr>lab.</gr>' },
    { t: 19.76, h: 'one of my' },
    { t: 20.46, h: '<y>private gems.</y>' },
    { t: 22.32, h: 'the funny thing is' },
    { t: 23.30, h: 'i only gave it' },
    { t: 24.10, h: 'a target of a' },
    { t: 24.82, h: '<y>20x.</y>' },
    { t: 25.56, h: 'and i went to' },
    { t: 25.90, h: '<gr>353x.</gr>' },
    { t: 26.94, h: 'and it still' },
    { t: 27.56, h: "didn't even <r>dump.</r>" },
    { t: 28.66, h: 'it looked like it' },
    { t: 29.86, h: 'was gonna go into' },
    { t: 30.52, h: '<r>dump mode</r>' },
    { t: 31.26, h: 'last night.' },
    { t: 32.22, h: 'and then an' },
    { t: 32.96, h: "hour's recovery" },
    { t: 33.78, h: "it's going <gr>up again</gr>" },
    { t: 34.80, h: "it's going <gr>up again.</gr>" },
    { t: 35.98, h: 'but look at this.' },
    { t: 36.96, h: 'have you ever seen' },
    { t: 37.64, h: 'something more <y>beautiful?</y>' },
  ],
  broll: [
    { src: M_JACKPOT, tIn: 0.0, tOut: 7.6, mode: 'full' },
    { src: M_BEAR, tIn: 13.3, tOut: 15.5, mode: 'full' },
    { src: M_GEM, tIn: 17.6, tOut: 21.3, mode: 'content' },
    { src: M_RECOVER, tIn: 33.6, tOut: 35.9, mode: 'content' },
    { src: M_BEAUTIFUL, tIn: 35.9, tOut: 38.45, mode: 'full' },
  ],
  overlays: [
    { src: OV_M_ARROW, tIn: 9.2, tOut: 12.4, top: 250, left: 410, width: 260, blend: 'normal' },
  ],
  badges: [
    { tIn: 2.4, tOut: 7.5, color: GREEN, line1: '353X', sub: 'IN A BEAR MARKET', top: 460 },
    { tIn: 23.4, tOut: 25.3, color: YELLOW, line1: '20X', sub: 'MY TARGET', top: 300 },
    { tIn: 25.9, tOut: 27.0, color: GREEN, line1: '353X', sub: 'ACTUAL', top: 300 },
  ],
  thumb: { title: '353X\nIN A BEAR\nMARKET', chip: 'HOW I CALLED IT', chipColor: GREEN, titleSize: 118, durS: 2.3 },
  logo: { ...LAB_LOGO_DEF, reveal: { tIn: 2.4, tOut: 7.4, top: 120, width: 420 } },
  sounds: [
    { t: 0.0, src: RISER }, { t: 1.5, src: BOOM }, { t: 13.3, src: WHOOSH },
    { t: 17.6, src: WHOOSH }, { t: 23.4, src: DING }, { t: 25.9, src: BOOM }, { t: 35.9, src: BOOM },
  ],
};

// ─── Clip 3: 353x reveal — LONG / full story (76.3s) ─────────────────────────
export const D353X_LONG: ShortData = {
  clip: A('353x-long.mp4'), fps: FPS, durationS: 76.3,
  captions: [
    { t: 0.0, h: 'we kept going' }, { t: 1.0, h: '<gr>up and up</gr>' }, { t: 2.7, h: '<gr>and up</gr>' },
    { t: 3.8, h: 'it was absolutely' }, { t: 4.7, h: 'amazing' }, { t: 5.2, h: 'it deserves a song' },
    { t: 11.3, h: "it's been insane" }, { t: 15.2, h: 'we have a' }, { t: 19.7, h: '<gr>353x</gr>' },
    { t: 22.7, h: '<y>unbelievable</y>' }, { t: 23.4, h: "i can't believe it" }, { t: 25.1, h: "i can't believe it" },
    { t: 28.0, h: 'and we did it' }, { t: 28.8, h: 'in a <r>bear market</r>' }, { t: 29.7, h: 'in a <r>bear market</r>' },
    { t: 30.7, h: 'it is <y>crazy</y>' }, { t: 32.0, h: '<gr>353x</gr> and that' }, { t: 33.7, h: 'is on <gr>lab</gr>' },
    { t: 34.9, h: 'one of my' }, { t: 35.7, h: '<y>private gems</y>' }, { t: 37.3, h: 'the funny thing is' },
    { t: 38.4, h: 'i only gave it' }, { t: 39.3, h: 'a target of a' }, { t: 40.0, h: '<y>20x</y>' },
    { t: 40.8, h: 'and i went to' }, { t: 41.1, h: '<gr>353x</gr>' }, { t: 42.4, h: 'and it still' },
    { t: 42.8, h: "didn't even <r>dump</r>" }, { t: 43.5, h: 'it looked like it' }, { t: 44.6, h: 'was gonna go into' },
    { t: 45.7, h: '<r>dump mode</r>' }, { t: 46.4, h: 'last night' }, { t: 47.6, h: 'and then an' },
    { t: 48.2, h: "hour's recovering" }, { t: 49.0, h: "it's going <gr>up again</gr>" }, { t: 50.0, h: "it's going <gr>up again</gr>" },
    { t: 50.9, h: 'but look at this' }, { t: 52.1, h: 'have you ever seen' }, { t: 52.8, h: 'something more <y>beautiful</y>' },
    { t: 54.0, h: 'look at this' }, { t: 54.4, h: '<y>unbelievable</y>' }, { t: 56.4, h: 'unbelievable guys' },
    { t: 58.0, h: 'this is amazing' }, { t: 58.7, h: 'this was found by' }, { t: 60.1, h: 'my <g>insider alert</g>' },
    { t: 61.7, h: 'it scans new tokens' }, { t: 63.6, h: 'as they launch' }, { t: 64.6, h: 'and identifies' },
    { t: 65.4, h: 'which ones' }, { t: 67.6, h: 'are gonna <gr>pump</gr>' }, { t: 68.5, h: 'and it did' },
    { t: 69.6, h: 'it was <gr>right again</gr>' }, { t: 71.4, h: 'and this is now' }, { t: 73.4, h: 'the <y>second best call</y>' },
    { t: 75.4, h: 'in my community' },
  ],
  broll: [
    { src: L_FIREWORKS, tIn: 0.0, tOut: 7.5, mode: 'full' },
    { src: L_REVEAL, tIn: 15.2, tOut: 22.5, mode: 'full' },
    { src: L_BEAR, tIn: 28.4, tOut: 31.2, mode: 'full' },
    { src: L_GEM, tIn: 33.5, tOut: 37.0, mode: 'content' },
    { src: L_BEAUTIFUL, tIn: 51.4, tOut: 54.0, mode: 'full' },
  ],
  overlays: [
    { src: OV_L_COIN, tIn: 60.0, tOut: 67.4, top: 300, left: 350, width: 380, blend: 'normal' },
  ],
  badges: [
    { tIn: 19.7, tOut: 22.4, color: GREEN, line1: '353X', sub: 'IN A BEAR MARKET', top: 460 },
    { tIn: 39.9, tOut: 41.0, color: YELLOW, line1: '20X', sub: 'MY TARGET', top: 300 },
    { tIn: 41.1, tOut: 42.3, color: GREEN, line1: '353X', sub: 'ACTUAL', top: 300 },
  ],
  logo: { ...LAB_LOGO_DEF, reveal: { tIn: 15.2, tOut: 22.4, top: 120, width: 420 } },
  thumb: { title: '353X\nIN A BEAR\nMARKET', chip: 'THE FULL STORY', chipColor: GREEN, titleSize: 118, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 19.7, src: BOOM }, { t: 28.4, src: WHOOSH },
    { t: 33.5, src: WHOOSH }, { t: 39.9, src: DING }, { t: 51.4, src: BOOM },
  ],
};

// ─── Clip 4: moon-bag lesson (55.8s) ─────────────────────────────────────────
export const D353X_MOONBAG: ShortData = {
  clip: A('353x-moonbag.mp4'), fps: FPS, durationS: 55.8,
  captions: [
    { t: 0.0, h: 'i sold the majority' }, { t: 0.9, h: 'of my bag' }, { t: 2.3, h: 'at an <y>87x</y>' },
    { t: 3.3, h: 'it was at <y>$6</y>' }, { t: 4.4, h: 'but i did keep' }, { t: 5.0, h: 'a <gr>moon bag</gr>' },
    { t: 5.6, h: "and i've been selling" }, { t: 6.2, h: 'portions of it' }, { t: 7.4, h: 'ever so often' },
    { t: 9.0, h: 'this is making up' }, { t: 10.7, h: 'for me sort of' }, { t: 11.5, h: 'exiting early' },
    { t: 12.3, h: 'selling like <y>10%</y>' }, { t: 14.6, h: 'way way back' }, { t: 16.0, h: 'when it was' },
    { t: 18.0, h: 'three or four dollars' }, { t: 21.8, h: 'my moon bag is' }, { t: 22.6, h: 'making up for that' },
    { t: 23.6, h: 'so it is awesome' }, { t: 24.7, h: '<y>lesson learned</y>' }, { t: 26.5, h: 'you got to keep' },
    { t: 27.0, h: 'a <gr>moon bag</gr>' }, { t: 28.8, h: '<y>10%</y> of your' }, { t: 30.4, h: 'original bag' },
    { t: 33.6, h: 'because when it goes' }, { t: 35.1, h: 'to an <gr>80x</gr>' }, { t: 36.0, h: 'to a <gr>350x</gr>' },
    { t: 37.5, h: "you're gonna want" }, { t: 38.1, h: 'to sell some' }, { t: 39.2, h: 'on a <gr>350x</gr>' },
    { t: 41.2, h: 'i think i have' }, { t: 41.9, h: 'like 20 more tokens' }, { t: 43.6, h: "left, that's it" },
    { t: 45.0, h: 'for my moon bag' }, { t: 47.5, h: 'all time high is' }, { t: 49.1, h: '<gr>$27</gr>' },
    { t: 50.2, h: "let's see if it" }, { t: 51.2, h: 'gets back up' }, { t: 52.0, h: 'beyond that again' },
    { t: 53.0, h: "i'll sell some more" }, { t: 54.1, h: 'just keep selling' }, { t: 55.1, h: 'my moon bag' },
  ],
  broll: [
    { src: LABGEM, tIn: 0.0, tOut: 5.2, mode: 'content' },
    { src: ROCKET, tIn: 34.8, tOut: 39.8, mode: 'content' },
    { src: BEAUTIFUL, tIn: 47.2, tOut: 51.0, mode: 'full' },
    { src: LABGEM, tIn: 53.0, tOut: 55.8, mode: 'content' },
  ],
  badges: [
    { tIn: 2.4, tOut: 4.6, color: YELLOW, line1: '87X', sub: 'SOLD THE MAJORITY', top: 460 },
    { tIn: 35.8, tOut: 39.7, color: GREEN, line1: '350X', sub: 'TAKE PROFIT', top: 300 },
    { tIn: 48.9, tOut: 51.3, color: GREEN, line1: '$27', line2: 'ALL-TIME HIGH', top: 300 },
  ],
  logo: { ...LAB_LOGO_DEF, reveal: { tIn: 2.4, tOut: 6.5, top: 120, width: 420 } },
  thumb: { title: 'SOLD AT 87X\nIT HIT 353X', chip: 'THE MOON BAG RULE', chipColor: GREEN, titleSize: 104, durS: 2.3 },
  sounds: [{ t: 0.0, src: RISER }, { t: 2.3, src: DING }, { t: 35.8, src: BOOM }, { t: 48.9, src: BOOM }],
};

// ─── Clip 6: Saylor sold a fraction, everyone panicked (60.0s) — BTC/macro ───
export const D353X_SAYLOR: ShortData = {
  clip: A('353x-saylor.mp4'), fps: FPS, durationS: 60.0,
  captions: [
    { t: 0.0, h: 'we finally broke' }, { t: 0.9, h: 'below this channel' }, { t: 2.0, h: 'because <o>michael saylor</o>' },
    { t: 3.2, h: 'sold like a fraction' }, { t: 5.1, h: 'of a percent' }, { t: 5.7, h: 'of his <o>bitcoin</o>' },
    { t: 7.7, h: 'and everybody' }, { t: 9.2, h: '<r>freaked out</r>' }, { t: 10.1, h: 'everybody saw selling' },
    { t: 11.2, h: 'and we <r>started going down</r>' }, { t: 12.5, h: 'now if that' }, { t: 13.8, h: '<r>massive attack</r>' },
    { t: 15.3, h: 'might happen' }, { t: 16.2, h: 'if the' }, { t: 17.4, h: '<r>war is inevitable</r>' },
    { t: 19.2, h: 'the us is going to' }, { t: 20.1, h: 'unleash everything' }, { t: 22.6, h: 'the military has been' },
    { t: 23.3, h: 'building up' }, { t: 24.8, h: 'nine weeks right now' }, { t: 27.0, h: 'for that attack' },
    { t: 30.5, h: "i'm sure the buildup" }, { t: 32.6, h: 'is massive right now' }, { t: 33.9, h: 'so if that happens' },
    { t: 35.4, h: 'we should see' }, { t: 35.9, h: '<o>bitcoin</o> drop' }, { t: 36.6, h: 'a little bit lower' },
    { t: 37.6, h: 'how low can it go' }, { t: 39.0, h: '<y>61k</y>' }, { t: 40.4, h: 'which is the' },
    { t: 41.1, h: '<y>200-week sma</y>' }, { t: 42.2, h: 'or could it go' }, { t: 43.2, h: 'to its bottom' },
    { t: 44.4, h: '<r>59k</r>' }, { t: 45.3, h: 'a lot of people' }, { t: 47.5, h: 'are expecting it' },
    { t: 49.4, h: 'the market has become' }, { t: 50.2, h: 'immune to anything' }, { t: 51.3, h: 'that happens over there' },
    { t: 52.4, h: 'people react more' }, { t: 54.2, h: 'to <o>saylor</o> selling' }, { t: 55.5, h: 'a fraction of a percent' },
    { t: 57.4, h: 'of his <o>bitcoin</o>' }, { t: 58.6, h: 'than some attack' },
  ],
  broll: [
    { src: SAYLOR, tIn: 0.0, tOut: 6.2, mode: 'full' },
    { src: BTC_BREAK, tIn: 8.8, tOut: 12.2, mode: 'full' },
    { src: BTC_LEVELS, tIn: 37.5, tOut: 44.8, mode: 'full' },
    { src: SAYLOR, tIn: 52.2, tOut: 58.5, mode: 'content' },
  ],
  badges: [
    { tIn: 39.0, tOut: 42.0, color: ORANGE, line1: '61K', sub: '200-WEEK SMA', top: 300 },
    { tIn: 44.4, tOut: 46.5, color: RED, line1: '59K', sub: 'THE BOTTOM', top: 300 },
  ],
  thumb: { title: 'SAYLOR SOLD\n0.0...%\nEVERYONE\nPANICKED', chip: 'BTC LEVELS TO WATCH', chipColor: ORANGE, titleSize: 88, durS: 2.3 },
  sounds: [{ t: 0.0, src: RISER }, { t: 8.8, src: WHOOSH }, { t: 37.5, src: WHOOSH }, { t: 39.0, src: DING }],
};

// ─── Clip 7: the new Fed chair has $100M in crypto (19.7s) — Fed/macro ───────
export const D353X_WARSH: ShortData = {
  clip: A('353x-warsh.mp4'), fps: FPS, durationS: 19.7,
  captions: [
    { t: 0.0, h: '<o>kevin warsh</o>' }, { t: 1.1, h: 'the new fed chair' }, { t: 1.8, h: 'has over' },
    { t: 2.4, h: '<y>$100 million</y>' }, { t: 3.8, h: 'in crypto' }, { t: 4.5, h: 'this is crazy' },
    { t: 5.6, h: '<y>$100 million</y>' }, { t: 6.5, h: 'in crypto' }, { t: 9.7, h: 'one of those things' },
    { t: 10.4, h: 'so like this guy' }, { t: 11.9, h: 'this guy is going' }, { t: 12.5, h: 'to be <gr>on our side</gr>' },
    { t: 13.7, h: "right? because he's" }, { t: 14.9, h: 'gonna want to' }, { t: 15.6, h: 'protect crypto too' },
    { t: 16.6, h: 'protect his own' }, { t: 18.2, h: 'so hopefully' }, { t: 18.8, h: 'things work out' },
  ],
  broll: [
    { src: WARSH, tIn: 0.0, tOut: 4.4, mode: 'full' },
    { src: FED_CRYPTO, tIn: 4.4, tOut: 7.0, mode: 'full' },
    { src: WARSH, tIn: 14.6, tOut: 17.2, mode: 'content' },
  ],
  badges: [
    { tIn: 2.4, tOut: 5.0, color: YELLOW, line1: '$100M+', sub: 'IN CRYPTO', top: 300 },
  ],
  thumb: { title: 'THE NEW\nFED CHAIR HAS\n$100M IN\nCRYPTO', chip: "HE'S ON OUR SIDE", chipColor: YELLOW, titleSize: 90, durS: 2.3 },
  sounds: [{ t: 0.0, src: RISER }, { t: 2.4, src: BOOM }, { t: 14.6, src: WHOOSH }],
};
