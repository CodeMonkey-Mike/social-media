# repurpose/archive — provenance graveyard (swept 2026-08-11, again 2026-11-27)

Dead one-off scripts, per-batch gen lists, and run logs from the pre-LangGraph era
(`_genlist-*`, `_fix-*`, dated `regen-*`, `broll-*`/`items-*` lists, `*.log`).
Kept for provenance only — **nothing here is invoked by anything**.

The living stack is the repurpose root: the Python pipeline (`gen_images.py`,
`gen_batch.py`, `chat_pool.py`, `chat_delete.py`, `queue_writer.py`,
`lane3_batch.py`, `reconcile_chats.py`, `generate_image.py`, `generate_asset.py`).
The root holds no JavaScript since 2026-11-27: the tools still in use were ported to
Python, the JS the Python stack had replaced was deleted, and the seven one-time
scripts with their data written into them (`generate-broll-batch.js`,
`generate-favorites.js`, `generate-tweet-images-batch.js`,
`generate-yt-post-images-batch.js`, `save-last-chatgpt-image.js`,
`update-image-ids.js`, `update-yt-posts.js`) were moved here. See `../SKILL.md`.

Do not add new files here except in a deliberate follow-up sweep.
