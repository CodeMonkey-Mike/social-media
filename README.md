# social-media

A personal automation suite for producing and publishing short-form **crypto / macro / Kaspa**
content. It takes a single livestream and turns it into vertical short videos, tweets, threads,
carousels, and cross-platform posts — then manages the publishing queue and posts to each platform.

## Pipeline at a glance

```
 livestream recording
        │
        ├─►  video-creation/   → vertical short videos (Remotion renders, b-roll, captions)
        │
        └─►  repurpose/        → tweets / threads / IG & YT posts (from the transcript)
                                        │
                                        ▼
                              schedule-tweets/   → publishing queues (JSON) + per-platform post scripts
                                        │
                                        ▼
                    TikTok · X · Instagram · Facebook · Rumble · BitChute · YouTube
```

## Layout

| Path | What it is |
|---|---|
| `video-creation/` | The canonical video pipeline: topic finding (90s chunk-and-group), snap-to-silence cutting, Whisper word-level captions, and Remotion/HTML rendering with b-roll, overlays, and SFX. See `video-creation/SKILL.md`. |
| `repurpose/` | Turns a livestream transcript into ready-to-post tweets, threads, IG/YT posts, and the images that go with them. |
| `schedule-tweets/` | The publishing layer: queue files (`data/*.json` — shorts, tweets, threads, polls, carousels) and per-platform Playwright/API post scripts, plus posting skills. |
| `persona/` | Brand-voice / persona definitions used when drafting content. |
| `x-reply-guy/` | X (Twitter) auto-reply automation. |
| `cleanup/` | Multi-target asset cleaner — moves no-longer-needed assets to the Recycle Bin (reference-counted for posted images; batch-aware for renders). |
| `scripts/` | Cross-cutting tooling, e.g. `publish-shorts.py` (move a finalized render batch into the publishing queue). |
| `batches.json` | Registry of livestream-repurpose batches — source media/transcript, associated directories, and per-pipeline status. Read by the cleaner and the repurpose skill. |

## Stack

- **Node.js** — Playwright (browser automation for posting & image generation), [Remotion](https://www.remotion.dev/) (programmatic video rendering).
- **Python** — transcript processing, Whisper captions, caption/image builders.
- **Windows** — paths and tooling assume a Windows host.

## Conventions

- **Code-only repo.** Generated media (renders, b-roll, source livestreams, most generated images) is gitignored and regenerable from source + scripts. Reference images used as generation inputs are tracked.
- Each multi-clip video batch tracks its progress in `video-creation/shorts/<batch>-progress.json`.

> Personal project — not intended as a general-purpose framework.
