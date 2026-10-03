#!/usr/bin/env bash
# uptober Lane 3 fix (2026-10-01): regenerate the IG 4:5 Kaspa image (visual-QA FAIL: the
# cartoon mouth covered the mirrored K). Generated into this folder's staging base (gen_images.py
# skips existing files), then copied over the queue path by hand after QA.
cd "/c/Users/mnede/Documents/Claude/social-media"
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner uptober-lane3-fix --timeout-min 120 || { echo "LOCK FAILED"; exit 3; }
echo "===== GEN ig-single caf0ff83 $(date +%H:%M:%S) ====="
python -X utf8 -u repurpose/gen_images.py --list "repurpose/output/uptober-lane3-fix/item-ig-caf0ff83.json" --prefix ig-single --batch uptober --images-base "repurpose/output/uptober-lane3-fix/out" 2>&1 | grep -vE "REJECT: captured"
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner uptober-lane3-fix
echo "===== GEN-ALL-DONE $(date +%H:%M:%S) ====="
