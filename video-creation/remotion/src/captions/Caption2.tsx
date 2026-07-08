import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Caption2 — CANONICAL arial-black UPPERCASE word-karaoke renderer ("Mother-Satori").
// Import this in EVERY comp that uses caption2; do NOT copy-paste a local version
// (that is how the flicker bug kept recurring). Spec: skills/captions/captions.md.
//
// ⚠️ FLICKER-FREE BY DESIGN: the active-word highlight toggles ONLY paint
// (background + text color + stroke) and NEVER geometry. Every word keeps the
// SAME box (constant padding) whether active or not, so the line's width is
// identical every frame and the wrap can NOT flip between 1 and 2 lines as the
// highlight advances word-to-word. (The old bug: active words got wider padding,
// reflowing the line -> rapid 1<->2 line bounce. Do not reintroduce a size change
// on `active`.)
// ─────────────────────────────────────────────────────────────────────────────
export type CapWord = { w: string; start: number; end: number };
export type CapGroup = { text: string; start: number; end: number; words: CapWord[] };

export const Caption2: React.FC<{ captions: CapGroup[]; bottom?: number; fontSize?: number }> = ({ captions, bottom = 470, fontSize = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = captions.find((c) => t >= c.start && t < c.end + 0.12);
  if (!g) return null;
  return (
    <div style={{ position: 'absolute', bottom, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '8px 10px', padding: '0 56px', fontFamily: "'Arial Black', Arial, sans-serif", fontSize, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.05 }}>
      {g.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.06;
        return (
          <span
            key={i}
            style={{
              // CONSTANT geometry for EVERY word (active or not) — never changes the box size:
              padding: '2px 12px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
              // base paint:
              color: '#fff',
              WebkitTextStroke: '9px #000',
              paintOrder: 'stroke',
              // active toggles ONLY paint (no size change) -> no reflow -> no flicker:
              ...(active ? { backgroundColor: '#ffd400', color: '#1a1a1a', WebkitTextStroke: '0px transparent' } : {}),
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
