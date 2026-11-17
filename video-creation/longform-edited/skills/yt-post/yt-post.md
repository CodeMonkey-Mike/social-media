# yt-post: the YouTube promo carousel for a LIVE video (the optional last step)

_Canonical skill (Mike, 2026-11-11, canton: "now that our video is live on youtube, we can make a YT post ... using the
same styles of the canton video ... put my picture in the first slide ... add it to your existing YT post queue")._

Once a longform-edited video is LIVE on YouTube, a community post promotes it: a square image CAROUSEL that retells the
video's argument in its own look and ends on "watch the full video", with the link at the top of the post text. Other
crypto channels run this format; ours is built from the video's own facts, assets and stylesheet.

## Runner
```
python video-creation/longform-edited/graph/run.py ytpost --project <name> --url <the live video's YouTube link>
        [--face <project-relative still of Mike>] [--logo <project-relative logo>] [--redo y_plan|y_build|y_qa]
```
`graph/ytpost_graph.py`, five nodes, NO HITL gate: the queue row is the review point (it is `pending`; nothing posts
until Mike runs YT posting, `schedule-tweets/skills/yt-post-community.md`). It never waits for the video run queue
(stills and agents only, no render), like posting. The longform footer prints the command for a delivered video that
has no YT post yet.

| Node | Does | Fails when |
|---|---|---|
| `y_preflight` | oEmbed on the link: its title must equal the project title (yt-delivery.json, else publish-meta.json); writes `yt-post/video.json` (link, id, title, channel handle, face, logo) | the link plays ANOTHER video (canton: the first link given was the AI-jobs video), the video is not public, no FINAL, no face still |
| `y_plan` | `yt-post-author` agent -> `yt-post/YT-POST.json`; the node stamps link, title, channel, face, logo | an em dash; a number on a slide or in the post that AS-RECORDED.md / DATA.md never carry |
| `y_build` | `build_yt_post.py` -> `yt-post/slides/NN.png` | a spec or layout problem (overflow, near an edge, a headline over 3 lines, text into the footer, a font not loaded) |
| `y_qa` | `visual-qa` on every slide; a FAIL goes back to the author with the defects, rebuild, re-judge (2 revisions) | still FAIL after 2 revisions |
| `y_queue` | slides -> `schedule-tweets/images/yt/yt-posts-<id>-NN-<slug>.png`, the row upserted into `schedule-tweets/data/yt-posts.json` with Node | the upsert fails. A row already `posted` is never touched; a `pending` one is replaced in place (same image ids) |

## The format (1080x1080, 6 to 10 slides)
- **Slide 1, `hook`:** Mike's picture (big, right of centre, the room darkened by a face-centred vignette), the logo
  and `label` top-left, the headline (Playfair 900, the highlight in the accent colour) under his chin, the channel
  link + "Swipe" + the progress bar.
- **Middle slides:** a header on every one (logo, `LABEL`, `n/N` in mono, "Mike / <channel name>" with a round avatar of
  the same still), the headline under it, then ONE body by kind:
  `text` (a short paragraph) · `stat` (one big mono number, its unit line, an optional note) · `rows` (2 to 4
  label/value rows in a card, one may be `highlight`ed with the accent outline) · `image` (one of the video's own PNGs,
  a chart / diagram / card, with a caption). Footer: the channel link, the progress bar, "Swipe ->".
- **Last slide, `cta`:** Mike's picture centred, a red play badge, the logo, "Watch the full video", the video title,
  a lime "Link in the post" pill, the channel link.
- Markup: `[words]` = the highlight colour, `{number}` = the mono number face.
- **The post text** (built by the node, never by hand): `▶ Watch the full video: <link>`, the headline, two `→` points,
  the hashtags, blank lines between.

## Rules
- **The look is the VIDEO's**, never an image model: `container-canonical.css` + the project's accent stylesheet
  (`GRAPH-PROGRESS settings.container_accent`, light theme when `container_theme` is light). This is NOT the AI carousel
  of the repurpose lane, so the Version 1/2/4 reference-exemplar rule (`repurpose/SKILL.md`) does not apply: the
  reference here is the video's own locked stylesheet, and every word is pixel-exact.
- **Mike's picture is a REAL frame** (default: the still the video's thumbnail was built from, `thumbnail/stills/*next-frame*`,
  which Mike already approved), finished in code only (the thumbnail's "natural" level: blended CLAHE, a little warmth,
  two unsharp passes; no denoise) and cropped as a rectangle or a circle. Never matted, never generated (the thumbnail
  and face rules: `feedback_thumbnail_photoreal_single_focus`, never matte Mike's face).
- **Facts:** every number and claim on a slide was SAID in the video and is in DATA.md, and the video's guard notes hold
  (in code: `y_plan` fails an unsourced number). No targets, no ranks, no mid-roll plug.
- Persona: no em dashes; money on a slide is written with the word ("7.5 trillion dollars"), the cashtag lives in the
  post text; never name another creator; nothing about how the video was made.
- **Crypto channel only for now.** An AI Engineering Simplified video would need its own channel handle and look; the
  oEmbed check reads the handle from the live video, so the footer is always the right channel.
- **A longform-PRESENTATION video takes the same lane, by its folder (Mike, 2026-11-15: the YT post is one of the
  extras he may ask for on that track too):** `run.py ytpost --project "video-creation/longform-presentation/media/standard/<p>"
  --url <link>`. The lane finds `<p> FINAL-vN.mp4`, and the author and the number gate read the project's own files in
  place of AS-RECORDED / DATA / COVER-PLAN: `overlays/CUE-REPORT.md` (every line as heard, and the numbers he said
  differently), `SCRIPT.md`, the final spine's word-time transcript, and `RESEARCH.md` as the only number source
  (a free-talk video has the transcript and `RESEARCH.md`). The title still comes from `yt-delivery.json`. Pass
  `--face` when the project has no `thumbnail/stills/*next-frame*` still. Checked at function level on JCT; not yet
  run end to end on a presentation video.

## Files (per project, `media/<project>/yt-post/`)
`video.json` (the checked link) · `YT-POST.json` (the spec) · `yt-post.html` (the rendered page) · `slides/NN.png` ·
`YT-POST-QA.json` (the visual-qa verdict, stamped by file size) · `queue-row.json` (the row as queued).
