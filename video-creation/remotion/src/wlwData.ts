import { staticFile } from 'remotion';
import { TEAL, YELLOW, GREEN, RED, BLUE } from './_kit';
import type { ShortData } from './LivestreamShort';

const FPS = 30;
const RISER = staticFile('sfx/ding/rising-dramatic-riser-sfx.mp3');
const WHOOSH = staticFile('sfx/Cinematic Whoosh 02.wav');
const DING = staticFile('sfx/DING.mp3');
const BOOM = staticFile('sfx/Boom - Big Reveal.wav');

// b-roll asset shorthands
const A = (f: string) => staticFile(f);

export const FRAMES = {
  title: 728, unicorn: 670, lab115x: 634, kaspa3: 568, wf: 1075, bounty: 941,
  rotation: 1016, labwont: 404, kaspahold: 756, kaspaton: 240, pengu: 740,
};

// ─── 1. wife-lose-weight-title (24.27s) ───────────────────────────────────────
export const WLW_TITLE: ShortData = {
  clip: A('wlw-title.mp4'), fps: FPS, durationS: 24.27,
  captions: [
    { t: 0.00, h: 'best cryptos to' }, { t: 1.82, h: 'make you move' }, { t: 2.56, h: 'out of your' },
    { t: 3.02, h: "mama's house" }, { t: 4.24, h: 'that was a' }, { t: 5.08, h: 'good one too.' },
    { t: 6.68, h: 'exactly.' }, { t: 9.54, h: 'or if you' }, { t: 10.58, h: 'got an <y>overweight</y>' },
    { t: 11.20, h: "wife, you're gonna" }, { t: 12.22, h: 'get to get' }, { t: 13.26, h: 'some cryptos to' },
    { t: 14.00, h: '<y>make her lose</y>' }, { t: 14.48, h: '<y>some weight.</y>' },
    { t: 15.02, h: 'if you want to retire your' }, { t: 16.00, h: 'entire family bloodline.' },
    { t: 18.62, h: 'exactly.' }, { t: 19.24, h: 'get out of' }, { t: 19.58, h: "your mama's house" },
    { t: 20.46, h: 'or make your' }, { t: 21.44, h: 'wife become thinner' }, { t: 22.56, h: 'and have her' },
    { t: 23.26, h: 'invite a friend' }, { t: 23.84, h: 'over.' },
  ],
  broll: [
    { src: A('broll-wlw-wife-slim-coins.png'), tIn: 0.0, tOut: 2.4, mode: 'full' },
    { src: A('broll-wlw-bloodline-mansion.png'), tIn: 15.0, tOut: 18.2, mode: 'full' },
    { src: A('broll-wlw-wife-slim-coins.png'), tIn: 21.2, tOut: 24.27, mode: 'full' },
  ],
  thumb: { title: 'CRYPTOS TO\nMAKE YOUR WIFE\nLOSE WEIGHT', chip: 'WIFE-CHANGING GAINS', chipColor: YELLOW, titleSize: 92, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 15.0, src: WHOOSH }, { t: 21.2, src: WHOOSH }],
};

// ─── 2. unicorn-fart-dust (22.32s) ────────────────────────────────────────────
export const WLW_UNICORN: ShortData = {
  clip: A('wlw-unicorn.mp4'), fps: FPS, durationS: 22.32,
  captions: [
    { t: 0.00, h: "there's a few" }, { t: 0.56, h: 'other ones like' }, { t: 1.58, h: '<y>unicorn fart dust</y>' },
    { t: 2.72, h: "it's been" }, { t: 3.70, h: '<r>on fire</r>' }, { t: 4.38, h: 'like last three' },
    { t: 5.18, h: 'days. ron is' }, { t: 6.30, h: 'the founder of' }, { t: 7.00, h: '<y>unicorn fart dust</y>' },
    { t: 7.80, h: "he's in" }, { t: 9.60, h: 'the space right' }, { t: 10.12, h: 'now.' },
    { t: 10.36, h: 'so apparently this' }, { t: 11.28, h: 'thing is very' }, { t: 12.10, h: 'active.' },
    { t: 13.20, h: "that's a" }, { t: 14.08, h: 'good play, you' }, { t: 15.06, h: 'know, i guess' },
    { t: 15.54, h: 'not financial advice' }, { t: 16.96, h: 'but i think' }, { t: 17.50, h: '<y>unicorn fart dust</y>' },
    { t: 18.30, h: 'is definitely' }, { t: 19.12, h: 'gonna go over' }, { t: 21.36, h: '<gr>20 million</gr>' },
  ],
  broll: [
    { src: A('broll-ufd-unicorn-fire.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-ufd-flaming-rocket-chart.png'), tIn: 3.5, tOut: 5.4, mode: 'content' },
    { src: A('broll-ufd-treasure-20m.png'), tIn: 19.0, tOut: 22.32, mode: 'full' },
  ],
  badges: [
    { tIn: 3.6, tOut: 5.3, color: RED, line1: 'ON FIRE', sub: 'LAST 3 DAYS', top: 300 },
    { tIn: 19.3, tOut: 22.0, color: GREEN, line1: '$20M+', sub: 'TARGET', top: 300 },
  ],
  thumb: { title: 'UNICORN\nFART DUST', chip: 'STILL ON FIRE', chipColor: RED, titleSize: 112, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 3.5, src: WHOOSH }, { t: 19.0, src: BOOM }],
};

// ─── 3. lab-115x-bear-market (21.15s) ─────────────────────────────────────────
export const WLW_LAB115X: ShortData = {
  clip: A('wlw-lab115x.mp4'), fps: FPS, durationS: 21.15,
  captions: [
    { t: 0.00, h: 'this was my' }, { t: 0.58, h: 'prediction for <gr>lab</gr>' }, { t: 1.48, h: 'right here.' },
    { t: 2.28, h: 'look at that.' }, { t: 3.18, h: '<y>20x,</y> i thought' }, { t: 4.28, h: 'lab was gonna' },
    { t: 5.14, h: 'do a <y>20x.</y>' }, { t: 6.44, h: 'a <y>20x.</y>' }, { t: 8.44, h: "and we're at" },
    { t: 8.96, h: '<gr>115x</gr>' }, { t: 10.74, h: 'already in a' }, { t: 11.88, h: '<r>bear market.</r>' },
    { t: 12.78, h: "it's <y>$8.11.</y>" }, { t: 15.12, h: 'holy crap, man.' }, { t: 16.94, h: 'oh my god.' },
    { t: 19.58, h: 'this thing is' }, { t: 20.18, h: 'still going, man.' },
  ],
  broll: [
    { src: A('broll-lab-flask-explosion.png'), tIn: 0.0, tOut: 2.4, mode: 'full' },
    { src: A('broll-lab-bear-defiant.png'), tIn: 10.6, tOut: 12.8, mode: 'full' },
    { src: A('broll-lab-flask-explosion.png'), tIn: 19.3, tOut: 21.15, mode: 'content' },
  ],
  overlays: [{ src: A('broll-lab-flask-overlay.png'), tIn: 8.9, tOut: 11.2, top: 250, left: 300, width: 480 }],
  badges: [
    { tIn: 3.2, tOut: 6.9, color: YELLOW, line1: '20X', sub: 'MY CALL', top: 300 },
    { tIn: 8.9, tOut: 11.6, color: GREEN, line1: '115X', sub: 'IN A BEAR MARKET', top: 300 },
  ],
  thumb: { title: '115X\nON LAB', chip: 'IN A BEAR MARKET', chipColor: GREEN, titleSize: 132, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 8.9, src: BOOM }, { t: 10.6, src: WHOOSH }],
};

// ─── 4. kaspa-3-dollars (18.94s) ──────────────────────────────────────────────
export const WLW_KASPA3: ShortData = {
  clip: A('wlw-kaspa3.mp4'), fps: FPS, durationS: 18.94,
  captions: [
    { t: 0.00, h: '<g>100x with kaspa</g>' }, { t: 0.80, h: 'puts it at' }, { t: 1.30, h: '<gr>$3</gr> which is' },
    { t: 2.34, h: 'realistic, right? but' }, { t: 3.32, h: "it's only realistic" }, { t: 4.58, h: 'in a parabolic run' },
    { t: 5.48, h: 'up, in a' }, { t: 6.18, h: '<y>cycle top.</y>' }, { t: 6.98, h: "<g>kaspa's</g> definitely gonna" },
    { t: 7.76, h: 'do a <gr>lab.</gr>' }, { t: 8.44, h: "we're gonna be" }, { t: 9.52, h: 'flying one day' },
    { t: 10.48, h: "and it's not" }, { t: 10.90, h: 'gonna be in' }, { t: 11.78, h: 'a <r>bear market</r>' },
    { t: 12.92, h: 'be in some' }, { t: 13.42, h: 'random time period' }, { t: 14.30, h: "it's probably just" },
    { t: 14.84, h: 'gonna be during' }, { t: 15.76, h: 'a real <y>cycle' }, { t: 16.90, h: 'top</y> where it\'ll' },
    { t: 17.86, h: 'get to like' }, { t: 18.32, h: '<gr>$3</gr>' },
  ],
  broll: [
    { src: A('broll-kaspa-parabola-rocket.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-kaspa-yacht.png'), tIn: 8.0, tOut: 11.0, mode: 'full' },
    { src: A('broll-kaspa-parabola-rocket.png'), tIn: 15.5, tOut: 18.94, mode: 'full' },
  ],
  overlays: [{ src: A('broll-kaspa-coin-overlay.png'), tIn: 0.2, tOut: 3.0, top: 230, left: 300, width: 480 }],
  badges: [
    { tIn: 1.0, tOut: 3.0, color: GREEN, line1: '$3', line2: 'KASPA', sub: 'REALISTIC', top: 300 },
    { tIn: 15.6, tOut: 18.7, color: TEAL, line1: 'CYCLE TOP', sub: '$3 TARGET', top: 300 },
  ],
  thumb: { title: '$3 KASPA\nIS REALISTIC', chip: "HERE'S WHEN", chipColor: TEAL, titleSize: 110, durS: 2.2 },
  sounds: [{ t: 0.0, src: RISER }, { t: 1.0, src: DING }, { t: 15.5, src: BOOM }],
};

// ─── 5. wells-fargo-camera (35.83s) ───────────────────────────────────────────
export const WLW_WF: ShortData = {
  clip: A('wlw-wellsfargo.mp4'), fps: FPS, durationS: 35.83,
  captions: [
    { t: 0.00, h: 'i had a' }, { t: 0.42, h: 'production budget of' }, { t: 1.38, h: "like, let's say" },
    { t: 1.90, h: '<y>$400</y> and i' }, { t: 3.34, h: 'spent like the' }, { t: 3.92, h: 'last two weeks' },
    { t: 4.64, h: 'and <y>40 hours</y>' }, { t: 5.54, h: 'of my time' }, { t: 6.12, h: 'and then i' },
    { t: 6.70, h: 'only get like' }, { t: 7.14, h: '<r>a hundred views</r>' }, { t: 9.32, h: 'what the hell?' },
    { t: 10.90, h: "and i'm like" }, { t: 11.20, h: "okay, it's not" }, { t: 11.72, h: 'worth it.' },
    { t: 12.48, h: 'and i just' }, { t: 13.00, h: 'within one day' }, { t: 14.18, h: 'i turn on' },
    { t: 14.66, h: 'my camera without' }, { t: 15.78, h: 'any editing and' }, { t: 16.88, h: 'i just complained' },
    { t: 17.82, h: 'about my wells' }, { t: 18.96, h: 'fargo account for' }, { t: 20.58, h: 'like five minutes' },
    { t: 21.48, h: 'and then i' }, { t: 22.28, h: 'uploaded the video.' }, { t: 23.06, h: 'i thought i' },
    { t: 23.86, h: 'was just gonna' }, { t: 25.70, h: 'talk to my' }, { t: 26.76, h: 'existing audience' },
    { t: 27.88, h: 'and that freaking' }, { t: 28.70, h: 'wells fargo video' }, { t: 29.80, h: 'got <gr>10,000</gr>' },
    { t: 31.00, h: 'views in three' }, { t: 31.80, h: '<gr>days</gr> and by' }, { t: 32.52, h: 'the end of' },
    { t: 32.88, h: 'the week was' }, { t: 33.36, h: 'at <gr>12,000</gr>' }, { t: 34.00, h: 'views.' },
    { t: 34.38, h: "and i didn't" }, { t: 34.90, h: 'do any editing' },
  ],
  broll: [
    { src: A('broll-wf-edit-burnout.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-wf-edit-burnout.png'), tIn: 3.4, tOut: 7.9, mode: 'content' },
    { src: A('broll-wf-viral-explosion.png'), tIn: 28.6, tOut: 32.0, mode: 'full' },
    { src: A('broll-wf-viral-explosion.png'), tIn: 33.0, tOut: 35.83, mode: 'content' },
  ],
  badges: [
    { tIn: 4.0, tOut: 7.8, color: RED, line1: '$400', line2: '100 VIEWS', sub: '40 HOURS', top: 300 },
    { tIn: 29.6, tOut: 34.5, color: GREEN, line1: '10,000', line2: 'VIEWS', sub: 'IN 3 DAYS', top: 300 },
  ],
  thumb: { title: '$400 =\n100 VIEWS', chip: 'THEN THIS HAPPENED', chipColor: YELLOW, titleSize: 112, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 3.4, src: WHOOSH }, { t: 28.6, src: BOOM }],
};

// ─── 6. thousand-dollar-bounty (31.38s) ───────────────────────────────────────
export const WLW_BOUNTY: ShortData = {
  clip: A('wlw-bounty.mp4'), fps: FPS, durationS: 31.38,
  captions: [
    { t: 0.00, h: "i've had this" }, { t: 0.56, h: '<y>bounty</y> for' }, { t: 2.00, h: 'a long time' },
    { t: 3.04, h: 'it was <y>$500</y>' }, { t: 4.02, h: 'back in the' }, { t: 4.76, h: 'day, but now' },
    { t: 5.26, h: "it's <y>a thousand</y>" }, { t: 5.96, h: "it's been a" }, { t: 6.32, h: 'thousand for like' },
    { t: 6.90, h: 'six months or' }, { t: 7.36, h: 'whatever.' }, { t: 8.18, h: 'you tell me' },
    { t: 8.94, h: 'of another channel' }, { t: 9.86, h: 'or another' }, { t: 10.98, h: 'influencer, and i' },
    { t: 11.74, h: 'mean, not youtube' }, { t: 12.40, h: 'channel, it could' }, { t: 12.90, h: 'be anywhere, but' },
    { t: 14.20, h: 'that has a' }, { t: 15.04, h: 'community that has' }, { t: 16.08, h: '<g>all the tech</g>' },
    { t: 16.70, h: 'that i have' }, { t: 17.48, h: 'like <g>swing trading' }, { t: 18.18, h: 'software,</g> the monitoring' },
    { t: 19.38, h: 'of the centralized' }, { t: 20.20, h: 'exchanges, the monitoring' }, { t: 21.18, h: 'of the all' },
    { t: 21.70, h: 'time high alerts' }, { t: 22.60, h: 'the bots to' }, { t: 23.22, h: 'find the good' },
    { t: 23.80, h: 'tokens, and so' }, { t: 24.76, h: 'on with all' }, { t: 25.30, h: 'that tech, plus' },
    { t: 26.22, h: 'all those plays' }, { t: 27.14, h: 'when you go' }, { t: 27.64, h: 'to my list.' },
    { t: 28.52, h: '<r>nobody</r> has even' }, { t: 29.78, h: 'tried to claim' }, { t: 30.98, h: 'it.' },
  ],
  broll: [
    { src: A('broll-bounty-trophy.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-bounty-tech-dashboard.png'), tIn: 16.0, tOut: 22.5, mode: 'content' },
    { src: A('broll-bounty-trophy.png'), tIn: 28.4, tOut: 31.38, mode: 'full' },
  ],
  badges: [
    { tIn: 3.0, tOut: 7.5, color: YELLOW, line1: '$1,000', sub: 'BOUNTY', top: 300 },
    { tIn: 28.6, tOut: 31.1, color: RED, line1: 'NOBODY', sub: 'HAS CLAIMED IT', top: 300 },
  ],
  thumb: { title: '$1,000\nBOUNTY', chip: 'NOBODY WILL CLAIM IT', chipColor: YELLOW, titleSize: 130, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 16.0, src: WHOOSH }, { t: 28.4, src: BOOM }],
};

// ─── 7. lab-rotation (33.87s) ─────────────────────────────────────────────────
export const WLW_ROTATION: ShortData = {
  clip: A('wlw-rotation.mp4'), fps: FPS, durationS: 33.87,
  captions: [
    { t: 0.00, h: "oh, i've been" }, { t: 0.56, h: 'rotating like a' }, { t: 1.72, h: 'whole bunch of' },
    { t: 2.16, h: 'my <gr>lab.</gr>' }, { t: 3.28, h: "i haven't done" }, { t: 4.08, h: 'it, but when i' },
    { t: 5.18, h: 'see some good' }, { t: 6.62, h: '<r>red,</r> i take' }, { t: 7.42, h: 'like <y>50 or</y>' },
    { t: 9.16, h: '<y>100</y> or whatever' }, { t: 10.18, h: 'and just rotate' }, { t: 11.50, h: 'it into other' },
    { t: 12.36, h: 'tokens.' }, { t: 12.78, h: 'so i build' }, { t: 13.52, h: 'up the amount' },
    { t: 14.08, h: 'that i have' }, { t: 14.82, h: 'in those tokens.' }, { t: 16.22, h: 'so when they' },
    { t: 16.66, h: 'do <gr>100x,</gr> i' }, { t: 17.56, h: 'got a whole' }, { t: 17.90, h: 'bunch more money.' },
    { t: 18.68, h: "it's going to" }, { t: 18.90, h: 'do <gr>100x.</gr>' }, { t: 19.78, h: 'some of' },
    { t: 21.28, h: 'the rotations i' }, { t: 22.12, h: 'made, i put' }, { t: 23.06, h: '<y>140</y> of my' },
    { t: 24.20, h: 'lab dry powder' }, { t: 25.02, h: 'into <g>keeta.</g>' }, { t: 26.24, h: "that's a good" },
    { t: 26.66, h: 'play.' }, { t: 27.26, h: "that's much <g>safer.</g>" }, { t: 28.26, h: "it's not a" },
    { t: 28.46, h: 'meme.' }, { t: 30.24, h: 'i bought some' }, { t: 30.62, h: '<g>doginme</g> again.' },
    { t: 32.02, h: 'i bought another' }, { t: 32.40, h: 'high risk one,' }, { t: 33.06, h: '<y>bombett.</y>' },
  ],
  broll: [
    { src: A('broll-rotation-split.png'), tIn: 0.0, tOut: 2.4, mode: 'full' },
    { src: A('broll-rotation-100x-stack.png'), tIn: 16.4, tOut: 19.6, mode: 'full' },
    { src: A('broll-rotation-split.png'), tIn: 30.0, tOut: 33.87, mode: 'content' },
  ],
  overlays: [{ src: A('broll-lab-flask-overlay.png'), tIn: 2.0, tOut: 4.0, top: 260, left: 310, width: 440 }],
  badges: [
    { tIn: 7.0, tOut: 10.0, color: YELLOW, line1: '$50-100', sub: 'ON EVERY DIP', top: 300 },
    { tIn: 16.6, tOut: 19.4, color: GREEN, line1: '100X', sub: 'GOAL', top: 300 },
  ],
  thumb: { title: 'ROTATING LAB\nINTO THE NEXT\n100X', chip: 'KEETA · DOGINME · BOMBETT', chipColor: GREEN, titleSize: 84, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 16.4, src: DING }, { t: 30.0, src: WHOOSH }],
};

// ─── 8. lab-wont-go-down (13.48s) ─────────────────────────────────────────────
export const WLW_LABWONT: ShortData = {
  clip: A('wlw-labwont.mp4'), fps: FPS, durationS: 13.48,
  captions: [
    { t: 0.00, h: '<gr>lab</gr> is one' }, { t: 0.74, h: 'of these things' }, { t: 1.18, h: 'where it just' },
    { t: 1.60, h: "doesn't want to" }, { t: 2.06, h: '<gr>go down.</gr>' }, { t: 2.76, h: 'like, <y>myx</y> went' },
    { t: 3.56, h: 'up and it' }, { t: 4.26, h: '<r>went down.</r>' }, { t: 4.74, h: 'a lot of' },
    { t: 5.08, h: 'like <y>d-agent ai</y>' }, { t: 6.16, h: 'went up and' }, { t: 7.02, h: 'then went' },
    { t: 7.40, h: '<r>down.</r>' }, { t: 8.32, h: 'lab is just' }, { t: 8.76, h: 'just stayed' },
    { t: 9.42, h: '<gr>up.</gr>' }, { t: 9.76, h: 'like, every other' }, { t: 10.42, h: "week, it's just" },
    { t: 11.08, h: 'making another new' }, { t: 11.84, h: '<gr>all -time high</gr>' }, { t: 12.52, h: 'which is very' },
    { t: 13.02, h: 'interesting.' },
  ],
  broll: [
    { src: A('broll-lab-staircase-ath.png'), tIn: 0.0, tOut: 2.4, mode: 'full' },
    { src: A('broll-lab-staircase-ath.png'), tIn: 9.4, tOut: 13.48, mode: 'full' },
  ],
  overlays: [{ src: A('broll-lab-flask-overlay.png'), tIn: 8.3, tOut: 9.9, top: 260, left: 320, width: 420 }],
  badges: [{ tIn: 9.6, tOut: 13.0, color: GREEN, line1: 'NEW ATH', sub: 'EVERY WEEK', top: 300 }],
  thumb: { title: "LAB WON'T\nGO DOWN", chip: 'NEW ATH EVERY WEEK', chipColor: GREEN, titleSize: 120, durS: 2.2 },
  sounds: [{ t: 0.0, src: RISER }, { t: 9.4, src: BOOM }],
};

// ─── 9. kaspa-hold-my-beer (25.20s) ───────────────────────────────────────────
export const WLW_KASPAHOLD: ShortData = {
  clip: A('wlw-kaspahold.mp4'), fps: FPS, durationS: 25.20,
  captions: [
    { t: 0.00, h: "<g>kaspa's</g> got" }, { t: 0.74, h: 'this whole thing' }, { t: 1.30, h: 'with the technology.' },
    { t: 2.44, h: 'the technology is' }, { t: 3.44, h: 'just <gr>off the' }, { t: 4.30, h: 'charts.</gr>' },
    { t: 4.76, h: 'like, why would' }, { t: 5.24, h: 'you need anymore' }, { t: 6.02, h: 'right?' },
    { t: 6.56, h: 'they say' }, { t: 7.48, h: "you can't have" }, { t: 8.30, h: 'bitcoin-level' },
    { t: 9.44, h: 'security and <b>ethereum</b>' }, { t: 11.06, h: 'programmability in the' }, { t: 12.72, h: 'same protocol, right?' },
    { t: 14.00, h: 'and now, especially' }, { t: 15.30, h: 'with this <g>hard' }, { t: 16.04, h: 'fork</g>' },
    { t: 16.92, h: "<g>kaspa's</g> coming along" }, { t: 17.84, h: "and they're saying" }, { t: 18.78, h: '<y>hold my beer.</y>' },
    { t: 19.94, h: "so that's it." }, { t: 21.40, h: 'wait and' }, { t: 22.12, h: 'see.' },
    { t: 22.58, h: 'and then yeah' }, { t: 23.16, h: "it's gonna <gr>steal" }, { t: 24.16, h: 'the show</gr> at' },
    { t: 24.72, h: 'some point.' },
  ],
  broll: [
    { src: A('broll-kaspa-tech-titans.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-kaspa-tech-titans.png'), tIn: 8.0, tOut: 13.0, mode: 'content' },
    { src: A('broll-kaspa-steal-show.png'), tIn: 22.0, tOut: 25.20, mode: 'full' },
  ],
  overlays: [{ src: A('broll-kaspa-coin-overlay.png'), tIn: 16.0, tOut: 19.0, top: 240, left: 310, width: 440 }],
  badges: [
    { tIn: 3.4, tOut: 5.0, color: TEAL, line1: 'OFF THE', line2: 'CHARTS', top: 300 },
    { tIn: 18.6, tOut: 20.2, color: YELLOW, line1: 'HOLD MY', line2: 'BEER', top: 300 },
  ],
  thumb: { title: "KASPA'S TECH\nIS OFF THE\nCHARTS", chip: 'HOLD MY BEER', chipColor: TEAL, titleSize: 92, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 16.0, src: WHOOSH }, { t: 22.0, src: BOOM }],
};

// ─── 10. kaspa-ton-best-plays (12.66s) ────────────────────────────────────────
export const WLW_KASPATON: ShortData = {
  clip: A('wlw-kaspaton.mp4'), fps: FPS, durationS: 12.66,
  captions: [
    { t: 0.00, h: 'i think' }, { t: 0.38, h: '<b>bittensor</b> and' }, { t: 1.06, h: '<g>kaspa,</g> i think' },
    { t: 1.62, h: "they're the biggest" }, { t: 2.10, h: 'the biggest place.' }, { t: 3.20, h: 'the best place' },
    { t: 3.70, h: 'of this cycle.' }, { t: 4.84, h: 'the <gr>best two' }, { t: 5.02, h: 'plays.</gr>' },
    { t: 6.32, h: 'the best goddamn' }, { t: 6.90, h: 'plays of this' }, { t: 7.58, h: 'cycle.' },
    { t: 9.66, h: '<g>kaspa</g> and' }, { t: 11.10, h: '<b>ton coin.</b>' },
  ],
  broll: [
    { src: A('broll-kaspa-ton-podium.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-kaspa-ton-podium.png'), tIn: 9.0, tOut: 12.66, mode: 'full' },
  ],
  overlays: [{ src: A('broll-kaspa-coin-overlay.png'), tIn: 4.6, tOut: 7.6, top: 240, left: 320, width: 420 }],
  badges: [{ tIn: 4.8, tOut: 7.8, color: GREEN, line1: 'BEST 2', sub: 'PLAYS OF THE CYCLE', top: 300 }],
  thumb: { title: 'KASPA & TON', chip: 'BEST 2 PLAYS OF THE CYCLE', chipColor: TEAL, titleSize: 120, durS: 2.2 },
  sounds: [{ t: 0.0, src: RISER }, { t: 9.0, src: BOOM }],
};

// ─── 11. pengu-launch-tell (24.66s) ───────────────────────────────────────────
export const WLW_PENGU: ShortData = {
  clip: A('wlw-pengu.mp4'), fps: FPS, durationS: 24.66,
  captions: [
    { t: 0.00, h: 'the biggest <y>coordinated</y>' }, { t: 1.04, h: "effort launch i've" }, { t: 2.38, h: 'ever seen was' },
    { t: 3.30, h: 'with <y>pengu.</y>' }, { t: 4.14, h: 'right at the' }, { t: 4.70, h: 'start of the' },
    { t: 5.72, h: 'run up in' }, { t: 6.38, h: '2024, when trump' }, { t: 7.90, h: 'got elected, or' },
    { t: 8.90, h: 'something like that' }, { t: 9.70, h: 'and start or' }, { t: 10.28, h: 'mid or whatever' },
    { t: 11.16, h: 'they got <gr>listed</gr>' }, { t: 11.86, h: 'on so many' }, { t: 13.12, h: 'centralized, all the' },
    { t: 14.26, h: '<gr>tier ones,</gr> like' }, { t: 14.92, h: 'every single goddamn' }, { t: 15.84, h: 'tier one,' },
    { t: 16.56, h: "like <y>eight o'clock</y>" }, { t: 17.34, h: 'in the morning.' }, { t: 17.70, h: 'it was like' },
    { t: 18.18, h: "that's a <y>coordinated" }, { t: 18.94, h: "launch,</y> that's somebody" }, { t: 20.40, h: 'you got <b>vcs</b>' },
    { t: 21.10, h: 'and backing and' }, { t: 21.92, h: 'all this funding' }, { t: 22.56, h: "then that's the" },
    { t: 23.46, h: 'way you launch' }, { t: 24.24, h: 'a <r>meme coin.</r>' },
  ],
  broll: [
    { src: A('broll-pengu-coordinated-launch.png'), tIn: 0.0, tOut: 2.6, mode: 'full' },
    { src: A('broll-pengu-exchange-grid.png'), tIn: 11.0, tOut: 16.2, mode: 'content' },
    { src: A('broll-pengu-coordinated-launch.png'), tIn: 22.0, tOut: 24.66, mode: 'full' },
  ],
  badges: [
    { tIn: 13.0, tOut: 16.2, color: GREEN, line1: 'EVERY', line2: 'TIER-1 CEX', sub: 'AT 8AM', top: 300 },
    { tIn: 20.2, tOut: 22.6, color: BLUE, line1: 'VC-BACKED', sub: 'COORDINATED', top: 300 },
  ],
  thumb: { title: 'HOW A VC\nLAUNCHES A\nMEME COIN', chip: 'THE PENGU TELL', chipColor: BLUE, titleSize: 92, durS: 2.4 },
  sounds: [{ t: 0.0, src: RISER }, { t: 11.0, src: WHOOSH }, { t: 22.0, src: BOOM }],
};
