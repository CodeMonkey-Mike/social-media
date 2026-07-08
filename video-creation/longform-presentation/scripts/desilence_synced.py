"""DEPRECATED — moved to the canonical desilencer skill.

Used single-threshold `silencedetect` (BANNED for cut edges). Use the ONE canonical tool — it keeps
A/V frame-locked (one filter_complex trim+atrim+concat) and exports a cut map for cue remapping:

    video-creation/skills/desilencer/scripts/desilence.py     (read video-creation/skills/desilencer/desilencer.md)

    python desilencer/scripts/desilence.py SRC --out OUT --split 18 --sil-pre 0.25 --sil-post 0.5 --map-out map.json

Whisper transcription for captions/QA is a separate step (see the track's caption stage), not part of
silence removal.
"""
import sys
sys.exit(__doc__)
