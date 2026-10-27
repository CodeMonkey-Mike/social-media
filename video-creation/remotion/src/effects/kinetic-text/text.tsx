// text.tsx: the text block every kinetic-text engine draws (ALL CAPS lines, *key* words in the accent colour).
import React from 'react';
import { KT_2023, KtLine } from './types';

/** Split '*key* words' markup into spans. A line without asterisks is all body text. */
export const parseMarkup = (line: KtLine): { text: string; key: boolean }[] => {
  const out: { text: string; key: boolean }[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), key: false });
    out.push({ text: m[1], key: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), key: false });
  return out;
};

export const hasKeys = (lines: KtLine[]) => lines.some((l) => /\*[^*]+\*/.test(l));

export type KtTextStyle = {
  font?: string;
  fontWeight?: number;
  fontStyle?: 'italic' | 'normal';
  fontSize: number;
  /** line pitch in px */
  lineHeight: number;
  color: string;
  keyColor?: string;
  shadow?: string;
  /** white (or any) outline: [width px outside the glyph, colour] */
  stroke?: [number, string];
  /** outer glow colour (red punch word, green payoff) */
  glow?: string;
  align?: 'center' | 'left' | 'right';
  letterSpacing?: string;
  uppercase?: boolean;
};

const glowShadow = (c: string) => `0 0 6px ${c}, 0 0 14px ${c}, 0 0 24px ${c}, 0 0 38px ${c}`;

/** A block of lines, its box centred on its own origin (the caller positions + transforms the wrapper). */
export const KtTextBlock: React.FC<{ lines: KtLine[]; style: KtTextStyle; maxWidth?: number }> = ({ lines, style, maxWidth }) => {
  const {
    font = KT_2023.font,
    fontWeight = KT_2023.fontWeight,
    fontStyle = KT_2023.fontStyle,
    fontSize,
    lineHeight,
    color,
    keyColor,
    shadow,
    stroke,
    glow,
    align = 'center',
    letterSpacing = '0.005em',
    uppercase = true,
  } = style;
  const shadows = [glow ? glowShadow(glow) : null, shadow ?? null].filter(Boolean).join(', ');
  const base: React.CSSProperties = {
    fontFamily: font,
    fontWeight,
    fontStyle,
    fontSize,
    lineHeight: `${lineHeight}px`,
    textAlign: align,
    letterSpacing,
    textTransform: uppercase ? 'uppercase' : 'none',
    whiteSpace: maxWidth ? 'normal' : 'nowrap',
    maxWidth,
    color,
  };
  const strokeCss = stroke
    ? ({ WebkitTextStroke: `${stroke[0] * 2}px ${stroke[1]}`, paintOrder: 'stroke fill' } as React.CSSProperties)
    : {};
  const body = lines.map((l, i) => (
    <div key={i}>
      {parseMarkup(l).map((s, j) => (
        <span key={j} style={{ color: s.key && keyColor ? keyColor : color }}>
          {s.text}
        </span>
      ))}
    </div>
  ));
  if (stroke && shadows) {
    // Chrome paints the FILL's shadow over the stroke (a red glow would bury the white outline): draw the shadows from
    // a copy underneath, then the stroke + fill crisp on top
    return (
      <div style={{ position: 'relative' }}>
        <div aria-hidden style={{ ...base, ...strokeCss, position: 'absolute', left: 0, top: 0, width: '100%', textShadow: shadows }}>
          {body}
        </div>
        <div style={{ ...base, ...strokeCss, position: 'relative' }}>{body}</div>
      </div>
    );
  }
  return <div style={{ ...base, ...strokeCss, textShadow: shadows || undefined }}>{body}</div>;
};

/** Absolutely positioned wrapper: the block's centre sits on (x, y), then translate / scale / rotate about that centre. */
export const At: React.FC<{
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  s?: number;
  rot?: number;
  opacity?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ x, y, dx = 0, dy = 0, s = 1, rot = 0, opacity = 1, origin = '50% 50%', children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      // shrink-to-fit would cap the box at the space left of x (a block near the right edge would wrap / sit off-centre)
      width: 'max-content',
      transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${s}) rotate(${rot}deg)`,
      transformOrigin: origin,
      opacity,
    }}
  >
    {children}
  </div>
);
