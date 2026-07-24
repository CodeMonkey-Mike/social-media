import React from 'react';
import { Composition } from 'remotion';
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      {/* batch: October-pumps, clip #4 "Some Of These Things Could Run" (variant: full) */}
      <Composition
        id="RallyBasketNinehoodCashcat"
        component={RallyBasketNinehoodCashcat}
        durationInFrames={RB_DURATION}
        fps={RB_FPS}
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
      
    </>
  );
};
