// types.ts: the shared props + the 2022 LOOK of the halloween-2022 engines (theme `halloween-2022` of the effects library,
// video-creation/assets/effects/library.json, devices hw-*). Source: Mike's 2022 "Bear Markets" video (CodeMonkey 044),
// studied 0:00-1:50 ONLY. Every px is at 1920x1080, every time is SECONDS on the comp clock (KtClock `t`,
// ../kinetic-text/clock.tsx). The colours and typefaces below ARE this theme's look (a remake keeps them).
import { KtSoundCue } from '../kinetic-text/types';

/** A sound placement (same shape as the kinetic-text cues; placed by <KtSfx>). */
export type HwSoundCue = KtSoundCue;

export const HW_2022 = {
  /** hw-word-pop: Showcard Gothic (installed system font C:\Windows\Fonts\SHOWG.TTF, PostScript ShowcardGothic-Reg) */
  wordFont: "'Showcard Gothic', 'ShowcardGothic-Reg', Impact, sans-serif",
  /** hw-word-pop fill (flat, no stroke, no shadow) */
  wordGreen: '#27FF14',
  /** hw-zoom-slideshow titles: the AE template's Lato-Heavy (read from the .aep); Google Fonts carries Lato 900 (Black),
   * the closest weight, so the comp loads Lato 900 */
  slideFont: "'Lato', sans-serif",
  slideWeight: 900,
  /** slideshow title red, measured on the AE render (#D00008 .. #E00000) */
  slideRed: '#E00000',
  slideWhite: '#FFFFFF',
  /** hw-blood-promo / hw-blood-title: Montserrat-Black titles (read from the .aep) */
  promoFont: "'Montserrat', sans-serif",
  promoWeight: 900,
  promoRed: '#E60003',
  /** the template's serif subtitle font aAntaraDistance is not installed: Times New Roman matches the rendered glyphs */
  serifFont: "'Times New Roman', Times, serif",
  /** the blood plates' red (measured on Blood_2.mov) */
  bloodRed: '#E80000',
  /** the red panel = the scene comp through an AE Tint (black -> dark red, white -> red) + Grid + halftone */
  tintBlack: [0.1, 0.0, 0.0] as [number, number, number],
  tintWhite: [1.0, 0.1, 0.1] as [number, number, number],
  redGrid: { cellW: 298, cellH: 238, line: 2, color: 'rgba(255,36,36,0.62)' },
  whiteGrid: { cellW: 170, cellH: 135, line: 2, color: 'rgba(255,255,255,0.55)' },
  /** hw-subscribe-like-bell: the Scene_19 MOGRT colour controls (baked into the rendered plate) */
  mogrt: { bg: '#FF5658', text: '#FFFFFF', bell: '#FDC846', finger: '#000000' },
};
