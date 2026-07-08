import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['600'], subsets: ['latin'] });

export const QE_FPS = 30;
export const QE_DURATION = 12270; // ~409s
// Only 0:31..5:30 is replaced by the animated presentation; the intro (0..31) and
// the recap/CTA tail (330..end) keep Mike's ORIGINAL footage.
const PRES_IN = 31;
const PRES_OUT = 330;
const END = PRES_OUT; // last scene's tOut

const C = {
  bgDeep: '#0a0c10', bgCard: '#12151c', border: '#1e2330',
  cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', green: '#00e68a',
  pri: '#e8eaf0', sec: '#8892a4', mut: '#505a6e',
};
const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";

// Face-glance cutaways (EDIT2 seconds). Clips were cut to start exactly at the glance.
const CUTAWAYS = [
  { src: 'face1.mp4', t: 131.0, dur: 0.9 },
  { src: 'face2.mp4', t: 141.8, dur: 0.7 },
  { src: 'face3.mp4', t: 283.0, dur: 0.9 },
];

type Card = { accent: string; eyebrow: string; title?: string; big?: string; desc: string };
type Scene =
  | { t: number; kind: 'hook'; lines: string[] }
  | { t: number; kind: 'title' }
  | { t: number; kind: 'intro'; text: string }
  | { t: number; kind: 'statement' }
  | { t: number; kind: 'body'; text: string }
  | { t: number; kind: 'heading'; eyebrow: string; title: string }
  | { t: number; kind: 'big' }
  | { t: number; kind: 'card'; card: Card }
  | { t: number; kind: 'cta' };

const SCENES: Scene[] = [
  { t: 31.0, kind: 'title' },
  { t: 33.5, kind: 'intro', text: "QE in 2008 wasn't a new invention. It was the final, most visible layer of a money creation system that had been quietly building for nearly four decades, long before anyone heard of Bitcoin." },
  { t: 44.4, kind: 'card', card: { accent: C.gold, eyebrow: 'Layer 1 — Fiat', big: '1971', desc: 'Nixon closes the gold window. The dollar becomes pure fiat. The hard constraint on money creation is gone forever.' } },
  { t: 54.1, kind: 'card', card: { accent: C.cyan, eyebrow: 'Layer 2 — Fractional Reserves', big: '1971–2008', desc: 'Banks hold only a fraction of deposits and lend out the rest, multiplying every Fed dollar into several more, quietly, for decades.' } },
  { t: 65.7, kind: 'card', card: { accent: C.red, eyebrow: 'Layers 3 & 4 — Proto-QE → QE', big: '2006–09', desc: "Bernanke's Fed begins silent balance sheet expansion in 2006. Crisis hits in 2008. The gloves come off. Bitcoin is born one year later." } },
  { t: 89.5, kind: 'heading', eyebrow: 'The Foundation', title: 'How the System Was Built' },
  { t: 93.0, kind: 'card', card: { accent: C.gold, eyebrow: 'Layer 01', title: 'Fiat Currency', big: '1971', desc: 'Nixon closes the gold window on August 15, 1971. Dollars are no longer redeemable for gold. For the first time in modern history, the government can expand the money supply without any hard physical constraint. The ceiling is gone.' } },
  { t: 113.0, kind: 'card', card: { accent: C.cyan, eyebrow: 'Layer 02', title: 'Fractional Reserve Banking', big: '1971 – 2008', desc: 'Banks are only required to hold a fraction of deposits in reserve, the rest gets lent out. Every dollar the Fed creates gets multiplied several times over. The primary engine of monetary expansion for three decades, running silently in the background.' } },
  { t: 138.5, kind: 'heading', eyebrow: 'Escalation', title: 'When Rate Cuts Stopped Working' },
  { t: 152.3, kind: 'card', card: { accent: C.purple, eyebrow: 'Layer 03', title: '"Proto-QE" Under Bernanke', big: '2006 – 2008', desc: "Starting in 2006, the Fed begins expanding its balance sheet through Treasury purchases faster than circulating currency growth, quietly building bank reserves. It isn't called QE. But the mechanics are already running before the crisis ever hits." } },
  { t: 170.5, kind: 'card', card: { accent: C.red, eyebrow: 'Layer 04', title: 'Full QE', big: '2008 →', desc: "The financial crisis hits. Interest rate cuts alone aren't enough. The Fed officially launches large-scale asset purchases, buying bonds directly to inject money into the system. What was quiet becomes massive, official, and impossible to ignore. Bitcoin is born one year later." } },
  { t: 195.0, kind: 'heading', eyebrow: 'The Blueprint', title: "Japan: The World's Guinea Pig" },
  { t: 200.4, kind: 'intro', text: 'While the US was still running conventional monetary policy, Japan had already spent a decade experimenting with the tools the Fed would later deploy in 2008. The term "quantitative easing" itself was born out of Japan\'s crisis, not America\'s.' },
  { t: 221.0, kind: 'card', card: { accent: C.green, eyebrow: '1991', title: "Japan's Asset Bubble Collapses", desc: 'Stocks and real estate crater. Banks are left holding mountains of bad debt. Deflation sets in and a decade of stagnation, the "Lost Decade," begins.' } },
  { t: 236.5, kind: 'card', card: { accent: C.cyan, eyebrow: '1995', title: 'Richard Werner Coins "Quantitative Easing"', desc: "Economist Werner publishes the term in Japan's Nikkei newspaper, proposing a new tool to revive Japan through expanded credit creation. The concept exists 14 years before Bitcoin." } },
  { t: 256.0, kind: 'card', card: { accent: C.gold, eyebrow: '1999', title: 'Bank of Japan Goes to Zero (ZIRP)', desc: 'Rates drop to zero. The BoJ begins buying short-term government bonds, the first step toward a full QE framework.' } },
  { t: 268.3, kind: 'card', card: { accent: C.purple, eyebrow: '2001 – 2006', title: "World's First Formal QE Program", desc: "The Bank of Japan shifts its operating target from interest rates to quantitative reserve levels. The world's first official QE program runs for five full years." } },
  { t: 285.0, kind: 'card', card: { accent: C.red, eyebrow: 'March 2006', title: 'Japan Ends QE', desc: "The program is wound down. Bitcoin's genesis block is still 3 years away." } },
  { t: 291.5, kind: 'big' },
  { t: 298.0, kind: 'statement' },
  { t: 305.0, kind: 'body', text: 'Fiat enabled it in 1971. Fractional reserves turbocharged it for decades. Japan proved QE was possible in 2001. Proto-QE previewed it in the US by 2006. And 2008 made it impossible to ignore. QE wasn\'t the beginning of the story, it was just the chapter where everyone finally started paying attention.' },
];

const Eyebrow: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 1.7 }) => (
  <p style={{ fontFamily: SANS, color, fontSize: `${size}rem`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{children}</p>
);

const BigCard: React.FC<{ card: Card }> = ({ card }) => (
  <div style={{ width: 1500, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 28, padding: '80px 90px', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.5)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${card.accent}, transparent)` }} />
    <Eyebrow color={card.accent}>{card.eyebrow}</Eyebrow>
    {card.title && <p style={{ fontFamily: SERIF, fontWeight: 700, color: C.pri, fontSize: '3.4rem', lineHeight: 1.15, marginTop: 18 }}>{card.title}</p>}
    {card.big && <p style={{ fontFamily: MONO, fontWeight: 600, color: card.accent, fontSize: card.title ? '2.6rem' : '7rem', lineHeight: 1, marginTop: card.title ? 12 : 24 }}>{card.big}</p>}
    <p style={{ fontFamily: SANS, color: C.sec, fontSize: '2.15rem', lineHeight: 1.55, marginTop: 26, maxWidth: 1250 }}>{card.desc}</p>
  </div>
);

const SceneNode: React.FC<{ s: Scene }> = ({ s }) => {
  switch (s.kind) {
    case 'hook':
      return (
        <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '7rem', lineHeight: 1.08, color: C.pri, textAlign: 'center' }}>
          {s.lines[0]}<br /><span style={{ color: C.gold }}>{s.lines[1]}</span>
        </h1>
      );
    case 'title':
      return (
        <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '6.5rem', lineHeight: 1.06, letterSpacing: '-0.02em', color: C.pri, textAlign: 'center', maxWidth: 1500 }}>
          The Money Printer<br />Has Been Running <span style={{ color: C.gold }}>Since 1971</span>
        </h1>
      );
    case 'intro':
      return <p style={{ fontFamily: SERIF, fontWeight: 400, fontSize: '3rem', lineHeight: 1.5, color: C.pri, textAlign: 'center', maxWidth: 1400 }}>{s.text}</p>;
    case 'statement':
      return (
        <p style={{ fontFamily: SERIF, fontWeight: 400, fontSize: '3.3rem', lineHeight: 1.45, color: C.pri, textAlign: 'center', maxWidth: 1400 }}>
          Bitcoin didn't respond to something new.<br /><span style={{ fontStyle: 'italic', color: C.gold }}>It responded to the endpoint of a 38-year trajectory.</span>
        </p>
      );
    case 'body':
      return <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: '2.3rem', lineHeight: 1.65, color: C.sec, textAlign: 'center', maxWidth: 1350 }}>{s.text}</p>;
    case 'heading':
      return (
        <div style={{ textAlign: 'center' }}>
          <Eyebrow color={C.mut} size={1.5}>{s.eyebrow}</Eyebrow>
          <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '5rem', lineHeight: 1.12, color: C.pri, marginTop: 18 }}>{s.title}</h2>
          <div style={{ width: 90, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, margin: '34px auto 0' }} />
        </div>
      );
    case 'big':
      return (
        <div style={{ textAlign: 'center' }}>
          <Eyebrow color={C.mut} size={1.4}>Years Before Bitcoin</Eyebrow>
          <p style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '12rem', lineHeight: 1, margin: '10px 0', background: `linear-gradient(135deg, ${C.gold}, ${C.red})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>38 Years</p>
          <Eyebrow color={C.mut} size={1.4}>of expanding money creation before the genesis block</Eyebrow>
        </div>
      );
    case 'card':
      return <BigCard card={s.card} />;
    case 'cta':
      return (
        <div style={{ textAlign: 'center', maxWidth: 1300 }}>
          <Eyebrow color={C.green} size={1.5}>If you found this useful</Eyebrow>
          <p style={{ fontFamily: SERIF, fontWeight: 900, fontSize: '8rem', lineHeight: 1, color: C.gold, margin: '14px 0 18px' }}>353X</p>
          <p style={{ fontFamily: SANS, fontSize: '2.3rem', lineHeight: 1.5, color: C.pri }}>My most recent call did <strong>353X</strong> on the lab token. Link in the description.</p>
        </div>
      );
  }
};

const FaceCutaway: React.FC<{ src: string; durFrames: number }> = ({ src, durFrames }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 3, durFrames - 3, durFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: op, background: C.bgDeep }}>
      {/* blurred zoomed vertical copy -> wings */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ position: 'absolute', width: 6355, height: 3575, left: -4435, top: -1744, filter: 'blur(55px) brightness(0.45)' }} />
      </AbsoluteFill>
      {/* sharp centered vertical strip */}
      <div style={{ position: 'absolute', left: 660, top: 0, width: 600, height: 1080, overflow: 'hidden', boxShadow: '0 0 90px rgba(0,0,0,0.7)' }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ position: 'absolute', width: 2658, height: 1495, left: -1957, top: -415 }} />
      </div>
    </AbsoluteFill>
  );
};

export const QeMoneyPrinter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      <Audio src={staticFile('qe-full.m4a')} />
      {/* ambient orbs */}
      <div style={{ position: 'absolute', width: 640, height: 640, borderRadius: '50%', filter: 'blur(130px)', background: C.gold, opacity: 0.07, top: -240, right: -180 }} />
      <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', filter: 'blur(130px)', background: C.red, opacity: 0.07, bottom: -180, left: -140 }} />

      {SCENES.map((s, i) => {
        const tOut = SCENES[i + 1]?.t ?? END;
        const f = 0.35;
        const opacity = interpolate(t, [s.t, s.t + f, tOut - f, tOut], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (opacity <= 0) return null;
        const scale = interpolate(t, [s.t, s.t + 0.6], [0.93, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={i} style={{ justifyContent: 'center', alignItems: 'center', padding: 90, opacity, transform: `scale(${scale})` }}>
            <SceneNode s={s} />
          </AbsoluteFill>
        );
      })}

      {/* original footage for the intro (0..31) and the recap/CTA tail (330..end) */}
      <Sequence from={0} durationInFrames={Math.round(PRES_IN * QE_FPS)}>
        <AbsoluteFill><OffthreadVideo src={staticFile('intro.mp4')} muted style={{ width: '100%', height: '100%' }} /></AbsoluteFill>
      </Sequence>
      <Sequence from={Math.round(PRES_OUT * QE_FPS)} durationInFrames={QE_DURATION - Math.round(PRES_OUT * QE_FPS)}>
        <AbsoluteFill><OffthreadVideo src={staticFile('outro.mp4')} muted style={{ width: '100%', height: '100%' }} /></AbsoluteFill>
      </Sequence>

      {/* face-glance cutaways overlay the deck during the genuine camera-looks */}
      {CUTAWAYS.map((c, i) => {
        const durFrames = Math.round(c.dur * fps);
        return (
          <Sequence key={`cut${i}`} from={Math.round(c.t * fps)} durationInFrames={durFrames}>
            <FaceCutaway src={c.src} durFrames={durFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
