"""DEPRECATED — moved to the canonical desilencer skill.

Used single-threshold `silencedetect` (BANNED for cut edges). Use the ONE canonical tool (works on
audio-only inputs too):

    video-creation/skills/desilencer/scripts/desilence.py     (read video-creation/skills/desilencer/desilencer.md)

    python desilencer/scripts/desilence.py SRC --out OUT --min-sil 0.5
"""
import sys
sys.exit(__doc__)
