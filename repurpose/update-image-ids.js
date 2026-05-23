// One-shot script to write image_id and image_path into tweets.json
// and image_id/image_path into IG-single-image.json for all newly generated images.
const fs = require('fs');

const TWEETS_JSON  = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\data\\x-tweets.json';
const IG_JSON      = 'C:\\Users\\mnede\\Documents\\Claude\\social-media\\schedule-tweets\\data\\ig-single-image.json';

// Map: hook substring (unique enough) → { id, slug }
const TWEET_MAP = [
  // 1
  { match: "My favorite coins I'm stacking this bull run",       id: 'a2f8c3e1', slug: 'favorites-coin-lineup' },
  // 2
  { match: "Both sides think they win the kicked can",           id: 'b5d7e2a4', slug: 'iran-both-sides-kicked-can' },
  { match: "Theory on the Iran ceasefire that won't end",        id: 'b5d7e2a4', slug: 'iran-both-sides-kicked-can' },
  // 3
  { match: "$1,000 bounty for any crypto group with a 98x call, a 550x, a 130x, and a $59 lifetime cap. Open a year", id: 'c8f1b3d6', slug: '1000-dollar-bounty' },
  { match: "$1,000 bounty:\n\nFind me another crypto group",     id: 'c8f1b3d6', slug: '1000-dollar-bounty' },
  { match: "$1,000 bounty:",                                     id: 'c8f1b3d6', slug: '1000-dollar-bounty' },
  // 4
  { match: "Nobody's connecting the dots:",                      id: 'd4a9c2f7', slug: 'hormuz-global-supply-reset' },
  { match: "The Strait of Hormuz isn't a Middle East story",     id: 'd4a9c2f7', slug: 'hormuz-global-supply-reset' },
  // 5
  { match: "An SBR announcement is expected in the coming weeks. The rumor alone is moving things", id: 'e7b5d1c3', slug: 'sbr-announcement-god-candle' },
  { match: "An SBR announcement is expected in the coming weeks.\n\nNobody", id: 'e7b5d1c3', slug: 'sbr-announcement-god-candle' },
  // 6
  { match: "Why retail still can't FOMO into crypto: wages can't break out. AI layoffs are eating the catalyst", id: 'f2c8a4e6', slug: 'retail-fomo-blocked-wages' },
  { match: "Why retail still can't FOMO into crypto:\n\nAI layoffs", id: 'f2c8a4e6', slug: 'retail-fomo-blocked-wages' },
  // 7
  { match: "The dovish replacement for Powell may have to hike on day one",  id: 'a3e6f8b1', slug: 'warsh-inflation-trap' },
  { match: "Kevin Warsh just got confirmed.",                     id: 'a3e6f8b1', slug: 'warsh-inflation-trap' },
  // 8
  { match: "98x on Lab gives you something most retail doesn't have: dry powder.", id: 'b7d2c4f9', slug: 'lab-98x-dry-powder' },
  { match: "98x on Lab. The win isn't the multiplier; it's the dry powder", id: 'b7d2c4f9', slug: 'lab-98x-dry-powder' },
  // 9
  { match: "The Clarity Act stable-coin compromise just landed:", id: 'c1f5a7e3', slug: 'clarity-act-activity-gate' },
  { match: "Idle stable yield is dead.",                         id: 'c1f5a7e3', slug: 'clarity-act-activity-gate' },
  // 10
  { match: "While CT was screaming KRC20s are dead...",          id: 'd8b3c6f2', slug: 'kroak-quiet-6x' },
  { match: "While CT was screaming KRC20s are dead, KROAK quietly ran a 6x", id: 'd8b3c6f2', slug: 'kroak-quiet-6x' },
  // 11
  { match: "The bear market sorted the dev teams who stuck around from the ones who checked out", id: 'e4a1d7c5', slug: 'bear-sorted-dev-teams' },
  { match: "The bear market did us a favor.",                    id: 'e4a1d7c5', slug: 'bear-sorted-dev-teams' },
  // 12
  { match: "Hot take:",                                          id: 'f6c2b8d4', slug: 'ghost-vs-nacho-mascot' },
  { match: "Kaspa is a fully implemented GhostDAG. The fitting mascot", id: 'f6c2b8d4', slug: 'ghost-vs-nacho-mascot' },
  // 13
  { match: "Telecom expansion ran from 1968 to 1996",            id: 'a5e9b3d7', slug: 'ai-mania-compressed-runway' },
  { match: "We're not in 2000. We might not even be in 1995.",   id: 'a5e9b3d7', slug: 'ai-mania-compressed-runway' },
  // 14
  { match: "$20 across ten KRC20s. $200 of total risk.",         id: 'b2f6c1e8', slug: 'krc20-lottery-math' },
  { match: "$200 of risk. One 1,000x = $20,000 back.",           id: 'b2f6c1e8', slug: 'krc20-lottery-math' },
  // 15
  { match: "Even if no Strategic Reserve buy.",                  id: 'c7d3a5f1', slug: 'zombie-sbr-all-roads-ath' },
  { match: "The zombies come back in October when their bottom doesn't show", id: 'c7d3a5f1', slug: 'zombie-sbr-all-roads-ath' },
];

// IG draft posts: map source_post → same image
const IG_MAP = [
  { match: "My favorite coins I'm stacking this bull run",       id: 'a2f8c3e1', slug: 'favorites-coin-lineup' },
  { match: "Why retail still can't FOMO into crypto: wages can't break out", id: 'f2c8a4e6', slug: 'retail-fomo-blocked-wages' },
  { match: "98x on Lab. The win isn't the multiplier",           id: 'b7d2c4f9', slug: 'lab-98x-dry-powder' },
  { match: "$200 of risk. One 1,000x = $20,000 back",            id: 'b2f6c1e8', slug: 'krc20-lottery-math' },
  { match: "An SBR announcement is expected in the coming weeks. The rumor alone", id: 'e7b5d1c3', slug: 'sbr-announcement-god-candle' },
  { match: "The zombies come back in October",                   id: 'c7d3a5f1', slug: 'zombie-sbr-all-roads-ath' },
  { match: "We're not in 2000. We might not even be in 1995",    id: 'a5e9b3d7', slug: 'ai-mania-compressed-runway' },
  { match: "The dovish replacement for Powell may have to hike on day one", id: 'a3e6f8b1', slug: 'warsh-inflation-trap' },
  { match: "The Strait of Hormuz isn't a Middle East story",     id: 'd4a9c2f7', slug: 'hormuz-global-supply-reset' },
  { match: "While CT was screaming KRC20s are dead, KROAK quietly ran a 6x", id: 'd8b3c6f2', slug: 'kroak-quiet-6x' },
  { match: "Both sides think they win the kicked can",           id: 'b5d7e2a4', slug: 'iran-both-sides-kicked-can' },
  { match: "Idle stable yield is dead.",                         id: 'c1f5a7e3', slug: 'clarity-act-activity-gate' },
  { match: "$1,000 bounty for any crypto group with a 98x call",  id: 'c8f1b3d6', slug: '1000-dollar-bounty' },
  { match: "Kaspa is a fully implemented GhostDAG. The fitting mascot", id: 'f6c2b8d4', slug: 'ghost-vs-nacho-mascot' },
  { match: "The bear market sorted the dev teams who stuck around from the ones who checked out", id: 'e4a1d7c5', slug: 'bear-sorted-dev-teams' },
];

function applyToTweets() {
  const data = JSON.parse(fs.readFileSync(TWEETS_JSON, 'utf8'));
  let updated = 0;
  for (const tweet of data.tweets) {
    if (!tweet.tweet) continue; // skip ig-style entries
    if (tweet.image_id) continue; // already has one
    const text = tweet.tweet;
    for (const rule of TWEET_MAP) {
      if (text.includes(rule.match)) {
        tweet.image_id   = rule.id;
        tweet.image_path = `schedule-tweets/images/x/x-tweets-${rule.id}-${rule.slug}.png`;
        updated++;
        break;
      }
    }
  }
  fs.writeFileSync(TWEETS_JSON, JSON.stringify(data, null, 2));
  console.log(`tweets.json: updated ${updated} tweets`);
}

function applyToIG() {
  const data = JSON.parse(fs.readFileSync(IG_JSON, 'utf8'));
  let updated = 0;
  for (const post of data.posts) {
    if (post.image_id) continue; // already has one
    const caption = post.caption || '';
    const hook    = post.hook || '';
    const src     = post.source_post || '';
    const text    = caption + ' ' + hook + ' ' + src;
    for (const rule of IG_MAP) {
      if (text.includes(rule.match)) {
        post.image_id   = rule.id;
        post.image_path = `schedule-tweets/images/x/x-tweets-${rule.id}-${rule.slug}.png`;
        updated++;
        break;
      }
    }
  }
  fs.writeFileSync(IG_JSON, JSON.stringify(data, null, 2));
  console.log(`IG-single-image.json: updated ${updated} posts`);
}

applyToTweets();
applyToIG();
