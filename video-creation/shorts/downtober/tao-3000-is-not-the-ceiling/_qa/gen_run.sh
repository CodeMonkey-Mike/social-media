#!/bin/bash
cd /c/Users/mnede/Documents/Claude/social-media
Q=video-creation/shorts/downtober/tao-3000-is-not-the-ceiling/_qa
echo "WAIT-START $(date +%s)"
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner tao-3000-is-not-the-ceiling --timeout-min 110
rc=$?
echo "ACQUIRED rc=$rc $(date +%s)"
if [ $rc -ne 0 ]; then echo "LOCK-FAIL"; exit 3; fi
python repurpose/gen_batch.py --list $Q/gen-list.json --prefix broll --batch downtober --fresh
grc=$?
echo "GEN-RC=$grc $(date +%s)"
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner tao-3000-is-not-the-ceiling
echo "RELEASED $(date +%s)"
exit $grc
