# ripping clip 1 `pieverse-17x-at-a-billion`: b-roll visual QA, round 2 (2026-11-18T23:32:06)

Warning: this sign-in ends between 2026-11-25 and 2026-11-28 (in 6 days at the earliest). Renewing it does not move those dates. Run claude auth login before then, or use claude setup-token for unattended jobs.
I opened all 8 images and checked each against its prompt, its beat and the SKILL.md rules. I also zoomed in on every coin (no real logo on any of them), confirmed the 8 files are all different (md5), and checked that the rocket background is pure #000000. For the beats that sit in the top-half b-roll zone, I recreated how the short actually shows them: the zone is 1080x1020, the image fills it, and it slowly zooms from 1.0 to 1.07 over the beat. That check found the two failures below.

PASS: broll-rip1-cover.png
PASS: broll-rip1-hook-call.png
PASS: broll-rip1-17x-ride.png
FAIL: broll-rip1-bot-radar.png | the robot and radar fill almost the whole width instead of the central 50% the prompt asked for, so the radar's rim sits about 20 px from the right edge; once the zone crops it and the zoom finishes, the radar's right rim and its stand are cut off by the frame (the Pieverse cat on the radar is a little right of centre but stays whole) | make the radar smaller: no more than 40% of the image width across, its whole rim at least 15% of the width in from the right edge; the robot and radar together take up only the central 60% of the width, with empty soft purple-blue background on both sides
FAIL: broll-rip1-guacamole.png | the prompt said the cat and bowl must sit in the central 50% of the height, but the ears start about 410 px down, right where the zone's visible area begins, so the zone crops the tops of both ears (the right ear at the start of the beat, the left ear as the zoom finishes) and the bottom of the bowl is cut too | pull the camera back: the tops of the cat's ears at least 30% of the image height down from the top edge, the bowl's base no lower than 70% of the height, empty soft background above the head and below the table, the whole cat and bowl inside the central 50% of the height
PASS: broll-rip1-hesitate.png
PASS: broll-rip1-rocket-glow.png
PASS: broll-rip1-climax-summit.png
VERDICT: FAIL
