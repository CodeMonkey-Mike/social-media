// sfx.ts: the kinetic-text sounds as the SFX catalog knows them (video-creation/assets/sfx/kinetic-text/library.json):
// id -> file, id -> attack_sec. The PLACEMENT RULE for a cue the rows write as "ON <frame>" is the one in
// longform-edited/skills/overlays/overlays.md section 2: the sound is cut with its attack_sec (file start -> loudest
// sample) ON that frame, so the file starts attack_sec early. Cues the rows give as an explicit "file start" / "starts
// X s before" (with a clip in-point) are written as such in each engine's sound helper.
import sfxLibrary from '../../../../assets/sfx/kinetic-text/library.json';
import { KtSoundCue } from './types';

type SfxRow = { id: string; file: string; attack_sec?: number; duration_sec?: number };
const rows = (sfxLibrary as unknown as { kinetic_text: SfxRow[] }).kinetic_text;

const row = (id: string): SfxRow => {
  const r = rows.find((x) => x.id === id);
  if (!r) throw new Error(`kinetic-text sound id not in the SFX catalog: ${id}`);
  return r;
};

/** SFX catalog id -> file name inside video-creation/assets/sfx/kinetic-text/ (e.g. 'punch-1-2023' -> 'punch-1.mp3') */
export const ktSfxFile = (id: string): string => row(id).file;

/** SFX catalog id -> seconds from file start to its loudest sample */
export const ktSfxAttack = (id: string): number => row(id).attack_sec ?? 0;

/** A cue whose ATTACK lands ON the frame at t (the overlays.md placement rule). */
export const onFrame = (id: string, t: number, note?: string): KtSoundCue => ({ id, at: t - ktSfxAttack(id), note });
