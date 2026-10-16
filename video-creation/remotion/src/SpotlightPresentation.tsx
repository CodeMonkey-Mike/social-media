/**
 * SpotlightPresentation — the longform-presentation track's SHARED spotlight renderer (persisting infra, like
 * LivestreamShort.tsx for the shorts; keep it out of the per-batch comp cleanup).
 *
 * Skill: video-creation/longform-presentation/skills/spotlight/spotlight.md (read it first).
 *
 * What it does: plays ONE deck container at a time, enlarged to dominate the 1920x1080 frame, cued to the
 * narration (the EDIT timeline seconds in each scene's `t`, resolved by cue_scenes.py). Scene i is visible
 * [t_i, t_{i+1}); the last scene runs to `tailFrom`. Entrance = 0.35 s cross-fade + 0.93 -> 1 scale-in (the look
 * Mike approved on QE, 2026-06-06). NEVER an accumulating slide: no two unrelated containers at once (a declared
 * row, `cyclerow`, is the one exception, it is a single rhetorical unit).
 *
 * The comp covers ONLY the replaced middle window [headUntil, tailFrom) of the EDIT: frame 0 = headUntil. The
 * EDIT's own footage is stitched back on either side by stitch.py (ffmpeg filter_complex concat, never the
 * demuxer). Render with --muted; the stitcher takes the middle's audio from the EDIT, so the Remotion AAC lag
 * never reaches the deliverable. `audio` (a file in the render --public-dir) is only for Studio / QA chunks.
 *
 * Scene kinds mirror the lecture deck's container vocabulary (chapter h2, tool-card, bullet-list, timeline-item,
 * accent-card, cycle-card, sma-card, stat-box, next-tag). A new deck family with other containers extends the
 * union + SceneNode here; the per-project comp only supplies THEME (fonts/colors ported from the deck) + data.
 */
import React from 'react';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export type SpotBulletItem = { strong: string; rest?: string; t?: number };
export type SpotCycle = { num: string; peak: string; date: string; crash: string };

export type SpotScene = { id: string; t: number } & (
  | { kind: 'chapter'; eyebrow: string; title: string }
  | { kind: 'card'; icon?: string; title: string; sub: string }
  | { kind: 'bullets'; label?: string; items: SpotBulletItem[]; active?: number }
  | { kind: 'titem'; date: string; title: string }
  | { kind: 'accent'; title: string }
  | { kind: 'cycle'; num: string; peak: string; date: string; crash: string }
  | { kind: 'cyclerow'; cycles: SpotCycle[] }
  | { kind: 'sma'; variant: 'winter' | 'bear'; label: string; title: string }
  | { kind: 'stat'; num: string; label: string }
  | { kind: 'statement'; text: string }
  | { kind: 'nexttag'; text: string }
);

export type SpotTheme = {
  bg: string; surface: string; card: string; border: string; rule: string;
  text: string; muted: string; veryMuted: string;
  accent: string; red: string; blue: string;
  fontHead: string; fontBody: string;
};

export type SpotlightProps = {
  scenes: SpotScene[];
  theme: SpotTheme;
  headUntil: number;   // EDIT seconds; comp frame 0
  tailFrom: number;    // EDIT seconds; comp end
  audio?: string;      // staticFile name of the middle-window audio slice (Studio / QA only)
  fade?: number;       // cross-fade seconds (default 0.35)
};

const Eyebrow: React.FC<{ th: SpotTheme; color?: string; size?: number; children: React.ReactNode; mb?: number }> =
  ({ th, color, size = 26, children, mb = 0 }) => (
    <div style={{ fontFamily: th.fontBody, color: color ?? th.accent, fontSize: size, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: mb }}>{children}</div>
  );

const Box: React.FC<{ th: SpotTheme; width: number; top?: string; left?: string; children: React.ReactNode; bg?: string; border?: string; pad?: string }> =
  ({ th, width, top, left, children, bg, border, pad = '64px 76px' }) => (
    <div style={{ width, background: bg ?? th.card, border: `1px solid ${border ?? th.border}`, borderRadius: 6,
      borderTop: top ? `6px solid ${top}` : undefined, borderLeft: left ? `8px solid ${left}` : undefined,
      padding: pad, boxShadow: '0 30px 90px rgba(0,0,0,0.55)', position: 'relative' }}>{children}</div>
  );

const CycleCard: React.FC<{ th: SpotTheme; c: SpotCycle; width: number; big?: boolean }> = ({ th, c, width, big }) => (
  <Box th={th} width={width} top={th.accent} pad={big ? '64px 76px' : '48px 52px'}>
    <Eyebrow th={th} size={big ? 26 : 22} mb={big ? 26 : 18}>{c.num}</Eyebrow>
    <div style={{ fontFamily: th.fontHead, fontWeight: 800, fontSize: big ? 132 : 88, lineHeight: 1, color: th.text }}>{c.peak}</div>
    <div style={{ fontFamily: th.fontBody, fontSize: big ? 32 : 26, color: th.muted, marginTop: big ? 22 : 16 }}>{c.date}</div>
    <div style={{ fontFamily: th.fontBody, fontSize: big ? 40 : 30, fontWeight: 600, color: th.red, marginTop: big ? 34 : 24 }}>{c.crash}</div>
  </Box>
);

const SceneNode: React.FC<{ s: SpotScene; th: SpotTheme; now: number }> = ({ s, th, now }) => {
  switch (s.kind) {
    case 'chapter':
      return (
        <div style={{ textAlign: 'center', maxWidth: 1500 }}>
          <Eyebrow th={th} size={30} mb={34}>{s.eyebrow}</Eyebrow>
          <div style={{ fontFamily: th.fontHead, fontWeight: 800, fontSize: 108, lineHeight: 1.08, color: th.text }}>{s.title}</div>
          <div style={{ width: 120, height: 4, background: th.accent, opacity: 0.6, margin: '46px auto 0' }} />
        </div>
      );
    case 'card':
      return (
        <Box th={th} width={1420} top={th.accent} pad="76px 88px">
          {s.icon && <div style={{ fontSize: 84, lineHeight: 1, marginBottom: 38 }}>{s.icon}</div>}
          <div style={{ fontFamily: th.fontHead, fontWeight: 700, fontSize: 70, lineHeight: 1.15, color: th.text }}>{s.title}</div>
          <div style={{ fontFamily: th.fontBody, fontSize: 40, lineHeight: 1.5, color: th.muted, marginTop: 24 }}>{s.sub}</div>
        </Box>
      );
    case 'accent':
      return (
        <Box th={th} width={1460} left={th.accent} bg="rgba(245,166,35,0.06)" border="rgba(245,166,35,0.2)" pad="68px 84px">
          <div style={{ fontFamily: th.fontHead, fontWeight: 700, fontSize: 58, lineHeight: 1.3, color: th.accent }}>{s.title}</div>
        </Box>
      );
    case 'bullets': {
      let active = s.active ?? -1;
      s.items.forEach((it, i) => { if (it.t !== undefined && it.t <= now) active = Math.max(active, i); });
      return (
        <div style={{ width: 1480 }}>
          {s.label && (
            <div style={{ fontFamily: th.fontBody, fontSize: 26, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em',
              color: th.accent, paddingBottom: 18, marginBottom: 14, borderBottom: `1px solid ${th.border}` }}>{s.label}</div>
          )}
          {s.items.map((it, i) => {
            const on = i === active;
            const dim = active >= 0 && !on;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 30, padding: '30px 0',
                borderBottom: i === s.items.length - 1 ? 'none' : `1px solid ${th.rule}`, opacity: dim ? 0.55 : 1 }}>
                <div style={{ width: 18, height: 18, minWidth: 18, borderRadius: '50%', background: th.accent, marginTop: 20,
                  boxShadow: on ? `0 0 22px ${th.accent}` : 'none' }} />
                <div style={{ fontFamily: th.fontBody, fontSize: 42, lineHeight: 1.45, color: th.muted }}>
                  <span style={{ color: th.text, fontWeight: 500 }}>{it.strong}</span>{it.rest ?? ''}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    case 'titem':
      return (
        <div style={{ width: 1480, position: 'relative', paddingLeft: 74 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 2,
            background: `linear-gradient(to bottom, ${th.accent}, ${th.border})` }} />
          <div style={{ position: 'absolute', left: -11, top: 12, width: 25, height: 25, borderRadius: '50%',
            background: th.accent, border: `4px solid ${th.bg}`, boxShadow: `0 0 24px ${th.accent}88` }} />
          <Eyebrow th={th} size={30} mb={24}>{s.date}</Eyebrow>
          <div style={{ fontFamily: th.fontHead, fontWeight: 700, fontSize: 66, lineHeight: 1.22, color: th.text }}>{s.title}</div>
        </div>
      );
    case 'cycle':
      return <CycleCard th={th} c={s} width={900} big />;
    case 'cyclerow':
      return (
        <div style={{ display: 'flex', gap: 32, width: 1440 }}>
          {s.cycles.map((c, i) => <div key={i} style={{ flex: 1 }}><CycleCard th={th} c={c} width={458} /></div>)}
        </div>
      );
    case 'sma': {
      const col = s.variant === 'winter' ? th.blue : th.red;
      return (
        <Box th={th} width={1420} left={col} pad="76px 88px">
          <Eyebrow th={th} color={col} size={30} mb={26}>{s.label}</Eyebrow>
          <div style={{ fontFamily: th.fontHead, fontWeight: 700, fontSize: 66, lineHeight: 1.2, color: th.text }}>{s.title}</div>
        </Box>
      );
    }
    case 'stat':
      return (
        <Box th={th} width={1000} pad="72px 80px">
          <div style={{ fontFamily: th.fontHead, fontWeight: 800, fontSize: 150, lineHeight: 1, color: th.accent }}>{s.num}</div>
          <Eyebrow th={th} color={th.muted} size={30}>{s.label}</Eyebrow>
        </Box>
      );
    case 'statement':
      return (
        <div style={{ fontFamily: th.fontHead, fontWeight: 700, fontSize: 60, lineHeight: 1.35, color: th.text, textAlign: 'center', maxWidth: 1450 }}>{s.text}</div>
      );
    case 'nexttag':
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, background: 'rgba(245,166,35,0.1)',
          border: '1px solid rgba(245,166,35,0.3)', borderRadius: 6, padding: '30px 48px', fontFamily: th.fontBody,
          fontSize: 36, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: th.accent }}>{s.text}</div>
      );
  }
};

export const SpotlightPresentation: React.FC<SpotlightProps> = ({ scenes, theme, headUntil, tailFrom, audio, fade = 0.35 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = headUntil + frame / fps;
  const th = theme;
  return (
    <AbsoluteFill style={{ background: th.bg }}>
      {audio && <Audio src={staticFile(audio)} />}
      <div style={{ position: 'absolute', width: 720, height: 720, borderRadius: '50%', filter: 'blur(140px)', background: th.accent, opacity: 0.06, top: -300, right: -220 }} />
      <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', filter: 'blur(140px)', background: th.accent, opacity: 0.035, bottom: -240, left: -180 }} />
      {scenes.map((s, i) => {
        const tIn = s.t;
        const tOut = scenes[i + 1]?.t ?? tailFrom;
        if (now < tIn - 0.001 || now >= tOut + fade) return null;
        const opacity = interpolate(now, [tIn, tIn + fade, tOut, tOut + fade], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (opacity <= 0) return null;
        const scale = interpolate(now, [tIn, tIn + 0.6], [0.93, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <AbsoluteFill key={s.id} style={{ justifyContent: 'center', alignItems: 'center', padding: 90, opacity, transform: `scale(${scale})` }}>
            <SceneNode s={s} th={th} now={now} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
