---
description: Repurpose a livestream across all 3 lanes (longform, shorts, text/image), delegating clip selection to the clip-strategist (Fable).
argument-hint: "<path-to-livestream> [optional run overrides, e.g. skip the polls]"
model: opus
effort: medium
---

Let's repurpose a livestream across all three lanes.

## Run inputs — `$ARGUMENTS`

The input above is the **path to the livestream recording**, optionally followed by
**per-run overrides**.

- **Identify the livestream file path** — a video path (`.mp4`/`.mkv`/`.mov`), possibly
  quoted and possibly containing spaces. This is the source recording for the whole run.
- **Treat anything else in the input as a per-run override** to the task list below —
  e.g. "skip the X and YT polls", "make 6 tweet images not 4", "threads only", "skip Lane 1".
  Honor every override. When no overrides are given, run the full list as written.
- If you cannot find a valid livestream path in the input, STOP and ask for it.

Follow the canonical pipeline map in `playbooks/livestream-repurpose.md`, and observe all
global rules in `CLAUDE.md` and `persona/persona.json` (no em dashes in anything written to a
queue file; edit `data/*.json` with Node, never PowerShell; every image unique).

---

## Lane 1 -> Long-form video

Queue a new longform video in `longs` based on this livestream.
(Canonical: `video-creation/SKILL.md` Phase 1 -> `schedule-tweets/data/longs.json`.)

## Lane 2 -> Vertical shorts (up to clip generation only)

Run Lane 2 (`video-creation/SKILL.md` Phases 1B-3) far enough to have the vertical master
and its transcript, then **delegate the topic/clip SELECTION step to the `clip-strategist`
subagent** (Fable). Hand it the transcript; it returns the clip plan.

- Constraints for the strategist: **best 5 topics, no more than 8 clips total.** It may define a
  long clip AND a small clip of a very impactful section within it. It may stitch scattered
  segments (same topic at multiple points in the stream) into a single short.
- **Persist the returned plan** to `shorts/<batch>/clip-plan.json`, then continue the mechanical
  pipeline **to the point of generating clips** (Phase 4). Do NOT go past clip generation
  (no tighten / caption / render / publish in this run).

## Lane 3 -> Repurpose (text + images)

Using the repurpose skill at `repurpose/` (canonical: `repurpose/SKILL.md`), process the plain
transcript of this livestream (Lane 2's transcript).

**You choose the topics to write about.** ~80% of chosen topics should be crypto projects, with
**Kaspa carrying the most weight, then TAO, Toncoin, HouseCoin, Pengu**, and others if discussed
in the livestream. If nearly none of these were discussed, disregard this weighting rule.

**Fact-check first.** Then, using the chosen topics, produce the following (shuffle topics while
producing, and append to the JSON at every step):

1. **4** different 3-to-4-line X tweets in my brand voice -> add to the x-tweets json -> generate
   images for them.
2. Then **2** single-line X tweets -> add to the x-tweets json -> generate images for them.
3. Then if any of the x-tweets images are about Kaspa, repurpose them to a **4:5** image and queue
   them as an Instagram single-image post.
4. Then **2** polls for the best-suited topics as YT polls; then adjust them into X polls **only if**
   they are Kaspa, TAO, or Toncoin related, otherwise do not save them as X polls.
5. Then **2** long-text YouTube posts of ~2000 characters -> create carousel images for them. Tell me
   the reason for choosing which of the 3 reference carousels for each YT post at the end. Put extra
   weight into using **reference carousel v4**.
6. Then **2** threads based on the YouTube posts just created -> observe all predefined rules
   (5 to 8 tweets per thread).

Observe all rules, writing style, persona, and brand voice throughout. Generate every image you can
where reference images are already provided or none are needed. If a generation could not be done
because a reference image is missing, do NOT block on it, collect it for the final list.

---

## When done

- **Status per lane:** give a status update when each lane is complete and ready for review,
  **in a table** so it is easy to scan.
- **Missing-reference list:** list any generations you could not complete because a reference image
  was needed, so we can follow up with those references and finish them.
- **Summary:** summarize everything done, with any callouts for reference images that may be needed.
