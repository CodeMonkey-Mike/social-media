import React from 'react';
import { Composition } from 'remotion';
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
    </>
  );
};
