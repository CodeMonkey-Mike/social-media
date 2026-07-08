import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from 'remotion';
import { SM_CHARTS } from './smChartsData';
import { SmChart } from './SmCharts';

export const SMK_FPS = 30;
export const SMK_DURATION = 11875; // spine ALL.c.desilenced.mp4 = 395.83s @30

const chart = (key: string) => SM_CHARTS.find((c) => c.key === key)!;

// kind: chart | still (full-bleed image) | vid (Envato clip) | receipt (readable screenshot, contained)
type Cover = { tIn: number; tOut: number; kind: 'chart' | 'still' | 'vid' | 'receipt'; ref: string };

// Cover layer — every COVER (baked-black) span filled per EDIT-PLAN.md. FACE spans get no cover
// (the baked spine shows the face). The plug showcase is an overlay on the general-brag portion.
const COVERS: Cover[] = [
  // CH1 (COVER 4.4-29.43)
  { tIn: 4.4, tOut: 18.0, kind: 'receipt', ref: 'CH1-entityx-ledger' },
  { tIn: 18.0, tOut: 22.0, kind: 'vid', ref: 'CH1_onchain-network' },
  { tIn: 22.0, tOut: 29.43, kind: 'receipt', ref: 'CH1-richlist' },
  // CH2 (COVER 43.4-107.03)
  { tIn: 43.4, tOut: 62.0, kind: 'chart', ref: 'C13' },
  { tIn: 62.0, tOut: 70.0, kind: 'still', ref: 'CH2-whale-pod' },
  { tIn: 70.0, tOut: 74.0, kind: 'vid', ref: 'CH2_anon-figure' },
  { tIn: 74.0, tOut: 84.0, kind: 'chart', ref: 'C13' },
  { tIn: 84.0, tOut: 93.0, kind: 'chart', ref: 'C3' },
  { tIn: 93.0, tOut: 99.0, kind: 'receipt', ref: 'CH2-dailybuyer-ledger' },
  { tIn: 99.0, tOut: 107.03, kind: 'still', ref: 'CH2-whale-pod' },
  // CH3 hero (COVER 121.2-147.13)
  { tIn: 121.2, tOut: 147.13, kind: 'chart', ref: 'C5' },
  // CH3 (COVER 149.2-167.83)
  { tIn: 149.2, tOut: 159.0, kind: 'still', ref: 'KAS-blockdag' },
  { tIn: 159.0, tOut: 163.0, kind: 'vid', ref: 'CH3_tide-rising' },
  { tIn: 163.0, tOut: 167.83, kind: 'still', ref: 'KAS-blockdag' },
  // CH4 (COVER 176.53-190.27)
  { tIn: 176.53, tOut: 186.0, kind: 'chart', ref: 'C6' },
  { tIn: 186.0, tOut: 190.27, kind: 'vid', ref: 'CH4_red-storm' },
  // CH4 end + CH5 (COVER 197.03-246.1)
  { tIn: 197.03, tOut: 201.0, kind: 'vid', ref: 'CH4_red-storm' },
  { tIn: 201.0, tOut: 209.0, kind: 'still', ref: 'CH5-coins-dissolving' },
  { tIn: 209.0, tOut: 223.0, kind: 'receipt', ref: 'CH5-exchange-holdings' },
  { tIn: 223.0, tOut: 231.0, kind: 'still', ref: 'CH5-coins-dissolving' },
  { tIn: 231.0, tOut: 236.0, kind: 'still', ref: 'KAS-coin-vault' },
  { tIn: 236.0, tOut: 246.1, kind: 'chart', ref: 'C10' },
  // PLUG showcase overlay (general brag only — NOT the 268-279 specific-numbers line)
  { tIn: 279.0, tOut: 315.0, kind: 'receipt', ref: 'CH5-showcase' },
  // CH6 (COVER 323.77-338.2)
  { tIn: 323.77, tOut: 334.0, kind: 'chart', ref: 'C11' },
  { tIn: 334.0, tOut: 338.2, kind: 'vid', ref: 'CH6_pressure' },
  // CH6 (COVER 348.3-354.17)
  { tIn: 348.3, tOut: 354.17, kind: 'still', ref: 'KAS-off-exchange' },
  // CH7 (COVER 365.87-371.73)
  { tIn: 365.87, tOut: 371.73, kind: 'still', ref: 'CH7-whale-breach-dawn' },
  // CH7 (COVER 372.97-376.43)
  { tIn: 372.97, tOut: 376.43, kind: 'vid', ref: 'CH7_whale-swim-sunrise' },
];

const CHAPTERS: { t: number; title: string }[] = [
  { t: 37.0, title: 'Nobody Is Watching The Other Whales' },
  { t: 116.5, title: 'This Has Been Building For Years' },
  { t: 170.5, title: 'They Are Buying The Bottom' },
  { t: 209.0, title: 'The Float Is Vanishing' },
  { t: 323.77, title: 'Why This Matters Now' },
];

// entrance fade+scale shared by still/vid/receipt covers (charts use SmChart's own reveal)
const useEntrance = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(f, [0, 14], [0.97, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  return { opacity, scale };
};

const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  const { opacity, scale } = useEntrance();
  if (c.kind === 'chart') return <SmChart def={chart(c.ref)} />;
  if (c.kind === 'vid')
    return (
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <OffthreadVideo
          src={staticFile('vid/' + c.ref + '.mp4')}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity, transform: `scale(${scale})` }}
        />
      </AbsoluteFill>
    );
  // still = full-bleed cover; receipt = contained (readable) on dark bg
  const fit = c.kind === 'still' ? 'cover' : 'contain';
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1012', justifyContent: 'center', alignItems: 'center' }}>
      <Img
        src={staticFile((c.kind === 'still' ? 'img/' : 'receipts/') + c.ref + '.png')}
        style={{
          width: '100%', height: '100%', objectFit: fit as any,
          opacity, transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame();
  const dur = 40; // ~1.3s
  const op = interpolate(f, [0, 6, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, [0, 10], [26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: 'rgba(10,16,18,0.96)', justifyContent: 'center', alignItems: 'center', opacity: op }}>
      <div style={{ transform: `translateY(${y}px)`, textAlign: 'center', maxWidth: 1500 }}>
        <div style={{ width: 90, height: 5, background: '#49EACB', margin: '0 auto 34px', borderRadius: 3 }} />
        <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", fontWeight: 800, fontSize: 78, color: '#fff', lineHeight: 1.1 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

export const SmartMoneyKaspa: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* spine: baked-gated face/black + audio (VO). Music/SFX mixed on with ffmpeg after render. */}
      <OffthreadVideo src={staticFile('spine.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* cover layer */}
      {COVERS.map((c, i) => (
        <Sequence key={i} from={Math.round(c.tIn * SMK_FPS)} durationInFrames={Math.round((c.tOut - c.tIn) * SMK_FPS)}>
          <CoverEl c={c} />
        </Sequence>
      ))}

      {/* chapter cards */}
      {CHAPTERS.map((ch, i) => (
        <Sequence key={'ch' + i} from={Math.round(ch.t * SMK_FPS)} durationInFrames={40}>
          <ChapterCard title={ch.title} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
