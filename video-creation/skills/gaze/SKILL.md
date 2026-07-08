# gaze — camera-look detection for talking-head PiP video

Find the spans where the presenter looks **into the camera** (engaging the viewer) vs **reads the
screen** — so you can drive face cutaways (e.g. the longform-presentation slide-8 cutaways, vertical
persona, any webcam-PiP video). Output = a list of **camera-look spans** (and the inverse).

> This is its own skill on purpose: it's reusable beyond longform, and burying it made it easy to
> skip the refine step. **Run it as a checklist, in order. The refine is MANDATORY.** (Lesson logged
> 2026-06-08 after I guessed gaze off the coarse pass and got it wrong repeatedly.)

---

## STEP 0 — Identify the recording style FIRST (it changes everything)

| Style | What it looks like | Implication |
|---|---|---|
| **A. Deck-reading-dominant** (e.g. QE) | Presenter turns to a side-screen to read; looks at the lens only in brief glances. | Camera-looks are **short (≈0.5–0.8s) and infrequent**. Coarse→refine finds the few glances. Containers dominate, face is a rare accent. |
| **B. Frontal-dominant** (e.g. Zcash slide 8) | Presenter reads a script positioned **right at the webcam**, so they're frontal almost the whole time, eyes only slightly down. | The PiP is usually **too low-res to reliably tell "reading-at-script" from "looking-at-lens."** Do NOT guess — get ground truth from the person (Step 3). |

If you can't tell which style from a few frames, assume B and go to Step 3.

## STEP 1 — Coarse pass (find candidates)

Find the PiP crop box first (tight to the face; full frames make the PiP too small to read eyes).
Example boxes: QE `crop=560:580:1360:360`; Zcash slide-8 `crop=470:660:1450:420` (both bottom-right of 1920×1080).

```
for t in $(seq 2 3 <end>); do
  ffmpeg -y -ss $t -i "<clip>" -frames:v 1 -vf "crop=<box>,scale=360:-1" "_g/c_$(printf %02d $t).jpg"
done
```
Read every frame. Flag the ones that look frontal / eyes-at-lens as **candidate timestamps**.

## STEP 2 — Refine each candidate (MANDATORY — never skip)

For **each** candidate, extract a **3-second region centered on it at 6fps** and read it to measure
where the glance actually starts and ends:

```
ffmpeg -y -ss <t-1.5> -t 3 -i "<clip>" -vf "crop=<box>,fps=6" "_r/<t>_%02d.jpg"
```

- If the glance runs to/past a region edge, **extend** the window until you capture its real span.
- **Scan the WHOLE region**, not just the first glance — eyes can leave the lens and **return** (a
  second glance / one long two-part look). Report both.
- Coarse has false positives (a single frontal-looking frame that's mid-turn) and misses short
  glances between samples — refine the borderline candidates too.

**Placing cutaways straight off the coarse pass is the documented failure mode. Don't.**

## STEP 3 — When you can't read it reliably, get GROUND TRUTH from the person

Style B / glasses-glare / low-res PiP often make the reading-vs-lens call genuinely unreliable. The
person who recorded it knows exactly when they looked at the lens. Burn a running timecode onto the
**exact clip that will be in the video** (so their marks line up — same desilence/edits), and ask
them for the spans:

```
ffmpeg -y -i "<final clip>" -vf "drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='%{pts\:hms}':x=24:y=24:fontsize=60:fontcolor=yellow:box=1:boxcolor=black@0.65:boxborderw=10" -c:a copy "<clip>-GAZEMARK.mp4"
```
Then: *"Give me the spans where you look into the camera, e.g. 0:00–0:12, 0:32–0:34, 1:15–end."*
This is not a failure — it's the accurate path. Don't burn 5 render cycles guessing.

## The tell (reading geometry)

The webcam and the screen are both roughly in front, so the difference is subtle: **eyes centered at
the lens** (camera) vs **eyes angled down / to the side** (reading the deck or a script). Glasses
glare and a small PiP make this hard; if in doubt, ground-truth (Step 3).

## Output / hand-off to the renderer

Deliver: the **camera-look spans** (the inverse = container/reading spans). The consumer (e.g. the
longform Remotion comp) then:
- Plays the face source **from the glance timestamp** so it stays in sync with the audio — Remotion
  `OffthreadVideo startFrom={Math.round(t*fps)}`. (Bug 2026-06-08: without it the cutaway played from
  frame 0 every time → face out of sync with the voice.)
- Makes the blurred "wings" (echo-pillarbox) actually visible — don't over-darken. `blur(~48px)
  brightness(~0.9) saturate(~1.4)`; `brightness(0.4)` rendered near-black on a dark room.

## Hard rules
- **The refine (Step 2) is mandatory.** Never place cutaways from the coarse pass alone.
- **Gaze first on the FINAL clip timeline** (post-desilence / post-edit), so spans map to the comp.
- **If you can't read it reliably, get the spans from the person** (Step 3) — don't guess repeatedly.
