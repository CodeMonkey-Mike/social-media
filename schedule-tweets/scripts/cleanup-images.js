#!/usr/bin/env node
'use strict';

// DEPRECATED entrypoint — kept so the documented `node scripts/cleanup-images.js`
// workflow keeps working. The schedule-tweets cleanup policy now lives in the
// unified multi-target cleaner at social-media/cleanup/. This shim just forwards
// to it with --target schedule-tweets (and passes through --dry-run).

const path = require('path');
const { spawnSync } = require('child_process');

const engine = path.resolve(__dirname, '..', '..', 'cleanup', 'cleanup.js');
const passthrough = process.argv.slice(2).filter(a => a !== '--target' && !a.startsWith('--target='));

const res = spawnSync(process.execPath, [engine, '--target', 'schedule-tweets', ...passthrough], { stdio: 'inherit' });
process.exit(res.status == null ? 1 : res.status);
