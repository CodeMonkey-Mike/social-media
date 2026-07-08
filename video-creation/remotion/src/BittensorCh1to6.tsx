import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, staticFile } from 'remotion';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadDM } from '@remotion/google-fonts/DMSans';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadMont } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { CAPTIONS_INTRO } from './bittensorCaptions';
import { CAPTIONS_FULL } from './bittensorCaptionsFull';

loadPlayfair('normal', { weights: ['700', '800', '900'], subsets: ['latin'] });
loadDM('normal', { weights: ['400', '500', '700'], subsets: ['latin'] });
loadMono('normal', { weights: ['600', '700'], subsets: ['latin'] });
loadMont('normal', { weights: ['900'], subsets: ['latin'] });
loadInter('normal', { weights: ['800', '900'], subsets: ['latin'] });

// ── CH1-6 (0..644.9s). Gated-face spine; CONTAINERS are the dominant cover layer (deck style),
//    b-roll is <=4s punctuation, no gap > 0.5s, no hold > 4s. Music: Retribution -> HoldTheLine -> Invaders.
export const B_FPS = 30;
// Desilencer-leftover CUTS (2026-06-18): little mumbles/false-starts the desilencer left BETWEEN words (above
// its silence floor, so not in the word transcript). We SKIP each inside the spine playback (multi-segment
// Spine, below) and shift every downstream cue + caption by sh() = (sum of all cut durations BEFORE t).
//   - 8.58s (0.42s): a low mumble between "...I ever could." (~8.55) and "Last week..." (9.02)
//   - 691.02s (0.38s): the 11:31 fumble between "...not done." and "They're actually paving the road."
const CUTS = [{ at: 8.58, dur: 0.42 }, { at: 691.02, dur: 0.38 }].sort((a, b) => a.at - b.at);
const TOTAL_CUT = CUTS.reduce((s, c) => s + c.dur, 0);
const sh = (t: number): number => t - CUTS.reduce((s, c) => s + (t > c.at ? c.dur : 0), 0);
// +0.5s outro tail (Mike, 2026-06-18): the last word "...give it a like" runs to the spine's very end
// (~845.99s) and the old duration clipped it. Play it out, then fade to black (FadeOut below) + audio fade
// (added in the SFX mix). Spine footage exists to ~845.61s final; the remainder is under the black fade.
const OUTRO = 0.5;
export const B_DURATION = Math.round((845.74 - TOTAL_CUT + OUTRO) * B_FPS);
// Project-specific render assets live in the PROJECT folder (Mike's rule 2026-06-18: video-creation/assets/
// is for shared/reused assets only). publicDir is set per-render via --public-dir to:
//   video-creation/longform-edited/media/bittensor-for-the-future/render-assets
const asset = (f: string) => staticFile(f);
const useT = () => useCurrentFrame() / B_FPS;
// deck palette (matches bittensor-deck.html)
const C = { bg: '#0a0c10', card: '#12151c', green: '#00e68a', cyan: '#00c2ff', gold: '#ffd700', red: '#ff4060', ink: '#e8eaf0', sec: '#8892a4', edge: '#1e2330' };
const SERIF = "'Playfair Display', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const MONT = "'Montserrat', sans-serif";
const INTER = "'Inter', sans-serif";

const FACE_SPANS: Array<[number, number]> = [
  [0.0, 8.56], [21.86, 25.18], [43.3, 49.78], [153.1, 165.04], [170.78, 184.08], [229.06, 241.3],
  [268.42, 276.06], [321.96, 333.46], [419.86, 426.46], [586.38, 606.46], [627.78, 634.1],
  [639.3, 700.2], [760.12, 764.58], [788.38, 793.12], [809.3, 824.46], [841.06, 844.74],
];

// Spine plays as N+1 segments = the spans BETWEEN the CUT windows, so every cut is skipped seamlessly
// (face-to-face splice, no re-encode). Each segment is placed at its shifted comp position sh(start) and
// trimmed to begin at its own spine frame; the cut windows (mumble, fumble) never play. Audio (VO) skips them too.
const Spine: React.FC = () => {
  const vid = { width: '100%', height: '100%', objectFit: 'cover' } as const;
  const segs: Array<[number, number | null]> = [];
  let start = 0;
  for (const c of CUTS) { segs.push([start, c.at]); start = c.at + c.dur; }
  segs.push([start, null]); // final segment runs to comp end
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {segs.map(([s, e], i) => (
        <Sequence key={`sp${i}`} from={Math.round(sh(s) * B_FPS)} durationInFrames={e === null ? undefined : Math.round((e - s) * B_FPS)} layout="none">
          <OffthreadVideo src={asset('spine.mp4')} trimBefore={Math.round(s * B_FPS)} style={vid} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ───────────── b-roll (<=4s punctuation): video=dissolve, image=cross-warp ─────────────
type Slot = { kind: 'video' | 'image'; src: string; tIn: number; tOut: number };
const V = (s: string, a: number, b: number): Slot => ({ kind: 'video', src: `vid/${s}.mp4`, tIn: a, tOut: b });
const I = (s: string, a: number, b: number): Slot => ({ kind: 'image', src: `img/${s}.png`, tIn: a, tOut: b });
const J = (s: string, a: number, b: number): Slot => ({ kind: 'image', src: `img/${s}.jpg`, tIn: a, tOut: b });
const BROLL: Slot[] = [
  // CH1 cold open = rapid <=4s atmosphere cuts
  V('server-dark', 9.0, 14.0), I('the-off-switch', 14.0, 16.4), I('datacenter-going-dark', 16.4, 19.6), I('decentralized-mesh-network', 19.6, 21.86), // server-dark = 5s leading-corridor exception (covers "reached into...shut it down")
  I('government-monolith', 25.18, 28.9), I('mass-surveillance-eye', 28.9, 30.6), I('capital-into-ai', 30.7, 33.7), V('market-chart', 33.7, 37.2), I('parabolic-surge', 37.2, 40.3),
  // CH2 punctuation (transcript-aligned)
  I('datacenter-going-dark', 96.0, 99.5), V('code-screen', 99.5, 103.0), I('white-house-night', 143.0, 146.8),
  // CH3 punctuation
  V('robotics', 187.0, 190.6), V('biotech', 200.0, 203.6), V('construction', 209.0, 212.6),
  // CH4 punctuation
  V('inflation', 250.5, 254.0), I('war-cemetery-crosses', 263.0, 266.0), J('suffering-historical', 266.0, 268.42), V('server-dark', 369.0, 372.6),
  I('medical-cure-breakthrough', 405.0, 408.6), I('future-abundance-city', 412.0, 415.0),
  // CH6 punctuation
  V('market-chart', 612.0, 615.6),
  // CH7 plug — the real call charts (held as on-screen evidence): TAO Feb-bottom call, then LAB + Velvet entries
  I('chart-tao', 648.5, 658.5), I('chart-lab', 661.0, 666.3), I('chart-velvet', 666.6, 672.0),
  // CH8 punctuation
  I('datacenter-going-dark', 711.0, 714.5), I('wall-street-institutions', 723.0, 726.6),
  I('white-house-night', 730.0, 733.5), I('capital-into-ai', 749.0, 752.5),
  V('market-chart', 768.0, 771.5), I('parabolic-surge', 780.9, 784.5),
  // CH9 punctuation
  I('ai-datacenter-cathedral', 799.0, 802.3), I('frozen-bank-vault', 803.5, 806.4),
  I('datacenter-going-dark', 826.0, 829.0), I('decentralized-mesh-network', 831.0, 834.0), I('capital-into-ai', 836.0, 839.0),
  // ── NEW video b-roll (2026-06-18): the previously-unused sourced clips, placed on COVER beats only
  //    (never over a FACE span), transcript-aligned. All processed into render-assets/vid/.
  V('gavel-court', 124.9, 128.4),                                  // CH2 "the experts pushed back / signed a letter"
  V('ruins-decay', 216.9, 219.5), V('datacenter', 225.4, 229.0),                                            // CH3 "left behind" / the build-out
  V('govt-building', 244.6, 248.0), V('bureaucracy', 254.2, 257.0), V('war-archival', 257.2, 260.5),         // CH4 "find a government" anaphora (govt-building starts after the CH4 card clears)
  V('padlock-cyber', 277.0, 280.5), V('protest-unrest', 292.2, 295.5), V('surveillance', 315.5, 318.2),      // CH4 decentralization roll-call
  V('network-nodes', 338.0, 341.5),                                // CH4 "open marketplace for intelligence"
  V('medical-tech', 398.4, 402.0), V('future-city', 408.8, 411.9), // CH4 "cures diseases / doorway to the next stage"
  V('crypto-abstract', 616.0, 619.5),                              // CH6 "TAO ripped"
  V('wall-street', 738.8, 742.4),                                  // CH8 "the green light banks were waiting for"
  V('bank-vault', 806.5, 809.2),                                   // CH9 "money nobody can print or freeze"
];

const VideoBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const o = Math.min(interpolate(t, [slot.tIn, slot.tIn + 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [slot.tOut - 0.4, slot.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return <AbsoluteFill style={{ opacity: o, background: '#000' }}><OffthreadVideo src={asset(slot.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></AbsoluteFill>;
};
const ImageBroll: React.FC<{ slot: Slot; t0: number }> = ({ slot, t0 }) => {
  const t = useT() + t0;
  const pIn = interpolate(t, [slot.tIn, slot.tIn + 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const pOut = interpolate(t, [slot.tOut - 0.4, slot.tOut], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const sweep = pIn * 140 - 20;
  const mask = pIn >= 1 ? undefined : `linear-gradient(105deg, rgba(0,0,0,1) ${sweep}%, rgba(0,0,0,0) ${sweep + 22}%)`;
  const warpIn = 1 - pIn;
  return <AbsoluteFill style={{ opacity: 1 - pOut, background: '#000' }}>
    <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: mask as any, maskImage: mask as any }}>
      <Img src={asset(slot.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1 + warpIn * 0.08 + pOut * 0.07}) skewX(${warpIn * -7 + pOut * 5}deg)`, filter: `blur(${(warpIn * 12 + pOut * 10).toFixed(1)}px)` }} />
    </div></AbsoluteFill>;
};

// ───────────── deck-style CONTAINER (full-bleed, left-aligned, orbs — matches the slide deck) ─────────────
type Acc = 'green' | 'cyan' | 'gold' | 'red';
const accColor = (a: Acc) => ({ green: C.green, cyan: C.cyan, gold: C.gold, red: C.red }[a]);
type Card = { tIn: number; tOut: number; eyebrow: string; title: React.ReactNode; body?: React.ReactNode; acc?: Acc; orb?: Acc };
const Container: React.FC<{ card: Card }> = ({ card }) => {
  const t = useT();
  const o = Math.min(interpolate(t, [card.tIn, card.tIn + 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [card.tOut - 0.4, card.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  if (o <= 0.001) return null;
  const rise = interpolate(t, [card.tIn, card.tIn + 0.5], [26, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const orb = accColor(card.orb || 'cyan');
  return (
    <AbsoluteFill style={{ opacity: o, background: C.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 620, height: 620, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.32, background: orb, top: -140, right: -120 }} />
      <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', filter: 'blur(120px)', opacity: 0.20, background: C.green, bottom: -140, left: -120 }} />
      <AbsoluteFill style={{ flexDirection: 'column', justifyContent: 'center', padding: '0 150px', transform: `translateY(${rise}px)` }}>
        <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sec, margin: 0 }}>{card.eyebrow}</p>
        <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, lineHeight: 1.06, letterSpacing: '-0.01em', color: C.ink, margin: '20px 0 0', maxWidth: 1400 }}>{card.title}</h2>
        <div style={{ width: 70, height: 4, borderRadius: 2, margin: '30px 0', background: `linear-gradient(90deg, ${accColor(card.acc || 'cyan')}, ${C.green})` }} />
        {card.body && <p style={{ fontFamily: SANS, fontSize: 40, lineHeight: 1.42, color: C.sec, margin: 0, maxWidth: 1160 }}>{card.body}</p>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const A = (a: Acc) => ({ color: accColor(a) });
const CONTAINERS: Card[] = [
  // ── CH2 the ban (transcript-aligned) ──
  { tIn: 57, tOut: 69.4, eyebrow: 'The directive', title: <>Shut down <span style={A('red')}>Fable 5 + Mythos 5</span></>, acc: 'red', orb: 'red', body: <>For every foreign national on Earth, including inside the U.S. and Anthropic&apos;s own employees.</> },
  { tIn: 69.86, tOut: 82, eyebrow: 'The fine print', title: <>Even <span style={A('red')}>dual citizens</span> are banned</>, acc: 'red', orb: 'red', body: <>They specified foreign national, not US-citizen-only. A U.S. citizen holding dual citizenship is banned too.</> },
  { tIn: 82, tOut: 96, eyebrow: 'No way to do it halfway', title: <>Pulled for <span style={A('red')}>everyone</span></>, acc: 'red', orb: 'red', body: <>Americans included. The most powerful AI on the planet, dark overnight.</> },
  { tIn: 103, tOut: 112, eyebrow: 'Three words', title: <>&ldquo;<span style={A('gold')}>Fix this code</span>&rdquo;</>, acc: 'gold', orb: 'gold', body: <>Ask it to review code for security holes, it refuses. Ask it to fix the code, it does.</> },
  { tIn: 112, tOut: 124.6, eyebrow: 'The catch', title: <>To fix a flaw, you first have to <span style={A('gold')}>find it</span></>, acc: 'gold', orb: 'gold', body: <>So the same tool that patches a bug could, in theory, help an attacker find one.</> },
  { tIn: 124.78, tOut: 133, eyebrow: 'The experts pushed back', title: <>It cannot be <span style={A('gold')}>meaningfully fixed</span></>, acc: 'gold', body: <>One said trying would only weaken its defense.</> },
  { tIn: 146.8, tOut: 153.1, eyebrow: 'One phone call. One letter.', title: <>Dark for the <span style={A('red')}>entire planet</span></>, acc: 'red', orb: 'red' },
  // ── CH3 supercycle (transcript-aligned) ──
  { tIn: 165.4, tOut: 170.78, eyebrow: 'Zoom out', title: <>Bigger than one <span style={A('cyan')}>banned model</span></>, acc: 'cyan' },
  { tIn: 184.2, tOut: 193.84, eyebrow: 'The supercycle', title: <>The biggest expansion in <span style={A('green')}>history</span></>, acc: 'green', orb: 'green', body: <>A productivity boom. Work that took a team a month, done in an afternoon.</> },
  { tIn: 193.84, tOut: 199.4, eyebrow: 'The scale', title: <>Every industry, <span style={A('green')}>all at once</span></>, acc: 'green', orb: 'green', body: <>At the same time. The scale is hard to picture.</> },
  { tIn: 199.4, tOut: 204.8, eyebrow: 'The markets', title: <>Tens of <span style={A('green')}>trillions</span></>, acc: 'green', orb: 'green', body: <>AI, robotics, and biotech, each a market measured in the tens of trillions.</> },
  { tIn: 204.8, tOut: 221.78, eyebrow: 'Not a tech story', title: <>It is an <span style={A('cyan')}>economic story</span></>, acc: 'cyan', body: <>The countries that harness it run the next decade. The ones that do not get left behind. That is why governments are panicking.</> },
  { tIn: 221.78, tOut: 229.06, eyebrow: 'The build-out', title: <>Trillions racing into <span style={A('green')}>AI</span></>, acc: 'green', orb: 'green', body: <>The largest single capital build-out of our lifetime.</> },
  // ── CH4 anti-gov + Bittensor (transcript-aligned) ──
  { tIn: 241.8, tOut: 250.5, eyebrow: 'Why decentralize', title: <>Want progress held back? <span style={A('red')}>Find a government.</span></>, acc: 'red', orb: 'red' },
  { tIn: 254, tOut: 263, eyebrow: 'Find a government', title: <>For <span style={A('red')}>centuries</span> of holding humanity back</>, acc: 'red', orb: 'red', body: <>Want the cost of living up and families struggling to provide? Find a government.</> },
  { tIn: 276.06, tOut: 292, eyebrow: 'The answer', title: <>Decentralize <span style={A('cyan')}>everything</span></>, acc: 'cyan', body: <>Money with crypto so no bank can freeze it. The web with IPFS so no single server can be seized.</> },
  { tIn: 292, tOut: 311.34, eyebrow: 'The roll-call', title: <>No platform can <span style={A('cyan')}>ban you</span></>, acc: 'cyan', body: <>Nostr and Signal for speech, Arweave for storage. Nothing seized, nothing quietly deleted.</> },
  { tIn: 311.34, tOut: 321.96, eyebrow: 'The final frontier', title: <>Decentralizing <span style={A('green')}>intelligence</span> itself</>, acc: 'green', orb: 'green', body: <>Your name and reputation belong to you, not to a company that can ban you.</> },
  { tIn: 337.4, tOut: 348, eyebrow: 'What it is', title: <>An open marketplace for <span style={A('cyan')}>intelligence</span></>, acc: 'cyan', body: <>Anyone on Earth can build an AI, compete, and get paid for it. Owned by everyone and no one.</> },
  { tIn: 348, tOut: 359, eyebrow: 'A fair launch', title: <>January <span style={A('green')}>2021</span></>, acc: 'green', orb: 'green', body: <>No venture capital, no pre-mine, no ICO. Every single token earned by doing real work for the network.</> },
  { tIn: 359.14, tOut: 368.8, eyebrow: 'The irony nobody says out loud', title: <>They did not slow it down. <span style={A('green')}>They endorsed it.</span></>, acc: 'green' },
  { tIn: 368.8, tOut: 383.16, eyebrow: 'What they proved', title: <>A centralized model is a <span style={A('red')}>switch</span></>, acc: 'red', orb: 'red', body: <>A hand that can come down on a Friday, for any reason, with no warning and no appeal.</> },
  { tIn: 383.16, tOut: 398.3, eyebrow: 'And the opposite', title: <>The only AI that survives a government is the one it <span style={A('cyan')}>cannot reach</span></>, acc: 'cyan' },
  { tIn: 398.38, tOut: 415, eyebrow: 'What is at stake', title: <>It was never about a <span style={A('green')}>chatbot</span></>, acc: 'green', orb: 'green', body: <>The technology that cures diseases, ends scarcity, and hands everyone the intelligence that used to belong to the few.</> },
  { tIn: 415.16, tOut: 419.86, eyebrow: 'The doorway', title: <>One letter, one hand on the <span style={A('red')}>switch for all of it</span></>, acc: 'red', orb: 'red' },
  { tIn: 426.46, tOut: 440.76, eyebrow: 'Not a preference', title: <>The only path nobody can <span style={A('cyan')}>switch off</span></>, acc: 'cyan', body: <>Decentralization is not an ideology. It is the only version of the future nobody can censor or take away.</> },
  // ── CH5 sub-containers (between the diagrams; fill the gaps, transcript-aligned) ──
  { tIn: 472.9, tOut: 483.4, eyebrow: 'Proof of intelligence', title: <>Bitcoin burns electricity. Bittensor produces <span style={A('cyan')}>intelligence</span></>, acc: 'cyan', body: <>Same idea, different commodity. Proof of intelligence instead of proof of work.</> },
  { tIn: 483.4, tOut: 490, eyebrow: 'The obvious question', title: <>With no boss, who decides which AI is <span style={A('gold')}>good?</span></>, acc: 'gold', orb: 'gold' },
  { tIn: 505, tOut: 513, eyebrow: 'Consensus, not one opinion', title: <>The network never trusts a <span style={A('cyan')}>single judge</span></>, acc: 'cyan', body: <>It blends every validator&apos;s scores into one stake-weighted truth, and pays the best work.</> },
  { tIn: 513, tOut: 524.2, eyebrow: 'You cannot rig it', title: <>A rogue vote gets <span style={A('red')}>clipped</span></>, acc: 'red', orb: 'red', body: <>Pump a friend&apos;s score and the vote is thrown out. No single validator hands out the rewards.</> },
  { tIn: 524.48, tOut: 535, eyebrow: 'The judges are judged too', title: <>Stay close to the <span style={A('cyan')}>honest consensus</span></>, acc: 'cyan', body: <>A validator only earns well if its scores track the agreed-upon truth.</> },
  { tIn: 535, tOut: 542.1, eyebrow: 'Skin in the game', title: <>Cheating costs <span style={A('gold')}>real money</span></>, acc: 'gold', orb: 'gold', body: <>Lie or go rogue, you get penalized. And you stake TAO to play.</> },
  { tIn: 542.12, tOut: 556.3, eyebrow: 'Why it is called proof of intelligence', title: <>Honesty is the most <span style={A('green')}>profitable</span> strategy</>, acc: 'green', orb: 'green', body: <>The whole thing self-polices into rewarding the best AI, the same way honest mining pays in Bitcoin.</> },
  // ── CH6 the market voted ──
  { tIn: 606.46, tOut: 612, eyebrow: 'The market voted', title: <>Watch what the <span style={A('green')}>money did</span></>, acc: 'green', orb: 'green' },
  { tIn: 615.6, tOut: 627.78, eyebrow: 'TAO ripped', title: <>$2.87B into AI crypto in <span style={A('green')}>one week</span></>, acc: 'green', orb: 'green', body: <>The week the ban hit, the whole decentralized-AI sector repriced at once. (Verify live figures before final.)</> },
  { tIn: 634.1, tOut: 639.3, eyebrow: 'The tell', title: <>It did not debate. <span style={A('cyan')}>It moved.</span></>, acc: 'cyan' },
  // ── CH8 how the govt backs it (NOT a name-check) ──
  { tIn: 700.38, tOut: 702.72, eyebrow: 'How the government backs it', title: <>Two ways. <span style={A('cyan')}>Neither is a law.</span></>, acc: 'cyan' },
  { tIn: 702.72, tOut: 720.62, eyebrow: 'One: the ban itself', title: <>They made the case <span style={A('green')}>by force</span></>, acc: 'green', orb: 'green', body: <>Shutting down the most powerful centralized model proved the off switch is real, and handed the decentralized side its strongest argument.</> },
  { tIn: 720.84, tOut: 734.32, eyebrow: 'Two: the regulatory on-ramp', title: <>The market-structure <span style={A('cyan')}>Clarity Act</span></>, acc: 'cyan', body: <>While one hand banned a model, the other paved a road. It gives digital assets an actual legal classification.</> },
  { tIn: 734.7, tOut: 745.88, eyebrow: 'The green light', title: <>What banks were <span style={A('gold')}>waiting for</span></>, acc: 'gold', orb: 'gold', body: <>Until an asset has a clear legal lane, big money legally cannot touch it. Now it can.</> },
  { tIn: 746.1, tOut: 756.4, eyebrow: 'Spot-TAO ETFs', title: <>Grayscale + Bitwise, <span style={A('green')}>in motion</span></>, acc: 'green', orb: 'green', body: <>Filings that let institutional money buy TAO without ever touching a wallet.</> },
  { tIn: 756.4, tOut: 760.1, eyebrow: 'The plumbing', title: <>Institutional money, <span style={A('cyan')}>no wallet</span></>, acc: 'cyan', body: <>They are building the road; the money flows down it.</> },
  { tIn: 765.72, tOut: 774.5, eyebrow: 'Perspective', title: <>Like buying Bitcoin at <span style={A('gold')}>$200</span></>, acc: 'gold', orb: 'gold', body: <>We are standing at that exact same moment, right now, with TAO.</> },
  { tIn: 774.7, tOut: 784.82, eyebrow: 'The wave', title: <>It goes <span style={A('green')}>parabolic</span></>, acc: 'green', orb: 'green', body: <>Trillions about to pour in. When the wave hits, the market does not just double. TAO is the AI layer of that wave.</> },
  { tIn: 785.28, tOut: 788.38, eyebrow: 'The asymmetry', title: <>Billions today. <span style={A('green')}>Trillions tomorrow?</span></>, acc: 'green', body: <>The opportunity, framed as upside, not a promised target.</> },
  // ── CH9 close ──
  { tIn: 794.52, tOut: 806.16, eyebrow: 'Two neutral layers nobody owns', title: <>TAO + <span style={A('cyan')}>KAS</span></>, acc: 'cyan', body: <>TAO, the AI inference layer. KAS, the proof-of-work money layer, the money nobody can print or freeze.</> },
  { tIn: 806.16, tOut: 809.3, eyebrow: 'Two sides', title: <>The exact same <span style={A('green')}>principle</span></>, acc: 'green', orb: 'green' },
  { tIn: 825.78, tOut: 839.24, eyebrow: 'Recap', title: <>The money fled into the one AI with <span style={A('cyan')}>no off switch</span></>, acc: 'cyan', body: <>One directive shut down the most powerful AI. The same government is building the on-ramp for the rest of the money to follow.</> },
  { tIn: 839.24, tOut: 841.06, eyebrow: 'The takeaway', title: <>That is the trade. <span style={A('green')}>That is the decade.</span></>, acc: 'green', orb: 'green' },
];

// ── CH5 mechanics = the built system-design diagrams (spotlight, swap per bullet; sub-containers fill between) ──
type Diag = { tIn: number; tOut: number; src: string };
const DIAGRAMS: Diag[] = [
  { tIn: 440.76, tOut: 459.1, src: 'subnets-network.png' },   // subnets / 100 jobs
  { tIn: 459.3, tOut: 472.9, src: 'miners-validators.png' },  // miners + validators, best output earns TAO
  { tIn: 490, tOut: 505, src: 'yuma-consensus.png' },         // Yuma judging mechanism (then sub-containers)
  { tIn: 556.66, tOut: 573.6, src: 'tao-token.png' },         // TAO token: 21M cap, halvings, earn/stake/spend
  { tIn: 573.6, tOut: 586.38, src: 'dtao.png' },              // dTAO market-directed emissions
];
const Diagram: React.FC<{ d: Diag }> = ({ d }) => {
  const t = useT();
  const o = Math.min(interpolate(t, [d.tIn, d.tIn + 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [d.tOut - 0.4, d.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  if (o <= 0.001) return null;
  const sc = interpolate(t, [d.tIn, d.tIn + 0.5], [0.96, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: o, background: C.bg }}><Img src={asset(`deck/${d.src}`)} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${sc})` }} /></AbsoluteFill>;
};

// ───────────── receipts (real article screenshots) ─────────────
type Rec = { tIn: number; tOut: number; src: string };
const RECEIPTS: Rec[] = [
  { tIn: 50, tOut: 57, src: 'ban-aljazeera.png' }, { tIn: 133, tOut: 143, src: 'fix-this-code-fortune.png' },
];
const Receipt: React.FC<{ r: Rec }> = ({ r }) => {
  const t = useT();
  const o = Math.min(interpolate(t, [r.tIn, r.tIn + 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(t, [r.tOut - 0.4, r.tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ opacity: o, background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Img src={asset(`receipts/${r.src}`)} style={{ maxWidth: '78%', maxHeight: '90%', objectFit: 'contain', borderRadius: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }} /></AbsoluteFill>;
};

// ───────────── logo reveal ─────────────
const LOGO_SPOTS: Array<[number, number]> = [[40.3, 43.3], [333.46, 337.4], [436.0, 440.76]];
const LogoReveal: React.FC<{ tIn: number; tOut: number }> = ({ tIn, tOut }) => {
  const t = useT();
  if (t < tIn - 0.1 || t > tOut) return null;
  const o = Math.min(interpolate(t, [tIn, tIn + 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), interpolate(t, [tOut - 0.4, tOut], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const li = interpolate(t, [tIn, tIn + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const wi = interpolate(t, [tIn + 0.35, tIn + 0.95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: o, background: C.bg, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', top: '42%', left: '50%', width: 760, height: 760, transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${C.cyan}38, transparent 62%)`, filter: 'blur(20px)', opacity: li }} />
    <Img src={asset('tao-logo-white.png')} style={{ width: 290, opacity: li, transform: `scale(${0.84 + 0.16 * li})`, filter: `drop-shadow(0 0 36px ${C.cyan}99)` }} />
    <div style={{ marginTop: 46, fontFamily: SERIF, fontWeight: 900, fontSize: 100, letterSpacing: '0.06em', color: C.ink, opacity: wi, transform: `translateY(${(26 * (1 - wi)).toFixed(1)}px)` }}>Bittensor</div>
    <div style={{ marginTop: 14, fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: '0.42em', color: C.cyan, opacity: wi }}>$TAO</div>
  </AbsoluteFill>;
};

// ───────────── montserrat captions (CH1 only, 1/3) ─────────────
// Captions ride EVERY >5s gated-face hold (Mike's rule) + the cold-open intro montage (the one special case).
// Caption times are spine times -> shifted by sh() to render time, like every other cue. Never over cover/b-roll
// (outside the intro) and never on short (<5s) faces. (Rendered ABOVE the light leak so the overlay never tints text.)
const Captions: React.FC = () => {
  const t = useT();
  const face5 = FACE_SPANS.filter(([a, b]) => b - a > 5).map(([a, b]) => [sh(a), sh(b)] as [number, number]);
  const inIntro = t <= sh(45.6) && !(t >= sh(40.2) && t <= sh(43.4));
  const inFace = !inIntro && face5.some(([a, b]) => t >= a && t <= b);
  if (!inIntro && !inFace) return null;
  // captions NEVER over a b-roll / image / chart cutaway (it's the cover there) — suppress while one is on top
  // (e.g. the TAO/LAB/Velvet charts inside the CH7 plug face hold). Intro montage is exempt.
  if (inFace && BROLL.some((s) => { const a = sh(s.tIn), b = sh(s.tOut); return t >= a && t <= b; })) return null;
  const srcArr = inIntro ? CAPTIONS_INTRO : CAPTIONS_FULL;
  let cur: { t: number; h: string } | undefined;
  for (let i = 0; i < srcArr.length; i++) { const st = sh(srcArr[i].t); if (t >= st) cur = { t: st, h: srcArr[i].h }; else break; }
  if (!cur) return null;
  const sc = interpolate(t - cur.t, [0, 0.18, 0.36], [0.7, 1.1, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  return <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', padding: '0 0 130px', pointerEvents: 'none' }}>
    <div style={{ fontFamily: MONT, fontWeight: 900, fontSize: 80, textTransform: 'lowercase', color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill' as any, transform: `scale(${sc})`, textAlign: 'center', maxWidth: 1500 }}>{cur.h}</div>
  </AbsoluteFill>;
};

// ───────────── chapter cards (book-flip) ─────────────
const CHAPTERS: Array<{ at: number; num: number; title: string }> = [
  { at: 49.78, num: 2, title: 'What Actually Happened' }, { at: 165.2, num: 3, title: 'Why This Matters' },
  { at: 241.7, num: 4, title: 'Decentralized AI' }, { at: 440.76, num: 5, title: 'How It Works' }, { at: 606.46, num: 6, title: 'The Market Voted' },
  { at: 700.38, num: 8, title: 'The Government Backs It' },
];
const ChapterCard: React.FC<{ at: number; num: number; title: string }> = ({ at, num, title }) => {
  const t = useT();
  const hold = 1.8;
  if (t < at - 0.1 || t > at + hold + 0.8) return null;
  const pIn = interpolate(t, [at, at + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const pOut = interpolate(t, [at + hold, at + hold + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const rot = (1 - pIn) * 95 - pOut * 95;
  const o = Math.min(pIn * 1.6, 1) * (1 - pOut);
  return <AbsoluteFill style={{ perspective: 1800 }}>
    <AbsoluteFill style={{ background: C.bg, transform: `rotateY(${rot}deg)`, transformOrigin: 'left center', opacity: o, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.cyan, margin: 0 }}>Chapter {num}</p>
        <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, lineHeight: 1.05, color: C.ink, margin: '16px 0 0' }}>{title}</h2>
      </div>
    </AbsoluteFill></AbsoluteFill>;
};

const FilmBurn: React.FC<{ at: number }> = ({ at }) => {
  const t = useT();
  if (t < at - 0.32 || t > at + 0.32) return null;
  const o = interpolate(Math.abs(t - at), [0, 0.32], [1, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  return <AbsoluteFill style={{ pointerEvents: 'none', opacity: o * 0.2, background: 'radial-gradient(circle at 50% 45%, rgba(255,238,200,0.8), rgba(255,170,90,0.4) 38%, rgba(120,50,10,0) 70%)', mixBlendMode: 'screen' }} />;
};
const LightLeak: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const o = Math.min(interpolate(t, [a, a + 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), interpolate(t, [b - 0.8, b], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const drift = interpolate(t, [a, b], [-12, 18]);
  return <AbsoluteFill style={{ pointerEvents: 'none', opacity: o * 0.32, mixBlendMode: 'screen', background: `radial-gradient(900px 700px at ${60 + drift}% ${28 + drift * 0.3}%, rgba(255,206,140,0.9), rgba(255,150,80,0.25) 45%, transparent 70%)` }} />;
};

// ───────────── CH7 mid-roll plug community CTA (lower-third over the face) ─────────────
// CryptoRich.vip CTA. HIDDEN 661-671 (11:01-11:11) while the LAB/Velvet charts are up, because the lower-third
// (bottom-left) covers those charts' bottom-left "MY CALL" arrow (Mike, 2026-06-18). Two windows, fade each.
const LT_WINDOWS: Array<[number, number]> = [[657, 661], [671, 690]];
const LowerThird: React.FC = () => {
  const t = useT();
  const win = LT_WINDOWS.map(([a, b]) => [sh(a), sh(b)] as [number, number]).find(([a, b]) => t >= a && t <= b); // shifted for the cuts
  if (!win) return null;
  const [a, b] = win;
  const o = Math.min(interpolate(t, [a, a + 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), interpolate(t, [b - 0.5, b], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const slide = interpolate(t, [a, a + 0.5], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 0 250px 90px', pointerEvents: 'none' }}>
      <div style={{ opacity: o, transform: `translateY(${slide}px)`, background: 'linear-gradient(180deg, rgba(14,29,49,0.96), rgba(10,12,16,0.96))', borderLeft: `5px solid ${C.cyan}`, borderRadius: '0 14px 14px 0', padding: '20px 38px 22px', boxShadow: '0 18px 50px rgba(0,0,0,0.55)' }}>
        <p style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan, margin: 0 }}>Real calls. Real conviction.</p>
        <p style={{ fontFamily: INTER, fontWeight: 900, fontSize: 54, color: C.ink, margin: '8px 0 0' }}>CryptoRich.vip <span style={{ color: C.sec, fontWeight: 700, fontSize: 34 }}>&mdash; link in description</span></p>
      </div>
    </AbsoluteFill>
  );
};

// ───────────── music: Retribution (CH1) -> HoldTheLine (CH2-4) -> Invaders (CH5-6) ─────────────
const B1 = sh(45.5), B2 = sh(440.76), B3 = sh(644.9), B4 = sh(700.2); // bed-change breaths — ALL shifted for the cuts
const fadeOut = (t: number, at: number) => interpolate(t, [at - 0.7, at + 0.1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const fadeIn = (t: number, at: number) => interpolate(t, [at + 0.4, at + 1.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const bed = (src: string, from: number, to: number | null, vol: number) => (
  <Sequence from={Math.round((from + 0.4) * B_FPS)} durationInFrames={to ? Math.round((to - from) * B_FPS) : undefined} layout="none">
    <Audio src={asset(src)} loop volume={(f) => { const t = (from + 0.4) + f / B_FPS; return vol * Math.min(fadeIn(t, from), to ? fadeOut(t, to) : 1); }} />
  </Sequence>
);
const Music: React.FC = () => (
  <>
    <Sequence durationInFrames={Math.round((B1 + 0.6) * B_FPS)} layout="none"><Audio src={asset('retribution.mp3')} volume={(f) => 0.10 * fadeOut(f / B_FPS, B1)} /></Sequence>
    {bed('hold-the-line.mp3', B1, B2, 0.07)}
    {bed('the-invaders.mp3', B2, B3, 0.07)}
    {bed('common-high-speeds.wav', B3, B4, 0.08)}
    {bed('searching.mp3', B4, null, 0.07)}
  </>
);

// Outro fade-to-black over the last 0.5s (covers the spine's hard end + any footage-less tail).
const FadeOut: React.FC = () => {
  const t = useT();
  const end = B_DURATION / B_FPS;
  const start = end - OUTRO;
  if (t < start) return null;
  const o = interpolate(t, [start, end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#000', opacity: o, pointerEvents: 'none' }} />;
};

export const BittensorCh1to6: React.FC = () => {
  // shift every overlay cue past the fumble cut (sh is a no-op before FUMBLE.at, so CH1-CH7 are untouched)
  const diagrams = DIAGRAMS.map((d) => ({ ...d, tIn: sh(d.tIn), tOut: sh(d.tOut) }));
  const containers = CONTAINERS.map((c) => ({ ...c, tIn: sh(c.tIn), tOut: sh(c.tOut) }));
  const receipts = RECEIPTS.map((r) => ({ ...r, tIn: sh(r.tIn), tOut: sh(r.tOut) }));
  const broll = BROLL.map((s) => ({ ...s, tIn: sh(s.tIn), tOut: sh(s.tOut) }));
  const logos = LOGO_SPOTS.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
  const faces = FACE_SPANS.map(([a, b]) => [sh(a), sh(b)] as [number, number]);
  const chapters = CHAPTERS.map((c) => ({ ...c, at: sh(c.at) }));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Spine />
      {/* light leak = warm overlay on the bare face, CENTERED in each >5s hold; renders UNDER all cover
          (containers / b-roll / charts mask it) so it only tints the face, never a chart (Mike, 2026-06-18). */}
      {faces.filter(([a, b]) => b - a > 5).map(([a, b], i) => { const m = (a + b) / 2, d = Math.min(b - a - 2, 4); return <LightLeak key={`ll${i}`} a={m - d / 2} b={m + d / 2} />; })}
      {diagrams.map((d, i) => <Diagram key={`d${i}`} d={d} />)}
      {containers.map((c, i) => <Container key={`c${i}`} card={c} />)}
      {receipts.map((r, i) => <Receipt key={`r${i}`} r={r} />)}
      {/* b-roll renders ON TOP of containers as <=4s punctuation cutaways (briefly replaces the container, then back) */}
      {broll.map((s, i) => { const ff = Math.round((s.tIn - 0.1) * B_FPS); const t0 = ff / B_FPS;
        return <Sequence key={`b${i}`} from={ff} durationInFrames={Math.round((s.tOut - s.tIn + 0.2) * B_FPS)} layout="none">{s.kind === 'video' ? <VideoBroll slot={s} t0={t0} /> : <ImageBroll slot={s} t0={t0} />}</Sequence>; })}
      {logos.map(([a, b], i) => <LogoReveal key={`lg${i}`} tIn={a} tOut={b} />)}
      {faces.flatMap(([a, b], i) => [<FilmBurn key={`fa${i}`} at={a} />, <FilmBurn key={`fb${i}`} at={b} />])}
      {chapters.map((c) => <ChapterCard key={c.num} {...c} />)}
      <Captions />
      <LowerThird />
      <FadeOut />
      <Music />
    </AbsoluteFill>
  );
};
