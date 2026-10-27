"""growth-vs-product: writes containers.html = the LOCKED container-canonical.css pasted verbatim + project additions.
Run: python _build_html.py   (then python _shot.py)"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CSS = os.path.join(HERE, "..", "..", "..", "..", "skills", "container-reference", "container-canonical.css")

EXTRA = r'''
/* ======================= CHAPTER THEMES (COVER-PLAN chapter_themes; Mike 2026-10-10) =======================
   The chapter accent REPLACES the default accent on the top-accent line, key words, lit rows, divider and the
   accent orb. Every other token (bg, card, border, text greys, fonts, muted eyebrow) is the locked stylesheet.
   The two ROLE accents ride on top for the whole video: role A (growth) #ffd700, role B (product) #22c55e. */
.frame{--roleA:#ffd700;--roleA-rgb:255,215,0;--roleB:#22c55e;--roleB-rgb:34,197,94}
.ch1{--acc:#ffd700;--acc-rgb:255,215,0}
.ch2,.ch3,.ch4{--acc:#00c2ff;--acc-rgb:0,194,255}
.ch5,.ch6{--acc:#a78bfa;--acc-rgb:167,139,250}
.a{color:var(--acc)}
.frame .divider{background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.35))}
.orb.o1{width:920px;height:920px;right:-330px;top:-380px;background:var(--acc);opacity:.17}
.orb.o2{width:660px;height:660px;left:-280px;bottom:-320px;background:#3a4f7a;opacity:.16}
.ch1 .orb.o2{background:var(--roleB);opacity:.12}

/* ======================= components (layout only; the locked tokens above are untouched) ======================= */
h1{font-variant-numeric:lining-nums}
.ey .mono{letter-spacing:.12em}
.frame.title h1{font-size:112px}

/* CARD SLIDE: one rounded card, top-accent line, sized to FILL the frame (banks-card-* reference) */
.card{background:var(--bg-card);border:1px solid var(--border);border-radius:28px;padding:62px 88px 70px;
  position:relative;overflow:hidden;width:100%;box-shadow:0 40px 120px rgba(0,0,0,.45)}
.card>.top{position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.55) 40%,transparent 85%)}
.ch1 .card>.top{background:linear-gradient(90deg,var(--roleA),rgba(var(--roleA-rgb),.5) 38%,rgba(var(--roleB-rgb),.5) 62%,var(--roleB))}
.card .ey{margin-bottom:24px}
.card .divider{margin:26px 0 30px}

/* ROLE LABEL: the video's signature two-colour label (house display font, PROJECT-LOG 2026-10-22):
   the role word in the role accent, ENGINEER white, drop shadow. Resting = muted but READABLE grey. */
.role{font-family:'Playfair Display',serif;font-weight:900;text-transform:uppercase;font-variant-ligatures:none;
  font-size:76px;line-height:1.0;letter-spacing:.01em;color:var(--text-secondary);
  text-shadow:0 6px 20px rgba(0,0,0,.55)}
.role .w{color:var(--text-secondary)}
.role.ga.lit .w{color:var(--roleA)} .role.pb.lit .w{color:var(--roleB)}
.role.lit{color:var(--text-primary)}
.role .ai{display:none}
.role .ai.show{display:inline}
.role.sm{font-size:50px;line-height:1.04}
.role.one br{display:none}

/* two halves of ONE card (a single rhetorical unit: the role pair / the declared A-vs-B) */
.pair{display:grid;grid-template-columns:1fr 2px 1fr;column-gap:64px;align-items:stretch}
.pair .vsep{background:linear-gradient(180deg,transparent,var(--border) 12%,var(--border) 88%,transparent)}
.half{display:flex;flex-direction:column;min-width:0}
.half.A{--acc:var(--roleA);--acc-rgb:var(--roleA-rgb)}
.half.B{--acc:var(--roleB);--acc-rgb:var(--roleB-rgb)}
.half .hr{width:66px;height:4px;border-radius:2px;margin:26px 0 24px;
  background:linear-gradient(90deg,var(--acc),rgba(var(--acc-rgb),.35))}
.half .push{margin-top:auto}

/* spotlight rows (Mike 2026-07-24 resting-state legibility): resting = muted but READABLE (text-secondary,
   full opacity); .done = already spoken (lit text); .on = the current point (lit + accent tint + accent edge). */
.rw{font-family:'DM Sans';font-size:31px;line-height:1.42;color:var(--text-secondary);
  padding:16px 24px 16px 26px;border-left:4px solid var(--border);border-radius:0 14px 14px 0;margin-bottom:14px}
.rw.done{color:var(--text-primary);border-left-color:rgba(var(--acc-rgb),.55)}
.rw.on{color:var(--text-primary);border-left-color:var(--acc);background:rgba(var(--acc-rgb),.10)}
.rw .tg{display:block;font-size:21px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--text-muted);margin-bottom:4px}
.rw.done .tg,.rw.on .tg{color:var(--acc)}
.rw.ghost{visibility:hidden}

/* chips row */
.chips{display:flex;flex-wrap:wrap;gap:22px}
.chip{font-family:'DM Sans';font-size:32px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--text-secondary);background:var(--bg-card-hover);border:2px solid var(--border);
  border-radius:999px;padding:18px 36px;white-space:nowrap}
.chip .mono{font-size:24px;color:var(--text-muted);margin-right:14px;letter-spacing:0}
.chip.done{color:var(--text-primary);border-color:rgba(var(--acc-rgb),.45)}
.chip.on{color:var(--acc);border-color:var(--acc);background:rgba(var(--acc-rgb),.12);
  box-shadow:0 0 34px rgba(var(--acc-rgb),.22)}
.chip.on .mono,.chip.done .mono{color:var(--acc)}

/* takeaway line (a headline that LANDS on its word): resting readable grey, lit = white + accent key word */
.take{font-family:'Playfair Display',serif;font-weight:900;font-size:84px;line-height:1.07;letter-spacing:-.02em;
  color:var(--text-secondary)}
.take .k{color:var(--text-secondary)}
.take.on{color:var(--text-primary)} .take.on .k{color:var(--acc)}
.labels2{display:flex;gap:110px;align-items:flex-end}

/* ======================= VERTICAL 9:16 (vertical-repurpose.md section 1, re-shot at 1080x1920) =======================
   Applies ONLY on a portrait viewport (_shot.py --portrait), so the 16:9 renders are untouched.
   Frame size + reflow only: the locked tokens, fonts, anatomy, chapter accents and state classes are unchanged.
   The two halves of a pair card STACK (A on top, B below) with the column rule turned horizontal. */
@media (orientation: portrait){
  .frame{width:1080px;height:1920px;padding:0 64px}
  .orb.o1{width:820px;height:820px;right:-380px;top:-320px}
  .orb.o2{width:640px;height:640px;left:-320px;bottom:-280px}
  /* TITLE: headline wraps, sits a little above centre, phone-readable */
  .frame.title{padding:0 96px 120px}
  .frame.title h1{font-size:150px;line-height:1.02;max-width:888px}
  .title .ey{font-size:34px;margin-bottom:34px}
  .title .divider{margin:52px 0 0}
  /* CARD */
  .card{padding:60px 60px 66px}
  .ey,.card .ey{font-size:29px}
  h1{font-size:104px;line-height:1.04}
  .role{font-size:88px}
  .role.sm{font-size:70px}
  .pair{grid-template-columns:1fr;grid-template-rows:auto auto auto;row-gap:0}
  .pair .vsep{height:2px;margin:44px 0 40px;
    background:linear-gradient(90deg,transparent,var(--border) 10%,var(--border) 90%,transparent)}
  .half .hr{margin:24px 0 22px}
  .rw{font-size:37px;line-height:1.36;padding:14px 22px 14px 26px;margin-bottom:12px}
  .rw .tg{font-size:24px}
  .chips{gap:20px}
  .chip{font-size:37px;padding:20px 38px}
  .chip .mono{font-size:28px}
  .take{font-size:100px;line-height:1.04}
  .labels2{gap:60px}
  .labels2 .role.sm{font-size:64px}
  /* the A-vs-B compare keeps the 16:9 reading order (statements, then the role label lights as the payoff);
     stacked, the bottom-pinning spacer is dropped and the type grows to fill the taller card */
  #become-compare .half .push{display:none}
  #become-compare .rw{font-size:39px}
  #become-compare .role.sm{font-size:84px}
  /* the two single-role cards: scaled up so the card fills the taller frame */
  #scoreboard-growth .role.sm,#ship-to-learn .role.sm{font-size:80px}
  #scoreboard-growth h1{font-size:132px;margin-top:26px!important}
  #scoreboard-growth .chip{font-size:42px;padding:24px 42px}
  #scoreboard-growth .chips{gap:24px}
  #ship-to-learn .rw{font-size:46px;padding:18px 26px 18px 30px;margin-bottom:16px}
  #ship-to-learn .take{font-size:140px;margin-top:44px!important}
  /* the closing three: chips stack one per line so each reads as its own point */
  #C2-s4 .chips{flex-direction:column;align-items:flex-start;gap:24px}
  #C2-s4 .chip{font-size:42px;padding:24px 44px}
  #C2-s4 .chip .mono{font-size:32px}
  #C2-s4 .take{font-size:116px;margin-top:56px!important}
}
'''

HEAD = '''<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>growth-vs-product slides - canonical build (slide-builder)</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700;1,900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* Pasted VERBATIM from skills/container-reference/container-canonical.css (tokens + anatomy LOCKED).
   Everything below the marked line only ADDS layout classes and the per-chapter accent (Mike 2026-10-10). */
'''


def c2(fid, ey, ai):
    ghost = "" if ai else " ghost"
    return f'''
<div class="frame ch1" id="{fid}">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="card"><div class="top"></div>
    <div class="ey">{ey}</div>
    <div class="pair">
      <div class="half A">
        <div class="role ga" data-k="la"><span class="ai" data-k="pa">AI </span><span class="w">Growth</span><br>Engineer</div>
        <div class="hr"></div>
        <div class="rw" data-k="ba">pushes the product out: onboard, retain, grow the business</div>
        <div class="rw{ghost}" data-k="aa"><span class="tg">With AI</span>paid to move that number with AI: personalized pages, onboarding, retention, experiments</div>
      </div>
      <div class="vsep"></div>
      <div class="half B">
        <div class="role pb" data-k="lb"><span class="ai" data-k="pb">AI </span><span class="w">Product</span><br>Engineer</div>
        <div class="hr"></div>
        <div class="rw" data-k="bb">builds the product&#8217;s features for the customer, not the marketing</div>
        <div class="rw{ghost}" data-k="ab"><span class="tg">With AI</span>paid for the feature&#8217;s quality: evals, grounding, latency, cost</div>
      </div>
    </div>
  </div>
</div>
'''


BODY = c2("C2-s1", "The two base roles", False) + c2("C2-s1b", "The two base roles", False) + \
    c2("C2-s2", "Now put AI in front", True) + '''
<div class="frame title ch2" id="title-card-CH2">
  <div class="orb o1" style="opacity:.24"></div><div class="orb o2"></div>
  <div class="ey">Chapter <span class="mono">02</span></div>
  <h1>The <span class="a">scoreboard</span></h1>
  <div class="divider"></div>
</div>

<div class="frame ch2" id="scoreboard-growth">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="card"><div class="top"></div>
    <div class="ey">Difference <span class="mono">1</span> / The scoreboard</div>
    <div class="role ga sm one lit"><span class="w">Growth</span><br> Engineer</div>
    <h1 style="margin-top:18px">A <span class="a">business number</span></h1>
    <div class="divider"></div>
    <div class="chips">
      <div class="chip" data-k="c1">Signups</div>
      <div class="chip" data-k="c2">Conversion</div>
      <div class="chip" data-k="c3">Retention</div>
      <div class="chip" data-k="c4">Revenue</div>
    </div>
  </div>
</div>

<div class="frame ch3" id="ship-to-learn">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="card"><div class="top"></div>
    <div class="ey">Difference <span class="mono">2</span> / The clock</div>
    <div class="role ga sm one lit"><span class="w">Growth</span><br> Engineer</div>
    <div class="divider"></div>
    <div class="rw" data-k="r1">many cheap experiments</div>
    <div class="rw" data-k="r2">a failed one still counts</div>
    <div class="take" data-k="t" style="margin-top:26px">Ship to <span class="k">learn.</span></div>
  </div>
</div>

<div class="frame title ch5" id="title-card-CH5">
  <div class="orb o1" style="opacity:.24"></div><div class="orb o2"></div>
  <div class="ey">Chapter <span class="mono">05</span></div>
  <h1>Which <span class="a">one?</span></h1>
  <div class="divider"></div>
</div>

<div class="frame ch5" id="become-compare">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="card"><div class="top"></div>
    <div class="ey">Which one should you become</div>
    <div class="pair" style="margin-top:10px">
      <div class="half A">
        <div class="rw" data-k="l1">the business number moving lights you up</div>
        <div class="rw" data-k="l2">you&#8217;re fine throwing away a week&#8217;s work when the test lost</div>
        <div class="push"></div>
        <div class="hr"></div>
        <div class="role ga sm" data-k="la"><span class="w">Growth</span><br>Engineer</div>
      </div>
      <div class="vsep"></div>
      <div class="half B">
        <div class="rw" data-k="r1">a pass rate climbing lights you up</div>
        <div class="push"></div>
        <div class="hr"></div>
        <div class="role pb sm" data-k="lb"><span class="w">Product</span><br>Engineer</div>
      </div>
    </div>
  </div>
</div>

<div class="frame ch6" id="C2-s4">
  <div class="orb o1"></div><div class="orb o2"></div>
  <div class="card"><div class="top"></div>
    <div class="ey">Three differences</div>
    <div class="labels2">
      <div class="role ga sm lit"><span class="w">Growth</span><br>Engineer</div>
      <div class="role pb sm lit"><span class="w">Product</span><br>Engineer</div>
    </div>
    <div class="divider"></div>
    <div class="chips">
      <div class="chip" data-k="c1"><span class="mono">01</span>The scoreboard</div>
      <div class="chip" data-k="c2"><span class="mono">02</span>The clock</div>
      <div class="chip" data-k="c3"><span class="mono">03</span>The bias</div>
    </div>
    <div class="take" data-k="t" style="margin-top:44px">Same tools, <span class="k">different scoreboard.</span></div>
  </div>
</div>
'''

if __name__ == "__main__":
    css = open(CSS, encoding="utf-8").read()
    out = os.path.join(HERE, "containers.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(HEAD + css + "\n/* ============ below this line: project ADDITIONS only (locked tokens untouched) ============ */"
                + EXTRA + "</style></head><body>\n" + BODY + "\n</body></html>\n")
    print("wrote", out)
