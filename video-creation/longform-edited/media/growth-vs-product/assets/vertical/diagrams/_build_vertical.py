"""growth-vs-product VERTICAL chart-builder generator (vertical-repurpose.md section 1): the 8 standalone HTML sources
re-laid for a 1080x1920 portrait frame. Same locked container-canonical.css, same chart layer tokens, same state ids
(frame id = PNG stem) and ONE render function per family, so shared elements stay pixel-identical across states.
The 16:9 twins (assets/diagrams/_build_charts.py) are never touched; everything here writes into assets/vertical/.
Usage: python assets/vertical/diagrams/_build_vertical.py <project-dir>
       then python assets/vertical/diagrams/_shot_vertical.py assets/vertical/charts/*.html assets/vertical/diagrams/*.html"""
import sys
from pathlib import Path

PROJ = Path(sys.argv[1]).resolve()
CANON = (PROJ.parents[1] / "skills" / "container-reference" / "container-canonical.css").read_text(encoding="utf-8")

FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900'
         '&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">')

# portrait chart layer (tokens untouched; CH2-CH4 chapter accent cyan #00c2ff; role pair gold #ffd700 / green #22c55e).
# Header anatomy for portrait: eyebrow -> 2-line Playfair headline (hand-broken, so every header ends at the same y)
# -> one row carrying the divider (left) and the role label (right). Stage zone y 480..1700, source line bottom 160.
LAYER = r"""
:root{--accent:#00c2ff;--role-a:#ffd700;--role-b:#22c55e;--wire:#2a3142}
body{padding:40px 0;display:flex;flex-direction:column;align-items:center;gap:40px}
.frame{width:1080px;height:1920px;justify-content:flex-start;padding:130px 80px 0}
.frame .ey{margin-bottom:22px}
.frame h1.sm{font-size:78px;max-width:920px}
.drow{display:flex;align-items:center;justify-content:space-between;margin-top:30px;height:40px}
.drow .divider{margin:0}
.frame>.abs{position:absolute}
.ck{color:var(--accent)}
.role{font-family:'DM Sans',sans-serif;font-style:italic;font-weight:700;font-size:34px;
  letter-spacing:.02em;text-transform:uppercase;text-shadow:0 4px 18px rgba(0,0,0,.65);line-height:1}
.ra{color:var(--role-a)} .rb{color:var(--role-b)} .rw{color:#fff}
.src{left:80px;width:920px;bottom:160px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:18px;line-height:1.5;color:var(--text-muted);z-index:2}
.stage{inset:0;z-index:1}
.stage>*{position:absolute}
.impact{background:linear-gradient(135deg,rgba(0,194,255,.10),rgba(0,194,255,.03));border:1px solid rgba(0,194,255,.32);
  border-radius:14px;display:flex;align-items:center;justify-content:center;gap:26px}
.caps{font-family:'DM Sans',sans-serif;font-weight:700;text-transform:uppercase}
"""

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>{title} (vertical)</title>
{fonts}
<style>
{canon}
{layer}
{css}
</style></head>
<body>
<!-- {title} VERTICAL 1080x1920: {note} -->
<div id="frames"></div>
<script>
const ORB = '<div class="orb" style="width:760px;height:760px;right:-340px;top:-320px;background:#00c2ff"></div>'
          + '<div class="orb" style="width:620px;height:620px;left:-300px;bottom:-300px;background:#0b3a66;opacity:.35"></div>';
function head(ey, h1, role){{
  return ORB + `<div class="ey">${{ey}}</div><h1 class="sm">${{h1}}</h1><div class="drow"><div class="divider"></div>`
    + (role ? `<div class="role">${{role}}</div>` : '') + '</div>';
}}
const ROLE_A = '<span class="ra">GROWTH</span> <span class="rw">ENGINEER</span>';
const ROLE_B = '<span class="rb">PRODUCT</span> <span class="rw">ENGINEER</span>';
{js}
const host = document.getElementById('frames');
for (const s of STATES){{ const f = document.createElement('div'); f.className = 'frame'; f.id = s.id; f.innerHTML = render(s); host.appendChild(f); }}
</script>
</body></html>
"""


def write(folder, cid, note, css, js):
    out = PROJ / "assets" / "vertical" / folder / f"{cid}.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(PAGE.format(title=cid, note=note, fonts=FONTS, canon=CANON, layer=LAYER, css=css, js=js), encoding="utf-8")
    print("wrote", out)


# ─────────────── split-test (Type 1 ANIMATED, CH2 72.00-77.52): side-by-side cards STACK, each bar under its card ───────────────
SPLIT_CSS = r"""
.ab{left:80px;width:920px;height:400px;border-radius:18px;background:var(--bg-card);border:1px solid var(--border);padding:26px 28px}
.ab.win{border:2px solid var(--accent);padding:25px 27px;box-shadow:0 0 70px rgba(0,194,255,.28),inset 0 0 40px rgba(0,194,255,.06)}
.abh{display:flex;align-items:center;gap:16px;height:50px}
.abl{width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-weight:600;font-size:28px;background:#1a1f2b;color:var(--text-primary)}
.ab.win .abl{background:var(--accent);color:#04121c}
.abn{font-family:'DM Sans';font-weight:700;font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)}
.ab.win .abn{color:var(--text-primary)}
.stamp{margin-left:auto;padding:8px 18px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:21px;letter-spacing:.12em}
.stamp.kill{background:rgba(255,64,96,.14);color:var(--accent-red);border:1px solid rgba(255,64,96,.4)}
.stamp.scale{background:var(--accent);color:#04121c}
.br{margin-top:20px;height:278px;border-radius:12px;background:#0d1017;border:1px solid #232938;overflow:hidden;position:relative}
.ab.lose .br,.ab.lose .abh .abl,.ab.lose .abn{opacity:.38}
.bbar{height:34px;background:#161b26;display:flex;align-items:center;gap:8px;padding-left:14px}
.bbar i{width:11px;height:11px;border-radius:50%;background:#2c3344;display:block}
.bbar .url{margin-left:14px;width:340px;height:14px;border-radius:7px;background:#20263380}
.wb{position:absolute;border-radius:6px;background:#232a39}
.hero{position:absolute;left:24px;right:24px;top:58px;height:124px;border-radius:10px;background:#151a25}
.hero.ai{background:linear-gradient(120deg,rgba(0,194,255,.20),rgba(0,194,255,.04));border:1px solid rgba(0,194,255,.35)}
.spark{position:absolute;font-size:30px;color:var(--accent);line-height:1}
.track{left:80px;width:920px;height:30px;border-radius:15px;background:var(--border);overflow:hidden}
.fill{height:100%;border-radius:15px;background:linear-gradient(90deg,#2b5f7a,#3f8fb5)}
.fill.win{background:linear-gradient(90deg,#0a86b8,var(--accent));box-shadow:0 0 28px rgba(0,194,255,.7)}
.fill.lose{background:#3a4356}
.tl{left:80px;font-family:'DM Sans';font-weight:600;font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.take{left:80px;right:80px;top:1560px;height:120px}
.take .k{font-family:'DM Sans';font-weight:700;font-size:54px;letter-spacing:.08em}
"""
SPLIT_JS = r"""
// bar fill = % of track width (illustrative geometry, NO figure printed anywhere). Card A y490, card B y1020 (920x400);
// tracks 30 px tall 22 px under each card; label 40 px under each track (geometry table: split-test.vertical.spec.md)
const CARD_Y = {A:490, B:1020}, TRACK_DY = 422, LABEL_DY = 464;
const STATES = [
  {id:'split-test-start',  a:0,  b:0,  take:false, win:false},
  {id:'split-test-mid',    a:30, b:46, take:false, win:false},
  {id:'split-test-payoff', a:34, b:82, take:true,  win:true},
];
function page(y, s, ai){
  const cls = s.win ? (ai ? 'win' : 'lose') : '';
  const stamp = s.win ? (ai ? '<span class="stamp scale">SCALE IT</span>' : '<span class="stamp kill">KILL IT</span>') : '';
  const hero = ai
    ? `<div class="hero ai"><div class="wb" style="left:24px;top:24px;width:60px;height:60px;border-radius:50%;background:rgba(0,194,255,.45)"></div>
         <div class="wb" style="left:106px;top:28px;width:380px;height:22px;background:#3a5f78"></div>
         <div class="wb" style="left:106px;top:64px;width:280px;height:16px;background:#2c4458"></div>
         <div class="wb" style="left:24px;top:94px;width:170px;height:18px;border-radius:9px;background:var(--accent)"></div>
         <div class="spark" style="right:24px;top:18px">&#10022;</div></div>`
    : `<div class="hero"><div class="wb" style="left:24px;top:26px;width:440px;height:22px"></div>
         <div class="wb" style="left:24px;top:62px;width:320px;height:16px;background:#1e2431"></div>
         <div class="wb" style="left:24px;top:94px;width:170px;height:18px;border-radius:9px;background:#3a4356"></div></div>`;
  const tiles = [0,1,2].map(i => `<div class="wb" style="left:${24+i*280}px;top:198px;width:258px;height:62px;background:#151a25"></div>`).join('');
  return `<div class="ab ${cls}" style="top:${y}px">
    <div class="abh"><span class="abl">${ai?'B':'A'}</span><span class="abn">${ai?'AI-personalized page':'Standard page'}</span>${stamp}</div>
    <div class="br"><div class="bbar"><i></i><i></i><i></i><span class="url"></span></div>
      <div class="wb" style="left:24px;top:44px;width:80px;height:10px;background:#2c3344"></div>${hero}${tiles}</div></div>`;
}
function bar(y, pct, s, ai){
  const cls = s.win ? (ai ? 'win' : 'lose') : '';
  return `<div class="track" style="top:${y+TRACK_DY}px"><div class="fill ${cls}" style="width:${pct}%"></div></div>
          <div class="tl" style="top:${y+LABEL_DY}px">the number</div>`;
}
function render(s){
  return head('Difference 1 &middot; The scoreboard', 'Ship the AI page<br>as a <span class="ck">split test</span>.', ROLE_A)
    + `<div class="abs stage">${page(CARD_Y.A,s,false)}${bar(CARD_Y.A,s.a,s,false)}${page(CARD_Y.B,s,true)}${bar(CARD_Y.B,s.b,s,true)}
       ${s.take ? `<div class="impact take"><span class="k" style="color:var(--accent-red)">KILL IT</span>
          <span class="k" style="color:var(--text-muted);font-size:38px">OR</span><span class="k ck">SCALE IT</span></div>` : ''}</div>`
    + '<div class="abs src">Illustrative split test, no real figures.<br>Control vs variation: Inside Atlassian, 2020-05-21</div>';
}
"""

# ─────────────── pass-rate-meter (Type 1 ANIMATED, CH2 77.52-82.60): fix card on top, arrow DOWN, gauge below ───────────────
METER_CSS = r"""
.lead{left:80px;top:500px;font-family:'DM Sans';font-weight:600;font-size:25px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.fix{left:80px;top:552px;width:920px;height:246px;border-radius:18px;background:var(--bg-card);border:2px solid var(--accent);
  box-shadow:0 0 60px rgba(0,194,255,.22);padding:34px 40px;overflow:hidden}
.fix .top-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),transparent)}
.fix .tag{display:inline-block;padding:6px 16px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:20px;letter-spacing:.12em;
  background:rgba(0,194,255,.15);color:var(--accent)}
.fix .ft{margin-top:20px;font-family:'Playfair Display',serif;font-weight:900;font-size:62px;line-height:1.05;color:var(--text-primary)}
.fix .fs{margin-top:12px;font-family:'DM Sans';font-size:28px;color:var(--text-secondary)}
.gsvg{left:0;top:0}
.slot{left:80px;top:552px;width:920px;height:246px;border-radius:18px;border:2px dashed #2a3142}
.gl{left:80px;width:920px;text-align:center}
"""
METER_JS = r"""
// gauge geometry (1080x1920 px): centre (540,1420), radius 350, stroke 38; needle position f in [0,1] of the arc
const CX = 540, CY = 1420, R = 350, TGT = 0.80;
const STATES = [
  {id:'pass-rate-meter-start',  f:0.22, fix:false, hit:false},
  {id:'pass-rate-meter-mid',    f:0.50, fix:true,  hit:false},
  {id:'pass-rate-meter-payoff', f:0.80, fix:true,  hit:true},
];
const pt = (f, r) => { const t = Math.PI * (1 - f); return [CX + r * Math.cos(t), CY - r * Math.sin(t)]; };
function arc(f0, f1, r){ const [x0,y0] = pt(f0,r), [x1,y1] = pt(f1,r); return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`; }
function render(s){
  let ticks = '';
  for (let i = 0; i <= 10; i++){ const [a,b] = pt(i/10, R+32), [c,d] = pt(i/10, R + (i%5===0 ? 58 : 48));
    ticks += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#3a4356" stroke-width="${i%5===0?4:3}" stroke-linecap="round"/>`; }
  const [tx,ty] = pt(TGT, R+32), [tx2,ty2] = pt(TGT, R+74), [lx,ly] = pt(TGT, R+110);
  const [nx,ny] = pt(s.f, R-36);
  const svg = `<svg class="gsvg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <defs><filter id="glow-${s.id}" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feGaussianBlur stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="fg-${s.id}" x1="0" x2="1"><stop offset="0" stop-color="#0a6f9a"/><stop offset="1" stop-color="#00c2ff"/></linearGradient></defs>
    <path d="${arc(0,1,R)}" fill="none" stroke="#1e2330" stroke-width="38" stroke-linecap="round"/>
    <path d="${arc(0,s.f,R)}" fill="none" stroke="url(#fg-${s.id})" stroke-width="38" stroke-linecap="round" filter="url(#glow-${s.id})"/>
    ${ticks}
    <line x1="${tx}" y1="${ty}" x2="${tx2}" y2="${ty2}" stroke="${s.hit?'#00c2ff':'#8892a4'}" stroke-width="6" stroke-linecap="round" ${s.hit?`filter="url(#glow-${s.id})"`:''}/>
    <text x="${lx}" y="${ly}" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="24" letter-spacing="3.5"
      fill="${s.hit?'#00c2ff':'#8892a4'}">TARGET</text>
    <line x1="${CX}" y1="${CY}" x2="${nx}" y2="${ny}" stroke="#e8eaf0" stroke-width="7" stroke-linecap="round" filter="url(#glow-${s.id})"/>
    <circle cx="${CX}" cy="${CY}" r="26" fill="#12151c" stroke="#00c2ff" stroke-width="5"/>
    ${s.fix ? `<path d="M 540 806 L 540 940" stroke="#00c2ff" stroke-width="4" stroke-linecap="round" fill="none"/>
               <path d="M 528 926 L 540 944 L 552 926" stroke="#00c2ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : ''}
  </svg>`;
  return head('Difference 1 &middot; The scoreboard', 'Ship a grounding fix.<br>Watch the <span class="ck">pass rate</span>.', ROLE_B)
    + `<div class="abs stage">${svg}
       <div class="lead">The product engineer ships</div>
       ${!s.fix ? '<div class="slot"></div>' : ''}
       ${s.fix ? `<div class="fix"><div class="top-accent"></div><span class="tag">SHIPPED</span><div class="ft">Grounding fix</div>
          <div class="fs">answers grounded in real data</div></div>` : ''}
       <div class="gl caps" style="top:1478px;font-size:48px;letter-spacing:.16em;color:${s.hit?'var(--accent)':'var(--text-primary)'}">Pass rate</div>
       <div class="gl" style="top:1546px;font-family:'DM Sans';font-size:30px;color:var(--text-secondary)">on the eval set</div></div>`
    + '<div class="abs src">Illustrative, no figure printed. Pass-rate targets:<br>GovWell, Our AI Stack. Grounding measures: Citian</div>';
}
"""

# ─────────────── loop (Type 2 SYSTEM-DESIGN, CH3; loop-s1 + loop-s2 share ONE render): the 2x2 ring goes TALL ───────────────
LOOP_CSS = r"""
.nd{width:410px;height:240px;border-radius:18px;background:var(--bg-card);border:1px solid var(--border);
  padding:0 32px;display:flex;flex-direction:column;justify-content:center;opacity:.38}
.nd .t{font-family:'DM Sans';font-weight:700;font-size:38px;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:var(--text-primary)}
.nd .s{margin-top:12px;font-family:'DM Sans';font-size:27px;line-height:1.3;color:var(--text-secondary)}
.nd.lit{opacity:1;border:2px solid var(--accent);background:linear-gradient(135deg,rgba(0,194,255,.13),rgba(0,194,255,.03)),var(--bg-card);
  box-shadow:0 0 50px rgba(0,194,255,.20)}
.nd.lit .t{color:#fff}
.nd.lit{padding:0 31px}   /* 2px lit border: padding -1 so the content box (and every wrap) is identical lit or dim */
.nd.pulse{box-shadow:0 0 0 14px rgba(0,194,255,.16),0 0 0 30px rgba(0,194,255,.07),0 0 80px rgba(0,194,255,.45)}
.hub{left:330px;width:420px;top:850px;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.hub .h1{margin-top:74px;font-family:'DM Sans';font-weight:600;font-size:26px;letter-spacing:.24em;text-transform:uppercase;color:var(--text-muted);text-align:center;line-height:1.5}
.hub .wk{margin-top:44px;font-family:'DM Sans';font-weight:700;font-size:72px;color:var(--text-primary);line-height:1}
.hub .wk .mono{font-size:74px}
.chip{margin-top:18px;padding:8px 18px;border-radius:100px;border:1px dashed #3a4356;font-family:'DM Sans';font-size:24px;color:var(--text-muted);white-space:nowrap}
.chip .mono{font-size:23px}
.take{left:80px;right:80px;top:1470px;height:130px}
.take .k{font-family:'Playfair Display',serif;font-weight:900;font-size:52px;color:var(--text-primary)}
"""
LOOP_JS = r"""
// node boxes (x,y,w=410,h=240): TL TEST SET, TR REGRESSION GATE, BR RETRIEVAL FIX, BL MODEL UPGRADE; loop runs clockwise.
// Rows sit 600 px apart so the ring is TALL; the hub fills the centre, between the two vertical arrows.
const N = {
  test:    {x:80,  y:500,  t:'Test set',        s:'the eval set: known good answers'},
  gate:    {x:590, y:500,  t:'Regression gate', s:'on every change'},
  fix:     {x:590, y:1140, t:'Retrieval fix',   s:'retrieval grounding'},
  upgrade: {x:80,  y:1140, t:'Model upgrade',   s:'a new model, the same eval set'},
};
// arrows: [from-x,from-y,to-x,to-y]
const A = { tg:[500,620,578,620], gf:[795,752,795,1128], fu:[580,1260,502,1260], ut:[285,1128,285,752] };
const STATES = [
  {id:'loop-s1-base',        lit:[],                         arr:[],                  hub:'loop'},
  {id:'loop-s1-test-set',    lit:['test'],                   arr:[],                  hub:'loop'},
  {id:'loop-s1-gate',        lit:['test','gate'],            arr:['tg'],              hub:'loop'},
  {id:'loop-s2-base',        lit:['test','gate'],            arr:['tg'],              hub:'weeks'},
  {id:'loop-s2-eval-pulse',  lit:['test','gate'],            arr:['tg'],              hub:'weeks', pulse:'test'},
  {id:'loop-s2-retrieval',   lit:['test','gate','fix'],      arr:['tg','gf'],         hub:'weeks'},
  {id:'loop-s2-day3',        lit:['test','gate','fix'],      arr:['tg','gf'],         hub:'weeks', day3:true},
  {id:'loop-s2-upgrade',     lit:['test','gate','fix','upgrade'], arr:['tg','gf','fu','ut'], hub:'weeks', day3:true, take:true},
].filter(s => s.id.startsWith(PREFIX));
function arrow(k, on, s){
  const [x1,y1,x2,y2] = A[k], c = on ? '#00c2ff' : '#2a3142';
  const dx = Math.sign(x2-x1), dy = Math.sign(y2-y1), h = 16;
  const head = dx ? `M ${x2-dx*h} ${y2-h} L ${x2} ${y2} L ${x2-dx*h} ${y2+h}` : `M ${x2-h} ${y2-dy*h} L ${x2} ${y2} L ${x2+h} ${y2-dy*h}`;
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${c}" stroke-width="5" stroke-linecap="round" ${on?`filter="url(#g-${s.id})"`:''}/>
          <path d="${head}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function render(s){
  const svg = `<svg width="1080" height="1920" style="left:0;top:0"><defs><filter id="g-${s.id}" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920">
      <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      ${Object.keys(A).map(k => arrow(k, s.arr.includes(k), s)).join('')}</svg>`;
  const nodes = Object.entries(N).map(([k,n]) =>
    `<div class="nd ${s.lit.includes(k)?'lit':''} ${s.pulse===k?'pulse':''}" style="left:${n.x}px;top:${n.y}px"><div class="t">${n.t}</div><div class="s">${n.s}</div></div>`).join('');
  const hub = s.hub === 'loop'
    ? `<div class="hub"><div class="h1">The slow<br>loop</div></div>`
    : `<div class="hub"><div class="wk"><span class="mono">3</span> weeks</div>${s.day3 ? '<div class="chip">nothing to show on day <span class="mono">3</span></div>' : ''}</div>`;
  return head('Difference 2 &middot; The clock', 'The product engineer<br>builds a <span class="ck">slow loop</span>.', ROLE_B)
    + `<div class="abs stage">${svg}${nodes}${hub}
       ${s.take ? '<div class="impact take"><span class="k">That eval set <span class="ck">outlives</span> this model.</span></div>' : ''}</div>`
    + '<div class="abs src">Test sets, regression gates: Citian. Retrieval grounding:<br>GovWell. Postings read 2026-10-20</div>';
}
"""

# ─────────────── aarrr-funnel (Type 2 SYSTEM-DESIGN, CH3 108.44-113.90): taller bands, each stage's wording INSIDE its band ───────────────
FUNNEL_CSS = r"""
.desc{left:80px;width:920px;height:40px;display:flex;align-items:center;justify-content:center;white-space:nowrap;
  font-family:'DM Sans';font-size:25px;line-height:1.3;color:var(--text-secondary)}
.desc.dim{opacity:.42}
.desc.lit{color:var(--text-primary)}
.aich{display:inline-block;margin-right:14px;padding:5px 14px;border-radius:100px;background:var(--accent);color:#04121c;
  font-family:'DM Sans';font-weight:700;font-size:19px;letter-spacing:.1em;white-space:nowrap}
.take{left:80px;right:80px;top:1420px;height:190px;flex-direction:column;gap:14px}
.take .k{font-family:'DM Sans';font-weight:700;font-size:62px;letter-spacing:.08em;color:var(--accent);line-height:1}
.take .s{font-family:'DM Sans';font-size:32px;color:var(--text-secondary)}
"""
FUNNEL_JS = r"""
// 5 bands, centre x 540, top y 500, band h 160, gap 10; widths narrow 920 -> 520 (top edge of band i = W[i]).
// Stage name (SVG, 36 px) sits at band-top + 64; the stage's own wording (HTML, 25 px) is centred at band-top + 92..132.
const CXF = 540, Y0 = 500, H = 160, G = 10, W = [920, 840, 760, 680, 600, 520];
const STAGES = [
  ['Acquisition', 'users come to the site from various channels'],
  ['Activation',  'users enjoy <span class="mono" style="font-weight:400">1st</span> visit: happy user experience'],
  ['Retention',   'users come back, visit site multiple times'],
  ['Referral',    'users like product enough to refer others'],
  ['Revenue',     'users conduct some monetization behavior'],
];
const STATES = [
  {id:'aarrr-funnel-base',        take:false, lit:-1},
  {id:'aarrr-funnel-within-days', take:true,  lit:-1},
  {id:'aarrr-funnel-activation',  take:true,  lit:1},
];
function render(s){
  let polys = '', labels = '', descs = '';
  STAGES.forEach(([name, d], i) => {
    const y = Y0 + i*(H+G), wt = W[i], wb = W[i] + (W[i+1]-W[i]) * (H/(H+G));
    const p = [[CXF-wt/2,y],[CXF+wt/2,y],[CXF+wb/2,y+H],[CXF-wb/2,y+H]].map(q => q.map(v => v.toFixed(1)).join(',')).join(' ');
    const lit = s.lit === i, dim = s.lit >= 0 && !lit;
    polys += `<polygon points="${p}" fill="${lit ? `url(#lg-${s.id})` : '#12151c'}" stroke="${lit ? '#00c2ff' : '#2a3142'}" stroke-width="${lit?3:1.5}"
      ${lit ? `filter="url(#g-${s.id})"` : ''} opacity="${dim ? .42 : 1}" stroke-linejoin="round"/>`;
    labels += `<text x="${CXF}" y="${y + 64}" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="36"
      letter-spacing="4.5" fill="${lit ? '#ffffff' : '#e8eaf0'}" opacity="${dim ? .42 : 1}">${name.toUpperCase()}</text>`;
    descs += `<div class="desc ${lit?'lit':''} ${dim?'dim':''}" style="top:${y + 92}px">${lit ? '<span class="aich">+ AI STEP</span>' : ''}<span>${d}</span></div>`;
  });
  const svg = `<svg width="1080" height="1920" style="left:0;top:0"><defs>
      <linearGradient id="lg-${s.id}" x1="0" x2="1"><stop offset="0" stop-color="#00c2ff" stop-opacity=".34"/><stop offset="1" stop-color="#00c2ff" stop-opacity=".12"/></linearGradient>
      <filter id="g-${s.id}" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>${polys}${labels}</svg>`;
  return head('Difference 2 &middot; The clock', 'An AI step<br>in <span class="ck">onboarding</span>.', ROLE_A)
    + `<div class="abs stage">${svg}${descs}
       ${s.take ? '<div class="impact take"><span class="k">WITHIN DAYS</span><span class="s">you know whether more of them activate</span></div>' : ''}</div>`
    + '<div class="abs src">Stages and wording: Dave McClure,<br>Startup Metrics for Pirates (AARRR)</div>';
}
"""

# ─────────────── C1 two-stack (Type 2 SYSTEM-DESIGN, CH4; C1-s1/s2/s3 share ONE render): 3 columns become 3 BANDS ───────────────
C1_CSS = r"""
.col{left:80px;width:920px;border-radius:20px;border:1px solid var(--border);background:rgba(18,21,28,.45)}
.ch{position:absolute;left:0;right:0;top:20px;text-align:center}
.ch .rl{font-family:'DM Sans';font-style:italic;font-weight:700;font-size:33px;letter-spacing:.02em;text-transform:uppercase;line-height:1;
  text-shadow:0 4px 18px rgba(0,0,0,.6)}
.ch .cs{margin-top:9px;font-family:'DM Sans';font-size:22px;color:var(--text-secondary)}
.ch .sh{font-family:'DM Sans';font-weight:700;font-size:27px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-primary);line-height:1}
.nd{height:68px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border);padding:0 14px 0 24px;
  display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.nd::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px}
.nd.ga::before{background:var(--role-a)} .nd.pb::before{background:var(--role-b)}
.nd.sh::before{background:linear-gradient(180deg,var(--role-a),var(--role-b))}
.nd .t{font-family:'DM Sans';font-weight:700;font-size:25px;color:var(--text-primary);line-height:1.15;white-space:nowrap}
.nd .s{margin-top:3px;font-family:'DM Sans';font-size:18px;color:var(--text-secondary);line-height:1.2;white-space:nowrap}
.nd.big{height:146px;padding:0 10px 0 22px} .nd.big .t{font-size:24px;white-space:normal} .nd.big .s{margin-top:6px;font-size:18px;white-space:normal}
.nd.lit{border:2px solid var(--accent);background:linear-gradient(135deg,rgba(0,194,255,.14),rgba(0,194,255,.03)),var(--bg-card)}
.nd.lit .t{color:#fff}
.nd.lit{padding:0 13px 0 23px} .nd.big.lit{padding:0 9px 0 21px}   /* 2px lit border: padding -1, content box identical lit or dim */
.nd.hot{box-shadow:0 0 0 6px rgba(0,194,255,.14),0 0 46px rgba(0,194,255,.45)}
.o30{opacity:.30} .o62{opacity:.62} .o72{opacity:.72}
"""
C1_JS = r"""
// bands (x80 w920): GROWTH y470 h418 · SHARED y938 h264 · PRODUCT y1252 h418. Stack nodes 2-up (w434 h68, gap 16 x / 8 y)
// from band-top + 104, the 7th node spans the band (w884); shared nodes 4-up (w210 h146) from band-top + 100.
// Node ORDER = lighting order (read left to right, top to bottom; spoken nodes on their words, unspoken in sequence).
const GROWTH = [
  ['web',     'Web + ad platforms',          'Webflow, forms, event tracking'],
  ['analytics','Analytics + attribution',    'analytics dashboards, attribution'],
  ['crm',     'CRM / marketing automation',  'Marketo, HubSpot'],
  ['cdp',     'CDP',                         'customer data platform'],
  ['experiment','Experiment framework',      'A/B testing'],
  ['outbound','Outbound + content pipelines','Clay, n8n, email / PPTX generation'],
  ['agents',  'Agent workflows into GTM',    'MCP servers, automation platforms'],
];
const PRODUCT = [
  ['prompting','Prompting + tool use',       'text-to-SQL, fine-tuning or no AI at all'],
  ['retrieval','Retrieval',                  'RAG, vector DB'],
  ['routing', 'Model routing',               'multi-model orchestration, routed by task'],
  ['evalharness','Eval harness',             'pass-rate targets, regression gates'],
  ['latency', 'Latency + cost monitoring',   'reliability, failure modes'],
  ['guardrails','Guardrails',                'abstention, prompt injection, permissions'],
  ['featureui','The feature UI',             'built for a model that is wrong sometimes'],
];
const SHARED = [
  ['llm',    'LLM APIs',               'Claude, GPT or similar models'],
  ['agentsorch','Agents + orchestration','both stacks'],
  ['evals',  'Evals',                  'evaluation-driven development'],
  ['pyts',   'Python + TypeScript',    'the back ends'],
];
const cum = (list, n) => list.slice(0, n).map(x => x[0]);
const STATES = [];
STATES.push({id:'C1-s1-base', g:'o72', p:'o30', sh:'o30', lit:[], hot:null, hdr:'g'});
GROWTH.forEach((n,i) => STATES.push({id:`C1-s1-${n[0]}`, g:'o72', p:'o30', sh:'o30', lit:cum(GROWTH,i+1), hot:n[0], hdr:'g'}));
STATES.push({id:'C1-s2-base', g:'o30', p:'o72', sh:'o30', lit:[], hot:null, hdr:'p'});
PRODUCT.forEach((n,i) => STATES.push({id:`C1-s2-${n[0]}`, g:'o30', p:'o72', sh:'o30', lit:cum(PRODUCT,i+1), hot:n[0], hdr:'p'}));
STATES.push({id:'C1-s3-base', g:'o62', p:'o62', sh:'o72', lit:[], hot:null, hdr:'s'});
SHARED.forEach((n,i) => STATES.push({id:`C1-s3-${n[0]}`, g:'o62', p:'o62', sh:'o72', lit:cum(SHARED,i+1), hot:n[0], hdr:'s'}));
const MINE = STATES.filter(s => s.id.startsWith(PREFIX + '-'));
STATES.length = 0; MINE.forEach(s => STATES.push(s));

const GY = 470, GH = 418, SY = 938, SH = 264, PY = 1252, PH = 418;
const SH_X = [98, 322, 546, 770];          // shared node lefts (w210), wire x = left + 105
function stack(list, top, cls, s, dimCls){
  return list.map((n,i) => {
    const on = s.lit.includes(n[0]), last = i === list.length - 1;
    const x = last ? 98 : 98 + (i % 2) * 450, y = top + 104 + Math.floor(i / 2) * 76, w = last ? 884 : 434;
    return `<div class="nd ${cls} ${on?'lit':dimCls} ${s.hot===n[0]?'hot':''}" style="left:${x}px;top:${y}px;width:${w}px">
      <div class="t">${n[1]}</div><div class="s">${n[2]}</div></div>`;
  }).join('');
}
function render(s){
  let wires = '';
  SHARED.forEach((n,i) => {
    const x = SH_X[i] + 105, on = s.lit.includes(n[0]), c = on ? '#00c2ff' : '#2a3142';
    const seg = (y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${c}" stroke-width="${on?4:3}" stroke-dasharray="${on?'0':'7 7'}" ${on?`filter="url(#g-${s.id})"`:''}/>`;
    wires += seg(GY + GH, SY) + seg(SY + SH, PY)
           + `<circle cx="${x}" cy="${GY + GH}" r="6" fill="${c}"/><circle cx="${x}" cy="${PY}" r="6" fill="${c}"/>`;
  });
  const svg = `<svg width="1080" height="1920" style="left:0;top:0"><defs><filter id="g-${s.id}" filterUnits="userSpaceOnUse" x="0" y="0" width="1080" height="1920">
      <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${wires}</svg>`;
  const hdrOp = k => (s.hdr === k ? '' : (k === 's' ? s.sh : (k === 'g' ? s.g : s.p)));
  return head('Difference 3 &middot; The bias', 'What each one<br><span class="ck">reaches for</span> first.', '')
    + `<div class="abs stage">${svg}
      <div class="col" style="top:${GY}px;height:${GH}px"><div class="ch ${hdrOp('g')}"><div class="rl">${ROLE_A}</div><div class="cs">lives in the funnel</div></div></div>
      <div class="col" style="top:${SY}px;height:${SH}px"><div class="ch ${hdrOp('s')}" style="top:22px"><div class="sh">Shared</div><div class="cs" style="margin-top:10px">the middle</div></div></div>
      <div class="col" style="top:${PY}px;height:${PH}px"><div class="ch ${hdrOp('p')}"><div class="rl">${ROLE_B}</div><div class="cs">lives in the feature</div></div></div>
      ${stack(GROWTH, GY, 'ga', s, s.g)}
      ${stack(PRODUCT, PY, 'pb', s, s.p)}
      ${SHARED.map((n,i) => { const on = s.lit.includes(n[0]);
        return `<div class="nd sh big ${on?'lit':s.sh} ${s.hot===n[0]?'hot':''}" style="left:${SH_X[i]}px;top:${SY + 100}px;width:210px"><div class="t">${n[1]}</div><div class="s">${n[2]}</div></div>`; }).join('')}
      </div>`
    + '<div class="abs src">Every node is a job posting\'s own wording,<br>postings read 2026-10-20</div>';
}
"""

write("charts", "split-test", "Type 1 ANIMATED chart, CH2@72.00-77.52, portrait design states start/mid/payoff (spec: split-test.vertical.spec.md)", SPLIT_CSS, SPLIT_JS)
write("charts", "pass-rate-meter", "Type 1 ANIMATED chart, CH2@77.52-82.60, portrait design states start/mid/payoff (spec: pass-rate-meter.vertical.spec.md)", METER_CSS, METER_JS)
for cid in ("loop-s1", "loop-s2"):
    write("diagrams", cid, "Type 2 SYSTEM-DESIGN, the slow loop; loop-s1 and loop-s2 share one render (cues: ../../diagrams/_state-cues.md, unchanged)",
          LOOP_CSS, f"const PREFIX = '{cid}';\n" + LOOP_JS)
write("diagrams", "aarrr-funnel", "Type 2 SYSTEM-DESIGN, CH3@108.44-113.90 (cues: ../../diagrams/_state-cues.md, unchanged)", FUNNEL_CSS, FUNNEL_JS)
for cid in ("C1-s1", "C1-s2", "C1-s3"):
    write("diagrams", cid, "Type 2 SYSTEM-DESIGN, C1 the two tool stacks; C1-s1/s2/s3 share one render (cues: ../../diagrams/_state-cues.md, unchanged)",
          C1_CSS, f"const PREFIX = '{cid}';\n" + C1_JS)
