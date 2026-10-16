#!/bin/bash
cd /c/Users/mnede/Documents/Claude/social-media
Q=video-creation/shorts/downtober/long-term-plays-58x-350x/_qa
echo "WAIT-START $(date +%s)"
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner long-term-plays-58x-350x --timeout-min 110
rc=$?
echo "ACQUIRED rc=$rc $(date +%s)"
if [ $rc -ne 0 ]; then echo "LOCK-FAIL"; exit 3; fi
python repurpose/gen_batch.py --list $Q/gen-list.json --prefix broll --batch downtober --fresh
grc=$?
echo "GEN-RC=$grc $(date +%s)"
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner long-term-plays-58x-350x
echo "RELEASED $(date +%s)"
exit $grc
