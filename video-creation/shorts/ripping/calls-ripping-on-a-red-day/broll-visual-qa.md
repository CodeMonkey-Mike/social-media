# ripping clip 2 `calls-ripping-on-a-red-day`: b-roll visual QA, round 1 (2026-11-18T22:46:59)

Warning: this sign-in ends between 2026-11-25 and 2026-11-28 (in 6 days at the earliest). Renewing it does not move those dates. Run claude auth login before then, or use claude setup-token for unattended jobs.
Notes, which don't fail anything: (1) `broll-rip2-codemonkey.png` and `broll-rip2-community.png` came back 1086x1448 (3:4), but their prompts asked for 9:16. Full-screen b-roll is fit to cover the 1080x1920 frame, so I cropped both to that frame to check: both still read cleanly. In codemonkey the left fist is part-cut at the frame edge and the raised fist touches the right edge, which is normal for full-bleed art. (2) All 8 files have different hashes. The three Velvet images are clearly different scenes (staircase, overlay on black, streaming studio). (3) The Velvet mark matches the reference on all three Velvet images: a lavender V over a violet upside-down V, with no wordmark. (4) Bitcoin and Ethereum logos appear only in the hook image, which asked for them, and no other image has a stray logo. (5) There is no stray text, numbers, chart figures or real faces in any image, and the crowd in community is faceless from behind. (6) The overlay background is pure black (pixel values 0-3). (7) The top 36% of the thumbnail is empty for the title.

PASS: broll-rip2-thumb.png
PASS: broll-rip2-hook-dump.png
PASS: broll-rip2-ripping-again.png
PASS: broll-rip2-velvet-pump.png
PASS: broll-rip2-ovl-surge.png
PASS: broll-rip2-velvet-live.png
PASS: broll-rip2-codemonkey.png
PASS: broll-rip2-community.png
VERDICT: PASS
