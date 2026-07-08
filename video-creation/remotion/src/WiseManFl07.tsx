import {
  AbsoluteFill,
  OffthreadVideo,
  Img,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { CAPTIONS } from "./wiseManFl07Captions";

// Corner-presenter layout (CONCEPT 3a), cutout version: the impossible coin-drop visual FILLS the
// frame; the wise man is a TRANSPARENT cutout (rembg matte of a white-bg 1:1 clip) overlaid in the
// bottom-left from frame 0 — no box, no border. Voice rides on a separate audio track (the cutout
// webm is silent); the hook clip keeps its own ooze SFX under his voice.
const HOOK = staticFile("wise-man-fl07/hook-ooze.mp4");                  // machine birth + ooze SFX (6.08s)
const HOOK_HOLD = staticFile("wise-man-fl07/hook-last.png");           // last frame, held after the drop
const VOICE = staticFile("wise-man-fl07/delivery-concat-white1x1.mp4"); // his voice (audio source)

const FPS = 30;
const HOOK_FRAMES = 182;     // ~6.08s machine-birth hook (coin drops), then we hold its last frame
const TOTAL_FRAMES = 517;    // ceil(17.205s * 30) — full spoken delivery
// Transparent cutout is a PNG sequence (Remotion composites PNG alpha cleanly; VP9-alpha webm
// renders as a black box in Chromium). Source clip is 24fps; map comp frame -> source PNG index.
const CUTOUT_SRC_FPS = 24;
const CUTOUT_FRAMES = 412;
const pad5 = (n: number) => String(n).padStart(5, "0");

// ---- Background: coin drop plays, then the dropped-coin frame is held with a slow push-in ----
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const heldFrame = Math.max(0, frame - HOOK_FRAMES);
  const scale = interpolate(heldFrame, [0, TOTAL_FRAMES - HOOK_FRAMES], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={HOOK_FRAMES}>
        <OffthreadVideo src={HOOK} volume={0.5} />
      </Sequence>
      <Sequence from={HOOK_FRAMES} durationInFrames={TOTAL_FRAMES - HOOK_FRAMES}>
        <AbsoluteFill style={{ transform: `scale(${scale})` }}>
          <Img src={HOOK_HOLD} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// ---- Transparent cutout of the talking wise man, anchored bottom-left, on screen from frame 0 ----
const CutoutPresenter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 16 });
  const W = 720; // square cutout scaled up; transparent margins bleed off the corner
  const idx = Math.min(CUTOUT_FRAMES - 1, Math.floor((frame * CUTOUT_SRC_FPS) / FPS));
  return (
    <Img
      src={staticFile(`wise-man-fl07/cutout/c_${pad5(idx)}.png`)}
      style={{
        position: "absolute",
        left: -70,
        bottom: -130,
        width: W,
        height: W,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 30}px)`,
        filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.55))",
      }}
    />
  );
};

// ---- Mother-Satori karaoke captions: bold white all-caps, yellow highlight on the spoken word ----
// Placed in the UPPER third so it clears the bottom-left cutout.
const KaraokeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const g = CAPTIONS.find((c) => t >= c.start && t < c.end + 0.12);
  if (!g) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 0,
        right: 0,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 16px",
        padding: "0 70px",
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontSize: 76,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: 1,
        lineHeight: 1.05,
      }}
    >
      {g.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.06;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              color: "#fff",
              WebkitTextStroke: "9px #000",
              paintOrder: "stroke",
              backgroundColor: active ? "#ffd400" : "transparent",
              borderRadius: 10,
              // constant padding in BOTH states so the highlight never reflows the line
              padding: "2px 12px",
              ...(active ? { color: "#1a1a1a", WebkitTextStroke: "0px transparent" } : {}),
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

export const WiseManFl07: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Backdrop />
      <CutoutPresenter />
      <Audio src={VOICE} />
      <KaraokeCaptions />
    </AbsoluteFill>
  );
};
