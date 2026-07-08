"""Generate dataTigr.ts (3 ShortData for the this-is-gonna-rip batch) for LivestreamShort.
Captions are HAND-AUTHORED (Whisper mangled the brand words: Caspar->Kaspa, 'pretenser tower'
->Bittensor TAO, 'was ripped'->tau is ripping), timed off the clip Whisper word starts.
Clip 2 (self-fulfilling-bear) gets EXTRA full-screen b-roll to cover the out-of-focus webcam,
with a few deliberate base-video face windows. capY 560 matches recent same-framing batches."""
import subprocess, json, os

OUT = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\remotion\src\dataTigr.ts"
ASSETS = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\assets"
MAP = json.load(open(r"C:\Users\mnede\Documents\Claude\social-media\repurpose\_rip_broll_map.json"))

def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

# ---- CAPTIONS (t, html) hand-authored with brand fixes + colour tags ----
CAP1 = [
 (0.0,"so elon musk"),(1.0,"last year said"),(1.7,"<o>bitcoin</o> is based"),(2.6,"on <y>energy</y>"),
 (3.4,"it is impossible"),(4.0,"to fake <y>energy</y>"),(4.8,"today he said"),(5.7,"i don't think"),
 (5.9,"dollars will be"),(6.8,"used as currency"),(7.9,"it's mass"),(8.3,"and <y>energy</y>"),
 (9.2,"just interesting, right?"),(10.2,"very interesting"),(10.9,"is <o>bitcoin</o> the"),(11.5,"closest thing we"),
 (12.2,"ever had to"),(12.8,"<y>energy backed</y> money"),(14.3,"i mean, it is"),(15.3,"but it's not"),
 (15.6,"as efficient as"),(16.3,"<g>kaspa</g>, right?"),(17.0,"that's the first"),(17.4,"thing comes to mind"),
 (18.5,"it's not as"),(19.6,"efficient as <g>kaspa</g>"),(21.1,"why don't we"),(21.6,"adopt a phrase"),
 (22.9,"he says"),(23.3,"<o>bitcoin</o> proved it"),(24.5,"<g>kaspa</g> improved it"),(25.8,"i just love that"),
 (27.6,"<o>bitcoin</o> proved it"),(29.0,"<g>kaspa</g> improved it"),(30.1,"perfect"),
]
CAP2 = [
 (0.0,"<o>bitcoin</o> whales"),(0.9,"stopped <r>selling</r>"),(2.5,"resumed accumulation"),(3.4,"remember this problem"),
 (4.5,"we had going"),(5.7,"back like <y>december</y>"),(6.6,"<y>january, february</y>"),(7.5,"<y>march</y>?"),
 (8.1,"everybody, long-term"),(9.3,"holders"),(10.2,"were just <r>selling</r>"),(11.4,"into the <r>dips</r>"),
 (13.0,"which typically"),(13.8,"every year in crypto"),(15.1,"every <r>bear</r> market"),(15.9,"every <gr>bull</gr> market"),
 (17.4,"long-term holders"),(18.3,"always <r>selling</r>"),(19.1,"at the <gr>pumps</gr>"),(19.9,"accumulating at"),
 (21.0,"the <r>dumps</r>"),(21.7,"in this case"),(22.5,"the market was"),(23.6,"<r>dumping</r>"),
 (24.1,"they were <r>selling</r>"),(25.2,"it was like"),(25.7,"they were causing"),(27.0,"the <r>dumps</r>"),
 (27.3,"causing the"),(28.0,"<r>bear</r> market"),(28.5,"you know what"),(28.8,"i'm gonna say?"),
 (29.3,"four-year cycle"),(30.2,"in this particular"),(31.1,"instance"),(31.8,"the <r>bear</r> market"),
 (32.4,"is a"),(33.1,"self-fulfilling"),(33.7,"prophecy"),(34.2,"because everybody"),
 (34.7,"believed there's"),(35.4,"gonna be a"),(35.8,"<r>bear</r> market"),(36.3,"so they <r>dumped</r>"),
 (37.1,"and they caused"),(37.5,"a <r>bear</r> market"),(38.1,"and previous"),(39.1,"<r>bear</r> markets"),
 (39.9,"weren't like that"),(41.1,"<r>bear</r> market happened"),(42.1,"for other reasons"),(43.2,"business cycle"),
 (44.1,"went into contraction"),(45.3,"like last"),(45.7,"<r>bear</r> market"),(46.5,"there was super"),
 (47.0,"high <r>inflation</r>"),(48.5,"it was tightening"),(50.4,"at this time"),(51.2,"there was nothing"),
 (51.6,"like that"),(52.2,"interest rates are"),(52.9,"coming <gr>down</gr>"),(53.9,"<gr>qe</gr> was starting"),
 (55.4,"then employment"),(55.8,"starts going <gr>up</gr>"),(56.9,"and getting better"),(58.2,"and at the"),
 (59.6,"same time"),(60.1,"everybody's like"),(60.7,"there's gonna be"),(61.3,"a <r>bear</r> market"),
 (62.1,"let me <r>dump</r> now"),(62.8,"so i can"),(63.4,"get out before"),(63.9,"it goes <r>down</r>"),
 (64.4,"even lower"),(65.2,"and it just"),(65.6,"went <r>down</r> even lower"),(66.5,"there was no"),
 (66.8,"reason for the"),(67.5,"<r>bear</r> market"),(68.1,"but the good news"),(69.4,"is, now this"),
 (70.4,"has reversed"),(71.3,"and rightfully so"),(72.4,"the whales have"),(73.0,"started to"),
 (73.5,"<gr>accumulate</gr>"),(73.8,"all over again"),(74.6,"so that's good"),(75.4,"that's <gr>bullish</gr>"),
 (76.2,"that's <gr>bullish</gr> news"),
]
CAP3 = [
 (0.0,"<g>tao</g> is ripping"),(0.6,"last weekend"),(1.2,"it's going to"),(1.7,"be a powerhouse"),
 (3.3,"people are looking"),(4.0,"for decentralized"),(4.8,"<g>ai</g>"),(6.1,"because of this"),
 (7.0,"situation with the"),(7.8,"government <r>ban</r>"),(8.9,"of that mythos"),(9.7,"model called <y>fable</y>"),
 (10.8,"with anthropic"),(11.8,"on friday"),(12.7,"so <g>bittensor</g>"),(13.6,"<g>tao</g> is probably"),
 (14.3,"going to be a"),(15.0,"powerhouse"),(15.8,"during this <gr>bull</gr> run"),
]

def M(slug): return MAP[slug]  # broll filename

# ---- b-roll beats (slug, tIn, tOut) all mode full ----
BR1 = [("tigr-energy",2.5,9.0),("tigr-efficient",15.5,20.6),("tigr-podium",23.0,30.6)]
BR2 = [("tigr-whales-stop",2.0,11.0),("tigr-sell-pumps",14.0,21.5),("tigr-cause-dump",21.5,28.5),
       ("tigr-prophecy",31.5,38.0),("tigr-old-bear",38.0,45.0),("tigr-macro-good",48.0,58.0),
       ("tigr-panic-dump",58.0,67.5),("tigr-reversed-bull",70.0,77.07)]
BR3 = [("tigr-tao-switchoff",1.5,8.0),("tigr-tao-network",9.5,17.11)]

CLIPS = [
 {"const":"D_TIGR_1","asset":"tigr-kaspa.mp4","caps":CAP1,"broll":BR1,
  "thumb":{"title":"BITCOIN PROVED IT\\nKASPA IMPROVED IT","chip":"ENERGY MONEY","chipColor":"#00e5ff","titleSize":92},
  "sounds":[(2.5,"WHOOSH"),(23.0,"WHOOSH"),(27.6,"BOOM")]},
 {"const":"D_TIGR_2","asset":"tigr-bear.mp4","caps":CAP2,"broll":BR2,
  "thumb":{"title":"THE BEAR WAS A\\nSELF-FULFILLING\\nPROPHECY","chip":"WHO CAUSED IT","chipColor":"#ff5252","titleSize":82},
  "sounds":[(2.0,"WHOOSH"),(31.5,"WHOOSH"),(58.0,"WHOOSH"),(70.0,"BOOM")]},
 {"const":"D_TIGR_3","asset":"tigr-tao.mp4","caps":CAP3,"broll":BR3,
  "thumb":{"title":"THE AI WITH NO\\nOFF SWITCH","chip":"$TAO","chipColor":"#00e5ff","titleSize":104},
  "sounds":[(1.5,"WHOOSH"),(9.5,"WHOOSH"),(9.5,"BOOM")]},
]

def caps_ts(caps):
    out = []
    for t, h in caps:
        h = h.replace('"','\\"')
        out.append(f'    {{ t: {t:6.2f}, h: "{h}" }},')
    return "\n".join(out)

def broll_ts(broll):
    return "[\n" + "\n".join(f'    {{ src: A("{M(s)}"), tIn: {a}, tOut: {b}, mode: "full" }},' for s,a,b in broll) + "\n  ]"

def thumb_ts(th):
    return (f'{{ title: "{th["title"]}", chip: "{th["chip"]}", chipColor: "{th["chipColor"]}", titleSize: {th["titleSize"]} }}')

def sounds_ts(ss):
    return "[" + ", ".join(f'{{ t: {t}, src: {s} }}' for t,s in ss) + "]"

frames = {}
blocks = []
for i, c in enumerate(CLIPS, 1):
    # Keep the frame-0 thumbnail cover clean: no caption may render under it (SKILL rule #3).
    # Bump a t=0 first caption past the 1-frame thumb so frame 0 is cover-only.
    if c["caps"] and c["caps"][0][0] < 0.06:
        c["caps"][0] = (0.06, c["caps"][0][1])
    d = dur(os.path.join(ASSETS, c["asset"]))
    frames[f"c{i}"] = round(d*30)
    blocks.append(
        f"export const {c['const']}: ShortData = {{\n"
        f'  clip: A("{c["asset"]}"), fps: FPS, durationS: {d:.2f}, capY: 560,\n'
        f"  thumb: {thumb_ts(c['thumb'])},\n"
        f"  captions: [\n{caps_ts(c['caps'])}\n  ],\n"
        f"  broll: {broll_ts(c['broll'])},\n"
        f"  sounds: {sounds_ts(c['sounds'])},\n"
        f"}};\n"
    )

header = (
    "import { staticFile } from 'remotion';\n"
    "import type { ShortData } from './LivestreamShort';\n\n"
    "const FPS = 30;\n"
    "const A = (f: string) => staticFile(f);\n"
    "const WHOOSH = A('sfx/Cinematic Whoosh 02.wav');\n"
    "const BOOM = A('sfx/Boom - Big Reveal.wav');\n\n"
)
frames_ts = "export const FRAMES_TIGR = { " + ", ".join(f"{k}: {v}" for k,v in frames.items()) + " };\n"
open(OUT,"w",encoding="utf-8").write(header + "\n".join(blocks) + "\n" + frames_ts)
print("Wrote", OUT)
print("FRAMES_TIGR:", frames)
