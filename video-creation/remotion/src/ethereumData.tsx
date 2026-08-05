// AUTO-GENERATED from COVER-PLAN.json — regenerate if the plan changes.
// `ref` is the FULL asset path relative to the render --public-dir, resolved and
// existence-checked at generation time. Do NOT rebuild the folder from `kind`/`sub`:
// three montage stills are typed CARD SLIDE but live in diagrams/ and charts/ (they are
// end-state exports stored beside their sources), which broke the CH5 render.
export type Cover = { tIn: number; tOut: number; kind: string; ref: string;
  id: string; sub: string; lead?: boolean; cap?: boolean; mont?: boolean; state?: string };
export const COVERS: Cover[] = [
  { tIn: 8.44, tOut: 11.32, kind: 'vid', ref: 'vid/br-skyline.mp4', id: 'V1', sub: 'vid', cap: true },
  { tIn: 11.32, tOut: 15.26, kind: 'receipt', ref: 'receipts/R1-rwaxyz.png', id: 'R1', sub: 'receipt', cap: true },
  { tIn: 15.26, tOut: 26.22, kind: 'chart', ref: 'charts/C1-rwa-growth.png', id: 'C1', sub: 'chart', cap: true },
  { tIn: 26.22, tOut: 29.96, kind: 'chart', ref: 'charts/C2-dominance-A.png', id: 'C2-A', sub: 'chart', cap: true },
  { tIn: 30.73, tOut: 36.04, kind: 'chart', ref: 'charts/C2-dominance-B.png', id: 'C2-B', sub: 'chart', cap: true },
  { tIn: 36.04, tOut: 48.92, kind: 'container', ref: 'card-slides/D1-tease-s1.png', id: 'D1-TEASE', sub: 'card', cap: true, state: 'D1-TEASE' },
  { tIn: 48.92, tOut: 65.76, kind: 'deck', ref: 'diagrams/D2-A-tokenization.png', id: 'D2-A', sub: 'diagram', state: 'D2-A' },
  { tIn: 65.76, tOut: 69.58, kind: 'vid', ref: 'vid/br-hq-tower.mp4', id: 'V2', sub: 'vid' },
  { tIn: 69.58, tOut: 75.32, kind: 'receipt', ref: 'receipts/R2-buidl.png', id: 'R2', sub: 'receipt' },
  { tIn: 75.32, tOut: 85.3, kind: 'container', ref: 'card-slides/D2-B-buidl.png', id: 'D2-B', sub: 'card', state: 'D2-B' },
  { tIn: 85.3, tOut: 93.2, kind: 'chart', ref: 'charts/C6-buidl-chains.png', id: 'C6', sub: 'chart' },
  { tIn: 93.2, tOut: 100.88, kind: 'chart', ref: 'charts/C7-market-mix.png', id: 'C7', sub: 'chart' },
  { tIn: 100.88, tOut: 104.84, kind: 'still', ref: 'img/I1-stampede.png', id: 'I1', sub: 'still' },
  { tIn: 104.84, tOut: 107.54, kind: 'vid', ref: 'vid/br-vault.mp4', id: 'V3', sub: 'vid' },
  { tIn: 111.88, tOut: 118.0, kind: 'receipt', ref: 'receipts/R3-theblock.png', id: 'R3', sub: 'receipt' },
  { tIn: 118.0, tOut: 129.92, kind: 'container', ref: 'card-slides/D2-C-2t-s1.png', id: 'D2-C', sub: 'card', state: 'D2-C' },
  { tIn: 129.92, tOut: 133.3, kind: 'vid', ref: 'vid/br-trader-react.mp4', id: 'V4', sub: 'vid' },
  { tIn: 133.3, tOut: 142.74, kind: 'receipt', ref: 'receipts/R4-rh-launch.png', id: 'R4', sub: 'receipt' },
  { tIn: 144.78, tOut: 161.26, kind: 'deck', ref: 'diagrams/D3-A-stack.png', id: 'D3-A', sub: 'diagram', state: 'D3-A' },
  { tIn: 161.26, tOut: 170.0, kind: 'container', ref: 'card-slides/D3-B-stocks.png', id: 'D3-B', sub: 'card', state: 'D3-B' },
  { tIn: 170.0, tOut: 173.46, kind: 'vid', ref: 'vid/br-phone-app.mp4', id: 'V5', sub: 'vid' },
  { tIn: 173.46, tOut: 185.1, kind: 'chart', ref: 'charts/C3-rh-momentum.png', id: 'C3', sub: 'chart' },
  { tIn: 185.1, tOut: 192.6, kind: 'chart', ref: 'charts/C8-solana-equities.png', id: 'C8', sub: 'chart' },
  { tIn: 192.6, tOut: 200.34, kind: 'container', ref: 'diagrams/D3-A-stack-L1.png', id: 'D3-A-L1', sub: 'diagram', state: 'D3-A-L1' },
  { tIn: 200.34, tOut: 202.96, kind: 'vid', ref: 'vid/br-eth-coin.mp4', id: 'V6', sub: 'vid' },
  { tIn: 202.96, tOut: 222.88, kind: 'chart', ref: 'charts/C4-lockup.png', id: 'C4', sub: 'chart' },
  { tIn: 222.88, tOut: 231.88, kind: 'receipt', ref: 'receipts/R5-bitmine.png', id: 'R5', sub: 'receipt' },
  { tIn: 231.88, tOut: 234.82, kind: 'vid', ref: 'vid/br-ticker-floor.mp4', id: 'V7', sub: 'vid' },
  { tIn: 234.82, tOut: 239.94, kind: 'receipt', ref: 'receipts/R6-etf-flows.png', id: 'R6', sub: 'receipt' },
  { tIn: 239.94, tOut: 246.54, kind: 'container', ref: 'card-slides/D4-B-etf.png', id: 'D4-B', sub: 'card', state: 'D4-B' },
  { tIn: 246.54, tOut: 253.4, kind: 'deck', ref: 'diagrams/D4-C-toll-1.png', id: 'D4-C-1', sub: 'diagram', state: 'D4-C-1' },
  { tIn: 253.4, tOut: 261.68, kind: 'container', ref: 'diagrams/D4-C-toll-2.png', id: 'D4-C-2', sub: 'diagram', state: 'D4-C-2' },
  { tIn: 261.68, tOut: 266.6, kind: 'receipt', ref: 'receipts/R7-vitalik.png', id: 'R7', sub: 'receipt' },
  { tIn: 266.6, tOut: 279.18, kind: 'container', ref: 'diagrams/D4-C-toll-3.png', id: 'D4-C-3', sub: 'diagram', state: 'D4-C-3' },
  { tIn: 286.12, tOut: 289.54, kind: 'still', ref: 'img/I2-tollbooth.png', id: 'I2', sub: 'still' },
  { tIn: 289.54, tOut: 293.5, kind: 'container', ref: 'card-slides/D2-B-buidl@end.png', id: 'MONT-1', sub: 'card', mont: true, state: 'MONT-1' },
  { tIn: 293.5, tOut: 297.62, kind: 'container', ref: 'diagrams/D3-A-stack@end.png', id: 'MONT-2', sub: 'card', mont: true, state: 'MONT-2' },
  { tIn: 297.62, tOut: 301.88, kind: 'container', ref: 'charts/C4-lockup@end.png', id: 'MONT-3', sub: 'card', mont: true, state: 'MONT-3' },
  { tIn: 301.88, tOut: 304.2, kind: 'container', ref: 'card-slides/D4-B-etf@end.png', id: 'MONT-4', sub: 'card', mont: true, state: 'MONT-4' },
  { tIn: 304.2, tOut: 306.27, kind: 'container', ref: 'diagrams/D4-C-toll@end.png', id: 'MONT-5', sub: 'card', mont: true, state: 'MONT-5' },
  { tIn: 391.19, tOut: 395.0, kind: 'vid', ref: 'vid/br-wave.mp4', id: 'V8', sub: 'vid' },
  { tIn: 395.0, tOut: 398.24, kind: 'still', ref: 'img/I3-real-assets.png', id: 'I3', sub: 'still' },
  { tIn: 398.24, tOut: 402.78, kind: 'vid', ref: 'vid/br-bank-lobby.mp4', id: 'V9', sub: 'vid', lead: true },
  { tIn: 402.78, tOut: 409.04, kind: 'container', ref: 'card-slides/D5-close.png', id: 'D5-CLOSE', sub: 'card', state: 'D5-CLOSE' },
  { tIn: 340.964, tOut: 345.964, kind: 'container', ref: 'card-slides/LAB-353x.png', id: 'LAB353', sub: 'card', state: 'LAB353' },
];
export const INSERTS: { at: number; dur: number }[] = [
  { at: 48.782067, dur: 1.001 },
  { at: 129.863067, dur: 1.001 },
  { at: 200.2, dur: 1.001 },
];
export const CAPTION_SRC: [number, number][] = [[0, 48.92]];
export const FACE: [number, number][] = [
  [0.0, 8.44],
  [29.96, 30.73],
  [107.54, 111.88],
  [142.74, 144.78],
  [279.18, 286.12],
  [306.27, 391.19],
  [409.04, 417.41],
];
export const CARDS: { t: number; text: string }[] = [
  { t: 48.92, text: 'THE PROOF' },
  { t: 129.92, text: 'ROBINHOOD CHAIN' },
  { t: 200.34, text: 'THE BULL CASE' },
];
