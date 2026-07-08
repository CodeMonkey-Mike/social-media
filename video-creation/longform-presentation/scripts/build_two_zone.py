"""DEPRECATED — moved to the canonical desilencer skill.

This script used single-threshold `silencedetect`, which is BANNED for cut edges (it clips words /
misses clean pauses). All silence removal now goes through the ONE canonical tool:

    video-creation/skills/desilencer/scripts/desilence.py     (read video-creation/skills/desilencer/desilencer.md)

Equivalent call (two-zone):
    python desilencer/scripts/desilence.py SRC --out OUT --split 18 --sil-pre 0.25 --sil-post 0.5 [--map-out map.json]

Fumble/false-start removal is a SEPARATE prior step — use video-creation/skills/defumbler/defumbler.md,
not a desilence `--cut`.
"""
import sys
sys.exit(__doc__)
