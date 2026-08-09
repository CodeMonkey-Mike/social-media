import { staticFile } from 'remotion';
import type { ShortData } from './LivestreamShort';

const FPS = 30;
const A = (f: string) => staticFile(f);
const P = (s: string) => A(`projects/kaspa-changes-everything/${s}.mp4`);
const WHOOSH = A('sfx/Cinematic Whoosh 02.wav');
const BOOM = A('sfx/Boom - Big Reveal.wav');

export const FRAMES_KC = {
  covenants: Math.round(47.19 * FPS),
  first: Math.round(12.20 * FPS),
  eliza: Math.round(16.88 * FPS),
  krc20: Math.round(48.06 * FPS),
};

// ── Clip 1: Covenants explained (47.19s) ─────────────────────────────────────
export const D_KC_COVENANTS: ShortData = {
  clip: P('covenants-explained'), fps: FPS, durationS: 47.19, capY: 560,
  thumb: { title: "KASPA CAN NOW\nPUT RULES\nON YOUR COINS", chip: "COVENANTS", chipColor: "#3fd0c9", titleSize: 92 },
  captions: [
    { t: 0.00, h: "so for those" },
    { t: 0.66, h: "of you who don't know" },
    { t: 1.48, h: "<g>kaspa</g> is going" },
    { t: 2.20, h: "to be the only" },
    { t: 3.58, h: "chain out there" },
    { t: 4.40, h: "that can have" },
    { t: 6.48, h: "rules assigned to" },
    { t: 8.20, h: "how certain addresses" },
    { t: 9.76, h: "can spend things" },
    { t: 10.84, h: "so you can have an" },
    { t: 12.04, h: "address that can" },
    { t: 12.58, h: "only send to one" },
    { t: 13.76, h: "group of addresses" },
    { t: 15.28, h: "if there's a" },
    { t: 15.88, h: "treasury or trust" },
    { t: 16.96, h: "or something like" },
    { t: 17.60, h: "that, just rules" },
    { t: 18.82, h: "built into the" },
    { t: 20.42, h: "sending of anything" },
    { t: 22.04, h: "of your tokens" },
    { t: 23.24, h: "something that cannot" },
    { t: 24.00, h: "be spent until" },
    { t: 24.90, h: "this particular block" },
    { t: 25.92, h: "rules can require" },
    { t: 28.28, h: "two specific" },
    { t: 29.20, h: "signatures, <y>two of three</y>" },
    { t: 30.96, h: "different signatures" },
    { t: 31.80, h: "like a ceo and a" },
    { t: 33.20, h: "president of a" },
    { t: 33.88, h: "company and somebody" },
    { t: 34.88, h: "else or a cfo" },
    { t: 36.08, h: "needs to sign off" },
    { t: 37.30, h: "and if you" },
    { t: 37.70, h: "send money to somebody" },
    { t: 39.68, h: "<y>10%</y> can route" },
    { t: 40.46, h: "to this other" },
    { t: 41.04, h: "address" },
    { t: 43.38, h: "it can only move" },
    { t: 44.38, h: "to another <g>covenant</g>" },
    { t: 45.46, h: "with the same rules" },
    { t: 46.22, h: "interesting" },
  ],
  broll: [
    { src: A('broll-kc-cov-rules.png'), tIn: 1.8, tOut: 15.0, mode: 'full' },
    { src: A('broll-kc-cov-multisig.png'), tIn: 25.5, tOut: 36.0, mode: 'full' },
    { src: A('broll-kc-cov-route.png'), tIn: 39.4, tOut: 47.19, mode: 'full' },
  ],
  sounds: [{ t: 1.8, src: WHOOSH }, { t: 25.5, src: WHOOSH }, { t: 39.4, src: WHOOSH }],
};

// ── Clip 2: No other chain (first to do it) (12.20s) ─────────────────────────
export const D_KC_FIRST: ShortData = {
  clip: P('kaspa-first-covenants'), fps: FPS, durationS: 12.20, capY: 560,
  thumb: { title: "NO OTHER CHAIN\nCAN DO THIS", chip: "KASPA FIRST", chipColor: "#3fd0c9", titleSize: 100 },
  captions: [
    { t: 0.00, h: "and <g>kaspa</g> is" },
    { t: 1.44, h: "the first <g>decentralized</g>" },
    { t: 3.58, h: "the first <g>blockchain</g>" },
    { t: 5.10, h: "at all" },
    { t: 5.90, h: "there's really" },
    { t: 7.12, h: "no other" },
    { t: 7.84, h: "even centralized" },
    { t: 8.70, h: "proof of stake chain" },
    { t: 10.02, h: "that does this" },
    { t: 11.00, h: "and <g>kaspa</g> is" },
    { t: 11.60, h: "going to be <y>first</y>" },
  ],
  broll: [
    { src: A('broll-kc-first-podium.png'), tIn: 0.8, tOut: 12.20, mode: 'full' },
  ],
  sounds: [{ t: 0.8, src: WHOOSH }, { t: 11.0, src: BOOM }],
};

// ── Clip 3: ElizaOS 500x (16.88s) ────────────────────────────────────────────
export const D_KC_ELIZA: ShortData = {
  clip: P('elizaos-500x'), fps: FPS, durationS: 16.88, capY: 560,
  thumb: { title: "ELIZAOS COULD\nDO A 500x", chip: "$AI16Z", chipColor: "#ff8c1a", titleSize: 100 },
  captions: [
    { t: 0.00, h: "as long as" },
    { t: 1.22, h: "the company" },
    { t: 1.88, h: "behind it stays" },
    { t: 2.82, h: "around, which i'm" },
    { t: 3.80, h: "pretty sure it will" },
    { t: 5.14, h: "in an <g>ai</g> driven" },
    { t: 6.36, h: "cycle top" },
    { t: 8.10, h: "it could go" },
    { t: 8.58, h: "into the" },
    { t: 9.10, h: "<y>billions</y>" },
    { t: 10.12, h: "even if it" },
    { t: 10.90, h: "just matches" },
    { t: 12.02, h: "its <g>ai16z</g>" },
    { t: 13.20, h: "all time high" },
    { t: 14.30, h: "that's like a" },
    { t: 15.00, h: "<y>500x</y>" },
    { t: 16.00, h: "or something" },
  ],
  broll: [
    { src: A('broll-kc-eliza-rise.png'), tIn: 0.6, tOut: 8.5, mode: 'full' },
    { src: A('broll-kc-eliza-neural.png'), tIn: 8.5, tOut: 16.88, mode: 'full' },
  ],
  sounds: [{ t: 0.6, src: WHOOSH }, { t: 14.9, src: BOOM }],
};

// ── Clip 4: KRC20 memes compilation (48.06s) ─────────────────────────────────
export const D_KC_KRC20: ShortData = {
  clip: P('krc20-compilation'), fps: FPS, durationS: 48.06, capY: 560,
  thumb: { title: "TINY KRC20 MEMES\n100x POTENTIAL", chip: "KRC20", chipColor: "#3fd0c9", titleSize: 96 },
  captions: [
    { t: 0.00, h: "let's talk about" },
    { t: 1.86, h: "these <g>krc20s</g>" },
    { t: 4.14, h: "i put <g>kroak</g>" },
    { t: 4.80, h: "i love <g>kroak</g>" },
    { t: 5.40, h: "did one of those" },
    { t: 5.82, h: "hyper edited videos" },
    { t: 7.16, h: "some of these" },
    { t: 7.58, h: "things, if you" },
    { t: 8.24, h: "just throw" },
    { t: 8.70, h: "in <y>20 bucks</y>" },
    { t: 9.54, h: "not financial advice" },
    { t: 11.10, h: "some of these" },
    { t: 11.84, h: "things, if they" },
    { t: 12.34, h: "take off, like if" },
    { t: 13.20, h: "<g>pro ghosts</g> are" },
    { t: 14.20, h: "only a <y>20 million</y>" },
    { t: 15.40, h: "market cap" },
    { t: 16.40, h: "that's a <y>100x</y>" },
    { t: 17.96, h: "that's crazy, like" },
    { t: 18.72, h: "how low everything" },
    { t: 19.84, h: "is" },
    { t: 20.76, h: "<g>nacho</g> is three" },
    { t: 21.48, h: "million, <g>kaspy</g>" },
    { t: 23.00, h: "there's an" },
    { t: 23.92, h: "awesome play" },
    { t: 25.50, h: "these things go" },
    { t: 26.66, h: "into tens of" },
    { t: 27.74, h: "millions, like" },
    { t: 28.56, h: "<y>100x</y> or even more" },
    { t: 31.28, h: "some of these are" },
    { t: 32.26, h: "so low, like i said" },
    { t: 33.06, h: "<g>slippy</g>, look at" },
    { t: 33.60, h: "that, <y>14k</y>" },
    { t: 34.46, h: "market cap" },
    { t: 35.76, h: "a <y>100x</y>" },
    { t: 36.42, h: "now think" },
    { t: 36.78, h: "about it, if this" },
    { t: 37.58, h: "goes to one point four" },
    { t: 38.46, h: "million market cap" },
    { t: 39.28, h: "that's a <y>100x</y>" },
    { t: 40.20, h: "very interesting" },
    { t: 41.08, h: "like what could" },
    { t: 41.38, h: "happen" },
    { t: 42.04, h: "<g>pac-man</g>, yeah" },
    { t: 42.94, h: "they've been in" },
    { t: 43.30, h: "the game" },
    { t: 45.90, h: "they got some" },
    { t: 46.48, h: "really cool graphics" },
    { t: 47.52, h: "the way they draw it" },
  ],
  broll: [
    { src: A('broll-kc-krc-lineup.png'), tIn: 0.3, tOut: 4.0, mode: 'full' },     // "let's talk about these KRC20s"
    { src: A('broll-kc-kroak.png'), tIn: 4.1, tOut: 7.2, mode: 'full' },          // "I put Kroak, I love Kroak" — REAL Kroak ref
    { src: A('broll-kc-krc-rocket.png'), tIn: 7.5, tOut: 31.5, mode: 'full' },     // the 100x potential talk (pro ghosts, Nacho, tens of millions)
    { src: A('broll-kc-slippy.png'), tIn: 32.5, tOut: 41.4, mode: 'full' },        // "Slippy, look at that 14k... 100x" — REAL Slippy ref
    // 41.4-48.06: Pac-Man section — NO b-roll, show the a-roll (Mike's screen has the Pac-Man graphic).
  ],
  sounds: [{ t: 0.3, src: WHOOSH }, { t: 4.1, src: WHOOSH }, { t: 16.4, src: BOOM }, { t: 32.5, src: WHOOSH }],
};
