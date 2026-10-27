"""kcc20 slide source assembler (slide-builder).

Writes containers.html = the LOCKED container-canonical.css pasted VERBATIM + the chapter-accent layer and
layout-only components below it + one standalone 1920x1080 .frame per slide. Re-run after editing this file;
never hand-edit containers.html (it is regenerated). Then run _shot.py to screenshot.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CANON = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "skills", "container-reference",
                                     "container-canonical.css"))

ADD_CSS = r"""
/* ======================= CHAPTER THEMES (COVER-PLAN chapter_themes; Mike 2026-10-10) =======================
   The chapter accent REPLACES the default accent on: the top-accent line, the key words, the lit row, the divider
   and the accent orb. Every other token (bg, card, border, text greys, fonts, eyebrow) is the locked stylesheet. */
.ch2{--acc:#00c2ff;--acc-rgb:0,194,255}
.ch4{--acc:#ffd700;--acc-rgb:255,215,0}
.ch5{--acc:#70c7ba;--acc-rgb:112,199,186}
.a{color:var(--acc)}
.frame .divider{background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.35))}
.orb.o1{width:920px;height:920px;right:-330px;top:-380px;background:var(--acc);opacity:.17}
.orb.o2{width:660px;height:660px;left:-280px;bottom:-320px;background:#3a4f7a;opacity:.16}
.frame>.deco{position:absolute;pointer-events:none}

/* ======================= components (layout only; the locked tokens above are untouched) ======================= */
h1{font-variant-numeric:lining-nums}

/* ---------------- TITLE SLIDES (no box; bittensor-text-* reference) ---------------- */
.title h1{font-size:150px;line-height:1.02;max-width:1500px}
.title .ey{font-size:30px;margin-bottom:30px}
.title .divider{margin:44px 0 0}

/* CH4: playful board-game path under the headline (gold square = where it stands, Final still ahead) */
.board{display:flex;align-items:center;margin-top:64px}
.sq{width:96px;height:96px;border-radius:22px;flex:none;display:flex;align-items:center;justify-content:center;
  background:#1a1f2a;border:2px solid #2c3446;box-shadow:0 8px 0 #0d1016,0 14px 30px rgba(0,0,0,.45)}
.sq:nth-child(4n+1){transform:rotate(-3deg)} .sq:nth-child(4n+3){transform:rotate(2.5deg)}
.sq .pip{width:16px;height:16px;border-radius:50%;background:#4a5470}
.step{width:46px;flex:none;display:flex;justify-content:center;gap:7px}
.step i{width:7px;height:7px;border-radius:50%;background:#3a4256;display:block}
.step.lit i{background:rgba(var(--acc-rgb),.7)}
.sq.here{width:122px;height:122px;border-radius:28px;background:linear-gradient(160deg,#ffe24d,#ffc400);
  border:none;box-shadow:0 10px 0 #a37c00,0 0 70px rgba(var(--acc-rgb),.45),0 18px 40px rgba(0,0,0,.5);transform:rotate(-4deg)}
.piece{width:74px;height:74px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#2a303d,#0d1016 75%);
  box-shadow:0 6px 0 #05070a,inset 0 -4px 0 rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;
  font-family:'DM Sans';font-weight:700;font-size:44px;color:var(--acc);line-height:1}
.sq.final{background:transparent;border:3px dashed rgba(var(--acc-rgb),.55);box-shadow:none;width:122px;height:122px;border-radius:28px;
  transform:rotate(3deg);font-family:'JetBrains Mono',monospace;font-weight:700;font-size:22px;letter-spacing:.12em;color:var(--text-secondary)}

/* CH5: epic greenish-cyan moon + horizon glow */
.moon{width:760px;height:760px;right:-120px;top:96px;border-radius:50%;
  background:radial-gradient(circle at 40% 36%,#eafffb 0%,#bff0e7 14%,#8fdccf 34%,#70c7ba 52%,#3f8e83 78%,#24564f 100%);
  box-shadow:0 0 90px 20px rgba(112,199,186,.55),0 0 260px 90px rgba(112,199,186,.26),0 0 520px 160px rgba(112,199,186,.10);
  opacity:.9;z-index:0}
.moon::after{content:"";position:absolute;inset:0;border-radius:50%;background:
  radial-gradient(circle at 30% 62%,rgba(36,86,79,.26),transparent 9%),
  radial-gradient(circle at 62% 30%,rgba(36,86,79,.20),transparent 6.5%),
  radial-gradient(circle at 58% 66%,rgba(36,86,79,.24),transparent 13%),
  radial-gradient(circle at 76% 48%,rgba(36,86,79,.18),transparent 5.5%),
  radial-gradient(circle at 74% 78%,rgba(10,12,16,.45),transparent 60%)}
.horizon{left:0;right:0;bottom:0;height:300px;z-index:0;
  background:linear-gradient(0deg,rgba(112,199,186,.16),rgba(112,199,186,.05) 45%,transparent)}
.horizon::before{content:"";position:absolute;left:0;right:0;top:120px;height:2px;
  background:linear-gradient(90deg,transparent,rgba(112,199,186,.45) 30%,rgba(112,199,186,.75) 70%,transparent)}
.stars{inset:0;z-index:0;opacity:.55;background-image:
  radial-gradient(1.6px 1.6px at 12% 18%,#cfeee9,transparent),radial-gradient(1.4px 1.4px at 28% 9%,#cfeee9,transparent),
  radial-gradient(1.2px 1.2px at 47% 22%,#cfeee9,transparent),radial-gradient(1.8px 1.8px at 58% 8%,#cfeee9,transparent),
  radial-gradient(1.2px 1.2px at 8% 72%,#cfeee9,transparent),radial-gradient(1.5px 1.5px at 36% 82%,#cfeee9,transparent),
  radial-gradient(1.3px 1.3px at 52% 66%,#cfeee9,transparent),radial-gradient(1.6px 1.6px at 22% 44%,#cfeee9,transparent),
  radial-gradient(1.2px 1.2px at 64% 38%,#cfeee9,transparent),radial-gradient(1.4px 1.4px at 4% 34%,#cfeee9,transparent)}

/* CARD SLIDE: one rounded card, top-accent line, sized to FILL the frame (banks-card-* reference) */
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:68px 88px 74px;
  position:relative;overflow:hidden;width:100%;box-shadow:0 40px 120px rgba(0,0,0,.45)}
.card>.top{position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.55) 40%,transparent 85%)}
.card .ey{margin-bottom:22px}
.card .divider{margin:30px 0 34px}

/* spotlight rows (Mike 2026-07-24 resting-state legibility): resting = muted but READABLE; .done = spoken (lit, no tint);
   .on = current point (lit + chapter-accent tint + accent edge). The spotlight adds emphasis, never toggles visibility. */
.rw{border:1px solid var(--border);border-left:6px solid var(--border);border-radius:18px;background:rgba(255,255,255,.03);
  color:var(--text-secondary)}
.rw.done{color:var(--text-primary)}
.rw.on{color:var(--text-primary);border-color:rgba(var(--acc-rgb),.45);border-left-color:var(--acc);
  background:linear-gradient(135deg,rgba(var(--acc-rgb),.16),rgba(var(--acc-rgb),.02) 70%)}
.chip{display:inline-flex;align-items:center;font-family:'DM Sans';font-weight:600;font-size:27px;letter-spacing:.01em;
  padding:11px 26px;border-radius:999px;border:2px solid #2a3142;color:var(--text-secondary);background:rgba(255,255,255,.03);
  white-space:nowrap;line-height:1.2}
.chip .mono{font-size:26px}
.rw.on .chip{border-color:rgba(var(--acc-rgb),.7);color:var(--acc);background:rgba(var(--acc-rgb),.08)}
.rw.done .chip{border-color:#4a5368;color:var(--text-primary)}

/* card-rulebook: text left, three-layer stack glyph right */
#card-rulebook .card{display:grid;grid-template-columns:1fr 560px;gap:70px;align-items:center}
#card-rulebook h1{font-size:88px;line-height:1.08}
#card-rulebook p{font-size:38px;color:var(--text-secondary)}
.stack{display:flex;flex-direction:column;gap:18px}
.layer{display:flex;align-items:center;gap:24px;padding:26px 32px;border-radius:18px;border:1px solid var(--border);
  border-left:6px solid #3a4256;background:rgba(255,255,255,.03)}
.layer .ix{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:24px;color:var(--text-muted);width:40px;flex:none}
.layer .nm{font-family:'DM Sans';font-weight:700;font-size:38px;color:var(--text-secondary);line-height:1.15}
.layer .nm.mono{font-family:'JetBrains Mono',monospace;font-size:36px}
.layer .sb{display:block;font-family:'DM Sans';font-weight:400;font-size:24px;color:#7d8798;margin-top:4px}
.layer.lit{border-color:rgba(var(--acc-rgb),.5);border-left-color:var(--acc);
  background:linear-gradient(135deg,rgba(var(--acc-rgb),.18),rgba(var(--acc-rgb),.03) 70%);box-shadow:0 0 60px rgba(var(--acc-rgb),.14)}
.layer.lit .nm{color:var(--acc)} .layer.lit .ix{color:var(--acc)} .layer.lit .sb{color:#aeb6c4}
.uparr{display:flex;justify-content:center;margin:-6px 0}
.stack .cap{font-family:'DM Sans';font-weight:600;font-size:22px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px}

/* card-not-yet: two verdict rows */
#card-not-yet .card{padding:66px 88px 74px}
#card-not-yet .card .divider{margin:4px 0 34px}
.verdicts{display:flex;flex-direction:column;gap:24px}
.vr{display:flex;align-items:center;justify-content:space-between;gap:40px;padding:30px 44px 34px}
.vr .lb{font-family:'DM Sans';font-weight:600;font-size:27px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted)}
.vr.on .lb,.vr.done .lb{color:#aeb6c4}
.vr .vd{font-family:'Playfair Display',serif;font-weight:900;font-size:96px;line-height:1.02;letter-spacing:-.02em;margin-top:6px}
.vr.on .vd{color:var(--acc)}

/* ======================= VERTICAL 9:16 (vertical-repurpose.md §1, re-shot at 1080x1920) =======================
   Applies ONLY on a portrait viewport (_shot.py --portrait), so the 16:9 renders are byte-for-byte untouched.
   Frame size + reflow only: the locked tokens, fonts, anatomy, chapter accents and state classes are unchanged. */
@media (orientation: portrait){
  .frame{width:1080px;height:1920px;padding:0 96px}
  .orb.o1{width:820px;height:820px;right:-360px;top:-300px}
  .orb.o2{width:640px;height:640px;left:-300px;bottom:-260px}
  /* TITLE: headline wraps, sits a little above centre, phone-readable */
  .title{justify-content:center;padding-bottom:120px}
  .title h1{font-size:156px;line-height:1.02;max-width:888px}
  /* never break the token name at its hyphen; the 2-line phrasing of the 16:9 holds at this size */
  .nw{white-space:nowrap}
  #title-card-ch2 h1{font-size:136px}
  .title .ey{font-size:34px;margin-bottom:34px}
  .title .divider{margin:52px 0 0}
  /* CH4 board path keeps its horizontal run (fits 888px), a touch larger */
  .board{margin-top:84px;zoom:1.12}
  /* CH5: moon rides high above the headline, text drops into the lower half over the horizon */
  #title-card-ch5{justify-content:flex-end;padding-bottom:520px}
  .moon{width:820px;height:820px;right:-260px;top:150px}
  .horizon{height:420px}
  .horizon::before{top:150px}
  /* CARD: the two columns stack (text on top, the three-layer stack below), card fills the width */
  .card{padding:64px 60px 70px;border-radius:28px}
  #card-rulebook .card{grid-template-columns:1fr;gap:64px}
  #card-rulebook h1{font-size:96px;line-height:1.06}
  #card-rulebook p{font-size:40px}
  .card .ey{font-size:28px}
  .layer{padding:28px 34px;gap:28px}
  .layer .nm{font-size:44px} .layer .nm.mono{font-size:42px}
  .layer .sb{font-size:29px;margin-top:6px}
  .layer .ix{font-size:28px;width:46px}
}
"""

FRAMES = r"""
<!-- ======================= CH2 (cyan #00c2ff) ======================= -->
<div class="frame title ch2" id="title-card-ch2">
  <div class="orb o1" style="opacity:.22"></div><div class="orb o2"></div>
  <div class="ey">Chapter 02</div>
  <h1>How <span class="nw">KCC-20</span><br><span class="a">works</span></h1>
  <div class="divider"></div>
</div>

<div class="frame ch2" id="card-rulebook">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="card"><div class="top"></div>
    <div>
      <div class="ey">kaspanet/kccs · <span class="mono">KCC-20</span></div>
      <h1>The shared <span class="a">rulebook</span> for a fungible token</h1>
      <div class="divider"></div>
      <p>built from Toccata's covenants</p>
    </div>
    <div class="stack">
      <div class="layer lit"><span class="ix">03</span><span class="nm mono">KCC-20<span class="sb">the fungible token rulebook</span></span></div>
      <div class="uparr"><svg width="34" height="30" viewBox="0 0 34 30"><path d="M17 2 L31 22 H22 V28 H12 V22 H3 Z" fill="#3a4256"/></svg></div>
      <div class="layer"><span class="ix">02</span><span class="nm">Covenants<span class="sb">rules built into the coin</span></span></div>
      <div class="uparr"><svg width="34" height="30" viewBox="0 0 34 30"><path d="M17 2 L31 22 H22 V28 H12 V22 H3 Z" fill="#3a4256"/></svg></div>
      <div class="layer"><span class="ix">01</span><span class="nm">Toccata<span class="sb">the hard fork</span></span></div>
    </div>
  </div>
</div>

<!-- ======================= CH4 (gold #ffd700, playful board-game) ======================= -->
<div class="frame title ch4" id="title-card-ch4">
  <div class="orb o1" style="opacity:.15"></div><div class="orb o2"></div>
  <div class="ey">Chapter 04</div>
  <h1>Where it <span class="a">stands</span></h1>
  <div class="divider"></div>
  <div class="board">
    <div class="sq"><span class="pip"></span></div><div class="step lit"><i></i><i></i><i></i></div>
    <div class="sq"><span class="pip"></span></div><div class="step lit"><i></i><i></i><i></i></div>
    <div class="sq"><span class="pip"></span></div><div class="step lit"><i></i><i></i><i></i></div>
    <div class="sq here"><span class="piece">K</span></div><div class="step"><i></i><i></i><i></i></div>
    <div class="sq final">FINAL</div>
  </div>
</div>

<!-- ======================= CH5 (Kaspa greenish cyan #70c7ba, epic) ======================= -->
<div class="frame title ch5" id="title-card-ch5">
  <div class="deco stars"></div>
  <div class="deco moon"></div>
  <div class="deco horizon"></div>
  <div class="orb o2" style="background:#1d4a46;opacity:.22"></div>
  <div class="ey">Chapter 05</div>
  <h1>The bigger<br><span class="a">picture</span></h1>
  <div class="divider"></div>
</div>

<div class="frame ch5" id="card-not-yet">
  <div class="orb o1"></div><div class="orb o2" style="background:#1d4a46;opacity:.2"></div>
  <div class="card"><div class="top"></div>
    <div class="ey">The verdict</div>
    <div class="divider"></div>
    <div class="verdicts">
      <div class="rw vr" data-k="r1">
        <div><div class="lb">Tokens</div><div class="vd">Exist today</div></div>
        <span class="chip">roughly&nbsp;<span class="mono">150</span>, third-party count</span>
      </div>
      <div class="rw vr" data-k="r2">
        <div><div class="lb">The shared standard</div><div class="vd">Not yet</div></div>
        <span class="chip"><span class="mono">KCC-20</span>: Last Call · Final technical KCCs:&nbsp;<span class="mono">0</span></span>
      </div>
    </div>
  </div>
</div>
"""

HEAD = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>kcc20 slides - canonical build (slide-builder)</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* Pasted VERBATIM from skills/container-reference/container-canonical.css (tokens + anatomy LOCKED).
   Everything below the CHAPTER THEMES line only ADDS layout classes and the per-chapter accent (Mike 2026-10-10).
   GENERATED by _build.py: edit that, not this file. */
"""

if __name__ == "__main__":
    css = open(CANON, encoding="utf-8").read()
    html = HEAD + css + ADD_CSS + "</style></head><body>\n" + FRAMES + "\n</body></html>\n"
    out = os.path.join(HERE, "containers.html")
    open(out, "w", encoding="utf-8").write(html)
    print("wrote", out)
