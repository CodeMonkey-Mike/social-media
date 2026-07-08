import React from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, staticFile } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['400', '700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '500', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });

export const BOC_FPS = 30;
export const BOC_DURATION = 20433; // 681.1s EDIT4 spine

// The OBS scene's right strip (CTA graphic + webcam) lives at x >= 1488 in EDIT4.
// We keep that strip verbatim and rebuild everything left of it.
const STRIP_X = 1488;
const W = 1920;
const H = 1080;

const C = {
  bgDeep: '#0a0c10', bgCard: '#12151c', border: '#1e2330',
  cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', green: '#00e68a',
  pri: '#e8eaf0', sec: '#8892a4', mut: '#505a6e',
};
const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const asset = (f: string) => staticFile(`projects/banks-own-chain/${f}`);
const useT = () => useCurrentFrame() / BOC_FPS;

// ───────────────────────── spotlight atoms ─────────────────────────
// Spotlight rule (Mike, 2026-06-11, mirrors the approved QE presentation look):
// ONE container on screen at a time, enlarged to fill the CONTENT BODY width.
// Never multiple containers at once.

const SpotStat: React.FC<{ accent: string; tag: string; num?: string; desc: string }> = ({ accent, tag, num, desc }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 26, padding: '60px 70px 56px', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.45)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    <p style={{ fontFamily: SANS, fontSize: 27, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: accent, margin: '0 0 20px' }}>{tag}</p>
    {num ? <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: 108, lineHeight: 1, color: accent, margin: '0 0 26px' }}>{num}</p> : null}
    <p style={{ fontFamily: SANS, fontSize: 31, color: C.sec, lineHeight: 1.62, margin: 0 }}>{desc}</p>
  </div>
);

const SpotLayer: React.FC<{ accent: string; eyebrow: string; title: string; date?: string; desc: string }> = ({ accent, eyebrow, title, date, desc }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 28, padding: '64px 70px 58px', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,0.45)' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.18em', color: accent, margin: '0 0 22px' }}>{eyebrow}</p>
    <p style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: C.pri, lineHeight: 1.15, margin: '0 0 14px' }}>{title}</p>
    {date ? <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: 26, color: accent, margin: '0 0 28px' }}>{date}</p> : null}
    <p style={{ fontFamily: SANS, fontSize: 29, color: C.sec, lineHeight: 1.68, margin: 0 }}>{desc}</p>
  </div>
);

const SpotTl: React.FC<{ color: string; date: string; title: string; desc: string }> = ({ color, date, title, desc }) => (
  <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderLeft: `6px solid ${color}`, borderRadius: 24, padding: '56px 66px 52px', boxShadow: '0 24px 70px rgba(0,0,0,0.45)' }}>
    <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, textTransform: 'uppercase', letterSpacing: '0.14em', color, margin: '0 0 14px' }}>{date}</p>
    <p style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.pri, margin: '0 0 18px', lineHeight: 1.15 }}>{title}</p>
    <p style={{ fontFamily: SANS, fontSize: 29, color: C.sec, lineHeight: 1.65, margin: 0 }}>{desc}</p>
  </div>
);

const SpotImpact: React.FC<{ kind: 'red' | 'green'; strong: string; rest: string }> = ({ kind, strong, rest }) => (
  <div style={{
    background: kind === 'red' ? 'linear-gradient(135deg, rgba(255,64,96,0.10), rgba(255,215,0,0.06))' : 'linear-gradient(135deg, rgba(0,230,138,0.09), rgba(0,194,255,0.06))',
    border: kind === 'red' ? '1px solid rgba(255,64,96,0.25)' : '1px solid rgba(0,230,138,0.22)',
    borderRadius: 22, padding: '46px 56px', fontFamily: SANS, fontSize: 30, color: C.sec, lineHeight: 1.68,
  }}>
    <strong style={{ color: kind === 'red' ? C.red : C.green, fontWeight: 700 }}>{strong}</strong> {rest}
  </div>
);

const SpotTitle: React.FC<{ label: string; title: React.ReactNode; divFrom?: string; divTo?: string }> = ({ label, title, divFrom = C.red, divTo = C.gold }) => (
  <div>
    <p style={{ fontFamily: SANS, fontSize: 21, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.mut, margin: 0 }}>{label}</p>
    <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 66, lineHeight: 1.12, color: C.pri, margin: '18px 0 0', letterSpacing: '-0.01em' }}>{title}</h2>
    <div style={{ width: 90, height: 4, background: `linear-gradient(90deg, ${divFrom}, ${divTo})`, borderRadius: 2, marginTop: 28 }} />
  </div>
);

// ───────────────────────── scenes (one per spoken beat, cued to EDIT4 word-timings) ─────────────────────────

type Orb = { color: string; size: number; top?: number; bottom?: number; left?: number; right?: number; opacity: number };
type Scene = { t: number; chapter: number; flip?: boolean; node: React.ReactNode };

const CHAPTER_ORBS: Orb[][] = [
  [{ color: C.red, size: 560, top: -200, right: -160, opacity: 0.10 }, { color: C.gold, size: 380, bottom: -130, left: -80, opacity: 0.08 }],
  [{ color: C.red, size: 500, top: -160, left: -140, opacity: 0.09 }, { color: C.green, size: 360, bottom: -120, right: -80, opacity: 0.08 }],
  [{ color: C.cyan, size: 480, top: -140, right: -140, opacity: 0.09 }, { color: C.gold, size: 360, bottom: -110, left: -80, opacity: 0.08 }],
  [{ color: C.purple, size: 480, top: -140, left: -140, opacity: 0.09 }, { color: C.red, size: 340, bottom: -100, right: -80, opacity: 0.08 }],
  [{ color: C.purple, size: 520, top: -180, right: -160, opacity: 0.10 }, { color: C.red, size: 380, bottom: -130, left: -80, opacity: 0.09 }],
  [{ color: C.cyan, size: 500, top: -160, left: -140, opacity: 0.10 }, { color: C.purple, size: 360, bottom: -110, right: -80, opacity: 0.08 }],
  [{ color: C.red, size: 480, top: -140, right: -140, opacity: 0.09 }, { color: C.gold, size: 360, bottom: -110, left: -80, opacity: 0.08 }],
  [{ color: C.purple, size: 480, top: -150, left: -140, opacity: 0.09 }, { color: C.cyan, size: 340, bottom: -100, right: -80, opacity: 0.08 }],
  [{ color: C.green, size: 500, top: -160, right: -140, opacity: 0.10 }, { color: C.cyan, size: 360, bottom: -110, left: -80, opacity: 0.08 }],
  [{ color: C.green, size: 600, top: -220, right: -200, opacity: 0.09 }, { color: C.cyan, size: 420, bottom: -160, left: -100, opacity: 0.09 }],
];

const SCENES: Scene[] = [
  // ── CH 1: TITLE ──
  {
    t: 0, chapter: 0, flip: true,
    node: (
      <div>
        <p style={{ fontFamily: SANS, fontSize: 21, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.mut, margin: 0 }}>Crypto Policy / 2026</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 80, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.pri, margin: '22px 0 0' }}>
          The Banks&apos; Plan to <span style={{ color: C.red }}>Destroy XRP</span><br />
          and Crypto as a Whole <span style={{ color: C.gold }}>by 2027</span>
        </h1>
      </div>
    ),
  },
  {
    t: 11.3, chapter: 0,
    node: (
      <p style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 400, color: C.pri, lineHeight: 1.55, margin: 0 }}>
        While everyone watches the price bleed, the biggest banks in America quietly told you their plan. <span style={{ color: C.gold }}>This is not a prediction anymore. It is a press release.</span>
      </p>
    ),
  },
  { t: 42.9, chapter: 0, node: <SpotStat accent={C.gold} tag="The Bank Chain" num="2027" desc="JP Morgan, Citi and Bank of America are building their own shared tokenized deposit network, run by The Clearing House." /> },
  { t: 55.0, chapter: 0, node: <SpotStat accent={C.cyan} tag="SWIFT's Pick" num="Linea" desc="SWIFT chose a Consensys Ethereum layer 2 over the XRP Ledger and over Hedera. Token-agnostic. No bridge asset required." /> },
  { t: 93.1, chapter: 0, node: <SpotStat accent={C.red} tag="The Casualty" num="XRP" desc={'If banks run their own rails and SWIFT skips XRPL, the "banks will need XRP" moonshot loses its buyer.'} /> },

  // ── CH 2: PRICE VS POLICY ──
  { t: 108.5, chapter: 1, flip: true, node: <SpotTitle label="The Distraction" title={<>Everyone&apos;s Watching Price.<br />Nobody&apos;s Watching Policy.</>} /> },
  { t: 113.5, chapter: 1, node: <SpotLayer accent={C.red} eyebrow="What everyone sees" title="The Price Panic" desc="Bitcoin sliding toward sixty thousand. Calls for fifty. People screaming about a seventy to eighty percent drawdown like 2023. The whole timeline is staring at the candle." /> },
  { t: 149.6, chapter: 1, node: <SpotLayer accent={C.green} eyebrow="What actually matters" title="The Policy Story" desc="Two headlines dropped this week that decide how you are allowed to use crypto for years: the banks building their own chain, and SWIFT picking its chain. Infrastructure and policy, not the candle." /> },

  // ── CH 3: THE BANK CHAIN ──
  { t: 178.9, chapter: 2, flip: true, node: <SpotTitle label="The Move" title="The Banks Are Building Their Own Chain" /> },
  { t: 182.5, chapter: 2, node: <SpotLayer accent={C.cyan} eyebrow="The Network" title="Shared Tokenized Deposits" date="Target: H1 2027" desc="JP Morgan, Citi and Bank of America, plus The Clearing House, which the banks own. It tokenizes your deposit, moves it 24/7 with instant settlement, and keeps the money inside the regulated banking system. A direct answer to stablecoins." /> },
  { t: 202.6, chapter: 2, node: <SpotLayer accent={C.gold} eyebrow="Already Live" title="The Pieces Exist" date="2025 → 2026" desc="JPM Coin (JPMD) is already live on Base and expanding to Canton. Citi Token Services is already clearing US dollars around the clock for cross-border payments. This is not theoretical. The rails are being laid right now." /> },

  // ── CH 4: WHY NOT A PUBLIC CRYPTO ──
  { t: 225.5, chapter: 3, flip: true, node: <SpotTitle label="The Motive" title="Why They Would Never Use a Public Crypto" /> },
  { t: 228.5, chapter: 3, node: <SpotStat accent={C.gold} tag="Your Money, Their Profit" desc="You deposit it. They take it, loan it out, and keep the spread. Making money off your money is the entire business model." /> },
  { t: 238.4, chapter: 3, node: <SpotStat accent={C.red} tag="Yield Kills the Spread" desc="Paying you yield on stablecoins eats that margin. So they fight CLARITY, and they fight yield, to protect the bottom line." /> },
  { t: 247.4, chapter: 3, node: <SpotStat accent={C.cyan} tag="Control Is the Point" desc="They will never settle on a chain they do not own. And spinning up your own chain is trivial now. So why rent neutral rails when you can just issue your own token?" /> },

  // ── CH 5: THE XRP PROBLEM ──
  { t: 258.9, chapter: 4, flip: true, node: <SpotTitle label="The Centerpiece" title="The XRP Thesis Just Lost Its Buyer" /> },
  { t: 262.7, chapter: 4, node: <SpotLayer accent={C.purple} eyebrow="The Thesis — Then" title="Banks Need a Neutral Bridge" desc="Banks replace SWIFT's slow nostro and vostro system with XRP as a neutral bridge asset for instant cross-border settlement. The entire case assumed banks need a third-party token to move value between each other." /> },
  { t: 279.0, chapter: 4, node: <SpotLayer accent={C.red} eyebrow="What Broke It — Now" title="They Built Their Own" desc="Tokenized deposits settle bank-to-bank inside a network the banks already control. No bridge. No counterparty token. No XRP. The assumption the whole thesis rested on just stopped being true." /> },

  // ── CH 6: SWIFT CHOSE LINEA ──
  { t: 294.1, chapter: 5, flip: true, node: <SpotTitle label="The Knockout" title="SWIFT Chose Linea. Not XRP." /> },
  // (no scene at 297.7: the receipt screenshots own that whole window, and the scene layer
  //  fades out for overlays — see OCCLUSIONS)
  { t: 310.4, chapter: 5, node: <SpotTl color={C.cyan} date="The Pick" title="Linea, an Ethereum L2" desc="A Consensys zk-EVM layer 2, chosen ahead of the XRP Ledger and Hedera for the shared-ledger pilot." /> },
  { t: 322.6, chapter: 5, node: <SpotTl color={C.gold} date="The Consortium" title="30+ Global Banks" desc="JP Morgan, HSBC, Deutsche Bank, Citi, BNP Paribas, BNY Mellon and more, designing it together." /> },
  { t: 334.7, chapter: 5, node: <SpotTl color={C.purple} date="Token-Agnostic" title="No Settlement Coin" desc={'Settles tokenized deposits, stablecoins, or CBDCs with no SWIFT coin and no native bridge token. That is the "we do not need XRP" statement, in writing.'} /> },
  { t: 352.2, chapter: 5, node: <SpotTl color={C.green} date="Live This Year" title="Past the Pilot" desc="Design phase complete. The MVP is going live with real-world transactions, not a someday whitepaper." /> },
  { t: 363.8, chapter: 5, node: <SpotImpact kind="green" strong="The flip side, and my read:" rest="if the banks and SWIFT are backing Linea over XRP, the Linea token itself just got a lot more interesting. That is exactly why Linea is on my favorites list. More on what to actually do with that at the end." /> },

  // ── CH 7: THE SOFT BAN ──
  { t: 412.8, chapter: 6, flip: true, node: <SpotTitle label="The Squeeze" title="They Don't Ban Crypto. They Soft-Ban It." /> },
  { t: 417.5, chapter: 6, node: <SpotStat accent={C.red} tag="Taxes" desc="House Ways and Means is circulating digital-asset tax drafts covering stablecoins, staking, mining, lending, wash sales and reporting, with a House hearing on crypto taxation coming up. Written to benefit the banks, not you." /> },
  { t: 435.1, chapter: 6, node: <SpotStat accent={C.gold} tag="Regulation" desc="CLARITY shaped around the banks' bottom line. Jamie Dimon is already out loud, slamming Brian Armstrong and the bill itself." /> },
  { t: 444.1, chapter: 6, node: <SpotStat accent={C.cyan} tag="Geoblocking" desc="Hype, a supposedly decentralized DEX, is already geoblocked in America. Borders quietly drawn around the apps you can even open." /> },
  { t: 453.7, chapter: 6, node: <SpotImpact kind="red" strong="The pattern:" rest="absorb crypto, clone the useful parts, and strip out everything that gave retail an edge. No yield on stablecoins. No open DeFi. Just barriers to entry." /> },

  // ── CH 8: THE L1 FALLOUT ──
  { t: 467.4, chapter: 7, flip: true, node: <SpotTitle label="The Fallout" title="Who Survives an Absorb-and-Clone World" /> },
  { t: 471.0, chapter: 7, node: <SpotStat accent={C.cyan} tag="XRP" num="Survives" desc='Held up by institutional embedding and RLUSD. But the moonshot "banks settle on XRP" narrative takes the hit.' /> },
  { t: 495.7, chapter: 7, node: <SpotStat accent={C.purple} tag="Ethereum" num="Covered" desc="BlackRock ETFs for cover, plus it is literally the base layer SWIFT chose. Linea is an Ethereum L2." /> },
  { t: 507.3, chapter: 7, node: <SpotStat accent={C.red} tag="Solana + the Rest" num="Exposed" desc="Fewer institutional handholds. The most to lose when the banks decide to build instead of buy." /> },

  // ── CH 9: YOUR MOVE ──
  { t: 542.7, chapter: 8, flip: true, node: <SpotTitle label="Your Move" title="So What Do You Actually Do About It?" divFrom={C.green} divTo={C.cyan} /> },
  { t: 545.2, chapter: 8, node: <SpotStat accent={C.green} tag="Hold the Keys" num="Self-Custody" desc="They can soft-ban an exchange and geoblock an app. They cannot ban the coins sitting in your own wallet. Not your keys is the one thing they are counting on." /> },
  { t: 559.5, chapter: 8, node: <SpotStat accent={C.cyan} tag="Own What They Can't Clone" num="Decentralization" desc="Banks can copy tokenization all day. They cannot copy censorship-resistant, permissionless money. The harder a chain is to control, the more it is worth in exactly this world." /> },
  { t: 581.7, chapter: 8, node: <SpotStat accent={C.gold} tag="Front-Run the Inflow" num="Position Early" desc="They just told you where the institutional money has to go. Linea is on my list for exactly this reason: the banks are backing it over XRP. A smart play is owning the Linea token alongside your XRP, not instead of it." /> },

  // ── CH 10: CLOSING ──
  {
    t: 606.8, chapter: 9, flip: true,
    node: (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: C.mut, margin: '0 0 24px' }}>When the Biggest Banks Copy Your Tech</p>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 170, lineHeight: 1, background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 18 }}>That&apos;s a Win</div>
        <p style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: C.mut, margin: 0 }}>validation, not a funeral</p>
      </div>
    ),
  },
  {
    t: 614.2, chapter: 9,
    node: (
      <p style={{ fontFamily: SERIF, fontSize: 50, fontWeight: 400, color: C.pri, lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
        Watch <em style={{ color: C.gold }}>policy</em>, not just price.<br />
        Then position like you already know who wins.
      </p>
    ),
  },
  {
    t: 619.3, chapter: 9,
    node: (
      <p style={{ fontFamily: SANS, fontSize: 29, color: C.sec, lineHeight: 1.78, margin: 0, textAlign: 'center' }}>
        Yes, the banks are building walls. But they are building them out of the exact technology we have been early to for years. They are validating tokenization, onchain settlement, and stablecoins by racing to control them. Your edge is the part they can never absorb: <span style={{ color: C.pri }}>self-custody, permissionless access, and real decentralization.</span> Hold your own keys, own what cannot be cloned, position ahead of the institutional inflow, and use your voice on policy. The banks are playing defense. That should tell you exactly who is actually winning.
      </p>
    ),
  },
];

// ───────────────────────── content body (spotlight engine) ─────────────────────────

const SceneFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ padding: '0 84px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
    <div style={{ width: '100%' }}>{children}</div>
  </AbsoluteFill>
);

// HOUSE RULE (Mike, 2026-06-11): presentation content always transitions OUT before any
// b-roll / receipt / lip-sync overlay appears, and back IN after it clears. Never show the
// scene and an overlay at the same time. OCCLUSIONS (defined below, after the overlay
// tables) is the merged list of overlay windows; the scene layer fades 0.35s around them.
const sceneVisibility = (t: number): number => {
  let occluded = 0;
  for (const [a, b] of OCCLUSIONS) {
    const rampIn = interpolate(t, [a - 0.35, a], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const rampOut = interpolate(t, [b, b + 0.35], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    occluded = Math.max(occluded, Math.min(rampIn, rampOut));
  }
  return 1 - occluded;
};

const ContentBody: React.FC = () => {
  const t = useT();
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) if (t >= SCENES[i].t) idx = i;
  const cur = SCENES[idx];
  const prev = idx > 0 ? SCENES[idx - 1] : null;
  const orbs = CHAPTER_ORBS[cur.chapter];
  const vis = sceneVisibility(t);

  const dur = cur.flip ? 0.65 : 0.35;
  const p = interpolate(t, [cur.t, cur.t + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });

  const curStyle: React.CSSProperties = cur.flip
    ? {
        transform: `perspective(1600px) rotateY(${(1 - p) * -78}deg)`,
        transformOrigin: 'left center',
        opacity: Math.min(1, p * 2.2),
      }
    : {
        transform: `scale(${0.93 + p * 0.07})`,
        opacity: p,
      };

  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: STRIP_X, height: H, background: C.bgDeep, overflow: 'hidden' }}>
      {orbs.map((o, i) => (
        <div key={`${cur.chapter}-${i}`} style={{
          position: 'absolute', width: o.size, height: o.size, borderRadius: '50%', filter: 'blur(110px)',
          background: o.color, opacity: o.opacity,
          top: o.top, bottom: o.bottom, left: o.left, right: o.right,
        }} />
      ))}
      {/* scene layer: hidden entirely while an overlay owns the content body */}
      {vis > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: vis }}>
          {/* outgoing scene cross-fades away under the incoming one (skip across a page flip) */}
          {prev && !cur.flip && p < 1 ? (
            <SceneFrame style={{ opacity: 1 - p }}>{prev.node}</SceneFrame>
          ) : null}
          <SceneFrame style={curStyle}>{cur.node}</SceneFrame>
        </div>
      ) : null}
    </div>
  );
};

// ───────────────────────── right strip (CTA + webcam from EDIT4) ─────────────────────────

// The CTA graphic's black box overhangs the deck area (x 1457..1488, y 84..328 in EDIT4),
// so the crop is the right strip PLUS a notch for that box — otherwise the "P" and "M"
// of "Premium Membership" get clipped.
const STRIP_CLIP = `polygon(${STRIP_X}px 0px, ${W}px 0px, ${W}px ${H}px, ${STRIP_X}px ${H}px, ${STRIP_X}px 332px, 1454px 332px, 1454px 80px, ${STRIP_X}px 80px)`;

const SpineStrip: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <OffthreadVideo src={asset('edit4.mp4')} style={{ position: 'absolute', width: W, height: H, left: 0, top: 0, clipPath: STRIP_CLIP }} />
  </AbsoluteFill>
);

// ───────────────────────── receipts (pop-in cutaways over the content body) ─────────────────────────

const Receipt: React.FC<{ src: string; tIn: number; tOut: number }> = ({ src, tIn, tOut }) => {
  const t = useT();
  if (t < tIn || t > tOut + 0.1) return null;
  const pIn = interpolate(t, [tIn, tIn + 0.4], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6)),
  });
  const o = Math.min(
    interpolate(t, [tIn, tIn + 0.25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [tOut - 0.25, tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, width: STRIP_X, height: H,
      display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o,
    }}>
      <Img src={asset(src)} style={{
        width: 1240, borderRadius: 14, border: `1px solid ${C.border}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
        transform: `scale(${0.82 + pIn * 0.18})`,
      }} />
    </div>
  );
};

// ───────────────────────── full-screen b-roll ─────────────────────────

type Slot = { kind: 'video' | 'image'; src: string; tIn: number; tOut: number };

const BROLL: Slot[] = [
  { kind: 'video', src: 'v1.mp4', tIn: 6.0, tOut: 10.0 },     // market crash
  { kind: 'image', src: 'i1.png', tIn: 22.0, tOut: 26.0 },    // private rails
  { kind: 'video', src: 'v2.mp4', tIn: 47.0, tOut: 51.0 },    // bank vault
  { kind: 'image', src: 'i2.png', tIn: 185.0, tOut: 189.0 },  // banks chain ring
  { kind: 'video', src: 'v3.mp4', tIn: 230.3, tOut: 234.3 },  // money counter
  { kind: 'image', src: 'i3.png', tIn: 267.0, tOut: 271.0 },  // xrp bridge thesis
  { kind: 'image', src: 'i4.png', tIn: 287.4, tOut: 290.4 },  // bridge shattered
  { kind: 'video', src: 'v4.mp4', tIn: 420.0, tOut: 424.0 },  // capitol
  { kind: 'image', src: 'i5.png', tIn: 455.0, tOut: 459.0 },  // clone factory
  { kind: 'video', src: 'v5.mp4', tIn: 546.0, tOut: 550.0 },  // cold wallet
];

const RECEIPTS = [
  { src: 'receipt1.png', tIn: 30.9, tOut: 35.2 },
  { src: 'receipt2.png', tIn: 297.7, tOut: 303.4 },
  { src: 'receipt3.png', tIn: 303.5, tOut: 310.4 },
];

const LIPSYNC_IN = 234.45;
const LIPSYNC_DUR = 3.88;
const LIPSYNC_OUT = LIPSYNC_IN + LIPSYNC_DUR;

// Merged overlay windows (b-roll + receipts + lip-sync); windows closer than 0.6s are fused
// so the scene layer doesn't flicker back between back-to-back overlays.
const OCCLUSIONS: Array<[number, number]> = (() => {
  const raw: Array<[number, number]> = [
    ...BROLL.map((s) => [s.tIn, s.tOut] as [number, number]),
    ...RECEIPTS.map((r) => [r.tIn, r.tOut] as [number, number]),
    [LIPSYNC_IN, LIPSYNC_OUT] as [number, number],
  ].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const w of raw) {
    const last = merged[merged.length - 1];
    if (last && w[0] - last[1] < 0.6) last[1] = Math.max(last[1], w[1]);
    else merged.push([w[0], w[1]]);
  }
  return merged;
})();

// Video b-roll: dissolve in/out. t0 = absolute time of the parent Sequence start,
// because useCurrentFrame() is sequence-relative inside a <Sequence>.
const VideoBrollLayer: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const o = Math.min(
    interpolate(t, [slot.tIn, slot.tIn + 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [slot.tOut - 0.5, slot.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <AbsoluteFill style={{ opacity: o, background: '#000' }}>
      <OffthreadVideo src={asset(slot.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

// Image b-roll: cross-warp in/out (directional gradient sweep + skew/blur settle).
const ImageBrollLayer: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const pOut = interpolate(t, [slot.tOut - 0.5, slot.tOut], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const sweep = pIn * 140 - 20; // -20 → 120 (% across the frame)
  const mask = pIn >= 1
    ? undefined
    : `linear-gradient(105deg, rgba(0,0,0,1) ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`;
  const warpIn = 1 - pIn;
  const style: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover',
    transform: `scale(${1 + warpIn * 0.08 + pOut * 0.07}) skewX(${warpIn * -7 + pOut * 5}deg)`,
    filter: `blur(${(warpIn * 12 + pOut * 10).toFixed(1)}px)`,
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - pOut, background: 'transparent' }}>
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={asset(slot.src)} style={style} />
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── lip-sync insert (film burn in/out, blurred wings) ─────────────────────────
// (LIPSYNC_IN/_DUR/_OUT are defined with the overlay tables above.)

const LipsyncInsert: React.FC = () => {
  // Wings: blurred, dimmed copy of the same clip filling the frame; sharp portrait copy centered.
  const wingW = 1920;
  const wingH = (628 / 480) * 1920; // 2512
  const cenH = H;
  const cenW = (480 / 628) * H; // ~826
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <OffthreadVideo src={asset('lipsync.mp4')} muted style={{
        position: 'absolute', width: wingW, height: wingH, left: 0, top: (H - wingH) / 2,
        filter: 'blur(48px) brightness(0.45)',
      }} />
      <OffthreadVideo src={asset('lipsync.mp4')} muted style={{
        position: 'absolute', width: cenW, height: cenH, left: (W - cenW) / 2, top: 0,
      }} />
    </AbsoluteFill>
  );
};

// Film burn: warm flash that peaks exactly on the cut.
const FilmBurn: React.FC<{ at: number }> = ({ at }) => {
  const t = useT();
  const p = interpolate(t, [at - 0.38, at, at + 0.38], [0, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  if (p <= 0.01) return null;
  const core = Math.max(0, (p - 0.55) / 0.45); // white core only near the peak
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: p, mixBlendMode: 'screen',
        background: 'radial-gradient(120% 90% at 85% 30%, rgba(255,106,0,0.95), rgba(255,64,0,0.45) 45%, rgba(120,20,0,0) 75%), radial-gradient(90% 110% at 15% 75%, rgba(255,170,60,0.8), rgba(255,90,0,0.3) 50%, rgba(0,0,0,0) 78%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, opacity: core, background: '#fff8ee' }} />
    </AbsoluteFill>
  );
};

// ───────────────────────── root ─────────────────────────

export const BanksOwnChain: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      <ContentBody />
      <SpineStrip />

      {/* receipts (article screenshots, pop-in over the content body) */}
      {RECEIPTS.map((r) => (
        <Receipt key={r.src} src={r.src} tIn={r.tIn} tOut={r.tOut} />
      ))}

      {/* full-screen b-roll */}
      {BROLL.map((s) => {
        const fromFrame = Math.round((s.tIn - 0.1) * BOC_FPS);
        const t0 = fromFrame / BOC_FPS;
        return (
          <Sequence key={s.src} from={fromFrame} durationInFrames={Math.round((s.tOut - s.tIn + 0.2) * BOC_FPS)} layout="none">
            <AbsoluteFill>
              {s.kind === 'video' ? <VideoBrollLayer slot={s} t0={t0} /> : <ImageBrollLayer slot={s} t0={t0} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* lip-sync insert */}
      <Sequence from={Math.round(LIPSYNC_IN * BOC_FPS)} durationInFrames={Math.round(LIPSYNC_DUR * BOC_FPS)} layout="none">
        <LipsyncInsert />
      </Sequence>
      <FilmBurn at={LIPSYNC_IN} />
      <FilmBurn at={LIPSYNC_OUT} />
    </AbsoluteFill>
  );
};
