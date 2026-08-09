import { staticFile } from 'remotion';
import { YELLOW, GREEN, RED, ORANGE } from './_kit';
import type { ShortData } from './LivestreamShort';

// ─── best-350x batch (livestream: "Best 350x Cryptos To Make Me Millions") ──────
// Phase 5 production data. Clip 1 = 353x-20x-punch — built first as the STYLE TEMPLATE
// for Mike's eyeball before the other 7 clips are batched. (RESUME-TODO.md)

const FPS = 30;
const A = (f: string) => staticFile(f);

// Shared SFX (same set proven on the 353x reveal batch)
const RISER = A('sfx/ding/rising-dramatic-riser-sfx.mp3');
const WHOOSH = A('sfx/Cinematic Whoosh 02.wav');
const DING = A('sfx/DING.mp3');
const BOOM = A('sfx/Boom - Big Reveal.wav');

// Real $LAB logo (green flask + LAB wordmark) — brand watermark + timed reveal plate.
const LAB_LOGO = A('lab-logo.png');
const LAB_LOGO_DEF = { src: LAB_LOGO, glow: GREEN, watermark: { width: 196, top: 26, left: 26 } };

// Per-clip b-roll (drafted in repurpose/broll-best350x-c1.json, generated UNIQUE — no reuse).
const C1_OVERSHOOT = A('broll-best350x-c1-overshoot.png'); // candle blasting past the target line
const C1_BEARMARKET = A('broll-best350x-c1-bearmarket.png'); // green candle erupting through ice

export const FRAMES_B350 = {
  c1: 293, c2: 461, c3: 442, c4: 222, c5: 1343, c6: 1929, c7: 1323, c8: 351,
};

// Per-clip b-roll for clips 2-8 (drafted in repurpose/broll-best350x-c2to8.json, all UNIQUE).
const C2_GEM = A('broll-best350x-c2-gem.png');
const C2_PUMP40 = A('broll-best350x-c2-pump40.png');
const C2_BLAST353 = A('broll-best350x-c2-blast353.png');
const C3_SQUEEZE = A('broll-best350x-c3-squeeze.png');
const C3_PUPPET = A('broll-best350x-c3-puppeteer.png');
const C4_SAYLOR = A('broll-best350x-c4-saylor.png');
const C4_PANIC = A('broll-best350x-c4-panic.png');
const C5_ECONOMY = A('broll-best350x-c5-economy.png');
const C5_ZOMBIES = A('broll-best350x-c5-zombies.png');
const C5_HORMUZ = A('broll-best350x-c5-hormuz.png');
const C5_STRENGTH = A('broll-best350x-c5-strength.png');
const C6_TSUNAMI = A('broll-best350x-c6-tsunami.png');
const C6_TELECOM = A('broll-best350x-c6-telecom.png');
const C6_PRODUCTIVITY = A('broll-best350x-c6-productivity.png');
const C6_NINETIES = A('broll-best350x-c6-nineties.png');
const C7_CASCADE = A('broll-best350x-c7-cascade.png');
const C7_ALERT = A('broll-best350x-c7-alert.png');
const C7_PUMP = A('broll-best350x-c7-pump.png');
const C7_BLAST = A('broll-best350x-c7-blast.png');
const C8_MASCOT = A('broll-best350x-c8-eliza-mascot.png'); // ai16z mascot (ref: ElizaOS-ai16z.webp)
const C8_24X = A('broll-best350x-c8-eliza-24x.png');       // ai16z mascot + 24x chart

// ─── Clip 1: "I said 20x. It did 353x." — SHORT punch (9.77s) ─────────────────
// STT fix: Whisper hears "$LAB" as "loud" — every "loud" -> "lab" (green, the coin).
// Story: Mike called LAB a 20x; it ran 353x; "isn't it good to be wrong."
export const D_B350_C1: ShortData = {
  clip: A('b350-c1-20x-punch.mp4'), fps: FPS, durationS: 9.77,
  captions: [
    { t: 0.0, h: 'i said <gr>lab</gr>' },
    { t: 0.8, h: 'was gonna be' },
    { t: 1.16, h: 'a <y>20x</y> man' },
    { t: 1.98, h: 'i said <gr>lab</gr>' },
    { t: 2.78, h: 'was gonna be a' },
    { t: 3.44, h: '<y>goddamn 20x</y>' },
    { t: 4.28, h: "i'm not" },
    { t: 4.62, h: 'doing like a' },
    { t: 5.1, h: '<gr>353x</gr> man' },
    { t: 6.48, h: "isn't it good" },
    { t: 7.04, h: 'to be <y>wrong</y>' },
    { t: 7.6, h: 'in that' },
    { t: 8.06, h: 'in that regard' },
    { t: 8.78, h: '<y>holy crap!</y>' },
  ],
  broll: [
    { src: C1_BEARMARKET, tIn: 2.4, tOut: 4.9, mode: 'full' },
    { src: C1_OVERSHOOT, tIn: 4.9, tOut: 6.8, mode: 'full' },
  ],
  badges: [
    { tIn: 3.5, tOut: 4.4, color: YELLOW, line1: '20X', sub: 'MY CALL', top: 300 },
    { tIn: 5.15, tOut: 6.6, color: GREEN, line1: '353X', sub: 'WHAT IT DID', top: 300 },
  ],
  thumb: { title: 'I SAID 20X\nIT DID 353X', chip: 'MY BEST GEM CALL', chipColor: GREEN, titleSize: 112, durS: 2.3 },
  logo: { ...LAB_LOGO_DEF, reveal: { tIn: 2.4, tOut: 3.4, top: 120, width: 420 } },
  sounds: [
    { t: 0.0, src: RISER }, { t: 2.4, src: WHOOSH }, { t: 3.5, src: DING }, { t: 4.9, src: BOOM },
  ],
};

// ─── Clip 2: 353x-reveal — LAB private gem, got in ~40x (15.37s) ──────────────
export const D_B350_C2: ShortData = {
  clip: A('b350-c2-reveal.mp4'), fps: FPS, durationS: 15.37,
  captions: [
    { t: 0.0, h: 'look at this <gr>lab</gr>' },
    { t: 1.14, h: '<gr>lab</gr> was a private' },
    { t: 2.58, h: '<y>gem.</y>' },
    { t: 3.44, h: 'i think i forgot' },
    { t: 4.22, h: 'when i exited' },
    { t: 5.42, h: 'i think we were' },
    { t: 5.7, h: 'at like a <y>40x</y>' },
    { t: 6.72, h: 'a pump like a' },
    { t: 7.46, h: 'few weeks back' },
    { t: 8.34, h: 'we got in' },
    { t: 8.84, h: 'at like a <y>40x</y>' },
    { t: 9.94, h: "and that's when i" },
    { t: 10.84, h: 'exposed it' },
    { t: 11.7, h: 'and it just kept' },
    { t: 12.56, h: 'pumping man' },
    { t: 13.98, h: '<gr>353x.</gr>' },
  ],
  broll: [
    { src: C2_GEM, tIn: 0.9, tOut: 3.1, mode: 'content' },
    { src: C2_PUMP40, tIn: 8.7, tOut: 11.0, mode: 'content' },
    { src: C2_BLAST353, tIn: 13.5, tOut: 15.37, mode: 'full' },
  ],
  badges: [
    { tIn: 8.85, tOut: 10.6, color: YELLOW, line1: '40X', sub: 'WHERE I GOT IN', top: 300 },
    { tIn: 13.98, tOut: 15.37, color: GREEN, line1: '353X', sub: 'WHERE IT WENT', top: 300 },
  ],
  thumb: { title: 'GOT IN AT 40X\nIT HIT 353X', chip: 'A PRIVATE GEM', chipColor: GREEN, titleSize: 104, durS: 2.3 },
  logo: { ...LAB_LOGO_DEF, reveal: { tIn: 2.6, tOut: 3.6, top: 120, width: 420 } },
  sounds: [
    { t: 0.0, src: RISER }, { t: 0.9, src: WHOOSH }, { t: 8.85, src: DING }, { t: 13.5, src: BOOM },
  ],
};

// ─── Clip 3: short-squeeze / leverage trap (14.72s) ──────────────────────────
export const D_B350_C3: ShortData = {
  clip: A('b350-c3-squeeze.mp4'), fps: FPS, durationS: 14.72,
  captions: [
    { t: 0.0, h: 'whenever the <y>market makers</y>' },
    { t: 1.28, h: "decide there's too" },
    { t: 3.04, h: 'many <r>shorts,</r>' },
    { t: 4.04, h: 'they might do something' },
    { t: 5.18, h: 'like that.' },
    { t: 5.9, h: 'so it happens.' },
    { t: 7.2, h: 'this is one of' },
    { t: 7.58, h: 'the reasons why i' },
    { t: 8.16, h: "say it's kind" },
    { t: 9.16, h: 'of crazy to' },
    { t: 9.86, h: 'use <r>leverage,</r>' },
    { t: 10.7, h: "because you're" },
    { t: 11.32, h: 'betting against the people' },
    { t: 12.6, h: 'who control the <y>system</y>' },
    { t: 13.48, h: 'and those people' },
    { t: 14.0, h: 'want you to <r>lose.</r>' },
  ],
  broll: [
    { src: C3_SQUEEZE, tIn: 2.4, tOut: 5.4, mode: 'full' },
    { src: C3_PUPPET, tIn: 11.0, tOut: 14.72, mode: 'full' },
  ],
  badges: [
    { tIn: 12.6, tOut: 14.0, color: YELLOW, line1: 'THE HOUSE', sub: 'CONTROLS IT', top: 300 },
  ],
  thumb: { title: 'WHY LEVERAGE\nIS A TRAP', chip: "YOU'RE BETTING VS THE HOUSE", chipColor: RED, titleSize: 110, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 2.4, src: BOOM }, { t: 11.0, src: WHOOSH }, { t: 14.0, src: DING },
  ],
};

// ─── Clip 4: Saylor sold a sliver, everyone panicked (7.39s) — KEEP ~7s ───────
export const D_B350_C4: ShortData = {
  clip: A('b350-c4-saylor.mp4'), fps: FPS, durationS: 7.39,
  captions: [
    { t: 0.0, h: 'the reason we' },
    { t: 0.62, h: 'broke down out of' },
    { t: 1.38, h: 'this channel up here' },
    { t: 2.44, h: 'was <o>michael saylor</o>' },
    { t: 3.74, h: '<r>sold</r> like a fraction' },
    { t: 4.74, h: 'of a percent of' },
    { t: 5.62, h: 'his <o>bitcoin,</o> and everybody' },
    { t: 6.82, h: '<r>freaked out.</r>' },
  ],
  broll: [
    { src: C4_SAYLOR, tIn: 2.4, tOut: 4.0, mode: 'full' },
    { src: C4_PANIC, tIn: 5.6, tOut: 7.39, mode: 'full' },
  ],
  badges: [
    { tIn: 3.8, tOut: 5.2, color: ORANGE, line1: '<1%', sub: 'OF HIS BTC', top: 300 },
  ],
  thumb: { title: 'SAYLOR SOLD\nA SLIVER\nEVERYONE\nPANICKED', chip: 'TOTAL OVERREACTION', chipColor: ORANGE, titleSize: 84, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 2.4, src: WHOOSH }, { t: 3.8, src: DING }, { t: 5.6, src: BOOM },
  ],
};

// ─── Clip 5: we're in 1992, the four-year-cycle zombies are wrong (44.77s) ────
// STT fixes: "strait of hormuz" (not "straight up hormone"), "four-year-cycle
// zombies" (not "ombres"), "benjamin cowen" (not "cowans").
export const D_B350_C5: ShortData = {
  clip: A('b350-c5-econ.mp4'), fps: FPS, durationS: 44.77,
  captions: [
    { t: 0.0, h: 'so even with all' },
    { t: 0.86, h: 'this going on,' },
    { t: 1.7, h: 'it means the' },
    { t: 2.68, h: 'economy is able to' },
    { t: 3.76, h: 'absorb the <y>high prices</y>' },
    { t: 5.58, h: 'and still expand' },
    { t: 7.66, h: 'into new territory' },
    { t: 8.74, h: 'that means the economy' },
    { t: 9.6, h: 'is very,' },
    { t: 10.44, h: '<gr>very strong.</gr>' },
    { t: 11.64, h: "if we didn't have" },
    { t: 12.38, h: 'this <o>strait of hormuz</o>' },
    { t: 13.68, h: 'situation,' },
    { t: 15.04, h: 'if the <r>war</r>' },
    { t: 15.66, h: 'never happened,' },
    { t: 16.56, h: 'we would be absolutely' },
    { t: 17.64, h: '<gr>flying.</gr>' },
    { t: 18.38, h: 'it would be' },
    { t: 19.08, h: 'completely obvious' },
    { t: 20.94, h: 'we are not' },
    { t: 21.96, h: 'in <y>1992</y> anymore' },
    { t: 23.56, h: 'it would be like,' },
    { t: 23.96, h: "we're in <y>1994.</y>" },
    { t: 25.02, h: 'so that is' },
    { t: 26.86, h: 'my theory.' },
    { t: 27.42, h: "that's why i don't" },
    { t: 28.04, h: 'think <o>bitcoin</o> goes' },
    { t: 29.52, h: 'that far down,' },
    { t: 30.68, h: 'like the <r>four year cycle</r>' },
    { t: 31.3, h: '<r>zombies</r> predict,' },
    { t: 32.42, h: 'the <o>benjamin cowen</o> types' },
    { t: 33.5, h: 'and stuff like that.' },
    { t: 34.2, h: "they're saying," },
    { t: 34.78, h: 'oh, <r>32k,</r>' },
    { t: 35.58, h: '<r>24k.</r>' },
    { t: 36.42, h: 'as the economy' },
    { t: 37.46, h: 'is demonstrating' },
    { t: 38.6, h: 'extraordinary <gr>strength.</gr>' },
    { t: 40.92, h: "and we just don't" },
    { t: 41.5, h: 'see it yet,' },
    { t: 42.26, h: 'the <o>strait of hormuz</o>' },
    { t: 43.3, h: 'is pulling us' },
    { t: 44.0, h: '<r>back down.</r>' },
  ],
  broll: [
    { src: C5_ECONOMY, tIn: 3.6, tOut: 7.7, mode: 'full' },
    { src: C5_HORMUZ, tIn: 12.0, tOut: 15.0, mode: 'full' },
    { src: C5_ZOMBIES, tIn: 30.4, tOut: 34.0, mode: 'full' },
    { src: C5_STRENGTH, tIn: 37.3, tOut: 40.6, mode: 'full' },
  ],
  badges: [
    { tIn: 10.45, tOut: 12.0, color: GREEN, line1: 'VERY STRONG', sub: 'THE ECONOMY', top: 300 },
    { tIn: 21.95, tOut: 23.5, color: YELLOW, line1: '1992', sub: 'NOT THE TOP', top: 300 },
    { tIn: 34.75, tOut: 36.3, color: RED, line1: '32K?', sub: 'THE ZOMBIES ARE WRONG', top: 300 },
  ],
  thumb: { title: "WE'RE IN 1992\nNOT 2018", chip: 'THE 4-YEAR ZOMBIES ARE WRONG', chipColor: GREEN, titleSize: 104, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 3.6, src: WHOOSH }, { t: 10.45, src: DING }, { t: 12.0, src: WHOOSH },
    { t: 21.95, src: BOOM }, { t: 30.4, src: WHOOSH }, { t: 34.75, src: DING }, { t: 37.3, src: BOOM },
  ],
};

// ─── Clip 6: AI will dwarf the dot-com explosion (64.3s) — KEEP long ──────────
export const D_B350_C6: ShortData = {
  clip: A('b350-c6-ai.mp4'), fps: FPS, durationS: 64.3,
  captions: [
    { t: 0.0, h: '<gr>ai</gr> is going' },
    { t: 0.82, h: 'to be,' },
    { t: 1.24, h: 'in my opinion,' },
    { t: 1.92, h: 'a massive' },
    { t: 2.32, h: '<gr>economic expansion</gr>' },
    { t: 4.46, h: 'related to <gr>ai</gr>' },
    { t: 5.3, h: "it's going to <y>dwarf</y>" },
    { t: 6.24, h: 'the <o>dot com</o> explosion' },
    { t: 7.76, h: 'and dot com' },
    { t: 8.74, h: 'was a subset' },
    { t: 9.96, h: 'of a larger' },
    { t: 11.52, h: '<gr>economic expansion,</gr>' },
    { t: 13.08, h: 'the telecom boom' },
    { t: 14.76, h: 'which included computers' },
    { t: 17.62, h: 'desktop computers' },
    { t: 19.38, h: 'and software' },
    { t: 20.8, h: 'in its own class' },
    { t: 22.68, h: 'pushing productivity' },
    { t: 24.44, h: 'having productivity' },
    { t: 25.64, h: 'in the index <gr>surge</gr>' },
    { t: 27.12, h: 'and then' },
    { t: 28.2, h: 'commerce' },
    { t: 30.0, h: 'over the web,' },
    { t: 31.86, h: 'the internet was' },
    { t: 33.72, h: 'an abbreviation for' },
    { t: 37.72, h: '<o>internetworking computers</o>' },
    { t: 41.42, h: 'it was called' },
    { t: 41.78, h: 'the <o>internet.</o>' },
    { t: 42.66, h: 'yeah man,' },
    { t: 43.44, h: 'remember the old days' },
    { t: 44.96, h: 'when new terms' },
    { t: 45.94, h: 'like the internet' },
    { t: 46.92, h: 'came out,' },
    { t: 47.64, h: 'for those of us' },
    { t: 48.88, h: "we didn't grow up" },
    { t: 49.56, h: 'with the <o>internet</o>' },
    { t: 51.46, h: 'i was a teenager' },
    { t: 53.06, h: 'everybody was getting on,' },
    { t: 55.9, h: 'back in the <y>90s</y>' },
    { t: 56.76, h: "it's like, internet" },
    { t: 59.0, h: 'that was a great' },
    { t: 59.82, h: '<gr>economic expansion</gr>' },
    { t: 61.1, h: 'that lasted' },
    { t: 62.24, h: 'a long time,' },
    { t: 63.56, h: 'started in the <y>90s.</y>' },
  ],
  broll: [
    { src: C6_TSUNAMI, tIn: 4.0, tOut: 8.0, mode: 'full' },
    { src: C6_TELECOM, tIn: 14.5, tOut: 18.5, mode: 'content' },
    { src: C6_PRODUCTIVITY, tIn: 22.5, tOut: 27.0, mode: 'full' },
    { src: C6_NINETIES, tIn: 43.0, tOut: 50.0, mode: 'full' },
  ],
  badges: [
    { tIn: 5.3, tOut: 7.6, color: GREEN, line1: 'DWARFS IT', sub: 'THE DOT-COM ERA', top: 300 },
  ],
  thumb: { title: 'AI WILL DWARF\nTHE DOT-COM\nEXPLOSION', chip: 'I LIVED THROUGH IT', chipColor: GREEN, titleSize: 88, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 4.0, src: WHOOSH }, { t: 5.3, src: BOOM },
    { t: 22.5, src: WHOOSH }, { t: 43.0, src: WHOOSH },
  ],
};

// ─── Clip 7: how I caught an 85x on Pippin — watch the listings (44.1s) ───────
// NOTE: the base Whisper garbled the exchange names badly; generalized to
// "listed again" + a "4 LISTINGS IN ONE DAY" beat. Mike to confirm exact names.
export const D_B350_C7: ShortData = {
  clip: A('b350-c7-pippin.mp4'), fps: FPS, durationS: 44.1,
  captions: [
    { t: 0.0, h: "okay, it's <r>dead.</r>" },
    { t: 0.86, h: 'but then suddenly' },
    { t: 1.98, h: 'they got listed' },
    { t: 2.72, h: 'on an exchange in <y>november</y>' },
    { t: 5.18, h: 'they got listed' },
    { t: 5.68, h: 'again in <y>november</y>' },
    { t: 8.76, h: 'listed again' },
    { t: 9.36, h: 'in <y>november</y>' },
    { t: 10.64, h: 'listed again' },
    { t: 11.24, h: 'on another' },
    { t: 12.62, h: 'big exchange' },
    { t: 13.62, h: 'in <y>december</y>' },
    { t: 15.24, h: 'then again' },
    { t: 15.92, h: 'in <y>december</y>' },
    { t: 16.56, h: 'and then one' },
    { t: 17.3, h: 'day, <r>december 9th,</r>' },
    { t: 18.78, h: 'listed on <gr>four</gr>' },
    { t: 19.78, h: 'in a <gr>single day.</gr>' },
    { t: 21.08, h: 'you see me sending' },
    { t: 22.2, h: 'a message to' },
    { t: 23.26, h: 'my group,' },
    { t: 23.8, h: '<y>holy crap,</y>' },
    { t: 24.4, h: 'what the hell?' },
    { t: 25.04, h: 'and then <gr>pippin</gr>' },
    { t: 25.96, h: 'starts <gr>ripping.</gr>' },
    { t: 26.66, h: '<gr>pippin</gr> starts ripping' },
    { t: 27.8, h: 'and one thing led' },
    { t: 29.74, h: 'to another' },
    { t: 30.78, h: 'and we realized' },
    { t: 31.94, h: "okay, something's" },
    { t: 33.28, h: 'going on with' },
    { t: 33.96, h: '<gr>pippin,</gr> that means' },
    { t: 34.74, h: 'we know that thing' },
    { t: 35.88, h: 'is going to start' },
    { t: 36.54, h: '<gr>pumping.</gr>' },
    { t: 37.24, h: "so it's just" },
    { t: 39.52, h: 'and it never ended' },
    { t: 40.48, h: 'it never ended' },
    { t: 41.36, h: 'and we got the' },
    { t: 41.74, h: '<gr>85x,</gr> just' },
    { t: 43.04, h: 'one after another' },
    { t: 43.62, h: 'after another' },
  ],
  broll: [
    { src: C7_CASCADE, tIn: 1.8, tOut: 5.0, mode: 'full' },
    { src: C7_ALERT, tIn: 21.0, tOut: 24.0, mode: 'content' },
    { src: C7_PUMP, tIn: 35.3, tOut: 38.0, mode: 'full' },
    { src: C7_BLAST, tIn: 41.0, tOut: 44.1, mode: 'full' },
  ],
  badges: [
    { tIn: 18.78, tOut: 21.0, color: GREEN, line1: '4 LISTINGS', sub: 'IN ONE DAY', top: 300 },
    { tIn: 41.74, tOut: 43.8, color: GREEN, line1: '85X', sub: 'ON PIPPIN', top: 300 },
  ],
  thumb: { title: 'HOW I CAUGHT\nAN 85X\nON PIPPIN', chip: 'WATCH THE LISTINGS', chipColor: GREEN, titleSize: 92, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 1.8, src: WHOOSH }, { t: 18.78, src: DING },
    { t: 25.04, src: WHOOSH }, { t: 35.3, src: WHOOSH }, { t: 41.0, src: BOOM },
  ],
};

// ─── Clip 8: don't sleep on ElizaOS — a free 24x I already called (11.7s) ─────
// STT fixes: "elizaos" (not "low iso / iso os"), "ai16z" (not "ai 16z").
export const D_B350_C8: ShortData = {
  clip: A('b350-c8-eliza.mp4'), fps: FPS, durationS: 11.7,
  captions: [
    { t: 0.0, h: "don't sleep on" },
    { t: 0.84, h: '<gr>elizaos.</gr>' },
    { t: 2.66, h: "that's a <y>freebie,</y>" },
    { t: 3.7, h: 'i already did that' },
    { t: 4.94, h: 'i got a <gr>24x</gr>' },
    { t: 6.22, h: 'on <gr>ai16z,</gr>' },
    { t: 7.46, h: "that's just a rebrand" },
    { t: 8.54, h: 'of <gr>ai16z.</gr>' },
    { t: 10.32, h: "so don't sleep" },
    { t: 11.08, h: 'on that.' },
  ],
  broll: [
    { src: C8_MASCOT, tIn: 2.4, tOut: 4.6, mode: 'full' },
    { src: C8_24X, tIn: 6.0, tOut: 8.8, mode: 'full' },
  ],
  badges: [
    { tIn: 4.95, tOut: 6.4, color: GREEN, line1: '24X', sub: 'ALREADY CALLED', top: 300 },
  ],
  thumb: { title: 'A FREE 24X\nI ALREADY\nCALLED', chip: "DON'T SLEEP ON ELIZAOS", chipColor: GREEN, titleSize: 96, durS: 2.3 },
  sounds: [
    { t: 0.0, src: RISER }, { t: 2.4, src: WHOOSH }, { t: 4.95, src: DING }, { t: 6.0, src: BOOM },
  ],
};
