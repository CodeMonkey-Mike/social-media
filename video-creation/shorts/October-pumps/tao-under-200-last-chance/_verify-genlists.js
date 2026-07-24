// Verifies the two job lists BEFORE any generation run.
// Historical gotcha (October-pumps): a job file written via `node -e` inside a quoted shell string
// had its Windows backslashes eaten, the --reference path silently did not exist, the upload never
// happened and ChatGPT replied with TEXT instead of an image. So: real job files, and this check.
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const ASSETS_DIR = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\video-creation\\assets';

let bad = 0;
const ref = JSON.parse(fs.readFileSync(path.join(DIR, '_genlist-ref.json'), 'utf8'));
for (const it of ref) {
  const ok = fs.existsSync(it.ref);
  if (!ok) bad++;
  console.log(`${ok ? 'OK  ' : 'MISS'} ref  ${it.slug}  -> ${it.ref}`);
}
const noref = JSON.parse(fs.readFileSync(path.join(DIR, '_genlist-noref.json'), 'utf8'));
for (const it of noref) {
  const out = path.join(ASSETS_DIR, it.file);
  const dirOk = fs.existsSync(path.dirname(out));
  if (!dirOk) bad++;
  console.log(`${dirOk ? 'OK  ' : 'MISS'} out  ${path.basename(out)} -> ${out}`);
}
console.log(bad === 0 ? 'VERIFY PASS' : `VERIFY FAIL (${bad})`);
process.exit(bad === 0 ? 0 : 1);
