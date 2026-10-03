# golden-kitty VERTICAL: substitutions the comp lookup MUST honour

_Read by the comp-builder (vertical mode). The 16:9 comp `remotion/src/GoldenKitty.tsx` is the spec for everything
not listed here: same beat times, same covers, same transitions, same captions, same card pauses._

## 1. ALL NINE FACE windows air the VERTICAL background-swap clips, never the spine crop
Mike ruled on 2026-10-02 that every face scene of this video sits in the gold vault (Higgsfield video-to-video,
never a matte). The 16:9 comp plays `face-swap/F<n>-higgsfield-bg-swap.mp4`; the vertical plays its OWN portrait
versions, generated natively at 9:16 from a 608x1080 crop of the same footage:

| window (spine s) | vertical clip (in this public dir) | starts at clip frame |
|---|---|---|
| F1 0.000-9.667 | `face-swap/F1-higgsfield-bg-swap.mp4` | see its sidecar |
| F2 40.233-44.033 | `face-swap/F2-higgsfield-bg-swap.mp4` | see its sidecar |
| F3 89.600-91.833 | `face-swap/F3-higgsfield-bg-swap.mp4` | see its sidecar |
| F4 122.100-131.233 | `face-swap/F4-higgsfield-bg-swap.mp4` | see its sidecar |
| F5 167.433-169.533 | `face-swap/F5-higgsfield-bg-swap.mp4` | see its sidecar |
| F6 213.933-216.500 | `face-swap/F6-higgsfield-bg-swap.mp4` | see its sidecar |
| F7 342.567-348.000 | `face-swap/F7-higgsfield-bg-swap.mp4` | see its sidecar |
| F8 407.533-410.833 | `face-swap/F8-higgsfield-bg-swap.mp4` | see its sidecar |
| F9 453.100-457.467 | `face-swap/F9-higgsfield-bg-swap.mp4` | see its sidecar |

- Each clip has a sidecar `face-swap/F<n>-higgsfield-bg-swap.json`: `window_starts_at_clip_frame` is the `startFrom`
  (the head handle is thrown away). Read the number from the sidecar, do not assume 12.
- The clips are PRE-FRAMED portrait (already centred on his face for that window): play them FULL-FRAME (cover the
  1080x1920 frame), muted, with NO objectPosition offset and NO face crop. The spine under them keeps the VO audio.
- The measured face crop (`face-crop.json`) still goes on the spine layer underneath, but no face window shows it.
- Punch-ins on a swapped window are the subtle 6% (as in the 16:9 comp's PUNCH table); F9 keeps its crash zoom.
- If a clip is missing from `face-swap/` when you build, STOP and report it: do not fall back to the spine crop.

## 2. Three images play as slow MOTION CLIPS, not stills
As in the 16:9 comp (image slots G5, G10, G11), the vertical plays portrait motion clips:
`img-motion/IMG-5-kitty-leads-coin-crowd-motion.mp4`, `img-motion/IMG-10-kitty-token-on-gold-bars-motion.mp4`,
`img-motion/IMG-11-vlad-trophy-overhead-confetti-motion.mp4` (portrait, 24 fps, about 4 s, muted, from clip 0, cut at
the slot end, no extra push on top). The portrait still in `img/` is the fallback and the frame a transition still pulls.

## 3. Carried over from the 16:9 comp, do not drop
- The "AI ILLUSTRATION" tag on the four Vlad images (G9, G11, G12, G13), for the whole slot.
- The C6 receipt highlight is a lime MARKER-PEN fill (multiply) on "the coveted Golden Kitty Award from Product Hunt.",
  wiping in on "the coveted" (96.5 s). Re-measure the phrase position on the MOBILE capture; a lime outline does not
  read on a white page.
- On-screen figures are the recording-day ones with their date (the `cap-holders` card, the cap-vs-volume chart);
  never a live cap, never "15x", never 150 million or 240 million as text.
- No music and no SFX in the comp: the graph's mix node lays the same mix (MUSIC-PLAN.json, with the CH5 bed change
  at 287.3).
