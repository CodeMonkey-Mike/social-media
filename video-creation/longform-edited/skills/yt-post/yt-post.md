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
until Mike posts it: the crypto channel's queue on his YT posting run, `schedule-tweets/skills/yt-post-community.md`;
the AI channel's queue with `post_yt_community.py --channel ai`, see "Which queue"). It never waits for the video run queue (stills and agents only, no
render), like posting. The longform footer prints the command for a delivered video that has no YT post yet.

| Node | Does | Fails when |
|---|---|---|
| `y_preflight` | oEmbed on the link: its title must equal the project title (yt-delivery.json, else publish-meta.json), and its channel must be one in "Which queue"; writes `yt-post/video.json` (link, id, title, channel handle, queue, face, logo) | the link plays ANOTHER video (canton: the first link given was the AI-jobs video), the video is not public, it is on a channel with no queue, no FINAL, no face still |
| `y_plan` | `yt-post-author` agent -> `yt-post/YT-POST.json`; the node stamps link, title, channel, face, logo | an em dash; a number on a slide or in the post that AS-RECORDED.md / DATA.md never carry |
| `y_build` | `build_yt_post.py` -> `yt-post/slides/NN.png` | a spec or layout problem (overflow, near an edge, a headline over 3 lines, text into the footer, a font not loaded) |
| `y_qa` | `visual-qa` on every slide; a FAIL goes back to the author with the defects, rebuild, re-judge (2 revisions) | still FAIL after 2 revisions |
| `y_queue` | slides -> the channel's image folder (`schedule-tweets/images/yt/yt-posts-<id>-NN-<slug>.png`, or `images/ai-yt/ai-yt-posts-...`), the row upserted into the channel's queue with Node | the upsert fails. A row already `posted` is never touched; a `pending` one is replaced in place (same image ids) |

## Which queue: the channel the video is LIVE on (Mike, 2026-11-17)
The queue is picked from the live video's own channel (the oEmbed `author_url` handle read in `y_preflight`), never from
the track: a longform-edited and a longform-presentation video can each be on either channel. `CHANNELS` in
`ytpost_graph.py` is the one table; a video on any other channel fails `y_preflight`.

| Channel | Queue | Images | Dashboard tab | Posted by |
|---|---|---|---|---|
| the crypto channel, `@CodeMonkeyMike` | `schedule-tweets/data/yt-posts.json` | `images/yt/` | YT Posts | Mike's YT posting run (`post_yt_community.py`) |
| AI Engineering Simplified, `@aiEngineeringSimplified` | `schedule-tweets/data/ai-yt-posts.json` | `images/ai-yt/` | **AI YouTube Posts** | `python schedule-tweets/scripts/post_yt_community.py --channel ai` (2026-11-17), from its own `ai-ytbot-profile` signed in as the channel, CDP 9225. Never the JS `post-yt-community.js` or a bare run of the Python one: those post the crypto queue as @CodeMonkeyMike |

The id is `yt-post-<date>-<project>-video` on the crypto queue and `ai-yt-post-<date>-<project>-video` on the AI queue.
The author agent gets the channel too: on the crypto channel nothing about AI or how the video was made; on AI
Engineering Simplified the agents, graphs, evals and code the video explains are its subject (still nothing about how
that video or the carousel was produced), in the channel's authority register.

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
  and face rules: `feedback_thumbnail_photoreal_single_focus`, never matte Mike's face). When the thumbnail was built
  from a picture that carries ANOTHER video's text (clip-evals, 2026-11-17: his picture from the Python video's
  thumbnail, its title words to the left of him), keep the picture FULL WIDTH and clear that text from the plain
  backdrop in code, then pass the result as `--face`: trim any letterbox rows (a YouTube thumbnail has 3 black rows top
  and bottom), mask the title's non-blue and edge pixels left of him, PROTECT him with a grown `u2net_human_seg` person
  mask (protection only: he is never cut out or composited), and refill the masked backdrop with
  `thumb_kit.make_plate`'s fill (Telea at 1/8 scale, a wide blur, grain measured on the clean backdrop), asserting his
  pixels are byte-identical to the source. Worked example while the project exists:
  `longform-presentation/media/standard/clip-evals/thumbnail/yt_post_face.py`. **Never a narrow crop of just him:** the
  square forces it to scale up, and visual-qa failed slides 1 and 10 for it (a 35% oversize face, forehead off the top).
- **Facts:** every number and claim on a slide was SAID in the video and is in DATA.md, and the video's guard notes hold
  (in code: `y_plan` fails an unsourced number). No targets, no ranks, no mid-roll plug.
- Persona: no em dashes; money on a slide is written with the word ("7.5 trillion dollars"), the cashtag lives in the
  post text; never name another creator; nothing about how the video was made.
- **Either channel (2026-11-17; the crypto channel only until then).** The oEmbed check reads the handle and channel
  name from the live video, so the header, the footer and the queue are always the right channel ("Which queue").
  The look stays the video's own: an AI Engineering video without an accent stylesheet gets the canonical one, which
  is the look its cards were built in.
- **A longform-PRESENTATION video takes the same lane, by its folder (Mike, 2026-11-15: the YT post is one of the
  extras he may ask for on that track too):** `run.py ytpost --project "video-creation/longform-presentation/media/standard/<p>"
  --url <link>`. The lane finds `<p> FINAL-vN.mp4`, and the author and the number gate read the project's own files in
  place of AS-RECORDED / DATA / COVER-PLAN: `overlays/CUE-REPORT.md` (every line as heard, and the numbers he said
  differently), `SCRIPT.md`, the final spine's word-time transcript, and `RESEARCH.md` as the only number source
  (a free-talk video has the transcript and `RESEARCH.md`). The title still comes from `yt-delivery.json`. Pass
  `--face` when the project has no `thumbnail/stills/*next-frame*` still. **First end to end run: clip-evals,
  2026-11-17** (scripted, AI Engineering Simplified): 10 slides, every number found in the final spine's transcript,
  queued in `ai-yt-posts.json`. visual-qa's first round failed two image slides (a 16:9 diagram and a stat card read
  as specks at phone size; the author turned them into `rows` slides) and the hook / CTA (a narrow face still; see the
  face rule above), then passed all 10.

## Files (per project, `media/<project>/yt-post/`)
`video.json` (the checked link) · `YT-POST.json` (the spec) · `yt-post.html` (the rendered page) · `slides/NN.png` ·
`YT-POST-QA.json` (the visual-qa verdict, stamped by file size) · `queue-row.json` (the row as queued).
