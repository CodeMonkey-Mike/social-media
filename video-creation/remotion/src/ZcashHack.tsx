import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['600'], subsets: ['latin'] });

export const ZC_FPS = 30;

const C = {
  bgDeep: '#0a0c10', bgCard: '#12151c', border: '#1e2330',
  cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', green: '#00e68a',
  pri: '#e8eaf0', sec: '#8892a4', mut: '#505a6e',
};
const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ---- scene payloads ----
type Scene =
  | { t: number; kind: 'hero'; accent: string; eyebrow: string; titleA: string; titleB: string; sub?: string }
  | { t: number; kind: 'heading'; pill: string; color: string; title: string }
  | { t: number; kind: 'stat'; accent: string; tag: string; big: string; desc: string }
  | { t: number; kind: 'card'; accent: string; eyebrow: string; title: string; desc: string }
  | { t: number; kind: 'dread'; em: string; lead: string; quote: string }
  | { t: number; kind: 'tl'; color: string; date: string; title: string; desc: string }
  | { t: number; kind: 'close'; big: string; subTop: string; subBot: string }
  | { t: number; kind: 'body'; text: string }
  | { t: number; kind: 'cta'; big: string; line: string };

type Slide = { dur: number; audio: string; scenes: Scene[]; cutaways?: { t: number; dur: number }[] };

// Per-slide containers cued to the narration (local seconds within each slide's audio).
const SLIDES: Slide[] = [
  // SLIDE 1 — Title / Setup (ACT I, red/purple)
  { dur: 62.043719, audio: 'zcash/slide-1.mp3', scenes: [
    { t: 0, kind: 'hero', accent: C.red, eyebrow: 'A True Story', titleA: 'AI Can Now', titleB: 'Hack Blockchains',
      sub: 'An AI was pointed at the code behind a major privacy coin. In a single day it found a flaw that survived four years of expert audits.' },
    { t: 13.7, kind: 'stat', accent: C.red, tag: 'The Flaw', big: '2 Lines',
      desc: "Two lines of code in Zcash's privacy circuit quietly let invalid transactions pass a check that should have rejected them." },
    { t: 30.6, kind: 'stat', accent: C.purple, tag: 'Undetected', big: '4 Years',
      desc: 'Live since May 2022. Reviewed repeatedly by expert cryptographers. Nobody caught it, until an AI did.' },
    { t: 45.92, kind: 'stat', accent: C.gold, tag: 'The Payload', big: 'Unlimited & Invisible',
      desc: 'Mint counterfeit ZEC from nothing, indistinguishable from real coins, with no on-chain trace at all.' },
  ] },
  // SLIDE 2 — Infinite Money Glitch (ACT I)
  { dur: 69.381224, audio: 'zcash/slide-2.mp3', scenes: [
    { t: 0, kind: 'heading', pill: 'Act I : The Nightmare', color: C.red, title: 'The Infinite Money Glitch' },
    { t: 7.0, kind: 'card', accent: C.red, eyebrow: 'What It Allowed', title: 'Counterfeit From Nothing',
      desc: 'Not draining one wallet. The flaw let an attacker create brand-new coins out of thin air: perfectly valid, indistinguishable from real ZEC, with no signature and no on-chain footprint.' },
    { t: 30.62, kind: 'card', accent: C.purple, eyebrow: "Why It's Terrifying", title: 'And You Could Never Know',
      desc: "Zcash is a privacy coin; balances and transfers are hidden by design. The same privacy that protects users also erases the evidence. You can patch the future. You cannot audit the past." },
    { t: 61.8, kind: 'dread', em: C.red, lead: "So here's the question nobody can answer:", quote: 'is the money real, and how would you ever check?' },
  ] },
  // SLIDE 3 — Market Felt It (ACT I)
  { dur: 48.529705, audio: 'zcash/slide-3.mp3', scenes: [
    { t: 0, kind: 'heading', pill: 'Act I : The Fallout', color: C.red, title: 'The Market Felt It Instantly' },
    { t: 5.84, kind: 'stat', accent: C.red, tag: 'Price Collapse', big: '~50%',
      desc: 'ZEC fell from roughly $635 toward $309 in about 48 hours once the disclosure went public.' },
    { t: 18.88, kind: 'stat', accent: C.purple, tag: 'Value Erased', big: '$3B+',
      desc: 'More than three billion dollars in market cap wiped out before any partial recovery.' },
    { t: 25.36, kind: 'stat', accent: C.gold, tag: 'Liquidations', big: '$100M+',
      desc: 'Cascading liquidations topped one hundred million. Whales like Arthur Hayes dumped their entire position.' },
    { t: 34.4, kind: 'dread', em: C.red, lead: "And the scariest part wasn't the bug.", quote: 'It was that an AI found it in a single day. What else is out there, on every other chain, that just hasn’t been found yet?' },
  ] },
  // SLIDE 4 — The Turn (ACT II, green/cyan)
  { dur: 63.669116, audio: 'zcash/slide-4.mp3', scenes: [
    { t: 0, kind: 'heading', pill: 'Act II : Now The Truth', color: C.green, title: 'Nobody Actually Hacked Anything' },
    { t: 9.74, kind: 'card', accent: C.green, eyebrow: 'Plot Twist 01', title: 'It Was a Rescue, Not a Robbery',
      desc: 'Taylor Hornby, a security researcher hired by Shielded Labs for an ongoing audit, found the flaw and reported it instead of using it. He proved the exploit on a private local testnet, then disclosed it the same evening.' },
    { t: 40.54, kind: 'card', accent: C.cyan, eyebrow: 'Plot Twist 02', title: 'A Human Aimed the AI',
      desc: 'It was not a rogue machine. Hornby paired Claude Opus 4.8, released just one day earlier, with his own custom auditing framework and aimed it straight at the privacy circuit.' },
    { t: 55.46, kind: 'dread', em: C.green, lead: "So here's the honest headline:", quote: 'a skilled human plus a frontier AI cracked four years of expert review in a single day.' },
  ] },
  // SLIDE 5 — Bug Demystified (ACT II)
  { dur: 74.520680, audio: 'zcash/slide-5.mp3', scenes: [
    { t: 0, kind: 'heading', pill: 'Act II : Under the Hood', color: C.green, title: 'The Bug, Demystified' },
    { t: 5.56, kind: 'card', accent: C.green, eyebrow: 'The System', title: 'Proof, Not Trust',
      desc: "Zcash's Orchard pool hides transactions using zero-knowledge proofs. You don't reveal your transaction; you reveal a proof that it followed the rules. The whole system's honesty depends on one thing: it must be impossible to produce a valid-looking proof for an invalid transaction." },
    { t: 29.18, kind: 'card', accent: C.cyan, eyebrow: 'The Flaw', title: "A Check That Didn't Check",
      desc: 'Two lines deep in the circuit, a check on the math was under-constrained, like a bouncer holding a checklist he never actually reads. Invalid inputs slipped right through a gate built to reject them.' },
    { t: 64.64, kind: 'dread', em: C.red, lead: 'A human could stare at this for four years and never see it.', quote: 'An AI scans the whole haystack and finds the one bad needle in an afternoon.' },
  ] },
  // SLIDE 6 — Timeline (ACT II)
  { dur: 72.091723, audio: 'zcash/slide-6.mp3', scenes: [
    { t: 0, kind: 'heading', pill: 'Act II : The Response', color: C.green, title: 'Six Days, Start to Patch' },
    { t: 12.52, kind: 'tl', color: C.red, date: 'May 28, 2026', title: 'Claude Opus 4.8 Ships', desc: 'Anthropic releases a new frontier model. Hornby points it, plus a custom auditing framework, at the Orchard circuit.' },
    { t: 16.10, kind: 'tl', color: C.purple, date: 'May 29, Morning', title: 'The Flaw Is Found', desc: 'Within ~24 hours he locates the bug, writes a complete working exploit, and verifies unlimited counterfeit ZEC, on a local testnet only.' },
    { t: 25.12, kind: 'tl', color: C.cyan, date: 'May 29, Evening', title: 'Responsible Disclosure', desc: 'He reports it the same night to the ZODL core engineers. Never touches mainnet.' },
    { t: 29.72, kind: 'tl', color: C.gold, date: 'Within Hours', title: 'Emergency Soft Fork', desc: 'A coordinated soft fork temporarily disables all Orchard transactions, freezing the risk while a real fix is built.' },
    { t: 39.84, kind: 'tl', color: C.green, date: 'June 3', title: 'NU6.2, Permanent Fix', desc: 'A hard fork activates a corrected circuit, closing the hole for good. Public disclosure follows after the network is already safe.' },
    { t: 60.12, kind: 'dread', em: C.red, lead: 'The system worked this time. But don’t get comfortable:', quote: 'the reason this is one of the scariest stories in crypto all year has almost nothing to do with Zcash.' },
  ] },
  // SLIDE 7 — The Scary Part: Public AI (ACT II climax, red/purple)
  { dur: 80.389909, audio: 'zcash/slide-7.mp3', scenes: [
    { t: 0, kind: 'heading', pill: 'Act II : The Scary Part', color: C.red, title: 'It Was Public AI' },
    { t: 11.92, kind: 'card', accent: C.red, eyebrow: 'Not a Supercomputer', title: 'Just Regular Claude',
      desc: 'No secret government machine. No elite team in a basement. It was the same public AI you and I can log into right now, out for a single day, and it cracked a four-year-old flaw in one of the most heavily audited privacy coins in crypto.' },
    { t: 43.58, kind: 'card', accent: C.purple, eyebrow: 'The Barrier Collapsed', title: 'Weeks, Now an Afternoon',
      desc: 'Finding a catastrophic exploit used to take a rare, world-class cryptographer weeks. Now it takes one curious person and a twenty dollar subscription. Thousands of other chains are suddenly in range.' },
    { t: 58.84, kind: 'dread', em: C.red, lead: 'This time, a good guy reported it.', quote: "Next time it's someone who stays quiet, drains the funds, or quietly mints an endless supply, and you would never even know it happened." },
  ] },
  // SLIDE 8 — Kaspa (ACT III) — Mike's REAL audio, FACE-LED: face fills the sustained
  // camera-looks; containers show only during his read-down dips (gaze-mapped, desilenced timeline).
  { dur: 79.157007, audio: 'zcash/slide8.m4a', cutaways: [
    { t: 0, dur: 12.0 },     // camera (Mike-marked): intro "how do you protect yourself... I'm a Kaspa guy"
    { t: 32, dur: 2.0 },     // camera (Mike-marked): "you literally cannot audit the supply"
    { t: 75, dur: 4.16 },    // camera (Mike-marked): closing "the whole reason I keep coming back to Kaspa"
  ], scenes: [
    { t: 12, kind: 'heading', pill: 'Act III : Where This Leaves Us', color: C.gold, title: "Tech You Don't Have to Trust Blindly" },
    { t: 17, kind: 'card', accent: C.gold, eyebrow: 'The Lesson', title: 'Hidden Math Is a Bigger Target',
      desc: 'The more a chain leans on complicated, hidden cryptography, like a private pool that conceals the entire supply, the bigger the attack surface, and the worse it is when something finally breaks. With Zcash, the counterfeiting could happen completely invisibly.' },
    { t: 34, kind: 'card', accent: C.cyan, eyebrow: 'Why I Keep Coming Back', title: 'A Ledger You Can Check',
      desc: 'Kaspa is proof of work, a fully implemented GhostDAG, with a transparent, fair-launched supply: no premine, and no hidden pool where someone could secretly print a billion coins. The ledger is right out in the open, where anybody can check it.' },
    { t: 63, kind: 'dread', em: C.green, lead: "No chain is unhackable, and I won't pretend otherwise.", quote: "But when the trust model is simpler and the supply is something you can verify with your own eyes, you're playing a fundamentally safer game." },
  ] },
  // SLIDE 9 — Closing + CTA (ACT III) — desilenced
  { dur: 82.753628, audio: 'zcash/slide-9.mp3', scenes: [
    { t: 0, kind: 'close', big: 'Audited ≠ Safe', subTop: 'The Real Takeaway', subBot: 'a publicly available AI just cracked four years of expert review in a single day' },
    { t: 6.22, kind: 'body', text: 'The title was a little bit of bait, and it is also completely true. AI can now hack blockchains. The only reason this wasn’t a catastrophe is that a good guy got there first.' },
    { t: 28.14, kind: 'body', text: 'The game has changed. Verification is now continuous, adversarial, and it moves at machine speed. The chains that survive will be the ones whose integrity you can actually check, not the ones that just ask you to trust the hidden math.' },
    { t: 56.84, kind: 'cta', big: '353X', line: 'My most recent call did 353X on the Lab token. If you want to make money in this space, the link is in the description.' },
  ] },
];

// ---- flatten to absolute timeline ----
const OFFSETS: number[] = [];
SLIDES.reduce((acc, s, i) => { OFFSETS[i] = acc; return acc + s.dur; }, 0);
const TOTAL = SLIDES.reduce((a, s) => a + s.dur, 0);
export const ZC_DURATION = Math.ceil(TOTAL * ZC_FPS);

type FlatScene = Scene & { abs: number; out: number };
const FLAT: FlatScene[] = [];
SLIDES.forEach((slide, si) => {
  slide.scenes.forEach((sc, ci) => {
    const abs = OFFSETS[si] + sc.t;
    const nextLocal = slide.scenes[ci + 1]?.t;
    const out = nextLocal !== undefined ? OFFSETS[si] + nextLocal : (OFFSETS[si + 1] ?? TOTAL);
    FLAT.push({ ...sc, abs, out });
  });
});

// ---- shared chrome ----
const Eyebrow: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 1.5 }) => (
  <p style={{ fontFamily: MONO, color, fontSize: `${size}rem`, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{children}</p>
);

const SceneNode: React.FC<{ s: Scene }> = ({ s }) => {
  switch (s.kind) {
    case 'hero':
      return (
        <div style={{ textAlign: 'center', maxWidth: 1500 }}>
          <p style={{ fontFamily: SANS, color: C.mut, fontSize: '1.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 30 }}>{s.eyebrow}</p>
          <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '7rem', lineHeight: 1.05, letterSpacing: '-0.02em', color: C.pri }}>
            {s.titleA} <span style={{ color: s.accent }}>{s.titleB}</span>
          </h1>
          {s.sub && <p style={{ fontFamily: SANS, color: C.sec, fontSize: '2.1rem', lineHeight: 1.6, marginTop: 36, maxWidth: 1150, marginLeft: 'auto', marginRight: 'auto' }}>{s.sub}</p>}
        </div>
      );
    case 'heading':
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: MONO, color: s.color, fontSize: '1.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em', padding: '10px 24px', borderRadius: 999, border: `1px solid ${s.color}55`, background: `${s.color}11` }}>{s.pill}</span>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '5.4rem', lineHeight: 1.12, color: C.pri, marginTop: 40, maxWidth: 1500 }}>{s.title}</h2>
          <div style={{ width: 100, height: 5, borderRadius: 2, background: `linear-gradient(90deg, ${s.color}, ${C.cyan})`, margin: '40px auto 0' }} />
        </div>
      );
    case 'stat':
      return (
        <div style={{ width: 1150, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 28, padding: '70px 80px', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
          <p style={{ fontFamily: SANS, color: s.accent, fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{s.tag}</p>
          <p style={{ fontFamily: MONO, fontWeight: 600, color: s.accent, fontSize: s.big.length > 10 ? '4.6rem' : '7rem', lineHeight: 1.04, margin: '20px 0 26px' }}>{s.big}</p>
          <p style={{ fontFamily: SANS, color: C.sec, fontSize: '2.15rem', lineHeight: 1.55 }}>{s.desc}</p>
        </div>
      );
    case 'card':
      return (
        <div style={{ width: 1400, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 28, padding: '70px 80px', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
          <Eyebrow color={s.accent} size={1.6}>{s.eyebrow}</Eyebrow>
          <p style={{ fontFamily: SERIF, fontWeight: 700, color: C.pri, fontSize: '3.6rem', lineHeight: 1.15, margin: '16px 0 24px' }}>{s.title}</p>
          <p style={{ fontFamily: SANS, color: C.sec, fontSize: '2.15rem', lineHeight: 1.6 }}>{s.desc}</p>
        </div>
      );
    case 'dread':
      return (
        <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '4rem', lineHeight: 1.3, color: C.pri, textAlign: 'center', maxWidth: 1450 }}>
          {s.lead} <span style={{ fontStyle: 'italic', color: s.em }}>{s.quote}</span>
        </p>
      );
    case 'tl':
      return (
        <div style={{ width: 1300, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 24, padding: '60px 72px', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, background: s.color }} />
          <p style={{ fontFamily: MONO, fontWeight: 600, color: s.color, fontSize: '1.8rem' }}>{s.date}</p>
          <p style={{ fontFamily: SERIF, fontWeight: 700, color: C.pri, fontSize: '3.4rem', lineHeight: 1.15, margin: '14px 0 22px' }}>{s.title}</p>
          <p style={{ fontFamily: SANS, color: C.sec, fontSize: '2.05rem', lineHeight: 1.55 }}>{s.desc}</p>
        </div>
      );
    case 'close':
      return (
        <div style={{ textAlign: 'center', maxWidth: 1300 }}>
          <p style={{ fontFamily: SANS, color: C.mut, fontSize: '1.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em' }}>{s.subTop}</p>
          <p style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '9rem', lineHeight: 1.05, margin: '20px 0', background: `linear-gradient(135deg, ${C.gold}, ${C.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.big}</p>
          <p style={{ fontFamily: SANS, color: C.mut, fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.04em', maxWidth: 1000, margin: '0 auto' }}>{s.subBot}</p>
        </div>
      );
    case 'body':
      return <p style={{ fontFamily: SERIF, fontWeight: 400, fontSize: '3.2rem', lineHeight: 1.5, color: C.pri, textAlign: 'center', maxWidth: 1400 }}>{s.text}</p>;
    case 'cta':
      return (
        <div style={{ textAlign: 'center', maxWidth: 1300 }}>
          <Eyebrow color={C.green} size={1.5}>If you found this useful</Eyebrow>
          <p style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '8rem', lineHeight: 1, color: C.gold, margin: '16px 0 22px' }}>{s.big}</p>
          <p style={{ fontFamily: SANS, fontSize: '2.3rem', lineHeight: 1.5, color: C.pri }}>{s.line}</p>
        </div>
      );
  }
};

// Face cutaway from slide 8 PiP (bottom-right of 1920x1080). Sharp centered vertical
// strip + blurred zoomed copy as wings. Crop numbers tuned for this recording's PiP.
// startFrames = where in slide8.mp4 (frames) this cutaway begins, so the face stays
// in sync with the slide-8 audio (BUG FIXED: previously played from frame 0 every time).
const FaceCutaway: React.FC<{ durFrames: number; startFrames: number }> = ({ durFrames, startFrames }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 4, durFrames - 4, durFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const src = staticFile('zcash/slide8.mp4');
  return (
    <AbsoluteFill style={{ opacity: op, background: C.bgDeep }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={src} muted startFrom={startFrames} style={{ position: 'absolute', width: 6336, height: 3564, left: -2900, top: -1250, filter: 'blur(48px) brightness(0.9) saturate(1.4)' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 660, top: 0, width: 600, height: 1080, overflow: 'hidden', boxShadow: '0 0 90px rgba(0,0,0,0.7)' }}>
        <OffthreadVideo src={src} muted startFrom={startFrames} style={{ position: 'absolute', width: 3141, height: 1767, left: -2457, top: -474 }} />
      </div>
    </AbsoluteFill>
  );
};

export const ZcashHack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      {/* per-slide audio sequenced */}
      {SLIDES.map((s, i) => (
        <Sequence key={`a${i}`} from={Math.round(OFFSETS[i] * fps)} durationInFrames={Math.round(s.dur * fps)}>
          <Audio src={staticFile(s.audio)} />
        </Sequence>
      ))}

      {/* ambient orbs */}
      <div style={{ position: 'absolute', width: 640, height: 640, borderRadius: '50%', filter: 'blur(130px)', background: C.purple, opacity: 0.06, top: -240, right: -180 }} />
      <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', filter: 'blur(130px)', background: C.cyan, opacity: 0.06, bottom: -180, left: -140 }} />

      {/* spotlight containers */}
      {FLAT.map((s, i) => {
        const f = 0.35;
        const opacity = interpolate(t, [s.abs, s.abs + f, s.out - f, s.out], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (opacity <= 0) return null;
        const scale = interpolate(t, [s.abs, s.abs + 0.6], [0.93, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={i} style={{ justifyContent: 'center', alignItems: 'center', padding: 100, opacity, transform: `scale(${scale})` }}>
            <SceneNode s={s} />
          </AbsoluteFill>
        );
      })}

      {/* slide-8 face cutaways overlay the containers at gaze moments */}
      {SLIDES.map((slide, si) => (slide.cutaways ?? []).map((c, ci) => {
        const durFrames = Math.round(c.dur * fps);
        const fromF = Math.round((OFFSETS[si] + c.t) * fps);
        return (
          <Sequence key={`cut${si}_${ci}`} from={fromF} durationInFrames={durFrames}>
            <FaceCutaway durFrames={durFrames} startFrames={Math.round(c.t * fps)} />
          </Sequence>
        );
      }))}
    </AbsoluteFill>
  );
};
