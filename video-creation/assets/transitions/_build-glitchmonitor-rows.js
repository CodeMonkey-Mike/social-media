#!/usr/bin/env node
/** Build the 8 Glitch Monitor rows from _glitchmonitor-clips.json and MERGE them into
 * library.json (replaces glitchmonitor-* rows only; never touches other rows).
 * Real values per sequence (see _extract-glitchmonitor.js):
 *  - offsets: t3 "Texture Adjustment" windows — full-frame wrap Offset (dx = x-0.5, dy = y-0.5),
 *             split at the 0.16s cut in every variant
 *  - hst:     t1 "HST Adjustment" window (Offset +0.36% x, Emboss 90deg/7/70, Tint
 *             black->GREEN / white->BLACK, Pin Light) — also the settle-envelope support
 *  - blur/stretch: t2 Fast Blur 100 + Geometry2 Scale Height 150 (ghost/smear copy)
 *  - plate:   t4 "Glitch Monitor <n>.mp4" (flat 50% gray + colored signal bands),
 *             Premiere Blend Mode 17 (Pin Light), media in-point 0
 *  - swapAt:  the t4 plate clip's split point / duration (the A->B cut hides there)
 *  - SFX:     Glitch_Overlay_1_0<n>.mp3, mapping verified from each sequence's audio
 *             track in the project XML (1:1 by number)
 */
const fs = require('fs');
const path = require('path');

const clips = require('./_glitchmonitor-clips.json');
const libPath = path.join(__dirname, 'library.json');
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

const num = (s) => Number(s);

const rows = [];
for (const seq of clips) {
  if (seq.error) throw new Error(seq.name + ': ' + seq.error);
  const n = seq.name.match(/Glitch Monitor - (\d)/)[1];
  const id = `glitchmonitor-${n}`;

  const dur = Math.max(...seq.clips.map((c) => c.end || 0));

  // t3 offset windows (constant full-frame Offset per window; two, split at 0.16)
  const offsets = seq.clips
    .filter((c) => c.track === 3)
    .sort((a, b) => a.start - b.start)
    .map((c) => {
      const off = c.effects.find((e) => /ADBE Offset/.test(e.matchName));
      const v = off.params.find((p) => p.name === 'Shift Center To');
      const [x, y] = v.value.split(':').map(num);
      return { t0: c.start, t1: c.end, dx: +(x - 0.5).toFixed(4), dy: +(y - 0.5).toFixed(4) };
    });

  // t1 HST window + its real params
  const t1 = seq.clips.find((c) => c.track === 1);
  const hst = { t0: t1.start, t1: t1.end };
  const hOff = t1.effects.find((e) => /ADBE Offset/.test(e.matchName)).params.find((p) => p.name === 'Shift Center To');
  const hstShiftX = +(num(hOff.value.split(':')[0]) - 0.5).toFixed(5);
  const emb = t1.effects.find((e) => /ADBE Emboss/.test(e.matchName)).params;
  const ev = (nm) => num(emb.find((p) => p.name === nm).value);
  const embossP = { reliefPx: ev('Relief'), contrast: +(ev('Contrast') / 100).toFixed(2) };

  // t2 blur + stretch
  const t2 = seq.clips.find((c) => c.track === 2);
  const blurPx = num(t2.effects.find((e) => /Fast Blur/.test(e.matchName)).params.find((p) => p.name === 'Blurriness').value);
  const stretchY = num(t2.effects.find((e) => /Geometry2/.test(e.matchName)).params.find((p) => p.name === 'Scale Height').value) / 100;

  // t4 plate split -> swapAt (plate media plays continuously from in-point 0)
  const t4 = seq.clips.filter((c) => c.track === 4).sort((a, b) => a.start - b.start);
  const swapAt = +(t4[0].end / dur).toFixed(4);
  const plateIn = t4[0].inPoint || 0;

  rows.push({
    id,
    category: 'GLITCH',
    variant: 'Monitor',
    intensity: `${n}`,
    label: `Glitch · Monitor · ${n}`,
    engine: 'GlitchMonitor',
    kind: 'footage',
    fidelity: 'approximate',
    durationSeconds: dur,
    params: {
      offsets,
      hst,
      hstShiftX,
      emboss: embossP,
      blurPx,
      stretchY,
      plateDir: `transitions/lib/plates/glitchmonitor-${n}`,
      plateCount: 30,
      plateIn,
      plateOpacity: 1,
      swapAt,
    },
    sfx: `transitions/lib/sfx-glitchmonitor-${n}.mp3`,
    used_in: [],
    meta: {
      aspectRatios: ['16:9'],
      resolution: '1920x1080',
      family: 'Glitch',
      engineFile: 'remotion/src/transitions/engines/GlitchMonitor.tsx',
      description:
        'Monitor-signal glitch: colored signal bands sweep over the frame, a blurred stretched ghost of the shot slams across the cut with green embossed scan relief, then everything snaps clean; faster and bandier than Cinematic Monitor.',
      energy: 'high',
      durationSeconds: dur,
      hasSound: true,
      fidelity: 'approximate',
      tags: ['glitch', 'monitor', 'signal', 'bands', 'smear', 'green'],
      useWhen:
        `Fast punchy signal-glitch cut (~${dur}s) on an energetic beat; 8 variants differ in band pattern, ghost direction and glitch-window length.`,
    },
  });
}

const keep = lib.transitions.filter((r) => !/^glitchmonitor-/.test(r.id));
lib.transitions = [...keep, ...rows];
fs.writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`merged ${rows.length} glitchmonitor rows into library.json (total ${lib.transitions.length} rows)`);
for (const r of rows)
  console.log(
    `  ${r.id}: dur=${r.durationSeconds}s swapAt=${r.params.swapAt} hst=${r.params.hst.t0}-${r.params.hst.t1} offsets=${r.params.offsets.map((o) => `(${o.dx},${o.dy})`).join(' ')}`
  );
