import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

/**
 * Clarity Act — spotlight CONTAINERS (one self-contained card per beat, code-rendered).
 * Matches skills/container-reference (banks-card): a single card, eyebrow + serif title (accent word colored)
 * + body/list + optional stamp. NEVER a multi-card slide held (that was the recurring violation).
 */
const ease = Easing.out(Easing.cubic);
const C = { bg: '#0a0c10', card: '#12151c', bd: '#1e2330', tp: '#e8eaf0', ts: '#8892a4', tm: '#5a6478', green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060' };

type Item = { n?: string; text: string };
type Def = { eyebrow: string; title: React.ReactNode; accent: string; body?: string; items?: Item[]; stamp?: string };

const A = (accent: string) => (C as any)[accent] as string;

export const CONTAINERS: Record<string, Def> = {
  bw44: { eyebrow: 'THE PATTERN · 1944', accent: 'cyan', title: <>Bretton Woods</>, body: "After World War II the world's gold had drained into the United States. Nations pegged their money to the dollar, redeemable for gold. The dollar became the world's reserve currency." },
  bw71: { eyebrow: 'THE PATTERN · 1971', accent: 'cyan', title: <>Nixon Shuts the <span style={{ color: C.cyan }}>Gold Window</span></>, body: "Too many dollars, not enough gold. On August 15, 1971, Nixon slammed the gold window shut. The gold standard was dead." },
  bw74: { eyebrow: 'THE PATTERN · 1974', accent: 'cyan', title: <>The Petrodollar</>, body: "Oil would only be priced in dollars. Every nation on earth that wanted oil first had to get US dollars, and those dollars flowed straight back into US Treasuries." },
  bwToday: { eyebrow: 'THE PATTERN · TODAY', accent: 'green', title: <>Bretton Woods <span style={{ color: C.green }}>3.0</span></>, body: "Same trick, new rails. This time the dollar doesn't need gold, or oil. It just needs your phone." },
  stable: { eyebrow: 'THE MACHINE', accent: 'gold', title: <>A Stablecoin Holds <span style={{ color: C.gold }}>Treasuries</span></>, body: "A dollar stablecoin isn't magic internet money. Behind every coin, the issuer parks the actual dollars in US Treasuries, exactly like a bank." },
  genius: { eyebrow: 'THE GENIUS ACT · SIGNED JULY 2025', accent: 'gold', title: <><span style={{ color: C.gold }}>100% Reserves</span>, By Law</>, body: "The GENIUS Act forces every dollar stablecoin to hold 100% reserves in cash and short-term US Treasuries." },
  forced: { eyebrow: 'READ WHAT THIS MEANS', accent: 'green', title: <>A Forced Buyer of <span style={{ color: C.green }}>US Debt</span></>, body: "Every dollar stablecoin on the planet is now a forced buyer of American government debt. By law." },
  govcbdc: { eyebrow: 'OPTION A · THE OBVIOUS WAY', accent: 'red', title: <>Government <span style={{ color: C.red }}>CBDC</span></>, items: [{ n: '01', text: 'Government builds its own digital coin: one ledger, total visibility.' }, { n: '02', text: 'Citizens see a surveillance tool that watches every dollar.' }, { n: '03', text: 'They reject it. Projects freeze in "pilot mode."' }], stamp: 'STUCK · going nowhere' },
  privstable: { eyebrow: 'OPTION B · WHAT WASHINGTON DID', accent: 'green', title: <>Private <span style={{ color: C.green }}>Stablecoin</span></>, items: [{ n: '01', text: 'Let private companies build the dollar coin instead.' }, { n: '02', text: 'People adopt it willingly: faster, global, it pays them.' }, { n: '03', text: 'Regulated by Congress, enforced by the Treasury.' }], stamp: 'ADOPTED · by choice' },
  circle: { eyebrow: 'THE ISSUER · GENIUS BAN', accent: 'red', title: <>Circle <span style={{ color: C.red }}>Can't Pay You</span></>, body: "By law, the issuer of a stablecoin, a company like Circle, cannot pay you yield just for holding their coin." },
  coinbase: { eyebrow: 'THE PLATFORM · NOT THE ISSUER', accent: 'green', title: <>The <span style={{ color: C.green }}>Coinbase</span>-Shaped Hole</>, body: "But Coinbase can hand you about 3.5% and call it a loyalty reward, because Coinbase isn't the issuer. Same interest, one extra hop dodges the ban." },
  pattern3: { eyebrow: 'HOW AMERICA ALWAYS DID IT', accent: 'green', title: <>Manufacture a <span style={{ color: C.green }}>New Buyer</span></>, items: [{ n: '→', text: 'Gold gave it Bretton Woods.' }, { n: '→', text: 'Oil gave it the petrodollar.' }, { n: '→', text: 'Now crypto gives it stablecoins.' }] },
};

export const Container: React.FC<{ id: string }> = ({ id }) => {
  const d = CONTAINERS[id];
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vert = height > width; // portrait comp -> vertical layout (bigger type, narrower card)
  const op = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sc = interpolate(f, [0, 14], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const acc = A(d.accent);
  if (!d) return <AbsoluteFill style={{ background: C.bg }} />;
  const cardW = vert ? 980 : 1240;
  const pad = vert ? '80px 64px' : '64px 72px';
  const titleSz = vert ? 88 : 76;
  const bodySz = vert ? 46 : 34;
  const ebSz = vert ? 30 : 22;
  const itemSz = vert ? 44 : 32;
  const numSz = vert ? 40 : 30;
  const stampSz = vert ? 32 : 24;
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: vert ? 680 : 560, height: vert ? 680 : 560, borderRadius: '50%', filter: 'blur(140px)', opacity: 0.22, background: acc, top: vert ? 120 : -140, left: vert ? -120 : 120 }} />
      <div style={{ opacity: op, transform: `scale(${sc})`, width: cardW, background: C.card, border: `1px solid ${C.bd}`, borderRadius: 24, padding: pad, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${acc},transparent)` }} />
        <div style={{ fontFamily: "'JetBrains Mono','Consolas',monospace", fontSize: ebSz, letterSpacing: '0.16em', color: C.tm, fontWeight: 700, marginBottom: vert ? 28 : 22 }}>{d.eyebrow}</div>
        <div style={{ fontFamily: "'Playfair Display','Georgia',serif", fontWeight: 900, fontSize: titleSz, lineHeight: 1.06, color: C.tp, marginBottom: vert ? 40 : 30 }}>{d.title}</div>
        {d.body ? <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", fontSize: bodySz, lineHeight: 1.5, color: C.ts }}>{d.body}</div> : null}
        {d.items ? <div style={{ display: 'flex', flexDirection: 'column', gap: vert ? 34 : 22 }}>{d.items.map((it, i) => {
          const io = interpolate(f, [10 + i * 6, 20 + i * 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <div key={i} style={{ display: 'flex', gap: vert ? 28 : 22, alignItems: 'flex-start', opacity: io }}><span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: numSz, color: acc, minWidth: vert ? 58 : 44 }}>{it.n}</span><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: itemSz, lineHeight: 1.4, color: C.tp }}>{it.text}</span></div>;
        })}</div> : null}
        {d.stamp ? <div style={{ marginTop: vert ? 44 : 34, display: 'inline-block', padding: '12px 28px', borderRadius: 100, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: stampSz, color: acc, background: `${acc}22` }}>{d.stamp}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
