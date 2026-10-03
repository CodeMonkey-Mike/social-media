#!/usr/bin/env bash
cd "/c/Users/mnede/Documents/Claude/social-media"
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner lane3-fix-kaspa
for id in 7e20eeb6 aa13fcdf; do
  echo "===== GEN $id $(date +%H:%M:%S) ====="
  python -X utf8 -u repurpose/gen_images.py --list "repurpose/output/kaspa-lane3-fix/item-$id.json" --prefix yt-posts --batch kaspa 2>&1 | grep -vE "REJECT: captured"
done
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner lane3-fix-kaspa
echo "===== GEN-ALL-DONE $(date +%H:%M:%S) ====="
