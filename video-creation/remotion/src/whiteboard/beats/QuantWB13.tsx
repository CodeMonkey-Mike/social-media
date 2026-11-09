// whiteboard/beats/QuantWB13.tsx: whiteboard beat WB13 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB13.brief.md; cues: assets/whiteboard/WB13.cues.md).
// "Now the token. Quant lives on Ethereum and the supply is fixed. Around 14.6 million tokens, almost all of it already
// circulating. That's all there will ever be. It sold to the public in 2018. And the all time high was around $427 in
// September of 2021." The orange QNT coin pops on "token" standing on the floor at the left; on "Ethereum" a plinth rises
// out of the floor under it and lifts it, the Ethereum diamond draws on the plinth's face, "Ethereum" is written under it.
// On "supply" a glass jar draws itself in the middle with a few coins inside, on "fixed" its lid comes down and seals; on
// "Around" a paper label sticks to the jar and "14.6M" counts up on it as he says the number (an explicit decimal dot).
// On "almost" a ring of coins pops round the jar's foot, OUTSIDE the glass (the front half of the ring, every place filled,
// each coin standing on the floor band clear of the jar's shadow), and "almost all circulating" is written under them. On "all" (that's all there will ever be) a padlock lands on the lid; on "will" a heavy "+" draws beside the lock and on
// "ever" the prohibition circle and a thin slash cross it (two weights, so the plus stays a plus). On "sold" a small crowd draws at the right, on "public" a coin drops
// into each hand (the hand drawn over its rim, a "Q" on its face), on "2018" a calendar page on a pole plants beside them with the year. On "all" (time high) a JAGGED price line
// starts beside the calendar page (detached from its pole) and climbs over the crowd to a peak, then falls in lower highs; on "$427" a flag plants at the peak with "$427" on its
// cloth; on "September" "Sept 2021" is written under the flag. Payoff: the sealed jar, the ring of coins, the peak flag.
// Canvas = the full frame 1920 x 1080 @30, spine 333.460 to 352.533 s = 19.073 s = 572 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant; the ONE orange mark (#F15A22, the pen's `red` role) is the QNT coin, everything
// else is the pen unchanged (coins in the money tint, the lid / padlock / flag in the pen's pale tints, ink lines).
// Numbers on screen (DATA.md section 5 / Pillar 4 only): 14.6M (total = max 14,612,493 QNT), 2018 (genesis 2018-06-25),
// $427 (ATH $427.42 on 2021-09-11), Sept 2021. Never 14.9M, never 45.5M, no ICO price / raise / burn, no "staking", no
// contract address, no 2018 price, no "locked 12 months"; the token is written QNT. Everything is SVG through rough.js
// with fixed seeds (no boil, deterministic). The storyboard is the CUES table below: LOCAL seconds (0 = spine 333.460),
// each hung on a spoken word of `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { easeOut, prog } from '../Sketch';
import { EthMark, MoneyCount } from '../crypto';
import { Padlock } from '../settlement';
import { CalendarFlag, calendarFlagGeom } from '../career';
import { RectFlag, rectFlagGeom } from '../harbour';
import { Jar, NoPlus, PaperLabel, PeakLine, Plinth, TokenCoin, jarGeom, plinthGeom } from '../supply';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 19.073 s x 30 = 572 frames (spine 333.460 to 352.533) */
export const DUR = 572;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 333.460), the word each cue hangs on ----
const CUES = {
  coin: 0.38,        // "token"        the orange QNT coin pops at the left, standing on the floor
  plinth: 2.14,      // "Ethereum"     a plinth rises out of the floor under it and lifts it (0.6 s)
  eth: 2.59,         // "Ethereum" (held) the Ethereum diamond draws on the plinth's face (0.8 s)
  ethLabel: 2.64,    //                "Ethereum" types under the plinth
  jar: 3.04,         // "supply"       the glass jar draws as one stroke in the middle (0.8 s)
  inside: 3.34,      // "is"           four coins pop inside it, one every 0.1 s
  lid: 3.70,         // "fixed"        the lid comes down and seals (0.5 s)
  label: 4.36,       // "Around"       a paper label sticks on the jar's face
  count: 4.64,       // "14"           "14.6M" counts up on the label, landing on "million" (0.9 s)
  ring: 7.04,        // "almost"       nine coins pop round the jar's foot (the front half of the ring), outside the glass, one every 0.1 s
  ringLabel: 8.52,   // "circulating"  "almost all circulating" types under them
  lock: 9.62,        // "all"          a padlock lands on the lid
  plus: 10.00,       // "will"         a heavy "+" draws beside the padlock
  ban: 10.24,        // "ever"         the prohibition circle and a thin slash cross the "+" (0.55 s)
  crowd: 11.54,      // "sold"         four small figures draw at the right, one every 0.1 s (0.9 s each)
  handCoins: 12.20,  // "public"       a coin drops into each reaching hand, one every 0.1 s; the hand closes over its rim as it lands
  year: 12.86,       // "2018"         a calendar page on a pole plants left of the crowd (0.7 s); "2018" types from 13.42
  peak: 14.32,       // "all" (time high) the jagged price line starts beside the calendar page and climbs to the peak (1.2 s; the peak at ~14.7)
  flag: 15.60,       // "$427"         a flag plants at the peak (0.5 s); "$427" types on its cloth from 16.05
  date: 17.28,       // "September"    "Sept 2021" types under the flag (done ~17.9, 0.9 s before the compositor's fade at 18.77)
};

// ---- layout ----
const GY = 880;                                                    // the floor line; the floor band below it
// scene 1: the token on Ethereum (left)
const COIN = { x: 300, r: 72 };
const PLINTH = { x: 300, w: 180, h: 190 };
const PG = plinthGeom(PLINTH.x, GY, PLINTH.w, PLINTH.h);          // top 690, face 712..864
const ETH = { h: 110 };
const ETH_X = PLINTH.x - (ETH.h * 256) / 417 / 2, ETH_Y = PG.faceY + (PG.faceH - ETH.h) / 2;
const ETH_LBL = { x: 300, y: 942 };
// scene 2: the sealed jar (centre)
const JAR = { cx: 840, w: 280, h: 360 };
const JG = jarGeom(JAR.cx, GY, JAR.w, JAR.h);                      // rim 520, lid 490..530, walls 700..980
const INSIDE: [number, number][] = [[790, 852], [842, 852], [894, 852], [842, 810]];   // a 3 + 1 pile on the jar's floor
const LABEL = { x: JAR.cx - 95, y: 626, w: 190, h: 80 };          // on the glass face, above the pile
const COUNT = { x: JAR.cx, y: LABEL.y + 58, size: 56 };
// the ring round the foot: the FRONT half of an ellipse about the jar's base, every place filled, equal arc spacing (visual-qa
// 2026-11-05: a ring with its back places omitted read as two clusters, and coins above the floor line hung in the air). Its
// ends sit level with the jar's base (coin bottoms 14 px into the floor band), the front coins 15 px clear of the jar's shadow
// (shadow bottom 894), ~45 px of air between neighbours
const RING = { cx: JAR.cx, cy: 872, rx: 310, ry: 60, n: 9 };
const RING_PTS: [number, number][] = (() => {
  const N = 1200, pts: [number, number][] = [], L = [0];
  for (let i = 0; i <= N; i++) { const a = (Math.PI * (180 - (180 * i) / N)) / 180; pts.push([RING.cx + RING.rx * Math.cos(a), RING.cy + RING.ry * Math.sin(a)]); }
  for (let i = 1; i <= N; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const out: [number, number][] = [];
  for (let k = 0; k < RING.n; k++) {
    const target = (L[N] * k) / (RING.n - 1);
    let best = 0; for (let i = 0; i <= N; i++) if (Math.abs(L[i] - target) < Math.abs(L[best] - target)) best = i;
    out.push([Math.round(pts[best][0]), Math.round(pts[best][1])]);
  }
  return out;                                                        // left end -> front -> right end (the pop order)
})();
const RING_LBL = { x: JAR.cx, y: 1000 };
const LOCK = { cx: JAR.cx, w: 56, h: 42 };
const LOCK_CY = JG.lidTop - LOCK.h / 2;                            // its body stands on the lid's top
const NO = { cx: 958, cy: 410, r: 55 };                            // beside the padlock (lock body 812..868, shackle top ~423): 30 px air; its rough bottom ~467, 12 px above the lid's top wobble (479) measured on the still
// scene 3: sold to the public in 2018 (right, lower)
const FIG = 0.55;                                                  // the crowd's scale about the feet
const CROWD = [1428, 1540, 1652, 1764];                            // 112 apart: each coin (hand + 60, r 16) clears the next torso by ~20 px
const HAIRS = ['cap', 'curly', 'bob', 'bun'] as const;
const HAND = (x: number): [number, number] => [x + 109 * FIG, GY - 145 * FIG];   // the reaching hand of a Person at FIG: (x + 60, 800)
const HAND_COIN = (x: number): [number, number] => [x + 58, 783];                // the coin sits ON the hand (r 16, bottom 799; its right edge x + 74 clears the next torso by ~21 px)
const CAL = { x: 1275, gy: GY, top: 600 };                          // page 1278..1398 x 604..704, left of the crowd (its hand from 1408)
const CALG = calendarFlagGeom(CAL.x, CAL.top);
// scene 4: the all-time high (right, upper)
// a jagged price line: starts 18 px right of the calendar page (page right edge 1398, detached from its pole so the pole stays a
// pole), climbs over the crowd (first head top ~720) in three steps with short dips, peaks at (1620, 250) under the flag, falls
// in lower highs to (1838, 560): 54 percent of its length is the climb, so with the ease-out the peak is reached at ~14.68 ("high")
const PEAK_PTS: [number, number][] = [[1416, 655], [1455, 600], [1480, 625], [1525, 500], [1548, 530], [1585, 380], [1600, 405], [1620, 250], [1650, 360], [1672, 330], [1715, 450], [1740, 420], [1790, 540], [1815, 520], [1838, 560]];
const PEAK = { x0: 1416, y0: 655, px: 1620, py: 250, x1: 1838, y1: 560 };
const FLAG = { x: PEAK.px, gy: PEAK.py, top: 150, w: 130, h: 56 };          // pole on the peak; cloth 1623..1753 x 156..212
const FLAGG = rectFlagGeom(FLAG.x, FLAG.top, FLAG.w, FLAG.h);
const DATE = { x: 1745, y: 258 };                                           // under the cloth (20 px air), right of the pole, ~40 px above the falling slope
const LBL = 40;
const LBLW = 0.49;     // Kalam 700 mixed case (measured on quant WB14's stills)
const RINGW = 0.42;    // "almost all circulating" measured on this beat's stills: ink 372 px for 22 glyphs at 40 px (visual-qa 2026-11-05)
const DIGW = 0.5;      // Kalam 700 digits

export const QuantWB13: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const INK = PEN.colorL, P = PEN.palette;
  const ORANGE = P.red;
  // the crowd is drawn at FIG scale: compensate the pen's stroke width (and some wobble) so its lines match the page (WB12's lesson)
  const PEN_FIG = { ...PEN, id: `${PEN.id}-fig`, inkWidth: PEN.inkWidth / FIG, roughness: PEN.roughness * 1.3 };
  const SHIRTS = [P.blue, P.green, P.grey, P.blue];

  // the plinth rises under the coin and lifts it
  const rise = easeOut(prog(at(CUES.plinth), 0, 0.6));
  const coinCy = GY - COIN.r - PLINTH.h * rise;

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {PEN.floor && <rect x={0} y={GY} width={W} height={H - GY} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: the token, on Ethereum ===== */}
          <Plinth x={PLINTH.x} gy={GY} w={PLINTH.w} h={PLINTH.h} rise={rise} pen={PEN} seed={2}>
            <EthMark x={ETH_X} y={ETH_Y} h={ETH.h} t={at(CUES.eth)} pen={PEN} seed={3} color={P.blue} dur={0.8} />
          </Plinth>
          <Type x={ETH_LBL.x} y={ETH_LBL.y} text={C('Ethereum')} t={at(CUES.ethLabel)} cps={22} size={LBL} font={FL} color={INK} weight="700" charW={LBLW} />
          <TokenCoin cx={COIN.x} cy={coinCy} r={COIN.r} t={at(CUES.coin)} pen={PEN} seed={1} color={ORANGE} mark="QNT" font={FL} markColor={PEN.light} markSize={43} markDx={-3} />

          {/* ===== scene 2: the supply is fixed: the jar, its lid, the number, the ring, the lock ===== */}
          <Jar cx={JAR.cx} baseY={GY} w={JAR.w} h={JAR.h} t={at(CUES.jar)} lidT={at(CUES.lid)} pen={PEN} seed={10}>
            {INSIDE.map(([x, y], i) => <TokenCoin key={i} cx={x} cy={y} r={24} t={at(CUES.inside + i * 0.1)} pen={PEN} seed={20 + i} mark="Q" font={FL} markSize={20} />)}
          </Jar>
          <PaperLabel x={LABEL.x} y={LABEL.y} w={LABEL.w} h={LABEL.h} t={at(CUES.label)} pen={PEN} seed={30} />
          <MoneyCount x={COUNT.x} y={COUNT.y} to={14.6} t={at(CUES.count)} dur={0.9} size={COUNT.size} font={FL} color={PEN.ink} prefix="" suffix="M" decimals={1} shift={-0.24} />
          {RING_PTS.map(([x, y], i) => <TokenCoin key={i} cx={x} cy={y} r={22} t={at(CUES.ring + i * 0.1)} pen={PEN} seed={40 + i} mark="Q" font={FL} markSize={19} />)}
          <Type x={RING_LBL.x} y={RING_LBL.y} text={C('almost all circulating')} t={at(CUES.ringLabel)} cps={24} size={LBL} font={FL} color={INK} weight="700" charW={RINGW} />
          <Padlock cx={LOCK.cx} cy={LOCK_CY} w={LOCK.w} h={LOCK.h} t={at(CUES.lock)} pen={PEN} seed={50} dur={0.45} />
          <NoPlus cx={NO.cx} cy={NO.cy} r={NO.r} t={at(CUES.plus)} banT={at(CUES.ban)} pen={PEN} seed={55} />

          {/* ===== scene 3: sold to the public in 2018 ===== */}
          {CROWD.map((x, i) => (
            <g key={i} transform={`translate(${x} ${GY}) scale(${FIG}) translate(${-x} ${-GY})`}>
              <Person x={x} gy={GY} t={at(CUES.crowd + i * 0.1)} pen={PEN_FIG} seed={60 + i} hair={HAIRS[i]} shirt={SHIRTS[i]} reach dur={0.9} shadow="legs" />
            </g>
          ))}
          {CROWD.map((x, i) => {
            const [cx, cy] = HAND_COIN(x);
            return <TokenCoin key={i} cx={cx} cy={cy} r={16} t={at(CUES.handCoins + i * 0.1)} pen={PEN} seed={70 + i} drop={70} mark="Q" font={FL} markSize={15} held />;
          })}
          <CalendarFlag x={CAL.x} gy={CAL.gy} top={CAL.top} t={at(CUES.year)} pen={PEN} seed={80}>
            <Type x={CALG.faceCx} y={CALG.faceCy + 15} text="2018" t={at(CUES.year + 0.56)} cps={10} size={LBL} font={FL} color={PEN.ink} weight="700" charW={DIGW} spacing={0.06} />
          </CalendarFlag>

          {/* ===== scene 4: the all-time high ===== */}
          <PeakLine x0={PEAK.x0} y0={PEAK.y0} px={PEAK.px} py={PEAK.py} x1={PEAK.x1} y1={PEAK.y1} pts={PEAK_PTS} t={at(CUES.peak)} pen={PEN} seed={90} dur={1.2} />
          <RectFlag x={FLAG.x} gy={FLAG.gy} top={FLAG.top} w={FLAG.w} h={FLAG.h} color={P.gold} t={at(CUES.flag)} pen={PEN} seed={91}>
            <Type x={FLAGG.cx} y={FLAGG.cy + 12} text="$427" t={at(CUES.flag + 0.45)} cps={12} size={36} font={FL} color={PEN.ink} weight="700" charW={DIGW} spacing={0.04} />
          </RectFlag>
          <Type x={DATE.x} y={DATE.y} text={C('Sept 2021')} t={at(CUES.date)} cps={14} size={36} font={FL} color={INK} weight="700" charW={LBLW} spacing={0.03} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
