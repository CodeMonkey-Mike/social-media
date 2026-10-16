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
import { NeedLangGraph, NLG_FPS_EXPORT, NLG_DURATION } from './NeedLangGraph';
import { NeedLangGraphVertical, NLGV_FPS_EXPORT, NLGV_DURATION } from './NeedLangGraphVertical';
import { SaveTokens, SAVETOK_FPS_EXPORT, SAVETOK_DURATION } from './SaveTokens';
import { SaveTokensVertical, SAVETOKV_FPS_EXPORT, SAVETOKV_DURATION } from './SaveTokensVertical';
import { LivestreamShort } from './LivestreamShort';
import { TransitionDemo, demoDurationFrames } from './TransitionDemo';
import { TransitionTest } from './TransitionTest';
import { EthereumRwa, DUR as ETH_DUR, FPS as ETH_FPS } from './EthereumRwa';
import { PythonEp01, DUR as PY01_DUR, FPS as PY01_FPS } from './PythonEp01';
import { PythonEp01Vertical, DUR as PY01V_DUR, FPS as PY01V_FPS } from './PythonEp01Vertical';
// batch uptober / clip #1 - spawn-doubled-for-the-haters FULL (2026-10-01). Flat-namespace check: no existing
// UptoberSpawnDoubled / UPT1_ / captionsUptoberSpawnDoubled / broll-upt1 / thumb-upt1 / ovl-upt1.
import { UptoberSpawnDoubled, UPT1_FPS, UPT1_DURATION } from './UptoberSpawnDoubled';
// batch uptober / clip #2 - pippin-went-dead-then-89x FULL (2026-10-01). Flat-namespace check: no existing
// UptoberPippin89x / PIP2_ / captionsUptoberPippin89x / broll-pip2 / thumb-pip2 / ovl-pip2.
import { UptoberPippin89x, PIP2_FPS, PIP2_DURATION } from './UptoberPippin89x';
// batch uptober / clip #3 - no-job-is-safe-robots FULL (2026-10-01). Flat-namespace check: no existing
// UptoberNoJobSafe / NJ3_ / captionsUptoberNoJobSafe / broll-nj3 / thumb-nj3 / ovl-nj3.
import { UptoberNoJobSafe, NJ3_FPS, NJ3_DURATION } from './UptoberNoJobSafe';
// batch uptober / clip #5 golden-kitty-50-million FULL.
// UptoberGoldenKitty50M / GK5_ / captionsUptoberGoldenKitty50M / broll-gk5 / thumb-gk5 / ovl-gk5.
import { UptoberGoldenKitty50M, GK5_FPS, GK5_DURATION } from './UptoberGoldenKitty50M';
// batch uptober / clip #6 october-coins-first-week-pump FULL (2026-10-01). Flat-namespace check: no existing
// UptoberOctoberCoins / OC6_ / captionsUptoberOctoberCoins / broll-oc6 / thumb-oc6.
import { UptoberOctoberCoins, OC6_FPS, OC6_DURATION } from './UptoberOctoberCoins';
// batch uptober / clip #7 no-job-is-safe-robots-impact IMPACT (2026-10-01). Flat-namespace check: no existing
// UptoberNoJobSafeImpact / NJ7_ / captionsUptoberNoJobSafeImpact / broll-nj7 / thumb-nj7 / ovl-nj7.
import { UptoberNoJobSafeImpact, NJ7_FPS, NJ7_DURATION } from './UptoberNoJobSafeImpact';

// batch grapes / clip #3 golden-kitty-one-of-five-impact IMPACT (2026-10-05). Flat-namespace check: no existing
// GrapesGoldenKittyOneOfFiveImpact / GK3_ / captionsGrapesGoldenKittyOneOfFiveImpact / broll-gk3 / thumb-gk3.
import { GrapesGoldenKittyOneOfFiveImpact, GK3_FPS, GK3_DURATION } from './GrapesGoldenKittyOneOfFiveImpact';

import { KaspaVprogs, DUR as KVP_DUR, FPS as KVP_FPS } from './KaspaVprogs';
import { KaspaVprogsVertical, DUR as KVPV_DUR, FPS as KVPV_FPS } from './KaspaVprogsVertical';
import { KaspaVprogsShort, DUR as KVPS_DUR, FPS as KVPS_FPS } from './KaspaVprogsShort';
import { GoldenKitty, DUR as GK_DUR, FPS as GK_FPS } from './GoldenKitty';
import { GoldenKittyVertical, DUR as GKV_DUR, FPS as GKV_FPS } from './GoldenKittyVertical';
import { GoldenKittyShort, DUR as GKS_DUR, FPS as GKS_FPS } from './GoldenKittyShort';
// batch bull-trap / clip #3 - spon-didnt-sell-holding-the-line FULL (2026-10-03). Flat-namespace check: no existing
// BullTrapSponDidntSell / BT3_ / captionsBullTrapSponDidntSell / broll-bt3 / thumb-bt3 / ovl-bt3.
import { BullTrapSponDidntSell, BT3_FPS, BT3_DURATION } from './BullTrapSponDidntSell';
// batch bull-trap / clip #2 - golden-kitty-10-million-while-everything-bleeds FULL (2026-10-03). Flat-namespace check: no
// existing BullTrapGoldenKitty10M / BT2_ / captionsBullTrapGoldenKitty10M / broll-bt2 / thumb-bt2 / ovl-bt2.
import { BullTrapGoldenKitty10M, BT2_FPS, BT2_DURATION } from './BullTrapGoldenKitty10M';
// batch bull-trap / clip #4 - october-bottom-talk-is-gone FULL (2026-10-03). Flat-namespace check: no existing
// BullTrapOctoberBottomGone / BT4_ / captionsBullTrapOctoberBottomGone / broll-bt4 / thumb-bt4.
import { BullTrapOctoberBottomGone, BT4_FPS, BT4_DURATION } from './BullTrapOctoberBottomGone';
// longform-edited every-job (2026-10-07): Literally Every Job Is at Risk, 16:9 draft build (comp-builder).
import { EveryJob, DUR as EJ_DUR, FPS as EJ_FPS } from './EveryJob';
import { RetireEarly, DUR as RE_DUR, FPS as RE_FPS } from './RetireEarly';
import { RetireEarlyShort, DUR as RES_DUR, FPS as RES_FPS } from './RetireEarlyShort';
// batch aliens / clip #1 every-job-at-risk-own-assets FULL.
import { AliensEveryJobOwnAssets, EJ1_FPS, EJ1_DURATION } from './AliensEveryJobOwnAssets';
// batch aliens / clip #6 every-job-at-risk-own-assets-impact IMPACT. Flat-namespace check: no existing AliensEveryJobImpact / EJ6_ / broll-ej6 / thumb-ej6.
import { AliensEveryJobImpact, EJ6_FPS, EJ6_DURATION } from './AliensEveryJobImpact';
import { EveryJobShort, DUR as EJS_DUR, FPS as EJS_FPS } from './EveryJobShort';
// batch aliens / clip #2 tao-no-better-ai-play FULL. Flat-namespace check: no existing AliensTaoNoBetterAiPlay / AL2_ / broll-al2 / thumb-al2.
import { AliensTaoNoBetterAiPlay, AL2_FPS, AL2_DURATION } from './AliensTaoNoBetterAiPlay';
// batch aliens / clip #3 meme-dominance-off-a-cliff FULL. Flat-namespace check: no existing AliensMemeDominanceCliff / AL3_ / broll-al3 / thumb-al3.
import { AliensMemeDominanceCliff, AL3_FPS, AL3_DURATION } from './AliensMemeDominanceCliff';
// batch aliens / clip #4 pippin-89x-held-a-year FULL. Flat-namespace check: no existing AliensPippin89xHeldAYear / AL4_ / broll-al4 / thumb-al4.
import { AliensPippin89xHeldAYear, AL4_FPS, AL4_DURATION } from './AliensPippin89xHeldAYear';
// batch aliens / clip #5 ledger-reseller-long-con FULL. Flat-namespace check: no existing AliensLedgerResellerLongCon / AL5_ / broll-al5 / thumb-al5.
import { AliensLedgerResellerLongCon, AL5_FPS, AL5_DURATION } from './AliensLedgerResellerLongCon';
// longform-presentation history-of-crypto (2026-10-13): spotlight middle window of the EDIT, 1920x1080 @30 (skills/spotlight).
import { HistoryOfCryptoSpotlight, HOC_DUR, HOC_FPS } from './HistoryOfCryptoSpotlight';

// batch downtober / clip #1 zombies-cant-see-the-bottom FULL. Flat-namespace check: no existing DowntoberZombiesBottom / DT1_ / broll-dt1 / thumb-dt1.
import { DowntoberZombiesBottom, DT1_FPS, DT1_DURATION } from './DowntoberZombiesBottom';
// batch downtober / clip #2 tao-3000-is-not-the-ceiling FULL. Flat-namespace check: no existing DowntoberTao3000NotCeiling / DT2_ / broll-dt2 / thumb-dt2 / ovl-dt2.
import { DowntoberTao3000NotCeiling, DT2_FPS, DT2_DURATION } from './DowntoberTao3000NotCeiling';
// batch downtober / clip #3 long-term-plays-58x-350x FULL. Flat-namespace check: no existing DowntoberLongTermPlays / DT3_ / broll-dt3 / thumb-dt3 / ovl-dt3.
import { DowntoberLongTermPlays, DT3_FPS, DT3_DURATION } from './DowntoberLongTermPlays';
// batch downtober / clip #4 get-in-make-money-get-out FULL. Flat-namespace check: no existing DowntoberGetInGetOut / DT4_ / broll-dt4 / thumb-dt4 / ovl-dt4.
import { DowntoberGetInGetOut, DT4_FPS, DT4_DURATION } from './DowntoberGetInGetOut';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* batch downtober / clip #4 - get-in-make-money-get-out FULL (video 27.36 s @25; comp 820 fr @30 = 27.333 s) */}
      <Composition
        id="DowntoberGetInGetOut"
        component={DowntoberGetInGetOut}
        durationInFrames={DT4_DURATION}
        fps={DT4_FPS}
        width={1080}
        height={1920}
      />
      {/* batch downtober / clip #3 - long-term-plays-58x-350x FULL (video 17.80 s @25; comp 534 fr @30 = 17.800 s) */}
      <Composition
        id="DowntoberLongTermPlays"
        component={DowntoberLongTermPlays}
        durationInFrames={DT3_DURATION}
        fps={DT3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch downtober / clip #2 - tao-3000-is-not-the-ceiling FULL (video 19.28 s @25; comp 578 fr @30 = 19.267 s) */}
      <Composition
        id="DowntoberTao3000NotCeiling"
        component={DowntoberTao3000NotCeiling}
        durationInFrames={DT2_DURATION}
        fps={DT2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch downtober / clip #1 - zombies-cant-see-the-bottom FULL (675 fr @25 = 27.20 s; comp 816 fr @30) */}
      <Composition
        id="DowntoberZombiesBottom"
        component={DowntoberZombiesBottom}
        durationInFrames={DT1_DURATION}
        fps={DT1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch aliens / clip #5 - ledger-reseller-long-con FULL (739 fr @25 = 29.56 s; comp 886 fr @30) */}
      <Composition
        id="AliensLedgerResellerLongCon"
        component={AliensLedgerResellerLongCon}
        durationInFrames={AL5_DURATION}
        fps={AL5_FPS}
        width={1080}
        height={1920}
      />
      {/* batch aliens / clip #4 - pippin-89x-held-a-year FULL (814 fr @25 = 32.56 s; comp 976 fr @30) */}
      <Composition
        id="AliensPippin89xHeldAYear"
        component={AliensPippin89xHeldAYear}
        durationInFrames={AL4_DURATION}
        fps={AL4_FPS}
        width={1080}
        height={1920}
      />
      {/* batch aliens / clip #3 - meme-dominance-off-a-cliff FULL (644 fr @25 = 25.76 s; comp 772 fr @30) */}
      <Composition
        id="AliensMemeDominanceCliff"
        component={AliensMemeDominanceCliff}
        durationInFrames={AL3_DURATION}
        fps={AL3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch aliens / clip #2 - tao-no-better-ai-play FULL (355 fr @25 = 14.20 s; comp 426 fr @30) */}
      <Composition
        id="AliensTaoNoBetterAiPlay"
        component={AliensTaoNoBetterAiPlay}
        durationInFrames={AL2_DURATION}
        fps={AL2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch aliens / clip #6 - every-job-at-risk-own-assets-impact IMPACT (18.64 s; comp 559 fr @30) */}
      <Composition
        id="AliensEveryJobImpact"
        component={AliensEveryJobImpact}
        durationInFrames={EJ6_DURATION}
        fps={EJ6_FPS}
        width={1080}
        height={1920}
      />
      {/* batch aliens / clip #1 - every-job-at-risk-own-assets FULL (805 fr @25 = 32.20 s; comp 966 fr @30) */}
      <Composition
        id="AliensEveryJobOwnAssets"
        component={AliensEveryJobOwnAssets}
        durationInFrames={EJ1_DURATION}
        fps={EJ1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch bull-trap / clip #2 - golden-kitty-10-million-while-everything-bleeds FULL (1214 fr @25 = 48.56 s; comp 1456 fr @30) */}
      <Composition
        id="BullTrapGoldenKitty10M"
        component={BullTrapGoldenKitty10M}
        durationInFrames={BT2_DURATION}
        fps={BT2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch bull-trap / clip #4 - october-bottom-talk-is-gone FULL (559 fr @25 = 22.36 s; comp 671 fr @30) */}
      <Composition
        id="BullTrapOctoberBottomGone"
        component={BullTrapOctoberBottomGone}
        durationInFrames={BT4_DURATION}
        fps={BT4_FPS}
        width={1080}
        height={1920}
      />
      {/* batch bull-trap / clip #3 - spon-didnt-sell-holding-the-line FULL (930 fr @25 = 37.20 s; comp 1116 fr @30) */}
      <Composition
        id="BullTrapSponDidntSell"
        component={BullTrapSponDidntSell}
        durationInFrames={BT3_DURATION}
        fps={BT3_FPS}
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

      <Composition id="PythonEp01" component={PythonEp01} durationInFrames={PY01_DUR} fps={PY01_FPS} width={1920} height={1080} />
      {/* the 9:16 cut of the same video — render with --public-dir media/python/assets-v */}
      <Composition id="PythonEp01Vertical" component={PythonEp01Vertical} durationInFrames={PY01V_DUR} fps={PY01V_FPS} width={1080} height={1920} />

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
      {/* longform-edited SHORT: kaspa-vprogs ~30 s short (1080x1920 @30, DUR 898 = 808 span frames + 90 outro; --public-dir _previews/short/work) */}
      <Composition
        id="KaspaVprogsShort"
        component={KaspaVprogsShort}
        durationInFrames={KVPS_DUR}
        fps={KVPS_FPS}
        width={1080}
        height={1920}
      />
      {/* longform-edited golden-kitty (16:9) */}
      <Composition
        id="GoldenKitty"
        component={GoldenKitty}
        durationInFrames={GK_DUR}
        fps={GK_FPS}
        width={1920}
        height={1080}
      />
      {/* longform-edited golden-kitty VERTICAL (9:16), the SAME DUR as the 16:9 */}
      <Composition
        id="GoldenKittyVertical"
        component={GoldenKittyVertical}
        durationInFrames={GKV_DUR}
        fps={GKV_FPS}
        width={1080}
        height={1920}
      />
      {/* longform-edited golden-kitty SHORT (9:16), spans 26.533 s + 3 s outro (longform-to-short.md §5 Stage B) */}
      <Composition
        id="GoldenKittyShort"
        component={GoldenKittyShort}
        durationInFrames={GKS_DUR}
        fps={GKS_FPS}
        width={1080}
        height={1920}
      />
      {/* batch uptober / clip #1 - spawn-doubled-for-the-haters FULL (1125 fr @25 = 45.00 s; comp 1350 fr @30) */}
      <Composition
        id="UptoberSpawnDoubled"
        component={UptoberSpawnDoubled}
        durationInFrames={UPT1_DURATION}
        fps={UPT1_FPS}
        width={1080}
        height={1920}
      />
      {/* batch uptober / clip #2 - pippin-went-dead-then-89x FULL (898 fr @25 = 35.92 s; comp 1077 fr @30) */}
      <Composition
        id="UptoberPippin89x"
        component={UptoberPippin89x}
        durationInFrames={PIP2_DURATION}
        fps={PIP2_FPS}
        width={1080}
        height={1920}
      />
      {/* batch uptober / clip #3 - no-job-is-safe-robots FULL (839 fr @25 = 33.56 s; comp 1007 fr @30) */}
      <Composition
        id="UptoberNoJobSafe"
        component={UptoberNoJobSafe}
        durationInFrames={NJ3_DURATION}
        fps={NJ3_FPS}
        width={1080}
        height={1920}
      />
      {/* batch uptober / clip #5 - golden-kitty-50-million FULL (776 fr @25 = 31.04 s; comp 931 fr @30) */}
      <Composition
        id="UptoberGoldenKitty50M"
        component={UptoberGoldenKitty50M}
        durationInFrames={GK5_DURATION}
        fps={GK5_FPS}
        width={1080}
        height={1920}
      />
      {/* batch uptober / clip #6 - october-coins-first-week-pump FULL (869 fr @25 = 34.76 s; comp 1042 fr @30) */}
      <Composition
        id="UptoberOctoberCoins"
        component={UptoberOctoberCoins}
        durationInFrames={OC6_DURATION}
        fps={OC6_FPS}
        width={1080}
        height={1920}
      />
      {/* batch uptober / clip #7 - no-job-is-safe-robots-impact IMPACT (502 fr @25 = 20.08 s; comp 602 fr @30) */}
      <Composition
        id="UptoberNoJobSafeImpact"
        component={UptoberNoJobSafeImpact}
        durationInFrames={NJ7_DURATION}
        fps={NJ7_FPS}
        width={1080}
        height={1920}
      />
      {/* batch grapes / clip #3 - golden-kitty-one-of-five-impact IMPACT (591 fr @25 = 23.64 s; comp 709 fr @30) */}
      <Composition
        id="GrapesGoldenKittyOneOfFiveImpact"
        component={GrapesGoldenKittyOneOfFiveImpact}
        durationInFrames={GK3_DURATION}
        fps={GK3_FPS}
        width={1080}
        height={1920}
      />
      {/* longform-edited every-job: 1920x1080 @30, DUR = (SOURCE spine 1121.003 s + 5 x 1.5 s card pauses) x 30 */}
      <Composition id="EveryJob" component={EveryJob} durationInFrames={EJ_DUR} fps={EJ_FPS} width={1920} height={1080} />
      {/* longform-edited every-job SHORT (16:9-sourced mode): 1080x1920 @30, DUR = 26.767 s spans + 3.233 s outro = 900 */}
      <Composition id="EveryJobShort" component={EveryJobShort} durationInFrames={EJS_DUR} fps={EJS_FPS} width={1080} height={1920} />
      {/* longform-edited retire-early: 1920x1080 @30, time map = (SOURCE spine 648.309 s + the sidecar pauses: 4 cards x 1.5 s + CLIP-2 12.266667 s + CLIP-3 7.566667 s) x 30 = 20224; DUR = ceil(paused spine 674.254 s x 30) = 20228 (check_spine_fps) */}
      <Composition id="RetireEarly" component={RetireEarly} durationInFrames={RE_DUR} fps={RE_FPS} width={1920} height={1080} defaultProps={{ noLib: false, captions: true }} />
      {/* longform-edited retire-early SHORT (16:9-sourced mode): 1080x1920 @30, DUR = round((27.800 s spans + 3.000 s outro) x 30) = 924 */}
      <Composition id="RetireEarlyShort" component={RetireEarlyShort} durationInFrames={RES_DUR} fps={RES_FPS} width={1080} height={1920} />
      {/* longform-presentation history-of-crypto SPOTLIGHT: DUR = round((TAIL_FROM - HEAD_UNTIL) x 30) from HistoryOfCryptoSpotlightData.ts */}
      <Composition id="HistoryOfCryptoSpotlight" component={HistoryOfCryptoSpotlight} durationInFrames={HOC_DUR} fps={HOC_FPS} width={1920} height={1080} />
    </>
  );
};
