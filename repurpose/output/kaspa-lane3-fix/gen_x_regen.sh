#!/usr/bin/env bash
cd "/c/Users/mnede/Documents/Claude/social-media"
python video-creation/shorts/_tooling/stage_lock.py acquire chatgpt --owner lane3-fix-kaspa --timeout-min 240
python -X utf8 -c "import json;items=json.load(open('repurpose/output/kaspa-lane3-fix/items-x-regen.json',encoding='utf-8'));[json.dump([i],open(f'repurpose/output/kaspa-lane3-fix/item-x-{i[\"image_id\"]}.json','w',encoding='utf-8'),ensure_ascii=False) for i in items]"
for id in 38c76505 55a96f8c 7450e8e2; do
  echo "===== GEN x-tweets $id $(date +%H:%M:%S) ====="
  python -X utf8 -u repurpose/gen_images.py --list "repurpose/output/kaspa-lane3-fix/item-x-$id.json" --prefix x-tweets --batch kaspa 2>&1 | grep -vE "REJECT: captured"
done
python video-creation/shorts/_tooling/stage_lock.py release chatgpt --owner lane3-fix-kaspa
echo "===== GEN-ALL-DONE $(date +%H:%M:%S) ====="
