# BROLL-PLAN: uptober / clip 3 `no-job-is-safe-robots` (FULL, 33.57 s)

Title: "No Job Is Safe Once You Have a Robot in Your House"
Spine: `render-assets/no-job-is-safe-robots.mp4` (1080x1920 @25, GOP-staged, has_b_frames 0,
video 33.560 s, audio 33.583 s). Comp renders at 30 fps, 1007 frames = 33.567 s (last frame 1006 = 33.533 s,
inside both tracks; last word "set" ends 33.56 s = a hard out).
Composition: `UptoberNoJobSafe` (`remotion/src/UptoberNoJobSafe.tsx`,
`constants-uptober-no-job-is-safe-robots.ts`, `captionsUptoberNoJobSafe.ts`).
Scoped build directives for clip 3: NONE (`clip_directives.py --batch uptober --clip 3` = 0 of 0), so
nothing inherited and NO coverage exemption.

Same-topic siblings: batch clip 7 `no-job-is-safe-robots-impact` (same source, first ~20 s identical) and the
older rfp batch robot shorts (`rfp3`: robot army / robot trades / foothold flag / robot butlers; `rfp7`: robot
plaza / robot penthouse / coins glow). NOTHING is reused: every image here is `nj3`-prefixed and generated
fresh (hat tower, dollhouse cutaway, burglar-by-the-collar, beach hammock, padlocked coin, doorway cover).
**Clip 7's builder: do not repeat these concepts** (hat tower, dollhouse trades, collar-lift bodyguard,
hammock, padlock coin, doorway silhouette).

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient step at 853/854 on 5 of 5 frames, t = 3..31 s).
- Content zone (frame-diff rows 0..850 @10 fps): **NO cuts** for the whole clip. One static X post the whole
  time: "Elon says it's about to make them RICH. Dream or disaster? One word." with a PAUSED video thumbnail
  (Trump + Elon, real faces, burned-in screen-share = ships as filmed) and the X right rail. On-topic context
  (the robot/AI-jobs news Mike is reacting to), so it is shown in real stretches.
- Webcam: Mike's head enters ~row 1400; a capY of 960 sits on the blue wall, clear of seam and face.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.18 + 2.64 + 2.60 + 2.79 = **11.21 s of 33.57 s = 33.4 %** (band 25-35 %). Base 66.6 %.
- **4 b-roll images**, each used exactly once. Full-screens: **3** (hook, punchline, climax) = the firm cap.
  Gaps between full-screens: 4.12 -> 17.62 and 20.22 -> 30.78 (never a sub-1.5 s base flash).
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and code-drawn badges on BASE beats.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 44 entries, 2026-10-01)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| (none spoken: "crypto" only) | n/a | n/a | n/a |
| Bitcoin (visual shorthand for "anybody here in crypto", climax + overlay) | WELL-KNOWN | not needed (named in prompt) | `broll-nj3-climax-hammock.png`, `ovl-nj3-padlock.png` |
No lesser-known project is named; nothing to flag.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | white-and-chrome robot in an open front doorway at night, orange eyes, wrench + cable, light pouring down the porch; CODE title "NO JOB\nIS SAFE" + chip "ONCE A ROBOT MOVES IN" | `thumb-nj3-cover.png` | none |
| 1 | 0.03-0.94 | "Nobody's safe." | base | face + X post (Phase 7 rule 5) | none | |
| 2 | 0.94-4.12 | "No job is safe. Like a robot could really do anything." | **FULL (hook)** | robot balancing an absurd tower of work hats (hard hat, chef, plumber, firefighter, gardener, guard, pilot) | `broll-nj3-hook-hat-tower.png` | none |
| 3 | 4.12-7.32 | "You have a robot in your house. You don't need a plumber" | base | X post. Badges "ROBOT / IN YOUR HOUSE" then "PLUMBER / NOT NEEDED" | none (badges) | |
| 4 | 7.32-9.96 | "You don't need an electrician... a roofer... a gardener." | content | dollhouse cutaway: the same robot model doing pipes, fuse box, roof, hedge, door guard at once | `broll-nj3-house-trades.png` | none |
| 5 | 9.96-17.62 | "You don't need like anything. You don't need a security guard. So if somebody wants to come to your house and try to like torture you to get all your crypto" | base | X post. Badge "SECURITY / GUARD: NOT NEEDED"; alpha overlay: glowing golden padlock clamped on a gold Bitcoin over the paused video thumbnail on "torture you to get all your crypto" | `ovl-nj3-padlock.png` (overlay) | |
| 6 | 17.62-20.22 | "you have a robot that can kill the bastard." | **FULL (punchline)** | giant guardian robot holding a ski-masked cartoon burglar up by the collar, crowbar falling, alarm light | `broll-nj3-bodyguard.png` | none |
| 7 | 20.22-30.78 | "It's, I think we're in for like an unimaginable future, a really, really like an unimaginable future. It's hard to imagine how it's gonna be just five years from now and the good news is" | base | X post. Badges "UNIMAGINABLE / FUTURE", "5 YEARS / FROM NOW" | none (badges) | |
| 8 | 30.78-33.57 (tOut past the comp end) | "anybody here in crypto is probably gonna be all set." | **FULL (climax)** | beach hammock at sunset (person from behind, faceless), robots fanning / serving / building a gold-Bitcoin sandcastle | `broll-nj3-climax-hammock.png` | Bitcoin (well-known, named) |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook full-screen (0.94), dings on badges, whoosh into the
dollhouse cutaway (7.32), lock-click/ding on the padlock overlay, impact on the punchline full-screen (17.62),
payoff impact on the climax cut (30.78). Final list + whisper-sweep notes live in the constants file.

## Captions
Canonical `build_captions.py --style montserrat` from `whisper-words-verified.json` (see the captions file
header for the patch list and the gap scan).

## Manifest (zero orphans)
`thumb-nj3-cover.png`, `broll-nj3-hook-hat-tower.png`, `broll-nj3-house-trades.png`, `broll-nj3-bodyguard.png`,
`broll-nj3-climax-hammock.png`, `ovl-nj3-padlock.png` (+ its raw source `ovl-nj3-padlock-raw.png`, kept OUT of
render-assets in this clip folder). Prompt list: `broll-list.json`.
