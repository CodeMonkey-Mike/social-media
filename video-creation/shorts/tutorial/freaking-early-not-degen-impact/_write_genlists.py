"""tutorial / clip 8 (freaking-early-not-degen-impact) — write the three ChatGPT b-roll genlists.

One item per file so `generate-broll-reload.js` is invoked once per image (the batch's rule while
several builders share the `chatgpt` stage lock), all inside ONE held lock.

`file` is joined onto video-creation/assets by the generator, so the `../shorts/...` prefix lands the
PNG in this batch's own public dir. Forward slashes on purpose: a JSON string with Windows separators
turns "\t" / "\r" into control characters.

NAMESPACE: this clip owns `broll-tut-fei-*` and `thumb-tutfei.png` and NOTHING else. It shares the
public dir with 7 siblings and must never write or reference clip 4's `broll-tut-fed-*` /
`thumb-tutfed.png`, clip 1's `broll-tut94x-*`, clip 2's `broll-tut-rhm-*`, clip 3's
`broll-tut-bkc-ov-*`, clip 5's `broll-tut-dgn-*`, clip 6's `broll-tut6-*` / `tail-tut6-hold.png`,
or clip 7's `broll-tut-bki-*`.

REFERENCE-IMAGE GATE, run LIVE against `schedule-tweets/images/reference/` (24 real marks on disk:
DogInMe, ElizaOS-ai16z, LAB, TUT-tutorial, bittensor-tao, bobo, cooper, ethereum-eth, housecoin,
kappy, kaspa-logo, kasy, kroak, linea, michael-saylor, nacho, slippy, tendies, toshi, troll, velvet,
what-if): **this clip names NO project, coin, exchange or person.** The subject is "this particular
token", deliberately unnamed, and the only other reference is "all these tokens". So the gate returns
EMPTY, NO reference image is attached to any prompt, and attaching one would invent an identity the
audio does not claim. Every prompt therefore bans text, digits, logos, coins, crypto symbols and faces.

NO-DUPLICATE RULE (SKILL: "No duplicate b-roll across same-topic shorts"): clip 4 is this clip's
full-cut twin off the same moment, so the two will be seen back to back in a feed. Clip 4's three
overlays are a red pump-and-collapse candle spike, a teal crowd WAVE surging forward, and a SUNRISE
cresting a ridge. None of those concepts or compositions is reused here: this clip's two overlays are
a crowd BELOW looking UP at a floating board of blank panels, and a single SPROUT breaking through
cracked ground; the cover is a lone silhouette on a cliff watching a distant river of lights arrive
(clip 4's cover is two divergent forked routes).

Run from the repo root:
  python video-creation/shorts/tutorial/freaking-early-not-degen-impact/_write_genlists.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
P = "../shorts/tutorial/render-assets/"

NO_MARKS = ("NO text, NO words, NO letters, NO numbers, NO watermark, NO logos or brand marks, "
            "NO coins, NO cryptocurrency symbols, NO real people, NO faces, NO facial features")

ITEMS = {
    # Frame-0 cover ART ONLY — the title and chip are drawn in CODE on top (SKILL: never bake text
    # into a ChatGPT image). "Already standing there before the crowd arrives" = the clip's argument,
    # with no number, no ticker and no claim in the picture.
    "cover": (P + "thumb-tutfei.png",
              "Vertical 9:16 cinematic poster art, deep black to charcoal, volumetric haze and a heavy "
              "vignette. In the LOWER THIRD, on the right, one small plain featureless dark human "
              "silhouette stands alone at the very edge of a high rocky cliff, seen from behind, rimmed "
              "in cool teal cyan light. Below and ahead of it a vast dark valley opens up, and far away "
              "on the low horizon an immense river of countless tiny warm golden lights is flowing "
              "toward the cliff, still very distant, like a slow tide of lanterns crossing the plain. "
              "The silhouette is a plain solid shape with absolutely NO facial features and NO detail. "
              "Lots of empty dark sky across the upper half of the frame. Cinematic rim light, sharp 3D "
              "render, epic scale. Absolutely " + NO_MARKS + ", NO animals, NO buildings, NO vehicles."),
    # Beat 1, 1.05-3.30 s: "you know retail is gonna be looking at all these tokens that I've just
    # listed". Persona rule: crowds are FACELESS silhouettes. Blank PANELS, never coins or tickers, so
    # the image cannot imply any project identity (content guard #2).
    "lookup": (P + "broll-tut-fei-ov-lookup.png",
               "Square image on a PURE SOLID BLACK #000000 background and nothing else, no "
               "checkerboard. Centered subject, fully opaque and brightly glowing: along the BOTTOM, a "
               "dense row of simple featureless human silhouettes seen from behind, heads tilted UP and "
               "some arms raised, glowing teal cyan. ABOVE them, floating in a wide grid, a cluster of "
               "many small blank rectangular glowing panels, each panel completely smooth and EMPTY "
               "with nothing on its surface, tilted at slightly different angles, brighter toward the "
               "top. Thin light beams connect the upturned heads to the panels. Every figure is a plain "
               "solid silhouette with absolutely NO facial features, NO eyes, NO mouths, NO detail. "
               "Strong outer glow feathering into the black. " + NO_MARKS
               + ", NO screens showing content, NO charts, NO graphs, NO signs or banners, NO "
                 "background scenery, nothing but the glowing crowd and blank panels on pure black."),
    # Beat 2, 7.50-9.20 s: "I was so freaking early". EARLY as a pure TIME metaphor (the very first
    # shoot, long before the harvest) carrying NO number and NO position claim, which is exactly what
    # the 700M/1.8M content guard needs on the beats around the hypothetical.
    "sprout": (P + "broll-tut-fei-ov-sprout.png",
               "Square image on a PURE SOLID BLACK #000000 background and nothing else, no "
               "checkerboard. Centered subject, fully opaque and brightly glowing: a single small "
               "seedling, just two young leaves on a slender stem, pushing up through a cracked dark "
               "slab of dry ground, with glowing teal cyan light pouring out of the cracks radiating "
               "away from the stem and warm gold light on the leaf edges. The seedling is small and "
               "alone, nothing else has grown yet. Strong outer glow feathering into the black. "
               + NO_MARKS + ", NO pots, NO hands, NO other plants, NO flowers, NO background scenery, "
                            "nothing but the glowing seedling and cracked ground on pure black."),
}

for key, (f, prompt) in ITEMS.items():
    out = os.path.join(HERE, f"_genlist-tutfei-{key}.json")
    json.dump([{"file": f, "prompt": prompt}], open(out, "w", encoding="utf-8"), indent=1)
    print(f"wrote {os.path.basename(out)}  file={f}  prompt={len(prompt)} chars")
