import React from 'react';
import { Composition } from 'remotion';
import { Kaspa40Bps, K40_FPS, K40_DURATION } from './Kaspa40Bps';
import { C1Preview } from './Kaspa40ChartC1';
import { ChartsPreview } from './Kaspa40Charts';
import { Kaspa40Vertical, K40V_FPS, K40V_DURATION } from './Kaspa40Vertical';
import { Kaspa40Short, K40S_DURATION } from './Kaspa40Short';
import { C1VPreview } from './Kaspa40VerticalChartC1';
import { ChartsVPreview } from './Kaspa40VerticalCharts';
import { Zebec, ZEBEC_FPS, ZEBEC_DURATION } from './Zebec';
import { ZebecVertical, ZV_FPS, ZV_DURATION } from './ZebecVertical';
import { CarryTradeFull, CT_FPS, CT_DURATION } from './CarryTradeFull';
import { ClarityTest, CLR_FPS, CLR_DURATION } from './ClarityTest';
import { ClarityVertical, CLRV_FPS, CLRV_DURATION } from './ClarityVertical';
import { CarryTradeVertical, CTV_FPS, CTV_DURATION } from './CarryTradeVertical';
import { NeedLangGraph, NLG_FPS_EXPORT, NLG_DURATION } from './NeedLangGraph';
import { NeedLangGraphVertical, NLGV_FPS_EXPORT, NLGV_DURATION } from './NeedLangGraphVertical';
import { SaveTokens, SAVETOK_FPS_EXPORT, SAVETOK_DURATION } from './SaveTokens';
import { SaveTokensVertical, SAVETOKV_FPS_EXPORT, SAVETOKV_DURATION } from './SaveTokensVertical';
import { LivestreamShort } from './LivestreamShort';
import { CommunityReceipts } from './CommunityReceipts';
import { CR_FPS, CR_DURATION } from './constants-creceipts';
import { CommunityReceiptsImpact } from './CommunityReceiptsImpact';
import { CRI_FPS, CRI_DURATION } from './constants-creceipts-impact';
import { MillionairesAreMade } from './MillionairesAreMade';
import { MAM_FPS, MAM_DURATION } from './constants-mam';
import { RobinhoodFloodgates } from './RobinhoodFloodgates';
import { RHFG_FPS, RHFG_DURATION } from './constants-rhfg';
import { CashcatKing } from './CashcatKing';
import { CCK_FPS, CCK_DURATION } from './constants-cck';
import { NineHood } from './NineHood';
import { N9H_FPS, N9H_DURATION } from './constants-9h';
import { HoodratMattFurie } from './HoodratMattFurie';
import { HR_FPS, HR_DURATION } from './constants-hr';
import { ClarityActCatalyst } from './ClarityActCatalyst';
import { CAC_FPS, CAC_DURATION } from './constants-cac';
import { FloodgatesImpact } from './FloodgatesImpact';
import { FGI_FPS, FGI_DURATION } from './constants-fgi';
import { FourYearCycleReligion } from './FourYearCycleReligion';
import { FYC_FPS, FYC_DURATION } from './constants-fyc';
import { FourYearCycleReligionImpact } from './FourYearCycleReligionImpact';
import { FYCI_FPS, FYCI_DURATION } from './constants-fyci';
import { OctoberWillBeGreen } from './OctoberWillBeGreen';
import { OWBG_FPS, OWBG_DURATION } from './constants-owbg';
import { BitcoinInflationYearFive } from './BitcoinInflationYearFive';
import { BIYF_FPS, BIYF_DURATION } from './constants-biyf';
import { TaoBuyTheDip } from './TaoBuyTheDip';
import { TBTD_FPS, TBTD_DURATION } from './constants-tbtd';
import { TaoRenderVirtuals, TRV_FPS, TRV_DURATION } from './TaoRenderVirtuals';
import { OctoberNotAllowedRed } from './OctoberNotAllowedRed';
import { ONAR_FPS, ONAR_DURATION } from './constants-onar';
import { TradingAgainstOurselves } from './TradingAgainstOurselves';
import { TAO_FPS, TAO_DURATION } from './constants-tao';
import { HateEthBoughtIt } from './HateEthBoughtIt';
import { HETH_FPS, HETH_DURATION } from './constants-heth';
import { LongevityEscapeVelocity } from './LongevityEscapeVelocity';
import { LEV_FPS, LEV_DURATION } from './constants-lev';
import { WhatifCto100xCall } from './WhatifCto100xCall';
import { WCTO_FPS, WCTO_DURATION } from './constants-wcto';
import { RallyBasketNinehoodCashcat } from './RallyBasketNinehoodCashcat';
import { RB_FPS, RB_DURATION } from './constants-rb';
import { WhatifCto100xCallImpact } from './WhatifCto100xCallImpact';
import { WCTI_FPS, WCTI_DURATION } from './constants-wcti';
import { TaoUnder200Impact } from './TaoUnder200Impact';
import { TAOI_FPS, TAOI_DURATION } from './constants-taoi';
import { TaoUnder200LastChance } from './TaoUnder200LastChance';
import { T200_FPS, T200_DURATION } from './constants-tao200';
import { OctoberBottomFrontrunImpact } from './OctoberBottomFrontrunImpact';
import { OBFI_FPS, OBFI_DURATION } from './constants-obfi';
import { OctoberBottomFrontrun } from './OctoberBottomFrontrun';
import { OBFR_FPS, OBFR_DURATION } from './constants-obfr';
import { KaspaOverDollar } from './KaspaOverDollar';
import { K89_FPS, K89_DURATION } from './constants-k89';
import { WhatifPeanut52x } from './WhatifPeanut52x';
import { WHIF_FPS, WHIF_DURATION } from './constants-whatif';
import { WOBF, WOBF_FPS, WOBF_DURATION } from './constants-wobf';
import { TDBTG, TDBTG_FPS, TDBTG_DURATION } from './constants-tdbtg';
import { NBA, NBA_FPS, NBA_DURATION } from './constants-nba';
import { KDK, KDK_FPS, KDK_DURATION } from './constants-kdk';
import { TonGramRename } from './TonGramRename';
import { TGR_FPS, TGR_DURATION } from './constants-tgr';
import { PainStickThrough } from './PainStickThrough';
import { PSP_FPS, PSP_DURATION } from './constants-psp';
import { ZOMB, ZOMB_FPS, ZOMB_DURATION } from './constants-zomb';
import { TransitionDemo, demoDurationFrames } from './TransitionDemo';
import { TransitionTest } from './TransitionTest';
import { WLW_TITLE, WLW_UNICORN, WLW_LAB115X, WLW_KASPA3, WLW_WF, WLW_BOUNTY, WLW_ROTATION, WLW_LABWONT, WLW_KASPAHOLD, WLW_KASPATON, WLW_PENGU, FRAMES } from './wlwData';
import { D353X_SHORT, D353X_MEDIUM, D353X_LONG, D353X_MOONBAG, D353X_SAYLOR, D353X_WARSH, FRAMES as F353X } from './data353x';
import { D_B350_C1, D_B350_C2, D_B350_C3, D_B350_C4, D_B350_C5, D_B350_C6, D_B350_C7, D_B350_C8, FRAMES_B350 } from './dataBest350x';
import { D_ZC_1, D_ZC_2, D_ZC_3, D_ZC_4, D_ZC_5, D_ZC_6, D_ZC_7, D_ZC_8, FRAMES_ZC } from './dataZombie';
import { D_DIL_1, D_DIL_2, D_DIL_3, FRAMES_DIL } from './dataDilemma';
import { D_WCG_1, D_WCG_2, FRAMES_WCG } from './dataWcg';
import { D_UH_1, D_UH_2, D_UH_3, D_UH_4, D_UH_5, D_UH_6, FRAMES_UH } from './dataUhoh';
import { D_MM_1, D_MM_2, D_MM_3, FRAMES_MM } from './dataMarketMeltdown';
import { D_TIGR_1, D_TIGR_2, D_TIGR_3, FRAMES_TIGR } from './dataTigr';
import { D_BC_TAO, D_BC_LAB, D_BC_AI, D_BC_LINEA, FRAMES_BC } from './dataBestCoin';
import { D_KC_COVENANTS, D_KC_FIRST, D_KC_ELIZA, D_KC_KRC20, FRAMES_KC } from './dataKaspaChanges';
import { D_BCM_LEARN, D_BCM_BREAKAGE, D_BCM_TAO, D_BCM_BTC200, D_BCM_WHALES, D_BCM_SHITCOIN, D_BCM_STOPWAIT, D_BCM_1992, FRAMES_BCM } from './dataBetterCoins';
// batch: what-if-1000x, clip #7 "100x From Here (Impact Cut)"
import { D_WI7, WI7_FPS, WI7_FRAMES } from './constants-wi7';
// batch: peach-minute, clip #3 "Three Out of Ten Kaspa Comments Are Negative Now"
import { KaspaHateBottomSignal } from './KaspaHateBottomSignal';
import { PM3_DURATION, PM3_FPS } from './constants-pm3';
// batch: peach-minute, clip #5 "Housecoin Just Got Delisted. I Want My 1000x."
import { HousecoinStillHolding } from './HousecoinStillHolding';
import { HSC_DURATION, HSC_FPS } from './constants-hsc';
import { EthereumRwa, DUR as ETH_DUR, FPS as ETH_FPS } from './EthereumRwa';
// batch: what-if-1000x, clip #1 "$1,000 Into 10 Coins: The Real 1000x Math"
import { TenCoins1000xMath } from './TenCoins1000xMath';
import { TC_DURATION, TC_FPS } from './constants-tc';
// batch what-if-1000x / clip #2
import { WhatifBiggerThanBrett } from './WhatifBiggerThanBrett';
import { W1BB_FPS, W1BB_DURATION } from './constants-w1bb';
// batch: what-if-1000x, clip #4 "We Estimated 20x. LAB Did 353x."
import { LabCalled20xDid353x } from './LabCalled20xDid353x';
import { L353_DURATION, L353_FPS } from './constants-lab353';
// batch: what-if-1000x, clip #3 "The October Bottom Defeats Itself"
import { D_OBSD, OBSD_FPS, OBSD_FRAMES } from './constants-obsd';
// batch: what-if-1000x, clip #5 "What If Could Be the Next Dogecoin"
import { WhatifNextDogecoin } from './WhatifNextDogecoin';
import { WND_DURATION, WND_FPS } from './constants-wnd';
// batch: what-if-1000x, clip #6 "Five Lose. One Does 1000x." (impact cut)
import { MathLadderImpact } from './MathLadderImpact';
import { MLI_DURATION, MLI_FPS } from './constants-mli';
// batch: october-bottom, clip #1 "The October Bottom Is a Mandela Effect"
import { OctoberMandelaMyth } from './OctoberMandelaMyth';
import { D_WOD, WOD_FPS, WOD_FRAMES } from './constants-wod';
import { OMM_DURATION, OMM_FPS } from './constants-omm';
// batch: october-bottom, clip #2 "Kaspa Under 2.6 Cents: That Is When I Bought More"
import { D_KDBM, KDBM_FPS, KDBM_FRAMES } from './constants-kdbm';
import { D_ROF, ROF_FPS, ROF_FRAMES } from './constants-rof';
// batch: october-bottom, clip #5 "Cooper: The Real Robinhood Office Dog at 237k"
import { D_CRD, CRD_FPS, CRD_FRAMES } from './constants-crd';
// batch: october-bottom, clip #7 "OMG: Kaspa Dipped Under 2.6 Cents" (impact cut)
import { D_KDI, KDI_FPS, KDI_FRAMES } from './constants-kdi';
import { PythonEp01, DUR as PY01_DUR, FPS as PY01_FPS } from './PythonEp01';
import { PythonEp01Vertical, DUR as PY01V_DUR, FPS as PY01V_FPS } from './PythonEp01Vertical';
// batch: eliza, clip #3 "We're Trading Against Ourselves" (variant: full).
// ⚠ NOT `TradingAgainstOurselves` above — that is the clarity-act clip #2 from July 20 (published).
// Pure slug collision on two different livestreams; this one is the ETAO-prefixed eliza clip.
import { ElizaTradingAgainstOurselves } from './ElizaTradingAgainstOurselves';
import { ETAO_FPS, ETAO_DURATION } from './constants-eliza-tao';
// batch: eliza, clip #2 "I Raced the Hacker Draining My Own Wallet" (variant: full).
// Eliza-prefixed for the same reason as clip #3: this batch's slugs collide with earlier batches'.
import { ElizaPhantomHack } from './ElizaPhantomHack';
import { EPH_FPS, EPH_DURATION } from './constants-eliza-phantom';
// batch: early-crash, clip #1 "Here's why Robinhood chain tokens will pass 6 billion." (variant: full).
// `Ec`-prefixed because remotion/src is a FLAT cross-batch namespace and slugs recur between batches.
import { EcAkita3bRobinhood } from './EcAkita3bRobinhood';
import { EC_AKA_FPS, EC_AKA_DURATION } from './constants-ec-akita-3b-robinhood';
// batch: early-crash, clip #4 "Robinhood Alert: Tendies Is Exactly What Vlad Wants to List" (full).
// Same `Ec` prefix reason as clip #1; every asset of this clip is `*-ec-tfs-*` so the five parallel
// builders of this batch cannot collide in the shared render-assets/ public dir.
import { EcTendiesFunnyStupid } from './EcTendiesFunnyStupid';
import { EC_TFS_FPS, EC_TFS_DURATION } from './constants-ec-tendies-funny-stupid';
// batch: early-crash, clip #3 "What $IF to a 10 billion market cap" (variant: full). Mike's exact 4b
// title, $IF spelling deliberate. Same `Ec` prefix reason as clips #1/#4; every asset of this clip is
// `*-ec-wom-*` / `thumb-ecwom` so the parallel builders cannot collide in the shared render-assets/.
import { EcWayOffMoonCalls } from './EcWayOffMoonCalls';
import { WOM_FPS, WOM_DURATION } from './constants-ec-way-off-moon-calls';
// batch: early-crash, clip #5 "Meme Coin Truth: You'll Be Lucky You Endured the Pain" (variant: full).
// Mike's exact 4b title, the "Meme Coin Truth: " prepend is his. Same `Ec` prefix reason as clips
// #1/#3/#4; every asset of this clip is `*-ec-etp-*` so the parallel builders cannot collide in the
// shared render-assets/ public dir.
import { EcEndureThePain } from './EcEndureThePain';
import { EC_ETP_FPS, EC_ETP_DURATION } from './constants-ec-endure-the-pain';
// batch: early-crash, clip #6 "Watch This: $3 Billion. A Freaking Inu." (variant: IMPACT). Mike's
// exact 4b title. This is the IMPACT cut of clip #1 above and shares the batch public dir with it, so
// it is deliberately named `EcAkitaImpact` (never `EcAkita3bRobinhood*`) and every asset it owns is
// `*-ec-aki-*` / `thumb-ecaki` prefixed - clip #1's `*-ec-aka-*` / `thumb-eca` are never referenced.
import { EcAkitaImpact } from './EcAkitaImpact';
import { EC_AKI_FPS, EC_AKI_DURATION } from './constants-ec-akita-impact';
// batch: tutorial, clip #6 "Look, Look, Holy Crap: The 94X, Then a 550X One Week Later" (variant:
// IMPACT). This is the IMPACT cut of clip #1 (`tut-94x-euphoria`, built concurrently) and shares the
// batch public dir with it, so every asset it owns is `*-tut6*` / `thumb-tut6` prefixed and clip #1's
// assets are never referenced here.
import { TutEuphoriaImpact } from './TutEuphoriaImpact';
import { TUT6_FPS, TUT6_DURATION } from './constants-tut-euphoria-impact';

// batch: tutorial, clip #3 "Binance Wants Community Driven Coins. Kaspa Isn't Listed." (variant:
// FULL). Clip #7 (`binance-kaspa-catch22-impact`, built concurrently) is the IMPACT cut of the same
// material and shares the batch public dir, so every asset clip #3 owns is `broll-tut-bkc-*` /
// `thumb-tutbkc` prefixed and clip #7's assets are never referenced here.
import { TutBinanceKaspaCatch22 } from './TutBinanceKaspaCatch22';
import { TUT_BKC_FPS, TUT_BKC_DURATION } from './constants-tut-binance-kaspa-catch22';
// batch: tutorial, clip #1 "94X on $TUT, and It's Pumping Again" (variant: FULL). Clip #6
// (`tut-94x-euphoria-impact`, built concurrently) is the IMPACT cut of the same material and shares
// the batch public dir, so every asset clip #1 owns is `broll-tut94x-*` / `thumb-tut94x-*` keyed and
// clip #6's assets are never referenced here.
import { TutTut94xEuphoria } from './TutTut94xEuphoria';
import { TUT94X_FPS, TUT94X_DURATION } from './constants-tut-94x-euphoria';
// batch: tutorial, clip #2 "My Robinhood Chain Meme Rankings: $IF, Cooper, Tendies, Yolo" (variant:
// FULL, the longest clip in the batch). Seven sibling clips share the batch public dir, so every asset
// clip #2 owns is `broll-tut-rhm-*` / `thumb-tutrhm` prefixed and clip #1's `broll-tut94x-*` /
// `thumb-tut94x-*`, clip #3's `broll-tut-bkc-*` / `thumb-tutbkc` and clip #6's `broll-tut6-*` /
// `thumb-tut6` are never referenced here.
import { TutRobinhoodMemeRankings } from './TutRobinhoodMemeRankings';
import { TUT_RHM_FPS, TUT_RHM_DURATION } from './constants-tut-robinhood-meme-rankings';
// batch: tutorial, clip #4 "That's the Degen Mindset. I Don't Trade Like That." (variant: FULL).
// Clip #8 (`freaking-early-not-degen-impact`) is a subset of this clip's second segment and shares the
// batch public dir, so every asset clip #4 owns is `broll-tut-fed-*` / `thumb-tutfed` prefixed and
// clip #1's `broll-tut94x-*` / `thumb-tut94x-*`, clip #2's `broll-tut-rhm-*` / `thumb-tutrhm`,
// clip #3's `broll-tut-bkc-*` / `thumb-tutbkc` and clip #6's `broll-tut6-*` / `thumb-tut6` are never
// referenced here.
import { TutFreakingEarlyNotDegen } from './TutFreakingEarlyNotDegen';
import { TUT_FED_FPS, TUT_FED_DURATION } from './constants-tut-freaking-early-not-degen';
// batch: tutorial, clip #7 "They Don't Apply the Same Logic to Kaspa" (variant: IMPACT). This is the
// IMPACT cut of clip #3 above (`binance-kaspa-catch22`) and a strict SUBSET of its audio, built
// separately and sharing the batch public dir, so every asset it owns is `broll-tut-bki-*` /
// `thumb-tutbki` prefixed and clip #3's `broll-tut-bkc-ov-*` / `thumb-tutbkc` are never referenced
// here (nor are clip 1's `broll-tut94x-*`, clip 2's `broll-tut-rhm-*`, clip 4's `broll-tut-fed-*`,
// clip 5's `broll-tut-dgn-*` or clip 6's `broll-tut6-*` / `tail-tut6-hold.png`).
import { TutBinanceKaspaCatch22Impact } from './TutBinanceKaspaCatch22Impact';
import { TUT_BKI_FPS, TUT_BKI_DURATION } from './constants-tut-bkc-impact';
// batch: tutorial, clip #8 "freaking-early-not-degen-impact" (variant: IMPACT, 20.12 s). The IMPACT cut
// of clip #4's payoff, SHARING clip #4's audio. Deliberately named `TutFreakingEarlyNotDegenImpact`
// (never a bare `FreakingEarly*`) and every asset it owns is `broll-tut-fei-*` / `thumb-tutfei`, so
// clip #4's `broll-tut-fed-*` / `thumb-tutfed`, clip #1's `broll-tut94x-*`, clip #2's
// `broll-tut-rhm-*`, clip #3's `broll-tut-bkc-*`, clip #5's `broll-tut-dgn-*`, clip #6's
// `broll-tut6-*` / `tail-tut6-hold` and clip #7's `broll-tut-bki-*` are never referenced here.
import { TutFreakingEarlyNotDegenImpact } from './TutFreakingEarlyNotDegenImpact';
import { TUT_FEI_FPS, TUT_FEI_DURATION } from './constants-tut-fed-impact';
// batch: tutorial, clip #5 "doginme at 107 Million: 400 Million Is a 100X From Here" (variant: FULL,
// the stream's closing crescendo). Seven sibling clips share the batch public dir, so every asset
// clip #5 owns is `broll-tut-dgn-*` / `thumb-tutdgn` prefixed and clip #1's `broll-tut94x-*` /
// `thumb-tut94x-*`, clip #2's `broll-tut-rhm-*` / `thumb-tutrhm`, clip #3's `broll-tut-bkc-*` /
// `thumb-tutbkc`, clip #4's `broll-tut-fed-*` / `thumb-tutfed` and clip #6's `broll-tut6-*` /
// `thumb-tut6` / `tail-tut6-hold` are never referenced here. NOTE its slug is VESTIGIAL: the `if-500x`
// tail was deleted at 4b, so nothing this comp draws references $IF / What If / a 500X.
import { TutDoginme100x } from './TutDoginme100x';
import { TUT_DGN_FPS, TUT_DGN_DURATION } from './constants-tut-doginme-100x';
// batch: last-year, clip #2 "I Estimated a 20X on LAB. We Did a 353X." (variant: FULL, 71.36 s spine
// @25, comp runs 30 fps). Four sibling clips share the batch public dir, so every asset this clip
// owns is `broll-ly-lab-*` / `thumb-ly-lab353` prefixed. NOT the same comp as `LabCalled20xDid353x`
// (what-if-1000x clip #4, a different livestream shipped 2026-08-03) - do not merge or overwrite it.
import { LastYearLab353xUnderestimate } from './LastYearLab353xUnderestimate';
import { LY_LAB_FPS, LY_LAB_DURATION } from './constants-last-year-lab-353x';
// batch: last-year, clip #3 "The Robinhood CEO's Dog Is Now a Coin" (variant: FULL, 87.52 s spine
// @25, comp runs 30 fps). Four sibling clips share the batch public dir, so every asset this clip
// owns is `broll-lyk-*` / `thumb-lyk` prefixed. New comp id, no prior `*KitsuVladsDog*` existed in
// src/ or in this file (checked before authoring).
import { LastYearKitsuVladsDog } from './LastYearKitsuVladsDog';
import { LYK_FPS, LYK_DURATION } from './constants-last-year-kitsu-vlads-dog';
// batch: last-year, clip #1 "They Called These Coins Dead. We're at a 130X." (variant: FULL,
// 86.337 s spine @25, comp runs 30 fps). Four sibling clips share the batch public dir, so every
// asset this clip owns is `broll-mfx-*` / `thumb-mfx` prefixed. New comp id: nothing matching
// `*MemeFud*` or `*130x*` existed in src/ or in this file before it was authored (checked).
import { LastYearMemeFud130x } from './LastYearMemeFud130x';
import { MFX_FPS, MFX_DURATION } from './constants-last-year-meme-fud-130x';
// batch: last-year, clip #4 "Kaspa's going down" (variant: FULL, 67.06 s spine @25, comp runs
// 30 fps). Four sibling clips share the batch public dir, so every asset this clip owns is
// `broll-lykx-*` / `thumb-lykx` prefixed. New comp id: nothing matching `*KaspaExcavator*` or
// `*Excavator*` existed in src/ or in this file before it was authored (checked).
import { LastYearKaspaExcavator } from './LastYearKaspaExcavator';
import { KEX_FPS, KEX_DURATION } from './constants-last-year-kaspa-excavator';
// batch: johnny, clip #1 "I Pushed The Button That Crashes The Market" (variant: FULL, 62.80 s
// spine @25, comp runs 30 fps). Two sibling clips share the batch public dir, so every asset this
// clip owns is `broll-jcb-*` / `thumb-jcb` prefixed. New comp id: nothing matching `*Johnny*`,
// `*CashButton*` or `*Jcb*` existed in src/ or in this file before it was authored (checked).
// ⛔ Carries the copyrighted Johnny Cash recording at 40.35-59.75 s BY MIKE'S EXPLICIT ORDER
// (clip-plan.json -> four_b_verdicts.build_directives `protect-johnny-cash-music`, applies_to [1]).
import { JohnnyCashButton } from './JohnnyCashButton';
import { JCB_FPS, JCB_DURATION } from './constants-johnny-cash-button';
// batch: johnny, clip #2 "Why Some Meme Coins Pump" (variant: FULL, 55.331 s spine @25, comp runs
// 30 fps). Two sibling clips share the batch public dir, so every asset this clip owns is
// `broll-jdvp-*` / `thumb-jdvp-*` prefixed. New comp id: nothing matching `*DuckVsPeanut*`,
// `*Duck*` or `*Jdvp*` existed in src/ or in this file before it was authored (checked).
import { JohnnyDuckVsPeanut } from './JohnnyDuckVsPeanut';
import { JDVP_FPS, JDVP_DURATION } from './constants-johnny-duck-vs-peanut';
// batch: cooper-50x, clip #7 "Economic Expansion Before the Bull Run Even Starts" (variant: IMPACT,
// 13.12 s spine @25, comp runs 30 fps). Five sibling clips share the batch public dir, so every
// asset this clip owns is `broll-c50x-p7-*` / `thumb-c50x-p7-*` prefixed. New comp id: nothing
// matching `*Cooper50x*`, `*PmiNeverBefore*`, `*Pmi*` or `*C50P7*` existed in src/ or in this file
// before it was authored (checked with ls + grep on 2026-08-15).
import { Cooper50xPmiNeverBefore } from './Cooper50xPmiNeverBefore';
import { C50P7_FPS, C50P7_DURATION } from './constants-c50x-pmi-never-before';
// batch: cooper-50x, clip #2 "The Community Refused to Give Up on Cooper" (variant: IMPACT,
// 22.680 s spine @25, comp runs 30 fps). Five sibling clips share the batch public dir, so every
// asset this clip owns is `broll-ccr-*` / `thumb-ccr-*` prefixed. New comp id: nothing matching
// `*C50xCommunityRefused*`, `*CommunityRefused*`, `*Ccr*` or `*C50x*` (other than clip #7's
// `Cooper50xPmiNeverBefore`) existed in src/ or in this file before it was authored (checked with
// ls + grep on 2026-08-15). NOTE the distinct, older `CooperRobinhoodRealDog` comp is the
// october-bottom batch's clip #5 and is never touched here.
import { C50xCommunityRefused } from './C50xCommunityRefused';
import { CCR_FPS, CCR_FRAMES } from './constants-c50x-community-refused';
// batch: cooper-50x, clip #8 "Wait, There Are TWO Billies and Both Are Down 98%" (variant: FULL,
// 67.360 s spine @25, comp runs 30 fps). Five sibling clips share the batch public dir, so every
// asset this clip owns is `broll-c50x-tb-*` / `thumb-c50x-tb.png` prefixed. New comp id: nothing
// matching `*TwoBillies*`, `*Billies*`, `*C50TB*` or `*C50xTwoBillies*` existed in src/ or in this
// file before it was authored (checked with ls + grep on 2026-08-15); the batch's other two
// registered comps are clip #7 `Cooper50xPmiNeverBefore` and clip #2 `C50xCommunityRefused`, and
// neither is touched here.
import { C50xTwoBillies } from './C50xTwoBillies';
import { C50TB_FPS, C50TB_FRAMES } from './constants-c50x-two-billies';
// batch: cooper-50x, clip #6 "This Has Never Happened Before in the Entirety of Crypto" (variant:
// FULL, 54.28 s spine @25, comp runs 30 fps). Five sibling clips share the batch public dir, so
// every asset this clip owns is `broll-c50x-p6-*` / `thumb-c50x-p6-*` prefixed. New comp id:
// nothing matching `*PmiExpansionFirst*`, `*ExpansionFirst*` or `*C50P6*` existed in src/ or in
// this file before it was authored (checked with ls + grep on 2026-08-15); the batch's other
// registered comps are `Cooper50xPmiNeverBefore` (#7), `C50xCommunityRefused` (#2) and
// `C50xTwoBillies` (#8), and none of them is touched here. Clip #7 is the IMPACT cut of the same
// livestream moment, so this clip's cover wording and all six of its images are deliberately
// different from that sibling's.
import { Cooper50xPmiExpansionFirst } from './Cooper50xPmiExpansionFirst';
import { C50P6_FPS, C50P6_DURATION } from './constants-c50x-pmi-expansion-first';
// batch: cooper-50x, clip #3 "Everybody Called It a Rug. It Just Made a New All Time High."
// (variant: FULL, 108.440 s spine @25, comp runs 30 fps - the longest clip in the batch). Five
// sibling clips share the batch public dir, so every asset this clip owns is `broll-trg-*` /
// `thumb-trg.png` prefixed. New comp id: nothing matching `*TutRugToAth*`, `*C50xTutRugToAth*`,
// `*TutRug*` or `constants-c50x-tut-rug-to-ath*` existed in src/ or in this file before it was
// authored (checked with ls + grep on 2026-08-15); the batch's other registered comps are
// `Cooper50xPmiNeverBefore` (#7), `C50xCommunityRefused` (#2), `C50xTwoBillies` (#8) and
// `Cooper50xPmiExpansionFirst` (#6), and none of them is touched here.
import { C50xTutRugToAth } from './C50xTutRugToAth';
import { TRG_FPS, TRG_DURATION } from './constants-c50x-tut-rug-to-ath';
// batch: btc-next-week, clip #4 "Kitsu And Cooper Could Both Go A Thousand X" (variant: IMPACT,
// 19.534 s spine @25, comp runs 30 fps). Seven sibling clips share the batch public dir, so every
// asset this clip owns is `broll-btcnw-c4-*` / `thumb-btcnw-c4-*` prefixed. New comp id: nothing
// matching `*Btcnw*`, `*DogOnRobinhood*`, `*btc-next-week*` or `captionsBtcnw*` existed in src/ or
// in this file before it was authored (checked with ls + grep on 2026-08-17); no other clip of this
// batch is registered yet, and nothing here is touched. Clip #3 (`dog-on-robinhood-full`) is the
// FULL cut of the same topic, so when it is built its assets must stay distinct from these.
import { BtcnwDogOnRobinhoodImpact } from './BtcnwDogOnRobinhoodImpact';
import { DOG4_FPS, DOG4_DURATION } from './constants-btcnw-dog-on-robinhood-impact';
// batch: btc-next-week, clip #2 "What If Is One Of The Greatest Memes Ever" (variant: IMPACT,
// 21.439 s spine @25, comp runs 30 fps). New comp id: nothing matching `*WhatIfGreatest*`,
// `*BtcnwWhatIf*`, `constants-btcnw-what-if*` or `captionsBtcnwWhatIf*` existed in src/ or in this
// file before it was authored (checked with ls + grep on 2026-08-17); the only sibling of this batch
// registered so far is `BtcnwDogOnRobinhoodImpact` (#4) and nothing there is touched. Clip #1
// (`what-if-greatest-meme-full`) is the FULL cut of the same topic and its first segment is this
// exact audio, so its assets must stay distinct from the `broll-btcnw-c2-*` / `thumb-btcnw-c2-*`
// files this clip owns.
import { BtcnwWhatIfGreatestMemeImpact } from './BtcnwWhatIfGreatestMemeImpact';
import { WI2_FPS, WI2_DURATION } from './constants-btcnw-what-if-greatest-meme-impact';
// batch: btc-next-week, clip #1 "What If Is One Of The Greatest Memes Ever To Exist" (variant: FULL,
// 86.574 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `*WhatIfGreatestMemeFull*`, `constants-btcnw-what-if-greatest-meme-full*` or
// `captionsBtcnwWhatIf1*` existed in src/ or in this file before it was authored (checked with ls +
// grep on 2026-08-17); the batch's siblings registered so far are `BtcnwDogOnRobinhoodImpact` (#4)
// and `BtcnwWhatIfGreatestMemeImpact` (#2), and neither is touched here. Clip #2 is the IMPACT cut
// of the SAME topic (its audio is this clip's first segment), so this comp's assets are all
// `broll-btcnw-c1-*` / `thumb-btcnw-c1-*` and share no file or prompt with the `*-c2-*` set.
import { BtcnwWhatIfGreatestMemeFull } from './BtcnwWhatIfGreatestMemeFull';
import { WIF1_FPS, WIF1_DURATION } from './constants-btcnw-what-if-greatest-meme-full';
// batch: cooper-cheerleaders, clip #3 "They Spent Months Building A Fake Company Just To Scam
// Everybody" (variant: FULL, 80.175 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `*CcFake*`, `*FakeSoftware*`, `*scam*`, `constants-cc-fake-*` or `*ccfake*` existed in src/ or in
// this file before it was authored (checked with ls + grep on 2026-08-18). The similarly-named
// `Cooper50xPmiExpansionFirst` / `Cooper50xPmiNeverBefore` belong to the DIFFERENT batch
// `cooper-50x` and are not touched here; every asset this clip owns is `broll-ccfake-*` /
// `thumb-ccfake-*` prefixed.
import { CcFakeSoftwareCompanyScam } from './CcFakeSoftwareCompanyScam';
import { CCF3_FPS, CCF3_DURATION } from './constants-cc-fake-software-company-scam';

// batch: cooper-cheerleaders, clip #6 "Kaspa's Tech Can't Be Beaten. It's Light Years Ahead"
// (variant: IMPACT, 21.000 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `*Ccheer*`, `*MoreThan5x*`, `*Kaspa5x*`, `constants-cooper-cheerleaders-*` or
// `captionsCcheer*` existed in src/ or in this file before it was authored (checked with ls + grep
// on 2026-08-18). The similarly-named `Cooper50xPmiExpansionFirst` / `Cooper50xPmiNeverBefore`
// belong to the DIFFERENT batch `cooper-50x` and are not touched here, and neither is this batch's
// sibling `CcFakeSoftwareCompanyScam` (#3). Clip #2 `kaspa-more-than-5x-full` is the FULL cut of
// this same payoff and is built in parallel, so every asset this clip owns is `broll-cc-c6-*` /
// `thumb-cc-c6-*` prefixed and shares no file or prompt with it.
import { CcheerKaspaMoreThan5xImpact } from './CcheerKaspaMoreThan5xImpact';
import { CC6_FPS, CC6_DURATION } from './constants-cooper-cheerleaders-kaspa-more-than-5x-impact';

// batch: cooper-cheerleaders, clip #2 "Kaspa Is Going To Do A Hell Of A Lot More Than 5x"
// (variant: FULL, 79.200 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `*CcheerKaspaMoreThan5xFull*`, `*Kaspa5xFull*`, `constants-cooper-cheerleaders-*-full` or
// `captionsCcheerKaspa5xFull` existed in src/ or in this file before it was authored (checked with
// ls + grep on 2026-08-18). Clip #6 `CcheerKaspaMoreThan5xImpact` above is the IMPACT cut of this
// SAME topic and is deliberately left untouched; every asset this clip owns is `broll-cch-c2-*` /
// `thumb-cch-c2-*` / `overlay-cch-c2-*` prefixed and shares no file or prompt with it. The
// similarly-named `Cooper50xPmi*` comps belong to the DIFFERENT batch `cooper-50x`.
import { CcheerKaspaMoreThan5xFull } from './CcheerKaspaMoreThan5xFull';
import { KM5F_FPS, KM5F_DURATION } from './constants-cooper-cheerleaders-kaspa-more-than-5x-full';

// batch: cooper-cheerleaders, clip #5 "The $30 Wallet Beat The $50 Wallet" (variant: FULL,
// 69.739 s spine @25, comp runs 30 fps). New comp id: nothing matching `*CcheerThirtyDollarWallet*`,
// `*ThirtyDollar*`, `*thirty*`, `*wallet*`, `constants-ccheer-thirty-*` or `captionsCcheerThirty*`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-08-18).
// Every asset this clip owns is `broll-cc5-*` / `thumb-cc5-*` prefixed and is shared with no sibling.
import { CcheerThirtyDollarWallet } from './CcheerThirtyDollarWallet';
import { CC5_FPS, CC5_DURATION } from './constants-ccheer-thirty-dollar-wallet';

// batch: cooper-cheerleaders, clip #1 "There Has To Be A Dog On Robinhood, And If It's Cooper We're
// Rich" (variant: FULL, 43.320 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `*CchDogOnRobinhoodFull*`, `*CchDog*`, `constants-cch-*` or `*dog-on-robinhood-full*` existed in
// src/ or in this file before it was authored (checked with ls + grep on 2026-08-18). The
// similarly-named `BtcnwDogOnRobinhoodImpact` belongs to the DIFFERENT, already-shipped batch
// `btc-next-week` and is deliberately NOT touched or re-registered here - only the slug rhymes.
// Every asset this clip owns is `broll-cch-c1-*` / `thumb-cch-c1-*` prefixed and is shared with no
// sibling in this batch (clip #6 `CcheerKaspaMoreThan5xImpact` was building in parallel).
import { CchDogOnRobinhoodFull } from './CchDogOnRobinhoodFull';
import { CCH1_FPS, CCH1_DURATION } from './constants-cch-dog-on-robinhood-full';

// batch: cooper-cheerleaders, clip #4 "Kaspa Is A Steak 🥩" (variant: FULL, 99.765 s spine @25,
// comp runs 30 fps). New comp id: nothing matching `*CcheerKaspaSteakDca*`, `*KaspaSteak*`, `*steak*`,
// `*ck4*`, `constants-ccheer-kaspa-steak-*` or `captionsCcheerKaspaSteak*` existed in src/ or in this
// file before it was authored (checked with ls + grep on 2026-08-18). The sibling Kaspa comps
// `CcheerKaspaMoreThan5xFull` (#2) and `CcheerKaspaMoreThan5xImpact` (#6) are a DIFFERENT topic cut
// from the same livestream and are deliberately NOT touched, re-registered, or shared with. Every
// asset this clip owns is `broll-ck4-*` / `thumb-ck4-*` prefixed and is shared with no sibling.
import { CcheerKaspaSteakDca } from './CcheerKaspaSteakDca';
import { KSTK_FPS, KSTK_DURATION } from './constants-ccheer-kaspa-steak-dca';

// batch: back-in-ny, clip #4 "CEX's Still Matter...Apparently" (variant: IMPACT, 19.36 s spine @25,
// comp runs 30 fps). New comp id: nothing matching `*BackInNy*`, `*27Million*`, `*bny*`,
// `constants-back-in-ny-*` or `captionsBackInNy*` existed in src/ or in this file before it was
// authored (checked with ls + grep on 2026-08-25). Its batch siblings clip #1
// (`sold-cooper-rest-stop`) and clip #5 (`bots-back-to-life`) were building IN PARALLEL and are
// deliberately NOT touched, re-registered or shared with. Every asset this clip owns is
// `broll-bny-c4-*` / `thumb-bny-c4-*` prefixed and is shared with no sibling.
import { BackInNyEverythingAt27MillionImpact } from './BackInNyEverythingAt27MillionImpact';
import { BNY4_FPS, BNY4_DURATION } from './constants-back-in-ny-everything-at-27-million-impact';

// batch: back-in-ny, clip #1 "I pulled into a rest stop and sold the whole bag" (variant: FULL,
// 103.680 s spine @25, comp runs 30 fps). New comp id: nothing matching `*BackInNySoldCooper*`,
// `*SoldCooper*`, `*RestStop*`, `*bny1*`, `constants-back-in-ny-sold-cooper-*` or
// `captionsBackInNySoldCooper*` existed in src/ or in this file before it was authored (checked with
// ls + grep on 2026-08-25). Its batch siblings clip #4 (`everything-at-27-million-impact`, already
// registered above) and clip #5 (`bots-back-to-life`) were building IN PARALLEL and are deliberately
// NOT touched, re-registered or shared with. Every asset this clip owns is `broll-bny1-*` /
// `thumb-bny1-*` prefixed and is shared with no sibling.
import { BackInNySoldCooperRestStop } from './BackInNySoldCooperRestStop';
import { BNY1_FPS, BNY1_DURATION } from './constants-back-in-ny-sold-cooper-rest-stop';

// batch: back-in-ny, clip #5 "FIRE: My Bots Call The Best Cryptos!" (variant: FULL, 56.040 s spine
// @25, comp runs 30 fps). New comp id: nothing matching `*BotsBack*`, `*BackInNyBots*`, `*bny5*`,
// `constants-back-in-ny-bots-*` or `captionsBackInNyBots*` existed in src/ or in this file before it
// was authored (checked with ls + grep on 2026-08-25). Its batch siblings clip #4
// (`everything-at-27-million-impact`) and clip #1 (`sold-cooper-rest-stop`), both registered above,
// were building IN PARALLEL and are deliberately NOT touched, re-registered or shared with. Every
// asset this clip owns is `broll-c5-*` / `thumb-c5-*` prefixed and is shared with no sibling.
import { BackInNyBotsBackToLife } from './BackInNyBotsBackToLife';
import { BNY5_FPS, BNY5_DURATION } from './constants-back-in-ny-bots-back-to-life';

// batch: everything-will-pump, clip #7 "That 'Rug' Just Did a Freaking 130x" (variant: IMPACT,
// 18.743 s spine @25, comp runs 30 fps). New comp id: nothing matching `*Ewp*`, `*EWP*`,
// `*DeadMemes*`, `*dead-memes-*`, `constants-everything-will-pump-*` or `captionsEwp*` existed in
// src/ or in this file before it was authored (checked with ls + grep on 2026-08-27). Its batch
// siblings (clips 1-6 and 8) were building IN PARALLEL and are deliberately NOT touched,
// re-registered or shared with. Every asset this clip owns is `broll-ewp-c7-*` / `thumb-ewp-c7-*`
// prefixed and is shared with no sibling.
import { EwpDeadMemesComebackImpact } from './EwpDeadMemesComebackImpact';
import { EWP7_FPS, EWP7_DURATION } from './constants-everything-will-pump-dead-memes-comeback-impact';

// batch: everything-will-pump, clip #1 "October Is a Transfer of Wealth: From the Zombies to Us"
// (variant: FULL, 115.24 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `EwpOctoberZombies*`, `*OctoberZombies*`,
// `constants-everything-will-pump-october-zombies-wealth-transfer` or `captionsEwpOctoberZombies*`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-08-27).
// Its batch siblings (clips 2-8) were building IN PARALLEL and are deliberately NOT touched,
// re-registered or shared with - including clip #6 `october-zombies-impact`, which is cut from the
// SAME livestream moment as this clip's tail. Every asset this clip owns is `broll-ewp1-*` /
// `thumb-ewp1-*` prefixed and is shared with no sibling.
import { EwpOctoberZombiesWealthTransfer } from './EwpOctoberZombiesWealthTransfer';
import { EWP1_FPS, EWP1_DURATION } from './constants-everything-will-pump-october-zombies-wealth-transfer';

// batch: everything-will-pump, clip #8 "When Kaspa Explodes, Even Dead Memes Come Back"
// (variant: IMPACT, 20.68 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `EwpKaspaRealExplosion*`, `*KaspaRealExplosion*`,
// `constants-everything-will-pump-kaspa-real-explosion-impact` or `captionsEwpKaspaExplosion*`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-08-27).
// Its batch siblings (clips 1-7) were building IN PARALLEL and are deliberately NOT touched,
// re-registered or shared with - including clip #3 `kaspa-real-explosion`, the FULL variant cut
// from the SAME livestream moments as this impact cut. Every asset this clip owns is
// `broll-ewp-c8-*` / `thumb-ewp-c8-*` prefixed and is shared with no sibling.
import { EwpKaspaRealExplosionImpact } from './EwpKaspaRealExplosionImpact';
import { EWP8_FPS, EWP8_DURATION } from './constants-everything-will-pump-kaspa-real-explosion-impact';

// batch: everything-will-pump, clip #3 "Kaspa Has Not Had Its Real Explosion Yet" (variant: FULL,
// 47.080 s spine @25, comp runs 30 fps). New comp id: nothing matching `EwpKaspaRealExplosionFull`,
// `constants-everything-will-pump-kaspa-real-explosion` (without the `-impact` tail) or
// `captionsEwpKaspaRealExplosionFull` existed in src/ or in this file before it was authored
// (checked with ls + grep on 2026-08-27). The id carries the explicit `Full` suffix so it can never
// be confused with clip #8's `EwpKaspaRealExplosionImpact`, which was registered above while this
// clip was building IN PARALLEL and is deliberately NOT touched, re-registered or shared with -
// even though the two are cut from the SAME livestream moments. Every asset this clip owns is
// `broll-c3-*` / `thumb-c3-*` prefixed and is shared with no sibling.
import { EwpKaspaRealExplosionFull } from './EwpKaspaRealExplosionFull';
import { EWP3_FPS, EWP3_DURATION } from './constants-everything-will-pump-kaspa-real-explosion';

// batch: everything-will-pump, clip #6 "We Are Going to Send. Very, Very Soon." (variant: IMPACT,
// 14.000 s spine @25, comp runs 30 fps). New comp id: nothing matching `EwpOctoberZombiesImpact`,
// `constants-everything-will-pump-october-zombies-impact` or
// `captionsEwpOctoberZombiesImpact` existed in src/ or in this file before it was authored
// (checked with ls + grep on 2026-08-27). Its batch siblings (clips 1-5, 7, 8) were building IN
// PARALLEL and are deliberately NOT touched, re-registered or shared with - including clip #1
// `october-zombies-wealth-transfer`, the FULL variant cut from the SAME livestream moment. Every
// asset this clip owns is `broll-ewp-c6-*` / `thumb-ewp-c6-*` prefixed and is shared with no
// sibling.
import { EwpOctoberZombiesImpact } from './EwpOctoberZombiesImpact';
import { EWP6_FPS, EWP6_DURATION } from './constants-everything-will-pump-october-zombies-impact';

// batch: everything-will-pump, clip #4 "No Longer a Need to Die: 3 to 6 Years Out" (variant: FULL,
// 76.800 s spine @25, comp runs 30 fps). New comp id: nothing matching `EwpLongevityEscapeVelocity`,
// `constants-everything-will-pump-longevity-escape-velocity` or `captionsEwpLongevity4` existed in
// src/ or in this file before it was authored (checked with ls + grep on 2026-08-27). The `Ewp`
// prefix is LOAD-BEARING here: an unprefixed `LongevityEscapeVelocity.tsx` from an earlier batch is
// registered above under the id `LongevityEscapeVelocity` (line ~649) and is NOT this clip - it is
// deliberately not touched, re-registered or shared with. Its batch siblings (clips 1-3, 5-8) were
// building IN PARALLEL and are likewise untouched. Every asset this clip owns is `broll-ewp-c4-*` /
// `thumb-ewp-c4-*` prefixed and is shared with no sibling.
import { EwpLongevityEscapeVelocity } from './EwpLongevityEscapeVelocity';
import { EWP4_FPS, EWP4_DURATION } from './constants-everything-will-pump-longevity-escape-velocity';

// batch: everything-will-pump, clip #5 "The Housing Crisis Is Free Publicity for Housecoin"
// (variant: FULL, 47.040 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `EwpHousecoinFreePublicity` or `captionsEwpHousecoin5` existed in src/ or in this file before it
// was authored (checked with ls + grep on 2026-08-27). The `Ewp` prefix is LOAD-BEARING: the
// peach-minute batch's Housecoin clip is registered above as `HousecoinStillHolding` (line ~867) and
// is a DIFFERENT clip - it is not touched, re-registered or shared with. Its batch siblings
// (clips 1-4, 6-8) were building IN PARALLEL and are likewise untouched. Every asset this clip owns
// is `broll-ewp-c5-*` / `thumb-ewp-c5-*` prefixed and is shared with no sibling.
import { EwpHousecoinFreePublicity } from './EwpHousecoinFreePublicity';
import { EWP5_FPS, EWP5_DURATION } from './constants-everything-will-pump-housecoin-free-publicity';
// batch: everything-will-pump, clip #2 "They Called These Coins Dead. We Did a 130x."
// (variant: FULL, 84.577 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `EwpDeadMemesReceipts`, `constants-everything-will-pump-dead-memes-comeback-receipts` or
// `captionsEwpDeadMemesReceipts` existed in src/ or in this file before it was authored (checked
// with ls + grep on 2026-08-27). The `Ewp` prefix is LOAD-BEARING: `remotion/src/` is a FLAT
// cross-batch namespace and the cooper-50x batch already ships a Tutorial clip as `C50xTutRugToAth`
// and the last-year batch a Velvet clip - neither is touched, re-registered or shared with. Batch
// sibling clip #7 (`dead-memes-comeback-impact`) is cut from the SAME topic and is a different comp;
// every asset this clip owns is `broll-c2-*` / `thumb-c2-*` prefixed and is shared with no sibling.
import { EwpDeadMemesReceipts } from './EwpDeadMemesReceipts';
import { EWP2_FPS, EWP2_DURATION } from './constants-everything-will-pump-dead-memes-comeback-receipts';

// batch: my-new-100x, clip #6 "Retrace to 800K, Then 100x. That's a 200x Call." (variant: IMPACT,
// 16.238 s spine @25, comp runs 30 fps). New comp id: nothing matching `Mnx*`,
// `constants-my-new-100x-packed-impact` or `captionsMnxPackedImpact` existed in src/ or in this
// file before it was authored (checked with ls + grep on 2026-08-28; the only other 100x-named
// comps are TutDoginme100x / WhatifCto100xCall*, which belong to other batches). Its batch siblings
// (clips 1-5, 8) were building IN PARALLEL and are deliberately NOT touched, re-registered or
// shared with - including clip #1 `packed-my-new-100x`, the FULL variant cut from the SAME
// livestream moments as this impact cut. Every asset this clip owns is `broll-mnx-c6-*` /
// `thumb-mnx-c6-*` prefixed and is shared with no sibling.
import { MnxPackedMyNew100xImpact } from './MnxPackedMyNew100xImpact';
import { MNX6_FPS, MNX6_DURATION } from './constants-my-new-100x-packed-impact';
import { MnPackedMyNew100x } from './MnPackedMyNew100x';
import { MN1_FPS, MN1_DURATION } from './constants-my-new-100x-packed';

// batch: my-new-100x, clip #8 "The Kaspa Lambo and the Color Argument I Lost" (variant: FULL,
// 57.040 s spine @25, comp runs 30 fps). New comp id: nothing matching `MnxKaspaLambo*`,
// `constants-my-new-100x-kaspa-lambo` or `captionsMnxKaspaLambo` existed in src/ or in this file
// before it was authored (checked with ls + grep on 2026-08-28). Its batch siblings (clips 1-6)
// were building IN PARALLEL and are deliberately NOT touched, re-registered or shared with - note
// the batch already carries two other prefixes, `Mn*` (clip 1) and `Mnx*` (clip 6), and this comp
// adds only its own file. Every asset this clip owns is `broll-k8-*` / `thumb-k8-*` prefixed and is
// shared with no sibling.
import { MnxKaspaLamboColorArgument } from './MnxKaspaLamboColorArgument';
import { MNX8_FPS, MNX8_DURATION } from './constants-my-new-100x-kaspa-lambo';

// batch: my-new-100x, clip #2 "$80 Became Thousands. The Next 300x Is on $400." (variant: FULL,
// 55.000 s spine @25, comp runs 30 fps). New comp id: nothing matching `MyNew100x*`,
// `ProfitFlywheel*`, `constants-my-new-100x-profit-flywheel-bull-run` or
// `captionsMn2ProfitFlywheel` existed in src/ or in this file before it was authored (checked with
// ls + grep on 2026-08-28; the batch already carries the `Mn*`, `Mnx*` prefixes for clips 1/6/8 and
// none of their symbols overlap MN2_*). Its batch siblings were building IN PARALLEL and are
// deliberately NOT touched, re-registered or shared with. Every asset this clip owns is
// `broll-mn2-*` / `thumb-mn2-*` prefixed and is shared with no sibling.
import { MyNew100xProfitFlywheelBullRun } from './MyNew100xProfitFlywheelBullRun';
import { MN2_FPS, MN2_DURATION } from './constants-my-new-100x-profit-flywheel-bull-run';

// batch: my-new-100x, clip #5 "They Finally Found Hard Money. It's Paired With Hims." (variant:
// FULL, 34.600 s spine @25, comp runs 30 fps). New comp id: nothing matching `MnxBoner*`,
// `BonerPaired*`, `constants-my-new-100x-boner-hims` or `captionsMnxBonerHims` existed in src/ or
// in this file before it was authored (checked with ls + grep on 2026-08-28). Its batch siblings
// were building IN PARALLEL and are deliberately NOT touched, re-registered or shared with - the
// batch already carries the `Mn*` (clip 1), `Mnx*` (clips 6/8) and `MyNew100x*` (clip 2) prefixes
// and none of their symbols overlap MNX5_*. Every asset this clip owns is `broll-mnx-c5-*` /
// `thumb-mnx-c5-*` prefixed and is shared with no sibling.
import { MnxBonerPairedWithHims } from './MnxBonerPairedWithHims';
import { MNX5_FPS, MNX5_DURATION } from './constants-my-new-100x-boner-hims';
// batch my-new-100x / clip #3 - boomer-tokenized-stocks "Hold This Meme Coin, Get Real Stocks
// Airdropped" (FULL, 58.640 s spine @25, comp runs 30 fps). New comp id: nothing matching
// `Mn100xBoomerTokenizedStocks`, `constants-my-new-100x-boomer-tokenized-stocks` or
// `captionsMn100xBoomerTokenizedStocks` existed in src/ or in this file before it was authored
// (checked 2026-08-28; the batch's siblings use the `Mn`/`Mnx` prefixes, this clip uses `Mn100x`).
import { Mn100xBoomerTokenizedStocks } from './Mn100xBoomerTokenizedStocks';
import { MN3_FPS, MN3_DURATION } from './constants-my-new-100x-boomer-tokenized-stocks';

// batch: my-new-100x, clip #4 "I Was About to Sell. Then I Saw Vlad's 2021 Tweet." (variant: FULL,
// 44.760 s spine @25, comp runs 30 fps). New comp id: nothing matching `Mnx100x*`, `SwoleCat*`,
// `constants-my-new-100x-swole-cat-vlad-2021` or `captionsMnxSwoleCatVlad` existed in src/ or in
// this file before it was authored (checked with ls + grep on 2026-08-28; the batch already carries
// the `Mn*` (clip 1), `Mnx*` (clips 5/6/8), `MyNew100x*` (clip 2) and `Mn100x*` (clip 3) prefixes
// and none of their symbols overlap MNX4_*). Its batch siblings were building IN PARALLEL and are
// deliberately NOT touched, re-registered or shared with. Every asset this clip owns is
// `broll-mn100x-c4-*` / `thumb-mn100x-c4-*` prefixed and is shared with no sibling.
import { Mnx100xSwoleCatVlad2021 } from './Mnx100xSwoleCatVlad2021';
import { MNX4_FPS, MNX4_DURATION } from './constants-my-new-100x-swole-cat-vlad-2021';
// batch tendies / clip #2 - doggy-mode-paired-with-tesla "I Was Tired of Dog Coins. Then Doggy Mode
// Did a 4-5x." (FULL, 50.800 s spine @25, comp runs 30 fps). NEW comp id: nothing matching
// `Tnd*`, `TndDoggieModePairedWithTesla`, `constants-tendies-doggie-mode-tesla` or
// `captionsTndDoggieMode` existed in src/ or in this file before it was authored (checked with ls +
// grep on 2026-09-03; the only pre-existing `tendies` string in src/ is batch early-crash's
// `EcTendiesFunnyStupid`, a different batch and a different clip, which is NOT touched). Every asset
// this clip owns is `broll-tnd-c2-*` / `thumb-tnd-c2-*` prefixed and is shared with no sibling.
import { TndDoggieModePairedWithTesla } from './TndDoggieModePairedWithTesla';
import { TND2_FPS, TND2_DURATION } from './constants-tendies-doggie-mode-tesla';
// batch tendies / clip #4 - my-plays-run-to-a-billion "My Phenomenal Plays Are Not Degen Plays.
// They Run to a Billion." (FULL, 77.800 s spine @25, comp runs 30 fps). NEW comp id: nothing
// matching `TndMyPlaysRunToABillion`, `constants-tendies-my-plays-billion` or `captionsTndMyPlays`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-09-03).
// The sibling clip-2 comp `TndDoggieModePairedWithTesla` and batch early-crash's
// `EcTendiesFunnyStupid` are deliberately NOT touched, re-registered or shared with. Every asset
// this clip owns is `broll-tnd-c4-*` / `thumb-tnd-c4-*` prefixed and is shared with no sibling.
import { TndMyPlaysRunToABillion } from './TndMyPlaysRunToABillion';
import { TND4_FPS, TND4_DURATION } from './constants-tendies-my-plays-billion';
// batch tendies / clip #3 - tendies-crypto-com-ath "Tendies Got Listed on Crypto.com and Hit a New
// All-Time High" (FULL, 46.000 s spine @25, comp runs 30 fps). NEW comp id: nothing matching
// `TndTendiesCryptoComAth`, `constants-tendies-crypto-com-ath`, `captionsTndCryptoComAth`, `TND3_*`
// or `CAPTIONS_TND3` existed in src/ or in this file before it was authored (checked with ls + grep
// on 2026-09-03). The sibling comps `TndDoggieModePairedWithTesla` (clip 2),
// `TndMyPlaysRunToABillion` (clip 4) and batch early-crash's `EcTendiesFunnyStupid` (a different
// batch and a different clip) are deliberately NOT touched, re-registered or shared with. Every
// asset this clip owns is `broll-tnd-c3-*` / `thumb-tnd-c3-*` prefixed and is shared with no sibling.
import { TndTendiesCryptoComAth } from './TndTendiesCryptoComAth';
import { TND3_FPS, TND3_DURATION } from './constants-tendies-crypto-com-ath';
// batch tendies / clip #6 - artificial-inu-is-the-king-impact "A $20M Buy Order. This Is the King
// of Robinhood Dogs." (IMPACT, 20.800 s spine @25, comp runs 30 fps). NEW comp id: nothing matching
// `TndArtificialInuKingImpact`, `constants-tendies-artificial-inu-king`,
// `captionsTndArtificialInuKing`, `TND6_*` or `CAPTIONS_TND6` existed in src/ or in this file before
// it was authored (checked with ls + grep on 2026-09-03). The sibling comps
// `TndDoggieModePairedWithTesla` (clip 2), `TndTendiesCryptoComAth` (clip 3) and
// `TndMyPlaysRunToABillion` (clip 4) are deliberately NOT touched, re-registered or shared with, and
// neither is batch cash-cat-hood's `CashcatKing` (a different batch, a different clip, and the only
// other comp in src/ whose name contains "King"). Every asset this clip owns is `broll-tnd-c6-*` /
// `thumb-tnd-c6-*` prefixed and is shared with no sibling.
import { TndArtificialInuKingImpact } from './TndArtificialInuKingImpact';
import { TND6_FPS, TND6_DURATION } from './constants-tendies-artificial-inu-king';
// batch tendies / clip #5 - hayes-flipped-eth-flips-btc "Arthur Hayes Has It Flipped Around.
// Ethereum Flips Bitcoin." (FULL, 52.080 s spine @25, comp runs 30 fps). NEW comp id: nothing
// matching `TndHayesFlippedEthFlipsBtc`, `constants-tendies-hayes-eth-flips-btc`,
// `captionsTndHayesFlipped`, `TND5_*` or `CAPTIONS_TND5` existed in src/ or in this file before it
// was authored (checked with ls + grep on 2026-09-03; `HateEthBoughtIt` and `EthereumRwa` are
// different batches and different clips, and are deliberately NOT touched). The sibling comps
// `TndDoggieModePairedWithTesla` (clip 2), `TndTendiesCryptoComAth` (clip 3),
// `TndMyPlaysRunToABillion` (clip 4) and `TndArtificialInuKingImpact` (clip 6) are deliberately NOT
// touched, re-registered or shared with. Every asset this clip owns is `broll-tnd-c5-*` /
// `thumb-tnd-c5-*` prefixed and is shared with no sibling.
import { TndHayesFlippedEthFlipsBtc } from './TndHayesFlippedEthFlipsBtc';
import { TND5_FPS, TND5_DURATION } from './constants-tendies-hayes-eth-flips-btc';
// batch tendies / clip #7 - doggy-mode-paired-with-tesla-impact "Don't Tell Me Another Dog... Doggy
// Mode Is a 4-5x for Me Already" (IMPACT, 25.560 s video track @~25, comp runs 30 fps). NEW comp id:
// nothing matching `TndDoggieModeTeslaImpact`, `constants-tendies-doggie-mode-impact`,
// `captionsTndDoggieModeImpact`, `TND7_*` or `CAPTIONS_TND7` existed in src/ or in this file before
// it was authored (checked with ls + grep on 2026-09-03). Its FULL variant
// `TndDoggieModePairedWithTesla` (clip 2, files `constants-tendies-doggie-mode-tesla` /
// `captionsTndDoggieMode`) and the siblings `TndTendiesCryptoComAth` (clip 3),
// `TndMyPlaysRunToABillion` (clip 4), `TndHayesFlippedEthFlipsBtc` (clip 5) and
// `TndArtificialInuKingImpact` (clip 6) are deliberately NOT touched, re-registered or shared with.
// Every asset this clip owns is `broll-tnd-c7-*` / `thumb-tnd-c7-*` prefixed and is shared with no
// sibling.
import { TndDoggieModeTeslaImpact } from './TndDoggieModeTeslaImpact';
import { TND7_FPS, TND7_DURATION } from './constants-tendies-doggie-mode-impact';
// batch biggest-bullrun / clip #3 - pippin-dead-then-85x "I Thought Pippin Was Dead. Then It Ripped
// 85x in a Bear Market." (FULL, 45.560 s video track @25, comp runs 30 fps). NEW comp id: nothing
// matching `BiggestBullrunPippinDead85x`, `constants-biggest-bullrun-pippin-dead-then-85x`,
// `captionsBiggestBullrunPippinDead85x`, `BBR3_*`, `CAPTIONS_BBR3`, `pippin` or `biggest-bullrun`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-09-06).
// No sibling composition is touched, re-registered or shared with; every asset this clip owns is
// `broll-bbr3-*` / `thumb-bbr3-*` prefixed.
import { BiggestBullrunPippinDead85x } from './BiggestBullrunPippinDead85x';
import { BBR3_FPS, BBR3_DURATION } from './constants-biggest-bullrun-pippin-dead-then-85x';
// batch biggest-bullrun / clip #1 - fiat-debasement-minimum-wage-house "If Not for Fiat Debasement,
// Minimum Wage Would Buy a House" (FULL, 76.5298 s video track @25.167, comp runs 30 fps). NEW comp
// id: nothing matching `BiggestBullrunFiatDebasement`, `constants-biggest-bullrun-fiat-debasement`,
// `captionsBiggestBullrunFiatDebasement`, `BBR1_*`, `CAPTIONS_BBR1` or `fiat` existed in src/ or in
// this file before it was authored (checked with ls + grep on 2026-09-06). Its own IMPACT variant is
// batch clip #4 and is a SEPARATE build; no sibling composition (including
// `BiggestBullrunPippinDead85x` above) is touched, re-registered or shared with, and every asset
// this clip owns is `broll-bbr1-*` / `thumb-bbr1-*` prefixed.
import { BiggestBullrunFiatDebasement } from './BiggestBullrunFiatDebasement';
import { BBR1_FPS, BBR1_DURATION } from './constants-biggest-bullrun-fiat-debasement';
// batch biggest-bullrun / clip #2 - youtube-10x-discord-100x "My YouTube Gets the 10x. My Discord
// Gets the 100x." (FULL, 96.080 s video track @25, comp runs 30 fps). NEW comp id: nothing matching
// `BiggestBullrunYoutube10xDiscord100x`, `constants-biggest-bullrun-youtube-10x-discord-100x`,
// `captionsBiggestBullrunYoutube10xDiscord100x`, `BBR2_*`, `CAPTIONS_BBR2`, `Youtube10x` or
// `youtube-10x` existed in src/ or in this file before it was authored (checked with ls + grep on
// 2026-09-06). No sibling composition (including `BiggestBullrunPippinDead85x` and
// `BiggestBullrunFiatDebasement` above) is touched, re-registered or shared with; every asset this
// clip owns is `broll-bbr-c2-*` / `thumb-bbr-c2-*` prefixed.
import { BiggestBullrunYoutube10xDiscord100x } from './BiggestBullrunYoutube10xDiscord100x';
import { BBR2_FPS, BBR2_DURATION } from './constants-biggest-bullrun-youtube-10x-discord-100x';
// batch biggest-bullrun / clip #4 - fiat-debasement-minimum-wage-house-impact "Nothing Gets Cheaper
// Because of Fiat. That Is Why Bitcoin Was Made." (IMPACT, 27.880 s video track @24.964, comp runs
// 30 fps). It is the SHORT slice of clip #1's material and is a SEPARATE build with its own assets.
// NEW comp id: nothing matching `BiggestBullrunFiatDebasementImpact`,
// `constants-biggest-bullrun-fiat-debasement-impact`, `captionsBiggestBullrunFiatDebasementImpact`,
// `BBR4_*`, `CAPTIONS_BBR4`, `bbr4`, `broll-bbr4` or `thumb-bbr4` existed in src/ or in this file
// before it was authored (checked with ls + grep on 2026-09-06). No sibling composition (including
// `BiggestBullrunFiatDebasement`, whose id is a strict PREFIX of this one and which is NOT touched)
// is modified, re-registered or shared with; every asset this clip owns is `broll-bbr4-*` /
// `thumb-bbr4-*` prefixed.
import { BiggestBullrunFiatDebasementImpact } from './BiggestBullrunFiatDebasementImpact';
import { BBR4_FPS, BBR4_DURATION } from './constants-biggest-bullrun-fiat-debasement-impact';
// batch biggest-bullrun / clip #7 - kaspa-fud-high-explosion "Kaspa FUD Is High. That Usually
// Signals an Explosion." (FULL, 45.760 s video track @25, comp runs 30 fps). The batch's ONLY Kaspa
// clip. NEW comp id: nothing matching `BiggestBullrunKaspaFudExplosion`,
// `constants-biggest-bullrun-kaspa-fud-high-explosion`, `captionsBiggestBullrunKaspaFudExplosion`,
// `BBR7_*`, `CAPTIONS_BBR7`, `bbr7`, `broll-bbr7` or `thumb-bbr7` existed in src/ or in this file
// before it was authored (checked with ls + grep on 2026-09-06). No sibling composition
// (`BiggestBullrunPippinDead85x`, `BiggestBullrunFiatDebasement`,
// `BiggestBullrunYoutube10xDiscord100x`, `BiggestBullrunFiatDebasementImpact`) is modified,
// re-registered or shared with; every asset this clip owns is `broll-bbr7-*` / `thumb-bbr7-*`
// prefixed. This file was APPENDED to, never rewritten (siblings edit it concurrently).
import { BiggestBullrunKaspaFudExplosion } from './BiggestBullrunKaspaFudExplosion';
import { BBR7_FPS, BBR7_DURATION } from './constants-biggest-bullrun-kaspa-fud-high-explosion';

// batch biggest-bullrun / clip #8 - coin-about-farts-devs-funding "Even a Coin About Farts Will
// Catch On if the Devs Have Funding" (FULL, 53.000 s video track @25, comp runs 30 fps). The
// batch's LAST clip. NEW comp id: nothing matching `BiggestBullrunCoinAboutFarts`,
// `constants-biggest-bullrun-coin-about-farts-devs-funding`,
// `captionsBiggestBullrunCoinAboutFarts`, `BBR8_*`, `CAPTIONS_BBR8`, `bbr8`, `broll-bbr8`,
// `thumb-bbr8`, `CoinAboutFarts` or `coin-about-farts` existed in src/ or in this file before it
// was authored (checked with ls + grep on 2026-09-06). No sibling composition
// (`BiggestBullrunPippinDead85x`, `BiggestBullrunFiatDebasement`,
// `BiggestBullrunYoutube10xDiscord100x`, `BiggestBullrunFiatDebasementImpact`,
// `BiggestBullrunKaspaFudExplosion`) is modified, re-registered or shared with; every asset this
// clip owns is `broll-bbr8-*` / `thumb-bbr8-*` prefixed. This file was APPENDED to, never
// rewritten (clip 7 was editing it concurrently).
import { BiggestBullrunCoinAboutFarts } from './BiggestBullrunCoinAboutFarts';
import { BBR8_FPS, BBR8_DURATION } from './constants-biggest-bullrun-coin-about-farts-devs-funding';

// batch kaspa / clip #1 - kaspa-10-cents-vs-3-dollars "They Say Kaspa Won't Clear 10 Cents. $100B
// Is a $3 Kaspa." (FULL, 48.120 s video track @25, comp runs 30 fps). NEW comp id: nothing matching
// `Kaspa10CentsVs3Dollars`, `constants-kaspa-10-cents-vs-3-dollars`,
// `captionsKaspa10CentsVs3Dollars`, `KAS1_*`, `CAPTIONS_KAS1`, `kas1`, `broll-kas1` or `thumb-kas1`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-09-10).
// `remotion/src/` is a FLAT cross-batch namespace and this batch is literally named `kaspa`, so the
// pre-existing Kaspa-named comps (`Kaspa40Bps`, `Kaspa40Short`, `Kaspa40Vertical*`, `Kaspa40Charts`,
// `KaspaHateBottomSignal`, `KaspaOverDollar`, `EwpKaspaRealExplosion*`, `CcheerKaspaMoreThan5x*`,
// `BiggestBullrunKaspaFudExplosion`, `LastYearKaspaExcavator`) were each checked by name and NONE is
// modified, re-registered or shared with. Every asset this clip owns is `broll-kas1-*` /
// `thumb-kas1-*` prefixed. This file was APPENDED to, never rewritten (siblings edit it
// concurrently).
import { Kaspa10CentsVs3Dollars } from './Kaspa10CentsVs3Dollars';
import { KAS1_FPS, KAS1_DURATION } from './constants-kaspa-10-cents-vs-3-dollars';

// batch kaspa / clip #4 - 19x-14x-12x-7x-five-days "We Did a 19x, 14x, 12x and 7x in Five Days.
// LAB Did a 350x." (FULL, 55.800 s video track, comp runs 30 fps). NEW comp id: nothing matching
// `Kaspa19x14x12x7xFiveDays`, `constants-kaspa-19x-14x-12x-7x-five-days`,
// `captionsKaspa19x14x12x7xFiveDays`, `KS4_*`, `CAPTIONS_KS4`, `ks4`, `broll-ks4` or `thumb-ks4`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-09-10).
// `remotion/src/` is a FLAT cross-batch namespace, so the pre-existing comps whose names could be
// confused with this one were each checked BY NAME and NONE is modified, re-registered or shared
// with: `LabCalled20xDid353x`, `LastYearLab353xUnderestimate`, `Kaspa10CentsVs3Dollars` (this
// batch's clip 1, a different clip), `Kaspa40*`, `KaspaHateBottomSignal`, `KaspaOverDollar`,
// `CommunityReceipts`, `MillionairesAreMade`. Every asset this clip owns is `broll-ks4-*` /
// `thumb-ks4-*` prefixed. This file was APPENDED to, never rewritten (siblings edit it
// concurrently).
import { Kaspa19x14x12x7xFiveDays } from './Kaspa19x14x12x7xFiveDays';
import { KS4_FPS, KS4_DURATION } from './constants-kaspa-19x-14x-12x-7x-five-days';

// batch kaspa / clip #6 - kaspa-10-cents-vs-3-dollars-impact "That Guy's Off His Rocker. $100B Is a
// $3 Kaspa." (IMPACT, 21.080 s video track @25, comp runs 30 fps). NEW comp id: nothing matching
// `Kaspa10CentsVs3DollarsImpact`, `constants-kaspa-10-cents-vs-3-dollars-impact`,
// `captionsKaspa10CentsVs3DollarsImpact`, `KAS6_*`, `CAPTIONS_KAS6`, `kas6`, `broll-kas6` or
// `thumb-kas6` existed in src/ or in this file before it was authored (checked with ls + grep on
// 2026-09-10). `remotion/src/` is a FLAT cross-batch namespace and this batch is literally named
// `kaspa`, so every pre-existing Kaspa-named comp (`Kaspa40Bps`, `Kaspa40Short`, `Kaspa40Vertical*`,
// `Kaspa40Charts`, `KaspaHateBottomSignal`, `KaspaOverDollar`, `EwpKaspaRealExplosion*`,
// `CcheerKaspaMoreThan5x*`, `BiggestBullrunKaspaFudExplosion`, `LastYearKaspaExcavator`,
// `MnxKaspaLamboColorArgument`, `TutBinanceKaspaCatch22*`) and the batch siblings
// `Kaspa10CentsVs3Dollars` (clip #1, the FULL cut of this SAME topic, `kas1`-prefixed, built
// concurrently), `Kaspa19x14x12x7xFiveDays` (#4), `KaspaFoxyLineaSwiftBet` (#5) and
// `KaspaTao20000NotUnrealistic` (#3) were each checked BY NAME and NONE is modified, re-registered
// or shared with. In particular this comp is NOT `Kaspa10CentsVs3Dollars` with a suffix bolted on:
// it is its own file, its own constants, its own captions and its own `kas6` assets.
import { KAS6_FPS, KAS6_DURATION } from './constants-kaspa-10-cents-vs-3-dollars-impact';
import { Kaspa10CentsVs3DollarsImpact } from './Kaspa10CentsVs3DollarsImpact';


// batch kaspa / clip #2 - some-things-dont-die "They Say Last Year's Coins Never Come Back. Some
// Things Don't Die." (FULL, 1334-frame / 53.360 s video track @25, comp runs 30 fps). NEW comp id:
// nothing matching `KasSomeThingsDontDie`, `constants-kaspa-some-things-dont-die`,
// `captionsKasSomeThingsDontDie`, `STDD_*`, `CAPTIONS_STDD`, `broll-kas-c2` or `thumb-kas-c2`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-09-10).
// `remotion/src/` is a FLAT cross-batch namespace and this batch is literally named `kaspa`, so the
// pre-existing Kaspa-named comps (`Kaspa40Bps`, `Kaspa40Short`, `Kaspa40Vertical*`, `Kaspa40Charts`,
// `KaspaHateBottomSignal`, `KaspaOverDollar`, `EwpKaspaRealExplosion*`, `CcheerKaspaMoreThan5x*`,
// `BiggestBullrunKaspaFudExplosion`, `LastYearKaspaExcavator`) and the batch sibling
// `Kaspa10CentsVs3Dollars` (clip 1, `kas1`-prefixed assets, built concurrently) were each checked by
// name and NONE is modified, re-registered or shared with. Every asset this clip owns is
// `broll-kas-c2-*` / `thumb-kas-c2-*` prefixed. This file was APPENDED to, never rewritten.
import { KasSomeThingsDontDie, STDD_FPS, STDD_DURATION } from './KasSomeThingsDontDie';


// batch kaspa / clip #5 - foxy-linea-swift-bet "My High-Risk Bet Is Foxy Coming Back. Linea Has
// Swift." (FULL, 950-frame / 38.240 s video track @25, comp runs 30 fps). NEW comp id: nothing
// matching `KaspaFoxyLineaSwiftBet`, `constants-kaspa-foxy-linea-swift-bet`,
// `captionsKaspaFoxyLineaSwiftBet`, `FOX5_*`, `CAPTIONS_FOX5`, `broll-fox5` or `thumb-fox5` existed
// in src/ or in this file before it was authored (checked with ls + grep on 2026-09-10; the only
// pre-existing Linea-named symbols are `D_BC_LINEA` / the `BcLinea` composition from the
// best-coin batch, which are NOT modified, re-registered or shared with). `remotion/src/` is a FLAT
// cross-batch namespace and this batch is literally named `kaspa`, so the pre-existing Kaspa-named
// comps and the batch siblings `Kaspa10CentsVs3Dollars` (clip 1) / `KasSomeThingsDontDie` (clip 2),
// built concurrently, were each checked by name and NONE is touched. Every asset this clip owns is
// `broll-fox5-*` / `thumb-fox5-*` prefixed. This file was APPENDED to, never rewritten (siblings
// edit it concurrently).
import { KaspaFoxyLineaSwiftBet } from './KaspaFoxyLineaSwiftBet';
import { FOX5_FPS, FOX5_DURATION } from './constants-kaspa-foxy-linea-swift-bet';


// batch kaspa / clip #3 - tao-20000-not-unrealistic "A $20,000 TAO Is Not Unrealistic. Here Is Why."
// (FULL, 45.400 s video track @25, comp runs 30 fps). NEW comp id: nothing matching
// `KaspaTao20000NotUnrealistic`, `constants-kaspa-tao-20000-not-unrealistic`,
// `captionsKaspaTao20000`, `KAS3_*`, `CAPTIONS_KAS3`, `kas3`, `broll-kas3` or `thumb-kas3` existed
// in src/ or in this file before it was authored (checked with ls + grep on 2026-09-10).
// `remotion/src/` is a FLAT cross-batch namespace and this batch is literally named `kaspa`, so the
// pre-existing TAO-named comps (`TaoBuyTheDip`, `TaoRenderVirtuals`, `TaoUnder200Impact`,
// `TaoUnder200LastChance`) and the pre-existing Kaspa-named comps (including this batch's clip #1
// `Kaspa10CentsVs3Dollars`) were each checked by name and NONE is modified, re-registered or shared
// with - including sibling clip #7 `tao-20000-not-unrealistic-impact`, the IMPACT cut of this same
// passage, which is built concurrently and owns its own prefix. Every asset this clip owns is
// `broll-kas3-*` / `thumb-kas3-*` prefixed. This file was APPENDED to, never rewritten (siblings
// edit it concurrently).
import { KaspaTao20000NotUnrealistic } from './KaspaTao20000NotUnrealistic';
import { KAS3_FPS, KAS3_DURATION } from './constants-kaspa-tao-20000-not-unrealistic';


// batch kaspa / clip #7 - tao-20000-not-unrealistic-impact "Only 21 Million TAO, Just Like Bitcoin.
// $20,000 Is Not Unrealistic." (IMPACT, 683-frame / 27.440 s video track @25, comp runs 30 fps).
// NEW comp id: nothing matching `KaspaTao20000NotUnrealisticImpact`,
// `constants-kaspa-tao-20000-not-unrealistic-impact`, `captionsKaspaTao20000Impact`, `KAS7_*`,
// `CAPTIONS_KAS7`, `kas7`, `broll-kas7` or `thumb-kas7` existed in src/ or in this file before it
// was authored (checked with ls + grep on 2026-09-10). `remotion/src/` is a FLAT cross-batch
// namespace and this batch is literally named `kaspa`, so the pre-existing TAO-named comps
// (`TaoBuyTheDip`, `TaoRenderVirtuals`, `TaoUnder200Impact`, `TaoUnder200LastChance`), the
// pre-existing Kaspa-named comps, and every batch sibling (`Kaspa10CentsVs3Dollars` #1,
// `KasSomeThingsDontDie` #2, `KaspaTao20000NotUnrealistic` #3 - the FULL cut of this SAME passage,
// `kas3`-prefixed, built concurrently -, `Kaspa19x14x12x7xFiveDays` #4, `KaspaFoxyLineaSwiftBet` #5,
// `Kaspa10CentsVs3DollarsImpact` #6) were each checked BY NAME and NONE is modified, re-registered
// or shared with. In particular this comp is NOT `KaspaTao20000NotUnrealistic` with a suffix bolted
// on: it is its own file, its own constants, its own captions and its own `kas7` assets. This file
// was APPENDED to, never rewritten (siblings edit it concurrently).
import { KaspaTao20000NotUnrealisticImpact } from './KaspaTao20000NotUnrealisticImpact';
import { KAS7_FPS, KAS7_DURATION } from './constants-kaspa-tao-20000-not-unrealistic-impact';


// batch kaspa / clip #8 - 19x-14x-12x-7x-five-days-impact "19x, 14x, 12x, 7x. Seven or Eight Plays
// in Five Days." (IMPACT, 391-frame / 15.760 s video track @25, comp runs 30 fps = 473 frames).
// NEW comp id: nothing matching `Kaspa19x14x12x7xFiveDaysImpact`,
// `constants-kaspa-19x-14x-12x-7x-five-days-impact`, `captionsKaspa19x14x12x7xFiveDaysImpact`,
// `KS8_*`, `CAPTIONS_KS8`, `ks8`, `broll-ks8` or `thumb-ks8` existed in src/ or in this file before
// it was authored (checked with ls + grep on 2026-09-10). `remotion/src/` is a FLAT cross-batch
// namespace and this batch is literally named `kaspa`, so every pre-existing Kaspa-named comp and
// every batch sibling (`Kaspa10CentsVs3Dollars` #1, `KasSomeThingsDontDie` #2,
// `KaspaTao20000NotUnrealistic` #3, `Kaspa19x14x12x7xFiveDays` #4 - the FULL cut of this SAME
// passage, `ks4`-prefixed -, `KaspaFoxyLineaSwiftBet` #5, `Kaspa10CentsVs3DollarsImpact` #6,
// `KaspaTao20000NotUnrealisticImpact` #7) were each checked BY NAME and NONE is modified,
// re-registered or shared with. In particular this comp is NOT `Kaspa19x14x12x7xFiveDays` with a
// suffix bolted on: it is its own file, its own constants, its own captions and its own `ks8`
// assets. This file was APPENDED to, never rewritten (siblings edit it concurrently).
import { Kaspa19x14x12x7xFiveDaysImpact } from './Kaspa19x14x12x7xFiveDaysImpact';
import { KS8_FPS, KS8_DURATION } from './constants-kaspa-19x-14x-12x-7x-five-days-impact';

// batch silver / clip #1 - zombies-fomo-back-in-at-the-top "The Four-Year Cycle Zombies Will FOMO
// Back In at the Top" (FULL, 38.040 s video track @25, comp runs 30 fps). NEW comp id: nothing
// matching `SilverZombiesFomoTop`, `constants-silver-zombies-fomo-back-in-at-the-top`,
// `captionsSilverZombiesFomoTop`, `SLV1_*`, `CAPTIONS_SLV1`, `slv1`, `broll-slv1` or `thumb-slv1`
// existed in src/ or in this file before it was authored (checked with ls + grep on 2026-09-11).
// The pre-existing zombie-named comps (`EwpOctoberZombiesWealthTransfer`, `EwpOctoberZombiesImpact`,
// `PmZombie`, `ZombieC1..C8` / dataZombie) belong to OTHER batches and were each checked by name;
// NONE is modified, re-registered or shared with. Every asset this clip owns is `broll-slv1-*` /
// `thumb-slv1-*` prefixed. This file was APPENDED to, never rewritten (siblings edit it
// concurrently).
import { SilverZombiesFomoTop } from './SilverZombiesFomoTop';
import { SLV1_FPS, SLV1_DURATION } from './constants-silver-zombies-fomo-back-in-at-the-top';
// batch silver / clip #2 - kaspa-not-fading-away FULL (2026-09-11). `ls remotion/src` + a grep of this
// file were run BEFORE creating the comp: nothing matching `SilverKaspaNotFading`,
// `constants-silver-kaspa-not-fading-away`, `captionsSilverKaspaNotFading`, `SLV2_*`, `CAPTIONS_SLVKNF`,
// `broll-slv-c2` or `thumb-slv-c2` existed. Batch sibling `SilverZombiesFomoTop` (clip 1) is not
// modified, re-registered or shared with. This file was APPENDED to, never rewritten (siblings edit
// it concurrently).
import { SilverKaspaNotFading, SLV2_FPS, SLV2_DURATION } from './SilverKaspaNotFading';
// batch silver / clip #3 - vlad-loves-it-so-it-pumps FULL (2026-09-11). `ls remotion/src` + a grep of this
// file were run BEFORE creating the comp: nothing matching `SilverVladPumps`,
// `constants-silver-vlad-loves-it-so-it-pumps`, `captionsSilverVladPumps`, `SLV3_*`, `CAPTIONS_SLVVLAD`,
// `broll-slv-c3` or `thumb-slv-c3` existed. Batch siblings are not modified, re-registered or shared
// with. This file was APPENDED to, never rewritten (siblings edit it concurrently).
import { SilverVladPumps, SLV3_FPS, SLV3_DURATION } from './SilverVladPumps';
// batch silver / clip #5 - zombies-fomo-back-in-at-the-top-impact IMPACT (2026-09-11). `ls remotion/src`
// + a grep of this file were run BEFORE creating the comp: nothing matching `SilverZombiesFomoImpact`,
// `constants-silver-zombies-fomo-back-in-at-the-top-impact`, `captionsSilverZombiesFomoImpact`,
// `SLV5_*`, `CAPTIONS_SLV5`, `broll-slv5` or `thumb-slv5` existed. Batch sibling `SilverZombiesFomoTop`
// (clip 1, the FULL variant of the same topic) is not modified, re-registered or shared with. This
// file was APPENDED to, never rewritten (siblings edit it concurrently).
import { SilverZombiesFomoImpact } from './SilverZombiesFomoImpact';
import { SLV5_FPS, SLV5_DURATION } from './constants-silver-zombies-fomo-back-in-at-the-top-impact';
// batch silver / clip #7 - vlad-loves-it-so-it-pumps-impact IMPACT (2026-09-11). `ls remotion/src` + a grep
// of this file were run BEFORE creating the comp: nothing matching `SilverVladImpact`,
// `constants-silver-vlad-loves-it-so-it-pumps-impact`, `captionsSilverVladImpact`, `SLV7_*`, `CAPTIONS_SLV7`,
// `broll-slv7` or `thumb-slv7` existed. Batch sibling `SilverVladPumps` (clip 3, the FULL variant of the
// same topic) is not modified, re-registered or shared with. This file was APPENDED to, never rewritten
// (siblings edit it concurrently).
import { SilverVladImpact, SLV7_FPS, SLV7_DURATION } from './SilverVladImpact';
// batch perpspad / clip #1 - perps-pad-did-a-90x-while-i-slept (FULL). `ls remotion/src` + a grep of this
// file were run BEFORE creating the comp: nothing matching `Perpspad*`, `constants-perpspad-*`,
// `captionsPerpspad*`, `PPD1_*`, `CAPTIONS_PPD1`, `broll-ppd-c1` or `thumb-ppd-c1` existed. Batch
// sibling clip 2 is a separate builder's comp and is not touched.
import { PerpspadPerpsPad90x, PPD1_FPS, PPD1_DURATION } from './PerpspadPerpsPad90x';
// batch perpspad / clip #2 (2026-09-14). `ls remotion/src | grep -i "ppz2|PerpspadZombies"` and a grep of
// this file were run BEFORE creating the comp: nothing matching `PerpspadZombiesOctober`,
// `constants-perpspad-zombies-october-bottom`, `captionsPerpspadZombiesOctober`, `PPZ2_*`,
// `CAPTIONS_PPZ2`, `broll-ppz2` or `thumb-ppz2` existed. Batch sibling `PerpspadPerpsPad90x` (clip 1)
// is not touched.
import { PerpspadZombiesOctober, PPZ2_FPS, PPZ2_DURATION } from './PerpspadZombiesOctober';
// batch perpspad / clip #3 (2026-09-14). `ls remotion/src | grep -i "ppk3|Kaspa57"` and a grep of this
// file were run BEFORE creating the comp: nothing matching `PerpspadKaspa57`, `constants-perpspad-kaspa-ran-57`,
// `captionsPerpspadKaspa57`, `PPK3_*`, `CAPTIONS_PPK3`, `broll-ppk3` or `thumb-ppk3` existed. Batch siblings
// `PerpspadPerpsPad90x` (clip 1) and `PerpspadZombiesOctober` (clip 2) are not touched.
import { PerpspadKaspa57, PPK3_FPS, PPK3_DURATION } from './PerpspadKaspa57';
// batch ready-for-pumps / clip #1 (2026-09-14). `ls remotion/src | grep -i "rfp"` and a grep of this file were
// run BEFORE creating the comp: nothing matching `RfpPerpsPad110x`, `constants-rfp-perps-pad-110x`,
// `captionsRfpPerpsPad110x`, `RFP1_*`, `CAPTIONS_RFP1`, `broll-rfp-c1` or `thumb-rfp-c1` existed.
import { RfpPerpsPad110x, RFP1_FPS, RFP1_DURATION } from './RfpPerpsPad110x';
// batch ready-for-pumps / clip #2 (2026-09-14). `ls remotion/src | grep -i "rfp|StonkSeason"` and a grep of this
// file were run BEFORE creating the comp: nothing matching `RfpStonkSeason`, `constants-rfp-stonk-season`,
// `captionsRfpStonkSeason`, `RFP2_*`, `CAPTIONS_RFP2`, `broll-rfp2` or `thumb-rfp2` existed. Batch sibling
// `RfpPerpsPad110x` (clip 1) is not touched.
import { RfpStonkSeason, RFP2_FPS, RFP2_DURATION } from './RfpStonkSeason';
// batch ready-for-pumps / clip #3 (2026-09-14). `ls remotion/src | grep -i "rfp3|RobotsCrypto|RfpRobots"` and a grep
// of this file were run BEFORE creating the comp: nothing matching `RfpRobotsCryptoFoothold`,
// `constants-rfp-robots-crypto-foothold`, `captionsRfpRobotsCryptoFoothold`, `RFP3_*`, `CAPTIONS_RFP3`, `broll-rfp3`
// or `thumb-rfp3` existed. Batch siblings (clips 1, 2, 4) are not touched.
import { RfpRobotsCryptoFoothold, RFP3_FPS, RFP3_DURATION } from './RfpRobotsCryptoFoothold';
// batch ready-for-pumps / clip #4 (2026-09-14). `ls remotion/src | grep -i "rfp4|RfpAsteroid|c4"` and a grep of this
// file were run BEFORE creating the comp: nothing matching `RfpAsteroidGold`, `constants-rfp-asteroid-*`,
// `captionsRfpAsteroidGold`, `RFP4_*`, `CAPTIONS_RFP4`, `broll-rfp-c4` or `thumb-rfp-c4` existed. Batch siblings
// `RfpPerpsPad110x` (clip 1) and `RfpStonkSeason` (clip 2) are not touched.
import { RfpAsteroidGold, RFP4_FPS, RFP4_DURATION } from './RfpAsteroidGold';
// batch ready-for-pumps / clip #5 (2026-09-14). `ls remotion/src | grep -i "rfp5|slippy"` and a grep of this file
// were run BEFORE creating the comp: nothing matching `RfpSlippyKaspa`, `constants-rfp-slippy-*`,
// `captionsRfpSlippyKaspa`, `RFP5_*`, `CAPTIONS_RFP5`, `broll-rfp5` or `thumb-rfp5` existed. Batch siblings
// `RfpPerpsPad110x` (1), `RfpStonkSeason` (2), `RfpRobotsCryptoFoothold` (3) and `RfpAsteroidGold` (4) are not touched.
import { RfpSlippyKaspa, RFP5_FPS, RFP5_DURATION } from './RfpSlippyKaspa';
// batch ready-for-pumps / clip #7 (2026-09-14). `ls remotion/src | grep -i "rfp7|Impact"` and a grep of this
// file were run BEFORE creating the comp: nothing matching `RfpRobotsFootholdImpact`,
// `constants-rfp-robots-crypto-foothold-impact`, `captionsRfpRobotsFootholdImpact`, `RFP7_*`, `CAPTIONS_RFP7`,
// `broll-rfp7` or `thumb-rfp7` existed. Batch siblings (clips 1-4, incl. the same-topic `RfpRobotsCryptoFoothold`)
// are not touched.
import { RfpRobotsFootholdImpact, RFP7_FPS, RFP7_DURATION } from './RfpRobotsFootholdImpact';
// batch ready-for-pumps / clip #8 (2026-09-15). `ls remotion/src | grep -i "rfp8|AsteroidGoldImpact"` and a grep of
// this file were run BEFORE creating the comp: nothing matching `RfpAsteroidGoldImpact`,
// `constants-rfp-asteroid-gold-crypto-dollar-impact`, `captionsRfpAsteroidGoldImpact`, `RFP8_*`, `CAPTIONS_RFP8`,
// `broll-rfp8` or `thumb-rfp8` existed. Batch siblings (clips 1-5 and 7, incl. the same-topic `RfpAsteroidGold`)
// are not touched.
import { RfpAsteroidGoldImpact, RFP8_FPS, RFP8_DURATION } from './RfpAsteroidGoldImpact';
// batch pieverse / clip #1 - pieverse-secret-gem-8x-another-10x FULL. FLAT-NAMESPACE CHECK run
// BEFORE creating any file: `ls remotion/src` + grep of THIS file found nothing matching
// `PieverseSecretGem`, `constants-pieverse-secret-gem-8x-another-10x`, `captionsPieverseSecretGem`,
// `PV1_*` or `CAPTIONS_PV1`, so every name below is new and no shipped composition is touched.
import { PieverseSecretGem, PV1_FPS, PV1_DURATION } from './PieverseSecretGem';
// batch pieverse / clip #2 - four-year-cycle-zombies-returned-early FULL (2026-09-22). FLAT-NAMESPACE
// CHECK run BEFORE creating any file: `ls remotion/src | grep -i "pvz2|PieverseZombies"` and a grep of
// this file returned nothing matching `PieverseZombiesReturnedEarly`,
// `constants-pieverse-zombies-returned-early`, `captionsPieverseZombiesReturned`, `PVZ2_*`,
// `CAPTIONS_PVZ2`, `broll-pvz2` or `thumb-pvz2`. Batch sibling `PieverseSecretGem` (clip 1) is a
// separate builder's comp and is NOT touched.
import { PieverseZombiesReturnedEarly, PVZ2_FPS, PVZ2_DURATION } from './PieverseZombiesReturnedEarly';
// batch pieverse / clip #3 - 110x-in-8-days-community-wins FULL (2026-09-22). FLAT-NAMESPACE CHECK
// run BEFORE creating any file: `ls remotion/src | grep -iE "pv3|Pieverse110x|CommunityWins|110x"`
// and a grep of this file + the whole src tree returned nothing matching
// `Pieverse110xCommunityWins`, `constants-pieverse-110x-community-wins`,
// `captionsPieverse110xCommunityWins`, `PV3_*`, `CAPTIONS_PV3`, `broll-pv3` or `thumb-pv3`.
// (`RfpPerpsPad110x` exists but belongs to batch `rfp`, a different slug, and is NOT touched.)
// Batch siblings `PieverseSecretGem` (clip 1) and `PieverseZombiesReturnedEarly` (clip 2) are other
// builders' comps and are NOT touched.
import { Pieverse110xCommunityWins, PV3_FPS, PV3_DURATION } from './Pieverse110xCommunityWins';
// batch archie-promo / clip #2 - promo-code-archie FULL (2026-09-24). Flat-namespace check: no existing
// ArchiePromoCodeArchie / PA2_ / captionsArchiePromoCodeArchie / broll-pa2 / thumb-pa2 anywhere in src.
import { ArchiePromoCodeArchie, PA2_FPS, PA2_DURATION } from './ArchiePromoCodeArchie';
// batch golden-kitty-dominance / clip #2 - four-year-cycle-zombies-pump-our-bags FULL (2026-09-25). Flat-namespace
// check: no existing GoldenKittyDomZombiesPumpBags / GKD2_ / captionsGoldenKittyDomZombiesPumpBags / broll-gkd2 / thumb-gkd2.
import { GoldenKittyDomZombiesPumpBags, GKD2_FPS, GKD2_DURATION } from './GoldenKittyDomZombiesPumpBags';
// batch golden-kitty-dominance / clip #1 - golden-kitty-only-meme-doing-anything FULL (2026-09-25). Flat-namespace
// check: no existing GoldenKittyDomOnlyMeme / GKD1_ / captionsGoldenKittyDomOnlyMeme / broll-gkd1 / thumb-gkd1.
import { GoldenKittyDomOnlyMeme, GKD1_FPS, GKD1_DURATION } from './GoldenKittyDomOnlyMeme';
// check: no existing GoldenKittyDomCalled550x / GKD3_ / captionsGoldenKittyDomCalled550x / broll-gkd3 / thumb-gkd3.
import { GoldenKittyDomCalled550x, GKD3_FPS, GKD3_DURATION } from './GoldenKittyDomCalled550x';
// batch archie-promo, clip #1 archie-dumped-if-before-october (names checked free before creation)
import { ArchiePromoDumpedIf, AI1_FPS, AI1_DURATION } from './ArchiePromoDumpedIf';

// batch archie-promo, clip #3 sell-alerts-only-when-real (names checked free before creation)
import { ArchiePromoSellAlerts, SA3_FPS, SA3_DURATION } from './ArchiePromoSellAlerts';
// batch beer-and-kaspa / clip #2 - golden-kitty-8-million FULL (2026-09-27). Flat-namespace check: no existing
// BeerKaspaGoldenKitty8M / BK2_ / captionsBeerKaspaGoldenKitty8M / broll-bk2 / thumb-bk2 / ovl-bk2.
import { BeerKaspaGoldenKitty8M, BK2_FPS, BK2_DURATION } from './BeerKaspaGoldenKitty8M';

// batch beer-and-kaspa, clip #1 kaspa-bear-called-1-cent (names checked free before creation:
// BeerKaspaBearCalled1Cent / KB1_ / captionsBeerKaspaBearCalled1Cent / broll-kb1 / thumb-kb1).
import { BeerKaspaBearCalled1Cent, KB1_FPS, KB1_DURATION } from './BeerKaspaBearCalled1Cent';

// batch beer-and-kaspa, clip #3 first-vprog-live-on-kaspa (names checked free before creation:
// BeerKaspaFirstVprogLive / VP3_ / captionsBeerKaspaFirstVprogLive / broll-vp3 / thumb-vp3).
import { BeerKaspaFirstVprogLive, VP3_FPS, VP3_DURATION } from './BeerKaspaFirstVprogLive';

// batch beer-and-kaspa, clip #4 114x-in-eight-days (names checked free before creation:
// BeerKaspa114xEightDays / BK4_ / captionsBeerKaspa114xEightDays / broll-bk4 / thumb-bk4 / ovl-bk4).
import { BeerKaspa114xEightDays, BK4_FPS, BK4_DURATION } from './BeerKaspa114xEightDays';
import { KaspaVprogs, DUR as KVP_DUR, FPS as KVP_FPS } from './KaspaVprogs';
import { KaspaVprogsVertical, DUR as KVPV_DUR, FPS as KVPV_FPS } from './KaspaVprogsVertical';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* batch: peach-minute, clip #3 "03-kaspa-hate-bottom-signal" */}
      <Composition
        id="KaspaHateBottomSignal"
        component={KaspaHateBottomSignal}
        durationInFrames={PM3_DURATION}
        fps={PM3_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClarityTest"
        component={ClarityTest}
        durationInFrames={CLR_DURATION}
        fps={CLR_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClarityVertical"
        component={ClarityVertical}
        durationInFrames={CLRV_DURATION}
        fps={CLRV_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CarryTradeFull"
        component={CarryTradeFull}
        durationInFrames={CT_DURATION}
        fps={CT_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CarryTradeVertical"
        component={CarryTradeVertical}
        durationInFrames={CTV_DURATION}
        fps={CTV_FPS}
        width={1080}
        height={1920}
      />
      
      
      <Composition
        id="CommunityReceipts"
        component={CommunityReceipts}
        durationInFrames={CR_DURATION}
        fps={CR_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: robinhood, clip #1 rank 1 "Robinhood Is About to Open the Floodgates to Retail" */}
      <Composition
        id="RobinhoodFloodgates"
        component={RobinhoodFloodgates}
        durationInFrames={RHFG_DURATION}
        fps={RHFG_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: robinhood, clip #2 rank 2 "Cash Cat Is the King of the Robinhood Chain" */}
      <Composition
        id="CashcatKing"
        component={CashcatKing}
        durationInFrames={CCK_DURATION}
        fps={CCK_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: robinhood, clip #3 rank 3 "I Bought 9Hood Yesterday: the BOMO Team's Robinhood Play" */}
      <Composition
        id="NineHood"
        component={NineHood}
        durationInFrames={N9H_DURATION}
        fps={N9H_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: robinhood, clip #4 rank 4 "Hoodrat Is the Matt Furie Play on Robinhood" */}
      <Composition
        id="HoodratMattFurie"
        component={HoodratMattFurie}
        durationInFrames={HR_DURATION}
        fps={HR_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: robinhood, clip #5 rank 5 "The Clarity Act Could Send Us Flying" */}
      <Composition
        id="ClarityActCatalyst"
        component={ClarityActCatalyst}
        durationInFrames={CAC_DURATION}
        fps={CAC_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: robinhood, clip #6 rank 1 (impact) "The Floodgates Moment Nobody Is Pricing In" */}
      <Composition
        id="FloodgatesImpact"
        component={FloodgatesImpact}
        durationInFrames={FGI_DURATION}
        fps={FGI_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CommunityReceiptsImpact"
        component={CommunityReceiptsImpact}
        durationInFrames={CRI_DURATION}
        fps={CRI_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: where-millionaires-are-made, clip #1 "This Is When Millionaires Are Made" */}
      <Composition
        id="MillionairesAreMade"
        component={MillionairesAreMade}
        durationInFrames={MAM_DURATION}
        fps={MAM_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="FourYearCycleReligion"
        component={FourYearCycleReligion}
        durationInFrames={FYC_DURATION}
        fps={FYC_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="FourYearCycleReligionImpact"
        component={FourYearCycleReligionImpact}
        durationInFrames={FYCI_DURATION}
        fps={FYCI_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="OctoberWillBeGreen"
        component={OctoberWillBeGreen}
        durationInFrames={OWBG_DURATION}
        fps={OWBG_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: clarity-act, clip #1 "October Is Not Even Allowed To Go Red" (variant: full) */}
      <Composition
        id="OctoberNotAllowedRed"
        component={OctoberNotAllowedRed}
        durationInFrames={ONAR_DURATION}
        fps={ONAR_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: clarity-act, clip #2 "We Are Only Trading Against Ourselves" (variant: full) */}
      <Composition
        id="TradingAgainstOurselves"
        component={TradingAgainstOurselves}
        durationInFrames={TAO_DURATION}
        fps={TAO_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: clarity-act, clip #3 "I Hate ETH But I Bought It" (variant: full) */}
      <Composition
        id="HateEthBoughtIt"
        component={HateEthBoughtIt}
        durationInFrames={HETH_DURATION}
        fps={HETH_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BitcoinInflationYearFive"
        component={BitcoinInflationYearFive}
        durationInFrames={BIYF_DURATION}
        fps={BIYF_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="TaoBuyTheDip"
        component={TaoBuyTheDip}
        durationInFrames={TBTD_DURATION}
        fps={TBTD_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="TaoRenderVirtuals"
        component={TaoRenderVirtuals}
        durationInFrames={TRV_DURATION}
        fps={TRV_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="LongevityEscapeVelocity"
        component={LongevityEscapeVelocity}
        durationInFrames={LEV_DURATION}
        fps={LEV_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #1 "WHATIF Could Be A 100x From Here" (variant: full) */}
      <Composition
        id="WhatifCto100xCall"
        component={WhatifCto100xCall}
        durationInFrames={WCTO_DURATION}
        fps={WCTO_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #6 "Forget 20 Million, WHATIF Could 100x" (variant: impact) */}
      <Composition
        id="WhatifCto100xCallImpact"
        component={WhatifCto100xCallImpact}
        durationInFrames={WCTI_DURATION}
        fps={WCTI_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #3 "Your Last Chance At TAO Under $200" (variant: full) */}
      <Composition
        id="TaoUnder200LastChance"
        component={TaoUnder200LastChance}
        durationInFrames={T200_DURATION}
        fps={T200_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #8 "TAO Under $200: Don't Be That Guy" (variant: impact) */}
      <Composition
        id="TaoUnder200Impact"
        component={TaoUnder200Impact}
        durationInFrames={TAOI_DURATION}
        fps={TAOI_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #7 "Zombie FOMO Will Need A Psychiatrist" (variant: impact) */}
      <Composition
        id="OctoberBottomFrontrunImpact"
        component={OctoberBottomFrontrunImpact}
        durationInFrames={OBFI_DURATION}
        fps={OBFI_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #2 "The Bottom Is Being Front-Run" (variant: full) */}
      <Composition
        id="OctoberBottomFrontrun"
        component={OctoberBottomFrontrun}
        durationInFrames={OBFR_DURATION}
        fps={OBFR_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: whatif, clip #3 "WHATIF Could Be Another Peanut 52x" (variant: full) */}
      <Composition
        id="WhatifPeanut52x"
        component={WhatifPeanut52x}
        durationInFrames={WHIF_DURATION}
        fps={WHIF_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: October-pumps, clip #4 "Some Of These Things Could Run" (variant: full) */}
      <Composition
        id="RallyBasketNinehoodCashcat"
        component={RallyBasketNinehoodCashcat}
        durationInFrames={RB_DURATION}
        fps={RB_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: whatif, clip #1 "The October Bottom Is Getting Front-Run" (variant: full) */}
      <Composition
        id="WhatifOctoberBottom"
        component={LivestreamShort}
        durationInFrames={WOBF_DURATION}
        fps={WOBF_FPS}
        width={1080}
        height={1920}
        defaultProps={{ data: WOBF }}
      />
      {/* batch: whatif, clip #2 "89% Said Kaspa Over the Dollar" (variant: full) */}
      <Composition
        id="KaspaOverDollar"
        component={KaspaOverDollar}
        durationInFrames={K89_DURATION}
        fps={K89_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: new-bottom, clip #1 "The New Bottom Hits in August, Not October" (variant: full) */}
      <Composition
        id="NewBottomAugust"
        component={LivestreamShort}
        durationInFrames={NBA_DURATION}
        fps={NBA_FPS}
        width={1080}
        height={1920}
        defaultProps={{ data: NBA }}
      />
      {/* batch: new-bottom, clip #2 "Kaspa at 2.7 Cents: Absolutely Unbelievable" (variant: full) */}
      <Composition
        id="KaspaDagknight100x"
        component={LivestreamShort}
        durationInFrames={KDK_DURATION}
        fps={KDK_FPS}
        width={1080}
        height={1920}
        defaultProps={{ data: KDK }}
      />
      {/* batch: new-bottom, clip #3 "TAO Under $200: Don't Be That Guy" (variant: full) */}
      <Composition
        id="TaoDontBeThatGuy"
        component={LivestreamShort}
        durationInFrames={TDBTG_DURATION}
        fps={TDBTG_FPS}
        width={1080}
        height={1920}
        defaultProps={{ data: TDBTG }}
      />
      {/* batch: new-bottom, clip #4 "I'd Be a TON Maxi If Kaspa Never Existed" (variant: full) */}
      <Composition
        id="TonGramRename"
        component={TonGramRename}
        durationInFrames={TGR_DURATION}
        fps={TGR_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: peach-minute, clip #2 "If You Can Stick Through This Pain, You Win" (variant: full) */}
      <Composition
        id="PainStickThrough"
        component={PainStickThrough}
        durationInFrames={PSP_DURATION}
        fps={PSP_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: peach-minute, clip #4 "Kaspa $1 by the End of the Year" (variant: full) */}
      <Composition
        id="PmZombie"
        component={LivestreamShort}
        durationInFrames={ZOMB_DURATION}
        fps={ZOMB_FPS}
        width={1080}
        height={1920}
        defaultProps={{ data: ZOMB }}
      />
      {/* batch: peach-minute, clip #5 "Housecoin Just Got Delisted. I Want My 1000x." (variant: long) */}
      <Composition
        id="HousecoinStillHolding"
        component={HousecoinStillHolding}
        durationInFrames={HSC_DURATION}
        fps={HSC_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: what-if-1000x, clip #1 "$1,000 Into 10 Coins: The Real 1000x Math" (variant: long) */}
      <Composition
        id="TenCoins1000xMath"
        component={TenCoins1000xMath}
        durationInFrames={TC_DURATION}
        fps={TC_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: what-if-1000x, clip #5 "What If Could Be the Next Dogecoin" (variant: solo, 64.73 s @30) */}
      <Composition
        id="WhatifNextDogecoin"
        component={WhatifNextDogecoin}
        durationInFrames={WND_DURATION}
        fps={WND_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: what-if-1000x, clip #4 "We Estimated 20x. LAB Did 353x." (variant: solo, 61.20 s @30) */}
      <Composition
        id="LabCalled20xDid353x"
        component={LabCalled20xDid353x}
        durationInFrames={L353_DURATION}
        fps={L353_FPS}
        width={1080}
        height={1920}
      />

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <Composition
        id="TransitionDemo"
        component={TransitionDemo}
        defaultProps={{ id: 'blocks-max' }}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={({ props }) => ({
          durationInFrames: demoDurationFrames(props.id, 30),
        })}
      />
      <Composition id="TransitionTest" component={TransitionTest} defaultProps={{ id: 'badsignal-max-1' }} fps={30} width={1920} height={1080} durationInFrames={75} />
      
      
      
      
      
      
      
      
      
      
      
      <Composition id="Zebec" component={Zebec} durationInFrames={ZEBEC_DURATION} fps={ZEBEC_FPS} width={1920} height={1080} />
      <Composition id="ZebecVertical" component={ZebecVertical} durationInFrames={ZV_DURATION} fps={ZV_FPS} width={1080} height={1920} />
      
      
      
      
      
      
      
      
      
      <Composition id="NeedLangGraph" component={NeedLangGraph} durationInFrames={NLG_DURATION} fps={NLG_FPS_EXPORT} width={1920} height={1080} />
      <Composition id="NeedLangGraphVertical" component={NeedLangGraphVertical} durationInFrames={NLGV_DURATION} fps={NLGV_FPS_EXPORT} width={1080} height={1920} />
      <Composition id="SaveTokens" component={SaveTokens} durationInFrames={SAVETOK_DURATION} fps={SAVETOK_FPS_EXPORT} width={1920} height={1080} />
      <Composition id="SaveTokensVertical" component={SaveTokensVertical} durationInFrames={SAVETOKV_DURATION} fps={SAVETOKV_FPS_EXPORT} width={1080} height={1920} />
      
      
      <Composition id="WlwTitle" component={LivestreamShort} durationInFrames={FRAMES.title} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_TITLE }} />
      <Composition id="WlwUnicorn" component={LivestreamShort} durationInFrames={FRAMES.unicorn} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_UNICORN }} />
      <Composition id="WlwLab115x" component={LivestreamShort} durationInFrames={FRAMES.lab115x} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_LAB115X }} />
      <Composition id="WlwKaspa3" component={LivestreamShort} durationInFrames={FRAMES.kaspa3} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_KASPA3 }} />
      <Composition id="WlwWellsFargo" component={LivestreamShort} durationInFrames={FRAMES.wf} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_WF }} />
      <Composition id="WlwBounty" component={LivestreamShort} durationInFrames={FRAMES.bounty} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_BOUNTY }} />
      <Composition id="WlwRotation" component={LivestreamShort} durationInFrames={FRAMES.rotation} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_ROTATION }} />
      <Composition id="WlwLabWont" component={LivestreamShort} durationInFrames={FRAMES.labwont} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_LABWONT }} />
      <Composition id="WlwKaspaHold" component={LivestreamShort} durationInFrames={FRAMES.kaspahold} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_KASPAHOLD }} />
      <Composition id="WlwKaspaTon" component={LivestreamShort} durationInFrames={FRAMES.kaspaton} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_KASPATON }} />
      <Composition id="WlwPengu" component={LivestreamShort} durationInFrames={FRAMES.pengu} fps={30} width={1080} height={1920} defaultProps={{ data: WLW_PENGU }} />
      <Composition id="X353xShort" component={LivestreamShort} durationInFrames={F353X.short} fps={30} width={1080} height={1920} defaultProps={{ data: D353X_SHORT }} />
      <Composition id="X353xMedium" component={LivestreamShort} durationInFrames={F353X.medium} fps={30} width={1080} height={1920} defaultProps={{ data: D353X_MEDIUM }} />
      <Composition id="X353xLong" component={LivestreamShort} durationInFrames={F353X.long} fps={30} width={1080} height={1920} defaultProps={{ data: D353X_LONG }} />
      <Composition id="X353xMoonbag" component={LivestreamShort} durationInFrames={F353X.moonbag} fps={30} width={1080} height={1920} defaultProps={{ data: D353X_MOONBAG }} />
      <Composition id="X353xSaylor" component={LivestreamShort} durationInFrames={F353X.saylor} fps={30} width={1080} height={1920} defaultProps={{ data: D353X_SAYLOR }} />
      <Composition id="X353xWarsh" component={LivestreamShort} durationInFrames={F353X.warsh} fps={30} width={1080} height={1920} defaultProps={{ data: D353X_WARSH }} />
      <Composition id="Best350xC1" component={LivestreamShort} durationInFrames={FRAMES_B350.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C1 }} />
      <Composition id="Best350xC2" component={LivestreamShort} durationInFrames={FRAMES_B350.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C2 }} />
      <Composition id="Best350xC3" component={LivestreamShort} durationInFrames={FRAMES_B350.c3} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C3 }} />
      <Composition id="Best350xC4" component={LivestreamShort} durationInFrames={FRAMES_B350.c4} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C4 }} />
      <Composition id="Best350xC5" component={LivestreamShort} durationInFrames={FRAMES_B350.c5} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C5 }} />
      <Composition id="Best350xC6" component={LivestreamShort} durationInFrames={FRAMES_B350.c6} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C6 }} />
      <Composition id="Best350xC7" component={LivestreamShort} durationInFrames={FRAMES_B350.c7} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C7 }} />
      <Composition id="Best350xC8" component={LivestreamShort} durationInFrames={FRAMES_B350.c8} fps={30} width={1080} height={1920} defaultProps={{ data: D_B350_C8 }} />
      <Composition id="KcCovenants" component={LivestreamShort} durationInFrames={FRAMES_KC.covenants} fps={30} width={1080} height={1920} defaultProps={{ data: D_KC_COVENANTS }} />
      <Composition id="KcFirst" component={LivestreamShort} durationInFrames={FRAMES_KC.first} fps={30} width={1080} height={1920} defaultProps={{ data: D_KC_FIRST }} />
      <Composition id="KcEliza" component={LivestreamShort} durationInFrames={FRAMES_KC.eliza} fps={30} width={1080} height={1920} defaultProps={{ data: D_KC_ELIZA }} />
      <Composition id="KcKrc20" component={LivestreamShort} durationInFrames={FRAMES_KC.krc20} fps={30} width={1080} height={1920} defaultProps={{ data: D_KC_KRC20 }} />
      <Composition id="ZombieC1" component={LivestreamShort} durationInFrames={FRAMES_ZC.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_1 }} />
      <Composition id="ZombieC2" component={LivestreamShort} durationInFrames={FRAMES_ZC.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_2 }} />
      <Composition id="ZombieC3" component={LivestreamShort} durationInFrames={FRAMES_ZC.c3} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_3 }} />
      <Composition id="ZombieC4" component={LivestreamShort} durationInFrames={FRAMES_ZC.c4} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_4 }} />
      <Composition id="ZombieC5" component={LivestreamShort} durationInFrames={FRAMES_ZC.c5} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_5 }} />
      <Composition id="ZombieC6" component={LivestreamShort} durationInFrames={FRAMES_ZC.c6} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_6 }} />
      <Composition id="ZombieC7" component={LivestreamShort} durationInFrames={FRAMES_ZC.c7} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_7 }} />
      <Composition id="ZombieC8" component={LivestreamShort} durationInFrames={FRAMES_ZC.c8} fps={30} width={1080} height={1920} defaultProps={{ data: D_ZC_8 }} />
      <Composition id="BcmLearn" component={LivestreamShort} durationInFrames={FRAMES_BCM.learn} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_LEARN }} />
      <Composition id="BcmBreakage" component={LivestreamShort} durationInFrames={FRAMES_BCM.breakage} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_BREAKAGE }} />
      <Composition id="BcmTao" component={LivestreamShort} durationInFrames={FRAMES_BCM.tao} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_TAO }} />
      <Composition id="BcmBtc200" component={LivestreamShort} durationInFrames={FRAMES_BCM.btc200} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_BTC200 }} />
      <Composition id="BcmWhales" component={LivestreamShort} durationInFrames={FRAMES_BCM.whales} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_WHALES }} />
      <Composition id="BcmShitcoin" component={LivestreamShort} durationInFrames={FRAMES_BCM.shitcoin} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_SHITCOIN }} />
      <Composition id="BcmStopwait" component={LivestreamShort} durationInFrames={FRAMES_BCM.stopwait} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_STOPWAIT }} />
      <Composition id="Bcm1992" component={LivestreamShort} durationInFrames={FRAMES_BCM.c1992} fps={30} width={1080} height={1920} defaultProps={{ data: D_BCM_1992 }} />
      <Composition id="DilemmaC1" component={LivestreamShort} durationInFrames={FRAMES_DIL.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_DIL_1 }} />
      <Composition id="DilemmaC2" component={LivestreamShort} durationInFrames={FRAMES_DIL.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_DIL_2 }} />
      <Composition id="DilemmaC3" component={LivestreamShort} durationInFrames={FRAMES_DIL.c3} fps={30} width={1080} height={1920} defaultProps={{ data: D_DIL_3 }} />
      <Composition id="UhOhC1" component={LivestreamShort} durationInFrames={FRAMES_UH.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_UH_1 }} />
      <Composition id="UhOhC2" component={LivestreamShort} durationInFrames={FRAMES_UH.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_UH_2 }} />
      <Composition id="UhOhC3" component={LivestreamShort} durationInFrames={FRAMES_UH.c3} fps={30} width={1080} height={1920} defaultProps={{ data: D_UH_3 }} />
      <Composition id="UhOhC4" component={LivestreamShort} durationInFrames={FRAMES_UH.c4} fps={30} width={1080} height={1920} defaultProps={{ data: D_UH_4 }} />
      <Composition id="UhOhC5" component={LivestreamShort} durationInFrames={FRAMES_UH.c5} fps={30} width={1080} height={1920} defaultProps={{ data: D_UH_5 }} />
      <Composition id="UhOhC6" component={LivestreamShort} durationInFrames={FRAMES_UH.c6} fps={30} width={1080} height={1920} defaultProps={{ data: D_UH_6 }} />
      <Composition id="TigrKaspa" component={LivestreamShort} durationInFrames={FRAMES_TIGR.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_TIGR_1 }} />
      <Composition id="TigrBear" component={LivestreamShort} durationInFrames={FRAMES_TIGR.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_TIGR_2 }} />
      <Composition id="TigrTao" component={LivestreamShort} durationInFrames={FRAMES_TIGR.c3} fps={30} width={1080} height={1920} defaultProps={{ data: D_TIGR_3 }} />
      <Composition id="BcTao" component={LivestreamShort} durationInFrames={FRAMES_BC.tao} fps={30} width={1080} height={1920} defaultProps={{ data: D_BC_TAO }} />
      <Composition id="BcLab" component={LivestreamShort} durationInFrames={FRAMES_BC.lab} fps={30} width={1080} height={1920} defaultProps={{ data: D_BC_LAB }} />
      <Composition id="BcAi" component={LivestreamShort} durationInFrames={FRAMES_BC.ai} fps={30} width={1080} height={1920} defaultProps={{ data: D_BC_AI }} />
      <Composition id="BcLinea" component={LivestreamShort} durationInFrames={FRAMES_BC.linea} fps={30} width={1080} height={1920} defaultProps={{ data: D_BC_LINEA }} />
      <Composition id="MmExcavator" component={LivestreamShort} durationInFrames={FRAMES_MM.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_MM_1 }} />
      <Composition id="MmTao" component={LivestreamShort} durationInFrames={FRAMES_MM.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_MM_2 }} />
      <Composition id="MmSaylor" component={LivestreamShort} durationInFrames={FRAMES_MM.c3} fps={30} width={1080} height={1920} defaultProps={{ data: D_MM_3 }} />
      <Composition id="WcgAiJobs" component={LivestreamShort} durationInFrames={FRAMES_WCG.c1} fps={30} width={1080} height={1920} defaultProps={{ data: D_WCG_1 }} />
      <Composition id="WcgPunch" component={LivestreamShort} durationInFrames={FRAMES_WCG.c2} fps={30} width={1080} height={1920} defaultProps={{ data: D_WCG_2 }} />

      {/* kaspa 30bps (longform-edited) — the video, plus two chart-preview comps whose
          frame N renders source-time N/30 so a chart still can be checked in isolation. */}
      <Composition id="Kaspa40Bps" component={Kaspa40Bps} durationInFrames={K40_DURATION} fps={K40_FPS} width={1920} height={1080} />
      <Composition id="C1Preview" component={C1Preview} durationInFrames={14000} fps={30} width={1920} height={1080} />
      <Composition id="ChartsPreview" component={ChartsPreview} durationInFrames={14000} fps={30} width={1920} height={1080} />

      {/* kaspa 30bps VERTICAL (1080x1920) — same duration/fps/spine as the 16:9, reframed. */}
      <Composition id="Kaspa40Vertical" component={Kaspa40Vertical} durationInFrames={K40V_DURATION} fps={K40V_FPS} width={1080} height={1920} />
      <Composition id="Kaspa40Short" component={Kaspa40Short} durationInFrames={K40S_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="C1VPreview" component={C1VPreview} durationInFrames={14000} fps={30} width={1080} height={1920} />
      <Composition id="ChartsVPreview" component={ChartsVPreview} durationInFrames={14000} fps={30} width={1080} height={1920} />


      {/* ethereum-rwa (longform-edited) — 16:9, paused spine 12600f */}
      <Composition id="EthereumRwa" component={EthereumRwa} durationInFrames={ETH_DUR} fps={ETH_FPS} width={1920} height={1080} />

      {/* batch what-if-1000x / clip #2 — whatif-100x-bigger-than-brett (73.90 s @30) */}
      <Composition id="WhatifBiggerThanBrett" component={WhatifBiggerThanBrett} durationInFrames={W1BB_DURATION} fps={W1BB_FPS} width={1080} height={1920} />

      {/* batch what-if-1000x / clip #7 — whatif-100x-impact (12.567 s @30, impact cut) */}
      <Composition id="WhatIf7Impact" component={LivestreamShort} durationInFrames={WI7_FRAMES} fps={WI7_FPS} width={1080} height={1920} defaultProps={{ data: D_WI7 }} />

      {/* batch what-if-1000x / clip #3 — october-bottom-self-defeating (59.167 s @30) */}
      <Composition id="OctoberBottomSelfDefeating" component={LivestreamShort} durationInFrames={OBSD_FRAMES} fps={OBSD_FPS} width={1080} height={1920} defaultProps={{ data: D_OBSD }} />

      {/* batch what-if-1000x / clip #6 — 1000x-math-ladder-impact (24.20 s @30, impact cut) */}
      <Composition id="MathLadderImpact" component={MathLadderImpact} durationInFrames={MLI_DURATION} fps={MLI_FPS} width={1080} height={1920} />

      {/* batch october-bottom / clip #1 — october-mandela-myth (114.167 s @30) */}
      <Composition id="OctoberMandelaMyth" component={OctoberMandelaMyth} durationInFrames={OMM_DURATION} fps={OMM_FPS} width={1080} height={1920} />

      {/* batch october-bottom / clip #3 — whatif-organic-dogecoin (86.04 s @25, spine is native 25 fps) */}
      <Composition id="WhatifOrganicDogecoin" component={LivestreamShort} durationInFrames={WOD_FRAMES} fps={WOD_FPS} width={1080} height={1920} defaultProps={{ data: D_WOD }} />

      {/* batch october-bottom / clip #2 — kaspa-dip-bought-more (54.96 s @25, spine is native 25 fps) */}
      <Composition id="KaspaDipBoughtMore" component={LivestreamShort} durationInFrames={KDBM_FRAMES} fps={KDBM_FPS} width={1080} height={1920} defaultProps={{ data: D_KDBM }} />

      {/* batch october-bottom / clip #4 — ring-of-fire-meme-judgment (48.84 s @25, spine is native 25 fps) */}
      <Composition id="RingOfFireMemeJudgment" component={LivestreamShort} durationInFrames={ROF_FRAMES} fps={ROF_FPS} width={1080} height={1920} defaultProps={{ data: D_ROF }} />

      {/* batch october-bottom / clip #5 — cooper-robinhood-real-dog (66.20 s @25, spine is native 25 fps) */}
      <Composition id="CooperRobinhoodRealDog" component={LivestreamShort} durationInFrames={CRD_FRAMES} fps={CRD_FPS} width={1080} height={1920} defaultProps={{ data: D_CRD }} />

      {/* batch october-bottom / clip #7 — kaspa-dip-impact (13.36 s @25, spine is native 25 fps, IMPACT cut) */}
      <Composition id="KaspaDipImpact" component={LivestreamShort} durationInFrames={KDI_FRAMES} fps={KDI_FPS} width={1080} height={1920} defaultProps={{ data: D_KDI }} />
      <Composition id="PythonEp01" component={PythonEp01} durationInFrames={PY01_DUR} fps={PY01_FPS} width={1920} height={1080} />
      {/* the 9:16 cut of the same video — render with --public-dir media/python/assets-v */}
      <Composition id="PythonEp01Vertical" component={PythonEp01Vertical} durationInFrames={PY01V_DUR} fps={PY01V_FPS} width={1080} height={1920} />

      {/* batch eliza / clip #2 — phantom-hack (85.16 s spine @25, comp runs 30 fps) */}
      <Composition
        id="ElizaPhantomHack"
        component={ElizaPhantomHack}
        durationInFrames={EPH_DURATION}
        fps={EPH_FPS}
        width={1080}
        height={1920}
      />

      {/* batch eliza / clip #3 — trading-against-ourselves (95.26 s spine @25, comp runs 30 fps) */}
      <Composition
        id="ElizaTradingAgainstOurselves"
        component={ElizaTradingAgainstOurselves}
        durationInFrames={ETAO_DURATION}
        fps={ETAO_FPS}
        width={1080}
        height={1920}
      />

      {/* batch early-crash / clip #1 — akita-3b-robinhood (128.14 s spine @25, comp runs 30 fps) */}
      <Composition
        id="EcAkita3bRobinhood"
        component={EcAkita3bRobinhood}
        durationInFrames={EC_AKA_DURATION}
        fps={EC_AKA_FPS}
        width={1080}
        height={1920}
      />

      {/* batch early-crash / clip #4 — tendies-funny-stupid (34.509 s spine @25, comp runs 30 fps) */}
      <Composition
        id="EcTendiesFunnyStupid"
        component={EcTendiesFunnyStupid}
        durationInFrames={EC_TFS_DURATION}
        fps={EC_TFS_FPS}
        width={1080}
        height={1920}
      />

      {/* batch early-crash / clip #3 — way-off-moon-calls (32.24 s spine @25, comp runs 30 fps) */}
      <Composition
        id="EcWayOffMoonCalls"
        component={EcWayOffMoonCalls}
        durationInFrames={WOM_DURATION}
        fps={WOM_FPS}
        width={1080}
        height={1920}
      />

      {/* batch early-crash / clip #5 — endure-the-pain (32.032 s spine @25, comp runs 30 fps) */}
      <Composition
        id="EcEndureThePain"
        component={EcEndureThePain}
        durationInFrames={EC_ETP_DURATION}
        fps={EC_ETP_FPS}
        width={1080}
        height={1920}
      />

      {/* batch early-crash / clip #6 — akita-3b-robinhood-impact (30.77 s spine @25, comp runs 30 fps) */}
      <Composition
        id="EcAkitaImpact"
        component={EcAkitaImpact}
        durationInFrames={EC_AKI_DURATION}
        fps={EC_AKI_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #6 — tut-94x-euphoria-impact (28.22 s spine @25, comp runs 30 fps) */}
      <Composition
        id="TutEuphoriaImpact"
        component={TutEuphoriaImpact}
        durationInFrames={TUT6_DURATION}
        fps={TUT6_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #3 — binance-kaspa-catch22 (31.96 s spine @25, comp runs 30 fps) */}
      <Composition
        id="TutBinanceKaspaCatch22"
        component={TutBinanceKaspaCatch22}
        durationInFrames={TUT_BKC_DURATION}
        fps={TUT_BKC_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #1 — tut-94x-euphoria (78.83 s spine @25, comp runs 30 fps) */}
      <Composition
        id="TutTut94xEuphoria"
        component={TutTut94xEuphoria}
        durationInFrames={TUT94X_DURATION}
        fps={TUT94X_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #4 — freaking-early-not-degen (43.33 s spine @25, comp runs 30 fps) */}
      <Composition
        id="TutFreakingEarlyNotDegen"
        component={TutFreakingEarlyNotDegen}
        durationInFrames={TUT_FED_DURATION}
        fps={TUT_FED_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #8 — freaking-early-not-degen-impact (20.12 s spine @25, comp 30 fps) */}
      <Composition
        id="TutFreakingEarlyNotDegenImpact"
        component={TutFreakingEarlyNotDegenImpact}
        durationInFrames={TUT_FEI_DURATION}
        fps={TUT_FEI_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #2 — robinhood-meme-rankings (79.44 s spine @25, comp runs 30 fps) */}
      <Composition
        id="TutRobinhoodMemeRankings"
        component={TutRobinhoodMemeRankings}
        durationInFrames={TUT_RHM_DURATION}
        fps={TUT_RHM_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #5 — doginme-100x-if-500x (39.60 s spine @25, comp runs 30 fps) */}
      <Composition
        id="TutDoginme100x"
        component={TutDoginme100x}
        durationInFrames={TUT_DGN_DURATION}
        fps={TUT_DGN_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tutorial / clip #7 — binance-kaspa-catch22-impact (19.018 s spine @25, comp 30 fps) */}
      <Composition
        id="TutBinanceKaspaCatch22Impact"
        component={TutBinanceKaspaCatch22Impact}
        durationInFrames={TUT_BKI_DURATION}
        fps={TUT_BKI_FPS}
        width={1080}
        height={1920}
      />

      {/* batch last-year / clip #2 — lab-353x-underestimate (71.36 s spine @25, comp 30 fps) */}
      <Composition
        id="LastYearLab353xUnderestimate"
        component={LastYearLab353xUnderestimate}
        durationInFrames={LY_LAB_DURATION}
        fps={LY_LAB_FPS}
        width={1080}
        height={1920}
      />

      {/* batch last-year / clip #3 — kitsu-vlads-dog (87.52 s spine @25, comp 30 fps) */}
      <Composition
        id="LastYearKitsuVladsDog"
        component={LastYearKitsuVladsDog}
        durationInFrames={LYK_DURATION}
        fps={LYK_FPS}
        width={1080}
        height={1920}
      />

      {/* batch last-year / clip #1 — meme-fud-130x (86.337 s spine @25, comp 30 fps) */}
      <Composition
        id="LastYearMemeFud130x"
        component={LastYearMemeFud130x}
        durationInFrames={MFX_DURATION}
        fps={MFX_FPS}
        width={1080}
        height={1920}
      />

      {/* batch last-year / clip #4 — kaspa-excavator (67.06 s spine @25, comp 30 fps) */}
      <Composition
        id="LastYearKaspaExcavator"
        component={LastYearKaspaExcavator}
        durationInFrames={KEX_DURATION}
        fps={KEX_FPS}
        width={1080}
        height={1920}
      />

      {/* batch johnny / clip #1 — johnny-cash-button (62.80 s spine @25, comp 30 fps) */}
      <Composition
        id="JohnnyCashButton"
        component={JohnnyCashButton}
        durationInFrames={JCB_DURATION}
        fps={JCB_FPS}
        width={1080}
        height={1920}
      />

      {/* batch johnny / clip #2 — duck-vs-peanut (55.331 s spine @25, comp 30 fps) */}
      <Composition
        id="JohnnyDuckVsPeanut"
        component={JohnnyDuckVsPeanut}
        durationInFrames={JDVP_DURATION}
        fps={JDVP_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-50x / clip #7 — pmi-never-before (13.12 s spine @25, comp 30 fps) */}
      <Composition
        id="Cooper50xPmiNeverBefore"
        component={Cooper50xPmiNeverBefore}
        durationInFrames={C50P7_DURATION}
        fps={C50P7_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-50x / clip #2 — cooper-community-refused (22.680 s spine @25, comp 30 fps) */}
      <Composition
        id="C50xCommunityRefused"
        component={C50xCommunityRefused}
        durationInFrames={CCR_FRAMES}
        fps={CCR_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-50x / clip #8 — two-billies (67.360 s spine @25, comp 30 fps) */}
      <Composition
        id="C50xTwoBillies"
        component={C50xTwoBillies}
        durationInFrames={C50TB_FRAMES}
        fps={C50TB_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-50x / clip #6 — pmi-expansion-first (54.28 s spine @25, comp 30 fps) */}
      <Composition
        id="Cooper50xPmiExpansionFirst"
        component={Cooper50xPmiExpansionFirst}
        durationInFrames={C50P6_DURATION}
        fps={C50P6_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-50x / clip #3 — tut-rug-to-ath (108.440 s spine @25, comp 30 fps) */}
      <Composition
        id="C50xTutRugToAth"
        component={C50xTutRugToAth}
        durationInFrames={TRG_DURATION}
        fps={TRG_FPS}
        width={1080}
        height={1920}
      />

      {/* batch btc-next-week / clip #4 — dog-on-robinhood-impact (19.534 s spine @25, comp 30 fps) */}
      <Composition
        id="BtcnwDogOnRobinhoodImpact"
        component={BtcnwDogOnRobinhoodImpact}
        durationInFrames={DOG4_DURATION}
        fps={DOG4_FPS}
        width={1080}
        height={1920}
      />

      {/* batch btc-next-week / clip #2 — what-if-greatest-meme-impact (21.439 s spine @25, comp 30 fps) */}
      <Composition
        id="BtcnwWhatIfGreatestMemeImpact"
        component={BtcnwWhatIfGreatestMemeImpact}
        durationInFrames={WI2_DURATION}
        fps={WI2_FPS}
        width={1080}
        height={1920}
      />

      {/* batch btc-next-week / clip #1 — what-if-greatest-meme-full (86.574 s spine @25, comp 30 fps) */}
      <Composition
        id="BtcnwWhatIfGreatestMemeFull"
        component={BtcnwWhatIfGreatestMemeFull}
        durationInFrames={WIF1_DURATION}
        fps={WIF1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-cheerleaders / clip #3 — fake-software-company-scam-full (80.175 s spine @25, comp 30 fps) */}
      <Composition
        id="CcFakeSoftwareCompanyScam"
        component={CcFakeSoftwareCompanyScam}
        durationInFrames={CCF3_DURATION}
        fps={CCF3_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-cheerleaders / clip #6 — kaspa-more-than-5x-impact (21.000 s spine @25, comp 30 fps) */}
      <Composition
        id="CcheerKaspaMoreThan5xImpact"
        component={CcheerKaspaMoreThan5xImpact}
        durationInFrames={CC6_DURATION}
        fps={CC6_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-cheerleaders / clip #2 — kaspa-more-than-5x-full (79.200 s spine @25, comp 30 fps) */}
      <Composition
        id="CcheerKaspaMoreThan5xFull"
        component={CcheerKaspaMoreThan5xFull}
        durationInFrames={KM5F_DURATION}
        fps={KM5F_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-cheerleaders / clip #5 — thirty-dollar-wallet-full (69.739 s spine @25, comp 30 fps) */}
      <Composition
        id="CcheerThirtyDollarWallet"
        component={CcheerThirtyDollarWallet}
        durationInFrames={CC5_DURATION}
        fps={CC5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-cheerleaders / clip #1 — dog-on-robinhood-full (43.320 s spine @25, comp 30 fps) */}
      <Composition
        id="CchDogOnRobinhoodFull"
        component={CchDogOnRobinhoodFull}
        durationInFrames={CCH1_DURATION}
        fps={CCH1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch cooper-cheerleaders / clip #4 — kaspa-steak-dca-full (99.765 s spine @25, comp 30 fps) */}
      <Composition
        id="CcheerKaspaSteakDca"
        component={CcheerKaspaSteakDca}
        durationInFrames={KSTK_DURATION}
        fps={KSTK_FPS}
        width={1080}
        height={1920}
      />

      {/* batch back-in-ny / clip #4 — everything-at-27-million-impact (19.36 s spine @25, comp 30 fps) */}
      <Composition
        id="BackInNyEverythingAt27MillionImpact"
        component={BackInNyEverythingAt27MillionImpact}
        durationInFrames={BNY4_DURATION}
        fps={BNY4_FPS}
        width={1080}
        height={1920}
      />

      {/* batch back-in-ny / clip #1 — sold-cooper-rest-stop (103.680 s spine @25, comp 30 fps) */}
      <Composition
        id="BackInNySoldCooperRestStop"
        component={BackInNySoldCooperRestStop}
        durationInFrames={BNY1_DURATION}
        fps={BNY1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch back-in-ny / clip #5 — bots-back-to-life (56.040 s spine @25, comp 30 fps) */}
      <Composition
        id="BackInNyBotsBackToLife"
        component={BackInNyBotsBackToLife}
        durationInFrames={BNY5_DURATION}
        fps={BNY5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch everything-will-pump / clip #7 — dead-memes-comeback-impact (18.743 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpDeadMemesComebackImpact"
        component={EwpDeadMemesComebackImpact}
        durationInFrames={EWP7_DURATION}
        fps={EWP7_FPS}
        width={1080}
        height={1920}
      />

      {/* batch everything-will-pump / clip #1 — october-zombies-wealth-transfer (115.24 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpOctoberZombiesWealthTransfer"
        component={EwpOctoberZombiesWealthTransfer}
        durationInFrames={EWP1_DURATION}
        fps={EWP1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch everything-will-pump / clip #8 — kaspa-real-explosion-impact (20.68 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpKaspaRealExplosionImpact"
        component={EwpKaspaRealExplosionImpact}
        durationInFrames={EWP8_DURATION}
        fps={EWP8_FPS}
        width={1080}
        height={1920}
      />

      {/* batch everything-will-pump / clip #3 — kaspa-real-explosion FULL (47.080 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpKaspaRealExplosionFull"
        component={EwpKaspaRealExplosionFull}
        durationInFrames={EWP3_DURATION}
        fps={EWP3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch everything-will-pump / clip #6 - october-zombies-impact IMPACT (14.000 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpOctoberZombiesImpact"
        component={EwpOctoberZombiesImpact}
        durationInFrames={EWP6_DURATION}
        fps={EWP6_FPS}
        width={1080}
        height={1920}
      />
      {/* batch everything-will-pump / clip #4 - longevity-escape-velocity FULL (76.800 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpLongevityEscapeVelocity"
        component={EwpLongevityEscapeVelocity}
        durationInFrames={EWP4_DURATION}
        fps={EWP4_FPS}
        width={1080}
        height={1920}
      />
      {/* batch everything-will-pump / clip #5 - housecoin-free-publicity FULL (47.040 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpHousecoinFreePublicity"
        component={EwpHousecoinFreePublicity}
        durationInFrames={EWP5_DURATION}
        fps={EWP5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch everything-will-pump / clip #2 - dead-memes-comeback-receipts FULL (84.577 s spine @25, comp 30 fps) */}
      <Composition
        id="EwpDeadMemesReceipts"
        component={EwpDeadMemesReceipts}
        durationInFrames={EWP2_DURATION}
        fps={EWP2_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #6 - packed-my-new-100x-impact IMPACT (16.238 s spine @25, comp 30 fps) */}
      <Composition
        id="MnxPackedMyNew100xImpact"
        component={MnxPackedMyNew100xImpact}
        durationInFrames={MNX6_DURATION}
        fps={MNX6_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #1 - packed-my-new-100x FULL (77.960 s spine @25, comp 30 fps) */}
      <Composition
        id="MnPackedMyNew100x"
        component={MnPackedMyNew100x}
        durationInFrames={MN1_DURATION}
        fps={MN1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #8 - kaspa-lambo-color-argument FULL (57.040 s spine @25, comp 30 fps) */}
      <Composition
        id="MnxKaspaLamboColorArgument"
        component={MnxKaspaLamboColorArgument}
        durationInFrames={MNX8_DURATION}
        fps={MNX8_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #2 - profit-flywheel-bull-run FULL (55.000 s spine @25, comp 30 fps) */}
      <Composition
        id="MyNew100xProfitFlywheelBullRun"
        component={MyNew100xProfitFlywheelBullRun}
        durationInFrames={MN2_DURATION}
        fps={MN2_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #5 - boner-paired-with-hims FULL (34.600 s spine @25, comp 30 fps) */}
      <Composition
        id="MnxBonerPairedWithHims"
        component={MnxBonerPairedWithHims}
        durationInFrames={MNX5_DURATION}
        fps={MNX5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #3 - boomer-tokenized-stocks FULL (58.640 s spine @25, comp 30 fps) */}
      <Composition
        id="Mn100xBoomerTokenizedStocks"
        component={Mn100xBoomerTokenizedStocks}
        durationInFrames={MN3_DURATION}
        fps={MN3_FPS}
        width={1080}
        height={1920}
      />

      {/* batch my-new-100x / clip #4 - swole-cat-vlad-2021 FULL (44.760 s spine @25, comp 30 fps) */}
      <Composition
        id="Mnx100xSwoleCatVlad2021"
        component={Mnx100xSwoleCatVlad2021}
        durationInFrames={MNX4_DURATION}
        fps={MNX4_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tendies / clip #2 - doggy-mode-paired-with-tesla FULL (50.800 s spine @25, comp 30 fps) */}
      <Composition
        id="TndDoggieModePairedWithTesla"
        component={TndDoggieModePairedWithTesla}
        durationInFrames={TND2_DURATION}
        fps={TND2_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tendies / clip #4 - my-plays-run-to-a-billion FULL (77.800 s spine @25, comp 30 fps) */}
      <Composition
        id="TndMyPlaysRunToABillion"
        component={TndMyPlaysRunToABillion}
        durationInFrames={TND4_DURATION}
        fps={TND4_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tendies / clip #3 - tendies-crypto-com-ath FULL (46.000 s spine @25, comp 30 fps) */}
      <Composition
        id="TndTendiesCryptoComAth"
        component={TndTendiesCryptoComAth}
        durationInFrames={TND3_DURATION}
        fps={TND3_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tendies / clip #6 - artificial-inu-is-the-king-impact IMPACT
          (20.800 s spine @25, comp 30 fps = 624 frames) */}
      <Composition
        id="TndArtificialInuKingImpact"
        component={TndArtificialInuKingImpact}
        durationInFrames={TND6_DURATION}
        fps={TND6_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tendies / clip #5 - hayes-flipped-eth-flips-btc FULL
          (52.080 s spine @25, comp 30 fps = 1562 frames) */}
      <Composition
        id="TndHayesFlippedEthFlipsBtc"
        component={TndHayesFlippedEthFlipsBtc}
        durationInFrames={TND5_DURATION}
        fps={TND5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch tendies / clip #7 - doggy-mode-paired-with-tesla-impact IMPACT
          (25.560 s video track, comp 30 fps = 766 frames = 25.5333 s) */}
      <Composition
        id="TndDoggieModeTeslaImpact"
        component={TndDoggieModeTeslaImpact}
        durationInFrames={TND7_DURATION}
        fps={TND7_FPS}
        width={1080}
        height={1920}
      />

      {/* batch biggest-bullrun / clip #3 - pippin-dead-then-85x FULL
          (45.560 s video track @25, comp 30 fps = 1366 frames = 45.5333 s) */}
      <Composition
        id="BiggestBullrunPippinDead85x"
        component={BiggestBullrunPippinDead85x}
        durationInFrames={BBR3_DURATION}
        fps={BBR3_FPS}
        width={1080}
        height={1920}
      />

      {/* batch biggest-bullrun / clip #1 - fiat-debasement-minimum-wage-house FULL
          (76.5298 s video track @25.167, comp 30 fps = 2295 frames = 76.500 s) */}
      <Composition
        id="BiggestBullrunFiatDebasement"
        component={BiggestBullrunFiatDebasement}
        durationInFrames={BBR1_DURATION}
        fps={BBR1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch biggest-bullrun / clip #2 - youtube-10x-discord-100x FULL
          (96.080 s video track @25, comp 30 fps = 2882 frames = 96.0667 s) */}
      <Composition
        id="BiggestBullrunYoutube10xDiscord100x"
        component={BiggestBullrunYoutube10xDiscord100x}
        durationInFrames={BBR2_DURATION}
        fps={BBR2_FPS}
        width={1080}
        height={1920}
      />

      {/* batch biggest-bullrun / clip #4 - fiat-debasement-minimum-wage-house-impact IMPACT
          (27.880 s video track @24.964, comp 30 fps = 837 frames = 27.900 s) */}
      <Composition
        id="BiggestBullrunFiatDebasementImpact"
        component={BiggestBullrunFiatDebasementImpact}
        durationInFrames={BBR4_DURATION}
        fps={BBR4_FPS}
        width={1080}
        height={1920}
      />

      {/* batch biggest-bullrun / clip #7 - kaspa-fud-high-explosion FULL
          (45.760 s video track @25, comp 30 fps = 1372 frames = 45.7333 s) */}
      <Composition
        id="BiggestBullrunKaspaFudExplosion"
        component={BiggestBullrunKaspaFudExplosion}
        durationInFrames={BBR7_DURATION}
        fps={BBR7_FPS}
        width={1080}
        height={1920}
      />

      {/* batch biggest-bullrun / clip #8 - coin-about-farts-devs-funding FULL
          (53.000 s video track @25, comp 30 fps = 1590 frames = 53.000 s) */}
      <Composition
        id="BiggestBullrunCoinAboutFarts"
        component={BiggestBullrunCoinAboutFarts}
        durationInFrames={BBR8_DURATION}
        fps={BBR8_FPS}
        width={1080}
        height={1920}
      />

      {/* batch kaspa / clip #1 - kaspa-10-cents-vs-3-dollars FULL
          (48.120 s video track @25, comp 30 fps = 1443 frames = 48.1000 s) */}
      <Composition
        id="Kaspa10CentsVs3Dollars"
        component={Kaspa10CentsVs3Dollars}
        durationInFrames={KAS1_DURATION}
        fps={KAS1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch kaspa / clip #2 - some-things-dont-die FULL
          (1334-frame / 53.360 s video track @25, comp 30 fps = 1600 frames = 53.3333 s) */}
      <Composition
        id="KasSomeThingsDontDie"
        component={KasSomeThingsDontDie}
        durationInFrames={STDD_DURATION}
        fps={STDD_FPS}
        width={1080}
        height={1920}
      />
      {/* batch kaspa / clip #5 - foxy-linea-swift-bet FULL
          (950-frame / 38.240 s video track @25, audio 38.213 s; comp 30 fps = 1143 frames
           = 38.1000 s, last frame 1142 at 38.0667 s, inside both tracks) */}
      <Composition
        id="KaspaFoxyLineaSwiftBet"
        component={KaspaFoxyLineaSwiftBet}
        durationInFrames={FOX5_DURATION}
        fps={FOX5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch kaspa / clip #3 - tao-20000-not-unrealistic FULL
          (45.400 s video track @25, comp 30 fps = 1362 frames = 45.4000 s) */}
      <Composition
        id="KaspaTao20000NotUnrealistic"
        component={KaspaTao20000NotUnrealistic}
        durationInFrames={KAS3_DURATION}
        fps={KAS3_FPS}
        width={1080}
        height={1920}
      />

      {/* batch kaspa / clip #4 - 19x-14x-12x-7x-five-days FULL
          (55.800 s video track, comp 30 fps = 1674 frames = 55.8000 s) */}
      <Composition
        id="Kaspa19x14x12x7xFiveDays"
        component={Kaspa19x14x12x7xFiveDays}
        durationInFrames={KS4_DURATION}
        fps={KS4_FPS}
        width={1080}
        height={1920}
      />

      {/* batch kaspa / clip #6 - kaspa-10-cents-vs-3-dollars-impact IMPACT
          (21.080 s video track, comp 30 fps = 632 frames = 21.0667 s) */}
      <Composition
        id="Kaspa10CentsVs3DollarsImpact"
        component={Kaspa10CentsVs3DollarsImpact}
        durationInFrames={KAS6_DURATION}
        fps={KAS6_FPS}
        width={1080}
        height={1920}
      />

      {/* batch kaspa / clip #7 - tao-20000-not-unrealistic-impact IMPACT
          (27.440 s video track @25, comp 30 fps = 823 frames = 27.4333 s) */}
      <Composition
        id="KaspaTao20000NotUnrealisticImpact"
        component={KaspaTao20000NotUnrealisticImpact}
        durationInFrames={KAS7_DURATION}
        fps={KAS7_FPS}
        width={1080}
        height={1920}
      />
      {/* batch kaspa / clip #8 - 19x-14x-12x-7x-five-days-impact IMPACT
          (15.760 s video track @25, comp 30 fps = 473 frames = 15.7667 s) */}
      <Composition
        id="Kaspa19x14x12x7xFiveDaysImpact"
        component={Kaspa19x14x12x7xFiveDaysImpact}
        durationInFrames={KS8_DURATION}
        fps={KS8_FPS}
        width={1080}
        height={1920}
      />

      {/* batch silver / clip #1 - zombies-fomo-back-in-at-the-top FULL
          (38.040 s video / 38.018 s audio @25, comp 30 fps = 1141 frames = 38.0333 s) */}
      <Composition
        id="SilverZombiesFomoTop"
        component={SilverZombiesFomoTop}
        durationInFrames={SLV1_DURATION}
        fps={SLV1_FPS}
        width={1080}
        height={1920}
      />

      {/* batch silver / clip #2 - kaspa-not-fading-away FULL
          (46.240 s picture / 1156 frames @25, comp 30 fps = 1386 frames = 46.200 s) */}
      <Composition
        id="SilverKaspaNotFading"
        component={SilverKaspaNotFading}
        durationInFrames={SLV2_DURATION}
        fps={SLV2_FPS}
        width={1080}
        height={1920}
      />

      {/* batch silver / clip #3 - vlad-loves-it-so-it-pumps FULL
          (38.440 s picture / 961 frames @25, comp 30 fps = 1152 frames = 38.400 s) */}
      <Composition
        id="SilverVladPumps"
        component={SilverVladPumps}
        durationInFrames={SLV3_DURATION}
        fps={SLV3_FPS}
        width={1080}
        height={1920}
      />

      {/* batch silver / clip #5 - zombies-fomo-back-in-at-the-top-impact IMPACT
          (18.800 s video / 18.793 s audio @25, comp 30 fps = 564 frames = 18.8000 s) */}
      <Composition
        id="SilverZombiesFomoImpact"
        component={SilverZombiesFomoImpact}
        durationInFrames={SLV5_DURATION}
        fps={SLV5_FPS}
        width={1080}
        height={1920}
      />

      {/* batch silver / clip #7 - vlad-loves-it-so-it-pumps-impact IMPACT
          (21.320 s picture / 529 frames @25, audio 21.344 s, comp 30 fps = 639 frames = 21.300 s) */}
      <Composition
        id="SilverVladImpact"
        component={SilverVladImpact}
        durationInFrames={SLV7_DURATION}
        fps={SLV7_FPS}
        width={1080}
        height={1920}
      />

      {/* batch perpspad / clip #1 - perps-pad-did-a-90x-while-i-slept FULL
          (89.160 s container / 2211 frames @25, last pts 89.120 s, audio 89.174 s,
          comp 30 fps = 2674 frames = 89.133 s) */}
      <Composition
        id="PerpspadPerpsPad90x"
        component={PerpspadPerpsPad90x}
        durationInFrames={PPD1_DURATION}
        fps={PPD1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch perpspad / clip #2 - zombies-are-waiting-for-an-october-bottom-that-w FULL
          (49.000 s video / 1225 frames @25, audio 49.014 s, comp 30 fps = 1470 frames = 49.000 s) */}
      <Composition
        id="PerpspadZombiesOctober"
        component={PerpspadZombiesOctober}
        durationInFrames={PPZ2_DURATION}
        fps={PPZ2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch perpspad / clip #3 - kaspa-ran-57-off-a-level-i-thought-was-impossibl FULL
          (34.480 s video / 855 frames @25, audio 34.505 s, comp 30 fps = 1034 frames = 34.467 s) */}
      <Composition
        id="PerpspadKaspa57"
        component={PerpspadKaspa57}
        durationInFrames={PPK3_DURATION}
        fps={PPK3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #1 - perps-pad-110x FULL
          (855 frames @25, last video pts 34.360 s, audio 34.405 s, comp 30 fps = 1031 frames = 34.367 s) */}
      <Composition
        id="RfpPerpsPad110x"
        component={RfpPerpsPad110x}
        durationInFrames={RFP1_DURATION}
        fps={RFP1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #2 - stonk-season-pairing-evolution FULL
          (29.720 s video / 739 frames @25, audio 29.712 s, comp 30 fps = 891 frames = 29.700 s) */}
      <Composition
        id="RfpStonkSeason"
        component={RfpStonkSeason}
        durationInFrames={RFP2_DURATION}
        fps={RFP2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #3 - robots-crypto-foothold FULL
          (693 video frames @25 with VFR gaps, last pts 27.880 s, audio 27.929 s, comp 30 fps = 837 frames = 27.900 s) */}
      <Composition
        id="RfpRobotsCryptoFoothold"
        component={RfpRobotsCryptoFoothold}
        durationInFrames={RFP3_DURATION}
        fps={RFP3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #4 - asteroid-gold-crypto-dollar FULL
          (801 frames @25, last video pts 32.280 s, audio 32.309 s, comp 30 fps = 970 frames = 32.333 s) */}
      <Composition
        id="RfpAsteroidGold"
        component={RfpAsteroidGold}
        durationInFrames={RFP4_DURATION}
        fps={RFP4_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #5 - slippy-kaspa-tokens-revival FULL
          (784 frames @25 with VFR gaps, last video pts 31.400 s, audio 31.466 s, comp 30 fps = 942 frames = 31.400 s) */}
      <Composition
        id="RfpSlippyKaspa"
        component={RfpSlippyKaspa}
        durationInFrames={RFP5_DURATION}
        fps={RFP5_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #7 - robots-crypto-foothold-impact IMPACT
          (318 video frames @25 with 2 VFR splice gaps, last pts 12.800 s, audio 12.813 s, comp 30 fps = 384 frames = 12.800 s) */}
      <Composition
        id="RfpRobotsFootholdImpact"
        component={RfpRobotsFootholdImpact}
        durationInFrames={RFP7_DURATION}
        fps={RFP7_FPS}
        width={1080}
        height={1920}
      />
      {/* batch ready-for-pumps / clip #8 - asteroid-gold-crypto-dollar-impact IMPACT
          (361 video frames @25 with VFR splice gaps, last pts 14.520 s, audio 14.545 s, comp 30 fps = 436 frames = 14.533 s) */}
      <Composition
        id="RfpAsteroidGoldImpact"
        component={RfpAsteroidGoldImpact}
        durationInFrames={RFP8_DURATION}
        fps={RFP8_FPS}
        width={1080}
        height={1920}
      />
      {/* batch pieverse / clip #1 - pieverse-secret-gem-8x-another-10x FULL
          (1629 video frames @25, last video pts 65.640 s, audio 65.651 s, comp 30 fps = 1971 frames
           = 65.700 s so the closing word "true." is not clipped; last rendered frame 1970 = 65.667 s,
           inside the last video packet's [65.640, 65.680) span) */}
      <Composition
        id="PieverseSecretGem"
        component={PieverseSecretGem}
        durationInFrames={PV1_DURATION}
        fps={PV1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch pieverse / clip #2 - four-year-cycle-zombies-returned-early FULL
          (2740 video frames @25 = 110.680 s, audio 110.726 s, comp 30 fps = 3320 frames = 110.667 s;
           last rendered frame 3319 = 110.633 s, inside both tracks) */}
      <Composition
        id="PieverseZombiesReturnedEarly"
        component={PieverseZombiesReturnedEarly}
        durationInFrames={PVZ2_DURATION}
        fps={PVZ2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch pieverse / clip #3 - 110x-in-8-days-community-wins FULL
          (2517 video frames @25 = 101.360 s, audio 101.344 s, comp 30 fps = 3040 frames = 101.333 s;
           last rendered frame 3039 = 101.300 s, inside both tracks) */}
      <Composition
        id="Pieverse110xCommunityWins"
        component={Pieverse110xCommunityWins}
        durationInFrames={PV3_DURATION}
        fps={PV3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: archie-promo, clip #1 "archie-dumped-if-before-october" */}
      <Composition
        id="ArchiePromoDumpedIf"
        component={ArchiePromoDumpedIf}
        durationInFrames={AI1_DURATION}
        fps={AI1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch archie-promo / clip #2 - promo-code-archie FULL (861 fr @25 = 34.600 s; comp 1038 fr @30) */}
      <Composition
        id="ArchiePromoCodeArchie"
        component={ArchiePromoCodeArchie}
        durationInFrames={PA2_DURATION}
        fps={PA2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: archie-promo, clip #3 "sell-alerts-only-when-real" */}
      <Composition
        id="ArchiePromoSellAlerts"
        component={ArchiePromoSellAlerts}
        durationInFrames={SA3_DURATION}
        fps={SA3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch golden-kitty-dominance / clip #2 - four-year-cycle-zombies-pump-our-bags FULL (1428 fr @25 = 57.6 s; comp 1727 fr @30) */}
      <Composition
        id="GoldenKittyDomZombiesPumpBags"
        component={GoldenKittyDomZombiesPumpBags}
        durationInFrames={GKD2_DURATION}
        fps={GKD2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch golden-kitty-dominance / clip #1 - golden-kitty-only-meme-doing-anything FULL (78.40 s @25; comp 2353 fr @30) */}
      <Composition
        id="GoldenKittyDomOnlyMeme"
        component={GoldenKittyDomOnlyMeme}
        durationInFrames={GKD1_DURATION}
        fps={GKD1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch golden-kitty-dominance / clip #3 - called-550x-then-bought-the-top FULL (1135 fr @25 = 45.76 s; comp 1372 fr @30) */}
      <Composition
        id="GoldenKittyDomCalled550x"
        component={GoldenKittyDomCalled550x}
        durationInFrames={GKD3_DURATION}
        fps={GKD3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch beer-and-kaspa / clip #2 - golden-kitty-8-million FULL (538 fr @25 = 21.655 s; comp 649 fr @30) */}
      <Composition
        id="BeerKaspaGoldenKitty8M"
        component={BeerKaspaGoldenKitty8M}
        durationInFrames={BK2_DURATION}
        fps={BK2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: beer-and-kaspa, clip #1 "kaspa-bear-called-1-cent" */}
      <Composition
        id="BeerKaspaBearCalled1Cent"
        component={BeerKaspaBearCalled1Cent}
        durationInFrames={KB1_DURATION}
        fps={KB1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: beer-and-kaspa, clip #3 "first-vprog-live-on-kaspa" */}
      <Composition
        id="BeerKaspaFirstVprogLive"
        component={BeerKaspaFirstVprogLive}
        durationInFrames={VP3_DURATION}
        fps={VP3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch: beer-and-kaspa, clip #4 "114x-in-eight-days" (1588 fr @25 = 63.886 s; comp 1916 fr @30) */}
      <Composition
        id="BeerKaspa114xEightDays"
        component={BeerKaspa114xEightDays}
        durationInFrames={BK4_DURATION}
        fps={BK4_FPS}
        width={1080}
        height={1920}
      />
      {/* longform-edited: kaspa-vprogs (1920x1080 @30, DUR = paused spine 6175 fr) */}
      <Composition
        id="KaspaVprogs"
        component={KaspaVprogs}
        durationInFrames={KVP_DUR}
        fps={KVP_FPS}
        width={1920}
        height={1080}
      />
      {/* longform-edited VERTICAL: kaspa-vprogs 9:16 twin (1080x1920 @30, same DUR; --public-dir assets/vertical) */}
      <Composition
        id="KaspaVprogsVertical"
        component={KaspaVprogsVertical}
        durationInFrames={KVPV_DUR}
        fps={KVPV_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
