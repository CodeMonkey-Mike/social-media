// WhiteboardHorseTest.tsx: the SECOND whiteboard test (Mike, 2026-10-30): the beats of 0:15 to 0:38 of David Shapiro's
// "You Are The Next Horse" (Kd8mpwU4-JA), re-drawn in OUR vocabulary (hand-drawn with hair) and OUR pen (paper-pastel).
// Same actions, our drawings: three cards (sport / recreation / therapy) draw on under "today, 6.6 million horses in
// America"; the heading fades and "we like them" types with "the economy needs them" struck in red; a cut to a farm
// (barn, silo, hills, fence, tree) with a plow horse walking in place; "a century ago" types and the year rolls down to
// 1918; "26.7 million horses and mules" types while ~40 horses populate the field; the year flips to 1920 and a half-dial
// gauge fills to 89% "draft power". 1920x1080 @30, 23.5 s = 705 frames, no audio. Local t = seconds from 0:15.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont as loadGochi } from '@remotion/google-fonts/GochiHand';
import { loadFont as loadKalam } from '@remotion/google-fonts/Kalam';
import { PAPER_PASTEL } from './whiteboard/pen';
import { CountUp, Person, Shadow, Strike, Type } from './whiteboard/vocab';
import { Barn, Card, Fence, Furrow, Gauge, HeartIcon, Hearts, Hills, Horse, JumpBar, RollNumber, Tree, herdLayout } from './whiteboard/farm';

const { fontFamily: GOCHI } = loadGochi();
const { fontFamily: KALAM } = loadKalam('normal', { weights: ['400', '700'] });

export const FPS = 30;
export const DUR = Math.round(23.5 * FPS);

const PEN = PAPER_PASTEL;
const BROWN_TXT = '#8a5a30'; // the number headings, a darker cousin of the pen's brown

// ---- storyboard: original timestamps minus 15.0 s ----
const C = {
  heading: 0.0,
  card1: 0.0, label1: 0.3, card2: 0.5, label2: 1.0, card3: 2.0, label3: 2.3,
  headingOut: 5.0,
  heart: 5.5, weLike: 5.6, economy: 6.5, strike: 8.5,
  sceneOut: 9.0,
  farm: 9.4, barn: 9.5, plowHorse: 9.6, plowMove: 11.5, fence: 9.8, tree: 10.0, century: 10.0,
  yearRoll: 12.0,
  million: 15.0, herd: 15.0, mules: 17.0, millionOut: 18.5,
  year1920: 19.0, gauge: 19.0, gaugeFill: 21.5, pct: 21.6, draft: 22.5,
};

const HERD = herdLayout(38, { x1: 470, x2: 1700, y1: 560, y2: 688 }, 11);

export const WhiteboardHorseTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = frame / fps;
  const at = (cue: number) => T - cue;
  const fadeOut = (start: number, dur = 0.35) => interpolate(T, [start, start + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const sceneA = fadeOut(C.sceneOut);
  const headingA = Math.min(sceneA, fadeOut(C.headingOut, 0.4));
  const millionOp = fadeOut(C.millionOut, 0.5);
  // the plow horse stands for two seconds, then crawls right at a steady walk (his covers about a third of the width)
  const plowX = 300 + interpolate(T, [C.plowMove, 23.5], [0, 430], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const gaugeValue = interpolate(at(C.gaugeFill), [0, 0.8], [0, 0.89], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  // card geometry: three 480x300 frames whose bottoms meet the paper's floor band
  const CY = 360, CH = 300, CW = 480, CX = [120, 720, 1320];
  const HY = CY + CH - 50 - 136; // horse origin so the hooves (local 272 * 0.5) stand 50 px above the card bottom

  return (
    <AbsoluteFill style={{ backgroundColor: PEN.bg }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
        {PEN.floor && <rect x={0} y={660} width={1920} height={420} fill={PEN.floor} />}

        {/* ================= scene A + B: today's horses, we like them ================= */}
        {sceneA > 0 && (
          <g opacity={sceneA}>
            <g opacity={headingA}>
              <Type x={140} y={120} text="today" t={at(C.heading)} cps={30} size={46} font={KALAM} color={PEN.colorL} anchor="start" />
              <Type x={960} y={122} text="6.6 million" t={at(C.heading) - 0.1} cps={30} size={84} font={GOCHI} color={BROWN_TXT} weight="700" charW={0.41} />
              <Type x={960} y={168} text="horses in America" t={at(C.heading) - 0.4} cps={40} size={32} font={KALAM} color={PEN.colorL} />
            </g>

            {/* card 1: sport, a jump */}
            <Card x={CX[0]} y={CY} w={CW} h={CH} t={at(C.card1)} pen={PEN} seed={101}>
              <Horse x={CX[0] + 50} y={HY} scale={0.5} t={at(C.card1 + 0.2)} pen={PEN} seed={11} pose="jump" rider speed dur={0.7} />
              <JumpBar x={CX[0] + 400} gy={CY + CH - 50} h={110} t={at(C.card1 + 0.2)} pen={PEN} seed={111} />
            </Card>
            <Type x={CX[0] + CW / 2} y={CY + CH + 52} text="sport" t={at(C.label1)} size={44} font={GOCHI} color={PEN.colorH} weight="700" charW={0.41} />

            {/* card 2: recreation, a ride past a tree */}
            <Card x={CX[1]} y={CY} w={CW} h={CH} t={at(C.card2)} pen={PEN} seed={102}>
              <Tree x={CX[1] + 400} gy={CY + CH - 50} scale={0.5} t={at(C.card2 + 0.3)} pen={PEN} seed={121} />
              <Horse x={CX[1] + 60} y={HY} scale={0.5} t={at(C.card2 + 0.2)} pen={PEN} seed={12} pose="trot" rider dur={0.7} />
            </Card>
            <Type x={CX[1] + CW / 2} y={CY + CH + 52} text="recreation" t={at(C.label2)} size={44} font={GOCHI} color={PEN.colorH} weight="700" charW={0.41} />

            {/* card 3: therapy, a nuzzle */}
            <Card x={CX[2]} y={CY} w={CW} h={CH} t={at(C.card3)} pen={PEN} seed={103}>
              <Horse x={CX[2] + 70} y={HY + 6} scale={0.5} t={at(C.card3 + 0.2)} pen={PEN} seed={13} pose="graze" dur={0.7} />
              {/* the person faces the horse (mirrored) and reaches to its nose */}
              <g transform={`translate(${CX[2] + 332} ${CY + CH - 50}) scale(-0.62 0.62) translate(${-(CX[2] + 332)} ${-(CY + CH - 50)})`}>
                <Person x={CX[2] + 332} gy={CY + CH - 50} t={at(C.card3 + 0.5)} pen={PEN} seed={14} hair="bun" shirt={PEN.palette.gold} reach dur={0.8} />
              </g>
              <Hearts x={CX[2] + 262} y={CY + 100} t={at(C.card3 + 1.2)} pen={PEN} />
            </Card>
            <Type x={CX[2] + CW / 2} y={CY + CH + 52} text="therapy" t={at(C.label3)} size={44} font={GOCHI} color={PEN.colorH} weight="700" charW={0.41} />

            {/* scene B: the heading's place is taken by the verdict */}
            <HeartIcon x={700} y={96} size={56} t={at(C.heart)} pen={PEN} seed={131} />
            <Type x={1000} y={142} text="we like them" t={at(C.weLike)} cps={22} size={72} font={GOCHI} color={PEN.colorH} weight="700" charW={0.41} />
            <Type x={1000} y={200} text="the economy needs them" t={at(C.economy)} cps={26} size={40} font={KALAM} color={PEN.colorL} />
            <Strike x1={800} x2={1200} y={188} t={at(C.strike)} pen={PEN} seed={132} />
          </g>
        )}

        {/* ================= scene C + D: a century ago, the farm ================= */}
        {at(C.farm) > 0 && (
          <g>
            <Hills t={at(C.farm)} pen={PEN} seed={201} />
            <Barn x={150} y={400} t={at(C.barn)} pen={PEN} seed={21} />
            {/* herd behind the fence */}
            {HERD.filter((h) => h.y < 600).map((h, i) => (
              <Horse key={`b${i}`} x={h.x} y={h.y - 272 * h.sc} scale={h.sc} flip={h.flip} t={at(C.herd + i * 0.045)} pen={PEN} seed={300 + i} drawOn={false} hooves={false} detail={false} />
            ))}
            <Fence x1={440} x2={1720} y={600} t={at(C.fence)} pen={PEN} seed={202} />
            <Tree x={1760} gy={660} t={at(C.tree)} pen={PEN} seed={203} />
            {/* herd in front of the fence */}
            {HERD.filter((h) => h.y >= 600).map((h, i) => (
              <Horse key={`f${i}`} x={h.x} y={h.y - 272 * h.sc} scale={h.sc} flip={h.flip} t={at(C.herd + 0.6 + i * 0.045)} pen={PEN} seed={400 + i} drawOn={false} hooves={false} detail={false} />
            ))}
            {/* the plow horse: draws on standing, then pulls the plow across the floor, leaving a furrow */}
            <Furrow x0={300 + 40 * 0.75} x1={300 + 430 + 40 * 0.75} xNow={plowX + 40 * 0.75} y={880 - 6} pen={PEN} seed={601} />
            <Shadow cx={plowX + 170} cy={884} rx={200} ry={10} t={at(C.plowHorse)} />
            <Horse x={plowX} y={880 - 272 * 0.75} scale={0.75} t={at(C.plowHorse)} pen={PEN} seed={22} pose={at(C.plowMove) > 0 ? 'pull' : 'trot'} plow dur={0.9} />

            {/* top-left: the year and its caption */}
            <Type x={150} y={192} text="a century ago" t={at(C.century)} cps={20} size={40} font={KALAM} color={PEN.colorL} anchor="start" />
            {at(C.year1920) <= 0
              ? <RollNumber x={150} y={140} from={2025} to={1918} t={at(C.yearRoll)} dur={1.0} size={72} font={GOCHI} color={BROWN_TXT} />
              : <RollNumber x={150} y={140} from={1918} to={1920} t={at(C.year1920)} dur={0.4} size={72} font={GOCHI} color={BROWN_TXT} />}

            {/* top-right: the count */}
            <g opacity={millionOp}>
              <Type x={1500} y={140} text="26.7 million" t={at(C.million)} cps={14} size={72} font={GOCHI} color={BROWN_TXT} weight="700" charW={0.41} />
              <Type x={1500} y={192} text="horses and mules" t={at(C.mules)} cps={22} size={38} font={KALAM} color={PEN.colorL} />
            </g>

            {/* 1920: the gauge */}
            <Gauge cx={820} cy={430} r={100} t={at(C.gauge)} value={gaugeValue} pen={PEN} seed={501} />
            <CountUp x={1060} y={452} to={89} suffix="%" t={at(C.pct)} dur={0.8} size={72} font={GOCHI} color={BROWN_TXT} />
            <Type x={1060} y={500} text="draft power" t={at(C.draft)} cps={22} size={38} font={KALAM} color={PEN.colorL} />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
