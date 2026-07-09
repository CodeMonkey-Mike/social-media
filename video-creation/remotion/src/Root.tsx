import React from 'react';
import { Composition } from 'remotion';
import { CRankChart } from './kaspaFounderCharts';
import { KaspaFounderGenius, KF_DURATION, KF_FPS } from './KaspaFounderGenius';
import { MikeTysonKaspa } from './MikeTysonKaspa';
import { FourYearCycleZombies } from './FourYearCycleZombies';
import { Kaspa3Dollar } from './Kaspa3Dollar';
import { ToccataExplained } from './ToccataExplained';
import { KaspaHardFork } from './KaspaHardFork';
import { AiJobMarket } from './AiJobMarket';
import { MemeBearMarket } from './MemeBearMarket';
import { MemeHolds } from './MemeHolds';
import { TaoAiPlay } from './TaoAiPlay';
import { XrpVsKaspa } from './XrpVsKaspa';
import { PenguFlipsPepe } from './PenguFlipsPepe';
import { AiWhiteCollar } from './AiWhiteCollar';
import { HuntVirusRug } from './HuntVirusRug';
import { MicroStrategyTon } from './MicroStrategyTon';
import { KaspaIso } from './KaspaIso';
import { KaspaEntry } from './KaspaEntry';
import { IdeasCemetery } from './IdeasCemetery';
import { WebcamRugCycle } from './WebcamRugCycle';
import { Why200Rugging } from './Why200Rugging';
import { NoNewMemes } from './NoNewMemes';
import { StablecoinYield } from './StablecoinYield';
import { SuiFavorites } from './SuiFavorites';
import { CoinmarketcapTest } from './CoinmarketcapTest';
import { HumanDrivingIllegal } from './HumanDrivingIllegal';
import { BullsAreSleeping } from './BullsAreSleeping';
import { PriceVsTech } from './PriceVsTech';
import { HeardOfKaspaBrah } from './HeardOfKaspaBrah';
import { EthFlipsBtc } from './EthFlipsBtc';
import { KeycatDoginme } from './KeycatDoginme';
import { HouseCoin1000x } from './HouseCoin1000x';
import { Pythia28x } from './Pythia28x';
import { StopHating } from './StopHating';
import { PenguFlipsPepeMC } from './PenguFlipsPepeMC';
import { CryptoPromo } from './CryptoPromo';
import { YuliCrypto1, FPS_YULI, FRAMES_YULI } from './YuliCrypto1';
import { AnaToccata, ANA_FPS, ANA_FRAMES } from './AnaToccata';
import { WiseManIntro } from './WiseManIntro';
import { WiseManFl07 } from './WiseManFl07';
import { LivestreamRepurpose } from './LivestreamRepurpose';
import { QeMoneyPrinterPoc } from './QeMoneyPrinterPoc';
import { QeMoneyPrinter, QE_FPS, QE_DURATION } from './QeMoneyPrinter';
import { ZcashHack, ZC_FPS, ZC_DURATION } from './ZcashHack';
import { BanksOwnChain, BOC_FPS, BOC_DURATION } from './BanksOwnChain';
import { SilverScript, SS_FPS, SS_DURATION } from './SilverScript';
import { SmChartsPreview, SMCHARTS_FPS, SMCHARTS_FRAMES } from './SmCharts';
import { SmartMoneyKaspa, SMK_FPS, SMK_DURATION } from './SmartMoneyKaspa';
import { SmChartsAnimPreview, SMCA_FPS, SMCA_FRAMES } from './SmChartsAnim';
import { SmkCh13, SMKC_FPS, SMKC_DURATION } from './SmkCh13';
import { SmkFull, SMKF_FPS, SMKF_DURATION } from './SmkFull';
import { CarryTradeFull, CT_FPS, CT_DURATION } from './CarryTradeFull';
import { CarryTradeVertical, CTV_FPS, CTV_DURATION } from './CarryTradeVertical';
import { KaspaCovenants, KC_FPS, KC_DURATION } from './KaspaCovenants';
import { KaspaCovenantsShort, KCS_FPS, KCS_DURATION } from './KaspaCovenantsShort';
import { KaspaCovenantsYuli, KCY_FPS, KCY_DURATION } from './KaspaCovenantsYuli';
import { BittensorCh1to6, B_FPS, B_DURATION } from './BittensorCh1to6';
import { WhyAiPython, WAP_FPS, WAP_DURATION } from './WhyAiPython';
import { PythonAiLibs, PAL_FPS, PAL_DURATION } from './PythonAiLibs';
import { PythonAiLibsVertical, PALV_FPS, PALV_DURATION } from './PythonAiLibsVertical';
import { NeedLangGraph, NLG_FPS_EXPORT, NLG_DURATION } from './NeedLangGraph';
import { NeedLangGraphVertical, NLGV_FPS_EXPORT, NLGV_DURATION } from './NeedLangGraphVertical';
import { LivestreamShort } from './LivestreamShort';
import { CommunityReceipts } from './CommunityReceipts';
import { CR_FPS, CR_DURATION } from './constants-creceipts';
import { CommunityReceiptsImpact } from './CommunityReceiptsImpact';
import { CRI_FPS, CRI_DURATION } from './constants-creceipts-impact';
import { FourYearCycleReligion } from './FourYearCycleReligion';
import { FYC_FPS, FYC_DURATION } from './constants-fyc';
import { FourYearCycleReligionImpact } from './FourYearCycleReligionImpact';
import { FYCI_FPS, FYCI_DURATION } from './constants-fyci';
import { OctoberWillBeGreen } from './OctoberWillBeGreen';
import { OWBG_FPS, OWBG_DURATION } from './constants-owbg';
import { BitcoinInflationYearFive } from './BitcoinInflationYearFive';
import { BIYF_FPS, BIYF_DURATION } from './constants-biyf';
import { LongevityEscapeVelocity } from './LongevityEscapeVelocity';
import { LEV_FPS, LEV_DURATION } from './constants-lev';
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
import { TOTAL_FRAMES, FPS_FYCZ } from './constants-fycz';
import { TOTAL_FRAMES_K3D, FPS_K3D } from './constants-k3d';
import { TOTAL_FRAMES_T, FPS_T } from './constants-toccata';
import { TOTAL_FRAMES_KHF, FPS_KHF } from './constants-khf';
import { TOTAL_FRAMES_AIJM, FPS_AIJM } from './constants-aijm';
import { TOTAL_FRAMES_MBM, FPS_MBM } from './constants-mbm';
import { TOTAL_FRAMES_MH, FPS_MH } from './constants-mh';
import { TOTAL_FRAMES_TAO, FPS_TAO } from './constants-tao';
import { TOTAL_FRAMES_XRPK, FPS_XRPK } from './constants-xrpk';
import { TOTAL_FRAMES_PENGU, FPS_PENGU } from './constants-pengu';
import { TOTAL_FRAMES_AIWC, FPS_AIWC } from './constants-aiwc';
import { TOTAL_FRAMES_RUG, FPS_RUG } from './constants-rug';
import { TOTAL_FRAMES_TON, FPS_TON } from './constants-ton';
import { TOTAL_FRAMES_ISO, FPS_ISO } from './constants-iso';
import { TOTAL_FRAMES_ENTRY, FPS_ENTRY } from './constants-entry';
import { TOTAL_FRAMES_CEMETERY, FPS_CEMETERY } from './constants-cemetery';
import { TOTAL_FRAMES_CYCLE, FPS_CYCLE } from './constants-cycle';
import { TOTAL_FRAMES_WHY200, FPS_WHY200 } from './constants-why200';
import { TOTAL_FRAMES_NOMEMES, FPS_NOMEMES } from './constants-nomemes';
import { TOTAL_FRAMES_STABLE, FPS_STABLE } from './constants-stable';
import { TOTAL_FRAMES_SUI, FPS_SUI } from './constants-sui';
import { TOTAL_FRAMES_CMC, FPS_CMC } from './constants-cmc';
import { TOTAL_FRAMES_SELFDRIVE, FPS_SELFDRIVE } from './constants-selfdrive';
import { TOTAL_FRAMES_BULLS, FPS_BULLS } from './constants-bulls';
import { TOTAL_FRAMES_PVT, FPS_PVT } from './constants-pvt';
import { TOTAL_FRAMES_HKB, FPS_HKB } from './constants-hkb';
import { TOTAL_FRAMES_ETHF, FPS_ETHF } from './constants-ethf';
import { TOTAL_FRAMES_DOGINME, FPS_DOGINME } from './constants-doginme';
import { TOTAL_FRAMES_HOUSE, FPS_HOUSE } from './constants-house';
import { TOTAL_FRAMES_PYTHIA, FPS_PYTHIA } from './constants-pythia';
import { TOTAL_FRAMES_STOPHATE, FPS_STOPHATE } from './constants-stophate';
import { TOTAL_FRAMES_PENGUMC, FPS_PENGUMC } from './constants-pengu-mc';

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
        id="MikeTysonKaspa"
        component={MikeTysonKaspa}
        durationInFrames={3300}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FourYearCycleZombies"
        component={FourYearCycleZombies}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS_FYCZ}
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
      <Composition
        id="CommunityReceiptsImpact"
        component={CommunityReceiptsImpact}
        durationInFrames={CRI_DURATION}
        fps={CRI_FPS}
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
      <Composition
        id="BitcoinInflationYearFive"
        component={BitcoinInflationYearFive}
        durationInFrames={BIYF_DURATION}
        fps={BIYF_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="LongevityEscapeVelocity"
        component={LongevityEscapeVelocity}
        durationInFrames={LEV_DURATION}
        fps={LEV_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Kaspa3Dollar"
        component={Kaspa3Dollar}
        durationInFrames={TOTAL_FRAMES_K3D}
        fps={FPS_K3D}
        width={1080}
        height={1920}
      />
      <Composition
        id="ToccataExplained"
        component={ToccataExplained}
        durationInFrames={TOTAL_FRAMES_T}
        fps={FPS_T}
        width={1080}
        height={1920}
      />
      <Composition
        id="KaspaHardFork"
        component={KaspaHardFork}
        durationInFrames={TOTAL_FRAMES_KHF}
        fps={FPS_KHF}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiJobMarket"
        component={AiJobMarket}
        durationInFrames={TOTAL_FRAMES_AIJM}
        fps={FPS_AIJM}
        width={1080}
        height={1920}
      />
      <Composition
        id="MemeBearMarket"
        component={MemeBearMarket}
        durationInFrames={TOTAL_FRAMES_MBM}
        fps={FPS_MBM}
        width={1080}
        height={1920}
      />
      <Composition
        id="MemeHolds"
        component={MemeHolds}
        durationInFrames={TOTAL_FRAMES_MH}
        fps={FPS_MH}
        width={1080}
        height={1920}
      />
      <Composition
        id="TaoAiPlay"
        component={TaoAiPlay}
        durationInFrames={TOTAL_FRAMES_TAO}
        fps={FPS_TAO}
        width={1080}
        height={1920}
      />
      <Composition
        id="XrpVsKaspa"
        component={XrpVsKaspa}
        durationInFrames={TOTAL_FRAMES_XRPK}
        fps={FPS_XRPK}
        width={1080}
        height={1920}
      />
      <Composition
        id="PenguFlipsPepe"
        component={PenguFlipsPepe}
        durationInFrames={TOTAL_FRAMES_PENGU}
        fps={FPS_PENGU}
        width={1080}
        height={1920}
      />
      <Composition
        id="AiWhiteCollar"
        component={AiWhiteCollar}
        durationInFrames={TOTAL_FRAMES_AIWC}
        fps={FPS_AIWC}
        width={1080}
        height={1920}
      />
      <Composition
        id="HuntVirusRug"
        component={HuntVirusRug}
        durationInFrames={TOTAL_FRAMES_RUG}
        fps={FPS_RUG}
        width={1080}
        height={1920}
      />
      <Composition
        id="MicroStrategyTon"
        component={MicroStrategyTon}
        durationInFrames={TOTAL_FRAMES_TON}
        fps={FPS_TON}
        width={1080}
        height={1920}
      />
      <Composition id="KaspaIso" component={KaspaIso} durationInFrames={TOTAL_FRAMES_ISO} fps={FPS_ISO} width={1080} height={1920} />
      <Composition id="KaspaEntry" component={KaspaEntry} durationInFrames={TOTAL_FRAMES_ENTRY} fps={FPS_ENTRY} width={1080} height={1920} />
      <Composition id="IdeasCemetery" component={IdeasCemetery} durationInFrames={TOTAL_FRAMES_CEMETERY} fps={FPS_CEMETERY} width={1080} height={1920} />
      <Composition id="WebcamRugCycle" component={WebcamRugCycle} durationInFrames={TOTAL_FRAMES_CYCLE} fps={FPS_CYCLE} width={1080} height={1920} />
      <Composition id="Why200Rugging" component={Why200Rugging} durationInFrames={TOTAL_FRAMES_WHY200} fps={FPS_WHY200} width={1080} height={1920} />
      <Composition id="NoNewMemes" component={NoNewMemes} durationInFrames={TOTAL_FRAMES_NOMEMES} fps={FPS_NOMEMES} width={1080} height={1920} />
      <Composition id="StablecoinYield" component={StablecoinYield} durationInFrames={TOTAL_FRAMES_STABLE} fps={FPS_STABLE} width={1080} height={1920} />
      <Composition id="SuiFavorites" component={SuiFavorites} durationInFrames={TOTAL_FRAMES_SUI} fps={FPS_SUI} width={1080} height={1920} />
      <Composition id="CoinmarketcapTest" component={CoinmarketcapTest} durationInFrames={TOTAL_FRAMES_CMC} fps={FPS_CMC} width={1080} height={1920} />
      <Composition id="HumanDrivingIllegal" component={HumanDrivingIllegal} durationInFrames={TOTAL_FRAMES_SELFDRIVE} fps={FPS_SELFDRIVE} width={1080} height={1920} />
      <Composition id="BullsAreSleeping" component={BullsAreSleeping} durationInFrames={TOTAL_FRAMES_BULLS} fps={FPS_BULLS} width={1080} height={1920} />
      <Composition id="PriceVsTech" component={PriceVsTech} durationInFrames={TOTAL_FRAMES_PVT} fps={FPS_PVT} width={1080} height={1920} />
      <Composition id="HeardOfKaspaBrah" component={HeardOfKaspaBrah} durationInFrames={TOTAL_FRAMES_HKB} fps={FPS_HKB} width={1080} height={1920} />
      <Composition id="EthFlipsBtc" component={EthFlipsBtc} durationInFrames={TOTAL_FRAMES_ETHF} fps={FPS_ETHF} width={1080} height={1920} />
      <Composition id="KeycatDoginme" component={KeycatDoginme} durationInFrames={TOTAL_FRAMES_DOGINME} fps={FPS_DOGINME} width={1080} height={1920} />
      <Composition id="HouseCoin1000x" component={HouseCoin1000x} durationInFrames={TOTAL_FRAMES_HOUSE} fps={FPS_HOUSE} width={1080} height={1920} />
      <Composition id="Pythia28x" component={Pythia28x} durationInFrames={TOTAL_FRAMES_PYTHIA} fps={FPS_PYTHIA} width={1080} height={1920} />
      <Composition id="StopHating" component={StopHating} durationInFrames={TOTAL_FRAMES_STOPHATE} fps={FPS_STOPHATE} width={1080} height={1920} />
      <Composition id="PenguFlipsPepeMC" component={PenguFlipsPepeMC} durationInFrames={TOTAL_FRAMES_PENGUMC} fps={FPS_PENGUMC} width={1080} height={1920} />
      <Composition id="CryptoPromo" component={CryptoPromo} durationInFrames={2289} fps={30} width={1080} height={1920} />
      <Composition id="YuliCrypto1" component={YuliCrypto1} durationInFrames={FRAMES_YULI} fps={FPS_YULI} width={1080} height={1920} />
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
      <Composition id="AnaToccata" component={AnaToccata} durationInFrames={ANA_FRAMES} fps={ANA_FPS} width={1080} height={1920} />
      <Composition id="QeMoneyPrinterPoc" component={QeMoneyPrinterPoc} durationInFrames={1290} fps={30} width={1920} height={1080} />
      <Composition id="QeMoneyPrinter" component={QeMoneyPrinter} durationInFrames={QE_DURATION} fps={QE_FPS} width={1920} height={1080} />
      <Composition id="ZcashHack" component={ZcashHack} durationInFrames={ZC_DURATION} fps={ZC_FPS} width={1920} height={1080} />
      <Composition id="BanksOwnChain" component={BanksOwnChain} durationInFrames={BOC_DURATION} fps={BOC_FPS} width={1920} height={1080} />
      <Composition id="SilverScript" component={SilverScript} durationInFrames={SS_DURATION} fps={SS_FPS} width={1920} height={1080} />
      <Composition id="SmChartsPreview" component={SmChartsPreview} durationInFrames={SMCHARTS_FRAMES} fps={SMCHARTS_FPS} width={1920} height={1080} />
      <Composition id="SmartMoneyKaspa" component={SmartMoneyKaspa} durationInFrames={SMK_DURATION} fps={SMK_FPS} width={1920} height={1080} />
      <Composition id="SmChartsAnimPreview" component={SmChartsAnimPreview} durationInFrames={SMCA_FRAMES} fps={SMCA_FPS} width={1920} height={1080} />
      <Composition id="SmkCh13" component={SmkCh13} durationInFrames={SMKC_DURATION} fps={SMKC_FPS} width={1920} height={1080} />
      <Composition id="SmkFull" component={SmkFull} durationInFrames={SMKF_DURATION} fps={SMKF_FPS} width={1920} height={1080} />
      <Composition id="KaspaCovenants" component={KaspaCovenants} durationInFrames={KC_DURATION} fps={KC_FPS} width={1920} height={1080} />
      <Composition id="KaspaCovenantsShort" component={KaspaCovenantsShort} durationInFrames={KCS_DURATION} fps={KCS_FPS} width={1080} height={1920} />
      <Composition id="KaspaCovenantsYuli" component={KaspaCovenantsYuli} durationInFrames={KCY_DURATION} fps={KCY_FPS} width={1080} height={1920} />
      <Composition id="BittensorCh1to6" component={BittensorCh1to6} durationInFrames={B_DURATION} fps={B_FPS} width={1920} height={1080} />
      <Composition id="CRankTest" component={CRankChart} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="KaspaFounderGenius" component={KaspaFounderGenius} durationInFrames={KF_DURATION} fps={KF_FPS} width={1920} height={1080} />
      <Composition id="WhyAiPython" component={WhyAiPython} durationInFrames={WAP_DURATION} fps={WAP_FPS} width={1920} height={1080} />
      <Composition id="PythonAiLibs" component={PythonAiLibs} durationInFrames={PAL_DURATION} fps={PAL_FPS} width={1920} height={1080} />
      <Composition id="PythonAiLibsVertical" component={PythonAiLibsVertical} durationInFrames={PALV_DURATION} fps={PALV_FPS} width={1080} height={1920} />
      <Composition id="NeedLangGraph" component={NeedLangGraph} durationInFrames={NLG_DURATION} fps={NLG_FPS_EXPORT} width={1920} height={1080} />
      <Composition id="NeedLangGraphVertical" component={NeedLangGraphVertical} durationInFrames={NLGV_DURATION} fps={NLGV_FPS_EXPORT} width={1080} height={1920} />
      <Composition id="WiseManIntro" component={WiseManIntro} durationInFrames={999} fps={30} width={1080} height={1920} />
      <Composition id="WiseManFl07" component={WiseManFl07} durationInFrames={517} fps={30} width={1080} height={1920} />
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
      <Composition
        id="LivestreamRepurpose"
        component={LivestreamRepurpose}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          // Proxy cut starting at screenshot timecode 00:07:49.467, so frame 0
          // of this comp == the Premiere program-monitor reference frame.
          src: 'livestream-repurpose/proxy-0749.mp4',
          trimBefore: 0,
        }}
      />
    </>
  );
};
