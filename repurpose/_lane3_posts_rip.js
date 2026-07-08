// Lane 3 (this-is-gonna-rip) - 2 long YT community posts (~2100 chars). Kaspa + TAO.
const fs = require('fs');
const ROOT = 'C:\\Users\\mnede\\Documents\\Claude\\social-media';
const P = ROOT + '\\schedule-tweets\\data\\yt-posts.json';
const TRANSCRIPT = 'transcripts/this is gonna rip LOW BPS VERTICAL/this is gonna rip LOW BPS VERTICAL_plain.txt';
const now = new Date().toISOString();

const posts = [
  {
    id: 'yt-post-2026-06-15-bitcoin-proved-kaspa-improved',
    topic: 'Bitcoin proved energy money, Kaspa improved it',
    variation_label: 'A + CTA-subscribe',
    body_style: 'project conviction / energy-money thesis',
    body: "Elon Musk just said something that should change how you think about money.\n\nHe said the system will not use dollars as currency in the future. Just mass and energy. Last year he put it even more simply: you can issue fake fiat, every government in history has, but it is impossible to fake energy.\n\nSo here is the real question. If energy is the only honest money, what is the most efficient version of energy backed money ever built?\n\nMost people will say Bitcoin, and they are not wrong to start there. Bitcoin proved the entire idea. It took proof of work, turned electricity into security, and built a money no central bank can print into oblivion. That was the breakthrough. Bitcoin proved you cannot fake energy.\n\nBut proving an idea and perfecting it are two different things.\n\nBitcoin settles a block every ten minutes and handles about seven transactions a second. That was incredible for 2009. It is a bottleneck in 2026. Kaspa takes the exact same proof of work, the same fair launch with no premine, the same no-VC-unlock honesty, and runs it with GhostDAG: blocks every second instead of every ten minutes. Same sound money principles. None of the speed limit.\n\nThat is why a comment from a viewer in Bogota stuck with me this morning. He said it better than any thread I could write: Bitcoin proved it, Kaspa improved it. Four words, and that is the whole thesis.\n\nThis is not me telling you to sell your Bitcoin. I hold it, I respect what it proved, and the energy money idea belongs to it. I am telling you the idea did not stop evolving the day Bitcoin launched. The most efficient version of honest, energy backed money is being built right now, in the open, with no premine and no founder cult.\n\nNothing here is financial advice. It is just what I see when I line the two up side by side.\n\nSo here is my question for you: when you picture the energy money that actually gets used at scale, do you see Bitcoin as the final form, or do you see Kaspa already improving on it? Tell me in the comments.\n\nIf you want the macro and Kaspa breakdowns the four-year cycle crowd will not give you, hit like and subscribe.",
    engagement_question: "When you picture the energy money that actually gets used at scale, do you see Bitcoin as the final form, or do you see Kaspa already improving on it?",
  },
  {
    id: 'yt-post-2026-06-15-decentralized-ai-tao',
    topic: 'Government control of AI makes decentralized AI (TAO) inevitable',
    variation_label: 'A + CTA-subscribe',
    body_style: 'macro / decentralized-AI thesis',
    body: "Last Friday the US government did something that should make every single AI user pay attention, and almost nobody connected it to crypto.\n\nThe Commerce Department ordered Anthropic to cut off its two most powerful models, Fable 5 and Mythos 5, from every foreign national on earth. Not foreign governments. Not bad actors. Every foreign national, inside or outside the US, including Anthropic's own foreign-national employees. They cited national security and a jailbreaking concern. To comply, Anthropic disabled the models for everyone.\n\nSit with that for a second. One letter from one agency, and the most powerful AI on the market went dark for millions of people overnight.\n\nThis is the part most of crypto is sleeping on. The AI everyone is racing to depend on has an off switch, and you are not the one holding it. A government can flip it. A company can flip it to stay compliant. Your access to the most important tool of the decade is a permission someone else can revoke without warning.\n\nNow line that up against what Bittensor is actually building. TAO is a decentralized network for AI: an open market for machine intelligence that no single company owns and no single government can switch off. When the centralized option just proved it can be turned off by decree, a neutral layer nobody controls stops looking like a niche crypto bet and starts looking inevitable.\n\nThis is the same principle I keep coming back to. The more governments and corporations race to control compute, money, and AI, the more valuable the decentralized alternatives become. TAO is the AI inference layer nobody owns. Kaspa is the proof of work money layer nobody owns. Two sides of the exact same idea: neutral infrastructure that cannot be shut off.\n\nTAO has been ripping while the rest of the market chops, and I do not think that is a coincidence. People are starting to understand what they actually need.\n\nNothing here is financial advice, it is just the thesis I am betting on.\n\nSo here is my question: when governments can switch off centralized AI with a single order, does decentralized AI become inevitable, or is TAO still a niche bet to you? Tell me in the comments.\n\nIf you want the macro and crypto takes that connect dots like these, hit like and subscribe.",
    engagement_question: "When governments can switch off centralized AI with a single order, does decentralized AI become inevitable, or is TAO still a niche bet to you?",
  },
];

const data = JSON.parse(fs.readFileSync(P, 'utf8'));
let added = 0;
for (const p of posts) {
  if (p.body.includes('—')) { console.error('EM DASH in', p.id); process.exit(1); }
  data.posts.push({
    id: p.id, topic: p.topic, source_transcript: TRANSCRIPT,
    variation_label: p.variation_label, body_style: p.body_style,
    cta_target: 'follow_x', created_at: now, status: 'pending',
    posted_at: null, post_url: null, body: p.body,
    engagement_question: p.engagement_question, char_count: p.body.length,
  });
  added++;
}
fs.writeFileSync(P, JSON.stringify(data, null, 2));
console.log(`appended ${added} YT posts; total now ${data.posts.length}`);
posts.forEach(p => console.log('  ', p.body.length, 'chars |', p.id));
