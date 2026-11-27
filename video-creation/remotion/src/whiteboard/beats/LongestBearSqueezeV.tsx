// whiteboard/beats/LongestBearSqueezeV.tsx: the VERTICAL (9:16) drawing of the longest-bear whiteboard beat `the-squeeze`
// (scripted standard video "The Longest Crypto Bear Market Ever", the vertical cut: script.md "The vertical cut").
// The 16:9 scene is `LongestBearSqueeze.tsx`. This is the same beat RE-COMPOSED for a tall frame, never that scene scaled
// or cropped: the same objects (the room seen from inside, the mound of Bitcoin coins, the two panel doors that swing
// open, the dashed third door, the dotted ways out on the floor, the loose stacks), the same words (SPACEX 75B,
// ANTHROPIC 81B, RATES ? and nothing else: see the fact notes in the 16:9 file, they hold here word for word), the same
// pen (neon-ink) and THE SAME CLOCK: `CUES`, `WINDOW_S`, `DUR`, the leavers' schedule and the motion constants are
// IMPORTED from the 16:9 scene, so the two clips cannot drift apart (a re-time there re-times both; nothing here is hung
// on a word of its own).
// How the tall frame is used (1080 x 1920 @30, no audio):
//   - THREE COLUMNS, one per door: the door's name, under it its amount (the third door: a question mark), the door, and
//     straight under the door its way out on the floor. The back wall takes the frame's width, so of the room's side
//     walls only the corner ticks are left; the floorboards carry the depth;
//   - the floor is DEEP instead of wide: the doors stand high in the frame, the coins roll a long way up to them;
//   - the mound is drawn NARROWER AND TALLER: seven rows on a ten-coin base, stepped like the 16:9's, 45 coins as there.
//     The same 14 leave (7 a door), from the top down; the three rows under them never move (the mound stays mostly
//     full: not a measured flow). A heap with a blunt top on purpose, never a pointed triangle of coins;
//   - THE LOWER THIRD (below y 1280) carries nothing but the floorboards running out toward the viewer: a phone's
//     interface sits there. Every word, every door and every coin stands above it.
// SVG through rough.js, fixed seeds (no boil, deterministic). Read on a phone: the names are 54 px (the widest,
// ANTHROPIC, sets the size: three names share one 1080 px row), the amounts 116 px.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { loadFont as loadRockSalt } from '@remotion/google-fonts/RockSalt';
import { loadFont as loadHandlee } from '@remotion/google-fonts/Handlee';
import { PENS } from '../pen';
import { Sketch, prog, easeOut } from '../Sketch';
import { bezier } from '../vocab';
import { DotTrail, WireCoinStack } from '../canton';
import { QMark } from '../token';
import { TypeHold } from '../funnel';
import { BtcCoin, RoomDoor, RoomShell, coinMound } from '../room';
import type { MoundCoin, RoomBox, RoomView } from '../room';
// THE TIMING is the 16:9 scene's, imported: the cue table, the window, the frame count, who leaves when and how long a hop / a roll / an exit takes
import { CUES, DUR as DUR_WIDE, EXIT, FPS as FPS_WIDE, HOP, LEAVERS, ROLL, WINDOW_S } from './LongestBearSqueeze';
import type { Side } from './LongestBearSqueeze';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = FPS_WIDE;
export const W = 1080;
export const H = 1920;
/** the same window as the 16:9 clip, frame for frame (round(WINDOW_S x 30): 824 frames on the as-recorded spine) */
export const DUR = DUR_WIDE;
export { CUES, WINDOW_S };

// ---- layout (1080 x 1920) ----
const CX = W / 2;
/** below this line the frame stays light (the lower third: a phone's interface sits there); only the floorboards cross it */
const LIGHT_Y = 1280;
const VIEW: RoomView = { vp: [CX, 459], D: 1300 };                        // eye level about four fifths up the doors, as in the 16:9
const BOX: RoomBox = { x0: 14, x1: 1066, y0: 60, y1: 1876 };              // nothing of the room runs past this (the corner ticks and the boards end here, glow and all inside the frame)
const ROOM = { x0: 32, x1: 1048, top: 122, gy: 736 };                     // the back wall; gy = its floor line
const BOARDS = [100, 180, 260, 340, 420, 500, 580, 660, 740, 820, 900, 980];
// three doors, 315 px apart, as far apart as the widest name allows. Measured on the last still: ANTHROPIC (320 px at
// 54) keeps 32 px to the wall's right edge and 70 px to RATES, SPACEX 123 px to RATES (round 1, at 56 px and 305 px
// apart, left RATES 48 px from ANTHROPIC: on a phone-size still the two read as one phrase)
const DOOR = { w: 170, h: 346, spacex: CX - 315, rates: CX, anthropic: CX + 315, open: 104 };
// the amounts are set in the LABEL font, thickened (the 16:9's reason: Rock Salt's "1" is a bare slash)
const SIGN = { nameY: 208, numY: 344, nameSize: 54, numSize: 116 };
const QM = { cy: 303, size: 110, stroke: 10 };                             // the question mark, in the amounts' row
const FLOOR_Y = 1262;                                                      // where the mound stands (the coins' feet): 18 px above the light line
const COIN_R = 37;
// seven rows, 45 coins: a five-row heap and a cap of 3 + 2 on it. The cap, the fifth row but one coin and the ends of the
// fourth (2 + 3 + 5 + 4 = 14 coins) are the ones that leave; the three rows under them never move
const MOUND_DX = 52;
const MOUND = coinMound(CX, FLOOR_Y, [10, 9, 8, 7, 6, 3, 2], { r: COIN_R, dx: MOUND_DX, dy: 34, jitter: 5, seed: 7 });
/** the order the mound builds in: the base row first, each row from its middle outward */
const BORN = new Map<MoundCoin, number>([...MOUND].sort((a, b) => (a.row - b.row) || (Math.abs(a.x - CX) - Math.abs(b.x - CX))).map((c, n) => [c, n * 0.045]));

type Pt = [number, number];
/** the two ways out, as the path of a coin's FOOT on the floor: off the mound's flank, then up the floor to the door's threshold */
const LAND = 4.5 * MOUND_DX + 2 * COIN_R + 12;                             // the landing spot, from the frame's middle: a coin's width and 12 px off the base row's end
const TRAILS: Record<Side, { p0: Pt; p1: Pt; p2: Pt }> = {
  L: { p0: [CX - LAND, FLOOR_Y], p1: [CX - LAND - 30, 1030], p2: [DOOR.spacex, ROOM.gy + 18] },
  R: { p0: [CX + LAND, FLOOR_Y], p1: [CX + LAND + 30, 1030], p2: [DOOR.anthropic, ROOM.gy + 18] },
};
/** a coin's size on the floor: full size at the mound, smaller toward the back wall (softened, so it still reads at the door) */
const coinK = (footY: number) => Math.pow(Math.max(0.05, (footY - VIEW.vp[1]) / (FLOOR_Y - VIEW.vp[1])), 0.55);
/** arc length of a quadratic from 0 to parameter `u` (sampled) */
const quadLen = (q: { p0: Pt; p1: Pt; p2: Pt }, u = 1) => {
  let len = 0, prev = q.p0;
  for (let i = 1; i <= 60; i++) { const pt = bezier(q.p0, q.p1, q.p2, (u * i) / 60); len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]); prev = pt; }
  return len;
};
const TRAIL_LEN: Record<Side, number> = { L: quadLen(TRAILS.L), R: quadLen(TRAILS.R) };

/**
 * which coin of the TALL mound each leaver of the shared schedule is ([row from the base, i from the left]), in the
 * schedule's order (LEAVERS in the 16:9 scene: SpaceX's two, Anthropic's two, the stream of six, the four of "both
 * times"). The pile is eaten from its top; a coin goes only once nothing rests on it (a coin rests on the two under
 * it); the left of a row leaves by the left door, the right by the right door. Of the fifth row [4, 2] stays, of the
 * fourth its middle three.
 */
const PICK: [number, number][] = [
  [6, 0], [5, 0],                                     // SpaceX: the cap's top left, then the left coin under it
  [6, 1], [5, 2],                                     // Anthropic: the cap's top right, then the right coin under it
  [5, 1], [4, 5], [4, 0], [4, 4], [4, 1], [4, 3],     // "has to come from somewhere": both doors, turn by turn
  [3, 0], [3, 6], [3, 1], [3, 5],                     // "both times": a pair through each door at once
];
if (PICK.length !== LEAVERS.length) throw new Error('LongestBearSqueezeV: PICK names one coin per leaver of the 16:9 schedule');
type VLeaver = { side: Side; at: number; rest?: number; coin: MoundCoin };
const V_LEAVERS: VLeaver[] = LEAVERS.map((lv, n) => {
  const coin = MOUND.find((c) => c.row === PICK[n][0] && c.i === PICK[n][1]);
  if (!coin) throw new Error(`LongestBearSqueezeV: no coin at row ${PICK[n][0]}, i ${PICK[n][1]}`);
  return { side: lv.side, at: lv.at, rest: lv.rest, coin };
});
const LEAVER_OF = new Map<MoundCoin, VLeaver>(V_LEAVERS.map((lv) => [lv.coin, lv]));
const FIRST: Record<Side, VLeaver> = { L: V_LEAVERS.find((l) => l.side === 'L') as VLeaver, R: V_LEAVERS.find((l) => l.side === 'R') as VLeaver };

/** how far along its roll (0..1 of its own stretch) a leaver is at local time T, eased; a coin that rests slows to a stop */
const rollEase = (lv: VLeaver, T: number) => {
  const end = lv.rest ?? 1, u = prog(T - lv.at, HOP, ROLL * (0.4 + 0.6 * end));
  return lv.rest ? easeOut(u) : u * u * (3 - 2 * u);
};

/** where a leaving coin is at local time T: its centre, scale, turn and opacity; `front` = it has cleared the mound */
const journey = (lv: VLeaver, T: number) => {
  const c = lv.coin, tt = T - lv.at, tr = TRAILS[lv.side];
  const sx = tr.p0[0], sy = tr.p0[1] - c.r;                                // where the hop lands (the coin's centre)
  if (tt < HOP) {
    const u = tt / HOP, e = u * u * (3 - 2 * u), lift = 64 + Math.max(0, sy - c.y) * 0.2;
    return { x: c.x + (sx - c.x) * e, y: c.y + (sy - c.y) * u - 4 * lift * u * (1 - u), k: 1, rot: 0, op: 1, front: u >= 0.3 };
  }
  const end = lv.rest ?? 1, rollDur = ROLL * (0.4 + 0.6 * end), er = rollEase(lv, T);
  const [bx, by] = bezier(tr.p0, tr.p1, tr.p2, end * er);
  const turns = Math.max(1, Math.round(2 * end));                          // the 16:9's spin (at most 40 degrees a frame: the mark stays readable while it rolls); WHOLE turns, so a coin at rest stands upright
  const rot = (lv.side === 'L' ? -1 : 1) * 360 * turns * er;
  let k = coinK(by), x = bx, y = by - c.r * k, op = 1;
  if (!lv.rest && tt > HOP + rollDur) {
    // through the doorway: straight back, toward the vanishing point, smaller, gone
    const v = prog(tt, HOP + rollDur, EXIT), fx = bx + (VIEW.vp[0] - bx) * 0.1 * v, fy = by + (VIEW.vp[1] - by) * 0.1 * v;
    k = coinK(fy) * (1 - 0.1 * v); x = fx; y = fy - c.r * k; op = 1 - v * v;
  }
  return { x, y, k, rot, op, front: true };
};

export const LongestBearSqueezeV: React.FC<{ penId?: string }> = ({ penId = 'neon-ink' }) => {
  const PEN = PENS[penId] ?? PENS['neon-ink'];
  const FL = FONTS[PEN.fontL];           // every word on this board is in the pen's label font (see SIGN)
  const C = (s: string) => (PEN.caps ? s.toUpperCase() : s);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;                 // local seconds
  const at = (cue: number) => T - cue;   // time since a cue (negative = not yet)

  const L = PEN.colorL, GOLD = PEN.colorH, GHOST = PEN.dark;
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  /** a short swell of light on a thing that is being talked about (no transform: an SVG text is never scaled) */
  const pulse = (cue: number) => interpolate(at(cue), [0, 0.14, 0.62], [0, 1, 0], clamp);
  const lit75 = Math.max(pulse(CUES.kind75), pulse(CUES.which));
  const lit81 = Math.max(pulse(CUES.kind81), pulse(CUES.which + 0.3));
  const litQ = pulse(CUES.which + 0.6);
  const flash = interpolate(at(CUES.crypto), [0, 0.16, 0.8], [0, 1, 0], clamp);

  /**
   * an amount under a door's name: the label font in gold, thickened by a stroke of its own colour, wiped on like a
   * marker stroke; `lit` swells a halo behind it (never a scale: SVG text)
   */
  const amount = (x: number, text: string, cue: number, lit: number, id: string) => {
    const tt = at(cue);
    if (tt <= 0) return null;
    const p = easeOut(prog(tt, 0, 0.42)), done = p >= 1, est = text.length * SIGN.numSize * 0.66;
    const tx = { x, y: SIGN.numY, fontFamily: `'${FL}', cursive`, fontSize: SIGN.numSize, textAnchor: 'middle' as const, letterSpacing: 0.05 * SIGN.numSize, strokeLinejoin: 'round' as const };
    return (
      <g>
        {lit > 0 && done && <text {...tx} fill="none" stroke={GOLD} strokeWidth={3 + 16 * lit} opacity={0.4 * lit}>{text}</text>}
        {!done && <defs><clipPath id={id}><rect x={x - est / 2 - 40} y={SIGN.numY - SIGN.numSize * 1.2} width={(est + 80) * p} height={SIGN.numSize * 1.7} /></clipPath></defs>}
        <text {...tx} fill={GOLD} stroke={GOLD} strokeWidth={2.8} clipPath={done ? undefined : `url(#${id})`}>{text}</text>
      </g>
    );
  };

  /** a way out drawn on the floor: the dotted wake of the first coin through that door, then a chevron at the threshold */
  const trail = (side: Side, seed: number) => {
    const tr = TRAILS[side], first = FIRST[side], er = rollEase(first, T);
    if (at(first.at) <= HOP) return null;
    const ang = Math.atan2(tr.p2[1] - tr.p1[1], tr.p2[0] - tr.p1[0]), hd = 26;
    const head = `M ${tr.p2[0] - hd * Math.cos(ang - 0.55)} ${tr.p2[1] - hd * Math.sin(ang - 0.55)} L ${tr.p2[0]} ${tr.p2[1]} L ${tr.p2[0] - hd * Math.cos(ang + 0.55)} ${tr.p2[1] - hd * Math.sin(ang + 0.55)}`;
    return (
      <g>
        <DotTrail p0={tr.p0} p1={tr.p1} p2={tr.p2} p={Math.min(quadLen(tr, er), TRAIL_LEN[side] - 30) / TRAIL_LEN[side]} pen={PEN} seed={seed} color={GOLD} />
        <Sketch pen={PEN} seed={seed + 1} shape={{ kind: 'path', d: head }} stroke={GOLD} strokeWidth={PEN.inkWidth + 1.4} roughness={0.5} progress={easeOut(prog(at(first.at), HOP + ROLL - 0.12, 0.22))} sequential />
      </g>
    );
  };

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
          {/* ===== scene 1: the room (the floorboards are the only ink that crosses LIGHT_Y) ===== */}
          <RoomShell {...ROOM} view={VIEW} box={BOX} boards={BOARDS} t={at(CUES.room)} pen={PEN} seed={1} dur={1.25} />

          {/* ===== the three doors on the back wall: SPACEX, the dashed one (scene 3), ANTHROPIC ===== */}
          <RoomDoor cx={DOOR.rates} gy={ROOM.gy} w={DOOR.w} h={DOOR.h} view={VIEW} t={at(CUES.rates)} pen={PEN} seed={4} color={GHOST} dur={0.7} ghost />
          <RoomDoor cx={DOOR.spacex} gy={ROOM.gy} w={DOOR.w} h={DOOR.h} view={VIEW} hinge="left" maxAngle={DOOR.open} t={at(CUES.doors)} openT={at(CUES.spacex)} pen={PEN} seed={2} />
          <RoomDoor cx={DOOR.anthropic} gy={ROOM.gy} w={DOOR.w} h={DOOR.h} view={VIEW} hinge="right" maxAngle={DOOR.open} t={at(CUES.doors) - 0.3} openT={at(CUES.anthropic)} pen={PEN} seed={3} />

          {/* the doors' names, and under each name its amount (the third door carries a question mark there) */}
          <TypeHold x={DOOR.spacex} y={SIGN.nameY} text={C('spacex')} t={at(CUES.spacex) - 0.1} cps={26} size={SIGN.nameSize} font={FL} color={L} anchor="middle" />
          {amount(DOOR.spacex, '75B', CUES.b75, lit75, 'sqv-75')}
          <TypeHold x={DOOR.anthropic} y={SIGN.nameY} text={C('anthropic')} t={at(CUES.anthropic) - 0.1} cps={30} size={SIGN.nameSize} font={FL} color={L} anchor="middle" />
          {amount(DOOR.anthropic, '81B', CUES.b81, lit81, 'sqv-81')}
          <TypeHold x={DOOR.rates} y={SIGN.nameY} text={C('rates')} t={at(CUES.rates) - 0.15} cps={24} size={SIGN.nameSize} font={FL} color={L} anchor="middle" />
          {litQ > 0 && <g opacity={0.4 * litQ}><QMark cx={DOOR.rates} cy={QM.cy} size={QM.size} t={at(CUES.nobody)} pen={PEN} seed={6} color={GOLD} dur={0.5} stroke={QM.stroke + 14 * litQ} /></g>}
          <QMark cx={DOOR.rates} cy={QM.cy} size={QM.size} t={at(CUES.nobody)} pen={PEN} seed={6} color={GOLD} dur={0.5} stroke={QM.stroke} />
          {/* the dot, solid (a no-fill pen draws QMark's dot as a ring; at this weight the mark wants a full stop) */}
          {at(CUES.nobody) > 0.42 && <circle cx={DOOR.rates + QM.size * 0.02} cy={QM.cy + QM.size * 0.42} r={QM.size * 0.042 + 4} fill={GOLD} />}

          {/* ===== the ways out, on the floor ===== */}
          {trail('L', 30)}
          {trail('R', 34)}

          {/* ===== the coins: loose stacks at the sides, the mound, then the coins on their way out ===== */}
          <WireCoinStack cx={66} baseY={LIGHT_Y - 24} n={4} rx={26} ry={8} th={10.5} t={at(CUES.coins) - 1.5} pen={PEN} seed={41} />
          <WireCoinStack cx={124} baseY={LIGHT_Y - 16} n={2} rx={26} ry={8} th={10.5} t={at(CUES.coins) - 1.62} pen={PEN} seed={42} />
          <WireCoinStack cx={W - 66} baseY={LIGHT_Y - 24} n={3} rx={26} ry={8} th={10.5} t={at(CUES.coins) - 1.7} pen={PEN} seed={43} />
          <WireCoinStack cx={W - 124} baseY={LIGHT_Y - 16} n={5} rx={26} ry={8} th={10.5} t={at(CUES.coins) - 1.82} pen={PEN} seed={44} />
          {MOUND.map((c, n) => {
            const lv = LEAVER_OF.get(c), born = at(CUES.coins) - (BORN.get(c) ?? 0);
            if (lv && T >= lv.at) {
              const j = journey(lv, T);
              // the first third of its hop it is still IN the pile (the coins in front of it hide its foot)
              return j.front ? null : <BtcCoin key={n} cx={j.x} cy={j.y} r={c.r} pen={PEN} seed={100 + n} />;
            }
            if (born <= 0) return null;
            const drop = 56 * (1 - easeOut(prog(born, 0, 0.28)));
            return <BtcCoin key={n} cx={c.x} cy={c.y - drop} r={c.r} t={born} pen={PEN} seed={100 + n} boost={flash} />;
          })}
          {MOUND.map((c, n) => {
            const lv = LEAVER_OF.get(c);
            if (!lv || T < lv.at) return null;
            const j = journey(lv, T);
            return j.front && j.op > 0 ? <BtcCoin key={n} cx={j.x} cy={j.y} r={c.r} k={j.k} rot={j.rot} opacity={j.op} pen={PEN} seed={100 + n} /> : null;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
