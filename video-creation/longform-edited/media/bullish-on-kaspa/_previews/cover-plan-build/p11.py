import json, re
P = "C:/Users/mnede/Documents/Claude/social-media/video-creation/longform-edited/media/bullish-on-kaspa"
for f in ["p0.py","p1.py","p2.py","p3.py","p4.py","p5.py","p6a.py","p6b.py","p7.py","p8.py","p9.py","p10a.py","p10b.py"]:
    exec(open(f, encoding="utf-8").read())
DUR = 528.367
FACES = [(0.0,3.367),(19.433,26.633),(31.433,35.7),(97.3,104.2),(233.233,237.9),(302.133,335.933),(447.9,455.667),(490.967,500.033),(511.033,528.367)]
B.sort(key=lambda b: (b["tIn"], b["tOut"]))
# graph-style coverage check
def in_face(t): return any(a-0.05 <= t <= z+0.05 for a,z in FACES)
cur = 0.0; problems = []
for b in B:
    if b["tIn"]-cur > 0.5 and not (in_face(cur) and in_face(b["tIn"])):
        if not any(a-0.05 <= cur and b["tIn"] <= z+0.05 for a,z in FACES):
            problems.append(f"gap {cur}-{b['tIn']}")
    if b["tIn"] < cur-0.05 and b["tOut"] > b["tIn"]: problems.append(f"overlap at {b['tIn']}")
    cur = max(cur, b["tOut"])
if DUR-cur > 0.5 and not any(a-0.05 <= cur and DUR <= z+0.6 for a,z in FACES): problems.append(f"tail {cur}")
for b in B:
    if b["cover_type"] in ("envato-video","chatgpt-image") and b["tOut"]-b["tIn"] > 4.0: problems.append(f"broll over 4s at {b['tIn']}")
    for a,z in FACES:
        if b["tOut"] > b["tIn"] and b["tIn"] < z-0.05 and b["tOut"] > a+0.05: problems.append(f"cover inside face {b['tIn']}")
print("PROBLEMS:", problems)
env = sum(1 for b in B if b["cover_type"]=="envato-video"); gpt = sum(1 for b in B if b["cover_type"]=="chatgpt-image")
assert env == len(E) and gpt == len(G), (env, len(E), gpt, len(G))
cov = sum(b["tOut"]-b["tIn"] for b in B); face = sum(z-a for a,z in FACES)
plan = {
 "spine": f"{P}/spine/ALL.d.desilenced.mp4", "transcript_json": f"{P}/spine/ALL.d.desilenced.medium-words.json",
 "face_windows": [list(f) for f in FACES], "face_mode": "gated",
 "budget": {"envato_video_max": 27, "chatgpt_image_max": 9, "envato_used": env, "chatgpt_used": gpt},
 "cover_beats": B, "receipts": R, "clip_inserts": CLIPS,
 "clip_inserts_note": "", "chapter_themes": THEMES, "envato_list": E, "chatgpt_list": G, "containers": CT, "whiteboards": [],
 "image_style": "clean 3D render, greenish-cyan rim light on deep charcoal; every Kaspa coin shows the backwards-K logo in greenish cyan (reference kaspa-logo.png), never gold; no text in the image",
 "budget_check": f"Envato {env}/27, ChatGPT {gpt}/9, every b-roll item 4.0 s or less and no file used twice; {len(R)} receipts and {len(CT)} code-rendered containers/charts are budget-exempt. Cover rows sum to {cov:.2f} s against {DUR-face:.2f} s of non-FACE spine (the rest is the sub-0.1 s picture seams at face edges, all under 0.5 s): zero orphans, nothing past {DUR} s, no cover row inside a FACE window. One clip insert (CLIP-1 at 302.18) and one card pause (the text wall at 455.74) are zero-length edit-time inserts.",
 "whiteboard_check": "0 beats: the screenplay names no WHITEBOARD WBn line and no target is set for this video.",
 "open_questions": [
  "TEXT WALL (CH6 hinge): the scripted 3.5 s silent kt-text-wall has no room on the spine (120 ms between 'standing.' 455.62 and 'Here's' 455.74). Proposed: an edit-time CARD PAUSE of 3.5 s at 455.74 (freeze + silence, the wall drawn by the comp, the 0_31-1 peak cut drops on EARLY.). If that trough is too short to bake, the alternates are the 640 ms breath after 'stand,' (456.86-457.50) or the wall OVER the words 455.74-459.18. Mike picks.",
  "STABLECOIN (CH4): Mike ruled on-screen wording never names Kaspa Dollar, and the 9.5 percent line was cut, so the real-pixel C11 receipt (kaspadollar.com bar + /docs, both carrying the name and the funded bar) is NOT placed; a three-state light card carries the beat (goal, close date, refunds, the September 2027 target). Confirm, or allow C11 with the name blurred.",
  "C22 SOLANA: the VO says 'July of 2021' for $1.51 (Mike: no fix). The TradingView hover on that point shows January 2021 in its tooltip; the capturer should hover without the date tooltip or crop it, so the graphic shows $1.51 with no month as ruled.",
  "C26 (cryptorich.vip/showcase, PerpsPad 114x) sits INSIDE FACE window 6 (323.86-328.94) as a paper side panel over the face hold or a full-frame flash on the words (Mike's ask). It is declared in receipts[] but is not a cover_beats row (FACE windows are not covered); the EDIT-PLAN places it. Confirm panel vs flash.",
  "'El Cinco de Mayo!' (63.60-65.54): IMG-3 (the Kaspa coin in a sombrero) + a comp confetti overlay + 1 to 2 s of Mexican music in the 0.5 s gap before 'The block reward' (65.04-65.54). The music has to ride under the next line's first words or the gap gets a short pause; which does Mike prefer?",
  "LIVE-DRIFT receipts (C9, C12, C13, C14, C25, C34, C35) and the animated charts C2 B to D, C3, C4, C17 are re-pulled at capture; the spoken figures ('around 3 cents', 'around $860 million', 'around 460', '355') drive the on-screen text per Mike, so a capture that has drifted far from the spoken figure is flagged, not silently updated.",
  "FACE 1 to 3 air as the superhero restyle swap clips (no approved F1 take yet); none of that touches this cover plan, but the BR-1 whip OUT at 3.367 and the BR-4 / BR-6 cuts around FACE 2 and 3 should be checked against the swapped clips' edges once they exist."
 ]
}
out = f"{P}/COVER-PLAN.json"
json.dump(plan, open(out, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
txt = open(out, encoding="utf-8").read()
assert "\u2014" not in txt, "em dash found"
print("wrote", out, len(txt), "chars; beats", len(B), "receipts", len(R), "env", env, "gpt", gpt, "containers", len(CT))
