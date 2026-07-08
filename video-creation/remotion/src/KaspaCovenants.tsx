import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, random, useCurrentFrame, staticFile } from 'remotion';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { GlitchBlocks } from './transitions/engines/GlitchBlocks';

loadDMSans('normal', { weights: ['300', '400', '500', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600'], subsets: ['latin'] });
loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });

// ─────────────────────────────────────────────────────────────────────────────
// Kaspa Covenants — longform-edited gated-face spine (#6). Spine = master-faces desil.mp4
// (faces baked, black on covers). Containers SPOTLIGHT one sub-point at a time per CUE-SHEET.md.
// Timeline = final desilenced master (455.77s = 13673 fr). Faces (cover-clear zones) verified by luma scan.
// ─────────────────────────────────────────────────────────────────────────────
export const KC_FPS = 30;
export const KC_DURATION = 13673;

const C = {
  bg: '#0a0c10', card: '#12151c', card2: '#181c26', border: '#1e2330',
  green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', purple: '#a855f7', teal: '#49e0c8',
  tx: '#e8eaf0', tx2: '#8892a4', tx3: '#505a6e',
};
const SANS = "'DM Sans', sans-serif", MONO = "'JetBrains Mono', monospace", SERIF = "'Playfair Display', serif";
const asset = (f: string) => staticFile(f);
const useT = () => useCurrentFrame() / KC_FPS;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ── FACE windows (luma-verified) — drive the gated glitch transitions + intra-face zoom-punch (CLAUDE.md gate #3) ──
const FACES: Array<{ s: number; e: number; punch?: number }> = [
  { s: 0.0, e: 2.0 },
  { s: 20.75, e: 23.25, punch: 22.0 },   // EL/Sync3 artifact — punch masks it
  { s: 29.0, e: 30.5 },
  { s: 32.25, e: 36.0, punch: 34.2 },
  { s: 67.5, e: 69.25 },
  { s: 235.5, e: 240.0, punch: 237.5 },
  { s: 306.0, e: 310.25, punch: 308.0 },
  { s: 344.0, e: 349.0, punch: 346.0 },
  { s: 384.0, e: 387.5, punch: 386.0 },
  { s: 420.25, e: 425.0, punch: 422.2 },
  { s: 432.5, e: 436.5, punch: 434.5 },
];
const spineZoom = (t: number) => {
  for (const f of FACES) if (f.punch !== undefined && t >= f.punch && t <= f.e + 0.2)
    return interpolate(t, [f.punch, f.punch + 0.09], [1, 1.2], clamp); // hard ~20% punch-in
  return 1;
};
const Spine: React.FC = () => {
  const z = spineZoom(useT());
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <OffthreadVideo src={asset('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: '50% 40%' }} />
    </AbsoluteFill>
  );
};

// ── gated glitch — the REAL Glitch·Blocks library engine (GlitchBlocks), masks + offsets from library.json.
// Face cut-in = Blocks·Max; the zoom-punch is a CUT (normal face -> zoomed face) with Blocks·Short ON the cut.
const BLOCKS_MAX = { offsets: [{ dx: 0.15, dy: 0 }, { dx: 0.3188, dy: 0.3583 }, { dx: -0.2953, dy: 0.2259 }, { dx: 0.4443, dy: 0.663 }, { dx: 0.2828, dy: 0.4241 }, { dx: 0, dy: 0.4241 }], opacityPeak: 0.333, maskDir: 'transitions/lib/masks/blocks-max', maskCount: 30, scaleH: 150 as number | null, durSec: 0.96, sfx: 'transitions/lib/sfx-blocks-max.mp3' };
const BLOCKS_STRIPS = { offsets: [{ dx: 0.2828, dy: 0.4241 }, { dx: 0.5359, dy: 0.4241 }], opacityPeak: 0.333, maskDir: 'transitions/lib/masks/blocks-strips-3x', maskCount: 12, scaleH: null as number | null, durSec: 0.4, sfx: 'transitions/lib/sfx-blocks-min.mp3' };
const BlocksGlitch: React.FC<{ cut: number; kind: 'max' | 'short'; still: string; fromZoom: number; toZoom: number }> = ({ cut, kind, still, fromZoom, toZoom }) => {
  const params = kind === 'max' ? BLOCKS_MAX : BLOCKS_STRIPS;
  const dur = Math.round(params.durSec * KC_FPS);
  const fromF = Math.round(cut * KC_FPS - dur * params.opacityPeak); // align the engine's A->B cut (at opacityPeak) onto `cut`
  const node = (z: number) => <Img src={asset(still)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, transformOrigin: '50% 40%' }} />;
  return (
    <Sequence from={Math.max(0, fromF)} durationInFrames={dur} layout="none">
      <GlitchBlocks from={node(fromZoom)} to={node(toZoom)} fromSrc={still} toSrc={still} durationInFrames={dur} params={params as any} />
      <Audio src={asset(params.sfx)} volume={0.7} />
    </Sequence>
  );
};
const GLITCHES = FACES.flatMap((f, i) => {
  const stl = `face-still-${i}.png`;
  const a: Array<{ cut: number; kind: 'max' | 'short'; still: string; fromZoom: number; toZoom: number }> =
    [{ cut: f.s, kind: 'max', still: stl, fromZoom: 1, toZoom: 1 }];                                  // Blocks·Max on face cut-in
  if (f.punch !== undefined) a.push({ cut: f.punch, kind: 'short', still: stl, fromZoom: 1, toZoom: 1.2 }); // Blocks·Short on the zoom CUT
  return a;
});

// ── deck-scene helpers ──
const Orb: React.FC<{ color: string; size: number; pos: React.CSSProperties }> = ({ color, size, pos }) => (
  <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.4, width: size, height: size, background: color, ...pos }} />
);
const Scene: React.FC<{ tIn: number; tOut: number; children: React.ReactNode }> = ({ tIn, tOut, children }) => {
  const t = useT();
  const o = Math.min(interpolate(t, [tIn, tIn + 0.35], [0, 1], clamp), interpolate(t, [tOut - 0.35, tOut], [1, 0], clamp));
  if (o <= 0.001) return null;
  const sc = interpolate(t, [tIn, tIn + 0.35], [0.94, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: o, background: C.bg }}><div style={{ width: '100%', height: '100%', transform: `scale(${sc})` }}>{children}</div></AbsoluteFill>;
};
// content FILLS the frame (house rule #1 — enlarge to fill the content body, never small cards in a big box)
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', padding: '60px 88px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>{children}</div>
);
const Ey: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: SANS, fontSize: 25, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.tx3, fontWeight: 600, marginBottom: 14, position: 'relative', zIndex: 1 }}>{children}</span>
);
const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: C.tx, margin: 0, position: 'relative', zIndex: 1 }}>{children}</h2>
);
// spotlight wrapper: hidden(future) -> bright+scale(active) -> dimmed(past); layout reserved
const Reveal: React.FC<{ revealAt: number; activeUntil: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ revealAt, activeUntil, children, style }) => {
  const t = useT();
  const r = interpolate(t, [revealAt - 0.05, revealAt + 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const active = t >= revealAt && t < activeUntil;
  const sc = interpolate(t, [revealAt, revealAt + 0.4], [0.93, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ opacity: r * (active ? 1 : 0.4), transform: `scale(${active ? sc : 0.985})`, position: 'relative', zIndex: 1, ...style }}>{children}</div>;
};
const cardBox = (glow?: string): React.CSSProperties => ({ background: C.card, border: `1px solid ${glow || C.border}`, borderRadius: 22, padding: 52, minHeight: 360, position: 'relative', overflow: 'hidden', boxShadow: glow ? `0 0 60px ${glow}33` : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center' });
const tag = (bg: string, col: string): React.CSSProperties => ({ display: 'inline-block', padding: '8px 20px', borderRadius: 100, fontSize: 22, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20, background: bg, color: col, fontFamily: SANS, alignSelf: 'flex-start' });
const h3s = (col: string): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: col, margin: 0 });
const ps: React.CSSProperties = { fontFamily: SANS, fontSize: 31, lineHeight: 1.45, color: C.tx2, marginTop: 16 };

// ───────────────────────── CH1: C1 trade-off triangle ─────────────────────────
const NodeLabel: React.FC<{ x: number; y: number; text: string; litAt: number }> = ({ x, y, text, litAt }) => {
  const t = useT(); const lit = t >= litAt;
  const pulse = interpolate(t, [litAt, litAt + 0.18, litAt + 0.42], [1, 1.16, 1], clamp);
  return <div style={{ position: 'absolute', left: `${(x / 820) * 100}%`, top: `${(y / 600) * 100}%`, transform: `translate(-50%,-50%) scale(${lit ? pulse : 1})`, fontFamily: SANS, fontSize: 30, fontWeight: 700, color: C.tx, opacity: lit ? 1 : 0.4, whiteSpace: 'nowrap' }}>{text}</div>;
};
const C1: React.FC = () => (
  <Frame>
    <Orb color={C.green} size={560} pos={{ top: -140, left: -120 }} />
    <Ey>Why Kaspa exists</Ey>
    <H2>Everyone else gave <span style={{ color: C.red }}>one up</span>. Kaspa kept <span style={{ color: C.green }}>all three</span>.</H2>
    <div style={{ position: 'relative', width: 1080, height: 760, margin: '6px auto 0', zIndex: 1 }}>
      <svg width={1080} height={760} viewBox="0 0 820 600" style={{ position: 'absolute', inset: 0 }}>
        <polygon points="410,70 90,520 730,520" fill="none" stroke="#1e2330" strokeWidth={3} />
        <polygon points="410,150 200,470 620,470" fill="rgba(0,230,138,0.06)" stroke="rgba(0,230,138,0.5)" strokeWidth={2} />
        <circle cx={410} cy={70} r={13} fill="#00c2ff" /><circle cx={90} cy={520} r={13} fill="#00e68a" /><circle cx={730} cy={520} r={13} fill="#ffd700" />
      </svg>
      <NodeLabel x={410} y={36} text="Decentralization" litAt={16.3} />
      <NodeLabel x={90} y={566} text="Security" litAt={17.0} />
      <NodeLabel x={730} y={566} text="Speed" litAt={17.7} />
      <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: C.green }}>KASPA</div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: C.tx2, marginTop: 4 }}>all three, no trade</div>
      </div>
    </div>
  </Frame>
);

// ───────────────────────── CH2: C2a hardfork / C2b pillars ─────────────────────────
const C2a: React.FC = () => (
  <Frame>
    <Orb color={C.cyan} size={560} pos={{ top: -140, right: -120 }} />
    <Ey>Meet Toccata</Ey>
    <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, lineHeight: 1.04, letterSpacing: '-0.02em', color: C.tx, margin: 0, position: 'relative', zIndex: 1 }}>The <span style={{ color: C.green }}>Toccata</span> Hardfork</h1>
    <div style={{ width: 90, height: 4, borderRadius: 3, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, margin: '22px 0', position: 'relative', zIndex: 1 }} />
    <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.5, color: C.tx2, maxWidth: 1150, position: 'relative', zIndex: 1 }}>A coordinated, non-backward-compatible upgrade. The whole network moves together on one window, so there is no chain split.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginTop: 40 }}>
      <Reveal revealAt={37.9} activeUntil={40.9}><div style={cardBox(C.green)}><span style={tag('rgba(0,230,138,.15)', C.green)}>Step 1</span><h3 style={h3s(C.green)}>Coordinated upgrade</h3><p style={ps}>Everyone moves at once.</p></div></Reveal>
      <Reveal revealAt={40.9} activeUntil={44.8}><div style={cardBox(C.cyan)}><span style={tag('rgba(0,194,255,.15)', C.cyan)}>Step 2</span><h3 style={h3s(C.cyan)}>One activation window</h3><p style={ps}>June 2026.</p></div></Reveal>
      <Reveal revealAt={44.8} activeUntil={52.0}><div style={cardBox(C.gold)}><span style={tag('rgba(255,215,0,.15)', C.gold)}>Step 3</span><h3 style={h3s(C.gold)}>No chain split</h3><p style={ps}>One Kaspa, not two.</p></div></Reveal>
    </div>
  </Frame>
);
const C2b: React.FC = () => (
  <Frame>
    <Orb color={C.purple} size={560} pos={{ bottom: -160, left: -120 }} />
    <Ey>Meet Toccata</Ey>
    <H2>Three pillars, <span style={{ color: C.green }}>one keystone</span></H2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, marginTop: 36 }}>
      <Reveal revealAt={55.7} activeUntil={59.0}><div style={cardBox(C.cyan)}><span style={tag('rgba(0,194,255,.15)', C.cyan)}>Pillar</span><h3 style={h3s(C.cyan)}>Native Assets</h3><p style={ps}>Real tokens on the base layer.</p></div></Reveal>
      <Reveal revealAt={59.0} activeUntil={68.5}><div style={cardBox(C.green)}><span style={tag('rgba(0,230,138,.15)', C.green)}>Keystone</span><h3 style={h3s(C.green)}>Covenants</h3><p style={ps}>Coins that carry their own rules. The one that makes the other two possible.</p></div></Reveal>
      <Reveal revealAt={61.6} activeUntil={65.5}><div style={cardBox(C.gold)}><span style={tag('rgba(255,215,0,.15)', C.gold)}>Pillar</span><h3 style={h3s(C.gold)}>Zero-Knowledge</h3><p style={ps}>Prove it is true without revealing the data.</p></div></Reveal>
    </div>
    <div style={{ textAlign: 'center', fontSize: 38, color: C.green, marginTop: 12, position: 'relative', zIndex: 1 }}>↓</div>
    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}><span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 30, color: C.tx }}>a programmable <span style={{ color: C.green }}>Layer 1</span></span></div>
  </Frame>
);

// ───────────────────────── CH3: C3a compare / C3b rules ─────────────────────────
const C3a: React.FC = () => (
  <Frame>
    <Orb color={C.purple} size={520} pos={{ top: -140, right: -100 }} />
    <Ey>What is a covenant</Ey>
    <H2>A rule that <span style={{ color: C.purple }}>travels with the coin</span></H2>
    <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.5, color: C.tx2, maxWidth: 1320, marginTop: 18, position: 'relative', zIndex: 1 }}>A condition attached to a coin that restricts how it can be spent next. The word is borrowed from Bitcoin research; here it just means rules that travel with the coin, from sender to receiver.</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, marginTop: 28 }}>
      <Reveal revealAt={96.7} activeUntil={105.5}><div style={{ padding: 34, borderRadius: 20, background: 'rgba(80,90,110,.08)', border: `1px solid ${C.border}` }}><div style={{ fontSize: 17, letterSpacing: '.15em', textTransform: 'uppercase', color: C.tx3, marginBottom: 6, fontFamily: SANS }}>Today's UTXO</div><h3 style={h3s(C.tx)}>Normal Coins</h3><p style={{ ...ps, fontSize: 22 }}>Whoever holds the private key spends them however they want.</p><p style={{ fontStyle: 'italic', color: C.tx2, marginTop: 12, paddingLeft: 16, borderLeft: `3px solid ${C.tx3}`, fontSize: 21, fontFamily: SANS }}>Once signed, total freedom.</p></div></Reveal>
      <Reveal revealAt={105.5} activeUntil={114.6}><div style={{ padding: 34, borderRadius: 20, background: 'linear-gradient(135deg,rgba(0,230,138,.07),rgba(0,194,255,.05))', border: '1px solid rgba(0,230,138,.28)' }}><div style={{ fontSize: 17, letterSpacing: '.15em', textTransform: 'uppercase', color: C.green, marginBottom: 6, fontFamily: SANS }}>After Toccata</div><h3 style={h3s(C.tx)}>Covenant Coins</h3><p style={{ ...ps, fontSize: 22 }}>Coins arrive <b style={{ color: C.tx }}>pre-bundled with rules</b> and enforce the conditions themselves.</p><p style={{ fontStyle: 'italic', color: C.tx, marginTop: 12, paddingLeft: 16, borderLeft: `3px solid ${C.green}`, fontSize: 21, fontFamily: SANS }}>The coin polices itself.</p></div></Reveal>
    </div>
  </Frame>
);
const RULES = [
  { r: 115.0, u: 127.4, t: '→  "Can only be sent to address X, Y, or Z"', hot: false },
  { r: 127.4, u: 140.9, t: '→  "Cannot be spent until block N"', hot: false },
  { r: 140.9, u: 158.0, t: '→  "Requires a specific 2-of-3 signature"', hot: false },
  { r: 158.0, u: 174.3, t: '→  "10% must route to this other address"', hot: false },
  { r: 174.3, u: 205.4, t: '→  "Can only move into another covenant with the same rules"   ← this is how tokens work', hot: true },
];
const C3b: React.FC = () => (
  <Frame>
    <Orb color={C.green} size={520} pos={{ bottom: -150, left: -120 }} />
    <Ey>What a covenant can enforce</Ey>
    <H2>Rules baked <span style={{ color: C.green }}>into the coin</span></H2>
    <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {RULES.map((rl, i) => (
        <Reveal key={i} revealAt={rl.r} activeUntil={rl.u}>
          <div style={{ padding: '20px 24px', borderRadius: 12, background: rl.hot ? 'rgba(0,230,138,.07)' : 'rgba(255,255,255,.02)', borderLeft: `3px solid ${rl.hot ? C.green : C.cyan}`, fontFamily: MONO, fontSize: 25, color: C.tx, lineHeight: 1.4 }}>{rl.t}</div>
        </Reveal>
      ))}
    </div>
  </Frame>
);

// ───────────────────────── CH4: C4 native tokens ─────────────────────────
const C4: React.FC = () => (
  <Frame>
    <Orb color={C.cyan} size={560} pos={{ top: -150, left: -120 }} />
    <Ey>Native tokens</Ey>
    <H2>From <span style={{ color: C.red }}>duct tape</span> to <span style={{ color: C.green }}>first-class</span></H2>
    <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 34 }}>
      <Reveal revealAt={208.0} activeUntil={223.6} style={{ flex: 1 }}><div style={{ ...cardBox(), borderColor: 'rgba(255,64,96,.35)', textAlign: 'center' }}><span style={tag('rgba(255,64,96,.15)', C.red)}>Today</span><h3 style={h3s(C.tx)}>KRC-20 via Kasplex</h3><p style={ps}>Metadata coordinated off-chain. Indexers decide who owns what.</p></div></Reveal>
      <div style={{ fontSize: 46, color: C.tx3, position: 'relative', zIndex: 1 }}>→</div>
      <Reveal revealAt={223.6} activeUntil={252.9} style={{ flex: 1 }}><div style={{ ...cardBox(C.green), textAlign: 'center' }}><span style={tag('rgba(0,230,138,.15)', C.green)}>After Toccata</span><h3 style={h3s(C.tx)}>Native token in the node</h3><p style={ps}>A real on-chain object. Wallets read balances direct. No indexer.</p></div></Reveal>
    </div>
    <Reveal revealAt={240.2} activeUntil={252.9} style={{ marginTop: 28 }}><div style={{ background: 'linear-gradient(135deg,rgba(0,230,138,.08),rgba(0,194,255,.06))', border: '1px solid rgba(0,230,138,.22)', borderRadius: 16, padding: '26px 34px' }}><p style={{ ...ps, color: C.tx, marginTop: 0, fontSize: 25 }}>Native tokens are the floor everything stands on: DeFi, NFTs, lending, tokenized assets.</p></div></Reveal>
  </Frame>
);

// ── mid-roll plug (CryptoRich.vip screenshot, Ken-Burns, callouts) ──
const MidrollPlug: React.FC<{ tIn: number; tOut: number }> = ({ tIn, tOut }) => {
  const t = useT();
  const o = Math.min(interpolate(t, [tIn, tIn + 0.5], [0, 1], clamp), interpolate(t, [tOut - 0.5, tOut], [1, 0], clamp));
  if (o <= 0.001) return null;
  const z = interpolate(t, [tIn, tOut], [1.02, 1.12], clamp);
  const chip = interpolate(t, [tIn + 1.2, tIn + 1.8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, background: '#05070b' }}>
      <Img src={asset('img-cryptorich.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(1400px 800px at 50% 45%, transparent, rgba(5,7,11,0.55))' }} />
      <div style={{ position: 'absolute', left: 90, bottom: 96, opacity: chip, transform: `translateY(${(1 - chip) * 24}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.green }}>Code Monkey Mike · CryptoRich.vip</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.tx, marginTop: 8 }}>353x on the LAB token <span style={{ color: C.green }}>·</span> link in the description</div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── CH5: C5a 3 approaches / C5b matrix ─────────────────────────
const C5a: React.FC = () => (
  <Frame>
    <Orb color={C.gold} size={520} pos={{ top: -140, right: -110 }} />
    <Ey>How it competes</Ey>
    <H2>A computer on every node, or <span style={{ color: C.green }}>rules on the coin</span>?</H2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26, marginTop: 32 }}>
      <Reveal revealAt={295.7} activeUntil={310.0}><div style={{ ...cardBox(), borderColor: 'rgba(255,64,96,.3)' }}><span style={tag('rgba(255,64,96,.15)', C.red)}>Ethereum</span><h3 style={h3s(C.tx)}>A virtual machine</h3><p style={ps}>Every node boots a full EVM. Powerful, but heavy and a giant attack surface.</p></div></Reveal>
      <Reveal revealAt={310.3} activeUntil={325.5}><div style={cardBox(C.green)}><span style={tag('rgba(0,230,138,.15)', C.green)}>Kaspa</span><h3 style={{ ...h3s(C.tx), fontFamily: MONO, fontSize: 25 }}>SilverScript → opcodes</h3><p style={ps}>No VM. Compiles straight to native script. Lean, aligned with UTXO security.</p></div></Reveal>
      <Reveal revealAt={325.5} activeUntil={344.0}><div style={{ ...cardBox(), borderColor: 'rgba(255,215,0,.3)' }}><span style={tag('rgba(255,215,0,.15)', C.gold)}>Bitcoin</span><h3 style={h3s(C.tx)}>Still arguing</h3><p style={ps}>Debated covenants for years and still has not shipped them.</p></div></Reveal>
    </div>
  </Frame>
);
const C5b: React.FC = () => {
  const Cell: React.FC<{ v: boolean }> = ({ v }) => <div style={{ flex: 1, textAlign: 'center', fontSize: 32, fontWeight: 700, color: v ? C.green : C.red }}>{v ? '✓' : '✗'}</div>;
  const Row: React.FC<{ revealAt: number; name: string; col: string; pow: boolean; prog: boolean; ship: boolean; kas?: boolean }> = ({ revealAt, name, col, pow, prog, ship, kas }) => (
    <Reveal revealAt={revealAt} activeUntil={revealAt + 100}>
      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 14, padding: '20px 28px', background: kas ? 'rgba(0,230,138,.08)' : C.card, border: `1px solid ${kas ? 'rgba(0,230,138,.4)' : C.border}` }}>
        <div style={{ flex: 1.5, fontWeight: 700, fontSize: 30, color: col, fontFamily: SANS }}>{name}</div>
        <Cell v={pow} /><Cell v={prog} /><Cell v={ship} />
      </div>
    </Reveal>
  );
  const Lbl: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ flex: 1, textAlign: 'center', color: C.tx2, fontWeight: 600, fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: SANS }}>{children}</div>;
  return (
    <Frame>
      <Orb color={C.green} size={520} pos={{ bottom: -150, right: -120 }} />
      <Ey>How it competes</Ey>
      <H2>Kaspa is the one getting <span style={{ color: C.green }}>both</span></H2>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 28px', marginTop: 24, marginBottom: 8, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1.5 }} /><Lbl>Proof-of-Work</Lbl><Lbl>Programmability</Lbl><Lbl>Shipping now</Lbl>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', zIndex: 1 }}>
        <Row revealAt={349.5} name="Ethereum" col={C.cyan} pow={false} prog={true} ship={true} />
        <Row revealAt={351.5} name="Bitcoin" col={C.gold} pow={true} prog={false} ship={false} />
        <Row revealAt={353.8} name="Kaspa" col={C.green} pow={true} prog={true} ship={true} kas />
      </div>
    </Frame>
  );
};

// ───────────────────────── CH6: C6a ecosystem / C6b roadmap ─────────────────────────
const C6a: React.FC = () => (
  <Frame>
    <Orb color={C.purple} size={560} pos={{ top: -150, right: -120 }} />
    <Ey>What it unlocks</Ey>
    <H2>A foundation you can <span style={{ color: C.green }}>build on</span></H2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30, alignItems: 'center' }}>
      <Reveal revealAt={379.7} activeUntil={500} style={{ width: '100%' }}><div style={{ borderRadius: 16, padding: '24px 30px', textAlign: 'center', fontSize: 26, fontWeight: 600, fontFamily: SANS, background: 'rgba(0,194,255,.1)', border: '1px solid rgba(0,194,255,.4)', color: C.cyan }}>DeFi · NFTs · real apps</div></Reveal>
      <div style={{ fontSize: 34, color: C.green, position: 'relative', zIndex: 1 }}>↑</div>
      <Reveal revealAt={369.9} activeUntil={500} style={{ width: '100%' }}><div style={{ borderRadius: 16, padding: '24px 30px', textAlign: 'center', fontSize: 26, fontWeight: 600, fontFamily: SANS, background: 'rgba(168,85,247,.1)', border: '1px solid rgba(168,85,247,.4)', color: C.purple }}>native tokens · enforced royalties · vaults · escrow · multisig treasuries</div></Reveal>
      <div style={{ fontSize: 34, color: C.green, position: 'relative', zIndex: 1 }}>↑</div>
      <Reveal revealAt={361.5} activeUntil={500} style={{ width: '100%' }}><div style={{ borderRadius: 16, padding: '24px 30px', textAlign: 'center', fontSize: 27, fontWeight: 700, fontFamily: SANS, background: 'rgba(0,230,138,.12)', border: '1px solid rgba(0,230,138,.5)', color: C.green }}>COVENANTS  +  proof-of-work security</div></Reveal>
    </div>
  </Frame>
);
const C6b: React.FC = () => {
  const Stop: React.FC<{ on?: boolean; when: string; what: string }> = ({ on, when, what }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: on ? C.green : C.tx3, margin: '0 auto 20px', boxShadow: on ? '0 0 30px rgba(0,230,138,.8)' : 'none' }} />
      <div style={{ fontFamily: MONO, fontSize: 22, color: C.tx2 }}>{when}</div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, color: on ? C.green : C.tx, fontFamily: SANS }}>{what}</div>
    </div>
  );
  return (
    <Frame>
      <Orb color={C.green} size={520} pos={{ bottom: -150, left: -120 }} />
      <Ey>Momentum on a calendar</Ey>
      <H2>The base layer keeps getting <span style={{ color: C.green }}>more capable</span></H2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 50, position: 'relative', zIndex: 1 }}>
        <Stop on when="Now" what="Toccata" />
        <div style={{ height: 4, flex: 1, background: 'linear-gradient(90deg,#00e68a,#505a6e)' }} />
        <Stop when="Q3 2026" what="DAGKnight" />
        <div style={{ height: 4, flex: 1, background: C.border }} />
        <Stop when="2027" what="100 BPS" />
      </div>
    </Frame>
  );
};

// ───────────────────────── Close: C-close payoff + end card ─────────────────────────
const CClose: React.FC = () => (
  <Frame>
    <Orb color={C.teal} size={680} pos={{ bottom: -200, left: -150 }} />
    <Orb color={C.green} size={500} pos={{ top: -150, right: -120 }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative', zIndex: 1 }}>
      <div style={{ width: 270, height: 270, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%,#1b3a39,#0c1817)', border: `6px solid ${C.teal}`, boxShadow: '0 0 70px rgba(73,224,200,.55), inset 0 0 50px rgba(73,224,200,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 140, color: C.teal }}>K</div>
      <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: C.tx, margin: '40px 0 0', textAlign: 'center' }}><span style={{ color: C.tx2, fontWeight: 700 }}>Once</span> covenants are <span style={{ color: C.teal }}>live on Kaspa</span></h1>
      <p style={{ fontFamily: SANS, fontSize: 30, color: C.tx2, marginTop: 16 }}>The foundation is in the ground.</p>
    </div>
  </Frame>
);
const EndCard: React.FC<{ tIn: number }> = ({ tIn }) => {
  const t = useT();
  const o = interpolate(t, [tIn, tIn + 0.8], [0, 1], clamp);
  if (o <= 0.001) return null;
  const sc = interpolate(t, [tIn, tIn + 0.9], [0.85, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o, background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Orb color={C.teal} size={620} pos={{ top: -150, left: -120 }} />
      <Img src={asset('kaspa-logo.png')} style={{ width: 300, height: 300, mixBlendMode: 'screen', transform: `scale(${sc})`, zIndex: 1 }} />
      <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.tx, margin: 0, zIndex: 1 }}>Watch what gets built.</h2>
      <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: 25, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.teal, margin: 0, zIndex: 1 }}>Follow · Like · Subscribe</p>
    </AbsoluteFill>
  );
};

// ───────────────────────── scene table ─────────────────────────
type SceneDef = { tIn: number; tOut: number; node: React.ReactNode };
const SCENES: SceneDef[] = [
  { tIn: 2.0, tOut: 20.7, node: <C1 /> },
  { tIn: 35.95, tOut: 51.5, node: <C2a /> },
  { tIn: 51.5, tOut: 67.8, node: <C2b /> },
  { tIn: 71.0, tOut: 114.6, node: <C3a /> },
  { tIn: 114.8, tOut: 205.7, node: <C3b /> },
  { tIn: 205.8, tOut: 235.5, node: <C4 /> },     // before/after, up to ch4-face
  { tIn: 240.2, tOut: 252.9, node: <C4 /> },     // the "floor" beat after ch4-face (impact bar active)
  { tIn: 285.9, tOut: 306.0, node: <C5a /> },   // CH5 intro + Ethereum reveal; Kaspa/Bitcoin after ch5-face1
  { tIn: 310.25, tOut: 344.0, node: <C5a /> },  // continues across ch5-face1 (Kaspa + Bitcoin columns)
  { tIn: 348.9, tOut: 357.5, node: <C5b /> },
  { tIn: 357.9, tOut: 384.0, node: <C6a /> },   // base/middle/top before ch6-face1
  { tIn: 387.6, tOut: 407.5, node: <C6a /> },   // builders/users + ZK after the face
  { tIn: 407.5, tOut: 420.2, node: <C6b /> },
  { tIn: 436.6, tOut: 444.0, node: <CClose /> },
  { tIn: 444.0, tOut: 449.0, node: <CClose /> }, // vibe-cut hold "Once covenants are live"
];

// ───────────────────────── b-roll ─────────────────────────
type Slot = { kind: 'image' | 'video'; src: string; tIn: number; tOut: number };
const BROLL: Slot[] = [
  { kind: 'video', src: 'vid-tunnel.mp4', tIn: 5.4, tOut: 9.2 },
  { kind: 'image', src: 'img-best-money-vault.png', tIn: 23.0, tOut: 28.8 },  // overlaps face2 tail so no black gap
  { kind: 'video', src: 'vid-servers.mp4', tIn: 244.0, tOut: 248.0 },        // CH4 floor
  { kind: 'image', src: 'img-ethereum-overload.png', tIn: 300.5, tOut: 305.5 }, // C5a Ethereum
  { kind: 'video', src: 'vid-skyline.mp4', tIn: 424.85, tOut: 432.3 },        // CH6 epic horizon (overlaps face2 tail)
];
const VideoBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const o = Math.min(interpolate(t, [slot.tIn, slot.tIn + 0.45], [0, 1], clamp), interpolate(t, [slot.tOut - 0.45, slot.tOut], [1, 0], clamp));
  return <AbsoluteFill style={{ opacity: o, background: 'transparent' }}><OffthreadVideo src={asset(slot.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill>;
};
const ImageBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.55], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const pOut = interpolate(t, [slot.tOut - 0.5, slot.tOut], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sweep = pIn * 140 - 20;
  const mask = pIn >= 1 ? undefined : `linear-gradient(105deg, rgba(0,0,0,1) ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`;
  const w = 1 - pIn;
  return <AbsoluteFill style={{ opacity: 1 - pOut, background: 'transparent' }}><div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask }}><Img src={asset(slot.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + w * 0.08 + pOut * 0.07}) skewX(${w * -7 + pOut * 5}deg)`, filter: `blur(${(w * 12 + pOut * 10).toFixed(1)}px)` }} /></div></AbsoluteFill>;
};

// ───────────────────────── chapter cards (book flip) ─────────────────────────
const CHAPTERS: Array<{ at: number; hold: number; num: number; title: React.ReactNode }> = [
  { at: 30.5, hold: 1.4, num: 2, title: <>Meet <span style={{ color: C.green }}>Toccata</span></> },
  { at: 69.3, hold: 1.5, num: 3, title: <>What a <span style={{ color: C.green }}>covenant</span> is</> },
  { at: 205.8, hold: 1.6, num: 4, title: <>Native <span style={{ color: C.green }}>tokens</span></> },
  { at: 283.6, hold: 1.8, num: 5, title: <>Beating the <span style={{ color: C.green }}>alternatives</span></> },
  { at: 357.8, hold: 1.6, num: 6, title: <>What it <span style={{ color: C.green }}>unlocks</span></> },
];
const ChapterCard: React.FC<{ at: number; hold: number; num: number; title: React.ReactNode }> = ({ at, hold, num, title }) => {
  const t = useT();
  if (t < at - 0.1 || t > at + hold + 0.8) return null;
  const pIn = interpolate(t, [at, at + 0.55], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pOut = interpolate(t, [at + hold, at + hold + 0.55], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const rot = (1 - pIn) * -100 + pOut * 100;
  const o = Math.min(pIn * 1.6, 1) * (1 - pOut);
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <AbsoluteFill style={{ background: C.bg, transform: `rotateY(${rot}deg)`, transformOrigin: 'left center', opacity: o, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 130px' }}>
        <Orb color={C.green} size={620} pos={{ top: -160, right: -120 }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.tx3, margin: 0 }}>Chapter {num}</p>
          <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, lineHeight: 1.07, color: C.tx, margin: '16px 0 0' }}>{title}</h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── music (3 beds, breath at each change) ─────────────────────────
// VO -19.2 LUFS. Beds set ~22 dB under (Mike's -5 dB call on bed A): A 0.040, B 0.043, C 0.026.
const Music: React.FC = () => {
  const cFade = (t: number) => {
    const fin = interpolate(t, [283.6, 298.6], [0.00316, 0.026], clamp);            // 15s fade-in -50->~ -32 dB
    const duck = interpolate(t, [443.6, 444.0, 447.6, 448.2], [1, 0.18, 0.18, 1], clamp); // vibe-cut duck
    return fin * duck;
  };
  return (
    <>
      <Sequence durationInFrames={Math.round(205.6 * KC_FPS)} layout="none">
        {/* bed A is 178s but must hold to CH4 (205.6s) -> loop */}
        <Audio src={asset('music-a.mp3')} loop volume={(f) => 0.040 * Math.min(interpolate(f / KC_FPS, [0, 1], [0, 1], clamp), interpolate(f / KC_FPS, [203, 205.5], [1, 0], clamp))} />
      </Sequence>
      <Sequence from={Math.round(205.8 * KC_FPS)} durationInFrames={Math.round(78 * KC_FPS)} layout="none">
        <Audio src={asset('music-b.mp3')} loop volume={(f) => 0.043 * Math.min(interpolate(f / KC_FPS, [0, 1], [0, 1], clamp), interpolate(f / KC_FPS, [76, 78], [1, 0], clamp))} />
      </Sequence>
      {/* Bed C end-aligned: track 177.65s, plays 283.6->455.77 (172.2s) => startFrom 5.45s */}
      <Sequence from={Math.round(283.6 * KC_FPS)} layout="none">
        <Audio src={asset('music-c.mp3')} startFrom={Math.round(5.45 * KC_FPS)} volume={(f) => cFade(283.6 + f / KC_FPS)} />
      </Sequence>
    </>
  );
};

// ───────────────────────── root ─────────────────────────
export const KaspaCovenants: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Spine />
    {SCENES.map((s, i) => <Scene key={`s${i}`} tIn={s.tIn} tOut={s.tOut}>{s.node}</Scene>)}
    <MidrollPlug tIn={252.9} tOut={283.6} />
    {BROLL.map((s, i) => {
      const fromFrame = Math.round((s.tIn - 0.1) * KC_FPS);
      const t0 = fromFrame / KC_FPS;
      return <Sequence key={`b${i}`} from={fromFrame} durationInFrames={Math.round((s.tOut - s.tIn + 0.2) * KC_FPS)} layout="none">{s.kind === 'video' ? <VideoBroll slot={s} t0={t0} /> : <ImageBroll slot={s} t0={t0} />}</Sequence>;
    })}
    {CHAPTERS.map((c) => <ChapterCard key={`ch${c.num}`} {...c} />)}
    <EndCard tIn={449.2} />
    {GLITCHES.map((g, i) => <BlocksGlitch key={`g${i}`} {...g} />)}
    <Music />
  </AbsoluteFill>
);
