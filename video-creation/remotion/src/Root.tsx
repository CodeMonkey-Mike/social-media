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

import { KaspaVprogs, DUR as KVP_DUR, FPS as KVP_FPS } from './KaspaVprogs';
import { KaspaVprogsVertical, DUR as KVPV_DUR, FPS as KVPV_FPS } from './KaspaVprogsVertical';
import { KaspaVprogsShort, DUR as KVPS_DUR, FPS as KVPS_FPS } from './KaspaVprogsShort';
import { GoldenKitty, DUR as GK_DUR, FPS as GK_FPS } from './GoldenKitty';
import { GoldenKittyVertical, DUR as GKV_DUR, FPS as GKV_FPS } from './GoldenKittyVertical';
import { GoldenKittyShort, DUR as GKS_DUR, FPS as GKS_FPS } from './GoldenKittyShort';

export const RemotionRoot: React.FC = () => {
  return (
    <>

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
    </>
  );
};
