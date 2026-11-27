"""Write _previews/comp-build-report.json for the plan-to-make-millions comp build."""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
PREV = HERE.parent
wired = json.loads((HERE / "wired.json").read_text(encoding="utf-8"))
DRAFT = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\plan-to-make-millions\_previews\plan-to-make-millions-draft-v1.mp4"
LOG = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\longform-edited\media\plan-to-make-millions\_previews\plan-to-make-millions-draft-render.log"
rep = {
    "project": "plan-to-make-millions",
    "comp_id": "PlanToMakeMillions",
    "comp_file": "video-creation/remotion/src/PlanToMakeMillions.tsx",
    "extra_files": [
        "video-creation/remotion/src/PlanToMakeMillionsCharts.tsx (the 11 live charts: engine + choreography from each spec.md)",
        "video-creation/remotion/src/PlanToMakeMillionsChartData.ts (GENERATED template + per-state slots from the approved chart HTML)",
        "video-creation/longform-edited/media/plan-to-make-millions/assets/charts/_export_comp.py (the exporter that writes ChartData.ts)",
        "video-creation/remotion/src/Root.tsx (registered PlanToMakeMillions, 1920x1080, fps 30, DUR)",
        "assets/transitions/ (the 13 library ids' plates, tiles, leaks, maps and sfx, 30 MB) + assets/transitions/cutframes/BR-1-distressed-trader-cut.jpg (the CUTFRAME for lib:badsignal-max-3)",
    ],
    "card_t": [79.2, 265.6, 471.33],
    "pause_s": 1.5,
    "inserts": [{"at": 9.815, "dur": 2.6, "clip": "CLIP-1"}, {"at": 9.815, "dur": 3.2, "clip": "CLIP-4"},
                {"at": 9.815, "dur": 3.5, "clip": "CLIP-3"}, {"at": 9.815, "dur": 3.6, "clip": "CLIP-8"},
                {"at": 79.2, "dur": 1.5}, {"at": 265.6, "dur": 1.5}, {"at": 471.33, "dur": 1.5}],
    "spine_secs": 590.235,
    "dur_frames": 18229,
    "covers": 150,
    "transitions_wired": wired,
    "captions_groups": 24,
    "gates": {
        "COMP-IMPORTS-LINT": "PASS files=4 fails=0",
        "COVERS-LINT": "PASS covers=150 fails=0 warns=62 (warns = 5 FACE-window gaps, 54 STATE SWAPs suppressed by one block per ref, CONTAINER SCATTER on C1 (the 7-return centerpiece) and C14/C16 (HOOK + WALK runs), all by blueprint)",
        "DECK-CONTAINERS": "lint-deck-containers: OK, 1 deck refs, all single containers (C26 s4 = the declared CH1 OVERVIEW)",
        "SLIDE-BALANCE-LINT": "PASS fails=0 warns=0",
        "ANIMATED-CHARTS-LINT": "PASS charts=11 missing=0",
        "TRANSITION-ASSETS-LINT": "PASS ids=13 fails=0 warns=0",
        "SPINE-FPS": "PASS fps=30.000 frames=18230 (DUR = 18229 = the paused spine's video frame count; the extra 0.14 frame is the audio stream's tail)",
        "FACE-REFRAME-LINT": "PASS scale=1.266 x=-408.0 y=-229.0 measured_scale=1.266 measured_x=-408 measured_y=-229",
        "BROLL-MOTION": "FAIL clips=19 fails=1 (BR-10-control-room 11/36 frozen. Root cause proven: the 200k draft encoder flattening a very low-motion clip, NOT stale cache frames. The same slot rendered fresh in isolation reads 26/36 at 200k and 0/36 at crf 18 (mean frame diff 0.269 vs the source's ~0.26); no frame in the full render is an exact repeat)",
    },
    "chunks_qa": [
        {"frames": "250-760", "what": "R-HL4 hard cut into the 4-clip montage (CLIP-1/4/3/8 at 294/372/468/573), CLIP-8 lead-out still, F2 film-burn cut-in, captions, audio vs spine",
         "verdict": "ok (cuts frame-exact; audio corr 1.0000, 0 ms lag, same level as the spine)"},
        {"frames": "2700-2880", "what": "CH2 cube card (BR-3 frozen last frame turns away) + resume into C1",
         "verdict": "fixed: the first resume frame was BLACK (C1's cross-fade had nothing under it); the card now stays under the next cover's xf / fade / warp entry; re-verified losslessly at 2808 and 2811"},
        {"frames": "6440-6520", "what": "lib:melt-rgb-soft-2, C-SPACEX -> C1 FINAL", "verdict": "ok"},
        {"frames": "14560-14700", "what": "F6 punch + lib:lightleaks-soft-short-1 on the join, F6 burn-out, bare CH5 page, cube card, hand:cross-warp into IMG-7",
         "verdict": "ok; section 6a face-side check: frame before vs inside the leak window differ by 0.73 (baseline 0.28-0.35), same face, same scale; the title text lingering over IMG-7 is 200k encoder smear only (the lossless still is clean)"},
        {"frames": "850-1000", "what": "C3 live count-down (counter + date read at the head) + F2 film-burn out", "verdict": "ok"},
        {"frames": "18100-18228", "what": "E1 -> BR-19 fade -> F8 burn cut-in -> punch + lib:lightleaks-soft-short-4 -> hard out on 'later.'", "verdict": "ok"},
        {"frames": "about 150 lossless stills", "what": "every chart state, every receipt highlight and framing, every card and diagram state, both melts, the spin, the badsignal ingresses, WB1, faces F1-F8, captions",
         "verdict": "fixed: C7 / C9 / C10 / R-BLOCK / C18 highlight boxes re-measured from pixel word spans; R-ALJ, R-NVDA-NEWS, C12, C8 framing; the C15 / C13 push kept off a casino ad in CoinGecko's sidebar; the C20b tally chips moved off the table header; the D-TELL entry ghosts all four rows"},
        {"frames": "7737-7856", "what": "BR-10 slot isolated at draft and crf 18 (the BROLL-MOTION root cause)", "verdict": "draft bitrate, not cache (26/36 frozen at 200k vs 0/36 at crf 18)"},
    ],
    "draft": {"file": DRAFT, "duration_s": 607.633, "fps": 30, "audio": True, "log": LOG},
    "needs_review": [
        "BROLL-MOTION gate FAILS on this draft (BR-10 control room, around 4:18 delivered). Proven to be the 200k draft bitrate; the FINAL (crf 18) is expected to pass, and verify_final re-runs the gate on it",
        "Light leaks at the F6 / F7 / F8 punch joins peak near-white for about 2 frames (the library Soft Short look)",
        "MOTION moves on C8 (lib:motion-3d-pan-1-right) and C12 (lib:motion-3d-orbit-2-right-down) are strong 3D perspective + edge blur; C12's paragraph includes the source's own underlined 'the scandal at Nvidia' link (never highlighted, as planned)",
        "The 200k draft shows encoder ghosting after hard cuts (e.g. the CH5 title lingers about 1 s over IMG-7); lossless frames are clean",
        "CLIP-8's first 0.7 s shows the previous story's Fox lower-third, as broadcast (PROJECT-LOG 2026-11-24 flag)",
        "Film burn is on all 14 face edges (advisory repeat from the last two videos)",
    ],
    "deviations": [
        "No s0 PNG exists for C22, C22B or D-IMAGINE: each enters on its first state (C22 s1 from 444.58 instead of 445.28; C22B's loop is already drawn at 505.9 instead of drawing on at 508.22; D-IMAGINE's 20-dollar chip is already placed at 531.75 instead of dropping at 533.52)",
        "The 'held back in the comp' first items (C26 tile 1, D-TELL rows 1-4, E1 line 1, D-ENTRIES line 1) are the s1 still with those items ghosted in code at the stylesheet's .ghost opacity (.38) over boxes measured in containers.html, not a separately shot frame",
        "C23 bars grow with a scaleY from the zero line; its red dips and the median / dip lines, the C14 13X bracket (bottom to top) and the C2 dashed 20% line (left to right) reveal by clip-path. The stills carry these as opacity states, so the comp supplies the motion",
        "hand:film-burn, hand:cross-warp and hand:paper-sheet are hand-rolled overlays (no library engine); the whiteboard's paper-out is the 0.3 s hand:fade into BR-14 that the plan places there",
        "The spine picture is mounted only under the 8 FACE windows (every FACE window airs its pre-framed city-look swap clip on top, and COVER beats are black); the VO is the paused spine's own audio",
        "The montage's picture starts on frame 294 while its audio starts at 294.45 (the baker's sample-exact splice): 15 ms",
        "lib:badsignal-short-1 is centred on the CH3 resume frame (its window straddles it), per the plan's build note",
    ],
}
(PREV / "comp-build-report.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
print("saved", PREV / "comp-build-report.json")
