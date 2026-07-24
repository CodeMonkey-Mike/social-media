import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Img, Audio, Sequence,
  useCurrentFrame, spring, interpolate,
} from 'remotion';
import {
  Base, BrollLayer, Badge, Thumb, fadeInOut, colourize,
  FONT, TEAL, type Caption, type BrollEv, type Sfx,
} from './_kit';

export type BadgeEv = { tIn: number; tOut: number; color: string; line1: string; line2?: string; sub?: string; top?: number };
// Transparent-style overlay (glowing object on black) dropped in via screen blend.
// `blend` defaults to 'screen' for legacy glow-on-black RGB overlays. Use 'normal'
// for true alpha PNGs (alpha-from-luminance) so they show over LIGHT backgrounds too
// (screen blend can't darken white, so a bright overlay vanishes over a light screen-share).
export type OverlayEv = { src: string; tIn: number; tOut: number; top?: number; left?: number; width?: number; blend?: 'normal' | 'screen' };
// `img` = an optional generated background image for the frame-0 cover; the title/chip stay CODE-drawn
// on top of it (never baked into the art, per SKILL "B-ROLL IMAGE GENERATION RULES"). Omit it and the
// cover is the historical gradient-over-video card.
export type ThumbDef = { title: string; chip: string; chipColor?: string; titleSize?: number; durS?: number; img?: string };
// Real-logo compositing (e.g. the actual $LAB logo PNG) — a persistent corner watermark
// and/or a timed reveal plate. Uses the real asset, so the wordmark is pixel-perfect.
export type LogoDef = {
  src: string;
  glow?: string;
  watermark?: { width?: number; top?: number; left?: number };
  reveal?: { tIn: number; tOut: number; top?: number; width?: number };
};

export type ShortData = {
  clip: string;
  fps: number;
  durationS: number;
  capY?: number;
  /** measured screen-share/webcam seam of THIS clip; content-mode b-roll covers 0..seam */
  seam?: number;
  captions: Caption[];
  broll?: BrollEv[];
  badges?: BadgeEv[];
  overlays?: OverlayEv[];
  sounds?: Sfx[];
  thumb?: ThumbDef;
  logo?: LogoDef;
};

const LogoPlate: React.FC<{ src: string; glow: string; width: number; style?: React.CSSProperties }> =
({ src, glow, width, style }) => (
  <div style={{
    width, borderRadius: 16, overflow: 'hidden', background: '#000',
    border: `3px solid ${glow}`, boxShadow: `0 0 34px ${glow}aa, 0 6px 24px rgba(0,0,0,0.6)`,
    ...style,
  }}>
    <Img src={src} style={{ width: '100%', display: 'block' }} />
  </div>
);

const Logo: React.FC<{ logo: LogoDef; t: number; fps: number; thumbUp?: boolean }> = ({ logo, t, fps, thumbUp }) => {
  const glow = logo.glow ?? '#39ff14';
  return (
    <>
      {logo.watermark && (
        <div style={{ position: 'absolute', top: logo.watermark.top ?? 26, left: logo.watermark.left ?? 26, zIndex: 360 }}>
          <LogoPlate src={logo.src} glow={glow} width={logo.watermark.width ?? 210} />
        </div>
      )}
      {logo.reveal && !thumbUp && t >= logo.reveal.tIn && t < logo.reveal.tOut && (() => {
        const r = logo.reveal!;
        const op = fadeInOut(t, r.tIn, r.tOut, 0.2);
        const sc = spring({ frame: Math.round((t - r.tIn) * fps), fps, config: { damping: 12, stiffness: 300 }, from: 0.6, to: 1.0 });
        const w = r.width ?? 440;
        return (
          <div style={{ position: 'absolute', top: r.top ?? 150, left: '50%', transform: `translateX(-50%) scale(${sc})`, opacity: op, zIndex: 140 }}>
            <LogoPlate src={logo.src} glow={glow} width={w} />
          </div>
        );
      })()}
    </>
  );
};

const Captions: React.FC<{ captions: Caption[]; fps: number; capY: number }> = ({ captions, fps, capY }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  let idx = 0, html = '';
  for (let i = captions.length - 1; i >= 0; i--) {
    if (t >= captions[i].t) { idx = i; html = captions[i].h; break; }
  }
  if (!html) return null;
  const startFrame = Math.round((captions[idx]?.t ?? 0) * fps);
  const scale = spring({ frame: frame - startFrame, fps, config: { damping: 11, stiffness: 360 }, from: 0.7, to: 1.0 });
  return (
    <AbsoluteFill style={{ zIndex: 150, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: capY, left: 50, right: 50, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 74, color: '#fff',
          textTransform: 'lowercase', textAlign: 'center', letterSpacing: '0.01em',
          lineHeight: 1.05, WebkitTextStroke: '13px #000', paintOrder: 'stroke fill' as any,
          width: '100%', transform: `scale(${scale})`,
        }} dangerouslySetInnerHTML={{ __html: colourize(html) }} />
      </div>
    </AbsoluteFill>
  );
};

const Overlays: React.FC<{ overlays: OverlayEv[]; t: number; fps: number }> = ({ overlays, t, fps }) => (
  <>
    {overlays.map((o, i) => {
      if (t < o.tIn || t >= o.tOut) return null;
      const op = fadeInOut(t, o.tIn, o.tOut, 0.18);
      const sc = spring({ frame: Math.round((t - o.tIn) * fps), fps, config: { damping: 12, stiffness: 300 }, from: 0.5, to: 1.0 });
      const float = Math.sin((t - o.tIn) * 2.2) * 10;
      return (
        <Img key={i} src={o.src} style={{
          position: 'absolute', top: o.top ?? 250, left: o.left ?? 240, width: o.width ?? 600,
          mixBlendMode: o.blend ?? 'screen', opacity: op, transform: `translateY(${float}px) scale(${sc})`, zIndex: 120,
        }} />
      );
    })}
  </>
);

const Badges: React.FC<{ badges: BadgeEv[]; t: number; fps: number }> = ({ badges, t, fps }) => (
  <AbsoluteFill style={{ zIndex: 130 }}>
    {badges.map((b, i) => {
      if (t < b.tIn - 0.1 || t >= b.tOut + 0.1) return null;
      const op = fadeInOut(t, b.tIn, b.tOut, 0.18);
      const sc = spring({ frame: Math.round((t - b.tIn) * fps), fps, config: { damping: 13, stiffness: 320 }, from: 0.6, to: 1.0 });
      return <Badge key={i} op={op} sc={sc} color={b.color} line1={b.line1} line2={b.line2} sub={b.sub} top={b.top ?? 300} />;
    })}
  </AbsoluteFill>
);

export const LivestreamShort: React.FC<{ data: ShortData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const fps = data.fps;
  const t = frame / fps;
  const capY = data.capY ?? 815;
  // FRAME-0 COVER by default (SKILL Phase 7 rule #5): the thumb is the IG/TikTok cover = frame 0 only,
  // NOT a held card over the opening captions. Default = one frame (1/fps). A batch can still pass an
  // explicit thumb.durS to hold it longer, but the deprecated ~2.3s hold is no longer the default
  // (that regression overlaid the title on the animating captions; fixed in-component 2026-06-07).
  const thumbDur = data.thumb?.durS ?? (1 / fps);
  // HARD RULE: no timed graphic (badge, callout overlay, logo-reveal plate) may render while the
  // thumbnail cover is up, or they stack on top of the thumb text. The corner watermark is exempt.
  const thumbUp = !!data.thumb && t < thumbDur;
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* base livestream video (content top + face bottom) */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <OffthreadVideo src={data.clip} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {data.broll && <BrollLayer broll={data.broll} t={t} seam={data.seam} />}

      {/* readability scrim across the caption band */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 36%, rgba(0,0,0,0.5) 43%, rgba(0,0,0,0) 52%)' }} />

      {data.overlays && !thumbUp && <Overlays overlays={data.overlays} t={t} fps={fps} />}
      {data.badges && !thumbUp && <Badges badges={data.badges} t={t} fps={fps} />}

      <Captions captions={data.captions} fps={fps} capY={capY} />

      {data.logo && <Logo logo={data.logo} t={t} fps={fps} thumbUp={thumbUp} />}

      {data.thumb && t < thumbDur && (
        <AbsoluteFill style={{
          zIndex: 300,
          opacity: thumbDur <= 0.1 ? 1 : interpolate(t, [0, thumbDur - 0.25, thumbDur], [1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {data.thumb.img && <Img src={data.thumb.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          <Thumb
            op={1}
            title={<span dangerouslySetInnerHTML={{ __html: data.thumb.title.replace(/\n/g, '<br/>') }} />}
            chip={data.thumb.chip}
            chipColor={data.thumb.chipColor ?? TEAL}
            titleSize={data.thumb.titleSize ?? 120}
          />
        </AbsoluteFill>
      )}

      {data.sounds && data.sounds.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * fps)} durationInFrames={Math.max(1, Math.round((s.dur ?? 2) * fps))}>
          <Audio src={s.src} volume={s.vol ?? 0.55} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
