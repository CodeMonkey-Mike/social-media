import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { LivestreamShort, type ShortData } from './LivestreamShort';
import { FONT, fadeInOut } from './_kit';
import {
  DT1_FPS, DT1_DURATION, DT1_SEAM, DT1_CAP_Y, DT1_ACCENT, AI_TAG_DT1,
  CLIP_DT1, THUMB_DEF_DT1, BROLL_DT1, OVERLAYS_DT1, BADGES_DT1, SFX_DT1,
} from './constants-downtober-zombies-cant-see-the-bottom';
// Captions = canonical captions skill output off shorts/downtober/zombies-cant-see-the-bottom/whisper-words-verified.json.
import { CAPTIONS_DT1 } from './captionsDowntoberZombiesBottom';

// batch downtober / clip #1 "The Bottom Is In and the Cycle Zombies Can't See It" (FULL).
// Thin data wrapper over LivestreamShort + ONE extra layer: the "AI ILLUSTRATION" tag that rides the
// Benjamin Cowen likeness beat (a real person drawn by the image model; golden-kitty precedent), so the
// Pixar render never reads as a real photo of him.
const DATA: ShortData = {
  clip: CLIP_DT1,
  fps: DT1_FPS,
  durationS: DT1_DURATION / DT1_FPS,
  capY: DT1_CAP_Y,
  seam: DT1_SEAM,
  accent: DT1_ACCENT,
  captions: CAPTIONS_DT1,
  broll: BROLL_DT1,
  overlays: OVERLAYS_DT1,
  badges: BADGES_DT1,
  sounds: SFX_DT1,
  thumb: THUMB_DEF_DT1, // ONE frame cover
};

const AiTag: React.FC = () => {
  const t = useCurrentFrame() / DT1_FPS;
  const { tIn, tOut, top, left } = AI_TAG_DT1;
  if (t < tIn || t >= tOut) return null;
  // The beat opens on a hard cut from the hook (BrollLayer adjacency), so the tag is on at full opacity
  // from its first frame and only fades out with the image (0.12 s, BrollLayer's fade).
  const op = Math.min(1, fadeInOut(t, tIn - 1, tOut, 0.12));
  return (
    <div style={{
      position: 'absolute', top, left, zIndex: 145, opacity: op,
      background: 'rgba(0,0,0,0.72)', border: '2px solid rgba(255,255,255,0.45)', borderRadius: 10,
      padding: '7px 14px', fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: '0.14em',
      color: '#fff',
    }}>AI ILLUSTRATION</div>
  );
};

export const DowntoberZombiesBottom: React.FC = () => (
  <AbsoluteFill>
    <LivestreamShort data={DATA} />
    <AiTag />
  </AbsoluteFill>
);
export { DT1_FPS, DT1_DURATION };
