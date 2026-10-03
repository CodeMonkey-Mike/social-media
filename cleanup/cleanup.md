---
name: cleanup
description: Move no-longer-needed assets to the Windows Recycle Bin across the social-media monorepo. Multi-target — schedule-tweets (posted images) and video-creation (renders, b-roll, source media, transcripts, finished shorts' Remotion comps). Never hard-deletes; always dry-run first.
---

## What this skill does

A single cleaner with per-target policies. Files are only ever moved to the **Recycle Bin**
(reversible), never hard-deleted. Lives at the repo root because it serves multiple folders.
One deliberate exception to reversibility: **ChatGPT image chats** (see the section below) are
hard-deleted in the ChatGPT UI — they're disposable by design (every image is downloaded at
generation time), and the sidebar clutter was the problem being solved.

```
node cleanup/cleanup.js --target <schedule-tweets|video-creation|all> [--dry-run] [--age-days N]
```

- `--target` (required): which folder's policy to run, or `all`.
- `--dry-run`: print what would be recycled, move nothing. **Always run this first.**
- `--age-days N`: age threshold for the video-creation target (default 30).
- `--only <path-substring>`: restrict the run to paths matching a substring (forward-slash, case-insensitive), e.g. `--only video-creation/remotion/out` to clean just that folder. Great for going folder-by-folder.

**Batch status is synced automatically.** Whenever the run includes the `video-creation` target,
cleanup first invokes `scripts/reconcile-batch-status.js` (in `--dry-run` mode when cleanup is a
dry run) so eligibility is computed from current batch lifecycle status — a batch that finished
publishing but was never reconciled can't stay wrongly protected. You never have to remember to
reconcile before cleaning.

**This means a live cleanup run can CHANGE batch status before it scans**, so the eligible set may
be larger than the dry run you just previewed — dry-run reconcile leaves the statuses alone, so a
batch that the live run flips to `completed` brings its whole folder into scope. Re-preview after
any run that reports flips.

**Freshness guard (rule 5, added 2026-08-12).** The reconciler will not mark a batch `completed`
while any of its own files were written in the last **6 hours** (`BATCH_FRESH_HOURS`). Rules 1-4
derive completion from the publish queues, but a batch mid-build has staged nothing to a queue
yet, so an in-flight project reads identically to a finished one. That is exactly how `johnny`
was lost: its longform posted while its two shorts were still being cut and had never reached
`shorts.json`, so the queue showed 1/1 longs, 0/0 shorts, repurpose done — the batch completed and
cleanup recycled its source master and transcripts while lane 2 was running on them. Once the work
goes quiet for 6 hours the normal rules take over, so nothing is pinned `active` forever.

## Targets & policies

### `schedule-tweets` — reference-counted GC + orphan-by-age
Scans `schedule-tweets/images/` (excluding `images/reference/`). An image referenced by a
queue is recycled only if some post queue references it with `status=posted` AND no non-posted
item also references it. An **orphan** image (referenced by no queue) is recycled once it is
**≥ 14 days old** (`ORPHAN_AGE_DAYS` in `targets/schedule-tweets.js`); a newer orphan is kept,
since it may be freshly generated and not yet queued. Because active batches are always recent,
this age threshold protects their art without any batch-id check. Queues scanned:
`x-tweets`, `x-threads`, `x-polls`, `ig-single-image`, `ig-carousel`, `yt-posts`, `yt-text-polls`.

**Reply-guy image replies (`x-reply-guy/data/reply-images/`) are GC'd here too**, by the same
reference-count but against the reply queues and keyed by **basename** (the reply queues store
`image_path` as an ABSOLUTE path, not repo-relative). An image is **kept** while a **pending**
entry in `replies_to_post.json` links it (reply not sent yet); **recycled** once
`posted_replies.json` archived that reply as `posted_image` or `uncertain_image` (both mean it
went out, and per the reply-guy never-retry rule it won't be re-fired, so the local file is spent)
and no pending entry links it; and an **orphan** (generated but referenced by neither queue) is
kept until `ORPHAN_AGE_DAYS` (14d), then recycled — so a freshly generated, not-yet-posted image
survives a normal review cycle. Only image replies carry an `image_path`; text/emoji/GIF entries
contribute nothing. Runs as part of `--target schedule-tweets`.

**Staged video folders (`longform/<batch>/` and `shorts/<batch>/`) are cleaned WHOLE-FOLDER by
batch status**, not file-by-file. Each immediate subfolder is one batch's staged deliverables;
the folder name is matched to a batch id in `batches.json` (a trailing `-YYYY-MM-DD` is stripped
first, e.g. `best-coin-to-buy-2026-06-17` → `best-coin-to-buy`):
- **completed/archived batch** → the entire `<batch>/` folder is recycled, *including leftover
  cover thumbnails*. This is deliberate: a posted short's `*-thumb.jpg` is a recent orphan that
  the per-file orphan-by-age rule would otherwise keep, stranding the whole folder. An inactive
  batch's folder always goes, frame or no frame.
- **active batch** → the folder is **kept**; only its individually-posted files are cleaned
  (per-platform status in `shorts.json`/`longs.json` — a staged file counts as posted only when
  every platform is terminal), so in-flight work is preserved.
- **folder matching no batch** → falls back to the per-file reference-counted + orphan-by-age
  rule (can't classify the folder, so it's never nuked wholesale). `metadata.json` directly
  under `longform/` or `shorts/` is the live staging manifest and is always kept.

Also recycles **loose top-level artifacts** in `schedule-tweets/` once **≥24h old** (the current
posting session is preserved, and the Chrome bot-profile LevelDB logs deeper in the tree are
never touched):
- **run logs** (`*.log`, e.g. `post-step*` / `workflow-step*`).
- **debug screenshots** (`*.png` / `*.jpg` at the root, e.g. `diag-poll-*`, `debug-after-*`,
  `dashboard_check*`, `replies_tab_*`) — the Playwright posting/diagnostic scripts dump these at
  the repo root; they are throwaway captures, never queue assets (those live under `images/`).

### `video-creation` — hybrid
| Tier | Paths | Rule |
|---|---|---|
| **Never touch** | the WHOLE `assets/` tree, every `*-progress.json` | protected |
| **Always sweep** | any `_bad-*/` reject folder | recycled regardless of age |
| **Registry-driven** | `assets/projects/<batch>/`, `remotion/out/`, `livestream-repurpose/{media,transcripts}`, `shorts/<batch>/`, `longform-{presentation,edited}/media/<project>/`, `vertical-ai-persona/media/<project>/`, `vertical-ai-persona/Yuli y Ana/media/<project>/` | keep only what belongs to an **active** batch (per `batches.json`); recycle the rest. For `assets/projects/<batch>/` the folder name is matched to a batch id — a folder matching no batch is kept. |
| **Age-based** | `livestream-repurpose/{media,transcripts}` entries tied to no batch | recycled if older than `--age-days` |
| **Shorts comps** | `remotion/src/` React files of livestream shorts, plus their `Root.tsx` registration | keep an **active** batch's and anything written in the last 24 h; recycle the rest (`cleanup/remotion_comps.py`, section below) |

**`assets/` is protected in full** (Mike, 2026-07-28). It is the static, reusable shared library —
`sfx/ music/ fonts/ transitions/ vo/ banners/ broll/ STYLE-GUIDE.md TODO.md` — and nothing in it is
spent per-batch output, so it is never age-swept. Per-batch working assets belong in the project's
own folder, not here. (The old age-based sweep of the `assets/` root kept flagging durable files.)
The only exceptions inside `assets/` are `_bad-*/` reject folders and the dormant legacy
`assets/projects/<batch>/` registry tier (that directory no longer exists).

The registry-driven tier reads `../batches.json`:
- **`assets/projects/<batch>/`** — LEGACY per-batch asset home for shorts batches created before 2026-06-25 (new shorts use `shorts/<batch>/render-assets/`, recycled via the `shorts/<batch>/` tier below). The folder name is the batch id: an **active** batch's folder is kept, an **archived** batch's folder is recycled, and a folder matching no batch is kept. Everything else under `assets/` is protected outright.
- **`remotion/out/`** — keep the render `directories` of `status: "active"` batches; recycle every other batch folder and all loose files. (Disposable scratch: posted shorts live in the `schedule-tweets/` queue. The comps follow the same active-batch rule, see "Remotion shorts comps" below.)
- **`livestream-repurpose/`** — `media/` files (flat) and `transcripts/<livestream>/` folders (one per livestream) are matched to a batch by `livestream_title`; active batch → keep, archived → recycle, no match → left alone. (Source recordings are on YouTube; transcripts are regenerable.)
- **`shorts/<batch>/`** — each immediate subfolder is matched to a batch by its `directories`. The **whole project folder** is recycled for a completed/archived batch and kept for an active one. A folder tied to no batch (e.g. `_tooling`, or a not-yet-registered project) is left in place — only its **gitignored** per-clip artifacts (`preview.mp4`, `whisper-words.json`, `captions.ts.draft`) are swept; tracked source (`index.html`, `preview.json`, `gen_captions.py`, `whisper.json`, …) is never touched.
- **`longform-presentation/media/<project>/`, `longform-edited/media/<project>/`, and `vertical-ai-persona/media/<project>/`** — each project subfolder (master `.mkv`, EDIT/FINAL renders, intermediates, deck, transcript, thumbnail) is matched to a batch by `source_media`. The **whole folder** is recycled for a completed/archived batch, kept for an active one, and left alone if it matches no batch. Only `media/<project>/` subfolders are eligible — the track's skill doc and scripts are never touched. (These all share one `classifyMediaProjects` helper in `targets/video-creation.js`.)
- **`vertical-ai-persona/Yuli y Ana/media/<project>/`** — the Yuli y Ana persona is a **separate channel NOT tracked in `batches.json`**, so every folder here matches no batch and is **always left alone**. These concept folders are a reusable library; the cleaner never auto-recycles them. Remove one only on an explicit, per-folder instruction (and consider registering it as a batch if it should be lifecycle-managed).

### Remotion shorts comps (runs with the `video-creation` target)

Every livestream short leaves a FAMILY of React files in the flat `video-creation/remotion/src/`
namespace (the comp `.tsx`, its `constants-<batch>-<clip>.ts`, its `captions<Comp>.ts`; the earliest
batches a shared `data*.ts`) plus an import and a `<Composition>` block in `Root.tsx`. Nothing removed
them, so 461 files / 227 registrations had piled up by 2026-10-03 (Mike: "add that to the cleanup job
so the cleanup job knows that it should check for those"). After the file targets, cleanup spawns
**`cleanup/remotion_comps.py`** (standalone: `python cleanup/remotion_comps.py [--dry-run]`):

- **What it may touch:** only a comp that renders through the shorts kit (`component={LivestreamShort}`,
  or a component that imports `_kit.tsx` / `LivestreamShort.tsx`) and the top-level files only that comp
  uses. Every other registered comp (longform-edited, ai-engineering, the transition demos), whatever
  those import, `Root.tsx`, `index.ts`, the kit itself and `transitions/` + `captions/` are never touched.
- **Kept:** a family owned by an **active** batch (the clip's `composition` / `constants` in
  `shorts/<batch>/progress.json`, or the `Composition:` line of its `BROLL-PLAN.md`; a shorts folder that
  matches no batch counts as active), and any family with a file written in the last **24 hours**
  (`COMP_FRESH_HOURS`), so the session in progress is safe before it is recorded anywhere.
- **Recycled:** every other shorts family, with its imports and `<Composition>` block (and their comments)
  removed from `Root.tsx`. Stale shorts-shaped orphans that `Root.tsx` no longer reaches go too
  (`constants*.ts`, `captions*.ts`, `data*.ts`, `_index-*.tsx` scratch roots, `_gen_*.py`, unregistered kit comps).
- **Safety:** `Root.tsx` is rewritten first and type-checked (`npx tsc --noEmit`, zero errors under `src/`)
  BEFORE any file moves; a failed check restores `Root.tsx` and recycles nothing. A live run is skipped
  while a shorts render holds the stage lock, or if `Root.tsx` changes mid-plan (a builder registering a comp).
- **Not covered: longform-edited comps.** They are removed by hand once Mike has deleted the project's
  `media/<project>/` folder (recycle the family, pull its import + `<Composition>` out of `Root.tsx`).
- Under `--only` the tier runs when the filter names `video-creation/remotion/src` or a folder above it.
- **Undo is the Recycle Bin.** Most recent comps were never committed, so git is NOT a backup for them.

### ChatGPT image chats (runs with the `video-creation` target)

After the file targets, cleanup spawns **`repurpose/delete_chats.py`** (Python since 2026-09-17;
`delete-chats.js` is the frozen rollback; skipped under `--only`, which scopes a run to file
paths). It deletes no-longer-needed ChatGPT image chats from the registry
`chatgpt-image-chats.json`:

- a chat whose **`batch`** property matches a **completed/archived** batch in `batches.json` is
  retired and deleted in the ChatGPT UI;
- anything already on the registry's **`retired`** list (rotation leftovers the gen scripts
  failed to delete in their own end-of-run sweep) is swept too.

Chats with no `batch` (evergreen purposes: `x-tweets`, `yt-posts`, `broll`, …) are never touched
here — they self-delete on cap rotation. A `batch` matching no `batches.json` entry is kept, same
as the file policies. `--dry-run` prints the deletion plan **plus the last reconcile summary**
(counts + up to 20 REVIEW rows, read from the registry) and never opens a browser; a **live run
opens the shared `chatgpt-profile` Chrome briefly**, so don't run live cleanup while an image-gen
batch is in flight (a locked profile fails loudly and the chats stay queued for the next run).
One-off retirement of a batchless chat: `python repurpose/delete_chats.py --retire <purpose>`.

**Reconcile rides with the live run (2026-09-17):** after the sweep, the same browser session runs
`reconcile_chats.run_reconcile(fix=True)` over the WHOLE account and reports DEAD / DRIFTED /
ORPHAN / **REVIEW** (an unregistered chat created inside a journaled automation run window —
see `repurpose/SKILL.md`). Safe repairs are applied (gate-titled orphans queued + swept, dead
slots cleared, provenance-backed titles healed); **REVIEW items are never deleted** — they need
Mike's per-URL approval via `python repurpose/delete_chats.py --approved-file <json>`. This is
how unregistered automation chats surface in cleanup output instead of in the ChatGPT sidebar
(115 had accumulated unseen by 2026-09-17). Cleanup also runs the static
`scripts/chatgpt-open-lint.py`, which WARNs on any script that opens chatgpt.com / the profile
outside the pool (`chat_pool.launch_profile` / `probe_session`) — the cause of the leak.

**TITLE GATE (Mike, 2026-07-22 — canonical spec in `repurpose/SKILL.md`):** no matter how a chat
got queued, `chat_delete.py` refuses to delete any chat whose **live ChatGPT title does not START
with `b-roll` or `social`** (the prefix `chat_pool.confirm_and_register` sets at the chat's first send).
Refusals leave the queue and land on the registry's `title_gate_skipped` list for Mike to handle
manually. Deletes are verified against the backend API (the chat must actually 404) — a bounce or
a 200 without verification is not success.

## Empty-folder pruning (all targets)

After the planned files are recycled, the engine prunes any directory left **empty** (no files
anywhere in its subtree) under each target's managed roots, so a cleaned-out `<batch>/` folder
never lingers as an empty shell. It's computed against the planned recycle set, so `--dry-run`
lists the folders that *would* be left empty and the live run removes them in the same single
move. The managed roots are declared per target (`pruneRoots`): `longform/` and `shorts/` for
schedule-tweets; `shorts/`, `remotion/out/`, `livestream-repurpose/{media,transcripts}`,
and `longform-{presentation,edited}/media/` for video-creation. `assets/` is deliberately NOT a
prune root — the whole tree is protected, so an empty shared-library folder is left alone, and the
root folders themselves are kept — only their empty contents are removed.

## How to run

```
# Preview everything (safe):
node cleanup/cleanup.js --target all --dry-run

# Just the video-creation side, see candidates older than 14 days:
node cleanup/cleanup.js --target video-creation --age-days 14 --dry-run

# Live run for one target (moves to Recycle Bin):
node cleanup/cleanup.js --target schedule-tweets
```

## When to invoke

After a posting/render session, to reclaim disk. Always `--dry-run` first; the
video-creation target can recycle whole rendered batches and source livestreams, so the
preview matters more here than for the image cleaner.

## Note on the old entrypoint

`schedule-tweets/scripts/cleanup-images.js` still works but is now a thin shim that
delegates to `node cleanup/cleanup.js --target schedule-tweets`. The policy lives here.
