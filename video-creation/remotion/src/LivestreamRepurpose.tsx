import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

/**
 * LivestreamRepurpose — turn a 16:9 livestream recording into a 9:16 vertical
 * short with the screen-share CONTENT on top and Mike's FACE on the bottom,
 * reproducing the exact framing Mike dials in by hand in Premiere Pro.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * How the Premiere framing was learned (see livestream-repurpose/media/*.png)
 * ─────────────────────────────────────────────────────────────────────────
 * Premiere sequence: 1080 x 1920. Both layers are the SAME 1920x1080 source.
 * Each clip's Anchor Point is the source center (960, 540). Premiere "Motion"
 * maps a source pixel (x,y) to the sequence as:
 *
 *     seq = Position + (Scale/100) * ((x,y) - Anchor)
 *
 * In CSS, an element placed at left:0/top:0 at native size 1920x1080, with
 * `transform-origin: 960px 540px` and `transform: translate(Tx,Ty) scale(s)`,
 * maps a local pixel (x,y) to:
 *
 *     out = Anchor + s*((x,y) - Anchor) + (Tx,Ty)
 *
 * Matching the two gives the port rule (anchor = origin = 960,540):
 *
 *     s  = Scale / 100
 *     Tx = PositionX - 960
 *     Ty = PositionY - 540
 *
 * Premiere values Mike set, and the resulting CSS transform:
 *
 *   CONTENT (top):  Scale 81%,  Position 696, 416  ->  translate(-264,-124) scale(0.81)
 *   FACE    (btm):  Scale 258%, Position -1317,1005 -> translate(-2277, 465) scale(2.58)
 *
 * Z-order: FACE is full-frame and drawn first; CONTENT is drawn on top and
 * covers the upper ~44% of the frame. They meet flush (no divider).
 */

const SRC_W = 1920;
const SRC_H = 1080;
const ANCHOR_X = 960;
const ANCHOR_Y = 540;

export type LayerFraming = {
  /** Premiere "Scale" percent (uniform). */
  scalePct: number;
  /** Premiere "Position" X in sequence pixels. */
  posX: number;
  /** Premiere "Position" Y in sequence pixels. */
  posY: number;
};

// The framing Mike dialed in by hand in Premiere Pro.
export const CONTENT_FRAMING: LayerFraming = { scalePct: 81, posX: 696, posY: 416 };
export const FACE_FRAMING: LayerFraming = { scalePct: 258, posX: -1317, posY: 1005 };

function framingStyle(f: LayerFraming): React.CSSProperties {
  const s = f.scalePct / 100;
  const tx = f.posX - ANCHOR_X;
  const ty = f.posY - ANCHOR_Y;
  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: SRC_W,
    height: SRC_H,
    transformOrigin: `${ANCHOR_X}px ${ANCHOR_Y}px`,
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
  };
}

export type LivestreamRepurposeProps = {
  /** Path under video-creation/assets/ (staticFile root). */
  src: string;
  /** Trim the source: first frame to show (in source frames). */
  trimBefore?: number;
  /** Per-layer framing overrides (default to Mike's Premiere values). */
  content?: LayerFraming;
  face?: LayerFraming;
};

export const LivestreamRepurpose: React.FC<LivestreamRepurposeProps> = ({
  src,
  trimBefore = 0,
  content = CONTENT_FRAMING,
  face = FACE_FRAMING,
}) => {
  const url = staticFile(src);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* FACE — full-frame, behind */}
      <OffthreadVideo src={url} trimBefore={trimBefore} muted style={framingStyle(face)} />
      {/* CONTENT — top band, in front */}
      <OffthreadVideo src={url} trimBefore={trimBefore} style={framingStyle(content)} />
    </AbsoluteFill>
  );
};
