// Lane 3 (this-is-gonna-rip) - 2 polls. Both Kaspa/TAO -> YT poll AND X poll.
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const YT = ROOT + '\\schedule-tweets\\data\\yt-text-polls.json';
const XP = ROOT + '\\schedule-tweets\\data\\x-polls.json';
const TRANSCRIPT = 'transcripts/this is gonna rip LOW BPS VERTICAL/this is gonna rip LOW BPS VERTICAL_plain.txt';
const now = new Date().toISOString();

const polls = [
  {
    key: 'kaspa-energy-money',
    topic: 'Is Bitcoin or Kaspa the real energy backed money?',
    source_post: 'yt-post-2026-06-15-bitcoin-proved-kaspa-improved',
    yt_question: "Elon Musk says the system will not use dollars in the future, just mass and energy. Bitcoin is the closest thing we have ever had to energy backed money; it proved you cannot fake energy.\n\nBut proving an idea and perfecting it are two different things. Kaspa runs the same proof of work with far more efficiency: blocks every second, GhostDAG, fair launch, no premine.\n\nSo which one is the real energy money?",
    yt_options: ["Bitcoin is the peak of energy backed money", "Kaspa already improved on it", "Both win, different roles"],
    x_text: "Elon says money is just mass and energy, and Bitcoin proved you cannot fake energy.\n\nBut is Bitcoin the final form of energy money, or did Kaspa already improve on it?\n\n#kaspa",
    x_options: ["Bitcoin is peak PoW money", "Kaspa already improved it"],
  },
  {
    key: 'tao-decentralized-ai',
    topic: 'Does government control of AI make decentralized AI inevitable?',
    source_post: 'yt-post-2026-06-15-decentralized-ai-tao',
    yt_question: "The US government just ordered Anthropic to cut off its Fable 5 and Mythos 5 models from every foreign national, citing national security. Anthropic disabled them for everyone to comply.\n\nOne directive, and millions of people lost access to a frontier model overnight. This is exactly the scenario Bittensor was built for: an AI network nobody owns and nobody can switch off.\n\nWhen governments can flip the switch on centralized AI, does decentralized AI become inevitable?",
    yt_options: ["Inevitable, decentralized AI like TAO wins", "Governments will control AI either way", "Still a niche bet for now"],
    x_text: "The US government just ordered Anthropic to switch off its most powerful AI model for every foreign national on earth.\n\nDoes that make decentralized AI like $TAO inevitable, or is it still a niche bet?\n\n#bittensor",
    x_options: ["Inevitable, $TAO wins", "Still a niche bet"],
  },
];

function check(arr, max, label) {
  for (const o of arr) { if (o.length > max) { console.error(`${label} option over ${max}:`, o, o.length); process.exit(1); } }
}

const yt = JSON.parse(fs.readFileSync(YT, 'utf8'));
const xp = JSON.parse(fs.readFileSync(XP, 'utf8'));
for (const p of polls) {
  if ((p.yt_question + p.x_text + p.yt_options.join() + p.x_options.join()).includes('—')) { console.error('EM DASH', p.key); process.exit(1); }
  check(p.yt_options, 65, 'YT'); check(p.x_options, 25, 'X');
  if (p.x_text.length > 280) { console.error('X tweet over 280', p.key, p.x_text.length); process.exit(1); }
  yt.polls.push({
    id: `yt-text-poll-2026-06-15-${p.key}`,
    topic: p.topic,
    source_post: p.source_post,
    source_transcript: TRANSCRIPT,
    question_text: p.yt_question,
    hook: p.yt_question.split('\n')[0],
    options: p.yt_options,
    capture_results_after_days: 7,
    created_at: now, status: 'pending', posted_at: null, post_url: null,
    results: null, results_captured_at: null,
  });
  xp.polls.push({
    id: `poll-2026-06-15-${p.key}`,
    topic: p.topic,
    source_transcript: TRANSCRIPT,
    tweet_text: p.x_text,
    hook: p.x_text.split('\n')[0],
    options: p.x_options,
    duration: '1d',
    created_at: now, status: 'pending', posted_at: null, poll_url: null,
    results: null, results_captured_at: null,
  });
}
fs.writeFileSync(YT, JSON.stringify(yt, null, 2));
fs.writeFileSync(XP, JSON.stringify(xp, null, 2));
console.log(`YT polls now ${yt.polls.length}, X polls now ${xp.polls.length}`);
polls.forEach(p => console.log('  poll:', p.key, '| X opts', p.x_options.map(o=>o.length).join('/'), '| YT opts', p.yt_options.length));
