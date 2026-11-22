# ripping clip 6 `pieverse-17x-at-a-billion-impact`: b-roll visual QA, round 2 (2026-11-19T01:41:55)

Warning: this sign-in ends between 2026-11-25 and 2026-11-28 (in 6 days at the earliest). Renewing it does not move those dates. Run claude auth login before then, or use claude setup-token for unattended jobs.
PASS: broll-rip6-thumb.png
PASS: broll-rip6-hook-billion.png
FAIL: broll-rip6-still-pumping.png | The arrow balloon's tip (the image's main bullish shape) starts 166 px from the top of the 1254 px square. The prompt asked for about 314 px (a quarter of the way down). Once the 1080x854 zone crops it and the 1.00 to 1.07 zoom finishes, the visible area starts at about 164 px, so the tip ends up against the top edge and its glow and sparkles are cut. The group is also too big: about 71 % of the width and 66 % of the height instead of 55 %. That is the same crop failure that broke two rip1 images. | Keep the prompt and make the size hard: "a WIDE-MEDIUM shot, the camera pulled back: the cat, pump, hose and balloon together take up only HALF the frame width and HALF the frame height; the balloon is SMALLER than the cat, its arrow tip a full third of the frame below the top edge, with empty purple sky above it".
PASS: broll-rip6-how-many.png
PASS: broll-rip6-climax-launch.png
VERDICT: FAIL
