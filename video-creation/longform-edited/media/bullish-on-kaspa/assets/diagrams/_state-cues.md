# bullish-on-kaspa: diagram state cues (chart-builder, 2026-11-04)

Type 2 SYSTEM-DESIGN stills. Movement = comp-level state swaps and spotlights only. Every state is a 1920x1080 PNG; shared elements are pixel-identical, so a cross-fade between two states reads as a transform. Times are FINAL spine seconds, read from `spine/ALL.d.desilenced.medium-words.json`. Source for each: `<id>.html`, one `.frame` per state.

Accent: Kaspa #49EACB on fills, #0E7A6C (the light token `--accent-teal`) on text and lit wires, because #49EACB alone fails contrast on the light page. No red anywhere in these files: red is reserved for FINAL and EARLY.

## C1 (CH2, 40.12 to 59.30)
| Time | Word | PNG | What changes |
|---|---|---|---|
| 40.12 | Bitcoin | `C1-A-chain.png` | Push in on 3 blocks in one chain |
| 43.52 | find | `C1-A-fork.png` | Two blocks land together, FOUND AT THE SAME MOMENT bracket |
| 46.26 | thrown | `C1-A.png` | One stays on the chain, one greys out and falls, chain runs on to 7 blocks |
| 46.98 | Kaspa | `C1-B.png` | Swap to the DAG, 16 blocks. Same time rail and same column x as state A, so the rail does not move |
| 51.36 to 52.76 | GhostDAG ... order | `C1-B-lit.png` | Ordering thread and GHOSTDAG: ONE ORDER chip |
| 52.98 | Kaspa | `C1-C-start.png` | Headline swaps, ONE SECOND bracket appears, thread stays lit |
| 56.44 to 57.78 | running ... 10 | `C1-C-mid.png` | Blocks under the bracket fill dark, one by one |
| 57.78 | 10 | `C1-C.png` | All 10 dark, the digit 10 lands |

- **Timing trap:** "order" lands at 52.76 and state C starts at 52.98, 220 ms later. Start the thread on "GhostDAG" (51.36) and land it on "order", or it never reads. State C keeps the thread lit, so nothing flashes off.
- **Overlays stay in the comp, not baked:** `kt-keyword-pop` THROWN AWAY goes over the dropped block, centre (930, 770), clear area x 650 to 1300, y 640 to 880. EVERY BLOCK COUNTS and the 10 BLOCKS / SECOND chip go in the free band y 950 to 1010, above the source line.
- **Fill order for the counter:** column x 690 (y 780, 600, 420), x 930 (510, 690), x 1170 (780, 600, 420), x 1410 (510, 690). Block size 96, fill #0E7A6C.

## C5 (CH3, 111.70 to 123.50, shown ONCE)
| Time | Word | PNG | What changes |
|---|---|---|---|
| Before 111.70 | push-in only | `C5-overview.png` | All 12 rungs grey, chips grey |
| 111.70 | Covenant | `C5-toccata.png` | JUN 30 2026 TOCCATA lit, COVENANTS chip lit |
| 112.64 | transaction | `C5-intro.png` | INTROSPECTION lit |
| 114.52 | zero | `C5-zk.png` | ZK VERIFICATION lit |
| 119.40 | July | `C5-jul2.png` | JUL 2 FIRST SMART COINS lit. The JULY 2 chip pop stays in the comp |

The beat opens on "Covenant", so `C5-overview.png` only shows during the push-in. Never re-show this whole frame later (THE BALANCE).

## indexer-vs-l1 (CH3, 141.62 to 146.88)
| Time | Word | PNG | What changes |
|---|---|---|---|
| 141.62 | Kaspa's | `indexer-vs-l1-l1.png` | L1 box, shield, UNTOUCHED; indexer box quiet in grey dashes |
| 144.02 | flaw | `indexer-vs-l1-flaw.png` | Flaw mark lands, indexer border goes to ink |

## consensus-validates (CH3, 158.48 to 166.28)
| Time | Word | PNG | What changes |
|---|---|---|---|
| 158.48 | Token | `consensus-validates-rules.png` | Ring + TOKEN RULES; nodes and miners unchecked |
| 162.40 | every | `consensus-validates-validators.png` | Checks land on nodes and miners together (one spotlight, not separate): the ring is the consensus, per the do-not-air wording |
| 164.72 | not | `consensus-validates-indexer-out.png` | OUTSIDE INDEXER crossed out |

## kasplex-based-rollup (CH3, 209.34 to 214.78)
| Time | Word | PNG | What changes |
|---|---|---|---|
| 209.34 | Kaspa | `kasplex-based-rollup-base.png` | L2 above, L1 below, arrows down |
| 212.98 | gas | `kasplex-based-rollup-gas.png` | KAS = THE ONLY GAS chip lands (`cartoon-accent`) |

## D1 (CH4, 240.20 to 246.96)
| Time | Word | PNG | What changes |
|---|---|---|---|
| 240.20 | vProgs | `D1-A.png` | L1 box, three apps, wires quiet |
| 243.54 | talk | `D1-A-lit.png` | Arrows light, TALK TO EACH OTHER |
| 245.32 | No | `D1-A-norollup.png` | NO ROLLUP IN BETWEEN |
| Bench only | CH4 246.96-251.92 | `D1-B.png` | Adds the hatched UNDER CONSTRUCTION tag, the plan's bench swap for C32 |

## cascade (CH6, 480.20 to 487.00)
| Time | Word | PNG | What changes |
|---|---|---|---|
| 480.20 | cascade line | `cascade-base.png` | Both pools, all three arrows quiet, Kaspa pool low |
| 482.34 | Some | `cascade-wave1.png` | Arrow 1 lights, Kaspa pool rises |
| 483.78 | a year later | `cascade-wave2.png` | Arrow 2 lights, pool rises |
| 485.84 | and so on | `cascade-wave3.png` | Arrow 3 lights, pool rises |

The MY THEORY tag is baked into all four states at the top right, so it persists without a comp overlay. If the comp carries the tag across from `my-theory`, tell me and I will drop it from these. Pool levels are a shape, not a measurement.
