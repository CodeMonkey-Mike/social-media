# best-time — Lane 3 visual QA

Date: 2026-10-27 · Gate: visual-qa (report only, nothing changed)
Spec: `repurpose/output/best-time-lane3-plan.json` → `images[]` prompts; house style `repurpose/SKILL.md`
§"Visual style — X tweets and IG single-image posts" (Pixar 3D CGI, anthropomorphized coins with **expressive
faces** and emotions, dark background, cinematic rim light, 1:1, no text, one clear focal subject).

Method: opened every file at full size; swept all four corners at 2x brightness (420 px crops) for
watermarks, signatures and stray glyphs; checked the reference logo (`images/reference/toncoin-ton.png`) against
the Gram coin; checked dimensions (all 1254x1254 = 1:1) and that no two files are byte-identical (none are).

**Carousel checks (version exemplar, V1 chartreuse drift, counters exactly once): NOT APPLICABLE.** The brief bans
YT posts / carousels / threads and the plan has `yt_posts: 0`, `carousel_versions: {}`. **IG companions: none
expected and none present.** No image's subject is Kaspa, so `ig_single: 0` is correct.

## Results

```json
{
  "assets": [
    {
      "path": "schedule-tweets/images/x/x-tweets-b4aa7129-gram-telegram-billion-users.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Sky-blue coin hero, arms spread, standing on a giant glowing phone lying flat. Sky-blue light beam, a sea of blank glowing speech-bubble characters out to a city-lit horizon, navy starfield. The face logo matches toncoin-ton.png (inverted rounded triangle with the centre bar running to the tip), and it is the only mark in the frame. The bubbles are blank. Corners are clean: no text, signature or watermark. Advisory only: the coin has no eyes or mouth because the prompt makes its face the logo, so the emotion has to come from the pose. The pose carries it."
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-081f88cb-last-window-before-the-robots.png",
      "verdict": "FAIL",
      "defects": [
        "The hero gold coin has NO FACE: no eyes, no mouth, just a blank disc with limbs. The prompt asks for a 'determined' coin and the house style requires expressive faces, so there is no emotion and no 'last one through' urgency. 'Completely plain' in the prompt was meant as no logo, but the model read it as no face.",
        "The core metaphor is not legible. The prompt asks for a TALL ARCHED window with a heavy glowing shutter SLIDING DOWN to close. The render has a squat rectangular opening and a fixed wooden plank panel over it that reads as a lintel, not as a closing shutter. Nothing says 'the window is closing', and that is the tweet's whole point ('one of the last windows').",
        "Minor: the hero is mid-frame and small next to 20+ robots, so it competes with a crowded scene ('one clear focal subject' rule). It still reads at thumbnail size thanks to the warm light."
      ],
      "fix": "Regenerate (same image_id / filename; move the old file aside first, since gen_images SKIPs existing files). Change the coin line to: 'a determined plain gold coin character with big expressive eyes, furrowed brows and gritted teeth, its face has NO symbol, logo or lettering, only the cartoon face'. Make the shutter explicit: 'a heavy glowing iron portcullis shutter is already two-thirds of the way down over a tall arched window, its bottom edge just above the coin's back, sparks where it grinds'. Keep everything else. Robots are clean (no badges or marks, featureless heads) and the corners are clean."
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-d7914aa7-pump-fun-launchpad-higher-lows.png",
      "verdict": "FAIL",
      "defects": [
        "The hero neon-green coin has NO FACE: no eyes, no grin. The prompt explicitly asks for a 'hungry grinning' coin and the house style requires expressive faces. As rendered it is a blank green disc pulling a lever, so the 'hungry, confident, built to lead' mood rests on the rockets alone. Same root cause as 081f88cb: the 'face completely plain' wording removed the face, not just the logo.",
        "Advisory: the cheering crowd coins are also faceless. The prompt allowed that, but it makes the whole frame read as tokens rather than characters."
      ],
      "fix": "Regenerate (same image_id / filename, old file moved aside). Hero line: 'a hungry, wide-grinning plain neon-green coin character with big expressive cartoon eyes and a toothy grin, the coin face has NO symbol, logo or lettering, only the cartoon face'. Optionally give the crowd coins simple happy cartoon faces. The rest is on-spec: the staircase of launch platforms climbs left to right with each pad higher (the higher-lows metaphor reads well), chrome rockets with no flags or lettering, a starfield, no text, and clean corners."
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-b81ecc39-bitcoin-below-the-50-day-final-dip.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Gold coin hero with a strong grinning, determined face, crouched on a canyon ledge and scooping plain silver coins into a wire basket. The broken glowing glass floor is above, with shards falling and plain grey coins panicking and leaping off it. Warm key light on the hero against cold blue from the floor, which matches the spec. All coin faces are plain (no B, no glyph). Corners swept at 2x brightness: clean, no text, signature or watermark. Strongest image of the batch."
    },
    {
      "path": "schedule-tweets/images/x/x-tweets-c38a5846-old-rails-new-rails.png",
      "verdict": "PASS",
      "defects": [],
      "notes": "Left: a rusty steam locomotive hauling vault-door carriages on weed-choked tracks, with grey smoke and pale coins in top hats dozing (closed eyes). Right: a glowing elevated light-rail train with motion streaks and a happy gold coin waving out of the window. Moonlit navy sky, fog and a valley below. The vault doors carry wheel handles only, no lettering. No emblems on the trains, no real people. Corners are clean. Advisory only: the new rail sits on pylons instead of 'hovering', and the new train is a white streamlined train with light streaks rather than 'made of light'. The old-vs-new contrast still reads at once, so this does not need a regen."
    }
  ],
  "summary": { "checked": 5, "passed": 3, "failed": 2 },
  "must_fix": [
    "schedule-tweets/images/x/x-tweets-081f88cb-last-window-before-the-robots.png (faceless hero AND the closing-window metaphor is not legible)",
    "schedule-tweets/images/x/x-tweets-d7914aa7-pump-fun-launchpad-higher-lows.png (faceless hero, the prompted grin is missing)"
  ]
}
```

## Systemic note for the drafter
Both failures have the same cause. The anti-glyph line "the coin's face is completely plain: no symbol, no logo,
no glyph, no lettering or marking of any kind" (SKILL.md, sibling-contamination mitigation) was used with no
positive face description, and the model dropped the face entirely. b81ecc39 and c38a5846 used the same line
and still got faces, so whether a face appears is luck. When a hero coin needs an emotion, pair the line with an
explicit positive face clause ("big expressive cartoon eyes, <expression>, the face has no symbol, only the
cartoon face").
