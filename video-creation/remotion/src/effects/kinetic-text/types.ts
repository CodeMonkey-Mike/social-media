// types.ts: the shared props + the 2023 look defaults of the kinetic-text-2023 engines.
// Catalog of record: video-creation/assets/effects/library.json (devices kt-*, theme kinetic-text-2023).
// Every px is at 1920x1080, every time is SECONDS on the comp clock (KtClock `t`, see clock.tsx).

/** Props every engine takes. */
export type KtCommon = {
  /** first frame of the device, seconds on the comp clock */
  t0: number;
  /** the cut that removes it (exclusive), seconds on the comp clock */
  t1: number;
  /** CSS font-family of the text (house videos pass their display font); default KT_2023.font (Montserrat) */
  font?: string;
  /** default 800 (Montserrat ExtraBold) */
  fontWeight?: number;
  /** default 'italic' */
  fontStyle?: 'italic' | 'normal';
  /** the accent colour: key words / fill, per device (see each engine's default) */
  accent?: string;
  /** body text colour (default white) */
  textColor?: string;
  /** multi-sample shutter motion blur on the moving text (default true) */
  motionBlur?: boolean;
};

/** One line of text. Words wrapped in *asterisks* are KEY words and take the accent colour. */
export type KtLine = string;

/** A sound placement that belongs to a device (the motion + sound pairing). Seconds on the comp clock. */
export type KtSoundCue = {
  /** SFX catalog id (video-creation/assets/sfx/kinetic-text/library.json) */
  id: string;
  /** where sample 0 of the untrimmed file sits ("file start" in the catalog rows) */
  at: number;
  /** seconds of the file skipped (the 2023 clip in-point); playback starts at at + trimIn */
  trimIn?: number;
  /** seconds played after trimIn (the 2023 clip length); undefined = to the end of the file */
  dur?: number;
  /** which catalog line the placement comes from */
  note?: string;
};

/** The 2023 look (theme kinetic-text-2023 `look_2023` + the device rows). A house video overrides via props. */
export const KT_2023 = {
  font: "'Montserrat', sans-serif",
  fontWeight: 800,
  fontStyle: 'italic' as const,
  yellow: '#FCFE40', // key words
  white: '#FFFFFF',
  whiteHeadline: '#FDFDFD',
  red: '#E70001', // punch word, paper label, icon red on screen
  blue: '#030AF4', // paper label (business)
  payoffGreen: '#20F91A', // word-by-word payoff
  scatterGreen: '#1EFF06',
  listBlue: '#0B81F6',
  listRed: '#E80101',
  panel: '#003C33', // dark panel texture tone
  band: '#043E38', // dark band on-screen avg
  cardFont: "'Arial Black', 'Arial', sans-serif",
  cardColor: '#000000',
  /** soft dark drop shadow of the white / yellow text */
  shadow: '5px 6px 10px rgba(0,0,0,0.62), 2px 3px 3px rgba(0,0,0,0.45)',
  /** soft grey drop shadow of the black Arial Black paper cards */
  cardShadow: '4px 5px 8px rgba(70,70,70,0.45)',
};

/** Montserrat cap height (700 / 1000 units): caps px = CAP * fontSize. Used to turn the rows' caps px into font sizes. */
export const CAP = 0.7;
/** Arial Black cap height (0.716 em). */
export const CAP_ARIAL_BLACK = 0.716;
