#!/usr/bin/env bash
# check-spine-fps.sh <assets/spine.mp4> <comp_fps>
# Fails if the spine's frame rate != the comp's fps. A mismatch silently truncates the
# render's tail (comp-build.md §1). Run BEFORE writing DUR and BEFORE any render.
set -u
SP="$1"; FPS="$2"
R=$(ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 "$SP")
NUM=${R%/*}; DEN=${R#*/}; ACT=$(python -c "print($NUM/$DEN)")
OK=$(python -c "print(abs($ACT-$FPS)<0.001)")
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SP")
NEED=$(python -c "import math;print(math.ceil($DUR*$FPS))")
echo "spine fps=$R (=$ACT)  comp fps=$FPS  spine=${DUR}s"
if [ "$OK" = "True" ]; then echo "check-spine-fps: OK"; exit 0; fi
echo "check-spine-fps: FAIL - rates differ. DUR must be ceil(duration*fps) = $NEED frames, NOT the spine's frame count."; exit 1
