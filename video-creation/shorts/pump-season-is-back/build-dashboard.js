// Rebuilds dashboard.html IN PLACE. Canonical clip-review dashboard convention:
//  - ONE cell per short. Each length variant (full, impact) is its OWN short in its OWN cell.
//  - Clips are numbered sequentially: all FULL clips first (1..k, by rank), then all IMPACT
//    clips (k+1..), so Mike can refer to "clip 6". Numbering is stable across passes.
//  - Processing REPLACES the clip in its cell in place (tighten replaces full; desilence
//    replaces that). Each cell shows only the CURRENT version + a status tag.
//  - Clips are only removed when Mike explicitly asks to delete them.
const fs = require("fs"), path = require("path"), cp = require("child_process");
const root = __dirname;
const plan = JSON.parse(fs.readFileSync(path.join(root, "clip-plan.json"), "utf8"));
const status = fs.existsSync(path.join(root, "status.json")) ? JSON.parse(fs.readFileSync(path.join(root, "status.json"), "utf8")) : {};
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const dur = f => { try { return Math.round(+cp.execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString().trim()); } catch { return null; } };
const statClass = { "raw": "s-raw", "desilenced": "s-desil", "tightened": "s-tight", "tightened+desilenced": "s-tight" };

// Build the ordered short list: all FULL clips (by rank), then all IMPACT clips (by rank).
const shorts = [];
for (const c of [...plan.clips].sort((a,b)=>a.rank-b.rank))
  if (fs.existsSync(path.join(root, c.slug, `${c.slug}-full.mp4`))) shorts.push({ c, variant: "full" });
for (const c of [...plan.clips].sort((a,b)=>a.rank-b.rank))
  if (fs.existsSync(path.join(root, c.slug, `${c.slug}-impact.mp4`))) shorts.push({ c, variant: "impact" });

const cards = shorts.map((s, i) => {
  const n = i + 1, { c, variant } = s;
  const d = dur(path.join(root, c.slug, `${c.slug}-${variant}.mp4`));
  const st = status[`${c.slug}-${variant}`] || "raw";
  const over = d > 180 ? ' <b style="color:#e2857e">over 180s</b>' : "";
  return `<div class="card">
<h2><span class="num">Clip ${n}</span> ${esc(c.topic)}</h2>
<div class="meta"><span class="vtag">${variant === "impact" ? "impact cut" : "full"}</span> <span class="stat ${statClass[st]}">${esc(st)}</span> · ${d}s${over}</div>
<video controls preload="metadata" src="${c.slug}/${esc(c.slug)}-${variant}.mp4"></video>
${variant === "full" ? `<details><summary>source + notes</summary><p class="src">${esc(c.hook_type)} · assembly [${c.assembly_order.join(", ")}] · ${c.segments.map(s => `${Math.round(s.start)}-${Math.round(s.end)}s`).join(", ")}</p><p>${esc(c.notes)}</p></details>` : ""}
</div>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>pump-season-is-back clips</title><style>
body{font-family:system-ui,sans-serif;background:#0f1115;color:#e6e6e6;margin:0;padding:24px}
h1{font-size:20px;margin:0 0 4px}.sub{color:#8a8f98;font-size:13px;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:start}
@media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
.card{background:#171a21;border:1px solid #262b36;border-radius:12px;padding:14px}
.card h2{font-size:14px;margin:0 0 6px;line-height:1.3}
.num{background:#3a3320;color:#e2cf7e;font-size:11px;padding:1px 8px;border-radius:20px;margin-right:4px}
.meta{color:#8a8f98;font-size:12px;margin-bottom:10px}
.vtag{background:#22303f;color:#8fc7ff;font-size:11px;padding:1px 8px;border-radius:20px}
.stat{font-size:11px;padding:1px 8px;border-radius:20px}
.s-raw{background:#2a2f38;color:#9aa3ad}.s-desil{background:#1e3a2f;color:#7ee2b8}.s-tight{background:#331f3a;color:#d79fe6}
video{width:auto;max-height:320px;max-width:100%;border-radius:8px;background:#000;display:block;margin:0 auto}
details{margin-top:8px;font-size:12px;color:#8a8f98}summary{cursor:pointer}.src{color:#6f757e}
</style></head><body>
<h1>pump season is back — clip review</h1>
<div class="sub">${shorts.length} shorts (each its own cell, numbered 1-${shorts.length}) · clip-strategist (Fable/max) · status replaces in place: raw / desilenced / tightened+desilenced</div>
<div class="grid">${cards}</div></body></html>`;
fs.writeFileSync(path.join(root, "dashboard.html"), html);
console.log(`dashboard.html rebuilt: ${shorts.length} shorts (clips 1-${shorts.length})`);
