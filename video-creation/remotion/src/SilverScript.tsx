import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, staticFile } from 'remotion';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadDMSans('normal', { weights: ['400', '500', '700', '800'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

// ── FULL video: intro + CH1-CH8 + mid-roll + close (timeline = DESILENCED master spine.mp4, 250/500) ──
// Back-half beat times (CH4 on) were read from a whisper transcript of spine.mp4 (shares this timeline).
export const SS_FPS = 30;
export const SS_DURATION = 12829; // 427.62s (full spine)
const W = 1920, H = 1080;

const C = {
  navy: '#0a1626', navy2: '#0e1d33', card: '#10243c', edge: '#1d3a5c',
  teal: '#70C7BA', tealBright: '#49EACB', ink: '#eaf6f4', muted: '#9fc4bd',
};
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const asset = (f: string) => staticFile(`projects/silverscript/${f}`);
const useT = () => useCurrentFrame() / SS_FPS;

const IMG = { machineCode: 'broll-c2a8f637-machine-code-only.png', blockdag: 'broll-d9b1e548-kaspa-blockdag-abstract.png', utxo: 'broll-b7e4d115-utxo-coins-vs-account.png' };

// FACE spans = the only windows where Mike's face is shown (to-camera beats). Everywhere else the
// face is BLACKED OUT (audio keeps playing) so a [COVER] beat never flashes him reading his screen.
const FACE_SPANS: Array<[number, number]> = [
  [0.0, 8.0],      // L1 hook
  [36.4, 45.3],    // L5 "programmable chain" + hardfork
  [47.7, 49.9],    // CH1 B1 "Everyone agrees Kaspa's fast, right?"
  [54.3, 60.18],   // CH1 B1 "But the standing knock... where are the smart contracts?"
  [82.3, 88.72],   // CH2 opener "first high-level language + compiler, Ori Newman"
  [158.4, 161.04], // CH3 opener "compiles directly to native Kaspa script"
  // ── CH4 ──
  [186.2, 191.3],  // CH4 opener "the foundation, built on script-engine features, TN12"
  [229.8, 240.5],  // CH4 covenant declaration macro -> "security by construction"
  // ── CH5 ──
  [240.5, 250.2],  // CH5 opener "native assets and what it means for KRC-20"
  [286.0, 299.4],  // CH5 holders reassurance "no migration, no swap, no action"
  // ── MID-ROLL community plug (face the whole time, no cutaways) ──
  [309.4, 337.2],  // "if you like this content... join my community... click the link"
  // ── CH6 ──
  [350.8, 358.6],  // CH6 honest status "experimental, TN12 only, syntax may evolve" (ends BEFORE "is a foundation")
  // ── CH7 ──
  [376.2, 381.6],  // CH7 opener "the ecosystem isn't waiting, projects already building DeFi"
  // ── CH8 close (the close earns the face; b-roll only on two beats) ──
  [387.3, 393.0],  // "the real point... skeptics swore it'd never be built"
  [398.6, 403.4],  // "tooling maturing while price + noise distract everyone"
  [408.6, 427.6],  // CTA: comment, like, subscribe, share -> sign-off
];
const faceVisible = (t: number): number => {
  let v = 0;
  for (const [a, b] of FACE_SPANS) {
    const o = Math.min(
      interpolate(t, [a - 0.12, a], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      interpolate(t, [b, b + 0.12], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    );
    v = Math.max(v, o);
  }
  return v;
};

// ───────────────────────── face spine (full-screen, reframed; black on cover beats) ─────────────────────────
// Face is right-of-center in the raw frame -> zoom 1.35x and shift so the face centers (window samples
// crop 475,90 of the 2592x1458 scaled video). Validated against an ffmpeg preview. Black base when hidden.
const Spine: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <OffthreadVideo
        src={asset('spine.mp4')}
        style={{ position: 'absolute', width: Math.round(W * 1.35), height: Math.round(H * 1.35),
          left: -475, top: -90, opacity: faceVisible(t) }}
      />
    </AbsoluteFill>
  );
};

// ───────────────────────── covers (every [COVER] beat — face is never shown reading) ─────────────────────────
// FACE beats (show Mike): L1 0-7.8, L5 36.4-45.2, CH1-B1 47.7-61.8 (+ chapter card 45.3-47.7).
// COVER beats (hide face): everything else gets a video / image / container.
type Slot = { kind: 'video' | 'image'; src: string; tIn: number; tOut: number };
const BROLL: Slot[] = [
  { kind: 'video', src: 'hook-code-terminal.mp4', tIn: 8.0, tOut: 18.9 },   // L2: dropped the language / native script
  { kind: 'image', src: IMG.machineCode, tIn: 18.7, tOut: 29.0 },           // L3: low-level opcodes / machine code
  { kind: 'video', src: 'blockdag-anim.mp4', tIn: 49.9, tOut: 52.76 },      // B1 list: GhostDAG / parallel blocks (anim)
  { kind: 'image', src: IMG.blockdag, tIn: 52.56, tOut: 54.3 },             // B1 list: directed acyclic graph (still)
  { kind: 'video', src: 'ch1-speed-streaks.mp4', tIn: 60.18, tOut: 68.04 }, // B2a: the honest answer / opcodes
  { kind: 'image', src: IMG.machineCode, tIn: 67.84, tOut: 77.0 },          // B2b: machine code / unusable at scale
  // ── CH2 ──
  { kind: 'video', src: 'ch2-code-editor.mp4', tIn: 88.72, tOut: 98.12 },   // Rust-inspired syntax
  { kind: 'image', src: IMG.utxo, tIn: 113.46, tOut: 126.84 },             // UTXO def / not Ethereum
  { kind: 'video', src: 'ch2-coins-macro.mp4', tIn: 126.64, tOut: 137.6 },  // physical cash / coins & bills
  { kind: 'image', src: IMG.utxo, tIn: 137.4, tOut: 145.46 },              // to pay / Ethereum account model
  // ── CH4: covenants / introspection ──
  { kind: 'video', src: 'ch4-vault.mp4', tIn: 191.3, tOut: 196.2 },         // built on script-engine / covenants -> vault
  // ── CH5: KRC-20 tokens ──
  { kind: 'video', src: 'ch2-coins-macro.mp4', tIn: 262.0, tOut: 268.5 },   // token standard / meme coins minted as
  { kind: 'image', src: 'broll-e4c7a283-rising-tide-ecosystem.png', tIn: 304.6, tOut: 309.4 }, // native programmable issuance going forward
  // ── CH6: cover the "SilverScript is a foundation / covenant layer" line (face was leaking 358.6-363.9) ──
  { kind: 'image', src: IMG.blockdag, tIn: 358.5, tOut: 363.9 },
  // ── CH8: building in the open / ages well ──
  { kind: 'video', src: 'ch8-dev-night.mp4', tIn: 393.0, tOut: 398.6 },     // being built in the open by core devs
  { kind: 'video', src: 'ch8-sunrise-city.mp4', tIn: 403.4, tOut: 408.6 },  // "ages well" vibe-cut beat
];

type Card = { tIn: number; tOut: number; eyebrow: string; title: React.ReactNode; body: React.ReactNode };
const CONTAINERS: Card[] = [
  { tIn: 28.8, tOut: 36.4, eyebrow: 'The shift', title: <>SilverScript <span style={{ color: C.tealBright }}>changes that</span></>,
    body: <>Clean Rust-style code in, spendable <b style={{ color: C.teal }}>covenant conditions</b> on layer one out.</> },
  { tIn: 76.86, tOut: 80.74, eyebrow: 'The on-ramp', title: <>The developer <span style={{ color: C.tealBright }}>on-ramp</span></>,
    body: <>Write clean code; it turns into spendable covenant conditions on L1. SilverScript closes the gap.</> },
  // ── CH2 ──
  { tIn: 98.02, tOut: 104.9, eyebrow: 'Its purpose', title: <>Built for <span style={{ color: C.tealBright }}>real DeFi</span></>,
    body: <>Write covenants, vaults, native-asset logic, and structured DeFi, <b style={{ color: C.teal }}>directly on the L1.</b></> },
  { tIn: 104.6, tOut: 113.56, eyebrow: 'Lineage', title: <>Inspired by <span style={{ color: C.tealBright }}>CashScript</span></>,
    body: <>From Bitcoin Cash, extended for Kaspa&apos;s <b style={{ color: C.teal }}>UTXO model</b> with more expressiveness.</> },
  { tIn: 145.46, tOut: 157.16, eyebrow: 'Why it matters', title: <>A rule on <span style={{ color: C.tealBright }}>one coin</span></>,
    body: <>A covenant is a rule stamped on an individual coin, controlling how it can be spent next. SilverScript writes those per-coin rules.</> },
  // ── CH3 ──
  { tIn: 161.04, tOut: 168.54, eyebrow: 'How it works', title: <>No VM. <span style={{ color: C.tealBright }}>Just Kaspa.</span></>,
    body: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.ink, marginTop: 6 }}>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 18px' }}>SilverScript</span>
        <span style={{ color: C.teal, fontSize: 32 }}>&rarr;</span>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 18px' }}>silverscript compile</span>
        <span style={{ color: C.teal, fontSize: 32 }}>&rarr;</span>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 18px' }}>native Kaspa Script</span>
        <span style={{ color: C.teal, fontSize: 32 }}>&rarr;</span>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 18px' }}>L1 consensus</span>
      </div>
    ) },
  { tIn: 168.54, tOut: 179.56, eyebrow: 'The analogy', title: <>It&apos;s a <span style={{ color: C.tealBright }}>compiler</span></>,
    body: <>Like TypeScript compiling to JavaScript, not a new runtime. Friendly language up top, battle-tested native script underneath.</> },
  { tIn: 179.56, tOut: 186.04, eyebrow: 'Why it matters', title: <>Lean and <span style={{ color: C.tealBright }}>safe</span></>,
    body: <>No VM overhead. No new attack surface from an interpreter. Determinism is preserved.</> },
  // ── CH4: the foundation (covenants + KIPs) ──
  { tIn: 196.0, tOut: 209.0, eyebrow: 'The foundation', title: <>Built on <span style={{ color: C.tealBright }}>KIP-10 + KIP-20</span></>,
    body: <>KIP-10 introspection (live on mainnet) lets a contract inspect the transaction spending it. KIP-20 covenant IDs give stable, stateful <b style={{ color: C.teal }}>covenant lineage</b>.</> },
  { tIn: 209.0, tOut: 229.8, eyebrow: 'KIP, translated', title: <>Kaspa <span style={{ color: C.tealBright }}>Improvement Proposal</span></>,
    body: <>A numbered, public design doc that proposes a protocol change, debated in the open, then shipped by core devs. Same idea as Bitcoin&apos;s BIPs or Ethereum&apos;s EIPs.</> },
  // ── CH5: native assets + KRC-20 ──
  { tIn: 250.2, tOut: 262.0, eyebrow: 'KRC-20, translated', title: <>Kaspa&apos;s <span style={{ color: C.tealBright }}>token standard</span></>,
    body: <>What meme coins and projects are minted as today. The Kaspa cousin of Bitcoin&apos;s BRC-20 and Ethereum&apos;s ERC-20.</> },
  { tIn: 268.5, tOut: 274.1, eyebrow: 'Today', title: <>It&apos;s a <span style={{ color: C.tealBright }}>workaround</span></>,
    body: <>Tokens are tracked by external indexers sitting on top of the chain, not by Kaspa itself.</> },
  { tIn: 274.1, tOut: 286.0, eyebrow: 'Before / after', title: <>Bolt-on to <span style={{ color: C.tealBright }}>native rails</span></>,
    body: (
      <div style={{ display: 'flex', gap: 22, marginTop: 8 }}>
        <div style={{ flex: 1, background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 14, padding: '20px 24px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>Today</p>
          <p style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.3, color: C.ink, margin: '8px 0 0' }}>Tracked by external indexers, sitting on top of the chain.</p>
        </div>
        <div style={{ flex: 1, background: '#0d2034', border: `1px solid ${C.tealBright}`, borderRadius: 14, padding: '20px 24px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tealBright, margin: 0 }}>Toccata</p>
          <p style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.3, color: C.ink, margin: '8px 0 0' }}>First-class protocol citizens, on the same rails as KAS itself.</p>
        </div>
      </div>
    ) },
  { tIn: 299.4, tOut: 304.6, eyebrow: 'Accuracy', title: <>Keep working <span style={{ color: C.tealBright }}>&ne; auto-native</span></>,
    body: <>Nothing breaks, and the chain gains native, programmable issuance going forward.</> },
  // ── CH6: where this sits (roadmap) ──
  { tIn: 337.2, tOut: 350.8, eyebrow: 'The roadmap', title: <>Where this <span style={{ color: C.tealBright }}>sits</span></>,
    body: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.ink, marginTop: 8 }}>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 16px' }}>KIP-10 · live</span>
        <span style={{ color: C.teal, fontSize: 30 }}>&rarr;</span>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 16px' }}>SilverScript · TN12 now</span>
        <span style={{ color: C.teal, fontSize: 30 }}>&rarr;</span>
        <span style={{ background: '#0d2034', border: `1px solid ${C.tealBright}`, borderRadius: 12, padding: '12px 16px', color: C.tealBright }}>Toccata · late June 2026</span>
        <span style={{ color: C.teal, fontSize: 30 }}>&rarr;</span>
        <span style={{ background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 12, padding: '12px 16px' }}>vProgs / DAGKnight · 2027</span>
      </div>
    ) },
  { tIn: 363.9, tOut: 376.2, eyebrow: 'Two tiers', title: <>The full <span style={{ color: C.tealBright }}>picture</span></>,
    body: (
      <div style={{ display: 'flex', gap: 22, marginTop: 8 }}>
        <div style={{ flex: 1, background: '#0d2034', border: `1px solid ${C.tealBright}`, borderRadius: 14, padding: '20px 24px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.tealBright, margin: 0 }}>SilverScript · now</p>
          <p style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.3, color: C.ink, margin: '8px 0 0' }}>The UTXO / covenant layer you build on today.</p>
        </div>
        <div style={{ flex: 1, background: '#0d2034', border: `1px solid ${C.edge}`, borderRadius: 14, padding: '20px 24px' }}>
          <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>vProgs · 2027</p>
          <p style={{ fontFamily: SANS, fontSize: 30, lineHeight: 1.3, color: C.ink, margin: '8px 0 0' }}>Account-state contracts, ZK, parallel execution, with DAGKnight.</p>
        </div>
      </div>
    ) },
  // ── CH7: the ecosystem isn't waiting ──
  { tIn: 381.6, tOut: 387.3, eyebrow: 'Already building', title: <>Zealous Swap <span style={{ color: C.tealBright }}>(ZEAL)</span></>,
    body: <>The team describes its V2, Zealous Flow, as a continuous clearing market.</> },
];

const VideoBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
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

const ImageBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const pOut = interpolate(t, [slot.tOut - 0.5, slot.tOut], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const sweep = pIn * 140 - 20;
  const mask = pIn >= 1 ? undefined : `linear-gradient(105deg, rgba(0,0,0,1) ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`;
  const warpIn = 1 - pIn;
  return (
    <AbsoluteFill style={{ opacity: 1 - pOut, background: '#000' }}>
      <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
        <Img src={asset(slot.src)} style={{ width: '100%', height: '100%', objectFit: 'cover',
          transform: `scale(${1 + warpIn * 0.08 + pOut * 0.07}) skewX(${warpIn * -7 + pOut * 5}deg)`,
          filter: `blur(${(warpIn * 12 + pOut * 10).toFixed(1)}px)` }} />
      </div>
    </AbsoluteFill>
  );
};

// container = full-frame deck-navy cover with the spotlight card (cross-fade + scale-in)
const Container: React.FC<{ card: Card }> = ({ card }) => {
  const t = useT();
  const o = Math.min(
    interpolate(t, [card.tIn, card.tIn + 0.35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [card.tOut - 0.35, card.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  if (o <= 0.001) return null;
  const sc = interpolate(t, [card.tIn, card.tIn + 0.35], [0.93, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o, background: `radial-gradient(1200px 700px at 50% 45%, ${C.navy2}, ${C.navy})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 130px' }}>
      <div style={{ transform: `scale(${sc})`, maxWidth: 1300,
        background: `linear-gradient(180deg, ${C.card}, #0d1d31)`, border: `1px solid ${C.edge}`, borderRadius: 22,
        padding: '52px 64px', boxShadow: '0 24px 70px rgba(0,0,0,0.5)' }}>
        <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.teal, margin: 0 }}>{card.eyebrow}</p>
        <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: C.ink, margin: '16px 0 22px' }}>{card.title}</h2>
        <p style={{ fontFamily: SANS, fontSize: 38, lineHeight: 1.4, color: C.muted, margin: 0 }}>{card.body}</p>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── lower-third term labels ─────────────────────────
// Definition label shown WHILE Mike speaks the term (he asked for the UTXO expansion on screen).
type Lower = { tIn: number; tOut: number; term: string; expansion: string };
const LOWER_THIRDS: Lower[] = [
  // "it stands for Unspent Transaction Output" lands at ~117.5s, inside the UTXO image beat (113.46-126.84).
  { tIn: 117.0, tOut: 126.2, term: 'UTXO', expansion: 'Unspent Transaction Output' },
  // CH5 holders-reassurance (over the FACE beat) — corroborated by Mike's KRC-20/Toccata FAQ.
  { tIn: 287.0, tOut: 298.0, term: 'Holders', expansion: 'No migration. No swap. No action.' },
  // Mid-roll community plug (over FACE).
  { tIn: 314.0, tOut: 333.0, term: 'Community', expansion: 'Link in description' },
  // CH6 honesty / credibility (over the FACE status beat).
  { tIn: 351.5, tOut: 362.5, term: 'Status', expansion: 'Experimental · TN12 only' },
];
const LowerThird: React.FC<{ item: Lower }> = ({ item }) => {
  const t = useT();
  const o = Math.min(
    interpolate(t, [item.tIn, item.tIn + 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [item.tOut - 0.4, item.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  if (o <= 0.001) return null;
  const slide = interpolate(t, [item.tIn, item.tIn + 0.4], [44, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 0 128px 90px', pointerEvents: 'none' }}>
      <div style={{ opacity: o, transform: `translateY(${slide}px)`,
        background: 'linear-gradient(180deg, rgba(16,36,60,0.95), rgba(13,29,49,0.95))',
        borderLeft: `5px solid ${C.tealBright}`, borderRadius: '0 14px 14px 0',
        padding: '20px 36px 22px', boxShadow: '0 18px 50px rgba(0,0,0,0.55)' }}>
        <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.teal, margin: 0 }}>{item.term}</p>
        <p style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.05, color: C.ink, margin: '8px 0 0' }}>{item.expansion}</p>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── chapter transitions (cube) ─────────────────────────
const CHAPTERS: Array<{ at: number; num: number; title: React.ReactNode }> = [
  { at: 45.3, num: 1, title: <>Fast chain.<br />But <span style={{ color: C.tealBright }}>where are the smart contracts?</span></> },
  { at: 80.74, num: 2, title: <>Kaspa&apos;s first <span style={{ color: C.tealBright }}>high-level smart contract language</span></> },
  { at: 157.16, num: 3, title: <>Compiles straight to <span style={{ color: C.tealBright }}>native Kaspa Script</span></> },
  { at: 186.2, num: 4, title: <>The foundation: <span style={{ color: C.tealBright }}>covenants + KIPs</span></> },
  { at: 240.5, num: 5, title: <>KRC-20 <span style={{ color: C.tealBright }}>goes native</span></> },
  { at: 337.2, num: 6, title: <>Where this sits: <span style={{ color: C.tealBright }}>late June 2026, Toccata</span></> },
  { at: 376.2, num: 7, title: <>The ecosystem <span style={{ color: C.tealBright }}>isn&apos;t waiting</span></> },
  { at: 387.3, num: 8, title: <>Built in the open, <span style={{ color: C.tealBright }}>while nobody&apos;s watching</span></> },
];
const ChapterCube: React.FC<{ at: number; num: number; title: React.ReactNode }> = ({ at, num, title }) => {
  const t = useT();
  const hold = 2.4;
  if (t < at - 0.1 || t > at + hold + 1.0) return null;
  const pIn = interpolate(t, [at, at + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const pOut = interpolate(t, [at + hold, at + hold + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const rot = (1 - pIn) * 90 - pOut * 90;
  const o = Math.min(pIn * 1.6, 1) * (1 - pOut);
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <AbsoluteFill style={{
        background: `radial-gradient(1200px 700px at 50% 40%, ${C.navy2}, ${C.navy})`,
        transform: `rotateY(${rot}deg)`, transformOrigin: 'center center', opacity: o,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 130px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.teal, margin: 0 }}>Chapter {num}</p>
          <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.07, color: C.ink, margin: '16px 0 0', maxWidth: 1500 }}>{title}</h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── music bed (no captions in this video) ─────────────────────────
// hook -10dB vs last pass (0.05 -> 0.0158, Mike: "way too loud, subtract 10 dB"). Body = dynamic-LEVELED
// track (subtle passages already brought up, aggressive ones tamed, gaussian-smoothed) -5dB to 0.06.
const Music: React.FC = () => (
  <>
    <Sequence durationInFrames={Math.round(17.3 * SS_FPS)} layout="none">
      <Audio src={asset('music-hook.wav')} volume={0.0158} />
    </Sequence>
    {/* body loops (file is ~2.5min, video is ~7min); ducks for the CH8 "ages well" vibe-cut music drop */}
    <Sequence from={Math.round(16.3 * SS_FPS)} layout="none">
      <Audio src={asset('music-body-leveled.wav')} loop volume={(f) => {
        const t = 16.3 + f / SS_FPS;
        const drop = interpolate(t, [406.6, 407.0, 408.6, 409.2], [1, 0.18, 0.18, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return 0.06 * drop;
      }} />
    </Sequence>
  </>
);

// ───────────────────────── impact SFX (chapter cuts + major reveals + vibe cut; NOT the mid-roll) ─────────────────────────
// Per WHEN-TO-USE-IMPACTS.md: impact on each chapter-transition cut + major graphic reveals only; vibe-cut = bigger hit + music drop.
const IMPACTS: Array<{ at: number; big?: boolean }> = [
  { at: 45.3 }, { at: 80.74 }, { at: 157.16 }, // CH1-3 cube cuts (first half)
  { at: 161.04 },                              // CH3 "No VM" corrected-diagram reveal
  { at: 186.2 }, { at: 240.5 },                // CH4, CH5 cube cuts
  { at: 274.1 },                               // CH5 before/after (bolt-on -> native) reveal
  { at: 337.2 },                               // CH6 cube + roadmap timeline-strip reveal
  { at: 376.2 }, { at: 387.3 },                // CH7, CH8 cube cuts
  { at: 407.0, big: true },                    // CH8 "ages well" vibe-cut hit (paired with the music drop)
];
const Impact: React.FC<{ at: number; big?: boolean }> = ({ at, big }) => (
  <Sequence from={Math.round(at * SS_FPS)} durationInFrames={Math.round((big ? 2.5 : 3.94) * SS_FPS)} layout="none">
    <Audio src={asset(big ? 'impact-big.wav' : 'impact.wav')} volume={big ? 0.55 : 0.4} />
  </Sequence>
);

// ───────────────────────── Kaspa K logo (a couple of branded second-half beats + end card) ─────────────────────────
// logo-kaspa.png = glowing teal K on black -> mix-blend screen so the black backdrop drops out.
const LOGO_SPOTS: Array<{ tIn: number; tOut: number; size: number; pos: React.CSSProperties }> = [
  { tIn: 280.5, tOut: 286.0, size: 210, pos: { bottom: 96, right: 120 } }, // CH5 "same rails as KAS itself"
  { tIn: 343.0, tOut: 350.8, size: 190, pos: { bottom: 96, right: 120 } }, // CH6 roadmap / Toccata
];
const KaspaLogo: React.FC<{ tIn: number; tOut: number; size: number; pos: React.CSSProperties }> = ({ tIn, tOut, size, pos }) => {
  const t = useT();
  const o = Math.min(
    interpolate(t, [tIn, tIn + 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [tOut - 0.5, tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  if (o <= 0.001) return null;
  const sc = interpolate(t, [tIn, tIn + 0.6], [0.82, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <Img src={asset('kaspa-logo.png')} style={{ position: 'absolute', width: size, height: size,
        opacity: o * 0.92, mixBlendMode: 'screen', transform: `scale(${sc})`, ...pos }} />
    </AbsoluteFill>
  );
};
// End card / channel outro — fades in on "spread the word about Kaspa" (~424s) over the close.
const EndCard: React.FC = () => {
  const t = useT();
  const o = interpolate(t, [424.0, 425.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Img src={asset('broll-f0d6b491-end-card-bg.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Img src={asset('kaspa-logo.png')} style={{ width: 380, height: 380, mixBlendMode: 'screen' }} />
        <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 66, color: C.ink, margin: 0 }}>Spread the word.</h2>
        <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.teal, margin: 0 }}>Like · Comment · Subscribe</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── root ─────────────────────────
export const SilverScript: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Spine />

      {BROLL.map((s, i) => {
        const fromFrame = Math.round((s.tIn - 0.1) * SS_FPS);
        const t0 = fromFrame / SS_FPS;
        return (
          <Sequence key={i} from={fromFrame} durationInFrames={Math.round((s.tOut - s.tIn + 0.2) * SS_FPS)} layout="none">
            {s.kind === 'video' ? <VideoBroll slot={s} t0={t0} /> : <ImageBroll slot={s} t0={t0} />}
          </Sequence>
        );
      })}

      {LOWER_THIRDS.map((l, i) => <LowerThird key={`lt${i}`} item={l} />)}

      {CONTAINERS.map((c, i) => <Container key={`c${i}`} card={c} />)}

      {LOGO_SPOTS.map((s, i) => <KaspaLogo key={`logo${i}`} {...s} />)}

      {CHAPTERS.map((c) => <ChapterCube key={c.num} {...c} />)}

      <EndCard />

      {IMPACTS.map((im, i) => <Impact key={`im${i}`} {...im} />)}
      <Music />
    </AbsoluteFill>
  );
};
