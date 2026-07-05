#!/usr/bin/env node
/** Build the 7 Glitch Offset rows from _offset-clips.json and MERGE them into
 * library.json (replaces glitchoffset-* rows only; never touches other rows).
 * Real values per sequence (see _extract-offset.js / _summ-offset.js):
 *  - curve:  t2 "Glitch Offset - Nx" adjustment pair — ONE keyframed full-frame wrap
 *            Offset (y only; x static 0.5 in all 7), 25fps keyframes in media time
 *            (in-point 0.88), merged to sequence time via t_seq = clip.start + (kf.t - inPoint).
 *            The two clips stitch a single continuous curve across the cut.
 *  - swapAt: first t2 clip's end / duration — the A->B cut hides in the offset jump.
 *  - hst:    t1 "Abberations"/"Deviation" window — Offset tiny +y shift, Emboss
 *            dir 180 / relief 3-8 / contrast 60, Tint black->GREEN white->BLACK
 *            (decoded ff00ff00 / ff000000 ARGB), Pin Light (Blend Mode 17; the
 *            8+17 double param matches Glitch Monitor's verified t1 exactly).
 *  - SFX:    NONE. Verified 3 ways: FullHD + 4K sequences both have EMPTY audio
 *            groups (5 tracks, 0 items), previews are video-only streams, and no
 *            Offset-named file exists in (Footage)/Sound. hasSound: false is the
 *            pack's truth, not an omission (Rule 2: don't invent a mapping).
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_offset-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const n = seq.name.match(/Glitch Offset - (\d)x/)[1];
  const id = `glitchoffset-${n}x`;

  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  // t2 pair -> one sequence-time wrap-offset curve (y only; verified x static)
  const t2 = seq.clips.filter((c) => c.track === 2).sort((a, b) => a.start - b.start);
  const pts = new Map();
  for (const c of t2) {
    const off = c.effects.find((e) => /ADBE Offset/.test(e.matchName));
    const kfs = off.params.find((p) => p.name === 'Shift Center To').keyframes;
    for (const kf of kfs) {
      const tSeq = +(c.start + (kf.t - c.inPoint)).toFixed(4);
      if (tSeq < c.start - 1e-6 || tSeq > c.end + 1e-6) continue;
      const [x, y] = kf.v.split(':').map(Number);
      if (Math.abs(x - 0.5) > 1e-6) throw new Error(`${id}: x moves (${x}) — engine assumes y-only`);
      pts.set(tSeq, +(y - 0.5).toFixed(5));
    }
  }
  const curve = [...pts.entries()].sort((a, b) => a[0] - b[0]).map(([t, dy]) => ({ t, dy }));
  const swapAt = +(t2[0].end / dur).toFixed(4);

  // t1 HST/aberration window
  const t1 = seq.clips.find((c) => c.track === 1);
  const hOff = t1.effects.find((e) => /ADBE Offset/.test(e.matchName)).params.find((p) => p.name === 'Shift Center To').value.split(':').map(Number);
  const emb = t1.effects.find((e) => /ADBE Emboss/.test(e.matchName)).params;
  const ev = (nm) => Number(emb.find((p) => p.name === nm).value);

  rows.push({
    id,
    category: 'GLITCH',
    variant: 'Offset',
    intensity: `${n}x`,
    label: `Glitch · Offset · ${n}x`,
    engine: 'GlitchOffset',
    kind: 'geometric',
    fidelity: 'near-1:1',
    durationSeconds: dur,
    params: {
      curve,
      swapAt,
      hst: { t0: t1.start, t1: t1.end },
      hstShiftY: +(hOff[1] - 0.5).toFixed(5),
      emboss: { reliefPx: ev('Relief'), contrast: +(ev('Contrast') / 100).toFixed(2) },
    },
    sfx: null,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchOffset.tsx',
      description:
        'Vertical roll glitch: the whole frame wrap-scrolls up/down on a jagged keyframed path (the cut hides inside the first jump), while red/green chromatic-aberration fringes bite on vertical edges, then it snaps back to rest. Density 1x (one clean bump) to 7x (violent multi-screen rolls).',
      energy: n <= '2' ? 'medium' : 'high',
      durationSeconds: dur,
      hasSound: false,
      fidelity: 'near-1:1',
      tags: ['glitch', 'offset', 'roll', 'scroll', 'vertical', 'aberration'],
      useWhen:
        `Frame-roll glitch cut (~${dur}s), reads like a video signal losing v-sync; higher x = longer + wilder. No pack SFX for this family (ships silent; add a whoosh/glitch hit manually if the edit needs one).`,
    },
  });
}

const keep = lib.transitions.filter((r) => !/^glitchoffset-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} glitchoffset rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows)
  console.log(
    `  ${r.id}: dur=${r.durationSeconds}s swapAt=${r.params.swapAt} kf=${r.params.curve.length} relief=${r.params.emboss.reliefPx} peak=${Math.max(...r.params.curve.map((p) => Math.abs(p.dy))).toFixed(2)}`
  );
