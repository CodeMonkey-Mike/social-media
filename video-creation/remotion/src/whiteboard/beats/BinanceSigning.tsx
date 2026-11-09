// whiteboard/beats/BinanceSigning.tsx: the FIRST whiteboard beat in a real video (binance, longform-presentation
// standard format, overlay `ov3-wb-signing`, brief: media/standard/binance/overlays/ov3-wb-signing.brief.md).
// "Binance's own key signed for the thief": Ethereum was NOT broken (the mark + a green check), Binance's own wallet
// and its own key signed 50 approvals that point the wallet at the attacker's sweeper contract, prepared in advance
// (the calendar), fired in one burst (a gold arrow carries $2.53B from the wallet to the hooded attacker).
// Canvas = the deck area, 1464 x 1080 @30, 19.25 s (spine 150.10 to 169.35) = 577 frames (the caller's window),
// no audio; the compositor (card_overlays.py) fades it in and out. Pen: neon-ink (Mike, 2026-10-31: dark mode, the
// colors are already Binance's). Everything is SVG through rough.js with fixed seeds (no boil, deterministic).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 150.10), each hung on a spoken word of
// `spine/binance EDIT.medium-words.json`; a thing draws as he names it, never before. Facts on screen: RESEARCH.md
// (50 pre-signed EIP-7702 authorizations in ONE tx at 20:20 UTC; ~$2.53B swept in ONE transaction 3 min later).
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Check, Type } from '../vocab';
import { BurstArrow, Calendar, ContractBox, EthMark, Hooded, Key, MoneyCount, PaperStack, StraightArrow, Wallet } from '../crypto';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 19.25 s x 30 = 577.5: the brief / the compositor's window is 577 frames */
export const DUR = 577;
export const W = 1464;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 150.10), the word each cue hangs on ----
const CUES = {
  eth: 0.36,            // "Ethereum" (first)        the Ethereum mark draws on
  ethLabel: 0.5,        //                           "ETHEREUM" types under it
  check: 1.40,          // "broken" (first)          the green check pops beside the mark
  ethPulse: 4.56,       // "Ethereum" (second)       a glow pulse on the mark
  notBroken: 5.76,      // "not" (second)            "NOT" types (green, heading font)
  broken: 6.30,         // "broken" (second)         "BROKEN" types beside it
  wallet: 7.38,         // "Binance's" (first try)   the Binance wallet draws on (gold)
  walletLabel: 7.9,     // "own signing system"      "BINANCE WALLET" types
  key: 10.18,           // "Binance's" (second)      the gold key draws on, hovering at the wallet
  keyLabel: 10.80,      // "own"                     "ITS OWN KEY" types
  papers: 12.32,        // "signed"                  the stack of papers draws on
  signature: 12.45,     // "signed"                  the gold signature squiggle is written on the top sheet
  arrow: 12.66,         // "for"                     the arrow from the papers runs right
  papersLabel: 12.80,   // "for the"                 "50 APPROVALS" types over the stack
  sweeper: 12.95,       // "the"                     the SWEEPER box draws (the arrow's target)
  sweeperLabel: 13.15,  // "attacker"                "SWEEPER" types in the box
  attacker: 13.14,      // "attacker"                the hooded attacker draws on (red)
  attackerLabel: 13.45, //                           "ATTACKER" types under him
  calendar: 13.64,      // "Prepared"                the calendar draws on (grey)
  preparedLabel: 13.95, // "Prepared ..."            "PREPARED IN ADVANCE" types
  ticks: 14.70,         // "days"                    two red ticks pop on consecutive days
  ring: 15.66,          // "advance"                 the red ring circles the day
  burst: 16.34,         // "fired"                   the gold burst arrow shoots wallet -> attacker
  money: 16.50,         // "fired in"                "$2.53B" counts up under the arrow
  oneBurst: 16.92,      // "in one burst"            "ONE BURST" types
  pushIn: 17.6,         // "crazy, dude"             a gentle 1.04x push-in holds the finished drawing
  pushInDur: 1.5,
};

// the scene sits 26 px lower than its design grid (balances the top and bottom margins on the 1080 canvas)
const DY = 26;
// the closing push-in: 1.02x about (1150, 640). The canvas's right edge sits against Mike's webcam column in the
// composite, so the right-most ink (the attacker's shoulder, x ~1403) must stay at or under ~1410 at full zoom
// (visual-qa, 2026-10-31: 1.04x about x 880 drove it to 1450).
const CAM_X = 1150, CAM_Y = 640, ZOOM = 1.02;

export const BinanceSigning: React.FC<{ penId?: string }> = ({ penId = 'neon-ink' }) => {
  const PEN = PENS[penId] ?? PENS['neon-ink'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const zoom = interpolate(T, [CUES.pushIn, CUES.pushIn + CUES.pushInDur], [1, ZOOM], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const ethBoost = interpolate(at(CUES.ethPulse), [0, 0.25, 1.0], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const L = PEN.colorL, RED = PEN.palette.red, GREEN = PEN.palette.green, GOLD = PEN.colorH;
  const lblW = PEN.charWL, headW = PEN.charWH;

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {PEN.floor && <rect x={0} y={660} width={W} height={H - 660} fill={PEN.floor} />}
        <g filter={PEN.glow ? 'url(#glow)' : undefined} transform={`translate(${CAM_X} ${CAM_Y}) scale(${zoom}) translate(${-CAM_X} ${-CAM_Y})`}>
          <g transform={`translate(0 ${DY})`}>
            {/* ===== scene 1 (top-left): Ethereum was not broken ===== */}
            <EthMark x={170} y={72} h={256} t={at(CUES.eth)} pen={PEN} seed={1} boost={ethBoost} />
            <Type x={248} y={374} text={C('ethereum')} t={at(CUES.ethLabel)} cps={18} size={34} font={FL} color={L} charW={lblW} />
            <Check x={372} y={206} t={at(CUES.check)} pen={PEN} seed={2} size={0.9} />
            {/* two words, two elements: Rock Salt's space is as narrow as its letter spacing ("NOTBROKEN"), and the second
                word hangs on its own spoken word */}
            <Type x={524} y={222} text={C('not')} t={at(CUES.notBroken)} cps={15} size={44} font={FH} color={GREEN} anchor="start" charW={headW} />
            <Type x={666} y={222} text={C('broken')} t={at(CUES.broken)} cps={15} size={44} font={FH} color={GREEN} anchor="start" charW={headW} />

            {/* ===== scene 3a (top-right): prepared in advance ===== */}
            <Calendar x={1070} y={86} t={at(CUES.calendar)} pen={PEN} seed={9} ticks={[15, 16]} tickT={at(CUES.ticks)} tickGap={0.14} ring={16} ringT={at(CUES.ring)} />
            <Type x={1190} y={352} text={C('prepared in advance')} t={at(CUES.preparedLabel)} cps={16} size={34} font={FL} color={L} charW={lblW} />

            {/* ===== scene 2 (middle lane): Binance's own key signed for the attacker ===== */}
            <Wallet x={110} y={500} t={at(CUES.wallet)} pen={PEN} seed={3} />
            <Type x={270} y={795} text={C('binance wallet')} t={at(CUES.walletLabel)} cps={18} size={36} font={FL} color={L} charW={lblW} />
            <Key x={468} y={466} t={at(CUES.key)} pen={PEN} seed={4} />
            <Type x={552} y={538} text={C('its own key')} t={at(CUES.keyLabel)} cps={18} size={32} font={FL} color={L} charW={lblW} />
            <PaperStack x={700} y={430} t={at(CUES.papers)} pen={PEN} seed={5} signT={at(CUES.signature)} />
            <Type x={756} y={408} text={C('50 approvals')} t={at(CUES.papersLabel)} cps={20} size={34} font={FL} color={L} charW={lblW} />
            <StraightArrow x1={846} y1={515} x2={982} y2={515} t={at(CUES.arrow)} pen={PEN} seed={6} />
            <ContractBox x={990} y={466} w={200} t={at(CUES.sweeper)} pen={PEN} seed={7} />
            <Type x={1105} y={524} text={C('sweeper')} t={at(CUES.sweeperLabel)} cps={20} size={26} font={FL} color={RED} charW={lblW} />
            <Hooded x={1298} gy={876} scale={0.92} t={at(CUES.attacker)} pen={PEN} seed={8} />
            <Type x={1298} y={926} text={C('attacker')} t={at(CUES.attackerLabel)} cps={20} size={34} font={FL} color={RED} charW={lblW} />

            {/* ===== scene 3b (lower lane): fired in one burst ===== */}
            {/* the tail leaves the wallet's right edge, so no speed lines (they would trail inside the wallet) */}
            <BurstArrow x1={448} y1={700} x2={1186} y2={700} t={at(CUES.burst)} pen={PEN} seed={10} speedLines={false} />
            <MoneyCount x={830} y={814} to={2.53} t={at(CUES.money)} size={60} font={FH} color={GOLD} />
            <Type x={830} y={892} text={C('one burst')} t={at(CUES.oneBurst)} cps={20} size={34} font={FH} color={GOLD} charW={headW} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
