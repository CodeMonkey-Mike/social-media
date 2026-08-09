import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';

// better-coins batch (Market Update: 4-Year Cycle Dead Again).
// Captions built via skills/captions/build_captions.py (montserrat) on each <slug>/final.mp4,
// then hand-corrected for brand names (Bittensor/$TAO/Kaspa) + key color tags.
// Render with: --public-dir video-creation/shorts/better-coins/render-assets
const FPS = 30;
const A = (f: string) => staticFile(f);
const WHOOSH = A('sfx/Cinematic Whoosh 02.wav');
const BOOM = A('sfx/Boom - Big Reveal.wav');
const KAS_LOGO = { src: A('logo-kaspa.png'), glow: '#00e5ff', watermark: { width: 150, top: 26, left: 26 } };
const TEAL = '#00e5ff', RED = '#ff5252';

// 1 — didnt-you-learn-your-lesson (21.6s)
export const D_BCM_LEARN: ShortData = {
  clip: A('didnt-you-learn-your-lesson.mp4'), fps: FPS, durationS: 21.6, capY: 560,
  thumb: { title: "DIDN'T YOU\nLEARN?", chip: '4-YEAR CYCLE', chipColor: TEAL, titleSize: 120 },
  logo: KAS_LOGO,
  captions: [
    { t: 0.00, h: 'and those same' }, { t: 0.60, h: 'guys, those same' },
    { t: 1.82, h: 'people right now' }, { t: 2.92, h: 'that were saying' },
    { t: 3.50, h: 'that, are now' }, { t: 5.08, h: 'preaching nonstop' },
    { t: 6.56, h: "about how there's" }, { t: 7.78, h: 'gonna be a' },
    { t: 8.20, h: 'bottom in <y>october</y>' }, { t: 9.38, h: 'because of the' },
    { t: 10.18, h: 'four year cycle.' }, { t: 11.04, h: '<r>danger</r>' },
    { t: 12.90, h: 'will robinson, <r>danger</r>.' }, { t: 14.66, h: "that's a lot" },
    { t: 15.08, h: 'of <r>danger</r> right' }, { t: 15.92, h: 'there.' },
    { t: 16.54, h: 'no' }, { t: 17.52, h: "look, didn't you" },
    { t: 18.16, h: 'learn your lesson?' }, { t: 19.16, h: "didn't you learn" },
    { t: 19.90, h: 'your lesson?' }, { t: 20.66, h: 'holy crap.' },
  ],
  broll: [{ src: A('broll-bc-lost-in-space-robot.png'), tIn: 10.8, tOut: 16.4, mode: 'full' }],
  sounds: [{ t: 10.8, src: WHOOSH }, { t: 10.8, src: BOOM }],
};

// 2 — four-year-cycle-breakage-stack (34.16s)
export const D_BCM_BREAKAGE: ShortData = {
  clip: A('four-year-cycle-breakage-stack.mp4'), fps: FPS, durationS: 34.16, capY: 560,
  thumb: { title: 'THE 4-YEAR\nCYCLE IS DEAD', chip: 'BROKEN', chipColor: RED, titleSize: 116 },
  logo: KAS_LOGO,
  captions: [
    { t: 0.00, h: 'the <r>breakage</r> of' }, { t: 1.06, h: 'the four -year' },
    { t: 1.46, h: 'cycle keeps happening' }, { t: 2.44, h: 'over and over' },
    { t: 2.98, h: 'again.' }, { t: 3.50, h: 'we hit a new all' },
    { t: 4.48, h: '-time high before' }, { t: 5.40, h: 'the halving, <r>breakage</r>' },
    { t: 7.46, h: 'of the four -year' }, { t: 7.98, h: 'cycle.' },
    { t: 8.42, h: 'we hit a bear' }, { t: 8.90, h: 'market in the' },
    { t: 9.74, h: 'post -halving year' }, { t: 10.74, h: '<r>breakage</r> of the' },
    { t: 11.26, h: 'four -year cycle.' }, { t: 12.10, h: "we didn't have" },
    { t: 12.74, h: 'a cycle top' }, { t: 13.58, h: 'at all, <r>breakage</r>' },
    { t: 15.36, h: 'of the four -year' }, { t: 15.86, h: 'cycle.' },
    { t: 16.28, h: "the cycle didn't" }, { t: 16.88, h: 'conclude, there' },
    { t: 17.44, h: 'was no cycle' }, { t: 17.92, h: 'top, right?' },
    { t: 18.56, h: 'there was no' }, { t: 18.88, h: 'cycle top.' },
    { t: 19.46, h: "there wasn't even" }, { t: 19.80, h: 'a mid -cycle' },
    { t: 20.16, h: 'top.' }, { t: 20.58, h: "the cycle didn't" },
    { t: 21.16, h: 'conclude.' }, { t: 21.74, h: "i don't know how much" },
    { t: 22.78, h: 'more evidence people' }, { t: 24.08, h: 'want, but nonetheless' },
    { t: 25.36, h: 'they did push us down' }, { t: 26.54, h: 'into a bear' },
    { t: 27.06, h: 'market.' }, { t: 27.46, h: 'never underestimate' },
    { t: 28.44, h: 'the power of' }, { t: 30.04, h: 'hordes and hordes' },
    { t: 31.18, h: 'of four -year' }, { t: 31.78, h: 'cycle <r>zombies</r>' },
    { t: 32.86, h: "who don't believe" }, { t: 33.30, h: 'the same' },
    { t: 33.88, h: 'thing.' },
  ],
  broll: [
    { src: A('broll-bc-broken-cycle.png'), tIn: 3.4, tOut: 9.0, mode: 'full' },
    { src: A('broll-bc-cycle-zombies.png'), tIn: 29.5, tOut: 33.9, mode: 'full' },
  ],
  sounds: [{ t: 3.4, src: WHOOSH }, { t: 29.5, src: WHOOSH }, { t: 29.5, src: BOOM }],
};

// 3 — tao-decentralizing-intelligence (66.24s)
export const D_BCM_TAO: ShortData = {
  clip: A('tao-decentralizing-intelligence.mp4'), fps: FPS, durationS: 66.24, capY: 560,
  thumb: { title: 'GOVERNMENTS\nARE GATING AI', chip: '$TAO', chipColor: TEAL, titleSize: 108 },
  captions: [
    { t: 0.00, h: 'i think <y>tao</y>' }, { t: 0.58, h: 'and <g>kaspa</g> are' },
    { t: 1.30, h: 'going to be' }, { t: 1.54, h: 'one of the' },
    { t: 1.80, h: 'biggest' }, { t: 2.66, h: 'gainers in this' },
    { t: 3.58, h: 'market.' }, { t: 4.08, h: 'so i did that' },
    { t: 4.50, h: 'about a week' }, { t: 5.00, h: 'ago.' },
    { t: 5.42, h: 'i did a' }, { t: 5.94, h: 'video dedicated to' },
    { t: 7.28, h: '<y>bittensor</y> there' }, { t: 7.90, h: 'and it was' },
    { t: 8.18, h: 'because of <r>fable</r>.' }, { t: 9.82, h: 'the government cut' },
    { t: 10.60, h: 'off access to' }, { t: 12.00, h: 'the public for' },
    { t: 12.66, h: 'the <r>fable</r> model' }, { t: 13.62, h: 'and apparently the' },
    { t: 14.72, h: 'same thing just' }, { t: 15.30, h: 'happened with <y>gpt</y>' },
    { t: 16.86, h: '<y>5.6</y>, sort of like' }, { t: 18.82, h: 'a competitor of' },
    { t: 19.76, h: 'that <r>mythos fable</r>' }, { t: 20.80, h: 'model from anthropic' },
    { t: 22.46, h: 'but this one from' }, { t: 23.12, h: 'openai.' },
    { t: 24.18, h: 'and the same' }, { t: 24.54, h: 'thing.' },
    { t: 24.84, h: "we've actually reached" }, { t: 26.50, h: 'a point at' },
    { t: 27.66, h: 'which the freedom' }, { t: 28.52, h: 'of the wild' },
    { t: 29.66, h: 'west of <y>ai</y>' }, { t: 30.76, h: 'releases are happening.' },
    { t: 32.60, h: "it's just" }, { t: 33.76, h: 'going to stop.' },
    { t: 34.52, h: 'we reached a' }, { t: 34.90, h: 'point where government' },
    { t: 36.04, h: 'is going to' }, { t: 36.46, h: 'step in and say, hey' },
    { t: 38.20, h: "maybe you shouldn't" }, { t: 38.84, h: 'release that to the' },
    { t: 39.50, h: 'public.' }, { t: 41.02, h: "and we've reached a" },
    { t: 41.70, h: "point where that's" }, { t: 42.48, h: 'happening, which is' },
    { t: 43.78, h: 'it goes to show you' }, { t: 45.60, h: 'that something <g>decentralized</g>' },
    { t: 46.80, h: 'is probably the' }, { t: 48.28, h: 'way to go.' },
    { t: 49.18, h: '<g>decentralizing intelligence</g>,' }, { t: 50.92, h: 'with <y>bittensor</y>.' },
    { t: 53.14, h: "it's going to be" }, { t: 53.48, h: 'like a wild,' },
    { t: 56.10, h: "if we're" }, { t: 56.82, h: 'going to get' },
    { t: 57.06, h: 'a total crypto' }, { t: 57.64, h: "market cap, it's" },
    { t: 58.50, h: 'going to be' }, { t: 58.78, h: 'similar in size' },
    { t: 59.58, h: 'to the global' }, { t: 60.56, h: 'stock market cap.' },
    { t: 61.72, h: "and you're looking" }, { t: 62.94, h: 'at <y>bittensor</y>' },
    { t: 63.66, h: 'probably being like' }, { t: 64.48, h: 'having a <y>trillion</y>' },
    { t: 65.30, h: 'dollar market cap.' },
  ],
  broll: [
    { src: A('broll-bc-ai-caged.png'), tIn: 9.6, tOut: 16.5, mode: 'full' },
    { src: A('broll-bc-bittensor-network.png'), tIn: 45.4, tOut: 52.6, mode: 'full' },
  ],
  sounds: [{ t: 9.6, src: WHOOSH }, { t: 45.4, src: WHOOSH }, { t: 45.4, src: BOOM }],
};

// 4 — buying-bitcoin-at-200 (24.52s)
export const D_BCM_BTC200: ShortData = {
  clip: A('buying-bitcoin-at-200.mp4'), fps: FPS, durationS: 24.52, capY: 560,
  thumb: { title: 'BUYING $TAO IS\nLIKE $200 BTC', chip: '$TAO', chipColor: TEAL, titleSize: 104 },
  captions: [
    { t: 0.00, h: "that's why i" }, { t: 0.34, h: 'said in my' },
    { t: 0.76, h: 'video, i was' }, { t: 1.30, h: 'like, what if' },
    { t: 2.80, h: "<y>tao</y>'s price" }, { t: 3.62, h: 'can actually,' },
    { t: 4.72, h: 'it depends' }, { t: 5.04, h: "on when. it's not" },
    { t: 5.92, h: 'going to happen' }, { t: 6.18, h: 'overnight.' },
    { t: 6.68, h: 'we can actually' }, { t: 7.08, h: 'get to the' },
    { t: 7.64, h: 'price of bitcoins' }, { t: 8.78, h: 'all time high.' },
    { t: 9.64, h: 'cause <y>tao</y>' }, { t: 10.20, h: 'actually get to' },
    { t: 10.86, h: '<y>$126,000</y>.' }, { t: 12.52, h: 'like i said' },
    { t: 13.22, h: "it's just like a" }, { t: 13.86, h: 'matter of when' },
    { t: 14.62, h: 'like <y>10</y>' }, { t: 15.22, h: 'years from now' },
    { t: 15.74, h: 'whatever it is.' }, { t: 17.36, h: "so it's literally" },
    { t: 18.06, h: 'like buying' }, { t: 18.70, h: 'bitcoin at <y>$200</y>.' },
    { t: 20.08, h: 'and i think' }, { t: 20.72, h: "<g>kaspa</g>'s in a" },
    { t: 21.38, h: 'similar' }, { t: 22.06, h: 'boat.' },
    { t: 22.60, h: '<y>tao</y> are going' }, { t: 23.04, h: 'to be the two' },
    { t: 23.42, h: 'biggest winners.' },
  ],
  broll: [{ src: A('broll-bc-tao-staircase.png'), tIn: 16.8, tOut: 23.8, mode: 'full' }],
  sounds: [{ t: 16.8, src: WHOOSH }, { t: 16.8, src: BOOM }],
};

// 5 — kaspa-whales-accumulating (32.93s)
export const D_BCM_WHALES: ShortData = {
  clip: A('kaspa-whales-accumulating.mp4'), fps: FPS, durationS: 32.93, capY: 560,
  thumb: { title: "WHO'S BUYING\nALL THE KASPA?", chip: 'WHALES', chipColor: TEAL, titleSize: 104 },
  logo: KAS_LOGO,
  captions: [
    { t: 0.00, h: 'my recent video' }, { t: 0.60, h: 'about <g>kaspa</g>, i' },
    { t: 1.44, h: 'was talking about' }, { t: 1.92, h: 'all the <y>whales</y>' },
    { t: 2.60, h: 'that are buying' }, { t: 3.18, h: 'up like crazy.' },
    { t: 4.44, h: 'you have retail' }, { t: 5.44, h: 'just exiting a' },
    { t: 7.76, h: 'lot.' }, { t: 8.28, h: "they're selling, but" },
    { t: 9.06, h: "who's buying?" }, { t: 10.20, h: "there's this group" },
    { t: 11.40, h: 'of like <y>20 to 30</y>' }, { t: 13.00, h: '<y>whales</y> just' },
    { t: 14.00, h: 'increasing the size' }, { t: 15.20, h: 'of their bags.' },
    { t: 16.40, h: "who's buying" }, { t: 17.20, h: 'everything up.' },
    { t: 18.20, h: "they're preparing" }, { t: 19.40, h: 'for something.' },
    { t: 21.00, h: "and they're like," }, { t: 22.00, h: "<g>kaspa</g>'s a <r>shit coin</r>," },
    { t: 23.60, h: 'all that stuff' }, { t: 24.40, h: 'like that.' },
    { t: 25.10, h: "and i'm like, man," }, { t: 26.20, h: 'i really think' },
    { t: 27.20, h: 'some of these' }, { t: 28.20, h: 'people are gonna' },
    { t: 29.20, h: 'be really sorry.' }, { t: 31.00, h: "that's a patient" },
    { t: 32.00, h: '<g>kaspa</g> holder.' },
  ],
  broll: [{ src: A('broll-bc-kaspa-whales.png'), tIn: 9.3, tOut: 16.4, mode: 'full' }],
  sounds: [{ t: 9.3, src: WHOOSH }, { t: 9.3, src: BOOM }],
};

// 6 — building-the-best-takes-time / "Kaspa is a sh** coin" (12.52s)
export const D_BCM_SHITCOIN: ShortData = {
  clip: A('building-the-best-takes-time.mp4'), fps: FPS, durationS: 12.52, capY: 560,
  thumb: { title: 'KASPA IS A\nSH** COIN?', chip: 'PATIENCE', chipColor: TEAL, titleSize: 116 },
  logo: KAS_LOGO,
  captions: [
    { t: 0.60, h: "<g>kaspa</g>'s a <r>shit</r>" }, { t: 1.18, h: '<r>coin</r>, all that' },
    { t: 1.94, h: 'stuff like that.' }, { t: 2.82, h: "i'm like, man, i" },
    { t: 3.66, h: 'really' }, { t: 4.28, h: 'think some of' },
    { t: 4.92, h: 'these people are' }, { t: 5.38, h: 'gonna be really' },
    { t: 5.74, h: 'sorry.' }, { t: 6.94, h: "that's what it" },
    { t: 7.56, h: 'takes being a' }, { t: 8.02, h: 'patient' },
    { t: 8.60, h: '<g>kaspa</g> holder.' }, { t: 9.58, h: 'building the' },
    { t: 11.32, h: 'best takes time.' },
  ],
  broll: [{ src: A('broll-bc-kaspa-construction.png'), tIn: 9.3, tOut: 12.5, mode: 'full' }],
  sounds: [{ t: 9.3, src: WHOOSH }, { t: 9.3, src: BOOM }],
};

// 7 — stop-waiting-buy-kaspa (54.0s)
export const D_BCM_STOPWAIT: ShortData = {
  clip: A('stop-waiting-buy-kaspa.mp4'), fps: FPS, durationS: 54.0, capY: 560,
  thumb: { title: 'STOP WAITING\nFOR THE BOTTOM', chip: '$KAS', chipColor: TEAL, titleSize: 108 },
  logo: KAS_LOGO,
  captions: [
    { t: 0.00, h: "but it's really" }, { t: 0.44, h: 'dangerous because you' },
    { t: 1.92, h: 'get a lot of' }, { t: 2.28, h: "people, they're just" },
    { t: 2.90, h: 'waiting and waiting' }, { t: 3.94, h: 'and waiting for' },
    { t: 4.72, h: 'that moment, for' }, { t: 5.62, h: 'that bottom so' },
    { t: 6.48, h: 'they can buy.' }, { t: 7.24, h: 'and if it' },
    { t: 7.48, h: 'never comes and' }, { t: 8.46, h: 'they <r>miss out</r>' },
    { t: 9.10, h: 'because the price' }, { t: 9.78, h: 'is going up' },
    { t: 10.44, h: 'they just <r>missed' }, { t: 11.16, h: 'out</r>.' },
    { t: 11.68, h: "that's really" }, { t: 12.30, h: 'dangerous.' },
    { t: 13.02, h: "it's a good idea" }, { t: 14.92, h: 'to buy here and' },
    { t: 15.88, h: 'there.' }, { t: 16.46, h: 'like if' },
    { t: 17.24, h: "you've got a" }, { t: 18.08, h: 'chunk of money' },
    { t: 18.96, h: 'sitting and waiting' }, { t: 20.22, h: "right, let's say" },
    { t: 20.80, h: 'you have <y>10</y>' }, { t: 21.50, h: 'grand saved up' },
    { t: 22.76, h: 'to buy at the' }, { t: 23.44, h: 'bottom, man.' },
    { t: 24.06, h: "it's like you" }, { t: 24.36, h: 'could be saving' },
    { t: 24.96, h: 'that, and' }, { t: 25.92, h: "you're never going" },
    { t: 26.38, h: 'to see that' }, { t: 26.76, h: 'bottom.' },
    { t: 27.34, h: 'spend a' }, { t: 27.72, h: 'little bit of' },
    { t: 28.72, h: 'it.' }, { t: 28.86, h: 'or just take' },
    { t: 29.80, h: 'money out' }, { t: 30.28, h: 'of your paycheck' },
    { t: 30.72, h: "every week, now's" }, { t: 31.60, h: 'a good time to buy.' },
    { t: 32.62, h: 'never financial advice.' }, { t: 34.20, h: "but things" },
    { t: 34.92, h: "are like, it's" }, { t: 35.50, h: 'crazy low.' },
    { t: 36.36, h: 'if <g>kaspa</g> goes' }, { t: 37.08, h: 'to a hundred' },
    { t: 37.60, h: 'billion market cap' }, { t: 38.60, h: 'in this economic' },
    { t: 39.36, h: "expansion, you're going" }, { t: 40.36, h: 'to do like over' },
    { t: 41.40, h: '<y>a hundred x</y> at' }, { t: 41.92, h: 'this point, right?' },
    { t: 42.62, h: "it's <y>$779 million</y>." }, { t: 43.90, h: 'now, are you' },
    { t: 44.42, h: 'really going to' }, { t: 44.98, h: 'just not buy at <y>2' },
    { t: 46.44, h: '.8 cents</y> because' }, { t: 47.36, h: "you're waiting for" },
    { t: 48.02, h: '<y>2.4 cents</y>' }, { t: 49.38, h: 'or something like' },
    { t: 49.90, h: 'that?' }, { t: 50.18, h: "you're just not" },
    { t: 50.54, h: 'going to buy' }, { t: 50.98, h: 'at all.' },
    { t: 51.32, h: "it's just kind of" }, { t: 51.78, h: 'crazy.' },
    { t: 52.30, h: 'like buy some, just keep' }, { t: 53.34, h: 'buying some.' },
  ],
  broll: [{ src: A('broll-bc-waiting-rocket.png'), tIn: 6.4, tOut: 13.8, mode: 'full' }],
  sounds: [{ t: 6.4, src: WHOOSH }, { t: 6.4, src: BOOM }],
};

// 8 — the-1992-magnificent-crash (55.9s)
export const D_BCM_1992: ShortData = {
  clip: A('the-1992-magnificent-crash.mp4'), fps: FPS, durationS: 55.9, capY: 560,
  thumb: { title: "WE'RE AT 1992,\nNOT 2000", chip: 'MACRO', chipColor: TEAL, titleSize: 112 },
  captions: [
    { t: 0.00, h: 'was my expectation' }, { t: 0.92, h: 'to see an' },
    { t: 2.08, h: 'incredible economic expansion' }, { t: 3.52, h: 'right now in' },
    { t: 4.46, h: 'the next few' }, { t: 4.90, h: 'years and whether' },
    { t: 6.26, h: 'it be <y>2030, 2035</y>' }, { t: 8.06, h: 'whatever it is' },
    { t: 8.78, h: 'but it will be my' }, { t: 9.34, h: 'expectation that after' },
    { t: 11.04, h: 'this incredible economic' }, { t: 12.54, h: "expansion there's going" },
    { t: 13.48, h: 'to be a' }, { t: 13.76, h: '<r>magnificent crash</r> similar' },
    { t: 15.28, h: 'or worse to' }, { t: 16.04, h: 'what happened in' },
    { t: 16.98, h: '<y>2000</y>.' }, { t: 17.68, h: 'we had the top of' },
    { t: 18.74, h: 'the market in' }, { t: 19.88, h: 'the year <y>2000</y> at the' },
    { t: 21.08, h: 'end of the' }, { t: 21.86, h: 'telecommunications boom' },
    { t: 23.54, h: 'and it was a' }, { t: 24.16, h: 'significant drawdown' },
    { t: 25.50, h: 'unlike anything' }, { t: 26.92, h: 'that bitcoin has' },
    { t: 27.92, h: 'ever seen because' }, { t: 28.64, h: 'nothing like that' },
    { t: 29.30, h: 'has ever happened' }, { t: 29.96, h: 'since bitcoin existed.' },
    { t: 31.56, h: "so what i'm" }, { t: 31.96, h: 'thinking is like' },
    { t: 32.66, h: 'if we get into this' }, { t: 33.54, h: 'crazy economic expansion' },
    { t: 35.36, h: 'over the next' }, { t: 36.02, h: 'whatever five years' },
    { t: 37.66, h: 'give or take' }, { t: 38.74, h: 'we figure that' },
    { t: 39.44, h: 'the economy started' }, { t: 40.10, h: 'to run in <y>92</y> and' },
    { t: 41.48, h: 'then it topped' }, { t: 42.00, h: 'off in <y>2000</y>,' },
    { t: 44.20, h: 'but when that all' }, { t: 45.90, h: 'comes to an' },
    { t: 46.42, h: 'end who knows' }, { t: 47.08, h: "what year it's" },
    { t: 47.56, h: 'going to be' }, { t: 48.02, h: "there's going to" },
    { t: 48.58, h: 'be a significant' }, { t: 48.98, h: '<r>market crash</r> and' },
    { t: 50.04, h: 'i would imagine' }, { t: 50.66, h: 'bitcoin would' },
    { t: 52.06, h: "go from i don't know" }, { t: 53.06, h: "let's say <y>2" },
    { t: 53.58, h: 'million</y> probably going' }, { t: 54.64, h: 'way below power' },
    { t: 55.56, h: 'law.' },
  ],
  broll: [
    { src: A('broll-bc-dotcom-1992.png'), tIn: 0.5, tOut: 6.5, mode: 'full' },
    { src: A('broll-bc-magnificent-crash.png'), tIn: 13.5, tOut: 20.0, mode: 'full' },
  ],
  sounds: [{ t: 0.5, src: WHOOSH }, { t: 13.5, src: WHOOSH }, { t: 13.5, src: BOOM }],
};

export const FRAMES_BCM = {
  learn: 649, breakage: 1026, tao: 1989, btc200: 737,
  whales: 989, shitcoin: 377, stopwait: 1621, c1992: 1679,
};
