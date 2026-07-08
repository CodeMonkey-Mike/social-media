#!/usr/bin/env python3
"""Build a self-contained review dashboard for the Kaspa Wise Man quote bank.

Reads quotes.json (same folder), embeds it inline, and writes dashboard.html — a
double-clickable, no-server-needed page to browse/filter the 100 lines + their hooks.

Re-run after editing quotes.json to refresh the dashboard:
    python build_dashboard.py
"""
import json
import pathlib

HERE = pathlib.Path(__file__).parent
DATA = HERE / "quotes.json"
OUT = HERE / "dashboard.html"

bank = json.loads(DATA.read_text(encoding="utf-8"))
quotes = bank["quotes"]
themes = bank.get("themes", {})
archetypes = bank.get("hook_archetypes", {})

# Counts
by_theme, by_energy, by_status = {}, {}, {}
for q in quotes:
    by_theme[q["theme"]] = by_theme.get(q["theme"], 0) + 1
    by_energy[q["energy"]] = by_energy.get(q["energy"], 0) + 1
    by_status[q["status"]] = by_status.get(q["status"], 0) + 1

payload = json.dumps(
    {"quotes": quotes, "themes": themes, "archetypes": archetypes},
    ensure_ascii=False,
)

html = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Kaspa Wise Man — Quote Bank</title>
<style>
  /* Greenish-cyan (--gc) is Kaspa's brand hue (#70C7BA, hue ~170deg), darkened
     here for readable contrast on a light background. */
  :root {
    --bg:#f5f7f9; --panel:#ffffff; --panel2:#eef2f4; --line:#d7dee5;
    --ink:#1a2430; --dim:#5a6a79; --gc:#0e8a7a; --gc-deep:#0b6f62;
    --gold:#a87900; --orange:#c45f1b;
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink);
    font:15px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; }
  header { padding:24px 28px 14px; border-bottom:1px solid var(--line);
    background:linear-gradient(180deg,#ffffff,#f5f7f9); position:sticky; top:0; z-index:5; }
  h1 { margin:0 0 4px; font-size:22px; letter-spacing:.3px; }
  h1 .k { color:var(--gc); }
  .sub { color:var(--dim); font-size:13px; max-width:980px; }
  .stats { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
  .pill { background:var(--panel); border:1px solid var(--line); border-radius:999px;
    padding:4px 11px; font-size:12px; color:var(--dim); }
  .pill b { color:var(--ink); }
  .controls { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:14px; }
  input[type=search] { background:var(--panel2); border:1px solid var(--line); color:var(--ink);
    border-radius:8px; padding:8px 12px; font-size:13px; min-width:240px; }
  .seg { display:flex; gap:6px; flex-wrap:wrap; }
  .btn { background:var(--panel); border:1px solid var(--line); color:var(--dim);
    border-radius:8px; padding:6px 12px; font-size:12px; cursor:pointer; user-select:none; }
  .btn:hover { border-color:var(--gc-deep); color:var(--ink); }
  .btn.on { background:var(--gc); border-color:var(--gc); color:#ffffff; font-weight:600; }
  main { padding:20px 28px 80px; }
  .group-h { display:flex; align-items:baseline; gap:10px; margin:26px 0 12px; }
  .group-h h2 { margin:0; font-size:16px; color:var(--gc); text-transform:capitalize; }
  .group-h .n { color:var(--dim); font-size:12px; }
  .group-h .arch { color:var(--dim); font-size:12px; font-style:italic; flex:1;
    border-left:2px solid var(--line); padding-left:10px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:14px; }
  .card { background:var(--panel); border:1px solid var(--line); border-radius:12px;
    padding:15px 16px; display:flex; flex-direction:column; gap:10px; }
  .card.used { opacity:.55; }
  .row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
  .tag { font-size:10.5px; padding:2px 8px; border-radius:6px; border:1px solid var(--line);
    color:var(--dim); letter-spacing:.4px; text-transform:uppercase; }
  .id { font-family:ui-monospace,Menlo,Consolas,monospace; color:var(--gc); font-size:11px; }
  .secs { margin-left:auto; color:var(--dim); font-size:11px; }
  .e-educational { color:#1d6fd1; border-color:#9cc4f0; }
  .e-inspiring { color:#1f9d57; border-color:#9ad9b4; }
  .e-hype { color:var(--orange); border-color:#e0a878; }
  .st-unused { color:var(--gc); border-color:var(--gc-deep); }
  .st-used { color:var(--dim); }
  .line { font-size:16px; line-height:1.45; }
  .line b, .line strong { color:#000; }
  .hook { font-size:12.5px; color:var(--dim); background:var(--panel2);
    border:1px dashed var(--line); border-radius:8px; padding:9px 11px; }
  .hook .lbl { color:var(--orange); font-weight:700; font-size:10px; letter-spacing:1px;
    text-transform:uppercase; margin-right:6px; }
  .shots { display:flex; gap:6px; flex-wrap:wrap; }
  .shots img { width:62px; height:110px; object-fit:cover; border-radius:6px;
    border:1px solid var(--line); cursor:zoom-in; background:#000; }
  .shots .miss { width:62px; height:110px; border-radius:6px; border:1px dashed var(--line);
    display:flex; align-items:center; justify-content:center; color:var(--dim); font-size:9px;
    text-align:center; padding:4px; }
  .lb { position:fixed; inset:0; background:rgba(0,0,0,.86); display:none;
    align-items:center; justify-content:center; z-index:50; cursor:zoom-out; }
  .lb.open { display:flex; }
  .lb img { max-width:92vw; max-height:92vh; border-radius:8px; }
  .empty { color:var(--dim); padding:40px; text-align:center; }
  footer { color:#56697e; font-size:11px; padding:0 28px 30px; }
</style>
</head>
<body>
<header>
  <h1>The <span class="k">Kaspa</span> Wise Man <span style="color:var(--dim);font-size:14px">— quote bank</span></h1>
  <div class="sub">Conviction-sage one-liners. Each card = one planned video: the spoken <b>line</b> plus its impossible-metaphor <b>hook</b> (the scroll-stopper that opens the clip). Filter, search, and review before production.</div>
  <div class="stats" id="stats"></div>
  <div class="controls">
    <input type="search" id="q" placeholder="Search lines &amp; hooks…">
    <div class="seg" id="f-theme"></div>
    <div class="seg" id="f-energy"></div>
    <div class="seg" id="f-status"></div>
  </div>
</header>
<main id="main"></main>
<div class="lb" id="lb" onclick="this.classList.remove('open')"><img id="lbimg" alt=""></div>
<footer>Generated from quotes.json by build_dashboard.py. Re-run the script after editing the bank to refresh.</footer>

<script>
const DATA = __PAYLOAD__;
const Q = DATA.quotes, THEMES = DATA.themes, ARCH = DATA.archetypes;
const state = { q:"", theme:"all", energy:"all", status:"all" };

const STATS = document.getElementById("stats");
function renderStats(){
  const t = {}, e = {}, s = {};
  Q.forEach(x=>{ t[x.theme]=(t[x.theme]||0)+1; e[x.energy]=(e[x.energy]||0)+1; s[x.status]=(s[x.status]||0)+1; });
  STATS.innerHTML =
    `<span class="pill"><b>${Q.length}</b> lines</span>` +
    `<span class="pill"><b>${Object.keys(THEMES).length}</b> themes</span>` +
    Object.entries(e).map(([k,v])=>`<span class="pill">${k} <b>${v}</b></span>`).join("") +
    Object.entries(s).map(([k,v])=>`<span class="pill">${k} <b>${v}</b></span>`).join("");
}

function seg(el, key, values, labels){
  el.innerHTML = "";
  ["all", ...values].forEach(v=>{
    const b = document.createElement("div");
    b.className = "btn" + (state[key]===v ? " on":"");
    b.textContent = labels && labels[v] ? labels[v] : v;
    b.onclick = ()=>{ state[key]=v; segAll(); render(); };
    el.appendChild(b);
  });
}
function segAll(){
  seg(document.getElementById("f-theme"),"theme",Object.keys(THEMES));
  seg(document.getElementById("f-energy"),"energy",["educational","inspiring","hype"]);
  seg(document.getElementById("f-status"),"status",["unused","used"]);
}

const MAIN = document.getElementById("main");
function match(x){
  if(state.theme!=="all" && x.theme!==state.theme) return false;
  if(state.energy!=="all" && x.energy!==state.energy) return false;
  if(state.status!=="all" && x.status!==state.status) return false;
  if(state.q){ const s=(x.line+" "+x.hook+" "+x.id).toLowerCase(); if(!s.includes(state.q)) return false; }
  return true;
}
function esc(t){ return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
// bold ALL-CAPS emphasis words (2+ letters) in the line
function emph(t){ return esc(t).replace(/\b([A-Z]{2,})\b/g, "<b>$1</b>"); }

function card(x){
  return `<div class="card ${x.status}">
    <div class="row">
      <span class="id">${x.id}</span>
      <span class="tag">${x.theme}</span>
      <span class="tag e-${x.energy}">${x.energy}</span>
      <span class="tag st-${x.status}">${x.status}</span>
      <span class="secs">~${x.approx_seconds}s</span>
    </div>
    <div class="line">${emph(x.line)}</div>
    <div class="hook"><span class="lbl">Hook</span>${esc(x.hook)}</div>
    ${shots(x)}
  </div>`;
}
// thumbnail strip of associated hook keyframes (paths relative to this dashboard's folder)
function shots(x){
  if(!x.keyframes || !x.keyframes.length) return "";
  return `<div class="shots">` + x.keyframes.map(s=>{
    const name = s.split("/").pop();
    return `<img src="${s}" loading="lazy" title="${name}" onclick="lightbox('${s}')">`;
  }).join("") + `</div>`;
}
function lightbox(s){
  const lb = document.getElementById("lb");
  document.getElementById("lbimg").src = s;
  lb.classList.add("open");
}

function render(){
  const rows = Q.filter(match);
  if(!rows.length){ MAIN.innerHTML = `<div class="empty">No lines match these filters.</div>`; return; }
  // group by theme (preserve theme order from THEMES)
  const order = Object.keys(THEMES);
  const groups = {};
  rows.forEach(x=>{ (groups[x.theme]=groups[x.theme]||[]).push(x); });
  MAIN.innerHTML = order.filter(t=>groups[t]).map(t=>{
    const arch = ARCH[t] ? `<span class="arch">${esc(ARCH[t])}</span>` : "";
    return `<section>
      <div class="group-h"><h2>${t.replace(/-/g," ")}</h2>
        <span class="n">${groups[t].length}</span>${arch}</div>
      <div class="grid">${groups[t].map(card).join("")}</div>
    </section>`;
  }).join("");
}

document.getElementById("q").addEventListener("input", e=>{ state.q=e.target.value.toLowerCase().trim(); render(); });
renderStats(); segAll(); render();
</script>
</body>
</html>
"""

OUT.write_text(html.replace("__PAYLOAD__", payload), encoding="utf-8")
print(f"Wrote {OUT}  ({len(quotes)} quotes, {len(themes)} themes)")
