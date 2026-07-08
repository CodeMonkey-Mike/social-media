import React from 'react';
import { AbsoluteFill, Audio, interpolate, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';

loadPlayfair('normal', { weights: ['700', '900'], subsets: ['latin'] });
loadDMSans('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['600'], subsets: ['latin'] });

// POC window = EDIT2 27.0s .. 70.0s. Each scene shows ONE element, blown up to
// fill the screen, while it's being narrated; it clears as the next comes in.
// tIn values are WINDOW-relative seconds (EDIT2 timestamp - 27.0) from the Whisper timings.
const END = 43;

const COL = {
  bgDeep: '#0a0c10', bgCard: '#12151c', border: '#1e2330',
  cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060',
  textPrimary: '#e8eaf0', textSecondary: '#8892a4', textMuted: '#505a6e',
};

const BigCard: React.FC<{ accent: string; tag: string; num: string; desc: string }> = ({ accent, tag, num, desc }) => (
  <div style={{
    width: 1500, background: COL.bgCard, border: `1px solid ${COL.border}`,
    borderRadius: 28, padding: '90px 90px 84px', position: 'relative', overflow: 'hidden',
    boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    <p style={{ fontFamily: "'DM Sans',sans-serif", color: accent, fontSize: '1.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 24 }}>{tag}</p>
    <p style={{ fontFamily: "'JetBrains Mono', monospace", color: accent, fontSize: '7.5rem', fontWeight: 600, lineHeight: 1, marginBottom: 32 }}>{num}</p>
    <p style={{ fontFamily: "'DM Sans',sans-serif", color: COL.textSecondary, fontSize: '2.3rem', lineHeight: 1.55, maxWidth: 1250 }}>{desc}</p>
  </div>
);

export const QeMoneyPrinterPoc: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  type Scene = { tIn: number; node: React.ReactNode };
  const scenes: Scene[] = [
    {
      tIn: 1.42, // "The money printer..."
      node: (
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: '6.5rem', lineHeight: 1.06, letterSpacing: '-0.02em', color: COL.textPrimary, textAlign: 'center', maxWidth: 1500 }}>
          The Money Printer<br />Has Been Running <span style={{ color: COL.gold }}>Since 1971</span>
        </h1>
      ),
    },
    {
      tIn: 5.06, // "QE in 2008 wasn't a new invention"
      node: (
        <p style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, fontSize: '3.1rem', lineHeight: 1.5, color: COL.textPrimary, textAlign: 'center', maxWidth: 1400 }}>
          QE in 2008 wasn't a new invention. It was the final, most visible layer of a money creation system that had been quietly building for <span style={{ color: COL.gold }}>nearly four decades</span>.
        </p>
      ),
    },
    { tIn: 17.36, node: <BigCard accent={COL.gold} tag="Layer 1 — Fiat" num="1971" desc="Nixon closes the gold window. The dollar becomes pure fiat. The hard constraint on money creation is gone forever." /> },
    { tIn: 27.08, node: <BigCard accent={COL.cyan} tag="Layer 2 — Fractional Reserves" num="1971–2008" desc="Banks hold only a fraction of deposits and lend out the rest, multiplying every Fed dollar into several more, quietly, for decades." /> },
    { tIn: 38.66, node: <BigCard accent={COL.red} tag="Layers 3 & 4 — Proto-QE → QE" num="2006–09" desc="Bernanke's Fed begins silent balance sheet expansion in 2006. Crisis hits in 2008. The gloves come off. Bitcoin is born one year later." /> },
  ];

  return (
    <AbsoluteFill style={{ background: COL.bgDeep }}>
      <Audio src={staticFile('qe-poc.m4a')} />
      {/* ambient orbs (persist) */}
      <div style={{ position: 'absolute', width: 620, height: 620, borderRadius: '50%', filter: 'blur(120px)', background: COL.gold, opacity: 0.09, top: -220, right: -160 }} />
      <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', filter: 'blur(120px)', background: COL.red, opacity: 0.08, bottom: -160, left: -120 }} />

      {scenes.map((s, i) => {
        const tOut = scenes[i + 1]?.tIn ?? END;
        const f = 0.35; // fade seconds
        const opacity = interpolate(t, [s.tIn, s.tIn + f, tOut - f, tOut], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (opacity <= 0) return null;
        const scale = interpolate(t, [s.tIn, s.tIn + 0.6], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={i} style={{ justifyContent: 'center', alignItems: 'center', opacity, transform: `scale(${scale})`, padding: 80 }}>
            {s.node}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
