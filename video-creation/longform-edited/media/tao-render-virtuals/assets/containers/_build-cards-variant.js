// Card-variant containers (banks-card-* exemplar): content INSIDE a rounded card with a top-accent line.
const fs = require('fs');
const DIR = 'C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/tao-render-virtuals/assets/containers/';
const HEAD = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg-deep:#0a0c10;--bg-card:#12151c;--accent-green:#00e68a;--accent-cyan:#00c2ff;--accent-gold:#ffd700;--accent-purple:#a855f7;--text-primary:#e8eaf0;--text-secondary:#8892a4;--text-muted:#505a6e;--border:#1e2330;}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#04060d;font-family:'DM Sans',sans-serif}
.frame{width:1920px;height:1080px;background:var(--bg-deep);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:0 200px;color:var(--text-primary)}
.frame::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0}
.frame>*:not(.orb){position:relative;z-index:1}
.cardv{background:var(--bg-card);border:1px solid var(--border);border-radius:22px;padding:66px 74px;max-width:1360px;position:relative;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.cardv .top{position:absolute;top:0;left:0;right:0;height:3px}
.cardv .ey{font-size:26px;font-weight:600;text-transform:uppercase;letter-spacing:.2em;margin-bottom:26px}
.cardv h1{font-family:'Playfair Display',serif;font-weight:700;font-size:64px;line-height:1.1;color:var(--text-primary)}
.cardv .val{font-family:'JetBrains Mono';font-weight:700;font-size:44px;margin-top:18px}
.cardv .body{font-size:31px;line-height:1.55;color:var(--text-secondary);margin-top:30px;max-width:1120px}
.cardv .body b{color:var(--text-primary)}
</style></head><body>`;
const TAIL = `</body></html>`;
// card(id, accentVar, eyebrow, title, value, body)
const card = (id, acc, ey, title, val, body) => HEAD + `<div class="frame" id="${id}">
  <div class="orb" style="width:640px;height:640px;background:var(--${acc});top:-160px;right:-120px;opacity:.08"></div>
  <div class="cardv"><div class="top" style="background:linear-gradient(90deg,var(--${acc}),transparent 70%)"></div>
    <div class="ey" style="color:var(--${acc})">${ey}</div>
    <h1>${title}</h1>
    <div class="val" style="color:var(--${acc})">${val}</div>
    <div class="body">${body}</div>
  </div></div>` + TAIL;

const C = [
 ['CH3_D3-B2_miners-card', card('CH3_D3-B2_miners-card','accent-green','Inside a subnet · Role 02','Miners','41% of emissions','Do the actual work, run the models and serve the compute. As a group they earn <b>forty-one percent</b>.')],
 ['CH3_D3-B3_validators-card', card('CH3_D3-B3_validators-card','accent-cyan','Inside a subnet · Role 03','Validators','41% of emissions','Test and score the miners. They earn <b>forty-one percent</b> too, because honest grading is worth exactly as much as the work.')],
 ['CH3_D3-B4_delegators-card', card('CH3_D3-B4_delegators-card','accent-green','Inside a subnet · Role 04','Delegators','Stake &amp; share','Regular TAO holders like you and me. Stake behind validators you trust, and <b>share in what they earn</b>.')],
 ['CH5_acp-v2-stat-card', card('CH5_acp-v2-stat-card','accent-purple','Virtuals · ACP v2.0 · April 2026','Their own numbers','18 mo · 2,000+ agents','Self-reported, not audited, but the direction is real. <b>Per Virtuals</b> — kept honest on screen.')],
];
C.forEach(([id, html]) => fs.writeFileSync(DIR + id + '.html', html));
console.log('wrote', C.length, 'card-variant containers');
