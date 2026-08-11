'use strict';
// Sequential runner for the early-crash Lane 3 image batch (18 single-item invocations).
const { spawnSync } = require('child_process');
const jobs = [
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-01-x-tweets-cab451e8.json",
  "prefix": "x-tweets"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-02-x-tweets-10387a07.json",
  "prefix": "x-tweets"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-03-x-tweets-8dd08cf4.json",
  "prefix": "x-tweets"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-04-x-tweets-8bac49e6.json",
  "prefix": "x-tweets"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-05-x-tweets-118377a2.json",
  "prefix": "x-tweets"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-06-x-tweets-27d73129.json",
  "prefix": "x-tweets"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-07-ig-single-118377a2.json",
  "prefix": "ig-single"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-08-ig-single-10387a07.json",
  "prefix": "ig-single"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-09-yt-posts-88a84f3d.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-10-yt-posts-f9dd85ce.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-11-yt-posts-f1bca675.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-12-yt-posts-8ef9dcc8.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-13-yt-posts-827b80c9.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-14-yt-posts-fd2a4a56.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-15-yt-posts-4b11a3cf.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-16-yt-posts-d2aeea29.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-17-yt-posts-b788116d.json",
  "prefix": "yt-posts"
 },
 {
  "file": "C:\\Users\\mnede\\Documents\\Claude\\social-media\\repurpose\\_genlist-ec-18-yt-posts-ba36d83a.json",
  "prefix": "yt-posts"
 }
];
let ok = 0, fail = 0;
for (const j of jobs) {
  console.log('[' + new Date().toISOString() + '] START ' + j.prefix + ' ' + j.file);
  const r = spawnSync('node', ['gen-images.js', '--list=' + j.file, '--prefix=' + j.prefix],
                      { cwd: __dirname, stdio: 'inherit', shell: false });
  if (r.status === 0) { ok++; console.log('[' + new Date().toISOString() + '] OK ' + j.file); }
  else { fail++; console.log('[' + new Date().toISOString() + '] FAIL(' + r.status + ') ' + j.file); }
}
console.log('BATCH DONE ok=' + ok + ' fail=' + fail);
