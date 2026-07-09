const fs = require("fs"), path = require("path");
const ROOT = "C:/Users/mnede/Documents/Claude/social-media";
const OUT = path.join(ROOT, "video-creation/remotion/out/pump-season-is-back");
const STAGE = path.join(ROOT, "schedule-tweets/shorts/pump-season-is-back");
const SHORTS_JSON = path.join(ROOT, "schedule-tweets/data/shorts.json");
const SRC_LS = "pump season is back LOW BPS VERTICAL";
const DISC = "\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/";
fs.mkdirSync(STAGE, { recursive: true });

const CLIPS = [
 { n:1, slug:"community-receipts", dur:114.4, id:"psb-20260708-550x-bear-market",
   title:"I called a 550x in a bear market. It was not even the biggest one.",
   hook:"If you know of any other community that does all this.",
   caption:"Pump season is back. My community banked a 550x, a 350x on LAB, a 130x on DeAgent AI, and a 52x on Peanut, all in a bear market.",
   tags:["pumpseason","altcoins","crypto","bearmarket","gems"] },
 { n:2, slug:"four-year-cycle-religion", dur:65.5, id:"psb-20260708-cycle-religion",
   title:"I stopped believing in the four-year cycle. Then I called the crypto winter.",
   hook:"I am no longer a four-year cycle zombie.",
   caption:"The four-year cycle is doctrine, not data. I shed it in Q2 2025 and called the crypto winter before it happened.",
   tags:["fouryearcycle","bitcoin","crypto","cryptowinter","macro"] },
 { n:3, slug:"october-will-be-green", dur:50.7, id:"psb-20260708-october-green",
   title:"Everyone is calling for a red October. Here is why they are wrong.",
   hook:"October will be green, mark my words.",
   caption:"The crowd betting on a red October is the exact fuel that turns it green. Mark my words.",
   tags:["october","bitcoin","crypto","macro","prediction"] },
 { n:4, slug:"bitcoin-inflation-year-five", dur:132.0, id:"psb-20260708-btc-tracked-inflation",
   title:"Bitcoin hit 126k and never actually pumped. Here is the math.",
   hook:"The price of Bitcoin really just adjusted to inflation.",
   caption:"68k to 126k looks like a bull market. Measured against what a coin actually buys, Bitcoin has been flat since 2021. Year five of the bear.",
   tags:["bitcoin","inflation","macro","bearmarket","crypto"] },
 { n:5, slug:"longevity-escape-velocity", dur:48.6, id:"psb-20260708-longevity-2032",
   title:"Scientists say by 2032 dying becomes optional. This is not sci-fi.",
   hook:"The date at which it is no longer reasonable to die.",
   caption:"Longevity escape velocity: a conservative estimate says by 2032 it is no longer reasonable to die. What is happening in biotech is blowing my mind.",
   tags:["longevity","biotech","future","science","ai"] },
 { n:6, slug:"community-receipts-impact", dur:15.0, id:"psb-20260708-500x-incoming",
   title:"A coin is pumping in my community right now. I am expecting a 500x.",
   hook:"I am expecting a 500x out of this particular one.",
   caption:"A coin is pumping in my community right now. I will not reveal it until 100x. I am expecting a 500x.",
   tags:["pumpseason","altcoins","crypto","gems","moonshot"] },
 { n:7, slug:"four-year-cycle-religion-impact", dur:12.2, id:"psb-20260708-cycle-doctrine",
   title:"The four-year cycle is not a strategy. It is a religion.",
   hook:"It is almost like something religious.",
   caption:"A magical four-year cycle that cannot be explained is not a strategy. It is doctrine. You just believe it and ignore the data.",
   tags:["fouryearcycle","bitcoin","crypto","macro","hottake"] },
];

const plat = (cap, withLink) => ({ status:"pending", posted_at:null, url:null, views:null, views_captured_at:null, caption_override: withLink ? cap+DISC : null });

// Optional clip-number filter (e.g. `node _publish-entries.js 2` stages ONLY clip 2). Empty = all.
const ONLY = process.argv.slice(2).map(Number).filter(Boolean);

const d = JSON.parse(fs.readFileSync(SHORTS_JSON, "utf8"));
let staged = 0;
for (const c of CLIPS) {
  if (ONLY.length && !ONLY.includes(c.n)) continue;
  if (d.shorts.some(s => s.id === c.id)) { console.log("skip (already in shorts.json):", c.id); continue; }
  const fname = `${c.n}-${c.slug}.mp4`;
  const srcMp4 = path.join(OUT, fname);
  if (!fs.existsSync(srcMp4)) { console.log("MISSING render", fname); continue; }
  fs.copyFileSync(srcMp4, path.join(STAGE, fname)); staged++;
  d.shorts.push({
    id: c.id, batch: "pump-season-is-back", slug: c.slug,
    source_livestream: SRC_LS, source_clip: c.slug,
    video_path: `shorts/pump-season-is-back/${fname}`,
    thumbnail_path: null, duration_seconds: c.dur, width: 1080, height: 1920,
    title: c.title, hook: c.hook, related_longform_url: null,
    caption: c.caption, tags: c.tags,
    platforms: {
      yt_shorts: plat(c.caption, true), ig_reels: plat(c.caption, false),
      x: plat(c.caption, false), tiktok: plat(c.caption, false),
      facebook: plat(c.caption, false), rumble: plat(c.caption, true),
      bitchute: plat(c.caption, true),
    },
  });
}
fs.writeFileSync(SHORTS_JSON, JSON.stringify(d, null, 1) + "\n");
// em-dash guard
const bad = CLIPS.filter(c => /—/.test(c.title + c.caption + c.hook));
console.log(`staged ${staged} mp4s, appended ${staged} shorts.json entries (total ${d.shorts.length}). em-dash violations: ${bad.length}`);
