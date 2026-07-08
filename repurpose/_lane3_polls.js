// Lane 3 — 2 polls. P1 (four-year cycle) = YT only. P2 (Kaspa) = YT + X.
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const YTP = ROOT + '\\schedule-tweets\\data\\yt-text-polls.json';
const XP  = ROOT + '\\schedule-tweets\\data\\x-polls.json';
const TRANSCRIPT = 'video-creation/livestream-repurpose/transcripts/4-year cycle dilemma LOW BPS VERTICAL/4-year cycle dilemma LOW BPS VERTICAL_plain.txt';

// ---- YT polls ----
const yt = JSON.parse(fs.readFileSync(YTP, 'utf8'));
const p1q = "I shed my four-year cycle belief back in Q2 2025. This week the economy added 172,000 jobs, Bitcoin tagged its 200-week SMA for the first time this cycle, and the market sold off anyway. None of that is a magic clock. It is macro liquidity. So where do you actually stand?";
const p2q = "Kaspa has no premine, no VC unlock, and the same machine that mined block one still mines it today. Pure fair-launch proof of work, the kind of base layer nobody owns. The question that splits the room: does that get it into the top 10 by 2027?";
const ytPolls = [
  {
    id: 'yt-text-poll-2026-06-07-four-year-cycle-dead',
    topic: 'Is the four-year cycle dead or just late',
    source_post: null,
    source_transcript: TRANSCRIPT,
    question_text: p1q,
    hook: p1q.split('. ')[0] + '.',
    options: ['The four-year cycle is dead. Liquidity runs it now', 'It is just running late, the top is still ahead', 'It is still the only thing that matters'],
    capture_results_after_days: 7,
    created_at: '2026-06-07T00:00:00Z',
    status: 'pending', posted_at: null, post_url: null, results: null, results_captured_at: null,
  },
  {
    id: 'yt-text-poll-2026-06-07-kaspa-top-10-2027',
    topic: 'Will Kaspa crack the top 10 by 2027 (fair launch)',
    source_post: null,
    source_transcript: TRANSCRIPT,
    question_text: p2q,
    hook: p2q.split('. ')[0] + '.',
    options: ['Yes. Fair launch wins the long game', 'No. Too early and too quiet for that', 'Top 20 but not top 10'],
    capture_results_after_days: 7,
    created_at: '2026-06-07T00:00:00Z',
    status: 'pending', posted_at: null, post_url: null, results: null, results_captured_at: null,
  },
];
ytPolls.forEach(p => yt.polls.push(p));
fs.writeFileSync(YTP, JSON.stringify(yt, null, 2));

// ---- X poll (Kaspa only) ----
const xp = JSON.parse(fs.readFileSync(XP, 'utf8'));
const xText = "Kaspa has no premine, no VC unlock, and the same machine mines it today that mined block one. Pure fair-launch proof of work. Does it crack the top 10 by 2027?\n\n#Kaspa";
const xPoll = {
  id: 'poll-2026-06-07-kaspa-top-10-2027',
  topic: 'Will Kaspa crack the top 10 by 2027 (fair launch)',
  source_transcript: TRANSCRIPT,
  tweet_text: xText,
  hook: xText.split('\n')[0],
  options: ['Yes, fair launch wins', 'No, too early', 'Top 20 not top 10'],
  duration: '7d',
  created_at: '2026-06-07T00:00:00Z',
  status: 'pending', posted_at: null, poll_url: null, results: null, results_captured_at: null,
};
xp.polls.push(xPoll);
fs.writeFileSync(XP, JSON.stringify(xp, null, 2));

// audits
const allOpts = [...ytPolls.flatMap(p => p.options), ...xPoll.options];
console.log('YT polls now:', yt.polls.length, '| X polls now:', xp.polls.length);
console.log('X option max len:', Math.max(...xPoll.options.map(o => o.length)), '(limit 25)');
console.log('YT option max len:', Math.max(...ytPolls.flatMap(p => p.options.map(o => o.length))), '(limit 65)');
console.log('X tweet_text len:', xText.length, '(limit 280)');
console.log('em-dash present:', [p1q, p2q, xText, ...allOpts].some(s => s.includes('—')));
