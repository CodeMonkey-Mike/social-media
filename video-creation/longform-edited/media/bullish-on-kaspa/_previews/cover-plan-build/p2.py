# CH2 (37.84-104.28)
cb("CH2", 37.84, 40.12, "chatgpt-image", "Now here's what Kaspa actually is.",
   "IMG-2: the Kaspa coin hero, backwards-K in greenish cyan, rim light, deep charcoal, nothing else in frame",
   "ChatGPT: Kaspa coin hero, persona kaspa_coin rule, reference kaspa-logo.png", bench="C1 state A starts here instead",
   notes="2.3 s image beat before THE diagram pushes in (kt-push-slide, swoosh-4).")
cb("CH2", 40.12, 46.98, "diagram", "Bitcoin runs one block at a time and when two miners find a block at the same moment, one of them gets thrown away.",
   "C1 state A: a single chain of blocks, two blocks found together, one greyed and dropped off the chain; kt-keyword-pop THROWN AWAY over the dropped block (minecraft-damage, the one negative verdict of the video)",
   "DATA.md Pillar 1 (kaspa.org/lore; eprint 2018/104); C1 = Type 2 system-design, LIGHT theme", pr="high",
   notes="Convention 4: one talking point per state, spotlight-swapped; the diagram holds while actively explained (rule #3).", asset="C1", state="A")
cb("CH2", 46.98, 52.98, "diagram", "Kaspa keeps every block. They land in parallel, in a graph, and GhostDAG puts them all in order.",
   "C1 state B: parallel blocks in a DAG, edges drawing, the GhostDAG ordering arrow lighting in the accent on 'order'; kt-keyword-pop EVERY BLOCK COUNTS (twinkle)",
   "DATA.md Pillar 1", pr="high", notes="Spotlight swap, cross-fade + scale-in.", asset="C1", state="B")
cb("CH2", 52.98, 59.30, "diagram", "Kaspa is a fully implemented GhostDAG, running proof of work at 10 blocks a second,",
   "C1 state C: the 10-blocks-a-second counter animating along the DAG; chip 10 BLOCKS / SECOND rises on '10' (cartoon-accent)",
   "DATA.md Pillar 1 (kaspa.org/lore '10 blocks per second')", pr="high", notes="The only number C1 carries is 10.", asset="C1", state="C")
cb("CH2", 59.30, 63.60, "receipt", "since the Crescendo hard fork on May 5th, 2025.",
   "C27: the rusty-kaspa v1.0.0 Crescendo release notes, the sentence 'Crescendo is scheduled to activate on mainnet at DAA Score 110,165,000, projected to occur on May 5, 2025' highlighted",
   "https://github.com/kaspanet/rusty-kaspa/releases/tag/v1.0.0 (fallback mirror https://newreleases.io/project/github/kaspanet/rusty-kaspa/release/v1.0.0)",
   pr="high", verify=True, bench="C5 Crescendo rung as a single-rung spotlight card",
   notes="treatment: highlight. Verify the GitHub release page shows the activation sentence; else the mirror.", asset="C27")
cb("CH2", 63.60, 65.54, "chatgpt-image", "El Cinco de Mayo!",
   "IMG-3: the greenish-cyan Kaspa coin wearing a Mexican sombrero, confetti and maracas around it, festive, deep charcoal",
   "ChatGPT: Kaspa coin in a sombrero with confetti, reference kaspa-logo.png", bench="BR cut of a Mexican fiesta street party with confetti",
   notes="MIKE'S RECORDED ASK: party confetti across the screen (comp overlay), a Mexican hat, 1 to 2 s of Mexican music on the line (EDIT-PLAN music/SFX row, in the gap before 'The block reward' at 65.54). The ad-lib stays (Mike 2026-11-04).")
cb("CH2", 65.54, 75.10, "animated-chart", "The block reward does not halve every 4 years. It shrinks a little every single month, a smooth halving, toward the hard cap of around 28.7 billion.",
   "C2 state A: the smooth monthly (1/2)^(1/12) curve stepping down beside a flat 4-year halving staircase, the cap line 28.7B KAS drawing at the top; no pop",
   "DATA.md Pillar 1 (wiki tokenomics; rusty-kaspa coinbase.rs; api.kaspa.org coinsupply max 28,704,035,605)", pr="high",
   notes="A number WE control = our own code-rendered animated chart (charts.md). Label '28.7B KAS', never a dollar sign (the JSON prints $28.7 billion).", asset="C2", state="A")
cb("CH2", 75.10, 78.72, "envato-video", "And the research behind it is older than most of crypto.",
   "BR-7: an old university library, tall shelves, slow dolly (calm)",
   "Envato: old university library bookshelves dolly", bench="container card OLDER THAN MOST OF CRYPTO",
   notes="Calm b-roll; swoosh-3 variant of the headline device.")
cb("CH2", 78.72, 87.18, "receipt", "The GHOST protocol, 2013. Yonatan Sompolinsky and Aviv Zohar, credited by name in the Ethereum whitepaper.",
   "C19: the Ethereum whitepaper 'Modified GHOST Implementation' paragraph, settling push to 'an innovation first introduced by Yonatan Sompolinsky and Aviv Zohar in December 2013', highlight on it; kt-keyword-pop 2013 on '2013' (knock-pop)",
   "https://ethereum.org/en/whitepaper/ (crop to the paragraph)", pr="high", bench="eprint.iacr.org/2013/881 title block",
   notes="treatment: highlight (the line quotes the receipt). R(article).", asset="C19")
cb("CH2", 87.18, 92.26, "container", "GhostDAG, the paper, 2018. DAGKnight, 2022.",
   "research-stack: light card THE RESEARCH with items GHOST 2013 / GHOSTDAG 2018 / DAGKNIGHT 2022 landing on their years (fast-reverse-5 each)",
   "DATA.md T7 (eprint 2013/881, 2018/104, 2022/1494)", bench="C16 starts here", notes="5 s dwell floor met.", asset="research-stack")
cb("CH2", 92.26, 97.30, "receipt", "And the founder is a research associate at Harvard, still publishing in 2026.",
   "C16: the arXiv 2609.12197 title block (Sompolinsky, Newman, Wang, Parkes; Harvard), submitted 2026-09-10, push to the author line",
   "https://arxiv.org/abs/2609.12197", pr="high", bench="Oxford Union video page with the host intro in the description",
   notes="treatment: push. Runs to FACE 4 at 97.30.", asset="C16")
