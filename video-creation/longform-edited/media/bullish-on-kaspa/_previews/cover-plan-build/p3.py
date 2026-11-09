# CH3 (104.28-238.12), first half
cb("CH3", 104.20, 107.86, "envato-video", "Now we get to what ship. June 30th, 2026.",
   "BR-8: a loaded container ship leaving port, slow aerial (literal 'shipped'); the chapter whip lands here",
   "Envato: cargo container ship leaving port aerial", bench="BR of a rocket lift-off",
   notes="Literal-noun b-roll; whip (swoosh-8) into CH3 at 104.28. FACE 4 ends 104.20 (JSON 'mined.' ends 104.22, checked on the audio).")
cb("CH3", 107.86, 111.70, "receipt", "The Toccata hard fork. The Layer 1 became programmable.",
   "C6: rusty-kaspa 'Mainnet Toccata Release - v2.0.0' page, settling push to the activation sentence (DAA 474,165,565, June 30, 2026), highlight; kt-keyword-pop LAYER 1 IS PROGRAMMABLE on 'programmable' (twinkle)",
   "https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0", pr="high", bench="C15 kaspa.org/lore 'Toccata activated on mainnet on June 30, 2026'",
   notes="treatment: highlight.", asset="C6")
cb("CH3", 111.70, 123.50, "timeline", "Covenant, transaction introspection, and zero knowledge verification. Native, on the base layer. 2 days later, July 2nd, the first smart coins went live on mainnet.",
   "C5 OVERVIEW, shown ONCE: the LIGHT animated receipts timeline, every rung greyed; JUN 30 2026 TOCCATA lit with three chips COVENANTS / INTROSPECTION / ZK VERIFICATION lighting on the words; rung JUL 2 FIRST SMART COINS lands on 'July'; chip JULY 2 (cartoon-accent)",
   "DATA.md Pillar 5 table (12 rungs: Crescendo, Igra, Toccata, smart coins, Silverscript, indexer exploit, KCC Final, Nacho opens, reward cut, Jan 1 2027 close, Jan 31 2027 Nacho close, 2027 100 BPS)", pr="high",
   notes="THE BALANCE: the rich timeline appears ONCE as the chapter overview (11.8 s, over the 10 s floor), then breaks into receipts and spotlight cards; never re-shown whole. The JAN 1 2027 rung reads STABLECOIN FUNDRAISER CLOSES, never Kaspa Dollar (Mike).", asset="C5", state="overview")
cb("CH3", 123.50, 127.00, "receipt", "September 9th, Silverscript version 1.0.",
   "C8: the Silverscript v1.0.0 GitHub release page, push to the title and the 'official release' line",
   "https://github.com/kaspanet/silverscript/releases/tag/v1.0.0", pr="high", bench="C5 SEP 9 single-rung card", notes="treatment: push.", asset="C8")
cb("CH3", 127.00, 133.08, "container", "A token that took thousands of lines of raw opcodes, now around 60 readable lines.",
   "silverscript-60-lines: kt-word-by-word light card THOUSANDS OF LINES / NOW / 60 LINES, the payoff big in the accent on '60' (cash-register-2)",
   "DATA.md Pillar 2 (Kaspa Commons 2026-09-10, 'approximately 60 readable lines')", bench="C8 held with a second push",
   notes="A community claim, labelled as such on the card's source line.", asset="silverscript-60-lines")
cb("CH3", 133.08, 135.14, "envato-video", "Bam. Doesn't that make it easy?",
   "BR-9: a sledgehammer strike in slow motion, dust burst (literal 'Bam')",
   "Envato: sledgehammer strike slow motion dust", bench="a gavel slam", notes="Ad-lib stays (Mike 2026-11-04); 2.1 s punctuation.")
cb("CH3", 135.14, 138.80, "envato-video", "September 20th, an outside indexer for the old KRC-20 tokens",
   "BR-10: server room, red warning lights, handheld; kt-lower-third-band AN OUTSIDE INDEXER WAS EXPLOITED. KASPA'S LAYER 1 WAS NOT. (swoosh-4 0.34 s before, knock-pop on the text)",
   "Envato: server room red alert lights handheld", bench="BR-11 covers the whole line",
   notes="The band persists across BR-10 and BR-11, held 4 s then out; house captions OFF under it. WARNING 2 binds the band: never 'Kaspa was hacked'.")
cb("CH3", 138.80, 141.62, "envato-video", "got exploited. But here's the thing,",
   "BR-11: a padlock shackle snapping open, macro",
   "Envato: padlock breaking open macro", bench="BR of a cracked glass screen", notes="Rule #12: a distinct file from BR-10.")
cb("CH3", 141.62, 146.88, "diagram", "Kaspa's Layer 1 was never touched. The flaw was in the bookkeeping outside of the chain.",
   "indexer-vs-l1: LIGHT system-design diagram, the Kaspa Layer 1 box with a shield (UNTOUCHED) and, outside the chain boundary, the OUTSIDE INDEXER box labelled 'bookkeeping, off chain' with the flaw mark on it",
   "DATA.md Pillar 2 (KASPAglobal 2026-10-31: 'the flaw was in the indexer, not in kaspa'; coverage: 'Kaspa's base chain was not compromised')", pr="high",
   notes="Convention 4: a mechanism = a system-design container. Nothing names Kasplex here (OPEN QUESTIONS 17 was scripted without it).", asset="indexer-vs-l1")
cb("CH3", 146.88, 154.26, "receipt", "And the fix was already being built. KCC-20, tokens on the Layer 1 itself. Written in August.",
   "C28: the kaspanet/kccs README (Kaspa Calls for Conventions), push to the KCC-20 'Fungible Token Covenant Specification' row",
   "https://github.com/kaspanet/kccs", pr="high", verify=True, bench="container card KCC-20 · TOKENS ON LAYER 1 ITSELF · WRITTEN IN AUGUST",
   notes="treatment: push. Verify the README table renders with its status column.", asset="C28")
cb("CH3", 154.26, 158.48, "receipt", "October 21st, 2026. It was declared final.",
   "C7: the @kccforum post 'KCC-1, KCC-2 and KCC-20 are now Final', real pixels; kt-keyword-pop FINAL in accent red on 'final' (punch-1-2023, the one red word of the chapter); SHIELD-CHECK icon pops in from the right (swoosh-2)",
   "https://x.com/kccforum/status/2112922357979603258", pr="high", verify=True, bench="C28 held",
   notes="treatment: push. Verify the post is still up at capture; X may need the logged-in profile.", asset="C7")
cb("CH3", 158.48, 166.28, "diagram", "Token rules enforced by Kaspa's own consensus. The rules every node and every miner validates, not an outside indexer.",
   "consensus-validates: LIGHT system-design diagram, the TOKEN RULES (a KCC-20 covenant) inside the L1 CONSENSUS ring, node and miner icons around the ring each with a check, the OUTSIDE INDEXER box crossed out beyond the ring",
   "DATA.md do-not-air row 9 airable wording (KASPAglobal 'a covenant that L1 consensus checks itself'; TokenPost)", pr="high",
   notes="Never 'the miners check the tokens' alone on screen: the ring is the consensus, nodes and miners both validate.", asset="consensus-validates")
