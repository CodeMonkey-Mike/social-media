import React from 'react';
import { AbsoluteFill, Sequence, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate, Easing } from 'remotion';
import { loadFont as loadMont } from '@remotion/google-fonts/Montserrat';
import { CRankChart, CSplit } from './kaspaFounderCharts';
import { CAPTIONS } from './kaspaFounderCaptions';
import { TransitionClip } from './transitions/TransitionClip';

loadMont('normal', { weights: ['900'], subsets: ['latin'] });

export const KF_FPS = 30;
export const KF_DURATION = 18330; // 0 → end (final spine ~610.9s)
const ease = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
// Everything baked into the spine shifts downstream source cues. sh() adds the duration of every insert at/before t.
const INSERTS = [
  { at: 70.76, dur: 1.0 },    // CH2 card pause (freeze, in the why|So silence trough)
  { at: 236.71, dur: 20.0 },  // R-TALK clip A (full-screen, own audio)
  { at: 245.47, dur: 1.0 },   // CH4 card pause (freeze, in the ago|Now silence trough — corrected)
  { at: 259.51, dur: 13.0 },  // R-TALK clip B callback (full-screen)
];
const sumDur = (pred: (a: number) => boolean) => INSERTS.filter((i) => pred(i.at)).reduce((s, i) => s + i.dur, 0);
const sh = (t: number) => t + sumDur((a) => a <= t);          // source secs → final-spine secs
const cardStart = (b: number) => b + sumDur((a) => a < b);    // a card's own start (excludes its own pause)
const F = (t: number) => Math.round(sh(t) * KF_FPS);
const fill = { width: '100%', height: '100%', objectFit: 'cover' } as const;
const CARDS = [{ t: 70.76, title: 'WHO IS HE,\nACTUALLY' }, { t: 245.47, title: 'FROM CHAIN\nTO BLOCKDAG' }];
const CARD_WINDOWS = CARDS.map((c) => [cardStart(c.t), cardStart(c.t) + 1.4] as [number, number]);
// R-TALK clip windows (final-spine secs) — these play full-screen from the spine; no cover/caption over them.
const CLIP_WINDOWS: [number, number][] = [[sh(236.71), sh(236.71) + 20], [sh(259.51), sh(259.51) + 13]];

type Cover = { tIn: number; tOut: number; kind: 'still' | 'stillglitch' | 'vid' | 'vidglitch' | 'chart' | 'split' | 'receipt' | 'deck' | 'photo' | 'overlay'; ref?: string; cap?: boolean; lead?: boolean };
// Cover layer: every b-roll clip <=4s, no asset reused (lint-covers.js enforces). chart/split/receipt exempt (containers).
// DIAGRAM_REFS: s3, s5, s6, C-MCAP   (system-design diagrams / charts — exempt from the single-container asset check)
// COMPARISON_REFS: c-citedgap, c-uncle   (deliberate A-vs-B contrasts — one rhetorical unit, both sides needed)
const COVERS: Cover[] = [
  { tIn: 4.9, tOut: 7.2, kind: 'still', ref: 'IMG-YS' },                       // "That name is Yonatan Sompolinsky"
  { tIn: 7.2, tOut: 11.0, kind: 'chart', ref: 'C-RANK' },                      // "cited in the Ethereum whitepaper"
  { tIn: 11.0, tOut: 14.5, kind: 'photo', ref: 'B-CHAIN', cap: true },         // "looked at Bitcoin" — single-file chain (captions over)
  { tIn: 14.5, tOut: 18.0, kind: 'vid', ref: 'hype-btc-rays', cap: true },     // "too slow, proved it on paper" (captions over)
  { tIn: 18.0, tOut: 21.5, kind: 'vidglitch', ref: 'CLIP-DAG' },               // "turned it into a blockDAG"
  { tIn: 21.5, tOut: 24.2, kind: 'stillglitch', ref: 'BR-DATA-STREAMS' },      // "blocks stack side by side"
  { tIn: 24.2, tOut: 28.0, kind: 'stillglitch', ref: 'BR-SCHOLAR' },           // "off a chalkboard"
  { tIn: 28.0, tOut: 31.0, kind: 'stillglitch', ref: 'BR-RESEARCHER-CHALK' },  // "launched, no company, no investors"
  { tIn: 31.0, tOut: 33.4, kind: 'stillglitch', ref: 'BR-JOURNALS' },          // "no premine, nothing but code"
  { tIn: 35.8, tOut: 38.8, kind: 'stillglitch', ref: 'BR-AHEAD-OF-CROWD' },    // "quiet academic ... rewrote how blockchains agree"
  { tIn: 38.8, tOut: 42.8, kind: 'vid', ref: 'digital-tunnel' },               // "...on reality" (fast hype)
  { tIn: 42.8, tOut: 46.8, kind: 'vid', ref: 'data-streaks' },                 // "publishing the papers those founders quote"
  { tIn: 50.2, tOut: 55.2, kind: 'split' },                                    // C-SPLIT: GENIUS | OVER-RATED
  { tIn: 55.2, tOut: 59.2, kind: 'receipt', ref: 'R-WP' },                     // receipts preview (whitepaper)
  { tIn: 59.2, tOut: 63.0, kind: 'chart', ref: 'C-RANK' },                     // receipts preview (the #2 chart recall)
  { tIn: 63.0, tOut: 66.6, kind: 'vid', ref: 'data-vortex' },                  // "the strongest case against him too"
  // ---- CH2: Who is Yonatan — STANDALONE containers (each its own eyebrow+title), family photos. Contiguous, not scattered. ----
  { tIn: 72.4, tOut: 76.0, kind: 'stillglitch', ref: 'BR-ORIGIN' },            // "before the whitepapers"
  { tIn: 76.0, tOut: 88.0, kind: 'deck', ref: 'c-bio' },                       // a quiet academic: born Israel, Hebrew U, PhD, Harvard
  { tIn: 88.0, tOut: 99.0, kind: 'photo', ref: 'IMG-FAM-David' },              // grandfather David (WWII)
  { tIn: 99.0, tOut: 108.0, kind: 'photo', ref: 'IMG-FAM-Haim' },              // father Haim (brain prize)
  { tIn: 108.0, tOut: 113.0, kind: 'deck', ref: 'c-bio' },                     // a family that did big things
  { tIn: 113.0, tOut: 135.5, kind: 'deck', ref: 'c-path' },                    // the path: student→postdoc→DAG Labs→founder
  { tIn: 138.1, tOut: 159.9, kind: 'deck', ref: 'c-path' },                    // reshaping before he finished school
  // ---- CH3: GHOST (2013) — the D-GHOST diagram, R-WP ONCE, then the 2017 MEETUP STILL before the clip ----
  { tIn: 169.8, tOut: 190.0, kind: 'deck', ref: 's3' },                        // D-GHOST diagram (greedy heaviest, orphans counted)
  { tIn: 190.0, tOut: 194.0, kind: 'vid', ref: 'ghost-network' },              // blockchain-network cutaway
  { tIn: 194.0, tOut: 211.0, kind: 'deck', ref: 's3' },                        // D-GHOST (cont.)
  { tIn: 211.0, tOut: 214.0, kind: 'receipt', ref: 'R-WP' },                   // "Ethereum's whitepaper cites this exact paper"
  { tIn: 214.0, tOut: 228.6, kind: 'deck', ref: 'c-uncle' },                   // the uncle reward — Ethereum took the idea, not the engine
  { tIn: 229.7, tOut: 236.46, kind: 'photo', ref: 'MEETUP-still' },            // after "watch this": still of the 2017 meetup
  { tIn: 236.94, tOut: 245.47, kind: 'deck', ref: 'c-coauthors' },             // (after clip) GHOST & SPECTRE by name, studied by peers
  // ---- CH4: SPECTRE → GHOSTDAG — lineage, co-authors, acronym, the two diagrams ----
  { tIn: 250.7, tOut: 259.36, kind: 'deck', ref: 'c-lineage' },                // GHOST→SPECTRE lineage callback
  { tIn: 259.68, tOut: 272.0, kind: 'deck', ref: 'c-coauthors' },              // 2016 co-authors (Zohar, Lewenberg)
  { tIn: 272.0, tOut: 285.0, kind: 'deck', ref: 'c-acronym' },                 // SPECTRE acronym
  { tIn: 285.0, tOut: 305.0, kind: 'deck', ref: 's5' },                        // D-SPECTRE diagram (web, parallel, votes)
  { tIn: 305.0, tOut: 309.0, kind: 'vid', ref: 'spectre-web' },                // data-network web cutaway
  { tIn: 309.0, tOut: 330.0, kind: 'deck', ref: 's5' },                        // D-SPECTRE (cont.)
  { tIn: 330.0, tOut: 355.0, kind: 'deck', ref: 's6' },                        // D-GHOSTDAG diagram (keeps all, orders all)
  { tIn: 355.0, tOut: 359.0, kind: 'vid', ref: 'ghostdag-order' },             // network-into-order cutaway
  { tIn: 359.0, tOut: 377.7, kind: 'deck', ref: 's6' },                        // D-GHOSTDAG (cont.)
  { tIn: 380.7, tOut: 382.8, kind: 'deck', ref: 's6' },                        // "the engine under Kaspa"
  // ---- MID: CryptoRich plug (>50% covered over the face) ----
  { tIn: 384.0, tOut: 393.0, kind: 'receipt', ref: 'CR-SHOWCASE' },            // the calls table
  { tIn: 393.5, tOut: 401.5, kind: 'receipt', ref: 'CR-HOME' },                // home / membership
  { tIn: 385.0, tOut: 390.0, kind: 'overlay', ref: 'subscribe' },              // like + subscribe CTA over the plug (~7:00)
  // ---- CH5: he shipped (fair launch) + DAGKnight ----
  { tIn: 405.8, tOut: 435.0, kind: 'deck', ref: 'c-launch' },                  // launch terms: 2021, no premine, fair
  { tIn: 435.0, tOut: 452.3, kind: 'deck', ref: 'c-lineage' },                 // DAGKnight, didn't freeze in 2013
  { tIn: 458.2, tOut: 461.3, kind: 'deck', ref: 'c-lineage' },                 // a real engine, a live chain
  // ---- CH6: the overrated case (steelman) ----
  { tIn: 463.5, tOut: 483.0, kind: 'deck', ref: 'c-citedgap' },                // cited ≠ depended on; simplified uncle reward
  { tIn: 483.0, tOut: 495.5, kind: 'deck', ref: 'c-coauthors' },               // co-authored, not one lone genius
  { tIn: 495.5, tOut: 499.0, kind: 'stillglitch', ref: 'BR-OTHERDAGS' },       // IOTA/Nano/Hashgraph chase DAGs too
  { tIn: 499.0, tOut: 504.5, kind: 'deck', ref: 'c-coauthors' },               // the idea was in the water
  { tIn: 504.5, tOut: 511.9, kind: 'deck', ref: 'C-MCAP' },                    // market cap: a fraction of the size
  { tIn: 511.9, tOut: 515.9, kind: 'vid', ref: 'market-growth' },              // bitcoin/market-growth cutaway
  // ---- CH7: the verdict + close ----
  { tIn: 521.2, tOut: 530.0, kind: 'deck', ref: 'c-verdict' },                 // verdict stack: cult framing loses
  { tIn: 530.0, tOut: 546.0, kind: 'deck', ref: 'c-lineage' },                 // the protocol line GHOST→…→DAGKnight
  { tIn: 546.0, tOut: 555.6, kind: 'deck', ref: 'c-verdict' },                 // alive chain, fairly launched, a decade
  { tIn: 563.3, tOut: 567.0, kind: 'deck', ref: 'c-close' },                   // quiet genius, market noticing late
  { tIn: 567.0, tOut: 571.0, kind: 'vid', ref: 'horizon-close' },              // sunrise/horizon close cutaway
];
const FACE_CUTS = [33.4, 46.8, 66.6, 135.5, 159.9, 228.6, 377.7, 382.7, 404.5, 452.3, 461.3, 515.9, 555.6, 571.3];
const PUNCH: [number, number][] = [
  [0, 4.9], [46.8, 50.2], [66.6, 70.5], [159.9, 169.8], [245.5, 250.7], [377.7, 380.7],
  [452.3, 458.2], [515.9, 521.2], [555.6, 563.3], [571.3, 575.6],
];
const CAPTION_SRC: [number, number][] = [
  [0, 4.9], [11.0, 18.0], [33.4, 35.8], [46.8, 50.2], [66.6, 70.5],         // CH1 (11-18 over the network b-roll)
  [135.5, 138.1], [159.9, 169.8], [228.6, 229.7], [245.5, 250.7], [377.7, 380.7], // CH2-CH4 face beats (no captions on the plug)
  [404.5, 405.8], [452.3, 458.2], [461.3, 463.5], [515.9, 521.2], [555.6, 563.3], [571.3, 575.6], // CH5-CH7
];

const COVER_WINDOWS = COVERS.filter((c) => !c.cap).map((c) => [sh(c.tIn), sh(c.tOut)] as [number, number]); // cap:true covers allow captions over
const CAPTION_WINDOWS = CAPTION_SRC.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
const CAPS = CAPTIONS.map((c) => ({ tf: sh(c.t), h: c.h }));

const Ent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 10], [0, 1], clamp);
  const sc = interpolate(f, [0, 14], [0.95, 1], { ...clamp, easing: ease });
  return <AbsoluteFill style={{ opacity: op, transform: `scale(${sc})` }}>{children}</AbsoluteFill>;
};

const KenBurns: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, 300], [1.04, 1.13], clamp);
  const op = interpolate(f, [0, 12], [0, 1], clamp);
  return <AbsoluteFill style={{ background: '#0a0c10', opacity: op }}><Img src={staticFile('img/' + src + '.png')} style={{ ...fill, transform: `scale(${sc})` }} /></AbsoluteFill>;
};

const CoverEl: React.FC<{ c: Cover }> = ({ c }) => {
  if (c.kind === 'chart') return <Ent><CRankChart /></Ent>;
  if (c.kind === 'split') return <Ent><CSplit /></Ent>;
  if (c.kind === 'deck') return <Ent><AbsoluteFill style={{ background: '#0a0c10' }}><Img src={staticFile('deck/' + c.ref + '.png')} style={fill} /></AbsoluteFill></Ent>;
  if (c.kind === 'photo') return <KenBurns src={c.ref!} />;
  // overlay: screen-blend the clip OVER what's below (black drops out, the like/subscribe buttons show) — no bg.
  if (c.kind === 'overlay') return <AbsoluteFill><OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={{ ...fill, mixBlendMode: 'screen' }} /></AbsoluteFill>;
  if (c.kind === 'vid')
    return <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={fill} /></AbsoluteFill>;
  if (c.kind === 'vidglitch') {
    const vid = () => <AbsoluteFill style={{ background: '#000' }}><OffthreadVideo src={staticFile('vid/' + c.ref + '.mp4')} muted style={fill} /></AbsoluteFill>;
    return <TransitionClip id="badsignal-short-1" cutFrame={9} outgoing={() => <AbsoluteFill style={{ background: '#0a1012' }} />} incoming={vid} />;
  }
  if (c.kind === 'stillglitch') {
    const still = () => <AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('img/' + c.ref + '.png')} style={fill} /></AbsoluteFill>;
    return <TransitionClip id="badsignal-short-1" cutFrame={9} outgoing={() => <AbsoluteFill style={{ background: '#0a1012' }} />} incoming={still} />;
  }
  if (c.kind === 'receipt')
    return <Ent><AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('receipts/' + c.ref + '.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} /></AbsoluteFill></Ent>;
  return <Ent><AbsoluteFill style={{ background: '#0a1012' }}><Img src={staticFile('img/' + c.ref + '.png')} style={fill} /></AbsoluteFill></Ent>;
};

// Blocks·Max glitch on the cut TO Mike's face (this video's pick, TRANSITIONS.md). win=29f → cutFrame past win/2.
const BLOCKS_CUT = 16;
const BlocksGlitch: React.FC = () => (
  <TransitionClip id="blocks-max-1" cutFrame={BLOCKS_CUT} outgoing={() => <AbsoluteFill style={{ background: '#000' }} />} incoming={() => <AbsoluteFill style={{ opacity: 0 }} />} />
);

// Chapter title card — cube presentation (this video's pick). Self-contained scene over the 1s freeze.
const CubeCard: React.FC<{ title: string }> = ({ title }) => {
  const f = useCurrentFrame();
  const dur = 42;
  const rot = interpolate(f, [0, 11, dur - 11, dur], [90, 0, 0, -90], { ...clamp, easing: ease });
  const op = interpolate(f, [0, 7, dur - 7, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1600 }}>
      <div style={{ transform: `rotateY(${rot}deg) translateZ(150px)`, opacity: op, transformStyle: 'preserve-3d', background: '#0a0c10', width: 1920, height: 1080, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ width: 120, height: 6, background: '#00c2ff', borderRadius: 3, marginBottom: 44 }} />
        <div style={{ fontFamily: "'Montserrat','Segoe UI',sans-serif", fontWeight: 900, fontSize: 104, color: '#fff', textAlign: 'center', lineHeight: 1.08, whiteSpace: 'pre-line', letterSpacing: 1 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / KF_FPS;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  if (COVER_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;   // never over a cover
  if (CARD_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;    // never over a chapter card
  if (CLIP_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;    // never over an R-TALK clip
  let idx = -1;
  for (let i = 0; i < CAPS.length; i++) { if (CAPS[i].tf <= t) idx = i; else break; }
  if (idx < 0) return null;
  const cap = CAPS[idx];
  const nextT = idx + 1 < CAPS.length ? CAPS[idx + 1].tf : Infinity;
  if (t >= Math.min(nextT, cap.tf + 1.2)) return null;
  const since = (t - cap.tf) * KF_FPS;
  const pop = interpolate(since, [0, 5, 9], [0.7, 1.12, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
      <div style={{ fontFamily: "'Montserrat','Segoe UI',sans-serif", fontWeight: 900, fontSize: 90, color: '#fff', textTransform: 'lowercase', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', transform: `scale(${pop})`, letterSpacing: 1 }}>{cap.h}</div>
    </AbsoluteFill>
  );
};

export const KaspaFounderGenius: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / KF_FPS;
  let scale = 1;
  for (const [s, e] of PUNCH) { if (t >= s && t < e) scale = interpolate(t, [s, s + 0.5], [1, 1.16], { ...clamp, easing: ease }); }
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={staticFile('spine.mp4')} style={fill} />
      </AbsoluteFill>
      {COVERS.map((c, i) => (
        <Sequence key={i} from={F(c.tIn)} durationInFrames={Math.max(1, F(c.tOut) - F(c.tIn))}><CoverEl c={c} /></Sequence>
      ))}
      {FACE_CUTS.map((tc, i) => (
        <Sequence key={'g' + i} from={Math.max(0, F(tc) - BLOCKS_CUT)} durationInFrames={34}><BlocksGlitch /></Sequence>
      ))}
      {CARDS.map((c, i) => (
        <Sequence key={'cc' + i} from={Math.round(cardStart(c.t) * KF_FPS)} durationInFrames={42}><CubeCard title={c.title} /></Sequence>
      ))}
      <Captions />
    </AbsoluteFill>
  );
};
