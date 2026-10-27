"""only-18-months-left slide source generator (slide-builder).

Writes containers.html = the LOCKED container-canonical.css pasted verbatim + per-chapter accents
(COVER-PLAN chapter_themes, Mike 2026-10-10) + layout-only components + one standalone 1920x1080
.frame per slide id. Edit THIS file, then run it, then `python _shot.py`.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CANON = os.path.join(HERE, "..", "..", "..", "..", "skills", "container-reference", "container-canonical.css")

EXTRA_CSS = r"""
/* ======================= CHAPTER THEMES (COVER-PLAN chapter_themes; Mike 2026-10-10) =======================
   The chapter accent REPLACES the default accent on: the top-accent line, the key words, the lit row, the divider
   and the accent orb. Every other token (bg, card, border, text greys, fonts, eyebrow) is the locked stylesheet. */
.ch1,.ch8{--acc:#ff4060;--acc-rgb:255,64,96}
.ch2{--acc:#ffd700;--acc-rgb:255,215,0}
.ch3,.ch4{--acc:#a855f7;--acc-rgb:168,85,247}
.ch5,.ch6{--acc:#00c2ff;--acc-rgb:0,194,255}
.ch7{--acc:#00e68a;--acc-rgb:0,230,138}
.a{color:var(--acc)}
.frame .divider{background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.35))}
.orb.o1{width:920px;height:920px;right:-330px;top:-380px;background:var(--acc);opacity:.17}
.orb.o2{width:660px;height:660px;left:-280px;bottom:-320px;background:#3a4f7a;opacity:.16}
.frame>.deco{position:absolute;pointer-events:none}
h1{font-variant-numeric:lining-nums}

/* ---------------- TITLE SLIDES (no box; bittensor-text-* reference), Halloween-dark: low fog + accent haze ---------------- */
.title h1{font-size:150px;line-height:1.02;max-width:1500px}
.title .ey{font-size:30px;margin-bottom:30px}
.title .divider{margin:44px 0 0}
.fog{left:-10%;right:-10%;bottom:-40px;height:420px;z-index:0;filter:blur(30px);opacity:.55;
  background:radial-gradient(60% 70% at 30% 100%,rgba(150,160,180,.20),transparent 70%),
             radial-gradient(50% 60% at 78% 100%,rgba(150,160,180,.14),transparent 70%)}
.rim{left:0;right:0;bottom:0;height:3px;z-index:0;
  background:linear-gradient(90deg,transparent,rgba(var(--acc-rgb),.55) 35%,rgba(var(--acc-rgb),.8) 60%,transparent)}
.vig{inset:0;z-index:0;background:radial-gradient(120% 90% at 40% 50%,transparent 55%,rgba(0,0,0,.55))}

/* ---------------- CARD SLIDE: one rounded card, top-accent line, sized to FILL the frame (banks-card-* reference) ---------------- */
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:64px 88px 70px;
  position:relative;overflow:hidden;width:100%;box-shadow:0 40px 120px rgba(0,0,0,.45)}
.card>.top{position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.55) 40%,transparent 85%)}
.card .ey{margin-bottom:22px}
.card .divider{margin:30px 0 34px}
.tag{display:inline-flex;align-items:center;font-family:'DM Sans';font-weight:700;font-size:22px;letter-spacing:.16em;
  text-transform:uppercase;padding:8px 18px;border-radius:999px;border:2px solid rgba(var(--acc-rgb),.6);color:var(--acc);
  background:rgba(var(--acc-rgb),.08);white-space:nowrap;line-height:1.2}
.tag.n{border-color:#3a4256;color:var(--text-secondary);background:rgba(255,255,255,.03)}

/* spotlight rows (Mike 2026-07-24 resting-state legibility): resting = muted but READABLE; .done = spoken (lit, no tint);
   .on = current point (lit + chapter-accent tint + accent edge). The spotlight adds emphasis, never toggles visibility. */
.rw{border:1px solid var(--border);border-left:6px solid var(--border);border-radius:18px;background:rgba(255,255,255,.03);
  color:var(--text-secondary)}
.rw.done{color:var(--text-primary);border-left-color:#4a5368}
.rw.on{color:var(--text-primary);border-color:rgba(var(--acc-rgb),.45);border-left-color:var(--acc);
  background:linear-gradient(135deg,rgba(var(--acc-rgb),.16),rgba(var(--acc-rgb),.02) 70%)}

/* ---------------- big statement card (h0, arg-1, comment) ---------------- */
.stmt h1{font-size:120px;line-height:1.04}
.stmt p{font-size:36px}

/* ---------------- RISK-LEVEL CARD (RL-1..RL-9 + the skeleton): JOB / RISK LEVEL, HORIZON / WHY / SOURCE ---------------- */
.rl h1{font-size:96px;line-height:1.04}
.rl h1.md{font-size:84px}
.rlgrid{display:grid;grid-template-columns:640px 1fr;gap:26px}
.fld{border:1px solid var(--border);border-radius:18px;background:rgba(255,255,255,.025);padding:28px 34px 32px}
.fl{font-family:'DM Sans';font-weight:600;font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:14px}
.fld.lv{border-color:rgba(var(--acc-rgb),.45);border-left:6px solid var(--acc);
  background:linear-gradient(135deg,rgba(var(--acc-rgb),.16),rgba(var(--acc-rgb),.02) 75%)}
.verd{font-family:'Playfair Display',serif;font-weight:900;font-size:76px;line-height:1.02;letter-spacing:-.02em;color:var(--acc)}
.verd.md{font-size:62px} .verd.sm{font-size:54px}
.hz{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:34px;color:var(--text-primary);margin-top:12px}
.fld .tag{margin-top:20px}
.why{font-family:'DM Sans';font-size:36px;line-height:1.35;color:var(--text-primary);font-weight:500}
.why li{list-style:none;position:relative;padding-left:30px;margin-bottom:12px}
.why li:last-child{margin-bottom:0}
.why li::before{content:"";position:absolute;left:0;top:.55em;width:12px;height:12px;border-radius:3px;background:var(--acc)}
.why li.mc{color:var(--text-primary)}
.why .tag{margin:0 0 0 12px;vertical-align:middle;font-size:18px;padding:5px 14px}
.src{margin-top:26px;display:flex;align-items:center;gap:22px;padding:22px 34px;border-radius:16px;border:1px dashed #2c3446;
  font-family:'DM Sans';font-size:28px;color:var(--text-secondary)}
.src .fl{margin:0;flex:none}
/* skeleton slots */
.slot{border:2px dashed #2f3749;border-radius:12px;background:rgba(255,255,255,.015)}
.slot.h{height:96px;width:900px}
.slot.v{height:82px;width:100%;margin-top:4px}
.slot.w{height:40px;width:100%;margin-top:14px}
.slot.w2{height:40px;width:72%;margin-top:14px}
.slot.s{height:34px;flex:1}
.jl{font-family:'DM Sans';font-weight:600;font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:14px}

/* mini RL cards (ch6 overview, the CH8 ladder) */
.minis{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:10px}
.mini{background:var(--bg-card);border:1px solid var(--border);border-radius:22px;padding:40px 34px 40px;position:relative;overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.4)}
.mini>.top{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.4) 60%,transparent)}
.mini .id{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:24px;color:var(--text-muted);letter-spacing:.06em}
.mini .nm{font-family:'Playfair Display',serif;font-weight:900;font-size:46px;line-height:1.06;color:var(--text-primary);margin:14px 0 28px;min-height:98px}
.mini .fl{font-size:18px;margin:18px 0 8px}

/* ---------------- 2-row transform cards (C8, human touch, weeks to a day) ---------------- */
.tx{display:flex;flex-direction:column;gap:0}
.tx .rw{padding:34px 48px 38px;display:flex;align-items:center;justify-content:space-between;gap:40px}
.tx .lb{font-family:'DM Sans';font-weight:600;font-size:24px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px}
.tx .rw.on .lb,.tx .rw.done .lb{color:#aeb6c4}
.tx .big{font-family:'Playfair Display',serif;font-weight:900;font-size:96px;line-height:1.04;letter-spacing:-.02em}
.tx .big.md{font-size:80px}
.tx .rw.on .big{color:var(--acc)}
.strike{position:relative;display:inline-block}
.strike::after{content:"";position:absolute;left:-10px;right:-10px;top:54%;height:9px;border-radius:5px;background:var(--accent-red);
  transform:rotate(-3deg);box-shadow:0 0 24px rgba(255,64,96,.5)}
.tx .rw.on .big.redx{color:var(--text-primary)}
.down{display:flex;justify-content:flex-start;padding:10px 0 10px 64px}
.cond{font-family:'Playfair Display',serif;font-weight:900;font-size:64px;line-height:1.1;color:var(--text-primary);margin-bottom:6px}

/* ---------------- C19 university rows / C27 dated list ---------------- */
.rows{display:flex;flex-direction:column;gap:20px}
.nr{display:grid;grid-template-columns:330px 1fr;align-items:center;gap:36px;padding:26px 44px 28px}
.nr .n{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:84px;line-height:1;color:var(--text-secondary)}
.nr.on .n{color:var(--acc)} .nr.done .n{color:var(--text-primary)}
.nr .t{font-family:'DM Sans';font-weight:600;font-size:40px;line-height:1.25}
.nr .s{display:block;font-weight:400;font-size:24px;color:#7d8798;margin-top:6px;letter-spacing:.02em}
.dl{display:grid;grid-template-columns:200px 1fr;align-items:center;gap:30px;padding:22px 40px 22px;min-height:104px}
.dl .d{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:38px;color:var(--text-secondary);letter-spacing:.02em}
.dl.on .d{color:var(--acc)} .dl.done .d{color:var(--text-primary)}
.dl .t{font-family:'DM Sans';font-weight:600;font-size:34px;line-height:1.25;display:none}
.dl .t .s{font-weight:400;color:#8f98a9;font-size:28px}
.dl .ph{display:block}
.dl.on .t,.dl.done .t{display:block} .dl.on .ph,.dl.done .ph{display:none}
.dl .ph .slot{height:34px;width:70%}
.dl.wl{border-style:dashed;visibility:hidden;margin-top:6px}
.dl.wl.on{visibility:visible}
.dl.wl .d{font-size:30px}

/* ---------------- coin marks ---------------- */
.marks{display:flex;justify-content:space-around;align-items:flex-end;margin-top:20px}
.mk{display:flex;flex-direction:column;align-items:center;gap:30px;opacity:.38;filter:grayscale(.85)}
.mk.on,.mk.done{opacity:1;filter:none}
.mk .disc{width:300px;height:300px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center}
.mk.on .disc{box-shadow:0 0 90px rgba(var(--acc-rgb),.35)}
.mk .disc img{width:100%;height:100%;object-fit:cover}
.mk .disc.tao{background:#fff}
.mk .disc.tao img{width:auto;height:46%;object-fit:contain}
.mk .nm{font-family:'DM Sans';font-weight:700;font-size:40px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-primary)}
.mk .tk{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:28px;color:var(--text-secondary);margin-top:-18px}

/* ---------------- the risk ladder (CH8 overview) ---------------- */
.ladder{display:flex;flex-direction:column;gap:16px}
.band{display:grid;grid-template-columns:330px 1fr;gap:28px;align-items:center;padding:20px 30px 20px 34px}
.band .gl{font-family:'Playfair Display',serif;font-weight:900;font-size:40px;line-height:1.05;color:var(--text-secondary)}
.band.on .gl{color:var(--acc)} .band.done .gl{color:var(--text-primary)}
.band .gl .tag{display:inline-flex;margin-top:10px;font-size:16px;padding:5px 12px}
.band .chips{display:flex;gap:14px}
.rc{flex:1;border:1px solid #262c3a;border-radius:14px;background:var(--bg-card);padding:14px 18px 16px;min-width:0}
.rc .id{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:18px;color:var(--text-muted)}
.rc .nm{font-family:'DM Sans';font-weight:700;font-size:28px;line-height:1.15;color:var(--text-secondary);margin-top:4px;white-space:nowrap}
.rc .lv{font-family:'DM Sans';font-weight:600;font-size:17px;letter-spacing:.05em;text-transform:uppercase;color:var(--text-muted);margin-top:6px;white-space:nowrap}
.band.on .rc{border-color:rgba(var(--acc-rgb),.5)} .band.on .rc .nm,.band.done .rc .nm{color:var(--text-primary)}
.band.on .rc .lv{color:var(--acc)} .band.on .rc .id{color:var(--acc)} .band.done .rc .lv{color:#aeb6c4}
.band .one{font-family:'DM Sans';font-weight:600;font-size:30px;line-height:1.3;white-space:nowrap}
.band .one .k{font-family:'Playfair Display',serif;font-weight:900;font-size:38px}
.band.on .one .k{color:var(--acc)}

/* ---------------- comment card ---------------- */
.split{display:grid;grid-template-columns:1fr 420px;gap:70px;align-items:center}
.bubble{width:420px}

/* ---------------- END CARD = an OVERLAY over the last shot (transparent PNG; _shot.py shoots it omit_background) ----------------
   visual-qa 2026-10-26 (x2): never the mid-frame card. Spec (COVER-PLAN end-card): logo bug + community link lower-third.
   A SMALL corner bug (the CryptoRich mark, its own teal rim = brand teal) + a lower-third band inside the bottom 25% (house band:
   bg-card base, chapter-accent tint, accent left edge, grain inside the band only). Nothing else paints: no frame bg, no orbs,
   no full-frame grain, so every pixel outside the bug and the band is alpha 0, and everything (shadows too) stays >= 60 px in. */
html.alpha,html.alpha body{background:transparent}
.frame.ovl{background:transparent;padding:0}
.frame.ovl::after{display:none}
.frame.ovl>.bugc{position:absolute;top:84px;right:84px;width:128px;height:128px;border-radius:50%;overflow:hidden;
  box-shadow:0 6px 16px rgba(0,0,0,.5)}
.bugc img{display:block;width:100%;height:100%;object-fit:cover}
.frame.ovl>.l3{position:absolute;left:140px;bottom:96px;display:flex;align-items:center;gap:34px;
  padding:20px 60px 20px 28px;border-radius:20px;overflow:hidden;
  border:1px solid rgba(var(--acc-rgb),.45);border-left:6px solid var(--acc);
  background:linear-gradient(135deg,rgba(var(--acc-rgb),.16),rgba(var(--acc-rgb),.02) 75%),var(--bg-card); /* opaque: nothing ghosts through */
  box-shadow:0 10px 18px -8px rgba(0,0,0,.55)}
.l3::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.l3 .ic{flex:none;width:108px;height:108px;border-radius:18px;display:flex;align-items:center;justify-content:center;
  color:var(--acc);border:1px solid rgba(var(--acc-rgb),.35);background:rgba(var(--acc-rgb),.08)}
.l3 .hd{font-family:'Playfair Display',serif;font-weight:900;font-size:80px;line-height:.86;letter-spacing:.01em;
  color:var(--text-primary);white-space:nowrap}
.l3 .ln{font-family:'DM Sans';font-weight:500;font-size:36px;line-height:1.2;color:var(--text-primary);margin-top:10px;white-space:nowrap}
"""

ORBS = '<div class="orb o1"></div><div class="orb o2"></div>'
DOWN = ('<div class="down"><svg width="44" height="40" viewBox="0 0 44 40"><path d="M22 38 L42 12 H30 V2 H14 V12 H2 Z" '
        'fill="#3a4256"/></svg></div>')

BTC_SVG = ('<svg viewBox="0 0 64 64" width="300" height="300"><path fill="#f7931a" d="M63.033,39.744c-4.274,17.143-21.637,27.576-38.782,23.301'
           'C7.116,58.77-3.317,41.406,0.959,24.263C5.23,7.118,22.594-3.317,39.734,0.957C56.878,5.231,67.31,22.597,63.033,39.744z"/>'
           '<path fill="#fff" d="M46.103,27.444c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768l-3.511-0.875l-1.4,5.616c-0.923-0.23-1.871-0.447-2.813-0.662'
           'l1.41-5.653l-3.509-0.875l-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018l-4.842-1.209l-0.934,3.75c0,0,2.605,0.597,2.55,0.634'
           'c1.422,0.355,1.679,1.296,1.636,2.042l-1.638,6.571c0.098,0.025,0.225,0.061,0.365,0.117c-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205'
           'c-0.174,0.432-0.615,1.08-1.609,0.834c0.035,0.051-2.552-0.637-2.552-0.637l-1.743,4.019l4.569,1.139c0.85,0.213,1.683,0.436,2.503,0.646'
           'l-1.453,5.834l3.507,0.875l1.439-5.772c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745l3.511,0.875l1.453-5.823c5.987,1.133,10.489,0.676,12.384-4.739'
           'c1.527-4.36-0.076-6.875-3.226-8.515C44.258,32.796,45.974,31.218,46.103,27.444z M38.08,38.73c-1.085,4.36-8.426,2.003-10.806,1.412l1.928-7.729'
           'C31.582,33.007,39.215,34.184,38.08,38.73z M39.166,27.381c-0.99,3.966-7.1,1.951-9.082,1.457l1.748-7.01C33.814,22.322,40.199,23.244,39.166,27.381z"/></svg>')


def title(fid, ch, num, h1):
    return f'''<div class="frame title {ch}" id="{fid}">
  <div class="deco vig"></div><div class="orb o1" style="opacity:.2"></div><div class="orb o2"></div>
  <div class="deco fog"></div><div class="deco rim"></div>
  <div class="ey">Chapter {num}</div>
  <h1>{h1}</h1>
  <div class="divider"></div>
</div>'''


def rl(fid, ch, n, job, verd, tag, why, src, jobcls="", verdcls="", hz=""):
    """One risk-level card. tag = (text, mikes_call?)"""
    tg = f'<span class="tag{"" if tag[1] else " n"}">{tag[0]}</span>'
    hzh = f'<div class="hz">{hz}</div>' if hz else ""
    whyh = "".join(f"<li>{w}</li>" for w in why)
    return f'''<div class="frame {ch}" id="{fid}">
  {ORBS}
  <div class="card rl"><div class="top"></div>
    <div class="ey">Risk level card · <span class="mono">RL-{n}</span></div>
    <h1 class="{jobcls}">{job}</h1>
    <div class="divider"></div>
    <div class="rlgrid">
      <div class="fld lv"><div class="fl">Risk level / horizon</div><div class="verd {verdcls}">{verd}</div>{hzh}{tg}</div>
      <div class="fld"><div class="fl">Why</div><ul class="why">{whyh}</ul></div>
    </div>
    <div class="src"><span class="fl">Source</span><span>{src}</span></div>
  </div>
</div>'''


F = []

# ======================= CH1 (red #ff4060) =======================
F.append(f'''<div class="frame ch1" id="h0-next-wave-card">
  {ORBS}
  <div class="card stmt"><div class="top"></div>
    <div class="ey">AI and your job</div>
    <h1>The next wave<br>has a <span class="a">date</span></h1>
    <div class="divider"></div>
  </div>
</div>''')

F.append(f'''<div class="frame ch1" id="rl-skeleton">
  {ORBS}
  <div class="card rl"><div class="top"></div>
    <div class="ey">Risk level card</div>
    <div class="jl">Job</div>
    <div class="slot h"></div>
    <div class="divider"></div>
    <div class="rlgrid">
      <div class="fld lv"><div class="fl">Risk level / horizon</div><div class="slot v"></div><div class="slot w2" style="width:55%"></div></div>
      <div class="fld"><div class="fl">Why</div><div class="slot w"></div><div class="slot w2"></div></div>
    </div>
    <div class="src"><span class="fl">Source</span><span class="slot s"></span></div>
  </div>
</div>''')

# ======================= CH2 (gold #ffd700) =======================
F.append(title("title-CH2", "ch2", "02", 'Already <span class="a">gone</span>'))

F.append(rl("RL-1-copywriters", "ch2", 1, "Copywriters", "Already gone", ("Mike's call", True),
            ['A <span class="mono">$20</span> a month model writes the first draft'],
            'BLS writers and authors: <b class="mono">0%</b> growth to <span class="mono">2035</span>, AI named'))

F.append(f'''<div class="frame ch2" id="C8-price-card">
  {ORBS}
  <div class="card"><div class="top"></div>
    <div class="ey">My thumbnails</div>
    <div class="divider" style="margin-top:6px"></div>
    <div class="tx">
      <div class="rw" data-k="r1"><div><div class="lb">Then: a freelancer</div><div class="big redx"><span class="strike"><span class="mono">$50</span> a thumbnail</span></div></div></div>
      {DOWN}
      <div class="rw" data-k="r2"><div><div class="lb">Now: I make them myself</div><div class="big">One small subscription</div></div></div>
    </div>
  </div>
</div>''')

F.append(rl("RL-2-graphic-designers", "ch2", 2, "Graphic designers", "Already gone", ("Mike's call", True),
            ["A prompt replaced the brief, the wait and the revisions"],
            'WEF Future of Jobs <span class="mono">2025</span>: on the declining list for the first time'))

# ======================= CH3 (purple #a855f7) =======================
F.append(title("title-CH3", "ch3", "03", 'Next on<br>the <span class="a">list</span>'))

F.append(rl("RL-3-video-editors", "ch3", 3, "Video editors", '<span class="mono">18</span> months',
            ("Mike's call", True),
            ["My own edits: a fifth of the time, with AI"],
            'BLS: <b class="mono">39,400</b> editors, plus <b class="mono">4%</b> to <span class="mono">2035</span>'))

F.append(f'''<div class="frame ch3" id="human-touch-card">
  {ORBS}
  <div class="card"><div class="top"></div>
    <div class="ey" style="display:flex;align-items:center;gap:20px">Video editors <span class="tag">Mike's call</span></div>
    <div class="divider" style="margin-top:6px"></div>
    <div class="tx">
      <div class="rw" data-k="r1"><div><div class="lb">The job</div><div class="big md">Might not entirely disappear</div></div></div>
      {DOWN}
      <div class="rw" data-k="r2"><div><div class="lb">New jobs in the field</div><div class="big">So rare</div></div></div>
    </div>
  </div>
</div>''')

# ======================= CH4 (purple) =======================
F.append(rl("RL-4-actors-models", "ch4", 4, "Actors and models", "High", ("Mike's call", True),
            ['H&amp;M: <span class="mono">30</span> real models signed up to be cloned',
             "An AI actress with a film in development"],
            'H&amp;M via FashionUnited, March <span class="mono">2025</span> · Deadline, July <span class="mono">2026</span>'))

# ======================= CH5 (cyan #00c2ff) =======================
F.append(f'''<div class="frame ch5" id="arg-1-information">
  {ORBS}
  <div class="card stmt"><div class="top"></div>
    <div class="ey">Universities</div>
    <h1><span class="a mono" style="font-size:124px">1.</span> The <span class="a">information</span></h1>
    <div class="divider"></div>
  </div>
</div>''')

F.append(f'''<div class="frame ch5" id="C19-university-card">
  {ORBS}
  <div class="card"><div class="top"></div>
    <div class="ey">Universities</div>
    <h1 class="sm">What the degree <span class="a">costs</span></h1>
    <div class="divider"></div>
    <div class="rows">
      <div class="rw nr" data-k="r1"><div class="n">42%</div><div class="t">of recent grads work in jobs that don't need a degree<span class="s">NY Fed, recent college graduates, <span class="mono">2026</span> Q2</span></div></div>
      <div class="rw nr" data-k="r2"><div class="n">$45K</div><div class="t">a year: private university tuition<span class="s">College Board, <span class="mono">2025-26</span> average</span></div></div>
      <div class="rw nr" data-k="r3"><div class="n">$180K</div><div class="t">over <span class="mono">4</span> years, tuition alone<span class="s">before the dorm</span></div></div>
    </div>
  </div>
</div>''')

F.append(rl("RL-5-university-jobs", "ch5", 5, "University jobs", '<span class="mono">3</span> to <span class="mono">5</span> years',
            ("Mike's call", True),
            ['The information is a <span class="mono">$20</span> model',
             "The jobs at the end are shrinking"],
            'NY Fed: recent grads <b class="mono">5.6%</b> unemployed, <b class="mono">42%</b> underemployed (<span class="mono">2026</span> Q2)'))

# ======================= CH6 (cyan) =======================
def mini(n, nm):
    return f'''<div class="mini"><div class="top"></div><div class="id">RL-{n}</div><div class="nm">{nm}</div>
      <div class="fl">Risk level</div><div class="slot" style="height:56px"></div>
      <div class="fl">Why</div><div class="slot" style="height:30px"></div><div class="slot" style="height:30px;width:70%;margin-top:10px"></div></div>'''

F.append(f'''<div class="frame ch6" id="ch6-four-skeletons">
  {ORBS}
  <div class="ey">Four risk levels</div>
  <h1 class="sm">Accountants and <span class="a">lawyers</span></h1>
  <div class="divider"></div>
  <div class="minis">{mini(6, "Bookkeepers")}{mini(7, "Accountants")}{mini(8, "Paralegals")}{mini(9, "Lawyers")}</div>
</div>''')

F.append(rl("RL-6-bookkeepers", "ch6", 6, "Bookkeeping clerks", "Shrinking now", ("BLS", False),
            ["Software already automated many of the tasks"],
            'BLS: <b class="mono">1,532,400</b> jobs, <b class="mono">-6%</b> to <span class="mono">2035</span>',
            verdcls="md"))

F.append(rl("RL-7-accountants", "ch6", 7, "Accountants and auditors", "Entry level first", ("Suleyman, Feb 2026", False),
            ['Goldman Sachs (<span class="mono">2025</span>): on its higher-risk list',
             'KPMG UK graduate intake: <span class="mono">1,399</span> to <span class="mono">942</span>'],
            'BLS: <b class="mono">1,595,200</b> accountants and auditors',
            jobcls="md", verdcls="sm", hz="12 to 18 months"))

F.append(rl("RL-8-paralegals", "ch6", 8, "Paralegals and legal assistants", "Stalled", ("BLS", False),
            ["The government names AI as what holds demand back"],
            'BLS: <b class="mono">404,900</b> jobs, <b class="mono">0%</b> to <span class="mono">2035</span>, AI named',
            jobcls="md"))

F.append(rl("RL-9-lawyers", "ch6", 9, "Lawyers", "The work changes first", ("Goldman · BLS · Harvey", False),
            ['Legal tasks <span class="mono">44%</span> exposed (Goldman <span class="mono">2023</span>)',
             'Harvey says <span class="mono">80%</span> of the top <span class="mono">100</span> US law firms use it',
             "In my book, the headcount follows <span class=\"tag\">Mike's call</span>"],
            'BLS: <b class="mono">863,700</b> lawyers, still plus <b class="mono">5%</b> to <span class="mono">2035</span> on paper',
            verdcls="sm"))

# ======================= CH7 (green #00e68a) =======================
F.append(title("title-CH7", "ch7", "07", 'The flip <span class="a">side</span>'))

PH = '<span class="ph"><span class="slot" style="display:block"></span></span>'
F.append(f'''<div class="frame ch7" id="C27-last-30-days">
  {ORBS}
  <div class="card"><div class="top"></div>
    <div class="ey">Medicine</div>
    <h1 class="sm">The last <span class="a"><span class="mono">30</span> days</span></h1>
    <div class="divider" style="margin:26px 0 26px"></div>
    <div class="rows" style="gap:14px">
      <div class="rw dl" data-k="r1"><div class="d">OCT 8</div>{PH}<div class="t">First human data for a rejuvenation therapy <span class="s">(<span class="mono">3</span> patients, eye only)</span></div></div>
      <div class="rw dl" data-k="r2"><div class="d">OCT 12</div>{PH}<div class="t">Rice-grain-length heart robots, Johns Hopkins <span class="s">(lab stage)</span></div></div>
      <div class="rw dl" data-k="r3"><div class="d">OCT 19</div>{PH}<div class="t">FDA: an immunotherapy for rectal cancer <span class="s">(one tumor type)</span></div></div>
      <div class="rw dl" data-k="r4"><div class="d">OCT 20</div>{PH}<div class="t">FDA: a first-of-its-kind hepatitis B drug</div></div>
      <div class="rw dl wl" data-k="r5"><div class="d">2025</div>{PH}<div class="t">Waterloo: soft robots that dissolve a type of kidney stone <span class="s">(tested in a model)</span></div></div>
    </div>
  </div>
</div>''')

F.append(f'''<div class="frame ch7" id="weeks-to-a-day-card">
  {ORBS}
  <div class="card"><div class="top"></div>
    <div class="ey">Johns Hopkins heart robots · lab stage</div>
    <div class="cond">If they work in <span class="a">people</span></div>
    <div class="divider" style="margin:24px 0 30px"></div>
    <div class="tx">
      <div class="rw" data-k="r1"><div><div class="lb">Treatment today</div><div class="big md"><span class="mono">4</span> to <span class="mono">6</span> weeks</div></div></div>
      {DOWN}
      <div class="rw" data-k="r2"><div><div class="lb">Could become</div><div class="big md">A single day</div></div></div>
    </div>
  </div>
</div>''')

# ======================= CH8 (red #ff4060) =======================
F.append(title("title-CH8", "ch8", "08", 'Own the <span class="a">assets</span>'))

F.append(f'''<div class="frame ch8" id="coin-marks">
  {ORBS}
  <div class="card" style="padding:64px 88px 76px"><div class="top"></div>
    <div class="ey">My picks</div>
    <div class="divider" style="margin-top:6px"></div>
    <div class="marks">
      <div class="mk" data-k="m1"><div class="disc">{BTC_SVG}</div><div class="nm">Bitcoin</div><div class="tk">BTC</div></div>
      <div class="mk" data-k="m2"><div class="disc"><img src="marks/kaspa-logo.png"></div><div class="nm">Kaspa</div><div class="tk">KAS</div></div>
      <div class="mk" data-k="m3"><div class="disc tao"><img src="marks/tao-mark-trim.png"></div><div class="nm">TAO</div><div class="tk">Bittensor</div></div>
    </div>
  </div>
</div>''')


def rc(n, nm, lv):
    return f'<div class="rc"><div class="id">RL-{n}</div><div class="nm">{nm}</div><div class="lv">{lv}</div></div>'


F.append(f'''<div class="frame ch8" id="risk-ladder-overview">
  {ORBS}
  <div class="ey">In a nutshell</div>
  <h1 class="sm">The risk <span class="a">ladder</span></h1>
  <div class="divider" style="margin:24px 0 26px"></div>
  <div class="ladder">
    <div class="rw band" data-k="g1"><div class="gl">Already gone<br><span class="tag">In my book</span></div>
      <div class="chips">{rc(1, "Copywriters", "Already gone")}{rc(2, "Graphic designers", "Already gone")}</div></div>
    <div class="rw band" data-k="g2"><div class="gl">Next</div>
      <div class="chips">{rc(3, "Video editors", "18 months")}{rc(4, "Actors and models", "High")}</div></div>
    <div class="rw band" data-k="g3"><div class="gl">On the clock</div>
      <div class="chips">{rc(5, "Universities", "3 to 5 years")}{rc(6, "Bookkeepers", "Shrinking now")}{rc(7, "Accountants", "Entry level first")}{rc(8, "Paralegals", "Stalled")}{rc(9, "Lawyers", "Work changes first")}</div></div>
    <div class="rw band" data-k="g4"><div class="gl">The turn</div>
      <div class="one">Healthcare could get <span class="k">a lot cheaper</span>. The way through: <span class="k">own the assets</span>.</div></div>
  </div>
</div>''')

F.append(f'''<div class="frame ch8" id="cryptorich-card">
  {ORBS}
  <div class="card stmt"><div class="top"></div>
    <div class="ey">Find your people</div>
    <h1 style="font-size:190px;line-height:1">Crypto<span class="a">Rich</span></h1>
    <div class="divider"></div>
    <p style="color:var(--text-secondary);margin:0">My group, staying ahead of the game</p>
  </div>
</div>''')

F.append(f'''<div class="frame ch8" id="comment-card">
  {ORBS}
  <div class="card stmt split"><div class="top"></div>
    <div>
      <div class="ey">Drop a comment below</div>
      <h1>Which job goes <span class="a">next?</span></h1>
      <div class="divider"></div>
    </div>
    <svg class="bubble" viewBox="0 0 420 380">
      <path d="M40 20 H380 a30 30 0 0 1 30 30 V240 a30 30 0 0 1 -30 30 H170 L90 350 V270 H40 a30 30 0 0 1 -30 -30 V50 a30 30 0 0 1 30 -30 Z"
        fill="rgba(255,64,96,.10)" stroke="#ff4060" stroke-width="6" stroke-linejoin="round"/>
      <rect x="70" y="80" width="250" height="22" rx="11" fill="#e8eaf0" opacity=".85"/>
      <rect x="70" y="128" width="280" height="22" rx="11" fill="#8892a4" opacity=".7"/>
      <rect x="70" y="176" width="190" height="22" rx="11" fill="#8892a4" opacity=".7"/>
    </svg>
  </div>
</div>''')

# END CARD = an OVERLAY over the last shot (CH8@604.25-610.13, lands on "click that link" 606.45): a small corner logo bug +
# the community-link lower-third band. No orbs, no card: transparent, shot omit_background (_shot.py ALPHA) and kept RGBA.
LINK_SVG = ('<svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" '
            'stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>'
            '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>')
F.append(f'''<div class="frame ovl ch8" id="end-card">
  <div class="bugc"><img src="marks/mike-profile-logo.jpg" alt="CryptoRich"></div>
  <div class="l3">
    <div class="ic">{LINK_SVG}</div>
    <div class="tx3">
      <div class="hd">GET <span class="a">INVOLVED</span></div>
      <div class="ln">Click the link in the description</div>
    </div>
  </div>
</div>''')

with open(CANON, encoding="utf-8") as fh:
    canon = fh.read()

html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>only-18-months-left slides - canonical build (slide-builder)</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* Pasted VERBATIM from skills/container-reference/container-canonical.css (tokens + anatomy LOCKED).
   Everything below the CHAPTER THEMES line only ADDS layout classes and the per-chapter accent (Mike 2026-10-10).
   GENERATED by _build.py: edit that, not this file. */
{canon}
{EXTRA_CSS}
</style></head><body>
{chr(10).join(F)}
</body></html>
'''
assert not any("—" in f or "–" in f for f in F), "em/en dash in a frame"
with open(os.path.join(HERE, "containers.html"), "w", encoding="utf-8") as fh:
    fh.write(html)
print("wrote containers.html,", len(F), "frames")
