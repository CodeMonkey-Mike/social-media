// CantonCharts.tsx: the canton comp's ANIMATED chart (comp-build.md section 7; charts.md "animate for real").
// C6 = Canton Coin's first year of trading (CoinGecko daily close, research/coingecko-canton-market-chart-2026-11-10.json),
// built by the chart-builder as assets/charts/C6.html with its geometry in C6-geometry.json. Here the PRICE LINE and
// its area fill are DRAWN LIVE from that geometry's 366 plotted points (an SVG path with a fixed geometry; only its
// reveal clip and the travelling head dot move per frame, so nothing re-rasterises), in the chart's own style
// (stroke #F3FF97 4.5 px, GLOW stdDeviation 6, AREA gradient .20 -> 0). The static axes / headline / source line are
// the approved C6-start.png; the two LABELS (the 'TRADING SINCE 2025-11-10' pill, the 'INTRADAY ATH 0.194' callout)
// are the approved transparent layers, popped in on their words. Cues (SOURCE spine seconds, through F()):
//   242.96 "since"    pill pops in + the line starts drawing left to right (reveal x 258 -> 1744)
//   246.62 "cents"    the reveal reaches the end dot (~0.091, Nov 2026)
//   247.44 "February" the intraday ATH callout + dot land at 0.194 (EDIT-PLAN: the onset of the word), held to the cut
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { clamp01, easeInOut, easeOut, useClock } from './CantonKit';

const C6_PTS: [number, number][] = [
  [270, 634.9], [274, 635.7], [278, 603.1], [281.9, 652.5], [285.9, 634.4], [289.9, 646.5], [293.9, 651.2], [297.9, 646.9],
  [301.9, 654.6], [305.8, 674.2], [309.8, 686.3], [313.8, 713.4], [317.8, 727.7], [321.8, 718.9], [325.8, 680.4], [329.7, 695.5],
  [333.7, 699.2], [337.7, 703.1], [341.7, 707.2], [345.7, 705.7], [349.6, 708.5], [353.6, 717.7], [357.6, 721], [361.6, 721.3],
  [365.6, 734], [369.6, 755.5], [373.5, 753.7], [377.5, 751.5], [381.5, 725.4], [385.5, 729.8], [389.5, 727], [393.5, 725.6],
  [397.4, 737.6], [401.4, 735.4], [405.4, 735.2], [409.4, 736.2], [413.4, 734.9], [417.3, 723.9], [421.3, 726.4], [425.3, 709],
  [429.3, 670.8], [433.3, 677.9], [437.3, 697.3], [441.2, 694.7], [445.2, 669.7], [449.2, 678.1], [453.2, 673.8], [457.2, 643.6],
  [461.2, 585.7], [465.1, 617.4], [469.1, 571], [473.1, 560], [477.1, 544.5], [481.1, 570.5], [485.1, 545.7], [489, 566.1],
  [493, 587.3], [497, 595.5], [501, 591.5], [505, 598.6], [508.9, 617.9], [512.9, 607.7], [516.9, 568.9], [520.9, 579.2],
  [524.9, 565.9], [528.9, 595.2], [532.8, 597.5], [536.8, 617.6], [540.8, 630.8], [544.8, 635.6], [548.8, 636.5], [552.8, 616.9],
  [556.7, 569.9], [560.7, 582], [564.7, 555.6], [568.7, 554.7], [572.7, 580.9], [576.6, 553.5], [580.6, 554.3], [584.6, 543.6],
  [588.6, 501], [592.6, 501.3], [596.6, 493.3], [600.5, 510.3], [604.5, 483.4], [608.5, 500.5], [612.5, 509.9], [616.5, 539.5],
  [620.5, 512.4], [624.4, 527.2], [628.4, 524.2], [632.4, 533.1], [636.4, 523.1], [640.4, 539.2], [644.3, 535.5], [648.3, 549.2],
  [652.3, 531.4], [656.3, 540.5], [660.3, 544.8], [664.3, 531.8], [668.2, 532.2], [672.2, 546.2], [676.2, 547.6], [680.2, 544.6],
  [684.2, 544.4], [688.2, 539.4], [692.1, 544.4], [696.1, 524.9], [700.1, 517.5], [704.1, 521.3], [708.1, 525.9], [712, 540.6],
  [716, 545.8], [720, 549.8], [724, 554.6], [728, 559.3], [732, 557.8], [735.9, 560.3], [739.9, 566.1], [743.9, 577.6],
  [747.9, 568.7], [751.9, 558.6], [755.9, 572.4], [759.8, 560.9], [763.8, 563.4], [767.8, 564.4], [771.8, 556], [775.8, 564.9],
  [779.7, 573.3], [783.7, 579], [787.7, 577.9], [791.7, 578.5], [795.7, 582.2], [799.7, 577.3], [803.6, 585.8], [807.6, 581.4],
  [811.6, 581.2], [815.6, 585.8], [819.6, 556.5], [823.6, 563.6], [827.5, 571.1], [831.5, 565.3], [835.5, 582.1], [839.5, 579.7],
  [843.5, 588.9], [847.5, 588.7], [851.4, 587.5], [855.4, 574.6], [859.4, 573.3], [863.4, 585.4], [867.4, 560.8], [871.3, 572.7],
  [875.3, 573.7], [879.3, 574.6], [883.3, 561.4], [887.3, 566.1], [891.3, 565.7], [895.2, 569.9], [899.2, 565], [903.2, 572.5],
  [907.2, 570.9], [911.2, 547.2], [915.2, 563.9], [919.1, 561.4], [923.1, 565.2], [927.1, 561.2], [931.1, 562.1], [935.1, 564.8],
  [939, 570.5], [943, 568.1], [947, 563.2], [951, 565.4], [955, 566.6], [959, 570.1], [962.9, 570.6], [966.9, 570.2],
  [970.9, 571.6], [974.9, 572.6], [978.9, 575.9], [982.9, 572.6], [986.8, 551], [990.8, 553.3], [994.8, 538.6], [998.8, 560.5],
  [1002.8, 554.7], [1006.7, 536.5], [1010.7, 549.3], [1014.7, 557.7], [1018.7, 556.3], [1022.7, 567.7], [1026.7, 569.7], [1030.6, 555.8],
  [1034.6, 550.8], [1038.6, 551.6], [1042.6, 541.9], [1046.6, 530.7], [1050.6, 531], [1054.5, 551.2], [1058.5, 553.5], [1062.5, 555.7],
  [1066.5, 555.5], [1070.5, 558.3], [1074.4, 553], [1078.4, 557.3], [1082.4, 566.1], [1086.4, 559.4], [1090.4, 572.3], [1094.4, 567.2],
  [1098.3, 539.8], [1102.3, 535.9], [1106.3, 544.3], [1110.3, 537.3], [1114.3, 538.9], [1118.3, 538.9], [1122.2, 538.8], [1126.2, 538.2],
  [1130.2, 541], [1134.2, 532.6], [1138.2, 541.6], [1142.1, 538.9], [1146.1, 543.3], [1150.1, 557.9], [1154.1, 560.3], [1158.1, 566.3],
  [1162.1, 561.4], [1166, 562.4], [1170, 563.8], [1174, 566.4], [1178, 564], [1182, 559.7], [1186, 567.5], [1189.9, 576.8],
  [1193.9, 585.4], [1197.9, 586.4], [1201.9, 588.3], [1205.9, 586.8], [1209.9, 587.6], [1213.8, 584.5], [1217.8, 591.5], [1221.8, 606.9],
  [1225.8, 613.9], [1229.8, 603.2], [1233.7, 600.5], [1237.7, 599], [1241.7, 602.8], [1245.7, 609.2], [1249.7, 591], [1253.7, 593.7],
  [1257.6, 607.7], [1261.6, 613.4], [1265.6, 619.9], [1269.6, 616.2], [1273.6, 621], [1277.6, 616.6], [1281.5, 625.4], [1285.5, 625.6],
  [1289.5, 633.1], [1293.5, 625.8], [1297.5, 620.7], [1301.4, 631.4], [1305.4, 632.5], [1309.4, 626.4], [1313.4, 628.6], [1317.4, 635.7],
  [1321.4, 638.6], [1325.3, 637.9], [1329.3, 642.4], [1333.3, 655.1], [1337.3, 666.1], [1341.3, 692.3], [1345.3, 693.5], [1349.2, 685.9],
  [1353.2, 672.7], [1357.2, 679.3], [1361.2, 672.7], [1365.2, 676.6], [1369.1, 678.6], [1373.1, 679.8], [1377.1, 675.9], [1381.1, 682.5],
  [1385.1, 694.5], [1389.1, 692.9], [1393, 675.6], [1397, 674.8], [1401, 646.5], [1405, 634.7], [1409, 624.4], [1413, 622.2],
  [1416.9, 631.4], [1420.9, 636.1], [1424.9, 647.8], [1428.9, 648.6], [1432.9, 635], [1436.8, 639.7], [1440.8, 629.4], [1444.8, 644.9],
  [1448.8, 653.5], [1452.8, 645.9], [1456.8, 658.3], [1460.7, 654.5], [1464.7, 651], [1468.7, 662.1], [1472.7, 658.4], [1476.7, 663.4],
  [1480.7, 678.4], [1484.6, 679], [1488.6, 677.8], [1492.6, 685.6], [1496.6, 681.4], [1500.6, 693.9], [1504.6, 673.4], [1508.5, 670.6],
  [1512.5, 650.2], [1516.5, 653.4], [1520.5, 654.5], [1524.5, 633.6], [1528.4, 641.9], [1532.4, 652.4], [1536.4, 644.3], [1540.4, 610.5],
  [1544.4, 596.7], [1548.4, 593.6], [1552.3, 607], [1556.3, 623.1], [1560.3, 617.2], [1564.3, 630.8], [1568.3, 631.1], [1572.3, 621.7],
  [1576.2, 610.5], [1580.2, 616.6], [1584.2, 615.3], [1588.2, 632.4], [1592.2, 633.4], [1596.1, 624.7], [1600.1, 633.4], [1604.1, 618.2],
  [1608.1, 631.4], [1612.1, 619.7], [1616.1, 641.3], [1620, 661.9], [1624, 666.2], [1628, 667.1], [1632, 671.3], [1636, 662.7],
  [1640, 663], [1643.9, 648.9], [1647.9, 668.6], [1651.9, 671.3], [1655.9, 670.6], [1659.9, 671.6], [1663.8, 675.4], [1667.8, 675.6],
  [1671.8, 673.1], [1675.8, 686.5], [1679.8, 677.3], [1683.8, 678.7], [1687.7, 679], [1691.7, 686.7], [1695.7, 681.6], [1699.7, 675.3],
  [1703.7, 682.2], [1707.7, 686.3], [1711.6, 686.9], [1715.6, 694.6], [1719.6, 692.5], [1720, 693.7],
];
const C6_PLOT = { x0: 270, x1: 1720, yTop: 350, yBot: 890 };
const C6_REVEAL = { from: 258, to: 1744 };
const C6_PILL = { x: 258, y: 802, w: 390, h: 46 };
const C6_CALLOUT = { x: 650.5, y: 321, w: 386, h: 112 };
const C6_CUES = { pill: 242.96, drawFrom: 242.96, drawTo: 246.62, marker: 247.44 };

const LINE_D = 'M' + C6_PTS.map((p) => p.join(' ')).join(' L');
const AREA_D = LINE_D + ` L${C6_PLOT.x1} ${C6_PLOT.yBot} L${C6_PLOT.x0} ${C6_PLOT.yBot} Z`;
const yAtX = (x: number) => {
  if (x <= C6_PTS[0][0]) return C6_PTS[0][1];
  for (let i = 1; i < C6_PTS.length; i++) {
    const [xa, ya] = C6_PTS[i - 1], [xb, yb] = C6_PTS[i];
    if (x <= xb) return ya + ((yb - ya) * (x - xa)) / Math.max(1e-6, xb - xa);
  }
  return C6_PTS[C6_PTS.length - 1][1];
};

const Pop: React.FC<{ q: number; ox: number; oy: number; children: React.ReactNode }> = ({ q, ox, oy, children }) => (
  <AbsoluteFill style={{ opacity: q, transform: `scale(${0.9 + 0.1 * q})`, transformOrigin: `${ox}px ${oy}px` }}>{children}</AbsoluteFill>
);

/** C6 on the 1920 x 1080 stage (the screen-share layer scales it into the deck area). Absolute clock only. */
export const C6Chart: React.FC = () => {
  const { abs, F } = useClock();
  const pillQ = easeOut(clamp01((abs - F(C6_CUES.pill)) / 9));
  const drawP = easeInOut(clamp01((abs - F(C6_CUES.drawFrom)) / Math.max(1, F(C6_CUES.drawTo) - F(C6_CUES.drawFrom))));
  const markQ = easeOut(clamp01((abs - F(C6_CUES.marker)) / 10));
  const rx = C6_REVEAL.from + (C6_REVEAL.to - C6_REVEAL.from) * drawP;
  const headX = Math.min(C6_PLOT.x1, Math.max(C6_PLOT.x0, rx));
  const headY = yAtX(headX);
  const done = drawP >= 0.999;
  return (
    <AbsoluteFill style={{ background: '#030206' }}>
      <Img src={staticFile('charts/C6-start.png')} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} />
      {drawP > 0 && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="c6area" x1="0" y1={C6_PLOT.yTop} x2="0" y2={C6_PLOT.yBot} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#F3FF97" stopOpacity={0.2} />
              <stop offset="1" stopColor="#F3FF97" stopOpacity={0} />
            </linearGradient>
            <filter id="c6glow" x="-5%" y="-20%" width="110%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="c6reveal"><rect x={0} y={0} width={rx} height={1080} /></clipPath>
          </defs>
          <g clipPath="url(#c6reveal)">
            <path d={AREA_D} fill="url(#c6area)" />
            <path d={LINE_D} fill="none" stroke="#F3FF97" strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" filter="url(#c6glow)" />
          </g>
          {/* the head: a travelling dot while it draws, the end dot once it lands (as in the approved payoff) */}
          <circle cx={headX} cy={headY} r={done ? 20 : 16} fill="rgba(243,255,151,.18)" />
          <circle cx={headX} cy={headY} r={8} fill="#F3FF97" />
        </svg>
      )}
      {pillQ > 0 && (
        <Pop q={pillQ} ox={C6_PILL.x + C6_PILL.w / 2} oy={C6_PILL.y + C6_PILL.h / 2}>
          <Img src={staticFile('charts/C6-layer-pill.png')} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} />
        </Pop>
      )}
      {markQ > 0 && (
        <Pop q={markQ} ox={C6_CALLOUT.x + C6_CALLOUT.w / 2} oy={C6_CALLOUT.y + C6_CALLOUT.h}>
          <Img src={staticFile('charts/C6-layer-marker.png')} style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} />
        </Pop>
      )}
    </AbsoluteFill>
  );
};
