// whiteboard/beats/LongestBearSqueeze.tsx: the whiteboard beat of the scripted standard video `longest-bear`
// ("The Longest Crypto Bear Market Ever", crypto channel), card `the-squeeze` (SCRIPT.md CH4, kind `whiteboard`).
// He says (three `[COVER]` lines, 86 words AS RECORDED; the script's first question was "So why did it hurt twice?"):
//   "So why are we going through so much pain? One reason analysts keep pointing to is that there's two giant IPOs.
//    SpaceX raised around 75 billion dollars in June. Anthropic raised around 81 billion dollars in November."
//   "Analysts said that that kind of money has to come from somewhere, and a lot of it comes out of assets like crypto
//    and tech."
//   "Rate fears hit at the same time, and nobody can say for sure which one did more. But both times, money left the room."
// One canvas, three micro-scenes, nothing clears. (1) THE ROOM: a room seen from inside draws on, a mound of Bitcoin
// coins drops in, two doors draw on its back wall; the left door swings open and is named SPACEX 75B, coins roll out
// through it; the right door swings open, ANTHROPIC 81B, coins roll out through it. (2) THE SOURCE: the two amounts
// light up ("that kind of money"), then coins leave the mound through both doors turn by turn ("has to come from
// somewhere"), the coins flash on "crypto". (3) RATES: a third door draws in DASHES between the two (a way out nobody
// can measure), RATES over it, and in the slot where the other two doors carry their amount, a question mark; the
// three light up in turn ("which one did more"); on "both times" one more pair leaves through each door at once and
// comes to rest on the way out. The beat ends on that drawing.
// Canvas = the full frame 1920 x 1080 @30 (a scripted `[COVER]` fills the frame), no audio. Pen: neon-ink (black,
// gold and white, glow, no fills). SVG through rough.js, fixed seeds (no boil, deterministic).
// Facts on screen (RESEARCH.md 3d): SpaceX IPO priced 2026-06-11, about 75B raised; Anthropic IPO priced 2026-11-18,
// about 81B raised. On-screen wording: SPACEX 75B, ANTHROPIC 81B, RATES ? and nothing else (no dollar sign: persona
// money_format). NOT a measured flow (RESEARCH.md 3d / 5, "that IPO supply measurably drained crypto" is do-not-air):
// the two numbers are the DOORS' names (the size of each raise), never a count on the coins; no counter, no share, no
// number on a trail; the mound stays mostly full (14 of 45 coins leave, 7 through each door); the third door is a question.
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

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });
const { fontFamily: ROCKSALT } = loadRockSalt();
const { fontFamily: HANDLEE } = loadHandlee();
const FONTS: Record<string, string> = { 'Gochi Hand': GOCHI, Kalam: KALAM, 'Rock Salt': ROCKSALT, Handlee: HANDLEE };

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// =====================================================================================================================
// THE TIMING: the ONE block to edit when the spine changes. Everything below it follows these numbers.
// AS RECORDED: re-timed 2026-11-25 to the FINAL spine `spine/longest-bear EDIT.enhanced+clips.mp4` (the window:
// overlays/cues.json, run-03, card `the-squeeze`, 230.46 to 257.92 on the spine; the un-enhanced `EDIT+clips.mp4` is the
// same timeline, its envelope lags the enhanced one by 0 ms, and its cue pass read 230.48: the same first frame). The
// provisional build ran on onsets estimated from the script (28.0 s).
// How it is re-timed (the same three steps on a new spine):
//   1. WINDOW_S = the card's window in seconds = its frames / 30, the frames counted the way cover_runs.py counts
//      them: round(tOut * 30) - round(tIn * 30). A clip shorter than its window holds its last frame, a longer one is cut;
//   2. the beat's second 0 is the window's FIRST FRAME on the spine, round(tIn * 30) / 30 (here 6914 / 30 = 230.4667,
//      not 230.46): every CUES value = (the spoken word's onset on the spine) minus that, rounded UP to 0.01;
//   3. the onset is MEASURED ON THE AUDIO, never read from the words JSON alone: Whisper's word starts ran up to
//      0.34 s early inside a sentence here, and 0.19 to 0.82 s early after a pause (it hands the pause to the next
//      word: "One" 233.02 for 233.84, "But" 255.36 for 255.72). The mic chain is noise-gated, so a word after a pause
//      starts on the first sample that is not digital silence; inside a sentence the onset is the consonant's burst,
//      the first frication, or the vowel after a nasal, read off 10 ms band energies (voicing, F1, back F2, front F2,
//      sibilance) around the word.
// A thing draws AS he names it, never before: when in doubt, later. Nothing is drawn on a cue's own frame (`t <= 0`),
// so the first ink of every event lands 1 to 2 frames after the onset in its comment.
// =====================================================================================================================
/** the card's window on the FINAL spine, seconds (overlays/cues.json) */
const SPINE_IN = 230.46, SPINE_OUT = 257.92;
/** the beat's window, seconds: round(257.92 x 30) - round(230.46 x 30) = 7738 - 6914 = 824 frames = 27.47 s (the window reads 27.46 s off the frame grid) */
export const WINDOW_S = (Math.round(SPINE_OUT * FPS) - Math.round(SPINE_IN * FPS)) / FPS;
/** LOCAL seconds (0 = the window's first frame, 230.4667 on the spine), each hung on the spoken word in its comment; [its onset on the spine] */
export const CUES = {
  // ---- scene 1 (line 1): the room, the coins, the two doors ----
  room: 0.49,           // "So" [230.95] (why are we going through so much pain)   the room draws on: floor line, corners, ceiling, floorboards
  coins: 3.38,          // "One" [233.84] (reason analysts keep pointing to ...)   the coins drop in, the mound builds from its base (2.3 s, done under "there's")
  doors: 5.67,          // "two" [236.13] (giant IPOs)                  two closed doors draw on the back wall, left then right
  spacex: 7.38,         // "SpaceX" [237.84: its S runs on from the S of "IPOs", 237.71; its P closes here]   the left door swings open; SPACEX types over it
  spacexFlow: 8.05,     // "raised" [238.51]                            two coins leave the mound and roll out through that door
  b75: 8.79,            // "75" [239.25]                                75B lands under SPACEX (gold)
  anthropic: 10.64,     // "Anthropic" [241.10]                         the right door swings open; ANTHROPIC types over it
  anthropicFlow: 11.30, // "raised" [241.76]                            two coins roll out through that door
  b81: 11.80,           // "81" [242.26]                                81B lands under ANTHROPIC (gold)
  // ---- scene 2 (line 2): that kind of money comes from somewhere ----
  kind75: 15.47,        // "kind" [245.93] (that kind of money)         75B lights up
  kind81: 15.71,        // "money" [246.17]                             81B lights up
  stream: 16.39,        // "come" [246.85] (has to come from somewhere) six coins leave through both doors, turn by turn (to 20.18)
  crypto: 19.42,        // "crypto" [249.88]                            the coins left in the mound flash
  // ---- scene 3 (line 3): rates, and the question ----
  rates: 20.57,         // "Rate" [251.03] (fears hit at the same time) a third door draws in dashes between the two; RATES types over it
  nobody: 22.53,        // "nobody" [252.99] (can say for sure)         the question mark draws where the other doors carry their amount
  which: 23.94,         // "which" [254.40] (one did more)              75B, 81B and the question mark light up in turn (0.3 s apart: "which", "one", "more")
  both: 25.26,          // "But" [255.72] (both times, money left the room)   two more coins leave through EACH door at once and come to rest 1.2 s later
};
// The last motion: the coins of CUES.both are at rest 1.2 s after it (26.46 here), 0.71 s before the compositor's 0.3 s
// fade starts (WINDOW_S - 0.3 = 27.17). Keep CUES.both + 1.2 <= WINDOW_S - 0.8, or the beat ends on coins still rolling: it is
// hung on the clause's FIRST word for that reason. (The window closes on his last word, "room" ends at 257.84: a longer
// hold needs a later tOut.)
export const DUR = Math.round(WINDOW_S * FPS);

// ---- motion constants (not hung on words) ----
/**
 * the six coins of the stream: seconds after CUES.stream, left and right doors in turn. FITTED TO THE RECORDING with the
 * cues: he says "come ... crypto" in 3.03 s and "come ... Rate" in 4.18 s (the estimates were 3.79 and 4.98 s), so the
 * provisional stagger [0, 0.45, 1.3, 1.75, 2.5, 2.95] is the same pattern x 0.742. As designed, two coins are still on
 * their way out when the mound flashes on "crypto" (19.42), and the last one is through its door (STREAM[5] + HOP +
 * ROLL + EXIT after the cue = 20.18) before "Rate" draws the third door (20.57). Left at 2.95 the last coin would still
 * be leaving 0.37 s into the RATES scene.
 */
const STREAM = [0, 0.33, 0.96, 1.30, 1.86, 2.19];
/** a leaving coin: the hop off the mound, the roll along the floor to the door, the fade through the doorway (exported: the vertical drawing, LongestBearSqueezeV.tsx, moves its coins on the same clock) */
export const HOP = 0.4, ROLL = 0.9, EXIT = 0.3;

// ---- layout (1920 x 1080) ----
const VIEW: RoomView = { vp: [960, 410], D: 1520 };                       // eye level about four fifths up the doors
const BOX: RoomBox = { x0: 60, x1: 1860, y0: 52, y1: 1034 };              // nothing of the room runs past this
const ROOM = { x0: 170, x1: 1750, top: 92, gy: 650 };                     // the back wall; gy = its floor line
const BOARDS = [245, 375, 505, 635, 765, 895, 1025, 1155, 1285, 1415, 1545, 1675];
// the outer doors stand 14 px inside a third of the wall each: ANTHROPIC (464 px at 78) keeps ~50 px to the right corner
const DOOR = { w: 190, h: 300, spacex: 454, rates: 960, anthropic: 1466 };
// the amounts are set in the LABEL font, thickened: Rock Salt's "1" is a bare slash ("81B" read "8/B" on the round-1 still)
const SIGN = { nameY: 186, numY: 306, nameSize: 78, numSize: 104 };
const QM = { cy: 264, size: 100, stroke: 9 };                              // the question mark, in the amounts' row
const FLOOR_Y = 1013;                                                      // where the mound stands (the coins' feet): ~56 px of air to the frame's bottom
const COIN_R = 40;
// six rows, 45 coins. The three top rows (3 + 4 + 7 = 14 coins) are the ones that leave; the three under them never move
const MOUND = coinMound(960, FLOOR_Y, [12, 11, 8, 7, 4, 3], { r: COIN_R, dx: 60, dy: 36, jitter: 5, seed: 7 });
/** the order the mound builds in: the base row first, each row from its middle outward */
const BORN = new Map<MoundCoin, number>([...MOUND].sort((a, b) => (a.row - b.row) || (Math.abs(a.x - 960) - Math.abs(b.x - 960))).map((c, n) => [c, n * 0.045]));

type Pt = [number, number];
export type Side = 'L' | 'R';
/** the two ways out, as the path of a coin's FOOT on the floor: off the mound's flank, round to the door's threshold */
const TRAILS: Record<Side, { p0: Pt; p1: Pt; p2: Pt }> = {
  L: { p0: [540, FLOOR_Y], p1: [428, 996], p2: [DOOR.spacex, 668] },
  R: { p0: [1380, FLOOR_Y], p1: [1492, 996], p2: [DOOR.anthropic, 668] },
};
/** a coin's size on the floor: full size at the mound, smaller toward the back wall (softened, so it still reads at the door) */
const coinK = (footY: number) => Math.pow(Math.max(0.05, (footY - VIEW.vp[1]) / (FLOOR_Y - VIEW.vp[1])), 0.62);
/** arc length of a quadratic from 0 to parameter `u` (sampled) */
const quadLen = (q: { p0: Pt; p1: Pt; p2: Pt }, u = 1) => {
  let len = 0, prev = q.p0;
  for (let i = 1; i <= 60; i++) { const pt = bezier(q.p0, q.p1, q.p2, (u * i) / 60); len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]); prev = pt; }
  return len;
};
const TRAIL_LEN: Record<Side, number> = { L: quadLen(TRAILS.L), R: quadLen(TRAILS.R) };

/**
 * the coins that leave: which coin of the mound (row from the base, i from the left), through which door, when; `rest` = it stops that far along the trail.
 * Exported: the vertical drawing (LongestBearSqueezeV.tsx) takes `side`, `at` and `rest` from this list, in this order, and names its own coins.
 */
export type Leaver = { side: Side; row: number; i: number; at: number; rest?: number };
export const LEAVERS: Leaver[] = [
  // SpaceX: the first money out, through the left door (the top of the mound, its left)
  { side: 'L', row: 5, i: 0, at: CUES.spacexFlow },
  { side: 'L', row: 5, i: 1, at: CUES.spacexFlow + 0.5 },
  // Anthropic: through the right door
  { side: 'R', row: 5, i: 2, at: CUES.anthropicFlow },
  { side: 'R', row: 4, i: 3, at: CUES.anthropicFlow + 0.5 },
  // "has to come from somewhere ... comes out of assets": both doors, turn by turn
  { side: 'L', row: 4, i: 0, at: CUES.stream + STREAM[0] },
  { side: 'R', row: 4, i: 2, at: CUES.stream + STREAM[1] },
  { side: 'L', row: 4, i: 1, at: CUES.stream + STREAM[2] },
  { side: 'R', row: 3, i: 6, at: CUES.stream + STREAM[3] },
  { side: 'L', row: 3, i: 0, at: CUES.stream + STREAM[4] },
  { side: 'R', row: 3, i: 5, at: CUES.stream + STREAM[5] },
  // "both times": one more pair through each door at once; they come to rest on the way out (the finished drawing)
  { side: 'L', row: 3, i: 1, at: CUES.both, rest: 0.74 },
  { side: 'R', row: 3, i: 4, at: CUES.both, rest: 0.74 },
  { side: 'L', row: 3, i: 2, at: CUES.both + 0.24, rest: 0.36 },
  { side: 'R', row: 3, i: 3, at: CUES.both + 0.24, rest: 0.36 },
];
const LEAVER_OF = new Map<MoundCoin, Leaver>(LEAVERS.map((lv) => [MOUND.find((c) => c.row === lv.row && c.i === lv.i) as MoundCoin, lv]));
const FIRST: Record<Side, Leaver> = { L: LEAVERS.find((l) => l.side === 'L') as Leaver, R: LEAVERS.find((l) => l.side === 'R') as Leaver };

/** how far along its roll (0..1 of its own stretch) a leaver is at local time T, eased; a coin that rests slows to a stop */
const rollEase = (lv: Leaver, T: number) => {
  const end = lv.rest ?? 1, u = prog(T - lv.at, HOP, ROLL * (0.4 + 0.6 * end));
  return lv.rest ? easeOut(u) : u * u * (3 - 2 * u);
};

/** where a leaving coin is at local time T: its centre, scale, turn and opacity; `front` = it has cleared the mound */
const journey = (c: MoundCoin, lv: Leaver, T: number) => {
  const tt = T - lv.at, tr = TRAILS[lv.side];
  const sx = tr.p0[0], sy = tr.p0[1] - c.r;                                // where the hop lands (the coin's centre)
  if (tt < HOP) {
    const u = tt / HOP, e = u * u * (3 - 2 * u), lift = 64 + Math.max(0, sy - c.y) * 0.2;
    return { x: c.x + (sx - c.x) * e, y: c.y + (sy - c.y) * u - 4 * lift * u * (1 - u), k: 1, rot: 0, op: 1, front: u >= 0.3 };
  }
  const end = lv.rest ?? 1, rollDur = ROLL * (0.4 + 0.6 * end), er = rollEase(lv, T);
  const [bx, by] = bezier(tr.p0, tr.p1, tr.p2, end * er);
  const turns = Math.max(1, Math.round(2 * end));                          // ~its circumference per turn; WHOLE turns, so a coin at rest stands upright
  const rot = (lv.side === 'L' ? -1 : 1) * 360 * turns * er;
  let k = coinK(by), x = bx, y = by - c.r * k, op = 1;
  if (!lv.rest && tt > HOP + rollDur) {
    // through the doorway: straight back, toward the vanishing point, smaller, gone
    const v = prog(tt, HOP + rollDur, EXIT), fx = bx + (VIEW.vp[0] - bx) * 0.1 * v, fy = by + (VIEW.vp[1] - by) * 0.1 * v;
    k = coinK(fy) * (1 - 0.1 * v); x = fx; y = fy - c.r * k; op = 1 - v * v;
  }
  return { x, y, k, rot, op, front: true };
};

export const LongestBearSqueeze: React.FC<{ penId?: string }> = ({ penId = 'neon-ink' }) => {
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
   * an amount under a door's name: the label font in gold, thickened by a stroke of its own colour (the pen's display
   * font draws "1" as a slash), wiped on like a marker stroke; `lit` swells a halo behind it (never a scale: SVG text)
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
        <text {...tx} fill={GOLD} stroke={GOLD} strokeWidth={2.6} clipPath={done ? undefined : `url(#${id})`}>{text}</text>
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
          {/* ===== scene 1: the room ===== */}
          <RoomShell {...ROOM} view={VIEW} box={BOX} boards={BOARDS} t={at(CUES.room)} pen={PEN} seed={1} dur={1.25} />

          {/* ===== the three doors on the back wall: SPACEX, the dashed one (scene 3), ANTHROPIC ===== */}
          <RoomDoor cx={DOOR.rates} gy={ROOM.gy} w={DOOR.w} h={DOOR.h} view={VIEW} t={at(CUES.rates)} pen={PEN} seed={4} color={GHOST} dur={0.7} ghost />
          <RoomDoor cx={DOOR.spacex} gy={ROOM.gy} w={DOOR.w} h={DOOR.h} view={VIEW} hinge="left" t={at(CUES.doors)} openT={at(CUES.spacex)} pen={PEN} seed={2} />
          <RoomDoor cx={DOOR.anthropic} gy={ROOM.gy} w={DOOR.w} h={DOOR.h} view={VIEW} hinge="right" t={at(CUES.doors) - 0.3} openT={at(CUES.anthropic)} pen={PEN} seed={3} />

          {/* the doors' names, and under each name its amount (the third door carries a question mark there) */}
          <TypeHold x={DOOR.spacex} y={SIGN.nameY} text={C('spacex')} t={at(CUES.spacex) - 0.1} cps={26} size={SIGN.nameSize} font={FL} color={L} anchor="middle" />
          {amount(DOOR.spacex, '75B', CUES.b75, lit75, 'sq-75')}
          <TypeHold x={DOOR.anthropic} y={SIGN.nameY} text={C('anthropic')} t={at(CUES.anthropic) - 0.1} cps={30} size={SIGN.nameSize} font={FL} color={L} anchor="middle" />
          {amount(DOOR.anthropic, '81B', CUES.b81, lit81, 'sq-81')}
          <TypeHold x={DOOR.rates} y={SIGN.nameY} text={C('rates')} t={at(CUES.rates) - 0.15} cps={24} size={SIGN.nameSize} font={FL} color={L} anchor="middle" />
          {litQ > 0 && <g opacity={0.4 * litQ}><QMark cx={DOOR.rates} cy={QM.cy} size={QM.size} t={at(CUES.nobody)} pen={PEN} seed={6} color={GOLD} dur={0.5} stroke={QM.stroke + 14 * litQ} /></g>}
          <QMark cx={DOOR.rates} cy={QM.cy} size={QM.size} t={at(CUES.nobody)} pen={PEN} seed={6} color={GOLD} dur={0.5} stroke={QM.stroke} />
          {/* the dot, solid (a no-fill pen draws QMark's dot as a ring; at this weight the mark wants a full stop) */}
          {at(CUES.nobody) > 0.42 && <circle cx={DOOR.rates + QM.size * 0.02} cy={QM.cy + QM.size * 0.42} r={QM.size * 0.042 + 4} fill={GOLD} />}

          {/* ===== the ways out, on the floor ===== */}
          {trail('L', 30)}
          {trail('R', 34)}

          {/* ===== the coins: loose stacks at the sides, the mound, then the coins on their way out ===== */}
          <WireCoinStack cx={262} baseY={1014} n={4} rx={30} ry={9} th={11} t={at(CUES.coins) - 1.5} pen={PEN} seed={41} />
          <WireCoinStack cx={338} baseY={1022} n={2} rx={30} ry={9} th={11} t={at(CUES.coins) - 1.62} pen={PEN} seed={42} />
          <WireCoinStack cx={1658} baseY={1014} n={3} rx={30} ry={9} th={11} t={at(CUES.coins) - 1.7} pen={PEN} seed={43} />
          <WireCoinStack cx={1582} baseY={1022} n={5} rx={30} ry={9} th={11} t={at(CUES.coins) - 1.82} pen={PEN} seed={44} />
          {MOUND.map((c, n) => {
            const lv = LEAVER_OF.get(c), born = at(CUES.coins) - (BORN.get(c) ?? 0);
            if (lv && T >= lv.at) {
              const j = journey(c, lv, T);
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
            const j = journey(c, lv, T);
            return j.front && j.op > 0 ? <BtcCoin key={n} cx={j.x} cy={j.y} r={c.r} k={j.k} rot={j.rot} opacity={j.op} pen={PEN} seed={100 + n} /> : null;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
