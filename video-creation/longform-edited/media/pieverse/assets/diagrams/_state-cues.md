# pieverse · assets/diagrams · STATE CUES

One Type 2 SYSTEM-DESIGN chart in this video: **C1 "How Pieverse works"** (DATA.md CHART-SOURCE INDEX C1, Pillar 2 +
Pillar 1 stage). Source `C1.html` (every state is its own `.frame#C1-<state>` built from ONE layout table); stills shot by
`../charts/_build_charts.py --shoot C1` (Playwright, 1920x1080, fonts awaited, each state solo at the page origin).

**Pixel contract (verified by diff):** the header, divider, orbs, source line, every node box, every wire path and every
label sit at the same pixels in all 13 PNGs; a swap changes only the level of a node / wire (rest, dim .30, on, lit) and
the two state-only elements (the "swap this for that" bubble, the "Not in the product docs" tag). So any state swap is a
spotlight move, never a redraw, and a MELT / SPIN marquee between two states transforms cleanly.

Cue times are FINAL-spine seconds (`spine/ALL.d.enhanced.medium-words.json`), checked word by word.

## The 13 states

| PNG | Cue (spine s, the word) | What changes vs the previous state | COVER-PLAN row |
|---|---|---|---|
| `C1-overview.png` | 59.64 "Here's (how the product works)" | C1 enters full frame. Every node at REST (readable, no accent): the one overview, ~1.6 s, never shown whole again | cover 59.64-70.34 |
| `C1-agent.png` | 61.22 "rent (an agent)" | PURR-FECT CLAW lit (glow); everything else dims to .30 | same |
| `C1-agent-price.png` | 67.06 "$10 (to $279)" | the price pill `10 to 279 USD a month` goes hot | same |
| (hold `C1-agent-price`) | 70.34 "(Pieverse) hosts it for you" | nothing new: the agent keeps its glow under "hosts it for you" | cover 70.34-77.70 |
| `C1-wallet.png` | 72.88 "its (own wallet)" | AGENT WALLET lit; the agent steps down to ON (accent border, no glow); the agent-to-wallet wire lit | same |
| `C1-wallet-tee.png` | 76.68 "called (a TEE)" | the `IN A TEE` chip goes hot | same |
| (D17 card) | 77.70 | C1 yields its time to D17, returns in a NEW state | |
| `C1-chat.png` | 83.22 "Then" (the cover edge; "you" 83.70) | C1 re-enters on YOU, IN A CHAT APP lit (LINE, KakaoTalk). Never the overview again (THE BALANCE) | cover 83.22-90.20 |
| `C1-chat-swap.png` | 87.44 "swap (this for that)" | the message bubble `YOU: swap this for that` appears above the chat node | same |
| `C1-path.png` | run 88.50 -> lands 89.10 "it (does it on-chain)" | the three path wires light, chat / agent / wallet ON, ON-CHAIN ACTION lit. **Comp move:** reveal `C1-path` over `C1-chat-swap` with a left-to-right linear mask, x 140 -> 1800 over 88.50-89.10 (everything that differs lies along the path, so the arrows visibly RUN and the on-chain node lights last). A 0.3 s cross-fade at 89.10 is the fallback | same |
| (hold `C1-path`) | 90.20 "And you add abilities" | nothing new until the store is named | cover 90.20-95.14 |
| `C1-skills.png` | 91.88 "skill (store)" | SKILL STORE lit; the path, bubble and nodes return to dim | same |
| `C1-skills-feed.png` | 93.46 "installing (apps)" | the store-to-agent feed wire lit, the agent ON | same |
| (hold `C1-skills-feed`) | 95.14 "The bigger pitch" | | cover 95.14-98.98 |
| `C1-a2a.png` | 96.32 "agents (paying each other)" | the dashed AGENT-TO-AGENT PAYMENT branch + node lit, its badge `DOCUMENTED, DEFERRED` goes gold-hot; the agent ON. Drawn dashed in every state (guard 4: never a live path) | same |
| (D4 card) | 98.98 | | |
| `C1-token.png` | 104.522 (the F3 screen-share edge; "look" 104.72) | **DECK AREA (FB3):** the same 1920x1080 still scaled 0.7625 into x 0-1464. PIEVERSE TOKEN lit, standing apart at the bottom right, no wire into it; everything else dim | face_body FB3 104.522-108.722 |
| `C1-token-tag.png` | 107.10 "because (the product docs never mention it)" | the gold tag `NOT IN THE PRODUCT DOCS` lands on the token node's top edge. Prints no number | same |

State swaps: 0.3 s cross-fade (the shared pixels hold still, only the spotlight moves), never `TransitionSeries`. The
entry at 59.64 and the return at 83.22 take the plan's container entrance (or the transition-strategist's MELT / SPIN if it
reserves C1 as a marquee: `C1-overview` is the post-transform look for an entry, `C1-chat` for the return).

## Never dead still (comp-build 7a)

Every hold gets a slow push of 1.00 -> 1.03 centred on the LIT node, eased in-out over the hold (a full-diagram view clips
its header past ~4%). Node centres, px on the 1920x1080 stage:

| node | centre | node | centre |
|---|---|---|---|
| Skill Store | (742, 325) | On-chain action | (1615, 581) |
| You, in a chat app | (305, 581) | Agent-to-agent payment | (837, 870) |
| Purr-Fect Claw | (742, 581) | PIEVERSE token | (1615, 889) |
| Agent wallet | (1178, 581) | overview (no lit node) | (960, 600) |

In the FB3 deck area the push is optional (the screen share itself is the motion), at most 1.02 on the token.

## Colour roles (fixed for this video's charts)

cyan `#00c2ff` = the spotlight and the live path (stylesheet default: COVER-PLAN has no `chapter_themes`) · gold
`#ffd700` = a caveat tag (deferred, not in the docs) · teal `#49e0c8` = the PIEVERSE ticker only · slate = resting structure.

## Wording guards held (DATA.md)

Plans 10 to 279 USD a month (pricing.md, re-read 14 Nov: unchanged) · keys locked inside secure hardware, IN A TEE (docs
Core Concepts) · A2A drawn dashed + `DOCUMENTED, DEFERRED` (llms.txt "Live agent payments: deferred", re-read 14 Nov) ·
no skill or merchant count (guard 1) · no "first" claims, no partner logos; LINE and KakaoTalk named only as the chat
apps you message it in · token jobs "governance, staking, fee discounts, per the whitepaper" (5.2) · "not in the product
docs" (0 mentions, docs dump re-read 14 Nov) prints no number. No em dashes.
