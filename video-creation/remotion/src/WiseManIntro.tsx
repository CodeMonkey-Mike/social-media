import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";
import { CAPTIONS } from "./wiseManIntroCaptions";

const VIDEO = staticFile("wise-man-intro/wise-man-intro.mp4");
const MUSIC = staticFile("wise-man-intro/theta-rest.mp3"); // Theta Rest — cleared, license VHWICIAB6U5Y9OHE

const TOTAL_FRAMES = 999; // ceil(33.274s * 30)
const MUSIC_BED = 0.15;   // serene bed sits under Mike's voice

// ---- Mother-Satori karaoke captions: bold white all-caps, yellow highlight on the spoken word ----
const KaraokeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = CAPTIONS.find((c) => t >= c.start && t < c.end + 0.12);
  if (!g) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 470,
        left: 0,
        right: 0,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px 16px",
        padding: "0 70px",
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontSize: 78,
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
              // constant padding in BOTH states so the highlight never changes a
              // word's width — otherwise the line reflows/wraps and flickers as the
              // karaoke advances (the "SO CLICK THAT LIKE" two-line flicker).
              padding: "2px 12px",
              ...(active
                ? { color: "#1a1a1a", WebkitTextStroke: "0px transparent" }
                : {}),
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

export const WiseManIntro: React.FC = () => {
  // gentle fade in/out on the serene bed so it doesn't pop on the cut in/out
  const bedVolume = (f: number) =>
    interpolate(
      f,
      [0, 24, TOTAL_FRAMES - 36, TOTAL_FRAMES],
      [0, MUSIC_BED, MUSIC_BED, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={VIDEO} />
      <Audio src={MUSIC} volume={bedVolume} />
      <KaraokeCaptions />
    </AbsoluteFill>
  );
};
