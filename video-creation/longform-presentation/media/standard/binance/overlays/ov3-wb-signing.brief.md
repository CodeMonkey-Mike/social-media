# ov3-wb-signing: the WHITEBOARD BEAT, "Binance's own key signed for the thief" (neon-ink)

The first whiteboard beat in a real video (`video-creation/skills/whiteboard-beat/whiteboard-beat.md`). Video:
`media/standard/binance/` (longform-presentation, format 4 "standard"). The clip is composited INSIDE the deck area
of the screen share while Mike stays on camera to the right: **canvas 1464 x 1080**, fps 30, **19.25 s = 577
frames**, no audio. **Pen: `neon-ink`** (Mike, 2026-10-31: "it's dark mode, and the colors already look like
Binance's colors": black + gold). Fact source: `../RESEARCH.md`, the EIP-7702 section (lines ~80-87) and the
timeline (line ~45-47).

## What he says (LOCAL seconds = spine seconds minus 150.1; the clip's t)
```
0.36 Ethereum  0.90 wasn't  1.40 broken (1.84)      1.84 This is interesting right here (2.84)
4.56 Ethereum  5.24 was  5.76 not  6.30 broken (7.0)
7.38 Binance's own signing system (first try, 9.44)   10.18 Binance's own signing system (12.30)
12.32 signed for the attacker (13.60)
13.64 Prepared  14.80 days  15.30 in advance (16.30)
16.34 fired  16.92 in one burst (17.80)
17.82 crazy, dude (19.20)        19.25 END (the caller fades the clip out)
```

## The scene (2 to 3 micro-scenes on one canvas, left to right)
1. **Ethereum was not broken** (0.3 to 7): the Ethereum mark (a hand-drawn diamond / hexagon, cyan `palette.blue`)
   draws on at 0.4 at the top-center or left; a green check pops beside it at 1.4 ("broken"); a short label
   "NOT BROKEN" types at 5.8, the second time he says it. The protocol stays intact the whole beat (it is the
   point: the chain worked, the key did the damage).
2. **Binance's own key signed** (7.4 to 13.6): left-center, a Binance vault / wallet (gold) draws on at 7.4 with the
   label "BINANCE WALLET"; a gold KEY draws on at 10.2 ("its own key", label "ITS OWN KEY"); at 12.3 ("signed for
   the attacker") the key signs: a stack of papers "50 APPROVALS" (white ink) appears, an arrow from the papers
   runs right to a hooded ATTACKER figure (red `palette.red`) that draws on at 12.4 next to a box "SWEEPER"
   (red; the attacker's contract). The approvals point the wallet at the sweeper.
3. **Prepared in advance, fired in one burst** (13.6 to 19.25): a small calendar (grey) with ticks types
   "PREPARED IN ADVANCE" at 13.7 (keep it "in advance", not "days": RESEARCH's own-day timeline says the sweeper
   was deployed at 15:59 and rehearsed; "36 hours" is single-source); at 16.3 ("fired") a thick burst arrow
   (gold) shoots from the vault to the attacker with a "$2.53B" count-up and "ONE BURST" label at 16.9; the
   beat ends on the finished drawing, nothing clears.

Facts you may put on screen (all in RESEARCH.md): 50 pre-signed EIP-7702 authorizations; signed with the
"Binance 14" hot-wallet key; each pointing to the attacker's sweeper contract; all 50 in ONE transaction at 20:20
UTC; the wallet swept ~$2.53B in ONE transaction ~3 min later. Labels 1 to 4 words, caps (the pen is caps);
Rock Salt headings are wide: keep any heading under ~22 characters at 50 px, or use the label font.

## Deliverable (per the agent definition)
- New kit objects in `video-creation/remotion/src/whiteboard/crypto.tsx` (vault / wallet, key, paper stack,
  hooded attacker, contract box, calendar, burst arrow, the Ethereum mark): studied from a reference, fixed
  seeds, role colors, draw-on via Sketch.
- Scene comp `video-creation/remotion/src/whiteboard/beats/BinanceSigning.tsx` exporting `BinanceSigning`, `FPS`
  = 30, `DUR` = 577; registered in `Root.tsx` as id **`BinanceSigning`**, width 1464, height 1080, fps 30.
- QA stills (bundle to `D:\remotion-tmp\wb-bundle`, public dir `video-creation/whiteboard/demo/pub`) at frames
  ~20, 60, 220, 390, 430, 520, 576 into `media/standard/binance/overlays/_wb/`, opened and checked by you.
- The CUES table with the word each cue hangs on, in your return message.
