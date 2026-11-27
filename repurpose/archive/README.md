# repurpose/archive — provenance graveyard (swept 2026-08-11, again 2026-11-27)

Per-batch gen lists, prompt files and item maps from the pre-LangGraph era
(`_genlist-*`, `broll-*`/`items-*` lists, `_prompts-lab/`, `_mm-items/`).
Kept for provenance only — **nothing here is invoked by anything**.

The 50 one-off JavaScript scripts that used these lists (`_lane3_*`, `_fix-*`, dated
`regen-*`, the hard-coded batch generators) were deleted 2026-11-27 (Mike: delete them
if they are not needed). Nothing ran, loaded or pointed at any of them; git history
still has every one.

The living stack is the repurpose root: the Python pipeline (`gen_images.py`,
`gen_batch.py`, `chat_pool.py`, `chat_delete.py`, `queue_writer.py`,
`lane3_batch.py`, `reconcile_chats.py`, `generate_image.py`, `generate_asset.py`).
Neither the root nor this folder holds JavaScript since 2026-11-27: the tools still in
use were ported to Python and everything else was deleted. See `../SKILL.md`.

Do not add new files here except in a deliberate follow-up sweep.
