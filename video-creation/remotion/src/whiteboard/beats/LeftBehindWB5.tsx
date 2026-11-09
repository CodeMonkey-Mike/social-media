// whiteboard/beats/LeftBehindWB5.tsx: whiteboard beat WB5 of the longform-edited video `left-behind`
// (brief: media/left-behind/assets/whiteboard/WB5.brief.md; cues: assets/whiteboard/WB5.cues.md).
// "Two lines moving in opposite directions, and the bridge across": from one origin dot two faint dashed guides fan out
// in opposite directions; the WAGES line drifts flat then down (red), the ASSETS line bends up and compounds (green),
// the gap between them shades in. A plank footbridge lays itself from the low line up to the high one; a figure draws
// on at its foot ("the same for everyone") and, as he says "You buy a piece of the side that compounds", walks across it
// onto the high line (the high line passes BEHIND him on the climb, a knockout mask) while "buy assets" types level
// beside the deck on the ONE gold mark of the beat (the CH4 accent #ffd700, a highlighter swash). Three markers land on the high line as named: a coin with a drawn B (Bitcoin), a token coin (a
// hexagon, no ticker: "crypto"), a small office tower standing level on a footing wedge ("companies"). Payoff, on "You own the machine": a blue gear draws
// beside the figure, its hand goes onto it, and the gear turns under the hand to the end of the beat.
// Canvas = the full frame 1920 x 1080 @30, spine 308.780 to 329.320 s = 20.54 s = 616 frames, no audio; the comp build
// fades it in and out. Pen: paper-pastel. Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 308.780), each hung on a spoken word of
// `spine/ALL.d.desilenced.medium-words.json`; a thing draws as he names it, never before. NO numbers on screen (the
// brief): no prices, targets or multipliers, no ticker but the B coin, no Kaspa / TAO marks.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Sketch, prog, easeOut } from '../Sketch';
import { Type } from '../vocab';
import { DashLine } from '../economy';
import { Gear, Highlight, MarkCoin, OfficeTower, PlankBridge, Walker, WalkerKnockout, cubicD, cubicPt, cubicY, type Cubic, type Pt } from '../wealth';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 20.54 s x 30 = 616 frames (spine 308.780 to 329.320) */
export const DUR = 616;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 308.780), the word each cue hangs on ----
const CUES = {
  dot: 0.54,          // "two"           the origin dot
  guideUp: 0.88,      // "lines"         a faint dashed guide fans up-right from the dot (0.5 s)
  guideDown: 1.10,    // "lines" (held)  a faint dashed guide fans down-right (0.5 s)
  headUp: 2.32,       // "opposite"      the up guide's arrowhead
  headDown: 2.72,     // "directions"    the down guide's arrowhead
  wages: 3.80,        // "Wages"         the WAGES line starts: flat, then down (to 5.70); its arrowhead 5.60 to 5.85
  wagesLabel: 5.85,   // "down" (held)   "wages" types at the line's end once the arrowhead has landed
  assets: 6.26,       // "assets"        the ASSETS line bends up (1.3 s, to 7.56); its arrowhead 7.51 to 7.76
  assetsLabel: 7.76,  // "compounding" (held)  "assets" types at the line's end once the arrowhead has landed
  gap: 6.70,          // "compounding"   the gap between the lines shades in, left to right (1.2 s)
  bridge: 8.42,       // "bridge"        the plank bridge lays itself from the low line up to the high one (0.9 s)
  figure: 10.24,      // "everyone"      a figure draws on at the bridge's foot, on the low line, clear of the high one (0.9 s)
  walk: 11.30,        // "You"           the figure walks across the bridge onto the high line (arrives 13.10, "compounds")
  walkEnd: 13.10,
  buy: 11.48,         // "buy"           the gold highlighter swash beside the deck (the ONE gold mark) + "buy assets" types on it
  btc: 14.12,         // "Bitcoin"       a coin with a drawn B lands on the high line
  crypto: 15.42,      // "crypto"        a token coin (hexagon, no ticker) lands on the high line
  companies: 16.66,   // "company's"     a small office tower lands on the high line, its windows fill in on "building" (0.8 s)
  gear: 18.38,        // "own"           the blue gear draws beside the figure (0.55 s)
  reach: 18.62,       // "the"           the figure's hand goes onto the gear (lands 19.02, "machine" 18.84)
  spin: 19.02,        //                 the gear turns under the hand to the end of the beat
};

// ---- layout ----
// The lines fan out fast so the bridge can sit where the gap is ~270 px: the figure (scale 0.7, ~205 px tall) stands at
// its foot with ~60 px of air under the high line. Climbing, the high line passes BEHIND him (a knockout mask), never
// through him; standing on it at the end, it stays whole under his feet. The markers sit along the high line right of
// the gear with ~30 px of air each; the tower stands level on a footing wedge (the line never passes through it).
const O: Pt = [200, 630];
const UP: Cubic = [O, [560, 575], [1090, 450], [1690, 140]];   // assets: slow, then steep
const LO: Cubic = [O, [560, 685], [1090, 820], [1690, 915]];   // wages: flat, then down
const LINE_W = 7;
const A_X = 825, B_X = 1150;                                    // the bridge's feet on the two lines
const BA: Pt = [A_X, cubicY(LO, A_X)];
const BB: Pt = [B_X, cubicY(UP, B_X)];
const FIG_SCALE = 0.7;
const FIG_X0 = 805, FIG_X1 = 1168;                              // the figure: at the bridge's foot -> on the high line
const BTC_X = 1370, TOK_X = 1460, TOWER_X = 1555, TOWER_W = 66;
const upY = (x: number) => cubicY(UP, x);
const LBL = 48;
const BUY_X = 1030, BUY_Y = 730, BUY_W = 232;                   // "buy assets": left, baseline, measured ink width (Kalam 700, 48 px)

/** the walking path: along the low line to the bridge, up the deck, along the high line; sampled + cumulative length */
const PATH: Pt[] = (() => {
  const pts: Pt[] = [];
  for (let x = FIG_X0; x < A_X; x += 5) pts.push([x, cubicY(LO, x)]);
  for (let i = 0; i <= 40; i++) pts.push([BA[0] + ((BB[0] - BA[0]) * i) / 40, BA[1] + ((BB[1] - BA[1]) * i) / 40]);
  for (let x = B_X + 5; x <= FIG_X1; x += 5) pts.push([x, cubicY(UP, x)]);
  return pts;
})();
const CUM: number[] = PATH.reduce<number[]>((acc, p, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p[0] - PATH[i - 1][0], p[1] - PATH[i - 1][1])); return acc; }, []);
const PATH_LEN = CUM[CUM.length - 1];
const along = (d: number): { p: Pt; slope: number } => {
  const dd = Math.max(0, Math.min(PATH_LEN, d));
  let i = 1;
  while (i < CUM.length - 1 && CUM[i] < dd) i++;
  const f = (dd - CUM[i - 1]) / Math.max(1e-6, CUM[i] - CUM[i - 1]);
  const a = PATH[i - 1], b = PATH[i];
  return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], slope: (b[1] - a[1]) / Math.max(1e-6, b[0] - a[0]) };
};

/** the gap between the lines as one polygon (the high line out, the low line back) */
const GAP_D = (() => {
  const up: string[] = [], lo: string[] = [];
  for (let i = 0; i <= 60; i++) { const p = cubicPt(UP, i / 60); up.push(`${p[0].toFixed(1)} ${p[1].toFixed(1)}`); }
  for (let i = 60; i >= 0; i--) { const p = cubicPt(LO, i / 60); lo.push(`${p[0].toFixed(1)} ${p[1].toFixed(1)}`); }
  return `M ${up.join(' L ')} L ${lo.join(' L ')} Z`;
})();

/** an open arrowhead at the end of a cubic, pointing along its last tangent */
const headD = (c: Cubic, size = 26) => {
  const e = c[3], n = cubicPt(c, 0.97), ang = Math.atan2(e[1] - n[1], e[0] - n[0]);
  return `M ${e[0] - size * Math.cos(ang - 0.5)} ${e[1] - size * Math.sin(ang - 0.5)} L ${e[0]} ${e[1]} L ${e[0] - size * Math.cos(ang + 0.5)} ${e[1] - size * Math.sin(ang + 0.5)}`;
};
const rayHead = (x1: number, y1: number, x2: number, y2: number, size = 18) => {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  return `M ${x2 - size * Math.cos(ang - 0.5)} ${y2 - size * Math.sin(ang - 0.5)} L ${x2} ${y2} L ${x2 - size * Math.cos(ang + 0.5)} ${y2 - size * Math.sin(ang + 0.5)}`;
};

export const LeftBehindWB5: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const INK = PEN.colorH, P = PEN.palette;
  const ACCENT = '#ffd700'; // the CH4 accent: the ONE highlight mark of the beat (the brief)
  const lblW = PEN.charWL;
  const WAGES_C = '#d9534f', ASSETS_C = '#3f9b4a'; // the pen's red / green roles, deepened for a 7 px chart line on white

  // ---- the walk ----
  const wk = interpolate(T, [CUES.walk, CUES.walkEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  const dist = wk * PATH_LEN;
  const pos = along(dist);
  const STEP = 88;
  const phase = (dist / STEP) * Math.PI;
  // a shorter stride on the steep deck (a full stride would lift the front foot to the hip)
  const stride = Math.min(1, wk * 8, (1 - wk) * 8) / (1 + 0.5 * Math.abs(pos.slope));
  const figX = pos.p[0], figGy = pos.p[1];

  // ---- the gear beside the figure's final spot, at hand height ----
  const endGy = cubicY(UP, FIG_X1);
  const HAND: Pt = [FIG_X1 + 63, endGy - 112];
  const GEAR = { cx: HAND[0] + 36, cy: HAND[1] - 2, r: 28 };
  const spin = Math.max(0, at(CUES.spin)) * 45;
  const reach = prog(T, CUES.reach, 0.4);

  const walker = { x: figX, gy: figGy, t: at(CUES.figure), pen: PEN, seed: 31, shirt: P.green, phase, stride, slope: pos.slope, reach, hand: HAND, scale: FIG_SCALE, dur: 0.9 };

  // ---- the line draws ----
  const loP = easeOut(prog(T, CUES.wages, 1.9));
  const upP = prog(T, CUES.assets, 1.3);
  const assetsHead = at(CUES.assets + 1.25);
  const gapP = easeOut(prog(T, CUES.gap, 1.2));

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* the high line passes BEHIND the figure: knock his silhouette out of the line */}
          <mask id="wb5-ko" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect x={0} y={0} width={W} height={H} fill="white" />
            <WalkerKnockout {...walker} />
          </mask>
          <clipPath id="wb5-gap"><rect x={O[0] - 10} y={0} width={(1700 - O[0] + 20) * gapP} height={H} /></clipPath>
        </defs>
        {PEN.floor && <rect x={0} y={1000} width={W} height={H - 1000} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: two lines, opposite directions ===== */}
          {gapP > 0 && <path d={GAP_D} fill={P.grey} opacity={0.38} clipPath="url(#wb5-gap)" />}
          <DashLine x1={O[0] + 14} y1={O[1] - 6} x2={470} y2={470} t={at(CUES.guideUp)} pen={PEN} seed={2} color={'#b8b8b8'} dur={0.5} strokeWidth={3} />
          <DashLine x1={O[0] + 14} y1={O[1] + 6} x2={470} y2={790} t={at(CUES.guideDown)} pen={PEN} seed={3} color={'#b8b8b8'} dur={0.5} strokeWidth={3} />
          {at(CUES.headUp) > 0 && <Sketch pen={PEN} seed={4} stroke={'#b8b8b8'} strokeWidth={3} roughness={0.4} progress={easeOut(prog(at(CUES.headUp), 0, 0.3))} shape={{ kind: 'path', d: rayHead(O[0], O[1], 470, 470) }} />}
          {at(CUES.headDown) > 0 && <Sketch pen={PEN} seed={5} stroke={'#b8b8b8'} strokeWidth={3} roughness={0.4} progress={easeOut(prog(at(CUES.headDown), 0, 0.3))} shape={{ kind: 'path', d: rayHead(O[0], O[1], 470, 790) }} />}

          {/* ===== scene 2: wages flat to down, assets compounding ===== */}
          {loP > 0 && <Sketch pen={PEN} seed={6} stroke={WAGES_C} strokeWidth={LINE_W} roughness={0.6} progress={loP} shape={{ kind: 'path', d: cubicD(LO) }} />}
          {at(CUES.wages + 1.8) > 0 && <Sketch pen={PEN} seed={7} stroke={WAGES_C} strokeWidth={LINE_W} roughness={0.4} progress={easeOut(prog(at(CUES.wages + 1.8), 0, 0.25))} shape={{ kind: 'path', d: headD(LO) }} />}
          <Type x={1722} y={944} text={C('wages')} t={at(CUES.wagesLabel)} cps={14} size={LBL} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
          <g mask="url(#wb5-ko)">
            {upP > 0 && <Sketch pen={PEN} seed={8} stroke={ASSETS_C} strokeWidth={LINE_W} roughness={0.6} progress={upP} shape={{ kind: 'path', d: cubicD(UP) }} />}
            {assetsHead > 0 && <Sketch pen={PEN} seed={9} stroke={ASSETS_C} strokeWidth={LINE_W} roughness={0.4} progress={easeOut(prog(assetsHead, 0, 0.25))} shape={{ kind: 'path', d: headD(UP) }} />}
          </g>
          <Type x={1722} y={164} text={C('assets')} t={at(CUES.assetsLabel)} cps={14} size={LBL} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
          {/* the origin dot on top of both line starts */}
          {at(CUES.dot) > 0 && <Sketch pen={PEN} seed={1} fill={PEN.ink} roughness={0.4} progress={prog(at(CUES.dot), 0, 0.2)} shape={{ kind: 'circle', cx: O[0], cy: O[1], r: 11 }} />}

          {/* ===== scene 3: the bridge across, the same for everyone; you buy a piece of the side that compounds ===== */}
          {/* the label sits level in the gap right of the deck, wholly inside its swash (22 px of swash past each end) */}
          <Highlight id="wb5-buy" x={BUY_X - 22} y={BUY_Y - LBL * 0.3} w={BUY_W + 44} h={LBL * 1.1} t={at(CUES.buy)} color={ACCENT} dur={0.35} opacity={0.8} />
          <Type x={BUY_X} y={BUY_Y} text={C('buy assets')} t={at(CUES.buy + 0.1)} cps={20} size={LBL} font={FL} color={INK} weight="700" anchor="start" charW={lblW} />
          <PlankBridge a={BA} b={BB} rail={false} thick={18} t={at(CUES.bridge)} pen={PEN} seed={10} dur={0.9} />

          {/* ===== scene 4: Bitcoin, the right crypto, the companies building this ===== */}
          <MarkCoin cx={BTC_X} cy={upY(BTC_X)} r={34} mark="btc" t={at(CUES.btc)} pen={PEN} seed={20} font={FL} drop={60} />
          <MarkCoin cx={TOK_X} cy={upY(TOK_X)} r={30} mark="hex" t={at(CUES.crypto)} pen={PEN} seed={21} font={FL} drop={60} />
          {/* base level at the curve's height under its RIGHT corner (the highest ground), a footing wedge down to the curve */}
          <OfficeTower x={TOWER_X} gy={upY(TOWER_X + TOWER_W / 2 + 4) + 2} w={TOWER_W} h={112} t={at(CUES.companies)} pen={PEN} seed={22} drop={60} ground={upY} />

          {/* ===== payoff: you own the machine ===== */}
          <Gear cx={GEAR.cx} cy={GEAR.cy} r={GEAR.r} spin={spin} t={at(CUES.gear)} pen={PEN} seed={30} />
          <Walker {...walker} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
