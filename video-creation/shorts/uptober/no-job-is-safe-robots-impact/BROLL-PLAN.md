# BROLL-PLAN: uptober / clip 7 `no-job-is-safe-robots-impact` (IMPACT, 20.08 s)

Title: "Your Robot Is Your Security Guard"
Spine: `render-assets/no-job-is-safe-robots-impact.mp4` (1080x1920 @25, GOP-staged, has_b_frames 0,
video 20.080 s, audio 20.069 s). Comp renders at 30 fps, 602 frames = 20.067 s (last frame 601 = 20.033 s,
inside both tracks; last word "bastard." ends 20.02 s = a hard out on the laugh line).
Composition: `UptoberNoJobSafeImpact` (`remotion/src/UptoberNoJobSafeImpact.tsx`,
`constants-uptober-no-job-is-safe-robots-impact.ts`, `captionsUptoberNoJobSafeImpact.ts`).
Scoped build directives for clip 7: NONE (`clip_directives.py --batch uptober --clip 7` = 0 of 0), so
nothing inherited and NO coverage exemption.

Same-topic siblings: batch clip 3 `no-job-is-safe-robots` (same source, first ~14 s identical) and the older rfp
robot shorts (rfp3 / rfp7). NOTHING is reused, and clip 3's concepts (hat tower, dollhouse trades, collar-lift
bodyguard, beach hammock, padlocked coin, doorway silhouette) are all avoided. Clip 7 has its own robot design
(matte gunmetal + white, glowing RED visor; clip 3's is white-and-chrome with orange eyes) and its own accent
(alarm red, vs clip 3's safety orange). Every asset is `nj7`-prefixed and generated fresh.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient step at 853/854 on 5 of 5 frames, t = 2..18 s).
- Content zone (rows 0..850): ONE static X post the whole clip (mean abs diff t=2 vs t=18 = 1.5/255): "Elon says
  it's about to make them RICH. Dream or disaster? One word." with a PAUSED video thumbnail (Trump + Elon, real
  faces, burned-in screen-share = ships as filmed) and the X right rail. On-topic context, shown in real stretches.
- Webcam: Mike's head enters ~row 1400; capY 960 sits on the blue wall, clear of seam and face.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.14 (hook) + 2.14 (content) + 1.50 (punchline, to the hard out) = **6.78 s of 20.07 s = 33.8 %**
  (band 25-35 %). Base 66.2 %.
- **3 b-roll images**, each used exactly once. Full-screens: **2** (hook, punchline). Gap between them
  4.06 -> 18.58 (14.5 s, never a sub-1.5 s base flash).
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and code-drawn badges on BASE beats, so the
  visual still changes every 1-3 s while the content zone shows.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 44 entries, 2026-10-01)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| (none spoken: "crypto" only) | n/a | n/a | n/a |
No named project or coin in the clip and no coin is branded in any prompt (the punchline's flying coins are
specced generic). Nothing to flag.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | giant gunmetal robot guard on a night lawn, arms crossed, flashlight beam catching a tiny ski-masked burglar frozen mid-tiptoe; CODE title "NOBODY'S\nSAFE" + chip "YOUR ROBOT IS THE GUARD" | `thumb-nj7-cover.png` | none |
| 1 | 0.03-0.92 | "Nobody's safe." | base | face + X post (Phase 7 rule 5) | none | |
| 2 | 0.92-4.06 | "No job is safe. Like a robot could really do anything." | **FULL (hook)** | eight-armed robot, every hand holding a different job's tool | `broll-nj7-hook-many-arms.png` | none |
| 3 | 4.06-10.46 | "You have a robot in your house. You don't need a plumber... electrician... roofer... gardener" | base | X post. Badge "1 ROBOT / AT HOME", then rapid stamp badges PLUMBER / ELECTRICIAN / ROOFER / GARDENER, each "NOT NEEDED" (one per spoken trade) | none (badges) | |
| 4 | 10.46-12.60 | "security guard. They could be your security guard" | content | robot in a lit guard booth at the end of the driveway, gate barrier down, watching CCTV monitors | `broll-nj7-guard-booth.png` | none |
| 5 | 12.60-14.70 | "so if somebody wants to come to your house" | base | deliberate base gap: the X post | none | |
| 6 | 14.70-17.36 | "and try to like torture you to get all your crypto" | base + overlay | alpha overlay: glowing red alarm siren over the paused video thumbnail | `ovl-nj7-siren.png` (overlay) | |
| 7 | 17.46-18.48 | "I mean you have a, you have a" | base | badge "ROBOT / BODYGUARD" | none (badge) | |
| 8 | 18.58-20.07 (tOut past the comp end) | "robot that can kill the bastard." | **FULL (punchline, hard out)** | robot's red targeting lasers lock on a ski-masked burglar diving out a window, loot flying | `broll-nj7-punch-laser.png` | none |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook full-screen (0.92), ding on the ROBOT badge, low tight kick
"stamps" on the four NOT NEEDED badges, whoosh into the guard-booth cutaway (10.46), MGS alert on the siren
overlay (lands in the held "aaand", off the words), payoff boom on the punchline full-screen (18.58). Final list
+ whisper-sweep notes live in the constants file.

## Captions
Canonical `build_captions.py --style montserrat` from `whisper-words-verified.json` (see the captions file
header for the patch list and the gap scan).

## Manifest (zero orphans)
`thumb-nj7-cover.png`, `broll-nj7-hook-many-arms.png`, `broll-nj7-guard-booth.png`, `broll-nj7-punch-laser.png`,
`ovl-nj7-siren.png` (+ its raw source `ovl-nj7-siren-raw.png`, kept OUT of render-assets in this clip folder).
Prompt list: `broll-list.json`.
