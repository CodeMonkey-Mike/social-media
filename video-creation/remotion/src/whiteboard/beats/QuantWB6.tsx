// whiteboard/beats/QuantWB6.tsx: whiteboard beat WB6 of the longform-edited video `quant`
// (brief: media/quant/assets/whiteboard/WB6.brief.md; cues: assets/whiteboard/WB6.cues.md).
// GBTD's first live customer transactions, the remortgage (DATA.md Pillar 3 + section 2: "deposit funds were locked and
// released automatically at completion. Customers could also keep earning interest until completion."). The stage is the
// mainland above the sea (the coast low on the page, the water below it, where the islands of the earlier beats live).
// On "first" a wall calendar draws top-left; on "live" a green LIVE sticker pops beside it; on "transactions" the month
// "Sept 2026" is written on its header (the one date allowed). On "remortgages" a house draws on the ground. On
// "deposit" a stack of coins pops beside the house; on "locked" a padlock draws on top of it, open; on "day" a sheet of
// paper draws beside the stack and on "sign" a fountain pen writes a signature across it, the shackle clicking shut as
// the signature ends. On "earning" a clock draws above and small coins drop into the stack one by one (the stack grows,
// the lock rides up), the hands spinning from "interest" until "completion", when the calendar's days are crossed off one
// after another up to completion day, which is ringed on "day" (the month never changes: only Sept 2026 may air, so no
// page tears off; visual-qa round 1 + the caller's decision). On "releases" the shackle lifts open; on "itself" an ORANGE
// arrow draws from the stack across the page (the one highlight mark of the beat) and the stack slides along it, landing
// beside a second figure (the lender, looking left at it) who draws on "to" and is complete before "other side" types
// under him on "side."; a green check pops on the landed stack as it arrives; the open padlock drops to the ground where
// the stack stood. On "padlock" a faint ghost of WB4's lock-on-coins (the same drawing, the same padlock) fades in beside
// it and on "whiteboard" the label "same padlock" types under both; on "real" the label "real money" types above the
// landed stack. On "big" a LARGE island rises in the sea below (land, palm, bank, vault door: the same island drawing as
// every other quant beat, one and a quarter times the front islands) and on "the (clearing house)" its name "The Clearing
// House" types in the heading font directly beside it. Payoff: the released stack checked beside the lender, the big
// island looming under them, its name beside it.
// Canvas = the full frame 1920 x 1080 @30, spine 254.140 to 273.560 s = 19.42 s = 583 frames, no audio; the comp build
// fades it in and out. Pen: paper-quant (the one orange mark is the release arrow; headings take the pen's heading
// colour). Everything is SVG through rough.js with fixed seeds (no boil, deterministic). The only date on screen is
// "Sept 2026" (the brief); no interest rate, no amount, no pound sign, no bank or lender name, no logo, no count of the
// transactions (one house; the calendar's cells carry no numbers).
// The storyboard is the CUES table below: LOCAL seconds (0 = spine 254.140), each hung on a spoken word of
// `spine/ALL.f.enhanced.medium-words.json`; a thing draws as he names it, never before.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Person, Type, bezier } from '../vocab';
import { easeOut, prog } from '../Sketch';
import { House } from '../economy';
import { CoinStack, Padlock, coinStackGeom } from '../settlement';
import { ClockFace, Island, Sea } from '../islands';
import { CurvedArrow } from '../money';
import { CheckBadge } from '../layer';
import { GrowStack, MonthCalendar, SignedPaper, StickerTag, growStackGeom, growStackLift, monthCalendarGeom } from '../mortgage';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
/** 19.42 s x 30 = 583 frames (spine 254.140 to 273.560) */
export const DUR = 583;
export const W = 1920;
export const H = 1080;

// ---- the storyboard: LOCAL seconds (spine seconds minus 254.140), the word each cue hangs on ----
const CUES = {
  stage: 0.0,        // "it" (did its)    the coast low on the page, the sea tints below it, wave ticks (under the compositor's fade-in)
  calendar: 0.60,    // "first"          the wall calendar draws top-left (body, header rule, pegs, page, grid; 0.7 s)
  live: 0.94,        // "live"           a green LIVE sticker pops beside its top-right corner (0.3 s)
  month: 1.84,       // "transactions."  "Sept 2026" is written on the calendar's header
  house: 3.48,       // "remortgages."   the house draws on the ground (0.8 s)
  stack: 5.36,       // "deposit"        a stack of four coins pops beside the house (0.35 s)
  lock: 6.06,        // "locked"         a padlock draws on top of the stack, shackle first, OPEN (0.45 s)
  paper: 6.54,       // "day"            a sheet of paper draws between the house and the stack (0.5 s)
  sign: 6.96,        // "sign,"          a fountain pen pops at the signature line and writes the signature (0.6 s)
  click: 7.34,       // "sign," (held)   the shackle clicks shut as the signature's last loop lands (0.15 s)
  clock: 7.78,       // "earning"        a clock face draws above the paper (0.5 s)
  drop1: 7.78,       // "earning"        a small coin drops into the stack from above (0.4 s): the stack grows, the lock rides up
  drop2: 8.20,       // "interest"       a second coin drops
  spin: 8.06,        // "interest"       the clock's hands spin (time passes) until "completion"
  drop3: 8.62,       // "whole"          a third coin drops (lands 9.02)
  cross: 10.16,      // "completion"     the calendar's days are crossed off one after another up to completion day (18 cells, 0.4 s); the clock's hands stop
  ring: 10.60,       // "day,"           a ring draws around the next cell (completion day, third row; 0.4 s)
  release: 11.50,    // "releases"       the shackle lifts open and the lock rises off the stack a little (0.35 s)
  arrow: 11.78,      // "itself"         the ORANGE arrow draws from the stack's right across the page to the lender's side (0.7 s)
  ride: 12.00,       // "itself" (held)  the stack slides along the arrow (0.8 s; lands 12.80 = "side.")
  settle: 12.12,     // (the stack gone) the open padlock drops to the ground where the stack stood (0.4 s)
  lender: 12.22,     // "to"             the lender draws on at the right (0.6 s, complete 12.82), looking left, his shadow with his legs
  otherSide: 12.82,  // "side."          "other side" types under him (he is complete when it starts)
  badge: 12.86,      // "side." (held)   a green check badge pops on the landed stack's right (0.28 s)
  ghost: 13.76,      // "padlock"        a faint ghost of WB4's lock-on-coins fades in beside the open lock (0.4 s)
  same: 14.50,       // "whiteboard"     "same padlock" types under the lock and the ghost
  money: 15.58,      // "real"           "real money" types above the landed stack
  island: 17.06,     // "big"            the big island rises in the sea: land + palm (0.7 s), bank from +0.1 (0.9 s), vault door from +0.3 (0.7 s); done 18.06
  tch: 18.00,        // "the" (clearing) "The Clearing House" types beside the island (60 cps, done 18.30; held 0.82 s before the compositor's fade at 19.12)
};
const CROSS = { upTo: 18, dur: 0.4 };                       // the cells struck off before the ringed one (cell 18 = third row, fifth column)

// ---- layout ----
const GY = 580;                                             // the mainland ground line things stand on
const HORIZON = 680;                                        // the coast (wobble +-12, its control points up to +-20)
// wave ticks in open water: clear of the big island (868..1664 x 736..1030 once risen), its name (173..708 x 865..915) and the coast;
// the lowest ticks keep ~35 px to the bottom edge (a tick's ink is ~6 px tall at its y)
const TICKS: [number, number][] = [
  [150, 762], [430, 748], [700, 770], [300, 992], [560, 1012], [900, 1038], [1760, 762], [1820, 982], [1500, 1040], [50, 962], [1780, 880], [1000, 760],
];
const CAL = { x: 110, y: 70, w: 250, h: 230 };              // the wall calendar top-left (pegs 50..74, ending above the month's text, whose cap top is ~78)
const CG = monthCalendarGeom(CAL.x, CAL.y, CAL.w, CAL.h);
const MONTH = { size: 32, charW: 0.5, spacing: 0.06 };      // "Sept 2026", Kalam 700 on the header band (digits letter-spaced so none fuse)
const LIVE = { x: 376, y: 74, w: 96, h: 42, size: 28, charW: 0.52, spacing: 0.08 };   // the sticker beside the calendar's top-right corner (Kalam 700 caps measured ~0.57 em incl. the spacing on the round-1 still)
const HOUSE = { x: 120, gy: GY, w: 170, h: 125 };           // walls 120..290, roof overhang 104..306, apex 373; under the calendar (bottom 300) by 73 px
const PAPER = { x: 335, y: 455, w: 100, h: 125 };           // the sheet between the house and the stack (335..435 x 455..580)
const STACK = { cx: 540, baseY: GY, n: 4, rx: 36, ry: 11, th: 14 };   // four coins (504..576), top edge 502; seven after the interest, top edge 460
const DROPS = [CUES.drop1 - CUES.stack, CUES.drop2 - CUES.stack, CUES.drop3 - CUES.stack];   // on the stack's own clock
const DROP_FROM = 300;                                      // the interest coins fall from here (their centre), 170 px above the seventh coin's place
const DROP_DUR = 0.4;
const LOCK = { w: 60, h: 44 };                              // the padlock on the stack (its body's bottom 3 px into the top coin's face)
const SG4 = growStackGeom(STACK.cx, STACK.baseY, STACK.n, STACK.rx, STACK.ry, STACK.th);
const CLOCK = { cx: 740, cy: 240, r: 38 };                  // above the paper, right of the falling coins (702..778 x 202..278); the riding stack's top passes 22 px under it
// the release arrow (orange, a quadratic) from the stack's upper right (30 px right of the lifted lock, 24 px right of the
// coins), peaking ~410 at mid-way, landing just left of the stack's new place; it clears the ghost padlock's shackle by
// 33 px (round 1: a ground-level start ran the shaft through the ghost). The stack's base rides a parallel curve 9 to
// 28 px above the shaft, so the stack sits on the arrow all the way across
const ARROW = { p0: [600, 470] as [number, number], p1: [880, 300] as [number, number], p2: [1165, 572] as [number, number] };
const RIDE = { p0: [540, 580] as [number, number], p1: [880, 200] as [number, number], p2: [1215, 580] as [number, number] };
const LENDER = { x: 1380, gy: GY };                         // the lender (hair 1343..1417, head top ~299, arms to 1344 / 1416)
const LABEL = { y: 632, size: 40, charW: 0.46 };            // Kalam 700 measured ~0.46 em per glyph (quant WB12 stills); baseline 36 px over the coast's highest point
const BADGE = { cx: 1285, cy: 492, r: 18 };                 // on the landed stack's right (1267..1303), 34 px from the lender's hand
const MONEY = { x: RIDE.p2[0], y: 430, size: 40 };          // "real money" above the landed stack (its top edge 460), right end 36 px from the lender's hair
// WB4's lock-on-coins, the same geometry at the same size as QuantWB4 (coins n 3 rx 24 ry 7 th 9, the padlock 40 x 30
// standing on the top coin, shut; 626..674 x 488..587), beside the open lock (56 px right of it), under the arrow's rise; faint
const GHOST = { cx: 650, baseY: GY, k: 1.0, op: 0.4 };
const GHOST_C = { n: 3, rx: 24, ry: 7, th: 9 };
const GCSG = coinStackGeom(GHOST.cx, GHOST.baseY, GHOST_C.n, GHOST_C.rx, GHOST_C.ry, GHOST_C.th);
const GHOST_LOCK = { cx: GHOST.cx, cy: GCSG.top - 15, w: 40, h: 30 };
const SAME = { x: 595, y: LABEL.y, size: 38 };              // "same padlock" centred between the lock (510..570) and the ghost (626..674), 17 px under the ghost's bottom coin
// the big island: the kit island at 1.25 (land 868..1592 x 785..1022, its bank's apex ~736, 44 px under the coast), rising 40 px as it draws;
// its own two shore ticks are off (the left one sat between the island and its name); the vault door is moved 12 right and 34 down
// (to ~1010, 893) so its upper hinge sits ~40 px inside the land's top-left curve (visual-qa: "hangs off the land") while its
// dial keeps ~8 px to the bank's left column (30 px right, as proposed, would have run it into the bank)
const BIG = { cx: 1230, top: 785, scale: 1.25, vaultOffset: [12, 34] as [number, number] };
const RISE = 40;
// "The Clearing House", Gochi Hand 700, directly beside the island: ~0.43 em per glyph + 0.18 em spacing (the C-l pair opened; it fused at 0.1)
// = ~605 px, right end ~830, 38 px off the land's left edge (868) at the name's height; cap top ~865 (the nearest tick above is at 770)
const TCH = { x: 528, y: 905, size: 56, charW: 0.43, spacing: 0.18, cps: 60 };

export const QuantWB6: React.FC<{ penId?: string }> = ({ penId = 'paper-quant' }) => {
  const PEN = PENS[penId] ?? PENS['paper-quant'];
  const FH = FONTS[PEN.fontH], FL = FONTS[PEN.fontL];
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)
  const ORANGE = PEN.palette.red, INK = PEN.colorL;

  // the padlock: draws open, clicks shut as the signature ends, lifts open on "releases", drops to the ground once the stack has gone
  const shut = easeOut(prog(at(CUES.click), 0, 0.15));
  const released = easeOut(prog(at(CUES.release), 0, 0.35));
  const open = Math.max(1 - shut, released);
  const lift = growStackLift(at(CUES.stack), DROPS, STACK.th, DROP_DUR);          // the interest coins raise the lock
  const lockCyOnStack = SG4.top - LOCK.h / 2 + 3 - lift - 14 * released;
  const settleQ = prog(at(CUES.settle), 0, 0.4), settle = settleQ * settleQ;      // it drops like a thing let go
  const lockCy = lockCyOnStack + (GY - LOCK.h / 2 - lockCyOnStack) * settle;
  // the stack rides the arrow: its base follows RIDE from its place to the lender's side
  const rq = prog(at(CUES.ride), 0, 0.8), ru = rq * rq * (3 - 2 * rq);
  const base = bezier(RIDE.p0, RIDE.p1, RIDE.p2, ru);
  // the clock's hands spin from "interest" until "completion"
  const spinT = Math.min(at(CUES.spin), Math.max(0, CUES.cross - CUES.spin));
  // the big island rises as it draws
  const rise = RISE * (1 - easeOut(prog(at(CUES.island), 0, 0.7)));
  const ghostOp = GHOST.op * easeOut(prog(at(CUES.ghost), 0, 0.4));

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter={PEN.glow ? 'url(#glow)' : undefined}>
          {/* ===== scene 1: the stage, the calendar (Sept 2026, LIVE), the house ===== */}
          <Sea horizon={HORIZON} ticks={TICKS} t={at(CUES.stage)} pen={PEN} seed={1} />
          <MonthCalendar x={CAL.x} y={CAL.y} w={CAL.w} h={CAL.h} t={at(CUES.calendar)} pen={PEN} seed={10} crossT={at(CUES.cross)} crossUpTo={CROSS.upTo} crossDur={CROSS.dur} ringCell={CROSS.upTo} ringT={at(CUES.ring)} />
          <Type x={CG.headX} y={CG.headBase} text={C('Sept 2026')} t={at(CUES.month)} cps={20} size={MONTH.size} font={FL} color={PEN.ink} weight="700" charW={MONTH.charW} spacing={MONTH.spacing} />
          <StickerTag x={LIVE.x} y={LIVE.y} w={LIVE.w} h={LIVE.h} t={at(CUES.live)} pen={PEN} seed={12}>
            <Type x={LIVE.x + LIVE.w / 2} y={LIVE.y + 31} text="LIVE" t={at(CUES.live)} cps={100} size={LIVE.size} font={FL} color={PEN.ink} weight="700" charW={LIVE.charW} spacing={LIVE.spacing} />
          </StickerTag>
          <House x={HOUSE.x} gy={HOUSE.gy} w={HOUSE.w} h={HOUSE.h} t={at(CUES.house)} pen={PEN} seed={14} />

          {/* ===== scene 2: the deposit locked the day you sign, earning interest the whole time ===== */}
          <SignedPaper x={PAPER.x} y={PAPER.y} w={PAPER.w} h={PAPER.h} t={at(CUES.paper)} pen={PEN} seed={20} signT={at(CUES.sign)} signDur={0.6} />
          {/* WB4's padlock, faint, beside the open lock (painted before the lock) */}
          {ghostOp > 0 && (
            <g opacity={ghostOp} transform={`translate(${GHOST.cx} ${GHOST.baseY}) scale(${GHOST.k}) translate(${-GHOST.cx} ${-GHOST.baseY})`}>
              <CoinStack cx={GHOST.cx} baseY={GHOST.baseY} n={GHOST_C.n} rx={GHOST_C.rx} ry={GHOST_C.ry} th={GHOST_C.th} t={1} pen={PEN} seed={30} />
              <Padlock cx={GHOST_LOCK.cx} cy={GHOST_LOCK.cy} w={GHOST_LOCK.w} h={GHOST_LOCK.h} open={0} t={1} pen={PEN} seed={31} />
            </g>
          )}
          {/* the release arrow under the stack's path */}
          <CurvedArrow p0={ARROW.p0} p1={ARROW.p1} p2={ARROW.p2} t={at(CUES.arrow)} pen={PEN} seed={40} color={ORANGE} dur={0.7} head={24} strokeWidth={PEN.inkWidth + 2.4} sequential />
          {/* the stack (the interest coins drop into it), translated along the ride */}
          <g transform={`translate(${base[0] - RIDE.p0[0]} ${base[1] - RIDE.p0[1]})`}>
            <GrowStack cx={STACK.cx} baseY={STACK.baseY} n={STACK.n} rx={STACK.rx} ry={STACK.ry} th={STACK.th} t={at(CUES.stack)} pen={PEN} seed={22} drops={DROPS} from={DROP_FROM} dropDur={DROP_DUR} />
          </g>
          <Padlock cx={STACK.cx} cy={lockCy} w={LOCK.w} h={LOCK.h} open={open} t={at(CUES.lock)} pen={PEN} seed={24} dur={0.45} />
          <ClockFace cx={CLOCK.cx} cy={CLOCK.cy} r={CLOCK.r} t={at(CUES.clock)} spinT={spinT} pen={PEN} seed={26} />

          {/* ===== scene 3: on completion day it releases itself to the other side ===== */}
          <Person x={LENDER.x} gy={LENDER.gy} t={at(CUES.lender)} pen={PEN} seed={50} hair="cap" shirt={PEN.palette.blue} tie dur={0.6} shadow="legs" gaze="left" />
          <Type x={LENDER.x} y={LABEL.y} text={C('other side')} t={at(CUES.otherSide)} cps={22} size={LABEL.size} font={FL} color={INK} weight="700" charW={LABEL.charW} />
          <CheckBadge cx={BADGE.cx} cy={BADGE.cy} r={BADGE.r} t={at(CUES.badge)} pen={PEN} seed={52} sequential />

          {/* ===== scene 4 / payoff: the padlock from the whiteboard on real money, and the big one ===== */}
          <Type x={SAME.x} y={SAME.y} text={C('same padlock')} t={at(CUES.same)} cps={22} size={SAME.size} font={FL} color={INK} weight="700" charW={LABEL.charW} />
          <Type x={MONEY.x} y={MONEY.y} text={C('real money')} t={at(CUES.money)} cps={22} size={MONEY.size} font={FL} color={INK} weight="700" charW={LABEL.charW} />
          <g transform={`translate(0 ${rise})`}>
            <Island cx={BIG.cx} top={BIG.top} scale={BIG.scale} t={at(CUES.island)} bankT={at(CUES.island) - 0.1} vaultT={at(CUES.island) - 0.3} pen={PEN} seed={60} dur={0.7} waves={false} vaultOffset={BIG.vaultOffset} />
          </g>
          <Type x={TCH.x} y={TCH.y} text={C('The Clearing House')} t={at(CUES.tch)} cps={TCH.cps} size={TCH.size} font={FH} color={PEN.colorH} weight="700" charW={TCH.charW} spacing={TCH.spacing} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
