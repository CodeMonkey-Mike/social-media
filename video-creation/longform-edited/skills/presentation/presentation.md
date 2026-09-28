---
name: yt-presentation
description: Build dark cinematic, scroll-based HTML presentations (slide decks, explainers, visual breakdowns) as a single self-contained .html file. Use this skill whenever the user asks to create a presentation, slide deck, pitch deck, explainer, breakdown, or any scroll-based visual storytelling — especially for crypto, finance, macro, markets, or data-driven content meant for video recording or screen sharing. Trigger on phrases like "make a presentation", "create slides", "build a deck", "present this data", "turn this into a visual breakdown", or any request to format content into cinematic HTML slides, even if the word "presentation" isn't used. Do NOT use for PowerPoint (.pptx) — this is HTML rendered in the browser.
---

# Dark Cinematic Scroll Presentation

> **Longform-edited container naming (Mike, 2026-07-24):** the video containers styled off this system have
> THREE official type names — **TITLE SLIDE** (no box), **CARD SLIDE** (rounded card box), and
> **SYSTEM-DESIGN CHART** (full-screen overview diagram). Exemplars + anatomy + the locked stylesheet live
> in `container-reference/README.md` (canonical — read it before building video containers); each video's
> build worklist for them = its BROLL-PLAN CHARTS + SLIDES sections.

Build visually striking, scroll-based HTML presentations with a dark editorial aesthetic. They are designed to look great on a screen — ideal for recording video, screen sharing, or embedding.

Follow this design system exactly unless the user explicitly asks to change it. The CSS blocks below are the canonical, tested versions — copy them rather than reinventing.

## Output contract

- One self-contained `.html` file. All CSS and JS inline. No build step, no external assets except the three Google Fonts.
- Layout is **scroll-snap**: a vertical stack of full-viewport `<section class="slide">` blocks. The viewer scrolls (or uses arrow keys / nav dots); each slide snaps into place.
- Responsive via `clamp()` typography and a single mobile breakpoint at 900px. Never hard-code pixel font sizes tuned to one resolution — the deck must fill whatever viewport it's recorded in.
- Aim for 6–10 slides. Confirm a condensed slide outline with the user before building the full deck when the content is non-trivial.

## Design system

### Color palette (use these exact variable names)

```css
:root{
  --bg-deep:#0a0c10;        /* page background */
  --bg-card:#12151c;        /* card backgrounds */
  --bg-card-hover:#181c26;  /* card hover state */
  --accent-green:#00e68a;   /* primary — key numbers, positive, main metric */
  --accent-cyan:#00c2ff;    /* secondary — supporting data */
  --accent-gold:#ffd700;    /* tertiary — warnings, special callouts */
  --accent-red:#ff4060;     /* alert / negative */
  --accent-purple:#a855f7;  /* supplementary */
  --accent-teal:#49e0c8;    /* optional extra accent (e.g. brand coin/logo) */
  --text-primary:#e8eaf0;   /* headings, main text */
  --text-secondary:#8892a4; /* paragraphs, descriptions */
  --text-muted:#505a6e;     /* labels, captions, fine print */
  --border:#1e2330;         /* card and divider borders */
}
```

Assign each accent a consistent meaning for the whole deck (e.g. green = main/positive, red = risk, gold = special) and don't drift. Drop `--accent-teal` if the deck has no brand mark that needs it.

### Typography

Load exactly these three Google Fonts in every deck:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

Rules:
- `h1` — Playfair Display 900, `clamp(2.8rem,6vw,5.5rem)`, line-height 1.05, letter-spacing -0.02em
- `h2` — Playfair Display 700, `clamp(1.8rem,3.5vw,3rem)`, line-height 1.15
- `h3` — DM Sans 700, 1.15rem, uppercase, letter-spacing 0.12em (add a `.mono` variant that turns off uppercase for code-style titles)
- Body — DM Sans, `clamp(.95rem,1.05vw,1.05rem)`, line-height 1.7, color `--text-secondary`
- Eyebrow label (`.ey`) — DM Sans 0.75rem, uppercase, letter-spacing 0.18em, color `--text-muted`
- **All numbers, dates, dollar amounts, percentages, tickers → JetBrains Mono 600.** This is non-negotiable; it's the signature of the style.

## Foundation CSS (copy this block verbatim)

```css
*{box-sizing:border-box;margin:0;padding:0}

html{scroll-behavior:smooth;scroll-snap-type:y mandatory}
body{background:var(--bg-deep);font-family:'DM Sans',sans-serif;color:var(--text-primary);overflow-x:hidden}

/* film grain overlay */
body::after{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.slide{
  min-height:100vh;scroll-snap-align:start;
  display:flex;flex-direction:column;justify-content:center;
  padding:60px 80px;position:relative;overflow:hidden;
}
@media(max-width:900px){ .slide{padding:40px 28px} }

.orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:.4;pointer-events:none}
.slide>*:not(.orb){position:relative;z-index:1}

h1{font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(2.8rem,6vw,5.5rem);line-height:1.05;letter-spacing:-.02em}
h2{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.8rem,3.5vw,3rem);line-height:1.15}
h3{font-family:'DM Sans',sans-serif;font-weight:700;font-size:1.15rem;text-transform:uppercase;letter-spacing:.12em}
h3.mono{text-transform:none;letter-spacing:0}
.ey{display:block;font-size:.75rem;text-transform:uppercase;letter-spacing:.18em;color:var(--text-muted);font-weight:600;margin-bottom:18px}
p{font-size:clamp(.95rem,1.05vw,1.05rem);line-height:1.7;color:var(--text-secondary)}
.mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.divider{width:60px;height:3px;border-radius:2px;background:linear-gradient(90deg,var(--accent-green),var(--accent-cyan));margin:24px 0}
.center{text-align:center}

.g{color:var(--accent-green)} .c{color:var(--accent-cyan)} .go{color:var(--accent-gold)}
.pu{color:var(--accent-purple)} .re{color:var(--accent-red)} .tl{color:var(--accent-teal)}
```

**Atmosphere:** place 1–2 `.orb` divs per slide, sized 350–600px, positioned partially off-screen, with a different accent color per slide. Add a `.divider` after every `h2`.

## Component library

These are the reusable building blocks. Use them as-is; vary content, not structure.

### Cards + tags

```css
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:32px;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s}
.card:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,.4)}
.card .top-accent{position:absolute;top:0;left:0;right:0;height:2px}
.card h3{margin-bottom:6px}
.card p{margin-top:12px}

.tag{display:inline-block;padding:4px 12px;border-radius:100px;font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px}
.tag.green{background:rgba(0,230,138,.15);color:var(--accent-green)}
.tag.cyan{background:rgba(0,194,255,.15);color:var(--accent-cyan)}
.tag.purple{background:rgba(168,85,247,.15);color:var(--accent-purple)}
.tag.gold{background:rgba(255,215,0,.15);color:var(--accent-gold)}
.tag.red{background:rgba(255,64,96,.15);color:var(--accent-red)}
```

Give cards a `.top-accent` div with a gradient matching the card's topic color, e.g. `background:linear-gradient(90deg,var(--accent-green),transparent)`.

### Grids

```css
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
@media(max-width:900px){ .grid2,.grid3{grid-template-columns:1fr} }
```

### Impact callout (for "why it matters" blocks)

```css
.impact{background:linear-gradient(135deg,rgba(0,230,138,.08),rgba(0,194,255,.06));border:1px solid rgba(0,230,138,.2);border-radius:12px;padding:24px 28px;margin-top:30px}
```

### Big number (hero stat)

```css
.big-number{font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(3rem,7vw,6rem);line-height:1;
  background:linear-gradient(135deg,var(--accent-green),var(--accent-cyan));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
```

### Two-column compare (today vs after / before vs after)

```css
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.col{padding:32px;border-radius:16px}
.col.norm{background:rgba(80,90,110,.08);border:1px solid var(--border)}
.col.cov{background:linear-gradient(135deg,rgba(0,230,138,.07),rgba(0,194,255,.05));border:1px solid rgba(0,230,138,.28)}
.col .ml{font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px}
.col .q{font-style:italic;color:var(--text-primary);margin-top:16px;padding-left:18px;border-left:3px solid var(--accent-green)}
.col.norm .q{border-left-color:var(--text-muted);color:var(--text-secondary)}
@media(max-width:900px){ .cmp{grid-template-columns:1fr} }
```

### Rule / bullet list (mono, accent left-border)

```css
.rules{list-style:none;margin-top:24px}
.rules li{padding:16px 20px;margin-bottom:12px;border-radius:12px;background:rgba(255,255,255,.02);border-left:3px solid var(--accent-cyan);font-family:'JetBrains Mono',monospace;font-size:.95rem;color:var(--text-primary);line-height:1.5}
.rules li.hot{border-left-color:var(--accent-green);background:rgba(0,230,138,.07)}
.rules li .why{color:var(--text-muted);font-size:.8rem}
```

### Comparison matrix (✓/✗ table)

```css
table.mx{width:100%;border-collapse:separate;border-spacing:0 12px;margin-top:24px}
table.mx th,table.mx td{padding:16px 22px;text-align:center;font-size:1rem}
table.mx th{color:var(--text-secondary);font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
table.mx td.name{text-align:left;font-weight:700;font-size:1.1rem}
table.mx tr.row td{background:var(--bg-card);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
table.mx tr.row td:first-child{border-left:1px solid var(--border);border-radius:14px 0 0 14px}
table.mx tr.row td:last-child{border-right:1px solid var(--border);border-radius:0 14px 14px 0}
table.mx tr.kas td{background:rgba(0,230,138,.08);border-color:rgba(0,230,138,.3)} /* highlight the hero row */
.yes{color:var(--accent-green);font-weight:700} .no{color:var(--accent-red);font-weight:700}
```

### Horizontal flow (A → B nodes)

```css
.flow{display:flex;align-items:center;gap:24px;margin-top:32px}
.node{flex:1;background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:28px;text-align:center}
.node.bad{border-color:rgba(255,64,96,.35)} .node.good{border-color:rgba(0,230,138,.4)}
.node h3{margin-bottom:10px} .node p{font-size:.9rem}
.arrow{font-size:2rem;color:var(--text-muted)}
@media(max-width:900px){ .flow{flex-direction:column} .arrow{transform:rotate(90deg)} }
```

### Vertical layer stack (foundation diagram)

```css
.stack{display:flex;flex-direction:column;gap:16px;margin-top:28px}
.layer{border-radius:14px;padding:22px 28px;text-align:center;font-size:1rem;font-weight:600}
.up{font-size:1.6rem;color:var(--accent-green);text-align:center;margin:-2px 0}
```

### Roadmap / timeline (horizontal stops)

```css
.road{display:flex;align-items:center;gap:0;margin-top:48px}
.stop{flex:1;text-align:center;position:relative}
.dot{width:28px;height:28px;border-radius:50%;background:var(--text-muted);margin:0 auto 20px}
.stop.on .dot{background:var(--accent-green);box-shadow:0 0 30px rgba(0,230,138,.8)}
.bar{height:4px;background:var(--border);flex:1}
.bar.on{background:linear-gradient(90deg,var(--accent-green),var(--text-muted))}
.stop .when{font-family:'JetBrains Mono',monospace;font-size:.95rem;color:var(--text-secondary)}
.stop .what{font-size:1.1rem;font-weight:700;margin-top:8px}
.stop.on .what{color:var(--accent-green)}
```

### Horizontal bar chart (compare magnitudes)

Build with flex rows: a label, a track, and a gradient fill bar. Always put a JetBrains Mono value label inside or beside the bar. Track background `var(--border)`; fill `linear-gradient(90deg,var(--accent-green),var(--accent-cyan))`.

### Brand coin / logo mark (optional, for open/close slides)

```css
.coinwrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center}
.coin{width:clamp(160px,20vw,260px);height:clamp(160px,20vw,260px);border-radius:50%;
  background:radial-gradient(circle at 38% 32%,#1b3a39,#0c1817);border:5px solid var(--accent-teal);
  box-shadow:0 0 70px rgba(73,224,200,.55),inset 0 0 50px rgba(73,224,200,.25);
  display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(5rem,12vw,9rem);color:var(--accent-teal)}
.chips{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;max-width:900px;margin-top:36px}
.chip{padding:10px 20px;border-radius:100px;background:rgba(73,224,200,.1);border:1px solid rgba(73,224,200,.35);color:var(--accent-teal);font-family:'JetBrains Mono',monospace;font-size:.85rem}
```

## Animation + navigation CSS

```css
.fade-in{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
.fade-in.visible{opacity:1;transform:translateY(0)}
.delay-1{transition-delay:.15s}.delay-2{transition-delay:.3s}.delay-3{transition-delay:.45s}
.delay-4{transition-delay:.6s}.delay-5{transition-delay:.75s}

.nav-dots{position:fixed;right:28px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:100}
.nav-dots button{width:8px;height:8px;border-radius:50%;border:none;background:var(--text-muted);cursor:pointer;padding:0;transition:transform .3s,background .3s}
.nav-dots button.active{background:var(--accent-green);transform:scale(1.4)}
@media(max-width:900px){ .nav-dots{right:14px} }

.scroll-hint{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--text-muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.2em;z-index:2}
.scroll-hint svg{animation:bounce 1.8s infinite}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
```

Apply `fade-in` (plus a `delay-N`) to every major content block so things stagger in as each slide enters view. Add a `.scroll-hint` to the title slide only.

## Animation + navigation JS (copy this block verbatim)

```html
<div class="nav-dots" id="navDots"></div>
<script>
const slides = Array.from(document.querySelectorAll('.slide'));

/* fade-in on scroll */
const fadeObserver = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.15});
document.querySelectorAll('.fade-in').forEach(el=>fadeObserver.observe(el));

/* nav dots */
const dotsWrap = document.getElementById('navDots');
slides.forEach((s,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','Go to slide '+(i+1));
  b.addEventListener('click',()=>s.scrollIntoView({behavior:'smooth'}));
  dotsWrap.appendChild(b);
});
const dots = Array.from(dotsWrap.children);
const dotObserver = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ const i=slides.indexOf(e.target); dots.forEach((d,j)=>d.classList.toggle('active',j===i)); } });
},{threshold:0.5});
slides.forEach(s=>dotObserver.observe(s));

/* arrow-key / spacebar nav (handy when recording) */
function currentIndex(){
  const mid=window.innerHeight/2; let idx=0,best=Infinity;
  slides.forEach((s,i)=>{ const r=s.getBoundingClientRect(); const d=Math.abs((r.top+r.bottom)/2-mid); if(d<best){best=d;idx=i;} });
  return idx;
}
document.addEventListener('keydown',e=>{
  if(['ArrowRight','ArrowDown',' '].includes(e.key)){ e.preventDefault(); slides[Math.min(slides.length-1,currentIndex()+1)].scrollIntoView({behavior:'smooth'}); }
  if(['ArrowLeft','ArrowUp'].includes(e.key)){ e.preventDefault(); slides[Math.max(0,currentIndex()-1)].scrollIntoView({behavior:'smooth'}); }
});
</script>
```

## Recommended slide sequence

1. **Title / cold open** — big headline with an accent-colored keyword, a one-line subtitle, and either 2–3 stat callouts or a brand mark. Add the scroll hint here.
2. **Overview** — timeline, trade-off, or structural framing of the topic.
3. **Deep-dive slides** — one per major idea. Use `grid2`/`grid3` of cards, the compare columns, or the flow.
4. **Comparison** — the matrix table or a bar chart to show magnitudes side by side.
5. **Synthesis** — the layer stack, roadmap, or a summary that ties it together.
6. **Closing** — a centered takeaway with a `big-number` hero stat or the brand mark, and one short payoff line.

Adjust to the content; 6–10 slides total.

## Build checklist

1. Full CSS variable palette with the exact names above.
2. Three Google Fonts imported.
3. Grain overlay on `body::after`.
4. Slides as `<section class="slide" id="...">`, full-viewport scroll-snap.
5. 1–2 glow orbs per slide, varied accent colors.
6. `fade-in` + staggered `delay-N` on all content blocks.
7. Nav dots with active-state tracking; arrow-key nav wired up.
8. JetBrains Mono on every number / date / ticker / percentage.
9. `.ey` eyebrow label above each slide's heading.
10. A `.divider` after every `h2`.
11. Cards with `.top-accent` gradient borders for grouped content.
12. Closing slide with a centered `big-number` (or brand mark) hero.
13. Mobile responsive at the 900px breakpoint.
14. Everything in one `.html` file.

## Content tone

Write like you're explaining something to a smart friend — direct and informed, no corporate jargon. Strong verbs. Keep each card or timeline item to 1–3 tight sentences. Let big numbers carry the weight and let supporting text give context. For crypto/macro/markets content, favor accessible, trader-friendly framing over jargon dumps.
