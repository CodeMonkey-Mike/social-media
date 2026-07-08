#!/usr/bin/env node
/**
 * Adds/updates the `meta` block on every transition object in library.json so
 * a future Claude (or Mike) can SCAN the catalog and pick a fitting transition:
 * aspect ratios it's authored for, a plain-language description, energy, tags,
 * when-to-use, sound, and the engine file. Re-runnable.
 */
const fs = require('fs');
const path = require('path');
const lib = JSON.parse(fs.readFileSync(path.join(__dirname, 'library.json'), 'utf8'));

const ENGINE_FILE = {
  GlitchBlocks: 'remotion/src/transitions/engines/GlitchBlocks.tsx',
  GlitchBadSignal: 'remotion/src/transitions/engines/GlitchBadSignal.tsx',
};

function energyFor(row) {
  const i = row.intensity || '';
  if (/Max/.test(i)) return 'high';
  if (/Medium/.test(i)) return 'medium';
  if (/Short/.test(i)) return 'low';
  const x = (i.match(/(\d+)x/) || [])[1];
  if (x) return Number(x) >= 3 ? 'high' : 'medium';
  return 'medium';
}

function describe(row) {
  if (row.variant === 'Blocks' && /Strips/.test(row.intensity)) {
    return {
      description: 'Glitch strips: the frame splits into thin horizontal strips that slip sideways (wrapping) and snap back, with a brief opacity flash hiding the cut.',
      tags: ['glitch', 'strips', 'digital', 'scanline', 'hard-cut'],
      useWhen: 'Fast, punchy cuts and rapid montage; subtle-to-energetic depending on density (1x soft … 6x intense).',
    };
  }
  if (row.variant === 'Blocks') {
    return {
      description: 'Digital block-shatter: the frame breaks into rectangular blocks that wrap-shift in several directions then snap back, with an opacity flash burying the A→B cut.',
      tags: ['glitch', 'blocks', 'digital', 'hard-cut', 'tech', 'crypto'],
      useWhen: 'Energetic hard cuts; tech/crypto/hype content; beat drops. Max = most aggressive, Short = quick hit.',
    };
  }
  if (row.variant === 'Cinematic Bad Signal') {
    return {
      description: 'TV bad-signal: horizontal RGB tear-bands roll and pixelate over the footage with a scanline overlay texture; the cut hides in the worst of the roll.',
      tags: ['glitch', 'tv', 'analog', 'rgb-split', 'bad-signal', 'scanline', 'retro'],
      useWhen: 'Gritty analog/retro feel, tension, signal-loss vibe; works between any two scenes.',
    };
  }
  return { description: `${row.variant} ${row.intensity} transition.`, tags: ['transition'], useWhen: 'General cut.' };
}

for (const row of lib.transitions) {
  const d = describe(row);
  row.meta = {
    aspectRatios: ['16:9'],
    resolution: '1920x1080',
    family: 'Glitch',
    engineFile: ENGINE_FILE[row.engine] || null,
    description: d.description,
    energy: energyFor(row),
    durationSeconds: row.durationSeconds,
    hasSound: !!row.sfx,
    fidelity: row.fidelity,
    tags: d.tags,
    useWhen: d.useWhen,
  };
}

// refresh the schema note to document meta
lib.$schema_note = (lib.$schema_note || '').split(' meta: ')[0] +
  ' meta: per-object info for PICKING a transition when editing — aspectRatios (which aspect it is authored for; add "9:16" when a vertical version exists), resolution, family, engineFile, description (plain language), energy (low|medium|high), durationSeconds, hasSound, fidelity, tags[], useWhen. Scan meta to choose a fitting transition for a given cut/aspect.';

fs.writeFileSync(path.join(__dirname, 'library.json'), JSON.stringify(lib, null, 2) + '\n');
console.log('enriched', lib.transitions.length, 'objects with meta');
