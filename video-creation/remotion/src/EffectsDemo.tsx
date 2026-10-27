// EffectsDemo.tsx: renders ONE effects-library device (video-creation/assets/effects/library.json) by id, over a plausible
// base, WITH its sounds at the row's offsets, so the demo proves the motion + sound pairing. The TransitionDemo
// pattern: one composition, `id` (+ optional `variant`) props, calculateMetadata sizes it per device.
// Render with the MINIMAL public dir (never the whole assets tree):
//   npx remotion render src/index.ts EffectsDemo out.mp4 --props='{"id":"kt-side-panel","variant":"dark"}'
//     --public-dir ../assets/effects/_demo/pub
// The public dir mirrors the asset paths: themes/kinetic-text-2023/{textures,graphics}/..., sfx/kinetic-text/...
// (the suede backdrop as suede-turquoise-1080.jpg, the 2023 framing pre-cropped); themes/halloween-2022/...,
// sfx/halloween-2022/..., transitions/lib/shake/*.json (hw-camera-shake) and demo/halloween-2022/ (licence-clean photos).
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import {
  KtClock,
  KtHeadlineOverBroll,
  KtIconPop,
  KtKeywordPop,
  KtListCard,
  KtLowerThirdBand,
  KtScatterWords,
  KtSfx,
  KtSidePanel,
  KtSoundCue,
  KtSubscribeClose,
  KtWhipCut,
  KtWordByWord,
  ktBandFaceLift,
  ktHeadlineOverBrollSounds,
  ktIconPopSounds,
  ktKeywordPopSounds,
  ktListCardSounds,
  ktLowerThirdBandSounds,
  ktScatterWordsSounds,
  ktSfxFile,
  ktSidePanelShift,
  ktSidePanelSounds,
  ktSubscribeCloseSounds,
  ktWhipCutSounds,
  ktWordByWordSounds,
  KtWhipVariant,
} from './effects/kinetic-text';
import {
  HwAlphaPlate,
  HwBloodPromo,
  HwBloodTitle,
  HwCameraShake,
  HwDropBounce,
  HwLookLayer,
  HwPromoScene,
  HwSlide,
  HwSplitPanels,
  HwSubscribeLikeBell,
  HwVideoAt,
  HwWordPop,
  HwZoomPunch,
  HwZoomSlideshow,
  hwBloodPromoDuration,
  hwBloodPromoSounds,
  hwBloodTitleSounds,
  hwCameraShakeSounds,
  hwDropBounceSounds,
  hwSfxPath,
  hwSplitPanelsSounds,
  hwSubscribeLikeBellSounds,
  hwWordPopSounds,
  hwZoomPunchSounds,
  hwZoomSlideshowDuration,
  hwZoomSlideshowSounds,
} from './effects/halloween-2022';
import { loadFont as loadLato } from '@remotion/google-fonts/Lato';

loadMontserrat('italic', { weights: ['800'], subsets: ['latin'] });
// halloween-2022: Montserrat Black (the promo titles) + Lato Black (the slideshow titles; the AE template used Lato-Heavy)
loadMontserrat('normal', { weights: ['900'], subsets: ['latin'] });
loadLato('normal', { weights: ['900'], subsets: ['latin'] });

const TEX = 'themes/kinetic-text-2023/textures/';
const GFX = 'themes/kinetic-text-2023/graphics/';
const sfxSrc = (id: string) => staticFile(`sfx/kinetic-text/${ktSfxFile(id)}`);
// halloween-2022: the demo public dir mirrors assets/effects/themes/halloween-2022/ and assets/sfx/<folder>/; the photos
// are the bench's licence-clean Envato items 12-14 (chapel clip + stills, never a bear), under demo/halloween-2022/
const HW_TEX = 'themes/halloween-2022/textures/';
const HW_GFX = 'themes/halloween-2022/graphics/';
const HW_DEMO = 'demo/halloween-2022/';
const hwSfxSrc = (id: string) => staticFile(`sfx/${hwSfxPath(id)}`);
const hwMatte = (n: number) => staticFile(`${HW_GFX}matte-t${n}.mp4`);
const hwBlood = (n: 1 | 2) => ({ fill: staticFile(`${HW_GFX}blood-${n}-fill.mp4`), key: staticFile(`${HW_GFX}blood-${n}-key.mp4`) });

// ----------------------------------------------------------------------------------------------------------------------
// BASES
// ----------------------------------------------------------------------------------------------------------------------

/** The 2023 backdrop: the suede photo at its default Motion (the centre 3840x2160 of the 5616x3744 photo at 50 percent),
 * never moves. The demo public dir carries that framing pre-cropped (suede-turquoise-1080.jpg): the 21 MP original,
 * decoded once per shutter sample inside a whip, timed out the render. A face-sized placeholder on top (the keyed
 * presenter), which the comp moves. */
const FaceBase: React.FC<{ x?: number; y?: number; scale?: number }> = ({ x = 0, y = 0, scale = 1 }) => (
  <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#55AC9C' }}>
    <Img src={staticFile(`${TEX}suede-turquoise-1080.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} />
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5260" />
            <stop offset="1" stopColor="#2c323b" />
          </linearGradient>
          <radialGradient id="head" cx="0.45" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#c9a48b" />
            <stop offset="1" stopColor="#9c7a64" />
          </radialGradient>
        </defs>
        <path d="M 470 1080 C 500 860 690 742 960 736 C 1230 742 1420 860 1450 1080 Z" fill="url(#shirt)" />
        <rect x={900} y={590} width={120} height={170} rx={40} fill="#a9876f" />
        <ellipse cx={960} cy={430} rx={150} ry={188} fill="url(#head)" />
        <path d="M 812 400 C 815 250 900 205 960 205 C 1030 205 1110 250 1108 400 C 1080 320 1030 290 960 292 C 890 290 840 320 812 400 Z" fill="#3b2a22" />
        <text x={960} y={1010} textAnchor="middle" fontFamily="Arial" fontSize={26} fill="rgba(255,255,255,0.35)">FACE PLACEHOLDER</text>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

/** A dark gradient stand-in for a b-roll shot with a lit subject in the middle (so a reframe / whip reads). */
const BrollBase: React.FC<{ x?: number; tint?: string; label?: string }> = ({ x = 0, tint = '#1fb6c9', label = 'B-ROLL' }) => {
  const gid = `glow${label.replace(/[^A-Za-z0-9]/g, '')}`;
  return (
  <AbsoluteFill style={{ overflow: 'hidden', background: 'linear-gradient(135deg, #0d2230 0%, #06090e 70%)' }}>
    <AbsoluteFill style={{ transform: `translateX(${x}px)` }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id={gid} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={tint} stopOpacity="0.55" />
            <stop offset="1" stopColor={tint} stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={960} y1={520} x2={-600 + i * 260} y2={1080} stroke={tint} strokeOpacity={0.18} strokeWidth={2} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`u${i}`} x1={960} y1={520} x2={-600 + i * 260} y2={0} stroke={tint} strokeOpacity={0.12} strokeWidth={2} />
        ))}
        {[120, 240, 380].map((r) => (
          <rect key={r} x={960 - r * 1.6} y={520 - r} width={r * 3.2} height={r * 2} fill="none" stroke={tint} strokeOpacity={0.22} strokeWidth={3} />
        ))}
        <circle cx={960} cy={520} r={330} fill={`url(#${gid})`} />
        <circle cx={960} cy={520} r={150} fill="none" stroke={tint} strokeWidth={10} strokeOpacity={0.85} />
        <circle cx={960} cy={520} r={70} fill={tint} fillOpacity={0.7} />
        <text x={1840} y={1050} textAnchor="end" fontFamily="Arial" fontSize={26} fill="rgba(255,255,255,0.3)">{label}</text>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
  );
};

/** halloween-2022 face stand-in: the seated-Mike set of Bear Markets is dark (wood ceiling, blue / purple light); a
 * silhouette on a dark blue-purple gradient (the camera shake / punch / bounce devices move this picture). */
const HwFaceBase: React.FC<{ x?: number; y?: number; scale?: number; tint?: string }> = ({ x = 0, y = 0, scale = 1, tint = '#3a2a7a' }) => (
  <AbsoluteFill style={{ overflow: 'hidden', background: `radial-gradient(ellipse at 70% 30%, ${tint} 0%, #14102e 55%, #07060f 100%)` }}>
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: '50% 50%' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="hwshirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d1d24" />
            <stop offset="1" stopColor="#0c0c10" />
          </linearGradient>
          <radialGradient id="hwhead" cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#c99a84" />
            <stop offset="1" stopColor="#7e5c4c" />
          </radialGradient>
        </defs>
        {[...Array(9)].map((_, i) => (
          <rect key={i} x={0} y={i * 34} width={640 - i * 40} height={30} fill="#5a3b22" opacity={0.35} />
        ))}
        <path d="M 520 1080 C 550 860 720 750 960 744 C 1200 750 1370 860 1400 1080 Z" fill="url(#hwshirt)" />
        <rect x={905} y={600} width={110} height={160} rx={40} fill="#8a6654" />
        <ellipse cx={960} cy={440} rx={142} ry={180} fill="url(#hwhead)" />
        <path d="M 812 420 C 790 250 900 196 960 196 C 1040 196 1140 250 1112 420 C 1090 330 1030 300 960 302 C 890 300 834 330 812 420 Z" fill="#20140f" />
        <circle cx={905} cy={430} r={9} fill="#2b1d17" />
        <circle cx={1015} cy={430} r={9} fill="#2b1d17" />
        <text x={960} y={1050} textAnchor="middle" fontFamily="Arial" fontSize={26} fill="rgba(255,255,255,0.35)">FACE PLACEHOLDER</text>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ----------------------------------------------------------------------------------------------------------------------
// DEMO ICONS (flat red / white with a black outline and a light-grey blob, the 2023 template colours; no 2023 art
// survives, a video renders its own)
// ----------------------------------------------------------------------------------------------------------------------
const OUT = { stroke: '#111', strokeWidth: 7, strokeLinejoin: 'round' as const };

const RocketIcon: React.FC = () => (
  <svg viewBox="0 0 320 307" width="100%" height="100%">
    <circle cx={190} cy={110} r={92} fill="#E8EBEB" />
    <g transform="rotate(38 160 160)">
      <path d="M160 30 C 200 70 210 140 200 210 L 120 210 C 110 140 120 70 160 30 Z" fill="#fff" {...OUT} />
      <path d="M160 30 C 182 52 194 78 198 104 L 122 104 C 126 78 138 52 160 30 Z" fill="#E70001" {...OUT} />
      <circle cx={160} cy={145} r={20} fill="#fff" {...OUT} />
      <path d="M120 170 L 84 236 L 124 216 Z" fill="#E70001" {...OUT} />
      <path d="M200 170 L 236 236 L 196 216 Z" fill="#E70001" {...OUT} />
      <path d="M140 212 L 160 270 L 180 212 Z" fill="#E70001" {...OUT} />
    </g>
    <path d="M40 250 l8 -14 l8 14 l-8 14 Z" fill="#111" />
    <path d="M270 230 l6 -10 l6 10 l-6 10 Z" fill="#111" />
  </svg>
);

const GaugeIcon: React.FC = () => (
  <svg viewBox="0 0 267 228" width="100%" height="100%">
    <circle cx={150} cy={118} r={100} fill="#E8EBEB" />
    <circle cx={128} cy={118} r={92} fill="#fff" {...OUT} />
    <path d="M128 26 A 92 92 0 0 1 220 118 L 186 118 A 58 58 0 0 0 128 60 Z" fill="#E70001" {...OUT} />
    <path d="M220 118 A 92 92 0 0 1 128 210 L 128 176 A 58 58 0 0 0 186 118 Z" fill="#E70001" {...OUT} />
    <circle cx={128} cy={118} r={58} fill="#fff" {...OUT} />
    <path d="M128 118 L 168 82" stroke="#111" strokeWidth={10} strokeLinecap="round" />
    <circle cx={128} cy={118} r={11} fill="#111" />
  </svg>
);

const CoinsIcon: React.FC = () => (
  <svg viewBox="0 0 218 230" width="100%" height="100%">
    <circle cx={120} cy={120} r={98} fill="#E8EBEB" />
    <circle cx={92} cy={92} r={58} fill="#fff" {...OUT} />
    <text x={92} y={114} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={64} fill="#111">$</text>
    <circle cx={140} cy={150} r={52} fill="#E70001" {...OUT} />
    <circle cx={140} cy={136} r={18} fill="#fff" {...OUT} />
    <path d="M110 192 C 112 166 168 166 170 192" fill="#fff" {...OUT} />
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg viewBox="0 0 240 220" width="100%" height="100%">
    <circle cx={128} cy={112} r={100} fill="#E8EBEB" />
    <circle cx={120} cy={110} r={80} fill="#fff" {...OUT} />
    <path d="M120 30 A 80 80 0 0 1 200 110 L 120 110 Z" fill="#E70001" {...OUT} />
    <ellipse cx={120} cy={110} rx={36} ry={80} fill="none" {...OUT} />
    <line x1={40} y1={110} x2={200} y2={110} {...OUT} />
    <path d="M52 70 C 90 84 150 84 188 70" fill="none" {...OUT} />
    <path d="M52 150 C 90 136 150 136 188 150" fill="none" {...OUT} />
  </svg>
);

// ----------------------------------------------------------------------------------------------------------------------
// THE DEMO SPECS (seconds on the demo clock = frame / fps)
// ----------------------------------------------------------------------------------------------------------------------
type Spec = { dur: number; render: (t: number) => React.ReactNode; sounds: KtSoundCue[]; sfx?: (id: string) => string };

const specFor = (id: string, variant?: string): Spec | null => {
  switch (id) {
    case 'kt-side-panel': {
      if (variant === 'paper' || variant === 'paper-card') {
        const t0 = 0.5;
        const cards = [
          { t: 0.5, lines: ['CUSTOMER', 'INTERVIEW'], icon: <CoinsIcon /> },
          { t: 2.667, lines: ['SEO', 'STRATEGIES'], icon: <GlobeIcon /> },
        ];
        const t1 = 5.167;
        return {
          dur: 5.6,
          sounds: ktSidePanelSounds({ t0, texture: 'paper', cards }),
          render: (t) => {
            const sh = t < t1 ? ktSidePanelShift(t, t0, { texture: 'paper' }) : { x: 0, scale: 1 };
            return (
              <>
                <BrollBase x={sh.x} />
                <KtSidePanel t0={t0} t1={t1} texture="paper" paperSrc={staticFile(`${TEX}paper-crumpled.mp4`)} cards={cards} />
              </>
            );
          },
        };
      }
      if (variant === 'paper-label') {
        const a = { t0: 0.6, t1: 2.6, lines: ['BIAS TOWARDS', 'TECHNOLOGY'], color: '#E70001', delay: 0.167 };
        const b = { t0: 3.0, t1: 5.2, lines: ['BIAS TOWARDS', 'BUSINESS', 'AND PEOPLE'], color: '#030AF4', delay: 0.133 };
        return {
          dur: 5.4,
          sounds: [...ktSidePanelSounds({ t0: a.t0, texture: 'paper' }), ...ktSidePanelSounds({ t0: b.t0, texture: 'paper' })],
          render: (t) => {
            const cur = t < a.t1 ? a : t >= b.t0 && t < b.t1 ? b : null;
            const sh = cur ? ktSidePanelShift(t, cur.t0, { texture: 'paper', px: cur === a ? 706 : 549 }) : { x: 0, scale: 1 };
            return (
              <>
                <BrollBase x={sh.x} tint={cur === b ? '#7fd6a0' : '#1fb6c9'} />
                {cur && (
                  <KtSidePanel t0={cur.t0} t1={cur.t1} texture="paper" paperSrc={staticFile(`${TEX}paper-crumpled.mp4`)} lines={cur.lines} labelColor={cur.color} labelDelay={cur.delay} />
                )}
              </>
            );
          },
        };
      }
      // dark (default): RIGHT first use, LEFT the next (a new shot)
      const R = { t0: 0.6, t1: 3.2, lines: ['*GROWTH*', '*HACKER IS MORE*', 'ASSOCIATED', '*WITH* SPEED'] };
      const L = { t0: 3.2, t1: 6.0, lines: ['*GROWTH*', '*MARKETER*', '*IS MORE*', 'BRAND', 'ORIENTED'] };
      return {
        dur: 6.0,
        sounds: [...ktSidePanelSounds({ t0: R.t0, side: 'R' }), ...ktSidePanelSounds({ t0: L.t0, side: 'L' })],
        render: (t) => {
          const right = t < L.t0;
          const sh = right ? ktSidePanelShift(t, R.t0, { side: 'R' }) : ktSidePanelShift(t, L.t0, { side: 'L' });
          return (
            <>
              <FaceBase x={sh.x} scale={sh.scale} />
              {right ? (
                <KtSidePanel t0={R.t0} t1={R.t1} side="R" lines={R.lines} textureSrc={staticFile(`${TEX}animated-texture.mp4`)} />
              ) : (
                <KtSidePanel t0={L.t0} t1={L.t1} side="L" lines={L.lines} textureSrc={staticFile(`${TEX}animated-texture.mp4`)} textureIn={12} />
              )}
            </>
          );
        },
      };
    }

    case 'kt-keyword-pop': {
      if (variant === 'punch-red') {
        const hits = [1.0, 3.0];
        return {
          dur: 4.6,
          sounds: hits.flatMap((h) => ktKeywordPopSounds({ t0: h, variant: 'punch-red' })),
          render: (t) => (
            <>
              <BrollBase />
              {hits.map((h) => (
                <KtKeywordPop key={h} t0={h} t1={h + 0.633} variant="punch-red" lines={['CONVERSIONS']} />
              ))}
            </>
          ),
        };
      }
      if (variant === 'punch-white') {
        const a = { t0: 0.8, t1: 1.933, lines: ['TECHNICAL', 'SKILLS'] };
        const b = { t0: 2.6, t1: 3.733, lines: ['CUSTOMER', 'OBSESSED'] };
        return {
          dur: 4.5,
          sounds: [...ktKeywordPopSounds({ t0: a.t0, variant: 'punch-white' }), ...ktKeywordPopSounds({ t0: b.t0, variant: 'punch-white', punch: 'punch-sound-effect' })],
          render: (t) => (
            <>
              <BrollBase tint={t < 2.0 ? '#1fb6c9' : '#d9a05b'} label={t < 2.0 ? 'B-ROLL A' : 'B-ROLL B'} />
              <KtKeywordPop t0={a.t0} t1={a.t1} variant="punch-white" lines={a.lines} />
              <KtKeywordPop t0={b.t0} t1={b.t1} variant="punch-white" lines={b.lines} seed={3} />
            </>
          ),
        };
      }
      const a = { t0: 0.6, t1: 2.8, lines: ['TACTICS THAT', 'GUARANTEE ATTRIBUTION'] };
      const b = { t0: 3.1, t1: 5.3, lines: ['*POORLY*', 'ATTRIBUTABLE'] };
      return {
        dur: 5.5,
        sounds: [...ktKeywordPopSounds({ t0: a.t0, meaning: 'neutral' }), ...ktKeywordPopSounds({ t0: b.t0, meaning: 'negative' })],
        render: () => (
          <>
            <FaceBase />
            <KtKeywordPop t0={a.t0} t1={a.t1} lines={a.lines} />
            <KtKeywordPop t0={b.t0} t1={b.t1} lines={b.lines} />
          </>
        ),
      };
    }

    case 'kt-headline-over-broll': {
      const cutA = 0.6;
      const cutB = 3.5;
      const A = { t0: cutA + 0.8, t1: cutB, lines: ['LEAD'] };
      const B = { t0: cutB + 0.8, t1: 6.0, lines: ['WHETHER OR NOT AN', 'EXPERIMENT WAS SUCCESSFUL'] };
      return {
        dur: 6.0,
        sounds: [
          ...ktHeadlineOverBrollSounds({ cutT: cutA, t0: A.t0, cut: 'ea-glitch-21', word: 'cash-register' }),
          ...ktHeadlineOverBrollSounds({ cutT: cutB, t0: B.t0, cut: 'swoosh-3', word: 'twinkle' }),
        ],
        render: (t) => (
          <>
            {t < cutA ? (
              <FaceBase />
            ) : t < cutB ? (
              <KtWhipCut t0={cutA}>
                <BrollBase label="B-ROLL A" />
              </KtWhipCut>
            ) : (
              <KtWhipCut t0={cutB}>
                <BrollBase tint="#d9a05b" label="B-ROLL B" />
              </KtWhipCut>
            )}
            <KtHeadlineOverBroll t0={A.t0} t1={A.t1} lines={A.lines} />
            <KtHeadlineOverBroll t0={B.t0} t1={B.t1} lines={B.lines} />
          </>
        ),
      };
    }

    case 'kt-word-by-word': {
      const run1 = { phrases: [{ t: 0.5, text: 'THE EXPERIMENT SHOULD BE' }, { t: 1.36, text: 'SCRAPED OR' }], payoff: { t: 1.93, text: 'SCALED UP' }, t1: 2.93 };
      const run2 = { phrases: [{ t: 3.2, text: 'WHEN GROWTH HACKERS' }, { t: 3.9, text: 'TALK ABOUT' }], payoff: { t: 4.5, text: 'CONVERSIONS' }, t1: 5.133 };
      return {
        dur: 5.5,
        sounds: [...ktWordByWordSounds({ payoffT: run1.payoff.t }), ...ktKeywordPopSounds({ t0: run2.payoff.t, variant: 'punch-red' })],
        render: () => (
          <>
            <BrollBase />
            <KtWordByWord t0={0.5} t1={run1.t1} phrases={run1.phrases} payoff={run1.payoff} />
            <KtWordByWord t0={3.2} t1={run2.t1} phrases={run2.phrases} payoff={run2.payoff} payoffMotion="bounce" payoffColor="#E70001" />
          </>
        ),
      };
    }

    case 'kt-lower-third-band': {
      const t0 = 0.5;
      const swaps = [{ t: 3.4, lines: ['THEREFORE, THE BUSINESS IMPACT', 'OF A SINGLE TACTIC'] }];
      return {
        dur: 6.0,
        sounds: ktLowerThirdBandSounds({ t0, swaps }),
        render: (t) => (
          <>
            <FaceBase y={ktBandFaceLift(t, t0, swaps.map((s) => s.t))} />
            <KtLowerThirdBand
              t0={t0}
              t1={6.0}
              lines={['ULTIMATE GOAL IS TO BUILD A', '*CONSISTENT EXPERIENCE* FOR', 'THOSE WHO SEE THE BRAND']}
              swaps={swaps}
              textureSrc={staticFile(`${TEX}animated-texture.mp4`)}
            />
          </>
        ),
      };
    }

    case 'kt-whip-cut': {
      const v = (variant || 'default') as KtWhipVariant;
      if (v === 'open') {
        const opens = [0.0, 2.5];
        return {
          dur: 5.0,
          sounds: opens.flatMap((o) => ktWhipCutSounds({ t0: o, variant: 'open' })),
          render: (t) => (
            <KtWhipCut t0={t >= opens[1] ? opens[1] : opens[0]} variant="open">
              <FaceBase />
            </KtWhipCut>
          ),
        };
      }
      const c1 = 1.0;
      const c2 = 3.2;
      return {
        dur: 5.0,
        sounds: [...ktWhipCutSounds({ t0: c1, variant: v }), ...ktWhipCutSounds({ t0: c2, variant: v, sound: v === 'default' ? 'fast-reverse-1' : 'whoosh-4' })],
        render: (t) =>
          t < c1 ? (
            <FaceBase />
          ) : t < c2 ? (
            <KtWhipCut t0={c1} variant={v}>
              <BrollBase />
            </KtWhipCut>
          ) : (
            <KtWhipCut t0={c2} variant={v}>
              <FaceBase />
            </KtWhipCut>
          ),
      };
    }

    case 'kt-list-card': {
      const t0 = 0.8;
      const items = [
        { t: t0 + 0.567, lines: ['TWEET'] },
        { t: t0 + 1.333, lines: ['PODCAST', 'INTERVIEW'] },
      ];
      const t1 = t0 + 3.533;
      return {
        dur: 5.0,
        sounds: ktListCardSounds({ t0, items }),
        render: () => (
          <>
            <FaceBase />
            <KtListCard t0={t0} t1={t1} items={items} paperSrc={staticFile(`${TEX}paper-crumpled.mp4`)} />
          </>
        ),
      };
    }

    case 'kt-icon-pop': {
      const r = { t0: 0.8, t1: 5.1 };
      const g = { t0: 3.567, t1: 5.1 };
      return {
        dur: 5.4,
        sounds: [...ktIconPopSounds({ t0: r.t0, preset: 'rocket-left' }), ...ktIconPopSounds({ t0: g.t0, preset: 'gauge-right' })],
        render: () => (
          <>
            <FaceBase />
            <KtIconPop t0={r.t0} t1={r.t1} preset="rocket-left" icon={<RocketIcon />} />
            <KtIconPop t0={g.t0} t1={g.t1} preset="gauge-right" icon={<GaugeIcon />} />
          </>
        ),
      };
    }

    case 'kt-subscribe-close': {
      const t0 = 0.6;
      return {
        dur: 5.5,
        sounds: ktSubscribeCloseSounds({ t0 }),
        render: () => (
          <>
            <FaceBase />
            <KtSubscribeClose t0={t0} t1={5.5} buttonSrc={staticFile(`${GFX}subscribe-button-alt.mp4`)} arrowSrc={staticFile(`${GFX}arrow-red.png`)} />
          </>
        ),
      };
    }

    case 'kt-scatter-words': {
      const words = [
        { t: 0.8, text: 'CONDUCTING', anchor: 'right-of-head' as const },
        { t: 1.2, text: 'ANALYZING', anchor: 'left-of-head' as const },
        { t: 2.3, text: ['USING QUALITATIVE', 'CUSTOMER RESEARCH'], anchor: 'chest' as const },
      ];
      return {
        dur: 5.5,
        sounds: ktScatterWordsSounds({ words }),
        render: () => (
          <>
            <FaceBase />
            <KtScatterWords t0={0.8} t1={5.2} words={words} />
          </>
        ),
      };
    }

    // ==================================================================================================================
    // THEME halloween-2022 (Bear Markets 2022, 0:00-1:50). Photos = bench items 12-14 only (licence-clean, no bears).
    // ==================================================================================================================

    case 'hw-word-pop': {
      // Bear Markets 16.933-19.567 re-timed to start at 0.6 s: in / out points and pop delays exactly as the project
      // (0.063 s at 75 percent before the pop, 'In January' 0.163 s)
      const off = 16.933 - 0.6;
      // (x = the measured per-word centres of the 2022 frames)
      const src = [
        { t: 16.933, t1: 17.367, text: 'All-time', d: 0.063, x: 954 },
        { t: 17.367, t1: 17.7, text: 'Record', d: 0.063, x: 935 },
        { t: 17.7, t1: 17.967, text: 'Close', d: 0.063, x: 924 },
        { t: 18.4, t1: 18.967, text: 'Established', d: 0.063, x: 914 },
        { t: 18.967, t1: 19.567, text: 'In January', d: 0.163, x: 938 },
      ];
      const words = src.map((w) => ({ t: w.t - off, t1: w.t1 - off, text: w.text, popDelay: w.d, x: w.x }));
      return {
        dur: 3.6,
        sfx: hwSfxSrc,
        sounds: hwWordPopSounds({ words }),
        render: () => (
          <>
            <HwFaceBase tint="#1d3b8a" />
            <HwWordPop t1={3.6} words={words} />
          </>
        ),
      };
    }

    case 'hw-zoom-slideshow': {
      const t0 = 0.5;
      const slides: HwSlide[] = [
        { src: staticFile(`${HW_DEMO}chapel-a.jpg`), title: 'Market Crash' },
        { src: staticFile(`${HW_DEMO}scarecrow.jpg`), title: 'Stock Market' },
        { src: staticFile(`${HW_DEMO}burning-man.jpg`), title: 'Decline' },
        { src: staticFile(`${HW_DEMO}chapel-b.jpg`), title: 'Recent Peak' },
      ];
      const len = hwZoomSlideshowDuration(slides);
      const leaks = [1, 2, 3, 4, 5, 6].map((i) => staticFile(`${HW_TEX}leak-${i}.mp4`));
      return {
        dur: t0 + len + 0.5,
        sfx: hwSfxSrc,
        sounds: hwZoomSlideshowSounds({ t0, slides }),
        render: (t) => (
          <>
            <HwFaceBase />
            {t >= t0 && t < t0 + len && <HwZoomSlideshow t0={t0} slides={slides} leakSrcs={leaks} />}
          </>
        ),
      };
    }

    case 'hw-blood-promo': {
      const t0 = 0.3;
      const scenes: HwPromoScene[] = [
        { kind: 'diagonal', src: staticFile(`${HW_DEMO}chapel.mp4`), video: true, title: 'Oct 29, 1929', uppercase: false, titleCaps: 132 },
        { kind: 'panels', src: staticFile(`${HW_DEMO}scarecrow.jpg`), title: 'S&P 500', titleCaps: 106 },
        { kind: 'panels', src: staticFile(`${HW_DEMO}burning-man.jpg`), title: 'Decline', subtitle: '44.67%', titleCaps: 110, bloodX: 789, bloodY: 450 },
      ];
      const len = hwBloodPromoDuration(scenes);
      return {
        dur: t0 + len + 0.3,
        sfx: hwSfxSrc,
        sounds: hwBloodPromoSounds({ t0, scenes }),
        render: () => (
          <HwBloodPromo
            t0={t0}
            scenes={scenes}
            matteSrc={hwMatte}
            bloodSrc={hwBlood}
            squareSrc={staticFile(`${HW_TEX}square-motion.mp4`)}
            particlesSrc={staticFile(`${HW_TEX}particles.mp4`)}
          />
        ),
      };
    }

    case 'hw-split-panels': {
      if (variant === 'vertical') {
        const t0 = 0;
        const t1 = 2.2;
        return {
          dur: 2.2,
          sfx: hwSfxSrc,
          sounds: hwSplitPanelsSounds({ t0 }),
          render: () => (
            <HwSplitPanels
              t0={t0}
              t1={t1}
              variant="vertical"
              matteSrc={hwMatte}
              squareSrc={staticFile(`${HW_TEX}square-motion.mp4`)}
              scene={() => <Img src={staticFile(`${HW_DEMO}scarecrow.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' }} />}
            />
          ),
        };
      }
      // 'diagonal' = promo scene 1's look (main footage + the red corner panels); 'diagonal-red' adds scene 2's red-tinted
      // second image on the '/' band
      const t0 = 0;
      const t1 = 3.6;
      const second = variant === 'diagonal-red';
      return {
        dur: 3.6,
        sfx: hwSfxSrc,
        sounds: hwSplitPanelsSounds({ t0 }),
        render: (t) => (
          <HwSplitPanels
            t0={t0}
            t1={t1}
            variant="diagonal"
            matteSrc={hwMatte}
            squareSrc={staticFile(`${HW_TEX}square-motion.mp4`)}
            scene={() => <HwVideoAt src={staticFile(`${HW_DEMO}chapel.mp4`)} sec={Math.max(0, t - t0)} />}
            scene2={
              second
                ? () => <Img src={staticFile(`${HW_DEMO}scarecrow.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' }} />
                : undefined
            }
          />
        ),
      };
    }

    case 'hw-blood-title': {
      const t0 = 0.3;
      const t1 = 2.5;
      return {
        dur: 2.7,
        sfx: hwSfxSrc,
        sounds: hwBloodTitleSounds({ t0 }),
        render: () => (
          <>
            <HwLookLayer look="bw" vignette={0.75}>
              <Img src={staticFile(`${HW_DEMO}burning-man.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, objectFit: 'cover' }} />
            </HwLookLayer>
            <HwBloodTitle t0={t0} t1={t1} title="Decline" subtitle="44.67%" caps={110} bloodFill={hwBlood(2).fill} bloodKey={hwBlood(2).key} bloodX={789} bloodY={450} />
          </>
        ),
      };
    }

    case 'hw-camera-shake': {
      // Bear Markets 47.800 (2x, 2.7 s) then a hard cut to 61.367 (3x, 3.3 s): each instance starts its track at t = 0
      const a = { t0: 0.0, t1: 2.7 };
      const b = { t0: 2.7, t1: 6.0 };
      return {
        dur: 6.0,
        sfx: hwSfxSrc,
        sounds: [...hwCameraShakeSounds({ t0: a.t0 }), ...hwCameraShakeSounds({ t0: b.t0 })],
        render: () => (
          <>
            <HwCameraShake t0={a.t0} t1={a.t1} strength="2x" clip={() => <HwFaceBase scale={1.2} y={-60} />} />
            <HwCameraShake t0={b.t0} t1={b.t1} strength="3x" clip={() => <HwFaceBase scale={1.3} y={-107} tint="#5a2a6a" />} />
          </>
        ),
      };
    }

    case 'hw-drop-bounce': {
      const cut = 0.8;
      return {
        dur: 2.0,
        sfx: hwSfxSrc,
        sounds: hwDropBounceSounds({ t0: cut }),
        render: (t) =>
          t < cut ? (
            <HwFaceBase />
          ) : (
            <HwDropBounce t0={cut}>
              <HwFaceBase x={180} />
            </HwDropBounce>
          ),
      };
    }

    case 'hw-zoom-punch': {
      const t0 = 0.8;
      return {
        dur: 2.4,
        sfx: hwSfxSrc,
        sounds: hwZoomPunchSounds({ t0 }),
        render: () => (
          <HwZoomPunch t0={t0}>
            <HwFaceBase />
          </HwZoomPunch>
        ),
      };
    }

    case 'hw-subscribe-like-bell': {
      const t0 = 0.5;
      return {
        dur: 4.6,
        sfx: hwSfxSrc,
        sounds: hwSubscribeLikeBellSounds({ t0 }),
        render: () => (
          <>
            <HwFaceBase />
            <HwSubscribeLikeBell t0={t0} fillSrc={staticFile(`${HW_GFX}subscribe-like-bell-fill.mp4`)} keySrc={staticFile(`${HW_GFX}subscribe-like-bell-key.mp4`)} />
          </>
        ),
      };
    }
    default:
      return null;
  }
};

export type EffectsDemoProps = { id: string; variant?: string };

export const EffectsDemo: React.FC<EffectsDemoProps> = ({ id, variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const spec = React.useMemo(() => specFor(id, variant), [id, variant]);
  if (!spec) {
    return (
      <AbsoluteFill style={{ backgroundColor: 'crimson', color: 'white', fontSize: 48, justifyContent: 'center', alignItems: 'center' }}>
        unknown effect id: {id} {variant ?? ''}
      </AbsoluteFill>
    );
  }
  return (
    <KtClock.Provider value={{ t }}>
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        {spec.render(t)}
        <KtSfx cues={spec.sounds} src={spec.sfx ?? sfxSrc} />
      </AbsoluteFill>
    </KtClock.Provider>
  );
};

/** Composition length for an id (+ variant), used by Root's calculateMetadata. */
export const effectsDemoDurationFrames = (id: string, variant: string | undefined, fps: number) => {
  const s = specFor(id, variant);
  return Math.round((s ? s.dur : 2) * fps);
};
