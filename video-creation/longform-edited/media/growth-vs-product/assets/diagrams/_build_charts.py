"""growth-vs-product chart-builder generator: writes the 8 standalone HTML sources.
Every HTML embeds the LOCKED container-canonical.css verbatim + a chart layer, and builds one
1920x1080 .frame per state (frame id = PNG stem) from ONE render function, so shared elements are
pixel-identical across states. Usage: python assets/diagrams/_build_charts.py <project-dir>  then  python assets/diagrams/_shot.py assets/charts/*.html assets/diagrams/*.html"""
import sys
from pathlib import Path

PROJ = Path(sys.argv[1])
CANON = (PROJ.parents[1] / "skills" / "container-reference" / "container-canonical.css").read_text(encoding="utf-8")

FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900'
         '&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">')

# chart layer on top of the locked stylesheet (tokens untouched; CH2-CH4 chapter accent = cyan #00c2ff;
# role pair from COVER-PLAN chapter_themes: role A growth #ffd700, role B product #22c55e)
LAYER = r"""
:root{--accent:#00c2ff;--role-a:#ffd700;--role-b:#22c55e;--wire:#2a3142}
body{padding:40px 0;display:flex;flex-direction:column;align-items:center;gap:40px}
.frame{justify-content:flex-start;padding:96px 140px 0}
.frame .ey{margin-bottom:22px}
.frame h1.sm{font-size:68px}
.frame .divider{margin:28px 0 0}
.frame>.abs{position:absolute}
.ck{color:var(--accent)}
.role{top:92px;right:140px;font-family:'DM Sans',sans-serif;font-style:italic;font-weight:700;font-size:34px;
  letter-spacing:.02em;text-transform:uppercase;text-shadow:0 4px 18px rgba(0,0,0,.65);z-index:2;line-height:1}
.ra{color:var(--role-a)} .rb{color:var(--role-b)} .rw{color:#fff}
.src{left:140px;bottom:38px;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:17px;color:var(--text-muted);z-index:2}
.stage{inset:0;z-index:1}
.stage>*{position:absolute}
.impact{background:linear-gradient(135deg,rgba(0,194,255,.10),rgba(0,194,255,.03));border:1px solid rgba(0,194,255,.32);
  border-radius:14px;display:flex;align-items:center;justify-content:center;gap:26px}
.caps{font-family:'DM Sans',sans-serif;font-weight:700;text-transform:uppercase}
"""

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>{title}</title>
{fonts}
<style>
{canon}
{layer}
{css}
</style></head>
<body>
<!-- {title}: {note} -->
<div id="frames"></div>
<script>
const ORB = '<div class="orb" style="width:760px;height:760px;right:-300px;top:-360px;background:#00c2ff"></div>'
          + '<div class="orb" style="width:520px;height:520px;left:-260px;bottom:-320px;background:#0b3a66;opacity:.35"></div>';
function head(ey, h1, role){{
  return ORB + `<div class="ey">${{ey}}</div><h1 class="sm">${{h1}}</h1><div class="divider"></div>`
    + (role ? `<div class="abs role">${{role}}</div>` : '');
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
    out = PROJ / "assets" / folder / f"{cid}.html"
    out.write_text(PAGE.format(title=cid, note=note, fonts=FONTS, canon=CANON, layer=LAYER, css=css, js=js), encoding="utf-8")
    print("wrote", out)


# ───────────────────────────── split-test (Type 1 ANIMATED, CH2 72.00-77.52) ─────────────────────────────
SPLIT_CSS = r"""
.ab{top:318px;width:780px;height:430px;border-radius:18px;background:var(--bg-card);border:1px solid var(--border);padding:26px 28px}
.ab.win{border:2px solid var(--accent);box-shadow:0 0 70px rgba(0,194,255,.28),inset 0 0 40px rgba(0,194,255,.06)}
.abh{display:flex;align-items:center;gap:16px;height:46px}
.abl{width:46px;height:46px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-weight:600;font-size:26px;background:#1a1f2b;color:var(--text-primary)}
.ab.win .abl{background:var(--accent);color:#04121c}
.abn{font-family:'DM Sans';font-weight:700;font-size:23px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-secondary)}
.ab.win .abn{color:var(--text-primary)}
.stamp{margin-left:auto;padding:8px 18px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:20px;letter-spacing:.12em}
.stamp.kill{background:rgba(255,64,96,.14);color:var(--accent-red);border:1px solid rgba(255,64,96,.4)}
.stamp.scale{background:var(--accent);color:#04121c}
.br{margin-top:22px;height:310px;border-radius:12px;background:#0d1017;border:1px solid #232938;overflow:hidden;position:relative}
.ab.lose .br,.ab.lose .abh .abl,.ab.lose .abn{opacity:.38}
.bbar{height:34px;background:#161b26;display:flex;align-items:center;gap:8px;padding-left:14px}
.bbar i{width:11px;height:11px;border-radius:50%;background:#2c3344;display:block}
.bbar .url{margin-left:14px;width:300px;height:14px;border-radius:7px;background:#20263380}
.wb{position:absolute;border-radius:6px;background:#232a39}
.hero{position:absolute;left:24px;right:24px;top:58px;height:132px;border-radius:10px;background:#151a25}
.hero.ai{background:linear-gradient(120deg,rgba(0,194,255,.20),rgba(0,194,255,.04));border:1px solid rgba(0,194,255,.35)}
.spark{position:absolute;font-size:30px;color:var(--accent);line-height:1}
.track{top:774px;width:780px;height:26px;border-radius:13px;background:var(--border);overflow:hidden}
.fill{height:100%;border-radius:13px;background:linear-gradient(90deg,#2b5f7a,#3f8fb5)}
.fill.win{background:linear-gradient(90deg,#0a86b8,var(--accent));box-shadow:0 0 28px rgba(0,194,255,.7)}
.fill.lose{background:#3a4356}
.tl{top:808px;font-family:'DM Sans';font-weight:600;font-size:19px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.take{left:140px;right:140px;top:864px;height:100px}
.take .k{font-family:'DM Sans';font-weight:700;font-size:48px;letter-spacing:.08em}
"""
SPLIT_JS = r"""
// bar fill = % of track width (illustrative geometry, NO figure printed anywhere)
const STATES = [
  {id:'split-test-start',  a:0,  b:0,  take:false, win:false},
  {id:'split-test-mid',    a:30, b:46, take:false, win:false},
  {id:'split-test-payoff', a:34, b:82, take:true,  win:true},
];
function page(x, s, ai){
  const cls = s.win ? (ai ? 'win' : 'lose') : '';
  const stamp = s.win ? (ai ? '<span class="stamp scale">SCALE IT</span>' : '<span class="stamp kill">KILL IT</span>') : '';
  const hero = ai
    ? `<div class="hero ai"><div class="wb" style="left:22px;top:26px;width:58px;height:58px;border-radius:50%;background:rgba(0,194,255,.45)"></div>
         <div class="wb" style="left:100px;top:30px;width:300px;height:22px;background:#3a5f78"></div>
         <div class="wb" style="left:100px;top:66px;width:220px;height:16px;background:#2c4458"></div>
         <div class="wb" style="left:22px;top:100px;width:150px;height:20px;border-radius:10px;background:var(--accent)"></div>
         <div class="spark" style="right:22px;top:18px">&#10022;</div></div>`
    : `<div class="hero"><div class="wb" style="left:22px;top:28px;width:360px;height:22px"></div>
         <div class="wb" style="left:22px;top:64px;width:260px;height:16px;background:#1e2431"></div>
         <div class="wb" style="left:22px;top:100px;width:150px;height:20px;border-radius:10px;background:#3a4356"></div></div>`;
  const tiles = [0,1,2].map(i => `<div class="wb" style="left:${24+i*228}px;top:210px;width:206px;height:80px;background:#151a25"></div>`).join('');
  return `<div class="ab ${cls}" style="left:${x}px">
    <div class="abh"><span class="abl">${ai?'B':'A'}</span><span class="abn">${ai?'AI-personalized page':'Standard page'}</span>${stamp}</div>
    <div class="br"><div class="bbar"><i></i><i></i><i></i><span class="url"></span></div>
      <div class="wb" style="left:24px;top:46px;width:70px;height:12px;background:#2c3344"></div>${hero}${tiles}</div></div>`;
}
function bar(x, pct, s, ai){
  const cls = s.win ? (ai ? 'win' : 'lose') : '';
  return `<div class="track" style="left:${x}px"><div class="fill ${cls}" style="width:${pct}%"></div></div>
          <div class="tl" style="left:${x}px">the number</div>`;
}
function render(s){
  return head('Difference 1 &middot; The scoreboard', 'Ship the AI page as a <span class="ck">split test</span>.', ROLE_A)
    + `<div class="abs stage">${page(140,s,false)}${page(1000,s,true)}${bar(140,s.a,s,false)}${bar(1000,s.b,s,true)}
       ${s.take ? `<div class="impact take"><span class="k" style="color:var(--accent-red)">KILL IT</span>
          <span class="k" style="color:var(--text-muted);font-size:34px">OR</span><span class="k ck">SCALE IT</span></div>` : ''}</div>`
    + '<div class="abs src">Illustrative split test, no real figures. Control vs variation: Inside Atlassian, 2020-05-21</div>';
}
"""

# ───────────────────────────── pass-rate-meter (Type 1 ANIMATED, CH2 77.52-82.60) ─────────────────────────────
METER_CSS = r"""
.lead{left:140px;top:420px;font-family:'DM Sans';font-weight:600;font-size:23px;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.fix{left:140px;top:470px;width:560px;height:250px;border-radius:18px;background:var(--bg-card);border:2px solid var(--accent);
  box-shadow:0 0 60px rgba(0,194,255,.22);padding:34px 36px;overflow:hidden}
.fix .top-accent{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),transparent)}
.fix .tag{display:inline-block;padding:6px 16px;border-radius:100px;font-family:'DM Sans';font-weight:700;font-size:18px;letter-spacing:.12em;
  background:rgba(0,194,255,.15);color:var(--accent)}
.fix .ft{margin-top:22px;font-family:'Playfair Display',serif;font-weight:900;font-size:56px;line-height:1.05;color:var(--text-primary)}
.fix .fs{margin-top:14px;font-family:'DM Sans';font-size:26px;color:var(--text-secondary)}
.gsvg{left:0;top:0}
.slot{left:140px;top:470px;width:560px;height:250px;border-radius:18px;border:2px dashed #2a3142}
.gl{left:860px;width:760px;text-align:center}
"""
METER_JS = r"""
// gauge geometry (1920x1080 px): centre (1240,800), radius 340, stroke 36; needle position f in [0,1] of the arc
const CX = 1240, CY = 800, R = 340, TGT = 0.80;
const STATES = [
  {id:'pass-rate-meter-start',  f:0.22, fix:false, hit:false},
  {id:'pass-rate-meter-mid',    f:0.50, fix:true,  hit:false},
  {id:'pass-rate-meter-payoff', f:0.80, fix:true,  hit:true},
];
const pt = (f, r) => { const t = Math.PI * (1 - f); return [CX + r * Math.cos(t), CY - r * Math.sin(t)]; };
function arc(f0, f1, r){ const [x0,y0] = pt(f0,r), [x1,y1] = pt(f1,r); return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`; }
function render(s){
  let ticks = '';
  for (let i = 0; i <= 10; i++){ const [a,b] = pt(i/10, R+30), [c,d] = pt(i/10, R + (i%5===0 ? 56 : 46));
    ticks += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#3a4356" stroke-width="${i%5===0?4:3}" stroke-linecap="round"/>`; }
  const [tx,ty] = pt(TGT, R+30), [tx2,ty2] = pt(TGT, R+72), [lx,ly] = pt(TGT, R+108);
  const [nx,ny] = pt(s.f, R-34);
  const svg = `<svg class="gsvg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs><filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><feGaussianBlur stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="fg" x1="0" x2="1"><stop offset="0" stop-color="#0a6f9a"/><stop offset="1" stop-color="#00c2ff"/></linearGradient></defs>
    <path d="${arc(0,1,R)}" fill="none" stroke="#1e2330" stroke-width="36" stroke-linecap="round"/>
    <path d="${arc(0,s.f,R)}" fill="none" stroke="url(#fg)" stroke-width="36" stroke-linecap="round" filter="url(#glow)"/>
    ${ticks}
    <line x1="${tx}" y1="${ty}" x2="${tx2}" y2="${ty2}" stroke="${s.hit?'#00c2ff':'#8892a4'}" stroke-width="6" stroke-linecap="round" ${s.hit?'filter="url(#glow)"':''}/>
    <text x="${lx}" y="${ly}" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="22" letter-spacing="3.5"
      fill="${s.hit?'#00c2ff':'#8892a4'}">TARGET</text>
    <line x1="${CX}" y1="${CY}" x2="${nx}" y2="${ny}" stroke="#e8eaf0" stroke-width="7" stroke-linecap="round" filter="url(#glow)"/>
    <circle cx="${CX}" cy="${CY}" r="24" fill="#12151c" stroke="#00c2ff" stroke-width="5"/>
    ${s.fix ? `<path d="M 724 595 L 860 595" stroke="#00c2ff" stroke-width="4" stroke-linecap="round" fill="none"/>
               <path d="M 846 583 L 864 595 L 846 607" stroke="#00c2ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : ''}
  </svg>`;
  return head('Difference 1 &middot; The scoreboard', 'Ship a grounding fix. Watch the <span class="ck">pass rate</span>.', ROLE_B)
    + `<div class="abs stage">${svg}
       <div class="lead">The product engineer ships</div>
       ${!s.fix ? '<div class="slot"></div>' : ''}
       ${s.fix ? `<div class="fix"><div class="top-accent"></div><span class="tag">SHIPPED</span><div class="ft">Grounding fix</div>
          <div class="fs">answers grounded in real data</div></div>` : ''}
       <div class="gl caps" style="top:852px;font-size:42px;letter-spacing:.16em;color:${s.hit?'var(--accent)':'var(--text-primary)'}">Pass rate</div>
       <div class="gl" style="top:912px;font-family:'DM Sans';font-size:27px;color:var(--text-secondary)">on the eval set</div></div>`
    + '<div class="abs src">Illustrative, no figure printed. Pass-rate targets: GovWell, Our AI Stack. Grounding measures: Citian</div>';
}
"""

# ───────────────────────────── loop (Type 2 SYSTEM-DESIGN, CH3; loop-s1 + loop-s2 share ONE render) ─────────────────────────────
LOOP_CSS = r"""
.nd{width:520px;height:140px;border-radius:18px;background:var(--bg-card);border:1px solid var(--border);
  padding:0 34px;display:flex;flex-direction:column;justify-content:center;opacity:.38}
.nd .t{font-family:'DM Sans';font-weight:700;font-size:36px;letter-spacing:.07em;text-transform:uppercase;color:var(--text-primary)}
.nd .s{margin-top:8px;font-family:'DM Sans';font-size:25px;color:var(--text-secondary)}
.nd.lit{opacity:1;border:2px solid var(--accent);background:linear-gradient(135deg,rgba(0,194,255,.13),rgba(0,194,255,.03)),var(--bg-card);
  box-shadow:0 0 50px rgba(0,194,255,.20)}
.nd.lit .t{color:#fff}
.nd.pulse{box-shadow:0 0 0 14px rgba(0,194,255,.16),0 0 0 30px rgba(0,194,255,.07),0 0 80px rgba(0,194,255,.45)}
.hub{left:660px;width:600px;top:515px;height:120px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.hub .h1{margin-top:53px;font-family:'DM Sans';font-weight:600;font-size:24px;letter-spacing:.26em;text-transform:uppercase;color:var(--text-muted)}
.hub .wk{font-family:'DM Sans';font-weight:700;font-size:60px;color:var(--text-primary);line-height:1}
.hub .wk .mono{font-size:62px}
.chip{margin-top:14px;padding:7px 18px;border-radius:100px;border:1px dashed #3a4356;font-family:'DM Sans';font-size:22px;color:var(--text-muted)}
.chip .mono{font-size:21px}
.take{left:140px;right:140px;top:862px;height:96px}
.take .k{font-family:'Playfair Display',serif;font-weight:900;font-size:46px;color:var(--text-primary)}
"""
LOOP_JS = r"""
// node boxes (x,y,w=520,h=140): TL TEST SET, TR REGRESSION GATE, BR RETRIEVAL FIX, BL MODEL UPGRADE; loop runs clockwise
const N = {
  test:    {x:330,  y:330, t:'Test set',        s:'the eval set: known good answers'},
  gate:    {x:1070, y:330, t:'Regression gate', s:'on every change'},
  fix:     {x:1070, y:660, t:'Retrieval fix',   s:'retrieval grounding'},
  upgrade: {x:330,  y:660, t:'Model upgrade',   s:'a new model, the same eval set'},
};
// arrows: [from-x,from-y,to-x,to-y]
const A = { tg:[862,400,1058,400], gf:[1330,482,1330,648], fu:[1058,730,862,730], ut:[590,648,590,482] };
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
function arrow(k, on){
  const [x1,y1,x2,y2] = A[k], c = on ? '#00c2ff' : '#2a3142';
  const dx = Math.sign(x2-x1), dy = Math.sign(y2-y1), h = 16;
  const head = dx ? `M ${x2-dx*h} ${y2-h} L ${x2} ${y2} L ${x2-dx*h} ${y2+h}` : `M ${x2-h} ${y2-dy*h} L ${x2} ${y2} L ${x2+h} ${y2-dy*h}`;
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${c}" stroke-width="5" stroke-linecap="round" ${on?'filter="url(#g)"':''}/>
          <path d="${head}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function render(s){
  const svg = `<svg width="1920" height="1080" style="left:0;top:0"><defs><filter id="g" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
      <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      ${Object.keys(A).map(k => arrow(k, s.arr.includes(k))).join('')}</svg>`;
  const nodes = Object.entries(N).map(([k,n]) =>
    `<div class="nd ${s.lit.includes(k)?'lit':''} ${s.pulse===k?'pulse':''}" style="left:${n.x}px;top:${n.y}px"><div class="t">${n.t}</div><div class="s">${n.s}</div></div>`).join('');
  const hub = s.hub === 'loop'
    ? `<div class="hub"><div class="h1">The slow loop</div></div>`
    : `<div class="hub"><div class="wk"><span class="mono">3</span> weeks</div>${s.day3 ? '<div class="chip">nothing to show on day <span class="mono">3</span></div>' : ''}</div>`;
  return head('Difference 2 &middot; The clock', 'The product engineer builds a <span class="ck">slow loop</span>.', ROLE_B)
    + `<div class="abs stage">${svg}${nodes}${hub}
       ${s.take ? '<div class="impact take"><span class="k">That eval set <span class="ck">outlives</span> this model.</span></div>' : ''}</div>`
    + '<div class="abs src">Test sets, regression gates: Citian. Retrieval grounding: GovWell. Postings read 2026-10-20</div>';
}
"""

# ───────────────────────────── aarrr-funnel (Type 2 SYSTEM-DESIGN, CH3 108.44-113.90) ─────────────────────────────
FUNNEL_CSS = r"""
.desc{left:1100px;width:700px;height:88px;display:flex;align-items:center;white-space:nowrap;font-family:'DM Sans';font-size:26px;line-height:1.3;color:var(--text-secondary)}
.desc.dim{opacity:.4}
.desc.lit{color:var(--text-primary)}
.aich{display:inline-block;margin-right:16px;padding:6px 14px;border-radius:100px;background:var(--accent);color:#04121c;
  font-family:'DM Sans';font-weight:700;font-size:18px;letter-spacing:.1em;white-space:nowrap}
.take{left:140px;right:140px;top:858px;height:100px}
.take .k{font-family:'DM Sans';font-weight:700;font-size:48px;letter-spacing:.08em;color:var(--accent)}
.take .s{font-family:'DM Sans';font-size:30px;color:var(--text-secondary)}
"""
FUNNEL_JS = r"""
// 5 bands, centre x 610, top y 318, band h 88, gap 8; widths narrow 900 -> 420 (top edge of band i = W[i], bottom = W[i+1])
const CXF = 610, Y0 = 318, H = 88, G = 8, W = [900, 804, 708, 612, 516, 420];
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
    const y = Y0 + i*(H+G), wt = W[i] - 0, wb = W[i] + (W[i+1]-W[i]) * (H/(H+G));
    const p = [[CXF-wt/2,y],[CXF+wt/2,y],[CXF+wb/2,y+H],[CXF-wb/2,y+H]].map(q => q.map(v => v.toFixed(1)).join(',')).join(' ');
    const lit = s.lit === i, dim = s.lit >= 0 && !lit;
    polys += `<polygon points="${p}" fill="${lit ? 'url(#lg)' : '#12151c'}" stroke="${lit ? '#00c2ff' : '#2a3142'}" stroke-width="${lit?3:1.5}"
      ${lit ? 'filter="url(#g)"' : ''} opacity="${dim ? .42 : 1}" stroke-linejoin="round"/>`;
    labels += `<text x="${CXF}" y="${y + H/2 + 10}" text-anchor="middle" font-family="DM Sans" font-weight="700" font-size="30"
      letter-spacing="4" fill="${lit ? '#ffffff' : '#e8eaf0'}" opacity="${dim ? .42 : 1}">${name.toUpperCase()}</text>`;
    descs += `<div class="desc ${lit?'lit':''} ${dim?'dim':''}" style="top:${y}px">${lit ? '<span class="aich">+ AI STEP</span>' : ''}<span>${d}</span></div>`;
  });
  const svg = `<svg width="1920" height="1080" style="left:0;top:0"><defs>
      <linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#00c2ff" stop-opacity=".34"/><stop offset="1" stop-color="#00c2ff" stop-opacity=".12"/></linearGradient>
      <filter id="g" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>${polys}${labels}</svg>`;
  return head('Difference 2 &middot; The clock', 'An AI step in <span class="ck">onboarding</span>.', ROLE_A)
    + `<div class="abs stage">${svg}${descs}
       ${s.take ? '<div class="impact take"><span class="k">WITHIN DAYS</span><span class="s">you know whether more of them activate</span></div>' : ''}</div>`
    + '<div class="abs src">Stages and wording: Dave McClure, Startup Metrics for Pirates (AARRR)</div>';
}
"""

# ───────────────────────────── C1 two-stack (Type 2 SYSTEM-DESIGN, CH4; C1-s1/s2/s3 share ONE render) ─────────────────────────────
C1_CSS = r"""
.col{top:300px;height:672px;border-radius:20px;border:1px solid var(--border);background:rgba(18,21,28,.45)}
.ch{position:absolute;left:0;right:0;top:18px;text-align:center}
.ch .rl{font-family:'DM Sans';font-style:italic;font-weight:700;font-size:31px;letter-spacing:.02em;text-transform:uppercase;line-height:1;
  text-shadow:0 4px 18px rgba(0,0,0,.6)}
.ch .cs{margin-top:9px;font-family:'DM Sans';font-size:21px;color:var(--text-secondary)}
.ch .sh{font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-primary);line-height:1}
.nd{height:70px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border);padding:0 18px 0 28px;
  display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.nd::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px}
.nd.ga::before{background:var(--role-a)} .nd.pb::before{background:var(--role-b)}
.nd.sh::before{background:linear-gradient(180deg,var(--role-a),var(--role-b))}
.nd .t{font-family:'DM Sans';font-weight:700;font-size:25px;color:var(--text-primary);line-height:1.15;white-space:nowrap}
.nd .s{margin-top:3px;font-family:'DM Sans';font-size:19px;color:var(--text-secondary);line-height:1.2;white-space:nowrap}
.nd.big{height:104px;padding-left:30px} .nd.big .t{font-size:27px} .nd.big .s{font-size:20px;white-space:normal}
.nd.lit{border:2px solid var(--accent);background:linear-gradient(135deg,rgba(0,194,255,.14),rgba(0,194,255,.03)),var(--bg-card)}
.nd.lit .t{color:#fff}
.nd.hot{box-shadow:0 0 0 6px rgba(0,194,255,.14),0 0 46px rgba(0,194,255,.45)}
.o30{opacity:.30} .o62{opacity:.62} .o72{opacity:.72}
"""
C1_JS = r"""
// columns: GROWTH x140 w540 · SHARED x750 w420 · PRODUCT x1240 w540 (boxes y300 h672). Stack nodes w504 h70 gap8 from y408; shared nodes w380 h104.
// Node ORDER = lighting order (spoken nodes on their words, the unspoken ones in sequence between them).
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
// state 1: GROWTH lit node by node; PRODUCT + SHARED dimmed
STATES.push({id:'C1-s1-base', g:'o72', p:'o30', sh:'o30', lit:[], hot:null, hdr:'g'});
GROWTH.forEach((n,i) => STATES.push({id:`C1-s1-${n[0]}`, g:'o72', p:'o30', sh:'o30', lit:cum(GROWTH,i+1), hot:n[0], hdr:'g'}));
// state 2: PRODUCT lit node by node; GROWTH + SHARED dimmed
STATES.push({id:'C1-s2-base', g:'o30', p:'o72', sh:'o30', lit:[], hot:null, hdr:'p'});
PRODUCT.forEach((n,i) => STATES.push({id:`C1-s2-${n[0]}`, g:'o30', p:'o72', sh:'o30', lit:cum(PRODUCT,i+1), hot:n[0], hdr:'p'}));
// state 3: SHARED middle lit node by node; both stacks half-lit
STATES.push({id:'C1-s3-base', g:'o62', p:'o62', sh:'o72', lit:[], hot:null, hdr:'s'});
SHARED.forEach((n,i) => STATES.push({id:`C1-s3-${n[0]}`, g:'o62', p:'o62', sh:'o72', lit:cum(SHARED,i+1), hot:n[0], hdr:'s'}));
const MINE = STATES.filter(s => s.id.startsWith(PREFIX + '-'));
STATES.length = 0; MINE.forEach(s => STATES.push(s));

const SH_Y = [436, 562, 688, 814];      // shared node tops (h104), centred on the stack zone
function stack(list, x, w, cls, s, dimCls){
  return list.map((n,i) => {
    const on = s.lit.includes(n[0]);
    return `<div class="nd ${cls} ${on?'lit':dimCls} ${s.hot===n[0]?'hot':''}" style="left:${x}px;top:${408+i*78}px;width:${w}px">
      <div class="t">${n[1]}</div><div class="s">${n[2]}</div></div>`;
  }).join('');
}
function render(s){
  let wires = '';
  SHARED.forEach((n,i) => {
    const y = SH_Y[i] + 52, on = s.lit.includes(n[0]), c = on ? '#00c2ff' : '#2a3142';
    wires += `<line x1="680" y1="${y}" x2="750" y2="${y}" stroke="${c}" stroke-width="${on?4:3}" stroke-dasharray="${on?'0':'7 7'}" ${on?'filter="url(#g)"':''}/>
              <line x1="1170" y1="${y}" x2="1240" y2="${y}" stroke="${c}" stroke-width="${on?4:3}" stroke-dasharray="${on?'0':'7 7'}" ${on?'filter="url(#g)"':''}/>
              <circle cx="680" cy="${y}" r="6" fill="${c}"/><circle cx="1240" cy="${y}" r="6" fill="${c}"/>`;
  });
  const svg = `<svg width="1920" height="1080" style="left:0;top:0"><defs><filter id="g" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
      <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${wires}</svg>`;
  const hdrOp = k => (s.hdr === k ? '' : (k === 's' ? s.sh : (k === 'g' ? s.g : s.p)));
  return head('Difference 3 &middot; The bias', 'What each one <span class="ck">reaches for</span> first.', '')
    + `<div class="abs stage">${svg}
      <div class="col" style="left:140px;width:540px"><div class="ch ${hdrOp('g')}"><div class="rl">${ROLE_A}</div><div class="cs">lives in the funnel</div></div></div>
      <div class="col" style="left:750px;width:420px"><div class="ch ${hdrOp('s')}" style="top:24px"><div class="sh">Shared</div><div class="cs" style="margin-top:12px">the middle</div></div></div>
      <div class="col" style="left:1240px;width:540px"><div class="ch ${hdrOp('p')}"><div class="rl">${ROLE_B}</div><div class="cs">lives in the feature</div></div></div>
      ${stack(GROWTH, 158, 504, 'ga', s, s.g)}
      ${stack(PRODUCT, 1258, 504, 'pb', s, s.p)}
      ${SHARED.map((n,i) => { const on = s.lit.includes(n[0]);
        return `<div class="nd sh big ${on?'lit':s.sh} ${s.hot===n[0]?'hot':''}" style="left:770px;top:${SH_Y[i]}px;width:380px"><div class="t">${n[1]}</div><div class="s">${n[2]}</div></div>`; }).join('')}
      </div>`
    + '<div class="abs src">Every node is a job posting\'s own wording, postings read 2026-10-20</div>';
}
"""

write("charts", "split-test", "Type 1 ANIMATED chart, CH2@72.00-77.52, design states start/mid/payoff (spec: split-test.spec.md)", SPLIT_CSS, SPLIT_JS)
write("charts", "pass-rate-meter", "Type 1 ANIMATED chart, CH2@77.52-82.60, design states start/mid/payoff (spec: pass-rate-meter.spec.md)", METER_CSS, METER_JS)
for cid in ("loop-s1", "loop-s2"):
    write("diagrams", cid, f"Type 2 SYSTEM-DESIGN, the slow loop; loop-s1 and loop-s2 share one render (cues: _state-cues.md)",
          LOOP_CSS, f"const PREFIX = '{cid}';\n" + LOOP_JS)
write("diagrams", "aarrr-funnel", "Type 2 SYSTEM-DESIGN, CH3@108.44-113.90 (cues: _state-cues.md)", FUNNEL_CSS, FUNNEL_JS)
for cid in ("C1-s1", "C1-s2", "C1-s3"):
    write("diagrams", cid, "Type 2 SYSTEM-DESIGN, C1 the two tool stacks; C1-s1/s2/s3 share one render (cues: _state-cues.md)",
          C1_CSS, f"const PREFIX = '{cid}';\n" + C1_JS)
