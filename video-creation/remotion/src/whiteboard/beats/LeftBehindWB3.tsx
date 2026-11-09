// whiteboard/beats/LeftBehindWB3.tsx: whiteboard beat WB3 of the longform-edited video `left-behind`
// (brief: media/left-behind/assets/whiteboard/WB3.brief.md; cues: assets/whiteboard/WB3.cues.md).
// "New treatments launch scarce and expensive": a lab flask draws on, sparkles burst at its mouth, "new cure" under it;
// a blank price tag swings off the neck on a string; "$4.25M" is written on the tag as he says the number; the sheet
// splits under the flask; a stock certificate and a small house draw on the left; a thick arrow flows from the flask
// onto them and a small green up-arrow rises on the certificate, "assets"; a figure draws on the right holding an empty
// open bifold wallet upside down by its fold (nothing falls out), "paycheck"; a dotted waiting line draws under it, "waits"; the payoff: a money
// bag draws above the flask, "capital", and the ONE purple mark of the beat (the CH3 accent) is the arrow from the bag
// into the flask, "capital decides who even builds the cures"; a gentle 1.04x push-in holds the finished drawing.
// Canvas = the full frame 1920 x 1080 @30, spine 216.240 to 238.700 s = 22.46 s = 674 frames, no audio; the comp build
// fades it in and out. Pen: paper-pastel. Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 216.240), each hung on a spoken word of
// `spine/ALL.d.desilenced.medium-words.json`; a thing draws as he names it, never before. The ONE number on screen is
// $4.25M (DATA.md T6, the Lenmeldy wholesale price; the drug's name stays off screen per the brief). No 2.1B, no 50.9 /
// 0.6, no "no AI drug approved".
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type } from '../vocab';
import { BurstArrow, StraightArrow } from '../crypto';
import { Certificate, DashLine, EmptyWallet, Flask, House, MoneyBag, PriceTag, PriceText, Sparkles } from '../economy';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 22.46 s x 30 = 674 frames (spine 216.240 to 238.700) */
export const DUR = 674;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 216.240), the word each cue hangs on ----
const CUES = {
  flask: 0.24,         // "treatments"     the flask draws on: glass, the liquid fills, bubbles (1.0 s)
  sparkle: 0.58,       // "launch"         sparkles burst at the flask's mouth
  newCure: 0.58,       // "launch"         "new cure" types under the flask
  tag: 2.00,           // "expensive"      the string draws off the neck, the blank tag pops on it and swings
  tagKick: 11.52,      // "tag"            the tag swings again, smaller, as he says "price tag"
  price: 6.90,         // "4"              "$4" is written on the tag; the dot at ".25" (7.00), "25", then "M" on "million" (7.34)
  divider: 12.38,      // "the" (people)   the sheet splits: a dashed line draws down the middle under the flask
  cert: 12.72,         // "who"            the stock certificate draws on the left (1.0 s)
  house: 14.26,        // "own"            the small house draws beside it (0.8 s)
  flow: 15.36,         // "went"           the thick arrow shoots from the flask onto the assets side
  up: 15.56,           // "up"             a small green up-arrow rises on the certificate
  assets: 16.46,       // "asset"          "assets" types above the left group
  figure: 18.34,       // "paycheck"       the figure draws on the right (1.0 s), facing the split
  paycheck: 18.34,     // "paycheck"       "paycheck" types above its head
  wallet: 19.12,       // "side"           the empty wallet pops in its hand, upside down, shaken, nothing falls
  waitLine: 19.02,     // "waits"          the dotted waiting line draws under the figure
  waits: 19.22,        // "waits" (said)   "waits" types under the line
  bag: 19.88,          // "capital"        the money bag draws above the flask (0.7 s)
  capital: 19.88,      // "capital"        "capital" types beside it (purple)
  decides: 20.24,      // "decides"        the purple arrow draws from the bag into the flask (the one accent mark; done at 20.69, holds 1.47 s before the fade)
  pushIn: 19.88,       // "capital"        a gentle 1.04x push-in toward the column holds the finished drawing
  pushInDur: 2.2,
};

// layout: a column (capital -> cure -> the split) on the full frame; the floor band from GY
const GY = 900;                                          // the floor line: the house and the figure stand on it
const FX = 960, FLASK_BASE = 600, FLASK_H = 270;          // the flask (lip at 330, neck 930..990 down to 440, base 835..1085)
const TAG_PIVOT: [number, number] = [1085, 468];          // the tag's hole; the string runs from the neck's right edge
const TAG_FROM: [number, number] = [990, 402];
const DIV_X = 960;                                       // the split line
const HOUSE_X = 300, CERT = { x: 540, y: 730, w: 260, h: 150 };
const RX = 1500;                                         // the paycheck figure (mirrored: it faces the split)
const BAG = { cx: 960, cy: 226, h: 140 };                // the money bag (bottom at 226, top at 86: ~68 px from the top edge at full push-in)
const CAM_X = 960, CAM_Y = 540, ZOOM = 1.04;

/** a mirrored group: everything inside faces LEFT instead of right */
const Flip: React.FC<{ x: number; children?: React.ReactNode }> = ({ x, children }) => <g transform={`translate(${2 * x} 0) scale(-1 1)`}>{children}</g>;

export const LeftBehindWB3: React.FC<{ penId?: string }> = ({ penId = 'paper-pastel' }) => {
  const PEN = PENS[penId] ?? PENS['paper-pastel'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const zoom = interpolate(T, [CUES.pushIn, CUES.pushIn + CUES.pushInDur], [1, ZOOM], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

  const INK = PEN.colorH, P = PEN.palette;
  const ACCENT = '#8b5cf6'; // the CH3 accent: the ONE highlight mark of the beat (the brief)
  const lblW = PEN.charWL;
  const ty = GY - 215;      // the figure's shoulder line (vocab Person); its reaching hand sits at (RX - 109, ty + 70) once mirrored

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g transform={`translate(${CAM_X} ${CAM_Y}) scale(${zoom}) translate(${-CAM_X} ${-CAM_Y})`}>
        {/* the floor band rides the push-in with the scene (visual-qa round 3: a static floor let the house sink 16 px into it); oversized for the zoomed edges, outside the glow */}
        {PEN.floor && <rect x={-40} y={GY} width={W + 80} height={H - GY + 40} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: a new cure launches, scarce and expensive; the price tag; 4.25 million ===== */}
          <Flask cx={FX} baseY={FLASK_BASE} h={FLASK_H} t={at(CUES.flask)} pen={PEN} seed={1} />
          <Sparkles cx={1052} cy={292} r={34} t={at(CUES.sparkle)} pen={PEN} seed={2} />
          <Type x={FX} y={655} text={C('new cure')} t={at(CUES.newCure)} cps={20} size={44} font={FL} color={INK} weight="700" charW={lblW} />
          {/* the tag hangs at 18 degrees off the neck; the first kick is the swing-in, the second a smaller nudge on "price tag" */}
          <PriceTag x={TAG_PIVOT[0]} y={TAG_PIVOT[1]} from={TAG_FROM} t={at(CUES.tag)} pen={PEN} seed={3} rest={18} len={272} kicks={[{ at: 0.2, amp: -40 }, { at: CUES.tagKick - CUES.tag, amp: -14 }]}>
            {/* the price in the tag's local frame (hole = origin, body 16..272): the dot is drawn, the glyphs come as he says them; the LABEL font (Kalam bold): Gochi's rounded 5 read as an S on the round-1 still. Round 2: 56 px, centred at 136 on a 272 tag, so the M keeps ~25 px of air to the right border (the M ran into it at 60 px on a 256 tag) */}
            <PriceText x={136} y={19} text="$4.25M" t={at(CUES.price)} size={56} font={FL} color={INK} cps={10} charW={0.5} spacing={0.1} />
          </PriceTag>

          {/* ===== scene 2: the sheet splits; the people who can pay own things that went up ===== */}
          {/* the divider ends at 1000: ~62 px from the bottom edge at full push-in (1040 left 19 px, visual-qa round 1) */}
          <DashLine x1={DIV_X} y1={692} x2={DIV_X} y2={1000} t={at(CUES.divider)} pen={PEN} seed={4} dur={0.7} dash="16 12" />
          <Certificate x={CERT.x} y={CERT.y} w={CERT.w} h={CERT.h} t={at(CUES.cert)} pen={PEN} seed={5} />
          <House x={HOUSE_X} gy={GY} t={at(CUES.house)} pen={PEN} seed={6} />
          {/* the thick arrow starts just below-left of the flask's base, CLEAR of the glass (its tail sat on the liquid in round 1: ~28 px off the base corner and the shadow now) and lands on the certificate's top edge, right of the "assets" label; no speed lines, no sparks (grey specks on a still) */}
          <BurstArrow x1={808} y1={622} x2={718} y2={712} t={at(CUES.flow)} pen={PEN} seed={7} color={P.grey} dur={0.4} thick={20} headLen={48} headWidth={34} speedLines={false} sparks={false} />
          {/* the up-arrow inside the certificate's clear right third */}
          <StraightArrow x1={CERT.x + CERT.w - 44} y1={CERT.y + CERT.h - 34} x2={CERT.x + CERT.w - 44} y2={CERT.y + 34} t={at(CUES.up)} pen={PEN} seed={8} color={P.green} strokeWidth={PEN.inkWidth + 3} head={22} />
          <Type x={550} y={695} text={C('assets')} t={at(CUES.assets)} cps={20} size={44} font={FL} color={INK} weight="700" charW={lblW} />

          {/* ===== scene 3: the paycheck side waits ===== */}
          <Flip x={RX}><Person x={RX} gy={GY} t={at(CUES.figure)} pen={PEN} seed={9} hair="curly" shirt={P.blue} reach dur={1.0} /></Flip>
          <Type x={RX} y={576} text={C('paycheck')} t={at(CUES.paycheck)} cps={20} size={44} font={FL} color={INK} weight="700" charW={lblW} />
          {/* the open bifold hangs from the reaching hand by its fold; its right half stays ~20 px off the torso */}
          <EmptyWallet x={RX - 109} y={ty + 72} t={at(CUES.wallet)} pen={PEN} seed={10} tilt={0} />
          <DashLine x1={1330} y1={948} x2={1680} y2={948} t={at(CUES.waitLine)} pen={PEN} seed={11} dur={0.6} dash="0.5 15" strokeWidth={PEN.inkWidth + 3} />
          <Type x={1505} y={1004} text={C('waits')} t={at(CUES.waits)} cps={20} size={44} font={FL} color={INK} weight="700" charW={lblW} />

          {/* ===== scene 4: capital decides who even builds the cures (the one purple mark) ===== */}
          <MoneyBag cx={BAG.cx} cy={BAG.cy} h={BAG.h} t={at(CUES.bag)} pen={PEN} seed={12} font={FH} />
          <Type x={850} y={165} text={C('capital')} t={at(CUES.capital)} cps={20} size={48} font={FL} color={ACCENT} weight="700" anchor="end" charW={lblW} />
          <StraightArrow x1={BAG.cx} y1={BAG.cy + 8} x2={BAG.cx} y2={FLASK_BASE - FLASK_H - 12} t={at(CUES.decides)} pen={PEN} seed={13} color={ACCENT} strokeWidth={PEN.inkWidth + 4} head={26} />
        </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
