// Build the b-roll items.json for the better-coins shorts batch.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const SCRATCH = 'C:\\Users\\mnede\\AppData\\Local\\Temp\\claude\\C--Users-mnede-Documents-Claude-social-media\\c2d639fa-1a49-4aa5-80e9-1d4c510728b6\\scratchpad';
const REF = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\images\\reference';
const KAS = path.join(REF, 'kaspa-logo.png');
const TAO = path.join(REF, 'bittensor-tao.png');
const id = () => crypto.randomUUID().replace(/-/g, '').slice(0, 8);
const V = 'Pixar-style 3D animated CGI illustration, 9:16 vertical full-frame. ';
const C = 'Cinematic photorealistic 3D render, 9:16 vertical full-frame. ';
const NOTXT = ' No text or words anywhere in the image.';
const items = [
  { slug: 'lost-in-space-robot', prompt: C + 'A classic 1960s retro science-fiction robot (boxy torso, a clear glass dome head with mechanical parts inside, a single red glowing sensor, accordion-tube arms with claw hands) flailing both arms up in alarm and panic, warning of danger. Dark dramatic spotlit stage with a red warning-light glow. Retro-futuristic, comedic alarm.' + NOTXT },
  { slug: 'broken-cycle', prompt: C + 'A large glowing circular cycle wheel made of four equal curved arc segments, violently cracking and shattering apart, glowing shards flying outward. Deep navy near-black background, dramatic red and orange rim lighting. Ominous.' + NOTXT },
  { slug: 'cycle-zombies', prompt: C + 'A horde of glassy-eyed cartoon zombies in business suits shuffling forward in a dark identical crowd, mindless. Dark storm-cloud background, eerie green moonlight rim lighting. Ominous, satirical.' + NOTXT },
  { slug: 'ai-caged', prompt: C + 'A glowing humanoid AI brain-robot locked inside a heavy steel cage with a large official padlock on the door, dim and powered down. Dark near-black background, cold blue spotlight. Tense, oppressive.' + NOTXT },
  { slug: 'bittensor-network', ref: TAO, prompt: V + 'A bright thriving decentralized network of many small interconnected glowing blue nodes spreading across dark space, unstoppable, with a glowing Bittensor TAO coin (the logo in the attached reference image) at the center. Deep navy near-black background, dramatic blue rim lighting. Defiant, hopeful.' + NOTXT },
  { slug: 'tao-staircase', ref: TAO, prompt: V + 'A small glowing blue Bittensor TAO coin character (the logo in the attached reference image) standing at the base of a giant golden Bitcoin mountain that towers into the clouds, looking up hopefully. Deep navy near-black background, blue and warm-gold rim lighting. Aspirational.' + NOTXT },
  { slug: 'kaspa-whales', ref: KAS, prompt: V + 'A few enormous calm whales made of glowing teal Kaspa coins (showing the backwards-K mirrored-K Kaspa logo from the attached reference image) quietly swallowing a stream of small teal coins underwater, while tiny panicked retail investors flee on the surface above. Deep navy near-black ocean, teal god rays. Powerful, ominous.' + NOTXT },
  { slug: 'kaspa-construction', ref: KAS, prompt: V + 'A giant glowing teal Kaspa coin (backwards-K mirrored-K logo from the attached reference image) under construction surrounded by scaffolding and cranes, nearly finished, while tiny cartoon haters at the bottom throw tomatoes that bounce off it. Deep navy near-black background, teal rim light. Confident, comedic.' + NOTXT },
  { slug: 'waiting-rocket', ref: KAS, prompt: V + 'A cartoon investor sitting frozen on a pile of cash with a worried face, watching a glowing teal Kaspa rocket (backwards-K mirrored-K Kaspa logo from the attached reference image) blast off into the sky and leave without him. Deep navy near-black background, teal exhaust glow. Regretful, dramatic.' + NOTXT },
  { slug: 'dotcom-1992', prompt: C + 'A nostalgic early-1990s scene: a boxy beige desktop computer with a glowing CRT monitor on a wooden desk, tangled cables, soft warm retro lighting, dust motes in the air, the dawn of the internet age. Dark warm background, cinematic.' + NOTXT },
  { slug: 'magnificent-crash', prompt: C + 'A giant red glowing financial market candlestick chart plummeting off a cliff edge into a dark abyss, a tiny silhouetted figure watching from the edge. Dark storm-cloud background, dramatic red rim lighting. Ominous, epic.' + NOTXT },
];
for (const it of items) it.image_id = id();
const list = items.map(i => ({ image_id: i.image_id, slug: i.slug, prompt: i.prompt, ...(i.ref ? { ref: i.ref } : {}) }));
fs.writeFileSync(path.join(SCRATCH, 'items_broll.json'), JSON.stringify(list, null, 2));
fs.writeFileSync(path.join(SCRATCH, 'broll_ids.json'), JSON.stringify(Object.fromEntries(items.map(i => [i.slug, i.image_id])), null, 2));
console.log('items_broll.json:', items.length, 'images');
for (const i of items) console.log(' ', i.slug.padEnd(22), i.image_id, i.ref ? '(ref ' + path.basename(i.ref) + ')' : '');
