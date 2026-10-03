#!/usr/bin/env bash
# Regenerate the 3 Golden Kitty tweet images anchored on Mike's reference (2026-09-25).
cd "/c/Users/mnede/Documents/Claude/social-media"
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner lane3-fix-swole
python -X utf8 -u repurpose/gen_images.py --list "repurpose/output/golden-kitty-dominance-lane3-fix/item-048d1fd0-swole.json" --prefix x-tweets --batch golden-kitty-dominance
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner lane3-fix-swole
echo "===== GEN-ALL-DONE $(date +%H:%M:%S) ====="
