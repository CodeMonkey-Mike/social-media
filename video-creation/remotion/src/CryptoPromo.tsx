import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { CAPTIONS, CapGroup } from "./cryptoPromoCaptions";

const VIDEO = staticFile("crypto-promo/crypto-promo-FINAL.mp4");

// Timeline marks (seconds) in the concatenated final video
const RESORT_START = 25.17; // "Six months later" title appears here
const TITLE_SECS = 5.0;
const CTA_START = 68.2; // CryptoRich.vip end card

// ---- Karaoke captions: a group of words, current word highlighted yellow ----
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
              padding: active ? "2px 12px" : "2px 4px",
              // keep highlighted text dark-on-yellow for the karaoke pop
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

// ---- "Six months later" top title at the resort cut ----
const SixMonthsLater: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const start = RESORT_START;
  const end = RESORT_START + TITLE_SECS;
  if (t < start - 0.3 || t > end + 0.3) return null;
  const f0 = start * fps;
  const appear = spring({ frame: frame - f0, fps, config: { damping: 18, mass: 0.6 } });
  const fadeOut = interpolate(t, [end - 0.5, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(appear, fadeOut);
  const y = interpolate(appear, [0, 1], [-40, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontSize: 92,
        fontWeight: 900,
        color: "#fff",
        WebkitTextStroke: "10px #000",
        paintOrder: "stroke",
        textTransform: "uppercase",
        letterSpacing: 2,
      }}
    >
      Six Months Later
    </div>
  );
};

// ---- CryptoRich.vip end card during the CTA ----
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < CTA_START) return null;
  const f0 = CTA_START * fps;
  const appear = spring({ frame: frame - f0, fps, config: { damping: 16, mass: 0.7 } });
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * 4);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 250,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: appear,
        transform: `scale(${interpolate(appear, [0, 1], [0.8, 1]) * pulse})`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          backgroundColor: "#ffd400",
          color: "#0a0a0a",
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontSize: 84,
          fontWeight: 900,
          padding: "18px 44px",
          borderRadius: 22,
          letterSpacing: 1,
          boxShadow: "0 10px 40px rgba(0,0,0,.45)",
        }}
      >
        CryptoRich.vip
      </span>
    </div>
  );
};

export const CryptoPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={VIDEO} />
      <KaraokeCaptions />
      <SixMonthsLater />
      <EndCard />
    </AbsoluteFill>
  );
};
