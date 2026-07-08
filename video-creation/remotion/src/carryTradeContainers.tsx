import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';

/**
 * carry-trade — code-rendered system-design containers (Convention 4). FILL THE FRAME,
 * one spotlight state at a time (state prop = which sub-point is lit).
 */

const ease = Easing.out(Easing.cubic);
const MONO = "'JetBrains Mono','Consolas',monospace";
const SANS = "'DM Sans','Segoe UI',sans-serif";

const Frame: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#05070a', justifyContent: 'center', alignItems: 'center', opacity: op }}>
      <div style={{ width: 1820, height: 980, background: '#0d1015', border: '1px solid #1e2330', borderRadius: 28, padding: '56px 72px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: SANS, fontSize: 46, fontWeight: 900, color: '#e8eaf0' }}>{title}</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

const Node: React.FC<{ label: string; sub?: string; color?: string; dim?: boolean; wide?: boolean }> = ({ label, sub, color = '#1e2330', dim, wide }) => (
  <div style={{ flex: wide ? 1.4 : 1, minWidth: 200, background: '#12151c', border: `2px solid ${color}`, borderRadius: 16, padding: '26px 22px', textAlign: 'center', opacity: dim ? 0.35 : 1, transition: 'opacity .3s' }}>
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: '#e8eaf0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    {sub && <div style={{ fontFamily: MONO, fontSize: 21, color: '#8892a4', marginTop: 10 }}>{sub}</div>}
  </div>
);
const Arrow: React.FC<{ dim?: boolean; flip?: boolean }> = ({ dim, flip }) => (
  <div style={{ fontSize: 44, color: dim ? '#2a3040' : '#8892a4', padding: '0 18px', transform: flip ? 'scaleX(-1)' : undefined }}>→</div>
);

/** D-OUTFLOW — CH1/CH6: Japan → US assets; state 'out' = all arrows out; 'flip' = Treasuries arrow reversed; 'wobble' = step-back emphasis */
export const DOutflow: React.FC<{ state: 'out' | 'flip' | 'wobble' }> = ({ state }) => (
  <Frame title={state === 'wobble' ? 'When the Biggest Holder Steps Back' : 'Three Decades of Money, Flowing Out'}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Node label="JAPAN" sub="near-zero rates, ~30yrs" color="#ffd700" wide />
      <Arrow flip={state !== 'out'} />
      <Node label="US TREASURIES" sub="~$1.24T held (Feb 2026)" color={state !== 'out' ? '#ff4060' : '#1e2330'} />
      <Arrow />
      <Node label="US STOCKS" sub="GPIF ~25% foreign equity" color={state === 'wobble' ? '#ff4060' : '#1e2330'} />
      <Arrow />
      <Node label="CRYPTO" sub="leveraged yen-funded positions" color="#1e2330" dim={state === 'wobble'} />
    </div>
    <div style={{ fontFamily: SANS, fontSize: 26, color: '#8892a4', marginTop: 44, textAlign: 'center' }}>
      {state === 'out' && 'Capital left Japan for decades — because home paid nothing.'}
      {state === 'flip' && 'Q1 2026: the Treasuries arrow just flipped. ~$29.6B went home.'}
      {state === 'wobble' && 'Bonds AND stocks step back at once → borrowing costs move, valuations wobble, conditions tighten for every risk asset.'}
    </div>
  </Frame>
);

/** D-DUALFLOW — CH2: the two lanes.
 * States (Mike, 2026-07-06 review: spotlight the container being TALKED ABOUT, whole slide only when it makes sense):
 *  'lanes' = both cards (the "two kinds of investors" intro — the one sanctioned overview)
 *  'lane1' / 'lane2' = ONE card, enlarged solo (the lane being discussed)
 *  'scale' = both + trillions banner (talk addresses both) · 'conditions' = DISTINCT pills layout (no card repeat) */
const LaneCard: React.FC<{ lane: 1 | 2; solo?: boolean }> = ({ lane, solo }) => {
  const one = lane === 1;
  return (
    <div style={{ flex: 1, maxWidth: solo ? 1000 : undefined, margin: solo ? '0 auto' : undefined,
      background: one ? 'rgba(80,90,110,.08)' : 'linear-gradient(135deg,rgba(255,64,96,.09),rgba(255,215,0,.05))',
      border: one ? '1px solid #1e2330' : '1px solid rgba(255,64,96,.28)', borderRadius: 16, padding: solo ? 54 : 34 }}>
      <div style={{ fontFamily: MONO, fontSize: solo ? 26 : 20, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#505a6e' }}>
        {one ? 'Lane 1 — Real money' : 'Lane 2 — Borrowed money'}</div>
      <div style={{ fontFamily: SANS, fontSize: solo ? 46 : 32, fontWeight: 700, color: '#e8eaf0', marginTop: 12 }}>
        {one ? 'Japanese savings' : 'Leveraged speculators'}</div>
      <div style={{ fontFamily: SANS, fontSize: solo ? 32 : 24, color: '#8892a4', marginTop: 16, lineHeight: 1.6 }}>
        {one ? 'Life insurers, pension funds, banks → convert → foreign bonds (mostly US Treasuries) + foreign stocks.'
             : 'Borrow yen at ~0% → convert → buy risk assets (stocks, crypto). A direct SHORT position on the yen.'}</div>
      <div style={{ fontFamily: MONO, fontSize: solo ? 32 : 26, color: one ? '#00e68a' : '#ff4060', marginTop: 18 }}>
        {one ? 'GPIF: ~25% foreign equity' : 'the fast-unwind lane'}</div>
    </div>
  );
};
export const DDualflow: React.FC<{ state: 'lanes' | 'lane1' | 'lane2' | 'scale' | 'conditions' }> = ({ state }) => {
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  if (state === 'conditions')
    return (
      <Frame title="Both Lanes Rest on Two Conditions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44, alignItems: 'center' }}>
          <div style={{ border: '2px solid #00c2ff', borderRadius: 100, padding: '30px 70px', fontFamily: MONO, fontSize: 40, color: '#00c2ff' }}>1 — Japan keeps paying ~0%</div>
          <div style={{ border: '2px solid #00c2ff', borderRadius: 100, padding: '30px 70px', fontFamily: MONO, fontSize: 40, color: '#00c2ff' }}>2 — the yen stays weak</div>
          <div style={{ marginTop: 10, border: `2px solid rgba(255,215,0,${0.4 + 0.5 * pulse})`, borderRadius: 16, padding: '22px 48px', fontFamily: SANS, fontSize: 30, color: '#ffd700' }}>
            Change either one, and the math that justifies sending money abroad starts to break.</div>
        </div>
      </Frame>
    );
  if (state === 'lane1' || state === 'lane2')
    return (
      <Frame title={state === 'lane1' ? 'Lane 1: the Real Money' : 'Lane 2: the Borrowed Money'}>
        <div style={{ display: 'flex' }}><LaneCard lane={state === 'lane1' ? 1 : 2} solo /></div>
      </Frame>
    );
  return (
    <Frame title="Two Kinds of Money, Same Trade">
      <div style={{ display: 'flex', gap: 28 }}><LaneCard lane={1} /><LaneCard lane={2} /></div>
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        {state === 'lanes' && <div style={{ fontFamily: SANS, fontSize: 26, color: '#8892a4' }}>Two very different investors. The same exact trade.</div>}
        {state === 'scale' && <div style={{ fontFamily: SANS, fontSize: 34, fontWeight: 900, color: '#e8eaf0' }}>Together: <span style={{ color: '#ffd700' }}>trillions of dollars</span> — not a niche trade.</div>}
      </div>
    </Frame>
  );
};

/** D-SQUEEZE — CH3: two unwind mechanisms; states: intro | slow | fast | connect */
export const DSqueeze: React.FC<{ state: 'intro' | 'slow' | 'fast' | 'connect' }> = ({ state }) => {
  const slowDim = state === 'fast';
  const fastDim = state === 'slow' || state === 'intro';
  return (
    <Frame title="Two Ways This Unwinds">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        <div style={{ opacity: slowDim ? 0.35 : 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 21, color: '#00c2ff', letterSpacing: '0.12em', marginBottom: 14 }}>THE SLOW WAY — quiet reallocation (already moving)</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Node label="JGB yields rise" color="#00c2ff" />
            <Arrow />
            <Node label="foreign return not worth FX risk" />
            <Arrow />
            <Node label="sell foreign, buy Japanese" />
            <Arrow />
            <Node label="yen demand rises" color={state === 'connect' ? '#ffd700' : '#1e2330'} />
          </div>
        </div>
        {state === 'connect' && (
          <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 26, color: '#ffd700' }}>↓ the quiet reallocation can light the fast fuse ↓</div>
        )}
        <div style={{ opacity: fastDim ? 0.35 : 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 21, color: '#ff4060', letterSpacing: '0.12em', marginBottom: 14 }}>THE FAST WAY — the squeeze (loaded, hasn't fired since 2024)</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Node label="yen strengthens" color="#ff4060" />
            <Arrow />
            <Node label="shorts forced to cover" sub="buy yen back to repay" color="#ff4060" />
            <Arrow />
            <Node label="loan cost rises" sub="sell stocks & crypto for cash" color="#ff4060" />
            <Arrow flip />
            <Node label="asset prices fall" sub="→ loops back, more forced selling" color="#ff4060" />
          </div>
        </div>
      </div>
    </Frame>
  );
};

/** D-WORKEDMATH — CH4: the illustrative loan/asset squeeze math */
export const DWorkedMath: React.FC = () => {
  const f = useCurrentFrame();
  const s1 = interpolate(f, [6, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s2 = interpolate(f, [140, 155], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s3 = interpolate(f, [420, 440], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  return (
    <Frame title="One Trade, Both Sides Moving Against You">
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ flex: 1, background: 'rgba(80,90,110,.08)', border: '1px solid #1e2330', borderRadius: 16, padding: 36, opacity: s1 }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#505a6e' }}>The loan</div>
          <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 600, color: '#e8eaf0', marginTop: 14 }}>Borrow ¥ at ~0%</div>
          <div style={{ fontFamily: SANS, fontSize: 25, color: '#8892a4', marginTop: 18 }}>Yen strengthens <span style={{ color: '#ff4060', fontFamily: MONO }}>7%</span> against the dollar.</div>
          <div style={{ fontFamily: MONO, fontSize: 30, color: '#ff4060', marginTop: 16 }}>Loan costs 7% more to repay</div>
        </div>
        <div style={{ flex: 1, background: 'linear-gradient(135deg,rgba(255,64,96,.09),rgba(255,215,0,.05))', border: '1px solid rgba(255,64,96,.28)', borderRadius: 16, padding: 36, opacity: s2 }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#505a6e' }}>The asset</div>
          <div style={{ fontFamily: MONO, fontSize: 32, fontWeight: 600, color: '#e8eaf0', marginTop: 14 }}>Hold the risk asset</div>
          <div style={{ fontFamily: SANS, fontSize: 25, color: '#8892a4', marginTop: 18 }}>Everyone in the same trade sells at once to raise cash.</div>
          <div style={{ fontFamily: MONO, fontSize: 30, color: '#ff4060', marginTop: 16 }}>Asset price ALSO drops</div>
        </div>
      </div>
      <div style={{ marginTop: 40, textAlign: 'center', opacity: s3, transform: `scale(${0.94 + 0.06 * s3})` }}>
        <div style={{ display: 'inline-block', background: 'rgba(255,64,96,.08)', border: '1px solid rgba(255,64,96,.25)', borderRadius: 12, padding: '20px 40px', fontFamily: SANS, fontSize: 28, color: '#e8eaf0' }}>
          Not two problems. <b style={{ color: '#ff4060' }}>One feedback loop</b>, hitting from both sides. <span style={{ color: '#505a6e', fontSize: 22 }}>(illustrative numbers)</span>
        </div>
      </div>
    </Frame>
  );
};
